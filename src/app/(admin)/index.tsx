import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel Administrativo</Text>
      <Text style={styles.subtitle}>Selecione uma opção para gerir</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/(admin)/configuracao')}
      >
        <Text style={styles.buttonText}>⚙️️ Configurações</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/(admin)/gerir-categorias')}
      >
        <Text style={styles.buttonText}>📁 Gerir Categorias</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/(admin)/editar-senha')}
      >
        <Text style={styles.buttonText}>🔒 Editar Senha</Text>
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
    color: '#0F172A',
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
    backgroundColor: '#0284C7',
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
