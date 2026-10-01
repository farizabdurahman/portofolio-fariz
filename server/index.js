// server/index.js
// Entry point backend. Menyajikan REST API (/api/*) dan file statis frontend (/public).

const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// REST API
app.use('/api', apiRoutes);

// Frontend statis
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
app.use(express.static(PUBLIC_DIR));

// Fallback: semua route non-API mengarah ke index.html (single page site)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Portfolio server jalan di: http://localhost:${PORT}\n`);
  });
}