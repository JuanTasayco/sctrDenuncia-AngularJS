'use strict';

define(['angular', 'coreConstants'], function(ng, coreConstants) {
  MassAdmHomeComponent.$inject = ['$scope', '$state'];
  function MassAdmHomeComponent($scope, $state) {
    var vm = this;
    vm.$onInit = onInit;

    vm.subMenus = [
        { nombreCorto: "ADMINISTRACION", nombreLargo: "ADMINISTRACIÓN DE MISAS", uiSref: "massAdmTray" },
        // { nombreCorto: "REPORTES", nombreLargo: "REPORTES" },
    ];

    function onInit() {
      loadMenu();
    }

    function loadMenu() {
      angular.forEach(vm.subMenus, function(item) {
          switch(item.nombreCorto) {
          case "ADMINISTRACION" : item.item = 1; break;
          // case "REPORTES" : item.item = 2; break;
          }
      });
    }

    function goTo(subMenu) {
      $state.go(subMenu.uiSref);
    }

    vm.goTo = goTo;
  } // end controller

  return ng.module(coreConstants.ngMainModule).controller('MassAdmHomeComponent', MassAdmHomeComponent);
});
