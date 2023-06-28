define([
  'angular', 'constants',
  '/cgw/app/solicitudCG/service/solicitudCgwFactory.js',
  '/cgw/app/factory/cgwFactory.js',
  'mfSummary'
], function(ng, constants) {

  cgwSolicitudDiagController.$inject = ['$scope', '$stateParams', 'solicitudCgwFactory', '$rootScope', '$state', 'mModalAlert', '$q', 'stepsService', 'cgwFactory', '$timeout'];

  function cgwSolicitudDiagController($scope, $stateParams, solicitudCgwFactory, $rootScope, $state, mModalAlert, $q, stepsService, cgwFactory, $timeout) {

    var vm = this;
    $scope.formData = $rootScope.formData || {};

    var paramsUIT = {
      Cia: 1,
      ProductCode: $scope.formData.mProducto.productCode,
      AccidentDate: $scope.formData.mFechaAccidente
    } 

    $scope.$on('$locationChangeStart',function(evt, absNewUrl, absOldUrl) {
      $scope.step1 = stepsService.getStep1();
      if(!$scope.step1.paso1Guardado) {
        $state.go('.', {step: (absOldUrl.substr(absOldUrl.length - 3)).charAt(0), id: $stateParams.id}, {reload: false, inherit: false});
      }
    });

    $scope.$watch("mUitValueMinsa", function(o, n){
      if (o!=n){
        $scope.callAmountAttentionType();
      }
    });

    vm.$onInit = function() {
      if (typeof $scope.formData.mClinica === 'undefined') {
        // $state.go('.', {step: 1});
        $state.go('solicitudCgw.steps', {step: 1, id: 0});
      }
      $scope.isVisibleInput = true;
      if(!_.isEmpty(stepsService.getStep2())){
        $scope.diagnosticoPowerEPS = stepsService.getStep2().diagnosticoPowerEPS;
        $scope.formData.mMedicoTratante = stepsService.getStep2().formData.mMedicoTratante;
        $scope.mTipoAtencion = stepsService.getStep2().mTipoAtencion;
        $scope.mDiasHospitalizacion = stepsService.getStep2().formData.mDiasHospitalizacion;
        $scope.mObservacionesPowerEPS = stepsService.getStep2().mObservacionesPowerEPS;
        $scope.mUITValueMinsa = stepsService.getStep2().mUITValueMinsa;
        $scope.mAmountUITMinsa = stepsService.getStep2().mAmountUITMinsa;
      }
      solicitudCgwFactory.getListMedicalCare({}, true).then(function(response) {
        var items = response.data.items;
        if (items.length > 0) {
          $scope.listaTipoAtencion = items;
          
          if ($scope.step1.formData.flagIsMinsa === 1 && $scope.step1.formData.mEmpresaInit.idCompany === 1 && $scope.step1.formData.mProducto.productCode === 'O') { 
            $scope.PercentCoverageLoad(); 
          }

        }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    $scope.PercentCoverageLoad = function(){ 
      cgwFactory.Resource_CoverageMinsa_GetList().then(function (response) {
        $scope.mPercentCoverMinsa = response.data.items;
        $scope.CoverageMinsaLoad();
      }).catch(function (exc) {
      });
    };
    
    $scope.CoverageMinsaLoad = function(){
      solicitudCgwFactory.getValueUITMinsa(paramsUIT, true).then(function (response){
        $scope.mUitValueMinsa = response.data.uitValue;
      }).catch(function (exc){
      });
    };

    $scope.mostrarInputMedico = function mimFn() {
      if (ng.isUndefined($scope.formData.mMedicoTratante)) {
        $scope.formData.mMedicoTratante = '';
      }
      $scope.isVisibleInput = !$scope.isVisibleInput;
      return $scope.isVisibleInput;
    };

    $scope.getListDoctor = function(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var paramDoctor = {
          fName: wilcar.toUpperCase()
        };

        var defer = $q.defer();
        solicitudCgwFactory.getListDoctor(paramDoctor, false).then(function(response) {
          defer.resolve(response.data.items);
        }, function(error) {
          mModalAlert.showError(error.data.message, 'Error');
        });

        return defer.promise;
      }
    };

    $scope.guardarPaso2 = function() {
      $scope.frmSolicitudCgwPowerEPS_2.markAsPristine();
      validatePaso2();
    };

    function validatePaso2() {
      if($scope.frmSolicitudCgwPowerEPS_2.nCodDiagnosticoPowerEPS.$valid && $scope.frmSolicitudCgwPowerEPS_2.nMedicoTratante.$valid && $scope.frmSolicitudCgwPowerEPS_2.nObservacionesPowerEPS.$valid &&
        $scope.frmSolicitudCgwPowerEPS_2.nTipoAtencion.$valid && $scope.frmSolicitudCgwPowerEPS_2.nDiasHospitalizacion.$valid
        && $scope.formData.mResonanciaMagnetica){
        stepsService.addStep2($scope);
        $scope.saveInitData = true;
        $scope.paso2Guardado = true;
        $state.go('.', {step: 3, id: $stateParams.id});
      } else{
        $scope.saveInitData = false;
        $scope.paso2Guardado = false;
        mModalAlert.showError("Complete los datos", 'Error');
      }
    }

    $scope.getListDiagnosticPowerEPS = function(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var paramDiagnostic = {
          diagnosticName: wilcar.toUpperCase()
        };

        var defer = $q.defer();
        solicitudCgwFactory.getListDiagnostic(paramDiagnostic, false).then(function(response) {
          defer.resolve(response.data.items);
        }, function(error) {
          mModalAlert.showError(error.data.message, 'Error');
        });

        return defer.promise;
      }
    };

    $scope.$watch('formData', function(nv) {
      $rootScope.formData = nv;
    });

    $scope.callAmountAttentionType = function() {
      var codeAT = $scope.mTipoAtencion.code;
      $scope.mAmountUITMinsa = '';

      angular.forEach($scope.mPercentCoverMinsa, function(value, key){
        if($scope.mPercentCoverMinsa[key].codeAttentionType == codeAT){
          $scope.mAmountUITMinsa = parseFloat($scope.mUitValueMinsa) * parseFloat($scope.mPercentCoverMinsa[key].percentCover);
        }
      });
    }; 

  } //  end controller

  function startFromGrid() {
      return function(input, start) {
        if (!input || !input.length) { return; }
        start = +start; //parse to int
        return input.slice(start);
      }
    }

  return ng.module('appCgw')
    .controller('CgwSolicitudDiagController', cgwSolicitudDiagController)
    .filter('startFromGrid', startFromGrid)
});
