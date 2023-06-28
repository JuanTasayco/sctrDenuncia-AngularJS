(function($root, deps, action){
    define(deps, action)
  })(this, ['angular', 'constants', 'helper', 'messagesSeguridad'],
    function(angular, constants, helper, messagesSeguridad){

      var appSecurity = angular.module('appSecurity');

      appSecurity.controller('crearAplicaciones01Controller',
        ['$scope','$state', 'mModalAlert', 'seguridadFactory',
          function($scope, $state, mModalAlert, seguridadFactory){

            /* VARIABLES */
            $scope.application = {};
            $scope.saveButtonText = 'CREAR APLICACIÓN';
            $scope.showMessage = false;
            $scope.saveMessageText;
            $scope.systemList = {};
            $scope.systemData = [];
            $scope.systemId = {};

            var numApplication;

            /* REGION APPLICATIONS */
            $scope.createS1.saveApplication = SaveApplication;
            $scope.exitCurrentStep = ExitCurrentStep;
            $scope.continueNextStep = ContinueNextStep;
            $scope.validateMinLength = ValidateMinLength;
            $scope.updateSystemId = UpdateSystemId;

            function GetApplicationByCode(numApplication, showSpin) {
                seguridadFactory.getApplicationDetail(numApplication, showSpin)
                .then(function (response) {
                    if (response.operationCode === 200 || response.operationCode === 404) {
                        $scope.application.applicationCode = response.data.codAplicacion;
                        $scope.application.longName = response.data.nomLargo;
                        $scope.application.shortName = response.data.nomCorto;
                        $scope.application.tipMobApl = response.data.webMovil;
                        $scope.application.url = response.data.rutAcceso;
                        $scope.application.defaultPage = response.data.paginaDefecto;
                        $scope.application.defaultPagMYD = response.data.paginaDefectoMYD;
                        $scope.application.statusCode = response.data.codEstado;
                        $scope.application.redirectUrl = response.data.redirectUrl;
                        $scope.systemId.codigo = response.data.systemId;
                        $scope.updateSystemId($scope.systemId);
                        $scope.createS1.reqSystems = false;
                        $scope.application.listSystem = response.data.listSystem;
                        $scope.systemsChange();
                    }else{
                        mModalAlert.showWarning(respomse.message, '');
                    }
                })
                .catch(function(error){
                    ShowErrorMessage(error);
                });
            }

            function GetSystemList() {
              seguridadFactory.getSystemList().then(function (response) {
                if (response.operationCode === 200) {
                    $scope.systemList = response.data;
                    $scope.systemData = response.data;
                }
              });
            }

            function UpdateSystemId(newValue) {
              newValue = newValue || {}
              $scope.application.systemId = newValue.codigo || null;
            }

            function SaveApplication(isSteps, isNextStep, e){
                if(IsValid()){
                    if(!$scope.create.validStep1 || !isSteps){
                        e.cancel = true;

                        $scope.application.applicationCode = $scope.application.applicationCode.toUpperCase();
                        $scope.application.longName = $scope.application.longName.toUpperCase();
                        $scope.application.shortName = $scope.application.shortName ? $scope.application.shortName.toUpperCase(): $scope.application.shortName;
                        $scope.application.url = $scope.application.url.toUpperCase();
                        $scope.application.defaultPage = $scope.application.defaultPage ? $scope.application.defaultPage.toUpperCase(): $scope.application.defaultPage;
                        $scope.application.tipMobApl = +$scope.application.tipMobApl;
                        $scope.application.userCode = 'TOKEN';
                        if(numApplication !== null) Update();
                        else Create();
                    }
                }else{
                    e.cancel = true;
                }
            }

            function Create(){
                $scope.application.statusCode = 1;
                seguridadFactory.postCreateApplication($scope.application, true)
                .then(function (response) {
                    if (response.operationCode === 200) {
                        numApplication = response.data;
                        $scope.showMessage = true;
                        $scope.saveMessageText = 'CREÓ';
                        $scope.create.validStep1 = true;
                    } else {
                        mModalAlert.showWarning(response.message, '');
                    }
                })
                .catch(function(error){
                    ShowErrorMessage(error);
                });
            }

            function Update(){
                $scope.application.applicationNumber = numApplication;

                seguridadFactory.postUpdateApplication($scope.application, true).then(function (response) {
                    if (response.operationCode === 200) {
                        $scope.create.validStep1 = true;
                        ContinueNextStep();
                    } else {
                        mModalAlert.showWarning(response.message, '');
                    }
                }, function(error){
                    ShowErrorMessage(error);
                });
            }

            /* REGION GENERICOS */
            $scope.$on("changingStep", function(event, e){
                if($scope.showMessage) e.cancel = true;
                $scope.createS1.saveApplication(true, true, e);
            });

            function ValidateMinLength(field, length){
                if(field === undefined) return false;
                return field.length >= length;
            }

            function ExitCurrentStep(){
                $state.go('aplicaciones');
            }

            function ContinueNextStep(){
                $state.go('crearAplicaciones.steps', { step: 2, numAplicacion : numApplication });
            }

            function ShowErrorMessage(error){
                mModalAlert.showWarning(messagesSeguridad.UNEXPECTED_ERROR, '');
            }

            function InitComponentsDefault(){
                GetSystemList();
                numApplication = $state.params.numAplicacion;
                if(numApplication !== null){
                    $scope.saveButtonText = 'ACTUALIZAR APLICACIÓN';
                    GetApplicationByCode(numApplication, true);
                }
            }

            function IsValid(){
                $scope.frmCreateApplication.markAsPristine()
                return $scope.frmCreateApplication.$valid
                        && ValidateMinLength($scope.application.applicationCode, 2)
                        && ValidateMinLength($scope.application.longName, 2);
            }

            (function onLoad(){
              $scope.create = $scope.create || {};
              $scope.createS1 = $scope.createS1 || {};
              $scope.createS2 = $scope.createS2 || {};
              InitComponentsDefault();
            })();

            $scope.systemsChange = function(checkedItem) {
              var required = $scope.application.listSystem && !!$scope.application.listSystem.length;
              $scope.createS1.reqDefaultPage = required;
              $scope.createS1.reqDefaultSystem = required;
            };

          }])
    });
