'use strict';

define(['angular', 'coreConstants', 'system'], function(ng, coreConstants, system) {
  var folder = system.apps.ap.location;

  function TabServicesComponent() {
    var vm = this;
    vm.click = click;
    vm.$onInit = onInit;

    function onInit() {
      _initValues();
    }

    function click(tab) {
      vm.selectedTab = tab.code;
      vm.onClick({
        $event: tab
      });
    }

    function _initValues() {
      vm.selectedTab = 1;
    }
  } // end controller

  return ng
    .module(coreConstants.ngMainModule)
    .controller('TabServicesComponent', TabServicesComponent)
    .component('apTabServices', {
      templateUrl: folder + '/app/admin-additional-services/components/tab/tab.component.html',
      controller: 'TabServicesComponent',
      bindings: {
        items: '=?',
        onClick: '&?'
      }
    });
});
