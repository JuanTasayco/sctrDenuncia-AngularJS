define([
  'angular', 'constants'
], function (angular, constants) {
  'use strict';

  angular
    .module('appSalud')
    .directive('mpfItemMantenedorMigracionesSalud', ItemoMantenedorMigracionesSaludDirective);

  ItemoMantenedorMigracionesSaludDirective.$inject = [];

  function ItemoMantenedorMigracionesSaludDirective() {
    var directive = {
      controller: ItemMantenedorMigracionesSaludDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/salud/migraciones/component/item-mantenedor-migraciones/item-mantenedor-migraciones.template.html',
      transclude: true,
      scope: {
        documento: '=ngDocumento',
        ngSeleccionadoCallback: '&?ngSeleccionado',
        ngAccionCallback: '&?ngAccion',
      }
    };

    return directive;
  }

  ItemMantenedorMigracionesSaludDirectiveController.$inject = ['$scope', '$timeout', 'mModalAlert', '$uibModal', 'saludFactory', 'mModalConfirm'];
  function ItemMantenedorMigracionesSaludDirectiveController($scope, $timeout, mModalAlert, $uibModal, saludFactory, mModalConfirm) {
    var vm = this;

    vm.documento = {};
    vm.prioridades = [];
    vm.subContratos = [];
    vm.contratos = [];

    vm.verCotizacion = VerCotizacion;
    vm.showModalConfigurarPlan = ShowModalConfigurarPlan;
    vm.getRequestConfigurar = GetRequestConfigurar;
    vm.eliminarDocumento = EliminarDocumento;

    (function load_ItemMantenedorMigracionesSaludDirectiveController() {
      vm.documento = _transformScopeDocument($scope.documento);
      vm.prioridades = _getPrioridades();
      _getContratos();
      _getSubContratos();
    })();

    function VerCotizacion(accion) {
      if ($scope.ngAccionCallback) {
        // var accion = constantsVidaLey.ESTADOS_PERMITIDOS_ACTUALIZACION.indexOf(vm.documento.CodigoEstado) !== -1 ? 'edit' : 'resumen';
        $scope.ngAccionCallback({ '$event': { evento: accion, documento: vm.documento } });
      } else {
        console.error('ERR-001: No se ha asignado la propiedad ng-accion');
      }
    }

    function EliminarDocumento(){
      var pregunta = vm.documento.McaInh === 'S' ? '¿Estás seguro de restaurar el registro?' : '¿Estás seguro de eliminar el registro?';
      mModalConfirm
        .confirmInfo('', pregunta, 'Si')
        .then(function(){
          _servicioEliminarDocumento();
        }).catch(function(){
      });
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

    function _getSubContratos(){
      var codContrato = vm.documento.NumeroContratoMigracion;
      saludFactory.getTipoSubContrato(codContrato, false)
        .then(function (response) {
          if (response.Data){
            vm.subContratos = response.Data;
          }
        }).catch(function (err) {

        });
    }

    function _getContratos(){
      saludFactory.getTipoContrato(false)
        .then(function (response) {
          if (response.Data && response.Data.length > 0){
            vm.contratos = response.Data;
          }
        }).catch(function (err) {

      });
    }

    function _servicioEliminarDocumento(){
      var codigoPlanMigracion = vm.documento.CodigoPlanMigracion;
      var mcaInh = vm.documento.McaInh;
      saludFactory.eliminarPlanesMigrar(codigoPlanMigracion, mcaInh, true)
        .then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            mModalAlert.showSuccess(response.Message, 'Exito');
            vm.verCotizacion('eliminar');
          } else {
            mModalAlert.showError(response.Message, 'Error');
          }
        }).catch(function (err) {
        mModalAlert.showError(err.data.message, 'Error');
      });
    }

    function GetRequestConfigurar(documento){
      var lista = documento.Lista;
      var request = [];

      angular.forEach(lista, function(item, key) {
        var numeroSubContratoMigracion = '';
        if(item.continuidadMigracion === 0){
          numeroSubContratoMigracion = documento.NuevoSubContratoMigracion.numeroSubContrato;
        }

        if(item.continuidadMigracion === 1){
          numeroSubContratoMigracion = documento.ContinuidadSubContrato.numeroSubContrato;
        }

        if(!numeroSubContratoMigracion || numeroSubContratoMigracion === ''){
          numeroSubContratoMigracion = item.numeroSubContratoMigracion;
        }

        const valor = {
          "codigoPlanMigracion": item.codigoPlanMigracion,
          "numeroContratoMigracion": item.numeroContratoMigracion,
          "numeroSubContratoMigracion": numeroSubContratoMigracion,
          "numeroContrato": item.numeroContrato,
          "numeroSubContrato": item.numeroSubContrato,
          "continuidad": item.continuidadMigracion,
          "continuidadMigracion": item.continuidadMigracion,
          "mcaInh": documento.McaInh,
          "prioridadMigracion": documento.Prioridad,
          "estado": "1"
        };
        request.push(valor);
      });
      return request;
  }

    function ShowModalConfigurarPlan(){
      var vModalProof = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        templateUrl : '/polizas/app/salud/popup/controller/popupConfiguarPlanMigrado.html',
        controller : ['$scope', '$uibModalInstance', 'saludFactory', 'mModalAlert',
          function($scope, $uibModalInstance, saludFactory, mModalAlert) {
            /*## closeModal ##*/
            $scope.documento = angular.copy(vm.documento);
            $scope.prioridades = vm.prioridades;
            $scope.contratos = vm.contratos;
            $scope.subContratos = vm.subContratos;

            $scope.closeModal = function () {
              $uibModalInstance.close();
            };

            $scope.guardar = function () {
              var request = vm.getRequestConfigurar($scope.documento);
              saludFactory.actualizacionPlanesMigrar(request, true)
                .then(function (response) {
                  if (response.OperationCode === constants.operationCode.success) {
                    mModalAlert.showSuccess(response.Message, 'Exito');
                    $scope.closeModal();
                    vm.verCotizacion('configurar');
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

    function _transformScopeDocument(document) {
      var NuevoSubContratoMigracion = {numeroSubContrato: '', nombreSubContratoMigracion: ''};
      var ContinuidadSubContrato = {numeroSubContrato: '', nombreSubContratoMigracion: ''};
      var lista = document.lista;
      console.log('lista', lista);
      angular.forEach(lista, function(item, key) {
        var continuidadMigracion = item.continuidadMigracion;
        if(continuidadMigracion === 0){
          NuevoSubContratoMigracion = item;
          NuevoSubContratoMigracion.nombreSubContratoMigracion = item.nombreSubContrato;
        } else {
          ContinuidadSubContrato = item;
          ContinuidadSubContrato.nombreSubContratoMigracion = item.nombreSubContrato;
        }
      });

      return {
        NombreContratoMigracion: document && document.nombreContratoMigracion,
        NombreSubContratoMigracion: document && document.nombreSubContratoMigracion,
        NumeroContrato: document && document.numeroContrato,
        NumeroContratoMigracion: document && document.numeroContratoMigracion,
        NumeroSubContrato: document && document.numeroSubContrato,
        NumeroSubContratoMigracion: document && document.numeroSubContratoMigracion,
        CodigoPlanMigracion: document && document.codigoPlanMigracion,
        Continuidad: document && document.continuidad,
        ContinuidadMigracion: document && document.continuidadMigracion,
        McaInh: document && document.mcaInh,
        Prioridad: document && document.prioridadMigracion,
        NuevoSubContratoMigracion: document && NuevoSubContratoMigracion && {nombreSubContratoMigracion: NuevoSubContratoMigracion.nombreSubContratoMigracion, numeroSubContrato: NuevoSubContratoMigracion.numeroSubContratoMigracion},
        ContinuidadSubContrato: document && ContinuidadSubContrato && {nombreSubContratoMigracion: ContinuidadSubContrato.nombreSubContratoMigracion, numeroSubContrato: ContinuidadSubContrato.numeroSubContratoMigracion},
        Seleccionado: false,
        ContratoMigracion: document && {nombreContratoMigracion: document.nombreContratoMigracion, numeroContrato: document.numeroContratoMigracion},
        Lista: document && document.lista
      };
    }
  }
});
