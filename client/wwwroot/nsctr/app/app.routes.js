define(
  ['constants', 'regular_routes', 'mining_routes', 'lifeLaw_routes'],
  function (constants, regular_routes, mining_routes, lifeLaw_routes) {
    var vRoutes = [
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
          authorizedResource : ['accessSupplier', function(accessSupplier){
            return accessSupplier.getAllObject();
          }]
        },
        resolver: [
          {
            name: "layout",
            moduleName: "appNsctr",
            files: ['topController',
              'headerController',
              'leftBarController',
              'bodyMiddelController',
              'bodyLeftController',
              'rightBarController',
              'footerController',
              'bottomController',
              'nsctrFactoryJs',
              'nsctrFactoryResolveJs',
              'nsctrContentTemplateJs',
              'nsctrHorizontalMenuJs',
              'nsctr_security'],
          },
        ]
      },
      {
        name: 'accessDenied',
        code: '',
        description: 'Acceso denegado',
        url: '/accessDenied',
        parent: 'root',
        views: {
          content: {
            controller: [function() {}],
            templateUrl: '/app/handlerErr/template/access-denied.html',
          }
        }
      },
      {
        name: 'nsctrHome',
        code: "",
        url: '/',
        parent: 'root',
        views: {
          content: {
            controller: 'nsctrHomeController',
            templateUrl: '/nsctr/app/home/controller/home.html',
          }
        },
        resolve: {
          authorizedResource: ['accessSupplier', function(accessSupplier) {
            return accessSupplier.getAllObject();
          }]
        },
        resolver: [{
          name: "nsctrHome",
          moduleName: "appNsctr",
          files: ["nsctrHomeController"]
        }]
      },
      {
        name: 'nsctrContentTemplate',
        abstract: true,
        parent: 'root',
        views: {
          content: {
            template: '<nsctr-content-template></nsctr-content-template>'
          }
        }
      }
    ];

    var vData = vRoutes.concat(regular_routes, mining_routes, lifeLaw_routes);

    return vData;
  }
);