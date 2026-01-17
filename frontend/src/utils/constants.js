export const initialFormValues = {
    nombre: {
      value: "",
      valid: null,
      required: true,
      error: "Ingrese un nombre del artículo"
    },
    precio: {
      value: "",
      valid: null,
      required: true,
      error: "Ingrese un precio valido"
    },
    descripcion: {
      value: "",
      valid: null,
      required: false,
      error: null
    },
    imagen: {
      value: "",
      valid: null,
      required: false,
      error: null
    }
  }