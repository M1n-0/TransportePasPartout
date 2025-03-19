document.getElementById("detect-btn").addEventListener("click", async () => {
    try {
        const ports = await navigator.serial.getPorts();
        
        if (ports.length === 0) {
            document.getElementById("esp32-port").textContent = "Aucun ESP32 détecté";
            return;
        }

        document.getElementById("esp32-port").textContent = "ESP32 connecté sur un port";
    } catch (error) {
        console.error("Erreur de détection :", error);
        document.getElementById("esp32-port").textContent = "Erreur lors de la détection";
    }
});
