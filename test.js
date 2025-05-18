import axios from "axios";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

dotenv.config(); // Lade Umgebungsvariablen aus der .env-Datei

// Boolesche Variable, die anzeigen könnte, ob die Sonne verfügbar ist (hier auf false gesetzt)
const sonne = false;

// Authentifizierungstoken für API-Zugriffe
const token = process.env.TOKEN;

// Deklaration bzw. Definition der IP-Adressen der Miner
// (Die konkreten IP-Adressen werden hier nicht angegeben)

// Variablendefinitionen mit Anfangswerten

const maximaleLeistung = 0; // Maximale Leistung, die erreicht werden soll
const maximaleSpannung = 0; // Maximale Spannung, die erreicht werden soll

// Schrittweiten für die Erhöhung von Leistung und Spannung
const leistungsschritt = 100; // Erhöhung der Leistung pro Schritt
const voltschritt = 10; // Erhöhung der Spannung pro Schritt

// Funktion, um eine Verzögerung zu erzielen (als Promise)
// ms: Zeit in Millisekunden
async function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Funktion für die Ab

axios.get(`https://10.10.0.24/api/timeseries?series=hashrate`, {
    headers: {
        'Authorization': `Bearer ${token}`
    },
    httpsAgent: httpsAgent // Verwendung des HTTPS-Agenten, um unsichere Zertifikate zu akzeptieren
})
.then(response => {
    // Extrahiere die Hashrate aus der Response und gebe sie aus
    fs.writeFile('test.txt', JSON.stringify(response.data), (err) => {
        if (err) {
            console.error('Fehler beim Schreiben der Datei:', err);
        } else {
            console.log('Daten erfolgreich in test.txt geschrieben');
        }
    }
    

);
    const data = response.data;
    let hashrate = data.series[data.series.length - 1];
    console.log(`Hashrate für Miner 1: ${hashrate}`);
    // Hier können Sie die Hashrate weiterverarbeiten oder speichern
})
.catch(error => {
    // Fehlerbehandlung: Ausgabe einer Fehlermeldung, falls die Anfrage fehlschlägt
    console.error(`Fehler beim Abrufen der Hashrate für Miner 1:`, error);
});