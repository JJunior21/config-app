import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function IndexScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checarPermissao() {
      try {
        const token = await AsyncStorage.getItem('@minha_cidade_token');
        const role = await AsyncStorage.getItem('@minha_cidade_role');

        if (!token) {
          // Se não houver token, direciona para a tela de login
          router.replace('/login');
          return;
        }

        // Direcionamento restrito baseado na role ('admin' ou 'user')
        if (role === 'admin') {
          router.replace('/(admin)/dashboard');
        } else {
          router.replace('/(morador)/home');
        }
      } catch (error) {
        console.error('Erro ao verificar credenciais:', error);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    }

    checarPermissao();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0284C7" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
});