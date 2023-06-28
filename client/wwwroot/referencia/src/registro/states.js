'use strict';
define([], function() {
  var vm = {},
    extern = {};

  vm.registroOriginState = {
    name: 'referencia.panel.registro.origen',
    url: '/1',
    params: {
      estado: null
    },
    views: {
      'content@': {
        templateUrl: '/referencia/app/registro/controller/referenciaOrigen.html',
        controller: 'referenciaOrigenController as $ctrl'
      }
    },
    resolve: {
      dependencies: ['$ocLazyLoad', '$log', 'regDependencies', function reDeFn($ocLazyLoad, $log) {
        return $ocLazyLoad.load({
          files: ['/referencia/app/registro/controller/referenciaOrigen-controller.js']
        }).then(
          function() {
            $log.info('load files successfully .... ');
          },
          function(error) {
            $log.error('error loading the files ........' + error);
          });
      }]
    },
    onEnter: function($rootScope) {
      $rootScope.paso = 1;
    }
  };

  vm.registroPacienteState = {
    name: 'referencia.panel.registro.paciente',
    url: '/2',
    views: {
      'content@': {
        templateUrl: '/referencia/app/registro/controller/referenciaPaciente.html',
        controller: 'referenciaPacienteController as $ctrl'
      }
    },
    data: {
      content: '/referencia/app/registro/controller/registroClientes-content.html',
      form: '/referencia/app/clientesProveedores/controller/busquedaClientes-form.html'
    },
    resolve: {
      dependencies: ['$ocLazyLoad', '$log', 'regDependencies', function reDeFn($ocLazyLoad, $log) {
        return $ocLazyLoad.load({
          files: ['/referencia/app/registro/controller/referenciaPaciente-controller.js']
        }).then(
          function() {
            $log.info('load files successfully .... ');
          },
          function(error) {
            $log.error('error loading the files ........' + error);
          });
      }]
    },
    onEnter: ['$rootScope', '$state', '$timeout' ,function($rootScope, $state, $timeout) {
      // paso 2
      var paso = 2;
      if ($rootScope.paso && ($rootScope.paso >= paso || ($rootScope.paso + 1) === paso)) {
        $rootScope.paso = paso;
      } else {
        $timeout(function() {
          $state.go('referencia.panel.registro.origen', {paso: 1});
        }, 0);
      }
    }]
  };

  vm.registroPacienteDestinoState = {
    name: 'referencia.panel.registro.destino',
    url: '/3',
    views: {
      'content@': {
        templateUrl: '/referencia/app/registro/controller/referenciaDestino.html',
        controller: 'referenciaDestinoController as $ctrl'
      }
    },
    resolve: {
      dependencies: ['$ocLazyLoad', '$log', 'regDependencies', function reDeFn($ocLazyLoad, $log) {
        return $ocLazyLoad.load({
          files: ['/referencia/app/registro/controller/referenciaDestino-controller.js']
        }).then(
          function() {
            $log.info('load files successfully .... ');
          },
          function(error) {
            $log.error('error loading the files ........' + error);
          });
      }]
    },
    onEnter: ['$rootScope', '$state', '$timeout' ,function($rootScope, $state, $timeout) {
      // paso 3
      var paso = 3;
      if ($rootScope.paso && ($rootScope.paso >= paso || ($rootScope.paso + 1) === paso)) {
        $rootScope.paso = paso;
      } else {
        $timeout(function() {
          $state.go('referencia.panel.registro.origen', {paso: 1});
        }, 0);
      }
    }]
  };

  vm.registroPacienteDestinoResponseState = {
    name: 'referencia.panel.registro.response',
    url: '/4',
    views: {
      'content@': {
        templateUrl: '/referencia/app/registro/controller/referenciaDestinoResponse.html',
        controller: 'referenciaDestinoResponseController as $ctrl'
      }
    },
    data: {
      content: '/referencia/app/registro/controller/busquedaProveedores-content.html',
      form: '/referencia/app/clientesProveedores/controller/busquedaProveedores-form.html'
    },
    resolve: {
      dependencies: ['$ocLazyLoad', '$log', 'ReferenciaConstants', 'regDependencies', function reFn($ocLazyLoad,
        $log, constants) {
        var urlGmap = constants.GOOGLE_MAP_URL + constants.API_KEY_GMAP;
        require(['async!' + urlGmap], function() {
          $log.info('Maps loaded successfully .....');
        });

        return $ocLazyLoad.load({
          files: ['/referencia/app/registro/controller/referenciaDestinoResponse-controller.js',
            'js!mapModule'
          ]
        }).then(
          function() {
            $log.info('load files successfully .... ');
          },
          function(error) {
            $log.error('error loading the files ........' + error);
          });
      }]
    },
    onEnter: ['$rootScope', '$state', '$timeout' ,function($rootScope, $state, $timeout) {
      // paso 4
      var paso = 4;
      if ($rootScope.paso && ($rootScope.paso >= paso || ($rootScope.paso + 1) === paso)) {
        $rootScope.paso = paso;
      } else {
        $timeout(function() {
          $state.go('referencia.panel.registro.origen', {paso: 1});
        }, 0);
      }
    }]
  };

  vm.registroPreview = {
    name: 'referencia.panel.registro.preview',
    url: '/5',
    views: {
      'content@': {
        templateUrl: '/referencia/app/registro/controller/referenciaRegistroPreview.html',
        controller: 'referenciaRegistroPreviewController as $ctrl'
      }
    },
    resolve: {
      dependencies: ['$ocLazyLoad', '$log', 'regDependencies', function reDeFn($ocLazyLoad, $log) {
        return $ocLazyLoad.load({
          files: ['/referencia/app/registro/controller/referenciaRegistroPreview-controller.js']
        }).then(
          function() {
            $log.info('load files successfully .... ');
          },
          function(error) {
            $log.error('error loading the files ........' + error);
          });
      }],
      dataBusqueda: ['dependencies', 'panelService', '$stateParams',
        function reClFn(dependencies, panelService, $stateParams) {
          return panelService.getClientesFilter($stateParams);
        }
      ]
    },
    onEnter: ['$rootScope', '$state', '$timeout' ,function($rootScope, $state, $timeout) {
      // paso 5
      var paso = 5;
      if ($rootScope.paso && ($rootScope.paso >= paso || ($rootScope.paso + 1) === paso)) {
        $rootScope.paso = paso;
      } else {
        $timeout(function() {
          $state.go('referencia.panel.registro.origen', {paso: 1});
        }, 0);
      }
    }]
  };

  vm.registroReceipt = {
    name: 'referencia.panel.registro.comprobante',
    url: '/6',
    views: {
      'content@': {
        templateUrl: '/referencia/app/registro/controller/referenciaRegistroReceipt.html',
        controller: 'referenciaRegistroReceiptController as $ctrl'
      }
    },
    resolve: {
      dependencies: ['$ocLazyLoad', '$log', 'ReferenciaConstants', 'regDependencies', function reDeFn($ocLazyLoad,
        $log, constants) {
        var urlGmap = constants.GOOGLE_MAP_URL + constants.API_KEY_GMAP;
        require(['async!' + urlGmap], function() {
          $log.info('Maps loaded successfully .....');
        });

        return $ocLazyLoad.load({
          serie: true,
          files: ['/referencia/app/registro/controller/referenciaRegistroReceipt-controller.js',
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
      dataBusqueda: ['dependencies', 'panelService', '$stateParams',
        function reClFn(dependencies, panelService, $stateParams) {
          return panelService.getClientesFilter($stateParams);
        }
      ]
    },
    onEnter: ['$rootScope', '$state', '$timeout' ,function($rootScope, $state, $timeout) {
      // paso 6
      var paso = 6;
      if ($rootScope.paso && ($rootScope.paso === paso || ($rootScope.paso + 1) === paso)) {
        $rootScope.paso = paso;
      } else {
        $timeout(function() {
          $state.go('referencia.panel.registro.origen', {paso: 1});
        }, 0);
      }
    }],
    onExit: ['localStorageService', function onExitFn(localStorageService) {
      localStorageService.remove('dataPaso4');
    }]
  };

  extern.registerStates = function fn(stateProvider) {
    stateProvider
    .state(vm.registroOriginState)
    .state(vm.registroPacienteState)
    .state(vm.registroPacienteDestinoState)
    .state(vm.registroPacienteDestinoResponseState)
    .state(vm.registroPreview)
    .state(vm.registroReceipt);
  };

  return {
    registerStates: extern.registerStates
  };
});
