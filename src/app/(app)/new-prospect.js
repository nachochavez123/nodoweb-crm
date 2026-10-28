import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Switch, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useProspects } from '../../context/ProspectsContext.js';

export default function NewProspectScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { agregarProspecto } = useProspects();

  const [form, setForm] = useState({
    nombre: '',
    rubro: '',
    categoria: 'OTROS',
    direccion: '',
    zona: '',
    contacto: '',
    telefonoRaw: '',
    email: '',
    whatsapp: '',
    sitioWeb: '',
    redesSociales: '',
    googleMaps: '',
    estadoWeb: '',
    dolor: '',
    solucion: '',
    precio: '',
    abono: '',
    prioridad: 'MEDIA',
    pitch: '',
  });

  const CATEGORIAS = [
    { key: 'INMOBILIARIA', label: 'Inmobiliaria' },
    { key: 'INDUSTRIA', label: 'Industria / Transporte' },
    { key: 'SALUD', label: 'Salud / Bienestar' },
    { key: 'HOGAR', label: 'Hogar / Muebles' },
    { key: 'ECOMMERCE', label: 'E-commerce' },
    { key: 'OTROS', label: 'Otros' },
  ];

  const PRIORIDADES = [
    { key: 'ALTA', label: 'Alta' },
    { key: 'MEDIA', label: 'Media' },
  ];

  const handleSubmit = async () => {
    if (!form.nombre || !form.rubro) {
      Alert.alert('Campos requeridos', 'Nombre y rubro son obligatorios');
      return;
    }

    const telefonoDigitos = form.telefonoRaw.replace(/\D/g, '');
    const nombreSlug = form.nombre.replace(/\s+/g, '+').toLowerCase();
    const dirSlug = form.direccion.replace(/\s+/g, '+');

    const prospectData = {
      ...form,
      telefonoRaw: telefonoDigitos,
      contacto: form.contacto,
      googleMaps: form.googleMaps || `https://www.google.com/maps/search/?api=1&query=${nombreSlug}+${dirSlug}+Bahia+Blanca`,
      prioridad: form.prioridad,
    };

    try {
      await agregarProspecto(prospectData, user?.uid, user?.email?.split('@')[0] || 'Usuario');
      Alert.alert('Prospecto creado', 'El nuevo prospecto se ha sincronizado en tiempo real.');
      router.back();
    } catch (e) {
      Alert.alert('Error', 'No se pudo crear el prospecto.');
    }
  };

  const handleImportCSV = () => {
    Alert.alert('Importar CSV', 'Seleccione el archivo CSV de prospectos para importar. Los datos se cargarán automáticamente desde la plantilla de Bahía Blanca.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Nuevo Prospecto</Text>
        <Text style={styles.subtitle}>Complete la ficha comercial del negocio</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Nombre del negocio *</Text>
          <TextInput
            style={styles.input}
            value={form.nombre}
            onChangeText={(v) => setForm({ ...form, nombre: v })}
            placeholder="Ej: Segu Inmobiliaria"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Rubro / Categoría *</Text>
          <TextInput
            style={styles.input}
            value={form.rubro}
            onChangeText={(v) => setForm({ ...form, rubro: v })}
            placeholder="Ej: Inmobiliaria y Tasaciones"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Categoría comercial</Text>
          {CATEGORIAS.map((c) => (
            <TouchableOpacity
              key={c.key}
              style={[styles.categoryChip, form.categoria === c.key && styles.categoryChipActive]}
              onPress={() => setForm({ ...form, categoria: c.key })}
            >
              <Text style={[styles.categoryChipText, form.categoria === c.key && styles.categoryChipTextActive]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Dirección</Text>
          <TextInput
            style={styles.input}
            value={form.direccion}
            onChangeText={(v) => setForm({ ...form, direccion: v })}
            placeholder="Ej: Corrientes 502"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Zona / Barrio</Text>
          <TextInput
            style={styles.input}
            value={form.zona}
            onChangeText={(v) => setForm({ ...form, zona: v })}
            placeholder="Ej: Centro / Macrocentro"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Teléfono / Contacto</Text>
          <TextInput
            style={styles.input}
            value={form.contacto}
            onChangeText={(v) => setForm({ ...form, contacto: v })}
            placeholder="Ej: 0291 451-5205"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>WhatsApp</Text>
          <TextInput
            style={styles.input}
            value={form.whatsapp}
            onChangeText={(v) => setForm({ ...form, whatsapp: v })}
            placeholder="Ej: 5492914515205"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(v) => setForm({ ...form, email: v })}
            placeholder="Ej: contacto@negocio.com.ar"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Sitio web</Text>
          <TextInput
            style={styles.input}
            value={form.sitioWeb}
            onChangeText={(v) => setForm({ ...form, sitioWeb: v })}
            placeholder="Ej: www.negocio.com.ar"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Redes sociales</Text>
          <TextInput
            style={styles.input}
            value={form.redesSociales}
            onChangeText={(v) => setForm({ ...form, redesSociales: v })}
            placeholder="Ej: Instagram @negocio"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Ficha Google Maps</Text>
          <TextInput
            style={styles.input}
            value={form.googleMaps}
            onChangeText={(v) => setForm({ ...form, googleMaps: v })}
            placeholder="Enlace o nombre para Maps"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Estado web actual</Text>
          <TextInput
            style={styles.input}
            value={form.estadoWeb}
            onChangeText={(v) => setForm({ ...form, estadoWeb: v })}
            placeholder="Ej: Web antigua, sin cotizador"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Dolor principal</Text>
          <TextInput
            style={styles.input}
            value={form.dolor}
            onChangeText={(v) => setForm({ ...form, dolor: v })}
            placeholder="¿Qué problema tiene el negocio?"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Solución NodoWeb recomendada</Text>
          <TextInput
            style={styles.input}
            value={form.solucion}
            onChangeText={(v) => setForm({ ...form, solucion: v })}
            placeholder="Ej: WordPress Autoadministrable"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Inversión implementación</Text>
          <TextInput
            style={styles.input}
            value={form.precio}
            onChangeText={(v) => setForm({ ...form, precio: v })}
            placeholder="Ej: $750.000 + IVA"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Abono mensual</Text>
          <TextInput
            style={styles.input}
            value={form.abono}
            onChangeText={(v) => setForm({ ...form, abono: v })}
            placeholder="Ej: $159.000 + IVA"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Prioridad comercial</Text>
          {PRIORIDADES.map((p) => (
            <TouchableOpacity
              key={p.key}
              style={[styles.priorityChip, form.prioridad === p.key && styles.priorityChipActive]}
              onPress={() => setForm({ ...form, prioridad: p.key })}
            >
              <Text style={[styles.priorityChipText, form.prioridad === p.key && styles.priorityChipTextActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Pitch de entrada sugerido</Text>
          <TextInput
            style={styles.input}
            value={form.pitch}
            onChangeText={(v) => setForm({ ...form, pitch: v })}
            placeholder="Ej: Hola equipo de X! ..."
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Guardar prospecto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.importButton} onPress={handleImportCSV}>
          <Text style={styles.importText}>Importar desde CSV (plantilla Bahía Blanca)</Text>
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
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#0f172a',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  form: {
    paddingHorizontal: 16,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChipActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryChipTextActive: {
    color: '#ffffff',
  },
  priorityChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  priorityChipActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  priorityChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  priorityChipTextActive: {
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  importButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  importText: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: '600',
  },
});
