import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({
  // ATENÇÃO AQUI:
  // - Use 'http://localhost:3000' se estiver testando no EMULADOR no PC.
  // - Use 'http://IP_DO_COMPUTADOR:3000' (ex: http://192.168.1.50:3000) se for testar no CELULAR FÍSICO.
  baseURL: 'http://localhost:3000', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@minha_cidade_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao recuperar token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;