'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs',
  'nsctrModalManualProofJs'
], function(angular, constants, nsctr_constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrFixedResultsController',
    ['$rootScope', '$scope', 'mainServices', 'nsctrFactory', 'nsctrService', 'nsctrRoles', 'oimPrincipal',
    'mModalAlert', '$state', 'mModalConfirm', '$uibModal', '$timeout',
    function($rootScope, $scope, mainServices, nsctrFactory, nsctrService, nsctrRoles, oimPrincipal,
    mModalAlert, $state, mModalConfirm, $uibModal, $timeout){
      /*########################
      # _self
      ########################*/
      var _self = this;
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){

        _self.data = _self.data || {};
        _self.openTogglePolicies = _self.openTogglePolicies || false;
        _self.openToggleApplications = _self.openToggleApplications || false;
        _self.selectedPolicies = _self.selectedPolicies || [];
        _self.selectedApplicationsPolicies = _self.selectedApplicationsPolicies || {};
        _self.selectedApplications = _self.selectedApplications || [];
        _self.applicationActionButtons = _self.applicationActionButtons || [];

        _self.MODULE = $state.current.module;
        _self.IS_MODULE = nsctrService.fnIsModule(_self.MODULE);
        _self.STATE_PARAMS = new nsctrFactory.object.oStateParams();
        _self.USER = new nsctrFactory.object.oUser();
        var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+_self.MODULE.appCode)), "PROCESOS_ACCIONES", "nombreCabecera");
        _self.segurityConstanciaManual = nsctrFactory.validation._filterData(segurity.items, "GENERAR_CONSTANCIA_MANUAL", "nombreCorto");
      };
      /*########################
      # POLICIES
      ########################*/
      /*########################
      # fnInitCheckPolicies
      ########################*/
      _self.fnInitCheckPolicies = function(itemPolicy){
        if (itemPolicy.pensionPolicyNumber) itemPolicy.mCheckPension = true;
        if (itemPolicy.healthPolicyNumber) itemPolicy.mCheckHealth = true;
      };
      /*########################
      # fnCheckPolicy
      ########################*/
      _self.fnCheckPolicy = function(itemPolicy){
        if (!itemPolicy.mCheckPension && !itemPolicy.mCheckHealth){
          itemPolicy.mCheckPension = true;
          itemPolicy.mCheckHealth = true;
        }
      };
      /*########################
      # fnRemoveSelectedPolicies
      ########################*/
      _self.fnRemoveSelectedPolicies = function(itemPolicy){
        _self.removeSelectedPolicies({
          itemPolicy: itemPolicy
        });
      };
      /*########################
      # fnShowModalManualProof
      ########################*/
      function _validateModalManualProof(){
        var vSelectedPolicies = _self.selectedPolicies,
            vMessage = new nsctrFactory.object.oMessageError(),
            vDeclarationType = (vSelectedPolicies.length > 1)
                                  ? vSelectedPolicies[0].declarationType === vSelectedPolicies[1].declarationType
                                  : true,
            vValidate =  vDeclarationType;

        if (!vDeclarationType){
          vMessage.setMessageError('W', 'ALERTA', 'Debe seleccionar pólizas del mismo tipo de declaración');
        }
        return {
          valid: vValidate,
          message: vMessage
        };
      }
      _self.fnShowModalManualProof = function(itemPolicy, event){
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        _self.manualProof = {
          mainData:{
            selectedPolicies: _self.selectedPolicies
          },
          data:{}
        };
        var vValidateModalManualProof = _validateModalManualProof();
        if (vValidateModalManualProof.valid){
          var vOptModal = nsctrService.fnDefaultModalOptions(
                          $scope, {
                            size: 'lg',
                            template: '<nsctr-modal-manual-proof main-data="$ctrl.manualProof.mainData" data="$ctrl.manualProof.data"></nsctr-modal-manual-proof>'
                          });
          vOptModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
            function($scope, $uibModalInstance, $uibModal){
              /*########################
              # fnCloseModal_modalManualProof
              ########################*/
              $scope.$on('fnCloseModal_modalManualProof', function() {
                $uibModalInstance.close();
              });
          }];
          $uibModal.open(vOptModal);
        }else{
          if (vValidateModalManualProof.message.type) vValidateModalManualProof.message.showModalAlert();
        }
      };
      /*########################
      # APPLICATIONS
      ########################*/
      /*########################
      # fnGetClassApplicationState
      ########################*/
      _self.fnGetClassApplicationState = function(state){
        return nsctrService.fnGetClassApplicationState(state);
      };
      /*########################
      # fnRemoveSelectedApplications
      ########################*/
      _self.fnRemoveSelectedApplications = function(itemApplication){
        _self.removeSelectedApplications({
          itemApplication: itemApplication
        });
      };
      /*########################
      # fnActionButtonGo
      ########################*/
      function _stateGo(movementType, showRisksList){
        var vMovementType = {
              D: 'Declaration.steps',
              I: 'Inclusion.steps',
              C: 'Proofs'
            },
            vStateName = _self.MODULE.prefixState + vMovementType[movementType];

        _self.openToggleApplications = false; //remove class 'g-overflow-hidden-sm' body
        $state.go(vStateName, {
          showRisksList:                showRisksList,
          client:                       _self.STATE_PARAMS['client'],
          selectedApplicationsPolicies: _self.selectedApplicationsPolicies,
          selectedApplications:         _self.selectedApplications,
          step: 1
        });
      }
      function _actionDireccion(actionDirection, operationType){
        var vACTION_DIRECTION = nsctr_constants.validateApplicationPre.actionDirection,
            vMOVEMENT_TYPE = nsctr_constants.movementType,
            vShowRiskList = (vACTION_DIRECTION.cargarPlanillaExcelIndividual == actionDirection) ? '0' : '1';

        switch (actionDirection){
          case vACTION_DIRECTION.declaracionPasoRiesgos:
            _stateGo(vMOVEMENT_TYPE.declaration.operationType, vShowRiskList);
            break;
          case vACTION_DIRECTION.inclusionPasoRiesgos:
            _stateGo(vMOVEMENT_TYPE.inclusion.operationType, vShowRiskList);
            break;
          case vACTION_DIRECTION.cargarPlanillaExcelIndividual:
            var vDI = (vMOVEMENT_TYPE.declaration.operationType == operationType || vMOVEMENT_TYPE.proof.operationType == operationType)
                        ? vMOVEMENT_TYPE.declaration.operationType
                        : vMOVEMENT_TYPE.inclusion.operationType;
            _stateGo(vDI, vShowRiskList);
            break;
          default:
            _stateGo(vMOVEMENT_TYPE.proof.operationType, vShowRiskList);
            break;
        }
      }
      function _paramsValidateApplicationPre(operationType){
        var vSelectedApplications = _self.selectedApplications,
            vApplicationList = vSelectedApplications.map(function(application, key) {
              var vApplication = {
                PolicyType :                application.applicationType,
                ApplicationNumber :         application.aplicationNumber,
                MCAFicticiousApplication :  application.unTrue,
                ApplicationValidity :       application.state,
                ApplicationStartDate:       application.policyDateStart,
                ApplicationExpirationDate:  application.policyDateEnd,
                SptoNumber :                application.sptoNumber,
                PolicyNumber :              application.policyNumber,
                Policy : {
                  DeclarationType : application.declarationType,
                  PolicyNumber :    application.policyNumber,
                  CentroRiesgos:    application.insuredCollective
                },
                Receipt:{
                  Status: application.receiptState
                },
                isInvoicedInclusion: application.isInvoicedInclusion,
              };
              return vApplication;
            }),
            vParams = {
              NSCTRSystemType:      _self.MODULE.code,
              RolId :               _self.USER.role,
              ActionCode:           operationType,
              ClientDocumentNumber: _self.STATE_PARAMS['client'].documentNumber,
              ListApplication :     vApplicationList,
              ApplicationCode: _self.MODULE.appCode,
            };
        return vParams;
      }
      function _actionButtonGo(option){
        var vMOVEMENT_TYPE = nsctr_constants.movementType;
        var vServiceValidateApplicationPre = (option === vMOVEMENT_TYPE.declaration.operationType || option === vMOVEMENT_TYPE.proof.operationType)
                                              ? nsctrFactory.common.proxyGenerateDeclarationPre.ValidateApplicationPreDeclaration
                                              : nsctrFactory.common.proxyGenerateInclusionPre.ValidateApplicationPreInclusion;

        var vParams = _paramsValidateApplicationPre(option);
        vServiceValidateApplicationPre(vParams, true).then(function(response){

          $scope.validationAlert = $scope.validationAlert || {};
          $scope.validationAlert.firstTime = true;

          $scope.validateApplication = response.data;
          var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+_self.MODULE.appCode)), "PROCESOS_ACCIONES", "nombreCabecera");
          var segurityRecibos = nsctrFactory.validation._filterData(segurity.items, "RECIBOS_PENDIENTES", "nombreCorto");
          //console.log($scope.validateApplication.actionType);
          var vActionType = $scope.validateApplication.actionType;

          if (response.operationCode == constants.operationCode.success){
            _actionDireccion($scope.validateApplication.actionDirection, option);
          }else{
            if($scope.validateApplication.errorList.length > 0){

              var uibModalOptions = {
                scope: $scope,
                size: 'lg',
                controller : ['$scope', '$uibModalInstance',
                  function($scope, $uibModalInstance) {

                    function _filterThirdAlert(currentPage, itemList){
                      var vCurrentPage = currentPage || '1';
                      var vStart = (vCurrentPage - 1) * 3;
                      var vEnd = vStart + 3;
                      if (itemList.policyType == 'P'){
                        itemList.pageInsuredPendingPension = itemList.insuredPendingPension.slice(vStart, vEnd);
                      }else{
                        itemList.pageInsuredPendingHealth = itemList.insuredPendingHealth.slice(vStart, vEnd);
                      }
                    }

                    function _initThirdAlert(){
                      var vErrorList = $scope.validateApplication.errorList;
                      angular.forEach(vErrorList, function(value1, key1) {
                        value1.quantityRows = 3;
                        var vPolicies = (value1.policyType == 'P') ? value1.insuredPendingPension : value1.insuredPendingHealth;
                        value1.totalItems = Math.ceil((vPolicies.length/3)) * 10;
                        _filterThirdAlert('1',value1);
                      });
                    }
                    if ($scope.validationAlert.firstTime){
                      _initThirdAlert();
                      $scope.validationAlert.firstTime = false;
                    }

                    $scope.validationAlert.fnChangePage = function(currentPage, itemList){
                      _filterThirdAlert(currentPage, itemList);
                    };
                }]
              };

              var vAlerts = {
                firstAlert: {
                  showIcon: 'warning',
                  count: 0,
                  title: 'Recibos pendientes',
                  templateContent: 'tplFirstAlert.html',
                  showCancelButton: vActionType > 0 && segurityRecibos
                },
                secondAlert: {
                  showIcon: 'warning',
                  count: 0,
                  title: 'Observaciones',
                  templateContent: 'tplSecondtAlert.html',
                  showCancelButton: vActionType > 0
                },
                thirdAlert: {
                  showIcon: 'warning',
                  count: 0,
                  title: 'Las pólizas posee planillas diferentes, si desea puede incluirlos primero',
                  templateContent: 'tplThirdAlert.html',
                  showCancelButton: vActionType > 0
                }
              };
              var vTypeError = nsctr_constants.validateApplicationPre.errorType;
              angular.forEach($scope.validateApplication.errorList, function(value1, key1) {
                if (vTypeError.receiptPendingRemesarPension  == value1.errorType ||
                    vTypeError.receiptPendingRemesarSalud  == value1.errorType){
                  vAlerts['firstAlert'].title = 'Recibos Pendientes de Remesar, póliza con Control Técnico';
                  vAlerts['firstAlert'].content = 'Por favor comuníquese con su gestor comercial para continuar con la operación.';
                }
                if (value1.errorReceiptPendingPaymentList.length > 0 || value1.errorApplicationPendingList.length > 0) vAlerts['firstAlert'].count++;
                if(value1.observationList.length > 0) vAlerts['secondAlert'].count++;
                if(value1.insuredPendingPension.length > 0 || value1.insuredPendingHealth.length > 0) vAlerts['thirdAlert'].count++;
              });


              if(vAlerts['firstAlert'].count > 0){
                mainServices.fnShowModal(uibModalOptions, vAlerts['firstAlert']).then(function(acept){
                  if(vAlerts['secondAlert'].count > 0){
                    mainServices.fnShowModal(uibModalOptions, vAlerts['secondAlert']).then(function(acept){
                      if(vAlerts['thirdAlert'].count > 0){
                        mainServices.fnShowModal(uibModalOptions, vAlerts['thirdAlert']).then(function(acept){
                          //errorString
                          //0 => Bloquear - 1 => Confirmar(Pasar)
                          if ($scope.validateApplication.errorString){
                            if (vActionType > 0){
                              mModalConfirm.confirmWarning($scope.validateApplication.errorString,'ALERTA','ACEPTAR').then(function(acept){
                                _actionDireccion($scope.validateApplication.actionDirection, option);
                              }, function(otherOptions){
                                return false;
                              });
                            }else{
                              mModalAlert.showWarning($scope.validateApplication.errorString, 'ALERTA');
                            }
                          }else{
                            if (vActionType > 0) _actionDireccion($scope.validateApplication.actionDirection, option);
                          }

                        });
                      }else{
                        if (vActionType > 0) _actionDireccion($scope.validateApplication.actionDirection, option);
                      }
                    });
                  }else if(vAlerts['thirdAlert'].count > 0){
                    mainServices.fnShowModal(uibModalOptions, vAlerts['thirdAlert']).then(function(acept){
                      //errorString
                      //0 => Bloquear - 1 => Confirmar(Pasar)
                      if ($scope.validateApplication.errorString){
                        if (vActionType > 0){
                          mModalConfirm.confirmWarning($scope.validateApplication.errorString,'ALERTA','ACEPTAR').then(function(acept){
                            _actionDireccion($scope.validateApplication.actionDirection, option);
                          }, function(otherOptions){
                            return false;
                          });
                        }else{
                          mModalAlert.showWarning($scope.validateApplication.errorString, 'ALERTA');
                        }
                      }else{
                        if (vActionType > 0) _actionDireccion($scope.validateApplication.actionDirection, option);
                      }

                    });
                  }else{
                    if (vActionType > 0) _actionDireccion($scope.validateApplication.actionDirection, option);
                  }
                });
              }else if(vAlerts['secondAlert'].count > 0){
                mainServices.fnShowModal(uibModalOptions, vAlerts['secondAlert']).then(function(acept){
                  if(vAlerts['thirdAlert'].count > 0){
                    mainServices.fnShowModal(uibModalOptions, vAlerts['thirdAlert']).then(function(acept){
                      //errorString
                      //0 => Bloquear - 1 => Confirmar(Pasar)
                      if ($scope.validateApplication.errorString){
                        if (vActionType > 0){
                          mModalConfirm.confirmWarning($scope.validateApplication.errorString,'ALERTA','ACEPTAR').then(function(acept){
                            _actionDireccion($scope.validateApplication.actionDirection, option);
                          }, function(otherOptions){
                            return false;
                          });
                        }else{
                          mModalAlert.showWarning($scope.validateApplication.errorString, 'ALERTA');
                        }
                      }else{
                        if (vActionType > 0) _actionDireccion($scope.validateApplication.actionDirection, option);
                      }

                    });
                  }else{
                    if (vActionType > 0) _actionDireccion($scope.validateApplication.actionDirection, option);
                  }
                });
              // }else if(vAlerts['thirdAlert'].count > 0){
              }else{
                // (vAlerts['thirdAlert'].count > 0)
                mainServices.fnShowModal(uibModalOptions, vAlerts['thirdAlert']).then(function(acept){
                  //errorString
                  //0 => Bloquear - 1 => Confirmar(Pasar)
                  if ($scope.validateApplication.errorString){
                    if (vActionType > 0){
                      mModalConfirm.confirmWarning($scope.validateApplication.errorString,'ALERTA','ACEPTAR').then(function(acept){
                        _actionDireccion($scope.validateApplication.actionDirection, option);
                      }, function(otherOptions){
                        return false;
                      });
                    }else{
                      mModalAlert.showWarning($scope.validateApplication.errorString, 'ALERTA');
                    }
                  }else{
                    if (vActionType > 0) _actionDireccion($scope.validateApplication.actionDirection, option);
                  }

                });
              }
            }else{
              //errorString
              //0 => Bloquear - 1 => Confirmar(Pasar)
              if ($scope.validateApplication.errorString){
                if (vActionType > 0){
                  mModalConfirm.confirmWarning($scope.validateApplication.errorString,'ALERTA','ACEPTAR').then(function(acept){
                    _actionDireccion($scope.validateApplication.actionDirection, option);
                  }, function(otherOptions){
                    return false;
                  });
                }else{
                  mModalAlert.showWarning($scope.validateApplication.errorString, 'ALERTA');
                }
              }
            }
          }
        }, function(error){
          mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
        });
      }
      function _validateApplicationsNumber(){
        var vSelectedApplications = _self.selectedApplications;
        return{
          validate:           (_self.IS_MODULE.lifeLaw)
                                ? true
                                : vSelectedApplications.length > 1,
          message:            (vSelectedApplications.length > 1) ? '' : 'Solo ha seleccionado una póliza <br> ¿Desea continuar?',
          title:              'ALERTA',
          confirmButtonText:  'ACEPTAR'
        };
      }
      _self.fnActionButtonGo = function(option){
        var vValidateApplicationsNumber = _validateApplicationsNumber();
        if (vValidateApplicationsNumber.validate){
          _actionButtonGo(option);
        }else{
          mModalConfirm.confirmWarning(
            vValidateApplicationsNumber.message,
            vValidateApplicationsNumber.title,
            vValidateApplicationsNumber.confirmButtonText).then(function(response){
              _actionButtonGo(option);
          }, function(otherOptions){
            return false;
          });
        }
      };
      _self.fnActionSegurity = function(item){
        var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+_self.MODULE.appCode)), "PROCESOS_ACCIONES", "nombreCabecera");
        if(item.actionButton == "D") {
          return nsctrFactory.validation._filterData(segurity.items, "GENERAR_DECLARACION", "nombreCorto");
        }
        if(item.actionButton == "I") {
          return nsctrFactory.validation._filterData(segurity.items, "GENERAR_INCLUSION", "nombreCorto");
        }
        if(item.actionButton == "C") {
          return nsctrFactory.validation._filterData(segurity.items, "PLANILLA", "nombreCorto");
        }
      };
  }]).component('nsctrFixedResults',{
    templateUrl: '/nsctr/app/common/components/fixedResults/fixedResults.component.html',
    controller: 'nsctrFixedResultsController',
    bindings: {
      data: '=?',
      client: '=',
      openTogglePolicies: "=",
      openToggleApplications: '=',
      selectedPolicies: '=',
      selectedApplicationsPolicies: '=',
      selectedApplications: '=',
      applicationActionButtons: '=',
      removeSelectedPolicies: '&',
      removeSelectedApplications: '&'
    }
  }).directive('addClass', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.addClass, function(newValue, oldValue) {
          if (newValue.condition && newValue.condition != ''){
            $(newValue.destination).addClass(newValue.class);
          }else{
            $(newValue.destination).removeClass(newValue.class);
          }
        });
      }
    };
  });
});