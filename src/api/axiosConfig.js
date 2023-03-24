import axios from 'axios';

export default axios.create({
    baseURL: "http:localhost:8080/movies",
    headers: {"ngrok-skip-browser-warning" : "true"}
})