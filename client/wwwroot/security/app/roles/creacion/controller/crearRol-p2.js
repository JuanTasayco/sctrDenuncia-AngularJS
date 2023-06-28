(function($root, deps, action){
    define(deps, action)
  })(this, ['angular', 'constants', 'helper', 'messagesSeguridad'],
    function(angular, constants, helper, messagesSeguridad){
  
      var appSecurity = angular.module('appSecurity');
  
      appSecurity.controller('crearRol02Controller',
        ['$scope', '$state', '$q', 'mModalAlert', 'mModalConfirm', 'seguridadFactory',
          function($scope, $state, $q, mModalAlert, mModalConfirm, seguridadFactory){
  
            $scope.ENABLE_STATE = messagesSeguridad.CODIGO_ESTADO.HABILITADO;
            $scope.DISABLED_STATE = messagesSeguridad.CODIGO_ESTADO.DESHABILITADO;

            /* VARIABLES */
            var numRole;
            var searchApplication;
            var searchTypeGroup;

            /* FUNCIONES */

            /* REGION ROLE */
            function getRoleByCode(roleID, showSpin) {
              seguridadFactory.getRolDetail(roleID, showSpin)
              .then(function (response) {
                  if (response.operationCode === 200 || response.operationCode === 404) {
                      $scope.roleDesc = response.data;
                      searchTypeGroup = angular.copy(response.data.numTipoGrupo);
                  }else{
                      mModalAlert.showWarning(response.message, '');
                  }
              })
              .catch(function(error){
                showErrorMessage(error);
              });
            }

            $scope.createBack = function(){
                $state.go("crearRol.steps", { step: 1, numRol: numRole });
            }

            /* REGION APLICACIONES */
            function getProfileByOperationProfile(rol, app, showSpin, showMessage, message){
                seguridadFactory.postApplicationGetDetail(rol, app, showSpin).then(function(response){
                    if (response.operationCode === 200) {
                        angular.forEach($scope.applicationsRole, function(application){
                            if(application.numApplication === response.data.numApplication){
                                response.data.isOpen = application.isOpen;
                                angular.extend(application, response.data);
                            }
                        });
                        if (!!showMessage) mModalAlert.showSuccess(message, '');
                    }else{
                        mModalAlert.showWarning(response.message, '');
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
                    } else {
                        mModalAlert.showWarning(response.message, '');
                    }
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
              if (searchApplication === 0 || searchApplication === undefined)
                  mModalAlert.showWarning('Escriba y seleccione una aplicación para agregar', '');
              else {
                  var existApp = false;
                  angular.forEach($scope.applicationsRole, function(app){
                      if(app.numApplication === searchApplication) existApp = true;
                  });
                  if (existApp) mModalAlert.showWarning('La aplicación ya se encuentra registrada para el rol', '');
                  else {
                      var param = {
                          numRole: numRole,
                          numApplication: searchApplication,
                          codUsuario: 'TOKEN'
                      };
                      seguridadFactory.postInsertApplicationRole(param, false)
                      .then(function (response) {
                          if (response.operationCode === 200) {
                              var mensaje = 'Aplicación agregada exitosamente';
                              getProfileByOperationApplication(numRole, searchApplication, false, true, mensaje);
                              for(var count = 0; count < 2; count++){
                                var scopeSeeker = GetElement('[ng-model="$parent.mCodigoApplication"]', count);
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
                    numRole: numRole,
                    numApplication: item.numApplication,
                    statusCode: item.codEstado,
                    codeUser: 'TOKEN'
                };
                seguridadFactory.postUpdateApplicationStatusRole(param, true)
                .then(function (response) {
                    if (response.operationCode !== 200) {
                        getProfileByOperationApplication(numRole, item.numApplication, false, true, response.message);
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
                    numRole: numRole
                };
                seguridadFactory.postDeleteApplicationRole(param, false)
                .then(function (response) {
                    if (response.operationCode === 200) {
                        var mensaje = 'Aplicación eliminada exitosamente';
                        getProfileByOperationApplication(numRole, application.numApplication, false, true, mensaje);
                    } else {
                        mModalAlert.showWarning(response.message, '');
                    }
                })
                .catch(function(error){
                    showErrorMessage(error);
                });
            }

            /* REGION PROFILES */
            $scope.getProfilesSearchAutocomplete = function (appId, searchValue) {
                if (searchValue && searchValue.length >= 2) {
                    var search = searchValue.toUpperCase();

                    var defer = $q.defer();
                    seguridadFactory.autocompleteProfilesByApp(appId, search, false)
                    .then(function (response) {
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
                    numRole: numRole,
                    numApplication: application.numApplication,
                    numProfile: profile.numProfile,
                    statusCode: profile.codEstado,
                    codeUser: 'TOKEN'
                };
                seguridadFactory.postUpdateProfileStatusRole(param, true)
                .then(function (response) {
                    if (response.operationCode !== 200) {
                        getProfileByOperationProfile(numRole, application.numApplication, false, true, response.message);
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
                            numRole: numRole,
                            numApplication: application.numApplication,
                            numProfile: searchProfile,
                            codUsuario: 'TOKEN'
                        };
                        seguridadFactory.postInsertProfileRole(param, true)
                        .then(function (response) {
                            if (response.operationCode === 200) {
                                var mensaje = 'Perfil agregado exitosamente';
                                getProfileByOperationProfile(numRole, application.numApplication, false, true, mensaje);
                                var scopeSeeker = GetElement('[ng-model="$parent.mCodigoProfile[$index]"]', index);
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
                    numRole: numRole
                };

                seguridadFactory.postDeleteProfileRole(param, true)
                .then(function (response) {
                    if (response.operationCode === 200) {
                        var mensaje = 'Perfil eliminado exitosamente';
                        getProfileByOperationProfile(numRole, application.numApplication, false, true, mensaje);
                    } else {
                        mModalAlert.showWarning(response.message, '');
                    }
                })
                .catch(function(error){
                    showErrorMessage(error);
                });
            } 

            /* REGION SUB -ROLES */
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
                        var newResponse = _.filter(response.data, function(c){ return c.numero !== parseInt(numRole) });
                        newResponse = _.map(newResponse, function(item){ return {numero: item.numero, descripcion: (item.codigo + ' - ' + item.descripcion).toUpperCase()} });
                        defer.resolve(newResponse);
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
                    if(parseInt(numRole) === searchRole) mModalAlert.showWarning('No puede insertar el mismo rol como rol hijo', '');
                    else {
                        var existRole = false;
                        angular.forEach($scope.subRolesRole, function(subrol){
                            if(subrol.numRol === searchRole) existRole = true;
                        });
                        if (existRole) mModalAlert.showWarning('El rol ya se encuentra asignado a ' + $scope.roleDesc.codRol, '');
                        else {
                            var param = {
                                numRole: numRole,
                                numRoleChild: searchRole,
                                codUsuario: 'TOKEN'
                            };

                            seguridadFactory.postInsertSubRole(param, false)
                            .then(function (response) {
                                if (response.operationCode === 200) {
                                    var mensaje = 'El rol ha sido asignado satisfactoriamente';
                                    getSubRolesByCode(numRole, false, true, mensaje);
                                    for(var count = 0; count < 2; count++){
                                        var scopeSeeker = GetElement('[ng-model="$parent.mCodigoRole"]', count);
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
                    numRole: numRole,
                    numRoleChild: role.numRol,
                    statusCode: role.codEstado,
                    codUsuario: 'TOKEN'
                };
                seguridadFactory.postUpdateStatusSubRole(param, true)
                .then(function (response) {
                    if (response.operationCode !== 200) {
                        getSubRolesByCode(numRole, false, true, response.message);
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
                    numRole: numRole,
                    numRoleChild: role.numRol,
                };
                seguridadFactory.postDeleteSubRole(param, true).then(function (response) {
                    if (response.operationCode === 200) {
                        var mensaje = 'Rol eliminado exitosamente';
                        getSubRolesByCode(numRole, false, true, mensaje);
                    } else {
                        mModalAlert.showWarning(response.message, '');
                    }
                })
                .catch(function(error){
                    showErrorMessage(error);
                });
            }

            /* REGION GENERALES */
            function GetElement(selector, index){
                var item = index === undefined || index === null ? 0 : index;
                var element = document.querySelectorAll(selector)[item];
                return angular.element(element).isolateScope();
            }

            function showErrorMessage(error){
                mModalAlert.showWarning(messagesSeguridad.UNEXPECTED_ERROR, '');
            }

            function initComponentsDefault(){
                numRole = $state.params.numRol;

                $scope.tabDatosGenerales = '/security/app/roles/creacion/component/templateDatosGenerales.html';
                $scope.tabAplicaciones = '/security/app/roles/creacion/component/templateAplicaciones.html';
                $scope.tabRoles= '/security/app/roles/creacion/component/templateRoles.html';

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

            (function onLoad(){
                if(!$scope.create.validStep1)
                    $state.go('crearRol.steps', {step: 1});
                else{
                    initComponentsDefault();   
                    getRoleByCode(numRole, false);      
                    getAplicacionesByCode(numRole, true);
                    getSubRolesByCode(numRole, false); 
                }
            })();
  
          }])
    });