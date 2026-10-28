import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase.js';
import { usersService } from '../services/users.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const perfil = await usersService.getUser(firebaseUser.uid);
          if (!perfil) {
            await usersService.upsertUser(firebaseUser.uid, {
              email: firebaseUser.email,
              nombre: firebaseUser.email?.split('@')[0] || 'Usuario',
              rol: 'Vendedor',
              foto: null,
            });
          }
        } catch (e) {
          console.error('Error cargando perfil:', e);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const register = useCallback(async (email, password, nombre, rol) => {
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await usersService.upsertUser(result.user.uid, {
        email,
        nombre,
        rol: rol || 'Vendedor',
        foto: null,
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateProfile = useCallback(async (data) => {
    if (!user) return;
    try {
      await usersService.upsertUser(user.uid, data);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user]);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
