'use strict';
define(['angular', 'system', 'generalConstant'], function(angular, system, generalConstant) {
  HomeController.$inject = [];
  function HomeController() {
    var vm = this;

    vm.$onInit = function() {};
  }

  return angular
    .module(generalConstant.APP_MODULE)
    .controller('HomeController', HomeController)
    .component('actterHome', {
      templateUrl: system.apps.actter.location + '/app/views/home/home.component.html',
      controller: 'HomeController'
    });
});
