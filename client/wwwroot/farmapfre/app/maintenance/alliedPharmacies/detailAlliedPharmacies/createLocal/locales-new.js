define([
  'angular'
], function(angular) {
  var appLocales = angular.module('farmapfre.app');
  appLocales.controller('createLocalesController',
    ['$scope', 'proxyAlliedPharmacy', 'proxyUbigeo', '$stateParams', '$state','mModalAlert',
      function($scope, proxyAlliedPharmacy, proxyUbigeo, $stateParams, $state, mModalAlert) {
        $scope.frm = {};

        GetPharmacy = function() {
          proxyAlliedPharmacy.GetAlliedPharmacyById($stateParams.pharmacyid).then(function(res) {
            if(res.status === 200 && res.data == null ) {
              $state.go('alliedPharmacies');
            }
            $scope.pharmacy = res;
          });
        }

        GetPharmacy();

        $scope.GetDepartments = function() {
          proxyUbigeo.GetDepartments().then(function(res) {
            $scope.departments = res;
          });
        };

        $scope.GetDepartments();

        $scope.changeDepartment = function(departmentId) {
          $scope.provinces = $scope.districts = [];

          if(departmentId) {
            proxyUbigeo.GetProvinces(departmentId).then(function(res) {
              $scope.provinces = res;
            });
          }
        };

        $scope.changeProvince = function(provinceId) {
          $scope.districts = [];
          if(provinceId) {
            proxyUbigeo.GetDistricts(provinceId).then(function(res) {
              $scope.districts = res;
            });
          }
        };

        $scope.cancel = function() {
          $scope.frm = {};
          $state.go('detailAlliedPharmacies', { pharmacyid: $stateParams.pharmacyid });
        }

        $scope.save = function() {
          var request = {
            externalProviderCode: $stateParams.pharmacyid,
            email: $scope.frm.email,
            phoneNumber: $scope.frm.phoneNumber,
            status : { enabled: $scope.pharmacy.status.enabled },
            description: $scope.frm.description,
            address : {
              description: $scope.frm.addressDescription,
              department: $scope.frm.department,
              province: $scope.frm.province,
              district: $scope.frm.district
            }
          };

          proxyAlliedPharmacy.SavePremises(request, true)
            .then(function(res) {
                mModalAlert.showSuccess('Se guardó satisfactoriamente.', 'Crear Nuevo Local').then(function() { 
                  $scope.cancel(); 
                });
              },
              function(err) {
                if(err.status === 500) {
                  showMsgError();
                } else {
                  mModalAlert.showWarning(err.data.message, 'Editar Farmacia Aliada');
                }
              });
        };

        showMsgError = function() {
          mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', 'Error');
        };
      }])
});