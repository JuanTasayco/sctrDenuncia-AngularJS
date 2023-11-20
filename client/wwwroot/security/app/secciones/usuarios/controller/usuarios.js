(function($root, deps, action){
  define(deps, action)
})(this, ['angular'
, 'constants'
, 'helper'
, 'lodash'
, 'seguridadFactory'],
  function(ng
    , constants
    , helper
    , _){

    var appSecurity = ng.module('appSecurity');

    appSecurity.controller('usuariosController',
      ['$scope'
      , '$window'
      , '$state'
      , '$timeout'
      , '$filter'
      , '$q'
      , '$http'
      , 'mpSpin'
      , 'mainServices'
      , '$uibModal'
      , '$sce'
      , 'mModalAlert'
      , 'mModalConfirm'
      , 'MxPaginador'
      , 'seguridadFactory'
      , 'httpData'
      , function(
          $scope
          , $window
          , $state
          , $timeout
          , $filter
          , $q
          , $http
          , mpSpin
          , mainServices
          , $uibModal
          , $sce
          , mModalAlert
          , mModalConfirm
          , MxPaginador
          , seguridadFactory
          , httpData){

            var page;
            $scope.objetSeguridad = seguridadFactory.onlyView();
            function _initData(){

              //set formulario de busqueda
              $scope.searchClient = {};
              $scope.searchClient.mUsuario = $scope.searchClient.mUsuario || "";
              $scope.searchClient.mEmpresa = $scope.searchClient.mEmpresa || "";

              //set tipo usuario
              $scope.searchClient.mUserType = [];

              //set estado
              $scope.searchClient.mUserState = [];
              //oficina
              $scope.searchClient.mOficina = $scope.searchClient.mOficina || "";

              //rol
              $scope.searchClient.mRol = $scope.searchClient.mRol || "";

              //aplicacion
              $scope.searchClient.mAplicacion = $scope.searchClient.mAplicacion || "";

              //perfil
              $scope.searchClient.mPerfil = $scope.searchClient.mPerfil || "";

              //ordenar
              $scope.searchClient.mOrdenarPor = {
                codigo : (ng.isUndefined($scope.searchClient.mOrdenarPor) || $scope.searchClient.mOrdenarPor.codigo == null) ? null : $scope.searchClient.mOrdenarPor.codigo
              };

              $scope.formData = {};
              $scope.formData.enTramite = $scope.formData.enTramite;

              //data
              //$scope.dashboardData = $scope.dashboardData || [];

              //count select all
              $scope.countSelect = 0;

              //Paginador
              // items a mostrar por pagina. Por defecto es 10
              // este campo lo utilizaremos también como input del uib-pagination
              $scope.itemsXPagina = 10;
              $scope.itemsXTanda = $scope.itemsXPagina * 10;
              $scope.msgVacio = 'No se encontraron resultados para mostrar.';
              page = new MxPaginador();
              page.setNroItemsPorPagina($scope.itemsXPagina);

              //seleccionar todos
              //$scope.mSelectedAllUser = false;

              //modal accessos
              $scope.frmModalAccesos = {};
            }

            function bindLookups(){
              //tipo de ordenamiento
              var pms1 = seguridadFactory.getSortingTypesUser();
              pms1.then(function(response){
                $scope.ordenarPorData = response.data || response.Data;
              });

              //tipos de usuario
              $scope.userTypesData = [];
              var result = {};
              var pms2 = seguridadFactory.getDismaUserTypes();
              pms2.then(function(response){
                if(response.operationCode == 200){
                  $scope.userTypesData = response.data || response.Data;
                }else{
                  mModalAlert.showWarning(response.message, '');
                }
              });

              //estado de usuarios
              var pms3 = seguridadFactory.getDismaUserStates();
              pms3.then(function(response){
                $scope.userStatesData = response.data || response.Data;
              });
            }

            function _initProfile(){
              // $scope.profile = seguridadFactory.getVarLS('profile');
              // var userType = $scope.profile.typeUser;
              // $scope.userDisma = (userType == 1) ? true : false;
              $scope.profile = seguridadFactory.getVarLS("profile");
              var evoProfile = seguridadFactory.getVarLS("evoProfile");
              var userType = $scope.profile.typeUser;
              //$scope.userType = 2;

              /*--------------------------------------
              TODO Para usuarios externos 
              El grupo de usuario (Administrador o Regular) debera determinarse desde login
              La info obtenida tendra q mantenerse en LocalStorage para luego destruirse
              cerrando navegador o haciendo logout
              ----------------------------------------*/
              if(userType != 1){ //si es usuario externo
                //TODO condicionar el grupo de usuario
                $scope.userDisma = false;
                $scope.adminExt = {
                  numPerson: evoProfile.companyId
                  , name: $scope.profile.name
                  , typePerson: $scope.profile.typeUser // typePerson??
                  , userRegister: $scope.profile.username
                  , numDoc: evoProfile.documentNumber
                }              
                // $scope.grupoUsuario == 2 // Usuario Administrador
                //$scope.grupoUsuario == 1 // Usuario Externo
              }else $scope.userDisma = true;              
            }

            (function onLoad(){
              $scope.onlyView = $scope.objetSeguridad.soloLectura || true;
              $scope.showSelectedBar = false;
              $scope.firstLoad = true;

              $scope.selectedItems = [];

              bindLookups();
              _initData();
              _initProfile();

              // Accordion filter
              $scope.oneAtATime = false;
            })(); //end onLoad
            $scope.pageChanged = pageChanged;
            $scope.fnGetListOffice = _fnGetListOffice;
            $scope.fnGetListRole = _fnGetListRole;
            $scope.fnGetListApps = _fnGetListApps;
            $scope.fnGetListProfile = _fnGetListProfile;
            $scope.openClonarRoles = _fnClonarRoles;

            $scope.fnClearFilter = _fnClearFilter;
            $scope.fnOrdenarPor = _fnOrdenarPor;
            $scope.fnReenviarEnlace = _fnReenviarEnlace;
            $scope.fnViewDetails = _fnViewDetails;

            $scope.getDashboardData = getDashboardData;

            $scope.fnOpenSelectedBar = _fnOpenSelectedBar;
            $scope.fnCloseSelectedBar = _fnCloseSelectedBar;
            $scope.fnClonarAccesos = _fnClonarAccesos;
            $scope.fnDeshabilitarUsuario = _fnDeshabilitarUsuario;
            $scope.fnHabilitarUsuario = _fnHabilitarUsuario;
            $scope.fnAnularUsuario = _fnAnularUsuario;

            /*--------------------------------------
            download xls
            ----------------------------------------*/
            // $scope.fnExportExcel = _fnExportExcel;
            // function _fnExportExcel(){
            //   $scope.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.seguridad+'api/UsuarioDisma/ExportExcel');
            //   $timeout(function() {
            //     document.getElementById('frmExport').submit();
            //   }, 1000);
            // }

            $scope.fnExportExcel = _fnExportExcel;
            function _fnExportExcel(){
              const opcMenu = localStorage.getItem('currentBreadcrumb');
              
              httpData.getDownload(
                constants.system.api.endpoints.seguridad + helper.formatNamed('api/UsuarioDisma/ExportExcel?user={user}&numCompany={numCompany}&listUserTypesText={listUserTypesText}&listStatesText={listStatesText}&codeOffice={codeOffice}&numRole={numRole}&numApplication={numApplication}&numProfile={numProfile}&sortingType={sortingType}&COD_OBJETO=.&OPC_MENU='+ opcMenu,
                { 
                  'user':  { value: $scope.params.user, defaultValue:'' } ,
                  'numCompany':  { value: $scope.params.numCompany, defaultValue:'' } ,
                  'listUserTypesText':  { value: $scope.params.listUserTypesText, defaultValue:'' } ,
                  'listStatesText':  { value: $scope.params.listStatesText, defaultValue:'' } ,
                  'codeOffice':  { value: $scope.params.codeOffice, defaultValue:'' } ,
                  'numRole':  { value: $scope.params.numRole, defaultValue:'' } ,
                  'numApplication':  { value: $scope.params.numApplication, defaultValue:'' } ,
                  'numProfile':  { value: $scope.params.numProfile, defaultValue:'' } ,
                  'sortingType':  { value: $scope.params.sortingType, defaultValue:'0' }  
                }),
                { 
                  responseType: 'arraybuffer'
                },
                true)
                .then(function(data){
                  mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
              });
            }

            /*--------------------------------------
            autocomplete companies
            ----------------------------------------*/
            $scope.fnGetListCompanies = _fnGetListCompanies;
            function _fnGetListCompanies(str){
              if(str && str.length >= 2){
                var txt = str.toUpperCase();
                var defer = $q.defer();
                var pms = seguridadFactory.getDismaCompanies(txt);
                pms.then(function(response){
                  var data = response.data || response.Data;
                  if(data.length > 0) $scope.noResultProfile = false;
                  else $scope.noResultCompanies = true;
                  defer.resolve(data);
                });
                return defer.promise;
              }
            }

            // Accordion filter
            $scope.accordOpened01 = { status: false };
            $scope.accordOpened02 = { status: false };
            $scope.accordOpened03 = { status: false };
            $scope.accordOpened04 = { status: false };
            $scope.accordOpened05 = { status: false };
            $scope.accordOpened06 = { status: false };

            /*--------------------------------------
            user type filter
            ----------------------------------------*/
            $scope.strFilter = [];
            $scope.fnChangeState = _fnChangeState;
            function _fnChangeState(item){
              var str = String(item.id);
              if(item.value){
                if(item.parent){
                  ng.forEach(item.childs, function(child){
                    child.value = item.value;
                    str = str + child.id;
                  })
                  item.filter = str;
                  $scope.strFilter.push(str);
                }else $scope.strFilter.push(String(item.id))
              }else{ //desmarcar nivel 1
                if(item.parent){ // si es padre
                  var pos2 = $scope.strFilter.indexOf(item.filter);
                  $scope.strFilter.splice(pos2, 1);
                  item.filter = undefined;
                  ng.forEach(item.childs, function(child){
                    child.value = item.value;
                  })
                }else{
                  var pos = $scope.strFilter.indexOf(String(item.id));
                  $scope.strFilter.splice(pos, 1);
                }
              }
            }

            $scope.fnChangeStateChild = _fnChangeStateChild;
            $scope.str = "";
            function _fnChangeStateChild(item, child){
              if(item.filter == String(item.id)+"12"){
                if(!child.value){
                  item.filter = undefined;
                  item.filter = (child.id == 1) ? String(item.id)+"2" : String(item.id)+"1"
                }
              }else{
                if(item.filter == String(item.id)+"1"){
                  if(child.id == 2){
                    item.filter = undefined;
                    item.filter = (child.value) ? String(item.id)+"12" : String(item.id)+"1"
                  }else{
                    item.filter = undefined;
                    item.filter = (child.value) ? String(item.id)+"1" : undefined;
                  }
                }else if(item.filter == String(item.id)+"2"){
                  if(child.id == 1){
                    item.filter = undefined;
                    item.filter = (child.value) ? String(item.id)+"12" : String(item.id)+"2"
                  }else{
                    item.filter = undefined;
                    item.filter = (child.value) ? String(item.id)+"2" : undefined;
                  }
                }else if(ng.isUndefined(item.filter)){
                  if(child.value){
                    item.value = child.value
                    item.filter = (child.id == 1) ? String(item.id)+"1" : String(item.id)+"2"
                  }

                }
              }
              if(ng.isUndefined(item.filter)){
                item.value = false;
                for(var i=0; i<$scope.strFilter.length; i++){
                  var firstChar = $scope.strFilter[i].charAt(0);
                  if(firstChar === String(child.parent)){
                    $scope.strFilter.splice(i, 1)
                  }
                }
              }else{
                if($scope.strFilter.length > 0){
                  for(var i=0; i<$scope.strFilter.length; i++){
                    var firstChar = $scope.strFilter[i].charAt(0);
                    if(firstChar === String(child.parent)){
                      $scope.strFilter.splice(i, 1)
                    }
                  }
                }
                $scope.strFilter.push(item.filter)
              }
            }

          // $scope.fnOpenSelectedBar = _fnOpenSelectedBar;
          // function _fnOpenSelectedBar(val) {
          //   $scope.showSelectedBar = true;
          // };

          $scope.strFilterText = $scope.strFilter.toString();

          $scope.CloseAll = function() {
            $scope.accordOpened01.status = false;
            $scope.accordOpened02.status = false;
            $scope.accordOpened03.status = false;
            $scope.accordOpened04.status = false;
            $scope.accordOpened05.status = false;
            $scope.accordOpened06.status = false;
          }

          $scope.fnCloseSelectedBar = _fnCloseSelectedBar;
          function _fnCloseSelectedBar (){
            $scope.showSelectedBar = false;
          };

          /*--------------------------------------
          validate user type
          ----------------------------------------*/
          function validateUserType(){
            if($scope.strFilter.length == 0) return false;
            else return true;
          }

          /*--------------------------------------
          validate user state
          ----------------------------------------*/
          function validateUserState(){
            var count = 0;
            for(var i=0; i < $scope.searchClient.mUserState.length; i++){
              if(!$scope.searchClient.mUserState[i]) count++;
            }
            if(count == 5) return false;
            else return true;
          }

          /*--------------------------------------
          validar filtro minimo
          ----------------------------------------*/
          function validateFilter(){
            var states = validateUserState();
            var types = validateUserType();
            //if empty fields returns flase
            if($scope.searchClient.mUsuario == ""
              && ($scope.searchClient.mEmpresa == "" || ng.isUndefined($scope.searchClient.mEmpresa))
              && types == false
              && states == false
              && ($scope.searchClient.mOficina == "" || ng.isUndefined($scope.searchClient.mOficina))
              && ($scope.searchClient.mRol == "" || ng.isUndefined($scope.searchClient.mRol))
              && ($scope.searchClient.mAplicacion == "" || ng.isUndefined($scope.searchClient.mAplicacion))
              && ($scope.searchClient.mPerfil == "" || ng.isUndefined($scope.searchClient.mPerfil))) return false;
            else return true;
          }

          /*--------------------------------------
          Listar items
          ----------------------------------------*/
          function getDashboardData(){
            //$scope.firstLoad = false;
            $scope.showSelectedBar = false;
            $scope.countSelect = 0;
            $scope.searchClient.mSelectedAllUser = false;
            if(validateFilter()){
              $scope.currentPage = 1;
              $scope.params = {
                user: ($scope.searchClient.mUsuario) ? $scope.searchClient.mUsuario : "",
                listStatesText: (ng.isUndefined($scope.strStates) || $scope.strStates == "") ? "" : $scope.strStates,
                pageSize: $scope.itemsXPagina,
                // sortingType: 0
                sortingType: ($scope.searchClient.mOrdenarPor.codigo == null) ? 0 : $scope.searchClient.mOrdenarPor.codigo
              }
              if($scope.userDisma){
                $scope.params.numCompany = ($scope.searchClient.mEmpresa) ? $scope.searchClient.mEmpresa.numero : 0;
                $scope.params.listUserTypesText = ($scope.strFilter.length == 0) ? "" : $scope.strFilter.toString();
                $scope.params.codeOffice = ($scope.searchClient.mOficina) ? $scope.searchClient.mOficina.codigo : 0
                $scope.params.numRole = ($scope.searchClient.mRol) ? $scope.searchClient.mRol.numero : 0
                $scope.params.numApplication = ($scope.searchClient.mAplicacion) ? $scope.searchClient.mAplicacion.numero : 0
                $scope.params.numProfile = ($scope.searchClient.mPerfil) ? $scope.searchClient.mPerfil.numero : 0
              }else{
                $scope.params.numTypeGroup = $scope.adminExt.typePerson;
                $scope.params.numCompany = $scope.adminExt.numPerson;
              }
              $scope.params.pageNum = $scope.currentPage;
              page.setCurrentTanda($scope.currentPage);                
              $timeout(function(){
                getUserList();
              }, 200);
            }else mModalAlert.showWarning('Debe ingresar o seleccionar por lo menos un filtro', '');
          }

          /*--------------------------------------
          Paginador
          ----------------------------------------*/
          function pageChanged(event){
            $scope.searchClient.mSelectedAllUser = false;
            $scope.countSelect = 0;
            $scope.selectedItems = [];
            page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda){
              $scope.params.pageNum = nroTanda;
              getUserList();
            }, setLstCurrentPage);
          }

          function setLstCurrentPage() {
            //$scope.dashboardData = page.getItemsDePagina();
            $scope.data = page.getItemsDePagina();
            $scope.dashboardData = $scope.data;
            // if ($scope.searchClient.mSelectedAllUser) {
            //   _fnOpenSelectedBar();
            // }
          }

          function getUserList(){
            $scope.data = [];  
            if($scope.userDisma) var promise = seguridadFactory.getDismaUserList($scope.params);
            else var promise = seguridadFactory.getAdminUserList($scope.params);
            promise.then(function(response){
              $scope.firstLoad = false;
              if(response.operationCode == 200){
                if(response.data.totalFilas > 0){
                  $scope.noResult = false;
                  $scope.cloneStatus = true;
                  $scope.data = response.data.paginacion;
                  $scope.totalPages = response.data.totalPaginas;
                  $scope.totalItems = response.data.totalFilas; //usado para paginar
                  ng.forEach($scope.data, function(item){
                    item.selected = false;
                  });
                }else{
                  $scope.noResult = true;
                  $scope.totalPages = 0;
                  $scope.totalItems = 0;
                }
                //TODO: variables para paginacion
              }else{
                mModalAlert.showError(response.message, '');
                $scope.data = [];
                $scope.noResult = true;
                $scope.totalPages = 0;
                $scope.totalItems = 0;
              }
              page.setNroTotalRegistros($scope.totalItems).setDataActual($scope.data).setConfiguracionTanda();
              setLstCurrentPage();
            });
            //data inicial
            $scope.dashboardData = $scope.data;
            //$scope.dashboardData = dashboardMovimientosData;
          }

          /*--------------------------------------
          autocomplete profile
          ----------------------------------------*/
          function _fnGetListProfile(str){
            if(str && str.length >= 2){
              var txt = str.toUpperCase();
              var defer = $q.defer();
              seguridadFactory.autocompleteProfile(txt)
                .then(function(response){
                  var data = response.data || response.Data;
                  if(data.length > 0){
                    var i = 0;
                    ng.forEach(data, function(item){
                      data[i].codeDescription = data[i].codigo+' - '+data[i].descripcion
                      i++
                    });
                    $scope.noResultApps = false;
                  } 
                  else $scope.noResultProfile = true;
                  defer.resolve(data);
                });
              return defer.promise;
            }
          }

          $scope.searchClient.mSelectedUser = [];
          $scope.showSelectedBar = false;
          function _fnOpenSelectedBar(){
            $scope.countSelect = 0;
            $scope.showSelectedBar = true;
            var toggleStatus = $scope.searchClient.mSelectedAllUser;
            // if(toggleStatus) {
            // $scope.countSelect = $scope.totalItems;
            // }
            $scope.selectedItems = [];
            ng.forEach($scope.dashboardData, function(item){
              item.selected = toggleStatus;
              if(toggleStatus){
                $scope.selectedItems.push(item.numUsuario);
                $scope.countSelect++;
              }else{
                $scope.countSelect = 0;
                $scope.selectedItems = [];
                $scope.showSelectedBar = false;
              }
            });
          }

          $scope.fnActionByItem = _fnActionByItem;
          function _fnActionByItem(value){
            if(!value && $scope.searchClient.mSelectedAllUser) {
              $scope.searchClient.mSelectedAllUser = false;
              $scope.searchClient.mSelectedAllUser = $scope.dashboardData.every(
                function(item){
                  return item.selected;
              });
            }
          }

          $scope.fnRemoveSelectedItem = _fnRemoveSelectedItem;
          function _fnRemoveSelectedItem(item){
            var pos = $scope.selectedItems.indexOf(item.numUsuario);
            $scope.selectedItems.splice(pos, 1);
            $scope.countSelect = $scope.countSelect-1;
          }

          $scope.fnAddSelectedItem = _fnAddSelectedItem;
          function _fnAddSelectedItem(item){
            $scope.showSelectedBar = true;
            $scope.selectedItems.push(item.numUsuario);
            $scope.countSelect++;
            if($scope.countSelect >= 1) $scope.showSelectedBar = true;
          }

          function _fnCloseSelectedBar (){
            $scope.showSelectedBar = false;
          };

          // //validate btn Clone
          $scope.fnValidateClone = _fnValidateClone;
          function _fnValidateClone(){
            str = $scope.selectedItems.toString();
            var pms = seguridadFactory.validateCloneList(str);
            pms.then(function(response){
              if(response.operationCode == 200){
                $scope.dataClone = response.data;
                if($scope.dataClone.isValid){
                  $scope.frmModalAccesos.mIDUsuario = undefined;
                  _fnClonarAccesos();
                } 
                else mModalAlert.showWarning('Los usuarios seleccionados deben pertenecer al mismo grupo, empresa y tipo de usuario', '');
              }else mModalAlert.showWarning(response.message, '');
            })
          }

          /*--------------------------------------
          autocomplete user list clone access
          ----------------------------------------*/
          $scope.fnGetListUserClone = _fnGetListUserClone;
          function _fnGetListUserClone(str){
            var txt = str.toUpperCase();
            var params = {
              numCompany: $scope.dataClone.numEmpresa
              , numTypeGroup: $scope.dataClone.numTipoGrupo
              , numTypeUser: $scope.dataClone.tipoUsuario
              , userListText: $scope.selectedItems.toString()
              , search: txt
            };
            var pms = seguridadFactory.getUsersCloneList(params);              
            var defer = $q.defer();
            pms.then(function(response){
              var data = response.data || response.Data;
              if(data.length > 0) $scope.noResultAccess = false;
              else $scope.noResultAccess = true;
              defer.resolve(data);
            });
            return defer.promise;
          }

          // Modal Crear Usuarios
          $scope.fnCrearUsuario = function(){
            if(!$scope.userDisma){
              $state.go('crearUsuarioAdminExt.steps', {step: 1});
            }else{            
              var vModalProof = $uibModal.open({
                backdrop: true, // background de fondo
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                scope: $scope,
                size: 'md',
                templateUrl : '/security/app/secciones/usuarios/component/modalCrearUsuario.html',
                controller : ['$scope', '$uibModalInstance', '$uibModal',
                  function($scope, $uibModalInstance, $uibModal) {

                    /*--------------------------------------
                    Select user for create in modal          
                    ----------------------------------------*/          
                    $scope.$watch('mTipoUsuario', function(){
                      switch($scope.mTipoUsuario){
                        case "ClienteEmpresa":
                          $scope.tpl = 'crearUsuarioCliEmp.steps';
                        break;
                        case "EjecutivoMapfre":
                          $scope.tpl = 'crearUsuarioEjecMapfre.steps';
                        break;
                        case "Proveedor":
                          $scope.tpl = 'crearUsuarioProveedor.steps';
                        break;
                        case "Broker":
                          $scope.tpl = 'crearUsuarioCorredor.steps';
                        break;
                      }
                    });

                    $scope.fnGoCreateUser = function(){
                      $state.go($scope.tpl, {step: 1});
                    }

                    /*#########################
                    # closeModal
                    #########################*/
                    $scope.closeModal = function () {
                      // $uibModalInstance.dismiss('cancel');
                      $uibModalInstance.close();
                    };
                  }]
              });
              vModalProof.result.then(function(){
                //Action after CloseButton Modal
              },function(){
                //Action after CancelButton Modal
              });
            }
          }

          // Modal Clonar Accesos          
          function _fnClonarAccesos () {
            var vModalProof = $uibModal.open({
              backdrop: true, // background de fondo
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              size: 'md',
              templateUrl : '/security/app/secciones/usuarios/component/modalClonarAccesos.html',
              controller : ['$scope', '$uibModalInstance', '$uibModal',
                function($scope, $uibModalInstance, $uibModal) {
                  /*#########################
                  # closeModal
                  #########################*/
                  // $scope.frmModalAccesos.mIDUsuario = {};
                  $scope.closeModalClonarAccesos = function () {
                    // $uibModalInstance.dismiss('cancel');
                    $uibModalInstance.close();
                  };
                }]
            });
            vModalProof.result.then(function(){
              //Action after CloseButton Modal
            },function(){
              //Action after CancelButton Modal
            });
          }

          function _fnClonarRoles (){
            var pms = seguridadFactory.getAccessUserClone($scope.frmModalAccesos.mIDUsuario.numUsuario);
            pms.then(function(response){
              if(response.operationCode == 200){
                $scope.dataListAccess = response.data || response.Data;
                $scope.frmModalAccesos.btnDisabled = ($scope.dataListAccess.length == 0) ? true : false
              }else mModalAlert.showWarning(response.message, '')
            })            
            var vModalProof = $uibModal.open({
              backdrop: true, // background de fondo
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              size: 'md',
              templateUrl : '/security/app/secciones/usuarios/component/modalClonarRoles.html',
              controller : ['$scope', '$uibModalInstance', '$uibModal',
                function($scope, $uibModalInstance, $uibModal) {
                  /*#########################
                  # closeModal
                  #########################*/
                  $scope.fnClonarRoles = _fnClonarRolesOk;
                  $scope.closeModal = function () {
                    // $uibModalInstance.dismiss('cancel');
                    $uibModalInstance.close();
                  };
                }]
            });
            vModalProof.result.then(function(){
              //Action after CloseButton Modal
            },function(){
              //Action after CancelButton Modal
            });
          }

          /*--------------------------------------
          autocomplete apps
          ----------------------------------------*/
          function _fnGetListApps(str){
            if(str && str.length >= 2){
              var txt = str.toUpperCase();
              var defer = $q.defer();
              var pms = seguridadFactory.autocompleteApps(txt)
              pms.then(function(response){
                var data = response.data || response.Data;
                if(data.length > 0){
                  var i = 0;
                  ng.forEach(data, function(item){
                    data[i].codeDescription = data[i].codigo+' - '+data[i].descripcion
                    i++
                  });
                  $scope.noResultApps = false;
                } 
                else $scope.noResultApps = true;
                defer.resolve(data);
              })
              .catch(function(err){
                mModalAlert.showError('Ha ocurrido un error inesperado. Por favor, vuelva a intentarlo más tarde.', '');
              });
              return defer.promise;
            }
          }

          /*--------------------------------------
          autocomplete office
          ----------------------------------------*/
          function _fnGetListOffice(str){
            if(str && str.length >= 2){
              var txt = str.toUpperCase();
              var defer = $q.defer();
              var pms = seguridadFactory.autocompleteOffice(txt)
              pms.then(function(response){
                var data = response.data || response.Data;
                if(data.length > 0){
                  var i = 0;
                  ng.forEach(data, function(item){
                    data[i].codeDescription = data[i].codigo+' - '+data[i].descripcion
                    i++
                  });
                  $scope.noResultApps = false;
                } 
                else $scope.noResultApps = true;
                  defer.resolve(data);
                })
                .catch(function(err){
                  mModalAlert.showError('Ha ocurrido un error inesperado. Por favor, vuelva a intentarlo más tarde.', '');
                });
              return defer.promise;
            }
          }

          /*--------------------------------------
          autocomplete rol
          ----------------------------------------*/
          function _fnGetListRole(str){
            if(str && str.length >= 2){
              var txt = str.toUpperCase();
              var defer = $q.defer();
              seguridadFactory.autocompleteRole(0, txt)
                .then(function(response){
                  var data = response.data || response.Data;
                  if(data.length > 0){
                  var i = 0;
                  ng.forEach(data, function(item){
                    data[i].codeDescription = data[i].codigo+' - '+data[i].descripcion
                    i++
                  });
                  $scope.noResultApps = false;
                } 
                  else $scope.noResultRole = true;
                  defer.resolve(data);
                })
                .catch(function(err){
                mModalAlert.showError('Ha ocurrido un error inesperado. Por favor, vuelva a intentarlo más tarde.', '');
              });;
              return defer.promise;
            }
          }

          /*--------------------------------------
          clear
          ----------------------------------------*/
          function _fnClearFilter(){


            $scope.dashboardData = [];
            $scope.params = {};
            $scope.showSelectedBar = false;
            $scope.oneAtATime = false;
            $scope.totalItems = 0;
            $scope.totalPages = 0;
            $scope.countSelect = 0;
            $scope.firstLoad = true;
            $scope.noResult = true;
            $scope.searchClient.mUsuario = "";
            $scope.searchClient.mEmpresa = "";
            $scope.searchClient.mSelectedAllUser = false;
            //$scope.searchClient.mEmpresa

            ng.forEach($scope.userTypesData, function(item){
              item.value = false;
              item.filter = undefined;
              if(item.parent){
                ng.forEach(item.childs, function(child){
                  child.value = false;
                });
              }
            });
            $scope.str = "";
            $scope.selectedItems = [];
            $scope.strFilter = [];
            $scope.strFilterText = "";

            var j = 0;
            ng.forEach($scope.userStatesData, function(item){
              $scope.searchClient.mUserState[j] = false;
              j++;
            });
            $scope.arrayStates = [];
            $scope.strStates = "";

            //oficina
            $scope.searchClient.mOficina = "";

            //rol
            $scope.searchClient.mRol = "";

            //aplicacion
            $scope.searchClient.mAplicacion = "";

            //perfil
            $scope.searchClient.mPerfil = "";

            //ordenar
            $scope.mOrdenarPor = {
              codigo : null
            };

            $scope.accordOpened01.status = false;
            $scope.accordOpened02.status = false;
            $scope.accordOpened03.status = false;
            $scope.accordOpened04.status = false;
            $scope.accordOpened05.status = false;
            $scope.accordOpened06.status = false;

            $scope.frmModalAccesos.mIDUsuario = undefined;
          }

          function _fnClonarRolesOk() {
            var request = {
              numUser: $scope.frmModalAccesos.mIDUsuario.numUsuario
              , userListText: $scope.selectedItems.toString()
              , codeUser: $scope.frmModalAccesos.mIDUsuario.codigoUsuario
            }
            var pms = seguridadFactory.cloneList(request)
            pms.then(function(response){
              if(response.data) mModalAlert.showSuccess('', 'Usuario clonado con éxito');
              else mModalAlert.showWarning(response.message, '')
            })
            // var response = true;
            // if (response) {
            //   mModalAlert.showSuccess('', 'Usuario clonado con éxito');
            // }
          }

          function _fnDeshabilitarUsuario(){
            mModalConfirm.confirmInfo('Al momento de deshabilitar el usuario perderá los accesos', '¿Estás seguro de deshabilitar a los usuarios seleccionados?', 'Deshabilitar usuarios')
              .then(function () {
                _fnDeshabilitarUsuarioOk();
              });
            // return defer.promise;
          }

          function _fnDeshabilitarUsuarioOk(){
            if($scope.userDisma){
              if (!$scope.searchClient.mSelectedAllUser){
                var params = {
                  userListText: $scope.selectedItems.toString()
                  , codeUser: $scope.profile.username
                }
                var pms = seguridadFactory.disableUserList(params)
              }else{
                var params = {
                  user: ($scope.searchClient.mUsuario) ? $scope.searchClient.mUsuario : ""
                  , numCompany: $scope.searchClient.mEmpresa.numero
                  , listUserTypesText: $scope.strFilter.toString()
                  , listStatesText: (ng.isUndefined($scope.strStates)) ? "" : $scope.strStates.toString()
                  , codeOffice: $scope.searchClient.mOficina.codigo
                  , numRole: $scope.searchClient.mRol.numero
                  , numApplication: $scope.searchClient.mAplicacion.numero
                  , numProfile: $scope.searchClient.mPerfil.numero
                  , codeUser: $scope.profile.username
                }
                var pms = seguridadFactory.disableUserAll(params)
              }
            }else{ //admin externo
              if (!$scope.searchClient.mSelectedAllUser){
                var params = {
                  userListText: $scope.selectedItems.toString()
                  , codeUser: $scope.profile.username
                }
                var pms = seguridadFactory.disableUserList(params)
              }else{
                var params = {
                  user: ($scope.searchClient.mUsuario) ? $scope.searchClient.mUsuario : ""
                  , numCompany: $scope.adminExt.numPerson
                  , numTypeGroup: $scope.adminExt.typePerson
                  , listStatesText: (ng.isUndefined($scope.strStates)) ? "" : $scope.strStates.toString()
                  , codeUser: $scope.profile.username
                }
                var pms = seguridadFactory.disableAdminUserAll(params)
              }
            }
            pms.then(function(response){
              if(response.operationCode == 200){
                $timeout(function(){
                  $scope.searchClient.mSelectedAllUser = false;
                  $scope.showSelectedBar = false;
                  $scope.countSelect = 0;
                  getUserList();
                }, 200);
              }else mModalAlert.showWarning(response.message, '');
            })
            .catch(function(err){
              mModalAlert.showError('Ha ocurrido un error inesperado. Por favor, vuelva a intentarlo más tarde.', '');
            })
          }
          
          
          
          function _fnHabilitarUsuario(){
            mModalConfirm.confirmInfo('Al momento de habilitar el usuario volverá a estar activo', '¿Estás seguro de habilitar a los usuarios seleccionados?', 'Habilitar usuarios')
              .then(function () {
                _fnHabilitarUsuarioOk();
              });
          }

          function _fnHabilitarUsuarioOk(){
            if (!$scope.searchClient.mSelectedAllUser){
              var params = {
                userListText: $scope.selectedItems.toString()
                , codeUser: $scope.profile.username
              }
              var pms = seguridadFactory.enableUserList(params)
            }else{
              var params = {
                user: ($scope.searchClient.mUsuario) ? $scope.searchClient.mUsuario : ""
                , numCompany: $scope.searchClient.mEmpresa.numero
                , listUserTypesText: $scope.strFilter.toString()
                , listStatesText: (ng.isUndefined($scope.strStates)) ? "" : $scope.strStates.toString()
                , codeOffice: $scope.searchClient.mOficina.codigo
                , numRole: $scope.searchClient.mRol.numero
                , numApplication: $scope.searchClient.mAplicacion.numero
                , numProfile: $scope.searchClient.mPerfil.numero
                , codeUser: $scope.profile.username
              }
              var pms = seguridadFactory.enableUserAll(params)
            }
            
            pms.then(function(response){
              if(response.operationCode == 200){
                $timeout(function(){
                  $scope.searchClient.mSelectedAllUser = false;
                  $scope.showSelectedBar = false;
                  $scope.countSelect = 0;
                  getUserList();
                }, 200);
              }else mModalAlert.showWarning(response.message, '');
            })
            .catch(function(err){
              mModalAlert.showError('Ha ocurrido un error inesperado. Por favor, vuelva a intentarlo más tarde.', '');
            })
          }

          /*--------------------------------------
          resend link
          ----------------------------------------*/
          function _fnReenviarEnlace(item){
            mModalConfirm.confirmQuestion(
              'Se reenviará un enlace al correo ' + item.correo + ' para que el usuario pueda confirmar y acceder a su cuenta.',
              '¿Deseas reenviar el correo de confirmación?',
              'Reenviar'
            )
            .then(function() {
              var paramsResend = {
                UserNumber: item.numUsuario,
                TokenStatusCode: item.codEstadoToken,
                Person: item.persona,
                Email: item.correo
              }
              _fnReenviarEnlaceOk(paramsResend);
            });
          }

          function _fnReenviarEnlaceOk(params) {
            var promise = seguridadFactory.postDismaResendLink(params);
            promise.then(function(response){
              if(response.operationCode == 200)
                mModalAlert.showSuccess('El enlace ha sido reenviado a ' + params.Email, '¡Enlace reenviado!').then(function(){
                  getUserList();
                });
              else
                mModalAlert.showWarning(response.message, '');
            });
          }

          /*--------------------------------------
          caducar link
          ----------------------------------------*/
          function _fnAnularUsuario(item){
            mModalConfirm.confirmQuestion(
              'Al momento de caducar el usuario, este quedará deshabilitado.',
              '¿Está seguro de caducar el usuario?',
              'Caducar'
            ).then(function() {
                _fnAnularUsuarioOK(item.numUsuario);
              });
          }

          function _fnAnularUsuarioOK(num) {
            var promise = seguridadFactory.postExpireLink(num);
            promise.then(function(response){
              if (response.operationCode == 200)
                mModalAlert.showSuccess('El usuario ha sido caducado.', '¡Confirmación Caducar!');
              else
                mModalAlert.showWarning('Ocurrió un error al intentar caducar el enlace.', '');
            });
            getDashboardData();
          }

          /*--------------------------------------
          ordenar por
          ----------------------------------------*/
          function _fnOrdenarPor(val){
            $scope.params.sortingType = val;
            $timeout(function(){
              getUserList();
            }, 200);
            //$scope.dashboardData = $scope.data;
          }

          $scope.fnBuildStrState = _fnBuildStrState;
          $scope.arrayStates = [];
          function _fnBuildStrState(mUserState, val, event){
            var pos = $scope.arrayStates.indexOf(String(val));
            if(mUserState){
              event.stopPropagation();
              if(pos == -1) $scope.arrayStates.push(String(val));
              else $scope.arrayStates.splice(pos, 1);
            }
            // else
            //   if(mUserState) $scope.arrayStates.splice(pos, 1);
            if($scope.arrayStates.length > 1) $scope.strStates = $scope.arrayStates.join();
            else if($scope.arrayStates.length == 1) $scope.strStates = $scope.arrayStates[0];
            else $scope.strStates = "";
          }

          /*--------------------------------------
          Ver Detalle
          ----------------------------------------*/
          function _fnViewDetails(item){
            switch(item.nombreTipoGrupo){
              case 'EJECUTIVO MAPFRE':
                var strRoute = "detalleEjecMapfre";
              break;
              case  'CLIENTE PERSONA':
                var strRoute = "detalleUsuario";
              break;
              case 'CLIENTE EMPRESA':
                var strRoute = "detalleCliEmp";
              break;
              case 'PROVEEDOR':
                var strRoute = "detalleProveedor";
              break;
              case 'CORREDOR':
                var strRoute = "detalleCorredor";
              break;
            }
            $state.go(strRoute, {id: item.numUsuario});
          }

          /*--------------------------------------
          Redireccionar a Cargas masivas
          ---------------------------------------*/
          $scope.fnRedireccionarcargasMasivas = _fnRedireccionarcargasMasivas;
          function _fnRedireccionarcargasMasivas(option){
            switch(option){
              case 'MODIFICACION':
                var prefRoute = 'modificacionMasiva';
              break;
              case 'DESHABILITACION':
                var prefRoute = 'deshabilitacionMasiva';
              break;
              case 'REGISTRO':
              var prefRoute = 'creacionMasiva';
              break;
              case 'CLONACIÓN':
                var prefRoute = 'clonacion';
              break;
              case 'HABILITACIÓN':
                var prefRoute = 'habilitacion';
              break;
            }
            $state.go(prefRoute);
          }

    }])
});
