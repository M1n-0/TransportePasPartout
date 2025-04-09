let port;
let reader;

document.getElementById("select-port-btn").addEventListener("click", async () => {
    try {
        port = await navigator.serial.requestPort();
        await port.open({
            baudRate: 9600,
        });

        // Laisser un petit délai pour que l'ESP32 finisse son reset
        await new Promise(resolve => setTimeout(resolve, 500));

        const decoder = new TextDecoderStream();
        const inputDone = port.readable.pipeTo(decoder.writable);
        const inputStream = decoder.readable;
        reader = inputStream.getReader();

        document.getElementById("esp32-port").textContent = "Port ouvert avec succès.";
    } catch (err) {
        if (err.name === "NotFoundError") {
            document.getElementById("esp32-port").textContent = "Aucun port sélectionné.";
        } else {
            console.error("Erreur ouverture port :", err);
            document.getElementById("esp32-port").textContent = "Erreur : " + err.message;
        }
    }
});

document.getElementById("get-rfid-btn").addEventListener("click", async () => {
    try {
        if (!reader) {
            document.getElementById("rfid-data").textContent = "Le port n'est pas prêt.";
            return;
        }

        let uid = null;
        while (!uid) {
            try {
                const { value, done } = await reader.read();
                if (done || !value) break;

                const text = value.trim();
                const uidLine = text.split('\n').find(line => line.includes("Card UID:"));
                if (uidLine) {
                    uid = uidLine.replace("Card UID:", "").trim();
                    document.getElementById("rfid-data").textContent = uid;
                    console.log("UID RFID extrait :", uid);
                    break;
                } else {
                    console.log("Texte reçu, mais pas d'UID trouvé :", text);
                }
            } catch (innerErr) {
                if (innerErr.name === "BreakError") {
                    console.warn("Break reçu. On ignore et on continue...");
                    continue;
                } else {
                    throw innerErr;
                }
            }
        }

        if (!uid) {
            document.getElementById("rfid-data").textContent = "UID non détecté.";
        }
    } catch (err) {
        console.error("Erreur lecture RFID :", err);
        document.getElementById("rfid-data").textContent = "Erreur : " + err.message;
    }
});
