define([
  'angular', 'constantsRiesgosGenerales'
], function (ng, constantsRiesgosGenerales) {
  rrggResVigLimpController.$inject = ['riesgosGeneralesFactory','riesgosGeneralesCommonFactory'];
  function rrggResVigLimpController(riesgosGeneralesFactory,riesgosGeneralesCommonFactory) {
    var vm = this;
    vm.currencyType = currencyType
    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;
      setTimeout(function () {
        vm.resumen.fechaValidezHasta = riesgosGeneralesCommonFactory.addDay(vm.resumen.FechaCotizacion, 30);
        vm.resumen.fechaValidezHasta = riesgosGeneralesFactory.formatearFecha(vm.resumen.fechaValidezHasta);
        
        if (vm.resumen.Ramo.Codigo === vm.constantsRrgg.RAMO.RESPON_CIVIL) {
          if (vm.resumen.Moneda.Codigo == 2) {
            vm.showLimiteEventoRC = vm.resumen.SumaAseguradaRC > 10000 ? true : false;
          }
          else {
            var TopeSoles = 10000 * vm.resumen.TipoCambio;
            vm.showLimiteEventoRC = vm.resumen.SumaAseguradaRC > TopeSoles ? true : false;
          }
        }else if (vm.resumen.Ramo.Codigo === vm.constantsRrgg.RAMO.RESPON_CIVILL_DESHONESTIDAD) {
          if (vm.resumen.Moneda.Codigo == 2) {
            vm.showLimiteEventoDes = vm.resumen.SumaAseguradaDesh > 10000 ? true : false;
            vm.showLimiteEventoRC = vm.resumen.SumaAseguradaRC > 10000 ? true : false;
          }
          else {
            var TopeSoles = 10000 * vm.resumen.TipoCambio;
            vm.showLimiteEventoDes = vm.resumen.SumaAseguradaDesh > TopeSoles ? true : false;
            vm.showLimiteEventoRC = vm.resumen.SumaAseguradaRC > TopeSoles ? true : false;
          }

        } else {
          if (vm.resumen.Moneda.Codigo == 2) {
            vm.showLimiteEventoDes = vm.resumen.SumaAseguradaDesh > 10000 ? true : false;
          }
          else {
            var TopeSoles = 10000 * vm.resumen.TipoCambio;
            vm.showLimiteEventoDes = vm.resumen.SumaAseguradaDesh > TopeSoles ? true : false;
          }
        }
      }, 200);

    };
    function currencyType(moneda) {
      return riesgosGeneralesFactory.currencyType(moneda)
    }
  } // end controller
  return ng.module('appRrgg')
    .controller('rrggResVigLimpController', rrggResVigLimpController)
    .component('rrggResVigLimp', {
      templateUrl: '/polizas/app/rrgg/components/vig-limpieza/resumen-vig-limpieza.component.html',
      controller: 'rrggResVigLimpController',
      bindings: {
        resumen: '='
      }
    })
});
