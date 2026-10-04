import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function MoradorDashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel do Morador</Text>
      <Text style={styles.subtitle}>Portal de zeladoria urbana</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/(morador)/historico')}
      >
        <Text style={styles.buttonText}>📜 Ver Histórico</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/(morador)/edit-profile')}
      >
        <Text style={styles.buttonText}>👤 Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.backButton]} 
        onPress={() => router.replace('/')}
      >
        <Text style={styles.buttonText}>⬅️ Voltar ao Início</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981', 
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 32,
  },
  button: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#10B981', 
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2, 
  },
  backButton: {
    backgroundColor: '#64748B', 
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
