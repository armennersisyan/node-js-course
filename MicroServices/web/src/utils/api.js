import axios from 'axios';

export default axios.create({
  baseURL: process.env.REACT_APP_URL || 'http://localhost:3004/api/1'
});
