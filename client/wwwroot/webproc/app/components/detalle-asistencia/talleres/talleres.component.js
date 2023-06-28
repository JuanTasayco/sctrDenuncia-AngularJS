'use strict';

define(['angular', 'AsistenciaActions', 'lodash'], function(ng, AsistenciaActions, _) {
  TalleresController.$inject = ['wpFactory', 'MxPaginador', '$log', '$ngRedux', '$scope', '$uibModal'];
  function TalleresController(wpFactory, MxPaginador, $log, $ngRedux, $scope, $uibModal) {
    var vm = this;
    var page, frmData, actionsRedux, watchBindFiltro;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.filtrarTalleres = filtrarTalleres;
    vm.seleccionarTaller = seleccionarTaller;
    vm.deseleccionarTaller = deseleccionarTaller;
    vm.ingresoTallerManual = ingresoTallerManual;

    // declaracion

    function onInit() {
      actionsRedux = $ngRedux.connect(mapStateToThis, AsistenciaActions)(vm);
      vm.itemsXPagina = 10;
      vm.msgVacio = 'No se encontró ningún taller.<br>Intenta nuevamente.';
      vm.filtroByDefault = {
        depa: vm.frm.codigoDepartamento,
        prov: vm.frm.codigoProvincia,
        dist: vm.frm.codigoDistrito || 0
      };
      page = new MxPaginador();
      page.setNroItemsPorPagina(vm.itemsXPagina);
      if (!vm.statusBlock.blockByAnulado) {
        _isThereTaller() || watcherBindFiltro(vm.filtroByDefault);
      }
    }

    function onDestroy() {
      actionsRedux();
      ng.isFunction(watchBindFiltro) && watchBindFiltro();
    }

    function mapStateToThis(state) {
      return {
        frm: _.merge({}, state.detalle),
        statusBlock: state.frmStatus
      };
    }

    function watcherBindFiltro(objUbigeo) {
      watchBindFiltro = $scope.$watch('$ctrl.bindFiltroFrm', function(nv) {
        if (ng.isFunction(nv)) {
          nv(objUbigeo);
        }
      });
    }

    function _isThereTaller() {
      return _isThereTallerRegistrada() || _isThereTallerManual();
    }

    function _isThereTallerRegistrada() {
      return vm.frm.codigoTallerVehiculo && vm.frm.codigoDireccionTallerVehiculo;
    }

    function _isThereTallerManual() {
      return vm.frm.tallerVehiculoNoRegistrado && vm.frm.direccionTallerNoRegistrado;
    }

    function _cleanTallerRegistradoSeleccionado() {
      vm.idTallerSeleccionado = null;
      vm.frm = ng.extend({}, vm.frm, {
        codigoTallerVehiculo: 0,
        codigoDireccionTallerVehiculo: '',
        tipoTallerVehiculo: null
      });
      vm.rdxDetalleUpdate(vm.frm);
    }

    function _getTalleres(frm) {
      var depa = frm.depa;
      var prov = frm.prov;
      var dist = frm.dist || 0;
      var tipoTaller = frm.cboTaller && frm.cboTaller.codigoValor;
      var name = frm.nameTaller;
      wpFactory.taller
        // eslint-disable-next-line new-cap
        .GetTalleres(depa, prov, dist, tipoTaller, name)
        .then(function gaRPrFn(resp) {
          var lstTalleresPorTanda = resp || [];
          vm.totalTalleres = resp.length || 0;
          page
            .setNroTotalRegistros(vm.totalTalleres)
            .setDataActual(lstTalleresPorTanda)
            .setConfiguracionTanda();

          _setLstCurrentPage();
        })
        .catch(function gaEPrFn(err) {
          vm.totalTalleres = 0;
          vm.lstTalleres = [];
          $log.error('Falló el obtener talleres', err);
        });
    }

    function filtrarTalleres(event) {
      if (!event.esPaginacion) {
        var nroDeTanda;
        // Desde Filtros
        _cleanTallerRegistradoSeleccionado();
        vm.currentPage = nroDeTanda = 1;
        page.setCurrentTanda(nroDeTanda);
        frmData = ng.copy(event.frm);
        _getTalleres(frmData);
      } else {
        // Desde paginador
        page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(null, _setLstCurrentPage);
      }
    }

    function _setLstCurrentPage() {
      vm.lstTalleres = page.getItemsDePagina();
    }

    function deseleccionarTaller() {
      vm.idTallerSeleccionado = null;
      vm.tallerSeleccionado = null;
    }

    function seleccionarTaller(taller) {
      var tipo = /TALLERES AFILIADOS/i.test(taller.nombreTipoTaller) ? '17' : '57';
      $log.info(taller);
      _showModalDireccion(taller).result.then(function mdPr(direccion) {
        $log.info(direccion);
        vm.idTallerSeleccionado = taller.codigoTaller;
        vm.tallerSeleccionado = null;
        vm.frm = ng.extend({}, vm.frm, {
          codigoTallerVehiculo: taller.codigoTaller,
          codigoDireccionTallerVehiculo: direccion.codigoLocal,
          tipoTallerVehiculo: tipo
        });
        vm.rdxDetalleUpdate(vm.frm);
      });
    }

    function _showModalDireccion(taller) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        template: '<wp-modal-direccion close="close($event)" taller="taller"></wp-modal-direccion>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.taller = {
              taller: taller
            };
            scope.close = function(ev) {
              if (ev && ev.status === 'ok') {
                $uibModalInstance.close(ev.data);
              } else {
                $uibModalInstance.dismiss();
              }
            };
          }
        ]
      });
    }

    function ingresoTallerManual() {
      _showModalManual().result.then(function mdPr(taller) {
        vm.idTallerSeleccionado = 'manual';
        vm.tallerSeleccionado = _.assign({type: 'manual'}, taller);
        vm.frm = ng.extend({}, vm.frm, {
          tallerVehiculoNoRegistrado: taller.nombreTaller,
          direccionTallerNoRegistrado: taller.direccionTaller
        });
        vm.rdxDetalleUpdate(vm.frm);
        $log.info(taller);
      });
    }

    function _showModalManual() {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        template: '<wp-modal-manual close="close($event)"></wp-modal-manual>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.close = function(ev) {
              if (ev && ev.status === 'ok') {
                $uibModalInstance.close(ev.data);
              } else {
                $uibModalInstance.dismiss();
              }
            };
          }
        ]
      });
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('TalleresController', TalleresController)
    .component('wpTalleres', {
      templateUrl: '/webproc/app/components/detalle-asistencia/talleres/talleres.html',
      controller: 'TalleresController',
      bindings: {}
    });
});
