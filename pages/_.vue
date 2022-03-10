<template>
  <v-main>
    <v-app-bar >
      <v-btn @click="handleGoBack">Go back</v-btn>
      <v-toolbar-title>Ever- Public -cam</v-toolbar-title>
    </v-app-bar>

    <v-container class="screen pa-0 d-flex justify-center">
      <img :src="streamImg" class="stream ma-0" />
    </v-container>
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
      refreshStreamImage: null,
    };
  },
  methods: {
    handleGoBack() {
      this.$router.push("/");
    },
  },
  async mounted() {
    this.refreshStreamImage = setInterval(() => {
      let randomTime = new Date().getTime();
      this.streamImg = `https://media.evercam.io/v1/cameras/${this.cameraId}/thumbnail?thumbnailId=${randomTime}`;
    }, (60 / this.cameraFrequency) * 1000);
  },
  beforeDestroy() {
    clearInterval(this.refreshStreamImage);
  },
};
</script>

<style>
.screen {
  height: 100vh;
}
.stream {
  height: 100%;
}
</style>