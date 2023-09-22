define(["constants"], function(constants) {
  var data = [
    {
      name: "root",
      abstract: true,
      views: {
        "top@root": {
          templateUrl: "/app/index/controller/template/top.html",
          controller: "topController"
        },
        "header@root": {
          templateUrl: "/app/index/controller/template/header.html",
          controller: "headerController"
        },
        "left_bar@root": {
          templateUrl: "/app/index/controller/template/left_bar.html",
          controller: "leftBarController"
        },

        "body_left@root": {
          templateUrl: "/app/index/controller/template/body_left.html",
          controller: "bodyLeftController"
        },
        "right_bar@root": {
          templateUrl: "/app/index/controller/template/right_bar.html",
          controller: "rightBarController"
        },
        "footer@root": {
          templateUrl: "/app/index/controller/template/footer.html",
          controller: "footerController"
        },
        "bottom@root": {
          templateUrl: "/app/index/controller/template/bottom.html",
          controller: "bottomController"
        }
      },
      resolve: {
        authorizedResource: [
          "accessSupplier",
          function(accessSupplier) {
            return accessSupplier.getAllObject();
          }
        ]
      },
      resolver: [
        {
          name: "automovilHome",
          moduleName: "appAutos",
          files: ["/polizas/app/autos/autosHome/controller/automovil-home.js"],
          resolveTemplate: true
        },
        {
          name: "layout",
          moduleName: "appAutos",
          files: [
            "topController",
            "headerController",
            "leftBarController",
            "bodyMiddelController",
            "bodyLeftController",
            "rightBarController",
            "footerController",
            "bottomController"
          ]
        }
      ]
    },
    {
      name: "accessdenied",
      code: "",
      description: "Acceso denegado",
      url: "/accessdenied",
      parent: "root",
      views: {
        content: {
          controller: [function() {}],
          templateUrl: "/app/handlerErr/template/access-denied.html"
        }
      }
    },
    {
      name: "error_interno",
      code: "",
      description: "Error interno",
      url: "/error_interno",
      parent: "root",
      views: {
        content: {
          controller: [function() {}],
          templateUrl: "/app/handlerErr/template/500.html"
        }
      }
    },
    {
      name: "emisa",
      code: "",
      url: "/",
      parent: "root",
      views: {
        content: {
          controller: "polizasHomeController",
          templateUrl: "/polizas/app/homePolizas.html"
        }
      },
      resolve: {
        authorizedResource: [
          "accessSupplier",
          function(accessSupplier) {
            return accessSupplier.getAllObject();
          }
        ]
      },
      resolver: [
        {
          name: "homePolizas",
          moduleName: "appAutos",
          files: ["homePolizas"]
        }
      ]
    },
    {
      name: "homePolizasAutos",
      appCode: "AUTOMOVILES",
      url: "/autos/home",
      description: "Autos",
      parent: "root",
      views: {
        content: {
          controller: "ctrlHomeAutos",
          templateUrl: "/polizas/app/autos/autosHome/controller/automovil-home.html"
        }
      }
    },
    {
      name: "variacionRiesgo",
      appCode: "AUTOMOVILES",
      params: { infoRiesgo: null },
      url: "/autos/variacionRiesgo",
      controller: "riesgoController",
      templateUrl: "/polizas/app/autos/variacionRiesgo/controller/variacion-riesgo.html",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/autos/variacionRiesgo/controller/variacion-riesgo.html",
          controller: "riesgoController"
        }
      },
      resolver: [
        {
          name: "variacionRiesgo",
          moduleName: "appAutos",
          files: ["/polizas/app/autos/variacionRiesgo/controller/variacion-riesgo.js"],
          resolveTemplate: true
        },
        {
          name: "layout",
          moduleName: "appAutos",
          files: [
            "topController",
            "headerController",
            "leftBarController",
            "bodyMiddelController",
            "bodyLeftController",
            "rightBarController",
            "footerController",
            "bottomController"
          ],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "variacionRiesgoOK",
      appCode: "AUTOMOVILES",
      url: "/autos/variacionRiesgoOK",
      controller: "riesgoController",
      templateUrl: "/polizas/app/autos/variacionRiesgo/component/automovil-variacion-riesgo-ok.html",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/autos/variacionRiesgo/component/automovil-variacion-riesgo-ok.html",
          controller: "riesgoController"
        }
      },
      resolver: [
        {
          name: "variacionRiesgoOK",
          moduleName: "appAutos",
          files: ["/polizas/app/autos/variacionRiesgo/controller/variacion-riesgo.js"],
          resolveTemplate: true
        },
        {
          name: "layout",
          moduleName: "appAutos",
          files: [
            "topController",
            "headerController",
            "leftBarController",
            "bodyMiddelController",
            "bodyLeftController",
            "rightBarController",
            "footerController",
            "bottomController"
          ],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "creacionRiesgo",
      appCode: "AUTOMOVILES",
      params: { infoRiesgo: null },
      url: "/autos/creacionRiesgo",
      controller: "riesgoController",
      templateUrl: "/polizas/app/autos/variacionRiesgo/controller/creacion-riesgo.html",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/autos/variacionRiesgo/controller/creacion-riesgo.html",
          controller: "riesgoController"
        }
      },
      resolver: [
        {
          name: "creacionRiesgo",
          moduleName: "appAutos",
          files: ["/polizas/app/autos/variacionRiesgo/controller/variacion-riesgo.js"],
          resolveTemplate: true
        },
        {
          name: "layout",
          moduleName: "appAutos",
          files: [
            "topController",
            "headerController",
            "leftBarController",
            "bodyMiddelController",
            "bodyLeftController",
            "rightBarController",
            "footerController",
            "bottomController"
          ],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "creacionRiesgoOK",
      code: "",
      url: "/autos/creacionRiesgoOK",
      controller: "riesgoController",
      templateUrl: "/polizas/app/autos/variacionRiesgo/component/automovil-creacion-riesgo-ok.html",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/autos/variacionRiesgo/component/automovil-creacion-riesgo-ok.html",
          controller: "riesgoController"
        }
      },
      resolver: [
        {
          name: "creacionRiesgoOK",
          moduleName: "appAutos",
          files: ["/polizas/app/autos/variacionRiesgo/controller/variacion-riesgo.js"],
          resolveTemplate: true
        },
        {
          name: "layout",
          moduleName: "appAutos",
          files: [
            "topController",
            "headerController",
            "leftBarController",
            "bodyMiddelController",
            "bodyLeftController",
            "rightBarController",
            "footerController",
            "bottomController"
          ],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "cotizacionGuardadaAutos",
      appCode: "AUTOMOVILES",
      url: "/autos/cotizacionGuardada",
      description: "Cotización Guardada Autos",
      controller: "cotizacionGuardadaController",
      templateUrl: "/polizas/app/autos/autosCotizacionGuardada/controller/mainCotizacionGuardada.html",
      parent: "root",
      params: { requestId: null, vehiclePlate: null },
      views: {
        content: {
          templateUrl: "/polizas/app/autos/autosCotizacionGuardada/controller/mainCotizacionGuardada.html",
          controller: "cotizacionGuardadaController"
        }
      },
      resolver: [
        {
          name: "cotizacionGuardadaAutos",
          moduleName: "appAutos",
          files: ["/polizas/app/autos/autosCotizacionGuardada/controller/mainCotizacionGuardada.js"],
          resolveTemplate: true
        },
        {
          name: "layout",
          moduleName: "appAutos",
          files: [
            "topController",
            "headerController",
            "leftBarController",
            "bodyMiddelController",
            "bodyLeftController",
            "rightBarController",
            "footerController",
            "bottomController"
          ],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "newEmit",
      appCode: "AUTOMOVILES",
      breads: ["homePolizasAutos"],
      description: "Emisión auto nuevo",
      urls: [
        {
          url: "/autos/newEmit/:quotation",
          abstract: true,
          parent: "root",
          views: {
            content: {
              controller: "carEmitController",
              templateUrl: "/polizas/app/autos/autosEmitirNuevo/component/automovil-emitirN.html"
            }
          },
          thenRoutes: ["/autos/newEmit/:quotation/1"],
          resolve: {
            quotationCar: [
              "newEmit",
              "loaderEmitNew",
              "$stateParams",
              function(newEmit, loaderEmitNew, $stateParams) {
                return loaderEmitNew.load($stateParams.quotation);
              }
            ],
            claims: [
              "loaderEmitNew",
              "newEmit",
              function(loaderEmitNew) {
                return loaderEmitNew._claims();
              }
            ]
          }
        },
        {
          name: "newEmit.steps",
          url: "/:step/:tipo/:numero",
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              "/polizas/app/autos/autosEmitirNuevo/component/automovil-emitirN-p1.html",
              "/polizas/app/autos/autosEmitirNuevo/component/automovil-emitirN-p2.html",
              "/polizas/app/autos/autosEmitirNuevo/component/automovil-emitirN-p3.html",
              "/polizas/app/autos/autosEmitirNuevo/component/automovil-emitirN-p4.html"
            ];
            return c[$stateParam.step];
          },
          resolve: {
            carColors: [
              "loaderEmitNew",
              "newEmit",
              function(loaderEmitNew) {
                return loaderEmitNew.carCalors();
              }
            ]
          },
          controllerProvider: function($stateParams) {
            var c = [
              undefined,
              "carEmitPolizeData",
              "carEmitContractorData",
              "carEmitAction",
              "carEmitNew4"];
            return c[$stateParams.step];
          }
        }
      ],

      resolver: [
        {
          name: "newEmit",
          moduleName: "appAutos",
          files: [
            "carEmitPolizeData",
            "carEmitContractorData",
            "carEmitAction",
            "carEmitNew4",
            "carEmitController"]
        }
      ]
    },
    {
      name: "resumenNewEmit",
      appCode: "AUTOMOVILES",
      url: "/autos/emit/resumenEmision/:emitionId",
      parent: "root",
      views: {
        content: {
          controller: "carEmitResumenController",
          templateUrl: "/polizas/app/autos/autosEmitirNuevo/component/automovil-resumen.html"
        }
      },
      resolve: {
        resumen: [
          "resumenFactory",
          "$stateParams",
          "newEmit",
          function(resumenFactory, $stateParams, newEmit) {
            return resumenFactory.loadResumen($stateParams.emitionId);
          }
        ]
      },
      resolver: [
        {
          name: "newEmit",
          moduleName: "appAutos",
          files: ["carEmitResumen"]
        }
      ]
    },
    {
      name: "usedEmit",
      appCode: "AUTOMOVILES",
      breads: ["homePolizasAutos"],
      description: "Emisión auto usado",
      params: { step: null },
      urls: [
        {
          url: "/autos/usedEmit",
          abstract: true,
          parent: "root",
          thenRoutes: ["/autos/usedEmit/1"],
          views: {
            content: {
              controller: "usedCarEmitController",
              templateUrl: "/polizas/app/autos/autosEmitirUsado/controller/automovil-emitirU.html"
            }
          },
          resolve: {
            carClaims: [
              "loaderUsedCarEmit",
              "usedEmit",
              function(loaderUsedCarEmit, usedEmit) {
                return loaderUsedCarEmit.getClaims();
              }
            ],
            carNewProducts: [
              "loaderUsedCarEmit",
              "usedEmit",
              function(loaderUsedCarEmit, usedEmit) {
                return loaderUsedCarEmit.getNewProducts(true);
              }
            ]
          }
        },
        {
          name: "usedEmit.steps",
          url: "/:step",
          params: {
            paramsProducts: null,
            paramsFinancing: null,
            paramsDiscountCommission: null,
            paramsGps: null
          },
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              "/polizas/app/autos/autosEmitirUsado/component/automovil-emitirU-p1.html",
              "/polizas/app/autos/autosEmitirUsado/component/automovil-emitirU-p2.html",
              "/polizas/app/autos/autosEmitirUsado/component/automovil-emitirU-p3.html",
              "/polizas/app/autos/autosEmitirUsado/component/automovil-emitirU-p4.html",
              "/polizas/app/autos/autosEmitirUsado/component/automovil-emitirU-p5.html",
              "/polizas/app/autos/autosEmitirUsado/component/automovil-emitirU-resumen.html"
            ];
            return c[$stateParam.step];
          },
          resolve: {
            carColors: [
              "loaderUsedCarEmit",
              "usedEmit",
              function(loaderUsedCarEmit, usedEmit) {
                return loaderUsedCarEmit.getColors();
              }
            ],
            carProducts: [
              "loaderUsedCarEmit",
              "usedEmit",
              "$stateParams",
              function(loaderUsedCarEmit, usedEmit, $stateParams) {
                return loaderUsedCarEmit.getProducts($stateParams.paramsProducts);
              }
            ],
            carEndorsee: [
              "loaderUsedCarEmit",
              "usedEmit",
              function(loaderUsedCarEmit, usedEmit) {
                return loaderUsedCarEmit.getEndorsee();
              }
            ],
            carDiscountCommission: [
              "loaderUsedCarEmit",
              "usedEmit",
              "$stateParams",
              function(loaderUsedCarEmit, usedEmit, $stateParams) {
                return loaderUsedCarEmit.getDiscountCommission($stateParams.paramsDiscountCommission);
              }
            ],
            carGps: [
              "loaderUsedCarEmit",
              "usedEmit",
              "$stateParams",
              function(loaderUsedCarEmit, usedEmit, $stateParams) {
                return loaderUsedCarEmit.getGps($stateParams.paramsGps);
              }
            ]
          },
          controllerProvider: function($stateParams) {
            var c = [
              undefined,
              "usedCarEmitS1",
              "usedCarEmitS2",
              "usedCarEmitS3",
              "usedCarEmitS4",
              "usedCarEmitS5",
              "usedCarEmitSummary"
            ];
            return c[$stateParams.step];
          }
        }
      ],

      resolver: [
        {
          name: "usedEmit",
          moduleName: "appAutos",
          files: [
            "usedCarEmitS1",
            "usedCarEmitS2",
            "usedCarEmitS3",
            "usedCarEmitS4",
            "usedCarEmitS5",
            "usedCarEmitSummary",
            "usedCarEmitController"
          ]
        }
      ]
    },
    {
      name: "usedCarEmitted",
      appCode: "AUTOMOVILES",
      url: "/autos/usedCarEmitted/:documentNumber",
      parent: "root",
      views: {
        content: {
          controller: "usedCarEmittedController",
          templateUrl: "/polizas/app/autos/autosEmitirUsado/controller/emitted.html"
        }
      },
      resolve: {
        carEmission: [
          "loaderUsedCarEmittedController",
          "usedCarEmitted",
          "$stateParams",
          function(loaderUsedCarEmittedController, usedCarEmitted, $stateParams) {
            return loaderUsedCarEmittedController.getEmission($stateParams.documentNumber, true);
          }
        ]
      },
      resolver: [
        {
          name: "usedCarEmitted",
          moduleName: "appAutos",
          files: ["usedCarEmittedController"]
        }
      ]
    },
    {
      name: "autosDocuments",
      appCode: "AUTOMOVILES",
      breads: ["homePolizasAutos"],
      description: "Documentos autos",
      url: "/autos/documents",
      parent: "root",
      views: {
        content: {
          controller: "autosDocumentsController",
          templateUrl: "/polizas/app/autos/documents/controller/documents.html"
        }
      },
      resolve: {
        carProducts: [
          "loaderAutosDocumentsController",
          "autosDocuments",
          "$stateParams",
          "oimPrincipal",
          function(loaderAutosDocumentsController, autosDocuments, $stateParams, oimPrincipal) {
            var params = {
              CodigoAplicacion: constants.module.polizas.description,
              CodigoUsuario: oimPrincipal.getUsername().toUpperCase(),
              Filtro: constants.module.polizas.autos.description
            };
            return loaderAutosDocumentsController.getProducts(params, false);
          }
        ]
      },
      resolver: [
        {
          name: "autosDocuments",
          moduleName: "appAutos",
          files: ["autosDocumentsController"]
        }
      ]
    },
    {
      name: "cotizacionesVig",
      appCode: "AUTOMOVILES",
      url: "/autos/cotizacionesVigentes",
      description: "Cotizaciones Vigentes",
      controller: "automovilDocsController",
      templateUrl: "/polizas/app/autos/autosDocs/component/automovil-documentos.html",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/autos/autosDocs/component/automovil-documentos.html",
          controller: "automovilDocsController"
        }
      },
      resolver: [
        {
          name: "cotizacionesVig",
          moduleName: "appAutos",
          files: ["/polizas/app/autos/autosDocs/controller/automovil-documentos.js"],
          resolveTemplate: true
        },
        {
          name: "layout",
          moduleName: "appAutos",
          files: [
            "topController",
            "headerController",
            "leftBarController",
            "bodyMiddelController",
            "bodyLeftController",
            "rightBarController",
            "footerController",
            "bottomController"
          ],
          resolveTemplate: true
        }
      ]
    },

    {
      name: "homePolizasSOAT",
      appCode: "SOAT",
      url: "/soat/home",
      description: "SOAT",
      parent: "root",
      views: {
        content: {
          controller: "soatHomeController",
          templateUrl: "/polizas/app/soat/home/controller/soat-home.html"
        }
      },
      resolve: {},
      resolver: [
        {
          name: "homePolizasSOAT",
          moduleName: "appSoat",
          files: ["/polizas/app/soat/home/controller/soat-home.js"]
        }
      ]
    },

    {
      name: "soatEmit",
      appCode: "SOAT",
      params: {
        step: null
      },
      description: "Emisión SOAT",
      breads: ["homePolizasSOAT"],
      urls: [
        {
          url: "/soat/soatEmit",
          abstract: true,
          parent: "root",
          thenRoutes: ["/soat/soatEmit/1"],
          views: {
            content: {
              controller: "soatEmitController",
              templateUrl: "/polizas/app/soat/emit/controller/soat.html"
            }
          },
          resolve: {
            claims: [
              "loaderSOATController",
              "soatEmit",
              function(loaderSOATController, soatEmit) {
                return loaderSOATController.getClaims();
              }
            ]
          }
        },
        {
          name: "soatEmit.steps",
          appCode: "SOAT",
          url: "/:step",
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              "/polizas/app/soat/emit/component/soat-emitir-p1.html",
              "/polizas/app/soat/emit/component/soat-emitir-p2.html",
              "/polizas/app/soat/emit/component/soat-emitir-p3.html",
              "/polizas/app/soat/emit/component/soat-emitir-p4.html"
            ];
            return c[$stateParam.step];
          },
          resolve: {},
          controllerProvider: function($stateParams) {
            var c = [undefined, "soatEmitS1", "soatEmitS2", "soatEmitS3", "soatEmitS4"];
            return c[$stateParams.step];
          }
        }
      ],

      resolver: [
        {
          name: "soatEmit",
          moduleName: "appSoat",
          files: ["soatEmitS1", "soatEmitS2", "soatEmitS3", "soatEmitS4", "soatEmitController"]
        }
      ]
    },

    {
      name: "getSoat",
      appCode: "SOAT",
      url: "/soat/getSoat",
      controller: "soatDocController",
      templateUrl: "/polizas/app/soat/soatDoc/controller/soatGuardado.html",
      parent: "root",
      views: {
        content: {
          controller: "soatDocController",
          templateUrl: "/polizas/app/soat/soatDoc/controller/soatGuardado.html"
        }
      },

      resolver: [
        {
          name: "getSoat",
          moduleName: "appSoat",
          files: ["/polizas/app/soat/soatDoc/controller/soatGuardado.js"]
        }
      ]
    },
    {
      name: "soatDocuments",
      appCode: "SOAT",
      breads: ["homePolizasSOAT"],
      description: "Documentos soat",
      url: "/soat/documents",
      parent: "root",
      views: {
        content: {
          controller: "soatDocumentsController",
          templateUrl: "/polizas/app/soat/documents/controller/documents.html"
        }
      },
      resolve: {
        soatProducts: [
          "loaderSoatDocumentsController",
          "soatDocuments",
          "$stateParams",
          "oimPrincipal",
          function(loaderSoatDocumentsController, soatDocuments, $stateParams, oimPrincipal) {
            var params = {
              CodigoAplicacion: constants.module.polizas.description,
              CodigoUsuario: oimPrincipal.getUsername().toUpperCase(),
              Filtro: constants.module.polizas.soat.description
            };
            return loaderSoatDocumentsController.getProducts(params, false);
          }
        ]
      },
      resolver: [
        {
          name: "soatDocuments",
          moduleName: "appAutos",
          files: ["soatDocumentsController"]
        }
      ]
    },

    {
      name: "transporteemit",
      code: "58",
      description: "Emisión póliza de transportes",
      breads: ["homePolizasTransportes"],
      params: { step: null },
      urls: [
        {
          url: "/trans/emit",
          abstract: true,
          parent: "root",
          thenRoutes: ["/trans/emit/1"],
          views: {
            content: {
              controller: "transporteEmitController",
              templateUrl: "/polizas/app/transportes/emit/controller/transportes-emitirU.html"
            }
          }
        },
        {
          name: "transporteemit.steps",
          url: "/:step",
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              "/polizas/app/transportes/emit/component/transportes-emitirU-p1.html",
              "/polizas/app/transportes/emit/component/transportes-emitirU-p2.html",
              "/polizas/app/transportes/emit/component/transportes-emitirU-p3.html",
              "/polizas/app/transportes/emit/component/transportes-emitirU-p4.html",
              "/polizas/app/transportes/emit/component/transportes-emitirU-resumen.html",
              "/polizas/app/transportes/emit/component/transportes-emitirU-fin.html"
            ];
            return c[$stateParam.step];
          },
          controllerProvider: function($stateParams) {
            var c = [
              undefined,
              "transporteEmitS1",
              "transporteEmitS2",
              "transporteEmitS3",
              "transporteEmitS4",
              "transporteEmitSummary",
              "transporteEmitFin"
            ];
            return c[$stateParams.step];
          }
        }
      ],

      resolver: [
        {
          name: "transporteemit",
          moduleName: "appTransportes",
          files: [
            "transporteEmitS1",
            "transporteEmitS2",
            "transporteEmitS3",
            "transporteEmitS4",
            "transporteEmitSummary",
            "transporteEmitFin",
            "transporteEmitController"
          ]
        }
      ]
    },
    {
      name: "transporteaplicacion",
      code: "20",
      params: { step: null },
      description: "Crear aplicación de transportes",
      breads: ["homePolizasTransportes"],
      urls: [
        {
          url: "/trans/aplicacion",
          abstract: true,
          parent: "root",
          thenRoutes: ["/trans/aplicacion/1"],
          views: {
            content: {
              controller: "transporteAplicacionController",
              templateUrl: "/polizas/app/transportes/aplicacion/controller/transportes-aplicacionU.html"
            }
          }
        },
        {
          name: "transporteaplicacion.steps",
          url: "/:step",
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              "/polizas/app/transportes/aplicacion/component/transportes-aplicacionU-p1.html",
              "/polizas/app/transportes/aplicacion/component/transportes-aplicacionU-p2.html",
              "/polizas/app/transportes/aplicacion/component/transportes-aplicacionU-fin.html"
            ];
            return c[$stateParam.step];
          },
          controllerProvider: function($stateParams) {
            var c = [undefined, "transporteAplicacionS1", "transporteAplicacionS2", "transporteAplicacionFin"];
            return c[$stateParams.step];
          }
        }
      ],

      resolver: [
        {
          name: "transporteaplicacion",
          moduleName: "appTransportes",
          files: [
            "transporteAplicacionS1",
            "transporteAplicacionS2",
            "transporteAplicacionFin",
            "transporteAplicacionController"
          ]
        }
      ]
    },
    {
      name: "transporteDocuments",
      appCode: "TRANSPORTES",
      breads: ["homePolizasTransportes"],
      description: "Documentos transporte",
      url: "/trans/documents",
      parent: "root",
      views: {
        content: {
          controller: "transporteDocumentsController",
          templateUrl: "/polizas/app/transportes/documents/controller/documents.html"
        }
      },
      resolve: {
        transportProducts: [
          "loaderTransporteDocumentsController",
          "transporteDocuments",
          "$stateParams",
          "oimPrincipal",
          function(loaderTransporteDocumentsController, transporteDocuments, $stateParams, oimPrincipal) {
            return loaderTransporteDocumentsController.getProducts(
              constants.module.polizas.transportes.companyCode,
              constants.module.polizas.transportes.codeRamo
            );
          }
        ]
      },
      resolver: [
        {
          name: "transporteDocuments",
          moduleName: "appAutos",
          files: ["transporteDocumentsController"]
        }
      ]
    },

    {
      name: "autosQuote",
      appCode: "AUTOMOVILES",
      description: "Cotización de auto",
      breads: ["homePolizasAutos"],
      params: { step: null },
      urls: [
        {
          url: "/autos/autosQuote",
          abstract: true,
          parent: "root",
          thenRoutes: ["/autos/autosQuote/1"],
          views: {
            content: {
              controller: "autosCotizarController2",
              templateUrl: "/polizas/app/autos/autosCotizar2/controller/autos-cotizar.html"
            }
          },
          resolve: {
            claims: [
              "loaderAutosCotizar",
              "autosQuote",
              function(loaderAutosCotizar, autosQuote) {
                return loaderAutosCotizar.getClaims();
              }
            ]
          }
        },
        {
          name: "autosQuote.steps",
          url: "/:step",
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              "/polizas/app/autos/autosCotizar2/component/autos-cotizar-p1.html",
              "/polizas/app/autos/autosCotizar2/component/autos-cotizar-p2.html",
              "/polizas/app/autos/autosCotizar2/component/autos-cotizar-p3.html",
              "/polizas/app/autos/autosCotizar2/component/autos-cotizar-p4.html"
            ];
            return c[$stateParam.step];
          },
          controllerProvider: function($stateParams) {
            var c = [undefined, "autosCotizarS1", "autosCotizarS2", "autosCotizarS3"];
            return c[$stateParams.step];
          }
        }
      ],

      resolver: [
        {
          name: "autosQuote",
          moduleName: "appAutos",
          files: [
            "/polizas/app/autos/autosCotizar2/controller/autos-cotizar-p1.js",
            "/polizas/app/autos/autosCotizar2/controller/autos-cotizar-p2.js",
            "/polizas/app/autos/autosCotizar2/controller/autos-cotizar-p3.js",
            "/polizas/app/autos/autosCotizar2/controller/autos-cotizar.js"
          ]
        }
      ]
    },
    {
      name: "autosQuoteToken",
      appCode: "AUTOMOVILES",
      description: "Cotización de auto",
      breads: ["homePolizasAutos"],
      params: { step: null },
      urls: [
        {
          url: "/autos/autosQuote/:token",
          abstract: true,
          parent: "root",
          thenRoutes: ["/autos/autosQuoteToken/:token/1"],
          views: {
            content: {
              controller: "autosCotizarController2",
              templateUrl: "/polizas/app/autos/autosCotizar2/controller/autos-cotizar.html"
            }
          },
          resolve: {
            claims: [
              "loaderAutosCotizar",
              "autosQuoteToken",
              function(loaderAutosCotizar, autosQuoteToken) {
                return loaderAutosCotizar.getClaims();
              }
            ]
          }
        },
        {
          name: "autosQuoteToken.steps",
          url: "/:step",
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              "/polizas/app/autos/autosCotizar2/component/autos-cotizar-p1.html",
              "/polizas/app/autos/autosCotizar2/component/autos-cotizar-p2.html",
              "/polizas/app/autos/autosCotizar2/component/autos-cotizar-p3.html",
              "/polizas/app/autos/autosCotizar2/component/autos-cotizar-p4.html"
            ];
            return c[$stateParam.step];
          },
          controllerProvider: function($stateParams) {
            var c = [undefined, "autosCotizarS1", "autosCotizarS2", "autosCotizarS3"];
            return c[$stateParams.step];
          }
        }
      ],
      resolver: [
        {
          name: "autosQuoteToken",
          moduleName: "appAutos",
          files: [
            "/polizas/app/autos/autosCotizar2/controller/autos-cotizar-p1.js",
            "/polizas/app/autos/autosCotizar2/controller/autos-cotizar-p2.js",
            "/polizas/app/autos/autosCotizar2/controller/autos-cotizar-p3.js",
            "/polizas/app/autos/autosCotizar2/controller/autos-cotizar.js"
          ]
        }
      ]
    },
    {
      name: "hogarHome",
      appCode: "HOGAR",
      url: "/hogar/home",
      description: "Hogar",
      parent: "root",
      views: {
        content: {
          controller: "hogarHomeController",
          templateUrl: "/polizas/app/hogar/home/controller/home.html"
        }
      },
      resolver: [
        {
          name: "hogarHome",
          moduleName: "appAutos",
          files: ["hogarHomeController"]
        }
      ]
    },
    {
      name: "hogarQuote",
      appCode: "HOGAR",
      breads: ["hogarHome"],
      description: "Cotización Hogar",
      params: { step: null },
      urls: [
        {
          url: "/hogar/quote",
          abstract: true,
          parent: "root",
          thenRoutes: ["/hogar/quote/1"],
          views: {
            content: {
              controller: "hogarQuoteController",
              templateUrl: "/polizas/app/hogar/quote/controller/quote.html"
            }
          },
          resolve: {
            homeClaims: [
              "loaderHogarQuoteController",
              "hogarQuote",
              function(loaderHogarQuoteController, hogarQuote) {
                return loaderHogarQuoteController.getClaims(false);
              }
            ]
          }
        },
        {
          name: "hogarQuote.steps",
          url: "/:step",
          params: {
            paramsHogarModule: null
          },
          templateUrl: function($stateParam) {
            var steps = [
              undefined,
              "/polizas/app/hogar/quote/component/quoteS1.html",
              "/polizas/app/hogar/quote/component/quoteS2.html",
              "/polizas/app/hogar/quote/component/quoteS3.html",
              "/polizas/app/hogar/quote/component/quoteS4.html",
              "/polizas/app/hogar/quote/component/quoteS5.html"
            ];
            return steps[$stateParam.step];
          },
          resolve: {
            homeProducts: [
              "loaderHogarQuoteController",
              "hogarQuote",
              function(loaderHogarQuoteController, hogarQuote) {
                return loaderHogarQuoteController.getProducts();
              }
            ],
            homeDocumentTypes: [
              "loaderHogarQuoteController",
              "hogarQuote",
              function(loaderHogarQuoteController, hogarQuote) {
                return loaderHogarQuoteController.getDocumentTypes();
              }
            ],
            homeConstructionYears: [
              "loaderHogarQuoteController",
              "hogarQuote",
              function(loaderHogarQuoteController, hogarQuote) {
                return loaderHogarQuoteController.getConstructionYears();
              }
            ],
            homeCategory: [
              "loaderHogarQuoteController",
              "hogarQuote",
              function(loaderHogarQuoteController, hogarQuote) {
                return loaderHogarQuoteController.getCategory();
              }
            ],
            homeMonitoringAlarm: [
              "loaderHogarQuoteController",
              "hogarQuote",
              function(loaderHogarQuoteController, hogarQuote) {
                return loaderHogarQuoteController.getMonitoringAlarm();
              }
            ],
            homeCurrencyList: [
              "loaderHogarQuoteController",
              "hogarQuote",
              function(loaderHogarQuoteController, hogarQuote) {
                return loaderHogarQuoteController.getCurrencyList();
              }
            ]
          },
          controllerProvider: function($stateParams) {
            var steps = [
              undefined,
              "hogarQuoteS1Controller",
              "hogarQuoteS2Controller",
              "hogarQuoteS3Controller",
              "hogarQuoteS4Controller",
              "hogarQuoteS5Controller"
            ];
            return steps[$stateParams.step];
          }
        }
      ],
      resolver: [
        {
          name: "hogarQuote",
          moduleName: "appAutos",
          files: [
            "hogarQuoteS1Controller",
            "hogarQuoteS2Controller",
            "hogarQuoteS3Controller",
            "hogarQuoteS4Controller",
            "hogarQuoteS5Controller",
            "hogarQuoteController"
          ]
        }
      ]
    },
    {
      name: "hogarGeneratedLetter",
      appCode: "HOGAR",
      breads: ["hogarHome"],
      description: "Carta Generada",
      url: "/hogar/generatedLetter/:numDocument",
      params: {
        paramsHogarModule: null
      },
      parent: "root",
      views: {
        content: {
          controller: "hogarGeneratedLetterController",
          templateUrl: "/polizas/app/hogar/quote/controller/generatedLetter.html"
        }
      },
      resolve: {
        homeQuotation: [
          "loaderHogarGeneratedLetterController",
          "hogarGeneratedLetter",
          "$stateParams",
          function(loaderHogarGeneratedLetterController, hogarGeneratedLetter, $stateParams) {
            return loaderHogarGeneratedLetterController.getQuotation($stateParams.numDocument, true);
          }
        ]
      },
      resolver: [
        {
          name: "hogarGeneratedLetter",
          moduleName: "appAutos",
          files: ["hogarGeneratedLetterController"]
        }
      ]
    },
    {
      name: "hogarEmit",
      appCode: "HOGAR",
      breads: ["hogarHome"],
      description: "Emisión Hogar",
      urls: [
        {
          url: "/hogar/emit/:quotationNumber",
          abstract: true,
          parent: "root",
          thenRoutes: ["/hogar/emit/:quotationNumber/1"],
          views: {
            content: {
              controller: "hogarEmitController",
              templateUrl: "/polizas/app/hogar/emit/controller/emit.html"
            }
          },
          resolve: {
            homeClaims: [
              "loaderHogarEmitController",
              "hogarEmit",
              "$stateParams",
              function(loaderHogarEmitController, hogarEmit, $stateParams) {
                return loaderHogarEmitController.getClaims();
              }
            ],
            homeQuotation: [
              "loaderHogarEmitController",
              "hogarEmit",
              "$stateParams",
              function(loaderHogarEmitController, hogarEmit, $stateParams) {
                return loaderHogarEmitController.getQuotation($stateParams.quotationNumber, true);
              }
            ]
          }
        },
        {
          name: "hogarEmit.steps",
          url: "/:step",
          templateUrl: function($stateParam) {
            var steps = [
              undefined,
              "/polizas/app/hogar/emit/component/emitS1.html",
              "/polizas/app/hogar/emit/component/emitS2.html",
              "/polizas/app/hogar/emit/component/emitS3.html"
            ];
            return steps[$stateParam.step];
          },
          resolve: {
            homeFinancing: [
              "loaderHogarEmitController",
              "hogarEmit",
              "$stateParams",
              function(loaderHogarEmitController, hogarEmit, $stateParams) {
                return loaderHogarEmitController.getFinancingType();
              }
            ],
            homeEndorsee: [
              "loaderHogarEmitController",
              "hogarEmit",
              "$stateParams",
              function(loaderHogarEmitController, hogarEmit, $stateParams) {
                return loaderHogarEmitController.getEndorsee();
              }
            ],
            homeTypes: [
              "loaderHogarEmitController",
              "hogarEmit",
              "$stateParams",
              function(loaderHogarEmitController, hogarEmit, $stateParams) {
                return loaderHogarEmitController.getTypes();
              }
            ],
            homeMaterials: [
              "loaderHogarEmitController",
              "hogarEmit",
              "$stateParams",
              function(loaderHogarEmitController, hogarEmit, $stateParams) {
                return loaderHogarEmitController.getMaterials();
              }
            ]
          },
          controllerProvider: function($stateParams) {
            var steps = [undefined, "hogarEmitS1Controller", "hogarEmitS2Controller", "hogarEmitS3Controller"];
            return steps[$stateParams.step];
          }
        }
      ],
      resolver: [
        {
          name: "hogarEmit",
          moduleName: "appAutos",
          files: ["hogarEmitS1Controller", "hogarEmitS2Controller", "hogarEmitS3Controller", "hogarEmitController"]
        }
      ]
    },
    {
      name: "hogarEmitted",
      appCode: "HOGAR",
      breads: ["hogarHome"],
      description: "Emisión Hogar",
      url: "/hogar/emitted/:emissionNumber",
      parent: "root",
      views: {
        content: {
          controller: "hogarEmittedController",
          templateUrl: "/polizas/app/hogar/emit/controller/emitted.html"
        }
      },
      resolve: {
        homeEmission: [
          "loaderHogarEmittedController",
          "hogarEmitted",
          "$stateParams",
          function(loaderHogarEmittedController, hogarEmitted, $stateParams) {
            return loaderHogarEmittedController.getEmission($stateParams.emissionNumber, true);
          }
        ]
      },
      resolver: [
        {
          name: "hogarEmitted",
          moduleName: "appAutos",
          files: ["hogarEmittedController"]
        }
      ]
    },
    {
      name: "hogarEmitt1",
      appCode: "HOGAR",
      breads: ["hogarHome"],
      description: "Emisión Hogar",
      url: "/hogar/emitt/:numDocument/1",
      parent: "root",
      views: {
        content: {
          controller: "hogarEmitt1Controller",
          templateUrl: "/polizas/app/hogar/emit2/component/emitS1.html"
        }
      },
      resolve: {},
      resolver: [
        {
          name: "hogarEmitt1",
          moduleName: "appAutos",
          files: ["hogarEmitt1Controller"]
        }
      ]
    },
    {
      name: "hogarEmitt2",
      appCode: "HOGAR",
      breads: ["hogarHome"],
      description: "Emisión Hogar",
      url: "/hogar/emitt/:numDocument/2",
      parent: "root",
      params: {
        paramsHogarEmit: null
      },
      views: {
        content: {
          controller: "hogarEmitt2Controller",
          templateUrl: "/polizas/app/hogar/emit2/component/emitS2.html"
        }
      },
      resolve: {},
      resolver: [
        {
          name: "hogarEmitt2",
          moduleName: "appAutos",
          files: ["hogarEmitt2Controller"]
        }
      ]
    },
    {
      name: "hogarEmitt3",
      appCode: "HOGAR",
      breads: ["hogarHome"],
      description: "Emisión Hogar",
      url: "/hogar/emitt/:numDocument/3",
      params: {
        paramsHogarEmit: null
      },
      parent: "root",
      views: {
        content: {
          controller: "hogarEmitt3Controller",
          templateUrl: "/polizas/app/hogar/emit2/component/emitS3.html"
        }
      },
      resolve: {},
      resolver: [
        {
          name: "hogarEmitt3",
          moduleName: "appAutos",
          files: ["hogarEmitt3Controller"]
        }
      ]
    },
    {
      name: "hogarEmittResumen",
      appCode: "HOGAR",
      breads: ["hogarHome"],
      description: "Emisión Hogar",
      url: "/hogar/emitt/resumen/:numDocument",
      params: {
        paramsHogarEmit: null
      },
      parent: "root",
      views: {
        content: {
          controller: "hogarEmittResumenController",
          templateUrl: "/polizas/app/hogar/emit2/component/resumenEmitt.html"
        }
      },
      resolve: {},
      resolver: [
        {
          name: "hogarEmittResumen",
          moduleName: "appAutos",
          files: ["hogarEmittResumenController"]
        }
      ]
    },
    {
      name: "hogarDocuments",
      appCode: "HOGAR",
      breads: ["hogarHome"],
      description: "Documentos hogar",
      url: "/hogar/documents",
      parent: "root",
      views: {
        content: {
          controller: "hogarDocumentsController",
          templateUrl: "/polizas/app/hogar/documents/controller/documents.html"
        }
      },
      resolve: {
        homeProducts: [
          "loaderHogarDocumentsController",
          "hogarDocuments",
          "$stateParams",
          "oimPrincipal",
          function(loaderHogarDocumentsController, hogarDocuments, $stateParams, oimPrincipal) {
            return loaderHogarDocumentsController.getProducts(
              constants.module.polizas.hogar.codeCompany,
              constants.module.polizas.hogar.codeRamo,
              false
            );
          }
        ]
      },
      resolver: [
        {
          name: "hogarDocuments",
          moduleName: "appAutos",
          files: ["hogarDocumentsController"]
        }
      ]
    },
    {
      name: "getQuotesHogar",
      appCode: "HOGAR",
      breads: ["hogarHome"],
      description: "Cotización hogar",
      url: "/hogar/getquotes",
      parent: "root",
      views: {
        content: {
          controller: "hogarDocController",
          templateUrl: "/polizas/app/hogar/documents/controller/documentsEmit.html"
        }
      },
      resolve: {
        homeProducts: [
          "loaderQuoteHogarDocumentsController",
          "getQuotesHogar",
          "$stateParams",
          "oimPrincipal",
          function(loaderQuoteHogarDocumentsController, getQuotesHogar, $stateParams, oimPrincipal) {
            return loaderQuoteHogarDocumentsController.getProducts(
              constants.module.polizas.hogar.codeCompany,
              constants.module.polizas.hogar.codeRamo,
              false
            );
          }
        ]
      },
      resolver: [
        {
          name: "getQuotesHogar",
          moduleName: "appAutos",
          files: ["/polizas/app/hogar/documents/controller/documentsEmit.js"]
        }
      ]
    },
    {
      name: "homeCompany",
      appCode: "EMPRESAS",
      url: "/compania/home",
      description: "Empresa",
      parent: "root",
      views: {
        content: {
          controller: "homeCompany",
          templateUrl: "/polizas/app/empresa/home.html"
        }
      },
      resolver: [
        {
          name: "newquot",
          moduleName: "appCompany",
          files: ["homeCompany"]
        },
        {
          name: "empresaTemplates",
          moduleName: "oim.polizas.empresa",
          files: ["empresaTemplates"]
        }
      ]
    },
    {
      name: "companyresumen",
      description: "Cotización Empresa",
      appCode: "EMPRESAS",
      parent: "root",
      breads: ["homeCompany"],
      params: { info: null },
      url: "/cotiza/compania/saved",
      views: {
        content: {
          controller: "resumenCotizaEmpresaController",
          templateUrl: "/polizas/app/empresa/cotiza/component/resumen.html"
        }
      },
      resolver: [
        {
          name: "resumenEmpresa",
          moduleName: "appAutos",
          files: ["resumenCotizaEmpresa"]
        },
        {
          name: "empresaTemplates",
          moduleName: "oim.polizas.empresa",
          files: ["empresaTemplates"]
        }
      ]
    },
    {
      name: "companyquot",
      description: "Cotización Empresa",
      breads: ["homeCompany"],
      appCode: "EMPRESAS",
      resolver: [
        {
          name: "empresaTemplates",
          moduleName: "oim.polizas.empresa",
          files: ["empresaTemplates"]
        }
      ],
      urls: [
        {
          name: "companyquot",
          url: "/cotiza/compania/newquot",
          abstract: true,
          parent: "root",
          views: {
            content: {
              controller: "cotizacionCompanyController",
              templateUrl: "/polizas/app/empresa/cotiza/component/cotizacionCompany.html"
            }
          },
          thenRoutes: ["/cotiza/compania/newquot/1"],
          resolver: [
            {
              name: "newquot",
              moduleName: "appAutos",
              files: ["cotizacionCompany", "companyPolizaData", "companyRiskData", "companyCalcPrim", "riskItem"]
            }
          ]
        },
        {
          name: "companyquot.steps",
          url: "/:step",
          templateUrl: function($stateParam) {
            return [
              undefined,
              "/polizas/app/empresa/cotiza/component/polizaData.html",
              "/polizas/app/empresa/cotiza/component/riskData.html",
              "/polizas/app/empresa/cotiza/component/calcPrim.html"
            ][$stateParam.step];
          },
          resolve: {
            lookupCompanyData: [
              "newquot",
              "companyData",
              function(newquot, companyData) {
                return companyData.get_Data();
              }
            ]
          },
          controllerProvider: function($stateParams) {
            return [undefined, "polizaDataController", "riskDataController", "calcPrimController"][$stateParams.step];
          }
        }
      ]
    },

    {
      name: "emitEmpresa",
      appCode: "EMPRESAS",
      breads: ["homeCompany"],
      description: "Emitir póliza de empresa",
      url: "/emitir/compania",
      parent: "root",
      views: {
        content: {
          controller: "bandejaEmitController",
          templateUrl: "/polizas/app/empresa/emit/component/bandejaEmit.html"
        }
      },
      resolve: {},
      resolver: [
        {
          name: "emitEmpresa",
          moduleName: "appAutos",
          files: ["bandejaEmitController"]
        }
      ]
    },

    {
      name: "emitResumen",
      appCode: "EMPRESAS",
      breads: ["homeCompany"],
      description: "Cotización Empresa",
      url: "/emitir/compania/resumen/:numDoc",
      parent: "root",
      views: {
        content: {
          controller: "resumenEmitController",
          templateUrl: "/polizas/app/empresa/emit/component/resumenEmit.html"
        }
      },
      resolver: [
        {
          name: "emitEmpresaResumen",
          moduleName: "appAutos",
          files: ["/polizas/app/empresa/emit/controller/resumenEmitController.js"]
        },
        {
          name: "empresaTemplates",
          moduleName: "oim.polizas.empresa",
          files: ["empresaTemplates"]
        }
      ]
    },
    {
      name: "empresaCotizar",
      code: "",
      breads: ["homeCompany"],
      params: { step: null },
      urls: [
        {
          url: "/empresa/cotizar",
          abstract: true,
          parent: "root",
          thenRoutes: ["empresa/cotizar/1"],
          views: {
            content: {
              controller: "empresaCotizarController",
              templateUrl: "/polizas/app/empresa/cotizar/controller/empresa-cotizar.html"
            }
          },
          resolve: {}
        },
        {
          name: "empresaCotizar.steps",
          url: "/:step",
          templateUrl: function($stateParam) {
            var steps = [
              undefined,
              "/polizas/app/empresa/cotizar/component/empresa-cotizar-p1.html",
              "/polizas/app/empresa/cotizar/component/empresa-cotizar-p2.html",
              "/polizas/app/empresa/cotizar/component/empresa-cotizar-p3.html"
            ];
            return steps[$stateParam.step];
          },
          resolve: {},
          controllerProvider: function($stateParams) {
            var steps = [
              undefined,
              "empresaCotizarS1Controller",
              "empresaCotizarS2Controller",
              "empresaCotizarS3Controller"
            ];
            return steps[$stateParams.step];
          }
        }
      ],
      resolver: [
        {
          name: "empresaCotizar",
          moduleName: "appAutos",
          files: [
            "empresaCotizarS1Controller",
            "empresaCotizarS2Controller",
            "empresaCotizarS3Controller",
            "empresaCotizarController"
          ]
        },
        {
          name: "empresaTemplates",
          moduleName: "oim.polizas.empresa",
          files: ["empresaTemplates"]
        }
      ]
    },
    {
      name: "empresaEmit",
      breads: ["homeCompany"],
      description: "Emisión Empresa",
      params: {
        step: null
      },
      urls: [
        {
          url: "/empresa/emit/:quoteNumber",
          abstract: true,
          parent: "root",
          thenRoutes: ["/empresa/emit/:quoteNumber/1"],
          views: {
            content: {
              controller: "empresaEmitController",
              templateUrl: "/polizas/app/empresa/emit/controller/emit.html"
            }
          },
          resolve: {
            empresaEmissionStep: [
              "loaderEmpresaEmitController",
              "empresaEmit",
              "$stateParams",
              function(loaderEmpresaEmitController, empresaEmit, $stateParams) {
                return loaderEmpresaEmitController.getEmissionStep($stateParams.quoteNumber, true);
              }
            ]
          }
        },
        {
          name: "empresaEmit.steps",
          url: "/:step",
          params: {},
          templateUrl: function($stateParam) {
            var steps = [
              undefined,
              "/polizas/app/empresa/emit/component/paso1Emit.html",
              "/polizas/app/empresa/emit/component/paso2Emit.html",
              "/polizas/app/empresa/emit/component/paso3Emit.html",
              "/polizas/app/empresa/emit/component/paso4Emit.html"
            ];
            return steps[$stateParam.step];
          },
          resolve: {
            empresaListThirdStep: [
              "loaderEmpresaEmitController",
              "empresaEmit",
              "$stateParams",
              function(loaderEmpresaEmitController, empresaEmit, $stateParams) {
                return loaderEmpresaEmitController.getListThirdStep(true);
              }
            ],
            empresaListFourthStep: [
              "loaderEmpresaEmitController",
              "empresaEmit",
              "$stateParams",
              function(loaderEmpresaEmitController, empresaEmit, $stateParams) {
                return loaderEmpresaEmitController.getListFourthStep(true);
              }
            ]
          },
          controllerProvider: function($stateParams) {
            var steps = [
              undefined,
              "empresaEmitS1Controller",
              "empresaEmitS2Controller",
              "empresaEmitS3Controller",
              "empresaEmitS4Controller"
            ];
            return steps[$stateParams.step];
          }
        }
      ],
      resolver: [
        {
          name: "empresaEmit",
          moduleName: "appAutos",
          files: [
            "empresaEmitS1Controller",
            "empresaEmitS2Controller",
            "empresaEmitS3Controller",
            "empresaEmitS4Controller",
            "empresaEmitController"
          ]
        }
      ]
    },
    {
      name: "emitEmpresaResumen",
      appCode: "EMPRESAS",
      breads: ["homeCompany"],
      description: "Emisión de empresa",
      params: {
        emissionNumber: null
      },
      url: "/empresa/emitted/:emissionNumber",
      parent: "root",
      views: {
        content: {
          controller: "empresaEmittedController",
          templateUrl: "/polizas/app/empresa/emit/controller/emitted.html"
        }
      },
      resolve: {},
      resolver: [
        {
          name: "empresaEmitted",
          moduleName: "appAutos",
          files: ["empresaEmittedController"]
        }
      ]
    },
    {
      name: "companyDocuments",
      appCode: "EMPRESAS",
      breads: ["homeCompany"],
      description: "Documentos empresa",
      url: "/compania/documents",
      parent: "root",
      views: {
        content: {
          controller: "companyDocumentsController",
          templateUrl: "/polizas/app/empresa/documents/controller/documents.html"
        }
      },
      resolve: {
        companyProducts: [
          "loaderCompanyDocumentsController",
          "companyDocuments",
          "$stateParams",
          "oimPrincipal",
          function(loaderCompanyDocumentsController, companyDocuments, $stateParams, oimPrincipal) {
            return loaderCompanyDocumentsController.getProducts(
              constants.module.polizas.empresas.companyCode,
              constants.module.polizas.empresas.codeRamo,
              false
            );
          }
        ]
      },
      resolver: [
        {
          name: "companyDocuments",
          moduleName: "appAutos",
          files: ["companyDocumentsController"]
        },
        {
          name: "empresaTemplates",
          moduleName: "oim.polizas.empresa",
          files: ["empresaTemplates"]
        }
      ]
    },

    {
      name: "homePolizasAccidentes",
      code: "102",
      url: "/accidentes/home",
      description: "Accidentes",
      parent: "root",
      views: {
        content: {
          controller: "accidentesHomeController",
          templateUrl: "/polizas/app/accidentes/home/controller/accidentes-home.html"
        }
      },
      resolver: [
        {
          name: "homePolizasAccidentes",
          moduleName: "appAccidentes",
          files: ["/polizas/app/accidentes/home/controller/accidentes-home.js"]
        }
      ]
    },

    {
      name: "accidentesQuote",
      code: "102",
      url: "/accidentes/quote",
      description: "Cotización accidentes",
      breads: ["homePolizasAccidentes"],
      controller: "accidentesQuoteController",
      templateUrl: "/polizas/app/accidentes/quote/component/accidentes-quote.html",
      parent: "root",
      views: {
        content: {
          controller: "accidentesQuoteController",
          templateUrl: "/polizas/app/accidentes/quote/component/accidentes-quote.html"
        }
      },

      resolve: {
        claims: [
          "loaderAccidentesQuoteController",
          "accidentesQuote",
          function(loaderAccidentesQuoteController, accidentesQuote) {
            return loaderAccidentesQuoteController.getClaims();
          }
        ]
      },

      resolver: [
        {
          name: "accidentesQuote",
          moduleName: "appAccidentes",
          files: ["/polizas/app/accidentes/quote/controller/accidentes-quote.js"]
        }
      ]
    },

    {
      name: "getAccidente",
      code: "102",
      breads: ["homePolizasAccidentes"],
      description: "Cotización de accidentes",
      url: "/accidentes/getAccidente/:quotation",
      controller: "accidenteGetDocController",
      templateUrl: "/polizas/app/accidentes/doc/component/accidentesQGuardado.html",
      parent: "root",
      views: {
        content: {
          controller: "accidenteGetDocController",
          templateUrl: "/polizas/app/accidentes/doc/component/accidentesQGuardado.html"
        }
      },

      resolver: [
        {
          name: "getAccidente",
          moduleName: "appAccidentes",
          files: ["/polizas/app/accidentes/doc/controller/accidentesGuardado.js"]
        }
      ]
    },

    {
      name: "getQuotesAccidente",
      code: "102",
      url: "/accidentes/getquotes",
      controller: "accidenteDocController",
      description: "Emitir póliza de accidentes",
      breads: ["homePolizasAccidentes"],
      templateUrl: "/polizas/app/accidentes/doc/component/accidente-documento.html",
      parent: "root",
      views: {
        content: {
          controller: "accidenteDocController",
          templateUrl: "/polizas/app/accidentes/doc/component/accidente-documento.html"
        }
      },

      resolver: [
        {
          name: "getQuotesAccidente",
          moduleName: "appAccidentes",
          files: ["/polizas/app/accidentes/doc/controller/accidente-documento.js"]
        }
      ]
    },

    {
      name: "accidentesEmit",
      code: "102",
      description: "Emitir póliza de accidentes",
      breads: ["homePolizasAccidentes"],
      urls: [
        {
          url: "/accidentes/emit/:quotationNumber",
          abstract: true,
          parent: "root",
          views: {
            content: {
              controller: "accidentesEmitController",
              templateUrl: "/polizas/app/accidentes/emit/controller/emit.html"
            }
          },
          thenRoutes: ["/accidentes/emit/:quotationNumber/1"],
          resolve: {}
        },
        {
          name: "accidentesEmit.steps",
          url: "/:step",
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              "/polizas/app/accidentes/emit/component/emitS1.html",
              "/polizas/app/accidentes/emit/component/emitS2.html"
            ];
            return c[$stateParam.step];
          },
          resolve: {},
          controllerProvider: function($stateParams) {
            var c = [undefined, "accidentesEmitS1Controller", "accidentesEmitS2Controller"];
            return c[$stateParams.step];
          }
        }
      ],

      resolver: [
        {
          name: "accidentesEmit",
          moduleName: "appAutos",
          files: ["accidentesEmitS1Controller", "accidentesEmitS2Controller", "accidentesEmitController"]
        }
      ]
    },
    {
      name: "accidentesEmitted",
      code: "102",

      urls: [
        {
          url: "/accidentes/emitted/:quotationNumber",
          abstract: false,
          parent: "root",
          views: {
            content: {
              controller: "accidentesEmittedController",
              templateUrl: "/polizas/app/accidentes/doc/component/accidentesEmitted.html"
            }
          },
          thenRoutes: ["/accidentes/emitted/:quotationNumber"],
          resolve: {}
        }
      ],

      resolver: [
        {
          name: "accidentesEmitted",
          moduleName: "appAccidentes",
          files: ["/polizas/app/accidentes/doc/controller/accidentesEmitGuardado.js"]
        }
      ]
    },
    {
      name: "accidentesDocuments",
      appCode: "",
      breads: ["homePolizasAccidentes"],
      description: "Documentos accidentes",
      url: "/accidentes/documents",
      parent: "root",
      views: {
        content: {
          controller: "accidentesDocumentsController",
          templateUrl: "/polizas/app/accidentes/documents/controller/documents.html"
        }
      },
      resolve: {
        accidentsProducts: [
          "loaderAccidentesDocumentsController",
          "accidentesDocuments",
          "$stateParams",
          "oimPrincipal",
          function(loaderAccidentesDocumentsController, accidentesDocuments, $stateParams, oimPrincipal) {
            return loaderAccidentesDocumentsController.getProducts(
              constants.module.polizas.accidentes.companyCode,
              constants.module.polizas.accidentes.codeRamo,
              false
            );
          }
        ]
      },
      resolver: [
        {
          name: "accidentesDocuments",
          moduleName: "appAutos",
          files: ["accidentesDocumentsController"]
        }
      ]
    },
    {
      name: "sctrHome",
      code: "",
      url: "/sctr/home",
      description: "SCTR",
      parent: "root",
      views: {
        content: {
          controller: "sctrHomeController",
          templateUrl: "/polizas/app/sctr/home/controller/sctr-home.html"
        }
      },
      resolve: {
        isAgentBloqued: [
          "sctrAgentBloked",
          "sctrBlk",
          function(sctrAgentBloked, sctrBlk) {
            return sctrAgentBloked.isBloked();
          }
        ]
      },
      resolver: [
        {
          name: "sctrBlk",
          moduleName: "appAutos",
          files: ["sctrBloked"]
        },
        {
          name: "sctrHome",
          moduleName: "appAutos",
          files: ["/polizas/app/sctr/home/controller/sctr-home.js"]
        }
      ]
    },

    {
      name: "sctrDocumentos",
      code: [
        116,
        117,
        147,
        149,
        {
          value: 144,
          valueProd: 158
        }
      ],
      params: { step: null },
      description: "Documentos SCTR",
      breads: ["sctrHome"],
      urls: [
        {
          url: "/sctr/sctrDocumentos",
          controller: "sctrDocumentosController",
          templateUrl: "/polizas/app/sctr/sctrDocumentos/controller/sctr-documentos.html",
          parent: "root",
          views: {
            content: {
              controller: "sctrDocumentosController",
              templateUrl: "/polizas/app/sctr/sctrDocumentos/controller/sctr-documentos.html"
            }
          },
          resolve: {
            claims: [
              "loaderSctrDocumentosQuoteController",
              "sctrDocumentos",
              function(loaderSctrDocumentosQuoteController, sctrDocumentos) {
                return loaderSctrDocumentosQuoteController.getClaims();
              }
            ]
          }
        }
      ],
      resolver: [
        {
          name: "sctrDocumentos",
          moduleName: "appAutos",
          files: ["/polizas/app/sctr/sctrDocumentos/controller/sctr-documentos.js"],
          resolveTemplate: true
        }
      ]
    },

    {
      name: "bandejaSCTR",
      code: "",
      params: { step: null },
      description: "Documentos SCTR",
      breads: ["sctrHome"],
      urls: [
        {
          url: "/sctr/bandejaSCTR/:documentNumber",
          controller: "bandejaSCTRController",
          templateUrl: "/polizas/app/sctr/bandejaSCTR/controller/sctr-documentos.html",
          parent: "root",
          views: {
            content: {
              controller: "bandejaSCTRController",
              templateUrl: "/polizas/app/sctr/bandejaSCTR/controller/sctr-documentos.html"
            }
          },
          resolve: {
            claims: [
              "loaderSctrDocumentosQuoteController",
              "bandejaSCTR",
              function(loaderSctrDocumentosQuoteController, bandejaSCTR) {
                return loaderSctrDocumentosQuoteController.getClaims();
              }
            ]
          }
        }
      ],
      resolver: [
        {
          name: "bandejaSCTR",
          moduleName: "appAutos",
          files: ["/polizas/app/sctr/bandejaSCTR/controller/sctr-documentos.js"],
          resolveTemplate: true
        }
      ]
    },

    {
      name: "sctrEmitir",
      code: {
        param: "tipo",
        access: [
          {
            when: "PC",
            then: [132, 133, 139, 169, 165, 134],
            thenProd: [132, 133, 139, 169, 165, 134]
          },
          {
            when: "PN",
            then: [135, 136, 138, 170, 164, 137],
            thenProd: [135, 136, 138, 170, 164, 137]
          }
        ]
      },
      description: "Emitir póliza SCTR",
      breads: ["sctrHome"],
      params: { step: null },
      urls: [
        {
          url: "/sctr/emitir/:tipo/:quotation",
          abstract: true,
          parent: "root",
          thenRoutes: ["sctr/emitir/:tipo/:quotation/1"],
          views: {
            content: {
              controller: "sctrEmitirController",
              templateUrl: "/polizas/app/sctr/emitir/controller/sctr-emitir.html"
            }
          },
          resolve: {}
        },
        {
          name: "sctrEmitir.steps",
          url: "/:step",
          templateUrl: function($stateParam) {
            var steps = [
              undefined,
              "/polizas/app/sctr/emitir/component/sctr-emitir-p1.html",
              "/polizas/app/sctr/emitir/component/sctr-emitir-p2.html",
              "/polizas/app/sctr/emitir/component/sctr-emitir-p3.html",
              "/polizas/app/sctr/emitir/component/sctr-emitir-p4.html",
              "/polizas/app/sctr/emitir/component/sctr-emitir-p5.html"
            ];
            return steps[$stateParam.step];
          },
          resolve: {},
          controllerProvider: function($stateParams) {
            var steps = [
              undefined,
              "sctrEmitirS1Controller",
              "sctrEmitirS2Controller",
              "sctrEmitirS3Controller",
              "sctrEmitirS4Controller",
              "sctrEmitirS5Controller"
            ];
            return steps[$stateParams.step];
          }
        }
      ],
      resolver: [
        {
          name: "sctrEmitir",
          moduleName: "appAutos",
          files: [
            "/polizas/app/sctr/emitir/controller/sctr-emitir-p1.js",
            "/polizas/app/sctr/emitir/controller/sctr-emitir-p2.js",
            "/polizas/app/sctr/emitir/controller/sctr-emitir-p3.js",
            "/polizas/app/sctr/emitir/controller/sctr-emitir-p4.js",
            "/polizas/app/sctr/emitir/controller/sctr-emitir-p5.js",
            "/polizas/app/sctr/emitir/controller/sctr-emitir.js",
            "sctrMngSearchActivity",
            "sctrMngSearchSubactivity"
          ]
        }
      ]
    },
    {
      name: "sctrSuscriptores",
      code: [
        130,
        {
          value: 80,
          valueProd: 130
        }
      ],
      url: "/sctr/mantenimiento",
      description: "Mantenimiento de suscriptores",
      breads: ["sctrHome"],
      parent: "root",
      views: {
        content: {
          controller: "sctrMantenimientoController",
          templateUrl: "/polizas/app/sctr/mantenimiento/controller/sctr-mantenimiento.html"
        }
      },
      resolve: {
        claims: [
          "loaderSctrSuscriptoresController",
          "sctrSuscriptores",
          function(loaderSctrSuscriptoresController, sctrSuscriptores) {
            return loaderSctrSuscriptoresController.getClaims();
          }
        ]
      },
      resolver: [
        {
          name: "sctrSuscriptores",
          moduleName: "appAutos",
          files: ["/polizas/app/sctr/mantenimiento/controller/sctr-mantenimiento.js"]
        }
      ]
    },
    {
      name: "homeGeneral",
      params: { tab: null },
      url: "/general",
      description: "General",
      breads: [],
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/digital-business/views/home-digital-business/home-digital-business.template.html",
          controller: "homeDigitalBusinessController",
          controllerAs: "vm"
        }
      },
      resolver: [
        {
          name: "homeGeneral",
          moduleName: "appAutos",
          files: [
            "homeDigitalBusinessController"
          ]
        }
      ]
    },
    {
      name: "digitalBusiness",
      params: { tab: null },
      url: "/digital-business",
      description: "Mantenimiento de Plantillas",
      breads: ["homeGeneral"],
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/digital-business/views/search-digital-business/search-digital-business.template.html",
          controller: "searchDigitalBusinessController",
          controllerAs: "vm"
        }
      },
      resolver: [
        {
          name: "digitalBusiness",
          moduleName: "appAutos",
          files: [
            "searchDigitalBusinessController",
            "mpfPopupDigitalBusiness",
            "mpfItemDigitalBusiness",
            "mpfSharedDigitalBusiness",
            "digitalBusinessService"
          ]
        }
      ]
    },
    {
      name: "sctrManagment",
      code: [
        288,
        {
          value: 288,
          valueProd: 288
        }
      ],
      params: { tab: null },
      url: "/sctr/managment/:manager/:tab",
      description: "Mantenimiento",
      breads: ["sctrHome"],
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/sctr/mantenimiento/controller/managment.html"
        }
      },
      resolver: [
        {
          name: "sctrManagment",
          moduleName: "appAutos",
          files: [
            "sctrMngContainerTabs",
            "sctrMngSubActivities",
            "sctrMngBloquedAgent",
            "sctrMngManagerUploadRates",
            "sctrMngEditorSubActivity",
            "sctrMngSearchActivity",
            "sctrMngUploadRates",
            "sctrMngUploadResult",
            "sctrMngUploadModal"
          ]
        }
      ]
    },
    {
      name: "sctrMantenimientoTasas",
      url: "/sctr/mantenimiento_tasas",
      description: "Mantenimiento de tasas",
      breads: ["sctrHome"],
      parent: "root",
      views: {
        content: {
          controller: "sctrMantenimientoTasasController",
          templateUrl: "/polizas/app/sctr/mantenimientoTasas/controller/sctr-mantenimientoTasas.html"
        }
      },
      resolver: [
        {
          name: "sctrMantenimientoTasas",
          moduleName: "appAutos",
          files: ["/polizas/app/sctr/mantenimientoTasas/controller/sctr-mantenimientoTasas.js"]
        }
      ]
    },
    {
      name: "sctrParametros",
      code: [
        {
          value: 81,
          valueProd: 131
        }
      ],
      description: "Mantenimiento de parámetros",
      breads: ["sctrHome"],
      url: "/sctr/parametros",
      parent: "root",
      views: {
        content: {
          controller: "sctrParametrosController",
          templateUrl: "/polizas/app/sctr/mantenimiento/controller/sctr-parametros.html"
        }
      },

      resolver: [
        {
          name: "sctrParametros",
          moduleName: "appAutos",
          files: ["/polizas/app/sctr/mantenimiento/controller/sctr-parametros.js"]
        }
      ]
    },
    {
      name: "sctrParametrosDetalle",
      code: "",
      description: "Detalle de parámetros",
      breads: ["sctrHome", "sctrParametros"],

      urls: [
        {
          url: "/sctr/parametros/detalle/:number",
          abstract: false,
          parent: "root",
          views: {
            content: {
              controller: "sctrParametrosDetalleController",
              templateUrl: "/polizas/app/sctr/mantenimiento/controller/sctr-parametros-detalle.html"
            }
          },
          thenRoutes: ["/sctr/parametros/detalle/:number"],
          resolve: {}
        }
      ],

      parent: "root",
      views: {
        content: {
          controller: "sctrParametrosDetalleController",
          templateUrl: "/polizas/app/sctr/mantenimiento/controller/sctr-parametros-detalle.html"
        }
      },

      resolver: [
        {
          name: "sctrParametros",
          moduleName: "appAutos",
          files: ["/polizas/app/sctr/mantenimiento/controller/sctr-parametros-detalle.js"]
        }
      ]
    },
    {
      name: "homePolizasVidas",
      currentAppID: "CWVI",
      url: "/vida/home",
      description: "Vida",
      parent: "root",
      views: {
        content: {
          controller: "ctrlHomeVida",
          templateUrl: "/polizas/app/vida/home/controller/vida-home.html"
        }
      },
      resolver: [
        {
          name: "homePolizasVidas",
          moduleName: "appVida",
          files: ["/polizas/app/vida/home/controller/vida-home.js"]
        }
      ]
    },
    {
      name: "vidacotizar",
      code: [6, 705],
      currentAppID: "CWVI",
      params: {
        step: null
      },
      description: "Cotización póliza vida",
      breads: ["homePolizasVidas"],
      urls: [
        {
          url: "/vida/cotizar",
          abstract: true,
          parent: "root",
          thenRoutes: ["/vida/cotizar/1"],
          views: {
            content: {
              controller: "vidaCotizarController",
              templateUrl: "/polizas/app/vida/cotizar/controller/vida-cotizar.html"
            }
          }
        },
        {
          name: "vidacotizar.steps",
          url: "/:step",
          params: {
            quotationNumber: null
          },
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              "/polizas/app/vida/cotizar/component/vida-cotizar-p1.html",
              "/polizas/app/vida/cotizar/component/vida-cotizar-p2.html"
            ];
            return c[$stateParam.step];
          },
          resolve: {
            quotation: [
              "loaderVidaController",
              "vidacotizar",
              "$stateParams",
              function(loaderVidaController, vidacotizar, $stateParams) {
                return $stateParams.quotationNumber
                  ? loaderVidaController.getQuotation($stateParams.quotationNumber, true)
                  : null;
              }
            ],
            quoteLists: [
              "loaderVidaController",
              "vidacotizar",
              function(loaderVidaController, vidacotizar) {
                return loaderVidaController.loadLists(true);
              }
            ]
          },
          controllerProvider: function($stateParams) {
            var c = [undefined, "vidaCotizarS1", "vidaCotizarS2"];
            return c[$stateParams.step];
          }
        }
      ],

      resolver: [
        {
          name: "vidacotizar",
          moduleName: "appVida",
          files: ["vidaCotizarS1", "vidaCotizarS2", "vidaCotizarController"]
        }
      ]
    },
    {
      name: "vidaCotizacionGuardada",
      currentAppID: "CWVI",
      description: "Cotización póliza vida",
      breads: ["homePolizasVidas"],
      params: { step: null },
      urls: [
        {
          url: "/vida/cotizacionGuardada",
          controller: "vidaCotizacionGuardadaController",
          templateUrl: "/polizas/app/vida/cotizacionGuardada/controller/vida-cotizacion-guardada.html",

          parent: "root",

          views: {
            content: {
              controller: "vidaCotizacionGuardadaController",
              templateUrl: "/polizas/app/vida/cotizacionGuardada/controller/vida-cotizacion-guardada.html"
            }
          },
          resolve: {}
        }
      ],
      resolver: [
        {
          name: "vidaCotizacionGuardada",

          moduleName: "appVida",
          files: ["/polizas/app/vida/cotizacionGuardada/controller/vida-cotizacion-guardada.js"],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "vidaQuoted",
      currentAppID: "CWVI",
      breads: ["homePolizasVidas"],
      description: "Cotización póliza vida",
      url: "/vida/quoted/:quotationNumber",
      params: {
        comesQuote: false
      },
      parent: "root",
      views: {
        content: {
          controller: "vidaQuotedController",
          templateUrl: "/polizas/app/vida/cotizar/controller/quoted.html"
        }
      },
      resolve: {
        liveQuotation: [
          "loaderVidaQuotedController",
          "vidaQuoted",
          "$stateParams",
          function(loaderVidaQuotedController, vidaQuoted, $stateParams) {
            return loaderVidaQuotedController.getQuotation($stateParams.quotationNumber, true);
          }
        ]
      },
      resolver: [
        {
          name: "vidaQuoted",

          moduleName: "appAutos",
          files: ["vidaQuotedController"]
        }
      ]
    },
    {
      name: "vidaDocuments",

      currentAppID: "CWVI",
      breads: ["homePolizasVidas"],
      description: "Documentos vida",
      params: { doc: null },
      urls: [
        {
          url: "/vida/documents",
          abstract: true,
          parent: "root",
          thenRoutes: ["/vida/documents/pendingQuotes"],

          views: {
            content: {
              controller: "vidaDocumentsController",
              templateUrl: "/polizas/app/vida/documents/controller/documents.html"
            }
          },
          resolve: {}
        },
        {
          name: "vidaDocuments.docs",
          url: "/:doc",
          params: {},
          templateUrl: function($stateParam) {
            var docs = {
              pendingQuotes: {
                code: 1,
                name: "pendingQuotes",
                html: "/polizas/app/vida/documents/component/pendingQuotes.html"
              },
              emittedQuotes: {
                code: 2,
                name: "emittedQuotes",
                html: "/polizas/app/vida/documents/component/emittedQuotes.html"
              },
              referred: {
                code: 3,
                name: "referred",
                html: "/polizas/app/vida/documents/component/referred.html"
              }
            };
            var vDoc = docs[$stateParam.doc];
            return vDoc.html;
          },
          resolve: {
            vidaProducts: [
              "loaderVidaDocumentsController",
              "vidaDocuments",
              function(loaderVidaDocumentsController, vidaDocuments) {
                return loaderVidaDocumentsController.getProducts(true);
              }
            ]
          },
          controllerProvider: function($stateParams) {
            var docs = {
              pendingQuotes: {
                code: 1,
                name: "pendingQuotes",
                js: "vidaPendingQuotesController"
              },
              emittedQuotes: {
                code: 2,
                name: "emittedQuotes",
                js: "vidaEmittedQuotesController"
              },
              referred: {
                code: 3,
                name: "referred",
                js: "vidaReferredController"
              }
            };
            var vDoc = docs[$stateParams.doc];
            return vDoc.js;
          }
        }
      ],
      resolver: [
        {
          name: "vidaDocuments",
          moduleName: "appAutos",
          files: [
            "vidaPendingQuotesController",
            "vidaEmittedQuotesController",
            "vidaReferredController",
            "vidaDocumentsController"
          ]
        }
      ]
    },
    {
      name: "vidaMaintenance",
      code: "10",
      currentAppID: "CWVI",
      breads: ["homePolizasVidas"],
      description: "Mantenimiento de parámetros",
      url: "/vida/maintenance",
      parent: "root",
      views: {
        content: {
          controller: "vidaMaintenanceController",
          templateUrl: "/polizas/app/vida/maintenance/controller/maintenance.html"
        }
      },
      resolve: {},
      resolver: [
        {
          name: "vidaMaintenance",
          moduleName: "appAutos",
          files: ["vidaMaintenanceController"]
        }
      ]
    },
    {
      name: "vidaFileInterest",
      code: "9",
      currentAppID: "CWVI",
      breads: ["homePolizasVidas"],
      description: "Archivos de interés",
      url: "/vida/fileInterest",
      parent: "root",
      views: {
        content: {
          controller: "vidaFileInterestController",
          templateUrl: "/polizas/app/vida/fileInterest/controller/fileInterest.html"
        }
      },
      resolve: {},
      resolver: [
        {
          name: "vidaFileInterest",
          moduleName: "appAutos",
          files: ["vidaFileInterestController"]
        }
      ]
    },
    {
      name: "vidaSummaryReport",
      code: "5",
      currentAppID: "CWVI",
      breads: ["homePolizasVidas"],
      description: "Informe de resumen",
      url: "/vida/summaryReport",
      parent: "root",
      views: {
        content: {
          controller: "vidaSummaryReportController",
          templateUrl: "/polizas/app/vida/summaryReport/controller/summaryReport.html"
        }
      },
      resolve: {},
      resolver: [
        {
          name: "vidaSummaryReport",
          moduleName: "appAutos",
          files: ["vidaSummaryReportController"]
        }
      ]
    },
    {
      name: "vidaResumenComparativo",
      code: "6",
      currentAppID: "CWVI",
      breads: ["homePolizasVidas"],
      description: "Resumen comparativo",
      url: "/vida/resumenComparativo",
      parent: "root",
      views: {
        content: {
          controller: "vidaResumenComparativoController",
          templateUrl: "/polizas/app/vida/resumenComparativo/controller/resumenComparativo.html"
        }
      },
      resolve: {
      },
      resolver: [
        {
          name: "vidaResumenComparativo",
          moduleName: "appAutos",
          files: ["vidaResumenComparativoController"]
        }
      ]
    },
    {
      name: "vidaResumenComparativoDetalle",
      currentAppID: "CWVI",
      breads: ["homePolizasVidas"],
      description: "Resumen comparativo detalle",
      url: "/vida/resumenComparativoDetalle/",
      params: {
      },
      parent: "root",
      views: {
        content: {
          controller: "vidaResumenComparativoDetalleController",
          templateUrl: "/polizas/app/vida/resumenComparativo/detalle/resumenComparativoDetalle.html"
        }
      },
      resolve: {
      },
      resolver: [
        {
          name: "vidaResumenComparativoDetalle",
          moduleName: "appAutos",
          files: ["vidaResumenComparativoDetalleController"]
        }
      ]
    },
    {
      name: "vidaemit",
      code: [2382,2262],
      currentAppID: "CWVI",
      params: {
        step: null,
        quotationNumber: null
      },
      description: "Emisión póliza vida",
      breads: ["homePolizasVidas"],
      urls: [
        {
          url: "/vida/emit/:quotationNumber",
          abstract: true,
          parent: "root",
          thenRoutes: ["/vida/emit/:quotationNumber/1"],
          views: {
            content: {
              controller: "vidaEmitController",
              templateUrl: "/polizas/app/vida/emit/controller/vida-emit.html"
            }
          },
          resolve: {
            liveQuotation: [
              "loaderVidaEmitController",
              "vidaemit",
              "$stateParams",
              function(loaderVidaEmitController, vidaemit, $stateParams) {
                if ($stateParams.quotationNumber)
                  return loaderVidaEmitController.getQuotation($stateParams.quotationNumber, true);
              }
            ]
          }
        },
        {
          name: "vidaemit.steps",
          url: "/:step",
          params: {
            productCode: null
          },
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              "/polizas/app/vida/emit/component/vida-emit-p1.html",
              "/polizas/app/vida/emit/component/vida-emit-p2.html",
              "/polizas/app/vida/emit/component/vida-emit-p3.html",
              "/polizas/app/vida/emit/component/vida-emit-fin.html"
            ];
            return c[$stateParam.step];
          },
          resolve: {
            liveCivilStatus: [
              "loaderVidaEmitController",
              "vidaemit",
              function(loaderVidaEmitController, vidaemit) {
                return loaderVidaEmitController.getCivilStatus(true);
              }
            ],
            liveEconomicActivities: [
              "loaderVidaEmitController",
              "vidaemit",
              function(loaderVidaEmitController, vidaemit) {
                return loaderVidaEmitController.getEconomicActivities(true);
              }
            ],
            liveOccupations: [
              "loaderVidaEmitController",
              "vidaemit",
              function(loaderVidaEmitController, vidaemit) {
                return loaderVidaEmitController.getOccupations(true);
              }
            ],
            liveCountries: [
              "loaderVidaEmitController",
              "vidaemit",
              function(loaderVidaEmitController, vidaemit) {
                return loaderVidaEmitController.getCountries(true);
              }
            ],
            liveFinancialEntities: [
              "loaderVidaEmitController",
              "vidaemit",
              function(loaderVidaEmitController, vidaemit) {
                return loaderVidaEmitController.getFinancialEntities(true);
              }
            ],
            liveAccountTypes: [
              "loaderVidaEmitController",
              "vidaemit",
              function(loaderVidaEmitController, vidaemit) {
                return loaderVidaEmitController.getAccountTypes(true);
              }
            ],
            liveCoins: [
              "loaderVidaEmitController",
              "vidaemit",
              function(loaderVidaEmitController, vidaemit) {
                return loaderVidaEmitController.getCoins(true);
              }
            ],
            liveCardsType: [
              "loaderVidaEmitController",
              "vidaemit",
              function(loaderVidaEmitController, vidaemit) {
                return loaderVidaEmitController.getCardsType(true);
              }
            ],
            surveyDPS: [
              "loaderVidaEmitController",
              "vidaemit",
              "$stateParams",
              function(loaderVidaEmitController, vidaemit, $stateParams) {
                if ($stateParams.step > 2)
                  return loaderVidaEmitController.getSurveyDPS($stateParams.productCode, $stateParams.quotationNumber, true);
              }
            ]
          },
          controllerProvider: function($stateParams) {
            var c = [undefined, "vidaEmitS1", "vidaEmitS2", "vidaEmitS3", "vidaEmitFin"];
            return c[$stateParams.step];
          }
        }
      ],

      resolver: [
        {
          name: "vidaemit",
          moduleName: "appVida",
          files: ["vidaEmitS1", "vidaEmitS2", "vidaEmitS3", "vidaEmitFin", "vidaEmitController"]
        }
      ]
    },
    {
      name: "vidaEmitted",
      currentAppID: "CWVI",
      breads: ["homePolizasVidas"],
      description: "Emisión póliza vida",
      url: "/vida/emitted/:documentNumber",
      parent: "root",
      views: {
        content: {
          controller: "vidaEmittedController",
          templateUrl: "/polizas/app/vida/emit/controller/emitted.html"
        }
      },
      resolve: {
        liveEmission: [
          "loaderVidaEmittedController",
          "vidaEmitted",
          "$stateParams",
          function(loaderVidaEmittedController, vidaEmitted, $stateParams) {
            return loaderVidaEmittedController.getEmission($stateParams.documentNumber, true);
          }
        ]
      },
      resolver: [
        {
          name: "vidaEmitted",

          moduleName: "appAutos",
          files: ["vidaEmittedController"]
        }
      ]
    },
    {
      name: "homePolizasTransportes",
      appCode: "TRANSPORTES",
      url: "/transportes/home",
      description: "Transportes",
      parent: "root",
      views: {
        content: {
          controller: "ctrlHomeTransportes",
          templateUrl: "/polizas/app/transportes/home/controller/transportes-home.html"
        }
      },
      resolver: [
        {
          name: "homePolizasTransportes",
          moduleName: "appTransportes",
          files: ["/polizas/app/transportes/home/controller/transportes-home.js"]
        }
      ]
    },
    {
      name: "homePolizasCartas",
      code: "",
      url: "/cartas/home",
      description: "Cartas",
      parent: "root",
      views: {
        content: {
          controller: "ctrlHomeCartas",
          templateUrl: "/polizas/app/cartas/home/cartas-home.html"
        }
      },
      resolver: [
        {
          name: "homePolizasCartas",
          moduleName: "appCartas",
          files: ["/polizas/app/cartas/home/cartas-home.js"]
        }
      ]
    },
    {
      name: "cartasgarantia",
      code: "",
      description: "Cartas Garantias",
      breads: ["homePolizasCartas"],
      params: { step: null },
      urls: [
        {
          url: "/cartas/garantia",
          abstract: true,
          parent: "root",
          thenRoutes: ["/cartas/garantia/1"],
          views: {
            content: {
              controller: "cartaGarantiaController",
              templateUrl: "/polizas/app/cartas/garantia/controller/cartas-garantiaU.html"
            }
          }
        },
        {
          name: "cartasgarantia.steps",
          url: "/:step",
          templateUrl: function($stateParam) {
            var c = [undefined, "/polizas/app/cartas/garantia/component/cartas-garantiaU-p1.html"];
            return c[$stateParam.step];
          },
          controllerProvider: function($stateParams) {
            var c = [undefined, "cartaGarantiaS1"];
            return c[$stateParams.step];
          }
        }
      ],

      resolver: [
        {
          name: "cartasgarantia",
          moduleName: "appCartas",
          files: ["cartaGarantiaS1", "cartaGarantiaController"]
        }
      ]
    },

    {
      name: "documentos",

      description: "Documentos",
      url: "/documentos/:documentNumber",
      parent: "root",
      views: {
        content: {
          controller: "documentosController",
          templateUrl: "/polizas/app/documentos/controller/documentos.html"
        }
      },
      resolve: {
        documentosProducts: [
          "loaderDocumentosController",
          "documentos",
          "$stateParams",
          "oimPrincipal",
          function(loaderDocumentosController, documentos, $stateParams, oimPrincipal) {
            return loaderDocumentosController.getProducts(0, 0);
          }
        ]
      },
      resolver: [
        {
          name: "documentos",

          moduleName: "appAutos",
          files: ["documentosController"]
        }
      ]
    },

    {
      name: "inspeccionesAutosSolicitudes",
      code: "",
      params: { step: null },
      urls: [
        {
          url: "/inspecciones/solicitudes",
          controller: "solicitudesAutosController",
          templateUrl: "/polizas/app/inspecciones/solicitud/controller/solicitudes.html",
          parent: "root",
          views: {
            content: {
              controller: "solicitudesAutosController",
              templateUrl: "/polizas/app/inspecciones/solicitud/controller/solicitudes.html"
            }
          },
          resolve: {}
        }
      ],
      resolver: [
        {
          name: "inspeccionesAutos",

          moduleName: "appAutos",
          files: ["/polizas/app/inspecciones/solicitud/controller/solicitudes.js"],
          resolveTemplate: true
        }
      ]
    },

    {
      name: "inspeccionesAutosProgramaciones",
      code: "",
      params: { step: null },
      urls: [
        {
          url: "/inspecciones/programaciones",
          controller: "programacionesAutosController",
          templateUrl: "/polizas/app/inspecciones/programacion/controller/programaciones.html",
          parent: "root",
          views: {
            content: {
              controller: "programacionesAutosController",
              templateUrl: "/polizas/app/inspecciones/programacion/controller/programaciones.html"
            }
          },
          resolve: {}
        }
      ],
      resolver: [
        {
          name: "inspeccionesAutos",

          moduleName: "appAutos",
          files: ["/polizas/app/inspecciones/programacion/controller/programaciones.js"],
          resolveTemplate: true
        }
      ]
    },

    {
      name: "homePolizasSalud",
      code: "",
      url: "/salud/home",
      description: "Salud",
      parent: "root",
      views: {
        content: {
          controller: "homeSaludController",
          templateUrl: "/polizas/app/salud/home/controller/homeSalud.html"
        }
      },
      resolve: {
        isAdmin: [
          "oimClaims",
          "mainServices",
          function(oimClaims, mainServices) {
            return mainServices.isAdminEmisaApp(oimClaims.rolesCode);
          }
        ]
      },
      resolver: [
        {
          name: "homePolizasSalud",
          moduleName: "appAccidentes",
          files: ["/polizas/app/salud/home/controller/homeSaludController.js"]
        }
      ]
    },
    {
      name: "homePolizasClinicaDigital",
      code: "",
      url: "/clinicadigital/home",
      description: "Clinica Digital",
      parent: "root",
      views: {
        content: {
          controller: "homeClinicaDigitalController",
          templateUrl: "/polizas/app/clinicaDigital/home/controller/homeClinicaDigital.html"
        }
      },
      resolve: {
        isAdmin: [
          "oimClaims",
          "mainServices",
          function(oimClaims, mainServices) {
            return mainServices.isAdminEmisaApp(oimClaims.rolesCode);
          }
        ]
      },
      resolver: [
        {
          name: "homePolizasClinicaDigital",
          moduleName: "appClinicaDigital",
          files: ["/polizas/app/clinicaDigital/home/controller/homeClinicaDigitalController.js"]
        }
      ]
    },
    {
      name: "misProductosSalud",
      code: "",
      params: { step: null },
      description: "Mis Productos",
      breads: ["homePolizasSalud"],
      urls: [
        {
          url: "/salud/misproductos",
          controller: "misProductosController",
          templateUrl: "/polizas/app/salud/products/component/misProductos.html",
          parent: "root",
          views: {
            content: {
              controller: "misProductosController as productCtrl",
              templateUrl: "/polizas/app/salud/products/component/misProductos.html"
            }
          },
          resolve: {
            role: [
              "oimClaims",
              "mainServices",
              "$state",
              function(oimClaims, mainServices, $state) {
                if (!mainServices.isAdminEmisaApp(oimClaims.rolesCode)) {
                  $state.go("homePolizasSalud");
                }
              }
            ]
          }
        }
      ],
      resolver: [
        {
          name: "misProductosSalud",

          moduleName: "appSalud",
          files: ["/polizas/app/salud/products/controller/misProductosController.js"],
          resolveTemplate: true
        }
      ]
    },

    {
      name: "cotizadorSalud",
      code: "",
      params: { step: null },
      description: "Cotización salud",
      breads: ["homePolizasSalud"],
      urls: [
        {
          url: "/salud/cotizador",
          controller: "cotizadorSaludController",
          templateUrl: "/polizas/app/salud/quote/component/cotizadorSalud.html",
          parent: "root",
          views: {
            content: {
              controller: "cotizadorSaludController",
              templateUrl: "/polizas/app/salud/quote/component/cotizadorSalud.html"
            }
          },
          resolve: {
            saludLists: [
              "loaderCotizadorSaludController",
              "cotizadorSalud",
              function(loaderCotizadorSaludController, cotizadorSalud) {
                return loaderCotizadorSaludController.getLists(true);
              }
            ]
          }
        }
      ],
      resolver: [
        {
          name: "cotizadorSalud",
          moduleName: "appSalud",
          files: ["/polizas/app/salud/quote/controller/cotizadorSaludController.js"],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "cotizadorClinicaDigital",
      code: "",
      params: { step: null },
      description: "Cotización de Clinica Digital",
      breads: ["homePolizasClinicaDigital"],
      urls: [
        {
          url: "/clinicadigital/cotizador",
          controller: "cotizadorClinicaDigitalController",
          templateUrl: "/polizas/app/clinicaDigital/quote/component/cotizadorClinicaDigital.html",
          parent: "root",
          views: {
            content: {
              controller: "cotizadorClinicaDigitalController",
              templateUrl: "/polizas/app/clinicaDigital/quote/component/cotizadorClinicaDigital.html"
            }
          },
          resolve: {
            saludLists: [
              "loaderCotizadorClinicaDigitalController",
              "cotizadorClinicaDigital",
              function(loaderCotizadorClinicaDigitalController) {
                return loaderCotizadorClinicaDigitalController.getLists(true);
              }
            ]
          }
        }
      ],
      resolver: [
        {
          name: "cotizadorClinicaDigital",
          moduleName: "appClinicaDigital",
          files: ["/polizas/app/clinicaDigital/quote/controller/cotizadorClinicaDigitalController.js"],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "cotizacionGuardadaClinicaDigital",
      code: "",
      description: "Cotización de Clinica Digital",
      breads: ["homePolizasClinicaDigital"],
      urls: [
        {
          url: "/clinicadigital/cotizacionGuardada/:numDoc",
          controller: "cotizacionGuardadaController",
          templateUrl: "/polizas/app/clinicaDigital/quote/component/cotizacionGuardada.html",
          parent: "root",
          views: {
            content: {
              controller: "cotizacionGuardadaController",
              templateUrl: "/polizas/app/clinicaDigital/quote/component/cotizacionGuardada.html"
            }
          },
          resolve: {}
        }
      ],
      resolver: [
        {
          name: "cotizacionGuardadaClinicaDigital",

          moduleName: "appClinicaDigital",
          files: ["/polizas/app/clinicaDigital/quote/controller/cotizacionGuardadaController.js"],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "clinicaDigitalDocuments",
      appCode: "",
      breads: ["homePolizasClinicaDigital"],
      description: "Documentos de Clinica Digital",
      urls: [
        {
          url: "/clinicadigital/documents",
          controller: "clinicaDigitalDocumentsController",
          templateUrl: "/polizas/app/clinicaDigital/documents/controller/documents.html",
          parent: "root",
          views: {
            content: {
              controller: "clinicaDigitalDocumentsController",
              templateUrl: "/polizas/app/clinicaDigital/documents/controller/documents.html"
            }
          },
          resolve: {}
        }
      ],
      resolver: [
        {
          name: "clinicaDigitalDocuments",
          moduleName: "appClinicaDigital",
          files: ["/polizas/app/clinicaDigital/documents/controller/documents.js"]
        }
      ]
    },

    {
      name: "suscripcionSalud",
      code: "",
      params: { step: null },
      description: "Suscripcion de salud",
      breads: ["homePolizasSalud"],
      urls: [
        {
          url: "/salud/suscripcion/:quotationNumber",
          parent: "root",
          controller: "suscripcionSaludController",
          abstract: true,
          thenRoutes: ["/salud/suscripcion/:quotationNumber/1"],
          views: {
            content: {
              controller: "suscripcionSaludController",
              templateUrl: "/polizas/app/salud/suscripcion/component/suscripcionSalud.html"
            }
          },
          resolve: {
            role: [
              "oimPrincipal",
              "$state",
              "saludFactory",
              function(oimPrincipal, $state, saludFactory) {
                if (!saludFactory.isUserSubscription()) {
                  $state.go("homePolizasSalud");
                }
              }
            ]
          }
        },
        {
          name: "suscripcionSalud.steps",
          appCode: "",
          params: {
            numRol: null
          },
          url: "/:step",
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              "/polizas/app/salud/suscripcion/steps/suscripcionSalud-paso1.html",
              "/polizas/app/salud/suscripcion/steps/suscripcionSalud-paso2.html",
              "/polizas/app/salud/suscripcion/steps/suscripcionSalud-paso3.html"
            ];
            return c[$stateParam.step];
          },
          resolve: {
            saludLists: [
              "loaderSuscripcionP1Controller",
              "suscripcionSalud",
              "$stateParams",
              function(loaderSuscripcionP1Controller, suscripcionSalud, $stateParams) {
                return loaderSuscripcionP1Controller.getLists(true, $stateParams.step);
              }
            ]
          },
          controllerProvider: function($stateParams) {
            var c = [
              undefined,
              "suscripcionSaludPaso1Controller",
              "suscripcionSaludPaso2Controller",
              "suscripcionSaludPaso3Controller"
            ];
            return c[$stateParams.step];
          }
        }
      ],
      resolver: [
        {
          name: "suscripcionSalud",
          moduleName: "appSalud",
          files: [
            "suscripcionSaludController",
            "suscripcionSaludPaso1Controller",
            "suscripcionSaludPaso2Controller",
            "suscripcionSaludPaso3Controller"
          ],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "emisionClinicDigital",
      code: "",
      params: { step: null },
      description: "Emision de Clinica Digital",
      breads: ["homePolizasClinicaDigital"],
      urls: [
        {
          url: "/clinicadigital/emision/:quotationNumber",
          parent: "root",
          controller: "emisionClinicDigitalController",
          abstract: true,
          thenRoutes: ["/clinicadigital/emision/:quotationNumber/1"],
          views: {
            content: {
              controller: "emisionClinicDigitalController",
              templateUrl: "/polizas/app/clinicaDigital/suscripcion/component/emisionClinicaDigital.html"
            }
          },
          resolve: {
            role: [
              "oimPrincipal",
              "$state",
              "saludFactory",
              function(oimPrincipal, $state, saludFactory) {
                if (!saludFactory.isUserSubscription()) {
                  $state.go("homePolizasClinicaDigital");
                }
              }
            ]
          }
        },
        {
          name: "emisionClinicDigital.steps",
          appCode: "",
          params: {
            numRol: null
          },
          url: "/:step",
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              "/polizas/app/clinicaDigital/suscripcion/steps/emisionClinicaDigital-paso1.html",
              "/polizas/app/clinicaDigital/suscripcion/steps/emisionClinicaDigital-paso2.html"
            ];
            return c[$stateParam.step];
          },
          resolve: {
            saludLists: [
              "loaderSuscripcionP1ControllerCD",
              "emisionClinicDigital",
              "$stateParams",
              function(loaderSuscripcionP1ControllerCD, emisionClinicDigital, $stateParams) {
                return loaderSuscripcionP1ControllerCD.getLists(true, $stateParams.step);
              }
            ]
          },
          controllerProvider: function($stateParams) {
            var c = [
              undefined,
              "emisionClinicDigitalPaso1Controller",
              "emisionClinicDigitalPaso2Controller"
            ];
            return c[$stateParams.step];
          }
        }
      ],
      resolver: [
        {
          name: "emisionClinicDigital",
          moduleName: "appClinicaDigital",
          files: [
            "/polizas/app/clinicaDigital/suscripcion/controller/emisionClinicaDigitalController.js",
            "/polizas/app/clinicaDigital/suscripcion/steps/emisionClinicaDigitalPaso1Controller.js",
            "/polizas/app/clinicaDigital/suscripcion/steps/emisionClinicaDigitalPaso2Controller.js"
          ],
          resolveTemplate: true
        }
      ]
    },

    {
      name: "resumenSuscripcionSalud",
      code: "",
      params: { step: null },
      description: "Resumen de suscripción",
      breads: ["homePolizasSalud"],
      urls: [
        {
          url: "/salud/resumen-suscripcion/:quotationNumber",
          controller: "resumenSuscripcionSaludController",
          templateUrl: "/polizas/app/salud/suscripcion/component/resumenSuscripcionSalud.html",
          parent: "root",
          views: {
            content: {
              controller: "resumenSuscripcionSaludController",
              templateUrl: "/polizas/app/salud/suscripcion/component/resumenSuscripcionSalud.html"
            }
          }
        }
      ],
      resolver: [
        {
          name: "resumenSuscripcionSalud",
          moduleName: "appSalud",
          files: ["/polizas/app/salud/suscripcion/controller/resumenSuscripcionSaludController.js"],
          resolveTemplate: true
        }
      ]
    },

    {
      name: "habilitadorSalud",
      code: "",
      params: { step: null },
      description: "Habilitador de productos",
      breads: ["homePolizasSalud"],
      urls: [
        {
          url: "/salud/habilitador",
          controller: "habilitadorController",
          templateUrl: "/polizas/app/salud/habilitador/controller/habilitador.html",
          parent: "root",
          views: {
            content: {
              controller: "habilitadorController as habCtrl",
              templateUrl: "/polizas/app/salud/habilitador/controller/habilitador.html"
            }
          },
          resolve: {
            role: [
              "oimClaims",
              "mainServices",
              "$state",
              function(oimClaims, mainServices, $state) {
                if (!mainServices.isAdminEmisaApp(oimClaims.rolesCode)) {
                  $state.go("homePolizasSalud");
                }
              }
            ]
          }
        }
      ],
      resolver: [
        {
          name: "habilitadorSalud",

          moduleName: "appSalud",
          files: ["/polizas/app/salud/habilitador/controller/habilitador.js"],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "productoClinicaDigital",
      code: "",
      params: { step: null },
      description: "Mantenedor de producto",
      breads: ["homePolizasClinicaDigital"],
      urls: [
        {
          url: "/clinicadigital/producto",
          controller: "productoClinicaDigitalController",
          templateUrl: "/polizas/app/clinicaDigital/producto/controller/producto.html",
          parent: "root",
          views: {
            content: {
              controller: "productoClinicaDigitalController as habCtrl",
              templateUrl: "/polizas/app/clinicaDigital/producto/controller/producto.html"
            }
          },
          resolve: {
            role: [
              "oimClaims",
              "mainServices",
              "$state",
              function(oimClaims, mainServices, $state) {
                if (!mainServices.isAdminEmisaApp(oimClaims.rolesCode)) {
                  $state.go("homePolizasClinicaDigital");
                }
              }
            ]
          }
        }
      ],
      resolver: [
        {
          name: "productoClinicaDigital",

          moduleName: "appClinicaDigital",
          files: ["/polizas/app/clinicaDigital/producto/controller/producto.js"],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "editarPlanClinicaDigital",
      code: "",
      params: { step: null },
      description: "Editar plan",
      breads: ["homePolizasClinicaDigital"],
      urls: [
        {
          url: "/clinicadigital/editarPlan/:compania/:modalidad/:codigoProducto/:codigoSubProducto/:codigoPlan",
          controller: "editarPlanController",
          templateUrl: "/polizas/app/clinicaDigital/producto/controller/editarPlan.html",
          parent: "root",
          views: {
            content: {
              controller: "editarPlanController as planCtrl",
              templateUrl: "/polizas/app/clinicaDigital/producto/controller/editarPlan.html"
            }
          },
          resolve: {}
        }
      ],
      resolver: [
        {
          name: "editarPlanClinicaDigital",

          moduleName: "appClinicaDigital",
          files: ["/polizas/app/clinicaDigital/producto/controller/editarPlanController.js"],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "preguntasSalud",
      code: "",
      params: { step: null },
      description: "Mantenedor de Preguntas",
      breads: ["homePolizasSalud"],
      urls: [
        {
          url: "/salud/preguntas",
          controller: "mantenedorPreguntasController",
          templateUrl: "/polizas/app/salud/preguntas/controller/preguntas.html",
          parent: "root",
          views: {
            content: {
              controller: "mantenedorPreguntasController as habCtrl",
              templateUrl: "/polizas/app/salud/preguntas/controller/preguntas.html"
            }
          },
          resolve: {
            role: [
              "oimClaims",
              "mainServices",
              "$state",
              function(oimClaims, mainServices, $state) {
                if (!mainServices.isAdminEmisaApp(oimClaims.rolesCode)) {
                  $state.go("homePolizasSalud");
                }
              }
            ]
          }
        }
      ],
      resolver: [
        {
          name: "preguntasSalud",

          moduleName: "appSalud",
          files: ["/polizas/app/salud/preguntas/controller/preguntas.js"],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "imcSalud",
      code: "",
      params: { step: null },
      description: "Mantenedor de IMC",
      breads: ["homePolizasSalud"],
      urls: [
        {
          url: "/salud/imc",
          controller: "mantenedorImcController",
          templateUrl: "/polizas/app/salud/imc/controller/imc.html",
          parent: "root",
          views: {
            content: {
              controller: "mantenedorImcController as habCtrl",
              templateUrl: "/polizas/app/salud/imc/controller/imc.html"
            }
          },
          resolve: {
            role: [
              "oimClaims",
              "mainServices",
              "$state",
              function(oimClaims, mainServices, $state) {
                if (!mainServices.isAdminEmisaApp(oimClaims.rolesCode)) {
                  $state.go("homePolizasSalud");
                }
              }
            ]
          }
        }
      ],
      resolver: [
        {
          name: "imcSalud",

          moduleName: "appSalud",
          files: ["/polizas/app/salud/imc/controller/imc.js"],
          resolveTemplate: true
        }
      ]
    },

    {
      name: "detallePlanSalud",
      code: "",
      params: { step: null },
      description: "Cotizador de salud",
      breads: ["homePolizasSalud"],
      urls: [
        {
          url: "/salud/detallePlan",
          controller: "detallePlanController",
          templateUrl: "/polizas/app/salud/quote/component/detallePlan.html",
          parent: "root",
          views: {
            content: {
              controller: "detallePlanController",
              templateUrl: "/polizas/app/salud/quote/component/detallePlan.html"
            }
          },
          resolve: {}
        }
      ],
      resolver: [
        {
          name: "detallePlanSalud",

          moduleName: "appSalud",
          files: ["/polizas/app/salud/quote/controller/detallePlanController.js"],
          resolveTemplate: true
        }
      ]
    },

    {
      name: "editarPlanSalud",
      code: "",
      params: { step: null },
      description: "Editar plan",
      breads: ["homePolizasSalud"],
      urls: [
        {
          url: "/salud/editarPlan/:compania/:ramo/:modalidad/:contrato/:subContrato",
          controller: "editarPlanController",
          templateUrl: "/polizas/app/salud/quote/component/editarPlan.html",
          parent: "root",
          views: {
            content: {
              controller: "editarPlanController as planCtrl",
              templateUrl: "/polizas/app/salud/quote/component/editarPlan.html"
            }
          },
          resolve: {}
        }
      ],
      resolver: [
        {
          name: "editarPlanSalud",

          moduleName: "appSalud",
          files: ["/polizas/app/salud/quote/controller/editarPlanController.js"],
          resolveTemplate: true
        }
      ]
    },

    {
      name: "historialPlanesSalud",
      code: "",
      params: { step: null },
      description: "Historial de planes",
      breads: ["homePolizasSalud"],
      urls: [
        {
          url: "/salud/historialPlanes/:compania/:ramo/:modalidad/:contrato/:subContrato",
          controller: "historialPlanesController",
          templateUrl: "/polizas/app/salud/quote/component/historialPlanes.html",
          parent: "root",
          views: {
            content: {
              controller: "historialPlanesController as historialCtrl",
              templateUrl: "/polizas/app/salud/quote/component/historialPlanes.html"
            }
          },
          resolve: {}
        }
      ],
      resolver: [
        {
          name: "historialPlanesSalud",

          moduleName: "appSalud",
          files: ["/polizas/app/salud/quote/controller/historialPlanesController.js"],
          resolveTemplate: true
        }
      ]
    },

    {
      name: "cotizacionGuardadaSalud",
      code: "",
      description: "Cotizador de salud",
      breads: ["homePolizasSalud"],
      urls: [
        {
          url: "/salud/cotizacionGuardada/:numDoc",
          controller: "cotizacionGuardadaController",
          templateUrl: "/polizas/app/salud/quote/component/cotizacionGuardada.html",
          parent: "root",
          views: {
            content: {
              controller: "cotizacionGuardadaController",
              templateUrl: "/polizas/app/salud/quote/component/cotizacionGuardada.html"
            }
          },
          resolve: {}
        }
      ],
      resolver: [
        {
          name: "cotizacionGuardadaSalud",

          moduleName: "appSalud",
          files: ["/polizas/app/salud/quote/controller/cotizacionGuardadaController.js"],
          resolveTemplate: true
        }
      ]
    },

    {
      name: "saludDocuments",
      appCode: "",
      breads: ["homePolizasSalud"],
      description: "Documentos de Salud",
      urls: [
        {
          url: "/salud/documents",
          controller: "saludDocumentsController",
          templateUrl: "/polizas/app/salud/documents/controller/documents.html",
          parent: "root",
          views: {
            content: {
              controller: "saludDocumentsController",
              templateUrl: "/polizas/app/salud/documents/controller/documents.html"
            }
          },
          resolve: {}
        }
      ],
      resolver: [
        {
          name: "saludDocuments",
          moduleName: "appSalud",
          files: ["/polizas/app/salud/documents/controller/documents.js"]
        }
      ]
    },

    {
      name: "saludMigraciones",
      appCode: "",
      breads: ["homePolizasSalud"],
      description: "Migración de Pólizas",
      params: { step: null },
      urls: [
        {
          url: "/salud/migraciones",
          abstract: true,
          parent: "root",
          thenRoutes: ["/salud/saludMigraciones/1"],
          views: {
            content: {
              controller: "saludMigracionesController",
              templateUrl: "/polizas/app/salud/migraciones/controller/migraciones.html"
            }
          },
          resolve: {},
        },
        {
          name: "saludMigraciones.steps",
          url: "/:step",
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              "/polizas/app/salud/migraciones/component/salud-migraciones-p1.html",
              "/polizas/app/salud/migraciones/component/salud-migraciones-p2.html",
            ];
            return c[$stateParam.step];
          },
          controllerProvider: function($stateParams) {
            var c = [undefined, "saludMigracionesS1", "saludMigracionesS2"];
            return c[$stateParams.step];
          }
        }
      ],
      resolver: [
        {
          name: "saludMigraciones",
          moduleName: "appSalud",
          files: [
            "/polizas/app/salud/migraciones/component/datos-poliza/datos-poliza.directive.js",
            "/polizas/app/salud/migraciones/component/plan-migracion/plan-migracion.directive.js",
            "/polizas/app/salud/migraciones/component/resumen-cotizacion-contratante/resumen-cotizacion-contratante.directive.js",
            "/polizas/app/salud/migraciones/component/resumen-datos-parentesco/resumen-datos-parentesco.directive.js",
            "/polizas/app/salud/migraciones/component/resumen-cotizacion-importes/resumen-cotizacion-importes.directive.js",
            "/polizas/app/salud/migraciones/component/resumen-cotizacion-condiciones/resumen-cotizacion-condiciones.directive.js",
            "/polizas/app/salud/migraciones/component/resumen-cotizacion-poliza/resumen-cotizacion-poliza.directive.js",
            "/polizas/app/salud/migraciones/controller/salud-migraciones-p1.js",
            "/polizas/app/salud/migraciones/controller/salud-migraciones-p2.js",
            "/polizas/app/salud/migraciones/controller/migraciones.js",
          ]
        }
      ]
    },
    {
      name: "saludMigracionesToken",
      appCode: "",
      breads: ["homePolizasSalud"],
      description: "Migración de Pólizas",
      params: { step: null, token: null },
      urls: [
        {
          url: "/salud/migraciones/:token",
          abstract: true,
          parent: "root",
          thenRoutes: ["/salud/saludMigracionesToken/:token/1"],
          views: {
            content: {
              controller: "saludMigracionesController",
              templateUrl: "/polizas/app/salud/migraciones/controller/migraciones.html"
            }
          },
          resolve: {},
        },
        {
          name: "saludMigracionesToken.steps",
          url: "/:step",
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              "/polizas/app/salud/migraciones/component/salud-migraciones-p1.html",
              "/polizas/app/salud/migraciones/component/salud-migraciones-p2.html",
            ];
            return c[$stateParam.step];
          },
          controllerProvider: function($stateParams) {
            var c = [undefined, "saludMigracionesS1", "saludMigracionesS2"];
            return c[$stateParams.step];
          }
        }
      ],
      resolver: [
        {
          name: "saludMigracionesToken",
          moduleName: "appSalud",
          files: [
            "/polizas/app/salud/migraciones/component/datos-poliza/datos-poliza.directive.js",
            "/polizas/app/salud/migraciones/component/plan-migracion/plan-migracion.directive.js",
            "/polizas/app/salud/migraciones/component/resumen-cotizacion-contratante/resumen-cotizacion-contratante.directive.js",
            "/polizas/app/salud/migraciones/component/resumen-datos-parentesco/resumen-datos-parentesco.directive.js",
            "/polizas/app/salud/migraciones/component/resumen-cotizacion-importes/resumen-cotizacion-importes.directive.js",
            "/polizas/app/salud/migraciones/component/resumen-cotizacion-condiciones/resumen-cotizacion-condiciones.directive.js",
            "/polizas/app/salud/migraciones/component/resumen-cotizacion-poliza/resumen-cotizacion-poliza.directive.js",
            "/polizas/app/salud/migraciones/controller/salud-migraciones-p1.js",
            "/polizas/app/salud/migraciones/controller/salud-migraciones-p2.js",
            "/polizas/app/salud/migraciones/controller/migraciones.js",
          ]
        }
      ]
    },
    {
      name: "mantenedorMigraciones",
      appCode: "",
      description: "Mantenimientos",
      breads: ["homePolizasSalud"],
      urls: [
        {
          url: "/salud/mantenedor-migraciones",
          controller: "mantenedorMigracionesController",
          templateUrl: "/polizas/app/salud/migraciones/controller/maintenance/mantenedor-migraciones.html",
          parent: "root",
          views: {
            content: {
              controller: "mantenedorMigracionesController",
              templateUrl: "/polizas/app/salud/migraciones/controller/maintenance/mantenedor-migraciones.html",
              controllerAs: 'vm'
            }
          },
          resolve: {
            role: [
              "oimClaims",
              "mainServices",
              "$state",
              function(oimClaims, mainServices, $state) {
                if (!mainServices.isAdminEmisaApp(oimClaims.rolesCode)) {
                  $state.go("homePolizasSalud");
                }
              }
            ]
          }
        }
      ],
      resolver: [
        {
          name: "mantenedorMigraciones",
          moduleName: "appSalud",
          files: [
            "mpfItemMantenedorMigracionesSalud",
            "mpfFiltroMantenedorMigracionesSalud",
            "mpfItemReglasAjusteSalud",
            "mpfFiltroReglasAjusteSalud",
            "mantenedorMigracionesController"
          ],
        }
      ]
    },

    {
      name: "popupNuevoTrebol",
      code: "",
      url: "/salud/popupNuevoTrebol",
      description: "Salud",
      parent: "root",
      views: {
        content: {
          controller: "popupSaludController",
          templateUrl: "/polizas/app/salud/popup/controller/popupNuevoTrebol.html"
        }
      },
      resolver: [
        {
          name: "popupNuevoTrebol",
          moduleName: "appSalud",
          files: ["/polizas/app/salud/popup/controller/popupSaludController.js"]
        }
      ]
    },

    {
      name: "popupPrevisorA",
      code: "",
      url: "/salud/popupPrevisorA",
      description: "Salud",
      parent: "root",
      views: {
        content: {
          controller: "popupSaludController",
          templateUrl: "/polizas/app/salud/popup/controller/popupPrevisorA.html"
        }
      },
      resolver: [
        {
          name: "popupPrevisorA",
          moduleName: "appSalud",
          files: ["/polizas/app/salud/popup/controller/popupSaludController.js"]
        }
      ]
    },

    {
      name: "popupPrevisorB",
      code: "",
      url: "/salud/popupPrevisorB",
      description: "Salud",
      parent: "root",
      views: {
        content: {
          controller: "popupSaludController",
          templateUrl: "/polizas/app/salud/popup/controller/popupPrevisorB.html"
        }
      },
      resolver: [
        {
          name: "popupPrevisorB",
          moduleName: "appSalud",
          files: ["/polizas/app/salud/popup/controller/popupSaludController.js"]
        }
      ]
    },

    {
      name: "popupPrevisorC",
      code: "",
      url: "/salud/popupPrevisorC",
      description: "Salud",
      parent: "root",
      views: {
        content: {
          controller: "popupSaludController",
          templateUrl: "/polizas/app/salud/popup/controller/popupPrevisorC.html"
        }
      },
      resolver: [
        {
          name: "popupPrevisorC",
          moduleName: "appSalud",
          files: ["/polizas/app/salud/popup/controller/popupSaludController.js"]
        }
      ]
    },

    {
      name: "popupPrevisorD",
      code: "",
      url: "/salud/popupPrevisorD",
      description: "Salud",
      parent: "root",
      views: {
        content: {
          controller: "popupSaludController",
          templateUrl: "/polizas/app/salud/popup/controller/popupPrevisorD.html"
        }
      },
      resolver: [
        {
          name: "popupPrevisorD",
          moduleName: "appSalud",
          files: ["/polizas/app/salud/popup/controller/popupSaludController.js"]
        }
      ]
    },

    {
      name: "popupRegionalPlus",
      code: "",
      url: "/salud/popupRegionalPlus",
      description: "Salud",
      parent: "root",
      views: {
        content: {
          controller: "popupSaludController",
          templateUrl: "/polizas/app/salud/popup/controller/popupRegionalPlus.html"
        }
      },
      resolver: [
        {
          name: "popupRegionalPlus",
          moduleName: "appSalud",
          files: ["/polizas/app/salud/popup/controller/popupSaludController.js"]
        }
      ]
    },

    {
      name: "popupSumarSalud",
      code: "",
      url: "/salud/popupSumarSalud",
      description: "Salud",
      parent: "root",
      views: {
        content: {
          controller: "popupSaludController",
          templateUrl: "/polizas/app/salud/popup/controller/popupSumarSalud.html"
        }
      },
      resolver: [
        {
          name: "popupSumarSalud",
          moduleName: "appSalud",
          files: ["/polizas/app/salud/popup/controller/popupSaludController.js"]
        }
      ]
    },

    {
      name: "popupSumarSaludPlus",
      code: "",
      url: "/salud/popupSumarSaludPlus",
      description: "Salud",
      parent: "root",
      views: {
        content: {
          controller: "popupSaludController",
          templateUrl: "/polizas/app/salud/popup/controller/popupSumarSaludPlus.html"
        }
      },
      resolver: [
        {
          name: "popupSumarSaludPlus",
          moduleName: "appSalud",
          files: ["/polizas/app/salud/popup/controller/popupSaludController.js"]
        }
      ]
    },

    {
      name: "popupVivaSalud",
      code: "",
      url: "/salud/popupVivaSalud",
      description: "Salud",
      parent: "root",
      views: {
        content: {
          controller: "popupSaludController",
          templateUrl: "/polizas/app/salud/popup/controller/popupVivaSalud.html"
        }
      },
      resolver: [
        {
          name: "popupVivaSalud",
          moduleName: "appSalud",
          files: ["/polizas/app/salud/popup/controller/popupSaludController.js"]
        }
      ]
    },
    {
      name: 'saludMaqueta', // INFO: Add to MQT
      code: '',
      url: '/salud/maqueta',
      description: '',
      parent: 'root',
      views: {
        content: {
          template: '<salud-maqueta></salud-maqueta>'
        }
      },
      resolver: [
        {
          name: 'saludMaqueta',
          moduleName: 'appSalud',
          files: ['saludMaquetaController']
        }
      ]
    },
    {
      name: "homePolizasSeguroviaje",
      code: [
        1582,
        {
          value: 1528,
          valueProd: 1582
        }
      ],
      url: "/seguroviaje/home",
      description: "SegurViaje",
      parent: "root",
      views: {
        content: {
          controller: "SeguroviajeHomeController as vm",
          templateUrl: "/polizas/app/seguroviaje/home/seguroviaje-home.html"
        }
      },
      resolve: {},
      resolver: [
        {
          name: "homePolizasSeguroviaje",
          moduleName: "appSeguroviaje",
          files: ["homePolizasSeguroviajeController"]
        }
      ]
    },

    {
      name: "seguroviajeCotizar",
      abstract: true,
      code: [
        1582,
        {
          value: 1528,
          valueProd: 1582
        }
      ],
      url: "/seguroviaje/cotizar",
      description: "Cotizar seguro de viaje",
      parent: "root",
      views: {
        content: {
          controller: "SeguroviajeCotizarController",
          templateUrl: "/polizas/app/seguroviaje/cotizar/seguroviaje-cotizar.html"
        }
      },
      resolve: {},
      resolver: [
        {
          name: "seguroviajeCotizar",
          moduleName: "appSeguroviaje",
          files: ["seguroviajeCotizarController"]
        }
      ]
    },

    {
      name: "seguroviajeCotizar.initSteps",
      url: "/pasos",
      code: [
        1582,
        {
          value: 1528,
          valueProd: 1582
        }
      ],
      thenRoutes: ["/pasos/1"],
      description: "Cotizar seguro de viaje",
      views: {
        contenido: {
          controller: "SeguroviajeCotizarStepsController as vm",
          templateUrl: "/polizas/app/seguroviaje/cotizar/steps/seguroviaje-cotizar-steps.html"
        }
      },
      resolver: [
        {
          name: "seguroviajeCotizar.initSteps",
          moduleName: "appSeguroviaje",
          files: ["seguroviajeCotizarStepsController"]
        }
      ]
    },

    {
      name: "seguroviajeCotizar.initSteps.steps",
      url: "/:step",
      code: [
        1582,
        {
          value: 1528,
          valueProd: 1582
        }
      ],
      breads: ["homePolizasSeguroviaje"],
      description: "Cotización Seguro de viaje",
      views: {
        contenido: {
          template: function($stateParam) {
            var template = [
              null,
              "<seguroviaje-cotizar-step-one-component></seguroviaje-cotizar-step-one-component>",
              "<seguroviaje-cotizar-step-two-component></seguroviaje-cotizar-step-two-component>",
              "<seguroviaje-cotizar-step-three-component></seguroviaje-cotizar-step-three-component>",
              "<seguroviaje-cotizar-step-four-component></seguroviaje-cotizar-step-four-component>"
            ];
            return $stateParam.step < 5 ? template[$stateParam.step] : template[4];
          }
        }
      }
    },

    {
      name: "seguroviajeCotizaciones",
      code: [
        1583,
        {
          value: 1529,
          valueProd: 1583
        }
      ],
      url: "/seguroviaje/cotizaciones",
      breads: ["homePolizasSeguroviaje"],
      description: "Cotizaciones Vigentes",
      parent: "root",
      views: {
        content: {
          controller: "SeguroviajeCotizacionesController as vm",
          templateUrl: "/polizas/app/seguroviaje/cotizaciones/seguroviaje-cotizaciones.html"
        }
      },
      resolve: {},
      resolver: [
        {
          name: "seguroviajeCotizaciones",
          moduleName: "appSeguroviaje",
          files: ["seguroviajeCotizacionesController"]
        }
      ]
    },

    {
      name: "seguroviajeEmisiones",
      code: [
        1584,
        {
          value: 1530,
          valueProd: 1584
        }
      ],
      url: "/seguroviaje/emisiones",
      breads: ["homePolizasSeguroviaje"],
      description: "Búsqueda",
      parent: "root",
      views: {
        content: {
          controller: "SeguroviajeEmisionesController as vm",
          templateUrl: "/polizas/app/seguroviaje/emisiones/seguroviaje-emisiones.html"
        }
      },
      resolve: {},
      resolver: [
        {
          name: "seguroviajeEmisiones",
          moduleName: "appSeguroviaje",
          files: ["seguroviajeEmisionesController"]
        }
      ]
    },

    {
      name: "seguroviajeGuardada",
      code: [
        1582,
        {
          value: 1528,
          valueProd: 1582
        }
      ],
      url: "/seguroviaje/cotizacion-guardada/:numeroDoc",
      breads: ["homePolizasSeguroviaje"],
      description: "Cotización guardada",
      parent: "root",
      views: {
        content: {
          controller: "SeguroviajeCotizacionGuardadaController as vm",
          templateUrl: "/polizas/app/seguroviaje/cotizacion-guardada/seguroviaje-cotizacion-guardada.html"
        }
      },
      resolve: {},
      resolver: [
        {
          name: "seguroviajeGuardada",
          moduleName: "appSeguroviaje",
          files: ["seguroviajeGuardadaController"]
        }
      ]
    },

    {
      name: "seguroviajeEmitir",
      abstract: true,
      code: [
        1582,
        {
          value: 1528,
          valueProd: 1582
        }
      ],
      url: "/seguroviaje/emitir",
      description: "Emitir seguro de viaje",
      parent: "root",
      views: {
        content: {
          controller: "SeguroviajeEmitirController",
          templateUrl: "/polizas/app/seguroviaje/emitir/seguroviaje-emitir.html"
        }
      },
      resolve: {},
      resolver: [
        {
          name: "seguroviajeEmitir",
          moduleName: "appSeguroviaje",
          files: ["seguroviajeEmitirController"]
        }
      ]
    },

    {
      name: "seguroviajeEmitir.initSteps",
      url: "/pasos",
      code: [
        1582,
        {
          value: 1528,
          valueProd: 1582
        }
      ],
      thenRoutes: ["/pasos/1"],
      description: "Emitir seguro de viaje",
      views: {
        contenido: {
          controller: "SeguroviajeEmitirStepsController as vm",
          templateUrl: "/polizas/app/seguroviaje/emitir/steps/seguroviaje-emitir-steps.html"
        }
      },
      resolver: [
        {
          name: "seguroviajeEmitir.initSteps",
          moduleName: "appSeguroviaje",
          files: ["seguroviajeEmitirStepsController"]
        }
      ]
    },

    {
      name: "seguroviajeEmitir.initSteps.steps",
      url: "/:numeroDoc/:step",
      code: [
        1582,
        {
          value: 1528,
          valueProd: 1582
        }
      ],
      breads: ["homePolizasSeguroviaje"],
      description: "Emitir SegurViaje",
      views: {
        contenido: {
          template: function($stateParam) {
            var template = [
              null,
              "<seguroviaje-emitir-step-one-component></seguroviaje-emitir-step-one-component>",
              "<seguroviaje-emitir-step-two-component></seguroviaje-emitir-step-two-component>",
              "<seguroviaje-emitir-step-three-component></seguroviaje-emitir-step-three-component>"
            ];
            return $stateParam.step < 5 ? template[$stateParam.step] : template[4];
          }
        }
      }
    },

    {
      name: "seguroviajeEmitida",
      code: [
        1582,
        {
          value: 1528,
          valueProd: 1582
        }
      ],
      url: "/seguroviaje/cotizacion-emitida/:numeroDoc",
      breads: ["homePolizasSeguroviaje"],
      description: "Validación",
      parent: "root",
      views: {
        content: {
          controller: "SeguroviajeCotizacionGuardadaController as vm",
          templateUrl: "/polizas/app/seguroviaje/cotizacion-guardada/seguroviaje-cotizacion-emitida.html"
        }
      },
      resolve: {},
      resolver: [
        {
          name: "seguroviajeGuardada",
          moduleName: "appSeguroviaje",
          files: ["seguroviajeGuardadaController"]
        }
      ]
    },

    {
      name: "paymentType",

      description: "Modalidades de pago",
      url: "/paymentType",
      parent: "root",
      views: {
        content: {
          controller: "paymentTypeController as paymentCtrl",
          templateUrl: "/polizas/app/modalidadesPago/controller/modalidadesPago.html"
        }
      },
      resolver: [
        {
          name: "paymentType",

          moduleName: "appAutos",
          files: ["paymentTypeController"]
        }
      ]
    },

    {
      name: "paymentGateway",

      description: "Pasarela de pago",
      url: "/paymentGateway",
      params: { paymentParam: null },
      parent: "root",
      views: {
        content: {
          controller: "paymentGatewayController as paymentGatewaytCtrl",
          templateUrl: "/polizas/app/pasarela/controller/pasarelaDePago.html"
        }
      },
      resolver: [
        {
          name: "paymentGateway",

          moduleName: "appAutos",
          files: ["paymentGatewayController"]
        }
      ]
    },

    {
      name: "paymentMessages",

      description: "Mensajes de pago",
      url: "/paymentMessages",
      params: { params: null },
      parent: "root",
      views: {
        content: {
          controller: "paymentMessagesController as paymentMessagesCtrl",
          templateUrl: "/polizas/app/pasarela/controller/mensajePago.html"
        }
      },
      resolver: [
        {
          name: "paymentMessages",

          moduleName: "appAutos",
          files: ["paymentMessagesController"]
        }
      ]
    },

    {
      name: "pagado",

      description: "Mensajes de pago",
      url: "/pagado",
      params: { params: null },
      parent: "root",
      views: {
        content: {
          controller: "pagadoController as pagadoCtrl",
          templateUrl: "/polizas/app/pasarela/controller/pagado.html"
        }
      },
      resolver: [
        {
          name: "pagado",

          moduleName: "appAutos",
          files: ["pagadoController"]
        }
      ]
    },

    {
      name: "sendNotification",

      description: "Envío de notificiones",
      url: "/sendNotification",
      parent: "root",
      views: {
        content: {
          controller: "sendNotificationController as sendNotificationCtrl",
          templateUrl: "/polizas/app/sendNotification/controller/sendNotification.html"
        }
      },
      resolver: [
        {
          name: "sendNotification",

          moduleName: "appAutos",
          files: ["sendNotificationController"]
        }
      ]
    },
    {
      name: "homePolizasRrgg",
      appCode: "",
      url: "/rrgg/home",
      description: "Riesgos Generales",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/rrgg/views/home/homerrgg.template.html",
          controller: "homeRrggController",
          controllerAs: 'vm'
        }
      },
      resolve: {
        isAdmin: [
          "oimClaims",
          "mainServices",
          function(oimClaims, mainServices) {
            return mainServices.isAdminEmisaApp(oimClaims.rolesCode);
          }
        ]
      },
      resolver: [
        {
          name: "homePolizasRrgg",
          moduleName: "appRrgg",
          files: [
            "riesgosGeneralesFactory",
            "homeRrggController"
          ],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "clonarPolizasRrgg",
      appCode: "",
      url: "/rrgg/clonar",
      description: "Clonar Producto",
      breads: ["homePolizasRrgg"],
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/rrgg/views/clonacion/clonacion.template.html",
          controller: "rrggclonacionController",
          controllerAs: 'vm'
        }
      },
      resolve: {
        isAdmin: [
          "oimClaims",
          "mainServices",
          function(oimClaims, mainServices) {
            return mainServices.isAdminEmisaApp(oimClaims.rolesCode);
          }
        ]
      },
      resolver: [
        {
          name: "clonarPolizasRrgg",
          moduleName: "appRrgg",
          files: [
            "riesgosGeneralesService",
            "riesgosGeneralesFactory",
            "rrggclonacionController"
          ],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "bandejaPolizaRiesgosGenerales",
      appCode: "",
      url: "/rrgg/bandejaRiegosGenerales",
      description: "bandeja Riegos Generales",
      breads: ["homePolizasRrgg"],
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/rrgg/views/bandeja-documentos/bandeja-documentos-rrgg.template.html",
          controller: "bandejaRiesgosGeneralesController",
          controllerAs: 'vm'
        }
      },
      resolve: {
        isAdmin: [
          "oimClaims",
          "mainServices",
          function(oimClaims, mainServices) {
            return mainServices.isAdminEmisaApp(oimClaims.rolesCode);
          }
        ]
      },
      resolver: [
        {
          name: "bandejaPolizaRiesgosGeneralesResolve",
          moduleName: "appRrgg",
          files: [
            "riesgosGeneralesService",
            "riesgosGeneralesFactory",
            "bandejaRiesgosGeneralesController"
          ],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "cotizacionRiesgosGenerales",
      appCode: "",
      description: "Cotizar póliza de Riesgos",
      breads: ["homePolizasRrgg"],
      params: { step: null },
      urls: [
        {
          url: "/rrgg/cotizar",
          abstract: true,
          parent: "root",
          thenRoutes: ["/rrgg/cotizar/1"],
          views: {
            content: {
              templateUrl: "/polizas/app/rrgg/views/cotizacion/cotizacion-rrgg.template.html",
              controller: "cotizacionRrggController",
              controllerAs: 'vm'
            }
          },
          resolve: {
            parametros: [
              "cotizacionRiesgosGeneralesResolver",
              "riesgosGeneralesService",
              function() {
                return true;
              }
            ]
          }
        },
        {
          name: "cotizacionRiesgosGenerales.steps",
          url: "/:step",
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              "/polizas/app/rrgg/views/cotizacion/cotizacion-pasos/cotizacion-rrggStep1.template.html",
              "/polizas/app/rrgg/views/cotizacion/cotizacion-pasos/cotizacion-rrggStep2.template.html",
              "/polizas/app/rrgg/views/cotizacion/cotizacion-pasos/emision-rrggStep3.template.html"
            ];
            return c[$stateParam.step];
          },
          controllerProvider: function($stateParams) {
            var c = [
              undefined,
              "cotizacionRrggStep1Controller",
              "cotizacionRrggStep2Controller",
              "emisionRrggStep3Controller"
            ];
            return c[$stateParams.step];
          },
          controllerAs: 'vm'
        }
      ],
      resolver: [
        {
          name: "cotizacionRiesgosGeneralesResolver",
          moduleName: "appRrgg",
          files: [
            "riesgosGeneralesFactory",
            "riesgosGeneralesCommonFactory",
            "riesgosGeneralesService",
            "cotizacionRrggController",
            "cotizacionRrggStep1Controller",
            "cotizacionRrggStep2Controller",
            "emisionRrggStep3Controller"
          ]
        }
      ]
    },
    {
      name: "homePolizaVidaLey",
      currentAppID: "EMISAVIDALEY",
      url: "/vida-ley/home",
      description: constants.module.polizas.vidaLey.description,
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/vida-ley/views/home/home-vida-ley.template.html",
          controller: "homeVidaLeyController",
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: "homePolizaVidaLey",
          moduleName: constants.module.polizas.vidaLey.moduleName,
          files: [
            "vidaLeyFactory",
            "homeVidaLeyController"
          ],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "cotizacionPolizaVidaLey",
      currentAppID: "EMISAVIDALEY",
      code:[3461,3272],
      description: "Cotización póliza de vida ley",
      breads: ["homePolizaVidaLey"],
      params: { step: null },
      urls: [
        {
          url: "/vida-ley/cotizar",
          abstract: true,
          parent: "root",
          thenRoutes: ["/vida-ley/cotizar/1"],
          views: {
            content: {
              templateUrl: "/polizas/app/vida-ley/views/cotizacion/cotizacion-vida-ley.template.html",
              controller: "cotizacionVidaLeyController",
              controllerAs: 'vm'
            }
          },
          resolve: {
            parametros: [
              "vidaLeyService",
              "cotizacionPolizaVidaLeyResolver",
              function(vidaLeyService) {
                return vidaLeyService.getListParametros();
              }
            ]
          }
        },
        {
          name: "cotizacionPolizaVidaLey.steps",
          url: "/:step",
          templateProvider: ['vidaLeyFactory', '$stateParams', function(vidaLeyFactory, $stateParams) {
            return vidaLeyFactory.getTemplateStep($stateParams.step);
          }],
          controllerProvider: ['vidaLeyFactory', '$stateParams', function(vidaLeyFactory, $stateParams) {
            return vidaLeyFactory.getControllerNameStep($stateParams.step);
          }],
          controllerAs: 'vm'
        }
      ],
      resolver: [
        {
          name: "cotizacionPolizaVidaLeyResolver",
          moduleName: constants.module.polizas.vidaLey.moduleName,
          files: [
            "vidaLeyService",
            "vidaLeyFactory",
            "vidaLeyGeneralFactory",
            "autosCotizarFactory",
            "mpfDuracionDeclaracionSeguro",
            "mpfCotizacionResumen",
            "mpfAseguradoRegistroMasivoVidaLey",
            "mpfAseguradoRegistroManualVidaLey",
            "mpfCoberturaVidaLey",
            "cotizacionVidaLeyController",
            "cotizacionContratanteVidaLeyController",
            "cotizacionPolizaVidaLeyController",
            "cotizacionAseguradosVidaLeyController",
            "cotizacionResultadosVidaLeyController",
            "mngSearchActivity"
          ]
        }
      ]
    },
    {
      name: "bandejaPolizaVidaLey",
      currentAppID: "EMISAVIDALEY",
      code:[3465,3276],
      breads: ["homePolizaVidaLey"],
      description: "Documentos vida ley",
      url: "/vida-ley/documentos/:parameter",
      params: { parameter: null },
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/vida-ley/views/bandeja-cotizacion/bandeja-cotizacion-vida-ley.template.html",
          controller: "bandejaCotizacionVidaLeyController",
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: "bandejaPolizaVidaLeyResolver",
          moduleName: constants.module.polizas.vidaLey.moduleName,
          files: [
            "vidaLeyService",
            "vidaLeyFactory",
            "mpfDocumentoItemVidaLey",
            "mpfFiltroDocumentosVidaLey",
            "bandejaCotizacionVidaLeyController"
          ]
        }
      ]
    },
    {
      name: "mantenimientoVidaLey",
      currentAppID: "EMISAVIDALEY",
      code:[3463,3274],
      breads: ["homePolizaVidaLey"],
      description: "Mantenimiento vida ley",
      url: "/vida-ley/mantenimiento",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/vida-ley/views/mantenimiento/mantenimiento-vida-ley.template.html",
          controller: "mantenimientoVidaLeyController",
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: "mantenimientoVidaLeyResolver",
          moduleName: constants.module.polizas.vidaLey.moduleName,
          files: [
            "vidaLeyService",
            "vidaLeyFactory",
            "mantenimientoVidaLeyController"
          ]
        }
      ]
    },
    {
      name: "resumenVidaLey",
      currentAppID: "EMISAVIDALEY",
      breads: ["homePolizaVidaLey"],
      description: "Resumen vida ley",
      url: "/vida-ley/resumen/:documentoId",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/vida-ley/views/resumen-vida-ley/resumen-vida-ley.template.html",
          controller: "resumenVidaLeyController",
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: "resumenVidaLey",
          moduleName: constants.module.polizas.vidaLey.moduleName,
          files: [
            "vidaLeyService",
            "vidaLeyFactory",
            "vidaLeyGeneralFactory",
            "mpfPopupAseguradosVidaLey",
            "resumenVidaLeyController"
          ]
        }
      ]
    },
    {
      name: "homePolizasDeceso",
      code: "",
      url: "/deceso/home",
      description: "Decesos",
      nombreCorto: "HOME",
      parent: "root",
      views: {
        content: {
          controller: "homeDecesoController",
          templateUrl: "/polizas/app/deceso/home/controller/homeDeceso.html"
        }
      },
      resolve: {
      },
      resolver: [
        {
          name: "homePolizasDeceso",
          moduleName: "appDeceso",
          files: ["/polizas/app/deceso/home/controller/homeDecesoController.js", 
          "decesos_security"]
        }
      ]
    },
    {
      name: "productoDeceso",
      code: "",
      params: { step: null },
      description: "Mantenedor de Producto",
      breads: ["homePolizasDeceso"],
      urls: [
        {
          url: "/deceso/producto",
          controller: "productoDecesoController",
          templateUrl: "/polizas/app/deceso/producto/controller/producto.html",
          parent: "root",
          views: {
            content: {
              controller: "productoDecesoController as habCtrl",
              templateUrl: "/polizas/app/deceso/producto/controller/producto.html"
            }
          },
          resolve: {
            role: [
              "oimClaims",
              "mainServices",
              "$state",
              function(oimClaims, mainServices, $state) {
              }
            ]
          }
        }
      ],
      resolver: [
        {
          name: "productoDeceso",
          moduleName: "appDeceso",
          files: ["/polizas/app/deceso/producto/controller/producto.js",
          "decesos_security"],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "editarProductoDeceso",
      code: "",
      description: "Editar Producto",
      breads: ["homePolizasDeceso"],
      urls: [
        {
          url: "/deceso/editarProducto/:codigoRamo",
          controller: "editarProductoController",
          templateUrl: "/polizas/app/deceso/producto/controller/editarProducto.html",
          parent: "root",
          views: {
            content: {
              controller: "editarProductoController as planCtrl",
              templateUrl: "/polizas/app/deceso/producto/controller/editarProducto.html"
            }
          },
          resolve: {
          }
        }
      ],
      resolver: [
        {
          name: "editarProductoDeceso",

          moduleName: "appDeceso",
          files: ["/polizas/app/deceso/producto/controller/editarProductoController.js", 
          "decesos_security"],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "decesoFileInterest",
      code: "",
      params: { step: null },
      description: "Archivos de interés",
      nombreCorto: "DESCARGAR ARCHIVOS DE INTERES",
      breads: ["homePolizasDeceso"],
      urls: [
        {
          url: "/deceso/fileInterest",
          controller: "decesoFileInterest",
          templateUrl: "/polizas/app/deceso/fileInterest/controller/fileInterest.html",
          parent: "root",
          views: {
            content: {
              controller: "decesoFileInterestController",
              templateUrl: "/polizas/app/deceso/fileInterest/controller/fileInterest.html"
            }
          },
          resolve: {
          }
        }
      ],
      resolver: [
        {
          name: "decesoFileInterest",
          moduleName: "appDeceso",
          files: ["/polizas/app/deceso/fileInterest/controller/fileInterest.js",
          "decesos_security"],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "cotizadorDeceso",
      code: "",
      params: { step: null },
      description: "Cotizador de Decesos",
      nombreCorto: "COTIZAR/EMITIR POLIZA DE DECESOS",
      breads: ["homePolizasDeceso"],
      urls: [
        {
          url: "/deceso/cotizador",
          controller: "cotizadorDecesoController",
          templateUrl: "/polizas/app/deceso/emision/component/cotizadorDeceso.html",
          parent: "root",
          views: {
            content: {
              controller: "cotizadorDecesoController",
              templateUrl: "/polizas/app/deceso/emision/component/cotizadorDeceso.html"
            }
          },
          resolve: {
            saludLists: [
              "loaderCotizadorDecesoController", "cotizadorDeceso",
              function(loaderCotizadorDecesoController) {
                return loaderCotizadorDecesoController.getLists(true);
              }
            ]
          }
        }
      ],
      resolver: [
        {
          name: "cotizadorDeceso",
          moduleName: "appDeceso",
          files: ["/polizas/app/deceso/emision/controller/cotizadorDecesoController.js", "decesos_security"],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "cotizacionGuardadaDeceso",
      code: "",
      nombreCorto: "COTIZAR/EMITIR POLIZA DE DECESOS",
      description: "Resumen Cotizacion de Decesos",
      breads: ["homePolizasDeceso"],
      urls: [
        {
          url: "/deceso/cotizacionGuardada/:numDoc",
          controller: "cotizacionGuardadaDecesoController",
          templateUrl: "/polizas/app/deceso/emision/component/cotizacionGuardada.html",
          parent: "root",
          views: {
            content: {
              controller: "cotizacionGuardadaDecesoController",
              templateUrl: "/polizas/app/deceso/emision/component/cotizacionGuardada.html"
            }
          },
          resolve: {}
        }
      ],
      resolver: [
        {
          name: "cotizacionGuardadaDeceso",

          moduleName: "appDeceso",
          files: ["/polizas/app/deceso/emision/controller/cotizacionGuardadaController.js",
          "decesos_security"],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "decesoDocuments",

      currentAppID: "CWVI",
      breads: ["homePolizasDeceso"],
      description: "Documentos decesos",
      nombreCorto: "CONSULTAR COTIZACIONES DE DECESOS",
      params: { doc: null },
      urls: [
        {
          url: "/deceso/documents",
          abstract: true,
          parent: "root",
          thenRoutes: ["/deceso/documents/cotizadas"],

          views: {
            content: {
              controller: "decesoDocumentsController",
              templateUrl: "/polizas/app/deceso/documents/controller/documents.html"
            }
          },
          resolve: {}
        },
        {
          name: "decesoDocuments.docs",
          url: "/:doc",
          params: {},
          templateUrl: function($stateParam) {
            var docs = {
              cotizadas: {
                code: 1,
                name: "cotizadas",
                html: "/polizas/app/deceso/documents/component/referred.html"
              },
              emitidasvi: {
                code: 2,
                name: "emitidasvi",
                html: "/polizas/app/deceso/documents/component/pendingQuotes.html"
              },
              emitidasPro: {
                code: 3,
                name: "emitidasPro",
                html: "/polizas/app/deceso/documents/component/emittedQuotes.html"
              }

            };
            var vDoc = docs[$stateParam.doc];
            return vDoc.html;
          },
          resolve: {
            vidaProducts: [
              "loaderDecesoDocumentsController",
              "decesoDocuments",
              function(loaderDecesoDocumentsController, decesoDocuments) {
                return loaderDecesoDocumentsController.getProducts(true);
              }
            ]
          },
          controllerProvider: function($stateParams) {
            var docs = {
              cotizadas: {
                code: 1,
                name: "cotizadas",
                js: "decesoReferredController"
              },
              emitidasvi: {
                code: 2,
                name: "emitidasvi",
                js: "decesoPendingQuotesController"
              },
              emitidasPro: {
                code: 3,
                name: "emitidasPro",
                js: "decesoEmittedQuotesController"
              }
            };
            var vDoc = docs[$stateParams.doc];
            return vDoc.js;
          }
        }
      ],
      resolver: [
        {
          name: "decesoDocuments",
          moduleName: "appDeceso",
          files: [
            "decesoPendingQuotesController",
            "decesoEmittedQuotesController",
            "decesoReferredController",
            "decesoDocumentsController",
            "decesos_security"
          ]
        }
      ]
    },
    {
      name: "decesoEmision",

      currentAppID: "CWVI",
      breads: ["homePolizasDeceso"],
      description: "Emision Decesos",
      nombreCorto: "COTIZAR/EMITIR POLIZA DE DECESOS",
      params: { doc: null },
      urls: [
        {
          url: "/deceso/emision/:quotationNumber",
          abstract: true,
          parent: "root",
          thenRoutes: ["/deceso/emision/:quotationNumber/1"],
          views: {
            content: {
              controller: "decesoEmisionController",
              templateUrl: "/polizas/app/deceso/pasosEmision/controller/documents.html"
            }
          },
          resolve: {}
        },
        {
          name: "decesoEmision.steps",
          url: "/:step",
          params: {},
          templateUrl: function($stateParam) {
            var steps = [
              undefined,
              "/polizas/app/deceso/pasosEmision/component/paso-1.html",
              "/polizas/app/deceso/pasosEmision/component/paso-2.html"
            ];
            return steps[$stateParam.step];
          },
          resolve: {
          },
          controllerProvider: function($stateParams) {
            var steps = [
              undefined,
              'decesoEmision1Controller',
              'decesoEmision2Controller'
            ];
            return steps[$stateParams.step];
          }
        }
      ],
      resolver: [
        {
          name: "decesoEmision",
          moduleName: "appDeceso",
          files: [
            "decesoEmision1Controller",
            "decesoEmision2Controller",
            "decesoEmisionController",
            "decesos_security"
          ]
        }
      ]
    },
    {
      name: "homePolizaEpsEmpresa",
      appCode: constants.module.polizas.epsEmpresa.code,
      url: "/eps-empresa/home",
      description: constants.module.polizas.epsEmpresa.description,
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/eps-empresa/views/home/home-eps-empresa.template.html",
          controller: "homeEpsEmpresaController",
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: "homePolizaEpsEmpresa",
          moduleName: constants.module.polizas.epsEmpresa.moduleName,
          files: [
            "epsEmpresaFactory",
            "homeEpsEmpresaController"
          ],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "mantenimientoPolizaEpsEmpresa",
      appCode: constants.module.polizas.epsEmpresa.code,
      breads: ["homePolizaEpsEmpresa"],
      description: "Mantenimiento",
      url: constants.module.polizas.epsEmpresa.URLS.EPSMANT,//"/eps-empresa/mantenimiento",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/eps-empresa/views/mantenimiento/mantenimiento-eps-empresa.template.html",
          controller: "mantenimientoEpsEmpresaController",
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: "mantenimientoPolizaEpsEmpresaResolver",
          moduleName: constants.module.polizas.epsEmpresa.moduleName,
          files: [
            "epsEmpresaService",
            "epsEmpresaFactory",
            "mantenimientoEpsEmpresaController"
          ]
        }
      ]
    },
    {
      name: "cotizacionPolizaEpsEmpresa",
      appCode: constants.module.polizas.epsEmpresa.code,
      description: "Registrar Solicitud",
      breads: ["homePolizaEpsEmpresa"],
      params: { step: null },
      urls: [
        {
          url: "/eps-empresa/cotizar",
          abstract: true,
          parent: "root",
          thenRoutes: [constants.module.polizas.epsEmpresa.URLS.EPSEMPREG],//"/eps-empresa/cotizar/1"],
          views: {
            content: {
              templateUrl: "/polizas/app/eps-empresa/views/solicitud/cotizacion-eps-empresa.template.html",
              controller: "cotizacionEpsEmpresaController",
              controllerAs: 'vm'
            }
          }
        },
        {
          name: "cotizacionPolizaEpsEmpresa.steps",
          url: "/:step",
          templateProvider: ['epsEmpresaFactory', '$stateParams', function(epsEmpresaFactory, $stateParams) {
            return epsEmpresaFactory.getTemplateStep($stateParams.step);
          }],
          controllerProvider: ['epsEmpresaFactory', '$stateParams', function(epsEmpresaFactory, $stateParams) {
            return epsEmpresaFactory.getControllerNameStep($stateParams.step);
          }],
          controllerAs: 'vm'
        }
      ] ,
      resolver: [
        {
          name: "cotizacionPolizaEpsEmpresaResolver",
          moduleName: constants.module.polizas.epsEmpresa.moduleName,
          files: [
            "/polizas/app/eps-empresa/views/solicitud/cotizacion-eps-empresa.controller.js",
            "/polizas/app/eps-empresa/views/solicitud/solicitud-pasos/cotizacion-datos-empresa-eps-empresa.controller.js",
            "/polizas/app/eps-empresa/views/solicitud/solicitud-pasos/cotizacion-informacion-empresa-eps-empresa.controller.js",
            "/polizas/app/eps-empresa/views/solicitud/solicitud-pasos/cotizacion-informacion-trabajadores-eps-empresa.controller.js",
            "/polizas/app/eps-empresa/views/solicitud/solicitud-pasos/cotizacion-informacion-adicional-eps-empresa.controller.js",
            "/polizas/app/eps-empresa/views/solicitud/solicitud-pasos/cotizacion-final-eps-empresa.controller.js",
            "epsEmpresaService",
            "epsEmpresaFactory",
          ]
        }
      ]
    },
    {
      name: "bandejaPolizaEpsEmpresa",
      appCode: constants.module.polizas.epsEmpresa.code,
      breads: ["homePolizaEpsEmpresa"],
      description: "Bandeja",
      url: constants.module.polizas.epsEmpresa.URLS.EPSEMPBAND,//"/eps-empresa/bandeja",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/eps-empresa/views/bandeja/bandeja-eps-empresa.template.html",
          controller: "bandejaEpsEmpresaController",
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: "bandejaPolizaEpsEmpresaResolver",
          moduleName: constants.module.polizas.epsEmpresa.moduleName,
          files: [
            "epsEmpresaService",
            "epsEmpresaFactory",
            "bandejaEpsEmpresaController"
          ],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "validacionPolizaEpsEmpresa",
      appCode: constants.module.polizas.epsEmpresa.code,
      url: "/eps-empresa/validacion",
      description: constants.module.polizas.epsEmpresa.description,
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/eps-empresa/views/validacion/validacion-eps-empresa.template.html",
          controller: "validacionEpsEmpresaController",
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: "validacionPolizaEpsEmpresa",
          moduleName: constants.module.polizas.epsEmpresa.moduleName,
          files: [
            "epsEmpresaFactory",
            "validacionEpsEmpresaController"
          ],
          resolveTemplate: true
        }
      ]
    },


    {
      name: "reporteVidaLey",
      currentAppID: "EMISAVIDALEY",
      code:[3464,3275],
      breads: ["homePolizaVidaLey"],
      description: "Reporte de vida ley",
      url: "/vida-ley/reporte/:documentoId",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/vida-ley/views/resumen-reporte-vida-ley/resumen-reporte-vida-ley.template.html",
          controller: "resumenReporteVidaLeyController",
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: "reporteVidaLey",
          moduleName: constants.module.polizas.vidaLey.moduleName,
          files: [
            "vidaLeyService",
            "vidaLeyFactory",
            "vidaLeyGeneralFactory",
            "mpfPopupAseguradosVidaLey",
            "resumenReporteVidaLeyController"
          ],
          resolveTemplate: true
      }
  ]
    },
    {
      name: "emisionPolizaVidaLey",
      currentAppID: "EMISAVIDALEY",
      code:[3462,3273],
      description: "Emitir póliza de Vida Ley",
      breads: ["homePolizaVidaLey"],
      params: { step: null },
      urls: [
        {
          url: "/vida-ley/emitir/:quotation",
          abstract: true,
          parent: "root",
          thenRoutes: ["/vida-ley/emitir/1"],
          views: {
            content: {
              templateUrl: "/polizas/app/vida-ley/views/emision/emision-vida-ley.template.html",
              controller: "emisionVidaLeyController",
              controllerAs: 'vm'
            }
          }
        },
        {
          name: "emisionPolizaVidaLey.steps",
          url: "/:step",
          templateProvider: ['vidaLeyFactory', '$stateParams', function(vidaLeyFactory, $stateParams) {
            return vidaLeyFactory.getTemplateStepEmision($stateParams.step);
          }],
          controllerProvider: ['vidaLeyFactory', '$stateParams', function(vidaLeyFactory, $stateParams) {
            return vidaLeyFactory.getControllerNameStepEmision($stateParams.step);
          }],
          controllerAs: 'vm'
      }],
      resolver: [
      {
          name: "emisionPolizaVidaLeyResolver",
          moduleName: constants.module.polizas.vidaLey.moduleName,
          files: [
          "vidaLeyService",
          "vidaLeyFactory",
          "vidaLeyGeneralFactory",
          "autosCotizarFactory",
          "mpfCotizacionResumen",
          "emisionVidaLeyController",
          "emisionContratanteVidaLeyController",
          "emisionAseguradosVidaLeyController"
          // "emisionResultadosVidaLeyController"
          ],
          resolveTemplate: true
      } ]
    },
    {
        name: "resumenEmisionVidaLey",
        currentAppID: "EMISAVIDALEY",
        breads: ["homePolizaVidaLey"],
        url: "/vida-ley/emision/resumen/:documentoId",
        description: "Cotizar Poliza de Vida Ley",
        parent: "root",
        views: {
          content: {
            templateUrl: "/polizas/app/vida-ley/views/emision/emision-resumen/emision-resumen.html",
            controller: "emisionResumenController",
            controllerAs: 'vm'
          }
        },
        resolver: [
          {
            name: "resumenEmisionVidaLey",
            moduleName: constants.module.polizas.vidaLey.moduleName,
            files: [
              "vidaLeyService",
              "vidaLeyFactory",
              "emisionResumenController"
            ],
            resolveTemplate: true
        }
    ]
    },
    {
      name: "bandejaReportesVidaLey",
      currentAppID: "EMISAVIDALEY",
      code:[3464,3275],
      breads: ["homePolizaVidaLey"],
      description: "Bandeja reportes vida ley",
      url: "/vida-ley/bandeja-reportes",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/vida-ley/views/bandeja-reportes/bandeja-reportes-vida-ley.template.html",
          controller: "bandejaReportesVidaLeyController",
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: "bandejaReportesVidaLeyResolver",
          moduleName: constants.module.polizas.vidaLey.moduleName,
          files: [
            "vidaLeyService",
            "vidaLeyFactory",
            "mpfReporteItemVidaLey",
            "mpfFiltroReportesVidaLey",
            "bandejaReportesVidaLeyController"
          ],
          resolveTemplate: true
      }
      ]
    },
    {
      name: "homePolizasCampoSanto",
      appCode: "",
      url: "/Camposanto/home",
      description: "Camposanto",
      nombreCorto: "HOME",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/sepelio/views/home/homeSepelio.template.html",
          controller: "homeSepeliosController",
          controllerAs: 'vm'
        }
      },
      resolve: {
        isAdmin: [
          "oimClaims",
          "mainServices",
          function(oimClaims, mainServices) {
            return mainServices.isAdminEmisaApp(oimClaims.rolesCode);
          }
        ]
      },
      resolver: [
        {
          name: "homePolizasCampoSanto",
          moduleName: "appSepelio",
          files: [
            "homeSepeliosController",
            "campoSantoFactory",
            "campoSantoService",
            "sepelioSecurity"
          ],
          resolveTemplate: true
        }
      ]
    },
    {
      name: "bandejaPolizaCampoSanto",
      appCode: "",
      breads: ["homePolizasCampoSanto"],
      description: "Bandeja CampoSanto",
      url: "/Camposanto/home/BandejaCampoSanto",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/sepelio/views/bandeja-cotizacion/bandeja-cotizacion-camposanto.template.html",
          controller: "bandejaPolizaCampoSantoController",
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: "bandejaPolizaCampoSantoResolver",
          moduleName: "appSepelio",
          files: [
            "bandejaPolizaCampoSantoController",
            "sepelioSecurity"
          ]
        }
      ]
    },
    {
      name: "bandejaDocumentosCampoSanto",
      appCode: "",
      breads: ["homePolizasCampoSanto"],
      description: "Bandeja de Documentos",
      url: "/Camposanto/home/bandejaDocumentos",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/sepelio/views/bandeja-documentos/bandeja-documentos.template.html",
          controller: "bandejaDocumentosCampoSantoController",
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: "bandejaDocumentosResolver",
          moduleName: "appSepelio",
          files: [
            "bandejaDocumentosCampoSantoController",
            "campoSantoFactory",
            "campoSantoService"
          ]
        }
      ]
    },
    {
      name: "correoExcepcionalCampoSanto",
      appCode: "",
      breads: ["homePolizasCampoSanto"],
      description: "Correo Excepcional",
      url: "/Camposanto/home/correoExcepcional",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/sepelio/views/correo-excepcional/correo-excepcional.template.html",
          controller: "correoExcepcionalCampoSantoController",
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: "correoExcepcionalCampoSantoResolver",
          moduleName: "appSepelio",
          files: [
            "correoExcepcionalCampoSantoController",
            "campoSantoFactory",
            "campoSantoService"
          ]
        }
      ]
    },
    {
      name: "cpsGestionDocumentos",
      appCode: "",
      breads: ["homePolizasCampoSanto"],
      description: "Gestión de Documentos",
      url: "/Camposanto/home/gestionDocumentos",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/sepelio/views/gestion-documentos/gestion-documentos.template.html",
          controller: "gestionDocumentosCampoSantoController",
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: "gestionDocumentosResolver",
          moduleName: "appSepelio",
          files: [
            "gestionDocumentosCampoSantoController",
            "campoSantoFactory",
            "campoSantoService"
          ]
        }
      ]
    },
    {
      name: "cpsAgrupamiento",
      appCode: "",
      breads: ["homePolizasCampoSanto"],
      description: "Agrupamiento",
      url: "/Camposanto/home/agrupamiento",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/sepelio/views/agrupamiento/agrupamiento.template.html",
          controller: "agrupamientoCampoSantoController",
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: "agrupamientoResolver",
          moduleName: "appSepelio",
          files: [
            "agrupamientoCampoSantoController",
            "campoSantoFactory",
            "campoSantoService"
          ]
        }
      ]
    },
    {
      name: "repositorioDocumentosCamposanto",
      appCode: "",
      breads: ["homePolizasCampoSanto"],
      description: "Repositorio de Documentos",
      url: "/Camposanto/home/Repositorio",
      nombreCorto: "ACCIONES",
      parent: "root",
      params:{
        itemCotizacion: null
      },
      views: {
        content: {
          templateUrl: "/polizas/app/sepelio/views/repositorio-documentos/repositorio-documentos.template.html",
          controller: "repositorioDocumentosCamposantoController",
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: "repositorioDocumentosCamposanto",
          moduleName: "appSepelio",
          files: [
            "repositorioDocumentosCamposantoController",
            "campoSantoFactory",
            "campoSantoService",
            "sepelioSecurity"
          ]
        }
      ]
    },
    {
      name: "cotizacionSepelio",
      appCode: "",
      description: "Cotizar Contrato de Sepelio",
      breads: ["homePolizasCampoSanto"],
      params: { step: null },
      urls: [
        {
          url: "/Camposanto/cotizar",
          abstract: true,
          parent: "root",
          thenRoutes: ["/Camposanto/cotizar/1"],
          views: {
            content: {
              templateUrl: "/polizas/app/sepelio/views/cotizacion/cotizacion-sepelio.template.html",
              controller: "cotizacionSepelioController",
              controllerAs: 'vm'
            }
          },
          resolve: {
            parametros: [
              "cotizacionSepelioResolver",
              function() {
                return true
              }
            ]
          }
        },
        {
          name: "cotizacionSepelio.steps",
          url: "/:step",
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              "/polizas/app/sepelio/views/cotizacion/cotizacion-pasos/cotizacion-sepelioStep1.template.html",
              "/polizas/app/sepelio/views/cotizacion/cotizacion-pasos/cotizacion-sepelioStep2.template.html"
            ];
            return c[$stateParam.step];
          },
          controllerProvider: function($stateParams) {
            var c = [
              undefined,
              "cotizacionSepelioStep1Controller",
              "cotizacionSepelioStep2Controller"
            ];
            return c[$stateParams.step];
          },
          controllerAs: 'vm'
        }
      ],
      resolver: [
        {
          name: "cotizacionSepelioResolver",
          moduleName: "appSepelio",
          files: [
            "cotizacionSepelioController",
            "cotizacionSepelioStep1Controller",
            "cotizacionSepelioStep2Controller",
            "campoSantoFactory",
            "campoSantoService",
            "sepelioSecurity"
          ]
        }
      ]
    },
    {
      name: "bandejaDocumentosPolizaCampoSanto",
      appCode: "",
      breads: ["homePolizasCampoSanto"],
      description: "Bandeja Documentos CampoSanto",
      url: "/Camposanto/home/BandejaDocumentosCampoSanto",
      parent: "root",
      views: {
        content: {
          templateUrl: "/polizas/app/sepelio/views/mantenimiento/bandeja-documentos/bandeja-documentos.template.html",
          controller: "bandejaDocumentosController",
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: "bandejaDocumentosPolizaCampoSantoResolver",
          moduleName: "appSepelio",
          files: [
            "bandejaDocumentosController",
            "sepelioSecurity"
          ]
        }
      ]
    },

    {
      name: "mantenedorTasaAjustes",
      appCode: "",
      description: "Mantenedor de tasas de ajustes",
      breads: ["homePolizasSalud"],
      urls: [
        {
          url: "/salud/mantenedor-tasas-ajustes",
          controller: "mantenedorTasasAjustes",
          templateUrl: "/polizas/app/salud/tasasAjustes/controller/mantenedor-tasas-ajustes.html",
          parent: "root",
          views: {
            content: {
              controller: "mantenedorTasasAjustesController",
              templateUrl: "/polizas/app/salud/tasasAjustes/controller/mantenedor-tasas-ajustes.html",
              controllerAs: 'vm'
            }
          }
        }
      ],
      resolver: [
        {
          name: "mantenedorTasasAjustes",
          moduleName: "appSalud",
          files: [
            "mpfItemMantenedorTasasAjustesSalud",
            "mpfFiltroMantenedorTasasAjustesSalud",
            "mantenedorTasasAjustesController"
          ],
        }
      ]
    },
  ];

  return data;
});
 