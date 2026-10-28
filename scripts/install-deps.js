#!/usr/bin/env node
// Script de instalación automática para NodoWeb CRM
// Ejecutar: node scripts/install-deps.js

const { execSync } = require('child_process');
const path = require('path');

console.log('========================================');
console.log('  NodoWeb CRM - Instalación Automática');
console.log('========================================\n');

try {
  console.log('1. Instalando dependencias de npm...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('   ✓ Dependencias instaladas\n');

  console.log('2. Instalando dependencias de Expo SDK 58...');
  execSync('npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-clipboard expo-constants expo-image-picker', { stdio: 'inherit' });
  console.log('   ✓ Módulos de Expo instalados\n');

  console.log('3. Instalando Firebase SDK...');
  execSync('npm install firebase', { stdio: 'inherit' });
  console.log('   ✓ Firebase instalado\n');

  console.log('========================================');
  console.log('  Instalación completada con éxito');
  console.log('========================================\n');
  console.log('Próximos pasos:');
  console.log('  1. Copiar .env.example a .env y configurar Firebase');
  console.log('  2. Ejecutar: npm start (para desarrollo)');
  console.log('  3. Ejecutar: npm run web (versión web)');
  console.log('  4. Ejecutar: npx eas build -p android --profile production (APK)');
  console.log('\n');

} catch (err) {
  console.error('Error durante la instalación:', err.message);
  process.exit(1);
}
