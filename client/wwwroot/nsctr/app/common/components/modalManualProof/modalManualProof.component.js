'use strict';

define([
  'angular', 'constants', 'nsctr_constants', 'lodash', 
'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs','nsctrWorkersList','nsctrModalReniecListJs',
], function(angular, constants, nsctr_constants, _){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrModalManualProofController',
    ['$scope', 'mainServices', 'nsctrFactory', 'nsctrService', 'nsctrRoles', 'oimPrincipal',
    'mModalAlert', '$timeout', '$filter', '$stateParams', '$window', '$state','$uibModal',
    function($scope, mainServices, nsctrFactory, nsctrService, nsctrRoles, oimPrincipal,
    mModalAlert, $timeout, $filter, $stateParams, $window, $state,$uibModal){
      /*########################
      # _self
      ########################*/
      var _self = this;
      /*########################
      # _setAttachFile
      ########################*/
      function _setAttachFile(file){
        var vExistFile = file || false;
        _self.data.titleAttachFile = (vExistFile)
                                        ? 'Adjunto'
                                        : 'Planilla Excel';
        _self.data.nameAttachedFile = (vExistFile)
                                        ? file[0].name
                                        : '';
        _self.data.attachFile = !vExistFile;
        _self.data.errorAttachFile = false;
      }
      /*########################
      # _getSelectedPolicy
      ########################*/
      function _getSelectedPolicy(selectedPolicies){
        var vPolicy = {
          pensionPolicyNumber: null,
          healthPolicyNumber: null
        };
        angular.forEach(selectedPolicies, function(value1, key1){
          if (value1.mCheckPension) vPolicy.pensionPolicyNumber = value1.pensionPolicyNumber;
          if (value1.mCheckHealth) vPolicy.healthPolicyNumber = value1.healthPolicyNumber;
        });
        return vPolicy;
      }

      function _setCoverages(selectedPolicies) {
        var vPolicies = _getSelectedPolicy(selectedPolicies);
        var vParams = {
          ciaId:        (vPolicies.pensionPolicyNumber)
                          ? nsctr_constants.pension.codeCompany
                          : nsctr_constants.health.codeCompany,
          policyNumber: (vPolicies.pensionPolicyNumber)
                          ? vPolicies.pensionPolicyNumber
                          : vPolicies.healthPolicyNumber
            };
        _self.data.vigenciaData = [];
        nsctrFactory.common.proxyManualConstancy.ServicesPolicyValidities(vParams.ciaId, vParams.policyNumber, true)
          .then(function(response) {
            _self.data.vigenciaData = response.data;
            var optionsDatePicker = {
              minDate: mainServices.date.fnStringToDate(response.data[0].policyStart),
              maxDate: mainServices.date.fnStringToDate(response.data[response.data.length - 1].policyEnd)
            };
            _self.data.mInicioCobertura.setModel(optionsDatePicker.minDate);
            _self.data.mInicioCobertura.setOptions(optionsDatePicker);
            _self.data.mFinCobertura.setModel(optionsDatePicker.maxDate);
            _self.data.mFinCobertura.setOptions(optionsDatePicker);
          });
      }
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){

        _self.mainData = _self.mainData || {};
        _self.data = _self.data || {};
        _self.movementNumber = ""
        _self.validateProcess= false;
        _self.dataS1 = {};
        _self.MODULE = $state.current.module;

        _self.STATE_PARAMS = new nsctrFactory.object.oStateParams();
        _self.USER = new nsctrFactory.object.oUser();

        _self.fnFilterDate = $filter('date');

        _self.data.mOptionCobertura = '1';
        _self.data.mInicioCobertura = new nsctrFactory.object.oDatePicker();
        _self.data.mFinCobertura = new nsctrFactory.object.oDatePicker();
        _setCoverages(_self.mainData.selectedPolicies);
        _setAttachFile();

      };
      /*#########################
      # fnCloseModal
      #########################*/
      function _closeModal(){
        $scope.$emit('fnCloseModal_modalManualProof');
      }
      _self.fnCloseModal = function(){
        _closeModal();
      };
      /*########################
      # fnChangeCalendar
      ########################*/
      _self.fnChangeCalendar = function(){
        _self.data.mFinCobertura.setMinDate(_self.data.mInicioCobertura.model);
        if (_self.data.mInicioCobertura.model > _self.data.mFinCobertura.model){
          _self.data.mFinCobertura.setModel(_self.data.mInicioCobertura.model);
        }
      };
      /*#########################
      # fnChangedAttachedFile
      #########################*/
      $scope.fnChangedAttachedFile = function(){
        $timeout(function(){
          var vFile = _self.data.fmCargarPlanilla || {};
          _setAttachFile(vFile);
        }, 0);
      };
      /*#########################
      # fnDeleteAttachedFile
      #########################*/
      _self.fnDeleteAttachedFile = function(){
        _setAttachFile();
      };
      /*#########################
      # fnSave
      #########################*/
      function _validateForm(){
        $scope.frmModalManualProof.markAsPristine();
        //attachFile
        _self.data.errorAttachFile = _self.data.attachFile;
        return $scope.frmModalManualProof.$valid && !_self.data.errorAttachFile;
      }

      function _getConstancyDate(optionCoverage){
        var vConstancyDate = {
          start:  '',
          end:    ''
        };
        if (optionCoverage == '1'){
          var vCoverageDate = _self.data.mVigencia.validityCode.split('-')
          vConstancyDate.start = vCoverageDate[0];
          vConstancyDate.end = vCoverageDate[1];
        }else{
          vConstancyDate.start = _self.fnFilterDate(_self.data.mInicioCobertura.model, constants.formats.dateFormat);
          vConstancyDate.end = _self.fnFilterDate(_self.data.mFinCobertura.model, constants.formats.dateFormat);
        }
        return vConstancyDate;
      }

      function _isSelectedVigencia() {
        return _self.data.mOptionCobertura === '1';
      }

      function _paramsManualProof(ShowInsured){
        var vObjPolicy = _getSelectedPolicy(_self.mainData.selectedPolicies),
            vConstancyDate = _getConstancyDate(_self.data.mOptionCobertura),
            vFile = _self.data.fmCargarPlanilla || {},
            vManualConstancyJson = {
              NSCTRSystemType:              _self.MODULE.code,
              ShowInsured :                  ShowInsured  || false,
              movementNumber:                _self.movementNumber,
              ClientDocumentNumber:         _self.STATE_PARAMS['client'].documentNumber,
              ClientDocumentType:           _self.STATE_PARAMS['client'].documentType,
              UserCode:                     _self.USER.name,
              ConstancyDateStart:           vConstancyDate.start,
              ConstancyDateEnd:             vConstancyDate.end,
              Ubication:                    _self.data.mCentroTrabajo || '',
              ClientName:                   _self.STATE_PARAMS['client'].clientName,
              HealthPolicyNumber:           vObjPolicy.healthPolicyNumber,
              HealthCiaId:                  (vObjPolicy.healthPolicyNumber)
                                              ? nsctr_constants.health.codeCompany
                                              : 0,
              HealthRamoId:                 (vObjPolicy.healthPolicyNumber)
                                              ? nsctr_constants.health.codeRamo
                                              : 0,
              PensionPolicyNumber:          vObjPolicy.pensionPolicyNumber,
              PensionCiaId:                 (vObjPolicy.pensionPolicyNumber)
                                              ? nsctr_constants.pension.codeCompany
                                              : 0,
              PensionRamoId:                (vObjPolicy.pensionPolicyNumber)
                                              ? nsctr_constants.pension.codeRamo
                                              : 0,
              HealthSptoNumber:             _isSelectedVigencia()
                                              ? _self.data.mVigencia.sptoNumber
                                              : 0,
              HealthApplicationNumber:      _isSelectedVigencia()
                                              ? _self.data.mVigencia.aplicationNumber
                                              : 0,
              HealthSptoAplicationNumber:   _isSelectedVigencia()
                                              ? _self.data.mVigencia.sptoAplicationNumber
                                              : 0,
              PensionSptoNumber:            _isSelectedVigencia()
                                              ? _self.data.mVigencia.sptoNumber
                                              : 0,
              PensionApplicationNumber:     _isSelectedVigencia()
                                              ? _self.data.mVigencia.aplicationNumber
                                              : 0,
              PensionSptoAplicationNumber:  _isSelectedVigencia()
                                              ? _self.data.mVigencia.sptoAplicationNumber
                                              : 0
            };

        return {
          ManualConstancyJson:  JSON.stringify(vManualConstancyJson),
          FieldNameHere:        vFile[0]
        };
      }
      _self.fnSave = function() {
        if (_validateForm()) {
          var vParams = _paramsManualProof();
          if(_self.validateProcess){
              nsctrFactory.common.proxyManualConstancy.CSGenerateManualConstancy(vParams, true)
              .then(function(response) {
                var vData, vError;
                switch (response.operationCode) {
                  case constants.operationCode.success:
                    vData = response.data.data;
                    _closeModal(true);
                    mModalAlert.showSuccess('Se registró la Constancia Manual ' + vData.constancyNumber + ' con éxito', '', null, null, 'DESCARGAR CONSTANCIA')
                      .then(function() {
                        nsctrFactory.common.proxyConstancy.ServicesDownloadConstancy(vData.constancyNumber,true).then(function (response) {
                          mainServices.fnDownloadFileBase64(response.data, "pdf",'Constancia_'+vData.constancyNumber, false);
                        })
                      });
                    break;
                  case constants.operationCode.code900:
                    
                    function detail(n){
                      var res = n.split(" | ");
                      return {
                        alertRow: res[0],
                        alertErrorMessage: res[1]
                      };
                    }
      
                  _self.reniecList = {
                    mainData: {
                      reniecList: _.map(response.data.errorMessages, detail)
                    },
                    data: {}
                  };
                  var vConfigModal = nsctrService.fnDefaultModalOptions($scope, {
                    template: '<nsctr-modal-reniec-list main-data="$ctrl.reniecList.mainData" data="$ctrl.reniecList.data"></nsctr-modal-reniec-list>',
                    windowClass : "g-modal-overlap "
                  });
                  vConfigModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
                    function ($scope, $uibModalInstance, $uibModal) {
                      $scope.$on('fnActionButton_modalReniecList', function (event, action) {
                        $uibModalInstance.close();
                        _self.dataS1 = response.data;
                        _self.movementNumber = response.data.data.movementNumber
                        _self.validateProcess= true;
                      });
                    }];
                    $uibModal.open(vConfigModal);

                    break;
                  case constants.operationCode.code902:
                    vError = nsctrService.fnHtmlErrorLoadFile(response.data.errorMessages);
                    mModalAlert.showError(vError,'ERROR CONSTANCIA');
                    break;
                }  
              }).catch(function() {
                mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
              });
            }
        }
      };

   _self.fnProcessExcell = function () {
    var ShowInsured= true
    if (_validateForm()) {
      var vParams = _paramsManualProof(ShowInsured);
        nsctrFactory.common.proxyManualConstancy.CSGenerateManualConstancy(vParams, true)
        .then(function(response) {
          var  vError;
          switch (response.operationCode) {
            case constants.operationCode.success:
              _self.dataS1 = response.data;
              _self.movementNumber = response.data.data.movementNumber
              _self.validateProcess= true;
              break;
            case constants.operationCode.code900:

              function detail(n){
                var res = n.split(" | ");
                return {
                  alertRow: res[0],
                  alertErrorMessage: res[1]
                };
              }

            _self.reniecList = {
              mainData: {
                reniecList: _.map(response.data.errorMessages, detail)
              },
              data: {}
            };
            var vConfigModal = nsctrService.fnDefaultModalOptions($scope, {
              template: '<nsctr-modal-reniec-list main-data="$ctrl.reniecList.mainData" data="$ctrl.reniecList.data"></nsctr-modal-reniec-list>',
              windowClass : "g-modal-overlap "
            });
            vConfigModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
              function ($scope, $uibModalInstance, $uibModal) {
                $scope.$on('fnActionButton_modalReniecList', function (event, action) {
                  $uibModalInstance.close();
                  _self.dataS1 = response.data;
                  _self.movementNumber = response.data.data.movementNumber
                  _self.validateProcess= true;
                });
              }];
              $uibModal.open(vConfigModal);
            
            
              break;
            case constants.operationCode.code901:
              _self.reniecList = {
                mainData: {
                  reniecList: response.data.employeeResponseMessagesList
                },
                data: {}
              };
              var vConfigModal = nsctrService.fnDefaultModalOptions($scope, {
                template: '<nsctr-modal-reniec-list main-data="$ctrl.reniecList.mainData" data="$ctrl.reniecList.data"></nsctr-modal-reniec-list>',
                windowClass : "g-modal-overlap "
              });
              vConfigModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
                function ($scope, $uibModalInstance, $uibModal) {
                  $scope.$on('fnActionButton_modalReniecList', function (event, action) {
                    $uibModalInstance.close();
                    _self.dataS1 = response.data;
                    _self.movementNumber = response.data.data.movementNumber
                    _self.validateProcess= true;
                  });
                }];
                $uibModal.open(vConfigModal);
              break;
            case constants.operationCode.code902:
              vError = nsctrService.fnHtmlErrorLoadFile(response.data.errorMessages);
              mModalAlert.showError(vError,'ERROR CONSTANCIA');
              break;
          }  
        }).catch(function() {
          mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
        });
      }
   }
  }]).component('nsctrModalManualProof',{
    templateUrl: '/nsctr/app/common/components/modalManualProof/modalManualProof.component.html',
    controller: 'nsctrModalManualProofController',
    bindings: {
      mainData: '=?',
      data: '=?'
    }
  });
});