define([
  'angular', 'constants', '/polizas/app/soat/emit/service/soatFactory.js'
], function (angular, constants,  soatFactory) {
  'use strict';

  angular
    .module('appSoat')
    .directive('mpfFiltroRestriccionesSoat', FiltroRestriccionesSoatDirective);

  FiltroRestriccionesSoatDirective.$inject = [];

  function FiltroRestriccionesSoatDirective() {
    var directive = {
      controller: FiltroRestriccionesSoatDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/soat/restriction/component/filtro-restricciones/filtro-restricciones.html',
      transclude: true,
      scope: {
        filtros: '=?ngFiltros',
        ngBuscarCallback: '&?ngBuscar',
        ngLimpiarCallback: '&?ngLimpiar',
        ngNuevoCallback: '&?ngNuevo',
      }
    };

    return directive;
  }

  FiltroRestriccionesSoatDirectiveController.$inject = ['$scope', 'mModalAlert', 'soatFactory', '$q'];
  function FiltroRestriccionesSoatDirectiveController($scope, mModalAlert, soatFactory, $q) {
    var vm = this;
    var filtrosDefault = { agente: null, usuario: null, tipoVehiculo: null };

    vm.filtros = {};
    vm.tiposVehiculos = [];

    vm.buscarAgentes = BuscarAgentes;
    vm.buscarUsuarios = BuscarUsuarios;
    vm.buscarRestricciones = BuscarRestricciones;
    vm.limpiarFiltros = LimpiarFiltros;
    vm.nuevaRestriccion = NuevaRestriccion;

    (function load_FiltroRestriccionesSoatDirectiveController() {
      vm.filtros = angular.extend({}, filtrosDefault);
      _loadTipoVehiculos();
    })();

    function BuscarAgentes(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var defer = $q.defer();
        soatFactory.buscarAgente(wilcar.toUpperCase(), false).then(function (response) {
          defer.resolve(response.Data);
        });
        
        return defer.promise;
      }
    }

    function BuscarUsuarios(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var defer = $q.defer();
        soatFactory.buscarUsuario(wilcar.toUpperCase(), false).then(function (response) {
          defer.resolve(response.data);
        });

        return defer.promise;
      }
    }

    function _loadTipoVehiculos() {
      soatFactory.getTipoVehiculo().then(function(response){
        if (response.OperationCode == constants.operationCode.success){
          vm.tiposVehiculos = response.Data;
        }
      });
    }

    function BuscarRestricciones() {
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

    function NuevaRestriccion() {
      if ($scope.ngNuevoCallback) {
        $scope.ngNuevoCallback();
      }
    }

    function _validateFilter() {
      if (_validateFilterFields()) {
        $scope.frmRestricciones.markAsPristine();
        return $scope.frmRestricciones.$valid;
      } else {
        mModalAlert.showWarning('Debe ingresar los filtros obligatorios', 'ALERTA', null, 3000);
        return false;
      }
    }

    function _validateFilterFields() {
      var validate = (vm.filtros.agente !== null && (vm.filtros.agente.CodigoAgente !== undefined && vm.filtros.agente.CodigoAgente !== null))
                     //&& (vm.filtros.tipoVehiculo !== null && (vm.filtros.tipoVehiculo.Codigo !== undefined && vm.filtros.tipoVehiculo.Codigo !== null));
      return validate;
    }

    function _transformFiltrosBuscar() {
      return {
        agente: vm.filtros.agente && vm.filtros.agente.CodigoAgente,
        usuario: vm.filtros.usuario && vm.filtros.usuario.userId,
        tipoVehiculo: vm.filtros.tipoVehiculo && vm.filtros.tipoVehiculo.Codigo,
      };
    }
  }
});
