'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs',
], function(angular, constants, nsctr_constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrModalHistoryController',
    ['$scope', '$state', 'mainServices', 'nsctrFactory', 'nsctrService', 'nsctrRoles', 'mModalAlert', '$timeout',
    function($scope, $state, mainServices, nsctrFactory, nsctrService, nsctrRoles, mModalAlert, $timeout){
      /*########################
      # _self
      ########################*/
      var _self = this;
      /*########################
      # _filterHistory
      ########################*/
      function _getIndexProofsHistory(policyType){
        var vProofsHistory = _self.data.proofsHistory,
            vIndex = vProofsHistory.map(function(item){
              return item.policyType;
            }).indexOf(policyType);
        return vIndex;
      }
      function _paramsHistoricalApplications(policyType, itemPolicy, currentPage){
        var vParams = {
          policyType:           policyType,
          policyNumber :        (nsctr_constants.pension.code == policyType)
                                  ? itemPolicy.pensionPolicyNumber
                                  : itemPolicy.healthPolicyNumber,
          documentNumber :      itemPolicy.clientDocumentNumber || itemPolicy.documentNumber,
          agentId :             itemPolicy.agentId,
          rowByPage :           '3',
          currentPage :         currentPage || '1'
        };
        if (nsctr_constants.pension.code == policyType){
          vParams.pensionPolicyNumber = itemPolicy.pensionPolicyNumber;
        }else{
          vParams.healthPolicyNumber = itemPolicy.healthPolicyNumber;
        }
        return vParams;
      }
      function _filterHistory(itemPolicy, currentPage){
        var vPolicy = {
          pension: {
            params: '',
            service: ''
          },
          health: {
            params: '',
            service: ''
          }
        };

        if (itemPolicy.pensionPolicyNumber){
          vPolicy['pension'].params = _paramsHistoricalApplications(nsctr_constants.pension.code, itemPolicy, currentPage);
          vPolicy['pension'].service = nsctrFactory.common.proxyApplication.GetHistoricalApplications(vPolicy['pension'].params, false);
        }
        if(itemPolicy.healthPolicyNumber){
          vPolicy['health'].params = _paramsHistoricalApplications(nsctr_constants.health.code, itemPolicy, currentPage);
          vPolicy['health'].service = nsctrFactory.common.proxyApplication.GetHistoricalApplications(vPolicy['health'].params, false);
        }

        mainServices.fnReturnSeveralPromise([
          vPolicy['pension'].service,
          vPolicy['health'].service
          ], true).then(function(response){
          var vPension = response[0],
              vHealth = response[1];

          if (vPension.operationCode && constants.operationCode.success == vPension.operationCode){
            if (vPension.data.list.length > 0){
              var vApplications = vPolicy['pension'].params;
              vApplications.applications =  vPension.data.list;
              vApplications.totalItems =    parseInt(vPension.data.totalPages) * 10;

              var vIndex = _getIndexProofsHistory(nsctr_constants.pension.code);
              if (vIndex > -1)
                _self.data.proofsHistory.splice(vIndex, 1, vApplications);
              else
                _self.data.proofsHistory.push(vApplications);
            }
          }
          if (vHealth.operationCode && constants.operationCode.success == vHealth.operationCode){
            if (vHealth.data.list.length > 0){
              var vApplications = vPolicy['health'].params;
              vApplications.applications =  vHealth.data.list;
              vApplications.totalItems =    parseInt(vHealth.data.totalPages) * 10;
              var vIndex = _getIndexProofsHistory(nsctr_constants.health.code);
              if (vIndex > -1)
                _self.data.proofsHistory.splice(vIndex, 1, vApplications);
              else
                _self.data.proofsHistory.push(vApplications);
            }
          }
        }, function(error){
          // console.log('error');
        }, function(defaultError){
          // console.log('errorDefault');
        });
      }
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){

        _self.mainData = _self.mainData || {};
        _self.data = _self.data || {};

        _self.MODULE = $state.current.module;
        _self.IS_MODULE = nsctrService.fnIsModule(_self.MODULE);

        _self.data.proofsHistory = [];
        _self.data.proofsHistory.checkedApplication = {};
        _self.data.proofsHistory.checkedApplication['pension'] = [];
        _self.data.proofsHistory.checkedApplication['health'] = [];

        _filterHistory(_self.mainData.itemPolicy, '1');

      };
      /*########################
      # fnInitCheckBox
      ########################*/
      _self.fnInitCheckBox = function(itemPolicy, itemApplication){
        var vCheckedApplication = _self.data.proofsHistory.checkedApplication['health'];
        if (nsctr_constants.pension.code == itemPolicy.policyType) vCheckedApplication = _self.data.proofsHistory.checkedApplication['pension'];
        if (vCheckedApplication.length > 0){
          angular.forEach(vCheckedApplication[0].applications, function(value1, key1) {
            if (itemApplication.applicationNumber == value1.applicationNumber){
              itemApplication.mCheckBox = value1.mCheckBox;
            }
          });
        }
      };
      /*########################
      # fnCheck
      ########################*/
      _self.fnCheck = function(itemPolicy, itemApplication){
        var vCheckedApplication = _self.data.proofsHistory.checkedApplication['health'];
        if (nsctr_constants.pension.code == itemPolicy.policyType) vCheckedApplication = _self.data.proofsHistory.checkedApplication['pension'];

        if (itemApplication.mCheckBox){
          if (vCheckedApplication.length > 0){
            angular.forEach(itemPolicy.applications, function(value1, key1) {
              if (itemApplication.applicationNumber !== value1.applicationNumber)
                value1.mCheckBox = false;
            });
            $timeout(function() {
              vCheckedApplication.splice(0, 1, itemPolicy);
            },0);
          }else{
            vCheckedApplication.push(itemPolicy);
          }
        }else{
          $timeout(function() {
            vCheckedApplication.splice(0, 1);
          },0);
        }
      };
      /*########################
      # fnChangePage
      ########################*/
      _self.fnChangePage = function(itemPolicy, page){
        _filterHistory(itemPolicy, page);
      };
      /*########################
      # fnDownload
      ########################*/
      function _validateDownloadExcelHistorical(params){
        var vValid = true,
            vMessage = new nsctrFactory.object.oMessageError(),
            vValidate1 = (params.length > 0),
            vValidate2 = (params.length > 0 && params.length < 2)
                            ? true
                            : (params.length == 2 && (params[0].DateStart == params[1].DateStart && params[0].DateEnd == params[1].DateEnd)),
            vValid = vValidate1 && vValidate2;

        if (!vValidate1){
          vMessage.setMessageError('W', 'ALERTA', 'Debe seleccionar alguna vigencia para Exportar');
        }else if (!vValidate2){
          vMessage.setMessageError('W', 'ALERTA', 'Debe seleccionar Aplicaciones con la mismas fechas de vigencias');
        }

        return {
          valid: vValid,
          message: vMessage
        };
      }
      function _paramsCSServicesDownloadExcelHistorical(){
        var vParams = [];
        angular.forEach(_self.data.proofsHistory.checkedApplication, function(value1, key1) {
          if (value1.length > 0){
            var vItem = {};
            angular.forEach(value1, function(value2, key2) {
              vItem.ClientDocumentNumber =  value2.documentNumber;
              vItem.PolicyNumber =          value2.policyNumber;
              vItem.PolicyType =            value2.policyType;
              angular.forEach(value2.applications, function(value3, key3) {
                if (value3.mCheckBox){
                  vItem.DateStart = value3.dateStart;
                  vItem.DateEnd =   value3.dateFinish;
                  vItem.ApplicationNumber = value3.applicationNumber;
                  vItem.NSCTRSystemType = $state.current.module.code
                }
              });
            });
            vParams.push(vItem);
          }
        });
        return vParams;
      }
      _self.fnDownload = function(){
        _self.data.proofsHistory.paramsCSServicesDownloadExcelHistorical = _paramsCSServicesDownloadExcelHistorical();

        var vValidateDownloadExcelHistorical = _validateDownloadExcelHistorical(_self.data.proofsHistory.paramsCSServicesDownloadExcelHistorical);
        if (vValidateDownloadExcelHistorical.valid){
          $timeout(function(){
            nsctrFactory.common.proxyApplication.CSServicesDownloadExcelHistorical(_paramsCSServicesDownloadExcelHistorical(),true).then(function(data){
            });
          }, 0);
        }else{
          if (vValidateDownloadExcelHistorical.message.type) vValidateDownloadExcelHistorical.message.showModalAlert();
        }
      }
      /*#########################
      # fnCloseModal
      #########################*/
      function _closeModal(){
        $scope.$emit('fnCloseModal_modalHistory');
      }
      _self.fnCloseModal = function(){
        _closeModal();
      };

  }]).component('nsctrModalHistory',{
    templateUrl: '/nsctr/app/common/components/modalHistory/modalHistory.component.html',
    controller: 'nsctrModalHistoryController',
    bindings: {
      mainData: '=?',
      data: '=?'
    }
  });
});
