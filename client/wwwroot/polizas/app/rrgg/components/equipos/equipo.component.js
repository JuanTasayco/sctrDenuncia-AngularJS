define([
  'angular', 'constantsRiesgosGenerales'
], function (ng, constantsRiesgosGenerales) {
  equiposController.$inject = ['mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory', 'riesgosGeneralesCommonFactory'];
  function equiposController(mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory, riesgosGeneralesCommonFactory) {
    var vm = this;
    vm.validControlForm = ValidControlForm;
    vm.calculaEquipos = CalculaEquipos;
    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;
      vm.tramite = riesgosGeneralesFactory.getTramite();
      riesgosGeneralesService.getProxyPametros(vm.tramite.IdProducto || vm.cotizacion.CodigoRiesgoGeneral, vm.constantsRrgg.PARAMETROS.DESCRIP_EQUIPOS)
        .then(function (response) {
          vm.descripcion = response.Data;
        });
      vm.equipos = vm.cotizacion.modelo || vm.cotizacion
    };
    function ValidControlForm(controlName) {
      return vm.form && riesgosGeneralesFactory.validControlForm(vm.form, controlName);
    }
    function CalculaEquipos(valEquipo) {
      var valorEquipo = parseFloat(riesgosGeneralesCommonFactory.formatMilesToNumber(valEquipo));
      var canEquipos = vm.cotizacion.modelo.listaEquipos.length;
      riesgosGeneralesService.getProxyPametros(vm.tramite.IdProducto || vm.cotizacion.CodigoRiesgoGeneral, vm.constantsRrgg.PARAMETROS.MAX_EQUIPOS)
        .then(function (response) {
          var montoMax = 0
          var montoMaxOne = response.Data[1].Valor
          var montoMaxTwo = response.Data[0].Valor
          var jsonData = {};
          var simboloMoneda = ""
          if (canEquipos === 1) montoMax = montoMaxOne
          if (canEquipos >= 2) montoMax = montoMaxTwo
          //cuando es soles calcula por TC
          if (parseInt(vm.cotizacion.modelo.Moneda.Codigo) === 1) {
            var result = riesgosGeneralesCommonFactory.convertDolaresAsoles(montoMax);
            montoMaxOne = riesgosGeneralesCommonFactory.convertDolaresAsoles(montoMaxOne).montoMaximo;
            montoMaxTwo = riesgosGeneralesCommonFactory.convertDolaresAsoles(montoMaxTwo).montoMaximo;
            simboloMoneda = result.simboloMoneda;
            montoMax = result.montoMaximo
          }
          jsonData = {
            canEquipos: canEquipos,
            montoMaxOne: montoMaxOne,
            montoMaxTwo: montoMaxTwo,
            moneda: vm.cotizacion.modelo.Moneda,
            currency: false,
            simboloMoneda: simboloMoneda
          }
          
          if (valorEquipo > parseFloat(montoMax)) {
            mModalAlert.showWarning(riesgosGeneralesFactory.getSmsError("", jsonData), "LIMITE MÁXIMO PERMITIDO");
          }
          riesgosGeneralesFactory.cotizacion.producto.modelo.ValorEquipos = riesgosGeneralesCommonFactory.totalEquipos(vm.cotizacion.modelo.listaEquipos);
          riesgosGeneralesFactory.cotizacion.producto.modelo.SumaAsegurada = riesgosGeneralesFactory.calculaSumaAsegurada(jsonData);
          riesgosGeneralesFactory.cotizacion.producto.modelo.SumaAseguradaAux = riesgosGeneralesFactory.calculaSumaAsegurada(jsonData);
        });
    }
  } // end controller
  return ng.module('appRrgg')
    .controller('equiposController', equiposController)
    .component('equipos', {
      templateUrl: '/polizas/app/rrgg/components/equipos/equipo.component.html',
      controller: 'equiposController',
      bindings: {
        cotizacion: '=',
        validate: '=',
        form: "=?form"
      }
    })
});
