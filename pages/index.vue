<template>
  <v-main>
    <v-navigation-drawer v-model="drawer" app>
      <form
        @submit.prevent="handleSubmitSearch"
        class="d-flex flex-column justify-center"
      >
        <div>
          <span class="search-input" @click="handleResetSearch">x</span>
          <input
            v-model="searchQuery"
            placeholder="Search.."
            type="text"
            class="grey--text lighten-5 pa-1 ma-1 split"
          />
        </div>
        <div class="d-flex justify-space-around align-center">
          <v-btn @click="handleSubmitSearch" small class="ma-0">search</v-btn>
        </div>
      </form>
      <div v-if="serverSearchQuery" class="mt-2">
        <p class="text-caption">
          {{ sideOfflineCams.length + sideOnlineCams.length }} results for "{{
            serverSearchQuery
          }}".
        </p>
      </div>
      <div class="pa-1 pb-3 split">
        <h3
          class="
            grey--text
            lighten-5
            text-decoration-underline
            font-weight-medium
            mb-3
          "
        >
          Online cameras:
        </h3>
        <div v-if="sideOnlineCams.length">
          <div
            class="on-hover"
            v-for="camera in sideOnlineCams"
            :key="camera.id"
          >
            <NuxtLink
              :to="camera.id + '&' + camera.frequency + '&' + camera.status"
              class="text-decoration-none"
            >
              <div class="grey--text lighten-5">
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
        <div v-else>
          <h5>No data</h5>
        </div>
      </div>
      <div class="pa-1 mt-4">
        <h3
          class="
            grey--text
            lighten-5
            text-decoration-underline
            font-weight-medium
            mt-2
            mb-3
          "
        >
          Offline cameras:
        </h3>
        <div v-if="sideOfflineCams.length">
          <div
            class="on-hover"
            v-for="camera in sideOfflineCams"
            :key="camera.id"
          >
            <NuxtLink
              :to="camera.id + '&' + camera.frequency + '&' + camera.status"
              class="text-decoration-none"
            >
              <div class="grey--text lighten-5">
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
        <div v-else>
          <h5>No data</h5>
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
      searchQuery: "",
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
    handleSubmitSearch() {
      this.$store.commit("cameras/SEARCH", this.searchQuery);
    },
    handleResetSearch() {
      this.searchQuery = "";
      this.$store.commit("cameras/SEARCH", "");
    },
  },
  computed: {
    sideOnlineCams() {
      return this.$store.getters["cameras/GET_SHOWING_ONLINE_CAMS"];
    },
    sideOfflineCams() {
      return this.$store.getters["cameras/GET_SHOWING_OFFLINE_CAMS"];
    },
    onlineCams() {
      return this.$store.getters["cameras/GET_ONLINE_CAMS"];
    },
    offlineCams() {
      return this.$store.getters["cameras/GET_OFFLINE_CAMS"];
    },
    serverSearchQuery() {
      return this.$store.getters["cameras/GET_SEARCH_QUERY"];
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
  border-width: 1px;
  border-radius: 5px;
  border-color: lightgray;
  margin-bottom: 4px;
}
.on-hover:hover {
  margin: 8px 4px;
}
input:focus {
  outline: none;
}
.search-input {
  position: relative;
  top: 50%;
  left: 80%;
}
.search-input:hover{
  cursor: pointer;
}
</style>