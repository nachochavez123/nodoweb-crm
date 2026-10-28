import { View, Text, TouchableOpacity, Text as RNText } from 'react-native';
import { Link } from 'expo-router';
import { formatearTelefono } from '../utils/formatters.js';

export default function ProspectCard({ prospect, onPress }) {
  const isHigh = prospect.prioridad === 'ALTA';
  const badgeColor = isHigh ? '#fecaca' : '#fef3c7';
  const badgeTextColor = isHigh ? '#b91c1c' : '#92400e';
  const badgeText = isHigh ? '🔥 ALTA' : '⚡ MEDIA';
  const techBadge = prospect.solucion?.toLowerCase().includes('wordpress')
    ? { bg: '#eff6ff', text: '#1d4ed8', label: '💼 WordPress' }
    : { bg: '#f0fdf4', text: '#166534', label: '🛒 Tiendanube' };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.badges}>
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={[styles.badgeText, { color: badgeTextColor }]}>{badgeText}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: techBadge.bg }]}>
          <Text style={[styles.badgeText, { color: techBadge.text }]}>{techBadge.label}</Text>
        </View>
        <View style={styles.badgeSmall}>
          <Text style={styles.badgeSmallText}>#{prospect.id}</Text>
        </View>
      </View>

      <Text style={styles.name}>{prospect.nombre}</Text>
      <Text style={styles.rubro}>{prospect.rubro}</Text>

      <View style={styles.addressRow}>
        <Text style={styles.addressIcon}>📍</Text>
        <Text style={styles.addressText}>{prospect.direccion}</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.zona}>{prospect.zona}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} styleMap={null}>
          <Text style={styles.actionIcon}>🗺️</Text>
          <Text style={styles.actionLabel}>Mapa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionIcon}>📞</Text>
          <Text style={styles.actionLabel}>Llamar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnWhatsApp}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionLabel}>WP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionIcon}>ℹ️</Text>
          <Text style={styles.actionLabel}>Ficha</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
  },
  badgeSmallText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  rubro: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 10,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 10,
  },
  addressIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  addressText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  dot: {
    color: '#94a3b8',
    marginHorizontal: 4,
    fontSize: 10,
  },
  zona: {
    fontSize: 10,
    color: '#94a3b8',
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionBtnWhatsApp: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#10b981',
    borderRadius: 10,
  },
  actionIcon: {
    fontSize: 14,
    marginBottom: 2,
  },
  actionLabel: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
  },
};
