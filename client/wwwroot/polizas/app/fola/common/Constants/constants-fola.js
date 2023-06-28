'use strict';

var constantsFola;
define([], function () {
  var fola = {
    code: 'FOLA',
    parametros: {
      codFraccionamiento: 'FRACCIONAMIENTO',
      codFracMensual: 10012,
      codFracTrimestral: 40004,
      codFracSemestral: 20002,
      codFracContado: 10001
    },
    STEPS: {
      CONTRATANTE: '1',
      ASEGURADOS: '2',
      RESULTADOS: '3'
    },
    ROUTES: {
      COTIZACION: 'cotizadorFola',
      COTIZACION_STEPS: 'cotizacionPolizaFola.steps',
      EMITIR_POLIZA: 'emisorPolizaFola',
      RESUMEN_FOLA_EMISION: 'resumenFolaEmision',
      EMISOR_STEPS: 'emisorFola.steps',
      BANDEJA_DOCUMENTOS: 'bandejaDocumentosFola',
      RESUMEN_BANDEJA_DOCUMENTOS: 'resumenBandejaDocumentos',
      PLANES_FOLA: 'planFola'
    },
    EMPTY_RUC_20: 20,
    TIPOS_DOCUMENTO_ASEGURADO: [
      {Codigo: 'CEX', Descripcion: 'Carnet de Extranjería'},
      {Codigo: 'CIP', Descripcion: 'Carnet de Identidad Personal'},
      {Codigo: 'DNI', Descripcion: 'Documento Nacional de Identidad'}
    ],
    TIPO_CONDICIONADO: {
      GENERAL: 1,
      PARTICULAR: 2
    },
    ESTADO: {
      POLIZA_NO_EMITIDA: 1,
      POLIZA_GENERADA: 2
    },
    CODIGO_APLICACION: 'EMISA',
    SIMBOLO_MONEDA: 'S/',
    PERSONA: {
      CODIGO_APLICACION: 'V',
      FORMULARIO_CONTRATANTE: 'CONT',
      FORMULARIO_ASEGURADO: 'ASEG'
    },
    VALIDATORS: {
      CONTRATANTE: {
        Controls: [
          {
            Code: 'COD_DOCUM',
            FieldId: 2,
            FieldVisivility: 3,
            Validations: [
              {
                ValidationId: 1,
                Value: '',
                Message: 'El campo Número de Documento es requerido',
                Order: 1,
                Type: 'REQUIRED'
              }
            ]
          },
          {
            Code: 'NAME_PERSON',
            FieldId: 3,
            FieldVisivility: 1,
            Validations: [
              {
                ValidationId: 1,
                Value: '',
                Message: 'El campo Nombre completo es requerido',
                Order: 1,
                Type: 'REQUIRED'
              },
              {
                ValidationId: 2,
                Value: '^.{0,100}$',
                Message: 'El campo Nombre completo debe tener máximo 100 caracteres',
                Order: 2,
                Type: 'PATTERN'
              }
            ]
          }
        ]
      }
    }
  };

  constantsFola = fola;
  return fola;
});
