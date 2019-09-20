<template>
  <div class="dashboard-div">
    <a href="http://www.mlh.io" class="mlh-badge-link">
      <img src="../assets/mlh-trust-badge-2020-gray.svg" alt class="mlh-badge" />
    </a>

    <transition name="from-left">
      <side-navbar v-if="isDashboardOpen" class="side-nav"></side-navbar>
    </transition>

    <transition name="fade">
      <landing-card v-if="!isDashboardOpen" @openDashboard="openDashboard()"></landing-card>
    </transition>

    <transition name="from-right">
      <bottom-navbar v-if="isDashboardOpen" @switchTheme="switchTheme()" class="bottom-nav"></bottom-navbar>
    </transition>

    <!-- <v-btn @click="openDashboard()" class="palette-button" v-if="!isDashboardOpen">
      <v-icon>mdi-help</v-icon>
    </v-btn> -->

    <transition name="from-bottom">
      <!-- <v-parallax
        src="https://www.bestfunforall.com/better/imgs/Gorgeous%20Lavender%20Field%20wallpaper%20%205.jpg"
        height="500" class="viewport" v-if="isDashboardOpen"
      > -->
        <div v-if="isDashboardOpen" class="viewport">
          <img src="../assets/THBubbleBackground.png" alt="" class="background-image" ref="backgroundImage">
          <transition name="tab-slide" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      <!-- </v-parallax> -->
    </transition>
  </div>
</template>

<script>
import LandingCard from "../components/LandingCard.vue";
import SideNavbar from "../components/SideNavbar.vue";
import BottomNavbar from "../components/BottomNavbar.vue";

export default {
  name: "Dashboard",
  components: {
    LandingCard,
    SideNavbar,
    BottomNavbar
  },
  data() {
    return {
      isDashboardOpen: false,
      isMobile: false
    };
  },
  methods: {
    openDashboard() {
      this.$router.push('/about');
      this.isDashboardOpen = true;
    },
    closeDashboard() {
      this.isDashboardOpen = false;
    },
    switchTheme() {
      this.$emit("switchTheme");
    }
  },
  mounted() {
    if (this.$route.path !== '/')
      this.isDashboardOpen = true;
    // fetch('https://tigerhacks.com/api/schedule')
    //   .then(res => res.json())
    //   .then(res => {
    //     console.log(res);
    //   });
    window.onmousemove = (e) => {
      let xCoord = e.clientX / window.innerWidth;
      let yCoord = e.clientY / window.innerHeight;
      let xOffset = xCoord * 10;
      let yOffset = yCoord * 10;

      this.$refs.backgroundImage.style.left = -xCoord - 10 + "vw";
      this.$refs.backgroundImage.style.top = -yCoord - 10 + "vh";
    }
  }
};
</script>

<style>
</style>

<style scoped>
.dashboard-div {
  width: 100vw;
  height: 100vh;
  background-image: url("../assets/background-img.jpg");
  background-repeat: repeat;
  background-size: 100%;
}

.mlh-badge {
  height: 175px;
  position: fixed;
  top: 0;
  right: 30px;
  z-index: 3;
}

.palette-button {
  height: 200px;
  width: 200px;
  position: fixed;
  bottom: 0;
  right: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0 !important;
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
}

.from-left-enter-active,
.from-right-enter-active {
  transition: transform 0.7s ease;
}

.from-left-enter {
  transform: translateX(-100px);
}

.from-right-enter {
  transform: translateX(100vw);
}

.from-left-enter-to,
.from-right-enter-to {
  transform: translateX(0px);
}

.from-bottom-enter-active {
  transition: transform 0.7s ease 0.7s;
}

.from-bottom-enter {
  transform: translateY(100vh);
}

.from-bottom-enter-to {
  transform: translateY(0);
}

.tab-slide-enter-active,
.tab-slide-leave-active {
  transition: transform 0.15s ease-out, opacity 0.15s ease;
}

.tab-slide-enter,
.tab-slide-leave-to {
  transform: translateY(1vh);
  opacity: 0;
}

.tab-slide-enter-to,
.tab-slide-leave {
  transform: translateX(0);
  opacity: 1;
}

.tab-slide-leave-to {
  transform: translateY(1vh);
}

.viewport {
  padding: 40px 2.5vw;
  background-color: #22222266;
  /* background-image: url('../assets/THBubbleBackground.png'); */
  background-size: 100%;
  position: relative;
  z-index: 2;
  height: 90vh;
  overflow: scroll;
}

.background-image {
  position: fixed;
  left: -10vw;
  top: -10vh;
  width: 130vw;
  min-width: 220vh;
  height: 130vh;
  pointer-events: none;
}

.side-nav {
  display: none;
}

@media only screen and (max-width: 700px) {
  .viewport {
    height: 100vh;
  }

  .bottom-nav {
    display: none;
  }

  .side-nav {
    display: initial;
  }

  .mlh-badge {
    opacity: .4;
  }
}

</style>
