'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
  'nsctrFactoryJs', 'nsctrServiceJs'
], function(angular, constants, nsctr_constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrModalGenerateProofController',
    ['$scope', '$window', '$state', '$stateParams', 'mainServices', 'nsctrFactory', 'nsctrService', 'mModalConfirm',
    'mModalAlert', '$timeout','gaService', 
    function($scope, $window, $state, $stateParams, mainServices, nsctrFactory, nsctrService, mModalConfirm,
    mModalAlert, $timeout, gaService){
    /*########################
    # _self
    ########################*/
    var _self = this;
    
    /*########################
    # $onInit
    ########################*/
    _self.$onInit = function(){

      _self.constants = _self.constants || {};
      _self.mainData = _self.mainData || {};
      _self.data = _self.data || {};
      _self.movementNumber = ""
      _self.dataS1 = {};
      _self.data.MODULE = $state.current.module;
      _self.data.USER = new nsctrFactory.object.oUser();
      _self.data.STATE_PARAMS = new nsctrFactory.object.oStateParams();

      _self.data.IS_MASSIVE = (nsctr_constants.typeLoad.massive.code == _self.typeLoad);
      if (_self.data.IS_MASSIVE) _self.data.selectMassiveLoad = true;

    };
    /*#########################
    # fnCloseModal
    #########################*/
    _self.fnCloseModal = function(actionButton){
      if (!actionButton) actionButton = constants.actionButton.cancel;
      $scope.$emit('fnCloseModal_modalGenerateProof', actionButton);
    };
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
    # fnPrintProof
    ########################*/
    function _validateIndividual(){
      $scope.frmGenerateProof.markAsPristine();
      return $scope.frmGenerateProof.$valid;
    }
    function _validateMassive(){
      var vValidate = _self.data.selectMassiveLoad;
      _self.data.errorAttachFile = vValidate;
      return !vValidate && _validateIndividual();
    }
    function _validatePrintProof(isMassive){
      var vValid = (isMassive)
                      ? _validateMassive()
                      : _validateIndividual();
      return {
        valid: vValid
      };
    }
    function _listPolicyApplication(){
      var vSelectedApplications =_self.data.STATE_PARAMS['selectedApplications'],
          vListPolicyApplication = vSelectedApplications.map(function(value1, key1){
            var vItem = {
              PolicyType:             value1.applicationType,
              PolicyNumber:           value1.policyNumber,
              DeclarationType:        value1.declarationType,
              McaFicticio:            value1.unTrue,
              CiaId:                  value1.ciaId,
              Application:            value1.aplicationNumber,
              Spto:                   value1.sptoNumber,
              SptoApplication:        value1.sptoAplicationNumber,
              ApplicationDateStart:   value1.policyDateStart,
              ApplicationDateFinish:  value1.policyDateEnd
            };
            return vItem;
          });
      return vListPolicyApplication;
    }
    function _selectedEmployeeList(checkAll){
      var vSelectedEmployeeList = [];
      if (!checkAll){
        var vSelectedWorkers = _self.mainData.selectedWorkers;
        vSelectedEmployeeList = vSelectedWorkers.map(function(value1, key1){
          if (value1.mCheck){
            var vItem = {
              DocumentType:   value1.documentType,
              DocumentNumber: value1.documentNumber,
              FathersSurname: value1.fathersSurname,
              MothersSurname: value1.mothersSurname,
              Name:           value1.name,
              FullName:       value1.fullName,
              Salary:         value1.salary,
              BirthDate:      value1.birthDate,
              Occupation:     value1.occupation,
              pensionRisk:    value1.pensionRisk || '0',  //PARA MINIERIA
              healthRisk:     value1.healthRisk || '0'    //PARA MINIERIA
            };
            return vItem;
          }
        });
      }
      return vSelectedEmployeeList;
    }
    function _paramsIndividual(isMassive,ShowInsured){
      var vCheckAll = (isMassive) ? isMassive : _self.mainData.mCheckAll,
          vParams = {
            NSCTRSystemType:        _self.data.MODULE.code,
            ShowInsured :                  ShowInsured,
            movementNumber:                _self.movementNumber,
            ClientDocumentNumber:   _self.data.STATE_PARAMS['client'].documentNumber,
            ClientDocumentType:     _self.data.STATE_PARAMS['client'].documentType,
            Usuario:                _self.data.USER.name,
            Work:                   _self.data.mDatosObra ? _self.data.mDatosObra.toUpperCase() : '',
            OperationType:          nsctr_constants.movementType.proof.code, //WC
            CheckAll:               vCheckAll,
            ListPolicyApplication:  _listPolicyApplication(),
            ListEmployee:           _selectedEmployeeList(vCheckAll)
          };
      return vParams;
    }
    function _paramsMassive(ShowInsured){
      var vParamsIndividual = JSON.stringify(_paramsIndividual(_self.data.IS_MASSIVE,ShowInsured)),

          vFile = _self.data.fmImportarPlanilla || {},
          vParams = {
            ReImprimeJson:  vParamsIndividual,
            DesPathFile:    vFile[0].name,
            File:           vFile[0]
        };
      return vParams;
    }
    function _paramsPrintProof(isMassive,ShowInsured){
      var vParams = (isMassive)
                      ? _paramsMassive(ShowInsured)
                      : _paramsIndividual(ShowInsured);
      return vParams;
    }
    _self.fnPrintProof = function () {
      var appCode = window.localStorage['appOrigin'] ? window.localStorage['appOrigin'] : 'OIM'
      var textToAnalytics = nsctrService.fnSearchUrlforGoogleAnalytics();
      var type = (_self.typeLoad == 'I') ? 'Individual' : 'Masiva'
      gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + ' - Botón Generar Constancia / ' +type  , gaLabel: 'Botón: Generar Constancia', gaValue: 'Procesos Declarar' });
      var ShowInsured=false;
        var vValidate = _validatePrintProof(_self.data.IS_MASSIVE);
        if (vValidate.valid){
          var vParams = _paramsPrintProof(_self.data.IS_MASSIVE,ShowInsured);
          _self.movementNumber="";
          nsctrFactory.common.proxyDeclarationAdmin.CSServicesRePrintEmployees(_self.typeLoad, vParams, true).then(function(response){
              switch (response.operationCode){
                case constants.operationCode.success:
                  var vData = (_self.data.IS_MASSIVE)
                                ? response.data.data
                                : response.data;
                  _self.fnCloseModal(constants.actionButton.acept);
                  mModalAlert.showSuccess('Se generó la Constancia ' + vData.fullConstancyNumber + ' con éxito', '', null, null, 'DESCARGAR CONSTANCIA').then(function(download){
                    gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + ' - Botón Descargar Constancia / ' + type, gaLabel: 'Botón: Descargar Constancia' });
                    nsctrFactory.common.proxyConstancy.ServicesDownloadConstancy(vData.constancyNumber,true).then(function (response) {
                      mainServices.fnDownloadFileBase64(response.data, "pdf",'Constancia_'+vData.constancyNumber, false);
                    })
                  });
                  break;
                case constants.operationCode.code900:
                  var vError = (_self.data.IS_MASSIVE)
                                ? response.data.errorMessages
                                : response.data.internalError;
                  mModalAlert.showError(nsctrService.fnHtmlErrorLoadFile(vError),'ERROR CONSTANCIA');
                  break;
                case constants.operationCode.code902:
                  var vError = nsctrService.fnHtmlErrorLoadFile(response.data.errorMessages);
                  mModalAlert.showError(vError,'ERROR CONSTANCIA');
                  break;
                case constants.operationCode.code903:
                  var vData = (_self.data.IS_MASSIVE)
                                      ? response.data.data
                                      : response.data;
                        _self.fnCloseModal(constants.actionButton.acept);
                        mModalAlert.showSuccess('Se generó la Constancia ' + vData.fullConstancyNumber + ' con éxito', '', null, null, 'DESCARGAR CONSTANCIA').then(function(download){
                          gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + ' - Botón Descargar Constancia / ' + type, gaLabel: 'Botón: Descargar Constancia'});
                          nsctrFactory.common.proxyConstancy.ServicesDownloadConstancy(vData.constancyNumber,true).then(function (response) {
                            mainServices.fnDownloadFileBase64(response.data, "pdf",'Constancia_'+vData.constancyNumber, false);
                          })
                        });
                break;
              }
          }).catch(function(error) {
            mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
          });
        }
    }
    _self.fnProcessExcell = function () {
      var ShowInsured=true;
        var vValidate = _validatePrintProof(_self.data.IS_MASSIVE);
        if (vValidate.valid){
          var vParams = _paramsPrintProof(_self.data.IS_MASSIVE,ShowInsured);
         _self.movementNumber="";
          nsctrFactory.common.proxyDeclarationAdmin.CSServicesRePrintEmployees(_self.typeLoad, vParams, true).then(function(response){
            switch (response.operationCode){
              case constants.operationCode.success:
                  _self.dataS1 = response.data;
                  _self.movementNumber = response.data.data.movementNumber || ''
                break;
              case constants.operationCode.code900:
                var vError = (_self.data.IS_MASSIVE)
                              ? response.data.errorMessages
                              : response.data.internalError;
                mModalAlert.showError(nsctrService.fnHtmlErrorLoadFile(vError),'ERROR CONSTANCIA');
                break;
              case constants.operationCode.code902:
                var vError = nsctrService.fnHtmlErrorLoadFile(response.data.errorMessages);
                mModalAlert.showError(vError,'ERROR CONSTANCIA');
                break;
              case constants.operationCode.code903:
                var vErrorHTML = nsctrService.fnGenerateHtmlErrorTable(nsctr_constants.errorTable.et1, response.data.employeeInPayrollList.message, response.data.employeeInPayrollList.list);
                mModalConfirm.confirmWarning(
                  vErrorHTML,
                  'CONSTANCIA',
                  'ACEPTAR')
                  .then(function(confirm){
                    if (confirm) {
                      _self.dataS1 = response.data;
                      _self.movementNumber = response.data.data.movementNumber || ''
                    }
                }, function(otherOptions){
                  return false;
                });
              break;
            }
          }).catch(function(error) {
            mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
          });
        }
    }

  }]).component('nsctrModalGenerateProof',{
    templateUrl: '/nsctr/app/common/components/proofs/modalGenerateProof/modalGenerateProof.component.html',
    controller: 'nsctrModalGenerateProofController',
    bindings: {
      typeLoad:   '=',
      constants:  '=?',
      mainData:   '=?',
      data:       '=?'
    }
  });

});
