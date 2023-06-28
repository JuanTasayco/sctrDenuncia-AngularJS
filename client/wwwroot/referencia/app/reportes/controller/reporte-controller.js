'use strict';
define(['angular', 'lodash', 'paginate', 'typeahead', 'bloodhound', 'moment', 'constants'],
  function(ng, _, Paginate, typeahead, Bloodhound, moment, constants) {

    reporteController.$inject = ['$scope', '$state', '$log', '$timeout', 'staticData', '$uibModal', 'panelService',
      'rx', '$window', 'reportesService', 'coreDataService', '$sce', 'localStorageService'
    ];

    function reporteController($scope, $state, $log, $timeout, staticData, $uibModal, panelService, rx, $window,
      reportesService, coreDataService, $sce, localStorageService) {
      var vm = this;
      vm.clsLoad = 'u-loading';

      vm.loader = { text: 'Estamos cargando tu consulta' };

      vm.filter = {};
      vm.espSelected = {};
      vm.lstEspSelected = [];
      vm.lstSelServicios = [];

      vm.res = {};
      vm.origen = {};
      vm.dest = {};

      vm.datepicker1 = {};
      vm.datepicker2 = {};

      function callInicio(day) {
        vm.res.fechaInicio = day.format('DD/MM/YYYY');
      }

      function callFin(day) {
        vm.res.fechaFin = day.format('DD/MM/YYYY');
      }

      vm.$onInit = function oiFn() {
        vm.panel = vm.title = 'Reportes y referencias';
        vm.clsLoadSearch = '';
        vm.lstDptos = staticData.departamentos;
        vm.lstOrder = staticData.order;
        vm.toFilter = {
          esPaginacion: false,
          pagina: 1
        };

        localStorageService.remove('reporteDeta');
        // para probar en local: /api/referencia/..
        vm.pdfURL =  $sce.trustAsResourceUrl(constants.system.api.endpoints.referencia
          + 'api/referencia/excelReferencia');

        vm.datepicker1.dateDbA = moment().add(-30, 'day');
        vm.datepicker1.optionsDbA = {
          start: moment().add(-30, 'day'),
          months: 1,
          callback: callInicio
        };
        vm.datepicker2.dateDbB = moment();
        vm.datepicker2.optionsDbB = {
          start: moment(),
          months: 1,
          callback: callFin
        };
        vm.datepicker2.currentDay = moment();

        vm.btnOptions = {
          applyFilterText: 'Aplicar filtros',
          resetFilterText: 'Borrar filtros'
        };

        //  set dropdown items
        vm.res.lstRefType = staticData.tipoRef;

        vm.res.asegurado = '';
        vm.res.revisado = null;
        vm.res.creador = '';

        $scope.$createObservableFunction('filterData')
          .debounce(500)
          .flatMapLatest(function(filter) {
            vm.isLoadedPage = false;
            vm.clsLoadSearch = 'u-loading';
            vm.filtered = true;
            return rx.Observable.fromPromise(reportesService.getReportesByFilter(filter));
          })
          .subscribe(function(data) {
            $scope.$evalAsync(function() {
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
        var filterData = localStorageService.get('filterData');

        if (!_.isEmpty(filterData)) {
          $scope.$evalAsync(function afn() {
            vm.pageData = filterData.pageData;
            vm.res = {
              fecha: filterData.res.fecha,
              refType: (function bfn() {
                var el = filterData.res.refType;
                return !_.isEmpty(el) ? _.find(vm.res.lstRefType, {'nombre': el.nombre, 'id': el.id}) : {};
              }()),
              asegurado: filterData.res.asegurado,
              revisado: filterData.res.revisado,
              creador: filterData.res.creador
            };
            vm.res.lstRefType = staticData.tipoRef;

            vm.dest.lstCategorias = coreDataService.getCategorias();
            vm.dest.lstEntidades = coreDataService.getEntidades();
            vm.dest.lstConvenios = staticData.convenios;
            vm.dest.centro = filterData.dest.centro;
            vm.origen.centro = filterData.origen.centro;
            vm.origen.departamento = !_.isEmpty(filterData.origen.departamento) ? _.find(vm.lstDptos, function fd(it) {
              return it.id === filterData.origen.departamento.id;
            }) : {};

            vm.dest.departamento = !_.isEmpty(filterData.dest.departamento) ? _.find(vm.lstDptos, function fd(it) {
              return it.id === filterData.dest.departamento.id;
            }) : {};

            vm.lstEspSelected = filterData.lstEspSelected;
            vm.filter = filterData.toFilter;
            vm.toFilter = filterData.toFilter;
            vm.totalItems = filterData.totalItems;
            vm.totalPaginas = filterData.totalPaginas;
            vm.currentPage = filterData.currentPage;
            vm.toFilterExcel = reportesService.getObjReq(vm.toFilter);

            vm.origen.lstProvincias  = vm.toFilter.origDepaPl ? staticData.provincias[vm.toFilter.origDepaPl] : [];
            vm.dest.lstProvincias  = vm.toFilter.destDepaPl ? staticData.provincias[vm.toFilter.destDepaPl] : [];

            vm.origen.provincia = !_.isEmpty(filterData.origen.provincia) ?
              _.find(vm.origen.lstProvincias, function fd(it) {
                return it.id === filterData.origen.provincia.id;
              }) : {};

            vm.dest.provincia = !_.isEmpty(filterData.dest.provincia) ? _.find(vm.dest.lstProvincias, function fd(it) {
              return it.id === filterData.dest.provincia.id;
            }) : {};
            vm.toFilterExcel = reportesService.getObjReq(vm.toFilter);
          });
        } else {
          vm.toFilter = ng.copy(vm.filter);
          vm.toFilterExcel = reportesService.getObjReq(vm.toFilter);
          $scope.filterData(vm.toFilter); // eslint-disable-line
        }
      }; //  end $onInit

      vm.isEmptySearchResult = function iesrFn() {
        return vm.totalItems === 0 && !vm.clsLoadSearch && vm.filtered;
      };

      vm.disableDownload = function ddFn() {
        return !vm.totalItems && !vm.clsLoadSearch;
      };

      vm.reportDownload = function rdFn() {
        vm.toFilterExcel.esPaginacion = false;
      };

      vm.showDatepicker = function rdFn() {
        var modalInstance = $uibModal.open({
          backdrop: true,
          backdropClick: true,
          dialogFade: true,
          keyboard: true,
          scope: $scope,
          size: 'lg',
          windowTopClass: 'modal-datepicker modal-cp fade',
          template: '<modal-datepicker close="$ctrl.close(a)" datepicker1="$ctrl.datepicker1" '
            + ' datepicker2="$ctrl.datepicker2"></modal-datepicker>',
          controllerAs: '$ctrl',
          controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
            var that = this; // eslint-disable-line
            that.close = function okFn(type) {
              var rango = {
                ini: vm.datepicker1,
                fin: vm.datepicker2
              };
              if (type && type === 'ok') {
                $uibModalInstance.close(rango);
              } else {
                $uibModalInstance.dismiss('cancel');
              }
            };
            that.datepicker1 = vm.datepicker1;
            that.datepicker2 = vm.datepicker2;
          }]
        });
        modalInstance.result.then(function() {
          vm.res.fecha = vm.datepicker1.dateDbA.format('DD/MM/YYYY') + ' - '
            + vm.datepicker2.dateDbB.format('DD/MM/YYYY');
          vm.res.fechaInicio = vm.datepicker1.dateDbA.format('DD/MM/YYYY');
          vm.res.fechaFin = vm.datepicker2.dateDbB.format('DD/MM/YYYY');
          vm.change('ref-fecha');
        }, function() {});
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

      vm.verDetalleReferencia = function vdFn(id) {
        var data = {
          id: id
        };
        vm.loader.loading = true;
        var filterData = {
          pageData: vm.pageData,
          res: {
            asegurado: vm.res.asegurado,
            fecha: vm.res.fecha,
            refType: vm.res.refType,
            revisado: vm.res.revisado,
            creador: vm.res.creador
          },
          origen: {
            centro: vm.origen.centro,
            departamento: vm.origen.departamento,
            provincia: vm.origen.provincia
          },
          dest: {
            centro: vm.dest.centro,
            departamento: vm.dest.departamento,
            provincia: vm.dest.provincia
          },
          lstEspSelected: vm.lstEspSelected,
          toFilter: vm.toFilter,
          totalItems: vm.totalItems,
          totalPaginas: vm.totalPaginas,
          currentPage: vm.currentPage
        };

        localStorageService.set('filterData', filterData);
        $state.go('referencia.panel.reportes.detalle', data);
      };

      /**
       *  Called when there is any change in the form.
       * @param {string} type - The type of component.
       */
      vm.change = function changeFn(type) {
        switch (type) {
          case 'order':
            vm.filter.order = vm.orderFilter ? vm.orderFilter.id : '';
            break;
          case 'patient':
            vm.filter.asegurado = vm.res.asegurado ? vm.res.asegurado : '';
            break;
          case 'ref-fecha':
            vm.filter.fechaInicio = vm.res.fechaInicio;
            vm.filter.fechaFin = vm.res.fechaFin;
            break;
          case 'ref-type':
            vm.filter.refType = vm.res.refType ? vm.res.refType.id : '';
            break;
          case 'checked':
            vm.filter.revisado = vm.res.revisado ? vm.res.revisado : '';
            break;
          case 'orig-ent':
            vm.filter.origCentro = vm.origen.centro;
            break;
          case 'orig-dep':
            vm.filter.origDepaPl = vm.origen.departamento ? vm.origen.departamento.id : '';
            // al cambiar de depa, reseteamos la prov
            vm.origen.provincia = {};
            vm.origen.lstProvincias = vm.filter.origDepaPl ? staticData.provincias[vm.filter.origDepaPl] : [];
            break;
          case 'orig-pro':
            vm.filter.origProvPl = vm.origen.provincia ? vm.origen.provincia.id : '';
            break;
          case 'dest-ent':
            vm.filter.destCentro = vm.dest.centro ? vm.dest.centro : '';
            break;
          case 'dest-dep':
            vm.filter.destDepaPl = vm.dest.departamento ? vm.dest.departamento.id : '';
            // al cambiar de depa, reseteamos la prov
            vm.dest.provincia = {};
            vm.dest.lstProvincias = vm.filter.destDepaPl ? staticData.provincias[vm.filter.destDepaPl] : [];
            break;
          case 'dest-pro':
            vm.filter.destProvPl = vm.dest.provincia ? vm.dest.provincia.id : '';
            break;
          case 'esp':
            vm.filter.especialidades = vm.lstEspSelected;
            break;
          case 'creator':
            vm.filter.creador = vm.res.creador ? vm.res.creador.codigoUsuario : '';
            break;
          default:
            $log.info('changeFn - No type');
        }
        vm.areThereFilters = true;
      };

      vm.setPage = function setPageFn(pageNo) {
        vm.currentPage = pageNo;
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
          vm.lstEspSelected.splice(idx, 1);
          vm.change('esp');
        });
      };

      vm.searchProveedor = function(wilcar) {

        var params = {
          Patron: wilcar
        };

        return reportesService.getProveedor(params);
      };

      function cleanFilters() {
        vm.res.fecha = '';
        vm.res.fechaInicio = '';
        vm.res.fechaFin = '';

        vm.res.refType = {};
        vm.res.asegurado = '';
        vm.res.revisado = null;
        vm.resueltoDest = {};
        vm.origen.centro = '';
        vm.origen.departamento = {};
        vm.origen.provincia = {};
        vm.dest.centro = '';
        vm.dest.departamento = {};
        vm.dest.provincia = {};

        vm.res.creador = '';
        vm.lstEspSelected = [];
        vm.filter = {};

        vm.pageData = [];
        vm.totalItems = 0;
      }

      vm.applyFilter = function rfFn() {
        vm.btnOptions.applyFilterText = 'Cargando ...';

        vm.toFilter = ng.copy(vm.filter);
        vm.toFilter.esPaginacion = false;
        vm.toFilter.pagina = 1;
        vm.toFilterExcel = reportesService.getObjReq(vm.toFilter);
        $scope.filterData(vm.toFilter); // eslint-disable-line
      };

      vm.resetFilter = function rfFn() {
        cleanFilters();
      };

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

      $scope.$on('$destroy', function onDestroyFn() {
        tasUnFn();
      });
    } // end function ReportesController
    return ng.module('referenciaApp')
      .controller('ReporteController', reporteController);
  });
