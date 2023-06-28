'use strict';
define(['angular'], function(ng) {
  var vm = {},
    extern = {};

  vm.reporteState = {
    name: 'referencia.panel.reportes',
    url: '/reportes',
    views: {
      'content@': {
        templateUrl: '/referencia/app/reportes/controller/reporte.html',
        controller: 'ReporteController as $ctrl'
      }
    },
    resolve: {
      dependencies: ['$ocLazyLoad', '$log', 'parentDependencies', function reDeFn($ocLazyLoad, $log) {
        return $ocLazyLoad.load({
          serie: true,
          files: [
            '/referencia/scripts/angular-mighty-datepicker/build/angular-mighty-datepicker.css',
            'js!angularDatepicker',
            '/referencia/app/reportes/service/reportes-services.js',
            '/referencia/app/reportes/controller/reporte-controller.js',
            '/referencia/app/reportes/component/datepickerModal.js',
            '/referencia/app/reportes/component/downloadModal.js']
        }).then(
          function() {
            $log.info('load files successfully ......');
            // loading the date picker library and adding as module dependency dinamically with ng.module().requires
            ng.module('referenciaApp').requires.push('mightyDatepicker');
          },
          function(error) {
            $log.error('error loading the files ........' + error);
          });
      }]
    },
    onEnter: ['localStorageService', function onEnterFn(localStorageService) {
      localStorageService.remove('filterData');
    }]
  };

  vm.reporteDetalleState = {
    name: 'referencia.panel.reportes.detalle',
    url: '/detalle/:id',
    params: {
      id: null
    },
    views: {
      'content@': {
        templateUrl: '/referencia/app/reportes/controller/reporteDetalle.html',
        controller: 'reporteDetalleController as $ctrl'
      }
    },
    resolve: {
      dependencies: ['$ocLazyLoad', '$log', 'ReferenciaConstants', 'parentDependencies', function reDeFn($ocLazyLoad,
        $log, constants) {
        var urlGmap = constants.GOOGLE_MAP_URL + constants.API_KEY_GMAP;
        require(['async!' + urlGmap], function() {
          $log.info('Maps loaded successfully .....');
        });

        return $ocLazyLoad.load({
          serie: true,
          files: [
            '/referencia/app/reportes/service/reportes-services.js',
            '/referencia/app/registro/service/registros-services.js',
            '/referencia/app/reportes/controller/reporteDetalle-controller.js',
            'js!mapModule'
          ]
        }).then(
          function() {
            $log.info('load files successfully .... ');
          },
          function(error) {
            $log.error('error loading the files ........' + error);
          });
      }],
      dataReferencia: ['dependencies', 'reportesService', '$stateParams', '$rootScope', 'localStorageService',
        function dtPrFn(dependencies, reportesService, $stateParams) {
          return reportesService.getReferencia($stateParams.id);
        }
      ]
    }
  };

  extern.registerStates = function fn(stateProvider) {
    stateProvider.state(vm.reporteState)
      .state(vm.reporteDetalleState);
  };

  return {
    registerStates: extern.registerStates
  };
});
