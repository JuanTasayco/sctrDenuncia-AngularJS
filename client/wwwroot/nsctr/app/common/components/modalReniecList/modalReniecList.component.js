'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
  'nsctrServiceJs', 'nsctrFactoryJs',
], function(angular, constants, nsctr_constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrModalReniecListController',
    ['$scope', 'nsctrService', 'nsctrFactory', '$timeout',
    function($scope, nsctrService, nsctrFactory, $timeout){
      /*########################
      # _self
      ########################*/
      var _self = this;
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){

        _self.mainData = _self.mainData || {};
        _self.data = _self.data || {};

        _self.STATE_PARAMS = new nsctrFactory.object.oStateParams();

      };
      /*#########################
      # fnActionButton
      #########################*/
      function _actionButton(action){
        $scope.$emit('fnActionButton_modalReniecList', action);
      }
      _self.fnCancel = function(){
        _actionButton('C');
      };
      function _paramsExport(){
        var vParams = {
          ClientDocumentNumber:         (_self.STATE_PARAMS['client'] && _self.STATE_PARAMS['client'].documentNumber)
                                          ? _self.STATE_PARAMS['client'].documentNumber
                                          : '',
          PensionPolicyNumber:          '',
          HealthPolicyNumber:           '',
          employeeResponseMessagesList: _self.mainData.reniecList
        }
        var vSelectedApplications = _self.STATE_PARAMS['selectedApplications'];
        angular.forEach(vSelectedApplications, function(value1, key1) {
          var vKeyPolicyNumber = (value1.applicationType == nsctr_constants.pension.code)
                      ? 'PensionPolicyNumber'
                      : 'HealthPolicyNumber';

          vParams[vKeyPolicyNumber] = value1.policyNumber;
        });
        return vParams;
      }
      function _executeFrmExportReniecList(){
        $timeout(function(){
          document.getElementById('iFrmExportReniecList').submit();
        }, 0);
      }
      _self.fnExport = function(){
        _self.exportServiceReniecList = nsctrFactory.common.proxyGenerateDeclarationMain.CSServicesDownloadErrorExcel();
        _self.exportParamsReniecList = _paramsExport();
        _executeFrmExportReniecList();
        _actionButton('E');
      };
      _self.fnAcept = function(){
        _actionButton('A');
      };


  }]).component('nsctrModalReniecList',{
    templateUrl: '/nsctr/app/common/components/modalReniecList/modalReniecList.component.html',
    controller: 'nsctrModalReniecListController',
    bindings: {
      mainData: '=?',
      data: '=?'
    }
  });
});