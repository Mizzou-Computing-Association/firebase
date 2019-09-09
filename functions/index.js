const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const bucket = admin.storage().bucket();

const Busboy = require('busboy');

const express = require('express');
const cookieParser = require('cookie-parser')();
const bodyParser = require('body-parser');

const pug = require('pug');

const app = express();

app.use(cookieParser);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const levels = ['Platinum', 'Gold', 'Silver', 'Bronze'];

function authenticate(req, res, next) {
	if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) && !(req.cookies && req.cookies.__session)) {
		console.log('No Firebse ID token was passed as a Bearer token in the Authorization header.',
			'Make sure you authorize your request by providing the following HTTP header:',
			'Authorization: Bearer <Firebase ID Token>',
			'or by passing a "__session" cookie.');
		res.send(pug.renderFile('./views/signin.pug'));
	} else {
		let idToken;
		if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
			console.log('Found "Authorization" header');
			idToken = req.headers.authorization.split('Bearer ')[1];
		} else if (req.cookies) {
			console.log('Found "__session" cookie');
			idToken = req.cookies.__session;
		}
		admin.auth().verifyIdToken(idToken).then(decodedToken => {
			console.log('ID Token correctly decoded', decodedToken);
			req.user = decodedToken;
			return next();
		}).catch(error => {
			console.error('Error while verifying Firebase ID token:', error);
			res.send(pug.renderFile('./views/signin.pug'));
		});
	}
}

app.get('/', (req, res) => {
	db.collection('prizes').orderBy('order').get().then((prizesSnapshot) => {
		var data = {
			title: 'TigerHacks'
		};
		data.prizes = prizesSnapshot.docs.map((prizeDoc) => {
			return prizeDoc.data();
		});
		db.collection('schedule').orderBy('time').get().then((scheduleSnapshot) => {
			var rawSchedule = scheduleSnapshot.docs.map((scheduleDoc) => {
				return scheduleDoc.data();
			});
			data.schedule = rawSchedule.reduce((result, item) => {
				const key = item.time.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/Chicago'});
				if (!result[key]) result[key] = [];
				result[key].push(item);
				return result;
			}, {});
			db.collection('sponsors').orderBy('level').get().then((sponsorSnapshot) => {
				var rawSponsors = sponsorSnapshot.docs.map((sponsorDoc) => {
					return sponsorDoc.data();
				});
				data.sponsors = rawSponsors.reduce((result, item) => {
					const key = levels[item.level];
					if (!result[key]) result[key] = [];
					result[key].push(item);
					return result;
				}, {});
				db.collection('info').get().then((infoSnapshot) => {
					data.info = {};
					infoSnapshot.docs.forEach((infoDoc) => {
						data.info[infoDoc.id] = infoDoc.data();
					});
					res.send(pug.renderFile('./views/index.pug', data));
				});
			});
		});
	});
});

const QRCode = require('qrcode');
const qrOptions = {
	margin: 0,
	scale: 10,
	color: {
		dark: '#F89939FF',
		light: '#FFFFFF00'
	}
};

app.get('/profile', authenticate, (req, res) => {
	db.collection('participants').doc(req.user.user_id).get().then((userDoc) => {
		if (!userDoc.exists) {
			return res.redirect('/register');
		}
		QRCode.toDataURL(`https://tigerhacks.com/profile/${req.user.user_id}`, qrOptions , (err, qrData) => {
			const userInfo = {
				id: qrData,
				name: userDoc.get('name')
			};
			res.send(pug.renderFile('./views/profile.pug', { title: `${userInfo.name} | TigerHacks Profile`, user: userInfo }));
		});
	});
});

app.get('/profile/:user', (req, res) => {
	db.collection('participants').doc(req.params.user).get().then((userDoc) => {
		res.send(pug.renderFile('./views/profile.pug', { title: `${userDoc.get('name')} | TigerHacks Profile`, user: userDoc.data() }))
	});
});

app.get('/register', authenticate, (req, res) => {
	db.collection('participants').doc(req.user.user_id).get().then((userDoc) => {
		if (userDoc.exists) {
			return res.redirect('/profile');
		}
		res.send(pug.renderFile('./views/register.pug', { title: 'Register for TigerHacks', user: req.user }));
	});
});

