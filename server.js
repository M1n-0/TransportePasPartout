const { SerialPort } = require('serialport');
const { WebSocketServer } = require('ws');

const port = new SerialPort({
    path: 'COM5', // Remplace par le bon port (ex: COM3 sous Windows)
    baudRate: 115200
});

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws) => {
    console.log('Client WebSocket connecté');

    port.on('data', (data) => {
        const uuid = data.toString().trim();
        console.log('UUID reçu:', uuid);
        ws.send(uuid); // Envoie l'UUID au client WebSocket
    });
});

console.log('Serveur WebSocket démarré sur ws://localhost:3000');