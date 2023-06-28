'use strict';

define([
  'angular', 'constants',
  'nsctrFactoryJs', 'nsctrServiceJs',
  'nsctrProofsSearcherJs',
  'nsctrSearchedProofsJs'
], function(angular, constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrSearchProofsController',
    ['$scope', '$window', '$state', '$stateParams', 'mainServices', 'nsctrFactory', 'nsctrService',
    'oimPrincipal', '$uibModal', 'mModalConfirm', '$timeout', 'mModalAlert',
    function($scope, $window, $state, $stateParams, mainServices, nsctrFactory, nsctrService,
    oimPrincipal, $uibModal, mModalConfirm, $timeout, mModalAlert){
      /*########################
      # _self
      ########################*/
      var _self = this;
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){

        _self.data = _self.data || {};
        _self.proofsSearcher = _self.proofsSearcher || {};
        _self.searchedProofs = _self.searchedProofs || {};

        _self.proofsSearcher.activeTab = 0;

      };

  }]).component('nsctrSearchProofs',{
    templateUrl: '/nsctr/app/common/components/searchProofs/searchProofs.component.html',
    controller: 'nsctrSearchProofsController'
    // bindings: {
    //   data: '=?'
    // }
  });

});
