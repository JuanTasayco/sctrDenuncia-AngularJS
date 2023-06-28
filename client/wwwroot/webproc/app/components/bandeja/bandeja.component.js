'use strict';

define(['angular', 'helper', 'lodash'], function(ng, helper, _) {
  BandejaController.$inject = [
    'wpFactory',
    '$log',
    'odataBuilder',
    'MxPaginador',
    '$state',
    '$scope',
    'mModalAlert',
    '$uibModal'
  ];
  function BandejaController(wpFactory, $log, odataBuilder, MxPaginador, $state, $scope, mModalAlert, $uibModal) {
    var vm = this;
    var page, frmData, watchBindFiltro;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.descargarReporte = descargarReporte;
    vm.filtrarAsistencia = filtrarAsistencia;
    vm.verDetalle = verDetalle;
    vm.descargarReporteDiario = descargarReporteDiario;

    // declaracion

    function onInit() {
      vm.itemsXPagina = 10;
      vm.msgVacio = 'No se encontró ninguna asistencia.<br>Intenta nuevamente.';
      page = new MxPaginador();
      page.setNroItemsPorPagina(vm.itemsXPagina);
      var paramsURL = ng.copy($state.params);
      var paramsCache = wpFactory.cache.getFrm();
      var params = _areParamsValid(paramsURL) ? paramsURL : paramsCache;
      _execFrm(params);
    }

    function onDestroy() {
      watchBindFiltro();
    }

    function watcherBindFiltro(objFrm) {
      watchBindFiltro = $scope.$watch('$ctrl.bindFiltroFrm', function(nv) {
        if (ng.isFunction(nv)) {
          nv(objFrm);
        }
      });
    }

    function _areParamsValid(params) {
      return _.every(params, function(value) {
        return value;
      });
    }

    function _execFrm(params) {
      _.keys(params).length ? watcherBindFiltro(params) : watcherBindFiltro();
    }

    function descargarReporte() {
      wpFactory.assistance.Export('api/Assistance/$export?' + vm.query);
    }

    function getAsistencias(query) {
      wpFactory.assistance
        // eslint-disable-next-line new-cap
        .Search(query)
        .then(function gaRPrFn(resp) {
          var lstAsistenciasPorTanda;
          vm.totalAsistencias = helper.hasPath(resp, 'paginatorInfo.countRecord') ? resp.paginatorInfo.countRecord : 0;
          lstAsistenciasPorTanda = resp.data || [];
          page
            .setNroTotalRegistros(vm.totalAsistencias)
            .setDataActual(lstAsistenciasPorTanda)
            .setConfiguracionTanda();

          _setLstCurrentPage();
        })
        .catch(function gaEPrFn(err) {
          vm.totalAsistencias = 0;
          vm.lstAsistencias = [];
          $log.error('Falló en obtener asistencias', err);
        });
    }

    function _getQuery(nroDeTandaACargar, frm) {
      var builder = odataBuilder('');
      var itemPorTanda = vm.itemsXPagina * 5;
      return builder
        .filterEq('assistanceNumber', frm.assistanceNumber)
        .filterEq('sinesterNumber', frm.sinesterNumber)
        .filterEq('licensePlate', frm.licensePlate)
        .filterEq('state', frm.state ? frm.state.codigoValor : null)
        .filterEq('userName', frm.user ? frm.user.usercode : null)
        .filterEq('fromDate', _isNeededDates(frm) ? frm.fromDate : null)
        .filterEq('toDate', _isNeededDates(frm) ? frm.toDate : null)
        .pageOptions(nroDeTandaACargar, itemPorTanda)
        .query();
    }

    function _isNeededDates(frm) {
      return !(frm.assistanceNumber || frm.sinesterNumber || frm.licensePlate);
    }

    function filtrarAsistencia(event) {
      if (event.frm && event.frm.isInvalid) {
        mModalAlert.showWarning('Ingresa datos correctos en los filtros', 'Datos no válidos');
        return void 0;
      }

      if (!event.esPaginacion) {
        var nroDeTanda;
        // Desde Filtros
        vm.currentPage = nroDeTanda = 1;
        page.setCurrentTanda(nroDeTanda);
        frmData = ng.copy(event.frm);
        _realizarFiltro(nroDeTanda, frmData);
      } else {
        // Desde paginador
        page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
          _realizarFiltro(nroTanda, frmData);
        }, _setLstCurrentPage);
      }
    }

    function _setLstCurrentPage() {
      vm.lstAsistencias = page.getItemsDePagina();
    }

    function _realizarFiltro(nroTanda, frm) {
      vm.query = _getQuery(nroTanda, frm);
      getAsistencias(vm.query);
    }

    function verDetalle() {
      wpFactory.cache.setFrm(frmData);
      wpFactory.cache.setResultado(vm.lstAsistencias);
    }

    function descargarReporteDiario() {
      _showModalReporteDiario();
    }

    function _showModalReporteDiario(textos) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        windowTopClass: 'modal-ov--visible',
        template: '<wp-modal-reporte-diario close="close($event)" textos="textos"></wp-modal-reporte-diario>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.close = function(ev) {
              ev && ev.status === 'ok' ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
            };
            scope.textos = textos;
          }
        ]
      });
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('BandejaController', BandejaController)
    .component('wpBandeja', {
      templateUrl: '/webproc/app/components/bandeja/bandeja.html',
      controller: 'BandejaController',
      bindings: {}
    });
});
