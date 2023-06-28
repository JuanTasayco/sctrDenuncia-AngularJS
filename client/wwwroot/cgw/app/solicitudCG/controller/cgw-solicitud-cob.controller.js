define([
 'angular', 'constants', '/cgw/app/factory/cgwFactory.js'
], function(angular, constants) {

  cgwSolicitudCobController.$inject = ['$scope', '$stateParams', '$rootScope', 'mModalAlert', 'cgwFactory', '$q', '$state', 'stepsService', '$timeout', '$uibModal'];

  function cgwSolicitudCobController($scope, $stateParams, $rootScope, mModalAlert, cgwFactory, $q, $state, stepsService, $timeout, $uibModal) {
    var vm = this;
    $scope.filesCgw = [];
    var byte = 1000;
    var kb = 5120;
    var maxKbSize = kb * byte;

    $scope.$on('$locationChangeStart',function(evt, absNewUrl, absOldUrl) {
      $scope.step2 = stepsService.getStep2();
      if(!$scope.step2.paso2Guardado) {
        $state.go('.', {step: (absOldUrl.substr(absOldUrl.length - 3)).charAt(0), id: $stateParams.id}, {reload: false, inherit: false});
      }
    });

    vm.$onInit = function() {
      $scope.stepInitial = stepsService.getStep();

      if (typeof $scope.stepInitial.mClinica === 'undefined') {
        // $state.go('.', {step: 1});
        $state.go('solicitudCgw.steps', {step: 1, id: 0});
      }

      getValueIGV();

      if(!_.isEmpty(stepsService.getStep3())){
          $scope.mEmail = stepsService.getStep3().mEmail;
          $scope.mCelular = stepsService.getStep3().mCelular;
          $scope.mPresupuesto = stepsService.getStep3().mPresupuesto;
          $scope.files = stepsService.getStep3().files;
          $scope.myFile = stepsService.getStep3().myFile;
          $scope.procedimientos = stepsService.getStep4().step3.procedimientos;
          $scope.subtotal = stepsService.getStep3().subtotal;
      }
       getBudget();

    };

    $scope.isAAPP = function () {
      return ($stateParams.id) === 'A';
    };

    $scope.isSOAT = function () {
      return ($stateParams.id) === 'O';
    };

    $scope.isAutos = function () {
      return ($stateParams.id) === 'U';
    };

    function getBudget() {
      $scope.sucursalKey = cgwFactory.getVariableSession('sucursal');
      if($scope.stepInitial.mProducto.productCode !== 'S' && $scope.stepInitial.mProducto.productCode !== 'R') {
        if (!$scope.stepInitial.mClinica.code) {
          $scope.sucursalKey = cgwFactory.getVariableSession('sucursal');
          if ($scope.sucursalKey.providerName) {
            $scope.stepInitial.mClinica.code = $scope.sucursalKey.providerName;
            $scope.mClinica.code = $scope.stepInitial.mClinica.code;
            $scope.stepInitial.mClinica.providerCode = parseInt($scope.sucursalKey.providerCode);
            $scope.mClinica.providerCode = $scope.stepInitial.mClinica.providerCode;
          }
        }
      }

      var paramsBudget = {
        CodeProvider: $scope.mClinica.code,
        Flag: 1,
        CodeCompany: $scope.stepInitial.mEmpresaInit.idCompany,
        ProductCode: $scope.stepInitial.mProducto.productCode
      };

      cgwFactory.getListBudgets(paramsBudget, true).then(function(response) {
        if(response.data){
          if (response.data.items.length>0) {
            $scope.procedimientos = response.data.items;
            $scope.validAmountMinsa().then(function(){
              $scope.getSubtotal();
            });
          }
        }
      }, function(error) {
        mModalAlert.showError('Al cargar el presupuesto', 'Error');
      });
    }

    $scope.validAmountMinsa = function(){
      var deferred = $q.defer();
      deferred.resolve(searchBudgetsMinsa());
      return deferred.promise;
    };

    function searchBudgetsMinsa(){
      if($scope.stepInitial.flagIsMinsa === 1 && $scope.stepInitial.mEmpresaInit.idCompany === 1 && $scope.stepInitial.mProducto.productCode === 'O'){
        angular.forEach($scope.procedimientos, function(value,key) {
          if($scope.procedimientos[key].code === "9"){
            $scope.procedimientos[key].price = $scope.step2.mAmountUITMinsa;
            angular.forEach($scope.procedimientos[key].details, function(value2, key2){
              if($scope.procedimientos[key].details[key2].codeDetail === "39"){
                var arrayObject = $scope.procedimientos[key].details[key2];
                Object.assign(arrayObject, {price: $scope.step2.mAmountUITMinsa});
              }
            });           
          }
        });
      }
    };

    $scope.cargarPresupuesto = function cpFn(codProcedimiento) {
      $scope.procedimientos.every(function(value,key) {
        if ($scope.procedimientos[key].code === codProcedimiento) {
          $scope.detalleProcedimiento = $scope.procedimientos[key];
          return false;
        } else {return true;}
      });

      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        windowTopClass: 'modal--500 modal--budget fade',
        template: '<mpf-modal-presupuesto data="data" close="close()" grabar="grabar()"></mpf-modal-presupuesto>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };
          scope.grabar = function() {
            $timeout(function() {
              $scope.getSubtotal();
            }, 500);

            $uibModalInstance.close();
          };
          scope.data = {
            lista: $scope.detalleProcedimiento
          };
        }]
      });
    };

    $scope.getSubtotal = function() {
      $scope.subtotal = 0;

      angular.forEach($scope.procedimientos, function(value,key) {
        $scope.subtotal += $scope.procedimientos[key].price;
      });
    };


    $scope.update = function (mount, code) {
      angular.forEach($scope.coberturasPowerEPS, function(value,key) {
        if (value.code === code) {
          value.mount = mount;
        }
      });
    };

    $scope.guardarPaso3 = function() {
      $scope.frmSolicitudCgwPowerEPS2.markAsPristine();
      validatePaso3();
    };

    function validatePaso3() {
      if($scope.frmSolicitudCgwPowerEPS2.nEmail.$valid && $scope.frmSolicitudCgwPowerEPS2.nCelular.$valid  && $scope.myFile &&
        !(typeof $scope.filesCgw === 'undefined')){

          validateSubTotal().then(function(response){
            if(response.boolReturn === false){ 
              fixAomountsMinsa(response.amountDiference).then(function(){
        stepsService.addStep3($scope);
        $scope.saveInitData = true;
        $scope.paso3Guardado = true;
        $state.go('.', {step: 4, id: $scope.stepInitial.mProducto.productCode});
              });
            }
            else{
              stepsService.addStep3($scope);
              $scope.saveInitData = true;
              $scope.paso3Guardado = true;
              $state.go('.', {step: 4, id: $scope.stepInitial.mProducto.productCode});
            }
          }); 
           
      } else{
        $scope.saveInitData = false;
        $scope.paso3Guardado = false;
        $scope.sinArchivos = true;
        mModalAlert.showError("Complete los datos", 'Error');
      }
    }

    function validateSubTotal(){
      var deferred = $q.defer(); 
      var validAmount = []; 

      if($scope.stepInitial.flagIsMinsa === 1 && $scope.stepInitial.mEmpresaInit.idCompany === 1 && $scope.stepInitial.mProducto.productCode === 'O'){
        if($scope.subtotal < $scope.step2.mAmountUITMinsa){
          validAmount.amountDiference = (parseFloat($scope.step2.mAmountUITMinsa) - parseFloat($scope.subtotal));
          validAmount.boolReturn = false;
          deferred.resolve(validAmount);
        }
        else{
          validAmount.boolReturn = true;
          deferred.resolve(validAmount);
        }
      }
      else{
        validAmount.boolReturn = true;
        deferred.resolve(validAmount);
      }

      return deferred.promise;
    }

    function fixAomountsMinsa(amountDiference){
      //Asigna la diferencia para llegar al Monto tipo de Atención 
      //tanto para el cobertura "OTROS" y el rubro "ATENCION COSTOS FIJOS"
      var deferred = $q.defer();
      angular.forEach($scope.procedimientos, function(value,key) {
        if($scope.procedimientos[key].code === "9"){
          $scope.procedimientos[key].price = (parseFloat($scope.procedimientos[key].price) + parseFloat(amountDiference));   
          angular.forEach($scope.procedimientos[key].details, function(value, key2){
            if($scope.procedimientos[key].details[key2].codeDetail === "39"){
              $scope.procedimientos[key].details[key2].price = (parseFloat($scope.procedimientos[key].details[key2].price) + parseFloat(amountDiference));
            }
          });        
        }
      });
      deferred.resolve($scope.getSubtotal()); 

      return deferred.promise;
    }


    $scope.$watch('myFile', function(nv) {
      if (!(typeof nv === 'undefined')) {
        angular.forEach(nv, function(value,key) {
          if (value.size > maxKbSize) {
            mModalAlert.showError('El archivo [' + value.name + '] excede el tamaño máximo de ' + kb + ' kb.' , 'Error');
            return void 0;
          }
          $scope.filesCgw.push(value);
          var reader = new FileReader();
          reader.readAsDataURL($scope.myFile[key]);
          reader.onload = function () {
          };
          reader.onerror = function (error) {
            console.log('Error: ', error);
          };
        });
      }

    });

    $scope.deleteFile = function(index, array) {
      var filesBkp = [];

      angular.forEach(array, function(value,key) {
        if (key !== index) {
          filesBkp.push(array[key]);
        }
      });

      $scope.filesCgw = filesBkp;
    }

    function getValueIGV() {
      var paramsValueIGV = {
        CodeCompany: parseInt($scope.stepInitial.mEmpresaInit.idCompany),
        Date: new Date()
      };

      cgwFactory.getValueIGV(paramsValueIGV, true).then(function(response) {
        $scope.valorIGV = response.data.igv;
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

  } //  end controller

  return angular.module('appCgw')
    .controller('CgwSolicitudCobController', cgwSolicitudCobController);
});
