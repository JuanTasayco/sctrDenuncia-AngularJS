'use strict';

define(['angular', 'coreConstants', 'system'], function(ng, coreConstants, system) {
  var folder = system.apps.ap.location;

  function TabComponent() {
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
      vm.selectedTab = 0;
    }
  } // end controller

  return ng
    .module(coreConstants.ngMainModule)
    .controller('TabComponent', TabComponent)
    .component('apTab', {
      templateUrl: folder + '/app/carousel-tray/components/tab/tab.component.html',
      controller: 'TabComponent',
      bindings: {
        items: '=?',
        onClick: '&?'
      }
    });
});
