define([
'angular', 'constants', 'constantsVidaLey'
], function (angular, constants, constantsVidaLey) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .directive('mpfCoberturaVidaLey', CoberturaVidaLeyDirective);

    CoberturaVidaLeyDirective.$inject = [];

    function CoberturaVidaLeyDirective() {
      var directive = {
        require: '^ngModel',
        controller: CoberturaVidaLeyDirectiveController,
        controllerAs: 'vm',
        restrict: 'E',
        templateUrl: '/polizas/app/vida-ley/components/coberturas/cobertura.template.html',
        scope: {
          riesgos: '=ngModel',
          nombre: '=name',
          disabled: '=?ngDisabled',
          update: '=?update'
        }
      };

      return directive;
    }

    CoberturaVidaLeyDirectiveController.$inject = ['$scope','vidaLeyService'];
    function CoberturaVidaLeyDirectiveController($scope,vidaLeyService) {
      var vm = this;

      vm.coberturas = [];
      vm.hidden =  false

      vm.coberturaChanged = CoberturaChanged;
      vm.descargarArchivo = DescargarArchivo;

      (function load_CoberturaVidaLeyDirectiveController(){
        $scope.coberturas =  $scope.coberturas || ''
        if($scope.update){
          vm.riesgos = $scope.riesgos;
          vm.canEmpleados = 0;
          vm.sumPlanillaTope = 0;
          vm.sumMontoTopado = 0;
          vm.coberturas = $scope.riesgos.Coberturas;

          vm.riesgos.map(function(riesgo){
            vm.canEmpleados += riesgo.numeroTrabajadores;
            vm.sumPlanillaTope += riesgo.montoTrabajadoresReal;
            vm.sumMontoTopado += riesgo.montoTopado;
          })
        }
        $scope.$watchCollection('riesgos', function(nv) {
          
          vm.riesgos = nv;
        });       
      })();

      function CoberturaChanged($event) {
        if ($event.CodCobertura === constantsVidaLey.CODIGO_COBERTURA_MUERTE) {
          angular.forEach(vm.coberturas, function (cobertura) {
            if (cobertura.flag !== 1) cobertura.checked = $event.checked;
          });
        }
      }
      function DescargarArchivo(riesgo){
        var urlBase = constants.system.api.endpoints.policy;
        var url = urlBase + 'api/vidaley/descargaticket/'+vm.riesgos.riesgos.CargaAsegurado.Poliza.NumPoliza+'/'+riesgo.NumRiesgo
        document.location.href=url
      }

    }
});
