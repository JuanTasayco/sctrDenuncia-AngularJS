define([
  'angular', 'constants', '/cgw/app/factory/cgwFactory.js'
], function(ng, constants) {

  ModalEditarBeneficioController.$inject = ['$scope', '$timeout', '$log', 'cgwFactory', '$state', 'mModalAlert', '$q'];

  function ModalEditarBeneficioController($scope, $timeout, log, cgwFactory, $state, mModalAlert, $q) {
    var vm = this;

    vm.$onInit = function() {

      if (constants.environment === 'QA'){
        $scope.statusLetter = constants.module.cgw.statusLetter.QA;
       } else  if (constants.environment === 'DEV'){
        $scope.statusLetter = constants.module.cgw.statusLetter.DEV;
      } else {
        $scope.statusLetter = constants.module.cgw.statusLetter.PROD;
      }

      vm.message = false;
      vm.dataBkp = ng.copy(vm.data);
      vm.dataBkp.typeAttention2 =
      {
        code: vm.dataBkp.typeAttention
      };

      vm.data.userForced = vm.dataBkp.userForced;

      if (vm.data.userForced === 0 || vm.data.userForced == null)
        vm.data.userForced = null;

      vm.dataBkp.userForced = {
        code: vm.data.userForced
      };

      vm.dataBkp.cobertura = {
        code : vm.dataBkp.benefitCode,
        typeCoverage : vm.dataBkp.benefit
      };

      vm.model2 = vm.carta.CodeBeneficio + ' ' + vm.carta.Beneficio;
    };

    vm.guardar = function() {

      var paramsBeneficioUpdate = {
        providerRucNumber: vm.data.providerRucNumber,
        CodeCompany: vm.carta.CodeCompany,
        Year: parseInt(vm.carta.Year),
        Number: parseInt(vm.carta.Number),
        Version: parseInt(vm.carta.Version),
        FixedCopayment: vm.dataBkp.fixedCopayment,
        VariableCopayment: vm.dataBkp.variableCopayment,
        DeductibleAmount: vm.dataBkp.percentageCoverage,
        TypeAttention: vm.dataBkp.typeAttention2.code,
        BeneficiaryCode: vm.dataBkp.cobertura2.code,//vm.dataBkp.benefit.code,
        DaysOfHospitalization: vm.dataBkp.daysOfHospitalization,
        AuthorizationDetail: vm.dataBkp.authorizationDetail, // MAX 60 DIGITOS
        MagneticResonanceIndicator: vm.dataBkp.magneticResonance,
        UserUpdate: (vm.dataBkp.userForced.code == null) ? 99 : parseInt(vm.dataBkp.userForced.code)//
      };

      vm.carta.userForced = vm.dataBkp.userForced.code;

      cgwFactory.updateBeneficio(paramsBeneficioUpdate).then(function (response) {
        if (response.data) {
          vm.message = true;
          vm.carta.UserForced = (vm.dataBkp.userForced.code == null) ? 99 : parseInt(vm.dataBkp.userForced.code);
          vm.carta.percentageCoverage = vm.dataBkp.percentageCoverage;
          vm.carta.typeAttention = vm.dataBkp.typeAttention2.code;
        }
      }, function(error){
        mModalAlert.showError("Error en getListMedicalCare", 'Error');
      });
    };

    vm.updateDays = function(){
      vm.dataBkp.daysOfHospitalization = 0;
    };

    cgwFactory.getListMedicalCare({}, true).then(function(response) {
      var items = response.data.items;
      if (items.length > 0) {
        $scope.listaTipoAtencion = items;
        vm.data.typeAttention2 = vm.dataBkp.typeAttention;
      }
     }, function(error){
      mModalAlert.showError("Error en getListMedicalCare", 'Error');
    });

    cgwFactory.getListUserForced({}, true).then(function(response) {
      var items = response.data.items;
      if (items.length > 0) {
        $scope.listaUsuarioForzado = items;
        vm.data.userForced = {
          code: vm.data.userForced
        }
      }
    }, function(error){
      mModalAlert.showError("Error en getListUserForced", 'Error');
    });

    cgwFactory.getCurrency(true).then(function(response) {
        if (response.data) {
          $scope.mDeducibleForzado = response.data;
        }
      }, function(error){
        mModalAlert.showError("Error en getCurrency", 'Error');
      });

    vm.reload = function(){
      $state.reload();
    };

    vm.enabledDeducible = function(){
      return (vm.dataBkp.stateId === $scope.statusLetter.aprobado.code || vm.dataBkp.stateId === $scope.statusLetter.procesada.code ||
        vm.dataBkp.stateId === $scope.statusLetter.liquidado.code || vm.dataBkp.stateId === $scope.statusLetter.observada.code);
    };

    vm.getListBeneficio = function(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var paramBeneficio = {
          Name : wilcar.toUpperCase(),
          Sex : vm.carta.Sexo
        };

        var defer = $q.defer();
        cgwFactory.getAutocompleteDiagnostic(paramBeneficio).then(function(response) {
          defer.resolve(response.data.items);
        }, function(error){
          mModalAlert.showError(error.data.message, 'Error');
        });

        return defer.promise;
      }
    };

    vm.updateCobertura = function(){
      vm.dataBkp.fixedCopayment = vm.dataBkp.cobertura2.copaymentFixed;
      vm.dataBkp.variableCopayment = vm.dataBkp.cobertura2.copaymentVariable;
      vm.dataBkp.percentageCoverage = vm.dataBkp.cobertura2.pcbnfco;

      vm.model2 = vm.dataBkp.cobertura2.code + ' ' + vm.dataBkp.cobertura2.typeCoverage;
    };

  } // end controller

  return ng.module('appCgw')
    .controller('ModalEditarBeneficioController', ModalEditarBeneficioController)
    .component('mfpModalEditarBeneficio', {
      templateUrl: '/cgw/app/consultaCG/component/modalEditarBeneficio/modalEditarBeneficio.html',
      controller: 'ModalEditarBeneficioController',
      bindings: {
        close: '&?',
        data: '=?',
        carta: '=?'
      }
    })
    .directive('preventDefault', function() {
      return function(scope, element, attrs) {
          angular.element(element).bind('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
          });
      }
    });
});
