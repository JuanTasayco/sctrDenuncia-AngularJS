'use strict';

define(['angular', 'paginate', 'typeahead', 'bloodhound', 'lodash',
  '/referencia/app/clientesProveedores/component/clienteProveedoresDetalleModal.js'], function(ng, Paginate, typeahead,
  Bloodhound,
  _) {
  referenciaDestinoResponseController.$inject = ['$scope', '$state', 'registroService', 'staticData', 'panelService',
    '$log', 'rx', '$timeout', 'coreDataService', 'localStorageService', 'NgMap', '$rootScope', '$uibModal'];

  function referenciaDestinoResponseController($scope, $state, registroService, staticData, panelService, $log, rx,
    $timeout, coreDataService, localStorageService, NgMap, $rootScope, $uibModal) {
    var vm = this, itemsSelected = [], dataToST = {}, idxSelected = [];
    vm.loader = {};
    vm.loader.loading = true;
    vm.loader.text = 'Estamos cargando tu consulta';
    vm.$onInit = function oiFn() {
      vm.filter = {};
      vm.requerimientos = {};
      if (!$rootScope.previousState) {
        localStorageService.clearAll();
        vm.getDataST = {};
        $state.go('referencia.panel.registro.origen');
      } else {
        vm.getDataST = localStorageService.get('dataReg');
        if (!_.isEmpty(vm.getDataST)) {
          dataToST = vm.getDataST;
          //  get data from storage
          vm.filter = dataToST.filtrosDestino ? dataToST.filtrosDestino : {};
          vm.paciente = dataToST.paciente;
          vm.filter.esPaginacion = false;
          vm.filter.companyID = vm.paciente.asegurado.companyID; // eslint-disable-line
          vm.filter.cod_afiliado = vm.paciente.asegurado.id; // eslint-disable-line
          vm.filter.plan_afiliado = vm.paciente.asegurado.plan; // eslint-disable-line
          vm.toFilter = ng.copy(vm.filter);
        } else {
          dataToST.filtrosDestino = {};
        }
      }
      vm.currentStep = '3';
      vm.clsLoad = 'modal-data--is-loading';
      vm.clsLoadSearch = '';
      vm.isItemSelected = false;
      vm.itemSelected = [];
      vm.mapShow = [];
      vm.contItemsSelected = 0;
      vm.espSelected = {};
      vm.lstSelServicios = [];
      vm.lstSelServiImagenes = [];
      vm.lstSelServiEmergencias = [];
      vm.lstSelServiAmbulancias = [];
      vm.busquedaForm = $state.current.data.form;
      vm.busquedaContent = $state.current.data.content;
      vm.provincia = '';
      vm.company = '';
      vm.producto = '';
      vm.parentesco = '';
      vm.serviciosOpt = {limit: 3, show: false, txt: 'Ver todos'};
      vm.serviImagenOpt = {limit: 3, show: false, txt: 'Ver todos'};
      vm.serviEmergenciaOpt = {limit: 3, show: false, txt: 'Ver todos'};
      vm.serviAmbulanciaOpt = {limit: 3, show: false, txt: 'Ver todos'};
      vm.panel = vm.title = 'Registrar Referencia';
      vm.showUbigeo = false;
      vm.lstDptos = staticData.departamentos;

      vm.btnOptions = {
        applyFilterText: 'Aplicar filtros',
        resetFilterText: 'Borrar filtros'
      };

      vm.lstEspSelected = vm.filter.especialidades || [];

      //  set dropdown items
      vm.lstCategorias = coreDataService.getCategorias();
      vm.lstEntidades = coreDataService.getEntidades();
      vm.lstConvenios = staticData.convenios;

      vm.lstServicios = coreDataService.getServicios();
      vm.lstSeviImagenes = coreDataService.getImagenologias();
      vm.lstServiEmergencias = coreDataService.getEmergencias();
      vm.lstServiAmbulancias = coreDataService.getAmbulancias();
      var lstEspecialidades = coreDataService.getEspecialidades();

      //  checked inputs from data storage
      vm.lstSelServicios = vm.filter.servicios;
      vm.lstSelServiImagenes = vm.filter.serviimagenes;
      vm.lstSelServiEmergencias = vm.filter.serviemergencias;
      vm.lstSelServiAmbulancias = vm.filter.serviambulancias;

      var dataPaso4 = localStorageService.get('dataPaso4');
      if (dataPaso4) {
        $scope.$evalAsync(function eafn() {
          getProveedoresByFilterPrSuccess(dataPaso4.dataProveedores);
          vm.lstEspSelected = dataPaso4.lstEspSelected || [];
          vm.lstSelServicios = dataPaso4.lstSelServicios;
          vm.lstSelServiImagenes = dataPaso4.lstSelServiImagenes;
          vm.lstSelServiEmergencias = dataPaso4.lstSelServiEmergencias;
          vm.lstSelServiAmbulancias = vm.lstSelServiAmbulancias;
          vm.categoria = !_.isEmpty(dataPaso4.categoria) ? vm.lstCategorias.find(function fl(it) {
            return it.id === dataPaso4.categoria.id && it.nombre === dataPaso4.categoria.nombre;
          }) : {};
          vm.entidad = !_.isEmpty(dataPaso4.entidad) ? vm.lstEntidades.find(function fl(it) {
            return it.id === dataPaso4.entidad.id && it.nombre === dataPaso4.entidad.nombre;
          }) : {};
          vm.convenio = !_.isEmpty(dataPaso4.convenio) ? vm.lstConvenios.find(function fl(it) {
            return it.id === dataPaso4.convenio.id && it.nombre === dataPaso4.convenio.nombre;
          }) : {};
          vm.departamento = !_.isEmpty(dataPaso4.departamento) ? vm.lstDptos.find(function fl(it) {
            return it.id === dataPaso4.departamento.id && it.nombre === dataPaso4.departamento.nombre;
          }) : {};
          vm.lstProvincias = dataPaso4.departamento ? staticData.provincias[vm.departamento.id] : [];
          vm.lstProvincias = !_.isEmpty(dataPaso4.departamento) ? staticData.provincias[vm.departamento.id] : [];
          vm.provincia = !_.isEmpty(dataPaso4.provincia) ? vm.lstProvincias.find(function fl(it) {
            return it.id === dataPaso4.provincia.id && it.nombre === dataPaso4.provincia.nombre;
          }) : {};
          vm.filter.pl = !_.isEmpty(vm.provincia) ? vm.provincia.id :
            vm.filter.pl = vm.departamento.id;
          vm.toFilter = dataPaso4.toFilter;
          vm.filter = ng.copy(vm.toFilter);
          vm.totalItems = dataPaso4.totalItems;
          vm.totalPaginas = dataPaso4.totalPaginas;
          vm.currentPage = dataPaso4.currentPage;
          idxSelected = dataPaso4.idxSelected;
          vm.contItemsSelected = dataPaso4.contItemsSelected;
          vm.isItemSelected = dataPaso4.isItemSelected;
          itemsSelected = dataPaso4.arrItemsSelected;
          _.forEach(idxSelected, function feFn(val) {
            vm.itemSelected[val] = true;
          });
          vm.pageChanged();
        });
      } else {
        cleanSelectedItems();
        registroService.getProveedoresConCoberturaByFilter(vm.filter).then(getProveedoresByFilterPrSuccess);
      }

      function getProveedoresByFilterPrSuccess(data) {
        vm.dataProveedores = data;
        paginar(data);
      }

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

      $scope.$createObservableFunction('filterData')
        .debounce(500)
        .flatMapLatest(function(filter) {
          vm.isLoadedPage = false;
          vm.clsLoadSearch = 'u-loading';
          vm.pageData = [];
          return rx.Observable.fromPromise(registroService.getProveedoresConCoberturaByFilter(filter));
        })
        .subscribe(function(data) {
          vm.dataProveedores = data;
          $scope.$evalAsync(function() {
            $scope.$emit('UpdateOnLstProveedores', data);
          });
        });
    };  //  end onInit

    // Pagination
    function paginar(dataProveedores) {
      vm.totalItems = dataProveedores.total || 0;
      vm.currentPage = 1;
      vm.itemsPerPage = 10;
      vm.proveedores = dataProveedores.lista;
      vm.pager = new Paginate(vm.proveedores, vm.itemsPerPage);
      vm.pageData = [];
      $scope.$evalAsync(function evalAsyncFn() {
        vm.pageData = vm.pager.page(1);
        vm.isLoadedPage = true;
        vm.loader.loading = false;
        vm.clsLoadSearch = '';
        $scope.$broadcast('doScrolling');
      });
    }

    vm.setPage = function setPageFn(pageNo) {
      vm.currentPage = pageNo;
    };

    vm.pageChanged = function pageChFn() {
      vm.isLoadedPage = false;
      $log.log('Page changed to: ' + vm.currentPage);
      $scope.$evalAsync(function evalAsyncFn() {
        vm.pageData = vm.pager.page(vm.currentPage);
        vm.clsLoadSearch = 'u-loading';
        $timeout(function() {
          vm.isLoadedPage = true;
          vm.clsLoadSearch = '';
          $scope.$broadcast('doScrolling');
        }, 500);
      });
    };

    var upOnUnFn = $scope.$on('UpdateOnLstProveedores', function upOnFn(event, data) {
      // event.stopPropagation();
      vm.proveedores = data;
      vm.pager = new Paginate(vm.proveedores.lista, vm.itemsPerPage);
      vm.pageData = [];
      $scope.$evalAsync(function evalAsyncFn() {
        vm.pageData = vm.pager.page(1);
        vm.totalItems = vm.proveedores.total;
        vm.currentPage = 1;
        vm.isLoadedPage = true;
        vm.clsLoadSearch = '';
        $scope.$broadcast('doScrolling');
      });
    });

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
          vm.filter.pl = vm.departamento ? vm.departamento.id : '';
          // al cambiar de depa, reseteamos la prov
          vm.provincia = {};
          vm.lstProvincias = vm.departamento ? staticData.provincias[vm.filter.pl] : [];
          break;
        case 'pro':
          vm.filter.pl = vm.provincia ? vm.provincia.id : '';
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

    vm.setPage = function setPageFn(pageNo) {
      vm.currentPage = pageNo;
    };

    function cleanSelectedItems() {
      itemsSelected = [];
      vm.contItemsSelected = 0;
      vm.isItemSelected = false;
      vm.itemSelected.length = 0;
      idxSelected.length = 0;
    }

    vm.toggle = function tgFn(idx, item) {
      vm.itemSelected[idx] = !vm.itemSelected[idx];

      if (vm.itemSelected[idx]) {
        idxSelected.push(idx);
        vm.contItemsSelected++;
        itemsSelected.push(item);
      } else {
        vm.contItemsSelected--;
        itemsSelected = itemsSelected.filter(function flFn(provee) {
          return provee.id !== item.id;
        });
      }

      (vm.contItemsSelected > 0) ? vm.isItemSelected =  true :  vm.isItemSelected = false;
    };

    vm.toggleMap = function tgFn(idx, item) {
      vm.mapShow[idx] = !vm.mapShow[idx];
      if (vm.mapShow[idx]) {
        $timeout(function() {
          NgMap.initMap(item.id);
        }, 500);
      }
    };

    vm.txtSeleccionados = function tsFn() {
      return vm.contItemsSelected > 1 ? 'Destinos SELECCIONADOS' : 'Destino SELECCIONADO';
    };

    vm.txtTotalItems = function tsFn() {
      return vm.totalItems > 1 ? 'Resultados' : 'Resultado';
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
      vm.filter.plOrigen = dataToST.origen.provincia.id;

      vm.pageData = [];
      vm.totalItems = 0;
    }

    function hayServicioSeleccionados() {
      var lengthServi = vm.lstSelServicios && vm.lstSelServicios.length;
      var lengthServiImg = vm.lstSelServiImagenes && vm.lstSelServiImagenes.length;
      var lengthServiEmergencia = vm.lstSelServiEmergencias && vm.lstSelServiEmergencias.length;
      var lengthServiAmbulancia = vm.lstSelServiAmbulancias && vm.lstSelServiAmbulancias.length;
      var lengtEsp = vm.lstEspSelected && vm.lstEspSelected.length;

      return (lengthServi
        || lengthServiImg
        || lengthServiEmergencia
        || lengthServiAmbulancia
        || lengtEsp) ? true : false;
    }

    vm.applyFilter = function rfFn() {
      if (!hayServicioSeleccionados()) {
        vm.infoModal();
        return;
      }
      vm.btnOptions.applyFilterText = 'Cargando ...';
      cleanSelectedItems();
      vm.toFilter = ng.copy(vm.filter);
      vm.toFilter.esPaginacion = false;
      vm.toFilter.pagina = 1;
      dataToST.filtrosDestino = ng.copy(vm.toFilter);
      $scope.filterData(vm.toFilter); // eslint-disable-line
    };

    vm.infoModal = function() {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: true,
        animation: vm.animationsEnabled,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal-msg fade',
        template: '<modalmsg close="close()" options="options"></modalmsg>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };

          scope.options = {};
          scope.options.title = 'Debes seleccionar por lo menos un servicio o especialidad para realizar la búsqueda';
          scope.options.subtitle = '';
          scope.options.type = 'info';
          scope.options.okTxt = 'Aceptar';
        }]
      });
    };

    vm.resetFilter = function rfFn() {
      cleanFilters();
      cleanSelectedItems();
    };

    vm.nextStep = function() {
      dataToST.proveedores = itemsSelected;
      _saveFiltersInST();
      localStorageService.set('dataReg', ng.copy(dataToST));
      $state.go('referencia.panel.registro.preview');
    };

    vm.verDetalleProveedor = function vdpFn(item) {
      var data = {};
      data.id = item.id;
      data.estado = 'registro';
      vm.loader.loading = true;
      _saveFiltersInST();
      $state.go('referencia.panel.proveedores.busqueda.detalle.info', data);
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

    vm.openClientProveedoresDetailModal = function(proveedor) {
      var coberturas = proveedor.coberturas;

      var modalInstance = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: true,
        animation: vm.animationsEnabled,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal-cpd fade',
        template: '<modalcpd-referencia close="close()" afiliado="infoAfiliado"></modalcpd-referencia>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };

          scope.infoAfiliado = {};
          scope.infoAfiliado.clsIsLoading = vm.clsLoad;
          scope.infoAfiliado.info = vm.paciente;

          $timeout(function ctFn() {
            scope.infoAfiliado.info.cobertura = coberturas;
            scope.infoAfiliado.clsIsLoading = '';
          }, 650);
        }]
      });
      modalInstance.result.then(function() {}, function() {});
    };

    vm.deleteEsp = function delEspFn(idx) {
      $scope.$evalAsync(function eaFn() {
        vm.lstEspSelected.splice(idx,1);
        vm.change('esp');
      });
    };

    $scope.$on('$destroy', function onDestroyFn() {
      tasUnFn();
      upOnUnFn();
    });

    function _saveFiltersInST() {
      var dataPaso4 = {
        dataProveedores: vm.dataProveedores,
        lstEspSelected: vm.toFilter.especialidades,
        lstSelServicios: vm.toFilter.servicios,
        lstSelServiImagenes: vm.toFilter.serviimagenes,
        lstSelServiEmergencias: vm.toFilter.serviemergencias,
        lstSelServiAmbulancias: vm.toFilter.serviambulancias,
        categoria: vm.categoria,
        entidad: vm.entidad,
        convenio: vm.convenio,
        departamento: vm.departamento,
        provincia: vm.provincia,
        toFilter: vm.toFilter,
        totalItems: vm.totalItems,
        totalPaginas: vm.totalPaginas,
        currentPage: vm.currentPage,
        idxSelected: idxSelected,
        contItemsSelected: vm.contItemsSelected,
        isItemSelected: vm.isItemSelected,
        arrItemsSelected: itemsSelected
      };
      localStorageService.set('dataPaso4', dataPaso4);
    }

  } // end function referenciaDestinoResponseController

  return ng.module('referenciaApp')
    .controller('referenciaDestinoResponseController', referenciaDestinoResponseController);
});
