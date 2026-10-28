import { View, Text, Animated } from 'react-native';

export default function SyncIndicator({ status, lastSync }) {
  const statusConfig = {
    sincronizando: { color: '#f59e0b', label: 'Sincronizando...' },
    sincronizado: { color: '#10b981', label: lastSync ? `Actualizado ${tiempoRelativo(lastSync)}` : 'Sincronizado' },
    error: { color: '#ef4444', label: 'Error de sincronización' },
  };

  const config = statusConfig[status] || statusConfig.sincronizado;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

function tiempoRelativo(fechaISO) {
  const fecha = new Date(fechaISO);
  const ahora = new Date();
  const diffMs = ahora - fecha;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHora = Math.floor(diffMs / 3600000);
  const diffDia = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Ahora mismo';
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffHora < 24) return `hace ${diffHora} h`;
  if (diffDia < 7) return `hace ${diffDia} d`;
  return fecha.toLocaleDateString('es-AR');
}

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
};
