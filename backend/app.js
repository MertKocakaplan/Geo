const express = require('express');
const cors = require('cors');
const mapController = require('./controllers/mapController');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

app.get('/api/geocode', mapController.getGeocode);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});