define([
  'angular', 'constants',
  '/gcw/app/factory/gcwFactory.js', 'fexConsult'
], function (ng) {

  ComprobanteRemitidoController.$inject = ['$scope', '$rootScope', 'gcwFactory', '$uibModal', 'mModalAlert', 'mModalConfirm', '$timeout', '$sce', 'MxPaginador', '$state'];

  function ComprobanteRemitidoController($scope, $rootScope, gcwFactory, $uibModal, mModalAlert, mModalConfirm, $timeout, $sce, MxPaginador, $state) {
    var vm = this;
    var page;

    vm.$onInit = function () {

      if ($state.current.url == "/cobranzas/comprobante-remitido") {
        $rootScope.currentURL = $state.current.url;
        $rootScope.$broadcast('comprobanteRemitido');
      }

      vm.itemsXPagina = 10;
      vm.itemsXTanda = vm.itemsXPagina * 4;
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      page = new MxPaginador();
      page.setNroItemsPorPagina(vm.itemsXPagina);
      vm.frmComprobanteRemitido = {};
      vm.tituloComprobanteRemitido = 'Cobranzas - Comprobante remitido';
      vm.pageChanged = pageChanged;
      vm.frmComprobanteRemitido.mFin = new Date();
      vm.frmComprobanteRemitido.mInicio = gcwFactory.restarMes(new Date(), 1);

      vm.cabecera = $rootScope.cabecera;
    }

    vm.buscar = buscar;

    function getListaComprobantesRemitidos(filter) {
      gcwFactory.getListaComprobantesRemitidos(vm.filter, true).then(
        function (response) {
          var comprobantes;
          if (response.data) {
            vm.totalPages = response.data.totalPages;
            vm.totalRows = response.data.totalRows;
            if (response.data.list.length > 0) {
              comprobantes = response.data.list;
            } else {
              comprobantes = [];
              vm.totalRows = 0;
              vm.totalPages = 0;
            }
          } else {
            comprobantes = [];
            vm.totalRows = 0;
            vm.totalPages = 0;
          }
          page.setNroTotalRegistros(vm.totalRows).setDataActual(comprobantes).setConfiguracionTanda();
          setLstCurrentPage();
        });
    }

    function setLstCurrentPage() {
      vm.comprobantes = page.getItemsDePagina();
    }

    function buscar() {
      if (typeof vm.frmComprobanteRemitido.mInicio == 'undefined' || vm.frmComprobanteRemitido.mInicio == '') {
        mModalAlert.showInfo("Debe elegir una fecha de inicio", "Fecha de inicio");
        vm.comprobantes = [];
      } else if (typeof vm.frmComprobanteRemitido.mFin == 'undefined' || vm.frmComprobanteRemitido.mFin == '') {
        mModalAlert.showInfo("Debe elegir una fecha final", "Fecha final");
        vm.comprobantes = [];
      } else if (typeof vm.frmComprobanteRemitido.mInicio == 'undefined' || vm.frmComprobanteRemitido.mInicio == '') {
        mModalAlert.showInfo("Debe elegir una fecha de inicio", "Fecha de inicio");
        vm.comprobantes = [];
      } else {
        vm.currentPage = 1; // El paginador selecciona el nro 1
        vm.filter = {
          dateStart: gcwFactory.formatearFecha(vm.frmComprobanteRemitido.mInicio),
          dateEnd: gcwFactory.formatearFecha(vm.frmComprobanteRemitido.mFin),
          RowByPage: vm.itemsXTanda,
          CurrentPage: vm.currentPage
        }
        page.setCurrentTanda(vm.currentPage);
        getListaComprobantesRemitidos(vm.filter);
      }
    }

    //Paginacion
    function pageChanged(event) {
      vm.filter = {
        dateStart: gcwFactory.formatearFecha(vm.frmComprobanteRemitido.mInicio),
        dateEnd: gcwFactory.formatearFecha(vm.frmComprobanteRemitido.mFin),
        RowByPage: vm.itemsXTanda
      }
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function (nroTanda) {
        vm.filter.CurrentPage = nroTanda;
        getListaComprobantesRemitidos(vm.filter);
      }, setLstCurrentPage);
    }

    //Exportar
    $scope.exportar = function () {
      vm.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw + 'api/collection/VoucherForwarded/download');
      vm.downloadFile = {
        dateStart: gcwFactory.formatearFecha(vm.frmComprobanteRemitido.mInicio),
        dateEnd: gcwFactory.formatearFecha(vm.frmComprobanteRemitido.mFin),
        RowByPage: "10",
        CurrentPage: "1"
      };
      $timeout(function () {
        document.getElementById('frmExport').submit();
      }, 500);
    }

    function _calendarInicio() {
      $scope.todayInicio = function () {
        $scope.mInicio = new Date();
      };
      $scope.todayInicio();

      $scope.inlineOptions = {
        minDate: new Date(),
        showWeeks: true
      };

      $scope.dateOptionsInicio = {
        formatYear: 'yy',
        maxDate: new Date(),
        minDate: new Date(),
        startingDay: 1
      };

      $scope.toggleMinInicio = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptionsInicio.minDate = $scope.inlineOptions.minDate;
      };
      $scope.toggleMinInicio();

      $scope.openInicio = function () {
        $scope.popupInicio.opened = true;
      };

      $scope.formatDate = constants.formats.dateFormat;
      $scope.mask = constants.formats.dateFormatMask;
      $scope.pattern = constants.formats.dateFormatRegex;

      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.popupInicio = {
        opened: false
      };

    }

    function _calendarFin() {
      $scope.todayFin = function () {
        $scope.mFin = new Date();
      };
      $scope.todayFin();

      $scope.inlineOptions = {
        minDate: new Date(),
        showWeeks: true
      };

      $scope.dateOptionsFin = {
        formatYear: 'yy',
        maxDate: new Date(),
        minDate: new Date(),
        startingDay: 1
      };

      $scope.toggleMinFin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptionsFin.minDate = $scope.inlineOptions.minDate;
      };
      $scope.toggleMinFin();

      $scope.openFin = function () {
        $scope.popupFin.opened = true;
      };

      $scope.formatDate = constants.formats.dateFormat;
      $scope.mask = constants.formats.dateFormatMask;
      $scope.pattern = constants.formats.dateFormatRegex;

      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.popupFin = {
        opened: false
      };

    }

    _calendarInicio();
    _calendarFin();

  } // end controller

  return ng.module('appGcw')
    .controller('ComprobanteRemitidoController', ComprobanteRemitidoController)
    .component('gcwComprobanteRemitido', {
      templateUrl: '/gcw/app/components/cobranzas/comprobante-remitido/comprobante-remitido.html',
      controller: 'ComprobanteRemitidoController',
      controllerAs: 'vm',
      bindings: {}
    });
});
