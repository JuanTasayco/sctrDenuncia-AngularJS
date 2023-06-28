'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs'
], function(angular, constants, nsctr_constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('miningTypeRegisterController',
    ['$rootScope', '$scope', '$state', 'mainServices', 'nsctrFactory', 'nsctrService', 'nsctrRoles',
    '$filter', '$timeout', '$stateParams', '$window',
    function($rootScope, $scope, $state, mainServices, nsctrFactory, nsctrService, nsctrRoles,
    $filter, $timeout, $stateParams, $window){
      /*########################
      # _self
      ########################*/
      var _self = this;
      /*########################
      # _loadList
      ########################*/
      function _loadList(){
        _self.data.clinicData = _self.data.clinicData || nsctrFactory.common.proxyLookup.ServicesAllClinics(true);
        _self.data.documentTypeData = _self.data.documentTypeData || nsctrFactory.common.proxyLookup.ServicesListDocumentType(nsctr_constants.insured.code, _self.MODULE.code, true);
        _self.data.aptitudeData = _self.data.aptitudeData || nsctrFactory.common.proxyLookup.ServicesAbleList(true);
        _self.data.contractData = _self.data.contractData || nsctrFactory.common.proxyLookup.ServicesEnterpriseList(true);
        _self.data.examTypeData = _self.data.examTypeData || nsctrFactory.common.proxyLookup.ServicesTestTypeList(true);
      }
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){

        _self.data = _self.data || {};

        _self.MODULE = $state.current.module;

        _self.showDownloadLink = (typeof _self.showDownloadLink === 'undefined')
                                  ? true
                                  : _self.showDownloadLink;
        _self.showButtonTabs = (typeof _self.showButtonTabs === 'undefined')
                                  ? true
                                  : _self.showButtonTabs;

        _self.data.fnFilterDate = _self.data.fnFilterDate || $filter('date');

        _self.data.TYPE_LOAD = _self.data.TYPE_LOAD || nsctr_constants.typeLoad;

        _self.data.activeTab = _self.data.activeTab || _self.data.TYPE_LOAD.massive.code;
        _self.data.selectMassiveLoad = (typeof _self.data.selectMassiveLoad == 'undefined')
                                          ? true
                                          : _self.data.selectMassiveLoad;
        _self.data.errorAttachFile = _self.data.errorAttachFile || false;

        if (_self.showButtonTabs){
          _loadList();
          _self.data.mNroDocumento = _self.data.mNroDocumento || new nsctrFactory.object.oDocumentNumber();
          var vAdult = mainServices.date.fnSubtract(new Date(), 18, 'Y');
          _self.data.mFechaNacimiento = _self.data.mFechaNacimiento || new nsctrFactory.object.oDatePicker(null, {initDate: vAdult, maxDate: vAdult}, {maxDate:vAdult});
          _self.data.mFechaExamen = _self.data.mFechaExamen || new nsctrFactory.object.oDatePicker();
        }
      };
      /*########################
      # _clearForm
      ########################*/
      function _clearForm(newTab){
        if (_self.data.TYPE_LOAD.massive.code == newTab){
          _self.data.mImportarPlanilla = ''
          _self.data.fmImportarPlanilla = '';
          _self.data.errorAttachFile = false;
          _self.data.selectMassiveLoad = true;
        }else{
          _self.data.mNroSolicitud = '';
          _self.data.mTipoDoc = {typeId: null};
          _self.data.mNroDocumento.setModel('');
          _self.data.mNombre = '';
          _self.data.mFechaNacimiento.setModel(null);
          _self.data.mAptitud = {code: null};
          _self.data.mContrata = {code: null};
          _self.data.mLocacion = {code: null};
          _self.data.mSustento = '';
          _self.data.mTipoExamen = {code: null};
          _self.data.mFechaExamen.setModel(null);
          _self.data.mDictamenCM = '';
          _self.data.mMenoscabo = '';
        }
      }
      /*########################
      # fnActiveTab
      ########################*/
      _self.fnActiveTab = function(newTab){
        return _self.data.activeTab === newTab;
      };
      /*########################
      # fnClickTab
      ########################*/
      _self.fnClickTab = function(newTab){
        if (_self.data.activeTab !== newTab){
          _clearForm(newTab);
          _self.data.activeTab = newTab;
        }
      };
      /*########################
      # fnDownloadPayroll
      ########################*/
      _self.fnDownloadPayroll = function(){
        var vUrl = (_self.typeRegister === 'evaluations')
                    ? nsctrFactory.common.proxyLookupFiles.CSServicesEvaluacionTemplateExcelMineria()
                    : nsctrFactory.common.proxyLookupFiles.CSServicesTemplateExcel(_self.MODULE);
        vUrl.then(
          function(data){
            console.log(data.file);
            mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
          }
        );
      }

      /*########################
      # fnChangeLoadFile
      ########################*/
      $scope.fnChangeLoadFile = function(){
        $timeout(function(){
          var vFile = _self.data.fmImportarPlanilla || {};
          _self.data.nameMassiveLoad = vFile[0].name;
          _self.data.selectMassiveLoad = false;
        }, 0);
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
      # fnParamsRequest_typeRegister
      ########################*/
      function _validateMassiveLoad(){
        var vValidate = _self.data.selectMassiveLoad;
        _self.data.errorAttachFile = vValidate;
        return !vValidate;
      }
      function _validateIndividualLoad(){
        _self.data.frmIndividual.markAsPristine();
        var vValidate = _self.data.frmIndividual.$valid;
        return vValidate;
      }
      function _validateForm(activeTab){
        var vValidate = (_self.data.TYPE_LOAD.massive.code == activeTab)
                          ? _validateMassiveLoad()
                          : _validateIndividualLoad();

        return vValidate;
      }
      function _paramsMassive(){
        var vFile = _self.data.fmImportarPlanilla || {},
            vParams = {
              DesPathFile:  vFile[0].name,
              File:  vFile[0]
            };
        return vParams;
      }
      function _paramsIndividual(){
        var vParams = {
          RequestNumber:        _self.data.mNroSolicitud || '',
          DocumentType:         (_self.data.mTipoDoc && _self.data.mTipoDoc.typeId)
                                  ? _self.data.mTipoDoc.typeId
                                  : '',
          DocumentNumber:       _self.data.mNroDocumento.model || '',
          Name:                 _self.data.mNombre || '',
          BirthDate:            _self.data.fnFilterDate(_self.data.mFechaNacimiento.model, constants.formats.dateFormat) || '',
          Able:                 (_self.data.mAptitud && _self.data.mAptitud.code)
                                  ? _self.data.mAptitud.code
                                  : '',
          LastEnterpriseId:     (_self.data.mContrata && _self.data.mContrata.code)
                                  ? _self.data.mContrata.code
                                  : '',
          LastLocationId:       (_self.data.mLocacion && _self.data.mLocacion.locationId)
                                  ? _self.data.mLocacion.locationId
                                  : '',
          Sustenance:           _self.data.mSustento || '',
          TestType:             (_self.data.mTipoExamen && _self.data.mTipoExamen.code)
                                  ? _self.data.mTipoExamen.code
                                  : '',
          TestDate:             _self.data.fnFilterDate(_self.data.mFechaExamen.model, constants.formats.dateFormat) || '',
          OpinionMedicalStaff:  _self.data.mDictamenCM || '',
          PadronMenoscabo:      _self.data.mMenoscabo || ''
        };
        return vParams;
      }
      function _params(activeTab){
        var vParams = (_self.data.TYPE_LOAD.massive.code == activeTab)
                        ? _paramsMassive()
                        : _paramsIndividual();
        return vParams;
      }
      $scope.$on('fnParamsRequest_typeRegister', function(event){
        var vActiveTab = _self.data.activeTab,
            vValid = _validateForm(vActiveTab),
            vParams;

        if (vValid) vParams = _params(vActiveTab);
        $scope.$emit('fnSendParams_typeRegister', vValid, vActiveTab, vParams);
      });

  }]).component('miningTypeRegister',{
    templateUrl: '/nsctr/app/mining/common/components/typeRegister/typeRegister.component.html',
    controller: 'miningTypeRegisterController',
    bindings: {
      typeRegister: '=?',
      title: '=?',
      showDownloadLink: '=?',
      showButtonTabs: '=?',
      data: '=?'
    }
  });
});