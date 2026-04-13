import FloatLabel from "../FloatLabel";
import { Input, Select } from "antd";

export const UsuarioForm = ({ values, handleChange, submitted }) => {
  return (
    <div className="example">

      <FloatLabel label="Usuario" name="username" value={values.username.value}>
        <Input
          value={values.username.value}
          name="username"
          maxLength={20}
          onChange={(e) => handleChange(e)}
        />
      </FloatLabel>

     {!values.username.valid && (values.username.value || submitted) && (
        <div className="error-text">
          {values.username.error}
        </div>
      )}


        <Input.Password
        placeholder="**************"
          value={values.password.value}
          name="password"
          onChange={(e) => handleChange(e)}
        />


      {!values.password.valid && (values.password.value || submitted) && (
        <div className="error-text">
          {values.password.error}
        </div>
      )}


        <Select
          className="user-selection-role"
          placeholder="Seleccione un rol"
          value={values.role.value}
          onChange={(value) =>
            handleChange({ target: { name: "role", value } })
          }
          options={[
            { value: "Administrador", label: "Administrador" },
            { value: "Empleado", label: "Empleado" },
          ]}
        />

      {!values.role.valid && (values.role.value || submitted) && (
        <div className="error-text">
          {values.role.error}
        </div>
      )}

    </div>
  );
};