app.post('/register', authenticate, (req, res) => {
	const busboy = new Busboy({ headers: req.headers });

	const fields = {};
	var resume = null;

	busboy.on('field', (name, value) => {
		console.log(`Processed field ${name}: ${value}`);
		fields[name] = value;
	});

	var promise = null;
	var fileName = ''

	busboy.on('file', (field, file, filename) => {
		console.log(`Processing file ${filename}`);
		if (field != 'resume') {
			return file.resume();
		}

		fileName = `resumes/${req.user.user_id}_${filename}`;
		resume = bucket.file(fileName);
		const writeStream = resume.createWriteStream({
			contentType: 'application/pdf'
		});
		file.pipe(writeStream);

		promise = new Promise((resolve, reject) => {
			file.on('end', () => {
				writeStream.end();
			});
			writeStream.on('finish', resolve);
			writeStream.on('error', reject);
		});
	});

	busboy.on('finish', () => {
		promise.then(() => {
			fields.resume = `https://storage.cloud.google.com/tigerhacks.appspot.com/${fileName}`;
			fields.mlh_terms = fields.mlh_terms == 'on';
			fields.th_terms = fields.th_terms == 'on';
			fields.reimbursement = fields.reimbursement == 'on';
			db.collection('participants').doc(req.user.user_id).set(fields);
			res.redirect('/profile');
		});
	});

	busboy.end(req.rawBody);
});

app.get('/signin', authenticate, (req, res) => {
	if (req.user) {
		db.collection('participants').doc(req.user.user_id).get().then((userDoc) => {
			if (userDoc.exists) {
				return res.redirect('/profile');
			} else {
				return res.redirect('/register');
			}
		}).catch((error) => {
			return res.redirect('/register');
		});
	} else {
		res.send(pug.renderFile('./views/signin.pug'));
	}
});

app.post('/setSession', (req, res) => {
	const idToken = req.body.idToken;
	const maxAge = 10 * 365 * 24 * 60 * 60 * 1000;
	admin.auth().verifyIdToken(idToken).then((decodedToken) => {
		res.cookie('__session', idToken, { maxAge: maxAge, httpOnly: true, secure: true });
		res.end(JSON.stringify({ status: 'success' }));
	}).catch((error) => {
		console.log(error);
		res.status(401).send('UNAUTHORIZED REQUEST!');
	});
});

app.get('/api/sponsors', (req, res) => {
	db.collection('sponsors').get().then((snapshot) => {
		var sponsors = [];
		snapshot.docs.forEach((sponsorDoc) => {
			let sponsorInfo = sponsorDoc.data();
			sponsorInfo.level = levels[sponsorInfo.level];
			sponsorInfo.mentors = [];
			db.collection('mentors').where('company', '==', sponsorInfo.name).get().then((mentorSnapshot) => {
				mentorSnapshot.docs.forEach((mentorDoc) => {
					sponsorInfo.mentors.push(mentorDoc.data());
				});
				sponsors.push(sponsorInfo);
				if (sponsors.length == snapshot.docs.length) {
					res.json({ sponsors: sponsors });
				}
			});
		});
	});
});

app.get('/api/prizes', (req, res) => {
	db.collection('prizes').orderBy('order').get().then((snapshot) => {
		var prizes = [];
		snapshot.docs.forEach((prizeDoc) => {
			prizes.push({
				sponsor: prizeDoc.get('sponsor'),
				title: prizeDoc.get('title'),
				reward: prizeDoc.get('reward'),
				description: prizeDoc.get('description'),
				prizetype: prizeDoc.get('prizetype')
			});
		});
		res.json({ prizes: prizes });
	});
});

app.get('/api/schedule', (req, res) => {
	db.collection('schedule').orderBy('time').get().then((snapshot) => {
		var schedule = [];
		snapshot.docs.forEach((scheduleDoc) => {
			if (req.query.requiresCheckin && !scheduleDoc.get('canCheckIn')) {
				return;
			}
			schedule.push({
				time: scheduleDoc.get('time').toMillis(),
				location: scheduleDoc.get('location'),
				floor: scheduleDoc.get('floor'),
				title: scheduleDoc.get('title'),
				description: scheduleDoc.get('description'),
				imageLocation: scheduleDoc.get('imageLocation')
			});
		});
		res.json(schedule);
	});
});

app.get('/api/checkin', (req, res) => {
	db.collection('participants').doc(req.query.userid).get().then((userDoc) => {
		if (!userDoc.exists) {
			return res.status(404).json({
				error: 'User does not exist, please register!'
			});
		}
		let userData = userDoc.data();
		userData.alreadyin = userData.checkins.contains(req.query.event);
		userDoc.ref.set({
			checkins: admin.firestore.FieldValue.arrayUnion(req.query.event)
		}, { merge: true });
		res.json(userData);
	});
});

exports.api = functions.https.onRequest(app);