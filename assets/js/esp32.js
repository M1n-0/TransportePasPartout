async function fetchESP32Port() {
    try {
        const response = await fetch('/esp32-port');
        const data = await response.json();
        document.getElementById('esp32-port').textContent = `Port ESP32 : ${data.port}`;
    } catch (error) {
        document.getElementById('esp32-port').textContent = "Erreur lors de la récupération du port.";
        console.error("Erreur:", error);
    }
}

setInterval(fetchESP32Port, 5000);
fetchESP32Port();
