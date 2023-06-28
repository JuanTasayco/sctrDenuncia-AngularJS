define([
  'angular'
], function(angular) {
  var appAlliedPharmacies = angular.module('farmapfre.app');
  appAlliedPharmacies.controller('detailAlliedPharmaciesController',
    ['$scope', 'mModalAlert', '$state', '$stateParams', 'proxyAlliedPharmacy', 'proxyUbigeo',
      function($scope, mModalAlert, $state, $stateParams, proxyAlliedPharmacy, proxyUbigeo) {
        $scope.labelData = 'Habilitado';
        $scope.keyEditPharmacy = false;
        $scope.frm = {};
        $scope.arg = {};
        $scope.noResultInfoPharmacyLocales = true;
        $scope.noResultLocales = false;

        clean = function() {
          $scope.pagination = {
            maxSize: 5,
            sizePerPage: 5,
            currentPage: 1,
            totalRecords: 0
          }
        }

        GetPharmacyInit = function() {
          proxyAlliedPharmacy.GetAlliedPharmacyById($stateParams.pharmacyid).then(function(res) {
            if(res.status === 200 && res.data == null ) {
              $state.go('alliedPharmacies');
            }
            $scope.pharmacy = res;
            $scope.pharmacy.premises = {};

            $scope.search($scope.arg);
          });
        }

        init = function() {
          clean();
          GetPharmacyInit();
        }

        init();

        GetCurrentPharmacy = function() {
          proxyAlliedPharmacy.GetAlliedPharmacyById($stateParams.pharmacyid).then(function(res) {
            $scope.pharmacy = res;
            $scope.pharmacy.premises = {};
          });
        }
        
        $scope.GetDepartments = function() {
          proxyUbigeo.GetDepartments().then(function(res) {
            $scope.departments = res;
          });
        };

        $scope.GetDepartments();

        $scope.changeDepartment = function(local, provinceId) {
          local.provinces = local.districts = [];
          if(provinceId) {
            proxyUbigeo.GetProvinces(provinceId).then(function(res) {
              local.provinces = res;
            });
          }
        };

        $scope.changeProvince = function(local, districtId) {
          local.districts = [];
          if(districtId) {
            proxyUbigeo.GetDistricts(districtId).then(function(res) {
              local.districts = res;
            });
          }
        };

        $scope.editPharmacy = function() {
          $scope.keyEditPharmacy = true;
          $scope.frm = JSON.parse(JSON.stringify($scope.pharmacy));
          $scope.frm.requiredDelivery = true;
          $scope.frm.requiredCollect = true;
        }

        $scope.cancelEditPharmacy = function () {
          $scope.keyEditPharmacy = false;
          $scope.frm = {};
        };

        $scope.changeItsDelivery = function(check) {
          if(check) {
            $scope.frm.requiredCollect = false;
          } else {
            $scope.frm.requiredDelivery = !$scope.frm.itsCollect;
          }
        }

        $scope.changeItsCollect = function(check) {
          if(check) {
            $scope.frm.requiredDelivery = false;
          } else {
            $scope.frm.requiredCollect = !$scope.frm.itsDelivery;
          }
        }

        $scope.editLocal = function (local) {
          local.keyEdit = true;
          local.phoneNumber = String(local.phoneNumber ? local.phoneNumber : '');
          local.frm = JSON.parse(JSON.stringify(local));
          $scope.changeDepartment(local.frm, local.frm.address.department.id);
          $scope.changeProvince(local.frm, local.frm.address.province.id);
        };

        $scope.cancel = function (local) {
          local.keyEdit = false;
          local.frm = {};
        };

        $scope.saveEditPharmacy = function () {
          var request = {
            id: $scope.pharmacy.id,
            description: $scope.frm.description,
            ItsDelivery: $scope.frm.itsDelivery ? true : false,
            ItsCollect: $scope.frm.itsCollect ? true : false,
            Status : $scope.pharmacy.status,
            premises: {}
          };

          proxyAlliedPharmacy.Save(request, true)
            .then(function(res) {
                $scope.keyEditPharmacy = false;
                mModalAlert.showSuccess('Se editó satisfactoriamente.', 'Editar Farmacia Aliada').then(function() { 
                  GetCurrentPharmacy();
                });
              },
              function(err) {
                if(err.status === 500) {
                  showMsgError();
                } else {
                  $scope.keyEditPharmacy = false;
                  mModalAlert.showWarning(err.data.message, 'Editar Farmacia Aliada').then(function() {
                    GetCurrentPharmacy();
                  });
                }
              });
        };

        $scope.enabledPharmacy = function() {
          var collect = $scope.pharmacy.itsCollect ? true : false;
          var request = JSON.parse(JSON.stringify($scope.pharmacy));

          if(!collect) {
            delete request.premises;
          }

          proxyAlliedPharmacy.Save(request, true)
            .then(function(res) {
              $scope.search($scope.arg);
              GetCurrentPharmacy();
            }, function(err) {
              if(err.status === 500) {
                showMsgError();
              } else {
                if($scope.pharmacy.status.enabled) {
                  mModalAlert.showWarning(err.data.message, 'Editar Farmacia Aliada').then(function() { 
                    GetCurrentPharmacy();
                  });
                }
                $scope.search($scope.arg);
              }
            });
        }

        $scope.changeCheckedLocal = function(local) {
          var request = {
            externalProviderCode: $scope.pharmacy.id,
            id: local.id,
            email: local.email,
            phoneNumber: local.phoneNumber,
            status : { enabled: local.status.enabled },
            description: local.description,
            address : {
              description: local.address.description,
              department: local.address.department,
              province: local.address.province,
              district: local.address.district
            }
          };

          proxyAlliedPharmacy.SavePremises(request, true)
            .then(function(res) {
                if(local.status.enabled){
                  local.status.description = 'HABILITADO'
                }else{
                  local.status.description = 'INHABILITADO'
                }
              },
              function(err) {
                showMsgError();
              });
        }

        $scope.search = function(filter) {
          $scope.noResultInfoPharmacyLocales = false;

          $scope.arg.ExternalProviderCode = $scope.pharmacy.id;

          $scope.arg.department = filter.department || {};
          $scope.arg.province = filter.province || {};
          $scope.arg.district = filter.district || {};
          $scope.arg.filter = !filter || undefined || '' || null ? null : filter.filter;
          $scope.arg.department.id = $scope.arg.department.id || (!filter || undefined || '' || null ? null : filter.departamentCode);
          $scope.arg.province.id = $scope.arg.province.id || (!filter || undefined || '' || null ? null : filter.provinceCode);
          $scope.arg.district.id = $scope.arg.district.id || (!filter || undefined || '' || null ? null : filter.districtCode);
          $scope.arg.pageNumber = $scope.pagination.currentPage;
          $scope.arg.pageLength= $scope.pagination.sizePerPage;

          proxyAlliedPharmacy.SearchPremises($scope.arg, true).then(function(response) {
            $scope.locales = response.records;
            $scope.pagination.totalRecords = response.totalRecords;
            $scope.noResultLocales = $scope.pagination.totalRecords == 0 || !$scope.locales ? true : false;
          });
        };

        $scope.addLocal = function() {
          $state.go('createLocales', { pharmacyid: $stateParams.pharmacyid });
        };

        $scope.editSave = function(local) {
          var request = {
            id: local.id,
            externalProviderCode: $scope.pharmacy.id,
            email: local.email,
            phoneNumber: local.phoneNumber,
            status : { enabled: local.status.enabled },
            description: local.description,
            address : {
              description: local.address.description,
              reference: local.address.direccionLocal,
              department: local.address.department,
              province: local.address.province,
              district: local.address.district
            }
          };

          proxyAlliedPharmacy.SavePremises(request, true).then(function(res) {
            proxyAlliedPharmacy.SearchPremises($scope.arg, true).then(function(response) {
              $scope.locales = response.records;
              $scope.pagination.totalRecords = response.totalRecords;
              $scope.noResultLocales = $scope.pagination.totalRecords == 0 || !$scope.locales ? true : false;
            });
          });
        }

        $scope.pageChanged = function() {
          $scope.search($scope.arg, true);
        }

        $scope.cleanSearch = function() {
          clean();
        }

        showMsgError = function() {
          mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', 'Error');
        };
      }])
});