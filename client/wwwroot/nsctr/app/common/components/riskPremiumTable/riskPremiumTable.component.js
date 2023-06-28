'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
  'nsctrServiceJs'
], function(angular, constants, nsctr_constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrRiskPremiumTableController',
    ['$scope', 'nsctrService',
    function($scope, nsctrService){

      var _self = this;
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){

        _self.riskPremium = _self.riskPremium || {};

        _self.IS_MODULE = nsctrService.fnIsModule(_self.module);

      };

  }]).component('nsctrRiskPremiumTable',{
    templateUrl: function($state, $element, $attrs) {
      var vCurrentModule = $state.current.module,
          vTemplate = (vCurrentModule.code == nsctr_constants.mining.code)
                        ? vCurrentModule.prefixState
                        : 'riskPremiumTable';
      return '/nsctr/app/common/components/riskPremiumTable/' + vTemplate + '.component.html';
    },
    controller: 'nsctrRiskPremiumTableController',
    bindings: {
      module: '=',
      currencyType: '=?',
      riskPremium: '='
    }
  });
});