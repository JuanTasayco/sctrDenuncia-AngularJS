'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
  'nsctrNoResultFilterJs',
  'miningModalMaintenanceJs'
], function(ng, constants, nsctr_constants){

  var appNsctr = ng.module('appNsctr');

  appNsctr.controller('miningMaintenanceTypesController',
    ['$scope','$state', '$uibModal', 'nsctrService', 'nsctrFactory', 'mainServices',
    function($scope, $state, $uibModal, nsctrService, nsctrFactory, mainServices){
      /*########################
      # _self
      ########################*/
      var _self = this;
      /*########################
      # _setConfig
      ########################*/
      function _setConfig(type, data){
        switch (type){
          case _self.CONSTANTS_NSCTR.medic.code:
            data.title = 'Médicos';
            data.textAddButton = 'Agregar médico';
            data.label = 'Médico';
            data.serviceDataList = nsctrFactory.mining.proxyMedic.ServicesPagingListMedic;
            break;
          case _self.CONSTANTS_NSCTR.location.code:
            data.title = 'Locaciones';
            data.textAddButton = 'Agregar locación';
            data.label = 'Locación';
            data.serviceDataList = nsctrFactory.mining.proxyLocation.ServicesPagingListLocation;
            break;
        }
      }
      /*########################
      # _dataList
      ########################*/
      function _paramsDatalist(){
        var vParams = {};
        switch (_self.type){
          case _self.CONSTANTS_NSCTR.medic.code:
            vParams.MedicName = _self.data.mName || '';
            break;
          case _self.CONSTANTS_NSCTR.location.code:
            vParams.LocationName = _self.data.mName || '';
            break;
        }
        vParams.CurrentPage = _self.data.mPagination.currentPage;
        vParams.RowByPage = 5;
        return vParams;
      }
      function _dataList(){
        var vParams = _paramsDatalist();
        _self.data.serviceDataList(vParams, true).then(function(response){
        if (response.operationCode == constants.operationCode.success){
            if (response.data.list.length > 0){
              _self.data.dataList.setDataList(response.data.list, response.data.totalRows, response.data.totalRowsActive, response.data.totalPages);
              _self.data.mPagination.setTotalItems(_self.data.dataList.totalItemsPagination);
            }else{
              _self.data.noResultFilter.setNoResult(true);
            }
          }else{
            _self.data.noResultFilter.setNoResult(true);
          }
        }, function(error){
          _self.data.noResultFilter.setNoResult(true);
        });
      }
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){
        _self.data = _self.data || {};

        _self.CONSTANTS_NSCTR = _self.CONSTANTS_NSCTR || nsctr_constants;

        _self.USER = new nsctrFactory.object.oUser();

        _self.data.noResultFilter = new nsctrFactory.object.oNoResultFilter();
        _self.data.dataList = new nsctrFactory.object.oDataList();
        _self.data.mPagination = new nsctrFactory.object.oPagination();

        _setConfig(_self.type, _self.data);
        _dataList();

        _self.MODULE = $state.current.module;
        _self.NAME_VALIDATION =  $state.current.validationAction
        var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+_self.MODULE.appCode)), _self.NAME_VALIDATION, "nombreCabecera");
        _self.seguritySearch = nsctrFactory.validation._filterData(segurity.items, "BUSCAR", "nombreCorto")
        _self.segurityAdd = nsctrFactory.validation._filterData(segurity.items, "AGREGAR_LOCACIONES", "nombreCorto")
        _self.segurityUpdate = nsctrFactory.validation._filterData(segurity.items, "ACTUALIZAR", "nombreCorto")
        _self.segurityAddMedic = nsctrFactory.validation._filterData(segurity.items, "AGREGAR_MEDICO", "nombreCorto")
      };
      /*########################
      # fnSearch
      ########################*/
      function _clearSearchedDataList(option){
        var vIsClear = option == 'C';

        _self.data.noResultFilter.setNoResultFilter(vIsClear, false);
        _self.data.dataList.setDataList();
        _self.data.mPagination.setTotalItems(0);
        _self.data.mPagination.setCurrentPage(1);
      }
      _self.fnSearch = function(){
        _clearSearchedDataList('S');
        _dataList();
      };
      /*########################
      # fnChangePage
      ########################*/
      _self.fnChangePage = function(){
        _dataList();
      };
      /*########################
      # fnClear
      ########################*/
      function _clearSearcher(){
        _self.data.mName = '';
      }
      _self.fnClear = function(){
        _clearSearcher();
        _clearSearchedDataList('C');
      };
      /*########################
      # fnShowModalAdd
      ########################*/
      _self.fnShowModalAddUpdate = function(actionType, item){
        _self.modalMaintenance = {
          mainData: {
            maintenanceType : _self.type,
            actionType      : actionType,
            item            : item || {}
          },
          data: {}
        };
        var vConfigModal = nsctrService.fnDefaultModalOptions($scope, {
                            size: 'lg',
                            template: '<mining-modal-maintenance main-data="$ctrl.modalMaintenance.mainData" data="$ctrl.modalMaintenance.data"></mining-modal-maintenance>'
                          });
        vConfigModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
          function($scope, $uibModalInstance, $uibModal){
            /*########################
            # fnActionButton_modalInsured
            ########################*/
            $scope.$on('fnActionButton_modalMaintenance', function(event, action){
              if (action){
                $uibModalInstance.close(action);
              }else{
                $uibModalInstance.dismiss('cancel');
              }
            });
        }];

        $uibModal.open(vConfigModal).result.then(function(action){
          //Action after CloseButton Modal
          if (action == 'A'){
            _self.fnSearch();
          }else{
            _self.fnChangePage();
          }
        },function(){
          //Action after CancelButton Modal
        });
      };

    }
  ]).component('miningMaintenanceTypes',{
      templateUrl: '/nsctr/app/mining/common/components/maintenanceTypes/maintenanceTypes.component.html',
      controller: 'miningMaintenanceTypesController',
      bindings: {
        type: '@',
        mainData: '=?',
        data: '=?'
      }
    });
});

