"use strict";

var constants;
define([], function () {
  var oim = {
    formats: {
      dateFormat: 'dd/MM/yyyy',
      dateFormatApi: 'dd/MM/yyyy',
      dateFormatRegex: /(([0][1-9])|([1-2][0-9])|([3][0-1]))\/(([0][0-9])|([1][0-2]))\/([0-9]{4})/,
      dateFormatMask: "99/99/9999",
      twoDecimals: 2
    },
    environment: "QA",
    system: {
      api: {
        urlBase: "https://oim.pre.mapfre.com.pe/",
        url: "https://oim.pre.mapfre.com.pe/oim_new_login/",
        endpoints: {
          actter:'https://oim.pre.mapfre.com.pe/oim_actter/',
          wcfCWVI: 'https://oim.pre.mapfre.com.pe/wcfCWVI/',
          wcfCuestionario: 'https://oim.pre.mapfre.com.pe/wcfCuestionario/',
          security: "https://oim.pre.mapfre.com.pe/oim_new_login/",
          policy: "https://oim.pre.mapfre.com.pe/oim_polizas/",
          policies: {
            suscripcionSalud: 'https://oim.pre.mapfre.com.pe/'
          },
          camposanto: {
            url: 'https://api.pre.mapfre.com.pe/app/death/api/v1.0/',
            username: 'app-ecampopre',
            password: '4Fmf8#$Pr3',
            token: 'YXBwLWVjYW1wb3ByZTo0Rm1mOCMkUHIz',
          },
          orchestrator: 'https://oim.pre.mapfre.com.pe/Orquestador/',
          nsctr: 'https://oim.pre.mapfre.com.pe/oim_nsctr/',
          renovacion: "https://oim.pre.mapfre.com.pe/oim_renovacionpoliza/",
          cgw: 'https://oim.pre.mapfre.com.pe/oim_cgw/',
          grqc: 'https://oim.pre.mapfre.com.pe/oim_cgw/',
          powereps: 'https://oim.pre.mapfre.com.pe/powereps/',
          gcw: 'https://oim.pre.mapfre.com.pe/oim_gcw/',
          enel: 'https://oim.pre.mapfre.com.pe/oim_enel/',
          webproc: 'https://oim.pre.mapfre.com.pe/oim_webproc/',
          adminPortal: "https://oim.pre.mapfre.com.pe/oim_admportales/",
          seguridad: 'https://oim.pre.mapfre.com.pe/oim_seguridad/',
          inspec: 'https://oim.pre.mapfre.com.pe/oim_inspec/',
          callerDash: 'https://oim.pre.mapfre.com.pe/oim_cdashboard/',
          restos: 'https://oim.pre.mapfre.com.pe/wcfGRV/',
          referencia: 'https://oim.pre.mapfre.com.pe/oim_referencia/',
          referencias : 'https://oim.pre.mapfre.com.pe/oim_referencias/',
          gper: 'https://oim.pre.mapfre.com.pe/oim_gestion_pericial/',
          medicalCenter: 'https://oim.pre.mapfre.com.pe/oim_wdrog/',
          seguroviaje: 'https://oim.pre.mapfre.com.pe/oim_multirisk/',
          reembolso: "https://oim.pre.mapfre.com.pe/oim_CommonEps/",
          reembolso2: "https://oim.pre.mapfre.com.pe/oim_Reembolsos/",
          mydream: 'https://oim.pre.mapfre.com.pe/MyDream/',
          kpissalud : 'https://oim.pre.mapfre.com.pe/oim_kpissalud/',
          farmapfre : 'https://oim.pre.mapfre.com.pe/oim_farmapfre/',
          paymentgateway: 'https://oim.pre.mapfre.com.pe/paymentgateway/',
          sctrDenuncia:"https://oim.pre.mapfre.com.pe/oim_sctr_denuncias/",
          atencionsiniestrosagricola : 'https://oim.pre.mapfre.com.pe/AtencionSiniestrosAgricola/',
          wsrgenerardocumento: 'https://api.pre.mapfreperu.com/internal/rrtt/wsrGeneraDocumento/rest/generaDocumento/', //MSAAVEDRA 20211112
          wsrRegistrarReticenciaAuto: 'https://api.pre.mapfreperu.com/internal/comun/wsrReticencia/solicitud/automatica'
        }
      },
      login: {
        path_audience: "api/audience",
        path_authenticate: "api/login",
        client_id: "099153c2625149bc8ecb3e85e03f0022"
      },
      authenticate: {
        grant_type: "password",
        name: "oim mapfre - multiplica"
      },
      authorization: {
        nameAuthHeader: "Authorization"
      }
    },

    typeLogin: {
      ejecutivo: {
        code: 1,
        subType: 1,
        type: 1,
        name: "Ejecutivo MAPFRE",
        description: "Ejecutivo MAPFRE",
        headerName: "EJECUTIVO"
      },

      cliente: {
        code: 2,
        subType: 5,
        type: 2,
        name: "Cliente Persona",
        description: "Clientes",
        headerName: "CLIENTE PERSONA"
      },

      proveedor: {
        code: 3,
        subType: 4,
        type: 3,
        name: "Proveedores",
        description: "Proveedores",
        headerName: "PROVEEDOR"
      },

      broker: {
        code: 4,
        subType: 3,
        type: 3,
        name: "Brokers",
        description: "Brokers",
        headerName: "BROKER"
      },
      empresa: {
        code: 5,
        subType: 2,
        type: 3,
        name: "Cliente Empresa",
        description: "Cliente Empresa",
        headerName: "CLIENTE EMPRESA"
      }
    },
    documentTypes: {
      dni: {
        id: 1,
        Codigo: "DNI",
        Descripcion: "DNI"
      },
      ruc: {
        id: 2,
        Codigo: "RUC",
        Descripcion: "RUC"
      },
      pasaporte: {
        id: 3,
        Codigo: "PEX",
        Descripcion: "Pasaporte Extranjero"
      },
      carnetExtrajeria: {
        id: 4,
        Codigo: "CEX",
        Descripcion: "Carnet Extranjeria"
      },
      cip: {
        id: 5,
        Codigo: "CIP",
        Descripcion: "CIP"
      }
    },
    modalSendEmail: {
      cotizar: {
        id: 1,
        action: "cotizar",
        title: "Cotización",
        button: "Cotización"
      },
      emitir: {
        id: 2,
        action: "emitir",
        title: "Emisión",
        button: "Emisión"
      },
      hogarQuote: {
        id: 3,
        action: "hogarQuote",
        title: "Cotización",
        button: "Cotización"
      },
      hogarEmit: {
        id: 4,
        action: "hogarEmit",
        title: "Emisión",
        button: "Emisión"
      },
      soat: {
        id: 5,
        action: "soat",
        title: "Cotización",
        button: "Cotización"
      },
      emitirTransporte: {
        id: 6,
        action: "emitirTransporte",
        title: "Emisión",
        button: "Emisión"
      },
      accidentesQuote: {
        id: 7,
        action: "accidentesQuote",
        title: "Cotización",
        button: "Cotización"
      },
      sctr: {
        id: 8,
        action: "sctr",
        title: "Emisión",
        button: "Emisión"
      },
      cotizarVida: {
        id: 9,
        action: "cotizarVida",
        title: "Cotización",
        button: "Cotización"
      },
      solicitudCGW: {
        id: 10,
        action: "solicitudCGW",
        title: "solicitud",
        button: "Solicitud "
      },
      soatElectronico: {
        id: 11,
        action: "soatElectronico",
        title: "póliza",
        button: "Póliza"
      },
      agenteDigital: {
        id: 12,
        action: "agenteDigital",
        title: "póliza",
        button: "Póliza"
      },
      salud: {
        id: 13,
        action: 'salud',
        title: 'Cotización',
        button: 'Cotización'
      },
      vidaLey: {
        id: 14,
        action: 'vidaLeyCotizar',
        title: 'cotización',
        button: 'Cotización'
      },
      vidaLeyEmision:{
        id: 15,
        action: 'vidaLeyEmitir',
        title: 'emisión',
        button: 'Emisión'
      }
    },
    operationCode: {
      success: 200,
      code400: 400,
      code500: 500, //errorNoControlado
      code800: 800, //errorBD
      code900: 900, //errorNegocio
      code901: 901, //modalConfirmation/reniecList/workersListDeclared
      code902: 902,  //errorPlanilla
      code903: 903,
      code910: 910
    },
    module: {
      polizas: {
        id: 1,
        description: "EMISA",
        autos: {
          id: 1,
          description: "AUTOMOVILES",
          codeRamo: 301, //CodigoRamo
          companyCode: 1, //CodigoCompañia
          codeCurrency: 2, //CodigoMoneda
          networkUser: "Usuario",
          tipoVolante: "I",
          marcaAsistencia: "N",
          MCAGPS: "N",
          home:
            " <div class='col-md-4 col-sm-4 col-xs-6 polizas-item'>" +
            "<a class='polizas-link' ui-sref='homePolizasAutos'>" +
            "<span class='ico-mapfre_104_auto_front polizas-ico'>" +
            "</span><span class='polizas-label'>Autos</span></a></div>",
          valorMaxCotizacion: 70000,
          responsabilidadCivil: "RC",
          productos0Km: [5, 20, 71, 87, 79, 78, 107, 108, 103, 113]
        },
        soat: {
          id: 2,
          description: "SOAT",
          codeRamo: 302, //CodigoRamo
          companyCode: 1, //CodigoCompañia
          codeCurrency: 2, //CodigoMoneda
          tipoVolante: "I",
          codigoPlan: 1,
          codigoZona: "",
          tipoEmision: 3,
          codigoTipoEntidad: 1,
          SNEmite: "S",
          TieneAccesorioMusical: "N",
          MCAInformeInspeccion: "N",
          MCAInspeccionPrevia: "N",
          CodigoFinanciamiento: 10001,
          CodigoColor: 1,
          MCAFisico: "S",
          CodigoCategoria: 0,
          CodigoEstado: 1,
          CodigoProceso: 2,
          NumeroRiesgo: 1,
          TipoSuplemento: "XX",
          home:
            " <div class='col-md-4 col-sm-4 col-xs-6 polizas-item'>" +
            "<a class='polizas-link' ui-sref='homePolizasSOAT'>" +
            "<span class='ico-mapfre_42_soat polizas-ico'>" +
            "</span><span class='polizas-label'>SOAT</span></a></div>"
        },
        hogar: {
          id: 3,
          codeCia: 1,
          codeRamo: 120,
          description: "HOGAR",
          codeCompany: 1, //CodigoCompañía es igual que CodidoEmpresa
          flagContrataRobo: "S", //valorFijo(calculatePremium) CONFIRMADO
          agent: {
            managerType: "CO"
          },
          networkUser: "Usuario",
          emissionType: 5,
          codeEntityType: 1,
          home:
            " <div class='col-md-4 col-sm-4 col-xs-6 polizas-item'>" +
            "<a class='polizas-link' ui-sref='hogarHome'>" +
            "<span class='ico-mapfre_112_hogar polizas-ico'>" +
            "</span><span class='polizas-label'>Hogar</span></a></div>",
          codeFracc1: '10012',
          codeFracc2: '90012',
          codeFracc3: '90024'
        },
        fola: {
          id: 16,
          code: 'FORMACIÓN LABORAL',
          description: "FOLA",
          moduleName: 'appAutos',
          codeRamo: 116,
          companyCode: 1,
          codeCurrency: 1,
          tipoCondicionado: {
            General: 1,
            Particular: 2
          }
        },
        accidentes: {
          id: 4,
          description: "COTIZADOR DE ACCIDENTES",
          codeCia: 1,
          codeRamo: 101,
          companyCode: 1,
          codProducto: 49,
          codFranquicia: 6,
          home:
            " <div class='col-md-4 col-sm-4 col-xs-6 polizas-item'>" +
            "<a class='polizas-link' ui-sref='homePolizasAccidentes'>" +
            "<span class='ico-mapfre_117_auto_crash2 polizas-ico'>" +
            "</span><span class='polizas-label'>Accidentes</span></a></div>"
        },

        salud: {
          id: 5,
          codeRamo: "114,115, 116",
          companyCode: 1,
          home:
            " <div class='col-md-4 col-sm-4 col-xs-6 polizas-item'>" +
            "<a class='polizas-link' ui-sref='hogarHome'>" +
            "<span class='ico-mapfre_114_heart polizas-ico'>" +
            "</span><span class='polizas-label'>Salud</span></a></div>",
          stateDocuments: {
            pendiente: 'PENDIENTE',
            vigente: 'VIGENTE',
            observado: 'OBSERVADO',
            noVigente: 'NO VIGENTE',
            rechazado: 'RECHAZADO',
            emitida: 'EMITIDA',
            anulado: 'ANULADO',
            aprobado: 'APROBADO'
          },
          subStatesDocuments: {
            observada: {
              documentos: 31
            },
            aprobada:{
              exclusion: 33,
              recargo: 32,
              continuidad: 35
            }
          },
          roles: [
          'ADMIN', 'PLAZA', 'PLAZA SALUD', 'ADMINFUN', 'CROSS', 'ECOMMERCE', 'AGTDIG', 'MASTERVIDA', 'VIDA', 'SVMDECESOS', 'DIGITAL', 'EJECTELECT',
          'CORRSOLOAUTOS', 'CORREDOR', 'COTACCIDENT', 'CORRSCTR', 'AUTOACCI', 'CORRSOATINTER', 'AUTOS-SCTR', 'AUTOS-TRANS', 'CORRSOATINTOP', 'CORRSOATINTTOPPRE', 'CORRAUTESOAT', 'CORRAUTSOAT', 'CORRBASESOATEL', 'CORRBASEELECTOP', 'CORRSINTRANSPORTE', 'CORRAUTTRANSOATELE', 'CORRSOATTOP', 'CORRSCTRSOATELEACC', 'CORRAUTSCTRSOAT', 'CORRAUTTRAACCISOAT', 'CORRACCISCTR'
          ]
        },

        transportes: {
          id: 6,
          codeRamo: "252,253",
          companyCode: 1,
          home:
            " <div class='col-md-4 col-sm-4 col-xs-6 polizas-item'>" +
            "<a class='polizas-link' ui-sref='homePolizasTransportes'>" +
            "<span class='ico-mapfre_115_truck_front polizas-ico'>" +
            "</span><span class='polizas-label'>Transportes</span></a></div>"
        },

        vida: {
          id: 7,
          code: "CWVI",
          codeRamo: 604,
          companyCode: 2,
          home:
            " <div class='col-md-4 col-sm-4 col-xs-6 polizas-item'>" +
            "<a class='polizas-link' ui-sref='homePolizasVidas'>" +
            "<span class='ico-mapfre_116_signal polizas-ico'>" +
            "</span><span class='polizas-label'>Vida</span></a></div>"
        },

        empresas: {
          id: 8,
          codeRamo: 274,
          companyCode: 1,
          home:
            " <div class='col-md-4 col-sm-4 col-xs-6 polizas-item'>" +
            "<a class='polizas-link' ui-sref='homePolizasAutos'>" +
            "<span class='ico-mapfre_120_building polizas-ico'>" +
            "</span><span class='polizas-label'>Empresas</span></a></div>"
        },
        sctr: {
          id: 9,
          codigoGrupo: 7,
          CodigoMoneda: 1,
          companyCode: 2,
          TipoEntidad: 1,
          idPlanilla: 1,
          pais: "PE",
          codPostal: 1,
          CodigoEstado: "RE",
          codEdo: 1,
          DescripcionEstado: "REGISTRADA",
          SecuenciaReg: 2,
          FlagDocumento: "N",
          CodigoProceso: 1,
          periodoCorto: {
            TipoPeriodo: "PC",
            Descripcion: "Periódo Corto",
            CodigoGrupo: 6,
            CodigoProducto: 55
          },
          periodoNormal: {
            TipoPeriodo: "PN",
            Descripcion: "Periódo Normal",
            CodigoGrupo: 6,
            CodigoProducto: 55
          },
          salud: {
            CodigoCompania: 3,
            CodigoRamo: 702,
            Tipo: 1
          },
          pension: {
            CodigoCompania: 2,
            CodigoRamo: 701,
            Tipo: 1
          },
          home:
            " <div class='col-md-4 col-sm-4 col-xs-6 polizas-item'>" +
            "<a class='polizas-link' ui-sref='sctrHome'>" +
            "<span class='ico-mapfre_126_employee polizas-ico'>" +
            "</span><span class='polizas-label'>SCTR</span></a></div>",
          procedencia: 'EMISA'
        },
        segurviaje:{
          id: 10,
          companyCode: 2
        },
        vidaLey: {
          id: 11,
          code: 'VIDALEY',
          description: "Vida Ley",
          moduleName: 'appAutos',
          codeRamo: 610,
          companyCode: 2,
          codeCurrency: 1
        },
        epsEmpresa: {
          id: 33,
          code: 'EPSEMPRESA',
          description: "Eps Empresa",
          moduleName: 'appAutos',
          codeRamo: 610,
          companyCode: 2,
          codeCurrency: 1,
          URLS:{
            EPSEMPREG: '/eps-empresa/cotizar/1',
            EPSEMPBAND: '/eps-empresa/bandeja',
            EPSMANT: '/eps-empresa/mantenimiento'
          }
        },
        referidos: {
          accidentes: 101,
          autos: 301,
          empresas: 274,
          hogar: 120,
          salud: 116,
          sctr: 701,
          segurviaje: 670,
          soat: 302,
          transportes: 252,
          vida: 603
        }
      },
      renovacion: {
        description: "RENO",
        moduleName: 'appReno'
      },
      cgw: {
        eps: "060027A",
        seguros: "000006G",
        roleCodeClinica: "CLI",
        statusLetter: {
          DEV: {
            auditado: { code: 1, description: "AUDITADO" },
            aprobado: { code: 2, description: "APROBADO" },
            procesada: { code: 3, description: "PROCESADA" },
            anulada: { code: 4, description: "ANULADA" },
            rechazada: { code: 5, description: "RECHAZADA" },
            enProcesoDeAuditoria: { code: 6, description: "EN PROCESO DE AUDITORIA" },
            observacionLevantada: { code: 0, description: "OBSERVACION LEVANTADA" },
            auditoriaAdministrativa: { code: 10, description: "AUDITORIA ADMINISTRATIVA" },
            liquidado: { code: 7, description: "LIQUIDADO" },
            observada: { code: 8, description: "OBSERVADA" },
            solicitado: { code: 9, description: "SOLICITADO" },
            auditoriaEjecutivo: { code: 11, description: "AUDITORIA EJECUTIVO" }
          },
          QA: {
            auditado: { code: 1, description: "AUDITADO" },
            aprobado: { code: 2, description: "APROBADO" },
            procesada: { code: 3, description: "PROCESADA" },
            anulada: { code: 4, description: "ANULADA" },
            rechazada: { code: 5, description: "RECHAZADA" },
            enProcesoDeAuditoria: { code: 6, description: "EN PROCESO DE AUDITORIA" },
            observacionLevantada: { code: 0, description: "OBSERVACION LEVANTADA" },
            auditoriaAdministrativa: { code: 10, description: "AUDITORIA ADMINISTRATIVA" },
            liquidado: { code: 7, description: "LIQUIDADO" },
            observada: { code: 8, description: "OBSERVADA" },
            solicitado: { code: 9, description: "SOLICITADO" },
            auditoriaEjecutivo: { code: 11, description: "AUDITORIA EJECUTIVO" }
          },
          PROD: {
            auditado: { code: 1, description: "AUDITADO" },
            aprobado: { code: 2, description: "APROBADO" },
            procesada: { code: 3, description: "PROCESADA" },
            anulada: { code: 4, description: "ANULADA" },
            rechazada: { code: 5, description: "RECHAZADA" },
            enProcesoDeAuditoria: { code: 6, description: "EN PROCESO DE AUDITORIA" },
            observacionLevantada: { code: 0, description: "OBSERVACION LEVANTADA" },
            auditoriaAdministrativa: { code: 10, description: "AUDITORIA ADMINISTRATIVA" },
            liquidado: { code: 7, description: "LIQUIDADO" },
            observada: { code: 8, description: "OBSERVADA" },
            solicitado: { code: 9, description: "SOLICITADO" },
            auditoriaEjecutivo: { code: 11, description: "AUDITORIA EJECUTIVO" }
          }
        },
        statusAuditoria: {
          DEV: {
            porAuditar: { code: 2, description: "POR AUDITAR" },
            enProcesoDeAuditoria: { code: 3, description: "EN PROCESO DE AUDITORIA" },
            auditado: { code: 4, description: "AUDITADO" },
            rechazado: { code: 5, description: "RECHAZADO" }
          },
          QA: {
            porAuditar: { code: 2, description: "POR AUDITAR" },
            enProcesoDeAuditoria: { code: 3, description: "EN PROCESO DE AUDITORIA" },
            auditado: { code: 4, description: "AUDITADO" },
            rechazado: { code: 5, description: "RECHAZADO" }
          },
          PROD: {
            porAuditar: { code: 2, description: "POR AUDITAR" },
            enProcesoDeAuditoria: { code: 3, description: "EN PROCESO DE AUDITORIA" },
            auditado: { code: 4, description: "AUDITADO" },
            rechazado: { code: 5, description: "RECHAZADO" }
          }
        },
        roles: {
          supervisor: { description: "SCG" },
          operador: { description: "OPE" },
          medExterno: { description: "MEX" },
          medAuditor: { description: "MAD" },
          ejeSI24: { description: "EJE24" },
          ejecutivo: { description: "EJEC" },
          consulta: { description: "CCG" },
          clinica: { description: "CLI" },
          admin: { description: "ADM" },
          coordinador: { description: "CDC" },
          broker: { description: "CCB" }
        }
      },
      grqc: {
        eps: "060027A",
        seguros: "000006G",
        roleCodeClinica: "CLI",
        statusLetter: {
          DEV: {
            auditado: { code: 1, description: "AUDITADO" },
            aprobado: { code: 2, description: "APROBADO" },
            procesada: { code: 3, description: "PROCESADA" },
            anulada: { code: 4, description: "ANULADA" },
            rechazada: { code: 5, description: "RECHAZADA" },
            enProcesoDeAuditoria: { code: 6, description: "EN PROCESO DE AUDITORIA" },
            observacionLevantada: { code: 0, description: "OBSERVACION LEVANTADA" },
            auditoriaAdministrativa: { code: 10, description: "AUDITORIA ADMINISTRATIVA" },
            liquidado: { code: 7, description: "LIQUIDADO" },
            observada: { code: 8, description: "OBSERVADA" },
            solicitado: { code: 9, description: "SOLICITADO" },
            auditoriaEjecutivo: { code: 11, description: "AUDITORIA EJECUTIVO" }
          },
          QA: {
            auditado: { code: 1, description: "AUDITADO" },
            aprobado: { code: 2, description: "APROBADO" },
            procesada: { code: 3, description: "PROCESADA" },
            anulada: { code: 4, description: "ANULADA" },
            rechazada: { code: 5, description: "RECHAZADA" },
            enProcesoDeAuditoria: { code: 6, description: "EN PROCESO DE AUDITORIA" },
            observacionLevantada: { code: 0, description: "OBSERVACION LEVANTADA" },
            auditoriaAdministrativa: { code: 10, description: "AUDITORIA ADMINISTRATIVA" },
            liquidado: { code: 7, description: "LIQUIDADO" },
            observada: { code: 8, description: "OBSERVADA" },
            solicitado: { code: 9, description: "SOLICITADO" },
            auditoriaEjecutivo: { code: 11, description: "AUDITORIA EJECUTIVO" }
          },
          PROD: {
            auditado: { code: 1, description: "AUDITADO" },
            aprobado: { code: 2, description: "APROBADO" },
            procesada: { code: 3, description: "PROCESADA" },
            anulada: { code: 4, description: "ANULADA" },
            rechazada: { code: 5, description: "RECHAZADA" },
            enProcesoDeAuditoria: { code: 6, description: "EN PROCESO DE AUDITORIA" },
            observacionLevantada: { code: 0, description: "OBSERVACION LEVANTADA" },
            auditoriaAdministrativa: { code: 10, description: "AUDITORIA ADMINISTRATIVA" },
            liquidado: { code: 7, description: "LIQUIDADO" },
            observada: { code: 8, description: "OBSERVADA" },
            solicitado: { code: 9, description: "SOLICITADO" },
            auditoriaEjecutivo: { code: 11, description: "AUDITORIA EJECUTIVO" }
          }
        },
        statusAuditoria: {
          DEV: {
            porAuditar: { code: 2, description: "POR AUDITAR" },
            enProcesoDeAuditoria: { code: 3, description: "EN PROCESO DE AUDITORIA" },
            auditado: { code: 4, description: "AUDITADO" },
            rechazado: { code: 5, description: "RECHAZADO" }
          },
          QA: {
            porAuditar: { code: 2, description: "POR AUDITAR" },
            enProcesoDeAuditoria: { code: 3, description: "EN PROCESO DE AUDITORIA" },
            auditado: { code: 4, description: "AUDITADO" },
            rechazado: { code: 5, description: "RECHAZADO" }
          },
          PROD: {
            porAuditar: { code: 2, description: "POR AUDITAR" },
            enProcesoDeAuditoria: { code: 3, description: "EN PROCESO DE AUDITORIA" },
            auditado: { code: 4, description: "AUDITADO" },
            rechazado: { code: 5, description: "RECHAZADO" }
          }
        },
        roles: {
          supervisor: { description: "SCG" },
          operador: { description: "OPE" },
          medExterno: { description: "MEX" },
          medAuditor: { description: "MAD" },
          ejeSI24: { description: "EJE24" },
          ejecutivo: { description: "EJEC" },
          consulta: { description: "CCG" },
          clinica: { description: "CLI" },
          admin: { description: "ADM" },
          coordinador: { description: "CDC" },
          broker: { description: "CCB" }
        }
      },
      inspec: {
        PROD: {
          urlWSRSoatLicensePlate: "https://oim.mapfre.com.pe/WSRSoat/vehicle/{plate}",
          urlWSRSelfInspectionRegister: "https://oim.mapfre.com.pe/WSRSelfInspection/registerSelfInspections",
          urlOldInspection: "https://oim.mapfre.com.pe/INSPEC/"
        },
        QA: {
          urlWSRSoatLicensePlate: "https://oim.mapfre.com.pe/WSRSoat/vehicle/{plate}",
          urlWSRSelfInspectionRegister: "http://10.160.120.215/WSRSelfInspection/registerSelfInspections",
          urlOldInspection: "http://spe001001-128.mapfreperu.com/INSPEC/"
        }
      },
      reembolso: {
        code: "REEM",
        roles: {
          supeSOAT: { description: "SUPE_SOAT" },
          supeOtros: { description: "SUPE_OTROS" },
          solicitante: { description: "SOLICITANTE" },
          ejeSoat: { description: "EJEC_SOAT" },
          ejeOtros: { description: "EJEC_OTROS" },
          admin: { description: "ADM" },
          madOtros: { description: "MAD_OTROS" },
          matSOAT: { description: "MAD_SOAT" }
        }
      }
    },
    currencyType: {
      soles: {
        code: 1,
        description: "S/."
      },
      dollar: {
        code: 2,
        description: "$"
      }
    },
    paginationType: {
      back: 'PB',
      front: 'PF',
      none: 'WP'
    },
    actionButton: {
      acept: 'A',
      cancel: 'C',
      export: 'E'
    },
    originApps: {
      myDream: 'MYDREAM',
      urlHomeMYD: 'https://mydream.pre.mapfre.com.pe/',
      myd: 'MYD',
      oim: 'OIM',
      homeMYD: {
        LOCAL: 'http://localhost:4200',
        PRU: 'https://mydream.pre.mapfre.com.pe/home',
        PROD: 'https://mydream.mapfre.com.pe/home',
      },
      txtUssagePoliciesMYD: '<p style="text-align: left;">' + 'Está usted accediendo a un Sistema de Tratamiento de la Información propiedad de MAPFRE. \
      El acceso y uso de este sistema está permitido exclusivamente a las personas autorizadas y para fines estrictamente profesionales.' + '</p>' +
        '<p style="text-align: left;">' + 'La información a la que se accede por este medio es propiedad de MAPFRE y está sujeta a las obligaciones de confidencialidad y \
      seguridad establecidas en la legislación vigente en materia de protección de datos de carácter personal sobre las que MAPFRE informa a \
      todos sus empleados, agentes, delegados, prestadores de servicios y, en general, cualesquiera personas físicas o jurídicas \
      con las que entable algún tipo de relación que implique el acceso de estas a sus sistemas de información.' + '</p>' +
        '<p style="text-align: left;">' + 'Con este motivo, MAPFRE se reserva el derecho de monitorizar y/o registrar los accesos realizados tratando la información \
      monitorizada y/o registrada de acuerdo con la legislación vigente.' + '</p>'
    },
    app: {
      emisa: {
        name: "EMISA",
        adminCode: "ADMIN"
      },
      admportales: {
        name: "ADMPORTALES",
        adminCode: "ADMIN"
      }
    },
    lyra: {
      token: {
        PRU: '79568046:testpublickey_f0jGS6Bmz1ODPJTyg7Q26UD7nQo52MEYv0gR2jNteruVQ',
        PROD: '67249181:publickey_SDNynYu2heD1ZO0RFF6Gl2gpoKK2NWas54DMqHXQRSj39'
      },
      key: {
        PRU: 'GvLccC10ZoeOtPZzkV0xLLIIYVyaE9510kaueVafPoHPQ',
        PROD: 'fyXthDlQIHAtawpsJPpdQSFcdtw1HD7vvDurLHEvST3O6'
      }
    },
    userProfile: {
      adminWeb: 'ADMINWEB'
    },
    targetCallToAction: {
      campaign: {
        PRU: 'https://www.youtube.com/watch?v=Ur6sAT0jfnY',
        PROD: 'https://www.youtube.com/watch?v=Ur6sAT0jfnY'
      }
    },
    sessionKeys: {
      modalHome: 'wasModalShown'
    },
    ORIGIN_SYSTEMS: {
      oim: {
        code: 'OIM',
        title: 'OIM',
        icon: 'favicon.ico',
        bodyClass: '',
        url: "https://oim.pre.mapfre.com.pe/",
        home: "/",
        mfaCode: '1df288de5ea84eca9517f375b0974ee7',
      },
      myDream: {
        code: 'MYDREAM',
        title: 'MYDREAM',
        icon: 'favicon-myd.ico',
        bodyClass: 'app-my-dream',
        url: 'https://mydream.pre.mapfre.com.pe/',
        home: 'https://mydream.pre.mapfre.com.pe/' + 'home',
        logout: 'https://mydream.pre.mapfre.com.pe/' + '?logout=',
      },
      selfService: {
        code: 'AUWEB',
        title: '',
        icon: '',
        bodyClass: '',
        url: 'https://portal.pre.mapfre.com.pe/',
        home: 'https://portal.pre.mapfre.com.pe/' + '#/home',
        logout: 'https://portal.pre.mapfre.com.pe/' + '#/login?logout=',
        apps: 'https://portal.pre.mapfre.com.pe/' + '#/apps',
      }
    },
    STORAGE_KEYS: {
      profile: 'profile',
      originSystem: 'originSystem'
    }
  };
  constants = oim;
  return oim;
});
