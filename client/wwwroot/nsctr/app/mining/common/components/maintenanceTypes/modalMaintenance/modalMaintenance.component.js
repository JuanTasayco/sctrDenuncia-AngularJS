'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
], function(ng, constants, nsctr_constants){

  var appNsctr = ng.module('appNsctr');

  appNsctr.controller('miningModalMaintenanceController',
    ['$scope', '$uibModal', 'nsctrService', 'nsctrFactory', 'mainServices', 'mModalAlert',
    function($scope, $uibModal, nsctrService, nsctrFactory, mainServices, mModalAlert){
      /*########################
      # _self
      ########################*/
      var _self = this;
      /*########################
      # _setConfig
      ########################*/
      function _setConfig(mainData, data){
        data.title = 'Datos Generales';
        data.showInformation = (mainData.actionType == 'U');
        data.textActionButton = (mainData.actionType == 'A')
                                  ? 'CREAR'
                                  : 'ACTUALIZAR';

        switch (mainData.maintenanceType){
          case _self.CONSTANTS_NSCTR.medic.code:
            if (mainData.actionType == 'A') data.title = 'Nuevo Médico';
            break;
          case _self.CONSTANTS_NSCTR.location.code:
            if (mainData.actionType == 'A') data.title = 'Nueva Locación';
            break;
        }
      }
      /*########################
      # _setItem
      ########################*/
      function _setItem(mainData, data){
        var vItem = mainData.item,
            vDocumentType = (mainData.maintenanceType == _self.CONSTANTS_NSCTR.location.code)
                              ? 'RUC'
                              : vItem.documentType || null,
            vStateCode = (mainData.maintenanceType == _self.CONSTANTS_NSCTR.location.code)
                        ? 'V'
                        : 'N';

        data.mTipoDocumento = {
          typeId: vDocumentType
        };
        data.mNroDocumento.setModel(vItem.documentNumber || '');
        data.mNroDocumento.setFieldsToValidate(vDocumentType);
        data.mName = vItem.name || '';
        data.mEstado = {
          code: vItem.idState || vStateCode
        };
        data.disabledDocumentType = (mainData.maintenanceType == 'LOC');
      }
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){

        _self.mainData = _self.mainData || {};
        _self.data = _self.data || {};

        _self.CONSTANTS_NSCTR = _self.CONSTANTS_NSCTR || nsctr_constants;

        _self.data.USER = _self.data.USER || new nsctrFactory.object.oUser();

        _setConfig(_self.mainData, _self.data);

        _self.data.mNroDocumento = new nsctrFactory.object.oDocumentNumber();

        var vActionType = (_self.mainData.maintenanceType === _self.CONSTANTS_NSCTR.location.code)
                            ? _self.CONSTANTS_NSCTR.client.code
                            : _self.CONSTANTS_NSCTR.insured.code
        _self.data.documentTypeData = _self.data.documentTypeData || nsctrFactory.common.proxyLookup.ServicesListDocumentType(vActionType, _self.CONSTANTS_NSCTR.mining.code, true);
        _self.data.statusData = _self.data.statusData || nsctrFactory.common.proxyLookup.ServicesStatesLocationMedicList(_self.mainData.maintenanceType, true);

        _setItem(_self.mainData, _self.data);

      };
      /*#########################
      # _actionButton
      #########################*/
      function _actionButton(action){
        // actions:
        // '' = CANCEL
        // A  = ADD
        // U  = UPDATE
        $scope.$emit('fnActionButton_modalMaintenance', action);
      }
      /*########################
      # fnChangeDocumentType
      ########################*/
      _self.fnCancelModal = function(){
        _actionButton()
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
      # fnActionButton
      ########################*/
      function _validateForm(){
        var vMessage = new nsctrFactory.object.oMessageError(),
            vValidateForm = $scope.frmMaintenance.$valid,
            vValid =  vValidateForm;

        if (!vValid){
          if (!vValidateForm){
            $scope.frmMaintenance.markAsPristine();
          }
        }
        return {
          valid: vValid,
          message: vMessage
        };
      }
      function _paramsSaveMaintenence(){
        var vParams = {
          Id            : _self.mainData.item.id,
          DocumentNumber: _self.data.mNroDocumento.model || '',
          Name          : _self.data.mName || '',
          Status        : (_self.data.mEstado && _self.data.mEstado.code !== null)
                            ? _self.data.mEstado.code
                            : '',
          UserId        : _self.data.USER.name
        };
        return vParams;
      }
      _self.fnActionButton = function(){
        var vValidateForm = _validateForm();
        if (vValidateForm.valid){
          var vParams = _paramsSaveMaintenence(),
              vMessageAlert = {
                A: 'Se creo con éxito el registro',
                U: 'Se actualizaron con éxito los datos'
              };
          nsctrFactory.mining.proxyCommon.CSServicesSaveMaintenance(_self.mainData.maintenanceType, _self.mainData.actionType, vParams, true).then(function(response){
            if (response.operationCode == constants.operationCode.success){
              mModalAlert.showSuccess(vMessageAlert[_self.mainData.actionType], '').then(function(alert){
                _actionButton(_self.mainData.actionType);
              });
            }else{
              mModalAlert.showError(response.message, 'Error');
            }
          }, function(error){
            mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
          });
        }else{
          if (vValidateForm.message.type) vValidateForm.message.showModalAlert();
        }
      }

    }
  ]).component('miningModalMaintenance',{
      templateUrl: '/nsctr/app/mining/common/components/maintenanceTypes/modalMaintenance/modalMaintenance.component.html',
      controller: 'miningModalMaintenanceController',
      bindings: {
        mainData: '=?',
        data: '=?'
      }
    });
});

