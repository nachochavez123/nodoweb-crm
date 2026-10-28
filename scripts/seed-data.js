#!/usr/bin/env node
// Script de seed de datos iniciales desde CSV para NodoWeb CRM
// Ejecutar: node scripts/seed-data.js

const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('  NodoWeb CRM - Seed de Datos Iniciales');
console.log('========================================\n');

const CSV_PATH = path.resolve(
  process.env.CSV_PATH ||
  'C:\\Users\\Nacho\\.gemini\\antigravity\\scratch\\Prospectos_Bahia_Blanca_NodoWeb.csv'
);

if (!fs.existsSync(CSV_PATH)) {
  console.error(`No se encontró el archivo CSV: ${CSV_PATH}`);
  console.error('Defina la variable CSV_PATH con la ruta al archivo CSV.');
  process.exit(1);
}

const csvText = fs.readFileSync(CSV_PATH, 'utf-8');
const lines = csvText.trim().split('\n');
const headers = lines[0].split(';').map((h) => h.trim().replace(/"/g, ''));
const prospects = [];

for (let i = 1; i < lines.length; i++) {
  const values = lines[i].split(';');
  const prospect = {};
  for (let j = 0; j < headers.length; j++) {
    prospect[headers[j]] = values[j] ? values[j].trim().replace(/"/g, '') : '';
  }
  prospects.push(prospect);
}

console.log(`Leídos ${prospects.length} prospectos del CSV\n`);

// Generar JSON de seed para Firestore
const seedData = prospects.map((row, index) => ({
  id: (index + 1).toString(),
  nombre: row['Nombre del Negocio'] || 'Sin nombre',
  rubro: row['Rubro / Categoría'] || '',
  categoria: categorizarRubro(row['Rubro / Categoría'] || ''),
  direccion: row['Dirección en Bahía Blanca'] || '',
  zona: row['Zona / Barrio'] || 'Bahía Blanca',
  contacto: row['Contacto / Teléfono'] || '',
  telefonoRaw: (row['Contacto / Teléfono'] || '').replace(/\D/g, ''),
  email: row['Email'] || '',
  whatsapp: row['WhatsApp'] || '',
  sitioWeb: row['Sitio Web'] || '',
  redesSociales: row['Redes Sociales'] || '',
  googleMaps: row['Ficha Google Maps']
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row['Ficha Google Maps'] + ' Bahia Blanca')}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((row['Nombre del Negocio'] || '') + ' ' + (row['Dirección en Bahía Blanca'] || '') + ' Bahia Blanca')}`,
  estadoWeb: row['Estado Web Actual'] || '',
  dolor: row['Diagnóstico del Dolor Principal'] || '',
  solucion: row['Tecnología / Solución NodoWeb'] || '',
  precio: row['Inversión Implementación'] || '',
  abono: row['Abono Mensual NodoWeb'] || '',
  prioridad: row['Prioridad Comercial'] || 'MEDIA',
  pitch: row['Pitch de Entrada Sugerido'] || '',
  notas: '',
  fotos: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const outputPath = path.resolve(__dirname, '..', 'seed-data.json');
fs.writeFileSync(outputPath, JSON.stringify(seedData, null, 2));
console.log(`Seed generado: ${outputPath}`);
console.log(`Total: ${seedData.length} prospectos listos para importar a Firestore\n`);

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

console.log('========================================');
console.log('  Seed generado con éxito');
console.log('========================================\n');
