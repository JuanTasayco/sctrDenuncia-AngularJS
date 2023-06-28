'use strict';

define(['angular', 'lodash', 'constants'], function (ng, _, constants) {
  ReCreateCompanyModal.$inject = ['reFactory', '$log', '$http', '$uibModal', '$scope'];

  function ReCreateCompanyModal(reFactory, $log, $http, $uibModal, $scope) {
    var vm = this;
    vm.$onInit = onInit;
    vm.cerrar = cerrar;
    vm.changeDepartment = changeDepartment;
    vm.changeProvince = changeProvince;
    vm.saveCompany = saveCompany;

    function onInit() {
      vm.frmCompany = {
        ruc: vm.ruc
      };

      _getDepartmentList();
    }

    function cerrar() {
      vm.close(void 0);
    }

    function changeDepartment() {
      reFactory.solicitud
        .GetProvinceList(vm.frmCompany.department.departmentCode)
        .then(function (res) {
          vm.provinceList = res.isValid ? res.data : [];
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        });
    }

    function changeProvince() {
      reFactory.solicitud
        .GetDistrictList(vm.frmCompany.department.departmentCode, vm.frmCompany.province.idProvince)
        .then(function (res) {
          vm.districtList = res.isValid ? res.data : [];
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        });
    }

    function saveCompany() {
      if (vm.frmModal.$invalid) {
        vm.frmModal.markAsPristine();
        return void 0;
      }

      var request = {
        rucNumber: vm.frmCompany.ruc,
        rucDescription: vm.frmCompany.razonSocial,
        lastName: vm.frmCompany.lastName || '',
        motherLastName: vm.frmCompany.motherLastName || '',
        firstName: vm.frmCompany.firstName || '',
        secondName: vm.frmCompany.secondName || '',
        address: vm.frmCompany.adress || '',
        departmentCode: vm.frmCompany.department && vm.frmCompany.department.departmentCode ? vm.frmCompany.department.departmentCode : '',
        idProvince: vm.frmCompany.province && vm.frmCompany.province.idProvince ? vm.frmCompany.province.idProvince : '',
        idDistrict: vm.frmCompany.district && vm.frmCompany.district.idDistrict ? vm.frmCompany.district.idDistrict : '',
      }

      reFactory.solicitud
        .SaveCompany(request)
        .then(function (res) {
          vm.close({
            $event: {
              data: ng.copy(vm.frmCompany),
              status: 'ok'
            }
          })
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        })
    }

    // private

    function _getDepartmentList() {
      reFactory.solicitud
        .GetDepartmentList()
        .then(function (res) {
          vm.departmentList = res.isValid ? res.data : [];
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        });
    }

  }

  return ng
    .module('appReembolso')
    .controller('ReCreateCompanyModal', ReCreateCompanyModal)
    .component('reCreateCompanyModal', {
      templateUrl: '/reembolso/app/common/modals/modal-create-company/modal-create-company.html',
      controller: 'ReCreateCompanyModal as $ctrl',
      bindings: {
        close: '&?',
        ruc: '<'
      }
    })
})
