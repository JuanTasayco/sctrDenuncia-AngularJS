'use strict';
define(['angular', 'system', 'generalConstant','actterFactory'], function(angular, system, generalConstant,actterFactory) {
  HomeController.$inject = ['actterFactory'];
  function HomeController(actterFactory) {
    var vm = this;

    vm.$onInit = function() {};

    vm.subMenus  = actterFactory.menuOptions();
  }

  return angular
    .module(generalConstant.APP_MODULE)
    .controller('HomeController', HomeController)
    .component('actterHome', {
      templateUrl: system.apps.actter.location + '/app/views/home/home.component.html',
      controller: 'HomeController'
    });
});
