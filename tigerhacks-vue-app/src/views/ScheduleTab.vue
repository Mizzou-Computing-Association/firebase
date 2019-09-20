<template>
  <div class="schedule-tab">
    <heading text="Schedule"></heading>

    <!-- <v-expansion-panels popout class="expansion-panels" width="95vw" max-width="680px"> -->
    <div class="days">
      <v-card v-for="(value, name) in schedule" :key="name" class="expansion-panel">
        <v-card-title :ref="name">
          <h2>{{ name }}</h2>
        </v-card-title>
        <v-card-text>
          <div class="event-content" v-for="event in value" :key="event.title">
            <h4>{{ event.time }}</h4>
            <h3>{{ event.title }}</h3>
            <h5>@ {{ event.location }}</h5>
            <!-- <v-btn class="favorite-button" small fab>
              <v-icon>mdi-star</v-icon>
            </v-btn>-->
          </div>
        </v-card-text>
      </v-card>
    </div>
    <!-- </v-expansion-panels> -->
  </div>
</template>

<script>
import Vue from "vue";
import schedule from "../mockdata/schedule.js";
import Heading from "../components/Heading.vue";

export default {
  name: "ScheduleTab",
  components: {
    Heading
  },
  mounted() {
    this.$nextTick(() => {
      this.schedule = schedule;
      let date = new Date().toLocaleDateString();
      console.log(date);
      console.log("Schedule");
      console.log(this.schedule);
      console.log("Day Refs");
      console.log(this.$refs);
      console.log(this.$refs[0]);
      console.log(this.$refs.Saturday);
      console.log(this.$refs.Sunday);

      switch (date) {
        case "11/8/2019":
          this.$refs.Friday[0].$el.click();
          break;
        case "11/9/2019":
          this.$refs.Saturday[0].$el.click();
          break;
        case "11/10/2019":
          this.$refs.Sunday[0].$el.click();
          break;
        default:
          this.$refs.Sunday[0].$el.click();
          break;
      }
    });
  },
  data() {
    return {
      isFridayOpen: false,
      isSaturdayOpen: false,
      isSundayOpen: false,
      schedule: {}
      // schedule: {
      //   Friday: [
      //     {
      //       time: "5:00 PM",
      //       title: "Check-in Begins",
      //       location: "Main Hallway"
      //     },
      //     {
      //       time: "6:00 PM",
      //       title: "Opening Ceremony",
      //       location: "Geological Sciences or Naka Auditorium"
      //     },
      //     {
      //       time: "6:30 PM",
      //       title: "Dinner",
      //       location: "Lafferre Time Capsule"
      //     },
      //     {
      //       time: "7:30 PM",
      //       title: "Team Building",
      //       location: "Room W1004"
      //     },
      //     {
      //       time: "8:00 PM",
      //       title: "Scavenger Hunt",
      //       location: "Lafferre"
      //     },
      //     {
      //       time: "9:00 PM",
      //       title: "Tech Talk",
      //       location: "Ketcham or Room E1419"
      //     },
      //     {
      //       time: "11:00 PM",
      //       title: "Laser Tag / Nerf War",
      //       location: "The Quad"
      //     }
      //   ],
      //   Saturday: [
      //     {
      //       time: "12:00 AM",
      //       title: "Midnight Snack",
      //       location: "Time Capsule"
      //     },
      //     {
      //       time: "8:00 AM",
      //       title: "Breakfast",
      //       location: "Time Capsule"
      //     },
      //     {
      //       time: "10:00 AM",
      //       title: "Animals",
      //       location: "Francis Quadrangle"
      //     },
      //     {
      //       time: "12:00 PM",
      //       title: "Lunch",
      //       location: "Time Capsule"
      //     },
      //     {
      //       time: "1:00 PM",
      //       title: "Tech Talk",
      //       location: "Ketcham or Room E1419"
      //     },
      //     {
      //       time: "2:00 PM",
      //       title: "Video Games",
      //       location: "TBD"
      //     },
      //     {
      //       time: "5:00 PM",
      //       title: "Tech Talk",
      //       location: "Ketcham or Room E1419"
      //     },
      //     {
      //       time: "7:00 PM",
      //       title: "Dinner",
      //       location: "Time Capsule"
      //     },
      //     {
      //       time: "8:00 PM",
      //       title: "MLH Activity",
      //       location: "TBD"
      //     },
      //     {
      //       time: "9:00 PM",
      //       title: "Beat Shazam",
      //       location: "Classroom"
      //     },
      //     {
      //       time: "9:00 PM",
      //       title: "Crafts",
      //       location: "Cafe or Classroom"
      //     },
      //     {
      //       time: "10:00 PM",
      //       title: "Movies",
      //       location: "Ketcham"
      //     }
      //   ],
      //   Sunday: [
      //     {
      //       time: "12:00 AM",
      //       title: "Midnight Snack",
      //       location: "Time Capsule"
      //     },
      //     {
      //       time: "8:00 AM",
      //       title: "Breakfast",
      //       location: "Time Capsule"
      //     },
      //     {
      //       time: "10:30 AM",
      //       title: "Submissions Due",
      //       location: ""
      //     },
      //     {
      //       time: "11:00 AM",
      //       title: "Lunch",
      //       location: "Time Capsule"
      //     },
      //     {
      //       time: "11:30 AM",
      //       title: "How To Demo",
      //       location: "Ketcham or Room E1419"
      //     },
      //     {
      //       time: "12:00 PM",
      //       title: "Judging Begins",
      //       location: "Hallways"
      //     },
      //     {
      //       time: "2:00 PM",
      //       title: "Closing Ceremony",
      //       location: "Keller or Naka"
      //     }
      //   ]
      // }
    };
  }
};
</script>

<style scoped>
.days {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-evenly;
}

.schedule-tab {
  width: 100%;
  margin: auto;
  font-family: "Josefin Sans";
}

h1,
h2 {
  /* text-shadow: 2px 2px black; */
}

h1 {
  font-size: 60px;
  text-align: center;
}

h3 {
  color: orange;  
}

.event-content {
  background-color: #22222222;
  border-top: 1px solid #22222288;
  border-left: 2px solid orange;
  border-radius: 5px 0 0 5px;
  position: relative;
  padding: 8px 20px;
  transition: background-color 0.2s ease;
}

.event-content:nth-child(2n) {
  background-color: #22222200;
}

.event-content:hover {
  background-color: #22222255;
}

.event-content:hover > .favorite-button {
  opacity: 1;
}

.padding-enter-active,
.padding-leave-active {
  transition: padding 0.2s ease;
}

.padding-enter,
.padding-leave-to {
  padding: 0;
}

.padding-leave,
.padding-enter-to {
  padding: 25px;
}

.favorite-button {
  position: absolute;
  right: 8px;
  top: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.expansion-panel {
  box-shadow: 0 0 10px 0 grey inset;
  width: 30%;
  margin-left: 2vw;
  margin-right: 2vw;
}

@media only screen and (max-width: 1000px) {
  .days {
    flex-direction: column;
    align-items: center;
  }

  .expansion-panel {
    width: 80%;
    margin-top: 20px;
  }


}
</style>