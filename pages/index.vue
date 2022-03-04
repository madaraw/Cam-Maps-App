<template>
  <v-main>
    <v-navigation-drawer v-model="drawer" app>
      <div class="py-1" v-for="camera in cameras.cameras" :key="camera.id">
        <NuxtLink :to=camera.id>
          <v-img class="thumbnail-img" :class="{offline: (camera.status != 'online')}"  width="100%" :src="camera.thumbnail_url" />
        </NuxtLink>
      </div>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>
    <v-container class="map map-container pa-0 ma-0">
      <div class="map pa-0 ma-0" ref="map"></div>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "IndexPage",
  data() {
    return { drawer: false };
  },
  async mounted() {
    console.log(this.cameras);
    let center = { lat: 0, lng: 0 };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        center.lat = position.coords.latitude;
        center.lng = position.coords.longitude;
        console.log(center);
      });
    }
    console.log(center);
    const map = new google.maps.Map(this.$refs.map, {
      zoom: 4,
      center: center,
    });
    const mapMarkers = [];
    for (let index = 0; index < this.cameras.cameras.length; index++) {
      const marker = new google.maps.Marker({
        position: this.cameras.cameras[index].location,
        map: map,
      });
      mapMarkers.push(marker);
    }
    console.log(this.$refs.map);
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
  height: 100vh;
  width: 100vw;
}
.offline{
  opacity: 0.2;
}
</style>