'use strict';

define([
  'angular', 'constants',
  'nsctrServiceJs'
], function(angular, constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrPendingRiskPremiumTableController',
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


  }]).component('nsctrPendingRiskPremiumTable',{
    templateUrl: '/nsctr/app/common/components/pendingRiskPremiumTable/pendingRiskPremiumTable.component.html',
    controller: 'nsctrPendingRiskPremiumTableController',
    bindings: {
      module: '=',
      currencyType: '=',
      riskPremium: '='
    }
  });
});