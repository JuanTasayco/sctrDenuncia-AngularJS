(function ($root, deps, action) {
    define(deps, action)
})(this, ['angular', 'constants', 'helper', 'messagesSeguridad'],
    function (angular, constants, helper, messagesSeguridad) {

        var appSecurity = angular.module('appSecurity');

        appSecurity.controller('aplicacionesController',
            ['$scope', '$state', 'mModalAlert', 'mModalConfirm', 'MxPaginador', 'seguridadFactory','$timeout', 'mpSpin', '$http', '$window', '$q', 
                function ($scope, $state, mModalAlert, mModalConfirm, MxPaginador, seguridadFactory, $timeout, mpSpin, $http, $window, $q) {

                    var profile = seguridadFactory.getVarLS('profile');
                    if(profile.typeUser != 1) $state.go('dashboard');


                    /* CONSTANTES */
                    var MAX_ROWS_DEFAULT = 10;
                    var NUM_PAGE_DEFAULT = 1;
                    var SORTING_TYPE_DEFAULT = 1;

                    $scope.ENABLE_STATE = messagesSeguridad.CODIGO_ESTADO.HABILITADO;
                    $scope.DISABLED_STATE = messagesSeguridad.CODIGO_ESTADO.DESHABILITADO;

                    /* VARIABLES */
                    var page;
                    var searchApplication = '';

                    /* APLICACION */
                    /* FUNCIONES */
                    $scope.showCreateAplicacion = ShowCreateAplicacion;
                    $scope.viewDetailAplication = ViewDetailAplication;
                    $scope.changeStateAplication = ChangeStateAplication;
                    $scope.getAplicationsPage = GetAplicationsPage;
                    $scope.getAplicationSearch = GetAplicationSearch;
                    $scope.onlyView = true;

                    function ShowCreateAplicacion() {
                        $state.go("crearAplicaciones.steps",{ step:1 });
                    }

                    function ViewDetailAplication(item) {
                        $state.go("detalleAplicaciones", { id: item.numAplicacion });
                    }

                    function ChangeStateAplication(item, event) {
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

                            var msgTitle =  'Recuerde que al '+action+' la aplicación, afecta a todos'+
                                            ' los usuarios que tengan acceso a dicha aplicación'
                            var msgRegular = '¿Está seguro de que desea '+action+' esta aplicación?';
                            mModalConfirm.confirmWarning(msgRegular, msgTitle)
                            .then(function(data){
                                if(data){
                                    var param = {
                                        ApplicationNumber: item.numAplicacion,
                                        StatusCode: codEstado,
                                        UserCode: 'TOKEN'
                                    };
            
                                    seguridadFactory.postUpdateStatusAplication(param, true)
                                    .then(function (response) {
                                        if (response.operationCode !== 200) {
                                            mModalAlert.showWarning(response.message, '');                                
                                        }
                                        GetAplicacionesData(true);
                                    })
                                    .catch(function(error){
                                        ShowErrorMessage(error);
                                    });
                                }
                            
                            })
                        })
                    };

                    function GetAplicationsPage(event) {
                        page.setNroPaginaAMostrar(event.pageToLoad)
                            .thenLoadFrom(function(tanda){
                                    $scope.currentPage = tanda;
                                    GetAplicacionesData(true);
                                }, function(){
                                    $scope.aplicaciones = page.getItemsDePagina();
                                })
                            ;
                    }

                    function GetAplicationSearch() {
                        $scope.currentPage = NUM_PAGE_DEFAULT;
                        page.setCurrentTanda($scope.currentPage);
                        searchApplication = $scope.mBuscarAplicacion ? $scope.mBuscarAplicacion.toUpperCase() :  $scope.mBuscarAplicacion,
                        GetAplicacionesData(true);
                    }

                    function GetAplicacionesData(showSpin) {
                        var params = {
                            SearchValue: searchApplication,
                            PageNum: $scope.currentPage === 0 ? NUM_PAGE_DEFAULT : $scope.currentPage,
                            PageSize: $scope.itemsXPagina,
                            SortingType: SORTING_TYPE_DEFAULT,
                            ShowSpin: showSpin
                        };

                        seguridadFactory.getApplicationPaginate(params)
                        .then(function (response) {
                            SetPaginateDefaultValues();
                            if (response.operationCode === 200) {
                                if(response.data){
                                    if(response.data.totalFilas >0){
                                        $scope.totalItems = response.data.totalFilas;
                                        $scope.aplicaciones = response.data.paginacion;
                                    }
                                }
                            } else{
                                mModalAlert.showWarning(response.message, '');
                            }
                            page.setNroTotalRegistros($scope.totalItems)
                                .setDataActual($scope.aplicaciones)
                                .setConfiguracionTanda();
                        })
                        .catch(function(error){
                            ShowErrorMessage(error);
                        });
                    };

                    function ShowErrorMessage(error){
                        mModalAlert.showWarning(messagesSeguridad.UNEXPECTED_ERROR, '');
                    }

                    function SetPaginateDefaultValues(){
                        $scope.aplicaciones = [];
                        $scope.totalItems = 0;
                    }

                    $scope.exportExcel = exportExcel;
                    function exportExcel(){
                        seguridadFactory.exportExcel(constants.system.api.endpoints.seguridad+"api/Aplicacion/report");
                    }

                    function InitDataDefault() {
                        $scope.currentPage = NUM_PAGE_DEFAULT;
                        $scope.itemsXPagina = MAX_ROWS_DEFAULT;
                        $scope.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
                        $scope.mBuscarAplicacion = '';

                        $scope.aplicaciones = null;
                        $scope.totalItems = null;

                        page = new MxPaginador();
                        page.setNroItemsPorPagina($scope.itemsXPagina);
                    }

                    (function onLoad() {
                        InitDataDefault();
                        GetAplicacionesData(true);
                        const objetSeguridad = seguridadFactory.onlyView();
                        $scope.onlyView = objetSeguridad.soloLectura;
                    })();
                }
            ]
        )
    });