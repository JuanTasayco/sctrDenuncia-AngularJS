'use strict';

define([
  'angular',
  'nsctrServiceJs', 'nsctrFactoryJs',
], function(ng){

  var appNsctr = ng.module('appNsctr');

  appNsctr.controller('nsctrModalReniecListRejectController',
    ['$scope', 'nsctrFactory',
    function($scope, nsctrFactory){    
      var _self = this;
          
      _self.$onInit = function(){

        _self.mainData = _self.mainData || {};
        _self.data = _self.data || {};

        _self.STATE_PARAMS = new nsctrFactory.object.oStateParams();

      };
      _self.fnCancel = function(){
        $scope.$emit('fnActionButton_modalReniecListReject', 'C');
      };

  }]).component('nsctrModalReniecListReject',{
    templateUrl: '/nsctr/app/common/components/modalReniecListReject/modalReniecListReject.component.html',
    controller: 'nsctrModalReniecListRejectController',
    bindings: {
      mainData: '=?',
      data: '=?'
    }
  });
});