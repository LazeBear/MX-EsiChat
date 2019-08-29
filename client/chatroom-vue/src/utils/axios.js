import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.VUE_APP_SOCKET_URL + '/api',
  timeout: 60000
});

export default instance;
