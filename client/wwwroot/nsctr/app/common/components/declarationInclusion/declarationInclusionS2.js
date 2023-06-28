(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'nsctr_constants', 'helper',
  'nsctrServiceJs', 'nsctrFactoryJs',
  'nsctrRiskPremiumTableJs',
  'nsctrPendingRiskPremiumTableJs'],
  function(angular, constants, nsctr_constants, helper){

    var appNsctr = angular.module('appNsctr');

    appNsctr.controller('nsctrDIS2Controller',
      ['$scope', '$window', '$state', '$stateParams', '$timeout', 'mainServices', 'nsctrService',
      'nsctrFactory', 'mModalAlert', 'mModalConfirm', 'risksPremium','gaService',
      function($scope, $window, $state, $stateParams, $timeout, mainServices, nsctrService,
        nsctrFactory, mModalAlert, mModalConfirm, risksPremium, gaService){
        /*########################
        # onLoad
        ########################*/
        
        (function onLoad(){
          $scope.data = $scope.data || {};
          $scope.dataS1 = $scope.dataS1 || {};
          $scope.dataS2 = $scope.dataS2 || {};
          $scope.formData = {};
          $scope.disabled = false;
          $scope.dataS2.mCentroCostos = $scope.dataS2.mCentroCostos || ($scope.dataS1.FIRST_PARAMS_DI)
                                                                          ? $scope.dataS1.FIRST_PARAMS_DI.data.costsCenter: '';
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

          $scope.isRetroactivo = risksPremium[0].data.riskPrima.IsRetroactivo;
          $scope.profile = _validateUser(JSON.parse(localStorage.getItem('evoProfile')));
          $scope.flagRetroactiva =  _calculateRetroactiva($scope.dataS2.risksPremium[0].dateFinishApplication);
          $scope.MODULE = $state.current.module;
          var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+$scope.MODULE.appCode)), "PROCESOS_ACCIONES", "nombreCabecera");
          $scope.segurityAppPrima = nsctrFactory.validation._filterData(segurity.items, "APLICA_PRIMA_MINIMA_INCLUSION", "nombreCorto");
          $scope.isMonthInAdvance = $scope.data.STATE_PARAMS.selectedApplications[0].declarationType.toUpperCase() === 'MES ADELANTADO';
        })();
        /*########################
        # fnExportReniecList
        ########################*/
        function _executeFrmDownloadPendingPayroll(){
          $timeout(function(){
            document.getElementById('iFrmDownloadPendingPayroll').submit();
          }, 0);
        }
        function _calculateRetroactiva(dateStartApplication){//[0].dateStartApplication.split("/")[1]
          var newDate = dateStartApplication.split("/");
          var f1 = new Date(Number(newDate[2]), Number(newDate[1])-1, Number(newDate[0]));
          var f2 = new Date();
          return f1 < f2 ? true : false;
        }

        $scope.fnDownloadPendingPayroll = function(){
          $scope.dataS2.downloadPendingPayroll = nsctrFactory.common.proxyGenerateDeclarationMain.CSDownloadPendingPayroll();
          $scope.dataS2.paramsDownloadPendingPayroll = $stateParams['paramsPendingRisksPremium'];
          _executeFrmDownloadPendingPayroll();
        };
        /*########################
        # fnApplyMinimumPremium
        ########################*/

        function _validateUser(profile){
          var userRol = false;
          for (var index = 0; index < profile.rolesCode.length; index++) {
            if( profile.rolesCode[index].nombreAplicacion == $state.current.module.appCode && profile.rolesCode[index].codigoRol != 'ADMIN'){
              userRol = true;
            }
          }
          return userRol;
        }

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
        # fnGenerateProof
        ########################*/
        function _validateForm(){
          $scope.frmSecondStep.markAsPristine();
          return $scope.frmSecondStep.$valid;
        }


        function _validateFile(){
          var re = true;
          if($scope.profile && $scope.flagRetroactiva && $scope.isMonthInAdvance){
            if(!$scope.formData.fileLoaded){
              //$scope.frmSecondStep.$valid = false;
              $scope.formData.invalidPlanilla = true;
              re = false;
            }
          }

          return re;
        }
        function _paramsGenerateProof(firstParams){
          var vParams = firstParams.data;
          vParams.workCenterData = '';
          vParams.costsCenter = '';
          vParams.workCenterData = $scope.dataS2.mDatosObra || '';
          vParams.costsCenter = $scope.dataS2.mCentroCostos || '';
          vParams.flgPrimaMinima = ($scope.dataS2.mPrimaMinima)
                                    ? vParams.flgPrimaMinima
                                    : 'N';
          if ($scope.formData.fileLoaded) vParams.docSiniestro = {
            data: $scope.formData.planilla,
            nombre: $scope.formData.fileName,
            extension : $scope.formData.fileName.replace(/^.*\./, '')
          };
          return vParams;
        }

        function getBase64(fileInput) {
          var reader = new FileReader();
          reader.readAsDataURL(fileInput.files[0]);

          reader.onload = function () {
            $scope.formData.planilla = reader.result.split(",")[1];
          };
          reader.onerror = function (error) {
            console.log('Error: ', error);
          };


          /*return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(){
              resolve(reader.result)
            };
            reader.onerror = function(error){
              reject(error);
            }
          }); */
        }

        $scope.fnUploadFile = function(file){
          if(file.files[0]){
            //_convertir(file);
            getBase64(file);
            $scope.formData.fileName = file.files[0].name;
            $scope.formData.fileLoaded = true;
            $scope.formData.invalidPlanilla = false;
          }
        }

        $scope.fnGenerateProof = function(){
          if (_validateForm() && _validateFile()){
            var vParams = _paramsGenerateProof($scope.dataS1.FIRST_PARAMS_DI),
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
                        vError = nsctrService.fnHtmlErrorLoadFile(response.data.errorMessages);
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
            }, function(otherOptions){
              return false;
            });
          } else {
            if($scope.profile && !$scope.formData.fileLoaded && $scope.isMonthInAdvance){
              mModalAlert.showError('Documento de no siniestro es requerido', 'ERROR').then(function(){});
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

    }]);

  });
