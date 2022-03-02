<template>
  <v-main class="screen">
    <v-navigation-drawer v-model="drawer" app>
      <!--  -->
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>
    <v-main class="pa-0 ma-0">
      <div class="map" ref="map"></div>
    </v-main>
  </v-main>
</template>

<script>
export default {
  name: "IndexPage",
  data() {
    return { drawer: false };
  },
  mounted() {
    console.log(this.cameras);
    const map = new google.maps.Map(this.$refs.map, {
      zoom: 3,
      center: { lat: 0, lng: 0 },
    });
    for (let index = 0; index < this.cameras.cameras.length; index++) {
      const marker = new google.maps.Marker({
        position: this.cameras.cameras[index].location,
        map: map,
      });
    }
  },
  async asyncData() {
    return {
      cameras: await fetch("https://media.evercam.io/v2/public/cameras").then(
        (res) => res.json()
      ),
    };
  },
};
</script>

<style>
.map {
  height: 100vw;
  width: 100vw;
  padding: 0;
}
</style>