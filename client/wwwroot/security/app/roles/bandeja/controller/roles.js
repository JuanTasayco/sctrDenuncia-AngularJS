(function ($root, deps, action) {
    define(deps, action)
})(this, ['angular', 'constants', 'helper', 'messagesSeguridad'],
    function (angular, constants, helper, messagesSeguridad) {

        var appSecurity = angular.module('appSecurity');

        appSecurity.controller('rolesController',
            ['$scope', '$state', '$q', 'mModalAlert', 'mModalConfirm', 'MxPaginador', 'seguridadFactory', '$timeout', 'mpSpin', '$http', '$window', 
                function ($scope, $state, $q, mModalAlert, mModalConfirm, MxPaginador, seguridadFactory, $timeout, mpSpin, $http, $window) {

                    var profile = seguridadFactory.getVarLS('profile');
                    if(profile.typeUser != 1) $state.go('dashboard');


                    /* Constantes */
                    var MAX_ROWS_DEFAULT = 10;
                    var NUM_PAGE_DEFAULT = 1;
                    var SORTING_TYPE_DEFAULT = 0;

                    $scope.ENABLE_STATE = messagesSeguridad.CODIGO_ESTADO.HABILITADO;
                    $scope.DISABLED_STATE = messagesSeguridad.CODIGO_ESTADO.DESHABILITADO;

                    /* Variables */
                    var page;
                    var searchApplication;
                    var searchRole = '';

                    /* Funciones */
                    $scope.viewDetailRole  = ViewDetailRole;
                    $scope.showCreateRole = ShowCreateRole;
                    $scope.getRolesAppSearchAutocomplete = GetRolesAppSearchAutocomplete;
                    $scope.selectAppAutocomplete = SelectAppAutocomplete;
                    $scope.changeStateRole = ChangeStateRole;
                    $scope.getRolesPage = GetRolesPage;
                    $scope.getRolesSearch = GetRolesSearch;
                    $scope.clearFieldsSearch = ClearFieldsSearch;


                    function ShowCreateRole() {
                        $state.go("crearRol.steps", {step: 1});
                    }

                    function ViewDetailRole(item) {
                        $state.go("detalleRol", { id: item.numRol });
                    }

                    function GetRolesAppSearchAutocomplete(searchValue){
                        if(searchValue && searchValue.length >= 2){
                            var search = searchValue.toUpperCase();

                            var defer = $q.defer();
                            seguridadFactory.autocompleteApps(search)
                            .then(function(response){
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

                    function SelectAppAutocomplete(application){
                        if(application === undefined) searchApplication = '';
                        else searchApplication = application.numero;
                    }

                    function ChangeStateRole(item, event) {
                        $timeout(function(){
                            var action;
                            var codEstado = item.codEstado
                            if(item.codEstado == 1 ){
                                item.codEstado = 2
                                action = 'habilitar'
                            }
                            else{
                                item.codEstado = 1;
                                action = 'deshabilitar'
                            }

                            var msgTitle =  'Recuerde que al '+action+' el rol seleccionado, afecta a todos'+
                                            ' los usuarios que tengan dicho rol asignado.'
                            var msgRegular = '¿Está seguro de que desea '+action+' este rol?';
                            mModalConfirm.confirmWarning(msgRegular, msgTitle)
                            .then(function(data){
                                if(data){
                                    var param = {
                                        RoleNumber: item.numRol,
                                        StatusCode: codEstado,
                                        CodeUser: 'TOKEN'
                                    };
                                    seguridadFactory.postUpdateStatusRole(param, true)
                                    .then(function (response) {
                                        if (response.operationCode !== 200) {
                                            mModalAlert.showWarning(response.message, '');
                                        }
                                        getRolesData(true);
                                    })
                                    .catch(function(error){
                                        showErrorMessage(error);
                                    });
                                }
                            
                            })
                        })
                        .catch(function(error){
                            showErrorMessage(error);
                        });
                    }

                    function GetRolesPage(event) {
                        page.setNroPaginaAMostrar(event.pageToLoad)
                            .thenLoadFrom(function(tanda){
                                    $scope.currentPage = tanda;
                                    getRolesData(true);
                                }, function(){
                                    $scope.roles = page.getItemsDePagina();
                                })
                            ;
                    }

                    function GetRolesSearch() {
                        $scope.currentPage = NUM_PAGE_DEFAULT;
                        page.setCurrentTanda($scope.currentPage);
                        searchRole = ($scope.mBuscarRol) ? $scope.mBuscarRol.toUpperCase() : '';
                        searchApplication = ($scope.mBuscarApplication) ? ($scope.mBuscarApplication.numero) ? $scope.mBuscarApplication.numero : '' : '';
                        getRolesData(true);
                    }

                    function getRolesData(showSpin) {
                        var params = {
                            codeApplication: searchApplication,
                            codeNameSearch: searchRole,
                            PageNum: ($scope.currentPage) ? $scope.currentPage: NUM_PAGE_DEFAULT,
                            PageSize: $scope.itemsXPagina,
                            SortingType: SORTING_TYPE_DEFAULT
                        };
                        seguridadFactory.getRolApplication(params, showSpin)
                        .then(function (response) {
                            SetPaginateDefaultValues();
                            if (response.operationCode === 200) {
                                if(response.data){
                                    if(response.data.totalFilas > 0){
                                        $scope.totalItems = response.data.totalFilas;
                                        $scope.roles = response.data.paginacion;
                                    }
                                }
                            } else {
                                mModalAlert.showWarning(response.message, '');
                            }
                            page.setNroTotalRegistros($scope.totalItems)
                                .setDataActual($scope.roles)
                                .setConfiguracionTanda();
                        })
                        .catch(function(error){
                            showErrorMessage(error);
                        });
                    };

                    function SetPaginateDefaultValues(){
                        $scope.roles = [];
                        $scope.totalItems = 0;
                    }

                    function ClearFieldsSearch(){
                        $scope.mBuscarApplication = '';
                        $scope.mBuscarRol = '';
                        searchRole = '';
                        searchApplication = '';
                        getRolesData(true);
                    }

                    function showErrorMessage(error){
                        mModalAlert.showWarning(messagesSeguridad.UNEXPECTED_ERROR, '');
                    }
                    
                    $scope.exportExcel = exportExcel;
                    function exportExcel(){
                        seguridadFactory.exportExcel(constants.system.api.endpoints.seguridad+"api/Rol/ExportExcel");
                    }

                    function initDataDefault() {
                        $scope.currentPage = NUM_PAGE_DEFAULT;
                        $scope.itemsXPagina = MAX_ROWS_DEFAULT;
                        $scope.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
                        $scope.mBuscarApplication = "";
                        $scope.mBuscarRol = '';

                        $scope.roles = null;
                        $scope.totalItems = null;

                        page = new MxPaginador();
                        page.setNroItemsPorPagina($scope.itemsXPagina);
                    }

                    (function onLoad() {
                        initDataDefault();
                        getRolesData(true);
                    })();


                }
            ]
        )
    });
