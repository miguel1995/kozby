import { ButtonAmount } from './buttons/ButtonAmount';
import { Divider } from 'antd';

const ListProductos = ({ productos, hacerClickCallback, clickAction }) => {

    return (
        <div className="productos-list">
            {productos.map((producto) => (
                <div key={producto.id}>
                    <div className="producto-item" onClick={() => {
                        hacerClickCallback(clickAction, producto)
                    }}>
                        <div className="producto-item-info-container" >
                            <div>
                                <img src={producto.imagen} alt="" style={{ width: 39, height: 'auto', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <div className="producto-item-nombre">{producto.nombre}</div>
                                <div className="producto-item-precio">$ {producto.precio}</div>

                                {producto.variantes.length == 0 && <ButtonAmount amount={producto.cantidad} clickHandler={() => { }} />}
                                
                            </div>

                        </div>
                        <div>
                            <div className="producto-item-cantidad">
                                {producto.variantes.length > 0 ?
                                    <div>{producto.variantes.length} precios</div>
                                    : <div>${producto.precio}</div>}
                            </div>
                        </div>
                    </div>
                    <Divider style={{ margin: '8px 0' }} />
                </div>
            ))}
        </div>
    )
}

export default ListProductos;