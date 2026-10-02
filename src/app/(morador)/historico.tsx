import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../../services/api';


interface Ocorrencia {
  id: string;
  titulo: string;
  categoria: string;
  status: string;
  data: string;
}

export default function HistoricoScreen() {
  const [historico, setHistorico] = useState<Ocorrencia[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Buscar dados no Back-end
  const carregarHistorico = async () => {
    try {
      // Rota que o back-end deve disponibilizar para listar as ocorrências do usuário logado
      const response = await api.get('/problems/me'); 
      setHistorico(response.data);
    } catch (error) {
      Alert.alert('Aviso', 'Não foi possível conectar ao banco de dados para carregar o histórico.');
    } finally {
      setLoading(false);
    }
  };

  // Executa a busca assim que a tela abre
  useEffect(() => {
    carregarHistorico();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolvido': return { bg: '#D1FAE5', text: '#065F46' }; // Verde
      case 'em análise': return { bg: '#DBEAFE', text: '#1E40AF' }; // Azul
      default: return { bg: '#FEF2F2', text: '#991B1B' }; // Vermelho (Aberto/Urgente)
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D8ABC" />
          <Text style={styles.loadingText}>Buscando seus reportes...</Text>
        </View>
      ) : (
        <FlatList
          data={historico}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma ocorrência registrada no banco de dados ainda.</Text>
          }
          renderItem={({ item }) => {
            const colors = getStatusColor(item.status);
            return (
              <TouchableOpacity style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.category}>{item.categoria}</Text>
                  <Text style={styles.date}>{item.data || 'Recente'}</Text>
                </View>
                <Text style={styles.title}>{item.titulo || 'Ocorrência sem título'}</Text>
                <View style={styles.divider} />
                <View style={styles.footer}>
                  <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
                    <Text style={[styles.statusText, { color: colors.text }]}>{item.status || 'Aberto'}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#64748B', fontWeight: '500' },
  emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 40, fontSize: 16 },
  list: { padding: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  category: { fontSize: 12, fontWeight: 'bold', color: '#0D8ABC', textTransform: 'uppercase' },
  date: { fontSize: 12, color: '#94A3B8' },
  title: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
});