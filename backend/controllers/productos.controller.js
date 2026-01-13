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

  console.log("postProducto controller called");
  //console.log("req: ", req);
  //console.log("req.file: ", req.file);
  //console.log("req.body: ", req.body);

  try {
    let imagenUrl = req.body.imagen;

    // Si hay un archivo subido, subirlo a Cloudinary
    if (req.file) {
      const cloudinary = require('../config/cloudinary');
      const { Readable } = require('stream');
      
      // Promesa para manejar la subida a Cloudinary
      imagenUrl = await new Promise((resolve, reject) => {
        console.log("antes de subir a cloudinary");

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

         // console.log("imagenUrl: ", imagenUrl);


        const bufferStream = Readable.from(req.file.buffer);
        bufferStream.pipe(stream);
      });
    }

    const nuevoProducto = {
      ...req.body,
      imagen: imagenUrl
    };
    
    console.log("nuevoProducto: ", nuevoProducto);

    if (!nuevoProducto.nombre || !nuevoProducto.precio) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }


    const productoCreado = await productosService.createProducto(nuevoProducto);
    console.log("productoCreado: ", productoCreado);

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
