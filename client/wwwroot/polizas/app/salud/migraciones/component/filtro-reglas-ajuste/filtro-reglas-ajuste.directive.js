define([
  'angular', 'constants', 'saludFactory'
], function (angular, constants, saludFactory) {
  'use strict';

  angular
    .module('appSalud')
    .directive('mpfFiltroReglasAjusteSalud', FiltroReglasAjusteSaludDirective);

  FiltroReglasAjusteSaludDirective.$inject = [];

  function FiltroReglasAjusteSaludDirective() {
    var directive = {
      controller: FiltroReglasAjusteSaludDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/salud/migraciones/component/filtro-reglas-ajuste/filtro-reglas-ajuste.template.html',
      transclude: true,
      scope: {
        filtros: '=?ngFiltros',
        ngBuscarCallback: '&?ngBuscar',
        ngLimpiarCallback: '&?ngLimpiar'
      }
    };

    return directive;
  }

  FiltroReglasAjusteSaludDirectiveController.$inject = ['$scope', '$timeout', 'mModalAlert', 'saludFactory'];
  function FiltroReglasAjusteSaludDirectiveController($scope, $timeout, mModalAlert, saludFactory) {
    var vm = this;
    var filtrosDefault = { contrato: null, subcontrato: null };

    vm.filtros = {};
    vm.tiposContrato = [];
    vm.tiposSubContrato = [];

    vm.format = constants.formats.dateFormat;
    vm.userRoot = false;
    vm.user = {};
    vm.pdfURL = '';

    vm.buscarReglasAjuste = BuscarReglasAjuste;
    vm.limpiarFiltros = LimpiarFiltros;
    vm.fnChangeContractType = FnChangeContractType;

    (function load_FiltroReglasAjusteSaludDirectiveController() {
      vm.filtros = angular.extend({}, filtrosDefault);
      _loadContratos();
    })();

    function _loadContratos() {
      saludFactory.getTipoContrato(false)
        .then(function (response) {
          if (response.Data && response.Data.length > 0){
            vm.tiposContrato = response.Data;
            vm.fnChangeContractType(vm.filtros.contrato);
          }
        }).catch(function (err) {

      });
    }

    function _setDefaultContrato(){
      vm.filtros.contrato = vm.tiposContrato.find(function (contrato) {
        return contrato.numeroContrato == 30433;
      });
    }

    function BuscarReglasAjuste() {

      if ($scope.ngBuscarCallback) {
        if (_validateFilter()) {
          $scope.ngBuscarCallback({ '$event': _transformFiltrosBuscar() });
        }
      } else {
        console.error('ERR-001: No se ha asignado la propiedad ng-buscar');
      }
    }

    function LimpiarFiltros() {
      vm.filtros = angular.extend({}, filtrosDefault);
      if ($scope.ngLimpiarCallback) {
        $scope.ngLimpiarCallback();
      }
    }

    function FnChangeContractType(contrato){
      if(contrato){
        var codContrato = contrato.numeroContrato;
        saludFactory.getTipoSubContrato(codContrato, true)
          .then(function (response) {
            if (response.Data && response.Data.length > 0){
              vm.tiposSubContrato = response.Data;
            } else {
              vm.tiposSubContrato = [{'nombreSubContratoMigracion': '--Seleccione--', 'numeroSubContrato': null}];
            }
          }).catch(function (err) {
        });
      } else {
        vm.tiposSubContrato = [{'nombreSubContratoMigracion': '--Seleccione--', 'numeroSubContrato': null}];
      }
    }

    function _validateFilter() {
      if (_validateFilterFields()) {
        $scope.frmFiltrosReglasAjuste.markAsPristine();
        return $scope.frmFiltrosReglasAjuste.$valid;
      } else {
        mModalAlert.showWarning('Debe ingresar como mínimo un filtro', 'ALERTA', null, 3000);
        return false;
      }
    }

    function _validateFilterFields() {

      var validate = (vm.filtros.contrato && vm.filtros.contrato.numeroContrato !== null) ||
        (vm.filtros.subcontrato && vm.filtros.subcontrato.numeroSubContrato !== null);

      return validate;
    }

    function _transformFiltrosBuscar() {
      return {
        numContrato: vm.filtros.contrato && vm.filtros.contrato.numeroContrato,
        numSubContrato: vm.filtros.subcontrato && vm.filtros.subcontrato.numeroSubContrato
      };
    }
  }
});
