<template>
  <div class="prizes-tab">
      <heading text="Prizes"></heading>    
      <v-card>
        <v-card-title>Coming Soon</v-card-title>
      </v-card>
  </div>
</template>

<script>
import Heading from '../components/Heading.vue'

export default {
  name: "PrizesTab",
  components: {
    Heading
  }, 
  data() {
    return {};
  },
  methods: {},
  mounted() {
    this.$nextTick(() => {});
  }
};
</script>

<style scoped>
.v-card {
  width: 20vw;
  min-width: 16rem;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.v-card-title {
  
}
</style>