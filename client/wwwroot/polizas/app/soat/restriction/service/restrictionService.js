'use strict'

define(['angular'], function(angular){
  var appSoat = angular.module('appSoat');

  appSoat.service('restrictionService', [function(){
    var restriction = {};

    function getRestriction() {
      return restriction;
    }

    function setRestriction(data) {
      restriction = angular.copy(data);
    }

    return {
      getRestriction: getRestriction,
      setRestriction: setRestriction
    };
  }]);
});