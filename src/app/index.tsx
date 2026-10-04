import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function IndexScreen() {
  const router = useRouter();
  
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkUserSession() {
      try {
        const token = await AsyncStorage.getItem('@minha_cidade_token');

        if (token) {
          router.replace('/(admin)/configuracao');
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        console.error('Erro ao verificar a sessão:', error);
        setIsChecking(false);
      }
    }

    checkUserSession();
  }, []);

  if (isChecking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0284C7" />
        <Text style={styles.loadingText}>Verificando acesso oficial...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modo de Desenvolvimento</Text>
      <Text style={styles.subtitle}>
        Login oficial não detetado. Escolha qual painel deseja testar e visualizar agora:
      </Text>

      <TouchableOpacity 
        style={[styles.button, styles.adminButton]} 
        onPress={() => router.replace('/(admin)')}
      >
        <Text style={styles.buttonText}>Entrar no Painel Admin</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.moradorButton]} 
        onPress={() => router.replace('/(morador)')}
      >
        <Text style={styles.buttonText}>Entrar no App do Morador</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  button: {
    width: '100%',
    maxWidth: 350,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2, 
  },
  adminButton: {
    backgroundColor: '#0284C7',
  },
  moradorButton: {
    backgroundColor: '#10B981', 
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
