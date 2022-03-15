<template>
  <v-main class="screen">
    <v-app-bar>
      <v-app-bar-nav-icon @click="handleGoBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>Ever- Public -cam</v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="cameraStatus == 'online'">
        <div class="d-flex justify-center align-center green--text">
          <v-icon color="green">mdi-circle-medium</v-icon>
          <h3>online</h3>
        </div>
      </div>
      <div v-else>
        <div class="d-flex justify-center align-center grey--text">
          <v-icon color="grey">mdi-circle-medium</v-icon>
          <h3>offline</h3>
        </div>
      </div>
    </v-app-bar>

    <div class="screen-container pa-0 d-flex justify-center" ref="streamImg">
      <img :src="streamImg" class="stream ma-0" />
      <div class="options">
        <v-btn @click="handleFullscreen">
          <v-icon v-if="isFullScreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>
      </div>
    </div>
  </v-main>
</template>

<script>
export default {
  data() {
    return {
      cameraId: this.$route.params.pathMatch.split("&")[0],
      cameraFrequency: this.$route.params.pathMatch.split("&")[1],
      streamImg: `https://media.evercam.io/v1/cameras/${
        this.$route.params.pathMatch.split("&")[0]
      }/thumbnail?thumbnailId=1`,
      cameraStatus: this.$route.params.pathMatch.split("&")[2],
      isFullScreen: false,
      refreshStreamImage: null,
    };
  },
  methods: {
    handleGoBack() {
      this.$router.push("/");
    },
    handleFullscreen() {
      if (!this.isFullScreen) this.$refs.streamImg.requestFullscreen();
      else document.exitFullscreen();
      this.isFullScreen = !this.isFullScreen;
    },
  },
  mounted() {
    if (this.cameraStatus != "online") return;
    this.refreshStreamImage = setInterval(() => {
      let randomTime = new Date().getTime();
      this.streamImg = `https://media.evercam.io/v1/cameras/${this.cameraId}/thumbnail?thumbnailId=${randomTime}`;
    }, (60 / this.cameraFrequency) * 1000);
  },
  beforeDestroy() {
    if (this.cameraStatus != "online") return;
    clearInterval(this.refreshStreamImage);
  },
};
</script>

<style>
.screen {
  height: 100vh;
}
.screen-container {
  height: 100%;
}
.stream {
  width: 100%;
}
.options {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 20px;
}
</style>