'use strict';
define([], function() {
  var vm = {},
    extern = {};

  // hay 2 tipos de busqueda:
  // tipo: filtro ---> /busqueda/filtro/dni?nombre&apellido
  // tipo: entidad -----> /busqueda/empresa/eps/saludregular?lvl0=peru&lvl1=piura&lvl2=talara
  vm.busquedaClienteState = {
    name: 'referencia.panel.clientes.busqueda',
    url: '/busqueda',
    params: {
      lvl: null,
      pl: null,
      tipo: null,
      filtro1: null,
      filtro2: null,
      filtro3: null,
      lvl0: null,
      lvl1: null,
      lvl2: null,
      empresa: null,
      parentesco: null,
      producto: null,
      company: null,
      cliente: null,
      entidad: null // este parametro se usa para ocultar los inputs del form
    },
    views: {
      'content@': {
        templateUrl: '/referencia/app/clientesProveedores/controller/busquedaTemplate.html',
        controller: 'BusquedaClientesController as $ctrl'
      }
    },
    data: {
      content: '/referencia/app/clientesProveedores/controller/busquedaClientes-content.html',
      form: '/referencia/app/clientesProveedores/controller/busquedaClientes-form.html'
    },
    resolve: {
      dependencies: ['$ocLazyLoad', '$log', 'parentDependencies', function reDeFn($ocLazyLoad, $log) {
        return $ocLazyLoad.load({
          files: ['/referencia/app/clientesProveedores/controller/busquedaClientes-controller.js']
        }).then(
          function() {
            $log.info('load files successfully .... ');
          },
          function(error) {
            $log.error('error loading the files ........' + error);
          });
      }],
      dataAfiliados: ['dependencies', 'panelService', '$stateParams',
        function reClFn(dependencies, panelService, $stateParams) {
          var objAsegurado = $stateParams;
          objAsegurado.esPaginacion = false;
          return panelService.getAfiliadosByFilter(objAsegurado);
        }
      ]
    },
    onEnter: ['$state', '$log', function oeFn($state, $log) {
      $log.info($state.current.data);
    }]
  };

  vm.busquedaProveedoresState = {
    name: 'referencia.panel.proveedores.busqueda',
    url: '/busqueda',
    params: {
      pl: null,
      categoria: null,
      convenio: null,
      entidad: null,
      atributo: null,
      lvl1: null,
      lvl2: null,
      nom: null
    },
    views: {
      'content@': {
        templateUrl: '/referencia/app/clientesProveedores/controller/busquedaTemplate.html',
        controller: 'BusquedaProveedoresController as $ctrl'
      }
    },
    data: {
      content: '/referencia/app/clientesProveedores/controller/busquedaProveedores-content.html',
      form: '/referencia/app/clientesProveedores/controller/busquedaProveedores-form.html'
    },
    resolve: {
      dependencies: ['$ocLazyLoad', '$log', 'parentDependencies', function reDeFn($ocLazyLoad, $log) {
        return $ocLazyLoad.load({
          files: [
            '/referencia/app/clientesProveedores/controller/busquedaProveedores-controller.js'
          ]
        }).then(
          function() {
            $log.info('load files successfully .... ');
          },
          function(error) {
            $log.error('error loading the files ........' + error);
          });
      }],
      dataProveedores: ['dependencies', 'panelService', '$stateParams', '$rootScope',
        function dtPrFn(dependencies, panelService, $stateParams, $rootScope) {

          var objProveedor = $stateParams;
          objProveedor.esPaginacion = false;
          objProveedor.pagina = 1;
          if ($rootScope.transitionState === this.name) {
            return panelService.getProveedoresByFilter(objProveedor);
          }
          return {};
        }
      ]
    }
  };

  //  '/busqueda/empresas/:nombre?lvl0&lvl1&lvl2',
  vm.busquedaEmpresaState = {
    name: 'referencia.panel.clientes.busquedaEmpresa',
    url: '/busqueda/empresas',
    params: {
      lvl: null,
      pl: null,
      filtro1: null,
      filtro2: null,
      lvl0: null,
      lvl1: null,
      lvl2: null,
      parentesco: null,
      tipo: null,
      entidad: null // este parametro se usa para ocultar los inputs del form
    },
    views: {
      'content@': {
        templateUrl: '/referencia/app/clientesProveedores/controller/busquedaTemplate.html',
        controller: 'BusquedaEmpresasController as $ctrl'
      }
    },
    data: {
      content: '/referencia/app/clientesProveedores/controller/busquedaEmpresas-content.html',
      form: '/referencia/app/clientesProveedores/controller/busquedaClientes-form.html'
    },
    resolve: {
      dependencies: ['$ocLazyLoad', '$log', 'parentDependencies', function reDeFn($ocLazyLoad, $log) {
        return $ocLazyLoad.load({
          files: ['/referencia/app/clientesProveedores/controller/busquedaEmpresas-controller.js']
        }).then(
          function() {
            $log.info('load files successfully .... ');
          },
          function(error) {
            $log.error('error loading the files ........' + error);
          });
      }],
      dataEmpresas: ['dependencies', 'panelService', '$stateParams', function reClFn(dependencies, panelService,
        $stateParams) {
        return panelService.getClientesFilter($stateParams);
      }]
    }
  };

  vm.detalleProveeState = {
    name: 'referencia.panel.proveedores.busqueda.detalle',
    abstract: true,
    params: {
      id: null,
      estado: null,
      auditando: null,
      auditoria: null,
      guard: null,
      idRef: null
    },
    url: '/detalle',
    templateUrl: '/referencia/app/clientesProveedores/controller/proveeDetalleTemplate.html',
    views: {
      'content@': {
        templateUrl: '/referencia/app/clientesProveedores/controller/proveeDetalleTemplate.html',
        controller: 'ProveeDetalleController as $ctrl'
      }
    },
    resolve: {
      dependencies: ['$ocLazyLoad', '$log', 'ReferenciaConstants', 'parentDependencies',
        function reDeFn($ocLazyLoad, $log, constants) {
          var urlGmap = constants.GOOGLE_MAP_URL + constants.API_KEY_GMAP;
          require(['async!' + urlGmap], function() {
            $log.info('Maps loaded successfully .....');
          });
          return $ocLazyLoad.load({
            files: ['/referencia/app/clientesProveedores/controller/proveeDetalleTemplate-controller.js']
          }).then(
            function() {
              $log.info('load files successfully .... ');
            },
            function(error) {
              $log.error('error loading the files ........' + error);
            });
        }
      ],
      dataProveedor: ['dependencies', 'panelService', '$stateParams', function reClFn(dependencies,
        panelService, $stateParams) {

        var idProveedor = $stateParams.id;
        var idAudit = $stateParams.auditoria;
        var auditMode = $stateParams.auditando;

        if (!auditMode && idAudit === 'new') {
          idAudit = null;
        }

        if (auditMode && idAudit === 'new') {
          return panelService.getNewAudit(idProveedor);
        }

        if (!auditMode && idAudit) {
          return panelService.getAuditById(idProveedor, idAudit);
        }

        return panelService.getLastAudit(idProveedor);
      }],
      categories: ['dependencies', 'panelService', function reClFn(dependencies, panelService) {
        return panelService.getCategoriasProveedor();
      }]
    }
  };

  vm.detalleProveeInfoState = {
    name: 'referencia.panel.proveedores.busqueda.detalle.info',
    url: '/informacion?:id&:auditoria',
    params: {
      originalCategory: null
    },
    views: {
      'detalle': {
        templateUrl: '/referencia/app/clientesProveedores/controller/proveeDetalleInfo.html',
        controller: 'DetalleInformacionController as $ctrl'
      }
    }
  };

  vm.detalleProveeEspecialidadesState = {
    name: 'referencia.panel.proveedores.busqueda.detalle.especialidades',
    url: '/especialidades?:id&:auditoria',
    views: {
      'detalle': {
        templateUrl: '/referencia/app/clientesProveedores/controller/proveeDetalleEspecialidades.html',
        controller: 'DetalleEspecialidadesController as $ctrl'
      }
    }
  };

  vm.detalleProveeServicioState = {
    name: 'referencia.panel.proveedores.busqueda.detalle.servicio',
    url: '/servicio?:id&:auditoria',
    views: {
      'detalle': {
        templateUrl: '/referencia/app/clientesProveedores/controller/proveeDetalleServicio.html',
        controller: 'DetalleServiciosController as $ctrl'
      }
    }
  };

  vm.detalleProveeLocalizacionState = {
    name: 'referencia.panel.proveedores.busqueda.detalle.localizacion',
    url: '/localizacion?:id&:auditoria',
    views: {
      'detalle': {
        templateUrl: '/referencia/app/clientesProveedores/controller/proveeDetalleLocalizacion.html',
        controller: 'ReferenciaMapController as $ctrl'
      }
    },
    resolve: {
      dependencies: ['$ocLazyLoad', '$log', function reDeFn($ocLazyLoad, $log) {
        return $ocLazyLoad.load({
          files: ['js!mapModule']
        }).then(
          function() {
            $log.info('load files successfully .... ');
          },
          function(error) {
            $log.error('error loading the files ........' + error);
          });
      }]
    }
  };

  vm.detalleProveeReporteState = {
    name: 'referencia.panel.proveedores.busqueda.detalle.reporte',
    url: '/reporte?:id&:auditoria',
    views: {
      'detalle': {
        templateUrl: '/referencia/app/clientesProveedores/controller/proveeDetalleReporte.html',
        controller: 'DetalleReporteController as $ctrl'
      }
    }
  };

  extern.registerStates = function fn(stateProvider) {
    stateProvider.state(vm.busquedaEmpresaState)
      .state(vm.busquedaClienteState)
      .state(vm.busquedaProveedoresState)
      .state(vm.detalleProveeState)
      .state(vm.detalleProveeInfoState)
      .state(vm.detalleProveeEspecialidadesState)
      .state(vm.detalleProveeServicioState)
      .state(vm.detalleProveeLocalizacionState)
      .state(vm.detalleProveeReporteState);
  };

  return {
    registerStates: extern.registerStates
  };

});
