import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../../services/api';

export default function AdminDashboardScreen() {
  const [viewMode, setViewMode] = useState<'lista' | 'mapa'>('lista');
  const [ocorrencias, setOcorrencias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Buscar todas as ocorrências
  const carregarOcorrencias = async () => {
    try {
      const response = await api.get('/problems');
      setOcorrencias(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as ocorrências do banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarOcorrencias();
  }, []);

  // 2. Enviar novo status para o Back-end
  const atualizarNoBanco = async (id: string, novoStatus: string) => {
    try {
      await api.put(`/problems/${id}/status`, { status: novoStatus });
      // Atualiza a lista na tela sem precisar recarregar tudo do servidor
      setOcorrencias(ocorrencias.map(oc => oc.id === id ? { ...oc, status: novoStatus } : oc));
      Alert.alert('Sucesso', 'Status atualizado no banco! Morador notificado via Push.');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao comunicar com a API para atualizar o status.');
    }
  };

  const handleAtualizarStatus = (id: string, categoria: string) => {
    Alert.alert(
      'Atualizar Status',
      `Ocorrência: ${categoria}\nQual o novo andamento?`,
      [
        { text: 'Em Análise', onPress: () => atualizarNoBanco(id, 'Em Análise') },
        { text: 'Resolvido', onPress: () => atualizarNoBanco(id, 'Resolvido') },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const getPrioridadeCor = (prioridade: string) => {
    if (prioridade?.toLowerCase() === 'urgente') return { bg: '#FEF2F2', text: '#EF4444' };
    if (prioridade?.toLowerCase() === 'alta') return { bg: '#FFF7ED', text: '#EA580C' };
    return { bg: '#F1F5F9', text: '#64748B' }; // Baixa / Normal
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Central de Ocorrências</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity style={[styles.toggleBtn, viewMode === 'lista' && styles.toggleBtnActive]} onPress={() => setViewMode('lista')}>
            <Ionicons name="list" size={18} color={viewMode === 'lista' ? '#FFF' : '#64748B'} />
            <Text style={[styles.toggleText, viewMode === 'lista' && styles.toggleTextActive]}>Lista</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleBtn, viewMode === 'mapa' && styles.toggleBtnActive]} onPress={() => setViewMode('mapa')}>
            <Ionicons name="map" size={18} color={viewMode === 'mapa' ? '#FFF' : '#64748B'} />
            <Text style={[styles.toggleText, viewMode === 'mapa' && styles.toggleTextActive]}>Mapa</Text>
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'mapa' ? (
        <View style={styles.mapaPlaceholder}>
          <Ionicons name="map-outline" size={60} color="#CBD5E1" />
          <Text style={styles.mapaText}>Google Maps pendente</Text>
        </View>
      ) : loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#0D8ABC" />
        </View>
      ) : (
        <FlatList
          data={ocorrencias}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#94A3B8', marginTop: 20 }}>Nenhum problema registrado no banco.</Text>}
          renderItem={({ item }) => {
            const prioridadeCores = getPrioridadeCor(item.prioridade || 'Normal');
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.categoria}>{item.categoria}</Text>
                    <Text style={styles.tempo}> • {item.tempo || 'Recente'}</Text>
                  </View>
                  <View style={[styles.prioridadeBadge, { backgroundColor: prioridadeCores.bg }]}>
                    <Text style={[styles.prioridadeText, { color: prioridadeCores.text }]}>{item.prioridade || 'NORMAL'}</Text>
                  </View>
                </View>

                <Text style={styles.descricao}>{item.descricao || 'Sem descrição detalhada'}</Text>
                
                <View style={styles.enderecoContainer}>
                  <Ionicons name="location-outline" size={16} color="#64748B" />
                  <Text style={styles.enderecoText}>{item.endereco || 'Localização não fornecida'}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.footer}>
                  <Text style={styles.statusAtual}>Status: <Text style={{ fontWeight: 'bold', color: item.status === 'Resolvido' ? '#10B981' : '#0D8ABC' }}>{item.status || 'Aberto'}</Text></Text>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleAtualizarStatus(item.id, item.categoria)}>
                    <Text style={styles.actionButtonText}>Atualizar Status</Text>
                    <Ionicons name="chevron-forward" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

// Estilos preservados para garantir o design Premium
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#FFF', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 8 },
  toggleBtnActive: { backgroundColor: '#0D8ABC' },
  toggleText: { marginLeft: 8, fontWeight: '600', color: '#64748B' },
  toggleTextActive: { color: '#FFF' },
  mapaPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E2E8F0', margin: 20, borderRadius: 20 },
  mapaText: { fontSize: 16, fontWeight: '700', color: '#64748B', marginTop: 12 },
  list: { padding: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  categoria: { fontSize: 14, fontWeight: '800', color: '#0D8ABC', textTransform: 'uppercase' },
  tempo: { fontSize: 13, color: '#94A3B8' },
  prioridadeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  prioridadeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  descricao: { fontSize: 16, color: '#1E293B', fontWeight: '500', marginBottom: 12 },
  enderecoContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 8, borderRadius: 8 },
  enderecoText: { fontSize: 13, color: '#64748B', marginLeft: 6 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusAtual: { fontSize: 13, color: '#64748B' },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D8ABC', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  actionButtonText: { color: '#FFF', fontSize: 13, fontWeight: '700', marginRight: 4 },
});