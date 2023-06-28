(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'nsctr_constants', 'helper',
  'nsctrServiceJs', 'nsctrFactoryJs',
  'nsctrRiskPremiumTableJs',
  'nsctrPendingRiskPremiumTableJs'],
  function(angular, constants, nsctr_constants, helper){

    var appNsctr = angular.module('appNsctr');

    appNsctr.controller('miningDIS2Controller',
      ['$scope', '$window', '$state', '$stateParams', '$timeout', 'mainServices', 'nsctrService',
      'nsctrFactory', 'mModalAlert', 'mModalConfirm', 'locations', 'risksPremium','gaService',
      function($scope, $window, $state, $stateParams, $timeout, mainServices, nsctrService,
        nsctrFactory, mModalAlert, mModalConfirm, locations, risksPremium,gaService){
        /*########################
        # onLoad
        ########################*/
        (function onLoad(){

          $scope.data = $scope.data || {};
          $scope.dataS1 = $scope.dataS1 || {};
          $scope.dataS2 = $scope.dataS2 || {};

          $scope.dataS2.mCentroCostos = $scope.dataS2.mCentroCostos || ($scope.dataS1.FIRST_PARAMS_DI)
                                                                          ? $scope.dataS1.FIRST_PARAMS_DI.data.costsCenter: '';
          $scope.dataS2.locationData = $scope.dataS2.locationData || locations;
          $scope.dataS2.mPrimaMinima = true;
          if (risksPremium) {
            $scope.dataS2.risksPremium = risksPremium[0].data.riskPrima;
            $scope.dataS2.pendingRisksPremium = risksPremium[1].data; //DECLARATION
            $scope.dataS2.risksPremiumOriginal = risksPremium[0].data.riskPrima;
          } else {
            $scope.dataS2.risksPremium = [];
            $scope.dataS2.pendingRisksPremium = []; //DECLARATION
            $scope.dataS2.risksPremiumOriginal = [];
          }
          $scope.MODULE = $state.current.module;
          var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+$scope.MODULE.appCode)), "PROCESOS_ACCIONES", "nombreCabecera");
          $scope.segurityAppPrima = nsctrFactory.validation._filterData(segurity.items, "APLICA_PRIMA_MINIMA_INCLUSION", "nombreCorto");
        })();
        /*########################
        # fnExportReniecList
        ########################*/
        function _executeFrmDownloadPendingPayroll(){
          $timeout(function(){
            document.getElementById('iFrmDownloadPendingPayroll').submit();
          }, 0);
        }
        $scope.fnDownloadPendingPayroll = function(){
          $scope.dataS2.downloadPendingPayroll = nsctrFactory.common.proxyGenerateDeclarationMain.CSDownloadPendingPayroll();
          $scope.dataS2.paramsDownloadPendingPayroll = $stateParams['paramsPendingRisksPremium'];
          _executeFrmDownloadPendingPayroll();
        };
        /*########################
        # fnApplyMinimumPremium
        ########################*/
        function _paramsApplyMinimumPremium(){
          var vRisksPremium = $scope.dataS2.risksPremium,
              vParams = vRisksPremium.map(function(elem, key){
                // Se vuelve a generar el RQ porque el servicio CSServiceRiskPrimaDeclaracion
                // no diferencia correctamemte los campos si devolvemos el elem completo y solo cambiamos el flgPrimaMinima
                return {
                  UnRealApplication:    elem.unRealApplication,
                  SptoNumber:           elem.sptoNumber,
                  PolicyNumber:         elem.policyNumber,
                  ClientDocumentNumber: elem.clientDocumentNumber,
                  ClientDocumentType:   elem.clientDocumentType,
                  ApplicationNumber:    elem.applicationNumber,
                  UserId:               elem.userId,
                  PolicyType:           elem.policyType,
                  OperationType:        elem.operationType,
                  MovementNumber:       elem.movementNumber,
                  flgPrimaMinima:       'N' // 'S' => AplicarPrima | 'N' => ExonerarPrima
                };
              });
          return vParams;
        }
        //Por defecto esta aplicada la prima mínima
        $scope.fnApplyMinimumPremium = function(check) {
          if (check) {
            //Apply
            $scope.dataS2.risksPremium = $scope.dataS2.risksPremiumOriginal;
          } else {
            //Exempt
            var vParams = _paramsApplyMinimumPremium();
            nsctrFactory.common.proxyCommon.CSServiceRiskPrimaDeclaracion(vParams, null, true).then(function(response){
              $scope.dataS2.risksPremium = response[0].data.riskPrima;
            }, function(error){
              // console.log('error');
            });
          }
        };
        /*########################
        # fnGenerate
        ########################*/
        function _validateForm(){
          $scope.frmSecondStep.markAsPristine();
          return $scope.frmSecondStep.$valid;
        }
        function _paramsGenerate(firstParams){
          var vParams = firstParams.data;
          vParams.workCenterData = '';
          vParams.locationId = '';
          vParams.workCenterData = $scope.dataS2.mDatosObra || '';
          vParams.costsCenter = $scope.dataS2.mCentroCostos || '';
          vParams.locationId = ($scope.dataS2.mLocacion && $scope.dataS2.mLocacion.locationId !== null)
                                  ? $scope.dataS2.mLocacion.locationId
                                  : '';
          vParams.flgPrimaMinima = ($scope.dataS2.mPrimaMinima)
                                    ? vParams.flgPrimaMinima
                                    : 'N';
          return vParams;
        }
        $scope.fnGenerate = function(){
          if (_validateForm()){
            var vParams = _paramsGenerate($scope.dataS1.FIRST_PARAMS_DI),
                vMovementType = ($scope.data.IS_DECLARATION)
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
                  var appCode = window.localStorage['appOrigin'] ? window.localStorage['appOrigin'] : 'OIM';
                  var textToAnalytics = nsctrService.fnSearchUrlforGoogleAnalytics();
                  var type = ($scope.data.IS_DECLARATION)? 'Declaración': 'Inclusión'
                  gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + ' - Botón Generar ' + type , gaLabel: 'Botón: Generar', gaValue: 'Procesos Declarar' });
                  nsctrFactory.common.proxyCommon.CSDeclaration_Inclusion_Step2($scope.data.IS_DECLARATION, $scope.data.SHOW_RISKS_LIST, vParams, true).then(function(response){
                    switch (response.operationCode) {
                      case constants.operationCode.success:
                        var vIdProof = response.data.data.session.constancy.constanciesNumbers;
                        mModalAlert.showSuccess(
                          vTextAlertSuccess.description,
                          vTextAlertSuccess.title).then(function(ok){
                            var vMovementTypeE = ($scope.data.IS_DECLARATION)
                                                  ? 'Declaration'
                                                  : 'Inclusion',
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
                        mModalAlert.showError(vError, vTextAlertError.title).then(function(){
                          redirectToHome();
                        });
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

    }]);

  });
