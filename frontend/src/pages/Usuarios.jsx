import { useEffect, useState } from "react";
import { getUsuarios, deleteUsuario } from "../services/usuarios.service";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  const cargar = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const onDelete = async (id) => {
    await deleteUsuario(id);
    await cargar();
  };

  return (
    <div className="users-page">
      <h2>Usuarios</h2>

      {usuarios.map((u) => (
        <div key={u.id} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
          <div style={{ width: 200 }}>{u.username}</div>
          <div style={{ width: 200 }}>{u.role}</div>
          <button onClick={() => onDelete(u.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}
