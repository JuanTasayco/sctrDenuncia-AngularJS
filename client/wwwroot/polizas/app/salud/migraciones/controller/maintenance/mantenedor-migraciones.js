'use strict';
define([
  'angular', 'constants'
], function(angular, constants){

  var appSalud = angular.module('appSalud');

  appSalud.controller('mantenedorMigracionesController', ['$scope', 'oimPrincipal', '$window', '$state', '$rootScope', 'saludFactory', '$timeout', 'mModalAlert','$uibModal',
    function($scope, oimPrincipal, $window, $state, $rootScope, saludFactory, $timeout, mModalAlert, $uibModal){

    $scope.data = {};

    var vm = this;
    vm.showReglasAjuste = true;
    vm.urlPlantilla = constants.system.api.endpoints.policy + 'api/file/salud/reglaAjuste/template';
    vm.prioridades = [];
    vm.contratosMantenedor = [];

    // Planes Migrados
    vm.pagination = {
      currentPage: 1,
      maxSize: 10,
      totalItems: 0,
      items: [],
      noSearch: true,
      noResult: false
    };
    vm.parametrosReporteMantenedorMigraciones = {};
    vm.pdfURL = '';

    vm.buscarPlanesMigrados = BuscarPlanesMigrados;
    vm.limpiarResultados = LimpiarResultados;
    vm.pageChanged = PageChanged;
    vm.itemSeleccionado = ItemSeleccionado;
    vm.accionItem = AccionItem;
    vm.configurarPlan = ConfigurarPlan;
    vm.editarPlan = EditarPlan;
    vm.borrarPlan = BorrarPlan;
    vm.showModalAgregarPlan = ShowModalAgregarPlan;

    // Reglas de ajuste
    vm.paginationReglasAjuste = {
      currentPage: 1,
      maxSize: 10,
      totalItems: 0,
      items: [],
      noSearch: true,
      noResult: false
    };
    vm.parametrosReglasAjuste = {};

    vm.buscarReglasAjuste = BuscarReglasAjuste;
    vm.limpiarResultadosReglasAjuste = LimpiarResultadosReglasAjuste;
    vm.itemSeleccionadoReglasAjuste = ItemSeleccionadoReglasAjuste;
    vm.accionItemReglasAjuste = AccionItemReglasAjuste;
    vm.pageChangedReglasAjuste = PageChangedReglasAjuste;
    vm.getHrefDescargarFormato = GetHrefDescargarFormato;
    vm.resetPlanilla = ResetPlanilla;
    vm.aplicar = Aplicar;

    (function load_MantenedorMigracionesController(){
      if (typeof $scope.data.selectLoadFile === 'undefined'){
        $scope.data.selectLoadFile = true;
        vm.prioridades = _getPrioridades();
        _getContratosMantenedor();
      }
    })();

    function GetHrefDescargarFormato(){
      return 'app/assets/salud/Trama_Agregar_Reglas_Ajustes.xlsx';
    }

      $scope.fnChangeLoadFile = function(){

        $timeout(function(){
          var vFile = $scope.data.fmLoadFile || {};
          if (angular.isUndefined(vFile[0])) {
            $scope.data.nameLoadFile = '';
            $scope.data.selectLoadFile = true;
          } else {
            $scope.data.nameLoadFile = vFile[0].name;
            $scope.data.selectLoadFile = false;
          }
          // $scope.errorAttachFile = $scope.data.selectLoadFile;
        }, 0);
      };

    function Aplicar(){
      var file = $scope.data;
      saludFactory.cargarPlantilla(file.fmLoadFile[0])
        .then(function (response) {
          if (response.data.OperationCode === constants.operationCode.success) {
            vm.resetPlanilla();
            mModalAlert.showSuccess('Regla de Ajuste creada correctamente', 'NUEVA REGLA DE AJUSTE CREADA');
          } else {
            mModalAlert.showError(response.Message, 'Error');
          }

        }).catch(function (err) {
        mModalAlert.showError(err.data.message, 'Error');
      });
    }

    function ResetPlanilla() {
      $scope.data = {};
      $scope.data.selectLoadFile = true;
      document.getElementById('iLoadFile').value = '';
    }

    function BuscarPlanesMigrados(filtros) {
      vm.limpiarResultados();
      _setRequestBuscarPlanesMigrados(filtros);
      _buscarPlanesMigrados();
    }

    function PageChanged(currentPage) {
      vm.parametrosReporteMantenedorMigraciones.PaginaActual = currentPage;
      _buscarPlanesMigrados();
    }

    function ItemSeleccionado(item) {

    }

    function AccionItem(event) {
      if(event.evento === 'configurar'){
        _buscarPlanesMigrados();
      }

      if(event.evento === 'eliminar'){
        _buscarPlanesMigrados();
      }
    }

    function ConfigurarPlan($event) {
      // $state.go(constantsVidaLey.ROUTES.REPORTE.url, { documentoId: $event.documento.NumeroDocumento }, { reload: true, inherit: false });
    }

    function EditarPlan($event) {
      // $state.go(constantsVidaLey.ROUTES.REPORTE.url, { documentoId: $event.documento.NumeroDocumento }, { reload: true, inherit: false });
    }

    function BorrarPlan($event) {
      // $state.go(constantsVidaLey.ROUTES.REPORTE.url, { documentoId: $event.documento.NumeroDocumento }, { reload: true, inherit: false });
    }

    function LimpiarResultados() {
      vm.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalItems: 0,
        items: [],
        noSearch: true,
        noResult: false
      };
    }

    function _buscarPlanesMigrados() {
      saludFactory.listarPlanesMigracion(
        vm.parametrosReporteMantenedorMigraciones.numRegistros, vm.parametrosReporteMantenedorMigraciones.numPaginacion, vm.parametrosReporteMantenedorMigraciones.numContrato, vm.parametrosReporteMantenedorMigraciones.numSubContrato, vm.parametrosReporteMantenedorMigraciones.continuidad, true
      ).then(_buscarPlanesMigradosResponse);
    }

    function _setRequestBuscarPlanesMigrados(filtros) {
      vm.parametrosReporteMantenedorMigraciones = {
        numContrato: (filtros && filtros.numContrato) || 0,
        numSubContrato: (filtros && filtros.numSubContrato) || 0,
        continuidad: (filtros && filtros.continuidad) || 0,
        numRegistros: vm.pagination.maxSize,
        numPaginacion: vm.pagination.currentPage,
      };
    }

    function _buscarPlanesMigradosResponse(response) {
      vm.pagination.noSearch = false;
      vm.pagination.totalItems = parseInt(response.Data.CantidadTotalFilas);
      vm.pagination.items = response.Data.Lista;
      vm.pagination.noResult = response.Data.Lista.length === 0;
    }

    // Reglas Ajuste
    function BuscarReglasAjuste(filtros) {
      vm.limpiarResultadosReglasAjuste();
      _setRequestBuscarReglasAjuste(filtros);
      _buscarReglasAjuste();
    }

    function LimpiarResultadosReglasAjuste() {
      vm.paginationReglasAjuste = {
        currentPage: 1,
        maxSize: 10,
        totalItems: 0,
        items: [],
        noSearch: true,
        noResult: false
      };
    }

    function _setRequestBuscarReglasAjuste(filtros) {
      vm.parametrosReglasAjuste = {
        numContrato: (filtros && filtros.numContrato) || 0,
        numSubContrato: (filtros && filtros.numSubContrato) || 0,
        numRegistros: vm.pagination.maxSize,
        numPaginacion: vm.pagination.currentPage,
      };
    }

    function _buscarReglasAjuste() {
      saludFactory.listarReglasAjuste(
        vm.parametrosReglasAjuste.numRegistros, vm.parametrosReglasAjuste.numPaginacion,
        vm.parametrosReglasAjuste.numContrato, vm.parametrosReglasAjuste.numSubContrato, true
      ).then(_buscarReglasAjusteResponse);
    }

    function _buscarReglasAjusteResponse(response) {
      vm.paginationReglasAjuste.noSearch = false;
      vm.paginationReglasAjuste.totalItems = parseInt(response.Data.CantidadTotalFilas);
      vm.paginationReglasAjuste.items = response.Data.Lista;
      vm.paginationReglasAjuste.noResult = response.Data.Lista.length === 0;
    }

    function ItemSeleccionadoReglasAjuste(item) {

    }

    function AccionItemReglasAjuste(event) {
      if(event.evento === 'eliminar'){
        _buscarReglasAjuste();
      }
      if(event.evento === 'editar'){
        _buscarReglasAjuste();
      }
    }

    function _getPrioridades(){
        var prioridades = [
          {codigo: '1', descripcion: '1'},
          {codigo: '2', descripcion: '2'},
          {codigo: '3', descripcion: '3'},
          {codigo: '4', descripcion: '4'},
          {codigo: '5', descripcion: '5'}
        ];
        return prioridades;
    }

    function PageChangedReglasAjuste(currentPage) {
      vm.parametrosReglasAjuste.PaginaActual = currentPage;
      _buscarReglasAjuste();
    }

    function _getContratosMantenedor(){
        saludFactory.getTipoContrato(false)
          .then(function (response) {
            if (response.Data && response.Data.length > 0){
              vm.contratosMantenedor = response.Data;
            }
          }).catch(function (err) {

        });
    }

    function ShowModalAgregarPlan(){
        var vModalProof = $uibModal.open({
          backdrop: true,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          size: 'md',
          templateUrl : '/polizas/app/salud/popup/controller/popupAgregarPlanMigrado.html',
          controller : ['$scope', '$uibModalInstance', 'saludFactory', 'mModalAlert',
            function($scope, $uibModalInstance, saludFactory, mModalAlert) {
              /*## closeModal ##*/
              $scope.documento = {};
              $scope.prioridades = vm.prioridades;
              $scope.documento.McaInh = 'N';
              $scope.contratos = vm.contratosMantenedor;
              $scope.subContratos = [];

              $scope.closeModal = function () {
                $uibModalInstance.close();
              };

              $scope.getRequestAgregarPlanMigracion = function(documento){
                var request = [];
                if(documento.NuevoSubContratoMigracion.numeroSubContrato && documento.NuevoSubContratoMigracion.numeroSubContrato !== '' && documento.NuevoSubContratoMigracion.numeroSubContrato !== 'null'){
                  var valor1 = {
                      "numeroContrato": ""+documento.ContratoMigracion.numeroContrato,
                      "numeroSubContrato": ""+documento.NuevoSubContratoMigracion.numeroSubContrato,
                      "continuidad": "0",
                      "numeroContratoMigracion": ""+documento.ContratoMigracion.numeroContrato,
                      "numeroSubContratoMigracion": ""+documento.NuevoSubContratoMigracion.numeroSubContrato,
                      "continuidadMigracion": "0",
                      "mcaInh": documento.McaInh,
                      "prioridadMigracion": documento.Prioridad,
                      "estado": "1"
                    };
                  request.push(valor1);
                }
                if(documento.ContinuidadSubContrato.numeroSubContrato && documento.ContinuidadSubContrato.numeroSubContrato !== '' && documento.ContinuidadSubContrato.numeroSubContrato !== 'null'){
                  var valor2 = {
                    "numeroContrato": ""+documento.ContratoMigracion.numeroContrato,
                    "numeroSubContrato": ""+documento.ContinuidadSubContrato.numeroSubContrato,
                    "continuidad": "1",
                    "numeroContratoMigracion": ""+documento.ContratoMigracion.numeroContrato,
                    "numeroSubContratoMigracion": ""+documento.ContinuidadSubContrato.numeroSubContrato,
                    "continuidadMigracion": "1",
                    "mcaInh": documento.McaInh,
                    "prioridadMigracion": documento.Prioridad,
                    "estado": "1"
                  };
                  request.push(valor2);
                }
                return request;
              }

              $scope.guardar = function () {
                var request = $scope.getRequestAgregarPlanMigracion($scope.documento);
                saludFactory.agregarPlanesMigrar(request, true)
                  .then(function (response) {
                    if (response.OperationCode === constants.operationCode.success) {
                      mModalAlert.showSuccess(response.Message, 'Exito');
                      vm.buscarPlanesMigrados(vm.parametrosReporteMantenedorMigraciones);
                      $scope.closeModal();
                    } else {
                      mModalAlert.showError(response.Message, 'Error');
                      return;
                    }
                  }).catch(function (err) {
                  mModalAlert.showError(err.data.message, 'Error');
                  return;
                });
              };

              $scope.getSubContratosModal = function(numeroContratoMigracion){
                var codContrato = numeroContratoMigracion;
                saludFactory.getTipoSubContrato(codContrato, false)
                  .then(function (response) {
                    if (response.Data){
                      $scope.subContratos = response.Data;
                    }
                  }).catch(function (err) {

                });
              };
            }
          ]
        });
        vModalProof.result.then(function(){
          //$scope.cleanModal();
          //Action after CloseButton Modal
        },function(){
          //Action after CancelButton Modal
        });
      }

  }]);
});
