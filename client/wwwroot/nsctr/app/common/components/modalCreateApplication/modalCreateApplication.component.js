'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs',
], function(angular, constants, nsctr_constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrModalCreateApplicationController',
    ['$scope', 'mainServices', 'nsctrFactory', 'nsctrService', 'nsctrRoles',
    'mModalAlert', '$filter', '$state',
    function($scope, mainServices, nsctrFactory, nsctrService, nsctrRoles,
    mModalAlert, $filter, $state){
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

        _self.MODULE = $state.current.module;

        _self.STATE_PARAMS = new nsctrFactory.object.oStateParams();
        _self.USER = new nsctrFactory.object.oUser();

        _self.fnFilterDate = $filter('date');

        _self.data.mFechaInicioVigencia = mainServices.date.fnStringToDate(_self.mainData.itemApplication.policyDateStart);
        _self.data.mFechaFinVigencia = mainServices.date.fnStringToDate(_self.mainData.itemApplication.policyDateEnd);
        var optFechaInicio = {
          minDate: _self.data.mFechaInicioVigencia,
          maxDate: mainServices.date.fnSubtract(_self.data.mFechaFinVigencia, 1, 'D')
        };
        _self.data.mFechaInicio = new nsctrFactory.object.oDatePicker(_self.data.mFechaInicioVigencia, optFechaInicio);
        _self.data.mFechaFin = new nsctrFactory.object.oDatePicker(_self.data.mFechaFinVigencia, optFechaInicio);
        _self.data.mFechaFin.setMaxDate(_self.data.mFechaFinVigencia);

      };
      /*#########################
      # fnCloseModal
      #########################*/
      _self.fnCloseModal = function(actionButton){
        if (!actionButton) actionButton = constants.actionButton.cancel;
        $scope.$emit('fnCloseModal_modalCreateApplication', actionButton);
      };
      /*########################
      # fnChangeCalendar
      ########################*/
      _self.fnChangeCalendar = function(){
        _self.data.mFechaFin.setMinDate(_self.data.mFechaInicio.model);
        if (_self.data.mFechaInicio.model >= _self.data.mFechaFin.model){
          var vEndDate = mainServices.date.fnAdd(_self.data.mFechaInicio.model, 1, 'D');
          _self.data.mFechaFin.setModel(vEndDate);
        }
      };
      /*########################
      # fnCreateApplication
      ########################*/
      function _validateForm(){
        var vMessage = new nsctrFactory.object.oMessageError(),
            vValidateForm = $scope.frmModalCreateApplication.$valid,
            vValid =  vValidateForm;

        if (!vValid){
          if (!vValidateForm){
            $scope.frmModalCreateApplication.markAsPristine();
          }
        }

        return {
          valid: vValid,
          message: vMessage
        };
      }
      function _paramsCreateApplication(){
        var vApplications = _self.mainData.itemApplication.applications,
            vParams = vApplications.map(function(elem, index) {
              return {
                NSCTRSystemType   : _self.MODULE.code,
                CodCia            : elem.ciaId,
                PolicyNumber      : elem.policyNumber,
                ApplicationNumber : elem.aplicationNumber,
                DateStart         : _self.fnFilterDate(_self.data.mFechaInicio.model, constants.formats.dateFormat),
                DateEnd           : _self.fnFilterDate(_self.data.mFechaFin.model, constants.formats.dateFormat),
                UserRegister      : _self.USER.name
              };
            });
        return vParams;
      }
      _self.fnCreateApplication = function(){
        var vValidateForm = _validateForm();
        if (vValidateForm.valid){
          var vParams = _paramsCreateApplication();
          nsctrFactory.common.proxyApplication.createCustomApplication(vParams, true).then(function(response){
            if (response.operationCode === constants.operationCode.success) {
              _self.fnCloseModal(constants.actionButton.acept);
            } else {
              mModalAlert.showWarning(response.message, 'ALERTA');
            }
          }, function(error){
            mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
          });
        } else {
          if (vValidateForm.message.type) vValidateForm.message.showModalAlert();
        }
      };


  }]).component('nsctrModalCreateApplication',{
    templateUrl: '/nsctr/app/common/components/modalCreateApplication/modalCreateApplication.component.html',
    controller: 'nsctrModalCreateApplicationController',
    bindings: {
      mainData: '=?',
      data: '=?'
    }
  });
});