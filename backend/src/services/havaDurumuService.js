const axios = require('axios');
const apiKey = 'abce97c4fcf3852634e7cc8f9fbdb2f1'; 

const getWeatherData = async (konum) => {
  const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${konum}&appid=${apiKey}&units=metric`);
  return weatherResponse.data;
};

module.exports = {
  getWeatherData,
};