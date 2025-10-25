const fs = require('fs');
const path = require('path');

// 📁 Ruta a la carpeta uploads (externa al backend)
const uploadsDir = path.join(__dirname, '../../uploads');

console.log('🔍 Verificando configuración de imágenes...');
console.log('📁 Ruta de uploads:', uploadsDir);

if (fs.existsSync(uploadsDir)) {
  console.log('✅ Carpeta uploads existe');
  const files = fs.readdirSync(uploadsDir);
  console.log(`📊 Archivos en uploads: ${files.length}`);
  files.forEach(file => {
    const filePath = path.join(uploadsDir, file);
    const stats = fs.statSync(filePath);
    console.log(`   - ${file} (${Math.round(stats.size / 1024)} KB)`);
  });
} else {
  console.log('❌ Carpeta uploads NO existe');
  console.log('💡 Creando carpeta uploads...');
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Carpeta uploads creada');
}

console.log('\n🔗 URLs de ejemplo:');
console.log('   http://localhost:5000/uploads/img-1234567890.jpg');
console.log('   https://tudominio.com/uploads/img-1234567890.jpg');

// Verificar permisos
try {
  const testFile = path.join(uploadsDir, 'test-permissions.txt');
  fs.writeFileSync(testFile, 'test');
  fs.unlinkSync(testFile);
  console.log('✅ Permisos de escritura OK');
} catch (error) {
  console.log('❌ Error de permisos:', error.message);
}