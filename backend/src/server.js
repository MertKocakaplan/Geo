const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const havaDurumuRoutes = require('./routes/havaDurumuRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/hava-durumu', havaDurumuRoutes);
app.get('/', (req, res) => {
    res.send(`
      <h1>Hava Durumu Sorgusu</h1>
      <form action="/hava-durumu" method="get">
        <input type="text" name="konum" placeholder="Konum giriniz" required>
        <button type="submit">Hava Durumu Getir</button>
      </form>
    `);
  });
  
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda baslatiliyor`);
});