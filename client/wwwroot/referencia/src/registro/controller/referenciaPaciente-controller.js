'use strict';

define(['angular', 'paginate', 'lodash',
  '/referencia/app/clientesProveedores/component/clienteProveedoresDetalleModal.js'
], function(ng, Paginate, _) {

  referenciaPacienteController.$inject = ['$scope', '$state', 'registroService', 'staticData', 'panelService',
    '$uibModal', 'rx', '$log', 'localStorageService', '$timeout', '$rootScope'];

  function referenciaPacienteController($scope, $state, registroService, staticData, panelService, $uibModal, rx, $log,
    localStorageService, $timeout, $rootScope) {
    var vm = this, pacienteSelected = {}, idxSelected,
      dataToST = {};

    vm.$onInit = function oiFn() {
      if (!$rootScope.previousState) {
        localStorageService.clearAll();
        vm.getDataST = {};
        $state.go('referencia.panel.registro.origen');
      } else {
        vm.getDataST = localStorageService.get('dataReg');
        $log.info('desde otro state');
        if (!_.isEmpty(vm.getDataST)) {
          $log.info('hay storage');
          dataToST = ng.copy(vm.getDataST);
          vm.getDataST.paciente = {};
        }
      }
      vm.lvl0 = 'Registro ';
      vm.filter = {};
      vm.clsLoad = 'modal-data--is-loading';
      vm.clsLoadSearch = '';
      vm.filteredByInputs = false;
      vm.isItemSelected = false;
      vm.showFrm = true;
      vm.origen = {};
      vm.currentStep = '2';
      vm.title = vm.panel = 'Registrar Referencia';
      vm.showUbigeo = false;
      vm.lstDptos = staticData.departamentos;
      vm.itemSelected = [];
      vm.showFrm = true;
      vm.cboDisabled = true;
      vm.currentPage = 1;
      vm.itemsPerPage = 5;
      vm.btnOptions = {
        applyFilterText: 'Aplicar filtros',
        resetFilterText: 'Borrar filtros'
      };

      //  tpl content
      vm.busquedaForm = $state.current.data.form;
      vm.busquedaContent = $state.current.data.content;

      //  set dropdown items
      vm.lstCompanies = staticData.companias;
      vm.lstProductos = staticData.productos;
      vm.lstParentescos = staticData.parentescos;

      if (!_.isEmpty(dataToST && dataToST.paciente)) {
        pacienteSelected = ng.copy(dataToST.paciente);
        vm.data = {
          pageData: [pacienteSelected]
        };
        idxSelected = 0;
        vm.itemSelected[idxSelected] = true;
        vm.diagnostico = dataToST.paciente.diagnostico;
        vm.condicion = dataToST.paciente.condicion;
        vm.filter = ng.copy(dataToST.filterPaciente);
        fillFilter();
      }

      $scope.$createObservableFunction('filterData')
        .debounce(500)
        .flatMapLatest(function(filter) {
          vm.isLoadedPage = false;
          vm.clsLoadSearch = 'u-loading';
          vm.filtered = true;
          cleanSelectedItem();
          vm.data = {};
          return rx.Observable.fromPromise(panelService.getAfiliadosByFilter(filter));
        })
        .subscribe(function(data) {
          vm.data = {
            pageData: []
          };
          $scope.$evalAsync(function() {
            vm.cboDisabled = false;
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
    };  //  end $onInit

    vm.isEmptySearchResult = function iesrFn(textCase) {
      var show;
      show = textCase === 'textHelp' ? (vm.totalItems === 0 && !vm.clsLoadSearch) : (vm.totalItems === 0
        && !vm.clsLoadSearch && vm.filtered);
      return show;
    };

    vm.openClientProveedoresDetailModal = function(afiliado) {
      var modalInstance = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: true,
        animation: vm.animationsEnabled,
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
    };

    vm.nextStep = function cFn() {
      if (vm.diagnostico && vm.condicion) {
        pacienteSelected.diagnostico = vm.diagnostico;
        pacienteSelected.condicion = vm.condicion;
        dataToST.paciente = ng.copy(pacienteSelected);
        dataToST.filterPaciente = ng.merge({}, vm.filter, {nombre: vm.nombre, apellidos: vm.apellidos, dni: vm.dni});

        localStorageService.set('dataReg', ng.copy(dataToST));
        $state.go('referencia.panel.registro.destino');
      } else {
        vm.infoModal();
      }
    };

    vm.infoModal = function() {
      var modalInstance = $uibModal.open({
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
          scope.options.title = 'Te faltó ingresar un dato para continuar';
          scope.options.subtitle = 'Ingresa el diagnóstico y condición del asegurado';
          scope.options.type = 'info';
          scope.options.okTxt = 'Entendido';
        }]
      });
      modalInstance.result.then(function() {}, function() {});
    };

    vm.toggle = function tgFn(idx, item) {
      vm.isItemSelected = vm.itemSelected[idx] = !vm.itemSelected[idx];
      vm.diagnostico = '';
      vm.condicion = '';

      if (idxSelected === idx) {
        vm.showFrm = !vm.showFrm;
        pacienteSelected = {};
      } else if (idxSelected !== idx) {
        vm.showFrm = false;
        vm.itemSelected[idxSelected] = false;
        pacienteSelected = item;
        idxSelected = idx;
      }
    };

    vm.buscar = function buscarFn() {
      if (vm.isDisabled()) {
        return;
      }
      (vm.nombre || vm.apellidos || vm.dni) && (vm.filteredByInputs = true);
      vm.filter.esPaginacion = false;
      vm.filter.filtro1 = vm.dni ? vm.dni : '';
      vm.filter.filtro2 = vm.nombre ? vm.nombre : '';
      vm.filter.filtro3 = vm.apellidos ? vm.apellidos : '';

      vm.toFilter = vm.filter;
      vm.toFilter.esPaginacion = false;
      vm.toFilter.pagina = 1;

      $scope.filterData(vm.toFilter); // eslint-disable-line
    };

    vm.isDisabled = function idFn() {
      var myform = $scope.BusquedaClienteForm;
      vm.myfrmStatus = _.isEmpty(myform.$error) && !myform.$pristine  || !!myform.$valid;
      return !(vm.myfrmStatus && (vm.nombre || vm.dni || vm.apellidos));
    };

    vm.change = function changeFn(type) {
      switch (type) {
        case 'dep':
          vm.filter.pl = vm.departamento ? vm.departamento.id : '';
          // al cambiar de depa, reseteamos la prov
          vm.provincia = {};
          vm.lstProvincias = staticData.provincias[vm.filter.pl];
          break;
        case 'pro':
          vm.filter.pl = vm.provincia ? vm.provincia.id : '';
          break;
        case 'comp':
          vm.filter.company = vm.company ? vm.company.id : '';
          break;
        case 'prod':
          vm.filter.producto = vm.producto ? vm.producto.id : '';
          break;
        case 'parent':
          vm.filter.parentesco = vm.parentesco ? vm.parentesco.id : '';
          break;
        default:
          $log.info('changeFn - No type');
      }

      vm.areThereFilters = true;
    };

    function cleanFilters() {
      vm.departamento = {};
      vm.provincia = {};
      vm.lstProvincias = [];
      vm.company = {};
      vm.producto = {};
      vm.parentesco = {};
      vm.filter = {};

      vm.areThereFilters = false;
      vm.cboDisabled = true;

      vm.nombre = '';
      vm.apellidos = '';
      vm.dni = '';

      vm.nombreQuery = '';
      vm.data = {
        pageData: []
      };
      vm.totalItems = 0;
      vm.filteredByInputs = false;
    }

    function fillFilter() {
      var filtros = dataToST.filterPaciente || {};
      filtros.company && (vm.company = lstSelector(vm.lstCompanies, filtros.company));
      filtros.producto && (vm.producto = lstSelector(vm.lstProductos, filtros.producto));
      filtros.parentesco && (vm.parentesco = lstSelector(vm.lstParentescos, filtros.parentesco));
      var place = filtros.pl;
      if (place) {
        //  get ubigeos
        var ubigeoDepa, ubigeoProv;
        ubigeoDepa = (place === '07') ? '15' : place.substring(0, 2);
        (place.length === 4) && (ubigeoProv = place);
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

    vm.applyFilter = function rfFn() {
      vm.btnOptions.applyFilterText = 'Cargando ...';

      vm.toFilter = ng.copy(vm.filter);
      vm.toFilter.esPaginacion = false;
      vm.toFilter.pagina = 1;
      $scope.filterData(vm.toFilter); // eslint-disable-line
    };

    vm.resetFilter = function rfFn() {
      cleanFilters();
      cleanSelectedItem();
      vm.showFrm = true;
      vm.filtered = false;
    };

    vm.newSearch = function nsFn() {
      cleanFilters();
      cleanSelectedItem();
      vm.filtered = false;
    };

    function cleanSelectedItem() {
      // clean selected item and elements (form, btn next) before filter
      vm.showFrm = true;
      pacienteSelected = {};
      vm.itemSelected[idxSelected] = false;
      vm.diagnostico = '';
      vm.condicion = '';
      vm.isItemSelected = false;
      idxSelected = null;
    }

    // Pagination
    vm.totalItems = 0;
    vm.currentPage = 1;
    //  vm.isLoadedPage = true;

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
  } //  end referenciaPacienteController

  return ng.module('referenciaApp')
    .controller('referenciaPacienteController', referenciaPacienteController);
});
