import axios from 'axios';

import express from 'express';

//Deklaration des Express-Servers
const app = express();


app.post('/sonne', (req, res) => {
    const watt = req.body.watt;
    switch(watt) {
        case 500:
            console.log('Starte Leistungswert ermittlung für Miner 1');
            
            break;
        case 1000:
            console.log('1000 Watt');
            break;
        case 1500:
            console.log('1500 Watt');
            break;
        case 2000:
            console.log('2000 Watt');
            break;
        case 2500:
            console.log('2500 Watt');
            break;
}
    res.send('Leistungswert ermittlung gestartet');});


app.listen(3000, () => {
    console.log('The Api-Server is running on port 3000');
})








/*

const httpsAgent = new https.Agent({

    rejectUnauthorized: false,

 })

  axios.defaults.httpsAgent = httpsAgent


//Deklaration des API-Tokens
const token = '5b281acc-de86-41bb-b14d-e266d9c9edbd';

//Deklaration der IP-Adressen der Miner
const miner = ['10.10.0.22', '10.10.0.23', '10.10.0.24', '10.10.0.25', '10.10.0.26', '10.10.0.27'];

//Auswertungslogik Solar API

//Ansteuerung der Miner

for (let i = 0; i < miner.length; i++) {
    await axios({
        url: `http://10.10.0.22/api/fan`,
        method: 'GET',
        headers: {'Authorization' : `Bearer ${token}`}
    })
    .then(response => {
        console.log("Success: " );
    })
    .catch(error => {
        console.log("Miner " + (i + 1) + ': ' + error.message);
    });
} 
*/