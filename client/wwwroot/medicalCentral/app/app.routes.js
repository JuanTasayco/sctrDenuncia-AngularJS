(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, "medicalCenterRoutes", [],
    function() {
      var data = [{
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
            files: ['topController',
              'headerController',
              'leftBarController',
              'bodyMiddelController',
              'bodyLeftController',
              'rightBarController',
              'footerController',
              'bottomController'
            ],
          }]
        },
        {
          name: 'medicalCenterHome',
          parent: 'root',
          description: 'Reportes',
          title: 'Centros Medicos',
          url:'/',
          views: {
            content: {
              templateUrl: '/medicalCentral/app/home/index.html'
            }
          }
        },
        {
          
          parent: 'root',
          description: '',
          breads: ['medicalCenterHome'],
          title: 'Centros Medicos',
          views: {
            content: {
              templateUrl: '/medicalCentral/app/dashboard/common/index.html',
              controller: 'mcReportController'
            }
          },
         
          urls:[{
            name: 'medicalConsultationsBySpecialty',
            url: '/medicalConsultationsBySpecialty',
            description: 'CONSULTAS MEDICAS POR ESPECIALIDAD Y EVOLUCIÓN DE ATENCIONES',
            resolver: [{
              name: "dependencyComponents",
              moduleName: "medicalCenter.app",
              files: [
                'mcReportController', 'mcReportContainer', 'consultationsBySpecialtyChart', 'consultationsBySpecialtyBarChart', 'consultationsBySpecialtyMatrix'
              ]
            }]
          },
          {
            name: 'ocupabilityBySpecialty',
            url: '/ocupabilityBySpecialty',
            description: 'Ocupabilidad por especialidad',
            resolver: [{
              name: "dependencyComponents",
              moduleName: "medicalCenter.app",
              files: [
                'mcReportController', 'mcReportContainer', 'ocupabilityBySpecialtyMatrix'
              ]
            }]
          },
          {
            name: 'structureBillingByPortfolio',
            url: '/structureBillingByPortfolio',
            description: 'Estructura de la facturacion por cartera',
            resolver: [{
              name: "dependencyComponents",
              moduleName: "medicalCenter.app",
              files: [
                'mcReportController', 'mcReportContainer', 'structureBillingByPortfolioChart', 'structureBillingByPortfolioMatrix'
              ]
            }]
          },
          {
            name: 'structureBillingByConcept',
            url: '/structureBillingByConcept',
            description: 'Estructura de la facturacion por concepto',
            resolver: [{
              name: "dependencyComponents",
              moduleName: "medicalCenter.app",
              files: [
                'mcReportController', 'mcReportContainer', 'structureBillingByConceptMatrix'
              ]
            }]
          },
          {
            name: 'demandStructure',
            url: '/demandStructure',
            description: 'Estructura Demanda',
            resolver: [{
              name: "dependencyComponents",
              moduleName: "medicalCenter.app",
              files: [
                'mcReportController', 'mcReportContainer', 'demandStructureChart', 'demandStructureMatrix'
              ]
            }]
          },
          {
            name: 'portfolioRaising',
            url: '/portfolioRaising',
            description: 'Captacion Cartera',
            resolver: [{
              name: "dependencyComponents",
              moduleName: "medicalCenter.app",
              files: [
                'mcReportController', 'mcReportContainer', 'portfolioRaisingChart', 'portfolioRaisingMatrix'
              ]
            }]
          },


          {
            name:"monthlyPurchases",
            url:"/monthlyPurchases",
            description:"Compras Mensuales",
            resolver:[{
              name:"dependencyComponents",
              moduleName:"medicalCenter.app",
              files:['rendererCharReportWeb', 'mcReportController','mcReportContainer', 'monthlyPurchasesBarChart', 'monthlyPurchasesMatrix', 'monthlyPurchasesPieChart']
            }]
          },
          {
            name:"salesByCustomer",
            url:"/salesByCustomer",
            description:"Ventas por Ciente",
            resolver:[{
              name:"dependencyComponents",
              moduleName:"medicalCenter.app",
              files:['rendererCharReportWeb', 'mcReportController','mcReportContainer', "salesByCustomerBarChart", "salesByCustomerMatrix", 'salesByCustomerPieChart']
            }]
          },
          {
            name:"salesToMapfreSeat",
            url:"/salesToMapfreSeat",
            description:"Ventas a Mapfre por Sede",
            resolver:[{
              name:"dependencyComponents",
              moduleName:"medicalCenter.app",
              files:['rendererCharReportWeb','mcReportController', 'mcReportContainer',  "salesToMapfreSeatBarChart", "salesToMapfreSeatMatrix"]
            }]
          },
          {
            name: 'portfolioGrowth',
            url: '/portfolioGrowth',
            description: 'Crecimiento por cartera',
            resolver: [{
              name: "dependencyComponents",
              moduleName: "medicalCenter.app",
              files: [
                'mcReportController', 'mcReportContainer', 'portfolioGrowthChart', 'portfolioGrowthMatrix'
              ]
            }]
          },
          {
            name: 'specialityGrowth',
            url: '/specialityGrowth',
            description: 'Crecimiento por especialidad',
            resolver: [{
              name: "dependencyComponents",
              moduleName: "medicalCenter.app",
              files: [
                'mcReportController', 'mcReportContainer', 'specialityGrowthChart', 'specialityGrowthMatrix'
              ]
            }]
          }
          ]
        }
      ]
      return data;
    });