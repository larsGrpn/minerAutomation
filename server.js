import axios from 'axios';
import {ermittlungStarten} from './leistungsermittlung.js';
import express from 'express';

//Deklaration des Express-Servers
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const miner = [23,24,25,26,27];

app.post('/sonne', async (req, res) => {
    const {watt} = req.body;
    let anzahlMiner = watt / 500;
    console.log(watt);
    console.log(Math.floor(anzahlMiner), 'Miner werden jetzt gestartet');
    for (let i = 0; i < Math.floor(anzahlMiner); i++) {
       await ermittlungStarten(miner[i]);
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