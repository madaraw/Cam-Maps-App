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
      streamImg: `https://media.evercam.io/v1/cameras/${this.$route.params.pathMatch}/thumbnail?thumbnailId=1`,
      refreshStreamImage: null,
    };
  },
  async mounted() {
    console.log(this.$route.params.pathMatch);
    this.refreshStreamImage = setInterval(() => {
      let randomTime = new Date().getTime();
      this.streamImg = `https://media.evercam.io/v1/cameras/${this.$route.params.pathMatch}/thumbnail?thumbnailId=${randomTime}`;
    }, 500);
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
  left: 7%;
  top: 5%;
}
.stream {
  height: 100%;
}
</style>