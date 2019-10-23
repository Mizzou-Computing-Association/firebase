const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const bucket = admin.storage().bucket();

const Busboy = require('busboy');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')();
const bodyParser = require('body-parser');

const pug = require('pug');

const app = express();

app.use(cors({ origin: true }));
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
		return next();
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
			return next();
		});
	}
}

const QRCode = require('qrcode');
const qrOptions = {
	margin: 0,
	scale: 10,
	color: {
		dark: '#F89939FF',
		light: '#FFFFFF00'
	}
};

app.get('/', authenticate, (req, res) => {
	let pugFile = req.query.dev ? './views/index-dev.pug' : './views/index.pug';
	db.collection('prizes').orderBy('order').get().then((prizesSnapshot) => {
		var data = {
			title: 'TigerHacks'
		};
		var rawPrizes = prizesSnapshot.docs.map((prizeDoc) => {
			return prizeDoc.data();
		});
		data.prizes = rawPrizes.reduce((result, item) => {
			const key = item.prizeType;
			if (!result[key]) result[key] = [];
			result[key].push(item);
			return result;
		}, {});
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
					let faq = data.info.tigerhacks.faq.reduce((result, item) => {
						const key = item.category;
						if (!result[key]) result[key] = [];
						result[key].push(item);
						return result;
					}, {});
					data.info.tigerhacks.faq = faq;
					if (req.user) {
						QRCode.toDataURL(`https://tigerhacks.com/profile/${req.user.user_id}`, qrOptions, (err, qrData) => {
							db.collection('participants').doc(req.user.user_id).get().then((userDoc) => {
								data.user = {
									id: qrData,
									info: userDoc.exists ? userDoc.data() : req.user,
									admin: data.info.admins.users.includes(req.user.user_id),
									registered: userDoc.exists
								};
								res.send(pug.renderFile(pugFile, data));
							});
						});
					} else {
						res.send(pug.renderFile(pugFile, data));
					}
				});
			});
		});
	});
});

app.get('/admin', authenticate, (req, res) => {
	if (!req.user) {
		res.redirect('/');
		return;
	}
	db.collection('info').doc('admins').get().then((adminDoc) => {
		if (adminDoc.get('users').includes(req.user.user_id)) {
			db.collection('prizes').orderBy('order').get().then((prizesSnapshot) => {
				var data = {
					title: 'TigerHacks'
				};
				var rawPrizes = prizesSnapshot.docs.map((prizeDoc) => {
					var prizeData = prizeDoc.data();
					prizeData.id = prizeDoc.id;
					return prizeData;
				});
				data.prizes = rawPrizes.reduce((result, item) => {
					const key = item.prizeType;
					if (!result[key]) result[key] = [];
					result[key].push(item);
					return result;
				}, {});
				db.collection('schedule').orderBy('time').get().then((scheduleSnapshot) => {
					var rawSchedule = scheduleSnapshot.docs.map((scheduleDoc) => {
						var eventData = scheduleDoc.data();
						eventData.id = scheduleDoc.id;
						return eventData;
					});
					data.schedule = rawSchedule.reduce((result, item) => {
						const key = item.time.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/Chicago'});
						if (!result[key]) result[key] = [];
						result[key].push(item);
						return result;
					}, {});
					db.collection('sponsors').orderBy('level').get().then((sponsorSnapshot) => {
						var rawSponsors = sponsorSnapshot.docs.map((sponsorDoc) => {
							var sponsorData = sponsorDoc.data();
							sponsorData.id = sponsorDoc.id;
							return sponsorData;
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
							let faq = data.info.tigerhacks.faq.reduce((result, item) => {
								const key = item.category;
								if (!result[key]) result[key] = [];
								result[key].push(item);
								return result;
							}, {});
							data.info.tigerhacks.faq = faq;
							db.collection('participants').get().then((participantsSnapshot) => {
								data.participants = participantsSnapshot.docs.map((participantDoc) => {
									return participantDoc.data();
								});
								res.send(pug.renderFile('./views/admin.pug', data));
							});
						});
					});
				});
			});
		} else {
			res.redirect('/');
		}
	});
});

app.get('/profile/:user', (req, res) => {
	db.collection('participants').doc(req.params.user).get().then((userDoc) => {
		res.send(pug.renderFile('./views/profile.pug', { title: `${userDoc.get('name')} | TigerHacks Profile`, user: userDoc.data() }))
	});
});

