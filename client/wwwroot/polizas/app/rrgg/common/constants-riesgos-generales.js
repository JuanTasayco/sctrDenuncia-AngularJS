'use strict';
define([], function () {
  var RiesgosGenerales = {
    TEXT_DOLAR: "DOLARES",
    TEXT_SOLES: "SOLES",
    NRO_EQUIPO: 1,
    STEPS: {
      COTIZACION: '1',
      RESULTADOS: '2',
      EMISION: '3'
    },
    ROUTES: {
      COTIZACION: 'cotizacionRiesgosGenerales',
      COTIZACION_STEPS: 'cotizacionRiesgosGenerales.steps',
      BANDEJA_COTIZACION: 'bandejaPolizaRiesgosGenerales',
      RESUMEN: 'resumenRiesgosGenerales',
      CLONAR:'clonarPolizasRrgg'
    },
    ARCHIVOS: {
      PLANTILLA_EXCEL_TRABAJADORES: 'app/assets/rrgg/Trama_Trabajadores.xls',
      PLANILLA_EXCEL_TRA_VIGLIMP : 'app/assets/rrgg/Trama_Trabajadores_vigLimp.xls',
      PLANILLA_EXCEL_UBI_VIGLIMP : 'app/assets/rrgg/Trama_Ubicaciones_vigLimp.xls'
    },
    VAL_CONTRATO: "VC",
    RAMO: {
      RESPON_CIVIL: 'S0012',
      RESPON_CIVIL_TRABAJOS_ESPECIFICOS : 'S0565',
      DESHONESTIDAD: 'S0011',
      RESPON_CIVILL_DESHONESTIDAD: 'S0013',
      TRANS_TERR_MAQ: 'S0017',
      TRANS_TERR_MERC: 'S0018'
    },
    TIPO_ASEGURAMIENTO: {
      X_UNIDAD: "S0199"
    },
    COBERTURAS: {
      RC: "S0076",
      RC_AMT: "S0077"
    },
    TIP_ASEGURAMIENTO: {
      GLOBAL: "S0200",
      X_UNIDA: "S0199"
    },
    ACT_REALIZ : {
      SERV_VIG : "S0113"
    },
    CONTRATA_TRANS: [
      { Codigo: "S", Descripcion: "S" },
      { Codigo: "N", Descripcion: "N" }
    ],
    MONEDA: {
      SOLES: 1,
      DOLARES: 2
    },
    RADIO: {
      SI: "1",
      NO: "0",
      TEXT_SI: "SI",
      TEXT_NO: "NO"
    },
    CONS: "S0170",
    DATOS: {
      VEHICULOS: "1",
      LOCALES: "2",
      EQUIPOS: {
        ONE: 1,
        TWO: 2
      }
    },
    PARAMETROS: {
      DEPARTAMENTO: 53,
      TIP_DOC_TREC: 55,
      TIPO_LISTA: 1,
      TIPO_TABLA: 2,
      TRABAJO_OBRA: 1,
      RAMO: 2,
      GIRO_NEGOCIO: {
        COD: 4,
        VALUE_REGISTER: "S0247",
        GRUPO: {
          A: "A",
          B: "B",
          C: "C",
          D: "D",
          E: "E",
          F: "F"
        }
      },
      DESCRIP_EQUIPOS: 5,
      TIP_PROYECTO: 6,
      ACTI_REALIZA: 7,
      LIST_EMBALAJE: 8,
      T_NETA_ANUAL: 9,
      COBERTURAS: 10,
      CLAS_EQUIPOS: 11,
      VAL_MAX_CONTRATO: {
        COD: 12,
        MONTO_MAX_DOL: "S0085",
        RESPON_MAX_DOL: "S0093",
        DESH_MAX_DOL: "S0094"
      },
      TIP_CAMBIO:13,
      SUM_MAX_ASEGURADA:14,
      COB_ADICIONAL:15,
      DESC_COMERCIAL:16,
      PRIMA_NETA:17,
      NOTA:18,
      TBL_PERIODO:19,
      TBL_VOLUMEN:20,
      DES_X_PERS: 60,
      DESC_COMER_SIMPLE:{
        COD: 21,
        VALUE_REGISTER: "S0248"
      },
      EMBALAJES: 22,
      T_ANUAL_SIMPLE:24,
      DEDUCIBLE_SIMPLE:25,
      RIES_EXCL:26,
      CONSIDERACIONES:27,
      DURACION:28,
      COBER_COMPUESTAS:29,
      PARAM_GEN_SIMPLE:30,
      UN_SOLO_EQUIPO:31,
      FORMA_PAGO:33,
      PRIM_INCLUSION:32,
      VIGENCIA:34,
      TIPO_DOC:36,
      MAX_EQUIPOS:37,
      COBER_SUMAS_A : 40,
      TIPO_PROY :52,
      OTRS_DESC: 43,
      RAD_ACC: 47,
      TIP_TRANS: 48,
      MAT_ASE: 49,
      VAL_MER: 50,
      TIP_SUC: 51,
      RC_VEHI_EMP: 59
    },
    GRUPO: {
      TRAB_ESPECIFICOS: "TEE",
      TREC: "TRE",
      HIDROCARBURO:"HDR",
      CAR: "CAR",
      CARLITE: "CAL",
      VIGLIMP: "VYL",
      TRANSPORTE:"TRA",
      EVENTOS:"EVE",
      DEMOLICIONES:"DEM"
    },
    API_URL: {
      TRAB_ESPECIFICOS: "responsabilidadcivil",
      TREC: "equipocontratista",
      HIDROCARBURO: "transporteterrestre",
    },
    CABECERA_ALERTAS: {
      TXT_1: "VALOR DE CONTRATO MÁXIMO",
      TXT_2: "SUMA ASEGURADA MÁXIMA"
    },
    SMS_ERROR: {
      REQUERIDO: "* Este campo es obligatorio",
      ANIO: "* El año ingresado no es válido",
      EMAIL: "* Ingrese un correo válido",
      MONEDA: "* Ingrese una moneda"
    },
    SMS_INFO: {
      DATA_SENSIBLE: "Se procederá con la descarga de información sensible de MAPFRE, por lo que será responsabilidad del usuario garantizar la seguridad del fichero y la no divulgación del mismo a usuarios no autorizados.",
      DATA_TRABAJADORES_1: "La cantidad de trabajadores ingresada en la cotización es N° ",
      DATA_TRABAJADORES_2: ", por favor revisar la cantidad de registros en la planilla.",
      DATA_UBICACIONES_1: "La cantidad de Ubicaciones ingresada en la cotización es N° ",
      DATA_UBICACIONES_2: ", por favor revisar la cantidad de registros en la planilla."
    },
    PROD_TITLE: {
      TRAB_ESPECIFICOS: "Producto RC y Deshonestidad para obras y/o Trabajos Especificos",
      TREC: "Producto Trec",
      HIDROCARBURO:"Producto Responsabilidad Civil de Hidrocarburos",
      CAR: "Producto CAR",
      CARLITE: "Producto CARLITE",
      VIGLIMP : "Producto Vigilancia y Limpieza",
      TRANSPORTE: "Producto Transporte",
      EVENTOS: "Producto Eventos",
      DEMOLICIONES: "Producto Demoliciones"
    },
    CAB_VALID :{
      TASA_NETA_ANUAL:"9",
      DESC_COMERCIAL:"16",
      PER_CORTO:"19",
      TBL_VOLUMEN:"20",
      DES_X_PERS: "60",
      PRIM_INCLUSION:"32",
      T_NETA_ANUAL:"9",
      COBER_SUMAS_A : "40",
      DESCUENTOSHDR: "42",
      RC_VEHI_EMP: "59"
    },
    COT_ESTADO: {
      REGISTRADO:"Registrado"
    }


  };
  return RiesgosGenerales;
});
