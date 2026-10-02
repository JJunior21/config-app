import * as Location from 'expo-location';
import api from './api'; // Importa a instância do axios que configuramos antes

export async function enviarOcorrencia(description: string, categoryId: number) {
  // 1. Pede permissão e captura a localização atual do celular
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permissão de localização negada.');
  }

  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  // 2. Envia os dados estruturados para a API do backend
  const response = await api.post('/issues', {
    description,
    category_id: categoryId,
    latitude,
    longitude,
  });

  return response.data;
}