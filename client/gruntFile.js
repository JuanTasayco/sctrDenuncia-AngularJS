"use strict";

var proxyGenerator = {
  enel: {
    name: "enel",
    propUrlConfig: "urlEnel",
    descriptorPath: "proxy/bin/enel.json",
    renderTaskName: "proxyEnel",
    destProxy: "wwwroot/enel/app/proxy/serviceEnel.js",
    sourceCode: "wwwroot/enel",
    ngModuleNameProxy: "oim.proxyService.enel",
    sonarOptions: {
      key: "NG_ENEL",
      name: "Angular ENEL",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "enel",
      constantsName: "oimProxyEnel"
    }
  },
  cgw: {
    name: "cgw",
    propUrlConfig: "urlCgw",
    descriptorPath: "proxy/bin/cgw.json",
    sourceCode: "wwwroot/cgw",
    destProxy: "wwwroot/cgw/app/proxy/serviceCgw.js",
    renderTaskName: "proxyCgw",
    ngModuleNameProxy: "oim.proxyService.cgw",
    sonarOptions: {
      key: "NG_CGW",
      name: "Angular Cartas de Garantia",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "cgw",
      constantsName: "oimProxyCgw"
    }
  },
  grqc: {
    name: "grqc",
    propUrlConfig: "urlGrqc",
    descriptorPath: "proxy/bin/grqc.json",
    sourceCode: "wwwroot/grqc",
    destProxy: "wwwroot/grqc/app/proxy/serviceGrqc.js",
    renderTaskName: "proxyGrqc",
    ngModuleNameProxy: "oim.proxyService.grqc",
    sonarOptions: {
      key: "NG_GRQC",
      name: "Angular Gestion Requerimientos",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "grqc",
      constantsName: "oimProxyGrqc"
    }
  },     
  renovacion: {
    name: "renovacion",
    propUrlConfig: "urlRenovacion",
    descriptorPath: "proxy/bin/renovacion.json",
    renderTaskName: "proxyRenovacion",
    sourceCode: "wwwroot/renovacion",
    destProxy: "wwwroot/renovacion/app/proxy/renovacionService.js",
    ngModuleNameProxy: "oim.proxyService.renovacion",
    sonarOptions: {
      key: "NG_RENOVACION",
      name: "Angular RENOVACION",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "renovacion",
      constantsName: "oimProxyRenovacion"
    }
  }, 
  powereps: {
    name: "powereps",
    propUrlConfig: "urlPowerEPS",
    descriptorPath: "proxy/bin/powereps.json",
    sourceCode: "wwwroot/cgw",
    destProxy: "wwwroot/cgw/app/proxy/servicePowerEPS.js",
    renderTaskName: "proxyPowereps",
    ngModuleNameProxy: "oim.proxyService.powereps",
    sonarOptions: {
      key: "NG_PowerEPS",
      name: "Servicios de PowerEPS",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "powereps",
      constantsName: "oimProxyPowerEPS"
    }
  },
  gcw: {
    name: "gcw",
    propUrlConfig: "urlGcw",
    descriptorPath: "proxy/bin/gcw.json",
    destProxy: "wwwroot/gcw/app/proxy/serviceGcw.js",
    renderTaskName: "proxyGcw",
    sourceCode: "wwwroot/gcw",
    ngModuleNameProxy: "oim.proxyService.gcw",
    sonarOptions: {
      key: "NG_GCW",
      name: "Angular Consultas de Gestion",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "gcw",
      constantsName: "oimProxyGcw"
    }
  },
  nsctr: {
    name: "nsctr",
    propUrlConfig: "urlNsctr",
    descriptorPath: "proxy/bin/nsctr.json",
    destProxy: "wwwroot/nsctr/app/proxy/serviceNsctr.js",
    renderTaskName: "proxyNsctr",
    sourceCode: "wwwroot/nsctr",
    ngModuleNameProxy: "oim.proxyService.nsctr",
    sonarOptions: {
      key: "NG_NSCTR",
      name: "Angular NSCTR",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "nsctr",
      constantsName: "oimProxyNsctr"
    }
  },
  poliza: {
    name: "poliza",
    propUrlConfig: "urlPolicy",
    descriptorPath: "proxy/bin/poliza.json",
    destProxy: "wwwroot/polizas/app/proxy/servicePoliza.js",
    renderTaskName: "proxyPoliza",
    sourceCode: "wwwroot/polizas",
    ngModuleNameProxy: "oim.proxyService.poliza",
    sonarOptions: {
      key: "NG_POLIZAS",
      name: "Angular Polizas",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "policy",
      constantsName: "oimProxyPoliza"
    }
  },
  seguroViaje: {
    name: "seguroViaje",
    propUrlConfig: "urlseguroViaje",
    descriptorPath: "proxy/bin/poliza.json",
    destProxy: "wwwroot/polizas/app/seguroviaje/proxy/serviceSeguroViaje.js",
    renderTaskName: "proxySeguroViaje",
    sourceCode: "wwwroot/polizas/app/seguroviaje",
    ngModuleNameProxy: "oim.proxyService.seguroViaje",
    sonarOptions: {
      key: "NG_SEGUROVIAJE",
      name: "Angular SeguroViaje",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "multirisk",
      constantsName: "oimSeguroViaje"
    }
  },
  login: {
    name: "login",
    propUrlConfig: "urlSecurity",
    descriptorPath: "proxy/bin/login.json",
    destProxy: "wwwroot/app/proxy/serviceLogin.js",
    renderTaskName: "proxyLogin",
    sourceCode: "wwwroot/login",
    ngModuleNameProxy: "oim.proxyService.Login",
    sonarOptions: {
      key: "NG_LOGIN",
      name: "Angular Login",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "security",
      constantsName: "oimProxyLogin"
    }
  },
  inspec: {
    name: "inspec",
    propUrlConfig: "urlInspec",
    descriptorPath: "proxy/bin/inspec.json",
    renderTaskName: "proxyInspec",
    sourceCode: "wwwroot/inspec",
    ngModuleNameProxy: "",
    sonarOptions: {
      key: "NG_INSPEC",
      name: "Angular INSPECCIONES",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "inspec",
      constantsName: "oimProxyInspec"
    }
  },
  webProc: {
    name: "webProc",
    propUrlConfig: "urlWebProc",
    descriptorPath: "proxy/bin/webproc.json",
    destProxy: "wwwroot/webproc/app/proxy/serviceWebproc.js",
    renderTaskName: "proxyWebProc",
    sourceCode: "wwwroot/webproc",
    ngModuleNameProxy: "oim.proxyService.webProc",
    sonarOptions: {
      key: "NG_WEBPROC",
      name: "Angular Web Procurador",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "webproc",
      constantsName: "oimProxyWebProc"
    }
  },
  seguridad: {
    name: "seguridad",
    propUrlConfig: "urlSeguridad",
    descriptorPath: "proxy/bin/seguridad.json",
    destProxy: "wwwroot/security/app/proxy/serviceSeguridad.js",
    renderTaskName: "proxySeguridad",
    sourceCode: "wwwroot/security",
    ngModuleNameProxy: "oim.proxyService.seguridad",
    sonarOptions: {
      key: "NG_SEGURIDAD",
      name: "Angular Seguridad",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "seguridad",
      constantsName: "oimProxySeguridad"
    }
  },
  callerDashboard: {
    name: "callerDashboard",
    propUrlConfig: "urlCallerDash",
    descriptorPath: "proxy/bin/cdashoard.json",
    destProxy: "wwwroot/callerDashboard/app/proxy/serviceCallerDashboard.js",
    renderTaskName: "proxyCallerDashboard",
    sourceCode: "wwwroot/callerDashboard",
    ngModuleNameProxy: "oim.proxyService.callerDashboard",
    sonarOptions: {
      key: "NG_CDASH",
      name: "Angular Web Caller Dashboard",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "callerDash",
      constantsName: "oimProxyCallerDash"
    }
  },
  gper: {
    name: "gper",
    propUrlConfig: "urlGPer",
    descriptorPath: "proxy/bin/gper.json",
    sourceCode: "wwwroot/pericial",
    destProxy: "wwwroot/pericial/app/proxy/serviceGPer.js",
    renderTaskName: "proxyGPer",
    ngModuleNameProxy: "oim.proxyService.gper",
    sonarOptions: {
      key: "NG_GPER",
      name: "Angular Gestion Pericial",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "gper",
      constantsName: "oimProxyGPer"
    }
  },
  medicalCenter: {
    name: "medicalCenter",
    propUrlConfig: "urlMedicalCentral",
    descriptorPath: "proxy/bin/medicalcenter.json",
    destProxy: "wwwroot/medicalCentral/app/proxy/serviceMedicalCenter.js",
    renderTaskName: "proxyMedicalCenter",
    sourceCode: "wwwroot/medicalCentral",
    ngModuleNameProxy: "oim.proxyService.medicalCenter",
    sonarOptions: {
      key: "NG_MEDICALCENTER",
      name: "Angular Web MEDICAL CENTER",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "medicalCenter",
      constantsName: "oimProxyMedicalCenter"
    }
  },
  reembolso: {
    name: "reembolso",
    propUrlConfig: "urlReembolso",
    descriptorPath: "proxy/bin/reembolso.json",
    destProxy: "wwwroot/reembolso/app/proxy/serviceReembolso.js",
    renderTaskName: "proxyReembolso",
    sourceCode: "wwwroot/reembolso",
    ngModuleNameProxy: "oim.proxyService.reembolso",
    sonarOptions: {
      key: "NG_REEMBOLSO",
      name: "Angular Reembolso",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "reembolso",
      constantsName: "oimProxyReembolso"
    }
  },
  reembolso2: {
    name: "reembolso2",
    propUrlConfig: "urlReembolso2",
    descriptorPath: "proxy/bin/reembolso2.json",
    destProxy: "wwwroot/reembolso/app/proxy/serviceReembolso2.js",
    renderTaskName: "proxyReembolso2",
    sourceCode: "wwwroot/reembolso",
    ngModuleNameProxy: "oim.proxyService.reembolso2",
    sonarOptions: {
      key: "NG_REEMBOLSO",
      name: "Angular Reembolso",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "reembolso2",
      constantsName: "oimProxyReembolso2"
    }
  },
  kpissalud: {
    name: "kpissalud",
    propUrlConfig: "urlKpissalud",
    descriptorPath: "proxy/bin/kpissalud.json",
    destProxy: "wwwroot/kpissalud/app/proxy/serviceKpissalud.js",
    renderTaskName: "proxykpissalud",
    sourceCode: "wwwroot/kpissalud",
    ngModuleNameProxy: "oim.proxyService.kpissalud",
    sonarOptions: {
      key: "NG_^KPISSALUD",
      name: "Angular Web KPIS SALUD",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "kpissalud",
      constantsName: "oimProxyKpissalud"
    }
  },
  farmapfre: {
    name: "farmapfre",
    propUrlConfig: "urlFarmapfre",
    descriptorPath: "proxy/bin/farmapfre.json",
    destProxy: "wwwroot/farmapfre/app/proxy/serviceFarmapfre.js",
    renderTaskName: "proxyfarmapfre",
    sourceCode: "wwwroot/farmapfre",
    ngModuleNameProxy: "oim.proxyService.farmapfre",
    sonarOptions: {
      key: "NG_^FARMAPFRE",
      name: "Angular Web FARMAPFRE BACKOFFICE",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "farmapfre",
      constantsName: "oimProxyFarmapfre"
    }
  },
  sctrDenuncia: {
    name: "sctrDenuncia",
    //urlDescriptor: 'http://localhost:59322/api/descriptor',
    propUrlConfig: "urlSctrDenuncia",
    descriptorPath: 'proxy/bin/sctrDenuncia.json',
    destProxy: 'wwwroot/sctrDenuncia/app/proxy/serviceSctrDenuncia.js',
    renderTaskName: "proxySctrDenuncia",
    sourceCode: 'wwwroot/sctrDenuncia',
    ngModuleNameProxy: "oim.proxyService.sctrDenuncia",
    sonarOptions: {
      key: "NG_^sctrDenuncia",
      name: "Angular Web Sctr Denuncia BACKOFFICE",
      version: "1.0"
    },
    dataProxy: {
      endpointName: 'sctrDenuncia',
      constantsName: 'oimProxySctrDenuncia'
    }
  },
  mydream: {
    name: "mydream",
    propUrlConfig: "urlMyDream",
    descriptorPath: "proxy/bin/mydream.json",
    destProxy: "wwwroot/mydream/app/proxy/serviceMyDream.js",
    renderTaskName: "proxyMyDream",
    sourceCode: "wwwroot/mydream",
    ngModuleNameProxy: "oim.proxyService.mydream",
    sonarOptions: {
      key: "NG_MYDREAM",
      name: "Angular MyDream",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "MyDream",
      constantsName: "oimProxyMyDream"
    }
  },
  paymentgateway: {
    name: "paymentgateway",
    propUrlConfig: "urlPaymentgateway",
    descriptorPath: "proxy/bin/paymentgateway.json",
    destProxy: "wwwroot/paymentgateway/app/proxy/servicePaymentgateway.js",
    renderTaskName: "proxyPaymentgateway",
    sourceCode: "wwwroot/paymentgateway",
    ngModuleNameProxy: "oim.proxyService.paymentgateway",
    sonarOptions: {
      key: "NG_PAYMENTGATEWAY",
      name: "Angular Paymentgateway",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "paymentgateway",
      constantsName: "oimProxyPaymentgateway"
    }
  },
  referencias: {
    name: "referencias",
    propUrlConfig: "urlReferencias",
    descriptorPath: "proxy/bin/referencias.json",
    destProxy: "wwwroot/referencias/app/proxy/serviceReferencias.js",
    renderTaskName: "proxyreferencias",
    sourceCode: "wwwroot/referencias",
    ngModuleNameProxy: "oim.proxyService.referencias",
    sonarOptions: {
      key: "NG_^REFERENCIAS",
      name: "Angular Web REFERECIAS",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "referencias",
      constantsName: "oimProxyReferencias"
    }
  },
  atencionsiniestrosagricola: {
    name: "atencionsiniestrosagricola",
    propUrlConfig: "urlAtencionsiniestrosagricola",
    descriptorPath: "proxy/bin/atencionsiniestrosagricola.json",
    destProxy: "wwwroot/atencionsiniestrosagricola/app/proxy/serviceAtencionsiniestrosagricola.js",
    renderTaskName: "proxyatencionsiniestrosagricola",
    sourceCode: "wwwroot/atencionsiniestrosagricola",
    ngModuleNameProxy: "oim.proxyService.atencionsiniestrosagricola",
    sonarOptions: {
      key: "NG_^ATENCIONSINIESTROSAGRICOLA",
      name: "Angular Web Atención Siniestros Agrícola",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "atencionsiniestrosagricola",
      constantsName: "oimProxyAtencionsiniestrosagricola"
    }
  },
  actter: {
    name: "actter",
    propUrlConfig: "urlActter",
    descriptorPath: "proxy/bin/actter.json",
    destProxy: "wwwroot/actter/app/proxy/serviceActter.js",
    renderTaskName: "proxyActter",
    sourceCode: "wwwroot/actter",
    ngModuleNameProxy: "oim.proxyService.actter",
    sonarOptions: {
      key: "NG_ACTTER",
      name: "Angular ACTTER",
      version: "1.0"
    },
    dataProxy: {
      endpointName: "actter",
      constantsName: "oimProxyActter"
    }
  }
};

