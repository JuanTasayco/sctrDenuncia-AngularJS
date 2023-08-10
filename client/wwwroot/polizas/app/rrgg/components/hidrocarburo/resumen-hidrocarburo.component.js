define([
  'angular', 'constantsRiesgosGenerales', 'contratante', 'locales', 'vehiculos'
], function (ng, constantsRiesgosGenerales) {
  resumenHidrocarburoController.$inject = ['mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory', '$filter'];
  function resumenHidrocarburoController(mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory, $filter) {
    var vm = this;
    vm.currencyType = currencyType;
    vm.unidadLocal = unidadLocal;
    vm.sumaAseguradaDolaresSoles = sumaAseguradaDolaresSoles;
    vm.viewTractoNoTracto = viewTractoNoTracto;
    vm.viewPrimaTractoNoTracto = viewPrimaTractoNoTracto;
    vm.primaNeta = primaNeta;
    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;
    };
    function currencyType(moneda) {
      return riesgosGeneralesFactory.currencyType(moneda)
    }
    function unidadLocal() {
      var result = false
      if (vm.resumen.TipoAseguramiento.Codigo === vm.constantsRrgg.TIP_ASEGURAMIENTO.X_UNIDA) { result = true }
      return result;
    }
    function sumaAseguradaDolaresSoles() {
      var sumaAsegurada = "-"
      if (vm.resumen.Moneda.Codigo === vm.constantsRrgg.MONEDA.SOLES) { sumaAsegurada = vm.resumen.SumaAseguradaSoles }
      if (vm.resumen.Moneda.Codigo === vm.constantsRrgg.MONEDA.DOLARES) { sumaAsegurada = vm.resumen.SumaAseguradaDolares }
      return sumaAsegurada;
    }
    // S0240 Tracto
    // S0241 No Tracto
    // S0242 Tracto + No Tracto
    function calcularVehiculoTracto() {
      var tractos = []
      if(Array.isArray(vm.resumen.listaVehiculos)) {
        tractos = vm.resumen.listaVehiculos.filter(function (v) { return v.CodigoClase.Valor === 'S0240' || v.CodigoClase.Valor === 'S0242' });
      }
      return tractos.length;
    }

    function calcularVehiculoNoTracto() {
      var notractos = []
      if(Array.isArray(vm.resumen.listaVehiculos)) {
        notractos = vm.resumen.listaVehiculos.filter(function (v) { return v.CodigoClase.Valor === 'S0241' || v.CodigoClase.Valor === 'S0242' })
      }
      return notractos.length;
    }

    function primaNeta(tracto) {
      if (vm.resumen.IsVehiculoOrLocal !== vm.constantsRrgg.DATOS.VEHICULOS) return 0;
      var tractosJ21 = calcularVehiculoTracto();
      var notractosJ19 = calcularVehiculoNoTracto();
      if (tractosJ21 && notractosJ19) {
        var i21 = notractosJ19 < tractosJ21 ? notractosJ19 : tractosJ21;
        var ci21 = tracto ? tractosJ21 : notractosJ19;
        var moneda = currencyType(vm.resumen.Moneda.Codigo)
        var prima = $filter('currency')(vm.resumen.PrimaNeta / i21, moneda, 2);
        return i21 === ci21 ?  prima : (moneda + '-');
      }
      return '-';
    }

    function viewTractoNoTracto() {
      if (vm.resumen.IsVehiculoOrLocal !== vm.constantsRrgg.DATOS.VEHICULOS) return false;
      var tractos = calcularVehiculoTracto();
      var notractos = calcularVehiculoNoTracto();
      return tractos && notractos && tractos === notractos;
    }

    function viewPrimaTractoNoTracto() {
      if (vm.resumen.IsVehiculoOrLocal !== vm.constantsRrgg.DATOS.VEHICULOS) return false;
      var tractos = calcularVehiculoTracto();
      var notractos = calcularVehiculoNoTracto();
      return tractos && notractos && tractos !== notractos;
    }


  } // end controller
  return ng.module('appRrgg')
    .controller('resumenHidrocarburoController', resumenHidrocarburoController)
    .component('resumenHidrocarburo', {
      templateUrl: '/polizas/app/rrgg/components/hidrocarburo/resumen-hidrocarburo.component.html',
      controller: 'resumenHidrocarburoController',
      bindings: {
        resumen: '='
      }
    })
});
