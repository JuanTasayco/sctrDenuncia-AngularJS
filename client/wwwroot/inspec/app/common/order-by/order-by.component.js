'use strict';

define(['angular'], function(ng) {
  orderByController.$inject = ['$rootScope', '$scope'];

  function orderByController($rootScope, $scope) {
    var vm = this;

    vm.$onInit = onInit;
    vm.onChangeOrderBy = onChangeOrderBy;

    function onInit() {
      vm.orderByData = [{Descripcion: 'Más reciente', Codigo: '1'}, {Descripcion: 'Más antiguo', Codigo: '0'}];
    }

    function onChangeOrderBy() {
      vm.pagination.currentPage = 1;
      vm.pagination.mOrderBy = vm.mOrderBy;
      $rootScope.$broadcast('callFilterFromChildren');
    }

    $scope.$on('resetOrderBy', function() {
      vm.pagination.mOrderBy = vm.orderByData[0];
      vm.mOrderBy = vm.orderByData[0];
    });
  }

  return ng
    .module('appInspec')
    .controller('OrderByController', orderByController)
    .component('inspecOrderBy', {
      templateUrl: '/inspec/app/common/order-by/order-by.html',
      controller: 'OrderByController',
      controllerAs: '$ctrl',
      bindings: {
        totalItems: '=',
        pagination: '='
      }
    });
});
