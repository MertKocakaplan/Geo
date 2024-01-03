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

    <!-- Rota bilgisini göstereceðiniz yer -->
    <div id="travelInfo"></div>
    <div v-if="weatherInfo" class="weather-info">
  {{ displayWeatherInfo }}
</div>
  </div>
</template>

<script>
/* global google */
import axios from 'axios';
export default {
  name: 'MapComponent',
  data() {
    return {
      map: null,
      mapLoaded: false,
      userLocationMarker: null,
      searchQuery: '',
      directionsService: null,
      directionsRenderer: null,
      weatherInfo: null,
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
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        this.directionsRenderer.setMap(this.map);
        const trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(this.map);
        this.map.addListener('click', (event) => {
      this.calculateAndDisplayRoute(event.latLng);
    });
  }},
  async calculateAndDisplayRoute(destination) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const start = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.directionsService.route({
        origin: start,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      }, async (response, status) => {
        if (status === 'OK') {
          this.directionsRenderer.setDirections(response);
          const route = response.routes[0].legs[0];
          this.showRouteInfo(route.duration.text, route.distance.text);

          // Hava durumu bilgisini al
          try {
            const latLng = {
              lat: destination.lat(),
              lng: destination.lng()
            };
            await this.getCityNameFromLatLng(latLng.lat, latLng.lng);
          } catch (error) {
            console.error('Error getting weather data:', error);
          }
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    }, () => {
      console.error('Error in retrieving your location');
    });
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
},


  
  showRouteInfo(duration, distance) {
  
  // Bilgiyi HTML üzerinde göster
  const travelInfoDiv = document.getElementById('travelInfo');
  if (travelInfoDiv) {
    travelInfoDiv.innerHTML = `
      <p>Estimated travel time: ${duration}</p>
      <p>Total distance: ${distance}</p>
    `;
  } else {
    console.error('The element with ID "travelInfo" was not found.');
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

    getCityNameFromLatLng(lat, lng) {
  const geocoder = new google.maps.Geocoder();
  const latLng = { lat, lng };
  console.log(`Geocoding for: ${lat}, ${lng}`); // Hata ayýklama için

  geocoder.geocode({ location: latLng }, async (results, status) => {
    console.log('Geocoder status:', status); // Hata ayýklama için
    if (status === 'OK') {
        if (results[0]) {
          const city = results[0].address_components.find(component =>
            component.types.includes('locality') || component.types.includes('administrative_area_level_1')
          ).long_name;
          await this.getWeather(city);
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  },

  async getWeather(city) {
  try {
    console.log(`Fetching weather for: ${city}`); // Hata ayýklama için
    const response = await axios.get(`http://localhost:3000/hava-durumu?konum=${city}`);
    console.log('Weather data received:', response.data); // Hata ayýklama için
    this.weatherInfo = response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error); // Hata ayýklama için
  }
},


    handleSearch() {
      if (this.searchQuery) {
        this.showLocationOnMap(this.searchQuery);
      }
    }
  },
  computed: {
  displayWeatherInfo() {
    if (this.weatherInfo && this.weatherInfo.main && this.weatherInfo.weather) {
      const temp = this.weatherInfo.main.temp;
      const description = this.weatherInfo.weather[0].description;
      return `Sicaklik: ${temp} Derece, Hava Durumu: ${description}`;
    } else {
      // Veri henüz yüklenmediyse veya tanýmlý deðilse
      return 'Hava durumu bilgisi yükleniyor...';
    }
  }
},
};
</script>
<style>
.search-input {
  margin-top: 50px;
  
  
}
.weather-info {
  margin-top: 10px;
  padding: 5px;
  background-color: #ffffff;
  border-radius: 5px;
}
</style>