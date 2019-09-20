<template>
  <div class="side-navbar">
    <v-navigation-drawer app v-model="isNavBarOpen" temporary class="navbar">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>TigerHacks</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="link in links" :key="link.text" link @click="switchRoute(link.link)">
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-btn class="navbar-button" tile width="40px" @click="toggleIsNavBarOpen()">
        <v-icon ref="navButton">mdi-menu</v-icon>
      </v-btn>

      <v-btn
        color="#f79845"
        class="register-btn"
        height="30"
        @click="window.location.replace('https://tigerhacks.firebaseapp.com/signin')"
      >Register</v-btn>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "SideNavbar",
  data() {
    return {
      isNavBarOpen: false,
      links: [
        {
          icon: "mdi-help",
          text: "About",
          link: "about"
        },
        {
          icon: "mdi-calendar",
          text: "Schedule",
          link: "schedule"
        },
        {
          icon: "mdi-trophy",
          text: "Prizes",
          link: "prizes"
        },
        // {
        //   icon: "mdi-chat",
        //   text: "TigerTalks"
        // },
        {
          icon: "mdi-star",
          text: "Sponsors",
          link: "sponsors"
        }
        // {
        //   icon: "mdi-account",
        //   text: "Profile"
        // }
      ]
    };
  },
  methods: {
    toggleIsNavBarOpen() {
      this.isNavBarOpen = !this.isNavBarOpen;
    },
    switchRoute(link) {
      this.$router.push(link);
    }
  }
};
</script>

<style scoped>
.navbar {
  overflow: visible;
  z-index: 3;
}

.navbar-button {
  position: absolute;
  top: 0;
  right: -64px;
}

.register-btn {
  height: 2rem;
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>