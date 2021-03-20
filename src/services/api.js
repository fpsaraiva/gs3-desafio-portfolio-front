import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gs3-desafio-portfolio-back.herokuapp.com',
});

export default api;
