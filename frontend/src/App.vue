<template>
 <h2 class="page-title">Haritalar</h2>
  
  <input type="text" v-model="searchQuery" placeholder="Arama yapın" @change="handleSearch" class="search-input" />
   
  <p id="demo"></p>
  <div id="app">
    <MapComponent @map-loaded="handleMapLoaded" />
    <div v-if="!mapLoaded">Harita yükleniyor...</div>
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
      searchQuery: 'Arama' // Arama sorgusu için bir veri alanı ekleyin
    };
  },
  methods: {
    handleMapLoaded(status) {
      this.mapLoaded = status;
    },
    handleSearch() {
      // Arama işlemleri burada gerçekleştirilebilir
      console.log('Aranan: ', this.searchQuery);
       // Burada Google APIs veya diğer servislerde bu arama sorgusunu kullanabilirsiniz
    // Örneğin, Google APIs ile bir yer araması yapabilirsiniz
    // const aramaSonucu = GoogleAPI.ara(this.searchQuery);
    }
  }
}
</script>

<style>
body {
  /* Arka plana PNG resmi ekleme */
  background-image: url('./assets/ArkaPlan.jpeg'); /* PNG dosyasının yolunu buraya ekleyin */
  background-size: cover; /* Resmin ekran boyutuna sığması için */
  /* İstenilen diğer stiller */
  .search-input {
  font-size: 20px; /* Font büyüklüğü */
  width: 300px; /* Genişlik */
  height: 40px; /* Yükseklik */
  /* İstenilen diğer stiller */
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
  font-size: 40px; /* Başlık font büyüklüğü */
  font-weight: bold; 
}

.map-container .map {
  height: 600px; /* Or your preferred size */
  width: 100%;
}
</style>
