'use strict';

var constantsVidaLey;
define([], function () {
  var vidaLey = {
    APP: 'EMISAVIDALEY',
    STEPS: {
      COTIZACION: {
        CONTRATANTE: '1',
        CONTRATANTE_UPDATE: '1.1',
        POLIZA: '2',
        ASEGURADOS: '3',
        RESULTADOS: '4',
        SOLICITUDTASA: '2.1',
        RECHAZARTASA: '2.2',
        RECHAZARSOLICITUD: '2.3',
        ACEPTARSOLICITUD: '2.4'
      },
      EMISION: {
        CONTACTO: '1',
        RESULTADOS: '2'
      }
    },
    CODIGOS_RECHAZO: ['100', '43', '234', '555', '101', '9835'],
    ESTADOS_PERMITIDOS_ACTUALIZACION: ['SO', 'ST', 'SA', 'AC'],
    SOLICITUD_REGISTRO: 'SO',
    COTIZACION_REGISTRADA: 'RE',
    ROUTES: {
      COTIZACION: {
        url: 'cotizacionPolizaVidaLey',
        name: 'COTIZACION'
      },
      COTIZACION_STEPS: {
        url: 'cotizacionPolizaVidaLey.steps',
        name: 'COTIZAR VIDA LEY'
      },
      BANDEJA_COTIZACION: {
        url: 'bandejaPolizaVidaLey',
        name: 'BANDEJA DE DOCUMENTOS'
      },
      EMISION: {
        url: 'emisionPolizaVidaLey',
        name: 'EMISION'
      },
      EMISION_STEPS: {
        url: 'emisionPolizaVidaLey.steps',
        name: 'EMITIR VIDA LEY'
      },
      EMISION_RESUMEN: {
        url: 'resumenEmisionVidaLey',
        name: 'EMISION RESUMEN'
      },
      MANTENIMIENTO: {
        url: 'mantenimientoVidaLey',
        name: 'MANTENIMIENTOS'
      },
      BANDEJA_REPORTES: {
        url: 'bandejaReportesVidaLey',
        name: 'REPORTES'
      },
      RESUMEN: {
        url: 'resumenVidaLey',
        name: 'RESUMEN'
      },
      REPORTE: {
        url: 'reporteVidaLey',
        name: 'REPORTE'
      }
    },
    TIPOS_DOCUMENTO_ASEGURADO: [
      { Codigo: 'CEX', Descripcion: 'Carnet de Extranjería' },
      { Codigo: 'CIP', Descripcion: 'Carnet de Identidad Personal' },
      { Codigo: 'DNI', Descripcion: 'Documento Nacional de Identidad' }
    ],
    CODIGO_COBERTURA_MUERTE: 5004,
    CODIGO_APLICACION: 'EMISA',
    CODIGO_PRODUCTO: 'V',
    ARCHIVOS: {
      PLANTILLA_EXCEL_ASEGURADOS: 'app/assets/vida-ley/Trama_Trabajadores_Vida_Ley.xls'
    },
    NUMERO_SUPLEMENTO: 0,
    NUMERO_APLICACION: 1,
    NUMERO_SUPLEMENTO_APLICACION: 1,
    SIMBOLO_MONEDA: 'S/',
    PERSONA: {
      CODIGO_APLICACION: 'V',
      FORMULARIO_CONTRATANTE: 'CONT',
      FORMULARIO_ASEGURADO: 'ASEG'
    },
    TIPO_PERIODO_DEFAULT: 'N',
    VALIDATORS: {
      CONTRATANTE: {
        Controls: [
          {
            "Code": "TIP_DOCUM",
            "FieldId": 1,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Tipo de Documento es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              }
            ]
          },
          {
            "Code": "COD_DOCUM",
            "FieldId": 2,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Número de Documento es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              }
            ]
          },
          {
            "Code": "NAME_PERSON",
            "FieldId": 3,
            "FieldVisivility": 1,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Nombre completo es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              },
              {
                "ValidationId": 2,
                "Value": "^.{0,100}$",
                "Message": "El campo Nombre completo debe tener máximo 100 caracteres",
                "Order": 2,
                "Type": "PATTERN"
              }
            ]
          },
          {
            "Code": "HOUSE_PHONE",
            "FieldId": 4,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Teléfono es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              },
              {
                "ValidationId": 2,
                "Value": "^([0-9\\ ]+)?$",
                "Message": "El campo Teléfono tiene caracteres no admisibles",
                "Order": 2,
                "Type": "PATTERN"
              },
              {
                "ValidationId": 2,
                "Value": "^(.{6,10})?$",
                "Message": "El campo Teléfono debe tener entre 6 a 10 caracteres",
                "Order": 3,
                "Type": "PATTERN"
              },
              {
                "ValidationId": 4,
                "Value": "1",
                "Message": "El campo Teléfono no es válido",
                "Order": 4,
                "Type": "PROCEDURE"
              }
            ]
          },
          {
            "Code": "EMAIL",
            "FieldId": 5,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Correo electrónico es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              },
              {
                "ValidationId": 2,
                "Value": "^(([a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*)[._-]?@([a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*\\.[a-zA-Z]{2,}\\.?)([a-zA-Z0-9]*))?$",
                "Message": "El campo Correo electrónico tiene caracteres no admisibles",
                "Order": 2,
                "Type": "PATTERN"
              },
              {
                "ValidationId": 2,
                "Value": "^.{0,30}$",
                "Message": "El campo Correo electrónico debe tener máximo 30 caracteres",
                "Order": 3,
                "Type": "PATTERN"
              },
              {
                "ValidationId": 3,
                "Value": "1",
                "Message": "El campo Correo electrónico no es válido",
                "Order": 4,
                "Type": "SERVICE"
              }
            ]
          }
        ]
      },
      ASEGURADO: {
        Controls: [
          {
            "Code": "TIP_DOCUM",
            "FieldId": 1,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Tipo de Documento es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              }
            ]
          },
          {
            "Code": "COD_DOCUM",
            "FieldId": 2,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Número de Documento es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              }
            ]
          },
          {
            "Code": "NAME_PERSON",
            "FieldId": 3,
            "FieldVisivility": 1,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "^.{0,50}$",
                "Message": "El campo Nombres debe tener máximo 50 caracteres",
                "Order": 1,
                "Type": "PATTERN"
              },
              {
                "ValidationId": 1,
                "Value": "(^$|^[a-zA-Z\\ \\'ñÑáéíóúÁÉÍÓÚ\\.\\/]+$)",
                "Message": "El campo Nombres tiene caracteres no admisibles",
                "Order": 2,
                "Type": "PATTERN"
              }
            ]
          },
          {
            "Code": "LASTNAME",
            "FieldId": 4,
            "FieldVisivility": 1,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "^.{0,30}$",
                "Message": "El campo Apellido Paterno debe tener máximo 30 caracteres",
                "Order": 1,
                "Type": "PATTERN"
              },
              {
                "ValidationId": 1,
                "Value": "(^$|^[a-zA-Z\\ \\'ñÑáéíóúÁÉÍÓÚ\\.\\/]+$)",
                "Message": "El campo Apellido Paterno tiene caracteres no admisibles",
                "Order": 2,
                "Type": "PATTERN"
              }
            ]
          },
          {
            "Code": "SECOND_LASTNAME",
            "FieldId": 5,
            "FieldVisivility": 1,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "^.{0,30}$",
                "Message": "El campo Apellido Materno debe tener máximo 30 caracteres",
                "Order": 1,
                "Type": "PATTERN"
              },
              {
                "ValidationId": 1,
                "Value": "(^$|^[a-zA-Z\\ \\'ñÑáéíóúÁÉÍÓÚ\\.\\/]+$)",
                "Message": "El campo Apellido Materno tiene caracteres no admisibles",
                "Order": 2,
                "Type": "PATTERN"
              }
            ]
          },
          {
            "Code": "NAMES_PERSON",
            "FieldId": 6,
            "FieldVisivility": 1,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "^.{0,100}$",
                "Message": "El campo Nombre completo debe tener máximo 100 caracteres",
                "Order": 1,
                "Type": "PATTERN"
              },
              {
                "ValidationId": 1,
                "Value": "(^$|^[a-zA-Z\\ \\'ñÑáéíóúÁÉÍÓÚ\\.\\/]+$)",
                "Message": "El campo Nombre completo tiene caracteres no admisibles",
                "Order": 2,
                "Type": "PATTERN"
              }
            ]
          },
          {
            "Code": "BIRTHDATE",
            "FieldId": 7,
            "FieldVisivility": 1,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Fecha de Nacimiento es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              }
            ]
          },
          {
            "Code": "PROFESSION",
            "FieldId": 8,
            "FieldVisivility": 1,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Ocupación es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              },
              {
                "ValidationId": 2,
                "Value": "^.{0,28}$",
                "Message": "El campo Ocupación debe tener máximo 28 caracteres",
                "Order": 3,
                "Type": "PATTERN"
              }
            ]
          },
          {
            "Code": "SALARY",
            "FieldId": 9,
            "FieldVisivility": 1,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Sueldo es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              },
              {
                "ValidationId": 2,
                "Value": "^[0-9]+(\.[0-9][0-9])?$",
                "Message": "El campo Sueldo debe ser un número positivo con 2 decimales",
                "Order": 2,
                "Type": "PATTERN"
              }
            ]
          }
        ]
      }
    },
    COD_APLI: 'EMISA-VIDALEY',
    NOMBRE_APP: 'VIDALEY',
    MENU: 'evoSubMenuEMISA',
    SUBMENUS: {
      COTIZAR_VIDA_LEY: 'COTIZAR VIDA LEY',
      EMITIR_VIDA_LEY: 'EMITIR VIDA LEY',
    },
    DOCUMENTS: {
      RECIBO: 'RECIBO',
      POLIZA: 'POLIZA',
      CONSTANCIA: 'CONSTANCIA',
      CONDICIONES: 'CONDICION',
      CERTIFICADOS: 'CERTIFICADO'
    },
    PARAMETERS: {
      COTI_NRO_ASEGURADOS: 'COTI_NRO_ASEGURADOS'
    }
  };

  constantsVidaLey = vidaLey;
  return vidaLey;
});
