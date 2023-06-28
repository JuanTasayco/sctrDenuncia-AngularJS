(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'nsctr_constants', 'helper', 'lodash',
  'nsctrServiceJs', 'nsctrFactoryJs',
  'miningTypeRegisterJs',
  'miningCheckFilterJs',
  'nsctrNoResultFilterJs',
  'miningModalWorkerDataJs',
  'nsctrModalReniecListJs'],
  function(angular, constants, nsctr_constants, helper, _){

    var appNsctr = angular.module('appNsctr');

    appNsctr.controller('miningDIS1Controller',
      ['$rootScope', '$scope', '$window', '$state', '$stateParams', '$timeout', 'mainServices', 'nsctrService',
      'nsctrFactory', 'mModalAlert', 'mModalConfirm', '$uibModal', 'locations', 'risksList','gaService',
      function($rootScope, $scope, $window, $state, $stateParams, $timeout, mainServices, nsctrService,
        nsctrFactory, mModalAlert, mModalConfirm, $uibModal, locations, risksList,gaService) {
        /*########################
        # Variables
        ########################*/
        var fnWatchCheckFilter = function(){};

        function _mergeRisksList(selectedApplicationsPolicies, risksList) {
          var vRisksList = risksList.reduce(function(previous, application) {
            var vApplication = (application.policyType === nsctr_constants.pension.code)
                                ? {
                                    type: nsctr_constants.pension.description,
                                    property: { pensionRiskList: [], pensionRisks: '' }
                                  }
                                : {
                                    type: nsctr_constants.health.description,
                                    property: { healthRiskList: [], healthRisks: '' }
                                  };

            var vApplicationRisks = application.risks.reduce(function(pre, risk, index) {
              var vRisk = '[' + risk.riskNumber + '] ' + risk.riskDescription;
              pre[vApplication.type + 'RiskList'].push(vRisk);

              var vBar = (index > 0)
                          ? ' | '
                          : '';
              pre[vApplication.type + 'Risks'] += vBar + vRisk;

              return pre;
            }, vApplication.property);

            return angular.extend({}, previous, vApplicationRisks);
          }, {});

          // Retornamos el selectedApplicationsPolicies con los nuevos valores de (pension/health)risksList
          return Object.keys(vRisksList)
            .reduce(function(previous, key) {
              previous[key] = vRisksList[key];

              return previous;
            }, selectedApplicationsPolicies);
        }
        /*########################
        # onLoad
        ########################*/
        (function onLoad(){

          $scope.data = $scope.data || {};
          $scope.data.STATE_PARAMS['selectedApplicationsPolicies'] =  _mergeRisksList($scope.data.STATE_PARAMS['selectedApplicationsPolicies'], risksList);
          $scope.dataS1 = $scope.dataS1 || {};
          $scope.dataS2 = $scope.dataS2 || {};

          $scope.dataS1.dataList = $scope.dataS1.dataList || new nsctrFactory.object.oDataListCheckFilter();
          $scope.dataS1.noResult = $scope.dataS1.noResult || { filter: new nsctrFactory.object.oNoResultFilter() };

          if (!$scope.data.IS_DECLARATION){
            if ($scope.data.SHOW_RISKS_LIST){
              if (typeof $scope.dataS1.mOpcionFacturacion == 'undefined') $scope.dataS1.mOpcionFacturacion = 1;
            }
          }
          $scope.MODULE = $state.current.module;
          $scope.dataS1.locationData = $scope.dataS1.locationData || locations;
          var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+$scope.MODULE.appCode)), "PROCESOS_ACCIONES", "nombreCabecera");
          $scope.segurityNotDeclared = nsctrFactory.validation._filterData(segurity.items, "GENERAR_INCLUSION_CONDICION_NO_DECLARADA", "nombreCorto");
          $scope.segurityDeclared = nsctrFactory.validation._filterData(segurity.items, "GENERAR_INCLUSION_CONDICION_DECLARADA", "nombreCorto");

        })();
        /*########################
        # _setCheckFilter
        ########################*/
        function _setCheckFilter(){
          $scope.$broadcast('fnSetCheckFilter_checkFilter');
        }
        /*########################
        # fnProcess
        ########################*/
        function _totalSalary(workersList){
          var vTotal = workersList.reduce(function(previous, current) {
            if (current.mCheck) return previous + parseFloat(current.salary);
            return previous;
          }, 0);
          return vTotal;
        }
        function _paramsProcess(params) {
          var vParams = params;
          vParams.pensionRisks = $scope.data.STATE_PARAMS['selectedApplicationsPolicies'].pensionRisks || '';
          vParams.healthRisks = $scope.data.STATE_PARAMS['selectedApplicationsPolicies'].healthRisks || '';
          return vParams;
        }
        function _process(params){
          var vParams = _paramsProcess(params),
              vError;
          nsctrFactory.mining.proxyMiningGenerateInclusionMain.CSMining_Step1_ListaAptoPadron(vParams, true)
            .then(function(response){
              switch(response.operationCode){
                case constants.operationCode.success:
                  $scope.dataS1.mCheckAll = true;
                  fnWatchCheckFilter = $scope.$watch('dataS1.checkFilter.checkList', function(newValue, oldValue){
                    var vCheckList = newValue || $scope.dataS1.checkFilter.checkList;
                    $scope.dataS1.dataList.setDataList(response.data.data, vCheckList, 'able', $scope.data.USER.permissions);
                    $scope.dataS1.totalSalary = _totalSalary(response.data.data);
                  });
                  break;
                case constants.operationCode.code902:
                  vError = nsctrService.fnHtmlErrorLoadFile(response.data.errorMessages);
                  mModalAlert.showError(vError, 'DATOS DE LA PLANILLA ERRONEOS');
                  break;
                default: //900
                  vError = nsctrService.fnHtmlErrorLoadFile(response.data.errorMessages);
                  mModalAlert.showWarning(vError, 'ALERTA');
              }
            }).catch(function() {
              mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
            });
        }
        $scope.fnProcess = function(){
          $scope.$broadcast('fnParamsRequest_typeRegister');
        };
        /*########################
        # fnFromTypeRegister
        ########################*/
        $scope.$on('fnSendParams_typeRegister', function(event, valid, activeTab, params){
          if (valid){
            _setCheckFilter();
            _process(params);
          }
        });
        /*########################
        # fnCheckFilter
        ########################*/
        $scope.fnCheckFilter = function(currentCheck) {
          $scope.dataS1.dataList.setDataListByCheckFilter($scope.dataS1.checkFilter.checkList, currentCheck)
            .then(function(response) {
              $scope.dataS1.totalSalary = _totalSalary(response);
              $scope.dataS1.noResult.filter.setNoResult(!response.length);
            });
        };
        /*#######################
        # fnCheckAll
        #######################*/
        $scope.fnCheckAll = function(checkAll){
          var vWorkersList = $scope.dataS1.dataList.list;
          _.map(vWorkersList, function(item, index, array){
            return item.mCheck = (checkAll)
                                    ? !item.disabled
                                    : checkAll;
          });
          $scope.dataS1.totalSalary = (checkAll)
                                        ? _totalSalary(vWorkersList)
                                        : 0;
        }
        /*#######################
        # fnCheck
        #######################*/
        $scope.fnCheck = function(item){
          $scope.dataS1.mCheckAll = false;
          if (item.mCheck){
            $scope.dataS1.totalSalary += parseFloat(item.salary);
          }else{
            $scope.dataS1.totalSalary -= parseFloat(item.salary);
          }
        }
        /*#######################
        # fnShowModalWorkerData
        #######################*/
        $scope.fnShowModalWorkerData = function(item, event){
          if (event) {
            event.preventDefault();
            event.stopPropagation();
          }
          $scope.modalWorkerData = {
            constants: {
              module: $scope.data.MODULE,
              user: $scope.data.USER
            },
            mainData: item,
            data:{}
          };
          var vOptModal = nsctrService.fnDefaultModalOptions($scope, {
                            size: 'lg',
                            template: '<mining-modal-worker-data main-data="modalWorkerData.mainData" constants="modalWorkerData.constants"></mining-modal-worker-data>'
                          });
          vOptModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
            function($scope, $uibModalInstance, $uibModal){
              /*########################
              # fnCloseModal_modalManualProof
              ########################*/
              $scope.$on('fnCloseModal_modalWorkerData', function(isClose) {
                if (isClose){
                  $uibModalInstance.close();
                }else{
                  $uibModalInstance.dismiss('cancel');
                }
              });
          }];

          $uibModal.open(vOptModal);
        }









        /*#######################
        # fnActionButton
        #######################*/
        function _validateInclusionNoFacturada(showRisksList){
          var vValidate = true;
          if (showRisksList && $scope.dataS1.mOpcionFacturacion == 0){
            var vIsLastApplication = $scope.data.STATE_PARAMS['selectedApplications'][0].isLastApplication == 'true';
            vValidate = !vIsLastApplication;
          }
          return vValidate;
        }
        function _validateForm(isDeclaration, showRisksList){
          $scope.frmFirstStep.markAsPristine();
          var vMessage = {
                type: null,
                title: null,
                description: null
              },
              vWorksList = $scope.dataS1.dataList.list && $scope.dataS1.dataList.list.length > 0,
              vForm = $scope.frmFirstStep.$valid,
              vNoFacturada = (isDeclaration) //DECLARATION NO TIENE NO FACTURADAS
                              ? true
                              : _validateInclusionNoFacturada(showRisksList),
              vValidate = vWorksList && vForm && vNoFacturada;

          if (!vValidate){
            if (!vWorksList) {
              vMessage.type = 'A';
              vMessage.title = 'CARGAR EXCEL';
              vMessage.description = 'Cargar/procesar excel de trabajadores';
            }else if(!vNoFacturada){
              vMessage.type = 'A';
              vMessage.title = 'ALERTA';
              vMessage.description = 'No puede hacer inclusiones no facturadas si es la última aplicación de la póliza';
            }
          }

          return {
            validate: vValidate,
            message: vMessage
          };
        }
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

            var vApplicationType = (value1.applicationType == nsctr_constants.pension.code)
                                    ? 'pension'
                                    : 'health';

            vApplications[vApplicationType] = vApplication;
          });
          return vApplications;
        }
        function _getEmployeesList(){
          var vWorkersList = $scope.dataS1.dataList.list,
              vEmployeesList = vWorkersList.filter(function(value1, index1){
                return value1.mCheck;
              });
          return vEmployeesList;
        }
        function _getRisksSessions(showRisksList, keyValue) {
          var vRisksSessions = [],
              vWorkersList = $scope.dataS1.dataList.list;

          if (showRisksList){
            //Agrupar por risk en pension o salud
            var vArrayRisk = vWorkersList.reduce(function(res, elem){
              if (elem.mCheck && elem[keyValue]) {
                if (!res[elem[keyValue]]){
                  res[elem[keyValue]] = {
                    RiskNumber      : elem[keyValue],
                    PayrollQuantity : 0,
                    PayrollAmount   : 0,
                    MCADeclareRisk  : $scope.data.IS_DECLARATION, //PARA DECLARATION => risk.mCheckDeclarar
                    MCASelectRisk   : !$scope.data.IS_DECLARATION, //PARA INCLUSION => risk.mCheckRisk
                    MCANoMovement   : false, //FIJO => (INCLUSION)(risk.mCheckRisk) ? false : true, | (DECLARATION)(risk.mCheckDeclarar) ? false : true,
                    RiskModality    : ($scope.data.IS_DECLARATION)
                                        ? nsctr_constants.movementType.declaration.description
                                        : nsctr_constants.movementType.inclusion.description
                  };
                }
                res[elem[keyValue]].PayrollQuantity++;
                res[elem[keyValue]].PayrollAmount += parseFloat(elem.salary);
              }
              return res;
            }, {});
            // Setea los objectos en el array de salida
            // Se remueve los indices que se le colocaron a este array(vArrayRisk) en base al riskNumber
            angular.forEach(vArrayRisk, function(elem1, key1){
            	vRisksSessions.push(elem1);
            });

          }
					return vRisksSessions;
        }

        function _paramsIndividualLoad(showRisksList){
          var vMovementType = nsctr_constants.movementType,
              vApplications = _getApplications(),
              vEmployeesList = _getEmployeesList();

          var vParams = {
            NSCTRSystemType:        $scope.data.MODULE.code,
            AccessMode:             ($scope.data.IS_DECLARATION)
                                      ? vMovementType.declaration.description.toLowerCase()
                                      : (showRisksList)
                                          ? vMovementType.inclusion.description.toLowerCase()
                                          : vMovementType.declaration.description.toLowerCase(),
            ClientDocumentCode:     $scope.data.STATE_PARAMS['client'].documentNumber,
            ClientDocumentType:     $scope.data.STATE_PARAMS['client'].documentType,
            UserCode:               $scope.data.USER.name,
            WorkCenterData:         $scope.dataS1.mDatosObra || '', //SE AGREGA EN SECONDSTEP
            CostsCenter:            '',
            MCAIdeDeclaration:      ($scope.data.IS_DECLARATION)
                                      ? vMovementType.declaration.code
                                      : (showRisksList)
                                          ? vMovementType.inclusion.code
                                          : vMovementType.declaration.code,
            AgentCode:              $scope.data.STATE_PARAMS['client'].agentId,
            ValidateRisks:          showRisksList, //false, //SIEMPRE FALSO PARA MINERIA //showRisksList,
            PensionApplication:     vApplications['pension'],
            HealthApplication:      vApplications['health'],
            EmployeesList:          vEmployeesList,
            TotalPensionRisk:       {}, //??? NO ES NECESARIO
            TotalHealthRisk:        {}, //??? NO ES NECESARIO
            Session:
            {
              PensionRisksList: _getRisksSessions(showRisksList, 'pensionRisk'),
              HealthRisksList:  _getRisksSessions(showRisksList, 'healthRisk')
            },
            locationId: ($scope.dataS1.mLocacion && $scope.dataS1.mLocacion.locationId !== null)
                          ? $scope.dataS1.mLocacion.locationId
                          : 0
          };

          if (!$scope.data.IS_DECLARATION){
            if (showRisksList) vParams.Invoiced = $scope.dataS1.mOpcionFacturacion;
          }

          return vParams;
        }
        function _paramsRisksPremium(firstParamsDI){
          var vParams = [],
              vSession = firstParamsDI.data.session,
              vSelectedApplications = $scope.data.STATE_PARAMS['selectedApplications'];

          angular.forEach(vSelectedApplications, function(application, key) {
            var vRisksList = (nsctr_constants.pension.code == application.applicationType)
                            ? 'pensionRisksList'
                            : 'healthRisksList';

            if (vSession[vRisksList].length > 0){
              var vApplication = {
                UnRealApplication:    application.unTrue,
                SptoNumber:           application.sptoNumber,
                PolicyNumber:         application.policyNumber,
                ClientDocumentNumber: $scope.data.STATE_PARAMS['client'].documentNumber,
                ClientDocumentType:   $scope.data.STATE_PARAMS['client'].documentType,
                ApplicationNumber:    application.aplicationNumber,
                UserId:               $scope.data.USER.role,
                PolicyType:           application.applicationType,
                OperationType:        ($scope.data.IS_DECLARATION)
                                        ? nsctr_constants.movementType.declaration.operationType
                                        : nsctr_constants.movementType.inclusion.operationType,
                MovementNumber:       parseInt(vSession.movementNumber || 0),
                flgPrimaMinima:       'S' // 'S' => AplicarPrima | 'N' => ExonerarPrima
              };
              vParams.push(vApplication);
            }
          });
          return vParams;
        }
        function _actionButton(isDeclaration, showRisksList, action, paramsRisksPremium, paramsPendingRisksPremium){
          var vGoSecondStep = (isDeclaration)
                                ? showRisksList
                                : parseInt(action);
          var appCode = window.localStorage['appOrigin'] ? window.localStorage['appOrigin'] : 'OIM';
          var textToAnalytics = nsctrService.fnSearchUrlforGoogleAnalytics();
          if (vGoSecondStep){
            // FACTURADA
            if(!isDeclaration){
              // Inclusión emite taggeo
              gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + ' - Inclusión facturada' , gaLabel: 'Tipo: Facturada'});
            }
            $state.go('.', {
              step: 2,
              paramsRisksPremium: paramsRisksPremium,
              paramsPendingRisksPremium: paramsPendingRisksPremium //DECLARATION
            });
          }else{
            var vParams = $scope.dataS1.FIRST_PARAMS_DI.data,
                vMovementType = (isDeclaration)
                                  ? 'declaración'
                                  : 'inclusión',
                vTextModalConfirm = {
                  title:        'GENERAR ' + vMovementType.toUpperCase(),
                  description:  '¿Está seguro que desea generar la siguiente ' + vMovementType + '?',
                  button:       'GENERAR'
                },
                vTextAlertSuccess = {
                  title: '',
                  description: 'Se genero la ' + vMovementType + ' con éxito',
                },
                vTextAlertError = {
                  title: 'ERROR ' + vMovementType.toUpperCase()
                };

            mModalConfirm.confirmInfo(
              vTextModalConfirm.description,
              vTextModalConfirm.title,
              vTextModalConfirm.button).then(function(response){
                if (response){
                  if(!isDeclaration){
                    // Inclusión emite taggeo
                    gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + ' - Inclusión no facturada' , gaLabel: 'Tipo: No Facturada'});
                    gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + ' - Botón Generar Inclusión' , gaLabel: 'Botón: Generar'});
                  }
                  nsctrFactory.common.proxyCommon.CSDeclaration_Inclusion_Step2(isDeclaration, showRisksList, vParams, true).then(function(response){
                    switch (response.operationCode) {
                      case constants.operationCode.success:
                        var vIdProof = response.data.data.session.constancy.constanciesNumbers;
                        mModalAlert.showSuccess(
                          vTextAlertSuccess.description,
                          vTextAlertSuccess.title).then(function(ok){
                            var vMovementTypeE = (isDeclaration) ? 'Declaration' : 'Inclusion',
                                vStateName = $scope.data.MODULE.prefixState + vMovementTypeE + 'Generated';
                            $state.go(vStateName, {
                              client: $scope.data.STATE_PARAMS['client'],
                              idProof: vIdProof
                            });
                        });
                        break;
                      case constants.operationCode.code900:
                        mModalAlert.showError(response.message, 'ERROR').then(redirectToHome);
                        break;
                      default:
                        var vError = nsctrService.fnHtmlErrorLoadFile(response.data.errorMessages);
                        mModalAlert.showError(vError, vTextAlertError.title);
                        break;
                    }
                  }, function(error){
                    mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
                  });
                }
            }, function(otherOptions){
              return false;
            });
          }
        }
        //fnExportReniecList
        function _executeFrmExportReniecList(){
          $timeout(function(){
            document.getElementById('iFrmExportReniecList').submit();
          }, 0);
        }
        $scope.fnActionButton = function(){
          var vIsDeclaration = $scope.data.IS_DECLARATION,
              vShowRiskList = $scope.data.SHOW_RISKS_LIST,
              vValidateForm = _validateForm(vIsDeclaration, vShowRiskList);

          $scope.dataS1.FIRST_PARAMS_DI = {};
          if (vValidateForm.validate){
            var vParams = _paramsIndividualLoad(vShowRiskList),
                vParamsRisksPremium = null,
                vParamsPendingRisksPremium = null,
                vError;

            nsctrFactory.common.proxyCommon.CSDeclaration_Inclusion_Step1(vIsDeclaration, vShowRiskList, $scope.data.TYPE_LOAD.individual.code, vParams, true).then(function(response){
              $scope.dataS1.FIRST_PARAMS_DI = response.data;
              if (vShowRiskList) {
                vParamsRisksPremium = _paramsRisksPremium($scope.dataS1.FIRST_PARAMS_DI);
                vParamsPendingRisksPremium = $scope.dataS1.FIRST_PARAMS_DI;
              }

              switch(response.operationCode){
                case constants.operationCode.success:
                  if(!vIsDeclaration && response.data.secondaryMessagesList.length > 0){
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
                      if (acept) _actionButton(vIsDeclaration, vShowRiskList, $scope.dataS1.mOpcionFacturacion, vParamsRisksPremium, vParamsPendingRisksPremium);
                    });
                  }else{
                    _actionButton(vIsDeclaration, vShowRiskList, $scope.dataS1.mOpcionFacturacion, vParamsRisksPremium, vParamsPendingRisksPremium);
                  }
                  break;
                case constants.operationCode.code901:
                  var vData = response.data;
                  $scope.workersListDeclared = vData.secondaryMessagesList;

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
                            _actionButton(vIsDeclaration, vShowRiskList, $scope.dataS1.mOpcionFacturacion, vParamsRisksPremium, vParamsPendingRisksPremium);
                          });
                        }else{
                          _actionButton(vIsDeclaration, vShowRiskList, $scope.dataS1.mOpcionFacturacion, vParamsRisksPremium, vParamsPendingRisksPremium);
                        }
                      }
                    });
                  }else{
                    mainServices.fnShowModal(uibModalOptionsWorkersListDeclared, modalOptionsWorkersListDeclared).then(function(acept){
                      _actionButton(vIsDeclaration, vShowRiskList, $scope.dataS1.mOpcionFacturacion, vParamsRisksPremium, vParamsPendingRisksPremium);
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
              mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
            });
          }else{
            switch (vValidateForm.message.type){
              case 'A':
                mModalAlert.showWarning(vValidateForm.message.description, vValidateForm.message.title);
                break;
              case 'E':
                mModalAlert.showError(vValidateForm.message.description,vValidateForm.message.title);
                break;
            }
          }
        }

        function redirectToHome() {
          var vStateName = $scope.data.MODULE.prefixState + 'SearchClient';
          $state.go(vStateName, {
            client: $scope.data.STATE_PARAMS['client'],
            policyNumber: $scope.data.STATE_PARAMS.selectedApplications[0].policyNumber || null
          });
        }

        /*#######################
        # DESTROY_EVENTS
        #######################*/
        $scope.$on('$destroy', function(){
          fnWatchCheckFilter();
        });

    }])

  });
