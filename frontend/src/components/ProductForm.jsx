import FloatLabel from "./FloatLabel";
import { Input } from "antd";
import { NumericInput } from "./NumericInput";
import { ImageUpload } from "./ImageUpload";

export const ProductForm = ({ values, handleChange }) => {
    const { TextArea } = Input;


    return (
        <div className="example">

            <FloatLabel label="Nombre (requerido)" name="nombre" value={values.nombre.value}>
                <Input
                    value={values.nombre.value}
                    name="nombre"
                    maxLength={45}
                    onChange={(e) => handleChange(e)} />

            </FloatLabel>
            <FloatLabel label="Precio" name="precio" value={values.precio.value}>

                <NumericInput
                    value={values.precio.value}
                    onChange={e => handleChange(e)}
                    name="precio"
                    maxLength={10}
                />


            </FloatLabel>
            <FloatLabel label="Descripción para el cliente" name="descripcion" value={values.descripcion.value}>

                <TextArea
                    rows={4} maxLength={200}
                    value={values.descripcion.value} name="descripcion" onChange={e => handleChange(e)}
                />
            </FloatLabel>

            <FloatLabel label="Cantidad" name="cantidad" value={values.cantidad.value }>

                <NumericInput
                    value={values.cantidad?.value}
                    onChange={e => handleChange(e)}
                    name="cantidad"
                    maxLength={10}
                /> </FloatLabel>

            <ImageUpload
                value={values.imagen.value}
                onChange={handleChange}
            />
        </div>);
}