(function ($root, deps, action) {
    define(deps, action)
})(this, ['angular', 'constants', 'helper','messagesSeguridad'],
    function (angular, constants, helper, messagesSeguridad) {

        var appSecurity = angular.module('appSecurity');

        appSecurity.controller('crearRol01Controller',
            ['$scope', '$window', '$state', '$timeout', '$uibModal', 'mModalAlert', 'seguridadFactory', 
                function ($scope, $window, $state, $timeout, $uibModal, mModalAlert, seguridadFactory) {

                    /* VARIABLES ROLE */
                    $scope.role = {};
                    $scope.tipoGrupo = {};
                    $scope.saveButtonText = 'CREAR ROL';
                    $scope.showMessage = false;
                    $scope.saveMessageText;
                    var numRole;
                    var responseRoleNum;

                    /* FUNCIONES ROLE */
                    $scope.createS1.saveRole = SaveRole;
                    $scope.exitCurrentStep = ExitCurrentStep;
                    $scope.continueNextStep = ContinueNextStep;
                    $scope.updateTypesRole = UpdateTypesRole;
                    $scope.validateMinLength = ValidateMinLength;

                    function SaveRole(isSteps, e) {
                        if(isValid()){
                            if(!$scope.create.validStep1 || !isSteps){
                                e.cancel = true;
        
                                $scope.role.codEstado = 1;
                                $scope.role.codUsuario = 'TOKEN';
                                $scope.role.codRol = $scope.role.codRol.toUpperCase();
                                $scope.role.nomLargo = $scope.role.nomLargo.toUpperCase();
                                $scope.role.nomCorto = $scope.role.nomCorto ? $scope.role.nomCorto.toUpperCase() : $scope.role.nomCorto;
                                if (numRole === null) createRole();
                                else updateRole();
                            }
                        }else{
                            e.cancel = true;
                        }
                    }

                    function UpdateTypesRole(newValue) {
                        $scope.role.numTipoGrupo = newValue;
                    }

                    function getRoleByCode(roleID, showSpin) {
                        seguridadFactory.getRolDetail(roleID, showSpin)
                        .then(function (response) {
                            if (response.operationCode === 200 || response.operationCode === 404) {
                                $scope.role = response.data;
                                $scope.tipoGrupo.codigo = response.data.numTipoGrupo;
                            } else {
                                mModalAlert.showWarning(response.message, '');
                            }
                            getTypesUsersRole();
                        })
                        .catch(function(error){
                            showErrorMessage(error);
                        });
                    }

                    function getTypesUsersRole() {
                        seguridadFactory.getGroupTypesRole()
                        .then(function (response) {
                            if (response.operationCode === 200) {
                                $scope.userTypes = response.data;
                            }
                        });
                    }

                    function createRole() {
                        seguridadFactory.postCreateRole($scope.role, true)
                        .then(function (response) {
                            if (response.operationCode === 200) {
                                responseRoleNum = response.data.numRole.toString();
                                $scope.create.validStep1 = true;
                                $scope.showMessage = true;
                                $scope.saveMessageText = 'CREÓ';
                            } else {
                                mModalAlert.showWarning(response.message, '');
                            }
                        })
                        .catch(function(error){
                            showErrorMessage(error);
                        });
                    }

                    function updateRole() {
                        var param = {
                            numRole: $scope.role.numRol,
                            codRole: $scope.role.codRol,
                            nomLargo: $scope.role.nomLargo,
                            nomCorto: $scope.role.nomCorto,
                            numTipoGrupo: $scope.role.numTipoGrupo,
                            codUser: 'TOKEN'
                        };
                        seguridadFactory.postUpdateCreate(param, true)
                        .then(function (response) {
                            if (response.operationCode === 200) {
                                $scope.create.validStep1 = true;
                                //$scope.showMessage = true;
                                //$scope.saveMessageText = 'ACTUALIZÓ';
                                responseRoleNum = numRole;
                                ContinueNextStep();
                            } else {
                                mModalAlert.showWarning(response.message, '');
                            }
                        })
                        .catch(function(error){
                            showErrorMessage(error);
                        });
                    }

                    /* REGION GENERICOS */
                    $scope.$on("changingStep", function(event, e){
                        if($scope.showMessage) e.cancel = true;
                        $scope.createS1.saveRole(true, e);
                    });

                    function ExitCurrentStep(){
                        $state.go('roles');
                    }

                    function ContinueNextStep(){
                        $state.go('crearRol.steps', { step: 2, numRol: responseRoleNum });
                    }

                    function showErrorMessage(error){
                        mModalAlert.showWarning(messagesSeguridad.UNEXPECTED_ERROR, '');
                    }

                    function initComponentsDefault() {
                        numRole = $state.params.numRol;
                        if(numRole !== null){
                            $scope.saveButtonText = 'ACTUALIZAR ROL';
                            getRoleByCode(numRole, true);
                        }else{
                            getTypesUsersRole();
                        }
                    }

                    function isValid(){
                        $scope.frmCreateRole.markAsPristine()
                        return $scope.frmCreateRole.$valid  
                            && ValidateMinLength($scope.role.codRol, 2) 
                            && ValidateMinLength($scope.role.nomLargo, 2);
                    }

                    function ValidateMinLength(field, length){
                        if(field === undefined) return false;
                        return field.length >= length;
                    }

                    (function onLoad() {
                        initComponentsDefault();
                    })();

                }])
    });