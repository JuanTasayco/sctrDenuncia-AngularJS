(function($root, deps, action){
    define(deps, action, _)
  })(this, ['angular', 'constants', 'helper', 'jquery', 'messagesSeguridad'],
    function(angular, constants, helper, jq, messagesSeguridad){
  
      var appSecurity = angular.module('appSecurity');
  
      appSecurity.controller('crearAplicaciones02Controller',
        ['$scope', '$state', '$timeout', '$q', 'mModalAlert', 'mModalConfirm', 'seguridadFactory',
          function($scope, $state, $timeout, $q, mModalAlert, mModalConfirm, seguridadFactory){
  
            /* CONSTANTES */
            $scope.ENABLE_STATE = messagesSeguridad.CODIGO_ESTADO.HABILITADO;
            $scope.DISABLED_STATE = messagesSeguridad.CODIGO_ESTADO.DESHABILITADO;
            var DELETE_STATE = messagesSeguridad.CODIGO_ESTADO.ELIMINADO;

            /* VARIABLES APLICACION */
            $scope.applicationDesc;

            /* VARIABLES MENU */
            $scope.menuTree;
            $scope.menu = {};
            $scope.saveMenuDesc = 'CREAR';
            $scope.objectTitleDesc = 'Nuevo Objeto';
            $scope.isVisibleDelete = true;
            $scope.checkViewAll = false;
            var arrayUpdateStatus = [];
            var arrayUpdate = [];
            var optionSaveMenu = 'CREATE';
            var menuSaveID = null;
            $scope.seeker = {
                mSuperior : {}
             };

            /* VARIABLES PERFILES */
            $scope.Profiles;
            $scope.profile = {};
            $scope.ProfilesChildren = [];
            $scope.menuProfiles = [];
            $scope.saveProfileDesc = 'CREAR';
            $scope.profileTitleDesc = 'Nuevo Perfil';
            var optionSaveProfile = 'CREATE';
            

            /* REGION APLICACIONES */
            function getApplicationByCode(codeApplication, showSpin) {
                seguridadFactory.getApplicationDetail(codeApplication, showSpin)
                .then(function (response) {
                    if (response.operationCode === 200 || response.operationCode === 404) {
                        $scope.applicationDesc = response.data;
                    }else{
                        mModalAlert.showWarning(response.message, '');
                    }
                })
                .catch(function(error){
                    showErrorMessage(error);
                });
            }

            /* REGION MENU */

            /* FUNCIONES */
            $scope.cancelCreateObject = CancelCreateObject;
            $scope.changeViewCreateMenu = ChangeViewCreateMenu;
            $scope.saveMenu = SaveMenu;
            $scope.deleteMenu = DeleteMenu;
            $scope.changeStatusMenu = ChangeStatusMenu;
            $scope.toggleAction = ToogleAction;
            $scope.changeViewAllMenu = ChangeViewAllMenu;
            $scope.getObjectsSearchAutocomplete = GetObjectsSearchAutocomplete;
            $scope.selectObjectAutocomplete = SelectObjectAutocomplete;
            $scope.validateMinLength = ValidateMinLength;
            $scope.validateRangeValues = ValidateRangeValues;

            function GetMenuByApplication(numApplication, showSpin, showMessage, message){
                seguridadFactory.getObjectByApplication(numApplication, showSpin)
                .then(function(response){
                    $scope.showCreateMenu = false;
                    if(response.operationCode === 200){
                            $scope.showVoidMenu = false;
                            $scope.showItemsmenu = true;

                            /* SCROLLEAR CUANDO SE CREA O ACTUALIZA */
                            if(menuSaveID !== null){
                                GetElement('[ng-model="checkViewAll"]').checkViewAll = true;
                                response.data = _.map(response.data, function(c){ return _.extend({}, c, {isOpen: true})});
                                var newMenu = _.filter(response.data, function(c){ return c.numMenu === menuSaveID });
                                newMenu[0].isCreate = true;
                                
                                $timeout(function(){
                                    jq('html, body').animate({
                                        scrollTop: jq('.isCreate').offset().top - jq(window).height()/2
                                    }, 500);
                                }, 1000);
                            }else{
                                response.data = _.map(response.data, function(c){ return _.extend({}, c, {isOpen: false})});
                            }
    
                            $scope.menuTree = TransformateStructureTree(response.data, true);
                            angular.forEach($scope.menuTree, function(menu){ if(menu.nodes.length === 0) menu.isOpen = true; });
                            if(showMessage) mModalAlert.showSuccess(message, '');                   
                    }else{
                        $scope.showVoidMenu = true;
                        $scope.showItemsmenu = false;
                        $scope.menuTree = null;
                    }  
                })
                .catch(function(error){
                    showErrorMessage(error);
                });
            }

            function CancelCreateObject(){
                $scope.menu = {};
                $scope.showCreateMenu = false;
                $scope.showVoidMenu = $scope.menuTree === undefined || $scope.menuTree === null;
                $scope.showItemsmenu = $scope.menuTree !== undefined && $scope.menuTree !== null;

                GetElement('[ng-form="frmCreateObject"]').frmCreateObject.$setPristine();
            }
            
            function ChangeViewCreateMenu(option, menu){
                optionSaveMenu = option;
                var seeker = document.querySelector('[ng-model="$parent.seeker.mSuperior"]');
                var element = angular.element(seeker).isolateScope();
                $scope.seeker = {};
                if(optionSaveMenu === 'CREATE'){
                    $scope.menu.largeName = "";
                    $scope.menu.invPantalla = false;
                    $scope.saveMenuDesc = 'CREAR';
                    $scope.objectTitleDesc = 'Nuevo Objeto';
                    element.behavior.placeholder = 'Superior';
                }
                else{ 
                    $scope.saveMenuDesc = 'ACTUALIZAR';
                    $scope.objectTitleDesc = 'Objeto';
                    var nodoMenu = menu.$nodeScope.$modelValue;

                    seguridadFactory.getObjectGetDetailApplication(numApplication, nodoMenu.numMenu, true)
                    .then(function(response){
                        if(response.operationCode === 200){
                            $scope.menu.invPantalla = response.data.indSup === 'S';
                            $scope.menu.largeName = response.data.nomLargo;
                            $scope.menu.shortName = response.data.nomCorto;
                            $scope.menu.txtUrl = response.data.txtUrl;
                            $scope.menu.objectNumber = response.data.menu;
                            $scope.menu.numOrder = response.data.numOrden;
                            $scope.menu.numObjectFather = response.data.menuPadre;
                            $scope.menu.redirectUrl = response.data.redirectUrl;

                            /* se setea el model del seeker, al no refrescar se cambia el placeholder */
                            if(response.data.menuPadre === null){
                                element.behavior.placeholder = 'Superior';
                                element.ngModel = "";
                            }
                            else{
                                element.behavior.placeholder = response.data.descripcion;
                                element.ngModel = {
                                    numMenu : response.data.menuPadre,
                                    numAplicacion: parseInt(numApplication),
                                    nomCorto: '',
                                    descripcion: response.data.descripcion,
                                    numMenuPadre: 0
                                };
                            }
                        }else{
                            mModalAlert.showWarning(response.message, '');
                        }
                    })
                    .catch(function(error){
                        showErrorMessage(error);
                    });
                }
                $scope.showCreateMenu = true;
                $scope.showVoidMenu = false;
                $scope.showItemsmenu = false;
            }

            function SaveMenu(){
                if(IsValidMenu()){
                    $scope.menu.largeName = $scope.menu.largeName.toUpperCase();
                    $scope.menu.shortName = $scope.menu.shortName.toUpperCase();
                    $scope.menu.mcaIndsup = $scope.menu.invPantalla ? 'S':'N';
                    $scope.menu.codeUser = 'TOKEN';
                    $scope.menu.applicationNumber = numApplication;
    
                    GetElement('[ng-form="frmCreateObject"]').frmCreateObject.$setPristine();
                    if(optionSaveMenu === 'CREATE') CreateMenu(numApplication, true); 
                    else if(optionSaveMenu === 'UPDATE') UpdateMenu(numApplication, true);
                }
            }

            function CreateMenu(numAplicacion, showSpin){
                $scope.menu.statusCode = 1;
                seguridadFactory.postObjectInsertApplication($scope.menu, showSpin)
                .then(function(response){
                    if(response.operationCode === 200){
                        menuSaveID = response.data;
                        GetMenuByApplication(numAplicacion, false, true, 'Se agregó el objeto exitosamente');
                        $scope.menu = {};
                    }else{
                        mModalAlert.showWarning(response.message, '');
                    } 
                })
                .catch(function(error){
                    showErrorMessage(error);
                });
            }

            function UpdateMenu(numAplicacion, showSpin){
                seguridadFactory.postObjectUpdateApplication($scope.menu, showSpin)
                .then(function(response){
                    if(response.operationCode === 200){
                        menuSaveID = $scope.menu.objectNumber;
                        GetMenuByApplication(numAplicacion, false, true, 'Se actualizó el objeto exitosamente');
                        $scope.menu = {};
                    }else{
                        mModalAlert.showWarning(response.message, '');
                    }
                })
                .catch(function(error){
                    showErrorMessage(error);
                });
            }

            function DeleteMenu(menu){
                mModalConfirm.confirmWarning('¿Está seguro de eliminar este objeto?', '').then(function(){
                  DeleteMenuConfirm(menu);
                });
            }

            function DeleteMenuConfirm(menu){
                var esUltimo = false;
                if($scope.menuTree.length === 1) esUltimo = true;
                var nodeRemove = menu.$nodeScope;
                nodeRemove.$modelValue.codEstado = DELETE_STATE;
                UpdateStateMenuChildren(nodeRemove.$modelValue, DELETE_STATE);
                CreateArrayStatusMenuChildren(nodeRemove.$modelValue);
    
                seguridadFactory.postUpdateStatusMenu(arrayUpdateStatus, true)
                .then(function(response){
                    if(response.operationCode === 200){
                        nodeRemove.remove();
                        mModalAlert.showSuccess('Se eliminó el objeto exitosamente', '');
                        if(esUltimo){
                            $scope.showVoidMenu = true;
                            $scope.showItemsmenu = false;
                            $scope.menuTree = null;
                        }
                    }
                    else mModalAlert.showWarning(response.message, '');
                    arrayUpdateStatus = [];
                })
                .catch(function(error){
                    showErrorMessage(error);
                });
            }

            function ChangeStatusMenu(menu){
                var nodeStatus = menu.$nodeScope.$modelValue;
                if(nodeStatus.codEstado === $scope.ENABLE_STATE){
                    //Si es el padre superior solo el se modifica
                    if(menu.$parent.$parentNodeScope === null){
                        arrayUpdateStatus.push({
                            ObjectNumber: nodeStatus.numMenu,
                            ApplicationNumber: numApplication,
                            StatusCode: nodeStatus.codEstado,
                            CodeUser: 'TOKEN'
                        });
                    }//Este caso es para cuando no es padre superior deberá buscar a
                    else{
                        UpdateStatusMenuParent(nodeStatus, nodeStatus.codEstado, $scope.menuTree);
                        CreateArrayStatusMenuParent(nodeStatus);
                    }
                }
                else{
                    UpdateStateMenuChildren(nodeStatus, nodeStatus.codEstado);
                    CreateArrayStatusMenuChildren(nodeStatus);
                } 
                seguridadFactory.postUpdateStatusMenu(arrayUpdateStatus, false)
                .then(function(response){
                    if(response.operationCode !== 200) mModalAlert.showWarning(response.message, '');
                    arrayUpdateStatus = [];
                })
                .catch(function(error){
                    showErrorMessage(error);
                });
            }

            function CreateArrayStatusMenuParent(node){
                arrayUpdateStatus.push({
                    ObjectNumber: node.numMenu,
                    ApplicationNumber: numApplication,
                    StatusCode: node.codEstado,
                    CodeUser: 'TOKEN'
                });
                if(node.numMenuPadre !== 0){
                    var parent;
                    angular.forEach($scope.menuTree, function(menu){
                        var currentValue = FindElementTree(menu, "numMenu", node.numMenuPadre);
                        if(currentValue !== undefined){
                            parent = currentValue;
                        }
                    });
                    CreateArrayStatusMenuParent(parent);
                }
            }

            function CreateArrayStatusMenuChildren(node){
                arrayUpdateStatus.push({
                    ObjectNumber: node.numMenu,
                    ApplicationNumber: numApplication,
                    StatusCode: node.codEstado,
                    CodeUser: 'TOKEN'
                });
                if(node.nodes.length > 0){
                    angular.forEach(node.nodes, function(childNode){ 
                        CreateArrayStatusMenuChildren(childNode);
                    });
                }
            }

            function UpdatePositionMenu(nodeFather, nodeChild){
                $timeout(function() {
                    if(nodeFather !== undefined){
                        var node;
                        angular.forEach($scope.menuTree, function(menu){
                            var currentValue = FindElementTree(menu, "numMenu", nodeFather.numMenu);
                            if(currentValue !== undefined) node = currentValue;           
                        });
                        if(node !== undefined){
                            if(node.codEstado === $scope.DISABLED_STATE){
                                nodeChild.codEstado = $scope.DISABLED_STATE;
                                UpdateStateMenuChildren(nodeChild, $scope.DISABLED_STATE);
                            } 
                        } 
                    }else{
                        if(nodeChild.nodes.length === 0) nodeChild.isOpen = true;
                    }
                    angular.forEach($scope.menuTree, function(value, key){
                        value.numMenuPadre = 0;
                        value.numOrden = key + 1;
                        value.numDescripcion = '' + value.numOrden;
                        UpdateOrderItem(value, value.numMenu);
                    });
                    seguridadFactory.postMenuUpdatePosition(arrayUpdate, true)
                    .then(function(response){
                        if(response.operationCode !== 200) mModalAlert.showWarning(response.message, '');
                        arrayUpdate = [];
                    })
                    .catch(function(error){
                        showErrorMessage(error);
                    });
                }, 300);
            }

            function UpdateOrderItem(node, numberFather){
                arrayUpdate.push({
                    ObjectNumber: node.numMenu,
                    ObjectFatherNumber: node.numMenuPadre,
                    ApplicationNumber: numApplication,
                    Ordernumber: node.numOrden,
                    ColindNumber: node.numColind,
                    statusCode: node.codEstado,
                    CodeUser: 'TOKEN'
                });
                if (node.nodes) {
                    if(node.nodes.length > 0){
                        angular.forEach(node.nodes, function(value, key){
                            value.numMenuPadre = numberFather;
                            value.numOrden = key + 1;
                            value.numDescripcion = node.numDescripcion + '.' + value.numOrden;
                            UpdateOrderItem(value, value.numMenu);
                        });
                    }
                }
            }
          
            function ToogleAction(item){
                var objeto = item.$parent.$nodeScope.$modelValue;
                objeto.isOpen = !objeto.isOpen;
                var element = GetElement('[ng-model="checkViewAll"]');
                if(objeto.isOpen){
                    var node;
                    angular.forEach($scope.menuTree, function(menu){
                        var currentValue = FindElementTreeWhitoutChildren(menu, "isOpen", false);
                        if(currentValue !== undefined) node = currentValue;           
                    });
                    if(node === undefined) element.checkViewAll = true;
                }else  element.checkViewAll = false;
                item.toggle();
            }

            function ChangeViewAllMenu(){
                var element = GetElement('[ng-model="checkViewAll"]');
                angular.forEach($scope.menuTree, function(node){
                    UpdateValueFieldTree(node, "isOpen", element.checkViewAll);
                });
            }

            function GetObjectsSearchAutocomplete(searchValue){
                if(searchValue && searchValue.length >= 2){
                    var search = searchValue.toUpperCase();

                    var defer = $q.defer();
                    seguridadFactory.autocompleteObjects(numApplication, search, false)
                    .then(function(response){
                        if(response.operationCode === 200){
                            if($scope.menu.objectNumber !== undefined){
                                
                                array = [];
                                var node;
                                angular.forEach($scope.menuTree, function(menu){
                                    var currentValue = FindElementTree(menu, "numMenu", $scope.menu.objectNumber);
                                    if(currentValue !== undefined) node = currentValue;           
                                });
                                if(node !== undefined){
                                    ConvertTreeToArrayAutocomplete(node, array);
                                    angular.forEach(array, function(element){
                                        response.data = _.filter(response.data, function(c){ return c.numMenu !== element.numMenu })
                                    });
                                }
                            }
                            defer.resolve(response.data);
                        }
                    })
                    .catch(function(error){
                        showErrorMessage(error);
                    });
                    return defer.promise;
                }
            }

            function ConvertTreeToArrayAutocomplete(node, array){
                array.push(node);
                if(node.nodes.length > 0){
                    angular.forEach(node.nodes, function(childNode){
                        ConvertTreeToArrayAutocomplete(childNode, array);
                    });
                }
            };

            function SelectObjectAutocomplete(object){
                $scope.menu.numObjectFather = object.numMenu;
            }

            /* EVENTOS */
            $scope.treeOptions = {
                dropped: function(e) {
                    
                    var indiceDestino = e.dest.index; 
                    var indiceorigen = e.source.index;
    
                    var padreDestino = e.dest.nodesScope.$parent.$modelValue;
                    var padreOrigen = e.source.nodesScope.$parent.$modelValue;
    
                    var indicePadreDestino = padreDestino === undefined ? -1 : padreDestino.numMenu;
                    var indicePadreOrigen =  padreOrigen === undefined ? -1 : padreOrigen.numMenu;
    
                    if(indiceDestino !== indiceorigen || indicePadreDestino !== indicePadreOrigen){
                        UpdatePositionMenu(padreDestino, e.source.nodeScope.$modelValue);
                    }
                }
            }

            /* REGION PERFILES */

            /* FUNCIONES */
            $scope.cancelCreateProfile = CancelCreateProfile;
            $scope.changeStateProfile = ChangeStatusProfile;
            $scope.deleteProfile = DeleteProfile;
            $scope.changeViewCreateProfile = ChangeViewCreateProfile;
            $scope.saveProfile = SaveProfile;
            $scope.changeStatusMenuProfile =  ChangeStatusMenuProfile;

            function GetProfilesByApplication(numApplication, showSpin, showMessage, message){
                var param = {
                    applicationNumber: numApplication,
					searchValue: '',  
					pageNum: 1,
                    pageSize: 20,
                    sortingType: 1,
                }
                seguridadFactory.getProfilesByApplication(param, showSpin)
                .then(function(response){
                    if(showMessage) mModalAlert.showSuccess(message, '');
                    $scope.showCreateProfile = false;
                    if(response.operationCode === 200){
                        $scope.showVoidProfile = false;
                        $scope.showItemsProfiles = true;
                        if(response.data){
                            $scope.Profiles = response.data.paginacion;
                        }
                    }else{
                        $scope.showVoidProfile = true;
                        $scope.showItemsProfiles = false;
                        $scope.Profiles = null;
                    }
                })
                .catch(function(error){
                    showErrorMessage(error);
                });
            }

            function CancelCreateProfile(){
                $scope.profile = {};
                $scope.showCreateProfile = false;
                $scope.showVoidProfile= $scope.Profiles === undefined || $scope.Profiles === null;
                $scope.showItemsProfiles = $scope.Profiles !== undefined && $scope.Profiles !== null;

                GetElement('[ng-form="frmCreateProfile"]').frmCreateProfile.$setPristine();
            }

            function ChangeStatusProfile(profile, event){
                var param = {
                    profileNumber: profile.numPerfil,
                    applicationNumber: numApplication,
                    statusCode: profile.codEstado,
                    userCode: 'TOKEN'
                };
                seguridadFactory.postProfileUpdateStatus(param, false)
                .then(function(response){
                    if(response.operationCode !== 200) mModalAlert.showWarning(response.message, '');
                })
                .catch(function(error){
                    showErrorMessage(error);
                });
            }

            function DeleteProfile(profile){
                mModalConfirm.confirmWarning('¿Está seguro de eliminar este perfil?', '').then(function(){
                  DeleteProfileConfirm(profile);
                });
            }

            function DeleteProfileConfirm(profile){
                seguridadFactory.postProfileDeleteApplication(profile.numPerfil, numApplication, true)
                .then(function(response){
                    if(response.operationCode === 200) GetProfilesByApplication(numApplication, false, true, 'Se eliminó el perfil exitosamente');
                    else mModalAlert.showWarning(response.message, '');
                })
                .catch(function(error){
                    showErrorMessage(error);
                });
            }

            function ChangeViewCreateProfile(option, profile){
                var numPerfil = profile == null || profile == undefined ? -1 : profile.numPerfil;
                GetProfilesChildren(numApplication, numPerfil,  false);
                GetObjectsProfiles(numApplication, numPerfil, false)
                optionSaveProfile = option;
                if(optionSaveProfile === 'CREATE'){
                    $scope.saveProfileDesc = 'CREAR';
                    $scope.profileTitleDesc = 'Nuevo Perfil';
                } 
                else{
                    $scope.saveProfileDesc = 'ACTUALIZAR';
                    $scope.profileTitleDesc = 'Perfil';
                    seguridadFactory.getProfileDetailApplication(numApplication, numPerfil, true)
                    .then(function(response){
                        if(response.operationCode === 200){
                            $scope.profile.perfilCode = response.data.codPerfil;
                            $scope.profile.txtDescription = response.data.txtDescripcion;
                            $scope.profile.profileNumber = response.data.numPerfil;
                            $scope.profile.statusCode = response.data.codEstado;
                            $scope.profile.userCode = 'TOKEN';
                            $scope.profile.applicationNumber = numApplication;
                        }else{
                            mModalAlert.showWarning(response.message, '');
                        }
                    },function(error){
                        showErrorMessage(error);
                    });
                }
                $scope.showCreateProfile = true;
                $scope.showVoidProfile = false;
                $scope.showItemsProfiles = false;
            }

            function SaveProfile(){
                if(IsValidProfile()){
                    $scope.profile.perfilCode = $scope.profile.perfilCode.toUpperCase();
                    $scope.profile.txtDescription = $scope.profile.txtDescription.toUpperCase();

                    GetElement('[ng-form="frmCreateProfile"]').frmCreateProfile.$setPristine();
                    if(optionSaveProfile === 'CREATE') CreateProfile(numApplication, true);
                    else if(optionSaveProfile === 'UPDATE') UpdateProfile(numApplication, true);
                }
            }

            function CreateProfile(numAplicacion, showSpin){
                $scope.profile.statusCode = 1;
                $scope.profile.userCode = 'TOKEN';
                $scope.profile.applicationNumber = numAplicacion;

                var paramProfileCreate = angular.copy($scope.profile);
                paramProfileCreate.objects = [];
                paramProfileCreate.profiles = [];

                var profilesAssigned = _.filter($scope.ProfilesChildren, function(c){ return c.codEstado === 1 });
                angular.forEach(profilesAssigned, function(profile){
                    paramProfileCreate.profiles.push({numPerfilHijo: profile.numPerfil, codEstado: profile.codEstado, userCode: 'TOKEN'});
                });

                angular.forEach($scope.menuProfiles, function(menu){
                    ConvertTreeToArray(menu, paramProfileCreate.objects);
                });
                seguridadFactory.postInsertProfileApplication(paramProfileCreate, showSpin).then(function(response){
                      if(response.operationCode === 200){
                          GetProfilesByApplication(numAplicacion, false, true, 'Se agregó el perfil exitosamente');
                          $scope.profile = {};
                      }else{
                          mModalAlert.showWarning(response.message, '');
                      } 
                },function(error){
                    showErrorMessage(error);
                });
            }

            function UpdateProfile(numAplicacion, showSpin){
                var paramProfileCreate = angular.copy($scope.profile);
                paramProfileCreate.objects = [];
                paramProfileCreate.profiles = [];

                var profilesAssigned = _.filter($scope.ProfilesChildren, function(c){ return c.codEstado === 1 });
                angular.forEach(profilesAssigned, function(profile){
                    paramProfileCreate.profiles.push({numPerfilHijo: profile.numPerfil, codEstado: profile.codEstado, userCode: 'TOKEN'});
                });


                angular.forEach($scope.menuProfiles, function(menu){
                    ConvertTreeToArray(menu, paramProfileCreate.objects);
                });
                seguridadFactory.postUpdateProfileApplication(paramProfileCreate, showSpin)
                .then(function(response){
                      if(response.operationCode === 200){
                          GetProfilesByApplication(numAplicacion, false, true, 'Se actualizó el perfil exitosamente');
                          $scope.profile = {};
                      }else{
                          mModalAlert.showWarning(response.message, '');
                      } 
                })
                .catch(function(error){
                    showErrorMessage(error);
                });
            }

            function ConvertTreeToArray(node, array){
                if(node.codEstado === 1) array.push({numMenu: node.numMenu, codEstado: node.codEstado, userCode: 'TOKEN'});
                if(node.nodes.length > 0){
                    angular.forEach(node.nodes, function(childNode){
                        ConvertTreeToArray(childNode, array);
                    });
                }
            };

            function ChangeStatusMenuProfile(menu){
                var nodeStatus = menu.$nodeScope.$modelValue;
                if(nodeStatus.codEstado === $scope.ENABLE_STATE){
                    if(menu.$parent.$parentNodeScope !== null){
                        UpdateStatusMenuParent(nodeStatus, nodeStatus.codEstado, $scope.menuProfiles);
                    }
                }
                else{
                    UpdateStateMenuChildren(nodeStatus, nodeStatus.codEstado);
                } 
            };

            function GetProfilesChildren(numApplication, numProfile, showSpin){
                seguridadFactory.getProfileGetChildren(numApplication, numProfile, showSpin)
                .then(function(response){
                    if(response.operationCode === 200){
                        $scope.ProfilesChildren = response.data;
                    }else{
                        $scope.ProfilesChildren = null;
                    }
                })
                .catch(function(error){
                    showErrorMessage(error);
                });
            }

            function GetObjectsProfiles(numApplication, numProfile, showSpin){
                seguridadFactory.getObjectChildrenApplication(numApplication, numProfile, showSpin).then(function(response){
                    if(response.operationCode === 200){
                        $scope.menuProfiles = TransformateStructureTree(response.data, true);
                    }else{
                        $scope.menuProfiles = null;
                    }
                },function(error){
                    showErrorMessage(error);
                });
            }

            /* REGION GENERALES */
            $scope.createBack = CreateBack;

            function IsValidMenu(){
                var $scopeForm = GetElement('[ng-form="frmCreateObject"]');
                $scopeForm.frmCreateObject.markAsPristine();
                return $scopeForm.frmCreateObject.$valid 
                        && ValidateMinLength($scope.menu.largeName, 2)
                        && ValidateRangeValues($scope.menu.numOrder, 1, 99999999, false);
            }

            function IsValidProfile(){
                var $scopeForm = GetElement('[ng-form="frmCreateProfile"]');
                $scopeForm.frmCreateProfile.markAsPristine();
                return $scopeForm.frmCreateProfile.$valid 
                        && ValidateMinLength($scope.profile.perfilCode, 2) 
                        && ValidateMinLength($scope.profile.txtDescription, 2);
            }

            function ValidateMinLength(field, length){
                if(field === undefined) return false;
                return field.length >= length;
            }

            function ValidateRangeValues(field, minValue, maxValue, isRequired){
                if(field === undefined || field === '') return !(isRequired === true);
                return field >= minValue && field <= maxValue;
            }

            function GetElement(form){
                var _form = document.querySelector(form);
                return angular.element(_form).scope();
            }

            function TransformateStructureTree(dataList, includeDescripcion){
                menuTree = _.filter(dataList, function(c){ return c.numMenuPadre === 0 });
                angular.forEach(menuTree, function(data){
                    data.nodes = _.filter(dataList, function(c){ return c.numMenuPadre === data.numMenu });
                    if(includeDescripcion) data.numDescripcion = data.numOrden;
                    InsertChildrenRecursive(data.nodes, dataList, data.numDescripcion);
                });
                return menuTree;
            }
    
            function InsertChildrenRecursive(hijos, dataList, numDescripcion){
                angular.forEach(hijos, function(hijo){
                      hijo.nodes = _.filter(dataList, function(c){ return c.numMenuPadre === hijo.numMenu });
                      if(!!numDescripcion) hijo.numDescripcion = numDescripcion + '.' + hijo.numOrden;
                      InsertChildrenRecursive(hijo.nodes, dataList);
                });
            }

            function FindElementTree(node, key, value){
                var element = undefined;
                if(node[key] === value){
                    element = node;
                }
                else{
                    if(node.nodes.length > 0){
                        angular.forEach(node.nodes, function(childNode){ 
                           var currentValue = FindElementTree(childNode, key, value);
                           if(currentValue != undefined){
                                element = currentValue;
                           }
                        });
                    }
                }
                return element;
            }

            function FindElementTreeWhitoutChildren(node, key, value){
                var element = undefined;
                if(node[key] === value && node.nodes.length !== 0){
                    element = node;
                }
                else{
                    if(node.nodes.length > 0){
                        angular.forEach(node.nodes, function(childNode){ 
                           var currentValue = FindElementTreeWhitoutChildren(childNode, key, value);
                           if(currentValue != undefined){
                                element = currentValue;
                           }
                        });
                    }
                }
                return element;
            }
            
            function UpdateValueFieldTree(node, key, value){
                node[key] = value;
                if(node.nodes.length > 0){
                    angular.forEach(node.nodes, function(childNode){
                        UpdateValueFieldTree(childNode, key, value);
                    });
                }
            };

            function UpdateStatusMenuParent(node, state, tree){
                if(node.numMenuPadre !== 0){
                    var parent;
                    angular.forEach(tree, function(menu){
                        var currentValue = FindElementTree(menu, "numMenu", node.numMenuPadre);
                        if(currentValue !== undefined){
                            parent = currentValue;
                        }
                        
                    });
                    parent.codEstado = state;
                    UpdateStatusMenuParent(parent, state, tree);
                }
            }

            function UpdateStateMenuChildren(node, state){
                if(node.nodes.length > 0){
                    angular.forEach(node.nodes, function(childNode){
                        childNode.codEstado = state;
                        UpdateStateMenuChildren(childNode, state);
                    });
                }
            };

            function showErrorMessage(error){
                mModalAlert.showWarning(messagesSeguridad.UNEXPECTED_ERROR, '');
            }

            function CreateBack(){
                $state.go("crearAplicaciones.steps", { step: 1, numAplicacion: numApplication });
            }

            function InitComponentsDefault(){
              $scope.tabNodosObjeto = '/security/app/aplicaciones/templates/templateNodosObjeto.html';
              $scope.tabNodosObjetoPerfil = '/security/app/aplicaciones/templates/templateNodosObjetoPerfil.html';

              numApplication = $state.params.numAplicacion;
            }

            (function onLoad(){
                if(!$scope.create.validStep1)
                    $state.go('crearAplicaciones.steps', {step: 1});
                else{
                    InitComponentsDefault();
                    getApplicationByCode(numApplication, true);
                    GetMenuByApplication(numApplication, false);
                    GetProfilesByApplication(numApplication, false);
                }
            })();
  
          }])
    });