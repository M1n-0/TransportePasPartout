const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Gestion des fichiers statiques parcequ'il bouge pas
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/html', express.static(path.join(__dirname, 'view')));

// index.html sur le root et pas sur la route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view/index.html'));
});

// RFID
app.get('/rfid', (req,/*kms*/ res) => {
    res.sendFile(path.join(__dirname, 'view/esp32.html'));
});

// Lancement du serveur minecraft
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
