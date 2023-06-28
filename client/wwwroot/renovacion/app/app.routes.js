define(["constants"], function (constants) {
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
          function (accessSupplier) {
            return accessSupplier.getAllObject();
          }
        ]
      },
      resolver: [
        {
          name: "renovacionHome",
          moduleName: "appReno",
          files: ["/renovacion/app/renovacion/views/home/home-renovacion.controller.js"],
          resolveTemplate: true
        },
        {
          name: "layout",
          moduleName: "appReno",
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
          controller: [function () { }],
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
          controller: [function () { }],
          templateUrl: "/app/handlerErr/template/500.html"
        }
      }
    },
    {
      name: "renov",
      code: "",
      url: "/",
      parent: "root",
      views: {
        content: {
          controller: "consultaRenovacionController",
          templateUrl: "/renovacion/app/renovacion/views/bandeja/consulta-renovacion.html",
          controllerAs: 'vm'
        }
      },
      resolve: {
        authorizedResource: [
          "accessSupplier",
          function (accessSupplier) {
            return accessSupplier.getAllObject();
          }
        ]
      },
      resolver: [
        {
          name: "consultaRenovacion",
          moduleName: "appReno",
          files: ["/renovacion/app/renovacion/components/bandeja/consulta-renovacion.js", "mpfFiltroRenovacion","renovacionBandejaService","renovacionBandejaFactory"],
        },
        
      ]
    },
    {
      name: "gestionProceso",
      code: "",
      url: "/gestionProceso/:polizaID",
      description: "Gestion Proceso",
      parent: "root",
      views: {
        content: {
          controller: "gestionProcesoController",
          templateUrl: "/renovacion/app/renovacion/views/gestion/gestion-proceso.html",
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: "consultRenovacion",
          moduleName: "appReno",
          files: ["/renovacion/app/renovacion/components/gestion/gestion-proceso.js","renovacionBandejaService", "renovacionBandejaFactory"]
        }
      ]
    },

  ];
  return data;
});
