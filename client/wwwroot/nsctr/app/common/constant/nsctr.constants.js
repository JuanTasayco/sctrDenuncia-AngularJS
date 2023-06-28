'use strict';

define([], function () {
  var NSCTR_CONSTANTS = {
    regular:{
      id: 1,
      code: 'R',
      appCode: 'NSCTR',
      description: 'SCTR General',
      prefixState: 'regular',
      prefixUri:   'regular'
    },
    mining:{
      id: 2,
      code: 'M',
      appCode: 'MIN',
      description: 'SCTR Minería',
      prefixState: 'mining',
      prefixUri:   'mineria'
    },
    lifeLaw:{
      id: 3,
      code: 'V',
      appCode: 'VLE',
      description: 'Vida Ley',
      prefixState: 'lifeLaw',
      prefixUri:   'vidaley'
    },
    pension: {
      code: 'P',
      codeCompany: 2,
      codeRamo: 701,
      description: 'pension'
    },
    health: {
      code: 'S',
      codeCompany: 3,
      codeRamo: 702,
      description: 'health'
    },
    certificate: {
      code: 'CER'
    },
    letter: {
      code: 'CRT'
    },
    charge: {
      code: 'CRG'
    },
    movementType: {
      declaration: {
        code: 'DW',
        operationType: 'D',
        codeTypeConstancy: 'DE',
        description: 'DECLARACION'
      },
      exclusion: {
        code: 'EW',
        operationType: 'E',
        codeTypeConstancy: 'EX',
        description: 'EXCLUSION'
      },
      inclusion: {
        code: 'IW',
        operationType: 'I',
        codeTypeConstancy: 'IN',
        description: 'INCLUSION'
      },
      proof: {
        code: 'WC',
        operationType: 'C',
        codeTypeConstancy: 'RC',
        description: 'CONSTANCIA'
      },
      replacement: {
        codeTypeConstancy: 'RE',
        description: 'REEMPLAZO'
      },
      manualProof: {
        codeTypeConstancy: 'MA',
        description: 'CONST. MANUAL'
      }
    },
    state: {
      undeclared: {
        description: 'NO DECLARADA'
      },
      declared: {
        description: 'DECLARADA'
      },
      manipulable: {
        description: 'MANEJABLE'
      },
      up:{
        description: 'ALTA'
      },
      down:{
        description: 'BAJA'
      },
      invoiced:{
        code: 'S'
      },
      uninvoiced:{
        code: 'N'
      },
      valid:{
        description: 'VIGENTE'
      },
      annulled:{
        description: 'ANULADO'
      },
      inProcess: {
        description: 'EN PROCESO'
      }
    },
    declarationType:{
      monthAdvance:{
        description: 'mes adelantado'
      },
      monthOverdue:{
        description: 'mes vencido'
      }
    },
    validateApplicationPre:{
      actionDirection:{
        inclusionPasoRiesgos: 'PAGE_INCLUSION_PASO_RIESGOS',
        declaracionPasoRiesgos: 'PAGE_DECLARACION_PASO_RIESGOS',
        cargarPlanillaExcelIndividual: 'PAGE_CARGAR_PLANILLA_EXCEL_INDIVIDUAL',
        reemplazo: 'PAGE_REEMPLAZO',
        cargarPlanilla: 'PAGE_CARGAR_PLANILLA',
        reemplazoMostrarPlanillaPendiente: 'PAGE_REEMPLAZO_MOSTRAR_PLANILLA_PENDIENTE',
      },
      errorType:{
        receiptPendingRemesarPension: 'RECEIPT_PENDING_REMESAR_PENSION',
        receiptPendingRemesarSalud: 'RECEIPT_PENDING_REMESAR_SALUD'
      }
    },
    typeLoad:{
      massive:{
        code: 'M'
      },
      individual:{
        code: 'I'
      }
    },
    message: {
      genericError: 'No se pudo realizar la operación. </br> Comuníquese con su administrador'
    },
    errorTable: {
      et1: 'ET1',
      et2: 'ET2'
    },
    insured: {
      code: 'ASEG'
    },
    client: {
      code: 'CONT'
    },
    medic: {
      code: 'MED'
    },
    location: {
      code: 'LOC'
    },
    flag: {
      true: 'S',
      false: 'N'
    },
    securityCode: {
      processes: {
        headerName: 'PROCESOS',
      },
      evaluations: {
        headerName: 'EVALUACIONES',
      },
      queries: {
        headerName: 'CONSULTAS',
      },
      insureds: {
        shortName: 'ASEGURADOS',
        codeObj: {
          dev: [1689, 1378, 1390],
          prod: [1851, 1826, 1844]
        }
      },
      censusIndividual: {
        shortName: 'PINDIVIDUAL',
        codeObj: {
          dev: [1747],
          prod: [1829]
        }
      },
      censusMassive: {
        shortName: 'PMASIVO',
        codeObj: {
          dev: [1748],
          prod: [1830]
        }
      },
      proofs: {
        shortName: 'CONSTANCIAS',
        codeObj: {
          dev: [1690, 1380, 1391],
          prod: [1852, 1828, 1845]
        }
      },
      maintenance: {
        headerName: 'MANTENIMIENTO',
      },
      medics: {
        shortName: 'MEDICOS',
        codeObj: {
          dev: [1381],
          prod: [1831]
        }
      },
      locations: {
        shortName: 'LOCACIONES',
        codeObj: {
          dev: [1382],
          prod: [1832]
        }
      },
      asignations: {
        shortName: 'ASIGNACIONES',
        codeObj: {
          dev: [1383],
          prod: [1834]
        }
      },
      reports: {
        headerName: 'REPORTES',
      },
      coverages: {
        headerName: 'COBERTURAS',
      },
      provisional: {
        shortName: 'PROVISIONAL',
        codeObj: {
          dev: [1692, 1392],
          prod: [1850, 1846]
        }
      }
    }
  };
  return NSCTR_CONSTANTS;
});