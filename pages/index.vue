<template>
  <v-main>
    <v-navigation-drawer v-model="drawer" app>
      <div class="py-1" v-for="camera in cameras" :key="camera.id">
        <div v-if="camera.status == 'online'">
          <NuxtLink :to="camera.id" class="text-decoration-none">
            <div>
              <v-img width="100%" :src="camera.thumbnail_url" />
              <h4 class="text-center white--text">{{ camera.name }}</h4>
            </div>
          </NuxtLink>
        </div>
        <div class="offline" v-else>
          <v-img width="100%" :src="camera.thumbnail_url" />
          <h4 class="text-center white--text">{{ camera.name }}</h4>
        </div>
      </div>
    </v-navigation-drawer>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Ever(public)cam(s)</v-toolbar-title>
      <!-- <v-btn @click="disableTest">disableX</v-btn> -->
    </v-app-bar>
    <v-container class="map map-container pa-0 ma-0" v-if="onlineCams.length && offlineCams.length">
      <GMap :onlineCameras="onlineCams" :offlineCameras="offlineCams" />
    </v-container>
  </v-main>
</template>

<script>

export default {
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    onlineCams() {
      return this.$store.getters["cameras/GET_ONLINE_CAMS"]
    },
    offlineCams() {
      return this.$store.getters["cameras/GET_OFFLINE_CAMS"]
    },
    cameras() {
      return [...this.onlineCams,...this.offlineCams]
    }
  },
  beforeCreate() {
    this.$store.dispatch("cameras/FETCH_CAMERAS");
  },
};
</script>

<style>
.map {
  height: 100%;
  width: 100vw;
}
.offline {
  opacity: 0.2;
  cursor: not-allowed;
}
</style>