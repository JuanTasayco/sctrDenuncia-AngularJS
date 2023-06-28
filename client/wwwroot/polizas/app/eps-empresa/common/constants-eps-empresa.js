'use strict';

var constantsEpsEmpresa;
define([], function () {
  var epsEmpresa = {
    STEPS: {
      DATOS_EMPRESA: '1',
      INFORMACION_EMPRESA: '2',
      INFORMACION_TRABAJADORES: '3',
      INFORMACION_ADICIONAL: '4',
      INFORMACION_FINAL: '5'
    },
    ROUTES: {
      HOME: 'homePolizaEpsEmpresa',
      REGISTRAR_SOLICITUD: 'cotizacionPolizaEpsEmpresa',
      REGISTRAR_SOLICITUD_STEPS: 'cotizacionPolizaEpsEmpresa.steps',
      BANDEJA: 'bandejaPolizaEpsEmpresa',
      MANTENIMIENTO: 'mantenimientoPolizaEpsEmpresa',
      ERROR_INTERNO: 'error_interno',
      VALIDACION: 'validacionPolizaEpsEmpresa'
    },
    VALIDATORS: {
      DATOS_EMPRESA: {
        Controls: [
          {
            "Code": "RUC",
            "FieldId": 1,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo RUC es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              },
              {
                "ValidationId": 2,
                "Value": "^([0-9\\ ]+)?$",
                "Message": "El campo RUC tiene caracteres no admisibles",
                "Order": 2,
                "Type": "PATTERN"
              },
              {
                "ValidationId": 3,
                "Value": "^.{11}$",
                "Message": "El campo RUC debe tener 11 caracteres",
                "Order": 3,
                "Type": "PATTERN"
              }
            ]
          },
          {
            "Code": "RAZON_SOCIAL",
            "FieldId": 2,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Razón social es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              },
              {
                "ValidationId": 2,
                "Value": "^.{0,100}$",
                "Message": "El campo Razón social debe tener máximo 100 caracteres",
                "Order": 2,
                "Type": "PATTERN"
              },
            ]
          },
          {
            "Code": "RAZON_COMERCIAL",
            "FieldId": 3,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Razón comercial es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              },
              {
                "ValidationId": 2,
                "Value": "^.{0,100}$",
                "Message": "El campo Razón comercial debe tener máximo 100 caracteres",
                "Order": 2,
                "Type": "PATTERN"
              },
            ]
          },
          {
            "Code": "TELEFONO",
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
            "Code": "DIRECCION",
            "FieldId": 5,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Dirección es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              },
              {
                "ValidationId": 2,
                "Value": "^.{0,100}$",
                "Message": "El campo Dirección debe tener máximo 100 caracteres",
                "Order": 2,
                "Type": "PATTERN"
              },
            ]
          },
          {
            "Code": "NOMBRE_CONTACTO",
            "FieldId": 6,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Nombre de contacto es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              },
              {
                "ValidationId": 2,
                "Value": "^([0-9]*[a-zA-Z ]{1}[0-9]*[a-zA-Z ]{1}[0-9]*[a-zA-Z ]{1}[0-9]*[a-zA-Z ]{1}[0-9]*[a-zA-Z ]{1})",
                "Message": "El campo Nombre de contacto debe tener al menos 5 letras con cero o más dígitos",
                "Order": 2,
                "Type": "PATTERN"
              }
            ]
          },
          {
            "Code": "CARGO_CONTACTO",
            "FieldId": 7,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Cargo de contacto es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              },
              {
                "ValidationId": 2,
                "Value": "^.{0,100}$",
                "Message": "El campo Cargo de contacto debe tener máximo 100 caracteres",
                "Order": 2,
                "Type": "PATTERN"
              },
            ]
          },
          {
            "Code": "CORREO_CONTACTO",
            "FieldId": 8,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Correo de contacto es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              },
              {
                "ValidationId": 2,
                "Value": "^(([a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*)[._-]?@([a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*\\.[a-zA-Z]{2,}\\.?)([a-zA-Z0-9]*))?$",
                "Message": "El campo Correo de contacto tiene caracteres no admisibles",
                "Order": 2,
                "Type": "PATTERN"
              },
              {
                "ValidationId": 2,
                "Value": "^.{0,30}$",
                "Message": "El campo Correo de contacto debe tener máximo 30 caracteres",
                "Order": 3,
                "Type": "PATTERN"
              }
            ]
          },
          {
            "Code": "DEPARTAMENTO",
            "FieldId": 9,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Departamento es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              }
            ]
          },
          {
            "Code": "PROVINCIA",
            "FieldId": 10,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Provincia es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              }
            ]
          },
          {
            "Code": "DISTRITO",
            "FieldId": 11,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Distrito es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              }
            ]
          }
        ]
      },
      INFORMACION_EMPRESA: {
        Controls: [
          {
            "Code": "EPS_CIA",
            "FieldId": 1,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo EPS/CIA actual es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              }
            ]
          },
          {
            "Code": "NOMBRE",
            "FieldId": 2,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Nombre es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              }
            ]
          },
          {
            "Code": "NRO_ASEGURADOS",
            "FieldId": 3,
            "FieldVisivility": 1,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Nº de asegurados es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              },
              {
                "ValidationId": 2,
                "Value": "^([0-9\\ ]+)?$",
                "Message": "El campo Nº de asegurados tiene caracteres no admisibles",
                "Order": 2,
                "Type": "PATTERN"
              }
            ]
          }
        ]
      },
      INFORMACION_TRABAJADORES: {
        Controls: [
          {
            "Code": "NRO_OPERARIOS",
            "FieldId": 1,
            "FieldVisivility": 1,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Nº de Operarios es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              },
              {
                "ValidationId": 2,
                "Value": "^([0-9\\ ]+)?$",
                "Message": "El campo Nº de Operarios tiene caracteres no admisibles",
                "Order": 2,
                "Type": "PATTERN"
              }
            ]
          },
          {
            "Code": "NRO_ADMINISTRATIVOS",
            "FieldId": 2,
            "FieldVisivility": 1,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Nº de Administrativos es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              },
              {
                "ValidationId": 2,
                "Value": "^([0-9\\ ]+)?$",
                "Message": "El campo Nº de Administrativos tiene caracteres no admisibles",
                "Order": 2,
                "Type": "PATTERN"
              }
            ]
          },
          {
            "Code": "NRO_TRABAJADORES_PLANILLA",
            "FieldId": 3,
            "FieldVisivility": 1,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Nº de trabajadores en planilla es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              },
              {
                "ValidationId": 2,
                "Value": "^([0-9\\ ]+)?$",
                "Message": "El campo Nº de trabajadores en planilla tiene caracteres no admisibles",
                "Order": 2,
                "Type": "PATTERN"
              }
            ]
          },
          {
            "Code": "APORTE_ANUAL_ESSALUD",
            "FieldId": 4,
            "FieldVisivility": 3,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Aporte anual Esalud es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              }
            ]
          }
        ]
      },
      INFORMACION_ADICIONAL: {
        Controls: [
          {
            "Code": "CANTIDAD",
            "FieldId": 1,
            "FieldVisivility": 1,
            "Validations": [
              {
                "ValidationId": 1,
                "Value": "",
                "Message": "El campo Nº de Operarios es requerido",
                "Order": 1,
                "Type": "REQUIRED"
              },
              {
                "ValidationId": 2,
                "Value": "^([0-9\\ ]+)?$",
                "Message": "El campo Nº de Operarios tiene caracteres no admisibles",
                "Order": 2,
                "Type": "PATTERN"
              }
            ]
          }
        ]
      }
    }
  };

  constantsEpsEmpresa = epsEmpresa;
  return epsEmpresa;
});
