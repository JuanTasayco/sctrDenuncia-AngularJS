'use strict';

define(['angular'], function(ng) {
  ubigeoController.$inject = ['$log', '$scope', 'inspecFactory'];
  function ubigeoController($log, $scope, inspecFactory) {
    var vm = this;
    vm.$onInit = onInit;
    vm.getProvincias = getProvincias;
    vm.getDistritos = getDistritos;

    function onInit() {
      vm.firstLoaded = true;
      inspecFactory.ubigeo.getDepartamentos().then(function(response) {
        vm.departmentsData = response.Data;
      });
      vm.allSelected = !!vm.allSelected;
    }

    function getProvincias(departamento) {
      if (!departamento || departamento.Codigo == null) {
        vm.provincesData = [];
        vm.districtsData = [];
      } else {
        inspecFactory.ubigeo.getProvincias(departamento.Codigo, true).then(function(response) {
          vm.provincesData = response.Data;
        });
      }
    }

    function getDistritos(provincia) {
      if (!provincia || provincia.Codigo == null) {
        vm.districtsData = [];
      } else {
        inspecFactory.ubigeo.getDistritos(provincia.Codigo, true).then(function(response) {
          vm.districtsData = response.Data;
        });
      }
    }

    $scope.$watch(
      function() {
        return vm.data;
      },
      function(newValue, oldValue) {
        if (newValue && 'mDepartamento' in newValue) {
          if (oldValue) {
            if (oldValue && oldValue.mDepartamento && !ng.equals(newValue.mDepartamento, oldValue.mDepartamento)) {
              getProvincias(newValue.mDepartamento);
            }
          }
        }
        if (newValue && 'mProvincia' in newValue) {
          if (oldValue && oldValue.mProvincia && !ng.equals(newValue.mProvincia, oldValue.mProvincia)) {
            getDistritos(newValue.mProvincia);
          }
        }

        if (
          vm.firstLoaded &&
          newValue &&
          'mProvincia' in newValue &&
          'mDistrito' in newValue &&
          'mDepartamento' in newValue
        ) {
          getProvincias(newValue.mDepartamento);
          getDistritos(newValue.mProvincia);
          vm.firstLoaded = false;
        }
      },
      true
    );
  }

  return ng
    .module('appInspec')
    .controller('UbigeoController', ubigeoController)
    .component('inspecUbigeo', {
      templateUrl: '/inspec/app/_app/common/ubigeo/ubigeo.html',
      controller: 'UbigeoController',
      controllerAs: '$ctrl',
      bindings: {
        data: '=',
        disabled: '=?',
        notRequired: '=?',
        fullwidth: '=?',
        allSelected: '=?'
      }
    });
});
