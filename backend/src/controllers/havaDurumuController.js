const havaDurumuService = require('../services/havaDurumuService');

const getHavaDurumu = async (req, res) => {
  try {
    const { konum } = req.query;
    if (!konum) {
      return res.status(400).json({ error: 'Lütfen bir konum girin.' });
    }
    const weatherData = await havaDurumuService.getWeatherData(konum);
    res.json(weatherData); // Veriyi JSON olarak gönder
  } catch (error) {
    res.status(500).json({ error: 'Hava durumu alýnamadý.' });
  }
};

module.exports = {
  getHavaDurumu,
};