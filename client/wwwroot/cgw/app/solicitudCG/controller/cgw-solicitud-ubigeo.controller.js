define([
  'angular', 'constants',
  '/cgw/app/factory/cgwFactory.js'
], function(ng, constants) {

  cgwSolicitudUbigeoController.$inject = ['$scope', 'cgwFactory', '$rootScope', '$state', 'mModalAlert', '$window', 'oimClaims', '$stateParams', 'stepsService'];

  function cgwSolicitudUbigeoController($scope, cgwFactory, $rootScope, $state, mModalAlert, $window, oimClaims, $stateParams, stepsService) {

    var vm = this;

    $scope.$on('$locationChangeStart',function(evt, absNewUrl, absOldUrl) {
    });

    vm.$onInit = function() {
     if(!_.isEmpty(stepsService.getStep1())) {
        $scope.step1 = stepsService.getStep1();

       (!_.isEmpty($scope.step1.mDeparmento.departmentCode)) ? $scope.loadProvincia($scope.step1.mDeparmento.departmentCode) : 0;
       (!_.isEmpty($scope.step1.mDeparmento.departmentCode) && !_.isEmpty($scope.step1.mProvincia.departmentCode)) ? $scope.loadDistrict($scope.step1.mProvincia.departmentCode, $scope.step1.mProvincia.idProvince) : 0;
        $scope.mDistrito = $scope.step1.mDistrito;
        $scope.mNombre = $scope.step1.mNombre;
        $scope.mApellido = $scope.step1.mApellido;
        $scope.mCelular = $scope.step1.mCelular;
        $scope.mCorreoU = $scope.step1.mCorreoU;
        $scope.mMovilidad = $scope.step1.mMovilidad;

      }
        $scope.formData = $rootScope.formData || {};

      if (typeof $scope.formData.mClinica === 'undefined') {
        // $state.go('.', {step: 1});
        $state.go('solicitudCgw.steps', {step: 1, id: 0});
      }

      //load departamento
      cgwFactory.GetAllDepartment().then(function(response) {
        if (response.data) {
          $scope.deparmentCGW = response.data;
        } else {
          if (!response.isValid) {
            var message = '';
            ng.forEach(response.brokenRulesCollection, function(error) {
              message += error.description + ' ';

            });
            mModalAlert.showError(message, 'Error');
          }
        }
      })
        .catch(function(err){
          mModalAlert.showError(err.data, 'Error');
        });

      //load movilidad
      cgwFactory.GetAllMobility().then(function(response) {
        if (response.data) {
          $scope.mobilityCGW = response.data;
        } else {
          if (!response.isValid) {
            var message = '';
            ng.forEach(response.brokenRulesCollection, function(error) {
              message += error.description + ' ';

            });
            mModalAlert.showError(message, 'Error');
          }
        }

      })
        .catch(function(err){
          mModalAlert.showError(err.data, 'Error');
        });
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

    $scope.loadProvincia = function (departmentCode) {
      if(departmentCode) {
        cgwFactory.GetAllProvinceBy(departmentCode).then(function(response) {
          if (response.data) {
            $scope.provinceCGW = response.data;
          } else {
            if (!response.isValid) {
              var message = '';
              ng.forEach(response.brokenRulesCollection, function(error) {
                message += error.description + ' ';

              });
              mModalAlert.showError(message, 'Error');
            }
          }

        })
      }
    };

    $scope.loadDistrict = function (departmentCode, idProvince) {
      if(departmentCode && idProvince) {
        cgwFactory.GetAllDistrictBy(departmentCode, idProvince).then(function(response) {
          // if (response.operationCode === constants.operationCode.success) {
          if (response.data) {
            $scope.districtCGW = response.data;
          } else {
            if (!response.isValid) {
              var message = '';
              ng.forEach(response.brokenRulesCollection, function(error) {
                message += error.description + ' ';

              });
              mModalAlert.showError(message, 'Error');
            }
          }

        })
      }
    };

    $scope.guardarPaso1 = function() {
      $scope.stepInitial = stepsService.getStep();
      $scope.frmUbigeoCGW.markAsPristine();
      validatePaso1();
    };

    function validatePaso1() {
      stepsService.addStep1($scope);
      switch ($scope.formData.mProducto.productCode){
        case 'O':
          if($scope.frmUbigeoCGW.nDeparmentoU.$valid && $scope.frmUbigeoCGW.nProvinciaU.$valid && $scope.frmUbigeoCGW.nDistritoU.$valid &&
            $scope.frmUbigeoCGW.nNombreU.$valid && $scope.frmUbigeoCGW.nApellidoU.$valid && $scope.frmUbigeoCGW.nCelularU.$valid
            && $scope.frmUbigeoCGW.nCorreoU.$valid){
            if($scope.stepInitial.afiliadoDataSelected.idAffiliate == 0){
            getFullDataAffiliate();
          } else{
              $scope.paso1Guardado = true;
              stepsService.addStep1($scope);
              $state.go('.', {step: 2, id: $stateParams.id});
            }
          } else{
            $scope.paso1Guardado = false;
            mModalAlert.showError("Complete los datos", 'Error');
          }
          break;
        case 'A':
        case 'U':
          if ($scope.frmUbigeoCGW.nNombreU.$valid && $scope.frmUbigeoCGW.nApellidoU.$valid && $scope.frmUbigeoCGW.nCelularU.$valid
            && $scope.frmUbigeoCGW.nCorreoU.$valid){
            stepsService.addStep1($scope);
            getFullDataAffiliate();
          } else {
            $scope.paso1Guardado = false;
            mModalAlert.showError("Complete los datos", 'Error');
          }
          break;
        default:
          break;
      }
    }

    function getFullDataAffiliate(){
      var paramsGetAfiliatte = {
        idAffiliate: $scope.stepInitial.afiliadoDataSelected.idAffiliate,
        lastName: $scope.stepInitial.afiliadoDataSelected.lastName,
        motherLastName: ($scope.stepInitial.afiliadoDataSelected.motherLastName) ? $scope.stepInitial.afiliadoDataSelected.motherLastName : '',
        names: $scope.stepInitial.afiliadoDataSelected.names,
        birthdate: $scope.stepInitial.afiliadoDataSelected.birthdate,
        sex: $scope.stepInitial.afiliadoDataSelected.sex,
        idDocumentType: $scope.stepInitial.afiliadoDataSelected.idDocumentType,
        documentNumber: $scope.stepInitial.afiliadoDataSelected.documentNumber,
        createdBy: $scope.stepInitial.userCreate,
        idCompany: ($scope.stepInitial.afiliadoDataSelected.idCompany === 0) ? $scope.stepInitial.mEmpresaInit.idCompany : $scope.stepInitial.afiliadoDataSelected.idCompany
      };

      //obtener afiliado OIM-4729
      cgwFactory.GetAffiliateBy(paramsGetAfiliatte).then(function(response) {
        if (response.data) {
          $scope.getFullDataAffiliate = response.data;
          $scope.paso1Guardado = true;
          stepsService.addStep1($scope);
          $state.go('.', {step: 2, id: $stateParams.id});
        } else {
          if (!response.isValid) {
            var message = '';
            ng.forEach(response.brokenRulesCollection, function(error) {
              message += error.description + ' ';

            });
            // mModalAlert.showError(response.brokenRulesCollection[0].description, 'Error');
            mModalAlert.showError(message, 'Error');
          }
        }
      })
        .catch(function(err){
          mModalAlert.showError(err.data, 'Error');
        });
    }

  } //  end controller

  function startFromGrid() {
    return function(input, start) {
      if (!input || !input.length) { return; }
      start = +start; //parse to int
      return input.slice(start);
    }
  }

  return ng.module('appCgw')
    .controller('CgwSolicitudUbigeoController', cgwSolicitudUbigeoController)
    .filter('startFromGrid', startFromGrid)
});
