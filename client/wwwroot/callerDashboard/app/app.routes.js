(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "routesCallerDashboard", [],
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
        name: 'home',
        parent: 'root',
        description: '',
        title: 'Dashboard',
        url: '/',
        views: {
          content: {
            templateUrl: '/callerDashboard/app/dashboard/index.html'
          }
        },
        resolver: [{
          name: "componentCallerDashboardPage",
          moduleName: "oim.caller.dashboard",
          files: [
            'callerDashboardPage'
          ]
        }]
      },
      {
        name: 'bycall',
        parent: 'root',
        description: '',
        title: 'Solicitud por llamada',
        url: '/bycall',
        views: {
          content: {
            templateUrl: '/callerDashboard/app/requestbycall/index.html'
          }
        },
        resolver: [{
          name: "componentRequestByCall",
          moduleName: "oim.caller.dashboard",
          files: ['requestByCallPage']
        }]
      },
      {
        name: 'dashbyassign',
        parent: 'root',
        description: '',
        title: 'Llamadas por asignar',
        url: '/byassign',
        views: {
          content: {
            templateUrl: '/callerDashboard/app/dashbyassign/index.html'
          }
        },
        resolver: [{
          name: "componentDashByAssign",
          moduleName: "oim.caller.dashboard",
          files: ['dashByAssignPage']
        }]
      },
      {
        name: 'byassigned',
        parent: 'root',
        description: '',
        title: 'Llamadas Asignadas',
        url: '/byassigned',
        views: {
          content: {
            templateUrl: '/callerDashboard/app/requestbyassigned/index.html'
          }
        },
        resolver: [{
          name: "componentRequestByAssigned",
          moduleName: "oim.caller.dashboard",
          files: ['requestByAssignedPage']
        }]
      }
    ]
    return data;
  });