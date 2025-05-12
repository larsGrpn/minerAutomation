import axios from "axios";

const sonne = false

token = '5b281acc-de86-41bb-b14d-e266d9c9edbd';
//Deklaration der IP-Adressen der Miner


//Variablendefinition
let leistung = 0;
let volt = 0;
let momentaneHashrate = 0;

maximaleLeistung = 2000;
maximaleSpannung = 1000;

//Schrittweite
const leistungsschritt = 100;
const voltschritt = 10;

let datenerfassung =[Leistung, volt, hashrate];

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function hashrateAbfragen(minerID){
    axios.get(`https://10.10.0.${minerID}/api/hashrate`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        let hashrate = response.data.hashrate;
        console.log(`Hashrate für Miner ${minerID}: ${hashrate}`);
    })
    .catch(error => {
        console.error(`Fehler beim Abrufen der Hashrate für Miner ${minerID}:`, error);
    });
    return hashrate;
}
function parameterEinstellen(minerID, leistung, volt){
    axios.post(`https://10.10.0.${minerID}/api/clock/update`, {
        headers:{
            'Authorization': `Bearer ${token}`,
        },
        body:{
            'offset' : leistung,
        }
    });
    axios.post(`https://10.10.0.${minerID}/api/voltage/update`, {
        headers:{
            'Authorization': `Bearer ${token}`,
        },
        body:{
            'offset' : volt,
        }
    });
    return

}
    

function ermittlungStarten(minerID){
    //Hier wird die Logik für die Ermittlung der Leistung gestartet
    console.log(`Starte Leistungswert ermittlung für Miner ${minerID}`);
    
    //Hier wird die Logik für die Ermittlung der Leistung implementiert#
    parameterEinstellen(minerID, 0, 0);
    while(leistung < maximaleLeistung && volt < maximaleSpannung){
        timeout(360000);
        momentaneHashrate = hashrateAbfragen(minerID);
        datensatz = [leistung, volt, momentaneHashrate];
        console.log(`Leistungswert: ${leistung}, Spannung: ${volt}, Hashrate: ${momentaneHashrate}`);
        datenerfassung.push(datensatz);
        volt += voltschritt;
        leistung += leistungsschritt;
        parameterEinstellen(minerID, leistung, volt);

    }
    größterIndex = 0;
    for (let i = 0; i < datenerfassung.length; i++) {
        console.log(`Datensatz ${i}: Leistungswert: ${datenerfassung[i][0]}, Spannung: ${datenerfassung[i][1]}, Hashrate: ${datenerfassung[i][2]}`);
        if (datenerfassung.get)
    }
    


    
    //Hier wird die Logik für die Ermittlung der Leistung beendet
    console.log(`Leistungswert ermittlung für Miner ${minerID} beendet`);
}