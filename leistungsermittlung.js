// Importiere das axios Modul für HTTP-Anfragen
import axios from "axios";
import dotenv from "dotenv";
import https from "https";
import { insertMinerwerte } from "./database.js";

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

const maximaleLeistung = 150; // Maximale Leistung, die erreicht werden soll
const maximaleSpannung = 75; // Maximale Spannung, die erreicht werden soll

// Schrittweiten für die Erhöhung von Leistung und Spannung
const leistungsschritt = 5; // Erhöhung der Leistung pro Schritt
const voltschritt = 2; // Erhöhung der Spannung pro Schritt

// Funktion, um eine Verzögerung zu erzielen (als Promise)
// ms: Zeit in Millisekunden
async function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Funktion für die Abfrage der Hashrate eines Miners
function hashrateAbfragen(minerID){
    // Sende eine GET-Anfrage an die API des Miners, um die Hashrate zu erhalten
    axios.get(`https://10.10.0.24/api/timeseries?series=hashrate`, {
      headers: {
          'Authorization': `Bearer ${token}`
      },
      httpsAgent: httpsAgent // Verwendung des HTTPS-Agenten, um unsichere Zertifikate zu akzeptieren
  })
    .then(response => {
        // Extrahiere die Hashrate aus der Response und gebe sie aus
        const data = response.data;
    let hashrate = data.series[data.series.length - 1];
    console.log(`Hashrate für Miner 1: ${hashrate}`);
    })
    .catch(error => {
        // Fehlerbehandlung: Ausgabe einer Fehlermeldung, falls die Anfrage fehlschlägt
        console.error(`Fehler beim Abrufen der Hashrate für Miner ${minerID}:`, error);
    });
    // Rückgabe der Hashrate (Hinweis: Diese Rückgabe erfolgt synchron, obwohl die Anfrage asynchron ist)
    return hashrate;
}

// Funktion zum Einstellen der Parameter (Leistung und Spannung) eines Miners
export function parameterEinstellen(minerID, leistung, volt){
    // Sende eine POST-Anfrage, um den Leistungswert (offset) zu aktualisieren
    axios.get(`https://10.10.0.${minerID}/api/clock/update`,
      {
        params: {offset: leistung}, 
        headers:{
            'Authorization': `Bearer ${token}`,  // Authentifizierung via Token
        },
        httpsAgent: httpsAgent, // Verwendung des HTTPS-Agenten, um unsichere Zertifikate zu akzeptieren
        
    });
    // Sende eine POST-Anfrage, um den Spannungswert (offset) zu aktualisieren
    axios.post(`https://10.10.0.${minerID}/api/voltage/update`,
      {params: {offset: volt}, 
        headers:{
            'Authorization': `Bearer ${token}`,  // Authentifizierung via Token
        },
        httpsAgent: httpsAgent, // Verwendung des HTTPS-Agenten, um unsichere Zertifikate zu akzeptieren
    });
    return;
}
    
// Exportierte Funktion, welche die Ermittlung der optimalen Leistungsparameter startet
export async function ermittlungStarten(minerID) {
  let leistung = 0; // Aktueller Leistungswert
  let volt = 0; // Aktueller Spannungswert
  let momentaneHashrate = 0;
  let hashrate = 0; // Aktuelle Hashrate (wird später aktualisiert)

  let größterIndex = 0; //, sonne Index des besten Datensatzes
  // Array zur Datenerfassung; initial mit den Startwerten (Achtung: "Leistung" und "hashrate" müssten definiert sein)
  let datenerfassung = [leistung, volt, hashrate];

  // Ausgabe, dass die Leistungswert-Ermittlung gestartet wird
  console.log(`Starte Leistungswert ermittlung für Miner ${minerID}`);

  // Setze initiale Parameter beim Miner auf 0
  parameterEinstellen(minerID, 0, 0);

  // Schleife: Erhöhe Leistung und Spannung solange, bis eines der Maximalwerte erreicht ist
  while (leistung < maximaleLeistung && volt < maximaleSpannung) {
    // Warte 360000 ms (6 Minuten)
    await timeout(30000);

    // Frage die aktuelle Hashrate des Miners ab
    momentaneHashrate = hashrateAbfragen(minerID);

    // Erstelle einen Datensatz mit den aktuellen Werten
    let datensatz = [leistung, volt, momentaneHashrate];

    // Ausgabe der aktuellen Parameter im Log
    console.log(
      `Leistungswert: ${leistung}, Spannung: ${volt}, Hashrate: ${momentaneHashrate}`
    );

    // Füge den aktuellen Datensatz der Datenerfassung hinzu
    datenerfassung.push(datensatz);

    // Erhöhe Spannung und Leistung um ihre definierten Schrittwerte
    volt += voltschritt;
    leistung += leistungsschritt;

    // Aktualisiere die Parameter des Miners mit den neuen Werten
    parameterEinstellen(minerID, leistung, volt);
  }

  // Initialisiere den Index, der den besten Datensatz repräsentiert
  größterIndex = 0;

  // Sortiere die erfassten Datensätze nach dem Verhältnis (Hashrate pro Watt)
  datenerfassung.sort((a, b) => a[2] - b[2]);

  // Durchsuche das Array, um den Datensatz mit dem höchsten Verhältnis zu finden
  for (let i = 0; i < datenerfassung.length; i++) {
    if (datenerfassung[i][2] > datenerfassung[größterIndex][2]) {
      größterIndex = i;
    }
  }

  console.log(`Leistungswert ermittlung für Miner ${minerID} beendet`);

  // Rückgabe des Datensatzes mit dem optimalen Hashrate/Leistung-Verhältnis
  insertMinerwerte(
    minerID,
    datenerfassung[größterIndex][0],
    datenerfassung[größterIndex][1],
    datenerfassung[größterIndex][2],
    true
  );
}
