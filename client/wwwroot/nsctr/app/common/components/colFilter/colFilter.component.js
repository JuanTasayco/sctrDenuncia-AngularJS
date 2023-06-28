'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs'
], function(angular, constants, nsctr_constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrColFilterController',
    ['$scope', '$state', 'mainServices', 'nsctrFactory', 'nsctrService', 'nsctrRoles',
    'accessSupplier', 'mModalAlert', 'oimPrincipal', 'gaService',
    function($scope, $state, mainServices, nsctrFactory, nsctrService, nsctrRoles,
    accessSupplier, mModalAlert, oimPrincipal, gaService){
      /*########################
      # _self, oimClaims
      ########################*/
      var _self = this,
          oimClaims = accessSupplier.profile();

      
      /*########################
      # _loadList
      ########################*/
      function _loadList(){
        _self.data.tipoDocFilterData = nsctrFactory.common.proxyLookup.ServicesListDocumentType(nsctr_constants.client.code, _self.MODULE.code, true);
      }
      /*########################
      # showAutocompletes
      ########################*/
      /*function _showAutocompleteGestor(){
        var vResult = _self.USER.role === nsctrRoles.ADMINISTRADOR_COMERCIAL 
          || _self.USER.role === nsctrRoles.EAC 
          || _self.USER.role === nsctrRoles.DIRECTOR 
          || _self.USER.isAdmin;
        return vResult;
      }*/
      function _showAutocompleteAgent(){
       /* var vResult =  _filterData(_self.securityOptions[0].items, 'FILTRO_AGENTE').length > 0 &&
        (_self.USER.role === nsctrRoles.ADMINISTRADOR_COMERCIAL 
          || _self.USER.role === nsctrRoles.GESTOR_CORREDORES 
          || _self.USER.role === nsctrRoles.EAC 
          || _self.USER.role === nsctrRoles.DIRECTOR 
          || _self.USER.isAdmin);*/
        return true;
      }
      /*########################
      # _showGestor
      ########################*/
      function _showLabelGestor(){
        if (oimClaims.gestorId !== '0'){
          _self.data.mGestorFilter = {
            id:     oimClaims.gestorId,
            idName: oimClaims.gestorId + ' - ' + oimClaims.gestorName
          };
        }else{
          _self.data.mGestorFilter = {
            id:     '0',
            idName: ' - '
          };
        }
      }
      /*########################
      # _showAgent
      ########################*/
      function _showLabelAgent(){
        if (oimClaims.agentID !== '0'){
          _self.data.mAgenteFilter = {
            id:     oimClaims.agentID,
            idName: oimClaims.agentID + ' - ' + oimClaims.agentName
          };
        }
      }
      /*########################
      # _clearFilter
      ########################*/
      function _clearFilter(){
        var vFilter = _self.data;
        if (_self.showAutocompleteGestor) vFilter.mGestorFilter = undefined;
        if (_self.showAutocompleteAgent) vFilter.mAgenteFilter = undefined;
        vFilter.mTipoDocFilter = {
          typeId: null
        };
        vFilter.mNroDocumentoFilter.setModel('');
        vFilter.mNroDocumentoFilter.setFieldsToValidate(null);
        vFilter.mRazonSocialFilter = '';
        vFilter.mNumPolizaFilter = '';
      }
      /*########################
      # fnAutocompleteManager
      ########################*/
      $scope.fnAutocompleteManager = function(value){
        return nsctrFactory.common.proxyLookup.ServicesAutocompleteManager(value, false);
      };
      /*########################
      # fnAutocompleteAgent
      ########################*/
      $scope.fnAutocompleteAgent = function(value){
        var vValue = value.replace('&', '@');
        var vIdGestor = (typeof _self.data.mGestorFilter === 'undefined')
                          ? '0'
                          : _self.data.mGestorFilter.id;
        return nsctrFactory.common.proxyLookup.ServicesAutocompleteAgent(vIdGestor, vValue, false);
      };
      /*########################
      # fnChangeDocumentType
      ########################*/
      $scope.fnChangeDocumentType = function(documentType){
        var vDocumentType = (documentType)
                              ? documentType.typeId
                              : null;
        _self.data.mNroDocumentoFilter.setFieldsToValidate(vDocumentType);
      };
      /*########################
      # fnFilter
      ########################*/
      function _validateFilterFields(){
        var vValidate = _self.data.mNumPolizaFilter !== ''
                        || (_self.data.mTipoDocFilter && _self.data.mTipoDocFilter.typeId != null)
                        || _self.data.mNroDocumentoFilter.model !== ''
                        || _self.data.mRazonSocialFilter !== '';
        if ($scope.showAutocompleteAgent){
          var vAutocompleteAgent = (_self.data.mAgenteFilter && _self.data.mAgenteFilter.id !== '')
          vValidate = vValidate || vAutocompleteAgent;
        }
        return vValidate;
      }
      function _validateFilter(){
        if (_validateFilterFields()){
          $scope.frmColFilter.markAsPristine();
          return $scope.frmColFilter.$valid;
        }else{
          mModalAlert.showWarning('Debe ingresar como mínimo un filtro', 'ALERTA', null, 3000);
          return false;
        }
      }
      function _paramsFilter(){
        var vParams = {
          NSCTRSystemType:  _self.MODULE.code,
          agentId :         (_self.data.mAgenteFilter)
                              ? _self.data.mAgenteFilter.id
                              : '',
          polizaNumber :    _self.data.mNumPolizaFilter || '',
          documentType :    (_self.data.mTipoDocFilter && _self.data.mTipoDocFilter.typeId !== null)
                              ? _self.data.mTipoDocFilter.typeId
                              : '',
          documentNumber :  _self.data.mNroDocumentoFilter.model || '',
          companyName :     _self.data.mRazonSocialFilter || '',
          rowByPage :       '10',
          orderBy :         ''
        };
        return vParams;
      }
      $scope.fnFilter = function(isPagination){
        if (_validateFilter()){
          var vParams = _paramsFilter();
          $scope.$emit('fnFilter_colFilter', vParams, isPagination);
        }
        var textToAnalytics = nsctrService.fnSearchUrlforGoogleAnalytics();

        setTimeout(function () {
          var appCode = window.localStorage['appOrigin'] ? window.localStorage['appOrigin'] : 'OIM'
          gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + ' - Botón Filtrar', gaLabel: 'Botón: Filtrar', gaValue: 'Periodo Regular' });
        }, 300);
      };
      /*########################
      # fnChangePage
      ########################*/
      $scope.$on('fnChangePage_colFilter', function(event, isPagination) {
        $scope.fnFilter(isPagination);
      });
      /*########################
      # clearFilter
      ########################*/
      $scope.fnClearFilter = function(){
        _clearFilter();
        $scope.$emit('fnClearFilter_colFilter');
      };

      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){
        _self.data = _self.data || {};
        _self.securityOptions = {};

        _self.MODULE = $state.current.module;
        _self.USER = new nsctrFactory.object.oUser();

        _self.data.mNroDocumentoFilter = new nsctrFactory.object.oDocumentNumber();

        _loadList();

        _clearFilter();
        nsctrFactory.menu.proxyMenu.GetSubMenu(_self.MODULE.appCode, true).then(function(response){
          var segurity = nsctrFactory.validation._filterData(response.data, "PROCESOS_ACCIONES", "nombreCabecera");
          //_self.securityOptions = nsctrFactory.validation._filterData(response.data, "PROCESOS_ACCIONES", "nombreCabecera");
          _self.showAutocompleteGestor = nsctrFactory.validation._filterData(segurity.items, 'FILTRO_GESTOR', "nombreCorto");
          _self.showAutocompleteAgent = nsctrFactory.validation._filterData(segurity.items, 'FILTRO_AGENTE', "nombreCorto");
          if (!_self.showAutocompleteGestor) _showLabelGestor();
          if (!_self.showAutocompleteAgent) _showLabelAgent();
         // console.log(_filterData(_self.securityOptions[0].items, "PROCESOS_ACCIONES"));
        });
      };

  }]).component('nsctrColFilter',{
    templateUrl: '/nsctr/app/common/components/colFilter/colFilter.component.html',
    controller: 'nsctrColFilterController',
    bindings: {
      data: '=?'
    }
  });
});