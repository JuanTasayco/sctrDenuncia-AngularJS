(function($root, deps, action){
    define(deps, action)
  })(this, ['angular', 'constants', 'helper','jquery', 'messagesSeguridad'],
    function(angular, constants, helper, jq, messagesSeguridad){

      var appSecurity = angular.module('appSecurity');

      appSecurity.controller('detalleAplicacionesController',
        ['$scope'
        , '$state'
        , '$timeout'
        , '$q'
        , '$http'
        , 'mpSpin'
        , 'mModalAlert'
        , 'mModalConfirm'
        , 'MxPaginador'
        , 'seguridadFactory'
        , function($scope
            , $state
            , $timeout
            , $q
            , $http
            , mpSpin
            , mModalAlert
            , mModalConfirm
            , MxPaginador
            , seguridadFactory){

            /* CONSTANTES */
            $scope.ENABLE_STATE = messagesSeguridad.CODIGO_ESTADO.HABILITADO;
            $scope.DISABLED_STATE = messagesSeguridad.CODIGO_ESTADO.DESHABILITADO;
            var MAX_ROWS_DEFAULT = 10;
            var NUM_PAGE_DEFAULT = 1;
            var SORTING_TYPE_DEFAULT = 1;

            /* VARIABLES GENERALES */
            /* VARIABLES APLICACION */
            $scope.application = {};
            $scope.userCodes = {};
            $scope.codEstado = {};
            $scope.systemList = {};
            $scope.systemData = [];
            $scope.systemId = {};
            var numApplication;

            /* VARIABLES MENU */
            $scope.menuTree;
            $scope.menu = {};
            $scope.saveMenuDesc = 'CREAR';
            $scope.objectTitleDesc = 'Nuevo Objeto';
            $scope.isVisibleDelete = false;
            var arrayUpdateStatus = [];
            var arrayUpdate = [];
            var optionSaveMenu = 'CREATE';
            var menuSaveID = null;

            /* VARIABLES PERFILES */
            $scope.Profiles;
            $scope.profile = {};
            $scope.ProfilesChildren = [];
            $scope.menuProfiles = [];
            $scope.saveProfileDesc = 'CREAR';
            $scope.profileTitleDesc = 'Nuevo Perfil';
            $scope.mBuscarProfile = '';
            var pageProfiles;
            var searchProfileValue = '';
            var optionSaveProfile = 'CREATE';
            var searchProfileChildrenValue = '';
            $scope.childrensWithoutFilter = [];

            $scope.maxLengthPerfilCode = 20;
            $scope.maxLengthTxtDescription = 200;
            $scope.maxLengthTxtApp = 150;
            $scope.maxLengthTxtAppCorto = 50;
            $scope.maxLengthTxtRuta = 200;
            $scope.maxLengthTxtPage = 100;

            /* REGION APLICACIONES */
            /* FUNCIONES */
            $scope.updateStatusApplication = UpdateStatusApplication;
            $scope.updateApplication = UpdateApplication;
            $scope.updateSystemId = UpdateSystemId;
            $scope.onlyView = true;
            $scope.objetSeguridad = seguridadFactory.onlyView();

            function GetApplicationByCode(numApplication, showSpin) {
                seguridadFactory.getApplicationDetail(numApplication, showSpin)
                .then(function (response) {
                    if (response.operationCode === 200 || response.operationCode === 404) {
                        $scope.application = response.data;
                        $scope.application.webMovil = $scope.application.webMovil === 1;
                        // TODO: Eliminar $scope.application.flagMYD
                        $scope.application.flagMYD = $scope.application.flagMYD === 1;
                        $scope.codEstado.codigo = $scope.application.codEstado;
                        $scope.systemId.codigo = $scope.application.systemId;
                        $scope.application.reqSystems = false;
                        $scope.application.mSystems = $scope.application.listSystem;
                        $scope.systemsChange();
                    }else{
                        mModalAlert.showWarning(response.message, '');
                    }
                    GetStatusCodeApplication();
                    GetSystemList();
                })
                .catch(function(error){
                    showErrorMessage(error);
                });
            }

            function GetStatusCodeApplication() {
                seguridadFactory.getStatusTypes().then(function (response) {
                    if (response.operationCode === 200) {
                        $scope.userCodes = response.data;
                    }
                });
            }

            function UpdateStatusApplication(newValue) {
                $scope.application.codEstado = newValue;
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

            function UpdateApplication(){
                if(IsValidApplication()){
                    // Actualizar
                    var param = {
                        applicationNumber: numApplication,
                        applicationCode: $scope.application.codAplicacion.toUpperCase(),
                        longName: $scope.application.nomLargo.toUpperCase(),
                        shortName: $scope.application.nomCorto ? $scope.application.nomCorto.toUpperCase(): $scope.application.nomCorto,
                        TipMobApl: $scope.application.webMovil ? 1: 0,
                        url: $scope.application.rutAcceso.toUpperCase(),
                        defaultPage: $scope.application.paginaDefecto ? $scope.application.paginaDefecto.toUpperCase() : '',
                        statusCode: $scope.application.codEstado,
                        userCode: 'TOKEN',
                        description: $scope.application.description || '',
                        // TODO: Eliminar $scope.application.flagMYD
                        flagMYD: $scope.application.flagMYD ? 1: 0,
                        systemId: $scope.application.systemId || null,
                        redirectUrl: $scope.application.redirectUrl || '',
                        listSystem: $scope.application.mSystems
                    };

                    seguridadFactory.postUpdateApplication(param, true)
                    .then(function (response) {
                        if (response.operationCode === 200){
                            mModalAlert.showSuccess('Se ha actualizado la aplicación exitosamente', '');
                        }
                        else {
                            mModalAlert.showWarning(response.message, '');
                        }
                    })
                    .catch(function(error){
                        showErrorMessage(error);
                    });
                }else mModalAlert.showWarning('Debe corregir los errores antes de continuar', '')
            }

            /* REGION MENU */
            /* FUNCIONES */
            $scope.cancelCreateObject = CancelCreateObject;
            $scope.changeViewCreateMenu = ChangeViewCreateMenu;
            $scope.saveMenu = SaveMenu;
            $scope.changeStatusMenu = ChangeStatusMenu;
            $scope.toggleAction = ToogleAction;
            $scope.changeViewAllMenu = ChangeViewAllMenu;
            $scope.getObjectsSearchAutocomplete = GetObjectsSearchAutocomplete;
            $scope.selectObjectAutocomplete = SelectObjectAutocomplete;
            $scope.getProfilesPage = GetProfilesPage;
            $scope.validateMinLength = ValidateMinLength;
            $scope.validateRangeValues = ValidateRangeValues;

            function GetMenuByApplication(numApplication, showSpin, showMessage, message){
                seguridadFactory.getObjectByApplication(numApplication, showSpin)
                .then(function(response){
                    $scope.showCreateMenu = false;
                    if(response.operationCode === 200){
                        $scope.showVoidMenu = false;
                        $scope.showItemsmenu = true;

                        if(menuSaveID !== null){
                            GetElement('[ng-model="checkViewAll"]').checkViewAll = true;
                            var newMenu = _.filter(response.data, function(c){ return c.numMenu === menuSaveID });
                            newMenu[0].isCreate = true;
                            response.data = _.map(response.data, function(c){ return _.extend({}, c, {isOpen: true})});
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

                GetElement('[ng-form="frmSaveObject"]').frmSaveObject.$setPristine();
            }

            function ChangeViewCreateMenu(option, menu){
                optionSaveMenu = option;
                $scope.seeker = {};
                var seeker = document.querySelector('[ng-model="$parent.seeker.mSuperior"]');
                var element = angular.element(seeker).isolateScope();

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
                    $scope.menu.shortName = $scope.menu.shortName ? $scope.menu.shortName.toUpperCase(): $scope.menu.shortName;
                    $scope.menu.mcaIndsup = $scope.menu.invPantalla ? 'S':'N';
                    $scope.menu.codeUser = 'TOKEN';
                    $scope.menu.applicationNumber = numApplication;

                    GetElement('[ng-form="frmSaveObject"]').frmSaveObject.$setPristine();
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

            function ChangeStatusMenu(menu){
                var nodeStatus = menu.$nodeScope.$modelValue;
                if(nodeStatus.codEstado === $scope.ENABLE_STATE){
                    if(menu.$parent.$parentNodeScope === null){
                        arrayUpdateStatus.push({
                            ObjectNumber: nodeStatus.numMenu,
                            ApplicationNumber: numApplication,
                            StatusCode: nodeStatus.codEstado,
                            CodeUser: 'TOKEN'
                        });
                    }
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
                }, 400);
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
                } else element.checkViewAll = false;
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
                },
                beforeDrop : function (e) {

                    var parentDest = e.dest.nodesScope.$parent.$modelValue
                    var parentSource = e.source.nodesScope.$parent.$modelValue

                    if(e.dest.index != e.source.index || parentDest != parentSource){
                        var draggedElementTxt = e.source.nodeScope.$modelValue.nomLargo
                        return mModalConfirm.confirmWarning('¿Está seguro de mover el objeto ' + draggedElementTxt + (function(){

                            if(parentDest == parentSource){ // En caso de mover el nodo en el mismo nivel
                                return ' a la posición ' + (e.dest.index + 1)
                            }
                            else{
                                if(e.dest.nodesScope.$nodeScope == null){ // En caso mover el nodo al nivel principal
                                   return ' como objeto principal en la posición ' + (e.dest.index + 1)
                                }
                                else{ // En caso de cambiar de padre el nodo
                                    return ' como hijo de ' + e.dest.nodesScope.$nodeScope.$modelValue.nomLargo
                                }
                            }

                        })() + '?', '')
                    }
                }
            }

            /* REGION PROFILE */
            $scope.cancelCreateProfile = CancelCreateProfile;
            $scope.changeStateProfile = ChangeStateProfile;
            $scope.deleteProfile = DeleteProfile;
            $scope.changeViewCreateProfile = ChangeViewCreateProfile;
            $scope.saveProfile = SaveProfile;
            $scope.changeStatusMenuProfile = ChangeStatusMenuProfile;
            $scope.getProfilesSearch = GetProfilesSearch;
            $scope.getProfilesSearchChildren = GetProfilesSearchChildren;

            function GetProfilesByApplication(numApplication, showSpin, showMessage, message){
                var param = {
                    applicationNumber: numApplication,
          searchValue: searchProfileValue,
          pageNum: $scope.currentPage === 0 ? NUM_PAGE_DEFAULT : $scope.currentPage,
                    pageSize: $scope.itemsXPagina,
                    sortingType: SORTING_TYPE_DEFAULT,
                }

                seguridadFactory.getProfilesByApplication(param, showSpin)
                .then(function(response){
                    $scope.showCreateProfile = false;
                    SetPaginateDefaultValues();
                    if(response.operationCode === 200){
                        $scope.showVoidProfile = false;
                        $scope.showItemsProfiles = true;
                        // $scope.Profiles = response.data;
                        if(response.data){
                            if(response.data.totalFilas > 0){
                                $scope.totalItems = response.data.totalFilas;
                                $scope.Profiles = response.data.paginacion;

                                pageProfiles.setNroTotalRegistros($scope.totalItems)
                                .setDataActual($scope.Profiles)
                                .setConfiguracionTanda();
                            }
                        }
                        if(showMessage) mModalAlert.showSuccess(message, '');
                    }else{
                        if(!(!!searchProfileValue)){
                            $scope.showVoidProfile = true;
                            $scope.showItemsProfiles = false;
                            $scope.Profiles = null;
                        }
                    }
                }).catch(function(error){
                    showErrorMessage(error);
                });
            }

            function GetProfilesPage(event){
                pageProfiles.setNroPaginaAMostrar(event.pageToLoad)
                .thenLoadFrom(function(tanda){
                        $scope.currentPage = tanda;
                        GetProfilesByApplication(numApplication, true);
                    }, function(){
                        $scope.Profiles = pageProfiles.getItemsDePagina();
                    })
                ;
            }

            function SetPaginateDefaultValues(){
                $scope.Profiles = [];
                $scope.totalItems = 0;
            }

            function CancelCreateProfile(){
                $scope.profile = {};
                $scope.showCreateProfile = false;
                $scope.showVoidProfile= $scope.Profiles === undefined || $scope.Profiles === null;
                $scope.showItemsProfiles = $scope.Profiles !== undefined && $scope.Profiles !== null;

                GetElement('[ng-form="frmSaveProfile"]').frmSaveProfile.$setPristine();

                $scope.ProfilesChildren = $scope.childrensWithoutFilter;
                $scope.totalItemsProfiles = $scope.ProfilesChildren.length;
                GetElement('[ng-model="currentPage"]').currentPage = NUM_PAGE_DEFAULT;
                GetElement('[ng-model="mBuscarProfileChildren"]').mBuscarProfileChildren = '';
            }

            function ChangeStateProfile(profile, event){
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
                GetProfilesChildren(numApplication, numPerfil,  true);
                GetObjectsProfiles(numApplication, numPerfil, true)
                optionSaveProfile = option;
                if(optionSaveProfile === 'CREATE'){
                    $scope.profileTitleDesc = 'Nuevo Perfil';
                    $scope.saveProfileDesc = 'CREAR';
                }
                else{
                    $scope.profileTitleDesc = 'Perfil';
                    $scope.saveProfileDesc = 'ACTUALIZAR';
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
                    })
                    .catch(function(error){
                        showErrorMessage(error);
                    });
                }
                $scope.showCreateProfile = true;
                $scope.showVoidProfile = false;
                $scope.showItemsProfiles = false;
            }

            function SaveProfile(){
                var frm = GetElement('[ng-form="frmSaveProfile"]');
                if(IsValidProfile()){
                    $scope.profile.perfilCode = $scope.profile.perfilCode.toUpperCase();
                    $scope.profile.txtDescription = $scope.profile.txtDescription.toUpperCase();
                    $scope.profile.idPestana = 0;
                    var objClassName = document.getElementById('obj_update_profile').parentElement.parentElement.parentElement.className;
                    if(objClassName.includes('active')){
                        $scope.profile.idPestana = 1;
                    }
                    var prfClassName = document.getElementById('profile_update_profile').parentElement.parentElement.parentElement.className;
                    if(prfClassName.includes('active')){
                        $scope.profile.idPestana = 2;
                    }
                    frm.frmSaveProfile.$setPristine();
                    if(optionSaveProfile === 'CREATE') CreateProfile(numApplication, true);
                    else if(optionSaveProfile === 'UPDATE') UpdateProfile(numApplication, true);

                    $scope.ProfilesChildren = $scope.childrensWithoutFilter;
                    $scope.totalItemsProfiles = $scope.ProfilesChildren.length;
                    GetElement('[ng-model="mBuscarProfileChildren"]').mBuscarProfileChildren = '';
                    GetElement('[ng-model="currentPage"]').currentPage = NUM_PAGE_DEFAULT;
                }else mModalAlert.showWarning('Debe corregir los errores antes de continuar', '')
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

                seguridadFactory.postInsertProfileApplication(paramProfileCreate, showSpin)
                .then(function(response){
                      if(response.operationCode === 200){
                          GetProfilesByApplication(numAplicacion, false, true, 'Se agregó el perfil exitosamente');
                          $scope.profile = {};
                      }else{
                          mModalAlert.showWarning(response.message, '');
                      }
                })
                .catch(function(error){
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
                $scope.currentPage = 1;
                $scope.itemsPerPage = 10;
                mpSpin.start();
                var defered = $q.defer();
                var pms = defered.promise;
                $http.get(constants.system.api.endpoints.seguridad+'api/Aplicacion/ProfileGetChildren/'+numApplication+'/'+numProfile)
                .success(function(response){
                    // defered.resolve(response.data);
                    $scope.ProfilesChildren = response.data;
                    $scope.totalItemsProfiles = $scope.ProfilesChildren.length;
                    $scope.childrensWithoutFilter = angular.copy($scope.ProfilesChildren);
                })
                .error(function(err){
                    defered.reject(err);
                })
                mpSpin.end();
                // seguridadFactory.getProfileGetChildren(numApplication, numProfile, showSpin)
                // .then(function(response){
                //     if(response.operationCode === 200){
                //         $scope.ProfilesChildren = response.data;
                //     }else{
                //         $scope.ProfilesChildren = null;
                //     }
                // })
                // .catch(function(error){
                //     showErrorMessage(error);
                // });
            }

            function GetObjectsProfiles(numApplication, numProfile, showSpin){
                seguridadFactory.getObjectChildrenApplication(numApplication, numProfile, showSpin)
                .then(function(response){
                    if(response.operationCode === 200){
                        $scope.menuProfiles = TransformateStructureTree(response.data, true);
                    }else{
                        $scope.menuProfiles = null;
                    }
                })
                .catch(function(error){
                    showErrorMessage(error);
                });
            }

            function GetProfilesSearch(mBuscarProfile){
                searchProfileValue = mBuscarProfile ? mBuscarProfile.toUpperCase() :  mBuscarProfile,
                $scope.currentPage = NUM_PAGE_DEFAULT;
                pageProfiles.setCurrentTanda($scope.currentPage);
                GetProfilesByApplication(numApplication, true);
            }

            function GetProfilesSearchChildren(mBuscarProfileChildren){
                searchProfileChildrenValue = mBuscarProfileChildren ? mBuscarProfileChildren.toUpperCase() : mBuscarProfileChildren;
                $scope.ProfilesChildren = $scope.childrensWithoutFilter;
                $scope.ProfilesChildren = mBuscarProfileChildren ?
                                        _.filter($scope.ProfilesChildren, function(c){ return c.codPerfil.indexOf(searchProfileChildrenValue) != -1 || c.perfil.indexOf(searchProfileChildrenValue) != -1 })
                                        :  $scope.childrensWithoutFilter;
                $scope.totalItemsProfiles = $scope.ProfilesChildren.length;
                GetElement('[ng-model="currentPage"]').currentPage = NUM_PAGE_DEFAULT;
            }

            /* REGION GENERALES */
            $scope.tabChangeView = TabChangeView;

            function TabChangeView(option){
                switch(option){
                    case 'DATOS_GENERALES':
                    if($scope.application.numAplicacion === undefined)
                        GetApplicationByCode(numApplication, true);
                    break;
                    case 'OBJETOS':
                    if($scope.menuTree === undefined)
                        GetMenuByApplication(numApplication, true, false, '');
                    break;
                    case 'PERFILES':
                    if($scope.Profiles === undefined)
                        GetProfilesByApplication(numApplication, true);
                    break;
                    default:
                        break;
                }
            }
            function IsValidMenu(){
                var $scopeForm = GetElement('[ng-form="frmSaveObject"]');
                $scopeForm.frmSaveObject.markAsPristine();
                return $scopeForm.frmSaveObject.$valid
                        && ValidateMinLength($scope.menu.largeName, 2)
                        && ValidateRangeValues($scope.menu.numOrder, 1, 99999999, false);
            }

            function IsValidProfile(){
                var $scopeForm = GetElement('[ng-form="frmSaveProfile"]');
                $scopeForm.frmSaveProfile.markAsPristine();
                return $scopeForm.frmSaveProfile.$valid
            }

            function IsValidApplication(){
                var $scopeForm = GetElement('[ng-form="frmUpdateApplication"]');
                $scopeForm.frmUpdateApplication.markAsPristine();
                return $scopeForm.frmUpdateApplication.$valid
                        && ValidateMinLength($scope.application.nomLargo, 2);
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
                      InsertChildrenRecursive(hijo.nodes, dataList, hijo.numDescripcion);
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

            function InitDataDefault(){
                numApplication = $state.params.id;

                pageProfiles = new MxPaginador();
                $scope.currentPage = NUM_PAGE_DEFAULT;
                $scope.itemsXPagina = MAX_ROWS_DEFAULT;
                $scope.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
                $scope.totalItems = null;

                pageProfiles.setNroItemsPorPagina($scope.itemsXPagina);
            }

            (function onLoad(){

                InitDataDefault();
                GetApplicationByCode(numApplication, true);
                $scope.onlyView = $scope.objetSeguridad.soloLectura || true;
                $scope.tabNodosObjeto = '/security/app/aplicaciones/templates/templateNodosObjeto.html';
                $scope.tabNodosObjetoPerfil = '/security/app/aplicaciones/templates/templateNodosObjetoPerfil.html';
                $scope.tabDatosGenerales = '/security/app/aplicaciones/detalle/component/templateDatosGenerales.html';
                $scope.tabObjetosDetalle = '/security/app/aplicaciones/detalle/component/templateObjetosDetalle.html';
                $scope.tabPerfilesDetalle = '/security/app/aplicaciones/detalle/component/templatePerfilesDetalle.html';
                
            })();

            $scope.systemsChange = function(checkedItem) {
              var required = $scope.application.mSystems && !!$scope.application.mSystems.length;
              $scope.application.reqDefaultPage = required;
              $scope.application.reqDefaultSystem = required;
            };

          }
        ]
      )
    });
