define([
  'angular'
], function (angular) {
  'use strict';

  angular
    .module('appAutos')
    .controller('homeDigitalBusinessController', HomeDigitalBusinessController);

  HomeDigitalBusinessController.$inject = ['$state'];

  function HomeDigitalBusinessController($state) {
    var vm = this;
  }

});
