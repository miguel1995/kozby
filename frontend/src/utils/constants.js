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
    cantidad:{
      value: "",
      valid: null,
      required: true,
      error: "Ingrese una cantidad valida"
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