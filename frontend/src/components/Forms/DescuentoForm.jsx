import FloatLabel from "../FloatLabel";
import { Input } from "antd";
import { NumericInput } from "../NumericInput";
import { useEffect, useState } from "react";
import { Select } from 'antd';
import { OPTIONS_TIPO_DESCUENTO } from '../../utils/constants';



export const DescuentoForm = ({ values, handleDescuentoChange }) => {

    const [isImporte, setIsImporte] = useState(false);

    useEffect(() => {
        if (values.tipo?.value === 'IMPORTE') {
            setIsImporte(true);
        } else {
            setIsImporte(false);
        }
    }, [values.tipo]);

    return (
        <div className="example">

           <FloatLabel label="Nombre de descuento" name="nombre" value={values.nombre?.value}>
                <Input
                    value={values.nombre?.value}
                    name="nombre"
                    maxLength={45}
                    onChange={(e) => handleDescuentoChange(e)} />

            </FloatLabel>


            <Select
            style={{ width: '100%', marginBottom: '12px' }}
            options={OPTIONS_TIPO_DESCUENTO} 
            onChange={(e) => handleDescuentoChange({
                target: {
                    name: "tipo",
                    value: e
                }
            })} 
            value={values.tipo?.value}
            name="tipo"
            />

            <NumericInput
                    value={values.monto?.value}
                    name="monto"
                    maxLength={isImporte ? 10 : 2}
                    onChange={(e) => handleDescuentoChange(e)} 
                    placeholder={isImporte ? "$1.50" : "50%"}
                    />
        </div>
    );
}