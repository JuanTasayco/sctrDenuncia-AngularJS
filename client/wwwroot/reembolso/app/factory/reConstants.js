'use strict';

define([], function () {

  var coverages = {
    temporaryDisability: '3111  ',
    permanentDisability: '3110  ',
    accidentalDeath: '3109  ',
    gastosSepelio: '3113  ',
    gastosCuracion: '3112  '
  }

  var products = {
    soat: {
      companyCode: 1,
      productCode: 'O'
    },
    medicalAssistance: {
      companyCode: 1,
      productCode: 'S'
    },
    salud: {
      companyCode: 3,
      productCode: 'S'
    },
    sctr: {
      companyCode: 3,
      productCode: 'R'
    },
    personalAccidents: {
      companyCode: 1,
      productCode: 'A'
    }
  }

  var codeUploadFile = {
    pagoComprobantes: 1,
    otrosAdjuntos: 2,
    finiquitoFirmado: 3,
    informeMedico: 4,
    detalleGastoMedico: 5,
    siniestroObservado: 6
  }

  var injuryTypeDeath = {
    codeField: "4",
    defaultField: "N",
    indexField: 4,
    tableField: "TLSN",
    tableNameField: "InjuryType",
    valueField: "FALLECIDO"
  }

  var modules = {
    query: {
      code: 1,
      description: 'consulta de reembolso',
      route: 'consultar.init'
    },
    solicitude: {
      code: 2,
      description: 'solicitud de reembolso',
      route: 'solicitud.init'
    },
    reassign: {
      code: 3,
      description: 'reasignar ejecutivo',
      route: 'reasignarEjecutivo.init'
    },
    maintenance: {
      code: 4,
      description: 'mantenimiento',
      route: 'maintenance.init'
    },
  }

  var userPermissions = [
    {
      code: 'ADM',
      availableModuleCodes: [modules.query, modules.solicitude, modules.reassign, modules.maintenance]
    },
    {
      code: 'SUPE_SOAT',
      availableModuleCodes: [modules.query, modules.solicitude, modules.reassign, modules.maintenance]
    },
    {
      code: 'SUPE_OTROS',
      availableModuleCodes: [modules.query, modules.solicitude, modules.reassign, modules.maintenance]
    },
    {
      code: 'SOLICITANTE',
      availableModuleCodes: [modules.query, modules.solicitude]
    },
    {
      code: 'EJEC_SOAT',
      availableModuleCodes: [modules.query, modules.solicitude]
    },
    {
      code: 'EJEC_OTROS',
      availableModuleCodes: [modules.query, modules.solicitude]
    },
    ,
    {
      code: 'MAD_OTROS',
      availableModuleCodes: [modules.query, modules.solicitude]
    }
    ,
    {
      code: 'MAD_SOAT',
      availableModuleCodes: [modules.query, modules.solicitude]
    }
  ]

  var reConstants = {
    codeUploadFile: codeUploadFile,
    coverages: coverages,
    products: products,
    injuryTypeDeath: injuryTypeDeath,
    userPermissions: userPermissions
  }

  return reConstants
});
