import axios from 'axios';


axios.post('http://localhost:1447/sonne', {
    watt:500,
}).then(response => {
    console.log('Response from server:', response.data);
}
).catch(error => {
    console.error('Error during request:', error);
});