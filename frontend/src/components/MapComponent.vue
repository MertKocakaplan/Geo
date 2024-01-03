<template>
  <div class="map-container">
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Arama yapin"
      @input="handleSearch"
      class="search-input"
    />
    <div ref="map" class="map"></div>
  </div>
</template>

<script>
/* global google */
export default {
  name: 'MapComponent',
  data() {
    return {
      map: null,
      mapLoaded: false,
      userLocationMarker: null,
      searchQuery: '',
    };
  },
  mounted() {
    this.loadMapScript();
  },
  methods: {
    loadMapScript() {
      if (!this.mapLoaded && !window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC3EtWIuDUa-5yV6f13gUdZPJtQS7H2QJA&libraries=places&callback=initMapCallback`;
        script.async = true;
        script.defer = true;
        script.onerror = (error) => {
          console.error('Google Maps script could not be loaded.', error);
        };
        window.initMapCallback = this.initMap;  
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
        this.showUserLocation(); 
        this.$emit('map-loaded', true); 
        this.createAutocomplete();
      }
    },
    createAutocomplete() {
      
      this.autocomplete = new google.maps.places.Autocomplete(
        document.querySelector('.search-input'),
        { types: ['geocode'] }
      );

      
      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        const location = place.geometry.location;
        this.map.setCenter(location);
        if (this.userLocationMarker) {
          this.userLocationMarker.setMap(null);
        }
        this.userLocationMarker = new google.maps.Marker({
          position: location,
          map: this.map,
          title: place.name
        });
      });
    },
    placeMarker(latLng) {
      
      if (this.userLocationMarker) {
        this.userLocationMarker.setMap(null);
      }
      
      this.userLocationMarker = new google.maps.Marker({
        position: latLng,
        map: this.map,
      });
     
      this.map.panTo(latLng);
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
       
        console.error('Geolocation is not supported by this browser.');
      }
    },
    showLocationOnMap(location) {
      if (this.map) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: location }, (results, status) => {
          if (status === 'OK') {
            const latLng = results[0].geometry.location;
            this.map.setCenter(latLng);

          } else {
            console.error('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
    },
    handleSearch() {
      if (this.searchQuery) {
        this.showLocationOnMap(this.searchQuery);
      }
    }
  },
};
</script>
<style>
.search-input {
  margin-top: 50px;
  
  
}


</style>