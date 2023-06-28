'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
  'nsctrFactoryJs', 'nsctrServiceJs',
  'nsctrNoResultFilterJs',
  'nsctrModalInsuredJs'
], function(angular, constants, nsctr_constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrSearchInsuredController',
    ['$scope', '$window', '$state', '$stateParams', 'mainServices', 'nsctrFactory', 'nsctrService',
    'oimPrincipal', '$uibModal', 'mModalConfirm', '$timeout', 'mModalAlert', 'gaService',
    function($scope, $window, $state, $stateParams, mainServices, nsctrFactory, nsctrService,
    oimPrincipal, $uibModal, mModalConfirm, $timeout, mModalAlert, gaService){
      /*########################
      # _self
      ########################*/
      var _self = this;
      _self.message = "No hay resultados para los filtros escogidos. Intente nuevamente."
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){

        _self.data = _self.data || {};

        _self.MODULE = $state.current.module;
        _self.USER = new nsctrFactory.object.oUser();

        _self.data.documentTypeData = _self.data.documentTypeData || nsctrFactory.common.proxyLookup.ServicesListDocumentType(nsctr_constants.insured.code, _self.MODULE.code, true);

        _self.data.mNroDocumento = new nsctrFactory.object.oDocumentNumber();
        _self.noResultFilter = new nsctrFactory.object.oNoResultFilter(true);
        _self.data.dataList = new nsctrFactory.object.oDataList();
        _self.data.mPagination = new nsctrFactory.object.oPagination();

        var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+_self.MODULE.appCode)), "CONSULTA_ASEGURADOS", "nombreCabecera");
        _self.segurityUpdate= nsctrFactory.validation._filterData(segurity.items, "ACTUALIZAR_ASEGURADO", "nombreCorto");
        _self.segurityMovement = nsctrFactory.validation._filterData(segurity.items, "MOVIMIENTOS", "nombreCorto");

      };
      /*########################
      # fnChangeDocumentType
      ########################*/
      _self.fnChangeDocumentType = function(documentType){
        var vDocumentType = (documentType)
                              ? documentType.typeId
                              : null;
        _self.data.mNroDocumento.setFieldsToValidate(vDocumentType);
      };
      /*#########################
      # searchInsured
      #########################*/
      function _validateSearchInsured(){
        $scope.frmSearchInsured.markAsPristine();
        return $scope.frmSearchInsured.$valid;
      }
      function _clearSearchedInsured(isPagination){
        _self.data.dataList.setDataList();
        _self.data.mPagination.setTotalItems(0);
        if (!isPagination) _self.data.mPagination.setCurrentPage(1);
      }
      function _paramSearchInsured(){
        var vData = {
          NSCTRSystemType:      _self.MODULE.code,
          constancyNumber:      '',
          documentType:         (_self.data.mTipoDoc && _self.data.mTipoDoc.typeId !== null)
                                  ? _self.data.mTipoDoc.typeId
                                  : '',
          documentNumber:       _self.data.mNroDocumento.model || '',
          fullName:             _self.data.mNomApeAsegurado || '',
          clientDocumentNumber: '',
          rolCode:              _self.USER.role,
          rowByPage:            '10',
          currentPage:          _self.data.mPagination.currentPage
        };
        return vData;
      }
      function _searchInsured(){
        _self.noResultFilter.setNoResultFilter(false, false);
        var vParams = _paramSearchInsured();
        nsctrFactory.common.proxyInsured.ServicesInsuredPagingByPolicy(vParams, true).then(function(response){
          if (response.operationCode == constants.operationCode.success){
            if (response.data.list.length > 0){
              _self.data.dataList.setDataList(response.data.list, response.data.totalRows, 0, response.data.totalPages);
              _self.data.mPagination.setTotalItems(_self.data.dataList.totalItemsPagination);
            }else{
              _self.noResultFilter.setNoResult(true);
              _self.message = response.message;
            }
          }else{
            _self.noResultFilter.setNoResult(true);
            _self.message = response.message;
          }
        }, function(error){
          _self.noResultFilter.setNoResult(true);
          _self.message = response.message;
        });
      }
      _self.fnSearchInsured = function(){
        if (_validateSearchInsured()){
          _clearSearchedInsured();
          _searchInsured();
        }

        var textToAnalytics = nsctrService.fnSearchUrlforGoogleAnalytics();

        var appCode = window.localStorage['appOrigin'] ? window.localStorage['appOrigin'] : 'OIM'
        gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + ' - Botón Buscar', gaLabel: 'Botón: Buscar', gaValue: 'Periodo Regular' });
      };
      /*########################
      # fnClearSearchInsured
      ########################*/
      function _clearInsuredSearcher(){
        _self.data.mTipoDoc = {
          typeId: null
        };
        _self.data.mNroDocumento.setModel('');
        _self.data.mNroDocumento.setFieldsToValidate(null);
        _self.data.mNomApeAsegurado = '';
      }
      _self.fnClearSearchInsured = function(){
        _clearInsuredSearcher();
        _clearSearchedInsured();
      };
      /*########################
      # fnChangePage
      ########################*/
      _self.fnChangePage = function(){
        _clearSearchedInsured(true);
        _searchInsured();
      };
      /*#########################
      # showModalInsured
      #########################*/
      _self.fnShowModalInsured = function(item){
        _self.modalInsured = {
          showSelects: true,
          mainData: {
            insured: item
          },
          data:{}
        };
        var vConfigModal = nsctrService.fnDefaultModalOptions($scope, {
                            size: 'lg',
                            template: '<nsctr-modal-insured show-selects="$ctrl.modalInsured.showSelects" main-data="$ctrl.modalInsured.mainData" data="$ctrl.modalInsured.data"></nsctr-modal-insured>'
                          });
        vConfigModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
          function($scope, $uibModalInstance, $uibModal){
            /*########################
            # fnActionButton_modalInsured
            ########################*/
            $scope.$on('fnActionButton_modalInsured', function(event, action){
              if (action){
                $uibModalInstance.close(action);
              }else{
                $uibModalInstance.dismiss('cancel');
              }
            });
        }];

        $uibModal.open(vConfigModal).result.then(function(){
          //Action after CloseButton Modal
          _self.fnChangePage();
        },function(){
          //Action after CancelButton Modal
        });
      }
      /*########################
      # fnGoInsuredMovements
      ########################*/
      _self.fnGoInsuredMovements = function(item){
        $state.go( _self.MODULE.prefixState + 'InsuredMovements', {
          insured : item
        });

        var textToAnalytics = nsctrService.fnSearchUrlforGoogleAnalytics();

        var appCode = window.localStorage['appOrigin'] ? window.localStorage['appOrigin'] : 'OIM'
        gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + ' - Botón Ver Movimientos', gaLabel: 'Botón: Ver Movimientos', gaValue: 'Periodo Regular' });
      }


  }]).component('nsctrSearchInsured',{
    templateUrl: '/nsctr/app/common/components/searchInsured/searchInsured.component.html',
    controller: 'nsctrSearchInsuredController'
  });

});