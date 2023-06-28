'use strict';

define(['generalConstant'], function(generalConstant) {
  var appModule = generalConstant.APP_MODULE;
  return [
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
          name: "layout",
          moduleName: appModule,
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
      code: '',
      name: 'home',
      description: 'Home',
      parent: 'root',
      url: '/',
      views: {
        content: {
          template: '<actter-home></actter-home>'
        }
      },
      resolver: [
        {
          name: 'home',
          moduleName: appModule,
          files: ['HomeController']
        }
      ]
    },
    {
      code: '',
      name: 'clients',
      description: 'Listado de clientes',
      parent: 'root',
      url: '/clientes',
      params: {
        search: null,
      },
      views: {
        content: {
          controller: 'ClientsController',
          templateUrl: '/actter/app/views/clients/clients.component.html',
          controllerAs: 'vm'
        }
      },
      resolver: [
        {
          name: 'clients',
          moduleName: appModule,
          files: ['ClientsController']
        }
      ]
    },
    {
      code: '',
      name: 'editpoliza',
      description: 'Modificar poliza',
      parent: 'root',
      breads: ["clients"],
      url: '/clientes/polizas',
      params: {
        client: null,
        policyNumber: null,
        empresa: null,
        numSuplemento : null,
        search:null
      },
      views: {
        content: {
          controller: 'PolizasEditController',
          templateUrl: '/actter/app/views/polizas/polizas-edit.component.html',
          controllerAs: 'vm'
        }
      },
      resolve:{
        dataPoliza:['loaderClienteController','$stateParams','editpoliza',function(loaderClienteController,$stateParams,editpoliza){
          return loaderClienteController.getData($stateParams);       
        }],
        dataForm:['loaderClienteController','editpoliza',function(loaderClienteController,editpoliza){
          return loaderClienteController.getDataForm();  
        }] 
      },
      resolver: [
        {
          name: 'editpoliza',
          moduleName: appModule,
          files: ['PolizasEditController','personalInformation','correspondenceAddress','personalAddress','ClientsController','companyContact','searchActivity']
        }
      ]
    },
    {
      code: '',
      name: 'editclient',
      description: 'Modificar datos cliente',
      parent: 'root',
      breads: ["clients"],
      url: '/cliente',
      params: {
        client: null,
        empresa: null
      },
      views: {
        content: {
          controller: 'ClientEditController',
          templateUrl: '/actter/app/views/clients/client-edit.component.html',
        }
      },
      resolve:{
        dataClient:['loaderClienteController','$stateParams','editclient',function(loaderClienteController,$stateParams,editclient){
          return loaderClienteController.getData($stateParams);       
        }],
        dataForm:['loaderClienteController','editclient',function(loaderClienteController,editclient){
          return loaderClienteController.getDataForm();  
        }] 
      },
      resolver: [
        {
          name: 'editclient',
          moduleName: appModule,
          files: ['ClientEditController','personalInformation','correspondenceAddress','officeAddress','personalAddress','ClientsController','companyContact','searchActivity']
        }
      ]
    },
    
  ];
});
