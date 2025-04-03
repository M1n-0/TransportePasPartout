const { SerialPort } = require('serialport');

const port = new SerialPort({
    path: 'COM5', // Remplace par le bon port (ex: COM3 sous Windows)
    baudRate: 115200
});

port.on('open', () => {
    console.log('Port série ouvert.');
});

port.on('data', (data) => {
    const uuid = data.toString().trim();
    console.log('UUID reçu:', uuid);
    // Tu peux envoyer cet UUID à ton extension ou à ton gestionnaire de mots de passe
});

port.on('error', (err) => {
    console.error('Erreur du port série:', err);
});
