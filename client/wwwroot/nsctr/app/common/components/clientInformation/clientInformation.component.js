'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
], function(angular, constants, nsctr_constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrClientInformationController',
    ['$scope',
    function($scope){

      var _self = this;
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){

        _self.data = _self.data || {};
        _self.design = _self.design || 0;

      };


  }]).component('nsctrClientInformation',{
    templateUrl: function($state, $element, $attrs) {
      var vCurrentModule = $state.current.module,
          vTemplate = (vCurrentModule.code == nsctr_constants.mining.code)
                        ? vCurrentModule.prefixState
                        : 'clientInformation';
      return '/nsctr/app/common/components/clientInformation/' + vTemplate + '.component.html';
    },
    controller: 'nsctrClientInformationController',
    bindings: {
      data: '=',
      design: '=?'
    }
  });
});