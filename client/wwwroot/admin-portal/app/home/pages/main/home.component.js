'use strict';

define([
  'angular',
  'lodash',
  'coreConstants'
], function(ng, _, coreConstants) {
  HomeComponent.$inject = ['menu', '$state'];
  function HomeComponent(menu, $state) {
    var vm = this;
    vm.$onInit = onInit;
    vm.codigoAppMydream = coreConstants.codigoAppMydream;

    function onInit() {
      _initValues();
    }

    // private

    function _initValues() {
      vm.menu = menu;
    }

    function showSubMenu(id) {
      var submenus = [coreConstants.codigoAppMydream, coreConstants.codigoAppMassAdm, coreConstants.codigoAppCemetery]
      return !(_.contains(submenus, id));
    }

    function goTo(itemCode) {
      if(itemCode === coreConstants.codigoAppCemetery){
        $state.go('cemetery');
      }else{
        if(itemCode === coreConstants.codigoAppMassAdm) {
          $state.go('massAdmHome');
        } else {
          $state.go('carouselTray', { codeApp: itemCode });
        }
      }
    }

    vm.showSubMenu = showSubMenu;
    vm.goTo = goTo;
  } // end controller

  return ng.module(coreConstants.ngMainModule).controller('HomeComponent', HomeComponent);
});