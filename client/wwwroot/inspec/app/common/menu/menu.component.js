'use strict';

define(['angular'], function(ng) {
  MenuController.$inject = ['inspecFactory', '$scope', '$state', '$stateParams'];

  function MenuController(inspecFactory, $scope, $state, $stateParams) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      vm.menuInspecciones = inspecFactory.getCurrentMenu();
      if (vm.menuInspecciones.length < 7) {
        vm.showMoreFlag = false;
        vm.limiteMenus = 6;
      } else {
        vm.showMoreFlag = true;
        vm.limiteMenus = 5;
      }
      _searchCurrentActive();
    }

    function _searchCurrentActive() {
      if ($stateParams.fromProgram) {
        $state.current.activeMenu = 'programaciones';
      }
      _.map(vm.menuInspecciones, function(menu) {
        menu.actived = menu.state === $state.current.activeMenu;
        return menu;
      });
    }

    $scope.$on('$stateChangeSuccess', function() {
      _searchCurrentActive();
    });
  }

  return ng
    .module('appInspec')
    .controller('MenuController', MenuController)
    .component('inspecMenu', {
      templateUrl: '/inspec/app/common/menu/menu.html',
      controller: 'MenuController',
      controllerAs: '$ctrl'
    });
});
