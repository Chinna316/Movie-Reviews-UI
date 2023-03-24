import axios from 'axios';

export default axios.create({
    baseURL: 'http:localhost:8080/Movies',
    headers: {'ngrok-skip-browser-warning' : 'true'}
})