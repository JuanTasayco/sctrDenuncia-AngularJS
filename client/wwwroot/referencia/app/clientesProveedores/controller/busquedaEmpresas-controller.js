'use strict';
define(['angular', 'paginate', 'lodash'
], function(ng, Paginate, _) {
  var module = ng.module('referenciaApp');
  module.controller('BusquedaEmpresasController', BusquedaEmpresasController);
  BusquedaEmpresasController.$inject = ['$rootScope', '$scope', '$state', 'dataEmpresas',
    '$log', 'staticData', 'panelService', 'rx', '$timeout', 'oimPrincipal', '$window'
  ];

  function BusquedaEmpresasController($rootScope, $scope, $state, dataEmpresas, $log, staticData, panelService, rx,
    $timeout, oimPrincipal, $window) {
    var vm = this;
    vm.filter = ng.copy($state.params);
    vm.loader = {};
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
      vm.nombreQuery = '';
      vm.cboDisabled = false;
      vm.hideParentesco = true;
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

      // se mandan en filtro[1,2]
      vm.companyParam = $state.params.filtro1 || '';
      vm.productoParam = $state.params.filtro2 || '';
      vm.parentescoParam = $state.params.parentesco || '';

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

      //  selecting items from dropdown
      vm.companyParam && (vm.company = lstSelector(vm.lstCompanies, vm.companyParam));
      vm.company && (vm.nombreQuery += vm.company.nombre + ' - ');
      vm.productoParam && (vm.producto = lstSelector(vm.lstProductos, vm.productoParam));
      vm.producto && (vm.nombreQuery += vm.producto.nombre);
      vm.parentescoParam && (vm.parentesco = lstSelector(vm.lstParentescos, vm.parentescoParam));

      $scope.$createObservableFunction('filterData')
        .debounce(700)
        .flatMapLatest(function(filter) {
          vm.isLoadedPage = false;
          vm.totalItems = 0;
          vm.currentPage = 1;
          vm.clsLoadSearch = 'u-loading';
          return rx.Observable.fromPromise(panelService.getClientesFilter(filter));
        })
        .subscribe(function(data) {
          $scope.$evalAsync(function() {
            $scope.$emit('UpdateOnLstEmpresas', data);
            $scope.$broadcast('doScrolling');
            vm.clsLoadSearch = '';
          });
        });
    };  //  onInit end

    vm.isEmptySearchResult = function iesrFn() {
      return vm.totalItems === 0 && !vm.clsLoadSearch;
    };

    vm.change = function changeFn(type) {
      vm.nombreQuery = '';
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
            vm.lvl1 = '';
            vm.filter.pl = '';
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
          vm.filter.filtro1 = vm.company ? vm.company.id : '';
          break;
        case 'prod':
          vm.filter.filtro2 = vm.producto ? vm.producto.id : '';
          break;
        case 'parent':
          vm.filter.parentesco = vm.parentesco ? vm.parentesco.id : '';
          break;
        default:
          $log.info('changeFn - No type');
      }
      vm.areThereFilters = true;
      // actualizamos el nombre de la busqueda utilizada
      vm.company && (vm.nombreQuery = vm.company.hasOwnProperty('nombre') ? (vm.company.nombre + ' - ') : '');
      vm.producto && (vm.nombreQuery += vm.producto.hasOwnProperty('nombre') ? vm.producto.nombre : '');

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

      vm.nombreQuery = '';
      vm.pageData = [];
      vm.totalItems = 0;
    }

    vm.applyFilter = function rfFn() {
      vm.btnOptions.applyFilterText = 'Cargando ...';

      $scope.filterData(vm.filter); // eslint-disable-line

      const obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal,
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Búsqueda/empresas - Filtrar empresas",
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

    vm.verAsegurados = function verAsegFn(entidad) {
      var data = {};
      data.empresa = entidad.id;
      data.cliente = entidad.name;
      vm.filter.pl && (data.pl = vm.filter.pl);
      vm.company && (data.filtro1 = vm.company.id);
      vm.producto && (data.filtro2 = vm.producto.id);
      vm.lvl1 && (data.lvl1 = vm.filter.lvl1);
      vm.lvl2 && (data.lvl2 = vm.filter.lvl2);
      vm.parentesco && (data.parentesco = vm.parentesco.id);

      data.tipo = 'empresa';
      data.entidad = 'cliente'; // este parametro se usa para ocultar los inputs del form

      vm.loader.loading = true;
      vm.loader.text = 'Estamos cargando la lista de asegurados';
      $log.info('entidad: ' + entidad);
      $scope.$evalAsync(function evaFn() {
        vm.isEntidad = false;
      });

      $state.go('referencia.panel.clientes.busqueda', data);

      const obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal,
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Búsqueda/empresas - Ver asegurados",
        "descripcionOperacion": "Click al ícono ver Asegurados", 
        "filtros": angular.toJson(entidad), 
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
      };

      panelService.saveTracker(obj);
    };

    // Pagination
    vm.totalItems = dataEmpresas.total || 0;
    vm.currentPage = 1;
    vm.itemsPerPage = 5;
    vm.empresas = dataEmpresas.lista;
    vm.pager = new Paginate(vm.empresas, vm.itemsPerPage);
    vm.pageData = [];
    $scope.$evalAsync(function evalAsyncFn() {
      vm.pageData = vm.pager.page(1);
      vm.isLoadedPage = true;
    });

    /*
     * Use for the Pager UI - pagination  */
    vm.pageChanged = function pageChFn() {
      vm.isLoadedPage = false;
      $log.log('Page changed to: ' + vm.currentPage);
      $scope.$evalAsync(function evalAsyncFn() {
        vm.pageData = vm.pager.page(vm.currentPage);
        $timeout(function() {
          vm.isLoadedPage = true;
        }, 500);
      });
    };

    var upOnUnFn = $scope.$on('UpdateOnLstEmpresas', function upOnFn(event, data) {
      // event.stopPropagation();
      vm.empresas =  data;
      vm.pager = new Paginate(vm.empresas.lista, vm.itemsPerPage);
      vm.pageData = [];
      $scope.$evalAsync(function evalAsyncFn() {
        vm.pageData = vm.pager.page(1);
        vm.totalItems = vm.empresas.total || 0;
        vm.currentPage = 1;
        vm.isLoadedPage = true;
      });
    });

    $scope.$on('$destroy', function onDestroyFn() {
      upOnUnFn();
    });

  } // busquedaClientesController END

});
