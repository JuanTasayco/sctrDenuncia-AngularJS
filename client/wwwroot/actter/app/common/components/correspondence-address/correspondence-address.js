define(['angular', 'system', 'generalConstant', 'actterFactory'], function (angular, system, generalConstant) {
  correspondenceAddressController.$inject = ['$scope', 'actterFactory', 'mpSpin'];
  function correspondenceAddressController($scope, actterFactory, mpSpin) {
    var vm = this;
    
    vm.getDepartament = getDepartament;
    vm.getProvinces = getProvinces;
    vm.getDistrict = getDistrict;

    vm.countryParam = {
      codPais: 0
    };

    this.$onInit = function () {
      if (vm.form.pais) {
        vm.countryParam.codPais = vm.form.pais.codigo;
        getDepartament(vm.form.pais.codigo, false)
      };
      if (vm.form.departamento) getProvinces(vm.form.departamento.codigo, false);
      if (vm.form.provincia) getDistrict(vm.form.provincia.codigo, false);
    }

    function getDepartament(idCountry, change) {
      if (!idCountry) return;
      vm.countryParam.codPais = idCountry
      if (change) {
        vm.form.departamento = null;
        vm.form.provincia = null;
        vm.form.distrito = null;
      }
      actterFactory.ubigeo.getDepartament(vm.countryParam)
        .then(function (response) {
          vm.departaments = actterFactory.ubigeo.mapUbigeo(response.Data);
        }).catch(function (error) {
          console.error(error);
        })
    }

    function getProvinces(idDepartment, change) {
      if (!idDepartment) return;
      if (change) {
        vm.form.provincia = null;
        vm.form.distrito = null;
      }
      actterFactory.ubigeo.getProvinces(idDepartment, vm.countryParam)
        .then(function (response) {
          vm.provinces = actterFactory.ubigeo.mapUbigeo(response.Data);
        }).catch(function (error) {
          console.error(error);
        })
    }

    function getDistrict(idProvince, change) {
      if (!idProvince) return;
      if (change) vm.form.distrito = null;
      actterFactory.ubigeo.getDistrict(idProvince, vm.countryParam)
        .then(function (response) {
          vm.district = actterFactory.ubigeo.mapUbigeo(response.Data);
        }).catch(function (error) {
          console.error(error);
        })
    }
  }

  return angular
    .module(generalConstant.APP_MODULE)
    .controller('correspondenceAddressController', correspondenceAddressController)
    .component('correspondenceAddress', {
      templateUrl: system.apps.actter.location + '/app/common/components/correspondence-address/correspondence-address.html',
      controller: 'correspondenceAddressController as vm',
      bindings: {
        form: '=',
        paramsForm: '=',
        countries: '='
      }
    });
});