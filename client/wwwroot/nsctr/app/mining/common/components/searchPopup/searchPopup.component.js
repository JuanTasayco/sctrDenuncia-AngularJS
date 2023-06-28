'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
  'nsctrNoResultFilterJs'
], function(ng, constants, nsctr_constants){

  var appNsctr = ng.module('appNsctr');

  appNsctr.controller('miningSearchPopupController',
    ['$scope', '$uibModal', 'nsctrService', 'nsctrFactory', 'mainServices',
    function($scope, $uibModal, nsctrService, nsctrFactory, mainServices){
      /*########################
      # _self
      ########################*/
      var _self = this;
      /*########################
      # _setConfig
      ########################*/
      function _setConfig(){
        _self.IS_COMPANY = _self.type == _self.CONSTANTS_NSCTR.client.code;
        switch (_self.type){
          case _self.CONSTANTS_NSCTR.client.code:
            _self.data.lblTitle = 'Empresas';
            _self.data.lblDocumentNumber = 'RUC';
            _self.data.lblName = 'Razón Social';
            break;
          case _self.CONSTANTS_NSCTR.insured.code:
            _self.data.lblTitle = 'Asegurados';
            _self.data.lblDocumentNumber = 'Nro. Documento';
            _self.data.lblName = 'Nombre';
            _self.data.documentTypeData = _self.data.documentTypeData || nsctrFactory.common.proxyLookup.ServicesListDocumentType(_self.CONSTANTS_NSCTR.insured.code, _self.CONSTANTS_NSCTR.mining.code, true);
            break;
        }
        if (_self.IS_COMPANY) _self.data.mNroDocumento.setFieldsToValidate('RUC');
      }
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){

        _self.mainData = _self.mainData || {};
        _self.data = _self.data || {};

        _self.CONSTANTS_NSCTR = _self.CONSTANTS_NSCTR || nsctr_constants;

        _self.USER = new nsctrFactory.object.oUser();

        _self.data.mNroDocumento = new nsctrFactory.object.oDocumentNumber();
        _self.data.noResultFilter = new nsctrFactory.object.oNoResultFilter(true);
        _self.data.dataList = new nsctrFactory.object.oDataList();
        _self.data.mPagination = new nsctrFactory.object.oPagination();
        _self.data.mPagination.setMaxSize(5);

        _setConfig();

      };
      /*########################
      # _actionButton
      ########################*/
       function _actionButton(obj){
        // obj:
        // action = 'I'
        // data  = ITEM
        obj = obj || {};
        $scope.$emit('fnActionButton_searchPopup', obj);
      }
      /*########################
      # fnCancelModal
      ########################*/
      _self.fnCancelModal = function(){
        _actionButton();
      }
      /*########################
      # fnChangeDocumentType
      ########################*/
      _self.fnChangeDocumentType = function(documentType){
        var vDocumentType = (documentType)
                            ? documentType.typeId
                            : null;
        _self.data.mNroDocumento.setFieldsToValidate(vDocumentType);
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
      function _paramsSearch(){
        var vParams = {};
        switch (_self.type){
          case _self.CONSTANTS_NSCTR.client.code:
            vParams.EnterpriseId            = _self.data.mCodigoEmpresa || '';
            vParams.EnterpriseRuc           = _self.data.mNroDocumento.model || '';
            vParams.EnterpriseSocialReason  = _self.data.mNombre || '';
            vParams.FlagMineria             = _self.mainData.flagMiningEnterprise;
            break;
          case _self.CONSTANTS_NSCTR.insured.code:
            vParams.RequestNumber           = '';
            vParams.DocumentType            = (_self.data.mTipoDoc && _self.data.mTipoDoc.typeId !== null)
                                                ? _self.data.mTipoDoc.typeId
                                                : '';
            vParams.DocumentNumber          = _self.data.mNroDocumento.model || '';
            vParams.Name                    = _self.data.mNombre || '';
            break;
        }
        vParams.CurrentPage = _self.data.mPagination.currentPage;
        vParams.RowByPage = 5;
        return vParams;
      }
      function _search(){
        var vParams = _paramsSearch();
        nsctrFactory.mining.proxyCommon.CSServicesModalSearch(_self.type, vParams, true).then(function(response) {
          if (response.operationCode == constants.operationCode.success) {
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
      _self.fnSearch = function() {
        _clearSearchedDataList('S');
        _search();
      };
      /*########################
      # fnChangePage
      ########################*/
      _self.fnChangePage = function(){
        _search();
      };
      /*########################
      # fnClear
      ########################*/
      function _clearSearcher(type){
        _self.data.mCodigoEmpresa = '';
        _self.data.mTipoDoc = {
          typeId: null
        };
        _self.data.mNroDocumento.setModel('');
        _self.data.mNroDocumento.setFieldsToValidate(null);
        _self.data.mNombre = '';
      }
      _self.fnClear = function(){
        _clearSearcher();
        _clearSearchedDataList('C');
      };
      /*########################
      # fnSelectedItem
      ########################*/
      _self.fnSelectedItem = function(item){
        var vObj = {
          action: 'I',
          item: item
        };
        _actionButton(vObj);
      };
    }
  ]).component('miningSearchPopup',{
      templateUrl: '/nsctr/app/mining/common/components/searchPopup/searchPopup.component.html',
      controller: 'miningSearchPopupController',
      bindings: {
        type: '@',
        mainData: '=?',
        data: '=?'
      }
    });
});
