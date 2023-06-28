'use strict';
define([], function () {
  var Sepelios = {
    ROUTES: {
      COTIZACION: 'cotizacionSepelio',
      COTIZACION_STEPS: 'cotizacionSepelio.steps',
      BANDEJA_COTIZACION: 'bandejaPolizaCampoSanto',
      REPOSITORIO_DOCUMENTOS: 'repositorioDocumentosCamposanto',
      RESUMEN: 'resumenRiesgosGenerales',
      BANDEJA_DOCUMENTOS: "bandejaDocumentosCampoSanto",
      CORREO_EXCEPCIONAL: "correoExcepcionalCampoSanto",
      GESTION_DOCUMENTOS: "cpsGestionDocumentos",
      AGRUPAMIENTO : "cpsAgrupamiento"
    },
    District :[
      {distrito: 'CERCADO DE LIMA', zona: 'ANTIGUA'},
      {distrito: 'ANCON' , zona: ' PERIFERIA'},
      {distrito: 'ATE' , zona:'ESTE'},
      {distrito: 'BREÑA' , zona:'ANTIGUA'},
      {distrito: 'CARABAYLLO' , zona:'NORTE'},
      {distrito: 'COMAS' , zona:'NORTE'},
      {distrito: 'CHACLACAYO' , zona:'PERIFERIA'},
      {distrito: 'CHORRILLOS' , zona:'SUR'},
      {distrito: 'LA VICTORIA' , zona:'ANTIGUA'},
      {distrito: 'LA MOLINA	' , zona:'MODERNA'},
      {distrito: 'LINCE	' , zona:'MODERNA'},
      {distrito: 'LURIGANCHO' , zona:'PERIFERIA'},
      {distrito: 'LURIN' , zona:'PERIFERIA'},
      {distrito: 'MAGDALENA DEL MAR', zona:'MODERNA'},
      {distrito: 'MIRAFLORES', zona:'MODERNA'},
      {distrito: 'PACHACAMAC', zona:'PERIFERIA'},
      {distrito: 'PUEBLO LIBRE', zona:'MODERNA'},
      {distrito: 'PUCUSANA', zona:'PERIFERIA'},
      {distrito: 'PUENTE PIEDRA', zona:'NORTE'},
      {distrito: 'PUNTA HERMOSA', zona:'PERIFERIA'},
      {distrito: 'PUNTA NEGRA', zona:'PERIFERIA'},
      {distrito: 'RIMAC', zona:'ANTIGUA'},
      {distrito: 'SAN BARTOLO', zona:'PERIFERIA'},
      {distrito: 'SAN ISIDRO', zona:'MODERNA'},
      {distrito: 'BARRANCO', zona:'MODERNA'},
      {distrito: 'SAN MARTIN DE PORRES', zona:'NORTE'},
      {distrito: 'SAN MIGUEL', zona:'MODERNA'},
      {distrito: 'SANTA MARIA DEL MAR', zona:'PERIFERIA'},
      {distrito: 'SANTA ROSA', zona:'PERIFERIA'},
      {distrito: 'SANTIAGO DE SURCO', zona:'MODERNA'},
      {distrito: 'SURCO', zona:'MODERNA'},
      {distrito: 'SURQUILLO', zona:'MODERNA'},
      {distrito: 'VILLA MARIA DEL TRIUNFO', zona:'SUR'},
      {distrito: 'JESUS MARIA', zona:'MODERNA'},
      {distrito: 'INDEPENDENCIA', zona:'NORTE'},
      {distrito: 'EL AGUSTINO', zona:'ESTE'},
      {distrito: 'SAN JUAN DE MIRAFLORES', zona:'SUR'},
      {distrito: 'SAN JUAN DE LURIGANCHO', zona:'ESTE'},
      {distrito: 'SAN LUIS', zona:'ANTIGUA'},
      {distrito: 'CIENEGUILLA', zona:'PERIFERIA'},
      {distrito: 'SAN BORJA', zona:'MODERNA'},
      {distrito: 'VILLA EL SALVADOR', zona:'SUR'},
      {distrito: 'LOS OLIVOS', zona:'NORTE'},
      {distrito: 'SANTA ANITA', zona:'ESTE'},
      {distrito: 'CALLAO', zona:'CALLAO'},
      {distrito: 'BELLAVISTA', zona:'CALLAO'},
      {distrito: 'LA PUNTA', zona:'CALLAO'},
      {distrito: 'CARMEN DE LA LEGUA-REYNOSO', zona:'CALLAO'},
      {distrito: 'CARMEN DE LA LEGUA', zona:'CALLAO'},
      {distrito: 'LA PERLA', zona:'CALLAO'},
      {distrito: 'VENTANILLA', zona:'CALLAO'},
      {distrito: 'MI PERU', zona:'CALLAO'},
    ],
    SMS_ERROR:{
      REQUERIDO :"* Este campo es obligatorio",
      EMAIL: "* Ingrese un correo válido",
    },
    view:{
      alternativas: "cotizacion-alternativas",
      simulador: "simulador-cotizacion",
      detalleFina: "detalle-cotizacion-financiado",
      detalleConta: "detalle-cotizacion-contado"
    },
    RAMOS: {
      NI: 400,
      NI_TEXT: "Necesidad Inmediata",
      NF: 401,
      NF_TEXT: "Necesidad Futura",
    },
    RESERVAS: [
      {
        Codigo: 'con_reserva',
        Text: 'Con reserva'
      },
      {
        Codigo: 'no_req_reserva',
        Text: 'No requiere reserva'
      },
      {
        Codigo: 'sin_reserva',
        Text: 'Sin reserva'
      }
    ],
    TABS : {
      BENEFICI: "Beneficiario"
    }

  };
  return Sepelios;
});
