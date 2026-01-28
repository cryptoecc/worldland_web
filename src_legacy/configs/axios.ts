import axios from 'axios';

const baseURL = 'https://be.worldland.foundation';

const token = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
export const provider = axios.create({ baseURL });
