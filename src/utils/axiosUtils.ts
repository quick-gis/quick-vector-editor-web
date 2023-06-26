import axios from 'axios';

export function BgAxios() {
  return axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 1000,
    headers: {}
  });
}
