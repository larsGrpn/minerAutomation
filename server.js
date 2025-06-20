import axios from 'axios';
import {ermittlungStarten, parameterEinstellen} from './leistungsermittlung.js';
import express from 'express';
import { checkIfMinerAlreadyTested, getLeistung, getMinerWerte, getVoltage } from './database.js';
import { get } from 'http';

//Deklaration des Express-Servers
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
const miner = [22,23,24,25];
let aktiveErmittlung= [];

const minerStarten = (minerIndex) => {
    console.log('Miner ' + minerIndex + ' wird gestartet');
    const minerWerte = getMinerWerte(minerIndex);
    parameterEinstellen(minerWerte.id, minerWerte.leistung, minerWerte.volt);
    console.log('Miner ' + minerIndex + ' wurde gestartet');
}   

const TaskManager = (anzahlMiner) => {
    let kapazität = anzahlMiner;
    let minerIndex = 0;
    while (kapazität > 0) {
        if (!aktiveErmittlung.includes(miner[minerIndex])){
            
            if(checkIfMinerAlreadyTested(miner[minerIndex])){
                console.log('Miner ' + miner[minerIndex] + ' wurde bereits getestet');
                minerStarten(minerIndex);
                minerIndex++;
            }else {
                aktiveErmittlung.push(miner[minerIndex]);
                console.log('Miner ' + miner[minerIndex] + ' wird gestartet');
                ermittlungStarten(miner[minerIndex]);
                kapazität--;
            }
            
        }else {
            console.log('Miner ' + miner[minerIndex] + ' ist bereits aktiv');
            minerIndex++;
        }
    }
}

const voltzahlen = async (minerID) => {
    const volt = await getVoltage(minerID)
    console.log('Die Spannung beträgt: ' + volt);
    return volt || 0;
    
}

const leistungen = async (minerID) => {
    const leistung = await getLeistung(minerID)
    return leistung || 0;
   
}

app.post('/sonne', async (req, res) => {
    const {watt} = req.body;
    let anzahlMiner = watt / 500;
    console.log(watt);
    console.log(Math.floor(anzahlMiner), 'Miner werden jetzt gestartet');
    TaskManager(Math.floor(anzahlMiner));

    
    res.send('Leistungswert ermittlung gestartet');
});

app.post('/stop', async (req, res) => {
    miner.forEach((minerIndex) => {
        parameterEinstellen(minerIndex, 0, 0);
    });
    console.log('Alle Miner wurden gestoppt');
    // Leere das aktive Ermittlung Array
    aktiveErmittlung = [];
    console.log('Alle Miner wurden gestoppt');
    res.send('Alle Miner wurden gestoppt');
});

app.get('/', async (req, res) => {
    try{
    const promises = {
        miner23: { Volt: voltzahlen(23), Leistung: leistungen(23) },
        miner24: { Volt: voltzahlen(24), Leistung: leistungen(24) },
        miner25: { Volt: voltzahlen(25), Leistung: leistungen(25) },
        miner26: { Volt: voltzahlen(26), Leistung: leistungen(26) },
        miner27: { Volt: voltzahlen(27), Leistung: leistungen(27) },
    }
    const minerData = {
        miner23:{
            Volt: await promises.miner23.Volt,
            Leistung: await promises.miner23.Leistung
        },
        miner24:{
            Volt: await promises.miner24.Volt,
            Leistung: await promises.miner24.Leistung
        },
        miner25:{
            Volt: await promises.miner25.Volt,
            Leistung: await promises.miner25.Leistung
        },
        miner26:{
            Volt: await promises.miner26.Volt,
            Leistung: await promises.miner26.Leistung
        },
        miner27:{
            Volt: await promises.miner27.Volt,
            Leistung: await promises.miner27.Leistung
        }
    };
    res.render('miner.ejs', {
        title: 'Miner',
        miners: minerData
    }
    );
    } catch (error) {
        console.error('Fehler beim Abrufen der Miner-Daten:', error);
        res.status(500).send('Interner Serverfehler');
    }
});



app.listen(1443, () => {
    console.log('The Api-Server is running on port 1443');
})








