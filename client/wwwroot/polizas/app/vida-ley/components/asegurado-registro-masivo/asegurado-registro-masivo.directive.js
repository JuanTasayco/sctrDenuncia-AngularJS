define([
  'angular', 'constants', '/polizas/app/sctr/emitir/component/modalInfo.js'
], function (angular, constants) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .directive('mpfAseguradoRegistroMasivoVidaLey', AseguradoRegistroMasivoVidaLeyDirective);

  AseguradoRegistroMasivoVidaLeyDirective.$inject = [];

  function AseguradoRegistroMasivoVidaLeyDirective() {
    var directive = {
      require: '^ngModel',
      controller: AseguradoRegistroMasivoVidaLeyDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/vida-ley/components/asegurado-registro-masivo/asegurado-registro-masivo.template.html',
      scope: {
        riesgo: '=ngModel',
        index: '=index',
        disabled: '=?ngDisabled'
      }
    };

    return directive;
  }

  AseguradoRegistroMasivoVidaLeyDirectiveController.$inject = ['$scope', 'mModalAlert', 'vidaLeyService', 'vidaLeyFactory', 'vidaLeyGeneralFactory'];
  function AseguradoRegistroMasivoVidaLeyDirectiveController($scope, mModalAlert, vidaLeyService, vidaLeyFactory, vidaLeyGeneralFactory) {
    var vm = this;

    vm.cotizacion = {};

    vm.cargarEmpleadosMasivo = CargarEmpleadosMasivo;
    vm.resetPlanilla = ResetPlanilla;
    vm.archivoCargado = false;

    (function load_AseguradoRegistroMasivoVidaLeyDirectiveController() {
      $scope.$watchCollection('riesgo.planilla', function (nv) {
        vm.cargarEmpleadosMasivo();
      });
      vm.cotizacion = vidaLeyFactory.cotizacion;
      vm.riesgo = $scope.riesgo;
      if (vm.cotizacion && vm.cotizacion.codEstado === 'AC' && vm.cotizacion.McaMasivo === 'S') {
        vm.archivoCargado = true;
        vm.riesgo.ListaAsegurado = vm.cotizacion.ListaAsegurado;
        vm.riesgo.Coberturas = vm.cotizacion.Coberturas;
        vm.riesgo.tipo = 0;
        vm.update = true
        $scope.$watchCollection('vm.riesgo.planilla', function (nv) {
          vm.cargarEmpleadosMasivo();
        });
        $scope.disabled = false;
        vm.riesgoUpdate = {};
        vm.riesgoUpdate = vm.cotizacion.riesgos
        vm.riesgoUpdate.ListaAsegurado = vm.cotizacion.ListaAsegurado;
        vm.riesgoUpdate.Coberturas = vm.cotizacion.Coberturas;


        vm.riesgoUpdate.map(function(riesgo, index){
          riesgo.asegurados.map(function(asegurado, index){
              return asegurado.TipoRiesgo = {name: vm.riesgo.ListaAsegurado[index].TipoRiesgo};
            });
            riesgo.modelo.mNumeroTrabajadores = {Valor: vm.riesgo.ListaAsegurado.length};
        })


      }
    })();


    function CargarEmpleadosMasivo() {
      if(vm.cotizacion.codEstado === 'AC') {
        vidaLeyFactory.cotizacion.McaMasivo = 'S';
      }

      var file = vm.riesgo && vm.riesgo.planilla;
      
      if (typeof file !== 'undefined') {
        vm.update = false
        if (file && file.length > 0) {
          if (!!vm.riesgo.modelo.mCategoria && !!vm.riesgo.modelo.mCategoria.CodCategoria) {
            vm.riesgo.coberturas = [];
            vm.riesgo.riesgos = [];
            const parametrosAseguradosMasivo = vidaLeyFactory.getParametrosAseguradosMasivo(vm.riesgo);
            vidaLeyService.cargarAseguradoXRiesgo(file[0], parametrosAseguradosMasivo)
              .then(function (response) {
                if (response.data.TipoRespuesta === 'ERROR') {
                  vm.riesgo.errorFile = 1;
                  vm.riesgo.fileName = '';
                  var vError ="";
                   if(response.data.Errores){
                    vError = vidaLeyGeneralFactory.getHtmlTablaError(response.data.Errores);
                   }else{
                    vError = response.data.Descripcion;
                   }

                  mModalAlert.showError(vError, 'DATOS DE LA PLANILLA ERRONEOS');
                } else {
                  if (response.data.Errores.length) {
                    var vError = vidaLeyGeneralFactory.getHtmlTablaError(response.data.Errores, false, true);
                    mModalAlert.showWarning(vError, "LISTA DE OBSERVACIONES RENIEC");
                  }
                  vm.riesgo.errorFile = 0;
                  if(file[0]){
                    vm.riesgo.fileName = file[0].name;
                  }

                  vidaLeyFactory.setNumMovimientoCarga(response.data.Data, vm.riesgo);
                  response.data.Data.CargaAsegurado.RiesgoDTO.forEach(function (riesgoDTO) {
                    vidaLeyService.getListCoberturas(riesgoDTO.NumTrabajadores).then(function (response) {
                      var coberturas =vidaLeyFactory.getCoberturas(response)
                      vm.riesgo.coberturas.push(coberturas);
                      riesgoDTO.coberturas = coberturas;
                      var cob = coberturas.filter(function (cobertura) {
                        return cobertura.flag === 2;
                      });
                      riesgoDTO.codPlan = cob[0].CodPlan;
                    });
                  })
                   vm.riesgo.riesgos = response.data.Data;
                }

                vm.riesgo.planilla = (void 0);
                if($scope.index>=0){
                  document.getElementById('file-upload' + $scope.index).value = '';
                }
                else {
                  document.getElementById('file-upload').value = '';
                }
              })
              .catch(function (error) {
                vm.riesgo.planilla = (void 0);
                var msg = (error.data && (error.data.Data && error.data.Data.Message || error.data.Message) || 'Error no controlado');
                mModalAlert.showError('No se ha podido procesar la información. Comunícate con el administrador para más información.', 'Error en la carga del archivo');
              });
          } else {
            vm.riesgo.fileName = '';
            vm.riesgo.planilla = (void 0);
            vm.riesgo.errorFile = 2;
            mModalAlert.showWarning("No ha seleccionado la categoría", "Observación")
          }
        }
      }

    };

    function ResetPlanilla() {
      vm.riesgo.planilla = (void 0);
      document.getElementById("frmPlanillaFile" + $scope.index).reset();
      vm.riesgo.errorFile = 2;
    }
  }

});
