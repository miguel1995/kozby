import { useState } from 'react';

function Productos() {

    const [productos, setProductos] = useState([
        {
            "id": 1,
            "nombre": "Audífonos Bluetooth",
            "descripcion": "Audífonos inalámbricos",
            "imagen": "imagenes/audifonos.jpg",
            "categoria_id": 1,
            "fecha_creacion": "2025-12-14T00:32:03.000Z",
            "fecha_modificacion": "2025-12-14T00:32:03.000Z",
            "precio": "120000.00"
        },
        {
            "id": 2,
            "nombre": "Camiseta Negra",
            "descripcion": "Camiseta algodón talla M",
            "imagen": "imagenes/camiseta.jpg",
            "categoria_id": 2,
            "fecha_creacion": "2025-12-14T00:32:03.000Z",
            "fecha_modificacion": "2025-12-14T00:32:03.000Z",
            "precio": "45000.00"
        },
        {
            "id": 3,
            "nombre": "Balón de fútbol",
            "descripcion": "Balón profesional",
            "imagen": "https://www.shutterstock.com/image-vector/bathe-theme-soap-shampoo-rubber-260nw-2273020309.jpg",
            "categoria_id": 4,
            "fecha_creacion": "2025-12-14T00:32:03.000Z",
            "fecha_modificacion": "2025-12-14T00:32:03.000Z",
            "precio": "90000.00"
        },
        {
            "id": 4,
            "nombre": "Audífonos Bluetooth",
            "descripcion": "Audífonos inalámbricos",
            "imagen": "https://www.shutterstock.com/image-vector/bathe-theme-soap-shampoo-rubber-260nw-2273020309.jpg",
            "categoria_id": 1,
            "fecha_creacion": "2025-12-16T01:49:36.000Z",
            "fecha_modificacion": "2025-12-16T01:49:36.000Z",
            "precio": "120000.00"
        },
        {
            "id": 5,
            "nombre": "Audífonos Bluetooth",
            "descripcion": "Audífonos inalámbricos",
            "imagen": "https://www.shutterstock.com/image-vector/bathe-theme-soap-shampoo-rubber-260nw-2273020309.jpg",
            "categoria_id": 1,
            "fecha_creacion": "2025-12-16T01:49:40.000Z",
            "fecha_modificacion": "2025-12-16T01:49:40.000Z",
            "precio": "120000.00"
        },
        {
            "id": 6,
            "nombre": "Audífonos Bluetooth",
            "descripcion": "Audífonos inalámbricos",
            "imagen": "https://www.shutterstock.com/image-vector/bathe-theme-soap-shampoo-rubber-260nw-2273020309.jpg",
            "categoria_id": 1,
            "fecha_creacion": "2025-12-16T01:49:48.000Z",
            "fecha_modificacion": "2025-12-16T01:49:48.000Z",
            "precio": "120000.00"
        },
        {
            "id": 7,
            "nombre": "Audífonos Bluetooth",
            "descripcion": null,
            "imagen": "https://www.shutterstock.com/image-vector/bathe-theme-soap-shampoo-rubber-260nw-2273020309.jpg",
            "categoria_id": 1,
            "fecha_creacion": "2025-12-16T01:50:08.000Z",
            "fecha_modificacion": "2025-12-16T01:50:08.000Z",
            "precio": "120000.00"
        },
        {
            "id": 8,
            "nombre": "Audífonos Bluetooth",
            "descripcion": "",
            "imagen": "https://www.shutterstock.com/image-vector/bathe-theme-soap-shampoo-rubber-260nw-2273020309.jpg",
            "categoria_id": 1,
            "fecha_creacion": "2025-12-16T01:50:24.000Z",
            "fecha_modificacion": "2025-12-16T01:50:24.000Z",
            "precio": "120000.00"
        },
        {
            "id": 9,
            "nombre": "Audífonos Bluetooth",
            "descripcion": "Audífonos inalámbricos",
            "imagen": "https://www.shutterstock.com/image-vector/bathe-theme-soap-shampoo-rubber-260nw-2273020309.jpg",
            "categoria_id": 1,
            "fecha_creacion": "2025-12-16T01:52:20.000Z",
            "fecha_modificacion": "2025-12-16T01:52:20.000Z",
            "precio": "120000.00"
        },
        {
            "id": 10,
            "nombre": "Audífonos Bluetooth",
            "descripcion": "Audífonos inalámbricos",
            "imagen": "https://www.shutterstock.com/image-vector/bathe-theme-soap-shampoo-rubber-260nw-2273020309.jpg",
            "categoria_id": 1,
            "fecha_creacion": "2025-12-16T01:52:25.000Z",
            "fecha_modificacion": "2025-12-16T01:52:25.000Z",
            "precio": "120000.00"
        },
        {
            "id": 11,
            "nombre": "Audífonos Bluetooth",
            "descripcion": "Audífonos inalámbricos",
            "imagen": "https://www.shutterstock.com/image-vector/bathe-theme-soap-shampoo-rubber-260nw-2273020309.jpg",
            "categoria_id": 1,
            "fecha_creacion": "2025-12-16T01:52:37.000Z",
            "fecha_modificacion": "2025-12-16T01:52:37.000Z",
            "precio": "120000.00"
        },
        {
            "id": 12,
            "nombre": "Audífonos Bluetooth",
            "descripcion": "Audífonos inalámbricos",
            "imagen": "https://www.shutterstock.com/image-vector/bathe-theme-soap-shampoo-rubber-260nw-2273020309.jpg",
            "categoria_id": 1,
            "fecha_creacion": "2025-12-16T01:53:01.000Z",
            "fecha_modificacion": "2025-12-16T01:53:01.000Z",
            "precio": "120000.00"
        }
    ]);


    return (
        <div>
            <h1>Productos</h1>
            <ul>
                {productos.map((producto) => (
                    <li key={producto.id}>
                        <img src={producto.imagen} alt={producto.nombre} />
                        <h2>{producto.nombre}</h2>
                        <p>{producto.descripcion}</p>
                        <p>{producto.precio}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Productos;