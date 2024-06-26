define([
  'angular', 'constants'
], function (angular, constants) {
  'use strict';

  angular
    .module('appSoat')
    .directive('mpfFormRestriccionesSoat', FormRestriccionesSoatDirective);

  FormRestriccionesSoatDirective.$inject = [];

  function FormRestriccionesSoatDirective() {
    var directive = {
      controller: FormRestriccionesSoatDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/soat/restriction/component/form-restricciones/form-restricciones.html',
      transclude: true,
      scope: {
        restriccion: '=ngRestriccion',
        esNuevo: '=ngEsNuevo',
        ngSaveCallback: '&?ngSave',
      }
    };

    return directive;
  }

  FormRestriccionesSoatDirectiveController.$inject = ['$scope', '$q', 'mModalAlert', 'soatFactory'];
  function FormRestriccionesSoatDirectiveController($scope, $q,  mModalAlert, soatFactory) {
    var vm = this;

    vm.restriccion = {};
    vm.esNuevo = true;

    vm.tiposVehiculos = [];
    vm.estados = [];

    vm.buscarAgentes = BuscarAgentes;
    vm.buscarUsuarios = BuscarUsuarios;
    vm.saveForm = saveForm;

    (function load_FormRestriccionesSoatDirectiveController() {
      vm.esNuevo = $scope.esNuevo;

      if(!$scope.esNuevo) {
        vm.restriccion = $scope.restriccion;
        _loadEstados();
      }

      _loadTipoVehiculos();
    })();

    function _loadTipoVehiculos() {
      soatFactory.getTipoVehiculo().then(function(response){
        if (response.OperationCode == constants.operationCode.success){
          vm.tiposVehiculos = response.Data;
        }
      });
    }

    function _loadEstados() {
      vm.estados = [
        {Codigo: 'N', Descripcion: 'ACTIVO'},
        {Codigo: 'S', Descripcion: 'INACTIVO'}
      ]
    }

    function BuscarAgentes(wilcar) {
      if (soatFactory.validateSearchText(wilcar)) {
        var defer = $q.defer();
        soatFactory.buscarAgente(wilcar.toUpperCase(), false).then(function (response) {
          defer.resolve(response.Data);
        });
        
        return defer.promise;
      }
    }

    function BuscarUsuarios(wilcar) {
      if (soatFactory.validateSearchText(wilcar)) {
        var defer = $q.defer();
        soatFactory.buscarUsuario(wilcar.toUpperCase(), false).then(function (response) {
          defer.resolve(response.data);
        });

        return defer.promise;
      }
    }

    function saveForm() {
      if (!$scope.formRestriccion.$valid) {
        $scope.formRestriccion.markAsPristine();
        mModalAlert.showError("Verifique que los datos estén correctos.", "Restricciones");
        return;
      }

      var request = vm.esNuevo ? _transformNewRestriction(vm.restriccion) : _transformEditRestriction(vm.restriccion);
      console.log(request)
      $scope.ngSaveCallback({ '$event': request });
    }

    function _transformNewRestriction(restriccion) {
      return {
        agentId: soatFactory.getValueString(restriccion.agent, 'CodigoAgente'),
        userId: soatFactory.getValueString(restriccion.user, 'userId'),
        vehicleTypeId: soatFactory.getValueString(restriccion.vehicleType, 'Codigo'),
        historicalAmount: soatFactory.getValueString(restriccion, 'historicalAmount'),
        totalEmissions: soatFactory.getValueString(restriccion, 'totalEmissions'),
        dailyEmissions: soatFactory.getValueString(restriccion, 'dailyEmissions'),
        creditDays: soatFactory.getValueString(restriccion, 'creditDays')
      };
    }

    function _transformEditRestriction(restriccion) {
      return {
        agentId: soatFactory.getValueString(restriccion.agent, 'CodigoAgente'),
        userId: soatFactory.getValueString(restriccion.user, 'userId'),
        vehicleTypeId: soatFactory.getValueString(restriccion.vehicleType, 'Codigo'),
        historicalAmount: soatFactory.getValueString(restriccion, 'historicalAmount'),
        totalEmissions: soatFactory.getValueString(restriccion, 'totalEmissions'),
        dailyEmissions: soatFactory.getValueString(restriccion, 'dailyEmissions'),
        creditDays: soatFactory.getValueString(restriccion, 'creditDays'),
        state: soatFactory.getValueString(restriccion.state, 'Codigo')
      };
    }
  }
});
