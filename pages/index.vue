<template>
  <v-main>
    <v-navigation-drawer v-model="drawer" app>
      <div class="py-1" v-for="camera in cameras" :key="camera.id">
        <div v-if="camera.status == 'online'">
          <NuxtLink
            :to="camera.id + '&' + camera.frequency"
            class="text-decoration-none"
          >
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
      <v-app-bar-nav-icon @click="drawer = !drawer"
        ><v-icon>mdi-camera</v-icon></v-app-bar-nav-icon
      >

      <v-toolbar-title>Ever- Public -cam</v-toolbar-title>
    </v-app-bar>
    <v-container
      class="map pa-0 ma-0"
      v-if="onlineCams.length && offlineCams.length"
    >
      <v-hover v-slot="{ hover }">
        <v-card
          fluid
          :elevation="hover ? 8 : 4"
          class="checkBoxes grey darken-4 ma-5 px-2 py-1 rounded-lg"
        >
          <v-checkbox
            class="ma-0"
            v-model="onlineCamsVisible"
            label="Online cameras"
            color="success"
            hide-details
            @click="handleClickOnlineCamerasVisibility"
            :disabled="!offlineCamsVisible"
          ></v-checkbox>
          <v-checkbox
            class="ma-0"
            v-model="offlineCamsVisible"
            label="Offline cameras"
            color="grey"
            hide-details
            @click="handleClickOfflineCamerasVisibility"
            :disabled="!onlineCamsVisible"
          ></v-checkbox>
          <v-switch
            @click="handleClickMarkerClusterActive"
            v-model="markerClusterActive"
            label="Clusters"
          ></v-switch>
        </v-card>
      </v-hover>
      <GMap :onlineCameras="onlineCams" :offlineCameras="offlineCams" />
    </v-container>
  </v-main>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      onlineCamsVisible:
        this.$store.getters["markers/GET_MARKERS_ONLINE_VISIBILITY"],
      offlineCamsVisible:
        this.$store.getters["markers/GET_MARKERS_OFFLINE_VISIBILITY"],
      markerClusterActive:
        this.$store.getters["markers/GET_MARKER_CLUSTER_ACTIVE"],
    };
  },
  methods: {
    handleClickOnlineCamerasVisibility() {
      this.$store.commit("markers/TOGGLE_MARKERS_ONLINE_VISIBILITY");
    },
    handleClickOfflineCamerasVisibility() {
      this.$store.commit("markers/TOGGLE_MARKERS_OFFLINE_VISIBILITY");
    },
    handleClickMarkerClusterActive() {
      this.$store.commit("markers/TOGGLE_MARKER_CLUSTER_ACTIVE");
    },
  },
  computed: {
    onlineCams() {
      return this.$store.getters["cameras/GET_ONLINE_CAMS"];
    },
    offlineCams() {
      return this.$store.getters["cameras/GET_OFFLINE_CAMS"];
    },
    cameras() {
      return [...this.onlineCams, ...this.offlineCams];
    },
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
.checkBoxes {
  position: absolute;
  z-index: 1;
}
</style>