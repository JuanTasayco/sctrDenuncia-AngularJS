'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs',
  'nsctrNoResultFilterJs'
], function(angular, constants, nsctr_constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('miningModalWorkerDataController',
    ['$scope', '$state', 'mainServices', 'nsctrFactory', 'nsctrService',
    function($scope, $state, mainServices, nsctrFactory, nsctrService){
      /*########################
      # _self
      ########################*/
      var _self = this;
      /*#########################
      # _filter
      #########################*/
      function _params(item){
        var vItem = _self.mainData,
            vParams = {
              proof: {
                NSCTRSystemType       : _self.constants.module.code,
                constancyNumber       : '',
                codAseg               : '',
                documentType          : vItem.documentType,
                documentNumber        : vItem.documentNumber,
                fullName              : vItem.fullName,
                policyNumber          : '',
                receiptNumber         : '0',
                startValidity         : '',
                endValidity           : '',
                clientDocumentType    : '',
                clientDocumentNumber  : '',
                clientName            : '',
                rolCode               : _self.constants.user.role,
                rowByPage             : 5,
                currentPage           : (item)
                                          ? item.mPagination.currentPage
                                          : 1,
                orderBy               : ''
              },
              evaluation: {
                documentType  : vItem.documentType,
                documentNumber: vItem.documentNumber,
                rowByPage     : 5,
                currentPage   : (item)
                                  ? item.mPagination.currentPage
                                  : 1,
                orderBy       : ''
              }
            };
        return vParams;
      }
      function _filter(item, index){
        var vParams = _params(item),
            vDataList = {
              proof:{
                params: vParams.proof,
                service: ''
              },
              evaluation:{
                params: vParams.evaluation,
                service: ''
              }
            };

        if (item){
          if (item.type == 'C') {
            vDataList['proof'].service = nsctrFactory.common.proxyConstancy.ServicesListPagingConstancy(vDataList['proof'].params, false);
          }else{
            vDataList['evaluation'].service = nsctrFactory.mining.proxyEvaluations.ServicesGetEvaluationsByEmployeePaging(vDataList['evaluation'].params, false);
          }
        }else{
          vDataList['proof'].service = nsctrFactory.common.proxyConstancy.ServicesListPagingConstancy(vDataList['proof'].params, false);
          vDataList['evaluation'].service = nsctrFactory.mining.proxyEvaluations.ServicesGetEvaluationsByEmployeePaging(vDataList['evaluation'].params, false);
        }

        mainServices.fnReturnSeveralPromise([
          vDataList['proof'].service,
          vDataList['evaluation'].service
        ], true).then(function(response){
          angular.forEach(response, function(value1, index1){
            if (value1.operationCode && value1.operationCode == constants.operationCode.success){
              //if (value1.data.list.length > 0){
                if (item){
                  _self.data.dataLists[index].dataList.setDataList(value1.data.list, value1.data.totalRows, 0, value1.data.totalPages);
                  _self.data.dataLists[index].mPagination.setTotalItems(_self.data.dataLists[index].dataList.totalItemsPagination);
                }else{
                  var vNewStructure = {
                    type        : (index1)
                                    ? 'E'
                                    : 'C',
                    noResult    : (value1.data.list.length)
                                    ? new nsctrFactory.object.oNoResultFilter()
                                    : new nsctrFactory.object.oNoResultFilter(false, true),
                    dataList    : new nsctrFactory.object.oDataList(),
                    mPagination : new nsctrFactory.object.oPagination(),
                  };
                  vNewStructure.dataList.setDataList(value1.data.list, value1.data.totalRows, 0, value1.data.totalPages);
                  vNewStructure.mPagination.setTotalItems(vNewStructure.dataList.totalItemsPagination);
                  _self.data.dataLists.push(vNewStructure);
                }
              //}
            }
          });
        });
      }
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){

        _self.constants = _self.constants || {};
        _self.mainData = _self.mainData || {};
        _self.data = _self.data || {};

        _self.data.dataLists = [];
        _filter();

      };
      /*#########################
      # fnCloseModal
      #########################*/
      function _closeModal(isClose){
        $scope.$emit('fnCloseModal_modalWorkerData', isClose);
      }
      _self.fnCloseModal = function(isClose){
        _closeModal(isClose);
      };
      /*#########################
      # fnChangePage
      #########################*/
      _self.fnChangePage = function(item, index){
        _filter(item, index);
      };
      /*#########################
      # fnGetTable
      #########################*/
      _self.fnGetClassTable = function(item){
        return (item.dataList.list.length > 0)
                ? (item.type === 'C')
                    ? 'tableProofs'
                    : 'tableEvaluations'
                : '';
      };

  }]).component('miningModalWorkerData',{
    templateUrl: '/nsctr/app/mining/common/components/modalWorkerData/modalWorkerData.component.html',
    controller: 'miningModalWorkerDataController',
    bindings: {
      mainData: '=',
      constants:'=?',
      data: '=?',
    }
  });
});
