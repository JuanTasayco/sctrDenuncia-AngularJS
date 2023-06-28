var messages;

define([], function () {
    var data={
        UNEXPECTED_ERROR: 'Ha ocurrido un error inesperado. Por favor, vuelva a intentarlo más tarde.',
        DEMO_MESSAGE: 'Mensaje de Prueba',
        FILE_MASSIVE_TYPES: {
            CREACION_EJECUTIVO : 1,
            CREACION_CLIENTE_EMPRESA: 2,
            CREACION_CORREDOR: 3,
            CREACION_PROVEEDOR: 4,
            MODIFICACION_ADMIN: 5,
            MODIFICACION_REGULAR: 6,
            DESHABILITACION: 7,
            CLONACION_EJECUTIVO : 8

        },
        USER_TYPES_DESCRIPTION: {
            REGULAR: {codigo: 1, descripcion: 'REGULAR'} ,
            ADMINISTRADOR: {codigo: 2, descripcion: 'ADMINISTRADOR'} 
        },
        CODIGO_ESTADO: {
            HABILITADO: 1,
            DESHABILITADO: 2,
            ELIMINADO: 3
        }
    };
    
    messages=data;
    return data;
  });
