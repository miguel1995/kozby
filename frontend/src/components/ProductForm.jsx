import FloatLabel from "./FloatLabel";
import { Input }from "antd";


export const ProductForm = ({ values, handleChange }) => {

    return (
        <div className="example">

            <FloatLabel label="Nombre" name="nombre" value={values.nombre.value}>
                <Input value={values.nombre.value} name="nombre" onChange={(e) => handleChange(e)} />
            </FloatLabel>
            <FloatLabel label="Precio" name="precio" value={values.precio.value}>
                <Input value={values.precio.value} name='precio' onChange={e => handleChange(e)} />
            </FloatLabel>
            <FloatLabel label="Descripcion" name="descripcion" value={values.descripcion.value}>
                <Input value={values.descripcion.value} name="descripcion" onChange={e => handleChange(e)} />
            </FloatLabel>
            <FloatLabel label="Imagen" name="imagen" value={values.imagen}>
                <Input value={values.imagen.value} name="imagen" onChange={e => handleChange(e)} />
            </FloatLabel>
        </div>);
}