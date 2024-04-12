import axios from 'axios';

const baseURL = 'https://be.worldland.foundation';
const secondaryURL = 'http://13.124.47.191:3001';

const token = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
export const provider = axios.create({ baseURL });
export const secondaryProvider = axios.create({ baseURL: secondaryURL });
