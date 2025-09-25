import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,  // it means we are allowing cookies to be sent with requests
  headers: {
    'Content-Type': 'application/json'
  }
});


export default axiosClient;