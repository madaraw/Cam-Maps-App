<template>
  <v-main>
    <v-navigation-drawer v-model="drawer" app>
      <v-form>
        <v-text-field label="Main input"></v-text-field>
        <v-btn> Validate </v-btn>
      </v-form>
      <div v-if="onlineCams.length" class="pa-1 pb-3 split">
        <h3
          class="
            white--text
            text-decoration-underline
            font-weight-medium
            mt-2
            mb-3
          "
        >
          Online cameras:
        </h3>
        <div class="on-hover" v-for="camera in onlineCams" :key="camera.id">
          <NuxtLink
            :to="camera.id + '&' + camera.frequency + '&' + camera.status"
            class="text-decoration-none"
          >
            <div class="white--text">
              <v-img width="100%" :src="camera.thumbnail_url" />
              <div class="d-flex justify-center align-center">
                <v-icon color="green">mdi-circle-medium</v-icon>
                <h4 class="text-center font-weight-medium text--secondary">
                  {{ camera.name }}
                </h4>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
      <div class="pa-1 mt-4" v-if="offlineCams.length">
        <h3
          class="
            white--text
            text-decoration-underline
            font-weight-medium
            mt-2
            mb-3
          "
        >
          Offline cameras:
        </h3>
        <div class="on-hover" v-for="camera in offlineCams" :key="camera.id">
          <NuxtLink
            :to="camera.id + '&' + camera.frequency + '&' + camera.status"
            class="text-decoration-none"
          >
            <div class="white--text">
              <v-img width="100%" :src="camera.thumbnail_url" />
              <div class="d-flex justify-center align-center">
                <v-icon color="grey">mdi-circle-medium</v-icon>
                <h4 class="text-center font-weight-medium text--secondary">
                  {{ camera.name }}
                </h4>
              </div>
            </div>
          </NuxtLink>
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
      <div class="checkBoxes grey darken-4 ma-5 px-5 py-3 rounded-lg">
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
        <div class="d-flex justify-center">
          <v-btn @click="handleRecenter"
            ><v-icon>mdi-crosshairs-gps </v-icon></v-btn
          >
        </div>
      </div>
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
    handleRecenter() {
      this.$store.commit("markers/HANDLE_RECENTER");
    },
  },
  computed: {
    onlineCams() {
      return this.$store.getters["cameras/GET_ONLINE_CAMS"];
    },
    offlineCams() {
      return this.$store.getters["cameras/GET_OFFLINE_CAMS"];
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
  opacity: 0.7;
}
.checkBoxes {
  position: absolute;
  z-index: 1;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
}
.checkBoxes:hover {
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
}
.split {
  border-style: solid;
  border-width: 0 0 1px 0;
}
.on-hover {
  border-style: solid;
  border-width: 2px;
  border-radius: 5px;
  margin-bottom: 4px;
}
.on-hover:hover {
  margin: 8px 4px;
}
</style>