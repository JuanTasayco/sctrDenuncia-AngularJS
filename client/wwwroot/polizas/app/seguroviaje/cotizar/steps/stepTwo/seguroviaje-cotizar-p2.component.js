'use strict';

define([
  'angular',
  'lodash',
  'seguroviajeFactory',
  'seguroviajeService'
  ], function(ng, _) {

  SeguroviajeCotizarStepTwoController.$inject = [
    '$scope',
    '$state',
    '$timeout',
    'seguroviajeFactory',
    'seguroviajeService',
    'mModalAlert'
  ];

  function SeguroviajeCotizarStepTwoController($scope, $state, $timeout, seguroviajeFactory, seguroviajeService, mModalAlert) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit(){
      vm.currentStep = $state.params.step;
      vm.formData = seguroviajeFactory.getFormData();
      if(ng.isUndefined(vm.formData[0]) || !vm.formData[0].stepOneFinish){
        $state.go('.',{
          step: 1
        });
      }
      else{
        vm.getPolicies = getPolicies;
        vm.getProducts = getProducts;
        vm.destinations = seguroviajeFactory.getDestinations()
        vm.getCountries = getCountries;
        vm.cleanObjectByProperties = cleanObjectByProperties;
        vm.saveForm = saveForm;

        // El siguiente segmento, se hizo con el motivo de hacer las peticiones de acuerdo al paso y bajo con que contexto
        // y evitar hacer peticiones redundantes
        if(vm.currentStep === '2'){
        // Si se se encuentra en el paso 2, de entrada se hace la peticion
        fillCombosOnStep()
        }
      }
    }
    function fillCombosOnStep() {
      // Llamada para llenar el combo de motivos de viajes
      seguroviajeService.getTravelReasons(true)
      .then(function(response){
        vm.motivos = response.data;
      })
      .catch(function(err){
        mModalAlert.showError('Error de conexión', "Error");
      })

      // Condicion que verifica si al momento de iniciar el componente, existe informacion
      // guardada de este paso, hace falta ejecutar un metodo para llenar los combos, ya que si
      // estos combos no tienen un objeto asociado, visualmente se muestran vacios aun cuando
      // su ngModel tenga un valor asignado
      if(!ng.isUndefined(vm.formData[1])){
        fillCombosByPolizy(true) // Se pasa true para mantener el listado de productos, caso contrario los borra
      }
    }
    // Metodo para llenar el combo de polizas dado un motivo
    function getPolicies(motivo, keepProducts){
      if(motivo){
        seguroviajeService.getPolicies(motivo, true)
        .then(function(response){
          vm.policies = response.data;
          !keepProducts ? vm.products = [] : ''
          if(vm.policies.length == 0){
            mModalAlert.showWarning('El motivo de viaje seleccionado no tiene polizas disponibles, por favor seleccione otro motivo','ERROR')
          }
        })
        .catch(function(err){
          mModalAlert.showWarning('Se presento un error de conexión','ERROR')
        })
      }
    }
    // Metodo para llenar el combo de productos dado una poliza
    function getProducts(polizy){
      if(polizy){
        $timeout(function(){
          if(polizy == 6700008){
            vm.formData[1].destino = vm.destinations[1];
          }
          else{
            vm.formData[1].destino = vm.destinations[2];
            getCountries();
          }
        }, 500)
        seguroviajeService.getProducts(polizy, true)
        .then(function(response){
          vm.products = response.data;
          if(vm.products.length == 0){
            mModalAlert.showWarning('La poliza seleccionada no tiene productos disponibles, por favor seleccione una poliza diferente','ERROR')
            vm.formData[1].poliza = ''
          }
        })
        .catch(function(err){
          mModalAlert.showWarning('Se presento un error de conexión','ERROR')
        })
      }
    }
    // Metodo para llenar el combo de paises
    function getCountries(){
      seguroviajeService.getCountries(true)
      .then(function(response){
        vm.countries = _.filter(response.data.countries, function(country){ return country.name != 'PERU' });
      })
      .catch(function(err){
        mModalAlert.showWarning('Se presento un error de conexión','ERROR')
      })
    }
    // Metodo para llenar combos de polizas, productos y paises
    function fillCombosByPolizy(keepProducts){
      vm.getPolicies(vm.formData[1].motivo.code, keepProducts)
      vm.getProducts(vm.formData[1].poliza.code);
    }
    // Metodo para limpiar un objeto segun un arreglo de propiedades definido
    function cleanObjectByProperties(object, properties){
      return seguroviajeFactory.cleanObjectByProperties(object, properties);
    }
    // Metodo que valida el formulario, para compararlo con la copia y guardarlo para el paso siguiente
    function saveForm() {
      $scope.stepTwoForm.markAsPristine();
      if($scope.stepTwoForm.$valid){
        seguroviajeFactory.setNewFormData(vm.formData);
        vm.formData[1].stepTwoFinish = true;
        $state.go('.',{
          step: 3
        });
      }
    }
  }

  return ng.module('appSeguroviaje')
    .controller('SeguroviajeCotizarStepTwoController', SeguroviajeCotizarStepTwoController)
    .component('seguroviajeCotizarStepTwoComponent', {
      templateUrl: '/polizas/app/seguroviaje/cotizar/steps/stepTwo/seguroviaje-cotizar-p2.html',
      controller: 'SeguroviajeCotizarStepTwoController as vm',
      binding: {}
    })
})
