<template>
    <div>
      <input type="text" v-model="address" @keyup.enter="searchAddress" placeholder="Adresi girin">
      <button @click="searchAddress">Ara</button>
      <div v-if="location">
        <p>Enlem: {{ location.lat }}</p>
        <p>Boylam: {{ location.lng }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        address: '',
        location: null
      };
    },
    methods: {
      async searchAddress() {
        try {
          const response = await fetch(`http://localhost:3000/api/geocode?address=${encodeURIComponent(this.address)}`);
          const data = await response.json();
          this.location = data.results[0].geometry.location;
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
  };
  </script>
  