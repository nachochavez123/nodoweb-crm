import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useProspects } from '../../context/ProspectsContext.js';
import ProspectCard from '../../components/ProspectCard.js';
import SyncIndicator from '../../components/SyncIndicator.js';
import FilterChips from '../../components/FilterChips.js';
import SearchBar from '../../components/SearchBar.js';

export default function ProspectsListScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { prospects, syncStatus, lastSync } = useProspects();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');

  const FILTERS = [
    { key: 'ALL', label: 'Todos' },
    { key: 'ALTA', label: '🔥 Prioridad Alta' },
    { key: 'INMOBILIARIA', label: '🏠 Inmobiliarias' },
    { key: 'INDUSTRIA', label: '🚚 Transporte & Obra' },
    { key: 'SALUD', label: '🩺 Salud & Estética' },
    { key: 'HOGAR', label: '🛋️ Muebles & Hogar' },
    { key: 'ECOMMERCE', label: '🛒 Tiendanube' },
  ];

  const filteredProspects = useCallback(() => {
    return prospects.filter((p) => {
      const matchFilter =
        filter === 'ALL' ||
        p.categoria === filter ||
        (filter === 'ALTA' && p.prioridad === 'ALTA');
      const matchSearch =
        !searchTerm ||
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.rubro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.zona.toLowerCase().includes(searchTerm.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [prospects, filter, searchTerm]);

  useFocusEffect(() => {}, []);

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Está seguro de cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sí, salir', onPress: () => logout() },
    ]);
  };

  const handleOpenProspect = (id) => {
    router.push(`/prospect/${id}`);
  };

  return (
    <View style={styles.container}>
      <SyncIndicator status={syncStatus} lastSync={lastSync} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appTitle}>NodoWeb <Text style={styles.appTitleSub}>CRM</Text></Text>
          <Text style={styles.appSubtitle}>Prospectos Comerciales Móvil</Text>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
          <Text style={styles.menuText}>{user?.email?.split('@')[0] || 'Usuario'}</Text>
        </TouchableOpacity>
      </View>

      <SearchBar
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Buscar negocio, rubro, calle o zona..."
      />

      <FilterChips
        filters={FILTERS}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      <FlatList
        data={filteredProspects()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProspectCard
            prospect={item}
            onPress={() => handleOpenProspect(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron prospectos</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
  },
  headerLeft: {
    flex: 1,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  appTitleSub: {
    color: '#0ea5e9',
  },
  appSubtitle: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  menuButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1e293b',
    borderRadius: 8,
  },
  menuText: {
    color: '#0ea5e9',
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 90,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
};
