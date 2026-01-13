import FloatLabel from "./FloatLabel";
import { Input } from "antd";
import { ImageUpload } from "./ImageUpload";

export const ProductForm = ({ values, handleChange }) => {

    return (
        <div className="example">

            <FloatLabel label="Nombre (requerido)" name="nombre" value={values.nombre.value}>
                <Input value={values.nombre.value} name="nombre" onChange={(e) => handleChange(e)} />
            </FloatLabel>
            <FloatLabel label="Precio" name="precio" value={values.precio.value}>
                <Input value={values.precio.value} name='precio' onChange={e => handleChange(e)} />
            </FloatLabel>
            <FloatLabel label="Descripción" name="descripcion" value={values.descripcion.value}>
                <Input value={values.descripcion.value} name="descripcion" onChange={e => handleChange(e)} />
            </FloatLabel>
            <ImageUpload
                value={values.imagen.value}
                onChange={handleChange}
            />
        </div>);
}