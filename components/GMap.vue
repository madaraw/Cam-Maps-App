<template>
  <div class="map pa-0 ma-0" ref="map"></div>
</template>
 <script type = "text/javascript" 
          src =
 "https://d3js.org/d3.v4.min.js">
</script>
<script>
import { MarkerClusterer } from "@googlemaps/markerclusterer";

export default {
  props: ["onlineCameras", "offlineCameras"],
  data() {
    return {
      infoWindows: [],
    };
  },
  computed: {
    markersOnline() {
      return this.$store.getters["markers/GET_MARKERS_ONLINE"];
    },
    markersOffline() {
      return this.$store.getters["markers/GET_MARKERS_OFFLINE"];
    },
    markersCluster() {
      return this.$store.getters["markers/GET_MARKER_CLUSTER"];
    },
    map() {
      return this.$store.getters["markers/GET_MAP"];
    },
  },
  mounted() {
    let markersOnline = [];
    let markersOffline = [];
    let markerCluster = null;
    let map = null;
    let center = { lat: 53.3498, lng: -6.2603 };

    // Embedding the map
    map = new this.$google.maps.Map(this.$refs.map, {
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
        map: map,
        title: this.onlineCameras[i].name,
        icon: svgMarkerIcon,
      });
      // Adding the event listeners for the hover on the markers
      marker.addListener("mouseover", () => {
        infowindow.open({
          anchor: marker,
          map: map,
          shouldFocus: false,
        });
      });
      marker.addListener("mouseout", () => {
        infowindow.close();
      });

      // Adding the event listener for the click
      marker.addListener("click", () => {
        this.$router.push(
          "/" + this.onlineCameras[i].id + "&" + this.onlineCameras[i].frequency
        );
      });

      // Saving the marker
      markersOnline.push(marker);

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
        map: map,
        title: this.offlineCameras[i].name,
        icon: svgMarkerIcon,
      });

      // Adding the event listeners for the hover on the markers
      marker.addListener("mouseover", () => {
        infowindow.open({
          anchor: marker,
          map: map,
          shouldFocus: false,
        });
      });
      marker.addListener("mouseout", () => {
        infowindow.close();
      });

      // saving the marker
      markersOffline.push(marker);

      // Saving the info window
      this.infoWindows.push(infowindow);
    }

    //   const renderer = {
    //     palette: interpolateRgb("red", "blue"),
    //     render: function ({ count, position }, stats) {
    //       // use d3-interpolateRgb to interpolate between red and blue
    //       const color = this.palette(count / stats.clusters.markers.max);
    //       // create svg url with fill color
    //       const svg = window.btoa(`
    // <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
    //   <circle cx="120" cy="120" opacity=".8" r="70" />
    // </svg>`);
    //       // create marker using svg icon
    //       return new google.maps.Marker({
    //         position,
    //         icon: {
    //           url: `data:image/svg+xml;base64,${svg}`,
    //           scaledSize: new google.maps.Size(75, 75),
    //         },
    //         label: {
    //           text: String(count),
    //           color: "rgba(255,255,255,0.9)",
    //           fontSize: "12px",
    //         },
    //         // adjust zIndex to be above other markers
    //         zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
    //       });
    //     },
    //   };
    // Clustering the markers
    markerCluster = new MarkerClusterer({
      map: map,
      markers: [...markersOnline, ...markersOffline],
      renderer: {
        palette: d3.interpolateRgb("blue", "red"),
        render: function ({ count, position }, stats) {
          // use d3-interpolateRgb to interpolate between red and blue
          const color = this.palette(count / stats.clusters.markers.max);
          // create svg url with fill color
          const svg = window.btoa(`
  <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
    <circle cx="120" cy="120" opacity=".8" r="60" />    
  </svg>`);
          // create marker using svg icon
          return new google.maps.Marker({
            position,
            icon: {
              url: `data:image/svg+xml;base64,${svg}`,
              scaledSize: new google.maps.Size(75, 75),
            },
            label: {
              text: String(count),
              color: "rgba(255,255,255,0.9)",
              fontSize: "12px",
            },
            // adjust zIndex to be above other markers
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
          });
        },
      },
    });

    console.log(markerCluster);

    this.$store.commit("markers/SET_MARKERS_ONLINE", markersOnline);
    this.$store.commit("markers/SET_MARKERS_OFFLINE", markersOffline);
    this.$store.commit("markers/SET_MARKER_CLUSTER", markerCluster);
    this.$store.commit("markers/SET_MAP", map);
  },
};
</script>