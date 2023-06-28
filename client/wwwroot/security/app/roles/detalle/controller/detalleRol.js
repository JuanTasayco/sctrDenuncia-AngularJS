(function ($root, deps, action) {
    define(deps, action)
})(this, ['angular', 'constants', 'helper', 'messagesSeguridad'],
    function (angular, constants, helper, messagesSeguridad) {

        var appSecurity = angular.module('appSecurity');

        appSecurity.controller('detalleRolController',
            ['$scope', '$state', '$q', '$timeout', 'mModalAlert', 'mModalConfirm', 'seguridadFactory',
                function ($scope, $state, $q, $timeout, mModalAlert, mModalConfirm, seguridadFactory) {

                    $scope.frmUpdateRole = {};
                    $scope.ENABLE_STATE = messagesSeguridad.CODIGO_ESTADO.HABILITADO;
                    $scope.DISABLED_STATE = messagesSeguridad.CODIGO_ESTADO.DESHABILITADO;

                    /* VARIABLES ROLE */
                    $scope.roleDetail = {};
                    $scope.codEstado = {};
                    $scope.tipoGrupo = {};
                    $scope.isDisabled = true;

                    /* VARIABLES APPLICATION - PROFILE*/
                    var searchApplication;
                    var searchProfile;
                    var searchRole;

                    /* SUB ROLES */
                    var searchTypeGroup = null;

                    /* FUNCIONES ROLE */
                    function getRoleByCode(roleID, showSpin) {
                        seguridadFactory.getRolDetail(roleID, showSpin)
                        .then(function (response) {
                            if (response.operationCode === 200 || response.operationCode === 404) {
                                $scope.roleDetail = response.data;
                                $scope.codEstado.codigo = response.data.codEstado;
                                $scope.tipoGrupo.codigo = response.data.numTipoGrupo;
                                $scope.isDisabled = !!response.data.numTipoGrupo;
                                searchTypeGroup = angular.copy(response.data.numTipoGrupo);
                            }else{
                                mModalAlert.showWarning(response.message, '');
                            }
                            getTypesUsersRole();
                            getStatusCodeRole();
                        })
                        .catch(function(error){
                            showErrorMessage(error);
                        });
                    }

                    function getTypesUsersRole() {
                        seguridadFactory.getGroupTypesRole().then(function (response) {
                            if (response.operationCode === 200) {
                                $scope.userTypes = response.data;
                            }
                        });
                    }

                    function getStatusCodeRole() {
                        seguridadFactory.getStatusTypes().then(function (response) {
                            if (response.operationCode === 200) {
                                $scope.userCodes = response.data;
                            }
                        });
                    }

                    $scope.updateStatusRole = function (newValue) {
                        $scope.roleDetail.codEstado = newValue;
                    }

                    $scope.updateTypesRole = function (newValue) {
                        $scope.roleDetail.numTipoGrupo = newValue;
                    }

                    $scope.updateRole = function () {
                        if(isValid()){
                            $scope.roleDetail.codRol = $scope.roleDetail.codRol.toUpperCase();
                            $scope.roleDetail.nomLargo = $scope.roleDetail.nomLargo.toUpperCase();
                            $scope.roleDetail.nomCorto = $scope.roleDetail.nomCorto ? $scope.roleDetail.nomCorto.toUpperCase(): $scope.roleDetail.nomCorto;
                            $scope.roleDetail.codUser = 'TOKEN';
                            seguridadFactory.postUpdateRole($scope.roleDetail, true)
                            .then(function (response) {
                                if (response.operationCode === 200) mModalAlert.showSuccess('Se ha actualizado el rol exitosamente', '');
                                else {
                                    getRoleByCode($state.params.id, false);
                                    mModalAlert.showWarning(response.message, '');
                                }
                            })
                            .catch(function(error){
                                showErrorMessage(error);
                            });
                        }
                    }

                    /* REGION APLICACIONES */
                    function getProfileByOperationProfile(rol, app, showSpin, showMessage, message){
                        seguridadFactory.postApplicationGetDetail(rol, app, showSpin)
                        .then(function(response){
                            if (response.operationCode === 200) {
                                angular.forEach($scope.applicationsRole, function(application){
                                    if(application.numApplication === response.data.numApplication){
                                        response.data.isOpen = application.isOpen;
                                        angular.extend(application, response.data);
                                    }
                                });
                                if (!!showMessage) mModalAlert.showSuccess(message, '');
                            }
                        })
                        .catch(function(error){
                            showErrorMessage(error);
                        });
                    }
        
                    function getProfileByOperationApplication(rol, app, showSpin, showMessage, message){
                        seguridadFactory.postApplicationGetDetail(rol, app, showSpin)
                        .then(function(response){
                            /* Caso de que solo se cambie el status y crear*/
                            if(response.operationCode === 200){
                                var isInList = false;
                                angular.forEach($scope.applicationsRole, function(application){
                                    if(application.numApplication === response.data.numApplication){
                                        response.data.isOpen = isOpen;
                                        angular.extend(application, response.data);
                                        isInList = true;
                                    }
                                });
                                if (!isInList){ 
                                    response.data.isOpen = false;
                                    $scope.applicationsRole.push(response.data);
                                }
                                if (!!showMessage) mModalAlert.showSuccess(message, '');
                            }else{
                                /* Caso de eliminar eliminar */
                                if(response.operationCode === 404){
                                    var index = null;
                                    var count = 0;
                                    angular.forEach($scope.applicationsRole, function(application){
                                        if(application.numApplication === app) index = count;
                                        count++;
                                    });
                                    if(index !== null) $scope.applicationsRole.splice(index, 1); 
                                }
                                if (!!showMessage) mModalAlert.showSuccess(message, '');
                            }
                        })
                        .catch(function(error){
                            showErrorMessage(error);
                        });
                    }


                    function getAplicacionesByCode(roleID, showSpin, showMessage, message) {
                        seguridadFactory.getApplicationByRole(roleID, !!showSpin)
                        .then(function (response) {
                            if (response.operationCode === 200 || response.operationCode === 404) {
                                $scope.applicationsRole = response.data;
                                if (!!showMessage) mModalAlert.showSuccess(message, '');
                            } else mModalAlert.showWarning(response.message, '');
                        })
                        .catch(function(error){
                            showErrorMessage(error);
                        });
                    }

                    $scope.getApplicationSearchAutocomplete = function (searchValue) {
                        if (searchValue && searchValue.length >= 2) {
                            var search = searchValue.toUpperCase();

                            var defer = $q.defer();
                            seguridadFactory.autocompleteApps(search)
                            .then(function (response) {
                                var newResponse = _.map(response.data, function(item){ return {numero: item.numero, descripcion: (item.codigo + ' - ' + item.descripcion).toUpperCase()} });
                                var data = newResponse;
                                defer.resolve(data);
                            })
                            .catch(function(error){
                                showErrorMessage(error);
                            });
                            return defer.promise;
                        }

                        
                    }

                    $scope.selectApplicationAutocomplete = function (application) {
                        if(application === undefined) searchApplication = 0;
                        else searchApplication = application.numero;
                    }

                    $scope.addApplicationRole = function () {
                        if (searchApplication === 0 || searchApplication === undefined) mModalAlert.showWarning('Escriba y seleccione una aplicación para agregar', '');
                        else {
                            var existApp = false;
                            angular.forEach($scope.applicationsRole, function(app){
                                if(app.numApplication === searchApplication) existApp = true;
                            });
                            if (existApp) mModalAlert.showWarning('La aplicación ya se encuentra registrada', '');
                            else {
                                var param = {
                                    numRole: $state.params.id,
                                    numApplication: searchApplication,
                                    codUsuario: 'TOKEN'
                                };
                                seguridadFactory.postInsertApplicationRole(param, false)
                                .then(function (response) {
                                    if (response.operationCode === 200) {
                                        var mensaje = 'Aplicación agregada exitosamente';
                                        getProfileByOperationApplication($state.params.id, searchApplication, false, true, mensaje);
                                        for(var count = 0; count < 2; count++){
                                            var scopeSeeker = GetElement('[ng-model="$parent.mCodigoApplication"]', count, true);
                                            scopeSeeker.ngModel = "";
                                        }
                                    } else {
                                        mModalAlert.showWarning(response.message, '');
                                    }
                                })
                                .catch(function(error){
                                    showErrorMessage(error);
                                });
                            }
                        }
                    }

                    $scope.changeStateApplication = function (item, event) {
                        var param = {
                            numRole: $state.params.id,
                            numApplication: item.numApplication,
                            statusCode: item.codEstado,
                            codeUser: 'TOKEN'
                        };
                        seguridadFactory.postUpdateApplicationStatusRole(param, true)
                        .then(function (response) {
                            if (response.operationCode !== 200) {
                                getProfileByOperationApplication($state.params.id, item.numApplication, false, true, response.message);
                            }
                        })
                        .catch(function(error){
                            showErrorMessage(error);
                        });
                    }

                    $scope.deleteApplication = function (application) {
                        mModalConfirm.confirmWarning('¿Está seguro de eliminar esta aplicación?', '').then(function(){
                            deleteApplicationConfirm(application);
                        });
                    }

                    function deleteApplicationConfirm(application){
                        var param = {
                            numApplication: application.numApplication,
                            numRole: $state.params.id
                        };
                        seguridadFactory.postDeleteApplicationRole(param, false)
                        .then(function (response) {
                            if (response.operationCode === 200) {
                                getProfileByOperationApplication($state.params.id, application.numApplication, false, true, 'Aplicación eliminada exitosamente');
                            } else {
                                mModalAlert.showWarning(response.message, '');
                            }
                        })
                        .catch(function(error){
                            showErrorMessage(error);
                        });
                    }

                    /* REGION PROFILE */
                    $scope.getProfilesSearchAutocomplete = function (appId, searchValue) {
                        if (searchValue && searchValue.length >= 2) {
                            var search = searchValue.toUpperCase();

                            var defer = $q.defer();
                            seguridadFactory.autocompleteProfilesByApp(appId, search, false).then(function (response) {
                                var newResponse = _.map(response.data, function(item){ return {numProfile: item.numProfile, description: (item.codProfile + ' - ' + item.description).toUpperCase()} });
                                var data = newResponse;
                                defer.resolve(data);
                            })
                            .catch(function(error){
                                showErrorMessage(error);
                            });
                            return defer.promise;
                        }
                    }

                    $scope.changeStateProfile = function (profile, application, event) {
                        var param = {
                            numRole: $state.params.id,
                            numApplication: application.numApplication,
                            numProfile: profile.numProfile,
                            statusCode: profile.codEstado,
                            codeUser: 'TOKEN'
                        };
                        seguridadFactory.postUpdateProfileStatusRole(param, true).then(function (response) {
                            if (response.operationCode !== 200) {
                                getProfileByOperationProfile($state.params.id, application.numApplication, false, true, response.message);
                            }
                        })
                        .catch(function(error){
                            showErrorMessage(error);
                        });
                    }

                    $scope.selectProfileAutocomplete = function (profile) {
                        if(profile === undefined) searchProfile = 0;
                        else searchProfile = profile.numProfile;
                    }

                    $scope.addProfileAppRole = function (application, index) {
                        if (searchProfile === 0 || searchProfile === undefined) mModalAlert.showWarning('Escriba y seleccione un perfil para agregar', '');
                        else {
                            var existProf = false;
                            angular.forEach(application.profiles, function(prof){
                                if(prof.numProfile === searchProfile) existProf = true;
                            });
                            if (existProf) mModalAlert.showWarning('El perfil ya se encuentra asignado para la aplicación', '');
                            else {
                                var param = {
                                    numRole: $state.params.id,
                                    numApplication: application.numApplication,
                                    numProfile: searchProfile,
                                    codUsuario: 'TOKEN'
                                };

                                seguridadFactory.postInsertProfileRole(param, true)
                                .then(function (response) {
                                    if (response.operationCode === 200) {
                                        var mensaje = 'Perfil agregado exitosamente';
                                        getProfileByOperationProfile($state.params.id, application.numApplication, false, true, mensaje);
                                        var scopeSeeker = GetElement('[ng-model="$parent.mCodigoProfile[$index]"]', index, true);
                                        scopeSeeker.ngModel = "";
                                    } else {
                                        mModalAlert.showWarning(response.message, '');
                                    }
                                })
                                .catch(function(error){
                                    showErrorMessage(error);
                                });
                            }
                        }
                    }

                    $scope.deleteProfileAppRole = function (application, profile) {
                        mModalConfirm.confirmWarning('¿Está seguro de eliminar este perfil?', '').then(function(){
                            deleteProfileAppRoleConfirm(application, profile);
                        });
                    }

                    function deleteProfileAppRoleConfirm(application, profile){
                        var param = {
                            numApplication: application.numApplication,
                            numProfile: profile.numProfile,
                            numRole: $state.params.id
                        };
                        seguridadFactory.postDeleteProfileRole(param, true)
                        .then(function (response) {
                            if (response.operationCode === 200) {
                                var mensaje = 'Se eliminó el perfil a la aplicación de forma satisfactoria';
                                getProfileByOperationProfile($state.params.id, application.numApplication, false, true, mensaje);
                            } else {
                                mModalAlert.showWarning(response.message, '');
                            }
                        })
                        .catch(function(error){
                            showErrorMessage(error);
                        });
                    }

                    /* REGION SUB - ROLES */
                    $scope.validateMinLength = ValidateMinLength;

                    function getSubRolesByCode(roleID, showSpin, showMessage, message) {
                        seguridadFactory.getSubRolesByRole(roleID, showSpin)
                        .then(function (response) {
                            if (response.operationCode === 200 || response.operationCode === 404) {
                                $scope.subRolesRole = response.data === null ? []: response.data;
                                if (!!showMessage) mModalAlert.showSuccess(message, '');
                            } else {
                                mModalAlert.showWarning(response.message, '');
                            }
                        })
                        .catch(function(error){
                            showErrorMessage(error);
                        });
                    }

                    $scope.getSubRolesSearchAutocomplete = function (searchValue) {
                        if (searchValue && searchValue.length >= 2) {
                            var search = searchValue.toUpperCase();

                            var defer = $q.defer();
                            seguridadFactory.autocompleteRoles(searchTypeGroup, search, false)
                            .then(function (response) {
                                var newResponse = _.filter(response.data, function(c){ return c.numero !== parseInt($state.params.id) });
                                newResponse = _.map(newResponse, function(item){ return {numero: item.numero, descripcion: (item.codigo + ' - ' + item.descripcion).toUpperCase()} });
                                var data = newResponse;
                                defer.resolve(data);
                            })
                            .catch(function(error){
                                showErrorMessage(error);
                            });
                            return defer.promise;
                        }
                    }

                    $scope.selectSubRoleAutocomplete = function (role) {
                        if(role === undefined) searchRole = 0;
                        else searchRole = role.numero;
                    }

                    $scope.addSubRole = function () {
                        if (searchRole === 0 || searchRole === undefined) mModalAlert.showWarning('Escriba y seleccione un rol para agregar', '');
                        else {
                            if(searchRole === parseInt($state.params.id)) mModalAlert.showWarning('No puede insertar el mismo rol como rol hijo', '');
                            else{
                                var existRole = false;
                                angular.forEach($scope.subRolesRole, function(subrol){
                                    if(subrol.numRol === searchRole) existRole = true;
                                });

                                if (existRole) mModalAlert.showWarning('El rol ya se encuentra asignado a ' + $scope.roleDetail.codRol, '');
                                else {
                                    var param = {
                                        numRole: $state.params.id,
                                        numRoleChild: searchRole,
                                        codUsuario: 'TOKEN'
                                    };
                                    seguridadFactory.postInsertSubRole(param, false)
                                    .then(function (response) {
                                        if (response.operationCode === 200) {
                                            var mensaje = 'El rol ha sido asignado satisfactoriamente';
                                            getSubRolesByCode($state.params.id, false, true, mensaje);
                                            for(var count = 0; count < 2; count++){
                                                var scopeSeeker = GetElement('[ng-model="$parent.mCodigoRole"]', count, true);
                                                scopeSeeker.ngModel = "";
                                            }
                                        } else {
                                            mModalAlert.showWarning(response.message, '');
                                        }
                                    })
                                    .catch(function(error){
                                        showErrorMessage(error);
                                    });
                                }
                            }
                        }
                    }

                    $scope.changeStateSubRole = function (role) {
                        var param = {
                            numRole: $state.params.id,
                            numRoleChild: role.numRol,
                            statusCode: role.codEstado,
                            codUsuario: 'TOKEN'
                        };
                        seguridadFactory.postUpdateStatusSubRole(param, true)
                        .then(function (response) {
                            if (response.operationCode !== 200) {
                                getSubRolesByCode($state.params.id, false, true, response.message);
                            }
                        })
                        .catch(function(error){
                            showErrorMessage(error);
                        });
                    }

                    $scope.deleteSubRole = function (role) {
                        mModalConfirm.confirmWarning('¿Está seguro de eliminar este rol?', '').then(function(){
                            deleteSubRoleConfirm(role);
                        });
                    }

                    function deleteSubRoleConfirm(role){
                        var param = {
                            numRole: $state.params.id,
                            numRoleChild: role.numRol,
                        };
                        seguridadFactory.postDeleteSubRole(param, true)
                        .then(function (response) {
                            if (response.operationCode === 200) {
                                var mensaje = 'Rol eliminado exitosamente';
                                getSubRolesByCode($state.params.id, false, true, mensaje);
                            } else {
                                mModalAlert.showWarning(response.message, '');
                            }
                        })
                        .catch(function(error){
                            showErrorMessage(error);
                        });
                    }

                    function isValid(){
                        var $scopeForm = GetElement('[ng-form="frmUpdateRole"]', 0, false);
                        $scopeForm.frmUpdateRole.markAsPristine();
                        return $scopeForm.frmUpdateRole.$valid 
                                && ValidateMinLength($scope.roleDetail.nomLargo, 2);
                    }

                    /* REGION GENERAL */
                    function ValidateMinLength(field, length){
                        if(field === undefined) return false;
                        return field.length >= length;
                    }

                    function GetElement(selector, index, isIsolate){
                        var item = index === undefined || index === null ? 0 : index;
                        var element = document.querySelectorAll(selector)[item];
                        if(isIsolate) return angular.element(element).isolateScope();
                        else return angular.element(element).scope();
                    }

                    function showErrorMessage(error){
                        mModalAlert.showWarning(messagesSeguridad.UNEXPECTED_ERROR, '');
                    }

                    function initComponentsDefault() {
                        $scope.tabDatosGenerales = '/security/app/roles/detalle/component/templateDatosGenerales.html';
                        $scope.tabAplicaciones = '/security/app/roles/detalle/component/templateAplicaciones.html';
                        $scope.tabRoles = '/security/app/roles/detalle/component/templateRoles.html';

                        $scope.oneAtATime = true;

                        $scope.status = {
                            isCustomHeaderOpen: false
                        };

                        $scope.mCodigoProfile = [];
                        $scope.mCodigoApplication = "";
                        searchApplication = 0;
                        searchProfile = 0;
                        searchRole = 0;
                        $scope.applicationsRole = [];
                        $scope.subRolesRole = [];
                    }

                    (function onLoad() {
                        getRoleByCode($state.params.id, true);
                        getAplicacionesByCode($state.params.id);
                        getSubRolesByCode($state.params.id);
                        initComponentsDefault();
                    })();

                }
            ]
        )
    });
