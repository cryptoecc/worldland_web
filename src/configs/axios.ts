import axios from 'axios';

const baseURL = 'http://192.168.100.8:4000';

export const provider = axios.create({ baseURL });
