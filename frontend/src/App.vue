<template>
 <h2 class="page-title">Project Maps</h2>
  
   
  <p id="demo"></p>
  <div id="app">
    <MapComponent @map-loaded="handleMapLoaded" />
    <div v-if="!mapLoaded">Harita yukleniyor...</div>
  </div>
</template>

<script>
import MapComponent from './components/MapComponent.vue'

export default {
  name: 'App',
  components: {
    MapComponent
  },
  data() {
    return {
      mapLoaded: false,
      searchQuery: '' 
    };
  },
  methods: {
    handleMapLoaded(status) {
      this.mapLoaded = status;
    },
    handleSearch() {
     
      console.log('Aranan: ', this.searchQuery);
      
      const location = this.searchQuery;


this.$refs.mapComponent.showLocationOnMap(location);   }
  }
}
</script>

<style>
body {
 
  background-image: url('./assets/ArkaPlan.jpg'); 
  background-size: cover; 
 
  .search-input {
  font-size: 20px; 
  width: 300px;
  height: 40px; 

  border-radius: 10px;
}}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.page-title {
  font-size: 40px; 
  font-weight: bold; 
}

.map-container .map {
  height: 600px; 
  width: 100%;
}
</style>
