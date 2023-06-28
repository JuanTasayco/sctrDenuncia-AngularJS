'use strict'

define([
  'angular', 'constants'
], function(angular, constants) {

    var appControls = angular.module('mapfre.controls');

    appControls.factory('contractorVehicleDetailsFactory', ['proxyAutomovilEmblem', function(proxyAutomovilEmblem){
      
      var proxyAutomovilEmblem = proxyAutomovilEmblem;

      return {
        proxyAutomovilEmblem: proxyAutomovilEmblem
      }

    }])
  
});