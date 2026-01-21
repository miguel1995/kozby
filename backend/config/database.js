// src/config/database.js
const mongoose = require('mongoose');

// Configuración de MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error('Por favor configura la variable de entorno MONGODB_URI con tu connection string de MongoDB Atlas');
}

// Conectar a MongoDB Atlas
// Nota: Las opciones useNewUrlParser y useUnifiedTopology ya no son necesarias en mongoose 6+
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas exitosamente');
  })
  .catch((error) => {
    console.error('❌ Error al conectar a MongoDB Atlas:', error.message);
    throw error;
  });

// Manejar eventos de conexión
mongoose.connection.on('error', (err) => {
  console.error('Error de conexión a MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB desconectado');
});

// Manejar cierre de conexión cuando se cierra la aplicación
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Conexión a MongoDB cerrada debido a la terminación de la aplicación');
  process.exit(0);
});

module.exports = mongoose;
