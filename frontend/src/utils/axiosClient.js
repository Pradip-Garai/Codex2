import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://codex3-puce.vercel.app/',
  withCredentials: true,  // it means we are allowing cookies to be sent with requests
  headers: {
    'Content-Type': 'application/json'
  }
});


export default axiosClient;