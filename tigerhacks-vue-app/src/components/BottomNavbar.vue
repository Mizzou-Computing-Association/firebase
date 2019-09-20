<template>
  <div class="bottom-navbar">
    <v-bottom-navigation :v-model="true" class="bottom-navbar" height="10vh">
      <v-btn v-for="link in links" :key="link.title" @click="switchRoute(link.link)">
        <span>{{ link.title }}</span>
        <v-icon>{{ link.icon }}</v-icon>
      </v-btn>
      <!-- <v-btn @click="switchTheme()" fab class="theme-button">
        <span>theme</span>
        <v-icon>mdi-lens</v-icon>
      </v-btn> -->
    <v-btn color="#f79845" class="register-btn" height="60" @click="window.location.replace('https://tigerhacks.firebaseapp.com/signin')">Register</v-btn>

    </v-bottom-navigation>
  </div>
</template>

<script>
export default {
  name: "BottomNavbar",
  methods: {
    switchRoute(link) {
      this.$router.push(link);
    }, 
    switchTheme() {
      this.$emit('switchTheme');
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    }
  }, 
  data() {
    return {
      links: [
        {
          link: 'about', 
          icon: "mdi-help",
          title: "About"
        },
        {
          link: 'schedule', 
          icon: "mdi-calendar",
          title: "Schedule"
        },
        {
          link: 'prizes', 
          icon: "mdi-trophy",
          title: "Prizes"
        },
        // {
        //   link: 'tigertalks', 
        //   icon: "mdi-chat",
        //   title: "TigerTalks"
        // },
        {
          link: 'sponsors', 
          icon: "mdi-star",
          title: "Sponsors"
        },
        // {
        //   link: 'profile', 
        //   icon: "mdi-account",
        //   title: "Profile"
        // }
      ]
    };
  }
};
</script>

<style scoped>
.bottom-navbar {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100vw;
  margin: 0;
  padding: 0;
  z-index: 3;
}

.theme-button {
  position: absolute !important;
  right: 0;
  top: 0;
}

.register-btn {
  position: absolute !important;
  left: 10px;
  top: 10px;
}
</style>