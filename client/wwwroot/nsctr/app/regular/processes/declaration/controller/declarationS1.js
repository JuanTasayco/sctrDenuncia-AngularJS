(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'nsctr_constants', 'helper', 'swal',
  'nsctrServiceJs', 'nsctrFactoryJs',
  'nsctrTypeLoadJs',
  'nsctrModalReniecListJs',
  'nsctrModalReniecListRejectJs'],
  function(angular, constants, nsctr_constants, helper, swal){

    var appNsctr = angular.module('appNsctr');

    appNsctr.controller('regularDeclarationS1Controller',
      ['$scope', '$window', '$state', '$stateParams', '$timeout', 'mainServices', 'nsctrService',
      'nsctrFactory', 'mModalAlert', 'mModalConfirm', '$uibModal', 'risksList',
      function($scope, $window, $state, $stateParams, $timeout, mainServices, nsctrService,
        nsctrFactory, mModalAlert, mModalConfirm, $uibModal, risksList){

        /*########################
        # _fnCloseToogleApplicaction
        ########################*/
        function _fnCloseToogleApplicaction(bCheck){
          $scope.dataS1.openToggle = !bCheck;
        }
        /*########################
        # onLoad
        ########################*/
        (function onLoad(){

          $scope.data = $scope.data || {};
          $scope.dataS1 = $scope.dataS1 || {};
          $scope.dataS2 = $scope.dataS2 || {};

          if ($scope.data.SHOW_RISKS_LIST){
            if (typeof $scope.dataS1.openToggle == 'undefined') _fnCloseToogleApplicaction(false);
            $scope.dataS1.itemsApplication = $scope.dataS1.itemsApplication || risksList;
          }

        })();
        /*########################
        # _goClient
        ########################*/
        function _goClient(){
          $state.go('regularClient', {
            client: $scope.data.STATE_PARAMS['client']
          });
        }
        /*########################
        # fnInitRisk
        ########################*/
        $scope.fnInitRisk = function(itemRisk){
          if (typeof itemRisk.mCheckDeclarar == 'undefined') itemRisk.mCheckDeclarar = true;
        }
        /*########################
        # fnCancelApplication
        ########################*/
        function _paramsCancelApplication(){
          var vApplications = _getApplications();
          var vParams = {
            AccessMode:         nsctr_constants.movementType.declaration.description.toLowerCase(),
            ClientDocumentCode: $scope.data.STATE_PARAMS['client'].documentNumber,
            ClientDocumentType: $scope.data.STATE_PARAMS['client'].documentType,
            UserCode:           $scope.data.USER.name,
            AgentCode:          $scope.data.STATE_PARAMS['client'].agentId,
            PensionApplication: vApplications['pension'],
            HealthApplication:  vApplications['health'],
            NSCTRSystemType:    $scope.data.MODULE.code
          };
          return vParams;
        }
        function _isFictitiousPolicy(){
          var vIsFictitious = 0,
              vSelectedApplications = $scope.data.STATE_PARAMS['selectedApplications'];
          angular.forEach(vSelectedApplications, function(value1, key1) {
            if (value1.unTrue == 'S') vIsFictitious++;
          });
          return vIsFictitious > 0;
        }
        $scope.fnCancelApplication = function(bCheck){
          if (bCheck){
            _fnCloseToogleApplicaction(bCheck);
            var vSelectedApplications = $scope.data.STATE_PARAMS['selectedApplications'],
                vQuestion = '¿Estás seguro de anular la(s) aplicaciones para la(s) póliza(s) ';

            vQuestion += (vSelectedApplications.length > 1)
                          ? vSelectedApplications[0].policyNumber + ' - ' + vSelectedApplications[1].policyNumber + '?'
                          : vSelectedApplications[0].policyNumber + '?';

            mModalConfirm.confirmInfo(
              vQuestion,
              'ANULAR APLICACIÓN',
              'ANULAR').then(function(acept){

                if (!_isFictitiousPolicy()){

                  var vParams = _paramsCancelApplication();
                  nsctrFactory.common.proxyDeclarationAdmin.NullifyApplications(vParams, true).then(function(response){
                    if (response.operationCode == constants.operationCode.success){
                      mModalAlert.showSuccess('Aplicaciones anuladas', '', null, 2000).then(function(ok){
                        _goClient();
                      }, function(error){
                        if ($scope.data.TIMER == error) _goClient();
                      });
                    }else{
                      $scope.dataS1.mCheckAnularAplicacion = false;
                      _fnCloseToogleApplicaction($scope.dataS1.mCheckAnularAplicacion);
                      vError = nsctrService.fnHtmlErrorLoadFile(response.data.errorMessages);
                      mModalAlert.showError(vError, 'ERROR');
                    }
                  }, function(error){
                    // console.log('error');
                  }, function(defaultError){
                    // console.log('errorDefault');
                  });

                }else{
                  mModalAlert.showWarning('No se puede anular la aplicación, ya que es la última de la póliza marco.<br>Proceda con la renovación en la oficina comercial', 'ALERTA');
                  $scope.dataS1.mCheckAnularAplicacion = false;
                  _fnCloseToogleApplicaction($scope.dataS1.mCheckAnularAplicacion);
                }

            }, function(error){
              $scope.dataS1.mCheckAnularAplicacion = false;
              _fnCloseToogleApplicaction($scope.dataS1.mCheckAnularAplicacion);
            }, function(defaultError){
              //console.log(defaultError);
            });
          }
        }
        /*########################
        # declarationS1.fnValidateRisks
        ########################*/
        function _validateRisks(){
          var vApplications = $scope.dataS1.itemsApplication,
              vRisks = {
                countCheckDeclaration:  0,
                countNumberWorksEmpty:  0,
                countAmountEmpty:       0,
                countAmountMinBad:      0,
                numberWorkers:{
                  pension:  null,
                  health:   null,
                },
                amount:{
                  pension:  null,
                  health:   null
                }
              };
          angular.forEach(vApplications, function(application, keyA) {
            var vWorkers = null;
            var vAmount = null;
            //vRisks.countCheckDeclaration = 0; // se borra para que solo valide por poliza
            angular.forEach(application.risks, function(risk, keyR) {
              if (risk.mCheckDeclarar) {
                vRisks.countCheckDeclaration++;
                if (!risk.mNroTrabajadores || risk.mNroTrabajadores == 0) {
                  vRisks.countNumberWorksEmpty++;
                }else{
                  vWorkers += parseInt(risk.mNroTrabajadores);
                }
                if (!risk.mMonto || risk.mMonto == 0) {
                  vRisks.countAmountEmpty++;
                }else{
                  var vNumberWorker = parseInt(risk.mNroTrabajadores || 0),
                      vAmountMin = (risk.mMonto/vNumberWorker);
                  // // if (vAmountMin < 850) vRisks.countAmountMinBad++;
                  // if ($scope.data.MOUNT_MIN_WORKER > vAmountMin) vRisks.countAmountMinBad++;
                  //SumaMonto
                  vAmount += parseInt(risk.mMonto);
                }
              }
            });
            if (application.policyType == nsctr_constants.pension.code){
              vRisks.numberWorkers.pension = vWorkers;
              vRisks.amount.pension = vAmount;
            }else{
              vRisks.numberWorkers.health = vWorkers;
              vRisks.amount.health = vAmount;
            }
          });
          return vRisks;
        }
        $scope.dataS1.fnValidateRisks = function(clickButton){
          var vValidateRisks = _validateRisks(),
              vIsEqualNumberWorkers = true,
              vAmountMinHealth = true,
              vMaxNumberworkers = true,
              vNumberWorkers = vValidateRisks.numberWorkers.pension || vValidateRisks.numberWorkers.health;

          if (vValidateRisks.countCheckDeclaration == 0){
            mModalAlert.showWarning('Debes de seleccionar un riesgo e ingresar los valores respectivos para cargar la planilla', 'ALERTA');
          } else if (vValidateRisks.countNumberWorksEmpty > 0 || vValidateRisks.countAmountEmpty > 0){
            mModalAlert.showWarning('Debes de ingresar un valor en nro. trabajadores y/o monto para poder cargar la planilla', 'ALERTA');
          } else if (vValidateRisks.countAmountMinBad > 0){
            mModalAlert.showWarning('El monto mínimo debe ser de S/. ' + $scope.data.MOUNT_MIN_WORKER + ' por trabajador', 'CORREGIR LOS VALORES INGRESADOS');
          } else if (vValidateRisks.numberWorkers.pension != null && vValidateRisks.numberWorkers.health != null){
            vIsEqualNumberWorkers = vValidateRisks.numberWorkers.pension == vValidateRisks.numberWorkers.health;
            vAmountMinHealth = vValidateRisks.amount.health >= vValidateRisks.amount.pension;
            if (!vIsEqualNumberWorkers){
              mModalAlert.showWarning('El total de trabajadores deben coincidir en salud y pensión', 'ALERTA');
            }else if (!vAmountMinHealth){
              mModalAlert.showError('El monto mínimo en Salud debe ser igual a la de Pensión', 'ALERTA');
            }
          } else if ($scope.data.TYPE_LOAD.individual.code == clickButton){ //CLICK BUTTON INDIVIDUAL_LOAD
            if (vNumberWorkers !== null && vNumberWorkers > $scope.data.MAX_NUM_WORKERS){
              vMaxNumberworkers = false;
              mModalAlert.showWarning('Debes cargar la planilla en un excel porque el nro. de trabajadores exceden a 10', 'ALERTA');
            }
          } else if ($scope.data.ADD_ROWS == clickButton){ //CLICK BUTTON ADD_ROWS
            if (vNumberWorkers !== null && vNumberWorkers > $scope.data.MAX_NUM_WORKERS){
              mModalConfirm.confirmWarning(
              'Debes cargar la planilla de trabajadores en un excel ahora que el nro. de trabajadores exceden a 10.<br>' +
              'Si eliges la opción de cargar excel se perderán los datos ingresados individualmente.',
              'ALERTA',
              'CARGAR EXCEL')
              .then(function(response){
                if (response){
                  $timeout(function(){
                    $scope.dataS1.replacePayroll.tabPayroll = $scope.data.TYPE_LOAD.massive.code;
                  }, 0);
                }
              }, function(error){
                vMaxNumberworkers = false;
              }, function(defaultError){
                vMaxNumberworkers = false;
              });
            }
          }
          return {
            validate: (vValidateRisks.countCheckDeclaration > 0) && (vValidateRisks.countNumberWorksEmpty == 0) && (vValidateRisks.countAmountEmpty == 0) && (vValidateRisks.countAmountMinBad == 0) && (vIsEqualNumberWorkers) && (vAmountMinHealth) && (vMaxNumberworkers),
            numberWorkers: vValidateRisks.numberWorkers.pension || vValidateRisks.numberWorkers.health
          };
        }
        /*########################
        # fnNextStep
        ########################*/
        function _getApplications(){
          var vSelectedApplications = $scope.data.STATE_PARAMS['selectedApplications'],
              vApplications = {
                pension: {},
                health: {}
              };
          angular.forEach(vSelectedApplications, function(value1, key1) {
            var vApplication = {
              ApplicationNumber:          value1.aplicationNumber,
              MCAFicticiousApplication:   value1.unTrue,
              SptoNumber:                 value1.sptoNumber,
              PreviousSptoNumber:         value1.beforeSptoNumber,
              PreviousApplicationNumber:  value1.beforeSptoAplicationNumber,
              ApplicationValidity:        value1.state.toLowerCase(),
              ApplicationStartDate:       value1.policyDateStart,
              ApplicationExpirationDate:  value1.policyDateEnd,
              CodRamo:                    (value1.applicationType == nsctr_constants.pension.code)
                                            ? nsctr_constants.pension.codeRamo
                                            : nsctr_constants.health.codeRamo,
              Policy:
              {
                PolicyNumber:             value1.policyNumber,
                DeclarationType:          value1.declarationType.toLowerCase(),
                CiaCode:                  value1.ciaId,
                ApplicationNumber:        value1.aplicationNumber,
                SptoNumber:               value1.sptoNumber,
                ApplicationSptoNumber:    value1.sptoAplicationNumber,
                ExpirationStatus:         '',
                MCAMinSalary:             'N'
              }
            };
            if (value1.applicationType == nsctr_constants.pension.code){
              vApplications['pension'] = vApplication;
            }else{
              vApplications['health'] = vApplication;
            }
          });
          return vApplications;
        }
        function _getEmployeesList(tabPayroll){
          var vEmployeesList = [];
          if ($scope.data.TYPE_LOAD.individual.code == tabPayroll){
            var vItemWorkers = $scope.dataS1.replacePayroll.itemWorkers;
            vEmployeesList = vItemWorkers.map(function(value1, key1){
              var vWorker = {
                Row:            (key1 + 1),
                DocumentType:   value1.mTipoDocumento.typeId,
                DocumentNumber: value1.mNroDocumento.model,
                FathersSurname: value1.mApellidoPaterno || '',
                MothersSurname: value1.mApellidoMaterno || '',
                Name:           value1.mNombres || '',
                FullName:       value1.mNombreCompleto || '',
                BirthDate:      (value1.mFechaNacimiento.model)
                                  ? $scope.data.fnFilterDate(value1.mFechaNacimiento.model, constants.formats.dateFormat)
                                  : '',
                Occupation:     value1.mOcupacion || '',
                Salary:         value1.mSueldo,
              }
              return vWorker;
            });
          }
          return vEmployeesList;
        }
        function _getRisksSessions(showRisksList){
          var vRisksSessions = {
                pension: null,
                health: null
              },
              vApplications = $scope.dataS1.itemsApplication;

          if (showRisksList){
            vRisksSessions.pension = [];
            vRisksSessions.health = [];
            angular.forEach(vApplications, function(application, key1) {
              var vRiskSession = application.risks.map(function(risk, key2){
                    var vItem = {
                      RiskNumber:       risk.riskNumber,
                      PayrollQuantity:  risk.mNroTrabajadores || '0',
                      PayrollAmount:    risk.mMonto,
                      MCADeclareRisk:   risk.mCheckDeclarar,
                      MCASelectRisk:    false,
                      MCANoMovement:    (risk.mCheckDeclarar) ? false : true
                    };
                    return vItem;
                  }),
                  vKeyRisksSessions = (application.policyType == nsctr_constants.pension.code)
                                        ? 'pension'
                                        : 'health';

              vRisksSessions[vKeyRisksSessions] = vRiskSession;
            });
          }
          return vRisksSessions;
        }
        function _paramsIndividualLoad(tabPayroll, showRisksList){
          var vApplications = _getApplications(),
              vRisksSessions = _getRisksSessions(showRisksList),
              vParams = {
                ActionOperationUser: nsctr_constants.movementType.declaration.description,
                NSCTRSystemType:    $scope.data.MODULE.code,
                AccessMode:         nsctr_constants.movementType.declaration.description.toLowerCase(),
                ClientDocumentCode: $scope.data.STATE_PARAMS['client'].documentNumber,
                ClientDocumentType: $scope.data.STATE_PARAMS['client'].documentType,
                UserCode:           $scope.data.USER.name,
                WorkCenterData:     $scope.dataS1.mDatosObra || '', //SE AGREGA EN SECONDSTEP
                CostsCenter:        '',
                MCAIdeDeclaration:  nsctr_constants.movementType.declaration.code, //'DW',
                AgentCode:          $scope.data.STATE_PARAMS['client'].agentId,
                ValidateRisks:      showRisksList,
                PensionApplication: vApplications['pension'],
                HealthApplication:  vApplications['health'],
                EmployeesList:      _getEmployeesList(tabPayroll),
                TotalPensionRisk:   {}, //NO ES NECESARIO
                TotalHealthRisk:    {}, //NO ES NECESARIO
                Session:
                {
                  PensionRisksList: vRisksSessions['pension'],
                  HealthRisksList:  vRisksSessions['health']
                }
              };
          return vParams;
        }
        function _paramsMassiveLoad(tabPayroll, showRisksList){
          var vParamsIndividualLoad = JSON.stringify(_paramsIndividualLoad(tabPayroll, showRisksList)),
              vFile = $scope.dataS1.replacePayroll.fmImportarPlanilla || {},
              vParams = {
                DeclarationJson : vParamsIndividualLoad,
                FieldNameHere :   vFile[0]
              };
          return vParams;
        }
        function _paramsNextStep(tabPayroll, showRisksList){
          var vParams = ($scope.data.TYPE_LOAD.individual.code == tabPayroll)
                          ? _paramsIndividualLoad(tabPayroll, showRisksList)
                          : _paramsMassiveLoad(tabPayroll, showRisksList);
          return vParams;
        }
        function _paramsRisksPremium(firstParamsDeclaration){
          var vParams = [],
              vSession = firstParamsDeclaration.data.session,
              vSelectedApplications = $scope.data.STATE_PARAMS['selectedApplications'];

          angular.forEach(vSelectedApplications, function(application, key) {
            var vKeyRisksList = (nsctr_constants.pension.code == application.applicationType)
                                  ? 'pensionRisksList'
                                  : 'healthRisksList';

            var vIsDeclared = _.find(vSession[vKeyRisksList], function(elem, index){
              return elem.mcaDeclareRisk;
            });

            if (vIsDeclared) {
              var vApplication = {
                UnRealApplication:    application.unTrue,
                SptoNumber:           application.sptoNumber,
                PolicyNumber:         application.policyNumber,
                ClientDocumentNumber: $scope.data.STATE_PARAMS['client'].documentNumber,
                ClientDocumentType:   $scope.data.STATE_PARAMS['client'].documentType,
                ApplicationNumber:    application.aplicationNumber,
                UserId:               $scope.data.USER.name,
                PolicyType:           application.applicationType,
                OperationType:        nsctr_constants.movementType.declaration.operationType,
                MovementNumber:       parseInt(vSession.movementNumber || 0)
              };
              vParams.push(vApplication);
            }
          });
          return vParams;
        }
        function _validateForm(showRisksList){
          $scope.frmFirstStep.markAsPristine();
          var vTabPayroll = $scope.dataS1.replacePayroll.tabPayroll,
              vValidateRisks = (showRisksList)
                                  ? $scope.dataS1.fnValidateRisks(vTabPayroll)
                                  : true,
              vValidateReplacePayroll = $scope.dataS1.replacePayroll.fnValidate($scope.dataS1.replacePayroll.tabPayroll);
          return $scope.frmFirstStep.$valid && vValidateRisks && vValidateReplacePayroll;
        }
        function _actionButton(showRisksList, paramsRisksPremium, paramsPendingRisksPremium){
          if (showRisksList){
            $state.go('.', {
              step: 2,
              paramsRisksPremium: paramsRisksPremium,
              paramsPendingRisksPremium: paramsPendingRisksPremium
            });
          }else{
            var vParams = $scope.dataS1.FIRST_PARAMS_DI.data;
            mModalConfirm.confirmInfo(
              '¿Está seguro que desea generar la siguiente Declaración?',
              'GENERAR DECLARACIÓN',
              'GENERAR').then(function(response){
                if (response){
                  nsctrFactory.common.proxyGenerateDeclarationMain.Declaration_Step2_GenerateConstancy(vParams, true).then(function(response){
                    switch (response.operationCode) {
                      case constants.operationCode.success:
                        var vIdProof = response.data.data.session.constancy.constanciesNumbers;
                        mModalAlert.showSuccess('Se genero la declaración con éxito', '').then(function(ok){
                          $state.go('regularDeclarationGenerated', {
                            client: $scope.data.STATE_PARAMS['client'],
                            idProof: vIdProof
                          });
                        });
                        break;
                      case constants.operationCode.code900:
                        mModalAlert.showError(response.message, 'ERROR DECLARACIÓN').then(redirectToHome);
                        break;
                      default:
                        vError = nsctrService.fnHtmlErrorLoadFile(response.data.errorMessages);
                        mModalAlert.showError(vError, 'ERROR DECLARACIÓN');
                        break;
                    }
                  }, function(error){
                    mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR').then(function(){
                      var vStateName = $scope.data.MODULE.prefixState + 'SearchClient';
                      $state.go(vStateName, {
                        client: $scope.data.STATE_PARAMS['client'],
                        policyNumber: $scope.data.STATE_PARAMS.selectedApplications[0].policyNumber || null
                      });
                    });
                  });
                }
            }, function(otherOptions){
              return false;
            });
          }
        }
        $scope.fnActionButton = function(){
          var vIsDeclaration = $scope.data.IS_DECLARATION,
              vShowRisksList = $scope.data.SHOW_RISKS_LIST;

          $scope.dataS1.FIRST_PARAMS_DI = {};

          if (_validateForm(vShowRisksList)){

            var vTabPayroll = $scope.dataS1.replacePayroll.tabPayroll,
                vParams = _paramsNextStep(vTabPayroll, vShowRisksList),
                vParamsRisksPremium = null, //[],
                vParamsPendingRisksPremium = null, //{},
                vError;

            nsctrFactory.common.proxyCommon.CSDeclaration_Step1(vTabPayroll, vParams, true).then(function(response){
              $scope.dataS1.FIRST_PARAMS_DI = response.data;

              if (vShowRisksList){
                vParamsRisksPremium = _paramsRisksPremium($scope.dataS1.FIRST_PARAMS_DI);
                vParamsPendingRisksPremium = $scope.dataS1.FIRST_PARAMS_DI.data;
              }

              switch(response.operationCode){
                case constants.operationCode.success:
                  _actionButton(vShowRisksList, vParamsRisksPremium, vParamsPendingRisksPremium);
                  break;
                case constants.operationCode.code901:
                  $scope.reniecList = {
                    mainData:{
                      reniecList: response.data.employeeResponseMessagesList
                    },
                    data:{}
                  };
                  var vConfigModal = nsctrService.fnDefaultModalOptions($scope, {
                                      template: '<nsctr-modal-reniec-list main-data="reniecList.mainData" data="reniecList.data"></nsctr-modal-reniec-list>'
                                    }, true, true);
                  vConfigModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
                    function($scope, $uibModalInstance, $uibModal){
                      /*########################
                      # fnActionButton_modalReniecList
                      ########################*/
                      $scope.$on('fnActionButton_modalReniecList', function(event, action){
                        $uibModalInstance.close(action);
                      });
                  }];
                  $uibModal.open(vConfigModal).result.then(function(action){
                    if (action == 'A') _actionButton(vShowRisksList, vParamsRisksPremium, vParamsPendingRisksPremium);
                    //Action after CloseButton Modal
                  },function(){
                    //Action after CancelButton Modal
                  });
                  break;
                case constants.operationCode.code902:
                  vError = nsctrService.fnHtmlErrorLoadFile(response.data.errorMessages);
                  mModalAlert.showError(vError, 'DATOS DE LA PLANILLA ERRONEOS');
                  break;


                case constants.operationCode.code910:
                  $scope.reniecList = {
                    mainData:{
                      reniecList: response.data.employeeResponseMessagesList
                    },
                    data:{}
                  };
                  var vConfigModalReject = nsctrService.fnDefaultModalOptions($scope, {
                                      template: '<nsctr-modal-reniec-list-reject main-data="reniecList.mainData" data="reniecList.data"></nsctr-modal-reniec-list-reject>'
                                    }, true, true);
                  vConfigModalReject.controller = ['$scope', '$uibModalInstance', '$uibModal',
                    function($scope, $uibModalInstance, $uibModal){
                      $scope.$on('fnActionButton_modalReniecListReject', function(event, action){
                        $uibModalInstance.close(action);
                      });
                  }];
                  $uibModal.open(vConfigModalReject).result.then(function(){});
                  break;
                default: //900
                  vError = nsctrService.fnHtmlErrorLoadFile(response.data.errorMessages);
                  mModalAlert.showWarning(vError, 'ALERTA');
              }
            }, function(error){
              mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR').then(function(){
                var vStateName = $scope.data.MODULE.prefixState + 'SearchClient';
                      $state.go(vStateName, {
                        client: $scope.data.STATE_PARAMS['client'],
                        policyNumber: $scope.data.STATE_PARAMS.selectedApplications[0].policyNumber || null
                      });
              });
            });
          }
        }

        function redirectToHome() {
          var vStateName = $scope.data.MODULE.prefixState + 'SearchClient';
          $state.go(vStateName, {
            client: $scope.data.STATE_PARAMS['client'],
            policyNumber: $scope.data.STATE_PARAMS.selectedApplications[0].policyNumber || null
          });
        }

    }])

  });
