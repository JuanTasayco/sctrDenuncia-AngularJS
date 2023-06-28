(function($root, name, deps, action) {
  $root.define(name, deps, action)
})(window, "alliedpharmaciesItemMaintenanceComponent", ['angular'], function(ng) {
  ng.module('farmapfre.app')
  .controller('alliedpharmaciesItemMaintenanceComponentController',
    ['$scope', 'proxyAlliedPharmacy', 'proxyUbigeo', 'mModalAlert', 'mModalConfirm', '$state', '$timeout',
      function($scope, proxyAlliedPharmacy, proxyUbigeo, mModalAlert, mModalConfirm, $state, $timeout) {
        var vm = this;
        vm.frm = {};
        vm.frm.premises = {};
        vm.frm.requiredDelivery = true;
        vm.frm.requiredCollect = true;

        vm.changeItsDelivery = function(check) {
          if(check) {
            vm.frm.requiredCollect = false;
          } else {
            if(!vm.frm.itsDelivery && !vm.frm.itsCollect) {
              vm.frm.requiredCollect = true;
            }
          }
        }

        vm.changeItsCollect = function(check) {
          if(check) {
            vm.frm.requiredDelivery = false;
          } else {
            vm.frm.premises = {};
            vm.provinces = vm.districts = [];

            if(!vm.frm.itsDelivery && !vm.frm.itsCollect) {
              vm.frm.requiredDelivery = true;
            }
          }
        }

        vm.GetDepartments = function() {
          proxyUbigeo.GetDepartments().then(function(res) {
            vm.departments = res;
          });
        }

        vm.GetDepartments();

        vm.changeDepartment = function(departmentId) {
          vm.provinces = vm.districts = [];
          if(departmentId) {
            proxyUbigeo.GetProvinces(departmentId).then(function(res) {
              vm.provinces = res;
            });
          }
        };

        vm.changeProvince = function(provinceId) {
          vm.districts = [];
          if(provinceId) {
            proxyUbigeo.GetDistricts(provinceId).then(function(res) {
              vm.districts = res;
            });
          }
        };

        vm.save = function() {
          var itsDel = vm.frm.itsDelivery ? true : false;
          var itsRec = vm.frm.itsCollect ? true : false;

          var request = {
            description: vm.frm.name,
            itsDelivery: itsDel,
            itsCollect: itsRec,
            status : { enabled: true },
            premises : {
              description: vm.frm.premises.name,
              email: vm.frm.premises.email,
              phoneNumber: vm.frm.premises.phone,
              status : {
                enabled: true
              },
              address : {
                description: vm.frm.premises.addressDescription,
                department: vm.frm.premises.department,
                province: vm.frm.premises.province,
                district: vm.frm.premises.district
              }
            }
          };

          var request2 = {
            description: vm.frm.name,
            itsDelivery: itsDel,
            itsCollect: itsRec,
            status : { enabled: true }
          };

          if(itsDel && !itsRec) {
            request = request2;
          }

          proxyAlliedPharmacy.Save(request, true)
            .then(function(res) {
              mModalAlert.showSuccess('Se guardó satisfactoriamente.', 'Guardar Farmacia Aliada').then(function() { 
                $state.go('detailAlliedPharmacies', { pharmacyid: res });
              });
              },
              function(err) {
                if(err.status === 500) {
                  showMsgError();
                } else {
                  mModalAlert.showWarning(err.data.message, 'Guardar Farmacia Aliada');
                }
              });
        }

        vm.cancel = function() {
          vm.frm = {};
          $state.go("alliedPharmacies");
        }

        showMsgError = function() {
          mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', 'Error');
        };
      }])
  .component("alliedpharmaciesItemMaintenance", {
    templateUrl: "/farmapfre/app/maintenance/alliedPharmacies/components/alliedpharmacies-item-maintenance-component.html",
    controller: "alliedpharmaciesItemMaintenanceComponentController",
    bindings: {
      onRefresh: '&'
    }
  })
});