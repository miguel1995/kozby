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
  cantidad: {
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

export const PLUS_MENU_ITEMS = [
  { key: "1", label: "Articulos activos", path: "/productos", icon: "active" },
  { key: "2", label: "Articulos archivados", path: "/productos/archivados", icon: "archived" },
  { key: "3", label: "Transacciones", path: "/transacciones", icon: "tx" },
  { key: "4", label: "Descuentos", path: "/descuentos", icon: "discount" },
  { key: "5", label: "Cerrar Sesión", path: "/inicio-sesion", icon: "logout" }
];



export const ERROR_CODES = {
  500: {
    title: "Error interno del servidor",
    message: "Lo sentimos, en este momento el servicio no está disponible",
    label: "Ok",
    redirectPath: null
  },
  401: {
    title: "Su sesión ha expirado",
    message: "Por favor, inicie sesión nuevamente",
    label: "Ir a inicio de sesión",
    redirectPath: "/inicio-sesion"
  }
}

export const PAYMENT_METHODS = [
  {
    key: "1",
    label: "Efectivo",
    value: "EFECTIVO"
  },
  {
    key: "2",
    label: "Tarjeta",
    value: "TARJETA"
  },
  {
    key: "3",
    label: "Zelle",
    value: "ZELLE"
  }
]

export const OTRO_IMPORTE = {
  nombre: "Otro importe",
  id: "1234567890"
}