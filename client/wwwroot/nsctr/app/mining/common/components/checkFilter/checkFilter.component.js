'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs'
], function(angular, constants, nsctr_constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('miningCheckFilterController',
    ['$scope', 'nsctrFactory',
    function($scope, nsctrFactory){
      /*########################
      # _self
      ########################*/
      var _self = this;
      /*########################
      # _initCheckFilter
      ########################*/
      function _initCheckFilter(){
        nsctrFactory.common.proxyLookup.ServicesAbleList(true).then(function(response){
          if (response.operationCode == constants.operationCode.success){
            _self.data.checkList = _.map(response.data, function(item){
              item.model = true;
              return item;
            });
          }
        });
      }
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){

        _self.data = _self.data || {};

        if (!_self.data.checkList) _initCheckFilter();

      };
      /*########################
      # fnCheck
      ########################*/
      $scope.fnCheck = function(item){
        _self.checkFilter({
          currentCheck: item
        });
      };
      /*########################
      # _setCheckFilter
      ########################*/
      function _setCheckFilter(){
        _.map(_self.data.checkList, function(item){
          item.model = true;
          return item;
        });
      }
      $scope.$on('fnSetCheckFilter_checkFilter', function(event){
        _setCheckFilter();
      })



  }])
  .component('miningCheckFilter',{
    templateUrl: '/nsctr/app/mining/common/components/checkFilter/checkFilter.component.html',
    controller: 'miningCheckFilterController',
    bindings: {
      data: '=?',
      checkFilter: '&'
    }
  });
});