import axios from 'axios';

axios.post('/user', {}, {
    headers: '',
    proxy: {
        host: '',
        port: 33,
    },
})
    .then()
    .catch();
