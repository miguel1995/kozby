// src/server.js
const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.SERVER_PORT || 3000;

// Iniciar servidor solo después de conectar a MongoDB
const startServer = async () => {
  try {
    // Esperar a que MongoDB esté conectado
    await connectDB();
    
    // Iniciar servidor una vez que MongoDB esté listo
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log('Estado de MongoDB:', require('mongoose').connection.readyState === 1 ? '✅ Conectado' : '❌ Desconectado');
    });
  } catch (error) {
    console.error('❌ No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
