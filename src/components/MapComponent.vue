<template>
  <div class="map-container">
    <div ref="map" class="map"></div>
  </div>
</template>

<script>
/* global google */  // ESLint'e google nesnesinin global bir deðiþken olduðunu belirtir

export default {
  name: 'MapComponent',
  data() {
    return {
      map: null,
      mapLoaded: false,
      userLocationMarker: null, // Kullanýcý konumu için iþaretleyici
    };
  },
  mounted() {
    this.loadMapScript();
  },
  methods: {
    loadMapScript() {
      if (!this.mapLoaded && !window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC3EtWIuDUa-5yV6f13gUdZPJtQS7H2QJA&callback=initMapCallback`;
        script.async = true;
        script.defer = true;
        script.onerror = (error) => {
          console.error('Google Maps script could not be loaded.', error);
        };
        window.initMapCallback = this.initMap;  // Callback fonksiyonu global nesneye ata
        document.head.appendChild(script);
      } else if (window.google && !this.map) {
        this.initMap();
      }
    },
    initMap() {
      if (!this.map) {
        this.mapLoaded = true;
        this.map = new google.maps.Map(this.$refs.map, {
          center: { lat: 40.7128, lng: -74.0060 },
          zoom: 12,
        });
        this.showUserLocation(); // Kullanýcý konumunu göster
        this.$emit('map-loaded', true); // Emit an event to signal that the map is loaded
      }
    },
    showUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.map.setCenter(userLocation);
          this.userLocationMarker = new google.maps.Marker({
            position: userLocation,
            map: this.map,
            title: 'Your Location'
          });
        }, () => {
          console.error('Error in retrieving your location');
        });
      } else {
        // Tarayýcý konum bilgisi saðlamýyorsa
        console.error('Geolocation is not supported by this browser.');
      }
    },
  },
};
</script>
