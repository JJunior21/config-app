import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export async function realizarLogin(email: string, password: string) {
  // Faz a requisição para a rota de login do backend
  const response = await api.post('/auth/login', { email, password });
  
  // O backend retorna o token e o objeto do usuário contendo o 'role' ('admin' ou 'user')
  const { token, user } = response.data;

  // Salva no armazenamento seguro do dispositivo
  await AsyncStorage.setItem('@minha_cidade_token', token);
  await AsyncStorage.setItem('@minha_cidade_role', user.role); 

  return user.role; // Retorna o perfil para o componente decidir a navegação
}