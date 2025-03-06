import axios from 'axios';

//Deklaration des API-Tokens
const token = '5b281acc-de86-41bb-b14d-e2666d9c9edbd';

//Deklaration der IP-Adressen der Miner
const miner = ['10.10.0.21', '10.10.0.22', '10.10.0.23', '10.10.0.24', '10.10.0.25', '10.10.0.26', '10.10.0.27'];

//Auswertungslogik Solar API

//Ansteuerung der Miner

for (let i = 0; i < miner.length; i++) {
    await axios({
        url: `https://${miner[i]}/api/users/list`,
        method: 'POST',
        verify_ssl: false,
        headers: {'Authorization': `Bearer ${token}`}
    })
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log("Miner " + (i + 1) + ': ' + error);
    });
} 
