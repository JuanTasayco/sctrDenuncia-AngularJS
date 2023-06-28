define([
  'angular', 'constantsRiesgosGenerales', 'constants', 'trabajadores'
], function (ng, constantsRiesgosGenerales, constants) {
  cargaMasivaController.$inject = ['mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory'];
  function cargaMasivaController(mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory) {
    var vm = this;
    vm.cargarTrabajadoresMasivo = cargarTrabajadoresMasivo,
      vm.addItem = AddItem;
    vm.cambiarTipoRegistro = cambiarTipoRegistro;
    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;
    };
    function cargarTrabajadoresMasivo(fileItem) {
      var file = fileItem.listExcel;
      riesgosGeneralesService.cargarTrabajadoresMasivo(file[0], fileItem.typefile).then(function (response) {
        if (response.status === constants.operationCode.success) {
          if (response.data.OperationCode === 422) {
            mModalAlert.showError(response.data.Message, 'Error en la carga del archivo');
            return
          }
          var typefile = parseInt(fileItem.typefile)
          if (typefile === 1) {
            if (response.data.Data.length === vm.tramite.CantTrabajadores) {
              response.data.Data.forEach(function (element) {
                element["checked"] = false;
                element["NroDocumento"] = element.NroDocumento.toString();
                element["TipDoc"] = { Valor: element.TipDocumento }
                riesgosGeneralesFactory.setValidadores(element)
              });
              response.data.Data.forEach(function (trabajador,key) {
                trabajador["Orden"] = key+1;
                fileItem.listaTrabajador.push(trabajador);
              });

              
            } else {
              mModalAlert.showWarning(vm.constantsRrgg.SMS_INFO.DATA_TRABAJADORES_1 +''+ vm.tramite.CantTrabajadores +''+ vm.constantsRrgg.SMS_INFO.DATA_TRABAJADORES_2, "ALERTA");
            }
          }
          if (typefile === 2) {
            fileItem.listaUbicaciones = response.data.Data;
            fileItem.listaUbicaciones.unshift({Direccion: vm.tramite.ResCotizacion.Ubicacion})
            fileItem.listaUbicaciones = fileItem.listaUbicaciones.map(function (ubi,key) {
              ubi["Orden"] = key+1;
              return ubi
            })

          }

        }
      }).catch(function (error) {
        mModalAlert.showError("", 'Error en la carga del archivo');
      })
    }
    function AddItem(item) {
      var defultAsegurado = { item: '' };
      var typefile = parseInt(item.typefile)
      if (typefile === 1) item.listaTrabajador.push(angular.copy(angular.extend(defultAsegurado)))
      if (typefile === 2) item.listaUbicaciones.push(angular.copy(angular.extend(defultAsegurado)))
    }
    function cambiarTipoRegistro($selectedIndex, item) {
      var typefile = parseInt(item.typefile)
      if ($selectedIndex === 0 && typefile === 1) item.listaTrabajador = [];
      if ($selectedIndex === 0 && typefile === 2) item.listaUbicaciones = [{Direccion: vm.tramite.ResCotizacion.Ubicacion}];
      if ($selectedIndex === 1 && typefile === 1) item.listaTrabajador = [{ value: 0 }];
      if ($selectedIndex === 1 && typefile === 2) item.listaUbicaciones = [{Direccion: vm.tramite.ResCotizacion.Ubicacion}]
      if($selectedIndex === "radio"){
        item.listaTrabajador = [];
        item.listaUbicaciones = [];
      }
    }
  } // end controller
  return ng.module('appRrgg')
    .controller('cargaMasivaController', cargaMasivaController)
    .component('cargaMasiva', {
      templateUrl: '/polizas/app/rrgg/components/carga-masiva/carga-masiva.component.html',
      controller: 'cargaMasivaController',
      bindings: {
        emision: '=',
        tramite: '=',
        form: "=?form"
      }
    })
});
