<template>
  <div class="about-tab">
    <!-- <h1>About    <span>Tiger</span>Hacks</h1> -->
    <heading text="About TigerHacks"></heading>
    <v-card class="about-section" width="90vw" max-width="680px">
      <h2>What is TigerHacks?</h2>
      <v-divider></v-divider>
      <v-card-text>TigerHacks is a 36 hour hackathon hosted by the University of Missouri - Columbia. Over 300 students from around the country will come together to work on software (or hardware) projects throughout the weekend.</v-card-text>
    </v-card>
    <v-card class="about-section" width="90vw" max-width="680px">
      <h2>What is a hackathon?</h2>
      <v-divider></v-divider>
      <v-card-text>A hackathon does not involve breaking anything as the name would suggest. During a hackathon teams of developers will meet to build projects to gain experience in a fun and exciting way! Projects are based on a theme which varies from hackathon to hackathon.</v-card-text>
    </v-card>
    <v-card class="about-section" width="90vw" max-width="680px">
      <h2>When and where is TigerHacks?</h2>
      <v-divider></v-divider>
      <v-card-text>TigerHacks will start November 8th at 5:00 PM, and end November 10th at 2:00 PM. TigerHacks will take place on the University of Missouri's campus in Lafferre Hall. 416 S 6th St, Columbia, MO 65201</v-card-text>
    </v-card>
    <v-card class="about-section" width="90vw" max-width="680px">
      <h2>What is the theme for TigerHacks?</h2>
      <v-divider></v-divider>
      <v-card-text>TigerHacks 2019 is themed around The Arts. Whether it's an app to help writers, or hardware for some instrument, hackers will have a chance to flex their creativity at this year's hackathon. We've tried to keep the theme general so we can expect a wide variety of interesting projects!</v-card-text>
    </v-card>
    <v-card class="about-section" width="90vw" max-width="680px">
      <h2>Is TigerHacks competetive?</h2>
      <v-divider></v-divider>
      <v-card-text>Although there will be a panel of judges looking at the projects at the end of the weekend, TigerHacks will be an inviting space for any budding developers seeking a fun experience! There will be events that aren't based around software, food served to developers, and experts to help developers with their projects (see schedule for details). So whether you're new to development, or an elite hacker, come on down for an exciting weekend and valueable experience! </v-card-text>
    </v-card>
    <v-card class="about-section" width="90vw" max-width="680px">
      <h2>What if I have more questions?</h2>
      <v-divider></v-divider>
      <v-card-text>Feel free to reach out and e-mail the MCA (Mizzou Computing Association) at muengrtigerhacks@missouri.edu</v-card-text>
    </v-card>
  </div>
</template>

<script>
import Heading from "../components/Heading.vue";

export default {
  name: "AboutTab",
  data() {
    return {};
  },
  components: {
    Heading
  },
  methods: {},
  mounted() {}
};
</script>

<style scoped>
.about-section {
  box-shadow: 0 0 20px 0 grey inset;
  margin-bottom: 2rem;
  margin-top: 0.5rem;
  padding: 2rem;
  transition: background-color 0.2s ease;
  background-color: #343434;
  width: 100vw;
  max-width: 800px;
}

.about-section:hover {
  background-color: #434343;

}

h2 {
  color: rgb(238, 87, 44);
}

.about-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  width: 95vw;
  max-width: 800px;
  font-family: "Josefin Sans";
}

h1 {
  font-size: 5rem;
}

span {
  color: rgb(238, 87, 44);
}
</style>