module.exports = function(grunt) {
  var oim = grunt.option("oim");
  var moduloToUglify = "<%= oim.path %>/" + oim + "/**/*.js";
  require("load-grunt-tasks")(grunt);
  grunt.loadNpmTasks("grunt-connect-proxy");
  grunt.initConfig({
    oim: {
      path: "wwwroot",
      dist: "dist"
    },
    connect: {
      login: {
        options: {
          hostname: "dev.oim.mapfre.com.pe",
          port: 6777,
          livereload: true,
          keepalive: true,
          open: {
            target: "http://dev.oim.mapfre.com.pe:6777/login/#/index/"
          },
          base: ["wwwroot"],
          middleware: function midFn(connect, options, defaultMiddleware) {
            var proxy = require("grunt-connect-proxy/lib/utils").proxyRequest;
            return [proxy].concat(defaultMiddleware);
          }
        },
        proxies: [
          {
            context: "/drabad/api",
            host: "10.160.120.214",
            port: 80,
            https: false,
            rewrite: {
              "^/drabad/api": "/oim_referencia/api"
            }
          }
        ]
      }
    },
    watch: {
      www: {
        files: ["wwwroot/**/*.html", "wwwroot/**/*.js"],
        options: {
          livereload: true
        }
      },
      css: {
        files: "wwwroot/**/*.scss",
        tasks: ["sass"]
      }
    },
    sass: {
      dist: {
        options: {
          noCache: true
        },
        files: {
          "wwwroot/styles/login/mainLogin.css": "wwwroot/styles/login/mainLogin.scss",
          "wwwroot/styles/home/mainHome.css": "wwwroot/styles/home/mainHome.scss",
          "wwwroot/styles/maqueta/mainMaqueta.css": "wwwroot/styles/maqueta/mainMaqueta.scss",
          "wwwroot/styles/restos/mainRestos.css": "wwwroot/styles/restos/mainRestos.scss",
          "wwwroot/styles/polizas/main.css": "wwwroot/styles/polizas/main.scss",
          "wwwroot/styles/nsctr/mainNsctr.css": "wwwroot/styles/nsctr/mainNsctr.scss",
          "wwwroot/styles/enel/mainEnel.css": "wwwroot/styles/enel/mainEnel.scss",
          "wwwroot/styles/webProc/mainWebProc.css": "wwwroot/styles/webProc/mainWebProc.scss",
          "wwwroot/styles/renovacion/mainRenovacion.css" : "wwwroot/styles/renovacion/mainRenovacion.scss",
          "wwwroot/styles/admin-portal/mainAdminPortal.css": "wwwroot/styles/admin-portal/mainAdminPortal.scss",
          "wwwroot/styles/cgw/mainCgw.css": "wwwroot/styles/cgw/mainCgw.scss",
          "wwwroot/styles/grqc/mainGrqc.css": "wwwroot/styles/grqc/mainGrqc.scss",		  		  
          "wwwroot/styles/referencias/mainReferencias.css": "wwwroot/styles/referencias/mainReferencias.scss",
          "wwwroot/styles/gcw/mainGcw.css": "wwwroot/styles/gcw/mainGcw.scss",
          "wwwroot/styles/inspecciones/mainInspecciones.css": "wwwroot/styles/inspecciones/mainInspecciones.scss",
          "wwwroot/styles/kpissalud/mainKpissalud.css": "wwwroot/styles/kpissalud/mainKpissalud.scss",
          'wwwroot/sctrDenuncia/resources/styles/mainSctrDenuncia.css': 'wwwroot/sctrDenuncia/resources/styles/mainSctrDenuncia.scss',
          "wwwroot/styles/dashboard/mainDashboard.css": "wwwroot/styles/dashboard/mainDashboard.scss",
          "wwwroot/styles/pericial/mainPericial.css": "wwwroot/styles/pericial/mainPericial.scss",
          //"wwwroot/medicalCentral/resources/styles/mainMedicalCenter.css": "wwwroot/medicalCentral/resources/styles/mainMedicalCenter.scss",
          "wwwroot/farmapfre/resources/styles/mainFarmapfre.css": "wwwroot/farmapfre/resources/styles/mainFarmapfre.scss",
          "wwwroot/styles/reembolso/mainReembolso.css": "wwwroot/styles/reembolso/mainReembolso.scss",
          "wwwroot/styles/atencionsiniestrosagricola/mainAtencionsiniestrosagricola.css": "wwwroot/styles/atencionsiniestrosagricola/mainAtencionsiniestrosagricola.scss",
          "wwwroot/styles/security/mainSecurity.css": "wwwroot/styles/security/mainSecurity.scss",
          "wwwroot/styles/actter/mainActter.css": "wwwroot/styles/actter/mainActter.scss"
        }
      }
    },
    mustache_render: {
      proxyLogin: {
        files: [
          {
            template: "proxy/templates/comunication.mustache",
            dest: "wwwroot/app/proxy/serviceLogin.js", // 'proxy/bin/serviceLogin.js' ,
            data: {
              moduleName: "oim.proxyService.Login",
              endpointName: "security",
              constantsName: "oimProxyLogin"
            }
          }
        ]
      },
      proxyPoliza: {
        files: [
          {
            template: "proxy/templates/comunication.mustache",
            dest: "wwwroot/polizas/app/proxy/servicePoliza.js", //'proxy/bin/servicePoliza.js' ,
            data: {
              moduleName: "oim.proxyService.poliza",
              endpointName: "policy",
              constantsName: "oimProxyPoliza"
            }
          }
        ]
      },
      proxyNsctr: {
        files: [
          {
            template: "proxy/templates/comunication.mustache",
            dest: "wwwroot/nsctr/app/proxy/serviceNsctr.js", //'proxy/bin/serviceNsctr.js' ,
            data: {
              moduleName: "oim.proxyService.nsctr",
              endpointName: "nsctr",
              constantsName: "oimProxyNsctr"
            }
          }
        ]
      },
      proxyCgw: {
        files: [
          {
            template: "proxy/templates/comunication.mustache",
            dest: "wwwroot/cgw/app/proxy/serviceCgw.js",
            data: {
              moduleName: "oim.proxyService.cgw",
              endpointName: "cgw",
              constantsName: "oimProxyCgw"
            }
          }
        ]
      },
      proxyGrqc: {
        files: [
          {
            template: "proxy/templates/comunication.mustache",
            dest: "wwwroot/grqc/app/proxy/serviceGrqc.js",
            data: {
              moduleName: "oim.proxyService.grqc",
              endpointName: "grqc",
              constantsName: "oimProxyGrqc"
            }
          }
        ]
      },	  	  
      proxyPowerEPS: {
        files: [
          {
            template: "proxy/templates/comunication.mustache",
            dest: "wwwroot/cgw/app/proxy/servicePowerEPS.js",
            data: {
              moduleName: "oim.proxyService.powereps",
              endpointName: "powereps",
              constantsName: "oimProxyPowerEPS"
            }
          }
        ]
      },
      proxyGcw: {
        files: [
          {
            template: "proxy/templates/comunication.mustache",
            dest: "wwwroot/gcw/app/proxy/serviceGcw.js",
            data: {
              moduleName: "oim.proxyService.gcw",
              endpointName: "gcw",
              constantsName: "oimProxyGcw"
            }
          }
        ]
      },
      proxyInspec: {
        files: [
          {
            template: "proxy/templates/comunication.mustache",
            dest: "wwwroot/inspec/app/proxy/serviceInspec.js",
            data: {
              moduleName: "oim.proxyService.inspec",
              endpointName: "inspec",
              constantsName: "oimProxyInspec"
            }
          }
        ]
      },
      proxySeguroViaje: {
        files: [
          {
            template: "proxy/templates/comunication.mustache",
            dest: "wwwroot/polizas/app/seguroviaje/proxy/serviceSeguroViaje.js",
            data: {
              moduleName: "oim.proxyService.seguroviaje",
              endpointName: "seguroviaje",
              constantsName: "oimProxySeguroViaje"
            }
          }
        ]
      },
      proxyEnel: {
        files: [
          {
            template: "proxy/templates/comunication.mustache",
            dest: "wwwroot/enel/app/proxy/serviceEnel.js",
            data: {
              moduleName: "oim.proxyService.enel",
              endpointName: "enel",
              constantsName: "oimProxyEnel"
            }
          }
        ]
      },
      proxyGPer: {
        files: [
          {
            template: "proxy/templates/comunication.mustache",
            dest: "wwwroot/pericial/app/proxy/serviceGPer.js",
            data: {
              moduleName: "oim.proxyService.gper",
              endpointName: "gper",
              constantsName: "oimProxyGPer"
            }
          }
        ]
      },
      proxySeguridad: {
        files: [
          {
            template: "proxy/templates/comunication.mustache",
            dest: "wwwroot/security/app/proxy/serviceSeguridad.js",
            data: {
              moduleName: "oim.proxyService.seguridad",
              endpointName: "seguridad",
              constantsName: "oimProxySeguridad"
            }
          }
        ]
      },
      proxyMyDream: {
        files: [
          {
            template: "proxy/templates/comunication.mustache",
            dest: "wwwroot/mydream/app/proxy/serviceMyDream.js",
            data: {
              moduleName: "oim.proxyService.mydream",
              endpointName: "mydream",
              constantsName: "oimProxyMyDream"
            }
          }
        ]
      },
      proxyRenovacion: {
        files: [
          {
            template: "proxy/templates/comunication.mustache",
            dest: "wwwroot/renovacion/app/proxy/renovacionService.js",
            data: {
              moduleName: "oim.proxyService.renovacion",
              endpointName: "renovacion",
              constantsName: "oimProxyRenovacion"
            }
          }
        ]
      },
      proxyPaymentgateway: {
        files: [
          {
            template: "proxy/templates/comunication.mustache",
            dest: "wwwroot/paymentgateway/app/proxy/servicePaymentgateway.js",
            data: {
              moduleName: "oim.proxyService.paymentgateway",
              endpointName: "paymentgateway",
              constantsName: "oimProxyPaymentgateway"
            }
          }
        ]
      },
      proxyatencionsiniestrosagricola: {
        files: [
          {
            template: "proxy/templates/comunication.mustache",
            dest: "wwwroot/atencionsiniestrosagricola/app/proxy/serviceAtencionsiniestrosagricola.js",
            data: {
              moduleName: "oim.proxyService.atencionsiniestrosagricola",
              endpointName: "atencionsiniestrosagricola",
              constantsName: "oimProxyAtencionsiniestrosagricola"
            }
          }
        ]
      },
      proxyActter: {
        files: [
          {
            template: "proxy/templates/comunication.mustache",
            dest: "wwwroot/actter/app/proxy/serviceActter.js", //'proxy/bin/serviceNsctr.js' ,
            data: {
              moduleName: "oim.proxyService.actter",
              endpointName: "actter",
              constantsName: "oimProxyActter"
            }
          }
        ]
      },
    },
    config: {
      dev: {
        options: {
          variables: {
            urlBase: 'http://api.oim.com/',
            urlRoot: 'http://api.oim.com/oim_new_login/',
            urlPolicy: 'http://api.oim.com/oim_polizas/',
            urlPolicies: {
              urlSuscripcionSalud: 'https://oim.pre.mapfre.com.pe/'
            },
            camposanto:{
              url: 'https://api.pre.mapfre.com.pe/app/death/api/v1.0/',
              username: 'app-ecampopre',
              password: '4Fmf8#$Pr3',
              token: 'YXBwLWVjYW1wb3ByZTo0Rm1mOCMkUHIz'
            }, 
            urlOrchestrator: "http://10.160.120.215/Orquestador/",
            urlNsctr: "http://api.oim.com/oim_nsctr/",
            urlCgw: "http://api.oim.com/oim_cgw/",
            urlGrqc: 'http://api.oim.com/oim_cgw/',						
            urlPowerEPS: "http://api.oim.com/powereps/",
            urlGcw: "http://10.160.120.216/oim_gcw/",
            urlEnel: "http://api.oim.com/oim_enel/",
            urlSecurity: "http://api.oim.com/oim_new_login/",
            urlWebProc: "http://api.oim.com/oim_webproc/",
            urlAdminPortal: "http://api.oim.com/oim_admportales/",
            urlCallerDash: "http://api.oim.com/oim_cdashboard/",
            urlInspec: "http://api.oim.com/oim_inspec/",
            urlRestos: "http://api.oim.com/wcfGRV/",
            urlKpissalud: "http://localhost:60067/",
            urlReferencia: "http://localhost:60067/",
            urlGPer: "http://api.oim.com/oim_gestion_pericial/",
            urlMedicalCentral: 'http://localhost:59321/',
            urlFarmapfre: 'http://localhost:59321/',
            urlSctrDenuncia: 'http://localhost:59322/',
            urlSeguridad: "http://api.oim.com/oim_seguridad/",
            urlReembolso: "http://api.oim.com/oim_CommonEps/",
            urlReembolso2: "http://api.oim.com/oim_Reembolsos/",            
			urlseguroViaje: "http://api.oim.com/oim_multirisk/",
            urlMyDream: "http://10.160.120.214/MyDream/",
            urlRenovacion:"http://10.160.120.216/oim_renovacionpoliza/",
            urlMyDreamDeploy: "http://localhost:4200",
            urlPaymentgateway: "http://10.160.120.214/paymentgateway/",
            urlReferencias: "http://localhost:60913/",
            urlAtencionsiniestrosagricola: "http://api.oim.com/oim_atencionsiniestrosagricola/",
            urlSelfServiceBase: "http://localhost:4200",
            apiWcfCWVI: 'http://spe001001-338/wcfCWVI/',
            urlActter: 'http://api.oim.com/oim_actter/',
            apiWcfCuestionario: 'http://spe001001-338/wcfCuestionario/',
            urlWsrgenerardocumento: 'https://api.pre.mapfreperu.com/internal/rrtt/wsrGeneraDocumento/rest/generaDocumento/', //MSAAVEDRA 20211113
            urlWsrRegistrarReticenciaAuto: 'https://api.pre.mapfreperu.com/internal/comun/wsrReticencia/solicitud/automatica',
            environmentName: "QA"

          }
        }
      },
      test_215: {
        options: {
          variables: {
            urlBase: 'http://10.160.120.215/',
            urlRoot: "http://10.160.120.215/oim_new_login/",
            urlPolicy: "http://10.160.120.215/oim_polizas/",
            urlPolicies: {
              urlSuscripcionSalud: 'http://10.160.120.215/'
            },
            camposanto: {
              url: 'https://api.pre.mapfre.com.pe/app/death/api/v1.0/',
              username: 'app-ecampopre',
              password: '4Fmf8#$Pr3',
              token: 'YXBwLWVjYW1wb3ByZTo0Rm1mOCMkUHIz'
            },
            urlOrchestrator: "http://10.160.120.215/Orquestador/",
            urlNsctr: "http://10.160.120.216/oim_nsctr/",
            urlCgw: "http://10.160.120.214/oim_cgw/",
            urlGrqc: "http://10.160.120.215/oim_cgw/",						
            urlPowerEPS: "http://10.160.120.215/powereps/",
            urlGcw: "http://10.160.120.215/oim_gcw/",
            urlEnel: "http://10.160.120.215/oim_enel/",
            urlSecurity: "http://10.160.120.215/oim_new_login/",
            urlWebProc: "http://10.160.120.215/oim_webproc/",
            urlAdminPortal: "http://10.160.120.215/oim_admportales/",
            urlCallerDash: "http://10.160.120.215/oim_cdashboard/",
            urlInspec: "http://10.160.120.215/oim_inspec/",
            urlRestos: "http://10.160.120.215/wcfGRV/",
            urlKpissalud: "http://10.160.120.214/oim_kpissalud/",
            urlReferencia: "http://10.160.120.215/oim_referencia/",
            urlGPer: "http://10.160.120.215/oim_gestion_pericial/",
            urlMedicalCentral: "http://10.160.120.215/oim_wdrog/",
            urlFarmapfre: "http://10.160.120.215/oim_farmapfre/",
            urlSctrDenuncia: 'http://10.160.120.214/oim_sctr_denuncias/',
            urlReembolso: "http://10.160.120.214/oim_CommonEps/",
            urlReembolso2: "http://10.160.120.214/oim_Reembolsos/",
            urlSeguridad: "http://10.160.120.215/oim_seguridad/",
            urlseguroViaje: "http://10.160.120.216/oim_multirisk/",
            urlMyDream: "http://10.160.120.214/MyDream/",
            urlRenovacion:"http://10.160.120.215/oim_renovacionpoliza/",
            urlMyDreamDeploy: "https://mydream.pre.mapfre.com.pe/",
            urlPaymentgateway: "http://10.160.120.214/paymentgateway/",
            urlReferencias: "http://10.160.120.214/oim_referencias/",
            urlAtencionsiniestrosagricola: "http://10.160.120.216/AtencionSiniestrosAgricola/",
            urlSelfServiceBase: "https://portal.pre.mapfre.com.pe/",
            apiWcfCWVI: 'http://spe001001-338/wcfCWVI/',
            urlActter: 'http://10.160.120.215/oim_actter/',
            apiWcfCuestionario: 'http://spe001001-338/wcfCuestionario/',
            urlWsrgenerardocumento: 'https://api.pre.mapfreperu.com/internal/rrtt/wsrGeneraDocumento/rest/generaDocumento/', //MSAAVEDRA 20211113
            urlWsrRegistrarReticenciaAuto: 'https://api.pre.mapfreperu.com/internal/comun/wsrReticencia/solicitud/automatica',
            environmentName: "QA"
          }
        }
      },
      test_216: {
        options: {
          variables: {
            urlBase: 'http://10.160.120.216/',
            urlRoot: "http://10.160.120.216/oim_new_login/",
            urlPolicy: "http://10.160.120.216/oim_polizas/",
            urlPolicies: {
              urlSuscripcionSalud: 'http://10.160.120.216/'
            },
            camposanto: {
              url: 'https://api.pre.mapfre.com.pe/app/death/api/v1.0/',
              username: 'app-ecampopre',
              password: '4Fmf8#$Pr3',
              token: 'YXBwLWVjYW1wb3ByZTo0Rm1mOCMkUHIz'
            },
            urlOrchestrator: "http://10.160.120.216/Orquestador/",
            urlNsctr: "http://10.160.120.216/oim_nsctr/",
            urlCgw: "http://10.160.120.214/oim_cgw/",
            urlGrqc: "http://10.160.120.216/oim_cgw/",				
            urlPowerEPS: "http://10.160.120.216/powereps/",
            urlGcw: "http://10.160.120.216/oim_gcw/",
            urlEnel: "http://10.160.120.216/oim_enel/",
            urlSecurity: "http://10.160.120.216/oim_new_login/",
            urlWebProc: "http://10.160.120.216/oim_webproc/",
            urlAdminPortal: "http://10.160.120.216/oim_admportales/",
            urlCallerDash: "http://10.160.120.216/oim_cdashboard/",
            urlInspec: "http://10.160.120.216/oim_inspec/",
            urlRestos: "http://10.160.120.216/wcfGRV/",
            urlKpissalud: "http://10.160.120.213/oim_kpissalud/",
            urlReferencia: "http://10.160.120.216/oim_referencia/",
            urlGPer: "http://10.160.120.216/oim_gestion_pericial/",
            urlMedicalCentral: "http://10.160.120.213/oim_wdrog/",
            urlFarmapfre: "http://10.160.120.216/oim_farmapfre/",
            urlSctrDenuncia: 'http://10.160.120.213/oim_sctr_denuncias/',
            urlReembolso: "http://10.160.120.216/oim_CommonEps/",
            urlReembolso2: "http://10.160.120.216/oim_Reembolsos/",
            urlSeguridad: "http://10.160.120.216/oim_seguridad/",
            urlseguroViaje: "http://10.160.120.216/oim_multirisk/",
            urlMyDream: "http://10.160.120.214/MyDream/",
            urlMyDreamDeploy: "https://mydream.pre.mapfre.com.pe/",
            urlRenovacion:"http://10.160.120.216/oim_renovacionpoliza/",
            urlPaymentgateway: "http://10.160.120.214/paymentgateway/",
            urlReferencias: "http://10.160.120.213/oim_referencias/",
            urlAtencionsiniestrosagricola: "http://10.160.120.216/AtencionSiniestrosAgricola/",
            urlSelfServiceBase: "https://portal.pre.mapfre.com.pe/",
            apiWcfCWVI: 'http://10.160.120.216/wcfCWVI/',
            apiWcfCuestionario: 'http://10.160.120.216/wcfCuestionario/',
            urlWsrgenerardocumento: 'https://api.pre.mapfreperu.com/internal/rrtt/wsrGeneraDocumento/rest/generaDocumento/', //MSAAVEDRA 20211113
            urlWsrRegistrarReticenciaAuto: 'https://api.pre.mapfreperu.com/internal/comun/wsrReticencia/solicitud/automatica',
            urlActter: 'http://10.160.120.216/oim_actter/',
            environmentName: "QA"
          }
        }
      },
      int: {
        options: {
          variables: {
            urlBase: 'https://oim-int.pre.mapfre.com.pe/',
            urlRoot: 'https://oim-int.pre.mapfre.com.pe/oim_new_login/',
            urlPolicy: 'https://oim-int.pre.mapfre.com.pe/oim_polizas/',
            apiWcfSuscripciones: 'https://oim-int.pre.mapfre.com.pe/wcfSuscripciones/',
            camposanto: {
              url: 'https://api.pre.mapfre.com.pe/app/death/api/v1.0/',
              username: 'app-ecampopre',
              password: '4Fmf8#$Pr3',
              token: 'YXBwLWVjYW1wb3ByZTo0Rm1mOCMkUHIz'
            },
            urlOrchestrator: 'https://oim-int.pre.mapfre.com.pe/Orquestador/',
            urlNsctr: 'https://oim-int.pre.mapfre.com.pe/oim_nsctr/',
            urlCgw: 'https://oim-int.pre.mapfre.com.pe/oim_cgw/',
            urlGrqc: 'https://oim-int.pre.mapfre.com.pe/oim_cgw/',
			      urlPowerEPS: "https://oim-int.pre.mapfre.com.pe/powereps/",
            urlGcw: 'https://oim-int.pre.mapfre.com.pe/oim_gcw/',
			      urlEnel: "https://oim-int.pre.mapfre.com.pe/oim_enel/",
            urlSecurity: 'https://oim-int.pre.mapfre.com.pe/oim_new_login/',
            urlWebProc: 'https://oim-int.pre.mapfre.com.pe/oim_webproc/',
            urlAdminPortal: 'https://oim-int.pre.mapfre.com.pe/oim_admportales/',
			      urlCallerDash: "https://oim-int.pre.mapfre.com.pe/oim_cdashboard/",
            urlInspec: 'https://oim-int.pre.mapfre.com.pe/oim_inspec/',
            urlRestos: 'https://oim-int.pre.mapfre.com.pe/wcfGRV/',
            urlKpissalud: 'https://oim-int.pre.mapfre.com.pe/oim_kpissalud/',
            urlReferencia: 'https://oim-int.pre.mapfre.com.pe/oim_referencia/',
            urlGPer: 'https://oim-int.pre.mapfre.com.pe/oim_gestion_pericial/',
            urlMedicalCentral: 'https://oim-int.pre.mapfre.com.pe/oim_wdrog/',
            urlFarmapfre: 'https://oim-int.pre.mapfre.com.pe/oim_farmapfre/',
            urlSctrDenuncia: 'https://oim-int.pre.mapfre.com.pe/oim_sctr_denuncias/',
            urlReembolso: 'https://oim-int.pre.mapfre.com.pe/oim_commoneps/',
            urlReembolso2: 'https://oim-int.pre.mapfre.com.pe/oim_reembolsos/',
            urlSeguridad: 'https://oim-int.pre.mapfre.com.pe/oim_seguridad/',
            urlseguroViaje: 'https://oim-int.pre.mapfre.com.pe/oim_multirisk/',
            urlMyDream: 'https://oim-int.pre.mapfre.com.pe/MyDream/',
            urlMyDreamDeploy: 'https://mydream-int.pre.mapfre.com.pe/',
            urlPaymentgateway: 'https://oim-int.pre.mapfre.com.pe/paymentgateway/',
            urlReferencias: 'https://oim-int.pre.mapfre.com.pe/oim_referencias/',
            urlAtencionsiniestrosagricola: 'https://oim-int.pre.mapfre.com.pe/AtencionSiniestrosAgricola/',
            urlSelfServiceBase: 'https://portal-int.pre.mapfre.com.pe/',
			      urlCamposanto: 'https://api-int.pre.mapfreperu.com/internal/novida/wscamposanto/',
            apiWcfCWVI: 'https://oim-int.pre.mapfre.com.pe/wcfCWVI/',
            apiWcfCuestionario: 'https://oim-int.pre.mapfre.com.pe/wcfCuestionario/',
            urlWsrgenerardocumento: 'https://api-int.pre.mapfreperu.com/internal/rrtt/wsrGeneraDocumento/rest/generaDocumento/',
            urlActter: 'https://oim-int.pre.mapfre.com.pe/oim_actter/',
			      urlRenovacion: 'https://oim-int.pre.mapfre.com.pe/oim_renovacionpoliza/',
            environmentName: 'QA'
          }
        }
      },       
      pre: {
        options: {
          variables: {
            urlBase: 'https://oim.pre.mapfre.com.pe/',
            urlRoot: "https://oim.pre.mapfre.com.pe/oim_new_login/",
            urlPolicy: "https://oim.pre.mapfre.com.pe/oim_polizas/",
            urlPolicies: {
              urlSuscripcionSalud: 'https://oim.pre.mapfre.com.pe/' // URL Suscripciones en prueba
            },
            camposanto: {
              url: 'https://api.pre.mapfre.com.pe/app/death/api/v1.0/',
              username: 'app-ecampopre',
              password: '4Fmf8#$Pr3',
              token: 'YXBwLWVjYW1wb3ByZTo0Rm1mOCMkUHIz'
            },
            urlOrchestrator: "https://oim.pre.mapfre.com.pe/Orquestador/",
            urlNsctr: "https://oim.pre.mapfre.com.pe/oim_nsctr/",
            urlCgw: "https://oim.pre.mapfre.com.pe/oim_cgw/",
            urlGrqc: "https://oim.pre.mapfre.com.pe/oim_cgw/",
            urlPowerEPS: "https://oim.pre.mapfre.com.pe/powereps/",
            urlGcw: "https://oim.pre.mapfre.com.pe/oim_gcw/",
            urlEnel: "https://oim.pre.mapfre.com.pe/oim_enel/",
            urlSecurity: "https://oim.pre.mapfre.com.pe/oim_new_login/",
            urlWebProc: "https://oim.pre.mapfre.com.pe/oim_webproc/",
            urlAdminPortal: "https://oim.pre.mapfre.com.pe/oim_admportales/",
            urlCallerDash: "https://oim.pre.mapfre.com.pe/oim_cdashboard/",
            urlInspec: "https://oim.pre.mapfre.com.pe/oim_inspec/",
            urlRestos: "https://oim.pre.mapfre.com.pe/wcfGRV/",
            urlKpissalud: "https://oim.pre.mapfre.com.pe/oim_kpissalud/",
            urlReferencia: "https://oim.pre.mapfre.com.pe/oim_referencia/",
            urlGPer: "https://oim.pre.mapfre.com.pe/oim_gestion_pericial/",
            urlMedicalCentral: "https://oim.pre.mapfre.com.pe/oim_wdrog/",
            urlFarmapfre: "https://oim.pre.mapfre.com.pe/oim_farmapfre/",
            urlSctrDenuncia: 'https://oim.pre.mapfre.com.pe/oim_sctr_denuncias/',
            urlReembolso: "https://oim.pre.mapfre.com.pe/oim_CommonEps/",
            urlReembolso2: "https://oim.pre.mapfre.com.pe/oim_Reembolsos/",
            urlSeguridad: "https://oim.pre.mapfre.com.pe/oim_seguridad/",
            urlseguroViaje: "https://oim.pre.mapfre.com.pe/oim_multirisk/",
            urlMyDream: "https://oim.pre.mapfre.com.pe/MyDream/",
            urlMyDreamDeploy: "https://mydream.pre.mapfre.com.pe/",
            urlPaymentgateway: "https://oim.pre.mapfre.com.pe/paymentgateway/",
            urlReferencias: "https://oim.pre.mapfre.com.pe/oim_referencias/",
            urlAtencionsiniestrosagricola: "https://oim.pre.mapfre.com.pe/AtencionSiniestrosAgricola/",
            urlSelfServiceBase: "https://portal.pre.mapfre.com.pe/",
            urlCamposanto: 'https://api.pre.mapfreperu.com/internal/novida/wscamposanto/',
            apiWcfCWVI: 'https://oim.pre.mapfre.com.pe/wcfCWVI/',
            apiWcfCuestionario: 'https://oim.pre.mapfre.com.pe/wcfCuestionario/',
            urlWsrgenerardocumento: 'https://api.pre.mapfreperu.com/internal/rrtt/wsrGeneraDocumento/rest/generaDocumento/', //MSAAVEDRA 20211113
            urlWsrRegistrarReticenciaAuto: 'https://api.pre.mapfreperu.com/internal/comun/wsrReticencia/solicitud/automatica',
            urlActter: 'https://oim.pre.mapfre.com.pe/oim_actter/',
            urlRenovacion: 'https://oim.pre.mapfre.com.pe/oim_renovacionpoliza/',
            environmentName: "QA"
          }
        }
      },
      prod: {
        options: {
          variables: {
            urlBase: 'https://oim.mapfre.com.pe/',
            urlMyDream: "https://oim.mapfre.com.pe/MyDream/",
            urlRoot: 'https://oim.mapfre.com.pe/oim_new_login/',
            urlPolicy: 'https://oim.mapfre.com.pe/oim_polizas/',
            urlPolicies: {
              urlSuscripcionSalud: 'https://oim.mapfre.com.pe/',
            },
            camposanto: {
              url: 'https://api.mapfre.com.pe/app/death/api/v1.0/',
              username: 'app-ecampo',
              password: 'wJf$2k91P0',
              token: 'YXBwLWVjYW1wbzp3SmYkMms5MVAw'
            },
            urlOrchestrator: "https://oim.mapfre.com.pe/Orquestador/",
            urlNsctr: "https://oim.mapfre.com.pe/oim_nsctr/",
            urlCgw: "https://oim.mapfre.com.pe/oim_cgw/",
            urlGrqc: "https://oim.mapfre.com.pe/oim_cgw/",					
            urlPowerEPS: "https://oim.mapfre.com.pe/powereps/",
            urlGcw: "https://oim.mapfre.com.pe/oim_gcw/",
            urlEnel: "https://oim.mapfre.com.pe/oim_enel/",
            urlSecurity: "https://oim.mapfre.com.pe/oim_new_login/",
            urlWebProc: "https://oim.mapfre.com.pe/oim_webproc/",
            urlAdminPortal: "https://oim.mapfre.com.pe/oim_admportales/",
            urlSeguridad: "https://oim.mapfre.com.pe/oim_seguridad/",
            urlCallerDash: "https://oim.mapfre.com.pe/oim_cdashboard/",
            urlInspec: "https://oim.mapfre.com.pe/oim_inspec/",
            urlRestos: "https://oim.mapfre.com.pe/wcfGRV/",
            urlKpissalud: "https://oim.mapfre.com.pe/oim_kpissalud/",
            urlReferencia: "https://oim.mapfre.com.pe/oim_referencia/",
            urlGPer: "https://oim.mapfre.com.pe/oim_gestion_pericial/",
            urlMedicalCentral: "https://oim.mapfre.com.pe/oim_wdrog/",
            urlFarmapfre: "https://oim.mapfre.com.pe/oim_farmapfre/",
            urlSctrDenuncia: 'https://oim.mapfre.com.pe/oim_sctr_denuncias/',
            urlseguroViaje: "https://oim.mapfre.com.pe/oim_multirisk/",
            urlReembolso: "https://oim.mapfre.com.pe/oim_commoneps/",
            urlReembolso2: "https://oim.mapfre.com.pe/oim_reembolsos/",
            urlRenovacion:"https://oim.mapfre.com.pe/oim_renovacionpoliza/",
            urlMyDreamDeploy: "https://mydream.mapfre.com.pe/",
            urlPaymentgateway: "https://oim.mapfre.com.pe/paymentgateway/",
            urlReferencias: "https://oim.mapfre.com.pe/oim_referencias/",
            urlAtencionsiniestrosagricola: "https://oim.mapfre.com.pe/AtencionSiniestrosAgricola/",
            urlSelfServiceBase: "https://portal.mapfre.com.pe/",
            apiWcfCWVI: 'https://oim.mapfre.com.pe/wcfCWVI/',
            urlActter: 'https://oim.mapfre.com.pe/oim_actter/',
            apiWcfCuestionario: 'https://oim.mapfre.com.pe/wcfCuestionario/',
            urlWsrgenerardocumento: 'https://api.pre.mapfreperu.com/internal/rrtt/wsrGeneraDocumento/rest/generaDocumento/', //MSAAVEDRA 20211113
            urlWsrRegistrarReticenciaAuto: 'https://api.mapfreperu.com/internal/comun/wsrReticencia/solicitud/automatica',
            environmentName: "PROD"
          }
        }
      }
    },
    replace: {
      dist: {
        options: {
          variables: {
            urlBase: '<%= grunt.config.get("urlBase") %>',
            urlRoot: '<%= grunt.config.get("urlRoot") %>',
            urlPolicy: '<%= grunt.config.get("urlPolicy") %>',
            urlRenovacion: '<%= grunt.config.get("urlRenovacion") %>',
            urlPolicies: {
              urlSuscripcionSalud: '<%= grunt.config.get("urlPolicies.urlSuscripcionSalud") %>'
            },
            camposanto: {
              url: '<%= grunt.config.get("camposanto.url") %>',
              username: '<%= grunt.config.get("camposanto.username") %>',
              password: '<%= grunt.config.get("camposanto.password") %>',
              token: '<%= grunt.config.get("camposanto.token") %>'
            },
            urlOrchestrator: '<%= grunt.config.get("urlOrchestrator") %>',
            urlNsctr: '<%= grunt.config.get("urlNsctr") %>',
            urlCgw: '<%= grunt.config.get("urlCgw") %>',
            urlGrqc: '<%= grunt.config.get("urlGrqc") %>',					
            urlPowerEPS: '<%= grunt.config.get("urlPowerEPS") %>',
            urlGcw: '<%= grunt.config.get("urlGcw") %>',
            urlEnel: '<%= grunt.config.get("urlEnel") %>',
            urlWebProc: '<%= grunt.config.get("urlWebProc") %>',
            urlAdminPortal: '<%= grunt.config.get("urlAdminPortal") %>',
            urlSeguridad: '<%= grunt.config.get("urlSeguridad") %>',
            urlCallerDash: '<%= grunt.config.get("urlCallerDash") %>',
            urlInspec: '<%= grunt.config.get("urlInspec") %>',
            urlReferencias: '<%= grunt.config.get("urlReferencias") %>',
            urlSecurity: '<%= grunt.config.get("urlSecurity") %>',
            environmentName: '<%= grunt.config.get("environmentName") %>',
            urlRestos: '<%= grunt.config.get("urlRestos") %>',
            urlKpissalud: '<%= grunt.config.get("urlKpissalud") %>',
            urlReferencia: '<%= grunt.config.get("urlReferencia") %>',
            urlGPer: '<%= grunt.config.get("urlGPer") %>',
            urlMedicalCenter: '<%= grunt.config.get("urlMedicalCentral") %>',
            urlReembolso: '<%= grunt.config.get("urlReembolso") %>',
            urlReembolso2: '<%= grunt.config.get("urlReembolso2") %>',
            urlFarmapfre: '<%= grunt.config.get("urlFarmapfre") %>',
            urlSctrDenuncia: '<%= grunt.config.get("urlSctrDenuncia") %>',
            urlseguroViaje: '<%= grunt.config.get("urlseguroViaje") %>',
            urlMyDream: '<%= grunt.config.get("urlMyDream") %>',
            urlMyDreamDeploy: '<%= grunt.config.get("urlMyDreamDeploy") %>',
            urlPaymentgateway: '<%= grunt.config.get("urlPaymentgateway") %>',
            urlAtencionsiniestrosagricola: '<%= grunt.config.get("urlAtencionsiniestrosagricola") %>',
            urlSelfServiceBase: '<%= grunt.config.get("urlSelfServiceBase") %>',
            apiWcfCWVI: '<%= grunt.config.get("apiWcfCWVI") %>',
            urlActter: '<%= grunt.config.get("urlActter") %>',
            apiWcfCuestionario: '<%= grunt.config.get("apiWcfCuestionario") %>',
            urlWsrgenerardocumento: '<%= grunt.config.get("urlWsrgenerardocumento") %>', //MSAAVEDRA 20211113
            urlWsrRegistrarReticenciaAuto: '<%= grunt.config.get("urlWsrRegistrarReticenciaAuto") %>'
          },
          force: true
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ["build/constants.js"],
            dest: "wwwroot/scripts"
          }
        ]
      }
    },
    sonarRunner: {
      analysis: {
        options: {
          debug: true,
          separator: "\n",
          sonar: {
            host: {
              url: "http://localhost:9000"
            },
            jdbc: {
              url: "jdbc:mysql://localhost:3306/sonar",
              username: "sonar",
              password: "sonar"
            },
            projectKey: "sonar:grunt-sonar-runner:0.1.0",
            projectName: "Grunt Sonar Runner",
            projectVersion: "1.0",
            sources: ["test"].join(","),
            language: "js",
            sourceEncoding: "UTF-8"
          }
        }
      }
    },

    /*BUILD TO PROD*/
    clean: {
      dist: {
        files: [
          {
            dot: true, // remove .dot files
            src: [
              "<%= oim.dist %>/*",
              "!<%= oim.dist %>/.git*" // NOt remove files git
            ]
          }
        ]
      }
    },
    uglify: {
      dist: {
        options: {
          except: ["<%= oim.path %>/scripts/b_components/*", "<%= oim.path %>/referencia"],
          mangle: false
        },
        files: [
          {
            expand: true,
            src: [
              "<%= oim.path %>/**/*.js",
              "!<%= oim.path %>/scripts/b_components/**/*",
              "!<%= oim.path %>/referencia/**/*.js",
              // "<%= oim.path %>/nsctr/**/*.js",
              "!<%= oim.path %>/**/node_modules/**/*.js"
            ],
            dest: "<%= oim.dist %>"
          },
          {
            expand: true,
            src: [
              "<%= oim.path %>/scripts/b_components/satellizer/dist/satellizer.js",
              "<%= oim.path %>/scripts/b_components/angular-route/angular-route.min.js",
              "<%= oim.path %>/scripts/b_components/angular-ui-router/release/angular-ui-router.min.js",
              "<%= oim.path %>/scripts/b_components/angular-animate/angular-animate.min.js",
              "<%= oim.path %>/scripts/b_components/angular-sanitize/angular-sanitize.min.js",
              "<%= oim.path %>/scripts/b_components/angular-cookies/angular-cookies.min.js",
              "<%= oim.path %>/scripts/b_components/oclazyload/dist/ocLazyLoad.require.min.js",
              "<%= oim.path %>/scripts/b_components/angular-messages/angular-messages.min.js",
              "<%= oim.path %>/scripts/b_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
              "<%= oim.path %>/scripts/b_components/jquery/dist/jquery.min.js",
              "<%= oim.path %>/scripts/b_components/skylo/vendor/scripts/skylo.js",
              "<%= oim.path %>/scripts/b_components/lodash/dist/lodash.compat.min.js",
              "<%= oim.path %>/scripts/b_components/fullcalendar/dist/fullcalendar.min.js",
              "<%= oim.path %>/scripts/b_components/fullcalendar/dist/locale/es.js",
              "<%= oim.path %>/scripts/b_components/moment/min/moment.min.js",
              "<%= oim.path %>/scripts/b_components/underscore/underscore-min.js",
              "<%= oim.path %>/scripts/b_components/raven-js/dist/angular/raven.min.js",
              "<%= oim.path %>/scripts/b_components/jinqJs/jinqjs.min.js",
              "<%= oim.path %>/scripts/b_components/sweetalert2/dist/sweetalert2.min.js",
              "<%= oim.path %>/scripts/b_components/es6-promise/es6-promise.min.js",
              "<%= oim.path %>/scripts/b_components/angular-i18n/angular-locale_es-pe.js",
              "<%= oim.path %>/scripts/b_components/angular-ui-mask/dist/mask.js",
              "<%= oim.path %>/scripts/b_components/requirejs/require.js",
              "<%= oim.path %>/scripts/b_components/redux/index.js",
              "<%= oim.path %>/scripts/b_components/ng-redux/dist/ng-redux.min.js",
              "<%= oim.path %>/scripts/b_components/checklist-model/checklist-model.js",
              "<%= oim.path %>/scripts/b_components/angular-local-storage/dist/angular-local-storage.min.js",
              "<%= oim.path %>/scripts/b_components/angular-base64-upload/dist/angular-base64-upload.min.js",
              "<%= oim.path %>/scripts/b_components/angular-chart.js/dist/angular-chart.min.js",
              "<%= oim.path %>/scripts/b_components/angular-chart.js/dist/angular-chart.js",
              "<%= oim.path %>/scripts/b_components/chartjs/dist/Chart.js",
              "<%= oim.path %>/scripts/b_components/chart.js/dist/Chart.js",
              "<%= oim.path %>/scripts/b_components/chartjs/dist/Chart.bundle.js",
              "<%= oim.path %>/scripts/b_components/chart.js/dist/Chart.bundle.js",
              "<%= oim.path %>/scripts/b_components/cropperjs/dist/cropper.min.js",
              "<%= oim.path %>/scripts/b_components/cropperjs/dist/cropper.common.js",
              "<%= oim.path %>/scripts/b_components/crypto-js/*.js",
              "<%= oim.path %>/scripts/quill/*.js"
            ],
            dest: "<%= oim.dist %>"
          }
        ]
      },
      dev: {
        options: {
          mangle: false
        },
        files: [
          {
            expand: true,
            src: [moduloToUglify, "!<%= oim.path %>/**/node_modules/**/*.js"],
            dest: "<%= oim.dist %>"
          }
        ]
      }
    },
    htmlmin: {
      dist: {
        options: {
          // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: [
          {
            expand: true,
            src: [
              "<%= oim.path %>/**/*.html",
              "!<%= oim.path %>/**/node_modules/**/*",
              "!<%= oim.path %>/scripts/b_components/**/*.html",
              "!<%= oim.path %>/scripts/mpf-main-controls/html/*.html",
              "!<%= oim.path %>/kpissalud/**/*.html",
              "!<%= oim.path %>/referencia/**/*.html",
              "!<%= oim.path %>/medicalCentral/**/*.html",
              "!<%= oim.path %>/farmapfre/**/*.html",
              "!<%= oim.path %>/sctrDenuncia/**/*.html",
              "!<%= oim.path %>/atencionsiniestrosagricola/**/*.html"
              // "!<%= oim.path %>/inspec/**/*.html"
              // "!<%= oim.path %>/nsctr/**/*.html"
            ],
            ext: ".html",
            extDot: "last",
            dest: "<%= oim.dist %>"
          },
          {
            expand: true,
            src: ["<%= oim.path %>/medicalCentral/index.html", "<%= oim.path %>/farmapfre/index.html", "<%= oim.path %>/atencionsiniestrosagricola/index.html", "<%= oim.path %>/referencias/index.html", "<%= oim.path %>/sctrDenuncia/index.html"],
            ext: ".html",
            extDot: "last",
            dest: "<%= oim.dist %>"
          }
        ]
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            src: ["<%= oim.path %>/images/**/*.*", "<%= oim.path %>/fonts/*.*"],
            dest: "<%= oim.dist %>"
          },
          {
            expand: true,
            src: [
              "<%= oim.path %>/fonts/**/*.*",
              "<%= oim.path %>/scripts/b_components/angular/angular.min.js",
              "<%= oim.path %>/scripts/b_components/angular-recaptcha/release/angular-recaptcha.js",
              "<%= oim.path %>/scripts/gaiafrontend/css/bootstrap.css",
              "<%= oim.path %>/scripts/b_components/skylo/vendor/styles/skylo.css",
              "<%= oim.path %>/scripts/b_components/sweetalert2/dist/sweetalert2.css",
              "<%= oim.path %>/scripts/b_components/fullcalendar/dist/fullcalendar.css",
              "<%= oim.path %>/scripts/b_components/angular-ui-select/dist/select.min.css",
              "<%= oim.path %>/scripts/b_components/select2/select2.css",
              "<%= oim.path %>/scripts/b_components/select2/select2.png",
              "<%= oim.path %>/scripts/b_components/select2/select2-spinner.gif",
              "<%= oim.path %>/scripts/b_components/select2/select2x2.png",
              "<%= oim.path %>/scripts/b_components/cropperjs/dist/cropper.min.css",
              "<%= oim.path %>/scripts/gaiafrontend/font/*.*",
              "<%= oim.path %>/scripts/b_components/crypto-js/*.*",
              "<%= oim.path %>/scripts/quill/*.*",
              "<%= oim.path %>/scripts/b_components/angular-ui-tree/dist/*.*",

              "<%= oim.path %>/security/components/angular-ui-tree/dist/angular-ui-tree.css",
              "<%= oim.path %>/styles/**/*.css",
              "<%= oim.path %>/medicalCentral/resources/**/*.css",
              "<%= oim.path %>/medicalCentral/resources/scripts/vendor/**/*.*",
              "<%= oim.path %>/medicalCentral/fonts/**/*.*",

              "<%= oim.path %>/kpissalud/resources/image/*.*",
              "<%= oim.path %>/kpissalud/resources/**/*.css",
              "<%= oim.path %>/kpissalud/resources/scripts/vendor/**/*.*",
              "<%= oim.path %>/kpissalud/fonts/**/*.*",
              "<%= oim.path %>/kpissalud/app/**/*.*",

              "<%= oim.path %>/farmapfre/resources/image/*.*",
              "<%= oim.path %>/farmapfre/resources/**/*.css",
              "<%= oim.path %>/farmapfre/resources/scripts/vendor/**/*.*",
              "<%= oim.path %>/farmapfre/fonts/**/*.*",

              "<%= oim.path %>/sctrDenuncia/resources/image/*.*",
              "<%= oim.path %>/sctrDenuncia/resources/**/*.css",
              "<%= oim.path %>/sctrDenuncia/resources/scripts/vendor/**/*.*",
              "<%= oim.path %>/sctrDenuncia/fonts/**/*.*",

              "<%= oim.path %>/atencionsiniestrosagricola/resources/image/*.*",
              "<%= oim.path %>/atencionsiniestrosagricola/resources/**/*.css",
              "<%= oim.path %>/atencionsiniestrosagricola/resources/scripts/vendor/**/*.*",
              "<%= oim.path %>/atencionsiniestrosagricola/fonts/**/*.*",
              "<%= oim.path %>/atencionsiniestrosagricola/resources/files/*.xlsx",              

              // "<%= oim.path %>/styles/main.css",
              "<%= oim.path %>/polizas/*.png",
              "<%= oim.path %>/polizas/*.ico",
              "<%= oim.path %>/polizas/app/assets/vida-ley/*.xls",
              "<%= oim.path %>/polizas/app/assets/rrgg/*.xls",
              "<%= oim.path %>/inspec/app/uploads/*",

              "<%= oim.path %>/styles/mainEnel.css",
              "<%= oim.path %>/enel/*.png",
              "<%= oim.path %>/enel/*.ico",

              "<%= oim.path %>/referencia/app/**/*.*",
              "<%= oim.path %>/referencia/assets/**/*.*",
              "<%= oim.path %>/referencia/styles/**/*.*",
              "<%= oim.path %>/referencia/scripts/**/*.js",
              "<%= oim.path %>/referencia/scripts/angular-mighty-datepicker/build/*.css",
              "<%= oim.path %>/referencia/index.html",

              "<%= oim.path %>/referencias/assets/**/*.*",
              "<%= oim.path %>/referencias/assets/fonts/**/*.*",
              "<%= oim.path %>/referencias/resources/scripts/vendor/**/*.*",

              "<%= oim.path %>/styles/dashboard/mainDashboard.css",
              "<%= oim.path %>/callerDashboard/*.png",
              "<%= oim.path %>/callerDashboard/*.ico",
              "<%= oim.path %>/callerDashboard/*.mp3",

              "<%= oim.path %>/admin-portal/**/*.{ico,jpg,png}",
              "<%= oim.path %>/admin-portal/fonts/**/*.*",
              "<%= oim.path %>/admin-portal/styles/*.css",
              "!<%= oim.path %>/**/node_modules/**/*"
            ],
            dest: "<%= oim.dist %>"
          }
        ]
      }
    },
    /*BUILD TO PROD*/
    "file-creator": {
      templateprebuild: {}
    },
    ngtemplates: {
      directives: {
        src: "<%= oim.path %>/scripts/mpf-main-controls/**/*.html",
        dest: "<%= oim.path %>/scripts/mpf-main-controls/html/templates.js",
        ngModuleName: "oim.directives.templates"
      },
      login: {
        src: ["<%= oim.path %>/login/**/*.html", "!<%= oim.path %>/login/index.html"],
        dest: "<%= oim.path %>/login/loginTemplates.js",
        ngModuleName: "oim.login.templates"
      },
      appHome: {
        src: ["<%= oim.path %>/app/**/*.html"],
        dest: "<%= oim.path %>/app/homeTemplates.js",
        ngModuleName: "oim.home.templates"
      },
      poliza_accidentes: {
        src: ["<%= oim.path %>/polizas/app/accidentes/**/*.html"],
        dest: "<%= oim.path %>/polizas/app/accidentes/accidentesTemplates.js",
        ngModuleName: "oim.polizas.accidentes"
      },
      poliza_autos: {
        src: ["<%= oim.path %>/polizas/app/autos/**/*.html"],
        dest: "<%= oim.path %>/polizas/app/autos/autosTemplates.js",
        ngModuleName: "oim.polizas.autos"
      },
      poliza_cartas: {
        src: ["<%= oim.path %>/polizas/app/cartas/**/*.html"],
        dest: "<%= oim.path %>/polizas/app/cartas/cartasTemplates.js",
        ngModuleName: "oim.polizas.cartas"
      },
      poliza_documentos: {
        src: ["<%= oim.path %>/polizas/app/documentos/**/*.html"],
        dest: "<%= oim.path %>/polizas/app/documentos/documentosTemplates.js",
        ngModuleName: "oim.polizas.documentos"
      },
      poliza_empresa: {
        src: ["<%= oim.path %>/polizas/app/empresa/**/*.html"],
        dest: "<%= oim.path %>/polizas/app/empresa/empresaTemplates.js",
        ngModuleName: "oim.polizas.empresa"
      },
      poliza_hogar: {
        src: ["<%= oim.path %>/polizas/app/hogar/**/*.html"],
        dest: "<%= oim.path %>/polizas/app/hogar/hogarTemplates.js",
        ngModuleName: "oim.polizas.hogar"
      },
      poliza_sctr: {
        src: ["<%= oim.path %>/polizas/app/sctr/**/*.html"],
        dest: "<%= oim.path %>/polizas/app/sctr/sctrTemplates.js",
        ngModuleName: "oim.polizas.sctr"
      },
      poliza_soat: {
        src: ["<%= oim.path %>/polizas/app/soat/**/*.html"],
        dest: "<%= oim.path %>/polizas/app/soat/soatTemplates.js",
        ngModuleName: "oim.polizas.soat"
      },
      poliza_transporte: {
        src: ["<%= oim.path %>/polizas/app/transportes/**/*.html"],
        dest: "<%= oim.path %>/polizas/app/transportes/transporteTemplates.js",
        ngModuleName: "oim.polizas.transporte"
      },
      poliza_vida: {
        src: ["<%= oim.path %>/polizas/app/vida/**/*.html"],
        dest: "<%= oim.path %>/polizas/app/vida/vidaTemplates.js",
        ngModuleName: "oim.polizas.vida"
      },
      poliza_vidaLey: {
        src: ["<%= oim.path %>/polizas/app/vida-ley/**/*.html"],
        dest: "<%= oim.path %>/polizas/app/vida-ley/vida-ley.templates.js",
        ngModuleName: "oim.polizas.vidaLey"
      },
      kpissalud: {
        src: ["<%= oim.path %>/kpissalud/app/**/*.html", "!<%= oim.path %>/kpissalud/index.html"],
        dest: "<%= oim.path %>/kpissalud/template.js",
        ngModuleName: "novit.kpissalud.templates"
      },
      poliza_seguroViaje: {
        src: ["<%= oim.path %>/polizas/app/seguroviaje/**/*.html"],
        dest: "<%= oim.path %>/polizas/app/seguroviaje/seguroViajeTemplates.js",
        ngModuleName: "oim.polizas.seguroViaje"
      },
      dashboard: {
        src: ["<%= oim.path %>/callerDashboard/app/**/*.html", "!<%= oim.path %>/callerDashboard/index.html"],
        dest: "<%= oim.path %>/callerDashboard/template.js",
        ngModuleName: "oim.cdashboard.templates"
      },
      medicalcenter: {
        src: ["<%= oim.path %>/medicalCentral/app/**/*.html", "!<%= oim.path %>/medicalCentral/index.html"],
        dest: "<%= oim.path %>/medicalCentral/template.js",
        ngModuleName: "novit.medicalCenter.templates"
      },
      referencias: {
        src: ["<%= oim.path %>/referencias/app/**/*.html", "!<%= oim.path %>/referencias/index.html"],
        dest: "<%= oim.path %>/referencias/template.js",
        ngModuleName: "novit.referencias.templates"
      },
      farmapfre: {
        src: ["<%= oim.path %>/farmapfre/app/**/*.html", "!<%= oim.path %>/farmapfre/index.html"],
        dest: "<%= oim.path %>/farmapfre/template.js",
        ngModuleName: "novit.farmapfre.templates"
      },
      sctrDenuncia: {
        src: ['<%= oim.path %>/sctrDenuncia/app/**/*.html', '!<%= oim.path %>/sctrDenuncia/index.html'],
        dest: '<%= oim.path %>/sctrDenuncia/template.js',
        ngModuleName: "novit.sctrDenuncia.templates"
      },
      atencionsiniestrosagricola: {
        src: ["<%= oim.path %>/atencionsiniestrosagricola/app/**/*.html", "!<%= oim.path %>/atencionsiniestrosagricola/index.html"],
        dest: "<%= oim.path %>/atencionsiniestrosagricola/template.js",
        ngModuleName: "novit.atencionsiniestrosagricola.templates"
      }
    },
  });

  var envTarget = grunt.option("env") || "dev";
  grunt.registerTask("serve", function(target) {
    var environment = target || envTarget;
    console.log(environment);
    grunt.task.run(["config:" + environment, "replace", "sass", "angularTemplatePreBuild", "connect:login", "watch"]);
  });

  grunt.registerTask("sonarScan", function(target) {
    var configScan = grunt.config("sonarRunner:analysis");
    configScan.options.sonar;
  });

  function renderScript(scripts, moduleName) {
    return (
      "// multiplica \n" +
      "angular.module('" +
      moduleName +
      "', []).run(['$templateCache', function($templateCache) {\n" +
      scripts +
      "}])"
    );
  }

  grunt.registerTask("angularTemplatePreBuild", function() {
    var prebuild = grunt.config("file-creator.templateprebuild");
    var taskNgTemplates = grunt.config("ngtemplates");
    for (var item in taskNgTemplates) {
      let moduleName = taskNgTemplates[item].ngModuleName;
      prebuild[taskNgTemplates[item].dest] = function(fs, fd, done) {
        fs.writeSync(fd, renderScript("", moduleName));
        done();
      };
    }

    grunt.config("file-creator.templateprebuild", prebuild);
    grunt.task.run(["file-creator:templateprebuild"]);
  });

  grunt.registerTask("angularTemplate", function(target) {
    var taskNgTemplates = grunt.config("ngtemplates");

    function getOptions(moduleName) {
      return {
        url: function(url) {
          return url.replace("wwwroot", "");
        },
        bootstrap: function(module, scripts, t, m) {
          return renderScript(scripts, moduleName);
        },
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          keepClosingSlash: true, // Only if you are using SVG in HTML
          removeAttributeQuotes: true,
          removeComments: true, // Only if you don't use comment directives!
          removeEmptyAttributes: true,
          removeRedundantAttributes: true
        }
      };
    }
    for (var item in taskNgTemplates) {
      taskNgTemplates[item].options = getOptions(taskNgTemplates[item].ngModuleName);
    }

    grunt.config("ngtemplates", taskNgTemplates);
    grunt.task.run(["ngtemplates"]);
  });

  function prepareConfig(setting) {
    return {
      files: [
        {
          template: "proxy/templates/comunication.mustache",
          dest: setting.destProxy,
          data: {
            moduleName: setting.ngModuleNameProxy,
            endpointName: setting.dataProxy.endpointName,
            constantsName: setting.dataProxy.constantsName
          }
        }
      ]
    };
  }

  function buildFileProxy(setting) {
    var subName = "mustache_render";
    var mustacheConfig = subName + "." + setting.renderTaskName;
    var cmdExec = subName + ":" + setting.renderTaskName;

    var descriptorsService = getDescriptor(setting.descriptorPath);
    var mtRender = grunt.config(mustacheConfig);
    mtRender = mtRender || prepareConfig(setting);

    for (var item in mtRender.files) mtRender.files[item].data.controllers = descriptorsService;

    grunt.config(mustacheConfig, mtRender);
    grunt.task.run([cmdExec]);
  }

  function getDescriptor(path) {
    var descriptorsService = grunt.file.readJSON(path);

    for (var index in descriptorsService) {
      var item = descriptorsService[index];
      item.comma = index != descriptorsService.length - 1;

      for (var actIndex in item.actions) {
        var action = item.actions[actIndex];
        action.comma = actIndex != item.actions.length - 1;
        action.wasParameter = action.parameters.length > 0;
        action.queryParameters = [];
        action.bodyParameters = [];

        for (var paramIndex in action.parameters) {
          var param = action.parameters[paramIndex];
          param.comma = paramIndex != action.parameters.length - 1;
          param.isOptional = param.allowSeveralValues || param.isOptional || param.defaultValue !== undefined;
          if (param.isQueryParam) action.queryParameters.push(param);
          else action.bodyParameters.push(param);
          if (param.defaultValue && typeof param.defaultValue == "object") {
            param.defaultValue = param.defaultValue.value;
          }
        }
        action.wasQueryParameter = action.queryParameters.length > 0;
        action.wasBodyParameters = action.bodyParameters.length > 0;
        if (action.wasQueryParameter) action.queryParameters[action.queryParameters.length - 1]._comma = true;
        if (action.wasBodyParameters) action.bodyParameters[action.bodyParameters.length - 1]._comma = true;
      }
    }
    return descriptorsService;
  }

  function _getTaskToReBuildProxy(app, env) {
    return env
      ? ['config:' + env, 'httpDescriptor:' + app, 'generateProxy:' + app]
      : ['httpDescriptor:' + app, 'generateProxy:' + app];
  }

  grunt.registerTask("generateProxy", "Generation of proxies", function(target) {
    var item = proxyGenerator[target];
    if (item) {
      console.log("\x1b[33m%s\x1b[0m", "Generating proxies for " + target + " ...");
      buildFileProxy(item);
    }
  });

  grunt.registerTask("httpDescriptor", "Generation of proxies for Login", function(target) {
    var item = proxyGenerator[target];
    const urlDescriptor = grunt.config.get(item.propUrlConfig);
    var configHttp = {
      options: {
        url: urlDescriptor + "api/descriptor"
      },
      dest: item.descriptorPath
    };
    grunt.config("http." + target, configHttp);
    console.log("\x1b[33m%s\x1b[0m", "downloading metadata " + target + " from " + urlDescriptor + " ...");
    grunt.task.run(["http:" + target]);
  });

  grunt.registerTask("reBuildProxyEnel", "Download descriptor and generate proxies for enel", function() {
    grunt.task.run(["httpDescriptor:enel", "generateProxy:enel"]);
  });

  grunt.registerTask("reBuildProxyCgw", "Download descriptor and generate proxies for cgw", function () {
    grunt.task.run(["httpDescriptor:cgw", "generateProxy:cgw"]);
  });
  
  grunt.registerTask("reBuildProxyGrqc", "Download descriptor and generate proxies for grqc", function () {
    grunt.task.run(["httpDescriptor:grqc", "generateProxy:grqc"]);
  });  

  grunt.registerTask("reBuildProxyPowerEPS", "Download descriptor and generate proxies for powereps", function () {
    grunt.task.run(["httpDescriptor:powereps", "generateProxy:powereps"]);
  });

  grunt.registerTask("reBuildProxyNsctr", "Download descriptor and generate proxies for nsctr", function (env) {
    grunt.task.run(_getTaskToReBuildProxy('nsctr', env));
  });

  grunt.registerTask("reBuildProxyGcw", "Download descriptor and generate proxies for gcw", function () {
    grunt.task.run(["httpDescriptor:gcw", "generateProxy:gcw"]);
  });

  grunt.registerTask("reBuildProxyPoliza", "Download descriptor and generate proxies for polizas", function () {
    grunt.task.run(["httpDescriptor:poliza", "generateProxy:poliza"]);
  });

  grunt.registerTask("reBuildProxyLogin", "Download descriptor and generate proxies for login", function () {
    grunt.task.run(["httpDescriptor:login", "generateProxy:login"]);
  });

  grunt.registerTask("reBuildProxyWebProc", "Download descriptor and generate proxies for web proc", function () {
    grunt.task.run(["httpDescriptor:webProc", "generateProxy:webProc"]);
  });

  grunt.registerTask("reBuildProxySeguridad", "Download descriptor and generate proxies for seguridad", function () {
    grunt.task.run(["httpDescriptor:seguridad", "generateProxy:seguridad"]);
  });

  grunt.registerTask("reBuildProxyCDash", "Download descriptor and generate proxies for caller Dashboard", function () {
    grunt.task.run(["httpDescriptor:callerDashboard", "generateProxy:callerDashboard"]);
  });

  grunt.registerTask("reBuildProxySeguroViaje", "Download descriptor and generate proxies for seguroViaje", function () {
    grunt.task.run(["httpDescriptor:seguroViaje", "generateProxy:seguroViaje"]);
  });

  grunt.registerTask(
    "reBuildProxyMedicalCenter",
    "Download descriptor and generate proxies for Medical Center",
    function() {
      grunt.task.run(["httpDescriptor:medicalCenter", "generateProxy:medicalCenter"]);
    }
  );

  grunt.registerTask(
    "reBuildProxyKpissalud",
    "Download descriptor and generate proxies for kpissalud",
    function() {
      grunt.task.run(["httpDescriptor:kpissalud", "generateProxy:kpissalud"]);
    }
  );

  grunt.registerTask(
    "reBuildProxyFarmapfre",
    "Download descriptor and generate proxies for farmapfre backoffice",
    function() {
      grunt.task.run(["httpDescriptor:farmapfre", "generateProxy:farmapfre"]);
    }
  );

  grunt.registerTask('reBuildProxySctrDenuncia', 'Download descriptor and generate proxies for Sctr Denuncia backoffice', function() {
    grunt.task.run(['httpDescriptor:sctrDenuncia', 'generateProxy:sctrDenuncia']);
  });

  grunt.registerTask(
    "reBuildProxyAtencionsiniestrosagricola",
    "Download descriptor and generate proxies for atencionsiniestrosagricola",
    function() {
      grunt.task.run(["httpDescriptor:atencionsiniestrosagricola", "generateProxy:atencionsiniestrosagricola"]);
    }
  );

  grunt.registerTask(
    "reBuildProxyReferencias",
    "Download descriptor and generate proxies for referencias",
    function () {
      grunt.task.run(["httpDescriptor:referencias", "generateProxy:referencias"]);
    }
  );

  grunt.registerTask("reBuildProxyInspec", "Download descriptor and generate proxies for inspec", function () {
    grunt.task.run(["httpDescriptor:inspec", "generateProxy:inspec"]);
  });

  grunt.registerTask("reBuildProxyGPer", "Download descriptor and generate proxies for gper", function () {
    grunt.task.run(["httpDescriptor:gper", "generateProxy:gper"]);
  });

  grunt.registerTask("reBuildProxyReembolso", "Download descriptor and generate proxies for reembolso", function() {
    grunt.task.run(["httpDescriptor:reembolso", "generateProxy:reembolso"]);
  });

  grunt.registerTask("reBuildProxyReembolso2", "Download descriptor and generate proxies for reembolso2", function() {
    grunt.task.run(["httpDescriptor:reembolso2", "generateProxy:reembolso2"]);
  });

  grunt.registerTask("reBuildProxyActter", "Download descriptor and generate proxies for actter", function (env) {
    grunt.task.run(_getTaskToReBuildProxy('actter', env));
  });

  grunt.registerTask("reBuildProxy", "Download descriptor and generate proxies", function(target) {
    var environment = target || "prod";
    grunt.task.run(["config:" + environment, "replace", "reBuildAllProxy"]);
  });

  grunt.registerTask("reBuildProxyRenovacion", "Download descriptor and generate proxies for renovacion", function () {
    grunt.task.run(["httpDescriptor:renovacion", "generateProxy:renovacion"]);
  });

  grunt.registerTask("reBuildAllProxy", "Download descriptor and generate proxies", [
    "reBuildProxyPoliza",
    "reBuildProxyLogin",
    "reBuildProxyCgw",
    "reBuildProxyGrqc",	
    "reBuildProxyPowerEPS",
    "reBuildProxyReembolso",
    "reBuildProxyReembolso2",
    "reBuildProxyGcw",
    "reBuildProxyNsctr",
    "reBuildProxyInspec",
    "reBuildProxyRenovacion",
    "reBuildProxyKpissalud",
    "reBuildProxyWebProc",
    "reBuildProxySeguridad",
    "reBuildProxyGPer",
    "reBuildProxyFarmapfre",
    "reBuildProxyReferencias",
    "reBuildProxyAtencionsiniestrosagricola",
    "reBuildProxySeguroViaje",
    "reBuildProxyMyDream",
    "reBuildProxyMedicalCenter",
    "reBuildProxyActter"
    ]);

  grunt.registerTask("build", function(target) {
    var environment = !target ? "prod" : target;
    grunt.task.run([
      "config:" + environment,
      "replace",
      "sass",
      "reBuildAllProxy",
      "angularTemplate",
      "clean:dist",
      "uglify:dist",
      "htmlmin:dist",
      "copy:dist",
      "angularTemplatePreBuild"
    ]);
  });
  grunt.registerTask("build-proxy", function (target) {
    var environment = !target ? "prod" : target;
    grunt.task.run([
      "config:" + environment,
      "replace",
      "sass",
      "angularTemplate",
      "clean:dist",
      "uglify:dist",
      "htmlmin:dist",
      "copy:dist",
      "angularTemplatePreBuild"
    ]);
  });

  grunt.registerTask("reBuildProxyMyDream", "Download descriptor and generate proxies for MyDream", function() {
    grunt.task.run(["httpDescriptor:mydream", "generateProxy:mydream"]);
  });
};
