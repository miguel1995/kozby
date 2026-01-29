import FloatLabel from "../FloatLabel";
import { Input } from "antd";
import { NumericInput } from "../NumericInput";
import { useEffect } from "react";

export const VariantForm = ({ values, handleVariantChange}) => {

    useEffect(() => {
        console.log("VariantForm values", values);
    }, [values]);

    return (
        <div className="example">

                    <FloatLabel label="Nombre (requerido)" name="nombre" value={values.nombre?.value}>
                        <Input
                            value={values.nombre?.value}
                            name="nombre"
                            maxLength={45}
                            onChange={(e) => handleVariantChange(e)} />

                    </FloatLabel>
                    <FloatLabel label="Precio" name="precio" value={values.precio?.value}>

                        <NumericInput
                            value={values.precio?.value}
                            onChange={e => handleVariantChange(e)}
                            name="precio"
                            maxLength={10}
                        />


                    </FloatLabel>

                    <FloatLabel label="Cantidad" name="cantidad" value={values.cantidad?.value || "0"}>

                        <NumericInput
                            value={values.cantidad?.value || "0"}
                            onChange={e => handleVariantChange(e)}
                            name="cantidad"
                            maxLength={3}
                        />
                    </FloatLabel>

                </div>
                );
}