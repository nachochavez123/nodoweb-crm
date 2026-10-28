import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext.js';
import { useState } from 'react';
import * as Linking from 'expo-linking';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateProfile } = useAuth();
  const [nombre, setNombre] = useState(user?.email?.split('@')[0] || '');
  const [rol, setRol] = useState('Vendedor');

  const handleSave = async () => {
    try {
      await updateProfile({ nombre, rol });
      Alert.alert('Perfil guardado', 'Sus datos se han actualizado.');
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el perfil.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Está seguro de cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sí, salir', onPress: () => logout() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil de Usuario</Text>
        <Text style={styles.subtitle}>NodoWeb CRM - Equipo de Ventas</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
          <Text style={styles.avatarLabel}>{nombre.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.userName}>{nombre}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{rol}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.settingsRow} onPress={handleSave}>
          <Text style={styles.settingsLabel}>Guardar cambios de perfil</Text>
          <Text style={styles.settingsIcon}>💾</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.settingsRow} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.settingsLabel}>Cambiar de usuario</Text>
          <Text style={styles.settingsIcon}>🔄</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.settingsRow} onPress={handleLogout}>
          <Text style={styles.settingsLabel}>Cerrar sesión</Text>
          <Text style={styles.settingsIcon}>🚪</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Información de sincronización</Text>
        <Text style={styles.infoText}>
          Esta app se sincroniza en tiempo real con Firebase Firestore.
          Todos los prospectos y notas se comparten al instante entre los dos dispositivos del equipo de ventas.
        </Text>
        <Text style={styles.infoTitle}>Soporte</Text>
        <Text style={styles.infoText}>
          Equipo NodoWeb - Bahía Blanca, Buenos Aires, Argentina
        </Text>
        <TouchableOpacity style={styles.supportButton} onPress={() => Linking.openURL('mailto:soporte@nodoweb.com.ar')}>
          <Text style={styles.supportText}>soporte@nodoweb.com.ar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#0f172a',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarLabel: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '700',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 10,
  },
  roleBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingsLabel: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  settingsIcon: {
    fontSize: 18,
    color: '#94a3b8',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 4,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
    marginTop: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  supportButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  supportText: {
    color: '#0ea5e9',
    fontSize: 13,
    fontWeight: '600',
  },
});
