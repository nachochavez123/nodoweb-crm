#!/usr/bin/env node
// Script de despliegue a Vercel para NodoWeb CRM
// Ejecutar: node scripts/deploy-vercel.js

const { execSync } = require('child_process');

console.log('========================================');
console.log('  NodoWeb CRM - Despliegue a Vercel');
console.log('========================================\n');

try {
  console.log('1. Construyendo versión web...');
  execSync('npx expo export --platform web', { stdio: 'inherit' });
  console.log('   ✓ Build web completado\n');

  console.log('2. Desplegando a Vercel (producción)...');
  execSync('vercel --prod', { stdio: 'inherit' });
  console.log('   ✓ Despliegue completado\n');

  console.log('========================================');
  console.log('  Despliegue completado con éxito');
  console.log('========================================\n');

} catch (err) {
  console.error('Error durante el despliegue:', err.message);
  process.exit(1);
}
