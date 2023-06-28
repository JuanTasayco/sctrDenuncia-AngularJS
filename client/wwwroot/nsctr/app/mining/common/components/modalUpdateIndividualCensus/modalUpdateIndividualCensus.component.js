'use strict';

define([
  'angular', 'constants', 'nsctr_constants', 'lodash',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs',
], function(angular, constants, nsctr_constants, _){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('miningModalUpdateIndividualCensusController',
    ['$rootScope', '$scope', '$state', 'mainServices', 'nsctrFactory', 'nsctrService', 'nsctrRoles',
    '$timeout', 'mpSpin', '$filter', 'mModalAlert', 'oimPrincipal',
    function($rootScope, $scope, $state, mainServices, nsctrFactory, nsctrService, nsctrRoles,
    $timeout, mpSpin, $filter, mModalAlert, oimPrincipal){
      /*########################
      # _self
      ########################*/
      var _self = this;
      /*########################
      # _loadList
      ########################*/
      function _loadList(){
        if (!_self.data.doctorData) _self.data.doctorData = nsctrFactory.common.proxyLookup.ServicesMedicList(false);
        if (!_self.data.clinicData) _self.data.clinicData = nsctrFactory.common.proxyLookup.ServicesAllClinics(false);
        if (!_self.data.documentTypeData) _self.data.documentTypeData = nsctrFactory.common.proxyLookup.ServicesListDocumentType(_self.CONSTANTS_NSCTR.insured.code, _self.CONSTANTS_NSCTR.mining.code, true);
        if (!_self.data.aptitudeData) _self.data.aptitudeData = nsctrFactory.common.proxyLookup.ServicesAbleList(true);
        if (!_self.data.contractData) _self.data.contractData = nsctrFactory.common.proxyLookup.ServicesEnterpriseList(true);
        if (!_self.data.examTypeData) _self.data.examTypeData = nsctrFactory.common.proxyLookup.ServicesTestTypeList(true);
      }
      /*########################
      # _setItem
      ########################*/
      function _setItem(data){
        _self.data.mMedico =                {code: data.medicId || null};
        _self.data.mClinica =               {code: data.clinicId};
        _self.data.mNroSolicitud =          data.requestNumber;
        _self.data.mTipoDoc =               {typeId: data.documentType};
        _self.data.mNroDocumento.setModel(data.documentNumber);
        _self.data.mNroDocumento.setFieldsToValidate(data.documentType);
        _self.data.mNombre =                data.name;
        _self.data.mFechaNacimiento.setModel(mainServices.datePicker.fnFormatIn(data.birthdate));
        _self.data.mAptitud =               {code: data.able};
        _self.data.mContrata =              {code: data.companyId};
        _self.data.mSustento =              data.sustenance;
        _self.data.mTipoExamen =            {code: data.examType};
        _self.data.mFechaExamen.setModel(mainServices.datePicker.fnFormatIn(data.examDate));
        _self.data.mDictamenCM =            data.verdict;
        _self.data.mMenoscabo =             data.lessening;

        if (_self.data.mContrata && _self.data.mContrata.code){
          // _self.data.locationData = [];
          _self.data.locationData = nsctrFactory.mining.proxyAssignments.ServicesGetAllLocationsByEnterprise(_self.data.mContrata.code, true);
          _self.data.mLocacion =    {locationId: data.locationId || null};
        }
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
        var vAdult = mainServices.date.fnSubtract(new Date(), 18, 'Y');
        _self.data.mFechaNacimiento = new nsctrFactory.object.oDatePicker(null, {initDate: vAdult, maxDate: vAdult}, {maxDate:vAdult});
        _self.data.mFechaExamen = new nsctrFactory.object.oDatePicker();

        _self.fnFilterDate = $filter('date');
        _loadList();
        _setItem(_self.mainData.item);
      };
      /*#########################
      # fnCloseModal
      #########################*/
      _self.fnCloseModal = function(actionButton){
        if (!actionButton) actionButton = constants.actionButton.cancel;
        $scope.$emit('fnCloseModal_modalUpdateIndividualCensus', actionButton);
      };
      /*########################
      #fnChangeDocumentType
      ########################*/
      _self.fnChangeDocumentType = function(documentType){
        var vDocumentType = (documentType)
                              ? documentType.typeId
                              : null;
        _self.data.mNroDocumento.setFieldsToValidate(vDocumentType);
      }
      /*########################
      # fnChangeContract
      ########################*/
      _self.fnChangeContract = function(contract){
        var vIdContract = contract.code || '';
        _self.data.locationData = [];
        if (vIdContract) _self.data.locationData = nsctrFactory.mining.proxyAssignments.ServicesGetAllLocationsByEnterprise(vIdContract, true);
      };
      /*########################
      # fnUpdateIndividualCensus
      ########################*/
      function _validateForm(){
        $scope.frmUpdateIndividualCensus.markAsPristine();
        return $scope.frmUpdateIndividualCensus.$valid;
      }
      function _paramsUpdateIndividualCensus(){
        var vParams = {
          clinicId:       (_self.data.mClinica && _self.data.mClinica.code)
                            ? _self.data.mClinica.code
                            : '',
          medicId :       (_self.data.mMedico && _self.data.mMedico.code)
                            ? _self.data.mMedico.code
                            : '',
          requestNumber:  _self.data.mNroSolicitud || '',
          documentType:   (_self.data.mTipoDoc && _self.data.mTipoDoc.typeId)
                            ? _self.data.mTipoDoc.typeId
                            : '',
          documentNumber: _self.data.mNroDocumento.model || '',
          fullName:       _self.data.mNombre || '',
          birthdate:      _self.fnFilterDate(_self.data.mFechaNacimiento.model, constants.formats.dateFormat) || '',
          able:           (_self.data.mAptitud && _self.data.mAptitud.code)
                            ? _self.data.mAptitud.code
                            : '',
          lastCompanyId:  (_self.data.mContrata && _self.data.mContrata.code)
                            ? _self.data.mContrata.code
                            : '',
          lastLocationId: (_self.data.mLocacion && _self.data.mLocacion.locationId)
                            ? _self.data.mLocacion.locationId
                            : '',
          support:        _self.data.mSustento || '',
          examType:       (_self.data.mTipoExamen && _self.data.mTipoExamen.code)
                            ? _self.data.mTipoExamen.code
                            : '',
          examDate:       _self.fnFilterDate(_self.data.mFechaExamen.model, constants.formats.dateFormat) || '',
          verdict:        _self.data.mDictamenCM || '',
          lessening:      _self.data.mMenoscabo || '',
          user:           _self.USER.name
        };
        return vParams;
      }
      _self.fnUpdateIndividualCensus = function(){
        var vParams = _paramsUpdateIndividualCensus();
        nsctrFactory.mining.proxyConsults.UpdateCensus(vParams, true).then(function(response){
          if (response.operationCode == constants.operationCode.success){
            mModalAlert.showSuccess('Datos actualizados exitosamente', '').then(function(alert){
              _self.fnCloseModal(constants.actionButton.acept);
            });
          }else{
            mModalAlert.showError(response.message, 'Error');
          }
        }, function(error){
          mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
        });
      };

  }]).component('miningModalUpdateIndividualCensus',{
    templateUrl: '/nsctr/app/mining/common/components/modalUpdateIndividualCensus/modalUpdateIndividualCensus.component.html',
    controller: 'miningModalUpdateIndividualCensusController',
    bindings: {
      mainData: '=',
      data: '=?'
    }
  });
});