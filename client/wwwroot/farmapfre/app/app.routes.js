(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "farmapfreRoutes", [],
  function() {
    var data = [
      {
		    name: 'root',
        abstract: true,
        views: {
          'top@root': {
            templateUrl: '/app/index/controller/template/top.html',
            controller: 'topController'
          },
          'header@root': {
            templateUrl: '/app/index/controller/template/header.html',
            controller: 'headerController'
          },
          'left_bar@root': {
            templateUrl: '/app/index/controller/template/left_bar.html',
            controller: 'leftBarController'
          },

          'body_left@root': {
            templateUrl: '/app/index/controller/template/body_left.html',
            controller: 'bodyLeftController'
          },
          'right_bar@root': {
            templateUrl: '/app/index/controller/template/right_bar.html',
            controller: 'rightBarController'
          },
          'footer@root': {
            templateUrl: '/app/index/controller/template/footer.html',
            controller: 'footerController'
          },
          'bottom@root': {
            templateUrl: '/app/index/controller/template/bottom.html',
            controller: 'bottomController'
          }

        },
        resolve: {
          authorizedResource: ['accessSupplier', function(accessSupplier) {
            return accessSupplier.getAllObject();
          }]
        },
        resolver: [{
          name: "layout",
          moduleName: "oim.layout",
          files: ['topController', 'headerController', 'leftBarController', 'bodyMiddelController', 'bodyLeftController', 'rightBarController', 'footerController', 'bottomController'],
        }]
      },
      {
        name: 'farmapfreHome',
        parent: 'root',
        description: 'Home',
        title: 'Home',
        url: '/',
        views: {
          content: {
            controller: 'homeController',
            templateUrl: '/farmapfre/app/home/home.html'
          }
        },
        resolver: [
          {
            name: 'home',
            moduleName: 'farmapfre.app',
            files: [
              '/farmapfre/app/home/home-controller.js'
            ]
          }
        ]
      },
      // ORDER: INICIO
      {
        name: 'order',
        description: 'Back-Office Farmapfre',
        // breads: ['farmapfreHome'],
        title: 'Farmapfre Backoffice',
        urls: [
          {
            name:'order',
            description: 'Pedidos',
            url:'/order',
            abstract: true,
            parent: 'root',
            views: {
              content: {
                controller: 'indexController',
                templateUrl: '/farmapfre/app/order/index.html'
              }
            },
            resolver: [
              {
                name: 'order',
                moduleName: 'farmapfre.app',
                files: [
                  '/farmapfre/app/order/index-controller.js'
                ]
              }
            ]
          },
          {
            name: 'order.searchRequest',
            url:'',
            template: '<order-request-search></order-request-search>',
            resolver:[{name: 'searchRequest', moduleName: 'farmapfre.app', files: ['orderRequestSearchComponent', 'filterOrderComponent', 'infoClientComponent']}]
          },
          {
            name: 'order.item',
            url:'/:orderid',
            template: '<order-request-item></order-request-item>',
            resolve: {orderItem: ['requestItem', '$stateParams', 'orderItemService', function(requestItem, $stateParams, orderItemService) {
                return orderItemService.getOrder($stateParams.orderid);
            }]},
            resolver:[{
              name:'requestItem',
              moduleName:'farmapfre.app',
              files:['orderRequestItemComponent', 'orderRequestSearchComponent', 'infoClientComponent', 'recipeVerificationComponent', 'orderDeliveryPayComponent']
            }]
          },
          {
            name: 'order.searchdispatch',
            url:'dispatch',
            template:"<order-dispatch-search></order-dispatch-search>",
            resolver:[{name:'searchRequest',moduleName:'farmapfre.app',files:['orderDispatchSearchComponent', 'filterOrderComponent', 'infoClientComponent']}]
          },
          {
            name: 'order.dispatchItem',
            url: 'dispatch/:orderid/:itemDispatch',
            template: "<order-dispatch-item></order-dispatch-item>",
            resolve : {getDispatch: ['itemDispatch', 'serviceDispathModel', '$stateParams',function(a,serviceDispathModel, $stateParams) {
              return serviceDispathModel.getDispatchFromServer($stateParams.orderid, $stateParams.itemDispatch);
            }] },
            resolver: [{name:'itemDispatch',moduleName:'farmapfre.app',files:['orderDispatchItemComponent', 'infoClientComponent']}]
          }
        ]
      },
      // ORDER: FIN
      {
        name:'resend',
        description: 'Reenviar - SMS - EMAIL',
        // breads: ['farmapfreHome'],
        title: 'Reenviar sms - email',
        urls: [
          {
            name:'resend',
            description: 'Reenviar',
            url:'/resend',
            abstract: true,
            parent: 'root',
            views: {
              content: {
                templateUrl: '/farmapfre/app/resend/index.html'
              }
            }
          },
          {
            name: 'resend.searchAffiliate',
            url:'',
            template: '<resend-affiliate></resend-affiliate>',
            resolver:[{ name: 'searchAffiliate', moduleName: 'farmapfre.app', files: ['resendAffiliateComponent', 'filterAffiliateComponent']}]
          }
        ]
      },
      {
        name:'report',
        description: 'Reporte de Autorizaciones SITEDS',
        // breads: ['farmapfreHome'],
        title: 'Reportes',
        urls: [
          {
            name:'report',
            description: 'Reportes',
            url:'/report',
            abstract: true,
            parent: 'root',
            views: {
              content: {
                templateUrl: '/farmapfre/app/resend/index.html'
              }
            }
          },
          {
            name: 'report.authorization',
            url:'',
            template: '<info-authorization></info-authorization>',
            resolver:[{ name: 'infoAutorization', moduleName: 'farmapfre.app', files: ['infoAuthorization']}]
          }
        ]
      },
	    {
        name: "maintenanceHome",
        appCode: "MAINTENANCE",
        url: "/maintenance/home",
        description: "Mantenimientos",
        parent: "root",
        views: {
          content: {
            //controller: "ctrlMaintenanceHome",
            templateUrl: "/farmapfre/app/maintenance/home.html"
          }
        }
      },
      {
        name: "searchBoDispatch",
        appCode: "MAINTENANCE",
        breads: ['maintenanceHome'],
        url: "/maintenance/bodispatch",
        description: "Relación BO Despachos - Sede - Almacén",
        controller: "searchBoDispatchController",
        templateUrl: "/farmapfre/app/maintenance/boDispatch/bodispatch-search-maintenance.html",
        parent: "root",
        views: {
          content: {
            templateUrl: "/farmapfre/app/maintenance/boDispatch/bodispatch-search-maintenance.html",
            controller: "searchBoDispatchController"
          }
        },
        resolver: [
          {
            name: "searchBoDispatch",
            moduleName: "farmapfre.app",
            files: ["/farmapfre/app/maintenance/boDispatch/bodispatch-search-maintenance.js", "bodispatchItemMaintenanceComponent"],
            resolveTemplate: true
          },
          {
            name: "layout",
            moduleName: "oim.layout",
            files: ['topController', 'headerController', 'leftBarController', 'bodyMiddelController', 'bodyLeftController', 'rightBarController', 'footerController', 'bottomController'],
            resolveTemplate: true
          }
        ]
      },
      {
        name: "createBoDispatch",
        appCode: "MAINTENANCE",
        breads: ['searchBoDispatch'],
        url: "/maintenance/bodispatch/create",
        description: "Relación BO Despachos - Sede - Almacén",
        controller: "createBoDispatchController",
        templateUrl: "/farmapfre/app/maintenance/boDispatch/create/bodispatch-create-maintenance.html",
        parent: "root",
        views: {
          content: {
            templateUrl: "/farmapfre/app/maintenance/boDispatch/create/bodispatch-create-maintenance.html",
            controller: "createBoDispatchController"
          }
        },
        resolver: [
          {
            name: "createBoDispatch",
            moduleName: "farmapfre.app",
            files: ["/farmapfre/app/maintenance/boDispatch/create/bodispatch-create-maintenance.js", "bodispatchItemMaintenanceComponent"],
            resolveTemplate: true
          },
          {
            name: "layout",
            moduleName: "oim.layout",
            files: ['topController', 'headerController', 'leftBarController', 'bodyMiddelController', 'bodyLeftController', 'rightBarController', 'footerController', 'bottomController'],
            resolveTemplate: true
          }
        ]
      },
	    {
        name: "boDistrict",
        appCode: "MAINTENANCE",
        breads: ['maintenanceHome'],
        url: "/maintenance/bodistrict",
        description: "Relación Distritos Coberturados - BO Despachos",
        controller: "bodistrictController",
        templateUrl: "/farmapfre/app/maintenance/boDistrict/bodistrict-maintenance.html",
        parent: "root",
        views: {
          content: {
            templateUrl: "/farmapfre/app/maintenance/boDistrict/bodistrict-maintenance.html",
            controller: "bodistrictController"
          }
        },
        resolver: [
          {
            name: "boDistrict",
            moduleName: "farmapfre.app",
            files: ["/farmapfre/app/maintenance/boDistrict/bodistrict-maintenance.js", "bodistrictItemMaintenanceComponent"],
            resolveTemplate: true
          }
        ]
      },
      {
        name: "createBoDistrict",
        appCode: "MAINTENANCE",
        breads: ['boDistrict'],
        url: "/maintenance/bodistrict/create",
        description: "Relación Distritos Coberturados - BO Despachos",
        controller: "createBoDistrictController",
        templateUrl: "/farmapfre/app/maintenance/boDistrict/createBoDistrict/boDistrict-new.html",
        parent: "root",
        views: {
          content: {
            templateUrl: "/farmapfre/app/maintenance/boDistrict/createBoDistrict/boDistrict-new.html",
            controller: "createBoDistrictController"
          }
        },
        resolver: [
          {
            name: "createBoDistrict",
            moduleName: "farmapfre.app",
            files: ["/farmapfre/app/maintenance/boDistrict/createBoDistrict/boDistrict-new.js", "bodistrictItemMaintenanceComponent"],
            resolveTemplate: true
          },
          {
            name: "layout",
            moduleName: "oim.layout",
            files: ['topController', 'headerController', 'leftBarController', 'bodyMiddelController', 'bodyLeftController', 'rightBarController', 'footerController', 'bottomController'],
            resolveTemplate: true
          }
        ]
      },
      {
        name: "alliedPharmacies",
        appCode: "MAINTENANCE",
        breads: ['maintenanceHome'],
        url: "/maintenance/allied-pharmacies",
        description: "Farmacias Aliadas",
        controller: "alliedpharmaciesController",
        templateUrl: "/farmapfre/app/maintenance/alliedPharmacies/alliedpharmacies-maintenance.html",
        parent: "root",
        views: {
          content: {
            templateUrl: "/farmapfre/app/maintenance/alliedPharmacies/alliedpharmacies-maintenance.html",
            controller: "alliedpharmaciesController"
          }
        },
        resolver: [
          {
            name: "alliedPharmacies",
            moduleName: "farmapfre.app",
            files: ["/farmapfre/app/maintenance/alliedPharmacies/alliedpharmacies-maintenance.js", "alliedpharmaciesItemMaintenanceComponent", "filterLocalPharmacyComponent"],
            resolveTemplate: true
          }
        ]
      },
      {
        name: "createAlliedPharmacies",
        appCode: "MAINTENANCE",
        breads: ['alliedPharmacies'],
        url: "/maintenance/allied-pharmacy/create",
        description: "Crear",
        controller: "createAlliedPharmaciesController",
        templateUrl: "/farmapfre/app/maintenance/alliedPharmacies/createAlliedPharmacies/alliedPharmacies-new.html",
        parent: "root",
        views: {
          content: {
            templateUrl: "/farmapfre/app/maintenance/alliedPharmacies/createAlliedPharmacies/alliedPharmacies-new.html",
            controller: "createAlliedPharmaciesController"
          }
        },
        resolver: [
          {
            name: "createAlliedPharmacies",
            moduleName: "farmapfre.app",
            files: ["/farmapfre/app/maintenance/alliedPharmacies/createAlliedPharmacies/alliedPharmacies-new.js", "alliedpharmaciesItemMaintenanceComponent"],
            resolveTemplate: true
          },
          {
            name: "layout",
            moduleName: "oim.layout",
            files: ['topController', 'headerController', 'leftBarController', 'bodyMiddelController', 'bodyLeftController', 'rightBarController', 'footerController', 'bottomController'],
            resolveTemplate: true
          }
        ]
      },
      {
        name: "detailAlliedPharmacies",
        appCode: "MAINTENANCE",
        breads: ['alliedPharmacies'],
        // url: "/maintenance/alliedpharmacies/detailAlliedPharmacies",
        url: "/maintenance/allied-pharmacy/:pharmacyid",
        description: "Detalle",
        controller: "detailAlliedPharmaciesController",
        templateUrl: "/farmapfre/app/maintenance/alliedPharmacies/detailAlliedPharmacies/alliedPharmacies-detail.html",
        parent: "root",
        // params:  {pharmacy: null},
        views: {
          content: {
            templateUrl: "/farmapfre/app/maintenance/alliedPharmacies/detailAlliedPharmacies/alliedPharmacies-detail.html",
            controller: "detailAlliedPharmaciesController"
          }
        },
        resolver: [
          {
            name: "detailAlliedPharmacies",
            moduleName: "farmapfre.app",
            files: ["/farmapfre/app/maintenance/alliedPharmacies/detailAlliedPharmacies/alliedPharmacies-detail.js", "alliedpharmaciesItemMaintenanceComponent", "filterLocalPharmacyComponent"],
            resolveTemplate: true
          },
          {
            name: "layout",
            moduleName: "oim.layout",
            files: ['topController', 'headerController', 'leftBarController', 'bodyMiddelController', 'bodyLeftController', 'rightBarController', 'footerController', 'bottomController'],
            resolveTemplate: true
          }
        ]
      },
      {
        name: "createLocales",
        appCode: "MAINTENANCE",
        breads: ['detailAlliedPharmacies'],
        url: "/maintenance/allied-pharmacy/:pharmacyid/premises/create",
        description: "Crear local",
        controller: "createLocalesController",
        templateUrl: "/farmapfre/app/maintenance/alliedPharmacies/detailAlliedPharmacies/createLocal/locales-new.html",
        parent: "root",
        // params: {pharmacy: null},
        views: {
          content: {
            templateUrl: "/farmapfre/app/maintenance/alliedPharmacies/detailAlliedPharmacies/createLocal/locales-new.html",
            controller: "createLocalesController"
          }
        },
        resolver: [
          {
            name: "createLocalesController",
            moduleName: "farmapfre.app",
            files: ["/farmapfre/app/maintenance/alliedPharmacies/detailAlliedPharmacies/createLocal/locales-new.js", "alliedpharmaciesItemMaintenanceComponent"],
            resolveTemplate: true
          },
          {
            name: "layout",
            moduleName: "oim.layout",
            files: ['topController', 'headerController', 'leftBarController', 'bodyMiddelController', 'bodyLeftController', 'rightBarController', 'footerController', 'bottomController'],
            resolveTemplate: true
          }
        ]
      },
      {
        name: "pharmacyClinic",
        appCode: "MAINTENANCE",
        breads: ['maintenanceHome'],
        url: "/maintenance/pharmacyclinic",
        description: "Relación Clínicas - Farmacias Aliadas",
        controller: "pharmacyclinicController",
        templateUrl: "/farmapfre/app/maintenance/pharmacyClinic/pharmacyclinic-maintenance.html",
        parent: "root",
        views: {
          content: {
            templateUrl: "/farmapfre/app/maintenance/pharmacyClinic/pharmacyclinic-maintenance.html",
            controller: "pharmacyclinicController"
          }
        },
        resolver: [
          {
            name: "pharmacyClinic",
            moduleName: "farmapfre.app",
            files: ["/farmapfre/app/maintenance/pharmacyClinic/pharmacyclinic-maintenance.js", "pharmacyclinicItemMaintenanceComponent","filterClinicComponent"],
            resolveTemplate: true
          }
        ]
      },
      {
        name: "searchUserConfig",
        appCode: "MAINTENANCE",
        breads: ['maintenanceHome'],
        url: "/maintenance/user-config",
        description: "Asignar Usuario a BO Despacho",
        controller: "searchUserConfigController",
        templateUrl: "/farmapfre/app/maintenance/userConfig/userconfig-search-maintenance.html",
        parent: "root",
        views: {
          content: {
            templateUrl: "/farmapfre/app/maintenance/userConfig/userconfig-search-maintenance.html",
            controller: "searchUserConfigController"
          }
        },
        resolver: [
          {
            name: "searchUserConfig",
            moduleName: "farmapfre.app",
            files: ["/farmapfre/app/maintenance/userConfig/userconfig-search-maintenance.js", "userConfigItemMaintenanceComponent"],
            resolveTemplate: true
          },
          {
            name: "layout",
            moduleName: "oim.layout",
            files: ['topController', 'headerController', 'leftBarController', 'bodyMiddelController', 'bodyLeftController', 'rightBarController', 'footerController', 'bottomController'],
            resolveTemplate: true
          }
        ]
      },
      {
        name: "searchOrderConfig",
        appCode: "MAINTENANCE",
        breads: ['maintenanceHome'],
        url: "/maintenance/order-config",
        description: "Configurar Sucursal - Tipo Atención",
        controller: "searchOrderConfigController",
        templateUrl: "/farmapfre/app/maintenance/orderConfig/orderconfig-search-maintenance.html",
        parent: "root",
        views: {
          content: {
            templateUrl: "/farmapfre/app/maintenance/orderConfig/orderconfig-search-maintenance.html",
            controller: "searchOrderConfigController"
          }
        },
        resolver: [
          {
            name: "searchOrderConfig",
            moduleName: "farmapfre.app",
            files: ["/farmapfre/app/maintenance/orderConfig/orderconfig-search-maintenance.js", "orderConfigItemMaintenanceComponent"],
            resolveTemplate: true
          },
          {
            name: "layout",
            moduleName: "oim.layout",
            files: ['topController', 'headerController', 'leftBarController', 'bodyMiddelController', 'bodyLeftController', 'rightBarController', 'footerController', 'bottomController'],
            resolveTemplate: true
          }
        ]
      }
    ]
    return data;
  });