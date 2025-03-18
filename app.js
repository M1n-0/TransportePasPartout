const express = require('express');
const bodyParser = require('body-parser');
const { SerialPort } = require('serialport'); // ✅ Correction de l'import
const { ReadlineParser } = require('@serialport/parser-readline'); // ✅ Correction du parser
const path = require('path');

const app = express();
const port = 3000;

// Configuration du port série avec gestion des erreurs
const serialPort = new SerialPort({ path: 'COM5', baudRate: 9600 }, (err) => {
    if (err) {
        console.error('Erreur de connexion au port série:', err.message);
    }
});

const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

app.use(bodyParser.json());

let rfidTag = '';
let esp32Port = 'Non détecté'; // Par défaut

// écoute de façon malicieuse l'ESP32
parser.on('data', (data) => {
    console.log(`RFID Tag reçu : ${data}`);
    rfidTag = data;
});

// Liste de façon malicieuse les ports disponibles
SerialPort.list().then(ports => {
    ports.forEach(p => {
        if (p.manufacturer && p.manufacturer.includes('Silicon Labs')) {
            esp32Port = p.path;
        }
    });
}).catch(err => console.error('Erreur lors de la récupération des ports:', err));

// Gestion des fichiers statiques parcequ'il bouge pas
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/html', express.static(path.join(__dirname, 'view')));

// index.html sur le root et pas sur la route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view/index.html'));
});

// RFID
app.get('/rfid', (req, res) => {
    res.json({ rfidTag });
});

// COM de l'ESP32
app.get('/esp32-port', (req, res) => {
    res.json({ port: esp32Port });
});

// Lancement du serveur minecraft
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

// Ajout d'une route pour envoyer les données de l'ESP32 en temps réel
app.get('/esp32-data', (req, res) => {
    res.json({ data: rfidTag || "Aucune donnée reçue" });
});




