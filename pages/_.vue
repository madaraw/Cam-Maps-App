<template>
  <v-container class="screen pa-0 d-flex justify-center">
    <NuxtLink to="/" class="back-btn"> <v-btn>Go back</v-btn> </NuxtLink>
    <img :src="streamImg" class="stream" />
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      cameraId: this.$route.params.pathMatch.split('&')[0],
      cameraFrequency: this.$route.params.pathMatch.split('&')[1],
      streamImg: `https://media.evercam.io/v1/cameras/${this.$route.params.pathMatch.split('&')[0]}/thumbnail?thumbnailId=1`,
      refreshStreamImage: null,
    };
  },
  async mounted() {
    this.refreshStreamImage = setInterval(() => {
      let randomTime = new Date().getTime();
      this.streamImg = `https://media.evercam.io/v1/cameras/${this.cameraId}/thumbnail?thumbnailId=${randomTime}`;
    }, 60/this.cameraFrequency *1000);
  },
  beforeDestroy() {
    clearInterval(this.refreshStreamImage);
  },
};
</script>

<style>
.screen {
  height: 100vh;
  width: 100vw;
}
.no-scroll::-webkit-scrollbar {
  width: 0px;
}
.back-btn {
  text-decoration: none;
  position: absolute;
  z-index: 10;
  left: 0;
  top: 0;
}
.stream {
  height: 100%;
}
</style>