app.post('/register', authenticate, (req, res) => {
	if (!req.user) {
		return res.redirect('/');
	}
	const busboy = new Busboy({ headers: req.headers });

	const fields = {
		dietary_restrictions: []
	};
	var resume = null;

	busboy.on('field', (name, value) => {
		console.log(`Processed field ${name}: ${value}`);
		if (name == 'dietary_restrictions') {
			fields.dietary_restrictions.push(value);
		} else {
			fields[name] = value;
		}
	});

	var promise = null;
	var fileName = ''

	busboy.on('file', (field, file, filename) => {
		if (!filename || filename == '') {
			console.log('No resume submitted, skipping that step');
			return file.resume();
		}
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
		if (promise != null) {
			promise.then(() => {
				fields.resume = `https://storage.cloud.google.com/tigerhacks.appspot.com/${fileName}`;
				fields.mlh_terms = fields.mlh_terms ? fields.mlh_terms == 'on' : true;
				fields.th_terms = fields.th_terms ? fields.th_terms == 'on' : true;
				fields.reimbursement = fields.reimbursement == 'on';
				fields.checkins = [];
				db.collection('participants').doc(req.user.user_id).set(fields, {merge: true});
				res.redirect('/');
			});
		} else {
			fields.mlh_terms = fields.mlh_terms ? fields.mlh_terms == 'on' : true;
			fields.th_terms = fields.th_terms ? fields.th_terms == 'on' : true;
			fields.reimbursement = fields.reimbursement == 'on';
			fields.checkins = [];
			db.collection('participants').doc(req.user.user_id).set(fields, {merge: true});
			res.redirect('/');
		}
	});

	busboy.end(req.rawBody);
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

app.post('/signout', (req, res) => {
	res.cookie('__session', null, { maxAge: -1, httpOnly: true, secure: true });
	res.end(JSON.stringify({ status: 'success' }));
});

app.get('/api/sponsors', (req, res) => {
	db.collection('sponsors').get().then((snapshot) => {
		var rawSponsors = snapshot.docs.map((sponsorDoc) => {
			return sponsorDoc.data();
		});
		var sponsors = rawSponsors.reduce((result, item) => {
			const key = levels[item.level];
			if (!result[key]) result[key] = [];
			result[key].push(item);
			return result;
		}, {});
		res.json(sponsors);
	});
});

app.get('/api/prizes', (req, res) => {
	db.collection('prizes').orderBy('order').get().then((snapshot) => {
		var rawPrizes = snapshot.docs.map((prizeDoc) => {
			var prizeData = prizeDoc.data();
			prizeData.id = prizeDoc.id;
			return prizeData;
		});
		var prizes = rawPrizes.reduce((result, item) => {
			const key = item.prizeType;
			if (!result[key]) result[key] = [];
			result[key].push(item);
			return result;
		}, {});
		res.json(prizes);
	});
});

app.get('/api/schedule', (req, res) => {
	db.collection('schedule').orderBy('time').get().then((snapshot) => {
		var rawSchedule = snapshot.docs.map((scheduleDoc) => {
			var scheduleData = scheduleDoc.data();
			scheduleData.id = scheduleDoc.id;
			return scheduleData;
		});
		var schedule = rawSchedule.reduce((result, item) => {
			const key = item.time.toDate().toISOString();
			if (!result[key]) result[key] = [];
			item.time = item.time.toDate().toISOString();
			item.canCheckIn = item.canCheckIn ? 'true' : 'false';
			result[key].push(item);
			return result;
		}, {});
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
		userData.alreadyin = userData.checkins.includes(req.query.event);
		userDoc.ref.set({
			checkins: admin.firestore.FieldValue.arrayUnion(req.query.event)
		}, { merge: true });
		res.json(userData);
	});
});

app.get('/api/profile', (req, res) => {
	db.collection('participants').doc(req.query.userid).get().then((userDoc) => {
		QRCode.toDataURL(`https://tigerhacks.com/profile/${req.query.userid}`, qrOptions, (err, qrData) => {
			db.collection('info').doc('admins').get().then((adminDoc) => {
				res.json({
					registered: userDoc.exists,
					pass: qrData,
					admin: adminDoc.get('users').includes(req.query.userid)
				});
			});
		});
	});
});

exports.api = functions.https.onRequest(app);