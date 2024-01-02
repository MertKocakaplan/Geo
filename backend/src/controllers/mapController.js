const axios = require('axios');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const getGeocode = async (req, res) => {
  try {
    const { address } = req.query;
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error in getGeocode:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

module.exports = { getGeocode };