'use strict';

define([
  'angular', 'constants', 'nsctr_constants', 'lodash',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs',
  'miningCheckFilterJs',
  'nsctrNoResultFilterJs',
  'miningModalUpdateIndividualCensusJs'
], function(angular, constants, nsctr_constants, _){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('miningSearchedCensusController',
    ['$rootScope', '$scope', '$state', 'mainServices', 'nsctrFactory', 'nsctrService', 'nsctrRoles',
    '$timeout', 'mpSpin', '$uibModal',
    function($rootScope, $scope, $state, mainServices, nsctrFactory, nsctrService, nsctrRoles,
    $timeout, mpSpin, $uibModal){
      /*########################
      # Variables
      ########################*/
      var _self = this,
          fnWatchCheckFilter = function() {};
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function() {

        _self.data = _self.data || {};
        _self.checkFilter = _self.checkFilter || {};

        _self.noResult = new nsctrFactory.object.oNoResultFilter(true);
        _self.data.dataList = new nsctrFactory.object.oDataListCheckFilter();

        $scope.MODULE = $state.current.module;
        _self.MODULE = $state.current.module;
        var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+_self.MODULE.appCode)), "CONSULTA_PADRON_INDIVIDUAL", "nombreCabecera");
        _self.segurityUpdate = nsctrFactory.validation._filterData(segurity.items, "ACTUALIZAR_PADRON", "nombreCorto")

      };
      /*########################
      # _setCheckFilter
      ########################*/
      function _setCheckFilter(){
        $scope.$broadcast('fnSetCheckFilter_checkFilter');
      }
      /*########################
      # _clearSearchedCensus
      ########################*/
      function _clearSearchedCensus(isButtonClear) {
        isButtonClear = isButtonClear || false;
        _self.noResult.setNoResultFilter(isButtonClear, false);
        _self.data.dataList.setDataList();
      }
      /*########################
      # fnSearchCensus_searchedCensus
      ########################*/
      function _searchCensus(params){
        nsctrFactory.mining.proxyConsults.CSGetCensusList(_self.type, params, true).then(function(response){
          if (response.operationCode == constants.operationCode.success && response.data && response.data.length) {
            fnWatchCheckFilter = $scope.$watch('$ctrl.checkFilter.checkList', function(newValue, oldValue){
              var vCheckList = newValue || _self.checkFilter.checkList;
              _self.data.dataList.setDataList(response.data, vCheckList, 'able');
            });
          }else{
            _self.noResult.setNoResult(true);
          }
        }).catch(function() {
          _self.noResult.setNoResult(true);
        });
      }
      $scope.$on('fnSearchCensus_searchedCensus', function(event, params){
        _self.PARAMS_SEARCHER = params;
        _setCheckFilter();
        _clearSearchedCensus();
        _searchCensus(_self.PARAMS_SEARCHER);
      });
      /*########################
      # fnCheckFilter
      ########################*/
      _self.fnCheckFilter = function() {
        _self.data.dataList.setDataListByCheckFilter(_self.checkFilter.checkList)
          .then(function(response) {
            _self.noResult.setNoResult(!response.length);
          });
      };
      /*########################
      # fnClearSearchedCensus
      ########################*/
      $scope.$on('fnClearSearchedCensus_searchedCensus', function(event){
        _self.PARAMS_SEARCHER = {};
        _clearSearchedCensus(true);
      });
      /*########################
      # fnDownload
      ########################*/
      _self.fnDownload = function() {
        var vParams = _self.data.dataList.list;
        nsctrFactory.mining.proxyConsults.CSServicesConsults_DownloadCensusMassive(vParams, true).then(function(response) {
          if (response.byteLength > 0) {
            var vFileName = 'padronMasivo.xls';
            mainServices.fnDownloadFileBase64(response, 'excel', vFileName, true);
          }
        });
      }
      /*#######################
      # fnShowModalUpdateIndividualCensus
      #######################*/
      _self.fnShowModalUpdateIndividualCensus = function(item){
        $scope.modalUpdateIndividualCensus = {
          mainData: {
            item: item
          },
          data:{}
        };
        var vConfigModal = nsctrService.fnDefaultModalOptions($scope, {
                            size: 'lg',
                            template: '<mining-modal-update-individual-census main-data="modalUpdateIndividualCensus.mainData" data="modalUpdateIndividualCensus.data"></mining-modal-update-individual-census>'
                          });

        vConfigModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
          function($scope, $uibModalInstance, $uibModal){
            /*########################
            # fnCloseModal
            ########################*/
            $scope.$on('fnCloseModal_modalUpdateIndividualCensus', function(event, actionButton){
              if (actionButton == constants.actionButton.cancel) {
                $uibModalInstance.dismiss('cancel');
              } else {
                $uibModalInstance.close(actionButton);
              }
            });
        }];

        // $uibModal.open(vConfigModal);
        $uibModal.open(vConfigModal).result.then(function(actionButton){
          //Action after CloseButton Modal
          _clearSearchedCensus();
          _searchCensus(_self.PARAMS_SEARCHER);
        },function(){
          //Action after CancelButton Modal
        });
      };

      /*#######################
      # DESTROY_EVENTS
      #######################*/
      $scope.$on('$destroy', function(){
        fnWatchCheckFilter();
      });

  }]).component('miningSearchedCensus',{
    templateUrl: function($state, $element, $attrs) {
      var vType = $attrs.type.toUpperCase(),
          vTemplate = (vType == nsctr_constants.typeLoad.individual.code)
                        ? 'individual'
                        : 'massive';
      return '/nsctr/app/mining/common/components/searchedCensus/' + vTemplate + '.component.html';
    },
    controller: 'miningSearchedCensusController',
    bindings: {
      data: '=?',
      type:'@'
    }
  });
});