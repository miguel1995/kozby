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
      value: "0",
      valid: true,
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
    },
    variantes: {
      value: [],
      valid: true,
      required: false,
      error: "Ingrese una variante valida"
    }
  }

  export const initialVariantesValues = {
    id: {
        value: null,
        valid: true
    },
    nombre: {
        value: "",
        valid: null
    },
    precio: {
        value: "",
        valid: null,
    },
    cantidad: {
        value: "0",
        valid: true
    }
}


  export const VARIANTES_ACTIONS = {
    CREATE: "create",
    UPDATE: "update",
    DELETE: "delete"
  }