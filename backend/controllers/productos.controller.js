const productosService = require('../services/productos.service');


const getProductos = async (req, res) => {
  try {
    const productos = await productosService.getProductos();
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};


const getProductosArchivados = async (req, res) => {

  try {
    const productos = await productosService.getProductosArchivados();
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener productos archivados:', error);
    res.status(500).json({ message: 'Error al obtener productos archivados' });
  }
};

const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await productosService.getProductoById(id);
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto',error:error });
  }
};

const postProducto = async (req, res) => {


  try {
    let imagenUrl = req.body.imagen;

    // Si hay un archivo subido, subirlo a Cloudinary
    if (req.file) {
      const cloudinary = require('../config/cloudinary');
      const { Readable } = require('stream');
      
      // Promesa para manejar la subida a Cloudinary
      imagenUrl = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'kozby/products',
            resource_type: 'image',
            transformation: [{ width: 800, height: 800, crop: 'limit' }]
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );


        const bufferStream = Readable.from(req.file.buffer);
        bufferStream.pipe(stream);
      });
    }

    const nuevoProducto = {
      ...req.body,
      imagen: imagenUrl
    };
    

    if (!nuevoProducto.nombre || !nuevoProducto.precio || nuevoProducto.cantidad == null) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    if (nuevoProducto.cantidad < 0 ) {
      return res.status(400).json({ message: 'La cantidad no puede ser negativa' });
    }


    const productoCreado = await productosService.createProducto(nuevoProducto);

    res.status(201).json({
      message: 'Producto creado correctamente',
      producto: productoCreado,
    });
  } catch (error) {
    console.error('Error al crear producto:', error); 
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
};


const putProducto = async (req, res) => { 
  try {
    const { id } = req.params;
    let imagenUrl = req.body.imagen;

    // Si hay un archivo subido, subirlo a Cloudinary
    if (req.file) {
      const cloudinary = require('../config/cloudinary');
      const { Readable } = require('stream');
      
      // Promesa para manejar la subida a Cloudinary
      imagenUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'kozby/products',
            resource_type: 'image',
            transformation: [{ width: 800, height: 800, crop: 'limit' }]
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );

        const bufferStream = Readable.from(req.file.buffer);
        bufferStream.pipe(stream);
      });
    }

    const updates = {
      ...req.body,
      imagen: imagenUrl
    };

    if (updates.cantidad != null && updates.cantidad < 0) {
      return res.status(400).json({ message: 'La cantidad no puede ser negativa' });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No se enviaron campos para actualizar' });
    }

    const productoActualizado = await productosService.updateProducto(id, updates);

    if (!productoActualizado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({
      message: 'Producto actualizado correctamente',
      producto: productoActualizado,
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};


const archiveProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const ok = await productosService.archivarProducto(id);

    if (!ok) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto archivado correctamente' });
  } catch (error) {
    console.error('Error al archivar producto:', error);
    res.status(500).json({ message: 'Error al archivar producto' });
  }
};

const restaurarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const ok = await productosService.restaurarProducto(id);

    if (!ok) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto restaurado correctamente' });
  } catch (error) {
    console.error('Error al restaurar producto:', error);
    res.status(500).json({ message: 'Error al restaurar producto' });
  }
};

const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const imageId = req.query.imageId;
    console.log('Iniciando eliminación de producto', req);
    console.log("obteniendo imagen de prueba",imageId);
    const cloudinary = require('../config/cloudinary');
    const result = await cloudinary.uploader.destroy(imageId);
    console.log(result);
    


    const eliminado = await productosService.deleteProducto(id);

    if (!eliminado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error al eliminar producto' });


  }
};

module.exports = {
  getProductos,
  getProductosArchivados,
  getProductoById,
  postProducto,
  putProducto,
  archiveProducto,
  deleteProducto,
  restaurarProducto,
};
