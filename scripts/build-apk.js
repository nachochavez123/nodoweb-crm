#!/usr/bin/env node
// Script de generación de APK para NodoWeb CRM
// Ejecutar: node scripts/build-apk.js

const { execSync } = require('child_process');

console.log('========================================');
console.log('  NodoWeb CRM - Generación de APK');
console.log('========================================\n');

try {
  console.log('1. Iniciando sesión en EAS (si es necesario)...');
  try {
    execSync('npx eas-cli@latest login', { stdio: 'inherit' });
  } catch (e) {
    console.log('   (Sesión ya iniciada o omitida)\n');
  }

  console.log('2. Construyendo APK para Android (producción)...');
  execSync('npx eas-cli@latest build -p android --profile production', { stdio: 'inherit' });
  console.log('   ✓ APK generada\n');

  console.log('========================================');
  console.log('  APK generada con éxito');
  console.log('========================================\n');
  console.log('Próximos pasos:');
  console.log('  1. Descargar la APK desde el dashboard de Expo');
  console.log('  2. Instalar en los 2 dispositivos Android');
  console.log('  3. Permitir "Instalar aplicaciones desconocidas"');
  console.log('  4. Iniciar sesión con las credenciales de cada vendedor');
  console.log('\n');

} catch (err) {
  console.error('Error durante la generación de APK:', err.message);
  process.exit(1);
}
