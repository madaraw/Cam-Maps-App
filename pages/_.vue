<template>
  <v-container class="screen pa-0 ma-0">
    <NuxtLink to="/" class="back-btn"> <v-btn>Go back</v-btn> </NuxtLink>
    <!-- <v-img
      height="100vh"
      contain
      :src="backgroundImg"
      class="background-image"
    ></v-img> -->
    <v-img
      height="100vh"
      contain
      :src="highRefreshRateImg"
      class="high-refreshRate-image"
    ></v-img>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      highRefreshRateImg: `https://media.evercam.io/v1/cameras/${this.$route.params.pathMatch}/thumbnail?thumbnailId=1`,
      backgroundImg: `https://media.evercam.io/v1/cameras/${this.$route.params.pathMatch}/thumbnail?thumbnailId=1`,
      refreshImage: null,
      refreshBgImage: null,
    };
  },
  async mounted() {
    console.log(this.$route.params.pathMatch);
    this.refreshImage = setInterval(() => {
      let randomTime = new Date().getTime();
      this.highRefreshRateImg = `https://media.evercam.io/v1/cameras/${this.$route.params.pathMatch}/thumbnail?thumbnailId=${randomTime}`;
    }, 2000);

    // this.refreshBgImage = setInterval(() => {
    //   let randomTime = new Date().getTime();
    //   this.backgroundImg = `https://media.evercam.io/v1/cameras/${this.$route.params.pathMatch}/thumbnail?thumbnailId=${randomTime}`;
    // }, 4500);
  },
  beforeDestroy() {
    clearInterval(this.refreshImage);
    clearInterval(this.refreshBgImage);
    console.log("destroyed");
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
  left: 8rem;
  top: 1rem;
}
.background-image {
  position: absolute;
  z-index: 1;
}
.high-refreshRate-image {
  position: absolute;
  z-index: 2;
}
</style>