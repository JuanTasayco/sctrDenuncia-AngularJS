(function ($root, name, deps, action) {
    $root.define(name, deps, action)
})(window, 'tabGrupoParametroCampania', ['angular', '/atencionsiniestrosagricola/app/utilities/agricolaUtilities.js'], function (angular) {
    angular.module('atencionsiniestrosagricola.app').
        controller('tabGrupoParametroCampaniaController', ['$rootScope', '$scope', 'mpSpin', 'mModalAlert', 'proxyCampania',
            function ($rootScope, $scope, mpSpin, mModalAlert, proxyCampania) {
                var vm = this;

                //Codigos por defecto
                codigoCampania = 0;
                usuarioSistema = "";

                //Secciones
                $scope.mGrupParamSec = true;
                $scope.mParamSec = false;

                //Paginación y búsqueda
                //Grupo parametro
                $scope.maxSize = 10;
                $scope.sizePerPage = 10;
                $scope.currentPage = 1;
                $scope.totalRecords = 0;
                $scope.changePage = setPagingDataGrpP;

                //Parametro
                $scope.maxSizePar = 5;
                $scope.sizePerPagePar = 5;
                $scope.currentPagePar = 1;
                $scope.totalRecordsPar = 0;
                $scope.changePagePar = setPagingDataParam;

                //Grupo Parametros
                var listaBusGrupPar = []; //Lista de busqueda
                var listaGrupPar = []; //Lista que alimentará al paginador
                var listaGeneralGrpPar = []; //Lista con todos los registros

                //Parametros
                var codGrupParam = 0;
                var listaBusquedaParametro = []; //Lista de busqueda
                var listaParam = [];//Lista que alimentará al paginador
                var listaGeneralParam = [];//Lista con todos los registros

                //Flags de opciones
                $scope.flagMostrarEditarParam = false;
                $scope.indexListaParam = 0;


                vm.$onInit = function () {
                    usuarioSistema = vm.masters.usuarioSistema;
                    codigoCampania = vm.masters.codigoCampania;
                    $scope.mListaGrpPar = true;
                }


                //Manejo de cargas por tab
                $rootScope.$watch('mTabCampania', function () {
                    cargarTabParametro();
                }, true);

                function cargarTabParametro() {
                    var tabActivo = $rootScope.mTabCampania;
                    if (tabActivo == 5) {
                        $scope.estadoRegistro = vm.masters.estadoRegistro;
                        cargarGrpParamCampania();
                    }
                }

                $scope.procesarGrupParam = function (nombreParam, anexoParam) {

                    var objParametro = {
                        "codigoCampania": codigoCampania,
                        "nombParam": nombreParam,
                        "anexo": anexoParam,
                        "usuarioRegistro": usuarioSistema
                    };
                    mpSpin.start('Guardando información, por favor espere...');
                    proxyCampania.InsertGrupParametro(codigoCampania,objParametro)
                        .then(function (response) {
                            if (response.operationCode == 200) {
                                mpSpin.end();
                                mModalAlert.showSuccess("", "¡Se insertó el Parámetro!").then(function (response) {
                                    recargarListGruParm();
                                    $scope.frmFormGrupParam.$setPristine();
                                });
                            }
                            else {
                                mpSpin.end();
                                mModalAlert.showError(response.message, "Error en el sistema");
                            }
                        }, function (response) {
                            mpSpin.end();
                            mModalAlert.showError(response.message, "Error en el sistema");
                        });
                }
                $scope.habilitarGrupPar = function (codGrupParam, estadoRegistro) {
                    var textoModal = "";
                    var objParametro = {
                        "codGrupoParam": codGrupParam,
                        "usuarioModificacion": usuarioSistema
                    };
                    mpSpin.start('Guardando información, por favor espere...');
                    proxyCampania.HabilitarGrupoParam(codigoCampania,objParametro)
                        .then(function (response) {
                            if (response.operationCode == 200) {
                                if (estadoRegistro == 'I') {
                                    textoModal = "Habilitó";
                                } if (estadoRegistro == 'A') {
                                    textoModal = "Inhabilitó";
                                }
                                mpSpin.end();
                                mModalAlert.showSuccess("", "¡Se " + textoModal + " el Grupo Parámetro!").then(function (response) {
                                    recargarListGruParm();
                                });
                            }
                            else {
                                mpSpin.end();
                                mModalAlert.showError("Error en el sistema");
                            }
                        }, function (response) {
                            mpSpin.end();
                            mModalAlert.showError(response.message, "Error en el sistema");
                        });

                }

                $scope.mostrarParam = function (codGrupPar, nombGrpPar) {

                    $scope.lblDescGruParam = nombGrpPar;
                    objParametro = {
                        "codigoCampania": codigoCampania,
                        "codGrupoParam": codGrupPar
                    };
                    $scope.mGrupParamSec = false;
                    $scope.mParamSec = true;
                    $scope.mListaParam = true;
                    $scope.mNuevoParam = false;
                    codGrupParam = codGrupPar;
                    cargarParametros();
                }

                $scope.procesarParam = function (nombreParametro, codParametro, abrevParametro, tipoOper) {
                    var objParametro = {
                        "codParam": codParametro,
                        "detParam": nombreParametro,
                        "usuarioRegistro": usuarioSistema,
                        "usuarioModificacion": usuarioSistema,
                        "abrevParam": abrevParametro
                    };
                    mpSpin.start('Guardando información, por favor espere...');

                    if (tipoOper == 1) {
                        proxyCampania.InsertParametro(codigoCampania,codGrupParam,objParametro)
                            .then(function (response) {
                                if (response.operationCode == 200) {
                                    mpSpin.end();
                                    mModalAlert.showSuccess("", "¡Se insertó el Parámetro!");
                                    recargarParametro();
                                    $scope.frmFormParam.$setPristine();
                                }
                                else {
                                    mpSpin.end();
                                    mModalAlert.showError(response.message, "Error en el sistema");
                                }
                            }, function (response) {
                                mpSpin.end();
                                mModalAlert.showError(response.message, "Error en el sistema");
                            });
                    }
                    if (tipoOper == 2) {
                        objParametro.tipoCambio = 1;
                        proxyCampania.EditarParametro(codigoCampania,codGrupParam,objParametro)
                            .then(function (response) {
                                if (response.operationCode == 200) {
                                    mpSpin.end();
                                    mModalAlert.showSuccess("", "¡Se modificó el Parámetro!");
                                    recargarParametro();
                                }
                                else {
                                    mpSpin.end();
                                    mModalAlert.showError(response.message, "Error en el sistema");
                                }
                            }, function (response) {
                                mpSpin.end();
                                mModalAlert.showError(response.message, "Error en el sistema");
                            });
                    }

                }
                $scope.habilitarParam = function (codParametro, estadoRegistro) {
                    var textoModal = "";
                    var objParametro = {
                        "codParam": codParametro,
                        "usuarioModificacion": usuarioSistema
                    };
                    mpSpin.start('Guardando información, por favor espere...');
                    proxyCampania.EditarParametro(codigoCampania,codGrupParam,objParametro)
                        .then(function (response) {
                            if (response.operationCode == 200) {
                                if (estadoRegistro == 'I') {
                                    textoModal = "Habilitó";
                                } if (estadoRegistro == 'A') {
                                    textoModal = "Inhabilitó";
                                }
                                mpSpin.end();
                                mModalAlert.showSuccess("", "¡Se " + textoModal + " el Parámetro!").then(function (response) {
                                    recargarParametro();
                                });
                            }
                            else {
                                mpSpin.end();
                                mModalAlert.showError("Error en el sistema");
                            }
                        }, function (response) {
                            mpSpin.end();
                            mModalAlert.showError(response.message, "Error en el sistema");
                        });

                }
                $scope.mostrarEditarParam = function (item,index) {
                    var flag = $scope.flagMostrarEditarParam;
                    $scope.mCodParamEdit = {};
                    $scope.mNombreParamEdit = {};
                    $scope.mAbrParamEdit = {};
                    if(item){              
                        $scope.mCodParamEdit[index] = item.codParam;
                        $scope.mNombreParamEdit[index] = item.detParam;
                        $scope.mAbrParamEdit[index] = item.abrevParam;    
                    }
                    if (flag) {
                        $scope.flagMostrarEditarParam = false;
                        if ($scope.indexListaParam != index) {
                            $scope.flagMostrarEditarParam = true;
                            $scope.indexListaParam = index;
                        }
                    } else {
                        $scope.flagMostrarEditarParam = true;
                        $scope.indexListaParam = index;
                    }
                }
                function setPagingDataGrpP(page) {
                    //Grupo Parametro
                    var pagedData = listaGrupPar.slice(
                        (page - 1) * $scope.sizePerPage,
                        page * $scope.sizePerPage
                    );
                    $scope.listaGrupPar = pagedData;
                }
                function setPagingDataParam(page) {

                    var pagedData = listaParam.slice(
                        (page - 1) * $scope.sizePerPagePar,
                        page * $scope.sizePerPagePar
                    );
                    $scope.listaParams = pagedData;
                }
                function cargarGrpParamCampania() {
                    mpSpin.start('Cargando, por favor espere...');
                    proxyCampania.GetgrupoParametro(codigoCampania).then(function (response) {
                        if (response.operationCode === 200) {
                            listaGrupPar = response.data;
                            $scope.listaGrupPar = listaGrupPar;

                            $scope.totalRecords =  (response.data.length >0 ? response.data[0].totalRecords : 0);
                            $scope.currentPage= 1;
                            setPagingDataGrpP(1);
                            $scope.mostrarListadoGrpP();
                            listaGeneralGrpPar = listaGrupPar;
                            mpSpin.end();
                        } else {
                            mModalAlert.showWarning("Error al cargar los Parámetros", "");
                        }
                    });
                }
                function cargarParametros() {
                    mpSpin.start('Cargando, por favor espere...');
                    proxyCampania.GetParametro(codigoCampania,codGrupParam).then(function (response) {
                        if (response.operationCode === 200) {
                            listaParam = response.data;
                            $scope.listaParams = listaParam;
                            $scope.totalRecordsPar =  (response.data.length >0 ? response.data[0].totalRecords : 0);
                            $scope.currentPagePar = 1;
                            setPagingDataParam(1);
                            $scope.mostrarListadoParam();
                            listaGeneralParam = listaParam;
                            mpSpin.end();
                        } else {
                            mModalAlert.showWarning("Error al cargar los Parámetros", "");
                        }
                    });
                }

                $scope.mostrarListadoGrpP = function () {
                    $scope.mDescParametro = "";
                    $scope.mNuevoGrpPar = false;
                    $scope.mListaGrpPar = true;
                }
                $scope.mostrarListadoParam = function () {
                    $scope.mNuevoParam = false;
                    $scope.mListaParam = true;
                }

                $scope.mostrarOperParam = function () {
                    $scope.mNuevoParam = true;
                    $scope.mListaParam = false;
                    $scope.frmFormParam.$setPristine();
                }
                $scope.mostrarOperGrpP = function () {
                    $scope.mNuevoGrpPar = true;
                    $scope.mListaGrpPar = false;
                    $scope.frmFormGrupParam.$setPristine();
                }

                $scope.volverListaParam = function () {
                    $scope.currentPage = 1;
                    $scope.currentPagePar = 1;
                    recargarListGruParm();
                    $scope.mGrupParamSec = true;
                    $scope.mParamSec = false;
                }
                function recargarListGruParm() {
                    cargarGrpParamCampania();
                    $scope.mNombreGrpParam = "";
                    $scope.mAnexoGrpParam = "";
                    $scope.frmFormGrupParam.$setPristine();
                }
                function recargarParametro() {
                    cargarParametros();
                    $scope.flagMostrarEditarParam = false;
                    $scope.mNombreParam = "";
                    $scope.mCodParamt = "";
                    $scope.mAbrParamt = "";
                    $scope.frmFormParam.$setPristine();
                }
                $scope.searchResults = function () {

                    switch ($scope.mGrupParamSec) {
                        case true:
                            listaBusGrupPar = [];
                            var valBuscar = $scope.mNombreGrpParBuscar;
                            if (typeof valBuscar !== "undefined" && valBuscar != "") {
                                listaGeneralGrpPar.forEach(function (value, key) {
                                    var nomb = value.nombParam.toUpperCase();
                                    var busq = valBuscar.toUpperCase();
                                    if (nomb.includes(busq)) {
                                        listaBusGrupPar.push(value);
                                    }
                                });
                                listaGrupPar = listaBusGrupPar;
                                $scope.listaGrupPar = listaBusGrupPar;
                                setPagingDataGrpP(1);
                                $scope.totalRecords = $scope.listaGrupPar.length;
                                $scope.flagMostrarEditarParam = false;
                            }
                            break;
                        case false:
                            listaBusquedaParametro = [];
                            var valBuscar = $scope.mNombreParamBuscar;
                            if (typeof valBuscar !== "undefined" && valBuscar != "") {
                                listaGeneralParam.forEach(function (value, key) { 
                                    var cod = value.codParam.toUpperCase();
                                    var nomb = value.detParam.toUpperCase();
                                    var busq = valBuscar.toUpperCase();
                                    if (nomb.includes(busq) || busq.includes(cod)) {
                                        listaBusquedaParametro.push(value);
                                    }

                                });

                                listaParam = listaBusquedaParametro;
                                $scope.listaParams = listaBusquedaParametro;
                                $scope.totalRecordsPar = $scope.listaParams.length;
                            }
                            break;
                    }
                }

                $scope.limpiarBuscador = function () {
                    switch ($scope.mGrupParamSec) {
                        case true:
                            cargarGrpParamCampania();
                            $scope.mNombreGrpParBuscar = "";
                            break;
                        case false: 
                            cargarParametros();
                            $scope.mNombreParamBuscar = "";
                            break;
                    }
                }
            }]).
        component('tabGrupoParametroCampania', {
            templateUrl: '/atencionsiniestrosagricola/app/campanias/components/tab/tab-grupoparametro-campania.html',
            controller: 'tabGrupoParametroCampaniaController',
            bindings: {
                masters: '=?',
                reloadMasters: '&?'
            }
        })
});