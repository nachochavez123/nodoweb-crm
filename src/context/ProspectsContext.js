import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { prospectService } from '../services/prospects.js';
import { notesService } from '../services/notes.js';

const ProspectsContext = createContext(null);

export function ProspectsProvider({ children }) {
  const [prospects, setProspects] = useState([]);
  const [notesByProspect, setNotesByProspect] = useState({});
  const [syncStatus, setSyncStatus] = useState('sincronizado');
  const [lastSync, setLastSync] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSyncStatus('sincronizando');
    const unsubProspects = prospectService.onProspectsChange((data) => {
      setProspects(data);
      setLastSync(new Date().toISOString());
      setSyncStatus('sincronizado');
    });

    return () => unsubProspects();
  }, []);

  const suscribirNotas = useCallback((prospectId) => {
    if (!prospectId) return () => {};
    const unsub = notesService.onProspectsChange
      ? notesService.onProspectsChange(prospectId, (data) => {
          setNotesByProspect((prev) => ({ ...prev, [prospectId]: data }));
        })
      : () => {};
    return unsub;
  }, []);

  const agregarProspecto = useCallback(async (data, userId, userName) => {
    setSyncStatus('sincronizando');
    try {
      await prospectService.createProspect(data, userId);
      setLastSync(new Date().toISOString());
      setSyncStatus('sincronizado');
    } catch (err) {
      setSyncStatus('error');
      throw err;
    }
  }, []);

  const actualizarProspecto = useCallback(async (id, updates, userId) => {
    setSyncStatus('sincronizando');
    try {
      await prospectService.updateProspect(id, updates, userId);
      setLastSync(new Date().toISOString());
      setSyncStatus('sincronizado');
    } catch (err) {
      setSyncStatus('error');
      throw err;
    }
  }, []);

  const agregarNota = useCallback(async (prospectId, texto, userId, userName) => {
    try {
      await notesService.createNote(
        { prospectId, texto },
        userId,
        userName
      );
    } catch (err) {
      throw err;
    }
  }, []);

  const value = {
    prospects,
    notesByProspect,
    syncStatus,
    lastSync,
    loading,
    suscribirNotas,
    agregarProspecto,
    actualizarProspecto,
    agregarNota,
  };

  return <ProspectsContext.Provider value={value}>{children}</ProspectsContext.Provider>;
}

export const useProspects = () => {
  const context = useContext(ProspectsContext);
  if (!context) {
    throw new Error('useProspects debe usarse dentro de ProspectsProvider');
  }
  return context;
};
