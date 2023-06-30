'use strict';
define(['angular', 'lodash', 'paginate', 'typeahead', 'bloodhound'], function(ng, _, Paginate, typeahead, Bloodhound) {
  var module = ng.module('referenciaApp');
  module.controller('BusquedaProveedoresController', busquedaProveedoresController);
  busquedaProveedoresController.$inject = ['$scope', '$state', '$log', 'dataProveedores', '$timeout', 'staticData',
    'panelService', 'rx', 'coreDataService', 'oimPrincipal', '$window'
  ];

  function busquedaProveedoresController($scope, $state, $log, dataProveedores, $timeout, staticData, panelService,
    rx, coreDataService, oimPrincipal, $window) {
    var vm = this;
    vm.loader = {};
    vm.loader.text = 'Estamos cargando la lista de proveedores';

    vm.espSelected = {};
    vm.lstEspSelected = [];
    vm.lstSelServicios = [];

    vm.lstSelServiImagenes = [];
    vm.lstSelServiEmergencias = [];
    vm.lstSelServiAmbulancias = [];
    vm.filter = ng.copy($state.params);

    vm.ipLocal = $window.localStorage['clientIp'] ? $window.localStorage['clientIp'] : "0.0.0.0";

    vm.$onInit = function oiFn() {
      vm.panel = 'Clientes y Proveedores';
      vm.page = 'Busqueda de Proveedores';
      vm.title = 'Proveedores';
      vm.showCP = true;
      vm.clsLoadSearch = '';
      vm.lvl0 = 'Proveedores';
      vm.lvl1 = $state.params.lvl1 || '';
      vm.showLvl1 = !!vm.lvl1;
      vm.lvl2 = $state.params.lvl2 || '';
      vm.showLvl2 = !!vm.lvl2;
      vm.lstDptos = staticData.departamentos;
      vm.place = $state.params.pl || '';

      vm.toFilter = ng.copy(vm.filter);

      vm.btnOptions = {
        applyFilterText: 'Aplicar filtros',
        resetFilterText: 'Borrar filtros'
      };

      //  set dropdown items
      vm.lstCategorias = coreDataService.getCategorias();
      vm.lstEntidades = coreDataService.getEntidades();
      vm.lstConvenios = staticData.convenios;

      vm.lstServicios = coreDataService.getServicios();
      vm.lstSeviImagenes = coreDataService.getImagenologias();
      vm.lstServiEmergencias = coreDataService.getEmergencias();
      vm.lstServiAmbulancias = coreDataService.getAmbulancias();
      var lstEspecialidades = coreDataService.getEspecialidades();

      //  get params
      vm.categoriaParam = $state.params.categoria || '';
      vm.convenioParam = $state.params.convenio || '';
      vm.entidadParam = $state.params.entidad || '';
      vm.atributoParam = $state.params.atributo || '';
      vm.nombreQuery = /name/i.test(vm.atributoParam) ? $state.params.nom : '';

      //  tpl content
      vm.busquedaForm = $state.current.data.form;
      vm.busquedaContent = $state.current.data.content;

      function lstSelector(lst, param) {
        if (!param) {
          return {};
        }
        var arrayLength = lst.length;
        for (var i = 0; i < arrayLength; i++) {
          if (_.isString(lst[i].id)) {
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

      //  selecting items from dropdown
      vm.categoriaParam && (vm.categoria = lstSelector(vm.lstCategorias, vm.categoriaParam));
      vm.entidadParam && (vm.entidad = lstSelector(vm.lstEntidades, vm.entidadParam));
      vm.convenioParam && (vm.convenio = lstSelector(vm.lstConvenios, vm.convenioParam));

      vm.dataProveedores = dataProveedores; // data del resolve del state
      // Pagination
      vm.totalItems = vm.dataProveedores.total || 0;
      vm.totalPaginas = vm.dataProveedores.nroPaginas || 0;
      vm.currentPage = 1;


      vm.pageData = vm.dataProveedores.lista;
      vm.especialidadesBH = new Bloodhound({
        datumTokenizer: function(d) {
          return Bloodhound.tokenizers.whitespace(d.nombre);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: lstEspecialidades
      });

      vm.especialidadesBH.initialize();
      vm.especialidadesDataset = {
        displayKey: 'nombre',
        source: vm.especialidadesBH.ttAdapter(),
        templates: {
          empty: [
            '<div class="tt-suggestion tt-empty-message">',
            'No hay resultados ...',
            '</div>'
          ].join('\n')
        }
      };

      vm.serviciosOpt = {limit: 3, show: false, txt: 'Ver todos'};
      vm.serviImagenOpt = {limit: 3, show: false, txt: 'Ver todos'};
      vm.serviEmergenciaOpt = {limit: 3, show: false, txt: 'Ver todos'};
      vm.serviAmbulanciaOpt = {limit: 3, show: false, txt: 'Ver todos'};

      $scope.$createObservableFunction('filterData')
        .debounce(500)
        .flatMapLatest(function(filter) {
          vm.isLoadedPage = false;
          vm.clsLoadSearch = 'u-loading';
          vm.pageData = [];
          return rx.Observable.fromPromise(panelService.getProveedoresByFilter(filter));
        })
        .subscribe(function(data) {
          $scope.$evalAsync(function() {
            vm.dataProveedores = data;
            if (!vm.toFilter.esPaginacion) {
              vm.totalItems = data.total || 0;
              vm.totalPaginas = data.nroPaginas || 0;
              vm.currentPage = 1;
            }
            vm.pageData = data.lista;
            $scope.$broadcast('doScrolling');
            vm.clsLoadSearch = '';
          });
        });
        // TODO: Contemplar el caso de error para mostrar pantalla de error
        // y ocultar el icono de loader
        // vm.isLoadedPage = true;
    };  //  end $onInit

    vm.isEmptySearchResult = function iesrFn() {
      return vm.totalItems === 0 && !vm.clsLoadSearch;
    };

    vm.loadMore = function(togglOptions, lista) {
      togglOptions.show = !togglOptions.show;
      $scope.$evalAsync(function() {
        if (togglOptions.show) {
          togglOptions.txt = 'Ver menos';
          togglOptions.limit = lista.length;
        } else {
          togglOptions.txt = 'Ver todos';
          togglOptions.limit = 3;
        }
      });
    };

    /**
     *  Called when there is any change in the form.
     * @param {string} type - The type of component.
     */
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
            vm.filter.pl = vm.departamento.id;
            vm.lvl2 = '';
            vm.showLvl2 = false;
          }
          break;
        case 'cat':
          vm.filter.categoria = vm.categoria ? vm.categoria.id : '';
          break;
        case 'ent':
          vm.filter.entidad = vm.entidad ? vm.entidad.id : '';
          break;
        case 'con':
          vm.filter.convenio = vm.convenio ? vm.convenio.id : '';
          break;
        case 'ser':
          vm.filter.servicios = vm.lstSelServicios;
          break;
        case 'serviImg':
          vm.filter.serviimagenes = vm.lstSelServiImagenes;
          break;
        case 'serviemergencia':
          vm.filter.serviemergencias = vm.lstSelServiEmergencias;
          break;
        case 'serviambulancia':
          vm.filter.serviambulancias = vm.lstSelServiAmbulancias;
          break;
        case 'esp':
          vm.filter.especialidades = vm.lstEspSelected;
          break;
        default:
          $log.info('changeFn - No type');
      }
      vm.areThereFilters = true;
    };

    function cleanFilters() {
      vm.departamento = {};
      vm.provincia = {};
      vm.lvl1 = void 0;
      vm.lvl2 = void 0;
      vm.showLvl1 = false;
      vm.showLvl2 = false;
      vm.lstProvincias = [];
      vm.categoria = {};
      vm.entidad = {};
      vm.convenio = {};
      vm.lstSelServicios = null;
      vm.lstSelServiImagenes = null;
      vm.lstSelServiEmergencias = null;
      vm.lstSelServiAmbulancias = null;
      vm.lstEspSelected = [];
      vm.filter = {};

      vm.nombreQuery = '';
      vm.pageData = [];
      vm.totalItems = 0;
    }

    vm.applyFilter = function rfFn() {
      vm.btnOptions.applyFilterText = 'Cargando ...';

      vm.toFilter = ng.copy(vm.filter);
      vm.toFilter.esPaginacion = false;
      vm.toFilter.pagina = 1;
      $scope.filterData(vm.toFilter); // eslint-disable-line

      var obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal,
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Proveedores/busqueda - Aplicar Filtro",
        "descripcionOperacion": "Click al botón Aplicar Filtros",
        "filtros": angular.toJson(vm.filter),
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
      };

      panelService.saveTracker(obj).then(function(data) {
        data = data || [];
      });
    };

    vm.resetFilter = function rfFn() {
      cleanFilters();
    };

    vm.setPage = function setPageFn(pageNo) {
      vm.currentPage = pageNo;
    };

    vm.verDetalleProveedor = function vdpFn(item) {
      var data = {};
      data.id = item.id;
      vm.loader.loading = true;
      vm.loader.text = 'Estamos cargando la información del proveedor';

      $state.go('referencia.panel.proveedores.busqueda.detalle.info', data);

      var obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal,
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Proveedores/busqueda - Ver detalle",
        "descripcionOperacion": "click al botón Ver detalle",
        "filtros": angular.toJson(item), 
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
      };

      panelService.saveTracker(obj).then(function(data) {
        data = data || [];
      });
    };

    var tasUnFn = $scope.$on('typeahead:select', function tasFn() {
      $scope.$evalAsync(function eaFn() {
        var it = _.find(vm.lstEspSelected, function _findFn(item) {
          return item.nombre === vm.espSelected.nombre;
        });
        if (!it) {
          vm.lstEspSelected.push(vm.espSelected);
          vm.change('esp');
        }
        vm.espSelected = {};
      });
    });

    vm.deleteEsp = function delEspFn(idx) {
      $scope.$evalAsync(function eaFn() {
        vm.lstEspSelected.splice(idx,1);
        vm.change('esp');
      });
    };

    // Pagination
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

    $scope.$on('$destroy', function onDestroyFn() {
      tasUnFn();
    });

  } // end function busquedaProveedoresController

});
