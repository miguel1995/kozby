import FloatLabel from "../FloatLabel";
import { Input } from "antd";
import { NumericInput } from "../NumericInput";
import { useEffect } from "react";

export const DescuentoForm = ({ values, handleVariantChange }) => {

    return (
        <div className="example">

            <FloatLabel label="Nombre de descuento" name="nombre" value={values.nombre?.value}>
                <Input
                    value={values.nombre?.value}
                    name="nombre"
                    maxLength={45}
                    onChange={(e) => handleVariantChange(e)} />

            </FloatLabel>


            <Select options={[{ label: 'Porcentaje', value: 'PORCENTAJE' }, { label: 'Importe', value: 'IMPORTE' }]} />

            <FloatLabel label="Monto" name="monto" value={values.importe?.value}>
                <Input
                    value={values.monto?.value}
                    name="monto"
                    maxLength={10}
                    onChange={(e) => handleVariantChange(e)} />
            </FloatLabel>
        </div>
    );
}