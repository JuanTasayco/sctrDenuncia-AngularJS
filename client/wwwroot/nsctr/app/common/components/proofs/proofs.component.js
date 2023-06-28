'use strict';

define([
  'angular', 'constants', 'nsctr_constants', 'helper', 'lodash',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs',
  'nsctrClientInformationJs',
  'nsctrNoResultFilterJs',
  'nsctrModalInsuredJs',
  'nsctrModalGenerateProofJs'
], function(angular, constants, nsctr_constants, helper, _){

    var appNsctr = angular.module('appNsctr');

    appNsctr.controller('nsctrProofsController',
      ['$scope', '$window', '$state', '$timeout', '$uibModal', 'mModalAlert', 'mModalConfirm', 'nsctrFactory',
      '$stateParams', 'mainServices', 'nsctrService', 'nsctrRoles',
      function($scope, $window, $state, $timeout, $uibModal, mModalAlert, mModalConfirm, nsctrFactory,
      $stateParams, mainServices, nsctrService, nsctrRoles){
        /*########################
        # _self
        ########################*/

        var _self = this;
        /*########################
        # functions
        ########################*/
        function _isMonthAdvance(){
          return nsctr_constants.declarationType.monthAdvance.description === _self.data.STATE_PARAMS['selectedApplications'][0].declarationType.toLowerCase();
        }
        function _isDeclared(){
          return nsctr_constants.state.declared.description === _self.data.STATE_PARAMS['selectedApplications'][0].state.toUpperCase();
        }
        function _showBtnReplace(){
          return (_isMonthAdvance() && (_self.data.USER.role == nsctrRoles.ADMINISTRACION_APLICACION)); // || _self.data.USER.role == nsctrRoles.ADMINISTRADOR_COMERCIAL
        }
        /*########################
        # fnClearSearchWorkers
        ########################*/
        function _clearSearchWorkers(){
          _self.data.mTipoDoc = {
            typeId: null
          };
          _self.data.mNroDocumento.setModel('');
          _self.data.mNroDocumento.setFieldsToValidate(null);
          _self.data.mNombreCompleto = '';
        }
        /*########################
        # fnSearchWorkers
        ########################*/
        function _clearSearchedWorkers(isPagination){
          _self.data.noResultFilter.setNoResultFilter(false, false);
          _self.data.workersList.setDataList();
          _self.data.mPagination.setTotalItems(0);
          if (!isPagination) _self.data.mPagination.setCurrentPage(1);
        }
        function _paramsSearchWorkers(){
          var vSelectedApplications = _self.data.STATE_PARAMS['selectedApplications'],
              vParams = {
                NSCTRSystemType:        _self.data.MODULE.code,
                ClientDocumentNumber :  _self.data.STATE_PARAMS['client'].documentNumber,
                ClientDocumentType:     _self.data.STATE_PARAMS['client'].documentType,
                DocumentType :          (_self.data.mTipoDoc && _self.data.mTipoDoc.typeId !== null)
                                          ? _self.data.mTipoDoc.typeId
                                          : '',
                DocumentNumber :        _self.data.mNroDocumento.model || '',
                FullName :              _self.data.mNombreCompleto || '',
                User :                  _self.data.USER.name,
                rowByPage :             10,
                currentPage :           _self.data.mPagination.currentPage,
                orderBy :               ''
              };
          angular.forEach(vSelectedApplications, function(value1, key1) {
            var vKey = (value1.applicationType == nsctr_constants.pension.code)
                          ? 'PensionPolicyNumber'
                          : 'HealthPolicyNumber';

            vParams[vKey] = value1.policyNumber;
          });
          vParams.ApplicationDateStart =  vSelectedApplications[0].policyDateStart;
          vParams.ApplicationDateFinish = vSelectedApplications[0].policyDateEnd;
          return vParams;
        }
        function _setCheckWorkers(list){
          _.map(list, function(value1, index1, array1){
            var vEnabled = (_self.data.STATE.up.description == value1.state);
            if (_self.data.mCheckAll){
              value1.mCheck = vEnabled;
              if (value1.mCheck) _addSelectedWokers(value1);
            }else{
              _.map(_self.data.selectedWorkers, function(value2, index2, array2){
                if (value1.documentNumber == value2.documentNumber){
                  value1.mCheck = value2.mCheck;
                }
              });
            }
          });
        }
        function _searchWorkers(){
          var vParams = _paramsSearchWorkers();
          nsctrFactory.common.proxyDeclarationAdmin.ListPlanilla(vParams, true).then(function(response){
            if (response.operationCode == constants.operationCode.success){
              if (response.data.list.length > 0){
                _setCheckWorkers(response.data.list);
                _self.data.workersList.setDataList(response.data.list, response.data.totalRows, response.data.totalRowsActive, response.data.totalPages);
                _self.data.mPagination.setTotalItems(_self.data.workersList.totalItemsPagination);
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
          _self.MODULE = $state.current.module;
          var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+_self.MODULE.appCode)), "PROCESOS_PLANILLA", "nombreCabecera");
          _self.shearchPlanilla = nsctrFactory.validation._filterData(segurity.items, "BUSCAR", "nombreCorto");
          _self.reemplazaPlanilla = nsctrFactory.validation._filterData(segurity.items, "REEMPLAZAR_PLANILLA", "nombreCorto");
          _self.generaConst = nsctrFactory.validation._filterData(segurity.items, "GENERAR_CONSTANCIA_REIMPRESION", "nombreCorto");
          _self.segurityEdit = nsctrFactory.validation._filterData(segurity.items, "LUPA_EDITAR_TRABAJADOR", "nombreCorto");
          //_self.isFilterVisible = nsctrFactory.validation._filterData(segurity.items, "BUSCAR", "nombreCorto");
          _self.resolve = _self.resolve || {};
          _self.data = _self.data || {};

          _self.data.MODULE = _self.data.MODULE || $state.current.module;
          _self.data.IS_MODULE = _self.data.IS_MODULE || nsctrService.fnIsModule(_self.data.MODULE);
          _self.data.VALID_PAGE = _self.data.VALID_PAGE || nsctrService.fnValidatePage();

          if (_self.data.VALID_PAGE){

            _self.data.STATE_PARAMS = _self.data.STATE_PARAMS || new nsctrFactory.object.oStateParams();
            _self.data.USER = _self.data.USER || new nsctrFactory.object.oUser();
            _self.data.mNroDocumento = _self.data.mNroDocumento || new nsctrFactory.object.oDocumentNumber();
            _self.data.noResultFilter = _self.data.noResultFilter || new nsctrFactory.object.oNoResultFilter();
            _self.data.workersList = _self.data.workersList || new nsctrFactory.object.oDataList();
            _self.data.mPagination = _self.data.mPagination || new nsctrFactory.object.oPagination();

            _self.data.STATE = _self.data.STATE || nsctr_constants.state;
            _self.data.CURRENCY_TYPES = _self.data.CURRENCY_TYPES || constants.currencyType;
            _self.data.TYPE_LOAD = _self.data.TYPE_LOAD || nsctr_constants.typeLoad;
            _self.data.IS_MONTH_ADVANCE = _self.data.IS_MONTH_ADVANCE || _isMonthAdvance();
            _self.data.IS_DECLARED = _self.data.IS_DECLARED || _isDeclared();
            _self.data.SHOW_BTN_REPLACE = _self.data.SHOW_BTN_REPLACE ||  _showBtnReplace();
            _self.data.documentTypeData = _self.data.documentTypeData || _self.resolve.documentTypes;
            _self.data.mCheckAll = true;
            _self.data.selectedWorkers = _self.data.selectedWorkers || [];

            // _clearSearchWorkers();
            _searchWorkers();
          }else{
            var vStateName = _self.data.MODULE.prefixState + 'SearchClient';
            $state.go(vStateName, {});
          }

        };
        /*########################
        # fnNewInclusion
        ########################*/
        _self.fnNewInclusion = function(){
          var showRisksList = (!_self.data.IS_MONTH_ADVANCE && !_self.data.IS_DECLARED)
                                ? '0'
                                : '1',
              vStateName = _self.data.MODULE.prefixState + 'Inclusion.steps';
          $state.go(vStateName, {
            showRisksList               : showRisksList, // '0', => siempre es cero porque el boton nueva inclusion solo se muestra si es MES VENCIDO Y NO DECLARADA
            client                      : _self.data.STATE_PARAMS['client'],
            selectedApplicationsPolicies: _self.data.STATE_PARAMS['selectedApplicationsPolicies'],
            selectedApplications        : _self.data.STATE_PARAMS['selectedApplications'],
            step                        : 1
          });
        };
        /*########################
        # fnChangeDocumentType
        ########################*/
        _self.fnChangeDocumentType = function(documentType){
          var vDocumentType = (documentType)
                                ? documentType.typeId
                                : null;
          _self.data.mNroDocumento.setFieldsToValidate(vDocumentType);
        }
        /*########################
        # fnSearchWorkers
        ########################*/
        function _validateSearchWorkers(){
          $scope.frmSearchWorkers.markAsPristine();
          return $scope.frmSearchWorkers.$valid;
        }
        _self.fnSearchWorkers = function(){
          if (_validateSearchWorkers()){
            _self.data.selectedWorkers = [];
            _clearSearchedWorkers();
            _searchWorkers();
          }
        }
        /*########################
        # fnChangePage
        ########################*/
        _self.fnChangePage = function(){
          _clearSearchedWorkers(true);
          _searchWorkers();
        }
        /*########################
        # fnClearSearchWorkers
        ########################*/
        _self.fnClearSearchWorkers = function(){
          _clearSearchWorkers();
          _clearSearchedWorkers();
          _searchWorkers();
        }
        /*########################
        # fnCheckAll
        ########################*/
        _self.fnCheckAll = function(checkAll){
          var vWorkers = _self.data.workersList.list;
          _self.data.selectedWorkers = [];
          if (checkAll){
            _.map(vWorkers, function(value1, index1, array1){
              var vEnabled = (_self.data.STATE.up.description == value1.state);
              value1.mCheck = vEnabled;
              if (value1.mCheck) _self.data.selectedWorkers.push(value1);
            });
          }else{
            _.map(vWorkers, function(value1, index1, array1){
              value1.mCheck = false;
            });
          }
        };

        /*########################
        # fnCheck
        ########################*/
        function _addSelectedWokers(item){
          var vSelectedWorkers = _self.data.selectedWorkers,
              vExistWorker = _.find(vSelectedWorkers, function(value1, key1) {
                return (item.documentNumber == value1.documentNumber);
              });
          if (!vExistWorker) vSelectedWorkers.push(item);
        }
        function _reorganizeSelectedWorkers(item){
          _self.data.mCheckAll = false;
          _self.data.selectedWorkers = [];
          var vWorkers = _self.data.workersList.list,
              vSelectedWorkers = vWorkers.filter(function(value1, key1){
                return (_self.data.STATE.up.description == value1.state && item.documentNumber !== value1.documentNumber);
              });
          _self.data.selectedWorkers = vSelectedWorkers;
        }
        function _removeSelectedWorkers(item){
          var vSelectedWorkers = _self.data.selectedWorkers,
              vIndex = vSelectedWorkers.map(function(value1){
                return value1.documentNumber;
              }).indexOf(item.documentNumber);
          if (vIndex != -1) vSelectedWorkers.splice(vIndex, 1);
        }
        _self.fnCheck = function(item){
          if (item.mCheck){
            _addSelectedWokers(item);
          }else{
            if (_self.data.mCheckAll){
              _reorganizeSelectedWorkers(item);
            }else{
              _removeSelectedWorkers(item);
            }

          }
        };
        /*########################
        # fnShowModalInsured
        ########################*/
        _self.fnShowModalInsured = function(item){
          _self.modalInsured = {
            showSelects: false,
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
        # fnPrintProof
        ########################*/
        function _selectedEmployeeList(checkAll){
          var vSelectedEmployeeList = [];
          if (!checkAll){
            var vSelectedWorkers = _self.data.selectedWorkers;
            vSelectedEmployeeList = vSelectedWorkers.map(function(value1, key1){
              if (value1.mCheck){
                var vItem = {
                  documentType:   value1.documentType,
                  documentNumber: value1.documentNumber,
                  fathersSurname: value1.fathersSurname,
                  mothersSurname: value1.mothersSurname,
                  name:           value1.name,
                  fullName:       value1.fullName,
                  salary:         value1.salary,
                  birthDate:      value1.birthDate,
                  occupation:     value1.occupation,
                  pensionRisk:    value1.pensionRisk || '0',  //PARA MINIERIA
                  healthRisk:     value1.healthRisk || '0'    //PARA MINIERIA
                };
                return vItem;
              }
            });
          }
          return vSelectedEmployeeList;
        }
        function _validateCheckPayroll(isReplace){
          var vCheckAll = _self.data.mCheckAll,
              vMessage = new nsctrFactory.object.oMessageError(),
              vWorkersList,
              vValidate;
          if (vCheckAll){
            vWorkersList = _self.data.workersList.list.length > 0 && _self.data.workersList.totalRowsActive > 0;
          }else{
            var vSelectedEmployeeList = _selectedEmployeeList(vCheckAll);
            vWorkersList = vSelectedEmployeeList.length > 0;
          }
          vValidate = vWorkersList;

          if (!vValidate){
            if (!vWorkersList){
              var vText = (isReplace) ? 'reemplazar la planilla.' : 'generar la constancia.'
              vMessage.setMessageError('W', 'ALERTA', 'Aviso en el registro de asegurados: No tiene trabajadores para ' + vText);
            }
          }

          return {
            valid: vValidate,
            message: vMessage
          };
        }
        _self.fnPrintProof = function(typeLoad){
          var vIsMassive = (_self.data.TYPE_LOAD.massive.code == typeLoad);
          _self.modalGenerateProof = {
            typeLoad: typeLoad,
            mainData: {
              mCheckAll: _self.data.mCheckAll,
              selectedWorkers: _self.data.selectedWorkers
            },
            data:{}
          };
          var vValidateCheckPayroll = (vIsMassive) ? {valid: true} : _validateCheckPayroll();
          if (vValidateCheckPayroll.valid){
            var vOptModal = nsctrService.fnDefaultModalOptions($scope, {
                              size: 'md',
                              template: '<nsctr-modal-generate-proof type-load="$ctrl.modalGenerateProof.typeLoad" main-data="$ctrl.modalGenerateProof.mainData" data="$ctrl.modalGenerateProof.data"></nsctr-modal-generate-proof>'
                            });
            vOptModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
              function($scope, $uibModalInstance, $uibModal){
                /*########################
                # fnCloseModal_modalGenerateProof
                ########################*/
                $scope.$on('fnCloseModal_modalGenerateProof', function(event, actionButton) {
                  if (actionButton == constants.actionButton.cancel) {
                    $uibModalInstance.dismiss('cancel');
                  } else {
                    $uibModalInstance.close(actionButton);
                  }
                });
            }];
            $uibModal.open(vOptModal);
          }else{
            if (vValidateCheckPayroll.message.type) vValidateCheckPayroll.message.showModalAlert();
          }
        };
        /*########################
        # fnReplacePayroll
        ########################*/
        function _getApplications(){
          var vApplications = {
                pensionApplication: {},
                healthApplication:  {}
              },
              vSelectedApplications = _self.data.STATE_PARAMS['selectedApplications'];

          angular.forEach(vSelectedApplications, function(value1, key1) {
            var vApplication = {
                  ApplicationNumber:          value1.aplicationNumber,
                  MCAFicticiousApplication:   value1.unTrue,
                  SptoNumber:                 value1.sptoNumber,
                  PreviousSptoNumber:         value1.beforeSptoNumber,
                  PreviousApplicationNumber:  value1.beforeSptoAplicationNumber,
                  ApplicationValidity:        value1.state,
                  ApplicationStartDate:       value1.policyDateStart,
                  ApplicationExpirationDate:  value1.policyDateEnd,
                  CodRamo:                    (value1.applicationType == nsctr_constants.pension.code)
                                                ? nsctr_constants.pension.codeRamo
                                                : nsctr_constants.health.codeRamo,
                  Policy:
                  {
                    PolicyNumber:             value1.policyNumber,
                    DeclarationType:          value1.declarationType,
                    CiaCode:                  value1.ciaId,
                    ApplicationNumber:        value1.aplicationNumber,
                    SptoNumber:               value1.sptoNumber,
                    ApplicationSptoNumber:    value1.sptoAplicationNumber,
                    ExpirationStatus:         '',
                    MCAMinSalary:             'N'
                  }
                },
                vKeyApplication = (value1.applicationType == nsctr_constants.pension.code)
                                    ? 'pensionApplication'
                                    : 'healthApplication';

            vApplications[vKeyApplication] = vApplication;
          });
          return vApplications;
        }
        function _paramsReplacePayroll(){
          var vAllCheck = _self.data.mCheckAll,
              vApplications = _getApplications(),
              vParams = {
                NSCTRSystemType:              _self.data.MODULE.code,
                IsAllCheckboxSelected:        vAllCheck,
                SelectedEmployeeListActive:   _self.data.workersList.totalRowsActive,
                SelectedEmployeeList:         _selectedEmployeeList(vAllCheck),
                UploadedReplaceEmployeesList: [],
                Declaration:
                {
                  AccessMode:         nsctr_constants.movementType.declaration.description.toLowerCase(),
                  ClientDocumentCode: _self.data.STATE_PARAMS['client'].documentNumber,
                  ClientDocumentType: _self.data.STATE_PARAMS['client'].documentType,
                  UserCode:           _self.data.USER.name,
                  MCAIdeDeclaration:  nsctr_constants.movementType.declaration.code,
                  AgentCode:          _self.data.STATE_PARAMS['client'].agentId,
                  PensionApplication: vApplications['pensionApplication'],
                  HealthApplication:  vApplications['healthApplication'],
                }
              };
          return vParams;
        }
        function _paramsCustomReplacePayroll(params, responseData){
          params.SelectedEmployeeList = responseData.data.data.selectedEmployeeList;
          return params;
        }
        _self.fnReplacePayroll = function(){
          var vValidateCheckPayroll = _validateCheckPayroll(true);
          if (vValidateCheckPayroll.valid){
            var vParams = _paramsReplacePayroll();
            nsctrFactory.common.proxyDeclarationAdmin.RecoverPayrollAdmin_Replace_Step1_Selection(vParams, true).then(function(response){
              if (response.operationCode == constants.operationCode.success){
                var vStateName = _self.data.MODULE.prefixState + 'ReplacePayroll';
                $state.go(vStateName, {
                  client                      : _self.data.STATE_PARAMS['client'],
                  selectedApplicationsPolicies: _self.data.STATE_PARAMS['selectedApplicationsPolicies'],
                  selectedApplications        : _self.data.STATE_PARAMS['selectedApplications'],
                  paramsReplacePayroll        : (_self.data.IS_MODULE.mining)
                                                ? _paramsCustomReplacePayroll(vParams, response)
                                                : vParams
                });
              }else{
                mModalAlert.showWarning(response.data.errorMessages[0], 'ALERTA');
              }
            }, function(error){
              mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
            });
          }else{
            if (vValidateCheckPayroll.message.type) vValidateCheckPayroll.message.showModalAlert();
          }
        };

    }]).component('nsctrProofs',{
      templateUrl: function($state, $element, $attrs) {
        var vCurrentModule = $state.current.module;
        return '/nsctr/app/common/components/proofs/' + vCurrentModule.prefixState + '.component.html';
      },
      controller: 'nsctrProofsController',
      bindings: {
        resolve: '=?',
        data: '=?'
      }
    });


  });
