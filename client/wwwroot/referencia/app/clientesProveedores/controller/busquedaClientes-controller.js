'use strict';
define(['angular', 'paginate', 'lodash',
  '/referencia/app/clientesProveedores/component/clienteProveedoresDetalleModal.js'
], function(ng, Paginate, _) {
  var module = ng.module('referenciaApp');
  module.controller('BusquedaClientesController', busquedaClientesCtrl);
  busquedaClientesCtrl.$inject = ['$rootScope', '$scope', '$state', '$uibModal', 'dataAfiliados',
    '$log', 'staticData', 'panelService', 'rx', '$timeout', 'localStorageService', 'oimPrincipal', 
    '$window'
  ];

  function busquedaClientesCtrl($rootScope, $scope, $state, $uibModal,
    dataAfiliados, $log, staticData, panelService, rx, $timeout, localStorageService, oimPrincipal, $window) {
    var vm = this;
    vm.filter = ng.copy($state.params);
    vm.loader = {};
    vm.loader.text = 'Estamos cargando tu consulta';
    vm.data = {};

    vm.ipLocal = $window.localStorage['clientIp'] ? $window.localStorage['clientIp'] : "0.0.0.0";

    vm.$onInit = function oiFn() {
      vm.page = 'Busqueda de Clientes';
      vm.title = 'Clientes';
      vm.showCP = true;
      vm.clsLoadSearch = '';
      vm.panel = 'Clientes y Proveedores';
      vm.lvl0 = 'Clientes';
      vm.lvl1 = $state.params.lvl1 || '';
      vm.showLvl1 = !!vm.lvl1;
      vm.lvl2 = $state.params.lvl2 || '';
      vm.showLvl2 = !!vm.lvl2;
      vm.lstDptos = staticData.departamentos;
      vm.place = $state.params.pl;
      vm.cboDisabled = false;
      vm.nombreQuery = '';

      // segun este campo, se mostraran los inputs del form
      var tipoEntidadFrom = $state.params.entidad;
      if (tipoEntidadFrom) {
        localStorageService.set('bc.entidadFrom', tipoEntidadFrom);
      } else {
        tipoEntidadFrom = localStorageService.get('bc.entidadFrom');
      }

      vm.toFilter = ng.copy(vm.filter);
      var dni = $state.params.filtro1;
      if (/filtro/i.test(tipoEntidadFrom) && dni) {
        vm.hideDepa = true;
        vm.hideProvincia = true;
        vm.hideCompany = true;
        vm.hideProducto = true;
        vm.hideParentesco = true;
      } else if (/cliente/i.test(tipoEntidadFrom)) {
        vm.hideDepa = true;
        vm.hideProvincia = true;
        vm.hideCompany = true;
        vm.hideProducto = true;
      } else if (/empresa/i.test(tipoEntidadFrom)) {
        vm.hideCompany = true;
        vm.hideProducto = true;
      }

      vm.btnOptions = {
        applyFilterText: 'Aplicar filtros',
        resetFilterText: 'Borrar filtros'
      };

      //  set dropdown items
      vm.lstCompanies = staticData.companias;
      vm.lstProductos = staticData.productos;
      vm.lstParentescos = staticData.parentescos;

      //  tpl content
      vm.busquedaForm = $state.current.data.form;
      vm.busquedaContent = $state.current.data.content;

      // if map changed to depa/prov
      if (vm.place) {
        //  get ubigeos
        var ubigeoDepa, ubigeoProv;
        ubigeoDepa = (vm.place === '07') ? '15' : vm.place.substring(0, 2);
        (vm.filter.lvl2) && (ubigeoProv = vm.place);
        vm.lstProvincias = staticData.provincias[ubigeoDepa];

        //  set dropdown items
        vm.departamento = _.find(vm.lstDptos, function filterFn(item) {
          return item.id === ubigeoDepa;
        });
        if (ubigeoProv) {
          var tmpProvincia = _.find(vm.lstProvincias, function filterFn(item) {
            return item.id === ubigeoProv;
          });
          vm.provincia = tmpProvincia;
        }
      }

      function lstSelector(lst, param) {
        if (!param) {
          return {};
        }
        var arrayLength = lst.length;
        for (var i = 0; i < arrayLength; i++) {
          if (_.isString(lst[i].id) && _.isString(param)) {
            if (lst[i].id.toLowerCase() === param.toLowerCase()) {
              return lst[i];
            }
          } else {
            if (lst[i].id === +param) {
              return lst[i];
            }
          }
        }
      }

      //  get params & segun el tipo de filtro, se muestra el nombre de la busqueda
      vm.parentescoParam = $state.params.parentesco || '';
      var tipoFiltro = $state.params.tipo;
      if (tipoFiltro === 'empresa') {
        vm.nombreQuery = ng.copy($state.params.cliente) || '';
        vm.companyParam = $state.params.filtro1 || '';
        vm.productoParam = $state.params.filtro2 || '';
      } else if (tipoFiltro === 'filtro') {
        var query = '';
        vm.companyParam = $state.params.company || '';
        vm.productoParam = $state.params.producto || '';
        $state.params.filtro1 && (query += 'DNI/C.E: ' + $state.params.filtro1);
        $state.params.filtro2 && (query += ' - Nombre: ' + $state.params.filtro2);
        $state.params.filtro3 && (query += ' - Apellidos: ' + $state.params.filtro3);
        vm.nombreQuery = query;
      } else {
        vm.nombreQuery = vm.company ? (vm.company.nombre + ' - ') : '';
        vm.nombreQuery += vm.producto ? vm.producto.nombre : '';
      }

      //  selecting items from dropdown
      vm.companyParam && (vm.company = lstSelector(vm.lstCompanies, vm.companyParam));
      vm.productoParam && (vm.producto = lstSelector(vm.lstProductos, vm.productoParam));
      vm.parentescoParam && (vm.parentesco = lstSelector(vm.lstParentescos, vm.parentescoParam));

      $scope.$createObservableFunction('filterData')
        .debounce(700)
        .flatMapLatest(function(filter) {
          vm.isLoadedPage = false;
          vm.clsLoadSearch = 'u-loading';
          vm.data = {
            pageData: []
          };
          return rx.Observable.fromPromise(panelService.getAfiliadosByFilter(filter));
        })
        .subscribe(function(data) {
          $scope.$evalAsync(function() {
            if (!vm.toFilter.esPaginacion) {
              vm.totalItems = data.total || 0;
              vm.totalPaginas = data.nroPaginas || 0;
              vm.currentPage = 1;
            }
            vm.data.pageData = data.lista;
            $scope.$broadcast('doScrolling');
            vm.clsLoadSearch = '';
          });
        });
    };  //  onInit end

    vm.clsLoad = 'modal-data--is-loading';

    vm.isEmptySearchResult = function iesrFn() {
      return vm.totalItems === 0 && !vm.clsLoadSearch;
    };

    vm.change = function changeFn(type) {
      switch (type) {
        case 'dep':
          if (vm.departamento) {
            vm.filter.lvl1 = vm.departamento.nombre;
            vm.filter.pl = vm.departamento.id;
            vm.lvl1 = vm.departamento.nombre;
            vm.showLvl1 = true;
            vm.lstProvincias = staticData.provincias[vm.filter.pl];
          } else {
            vm.filter.lvl1 = '';
            vm.filter.pl = '';
            vm.lvl1 = '';
            vm.lstProvincias = [];
          }
          // al cambiar de depa, reseteamos la prov
          vm.filter.lvl2 = '';
          vm.provincia = {};
          vm.lvl2 = void 0;
          vm.showLvl2 = false;
          break;
        case 'pro':
          if (vm.provincia) {
            vm.filter.lvl2 = vm.provincia.nombre;
            vm.filter.pl = vm.provincia.id;
            vm.lvl2 = vm.provincia.nombre;
            vm.showLvl2 = true;
          } else {
            vm.filter.lvl2 = '';
            vm.filter.pl = '';
            vm.lvl2 = '';
            vm.showLvl2 = false;
          }
          break;
        case 'comp':
          if (vm.filter.tipo === 'empresa') {
            vm.filter.filtro1 = vm.company ? vm.company.id : '';
          } else {
            vm.filter.company = vm.company ? vm.company.id : '';
          }
          break;
        case 'prod':
          if (vm.filter.tipo === 'empresa') {
            vm.filter.filtro2 = vm.producto ? vm.producto.id : '';
          } else {
            vm.filter.producto = vm.producto ? vm.producto.id : '';
          }
          break;
        case 'parent':
          vm.filter.parentesco = vm.parentesco ? vm.parentesco.id : '';
          break;
        default:
          $log.info('changeFn - No type');
      }
      vm.areThereFilters = true;

      // actualizamos el nombre de la busqueda utilizada
      if (vm.filter.tipo !== 'filtro' && vm.filter.tipo !== 'empresa') {
        vm.nombreQuery = '';
        vm.company && (vm.nombreQuery = vm.company.hasOwnProperty('nombre') ? (vm.company.nombre + ' - ') : '');
        vm.producto && (vm.nombreQuery += vm.producto.hasOwnProperty('nombre') ? vm.producto.nombre : '');
      }
    };

    function cleanFilters() {
      vm.departamento = {};
      vm.provincia = {};
      vm.lvl1 = void 0;
      vm.lvl2 = void 0;
      vm.showLvl1 = false;
      vm.showLvl2 = false;
      vm.lstProvincias = [];
      vm.company = {};
      vm.producto = {};
      vm.parentesco = {};
      vm.filter = {};

      if (vm.toFilter.tipo === 'empresa') {
        vm.filter.tipo = vm.toFilter.tipo;
        vm.filter.empresa = vm.toFilter.empresa;
      } else {
        vm.nombreQuery = '';
      }

      vm.data = {
        pageData: []
      };
      vm.totalItems = 0;
    }

    vm.applyFilter = function rfFn() {
      vm.btnOptions.applyFilterText = 'Cargando ...';

      vm.toFilter = ng.copy(vm.filter);
      vm.toFilter.esPaginacion = false;
      vm.toFilter.pagina = 1;
      $scope.filterData(vm.toFilter); // eslint-disable-line

      const obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal,
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Búsqueda/asegurado - Filtrar asegurados",
        "descripcionOperacion": "Click al botón filtrar",
        "filtros": angular.toJson(vm.filter),
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
      };

      panelService.saveTracker(obj);
    };

    vm.resetFilter = function rfFn() {
      cleanFilters();
    };

    vm.openClientProveedoresDetailModal = function(afiliado) {
      var modalInstance = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: true,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal-cpd fade',
        template: '<modalcpd-referencia close="close()" afiliado="infoAfiliado">HLEO</modalcpd-referencia>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };

          scope.infoAfiliado = {};
          scope.infoAfiliado.clsIsLoading = vm.clsLoad;
          scope.infoAfiliado.info = afiliado;

          $timeout(function() {
            scope.infoAfiliado.clsIsLoading = '';
          }, 500);
        }]
      });
      modalInstance.result.then(function() {}, function() {});

      const obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal,
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Búsqueda/asegurado - Ver detalle asegurado",
        "descripcionOperacion": "Click al ícono detalle",
        "filtros": angular.toJson(afiliado), 
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
      };

      panelService.saveTracker(obj);
    };

    // Pagination
    vm.totalItems = dataAfiliados.total || 0;
    vm.totalPaginas = dataAfiliados.nroPaginas || 0;
    vm.currentPage = 1;
    vm.data.pageData = dataAfiliados.lista;

    vm.canBack = function cbFn() {
      return vm.currentPage > 1;
    };

    vm.canNext = function cnFn() {
      return vm.currentPage < vm.totalPaginas;
    };

    vm.prevPage = function ppFn() {
      if (vm.currentPage > 1) {
        vm.clsLoadSearch = 'u-loading';
        vm.toFilter.esPaginacion = true;
        vm.toFilter.pagina = --vm.currentPage;
        $scope.filterData(vm.toFilter); // eslint-disable-line
      }
    };

    vm.nextPage = function ppFn() {
      if (vm.currentPage < vm.totalPaginas) {
        vm.clsLoadSearch = 'u-loading';
        vm.toFilter.esPaginacion = true;
        vm.toFilter.pagina = ++vm.currentPage;
        $scope.filterData(vm.toFilter); // eslint-disable-line
      }
    };
  } // busquedaClientesController END

});
