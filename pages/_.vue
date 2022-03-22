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
        <v-list class="pa-0" outlined dense>
          <v-list-item
            @click="downloadSnapshot"
            class="d-flex justify-center align-center"
          >
            <v-icon>mdi-download</v-icon>
          </v-list-item>
          <v-list-item
            class="d-flex justify-center align-center"
            @click="handlePausePlay"
          >
            <v-icon v-if="isPause">mdi-play</v-icon>
            <v-icon v-else>mdi-pause</v-icon>
          </v-list-item>
          <v-list-item
            class="d-flex justify-center align-center"
            @click="handleFullscreen"
          >
            <v-icon v-if="isFullScreen">mdi-fullscreen-exit</v-icon>
            <v-icon v-else>mdi-fullscreen</v-icon>
          </v-list-item>
        </v-list>
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
      isPause: false,
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
    handlePausePlay() {
      if (this.isPause) this.startStream();
      else this.stopStream();
      this.isPause = !this.isPause;
    },
    startStream() {
      let refreshRate = 5000
      if(this.cameraFrequency) refreshRate = (60 / this.cameraFrequency) * 1000
      this.refreshStreamImage = setInterval(() => {
        let randomTime = new Date().getTime();
        this.streamImg = `https://media.evercam.io/v1/cameras/${this.cameraId}/thumbnail?thumbnailId=${randomTime}`;
      }, refreshRate);
    },
    stopStream() {
      clearInterval(this.refreshStreamImage);
    },
    forceFileDownload(url, title) {
      console.log(title);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", title);
      document.body.appendChild(link);
      link.click();
    },
    async downloadSnapshot() {
      const res = await fetch(this.streamImg).then((res) => {
        return res.blob();
      });
      const date = new Date()
      this.forceFileDownload(window.URL.createObjectURL(res), "snapshot " + this.cameraId + " " + date.getHours() + ":" + date.getMinutes());
    },
  },
  async mounted() {
    console.log(this.$refs.streamImg);
    if (this.cameraStatus != "online") return;
    this.startStream();
  },
  beforeDestroy() {
    if (this.cameraStatus != "online") return;
    this.stopStream();
  },
  head(){
    return{
      title: this.$route.params.pathMatch.split("&")[0],
    }
  }
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