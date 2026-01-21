// src/config/database.js
const mongoose = require('mongoose');

// Configuración de MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// Diagnóstico: Mostrar información de la variable de entorno (ocultando contraseña por seguridad)
if (MONGODB_URI) {
  // Ocultar la contraseña del connection string para no exponerla en logs
  const uriSeguro = MONGODB_URI.replace(/\/\/[^:]+:([^@]+)@/, '//****:****@');
  console.log('🔍 Diagnóstico MongoDB URI:');
  console.log('- MONGODB_URI configurada:', uriSeguro);
  console.log('- Longitud del connection string:', MONGODB_URI.length);
  console.log('- Incluye mongodb+srv:', MONGODB_URI.includes('mongodb+srv'));
} else {
  console.log('⚠️  MONGODB_URI no está configurada');
}

if (!MONGODB_URI) {
  throw new Error('Por favor configura la variable de entorno MONGODB_URI con tu connection string de MongoDB Atlas');
}

// Función para conectar a MongoDB Atlas
const connectDB = async () => {
  try {
    // Conectar a MongoDB Atlas
    // Nota: Las opciones useNewUrlParser y useUnifiedTopology ya no son necesarias en mongoose 6+
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas exitosamente');
    console.log('📍 Base de datos:', mongoose.connection.db?.databaseName || 'conectando...');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB Atlas:', error.message);
    console.error('Error completo:', error);
    throw error;
  }
};

// Manejar eventos de conexión
mongoose.connection.on('error', (err) => {
  console.error('Error de conexión a MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB desconectado');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB conectado - estado:', mongoose.connection.readyState);
});

// Manejar cierre de conexión cuando se cierra la aplicación
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Conexión a MongoDB cerrada debido a la terminación de la aplicación');
  process.exit(0);
});

// Exportar mongoose y la función de conexión
module.exports = mongoose;
module.exports.connectDB = connectDB;