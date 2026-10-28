export const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(';').map((h) => h.trim().replace(/"/g, ''));
  const prospects = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(';');
    const prospect = {};

    for (let j = 0; j < headers.length; j++) {
      let value = values[j] ? values[j].trim().replace(/"/g, '') : '';
      prospect[headers[j]] = value;
    }

    prospects.push(prospect);
  }

  return prospects;
};

export const csvToProspect = (row) => {
  const telefonoRaw = (row['Contacto / Teléfono'] || '').replace(/\D/g, '');
  const nombre = row['Nombre del Negocio'] || 'Sin nombre';
  const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);

  return {
    id,
    nombre,
    rubro: row['Rubro / Categoría'] || '',
    categoria: categorizarRubro(row['Rubro / Categoría'] || ''),
    direccion: row['Dirección en Bahía Blanca'] || '',
    zona: row['Zona / Barrio'] || 'Bahía Blanca',
    contacto: row['Contacto / Teléfono'] || '',
    telefonoRaw,
    email: row['Email'] || '',
    whatsapp: row['WhatsApp'] || '',
    sitioWeb: row['Sitio Web'] || '',
    redesSociales: row['Redes Sociales'] || '',
    googleMaps: row['Ficha Google Maps']
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row['Ficha Google Maps'] + ' Bahia Blanca')}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nombre + ' ' + (row['Dirección en Bahía Blanca'] || '') + ' Bahia Blanca')}`,
    estadoWeb: row['Estado Web Actual'] || '',
    dolor: row['Diagnóstico del Dolor Principal'] || '',
    solucion: row['Tecnología / Solución NodoWeb'] || '',
    precio: row['Inversión Implementación'] || '',
    abono: row['Abono Mensual NodoWeb'] || '',
    prioridad: row['Prioridad Comercial'] || 'MEDIA',
    pitch: row['Pitch de Entrada Sugerido'] || `Hola equipo de ${nombre}! Conocemos su negocio en Bahía Blanca y tenemos una propuesta digital para impulsar sus ventas.`,
    notas: '',
    fotos: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

function categorizarRubro(rubro) {
  const r = rubro.toLowerCase();
  if (r.includes('inmobiliar') || r.includes('bienes ra')) return 'INMOBILIARIA';
  if (r.includes('transporte') || r.includes('logíst') || r.includes('distrib') || r.includes('carga')) return 'INDUSTRIA';
  if (r.includes('ferreter') || r.includes('corralón') || r.includes('materiales') || r.includes('abertur') || r.includes('metal')) return 'INDUSTRIA';
  if (r.includes('mueble') || r.includes('hogar') || r.includes('colchón') || r.includes('descanso')) return 'HOGAR';
  if (r.includes('climatización') || r.includes('calefacción') || r.includes('aire acondicionado') || r.includes('seguridad') || r.includes('alarma')) return 'INDUSTRIA';
  if (r.includes('laborator') || r.includes('análisis') || r.includes('salud') || r.includes('médic') || r.includes('kinesi') || r.includes('rehabilit') || r.includes('veterinaria') || r.includes('odontolog') || r.includes('ortodoncia')) return 'SALUD';
  if (r.includes('tiendanube') || r.includes('ecommerce') || r.includes('frutos secos') || r.includes('dietética') || r.includes('suplement') || r.includes('almacén') || r.includes('mascota') || r.includes('pet shop') || r.includes('colchonería')) return 'ECOMMERCE';
  return 'OTROS';
}
