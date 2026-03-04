
import { Input, Radio } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { usePaymentProcess } from '../hooks/usePaymentProcess';
import { useNavigate } from 'react-router-dom';


const NuevaOrden = () => {
    const navigate = useNavigate();
    const { product, errorData, loading } = usePaymentProcess();
    const [value, setValue] = useState(null);
    const [options, setOptions] = useState([]);

    const labelStyle = {
        height: 32,
        lineHeight: '32px',
    };

    useEffect(() => {
        if (product.variantes) {
        setOptions(product.variantes.map(variante => ({
            value: variante.id,
                style: labelStyle,
                label: variante.nombre
            })));
        }
    }, [product.variantes]);

    const onChange = (e) => {
        setValue(e.target.value);
    };
    return (
        <div>
            <div>
                <div><CloseOutlined
                    onClick={() => navigate('/proceso-pagos')}
                /></div>
                <div>{product.nombre} ${product.precio}</div>
                <div onClick={() => handleAddProduct()}>Agregar</div>
            </div>

            <div>
                <div>{product.nombre}</div>

                <Radio.Group
                    vertical
                    onChange={onChange}
                    value={value}
                    options={options}
                />
                <div>cantidad</div>
                <div>Notas</div>
                <div>descuentos</div>
                <div>descripcion del articulo</div>
            </div>
        </div>
    );
};

export default NuevaOrden;