'use strict'

define(['angular'], function (angular) {
  LayoutService.$inject = [];
  function LayoutService() {
    var vm = this;
    vm.config = {
      showOnBack:  false,
      onBack: null
    };

    function setConfig(newConfig) {
      vm.config = Object.assign(vm.config, newConfig);
    }

    function getConfig() {
      return vm.config;
    }

    return {
      setConfig: setConfig,
      getConfig: getConfig
    };
  }

  return angular
    .module('LayoutModule', [])
    .service('LayoutService', LayoutService);
});
