import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, useState } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/AuthContext.js';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../../firebase.js';
import { usersService } from '../../services/users.js';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos requeridos', 'Ingrese email y contraseña');
      return;
    }
    try {
      await login(email, password);
      router.replace('/(app)');
    } catch (e) {
      Alert.alert('Error', error || 'No se pudo iniciar sesión');
    }
  };

  const handleQuickLogin = async () => {
    try {
      const result = await signInAnonymously(auth);
      await usersService.upsertUser(result.user.uid, {
        email: null,
        nombre: 'Usuario Teléfono',
        rol: 'Vendedor',
        foto: null,
        anonimo: true,
      });
      router.replace('/(app)');
    } catch (e) {
      Alert.alert('Error', 'No se pudo iniciar el modo rápido');
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <View style={styles.icon} />
          </View>
          <Text style={styles.title}>NodoWeb CRM</Text>
          <Text style={styles.subtitle}>Prospección comercial Bahía Blanca</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="tu@email.com"
            autoCapitalize="none"
            autoCompleteType="email"
          />
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            autoCompleteType="password"
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Ingresando...' : 'Iniciar sesión'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <Text style={styles.dividerText}>O</Text>
        </View>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.secondaryButtonText}>Crear cuenta nueva</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickButton} onPress={handleQuickLogin} disabled={loading}>
          <Text style={styles.quickButtonText}>Usar sin cuenta (modo rápido - solo este teléfono)</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    color: '#ffffff',
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  error: {
    color: '#f87171',
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0ea5e9',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  secondaryButton: {
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: '600',
  },
  quickButton: {
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#64748b',
    borderRadius: 10,
    paddingVertical: 12,
  },
  quickButtonText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
};
