import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('minerwerte.db', (err) => {
    if (err) {
        console.error('Fehler beim Öffnen der Datenbank:', err.message);
    } else {
        console.log('Verbunden mit der SQLite-Datenbank.');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS minerwerte (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        miner_id INTEGER,
        leistung INTEGER,
        spannung INTEGER,
        hashrate INTEGER,
        bereitsGetestet BOOLEAN,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Fehler beim Erstellen der Tabelle:', err.message);
        } else {
            console.log('Tabelle minerwerte wurde erstellt oder existiert bereits.');
        }
    });
}
);

const insertMinerwerte = (miner_id, leistung, spannung, hashrate, bereitsGetestet) => {
    const sql = `INSERT INTO minerwerte (miner_id, leistung, spannung, hashrate, bereitsGetestet) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [miner_id, leistung, spannung, hashrate, bereitsGetestet], function(err) {
        if (err) {
            console.error('Fehler beim Einfügen der Daten:', err.message);
        } else {
            console.log(`Daten für Miner ${miner_id} erfolgreich eingefügt.`);
        }
    });
}
const checkIfMinerAlreadyTested = (miner_id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT bereitsGetestet FROM minerwerte WHERE miner_id = ? ORDER BY timestamp DESC LIMIT 1`;
        db.get(sql, [miner_id], (err, row) => {
            if (err) {
                console.error('Fehler beim Abfragen der Daten:', err.message);
                reject(err);
            } else {
                resolve(row ? row.bereitsGetestet : null);
            }
        });
    });
}
const getMinerWerte = (miner_id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM minerwerte WHERE miner_id = ? ORDER BY timestamp DESC LIMIT 1`;
        db.get(sql, [miner_id], (err, row) => {
            if (err) {
                console.error('Fehler beim Abfragen der Daten:', err.message);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}
const getVoltage = (miner_id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT spannung FROM minerwerte WHERE miner_id = ? ORDER BY timestamp DESC LIMIT 1`;
        db.get(sql, [miner_id], (err, row) => {
            if (err) {
                console.error('Fehler beim Abfragen der Daten:', err.message);
                reject(err);
            } else {
                resolve(row ? row.spannung : null);
            }
        });
    });
}
const getLeistung = (miner_id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT leistung FROM minerwerte WHERE miner_id = ? ORDER BY timestamp DESC LIMIT 1`;
        db.get(sql, [miner_id], (err, row) => {
            if (err) {
                console.error('Fehler beim Abfragen der Daten:', err.message);
                reject(err);
            } else {
                resolve(row ? row.leistung : null);
            }
        });
    });
}



export { db, insertMinerwerte, checkIfMinerAlreadyTested, getMinerWerte, getVoltage, getLeistung };