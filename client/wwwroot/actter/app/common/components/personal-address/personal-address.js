define(['angular', 'system', 'generalConstant', 'actterFactory'], function (angular, system, generalConstant) {
  personalAddressController.$inject = ['$scope', 'actterFactory'];
  function personalAddressController($scope, actterFactory) {
    var vm = this;

    vm.getDepartament = getDepartament;
    vm.getProvinces = getProvinces;
    vm.getDistrict = getDistrict;
    vm.hideFieldsForm = hideFieldsForm;
    vm.requiredFieldsForm = requiredFieldsForm;

    vm.fields = generalConstant.FIELDS_PERSONAL_ADDRESS;
    vm.hideFields = vm.hideForm;
    vm.notRequiredFields = vm.notRequiredFields;
    vm.countryParam = {
      codPais: 0
    };


    this.$onInit = function () {
      if (vm.form.ubigeo.pais) {
        vm.countryParam.codPais = vm.form.ubigeo.pais.codigo;
        vm.getDepartament(vm.form.ubigeo.pais.codigo, false)
      };
      if (vm.form.ubigeo.departamento) vm.getProvinces(vm.form.ubigeo.departamento.codigo, false);
      if (vm.form.ubigeo.provincia) vm.getDistrict(vm.form.ubigeo.provincia.codigo, false);
    }

    function getDepartament(idCountry, change) {
      if (!idCountry) return;
      vm.countryParam.codPais = idCountry
      if (change) {
        vm.form.ubigeo.departamento = null;
        vm.form.ubigeo.provincia = null;
        vm.form.ubigeo.distrito = null;
      }
      actterFactory.ubigeo.getDepartament(vm.countryParam)
        .then(function (response) {
          vm.departaments = actterFactory.ubigeo.mapUbigeo(response.Data);
        }).catch(function (error) {
          console.log(error);
        })
    }

    function getProvinces(idDepartment, change) {
      if (!idDepartment) return;
      if (change) {
        vm.form.ubigeo.provincia = null;
        vm.form.ubigeo.distrito = null;
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
      if (change) vm.form.ubigeo.distrito = null;
      actterFactory.ubigeo.getDistrict(idProvince, vm.countryParam)
        .then(function (response) {
          vm.district = actterFactory.ubigeo.mapUbigeo(response.Data);
        }).catch(function (error) {
          console.error(error);
        })
    }

    function hideFieldsForm(control) {
      return _.find(vm.hideFields, function (field) {
        return control == field;
      })
    }

    function requiredFieldsForm(control) {
      return _.find(vm.notRequiredFields, function (field) {
        return control == field;
      })
    }
  }

  return angular
    .module(generalConstant.APP_MODULE)
    .controller('personalAddressController', personalAddressController)
    .component('personalAddress', {
      templateUrl: system.apps.actter.location + '/app/common/components/personal-address/personal-address.html',
      controller: 'personalAddressController as vm',
      bindings: {
        form: '=',
        paramsForm: '=',
        countries: '=',
        hideForm: '=',
        notRequiredFields: "="
      }
    });
});