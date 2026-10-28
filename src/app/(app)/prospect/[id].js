import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, StyleSheet } from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext.js';
import { useProspects } from '../../../context/ProspectsContext.js';
import * as Linking from 'expo-linking';
import { formatearTelefono, formatearPrecio, formatearFecha, tiempoRelativo } from '../../../utils/formatters.js';

export default function ProspectDetailScreen() {
  const router = useRouter();
  const { prospectId } = useLocalSearchParams();
  const { user } = useAuth();
  const { prospects, agregarNota, actualizarProspecto, suscribirNotas, notesByProspect } = useProspects();

  const prospect = prospects.find((p) => p.id === prospectId);
  const [notas, setNotas] = useState('');
  const [notasList, setNotasList] = useState([]);
  const [editarNotas, setEditarNotas] = useState(false);

  useEffect(() => {
    const unsub = suscribirNotas(prospectId);
    return () => unsub();
  }, [prospectId, suscribirNotas]);

  useEffect(() => {
    const notes = notesByProspect[prospectId] || [];
    setNotasList(notes);
  }, [notesByProspect, prospectId]);

  if (!prospect) {
    return null;
  }

  const handleCall = () => {
    const numero = (prospect.contacto || '').split('/')[0].trim().replace(/\D/g, '');
    Linking.openURL(`tel:${numero}`);
  };

  const handleMaps = () => {
    Linking.openURL(prospect.googleMaps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prospect.nombre + ' ' + prospect.direccion + ' Bahía Blanca')}`);
  };

  const handleWeb = () => {
    if (prospect.sitioWeb) {
      Linking.openURL(prospect.sitioWeb.startsWith('http') ? prospect.sitioWeb : `https://${prospect.sitioWeb}`);
    } else {
      Alert.alert('Sin página web', 'Este prospecto no tiene sitio web registrado.');
    }
  };

  const handleWhatsApp = () => {
    const telefonoRaw = prospect.telefonoRaw || prospect.contacto?.replace(/\D/g, '') || '';
    const pitch = prospect.pitch || `Hola equipo de ${prospect.nombre}!`;
    Linking.openURL(`https://wa.me/${telefonoRaw}?text=${encodeURIComponent(pitch)}`);
  };

  const handleEmail = () => {
    if (prospect.email) {
      Linking.openURL(`mailto:${prospect.email}?subject=Consulta NodoWeb&body=${encodeURIComponent('Hola ' + prospect.nombre + ', me contacto desde NodoWeb CRM.')}`);
    } else {
      Alert.alert('Sin email', 'Este prospecto no tiene email registrado.');
    }
  };

  const handleCopiarPitch = async () => {
    if (prospect.pitch) {
      await Linking.openURL(`nodoweb://copy?text=${encodeURIComponent(prospect.pitch)}`);
      Alert.alert('Pitch copiado', 'El pitch se ha copiado al portapapeles.');
    }
  };

  const handleGuardarNotas = async () => {
    if (!notas.trim()) return;
    try {
      await agregarNota(prospectId, notas, user?.uid, user?.email?.split('@')[0] || 'Usuario');
      setNotas('');
      setEditarNotas(false);
      Alert.alert('Nota guardada', 'La nota se ha sincronizado con el otro dispositivo.');
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la nota.');
    }
  };

  const handleActualizarProspecto = async (campo, valor) => {
    try {
      await actualizarProspecto(prospectId, { [campo]: valor }, user?.uid);
    } catch (e) {
      Alert.alert('Error', 'No se pudo actualizar el prospecto.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.priorityBadge}>
            <Text style={[styles.badgeText, { color: prospect.prioridad === 'ALTA' ? '#b91c1c' : '#92400e' }]}>
              {prospect.prioridad === 'ALTA' ? '🔥 PRIORIDAD ALTA' : '⚡ PRIORIDAD MEDIA'}
            </Text>
          </View>
          <Text style={styles.name}>{prospect.nombre}</Text>
          <Text style={styles.category}>{prospect.rubro} • {prospect.zona}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.infoLabel}>{prospect.direccion}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.icon}>📞</Text>
          <Text style={styles.infoLabel}>{formatearTelefono(prospect.contacto)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.icon}>🌐</Text>
          <Text style={styles.infoLabel}>{prospect.estadoWeb}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dolor que Pierde Hoy</Text>
        <View style={styles.painBox}>
          <Text style={styles.painText}>{prospect.dolor}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Solución NodoWeb Recomendada</Text>
        <View style={styles.solutionBox}>
          <Text style={styles.solutionText}>{prospect.solucion}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Inversión:</Text>
            <Text style={styles.priceValue}>{formatearPrecio(prospect.precio)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Abono mensual:</Text>
            <Text style={styles.priceValue}>{formatearPrecio(prospect.abono)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pitch de Entrada Sugerido</Text>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopiarPitch}>
            <Text style={styles.copyText}>Copiar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.pitchBox}>
          <Text style={styles.pitchText}>"{prospect.pitch}"</Text>
        </View>
      </View>

      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionButton} onPress={handleMaps}>
          <Text style={styles.actionIcon}>🗺️</Text>
          <Text style={styles.actionLabel}>Ubicar en Maps</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <Text style={styles.actionIcon}>📞</Text>
          <Text style={styles.actionLabel}>Llamar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} style={[styles.actionButton, { backgroundColor: '#10b981' }]} onPress={handleWhatsApp}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionLabel}>WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleWeb}>
          <Text style={styles.actionIcon}>🌐</Text>
          <Text style={styles.actionLabel}>Abrir Web</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
          <Text style={styles.actionIcon}>✉️</Text>
          <Text style={styles.actionLabel}>Email</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notas y Acotaciones</Text>
          {editarNotas ? (
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditarNotas(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={() => setEditarNotas(true)}>
              <Text style={styles.editText}>+ Agregar nota</Text>
            </TouchableOpacity>
          )}
        </View>

        {editarNotas ? (
          <View style={styles.notasEditor}>
            <TextInput
              style={styles.notasInput}
              value={notas}
              onChangeText={setNotas}
              placeholder="Escriba una nota o acotación..."
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleGuardarNotas}>
              <Text style={styles.saveText}>Guardar nota</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.notasList}>
          {notasList.map((nota) => (
            <View key={nota.id} style={styles.notaItem}>
              <Text style={styles.notaTexto}>{nota.texto}</Text>
              <View style={styles.notaMeta}>
                <Text style={styles.notaAutor}>{nota.userName || 'Usuario'}</Text>
                <Text style={styles.notaFecha}>{tiempoRelativo(nota.createdAt)}</Text>
              </View>
            </View>
          ))}
          {notasList.length === 0 && (
            <Text style={styles.notasVacias}>No hay notas aún. Agregue la primera acotación.</Text>
          )}
        </View>
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
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  priorityBadge: {
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  closeButton: {
    padding: 6,
    backgroundColor: '#1e293b',
    borderRadius: 8,
  },
  closeText: {
    color: '#94a3b8',
    fontSize: 18,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
    width: 24,
  },
  infoLabel: {
    fontSize: 13,
    color: '#475569',
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  painBox: {
    backgroundColor: '#fef2f2',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  painText: {
    fontSize: 13,
    color: '#991b1b',
    lineHeight: 20,
  },
  solutionBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  solutionText: {
    fontSize: 13,
    color: '#1e3a8a',
    fontWeight: '600',
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  priceLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803d',
  },
  pitchBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  pitchText: {
    fontSize: 13,
    color: '#14532d',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  copyButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#10b981',
    borderRadius: 6,
  },
  copyText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 70,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
    textAlign: 'center',
  },
  notasInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
    color: '#0f172a',
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  cancelText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  editText: {
    color: '#0ea5e9',
    fontSize: 13,
    fontWeight: '600',
  },
  notasList: {
    marginTop: 12,
  },
  notaItem: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  notaTexto: {
    fontSize: 13,
    color: '#0f172a',
    marginBottom: 6,
    lineHeight: 18,
  },
  notaMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notaAutor: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0ea5e9',
  },
  notaFecha: {
    fontSize: 10,
    color: '#94a3b8',
  },
  notasVacias: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
