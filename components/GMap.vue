<template>
  <div class="map pa-0 ma-0" ref="map"></div>
</template>

<script>
import { MarkerClusterer } from "@googlemaps/markerclusterer";

export default {
  props: ["onlineCameras", "offlineCameras"],
  data() {
    return {
      map: null,
      markerCluster: null,
      markersOnline: [],
      markersOffline: [],
      infoWindows: [],
    };
  },
  mounted() {
      console.log("mounted", this.onlineCameras)
    // Setting the center
    let center = { lat: 51.53375206516868, lng: 0.0824166094009549 };

    // Embedding the map
    this.map = new this.$google.maps.Map(this.$refs.map, {
      zoom: 6,
      center: center,
      disableDefaultUI: true,
    });

    // Creating the SVG marker icon (offline cameras)
    const svgMarkerIcon = {
      path: "M320 144C320 223.5 255.5 288 176 288C96.47 288 32 223.5 32 144C32 64.47 96.47 0 176 0C255.5 0 320 64.47 320 144zM192 64C192 55.16 184.8 48 176 48C122.1 48 80 90.98 80 144C80 152.8 87.16 160 96 160C104.8 160 112 152.8 112 144C112 108.7 140.7 80 176 80C184.8 80 192 72.84 192 64zM144 480V317.1C154.4 319 165.1 319.1 176 319.1C186.9 319.1 197.6 319 208 317.1V480C208 497.7 193.7 512 176 512C158.3 512 144 497.7 144 480z",
      fillColor: "green",
      fillOpacity: 1,
      strokeWeight: 1,
      rotation: 0,
      scale: 0.05,
      anchor: new google.maps.Point(200, 510),
    };

    // Creating the online markers
    for (let i = 0; i < this.onlineCameras.length; i++) {
      // Creating the info window
      const infowindow = new this.$google.maps.InfoWindow({
        content: `<div><h3 class="black--text">${this.onlineCameras[i].name}</h3><img style="height: 200px;" src="${this.onlineCameras[i].thumbnail_url}"/></div>`,
      });

      // Creating the marker
      const marker = new this.$google.maps.Marker({
        position: this.onlineCameras[i].location,
        map: this.map,
        title: this.onlineCameras[i].name,
        icon: svgMarkerIcon,
      });
      // Adding the event listeners for the hover on the markers
      marker.addListener("mouseover", () => {
        infowindow.open({
          anchor: marker,
          map: this.map,
          shouldFocus: false,
        });
      });
      marker.addListener("mouseout", () => {
        infowindow.close();
      });

      // Adding the event listener for the click
      marker.addListener("click", () => {
        this.$router.push("/" + this.onlineCameras[i].id);
      });

      // Saving the marker
      this.markersOnline.push(marker);

      // Saving the info window
      this.infoWindows.push(infowindow);
    }

    // Editing the color of the marker for the offline cameras
    svgMarkerIcon.fillColor = "grey";

    // Creating the offline markers
    for (let i = 0; i < this.offlineCameras.length; i++) {
      // Creating the info window
      const infowindow = new this.$google.maps.InfoWindow({
        content: '<div><h3 class="black--text">Disconnected</h3></div>',
      });

      // Creating the marker
      const marker = new this.$google.maps.Marker({
        position: this.offlineCameras[i].location,
        map: this.map,
        title: this.offlineCameras[i].name,
        icon: svgMarkerIcon,
      });

      // Adding the event listeners for the hover on the markers
      marker.addListener("mouseover", () => {
        infowindow.open({
          anchor: marker,
          map: this.map,
          shouldFocus: false,
        });
      });
      marker.addListener("mouseout", () => {
        infowindow.close();
      });

      // saving the marker
      this.markersOffline.push(marker);

      // Saving the info window
      this.infoWindows.push(infowindow);
    }

    // Clustering the markers
    this.markerCluster = new MarkerClusterer({
      map: this.map,
      markers: [...this.markersOnline, ...this.markersOffline],
    });
  },
};
</script>