(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'nsctr_constants', 'helper',
  'nsctrServiceJs', 'nsctrFactoryJs',
  'nsctrTypeLoadJs',
  'nsctrModalReniecListJs'],
  function(angular, constants, nsctr_constants, helper){

    var appNsctr = angular.module('appNsctr');

    appNsctr.controller('regularInclusionS1Controller',
      ['$scope', '$window', '$state', '$stateParams', '$timeout', 'mainServices', 'nsctrService',
      'nsctrFactory', 'mModalAlert', 'mModalConfirm', 'risksList', '$uibModal','gaService',
      function($scope, $window, $state, $stateParams, $timeout, mainServices, nsctrService,
        nsctrFactory, mModalAlert, mModalConfirm, risksList, $uibModal,gaService){

        (function onLoad(){

          $scope.data = $scope.data || {};
          $scope.dataS1 = $scope.dataS1 || {};
          $scope.dataS2 = $scope.dataS2 || {};
          if (!$scope.data.SHOW_RISKS_LIST){
            $scope.dataS1.mOpcionFacturacion = 0;

          }
          if ($scope.data.SHOW_RISKS_LIST){
            $scope.dataS1.openToggle = true;
            $scope.dataS1.itemsApplication = $scope.dataS1.itemsApplication || risksList;
            if (typeof $scope.dataS1.mOpcionFacturacion == 'undefined') $scope.dataS1.mOpcionFacturacion = 1;
          }
          $scope.MODULE = $state.current.module;
          var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+$scope.MODULE.appCode)), "PROCESOS_ACCIONES", "nombreCabecera");
          $scope.segurityNotDeclared = nsctrFactory.validation._filterData(segurity.items, "GENERAR_INCLUSION_CONDICION_NO_DECLARADA", "nombreCorto");
          $scope.segurityDeclared = nsctrFactory.validation._filterData(segurity.items, "GENERAR_INCLUSION_CONDICION_DECLARADA", "nombreCorto");

        })();
        /*########################
        # fnInitRisk
        ########################*/
        $scope.fnInitRisk = function(itemRisk){
          if (typeof itemRisk.mCheckRisk == 'undefined') itemRisk.mCheckRisk = true;
        }
        /*########################
        # inclusionS1.fnValidateRisks
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
              if (risk.mCheckRisk) {
                vRisks.countCheckDeclaration++;
                if (!risk.mNroTrabajadores || risk.mNroTrabajadores == 0) {
                  vRisks.countNumberWorksEmpty++;
                }else{
                  vWorkers += parseInt(risk.mNroTrabajadores);
                }
                if (!risk.mMonto || risk.mMonto == 0) {
                  vRisks.countAmountEmpty++;
                }else{
                  var vNumberWorker = parseInt(risk.mNroTrabajadores || 0);
                  var vAmountMin = (risk.mMonto/vNumberWorker);
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
                // console.log('error');
              }, function(defaultError){
                vMaxNumberworkers = false;
                // console.log('errorDefault');
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
              MCASelectedApplication:     true,
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
                MCAMinSalary:             'N',
                PeriodType:               value1.periodType
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
        function _getRisksSessions(isMonthAdvance){
          var vRisksSessions = {
                pension: null,
                health: null
              },
              vApplications = $scope.dataS1.itemsApplication;

          if (isMonthAdvance){
            vRisksSessions.pension = [];
            vRisksSessions.health = [];
            angular.forEach(vApplications, function(application, key1){
              var vRiskSession = application.risks.map(function(risk, key2){
                    var vItem = {
                      RiskNumber:       risk.riskNumber,
                      PayrollQuantity:  risk.mNroTrabajadores || '0',
                      PayrollAmount:    risk.mMonto,
                      MCADeclareRisk:   false, //FIJO
                      MCASelectRisk:    risk.mCheckRisk, //FIJO
                      MCANoMovement:    (risk.mCheckRisk) ? false : true,//FIJO
                      RiskModality:     nsctr_constants.movementType.inclusion.description
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
        function _paramsIndividualLoad(tabPayroll, isMonthAdvance){
          var vApplications = _getApplications(),
              vRisksSessions = _getRisksSessions(isMonthAdvance),
              vParams = {
                ActionOperationUser:    nsctr_constants.movementType.inclusion.description,
                NSCTRSystemType:        $scope.data.MODULE.code,
                AccessMode:             (isMonthAdvance)
                                          ? nsctr_constants.movementType.inclusion.description.toLowerCase()
                                          : nsctr_constants.movementType.declaration.description.toLowerCase(),
                ClientDocumentCode:     $scope.data.STATE_PARAMS['client'].documentNumber,
                ClientDocumentType:     $scope.data.STATE_PARAMS['client'].documentType,
                UserCode:               $scope.data.USER.name,
                WorkCenterData:         $scope.dataS1.mDatosObra || '', //SE AGREGA EN SECONDSTEP
                CostsCenter:            '', //SE AGREGA EN SECONDSTEP
                MCAIdeDeclaration:      (isMonthAdvance)
                                          ? nsctr_constants.movementType.inclusion.code //'DW',
                                          : nsctr_constants.movementType.declaration.code, //'IW',
                AgentCode:              $scope.data.STATE_PARAMS['client'].agentId,
                ValidateRisks:          isMonthAdvance,
                PensionApplication:     vApplications['pension'],
                HealthApplication:      vApplications['health'],
                EmployeesList:          _getEmployeesList(tabPayroll),
                TotalPensionRisk:       {}, //NO ES NECESARIO
                TotalHealthRisk:        {}, //NO ES NECESARIO
                Session:
                {
                  PensionRisksList: vRisksSessions['pension'],
                  HealthRisksList:  vRisksSessions['health'],
                }
              };

          // if (isMonthAdvance)
          vParams.Invoiced = $scope.dataS1.mOpcionFacturacion;
          return vParams;
        }
        function _paramsMassiveLoad(tabPayroll, isMonthAdvance){
          var vParamsIndividualLoad = JSON.stringify(_paramsIndividualLoad(tabPayroll, isMonthAdvance)),
              vFile = $scope.dataS1.replacePayroll.fmImportarPlanilla || {},
              vParams = {};

          if (isMonthAdvance){
            vParams.InclusionJson = vParamsIndividualLoad;
          }else{
            vParams.DeclarationJson = vParamsIndividualLoad;
          }

          vParams.FieldNameHere = vFile[0];
          return vParams;
        }
        function _paramsNextStep(tabPayroll, isMonthAdvance){
          var vParams = ($scope.data.TYPE_LOAD.individual.code == tabPayroll)
                          ? _paramsIndividualLoad(tabPayroll, isMonthAdvance)
                          : _paramsMassiveLoad(tabPayroll, isMonthAdvance);
          return vParams;
        }
        function _paramsRisksPremium(firstParamsInclusion){
          var vParams = [],
              vSession = firstParamsInclusion.data.session,
              vSelectedApplications = $scope.data.STATE_PARAMS['selectedApplications'];

          angular.forEach(vSelectedApplications, function(application, key) {
            var vKeyRisksList = (nsctr_constants.pension.code == application.applicationType)
                                  ? 'pensionRisksList'
                                  : 'healthRisksList';

            var vSelectedRisk = _.find(vSession[vKeyRisksList], function(elem, index){
              return elem.mcaSelectRisk;
            });

            if (vSelectedRisk) {
              var vApplication = {
                UnRealApplication:    application.unTrue,
                SptoNumber:           application.sptoNumber,
                PolicyNumber:         application.policyNumber,
                ClientDocumentNumber: $scope.data.STATE_PARAMS['client'].documentNumber,
                ClientDocumentType:   $scope.data.STATE_PARAMS['client'].documentType,
                ApplicationNumber:    application.aplicationNumber,
                UserId:               $scope.data.USER.name,
                PolicyType:           application.applicationType,
                OperationType:        nsctr_constants.movementType.inclusion.operationType,
                MovementNumber:       parseInt(vSession.movementNumber || 0),
                flgPrimaMinima:       'S' // 'S' => AplicarPrima | 'N' => ExonerarPrima
              }
              vParams.push(vApplication);
            }
          });
          return vParams;
        }
        function _validateForm(isMonthAdvance){
          $scope.frmFirstStep.markAsPristine();
          var vTabPayroll = $scope.dataS1.replacePayroll.tabPayroll,
              vValidateRisks = (isMonthAdvance)
                                  ? $scope.dataS1.fnValidateRisks(vTabPayroll)
                                  : true,
              vValidateReplacePayroll = $scope.dataS1.replacePayroll.fnValidate($scope.dataS1.replacePayroll.tabPayroll);
          return $scope.frmFirstStep.$valid && vValidateRisks && vValidateReplacePayroll;
        }
        function _validateInclusionNoFacturada(isMonthAdvance){
          var vValidate = true;
          if (isMonthAdvance && $scope.dataS1.mOpcionFacturacion == 0){
            var vSelectedApplications = $scope.data.STATE_PARAMS['selectedApplications'],
                vIsLastApplication = vSelectedApplications[0].isLastApplication == 'true';
            vValidate = !vIsLastApplication;
          }
          return vValidate;
        }

        function _actionButton(isMonthAdvance, action, paramsRisksPremium){
          var appCode = window.localStorage['appOrigin'] ? window.localStorage['appOrigin'] : 'OIM';
          var textToAnalytics = nsctrService.fnSearchUrlforGoogleAnalytics();
          if (action > 0){
            // FACTURADA
            gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + ' - Inclusión facturada' , gaLabel: 'Tipo: Facturada'});
            $state.go('.', {
              step: 2,
              paramsRisksPremium: paramsRisksPremium
            });
          }else{
            // if (!isMonthAdvance || action == 0){
            // NO FACTURADA ó INCLUSION MES VENCIDO
            var vParams = $scope.dataS1.FIRST_PARAMS_DI.data;
            mModalConfirm.confirmInfo(
              '¿Está seguro que desea generar la siguiente Inclusión?',
              'GENERAR INCLUSIÓN',
              'GENERAR').then(function(response){
                if (response){
                  gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + ' - Inclusión no facturada' , gaLabel: 'Tipo: No Facturada'});
                  gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + ' - Botón Generar Inclusión' , gaLabel: 'Botón: Generar'});
                  nsctrFactory.common.proxyCommon.CSInclusion_Step2(isMonthAdvance, vParams, true).then(function(response){
                    if (response.operationCode == constants.operationCode.success){
                      var vIdProof = response.data.data.session.constancy.constanciesNumbers;
                      mModalAlert.showSuccess('Se genero la inclusión con éxito', '').then(function(ok){
                        $state.go('regularInclusionGenerated', {
                          client: $scope.data.STATE_PARAMS['client'],
                          idProof: vIdProof
                        });
                      });
                    }else{
                      vError = nsctrService.fnHtmlErrorLoadFile(response.data.errorMessages);
                      mModalAlert.showError(vError,'ERROR INCLUSIÓN').then(function(){
                        redirectToHome();
                      });
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
              vIsMonthAdvance = $scope.data.SHOW_RISKS_LIST;

          $scope.dataS1.FIRST_PARAMS_DI = {};

          if (_validateForm(vIsMonthAdvance)){
            if (_validateInclusionNoFacturada(vIsMonthAdvance)){


              var vTabPayroll = $scope.dataS1.replacePayroll.tabPayroll,
                  vParams = _paramsNextStep(vTabPayroll, vIsMonthAdvance),
                  vParamsRisksPremium = null, //[],
                  vError;

              // nsctrFactory.common.proxyCommon.CSDeclaration_Inclusion_Step1(vIsDeclaration, vIsMonthAdvance, vTabPayroll, vParams, true).then(function(response){
              nsctrFactory.common.proxyCommon.CSInclusion_Step1(vIsMonthAdvance, vTabPayroll, vParams, true).then(function(response){
                $scope.dataS1.FIRST_PARAMS_DI = response.data;

                if (vIsMonthAdvance){
                  vParamsRisksPremium = _paramsRisksPremium($scope.dataS1.FIRST_PARAMS_DI);
                }

                switch(response.operationCode){
                  case constants.operationCode.success:
                    if(response.data.secondaryMessagesList.length>0){
                      $scope.arrayInfoInclusion = response.data.secondaryMessagesList;
                      var vUibModalOptions = {
                            scope: $scope,
                            size: 'lg'
                          },
                          vModalOptions = {
                            showIcon: 'info',
                            title: response.data.messageTitle,
                            titleUppercase: false,
                            templateContent: '/nsctr/app/common/template/tplInfoInclusion.html'
                          };
                      mainServices.fnShowModal(vUibModalOptions, vModalOptions).then(function(acept){
                        if (acept) _actionButton(vIsMonthAdvance, $scope.dataS1.mOpcionFacturacion, vParamsRisksPremium);
                      });
                    }else{
                      _actionButton(vIsMonthAdvance, $scope.dataS1.mOpcionFacturacion, vParamsRisksPremium);
                    }
                    break;
                  case constants.operationCode.code901:
                    var vData = response.data;
                    $scope.workersListDeclared =  vData.secondaryMessagesList;

                    //modalReniecList
                    $scope.modalReniecList = {
                      mainData:{
                        reniecList: vData.employeeResponseMessagesList
                      },
                      data:{}
                    };
                    var vConfigModalReniec = nsctrService.fnDefaultModalOptions($scope, {
                                        template: '<nsctr-modal-reniec-list main-data="modalReniecList.mainData" data="modalReniecList.data"></nsctr-modal-reniec-list>'
                                      }, true, true);
                        vConfigModalReniec.controller = ['$scope', '$uibModalInstance', '$uibModal',
                          function($scope, $uibModalInstance, $uibModal){
                            /*########################
                            # fnActionButton_modalReniecList
                            ########################*/
                            $scope.$on('fnActionButton_modalReniecList', function(event, action){
                              $uibModalInstance.close(action);
                            });
                        }];
                    //modalWorkersListDeclared
                    var uibModalOptionsWorkersListDeclared = {
                          scope: $scope,
                          size: 'lg'
                        },
                        modalOptionsWorkersListDeclared = {
                          showIcon: 'warning',
                          title: "¿Desea continuar con la inclusión?",
                          templateContent: '/nsctr/app/common/template/tplWorkersListDeclared.html'
                        };
                    //

                    if ($scope.modalReniecList.mainData.reniecList.length){
                      $uibModal.open(vConfigModalReniec).result.then(function(action){
                        if (action == 'A'){
                          if ($scope.workersListDeclared.length){
                            mainServices.fnShowModal(uibModalOptionsWorkersListDeclared, modalOptionsWorkersListDeclared).then(function(acept){
                              _actionButton(vIsMonthAdvance, $scope.dataS1.mOpcionFacturacion, vParamsRisksPremium);
                            });
                          }else{
                            _actionButton(vIsMonthAdvance, $scope.dataS1.mOpcionFacturacion, vParamsRisksPremium);
                          }
                        }
                      });
                    }else{
                      mainServices.fnShowModal(uibModalOptionsWorkersListDeclared, modalOptionsWorkersListDeclared).then(function(acept){
                        _actionButton(vIsMonthAdvance, $scope.dataS1.mOpcionFacturacion, vParamsRisksPremium);
                      });
                    }
                    break;
                  case constants.operationCode.code902:
                    vError = nsctrService.fnHtmlErrorLoadFile(response.data.errorMessages);
                    mModalAlert.showError(vError, 'DATOS DE LA PLANILLA ERRONEOS');
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
            }else{
              mModalAlert.showError('No puede hacer inclusiones no facturadas si es la última aplicación de la póliza','ERROR INCLUSIÓN');
            }
          }
        }
        /*########################
        # fnExportReniecList
        ########################*/
        function _executeFrmExportReniecList(){
          $timeout(function(){
            document.getElementById('iFrmExportReniecList').submit();
          }, 0);
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
