define([
  'angular', 'constants', 'saludFactory'
], function (angular, constants, saludFactory) {
  'use strict';

  angular
    .module("appSalud")
    .directive('mpfResumenDatosParentesco', ResumenDatosParentescoDirective);

  ResumenDatosParentescoDirective.$inject = [];

  function ResumenDatosParentescoDirective() {
    var directive = {
      controller: ResumenDatosParentescoDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/salud/migraciones/component/resumen-datos-parentesco/resumen-datos-parentesco.template.html',
      scope: {
        data: '=ngData',
      }
    };

    return directive;
  }

  ResumenDatosParentescoDirectiveController.$inject = ['$scope', 'saludFactory', 'mModalAlert'];
  function ResumenDatosParentescoDirectiveController($scope, saludFactory, mModalAlert) {

    var vm = this;

    vm.data = {};
    vm.primaAnualizadaTotal = 0;
    vm.primaTotalVigencia = 0;

    vm.getPrimaAnualizadaTotal = _getPrimaAnualizadaTotal;
    vm.getPrimaAnualizadaTotalAsegurados = _getPrimaAnualizadaTotalAsegurados;
    vm.getPrimaTotalVigenciaAsegurados = _getPrimaTotalVigenciaAsegurados;

    (function load_ResumenDatosParentescoDirectiveController() {
      vm.data = $scope.data;
    })();

    var listenData = $scope.$watch('data', function(nv){
      vm.data = nv;
      vm.primaAnualizadaTotal = _getPrimaAnualizadaTotalAsegurados(vm.data.Asegurados);
      vm.primaTotalVigencia =  _getPrimaTotalVigenciaAsegurados(vm.data.Asegurados);
    });

    $scope.$on('$destroy', function(){
      listenData();
    });

    function _getPrimaAnualizadaTotal(desde, hasta, importe){
      var desdeFormat = _stringDateToDateFormat(desde, '/');
      var hastaFormat = _stringDateToDateFormat(hasta, '/');
      var duracionPoliza = _getDuracionPoliza(desdeFormat, hastaFormat);
      return (importe/duracionPoliza) * 12;
    }

    function _stringDateToDateFormat(dateString, stringSeparetor){
      if(!dateString) {
        return null;
      }
      var dateElements = dateString.split(stringSeparetor);
      return new Date(+dateElements[2], +dateElements[1] - 1, +dateElements[0]);
    }

    function _getDuracionPoliza(inicio, fin){
      var resta = fin.getTime() - inicio.getTime();
      var dias = Math.round(resta/ (1000*60*60*24));
      var meses = dias / 30;
      return Math.round(meses);
    }

    function _getPrimaAnualizadaTotalAsegurados(asegurados){
      var total = 0;
      asegurados.map(function (currentValue, index, arr) {
        var primaAsegurado = _getPrimaAnualizadaTotal(vm.data.FechaInicio, vm.data.FechaFin,currentValue.PrimaAsegurado);
        total = total + primaAsegurado;
      });
      return total;
    }

    function _getPrimaTotalVigenciaAsegurados(asegurados){
      var total = 0;
      asegurados.map(function (currentValue, index, arr) {
        var primaAsegurado = currentValue.PrimaAsegurado;
        total = total + primaAsegurado;
      });
      return total;
    }

  }

});
