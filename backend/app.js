const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();

app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});
app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

app.use('/productos', require('./routes/productos.routes'));
app.use('/', require('./routes/authentication.routes'));
app.use('/transaccion', require('./routes/transaccion.routes'));




app.use((error, req, res, next) => {
  if (error instanceof require('multer').MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'El archivo es demasiado grande. Máximo 5MB' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Campo inesperado. Use el campo "imagen"' });
    }
    return res.status(400).json({ 
      message: 'Error al procesar el archivo', 
      error: error.message,
      code: error.code 
    });
  }
  next(error);
});

module.exports = app;
