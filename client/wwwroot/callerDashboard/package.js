(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "callerDashboardPackage", [],
  function() {
    'use strict';
    return {
      lib: {
        'routesCallerDashboard': {
          name: 'routesCallerDashboard',
          path: '/callerDashboard/app/app.routes'
        },
        'appCallerDashboard': {
          name: 'appCallerDashboard',
          path: '/callerDashboard/app/app'
        },
        'dashMenu': {
          name: 'dashMenu',
          path: '/callerDashboard/app/common/component/dashmenu'
        },
        'alertCount': {
          name: 'alertCount',
          path: '/callerDashboard/app/dashboard/component/alertcount'
        },
        'callerDashboardPage': {
          name: 'callerDashboardPage',
          path: '/callerDashboard/app/dashboard/component/callerdashboardPage'
        },
        'summaryByAssign': {
          name: 'summaryByAssign',
          path: '/callerDashboard/app/dashboard/component/summarybyassign'
        },
        'summaryByCall': {
          name: 'summaryByCall',
          path: '/callerDashboard/app/dashboard/component/summarybycall'
        },

        'summaryStatistics': {
          name: 'summaryStatistics',
          path: '/callerDashboard/app/dashboard/component/summarystatistics'
        },


        'filterDashByAssign': {
          name: 'filterDashByAssign',
          path: '/callerDashboard/app/dashbyassign/component/filterdashbyassign'
        },
        'listDashByAssign': {
          name: 'listDashByAssign',
          path: '/callerDashboard/app/dashbyassign/component/listdashbyassign'
        },
        'dashByAssignPage': {
          name: 'dashByAssignPage',
          path: '/callerDashboard/app/dashbyassign/component/dashbyassignpage'
        },


        'listRequestByAssigned': {
          name: 'listRequestByAssigned',
          path: '/callerDashboard/app/requestbyassigned/component/listrequestbyassigned'
        },
        'requestByAssignedPage': {
          name: 'requestByAssignedPage',
          path: '/callerDashboard/app/requestbyassigned/component/requestbyassignedpage'
        },


        'listRequestByCall': {
          name: 'listRequestByCall',
          path: '/callerDashboard/app/requestbycall/component/listrequestbycall'
        },
        'requestByCallPage': {
          name: 'requestByCallPage',
          path: '/callerDashboard/app/requestbycall/component/requestbycallpage'
        },
        proxyCallerDashboard: {
          name: 'proxyCallerDashboard',
          path: '/callerDashboard/app/proxy/serviceCallerDashboard'
        },
        callMonitor: {
          name: 'callMonitor',
          path: '/callerDashboard/app/common/callMonitor'
        },
        'modalFilter': {
          name: 'modalFilter',
          path: '/callerDashboard/app/common/component/modalFilter'
        },
        'dashboardTemplate': {
          name: 'dashboardTemplate',
          path: '/callerDashboard/template'
        }

      },
      shim: {
        appCallerDashboard: {
          deps: [
            'wrap_gaia',
            'angular_route',
            'angular_ocLazyLoad',
            'angular_ui_route',
            'oim_ocLazyLoad',
            'oim_theme_service',
            'oim_commons',
            'mDirective',
            'oim_layout',
            'proxyCallerDashboard',
            'callMonitor',
            'dashboardTemplate'
          ]
        },
        'dashboardTemplate': { deps: ['angular'] },
        'callMonitor': { deps: ['angular'] },
        'proxyCallerDashboard': { deps: ['wrap_gaia'] },
        callerDashboardPage: {
          deps: [
            'dashMenu',
            'alertCount',
            'summaryByAssign',
            'summaryByCall',
            'summaryStatistics'
          ]
        },
        requestByCallPage: { deps: ["listRequestByCall", 'dashMenu'] },
        requestByAssignedPage: { deps: ["listRequestByAssigned", 'modalFilter', 'dashMenu'] },
        dashByAssignPage: { deps: ["filterDashByAssign", "listDashByAssign", 'modalFilter', 'dashMenu'] }
      },
      packages: {}
    };
  });