(function(deps, factory) {
  define(deps, factory);
})(['/scripts/plugins/uuid/uuidv4.min.js'], function(uuid) {
  var s = {
    apps: {
      landing: {
        packageName: "landingPackage",
        path: "/landing-salud/package",
        location: "/landing-salud",
        rootApi: ""
      },
      byPass: {
        packageName: 'byPassPackage',
        path: "/by-pass/app/package",
        location: '/#index',
        rootApi: ''
      },
      login: {
        packageName: "loginPackage",
        path: "/login/app/package",
        location: "/#index",
        rootApi: ""
      },
      home: {
        packageName: "homePackage",
        path: "/app/homePackage",
        location: "/",
        rootApi: ""
      },
      polize: {
        code: "EMISA",
        shortName: "EMISION DE POLIZAS",
        packageName: "polizePackage",
        path: "/polizas/package",
        location: "/polizas/#",
        menuName: "Pólizas",
        rootApi: "",
        isComponsesMenu: true,
        icon: "ico-mapfre_152_polizas"
      },
      renovacion: {
        code: "RENOV",
        shortName: "RENOVACIÓN",
        packageName: "renovacionPackage",
        path: "/renovacion/package",
        location: "/renovacion/#",
        menuName: "Renovación",
        rootApi: "",
        isComponsesMenu: true,
        icon: "ico-mapfre_152_polizas"
      },
      constSCTR: {
        code: 6,
        packageName: "constSCTRPackage",
        path: "/app/homePackage",
        location: "/constSCTR",
        menuName: "Constancias SCTR",
        rootApi: "",
        isComponsesMenu: true,
        icon: "ico-mapfre_155_Sctr"
      },
      lettersGuarantee: {
        code: "CGW",
        shortName: "CARTA CARANTIA",
        packageName: "lettersGuaranteePackage",
        path: "/cgw/package",
        location: "/cgw",
        rootApi: "",
        menuName: "Cartas de Garantía",
        isComponsesMenu: true,
        icon: "ico-mapfre_150_cartasdegarantia"
      },
      grqc: {
        code: "GRQC",
        shortName: "GESTION DE REQUERIMIENTOS",
        packageName: "grqcPackage",
        path: "/grqc/package",
        location: "/grqc",
        rootApi: "",
        menuName: "Gestión de Requerimientos",
        isComponsesMenu: true,
        icon: "ico-mapfre_172_consultaGestion"
      },
      gcw: {
        code: "GCW",
        shortName: "CONSULTAS DE GESTION",

        packageName: "gcwPackage",
        path: "/gcw/package",
        location: "/gcw",
        rootApi: "",
        menuName: "Consulta de Gestión",
        isComponsesMenu: true,
        icon: "ico-mapfre_172_consultaGestion"
      },
      wp: {
        code: "WEBPROC",
        shortName: "WEB DEL PROCURADOR",
        packageName: "wpPackage",
        path: "/webproc/package",
        location: "/webproc",
        rootApi: "",
        menuName: "Web Procurador",
        isComponsesMenu: true,
        icon: "ico-mapfre_11_assitentemapfre"
      },
      pf: {
        code: "PLANIFICADOR",
        shortName: "PLANIFICADOR FINANCIERO",
        packageName: "wpPackage",
        path: "/webproc/package",
        location: "https://peru.planificadorfinanciero.mapfre.com/login?token=",
        rootApi: "",
        menuName: "Planificador Financiero",
        isComponsesMenu: true,
        icon: "ico-mapfre-340-planificador"
      },
      ap: {
        code: "ADMPORTALES",
        shortName: "Administrador de Portales",
        packageName: "apPackage",
        path: "/admin-portal/package",
        location: "/admin-portal",
        rootApi: "",
        menuName: "Administrador de Portales",
        isComponsesMenu: true,
        icon: "ap-ico-mapfre-386-administrador_portales"
      },
      inspec: {
        code: "INSPEC",
        shortName: "INSPECCIONES AUTOS",
        packageName: "inspecPackage",
        path: "/inspec/package",
        location: "/inspec",
        menuName: "Inspección de Autos",
        rootApi: "",
        isComponsesMenu: true,
        icon: "ico-mapfre_151_inspeccion"
      },
      query: {
        code: 9,
        packageName: "homePackage",
        path: "/app/homePackage",
        location: "/query",
        menuName: "Consultas de Gestión",
        rootApi: "",
        isComponsesMenu: true,
        icon: "ico-mapfre_153_gestion"
      },
      sinister: {
        code: 4,
        packageName: "homePackage",
        path: "/app/homePackage",
        location: "/sinister",
        menuName: "Siniestros",
        rootApi: "",
        isComponsesMenu: true,
        icon: ""
      },
      nsctr: {
        code: 'MX-NSCTR',
        shortName: 'CONSTANCIAS SCTR',
        packageName: 'nsctrPackage',
        path: "/nsctr/package",
        location: '/nsctr/#',
        menuName: 'Constancias SCTR y VL',
        rootApi: '',
        isComponsesMenu: true,
        icon: 'ico-mapfre_155_Sctr',
        groupApps: true,
        apps: [
          {
            code: "NSCTR",
            codeObj: {
              prod: [420],
              dev: [600]
            },
            shortName: 'REGULAR',
            location: '/nsctr/#/regular/searchClient',
            state: 'regularSearchClient',
            menuName: 'SCTR General',
            rootApi: '',
            isComponsesMenu: true,
            icon: 'ico-mapfre_155_Sctr',
            iconMYD: 'ico-mapfre-372-sctr_general'
          },
          {
            code: "MIN",
            codeObj: {
              prod: [1861],
              dev: [2147]
            },
            shortName: 'MINERIA',
            location: '/nsctr/#/mining/searchClient',
            state: 'miningSearchClient',
            menuName: 'SCTR Minería',
            rootApi: '',
            isComponsesMenu: true,
            icon: 'ico-mapfre_155_Sctr',
            iconMYD: 'ico-mapfre-371-mineria'
          },
          {
            code: "VLE",
            codeObj: {
              prod: [1862],
              dev: [2148]
            },
            shortName: 'VIDA LEY',
            location: '/nsctr/#/lifeLaw/searchClient',
            state: 'lifeLawSearchClient',
            menuName: 'Vida Ley',
            rootApi: '',
            isComponsesMenu: true,
            icon: 'ico-mapfre_155_Sctr',
            iconMYD: 'ico-mapfre-373-vida_ley'
          }
        ]
      },
      drabap: {
        code: "REF",
        packageName: "referenciaPackage",
        path: "/referencia/app/package",
        location: "/referencia",
        menuName: "Proveedor",
        rootApi: "",
        isComponsesMenu: true,
        icon: "ico-mapfre_155_Sctr"
      },
      enel: {
        code: "ENEL",
        shortName: "ENEL",
        packageName: "enelPackage",
        path: "/enel/package",
        location: "/enel/#/bandeja",

        menuName: "Solicitudes Enel",
        rootApi: "",
        isComponsesMenu: true,
        icon: "ico-mapfre_173_solicitudesEnel"
      },
      callerDashboard: {
        code: "CDASH",
        shortName: "Caller Dashboard",
        packageName: "callerDashboardPackage",
        path: "/callerDashboard/package",
        appPath: "/callerDashboard/app",
        location: "/callerDashboard/#",

        menuName: "Dashboard",
        rootApi: "",
        isComponsesMenu: true,
        icon: "ico-mapfre_172_consultaGestion"
      },
      maqueta: {
        code: "MQT",
        shortName: "MAQUETA",
        packageName: "maquetaPackage",
        path: "/maqueta/package",

        location: "/maqueta/#/maqueta",
        menuName: "MAQUETA",
        rootApi: "",
        isComponsesMenu: true,
        icon: "ico-mapfre_155_Sctr"
      },
      restos: {
        code: "GCRE",
        shortName: "RESTOS",
        packageName: "restosPackage",
        path: "/restos/package",
        location: "/restos/#/",
        menuName: "Gestión de Restos Vehiculares",
        rootApi: "",
        isComponsesMenu: true,
        icon: "ico-mapfre_319_gestionRestos"
      },
      pericial: {
        code: "GPER",
        shortName: "GESTION PERICIAL",
        packageName: "pericialPackage",
        path: "/pericial/package",
        location: "/pericial/#/homeTaller",
        menuName: "Gestión Pericial",
        rootApi: "",
        isComponsesMenu: true,
        icon: "ico-mapfre_335_pericial"
      },
      medicalCenter: {
        code: "REPCM",
        shortName: "Reportes Centros Medicos",
        packageName: "medicalCenterPackage",
        path: "/medicalCentral/package",
        appPath: "/medicalCentral/app",
        location: "/medicalCentral/#",
        menuName: "Centros Medicos",
        rootApi: "",
        isComponsesMenu: true,
        icon: "ico-mapfre_334_reporteCentroMedico"
      },
      reembolso: {
        code: "REEM",
        shortName: "REEMBOLSOS",
        packageName: "reembolsoPackage",
        path: "/reembolso/package",
        location: "/reembolso/#",
        rootApi: "",
        menuName: "Reembolsos",
        isComponsesMenu: true,
        icon: "ico-mapfre_340_reembolsos"
      },
      kpissalud:{
        code: "KPISSALUD",
        shortName: 'Kpissalud',
        packageName: 'kpissaludPackage',
        path: "/kpissalud/package",
        appPath: "/kpissalud/app",
        location: '/kpissalud/#',
        menuName: 'KPIs Multiproducto',
        rootApi: '',
        isComponsesMenu: true,
        icon: 'ico-mapfre_172_consultaGestion'
      },
      farmapfre: {
        code: "FARMAPFRE",
        shortName: "Farmapfre",
        packageName: "farmapfrePackage",
        path: "/farmapfre/package",
        appPath: "/farmapfre/app",
        location: '/farmapfre/#',
        menuName: 'Delivery de Medicamentos',
        rootApi: '',
        isComponsesMenu: true,
        icon: "ico-mapfre_341_delivery-medicamentos"
      },
      referencias:{
        code: "NREF",
        shortName: 'Referencias',
        packageName: 'referenciasPackage',
        path: "/referencias/package",
        appPath: "/referencias/app",
        location: '/referencias/#',
        menuName: 'Referencias',
        rootApi: '',
        isComponsesMenu: true,
        icon: 'ico-mapfre_155_Sctr'
      },
      altasBajasSalud:{
        code: "ABSALUD",
        shortName: 'Altas y Bajas Salud0',
        packageName: 'altasbajassaludPackage',
        path: "/altasbajassalud/package",
        appPath: "/altasbajassalud/app",
        location: '/altasbajassalud/#',
        menuName: 'Altas y Bajas Salud',
        rootApi: '',
        isComponsesMenu: true,
        icon: 'ico-mapfre_01_altasybajas'
      },
      reticencia:{
        code: "RETICENCIA",
        shortName: 'GESTION DE RETICENCIA',
        packageName: 'reticenciaPackage',
        path: "/reticencia/package",
        appPath: "/reticencia/app",
        location: '/reticencia/#',
        menuName: 'Gestión de Reticencia',
        rootApi: '',
        isComponsesMenu: true,
        icon: 'ico-mapfre_172_consultaGestion'
      },
      tecuidamos:{
        code: "TCUID",
        shortName: 'Te Cuidamos',
        packageName: 'tecuidamosPackage',
        path: "/tecuidamos/package",
        appPath: "/tecuidamos/app",
        location: '/tecuidamos/#',
        menuName: 'Te Cuidamos',
        rootApi: '',
        isComponsesMenu: true,
        icon: 'ico-mapfre_172_consultaGestion'
      },
      gestionmedica:{
        code: "GESMED",
        shortName: 'Gestión Médica',
        packageName: 'gestionmedicaPackage',
        path: "/gestionmedica/package",
        appPath: "/gestionmedica/app",
        location: '/gestionmedica/#',
        menuName: 'Gestión Médica',
        rootApi: '',
        isComponsesMenu: true,
        icon: 'ico-mapfre_174_gestionMedica'
      },
  	 cnt:{
        code: "CNT",
        shortName: 'Canales No Tradicionales',
        packageName: 'Canales No Tradicionales',
        path: "/cnt/package",
        appPath: "/cnt/app",
        location: '/cnt/#',
        menuName: 'Canales No Tradicionales',
        rootApi: '',
        isComponsesMenu: true,
        icon: 'ico-mapfre_172_consultaGestion'
      },
      atencionsiniestrosagricola:{
        code: "ASA",
        shortName: 'SINIESTROS AGRICOLA',
        packageName: 'atencionsiniestrosagricolaPackage',
        path: "/atencionsiniestrosagricola/package",
        appPath: "/atencionsiniestrosagricola/app",
        location: '/atencionsiniestrosagricola/#',
        menuName: 'Atención de siniestros agrícola',
        rootApi: '',
        isComponsesMenu: true,
        icon: 'ico-mapfre_342_agricolaweb'
      },
      sctrDenuncia:{
        code: "SCTRAV",
        shortName: 'SCTR Invalidez',
        packageName: 'sctrDenunciaPackage',
        path: "/sctrDenuncia/package",
        appPath: "/sctrDenuncia/app",
        location: '/sctrDenuncia/#',
        menuName: 'SCTR Invalidez',
        rootApi: '',
        isComponsesMenu: true,
        icon: 'ico-mapfre_343_sctrdenuncia'
      },
      security: {
        code: "SEGURIDAD",
        shortName: "SEGURIDAD",
        packageName: "securityPackage",
        path: "/security/package",
        location: "/security/#/dashboard",
        menuName: "Seguridad",
        rootApi: "",
        isComponsesMenu: true,
        icon: "ico-mapfre_336_securitySystem"
      },
      actter: {
        code: 'ACTTER',
        shortName: "",
        packageName: "actterPackage",
        path: "/actter/package",
        location: "/actter",
        menuName: "Actualización de datos de clientes",
        rootApi: "",
        isComponsesMenu: true,
        icon: "ico-mapfre_305_user"
      },
      gestionAnulacion:{
        code: "ANUL",
        shortName: 'Anulación de Pólizas',
        packageName: 'gestionanulacionPackage',
        path: "/gestionanulacion/package",
        appPath: "/gestionanulacion/app",
        location: '/gestionanulacion/#',
        menuName: 'Anulación de Pólizas',
        rootApi: '',
        isComponsesMenu: true,
        icon: 'ico-mapfre-anulacion'
      },
      constancia:{
        code: "CASEG",
        shortName: 'Constancia de Salud',
        packageName: 'constanciaPackage',
        path: "/constancia/package",
        appPath: "/constancia/app",
        location: '/constancia/#',
        menuName: 'Constancia de Salud',
        rootApi: '',
        isComponsesMenu: true,
        icon: 'ico-mapfre_93_crearmodificar'
      },
      inclusionMasiva:{
        code: "OPTI",
        shortName: 'Inclusión Masiva de Salud',
        packageName: 'inclusionmasivaPackage',
        path: "/inclusionmasiva/package",
        appPath: "/inclusionmasiva/app",
        location: '/inclusionmasiva/#',
        menuName: 'Inclusión Masiva de Salud',
        rootApi: '',
        isComponsesMenu: true,
        icon: 'ico-mapfre_343_sctrdenuncia'
      },
    },
    lib: {
      /* LIBS ANGULAR */
      helper: {
        packageName: "helper",
        path: "/scripts/helper"
      },

      package: {
        packageName: "package",
        path: "/app/package"
      }
    },
    shim: {},
    packages: {},
    _getName: function(obj) {
      if (obj["packageName"]) return "packageName";
      if (obj["name"]) return "name";
    },
    _setPropName: function(target, obj, value) {
      target[obj[this._getName(obj)]] = value;
    },
    union: function(arguments) {
      var o = {};
      for (var i = 0; i < arguments.length; i++) {
        for (var p in arguments[i]) {
          o[p] = arguments[i][p];
        }
      }
      return o;
    },
    _importsName: function(arguments, propName) {
      var o = [];
      for (var i = 0; i < arguments.length; i++) {
        o.push(arguments[i][this._getName(arguments[i])]);
      }
      return o;
    },
    _imports: function(arguments) {
      var o = {};
      for (var i = 0; i < arguments.length; i++) {
        this._setPropName(o, arguments[i], arguments[i].path);
      }
      return o;
    },
    _importPackage: function(arguments) {
      var o = {};
      for (var i = 0; i < arguments.length; i++) {
        for (var p in arguments[i]) {
          this._setPropName(o, arguments[i][p], arguments[i][p].path);
        }
      }
      return o;
    },
    import: function(subSys, action) {
      var seed = this._versionEnvironment();



      if (!!seed === true)
        require.config({
          waitSeconds: 180,
          paths: this._imports(subSys),
          urlArgs: "seed=" + seed
        });
      else
        require.config({
          waitSeconds: 180,
          paths: this._imports(subSys)
        });
      var $this = this;

      require(this._importsName(subSys), function() {
        var pack = [];
        var shim = [];
        for (var i = 0; i < arguments.length; i++) {
          pack.push(arguments[i].lib);
          shim.push(arguments[i].shim);
        }
        require({
          paths: $this._importPackage(pack),
          shim: $this.union(shim)
        });
        if (action) action.apply(this, arguments);
      });
    },

    _versionEnvironment: function() {
      var enviroments = {
        dev: {
          hostname: "dev.oim.mapfre.com.pe"
        },
        qa: {
          hostname: "wscls.pru.mapfreperu.com",
          version: this.genUUDI()
        },
        uat: {
          hostname: "swlogin.pru.mapfreperu.com",
          version: this.genUUDI()
        }
      };
      for (var env in enviroments) {
        if (enviroments[env].hostname === window.location.hostname) return enviroments[env].version;
      }
    },
    genUUDI: function uudi() {
      return uuid();
    },
    currentBrowser: function() {
      var browsers = this.typesBrowser();
      for (var brow in browsers) {
        if (browsers[brow]) return brow;
      }
      return undefined;
    },
    typesBrowser: function() {
      var isOpera = !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;
      var browsers = {
        Opera: isOpera,
        Firefox: typeof InstallTrigger !== "undefined",

        Safari:
          /constructor/i.test(window.HTMLElement) ||
          (function(p) {
            return p.toString() === "[object SafariRemoteNotification]";
          })(!window["safari"] || safari.pushNotification),
        Chrome: !!window.chrome && !isOpera,
        IE: /*@cc_on!@*/ false || !!document.documentMode
      };
      return browsers;
    },
    pathAppBase: function(path) {
      return this.currentApp.appPath + path;
    }
  };
  window.oimSystem = s;
  return s;
});