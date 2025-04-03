document.getElementById("detect-esp32-btn").addEventListener("click", async function () {
    console.log("Bouton Détecter ESP32 cliqué !");
});

document.getElementById("select-port-btn").addEventListener("click", async function () {
    console.log("Bouton Sélectionner un port cliqué !");
    await requestSerialPort();
});

async function detectESP32() {
    document.getElementById("esp32-port").textContent = "Détection en cours...";
    try {
        if (!("serial" in navigator)) {
            throw new Error("Web Serial API non supportée.");
        }
        const ports = await navigator.serial.getPorts();
        if (ports.length > 0) {
            document.getElementById("esp32-port").textContent = "ESP32 détecté sur un port série.";
        } else {
            document.getElementById("esp32-port").textContent = "Aucun ESP32 détecté.";
        }
    } catch (error) {
        console.error("Erreur lors de la détection :", error);
        document.getElementById("esp32-port").textContent = "Erreur de détection.";
    }
}

async function requestSerialPort() {
    try {
        if (!("serial" in navigator)) {
            throw new Error("Web Serial API non supportée.");
        }
        console.log("Demande de sélection du port série...");
        const port = await navigator.serial.requestPort();
        console.log("Port sélectionné :", port);
        document.getElementById("esp32-port").textContent = "Port sélectionné avec succès.";
        await detectESP32();
    } catch (error) {
        console.error("Erreur :", error);
        document.getElementById("esp32-port").textContent = "Aucun port sélectionné.";
    }

}
async function getDataFromESP32() {
    try {
        if (!("serial" in navigator)) {
            throw new Error("Web Serial API non supportée.");
        }
        console.log("Récupération des données depuis l'ESP32...");
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });

        const reader = port.readable.getReader();
        const decoder = new TextDecoderStream();
        port.readable.pipeTo(decoder.writable);
        const inputStream = decoder.readable.getReader();

        let data = "";
        while (true) {
            const { value, done } = await inputStream.read();
            if (done) {
                break;
            }
            data += value;
        }

        reader.releaseLock();
        inputStream.releaseLock();
        await port.close();

        console.log("Données reçues :", data);
        document.getElementById("esp32-data").textContent = data;
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        document.getElementById("esp32-data").textContent = "Erreur de récupération des données.";
    }
}

async function getRFIDData() {
    try {
        if (!("serial" in navigator)) {
            throw new Error("Web Serial API non supportée.");
        }
        console.log("Récupération des données RFID...");
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });

        const reader = port.readable.getReader();
        const decoder = new TextDecoderStream();
        port.readable.pipeTo(decoder.writable);
        const inputStream = decoder.readable.getReader();

        let rfidData = "";
        while (true) {
            const { value, done } = await inputStream.read();
            if (done) {
                break;
            }
            rfidData += value;
        }

        reader.releaseLock();
        inputStream.releaseLock();
        await port.close();

        console.log("Données RFID reçues :", rfidData);
        document.getElementById("rfid-data").textContent = rfidData;
    } catch (error) {
        console.error("Erreur lors de la récupération des données RFID :", error);
        document.getElementById("rfid-data").textContent = "Erreur de récupération des données RFID.";
    }
}

document.getElementById("get-rfid-btn").addEventListener("click", async function () {
    console.log("Bouton Récupérer RFID cliqué !");
    await getRFIDData();
});

document.getElementById("get-data-btn").addEventListener("click", async function () {
    console.log("Bouton Récupérer données ESP32 cliqué !");
    await getDataFromESP32();
});
async function pickUpRFIDTag() {
    try {
        if (!("serial" in navigator)) {
            throw new Error("Web Serial API non supportée.");
        }
        console.log("Lecture du tag RFID...");
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });

        const reader = port.readable.getReader();
        const decoder = new TextDecoderStream();
        port.readable.pipeTo(decoder.writable);
        const inputStream = decoder.readable.getReader();

        let rfidTag = "";
        while (true) {
            const { value, done } = await inputStream.read();
            if (done) {
                break;
            }
            rfidTag += value;
        }

        reader.releaseLock();
        inputStream.releaseLock();
        await port.close();

        console.log("Tag RFID récupéré :", rfidTag);
        document.getElementById("rfid-tag").textContent = rfidTag;
    } catch (error) {
        console.error("Erreur lors de la lecture du tag RFID :", error);
        document.getElementById("rfid-tag").textContent = "Erreur de lecture du tag RFID.";
    }
}

document.getElementById("pick-rfid-btn").addEventListener("click", async function () {
    console.log("Bouton Lire Tag RFID cliqué !");
    await pickUpRFIDTag();
});