(function ($root, name, deps, action) {
    $root.define(name, deps, action)
})(window, 'tabGrupoCultivoCampania', ['angular', '/atencionsiniestrosagricola/app/utilities/agricolaUtilities.js'], function (angular) {
    angular.module('atencionsiniestrosagricola.app')
        .controller('tabGrupoCultivoCampaniaController', ['$rootScope', '$scope', 'mpSpin', 'mModalAlert',  'proxyCampania',
            function ($rootScope, $scope, mpSpin, mModalAlert,  proxyCampania) {
                var vm = this;

                //Codigos por defecto
                codigoCampania = 0;
                usuarioSistema = "";
                mTabListaCultivo = 0;

                //Secciones
                $scope.mGrupCultSec = true;
                $scope.mCultivoSec = false;

                //Paginación y búsqueda
                //Grupo cultivo
                $scope.maxSize = 10;
                $scope.sizePerPage = 10;
                $scope.currentPage = 1;
                $scope.totalRecords = 0;
                $scope.changePage = setPagingDataGrpC;

                //Cultivo
                $scope.maxSizeCul = 10;
                $scope.sizePerPageCul = 10;
                $scope.currentPageCul = 1;
                $scope.totalRecordsCul = 0;
                $scope.changePageCul = setPagingDataCul;

                //Grupo Cultivos
                var listaBusGrupCul = []; //Lista de busqueda
                var listaGrupCult = []; //Lista que alimentará al paginador
                var listaGeneralGrpCul = []; //Lista con todos los registros

                //Cultivos
                var codGrupCulti = 0;
                var listaBusquedaCultivo = [];//Lista de busqueda
                var listaCultivo = [];  //Lista que alimentará al paginador
                var listaGeneralCultivo = [];//Lista con todos los registros

                //Flags de opciones
                $scope.flagMostrarEditarCultivo = false;
                $scope.indexListaCultivo = 0;


                vm.$onInit = function () {
                    usuarioSistema = vm.masters.usuarioSistema;
                    codigoCampania = vm.masters.codigoCampania;
                    mTabListaCultivo = vm.masters.tabActivo;
                    $scope.mListaGrpCul = true;
                }

                //Manejo de cargas por tab
                $rootScope.$watch('mTabCampania', function () {
                    cargarTabCultivo();
                }, true);

                function cargarTabCultivo() {
                    var tabActivo = $rootScope.mTabCampania;
                    if (tabActivo == 2) {
                        $scope.estadoRegistro = vm.masters.estadoRegistro;  
                        cargarGrpCulCampania();
                    }
                }
                $scope.procesarGrupCul = function (descCultivo) {

                    var objCultivo = {
                        "codigoCampania": codigoCampania,
                        "descCultivo": descCultivo,
                        "usuarioRegistro": usuarioSistema
                    };
                    mpSpin.start('Guardando información, por favor espere...');
                    proxyCampania.InsertGrupCultivo(codigoCampania,objCultivo)
                        .then(function (response) {
                            if (response.operationCode == 200) {
                                if(response.data.codigo==401){
                                    mModalAlert.showWarning("", "El Grupo de Cultivo ya existe")
                                }else{
                                mModalAlert.showSuccess("", "¡Se insertó el Grupo de Cultivo!").then(function (response) {
                                    recargarListGruCul(true);
                                        $scope.frmFormGrupCultivo.$setPristine();
                                });
                            }
                                mpSpin.end();
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
                $scope.habilitarGrupCul = function (codGrupCultivo, estadoRegistro) {
                    var textoModal = "";
                    var objCultivo = {
                        "codGrupoCultivo": codGrupCultivo,
                        "usuarioModificacion": usuarioSistema
                    };
                    mpSpin.start('Guardando información, por favor espere...');
                    proxyCampania.EditarGrupoCultivo(codigoCampania,objCultivo)
                        .then(function (response) {
                            if (response.operationCode == 200) {
                                if (estadoRegistro == 'I') {
                                    textoModal = "Habilitó";
                                } if (estadoRegistro == 'A') {
                                    textoModal = "Inhabilitó";
                                }
                                mpSpin.end();
                                mModalAlert.showSuccess("", "¡Se " + textoModal + " el Grupo de Cultivo!").then(function (response) {
                                    recargarListGruCul();
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

                $scope.mostrarCul = function (codGrupCult, descGrpCul) {
                    $scope.lblDescGruCul = descGrpCul;
                    objCultivo = {
                        "codCampania": codigoCampania,
                        "codGrupoCultivo": codGrupCult
                    };
                    $scope.mGrupCultSec = false;
                    $scope.mCultivoSec = true;
                    $scope.mListaCultivo = true;
                    $scope.mNuevoCultivo = false;
                    codGrupCulti = codGrupCult;
                    cargarCultivo();
                }

                $scope.procesarCultivo = function (nombreCultivo, codCultivo, abrevCultivo, tipoOper) {
                    var objCultivo = {
                        "codCultivo": codCultivo,
                        "nombreCultivo": nombreCultivo,
                        "usuarioRegistro": usuarioSistema,
                        "usuarioModificacion": usuarioSistema,
                        "abrevCultivo": abrevCultivo
                    };
                    mpSpin.start('Guardando información, por favor espere...');

                    if (tipoOper == 1) {
                        proxyCampania.InsertCultivo(codigoCampania,codGrupCulti,objCultivo)
                            .then(function (response) {
                                if (response.operationCode == 200) {
                                    if(response.data.codigo=="401" || response.data.codigo=="-1" ){
                                        mpSpin.end();
                                        mModalAlert.showWarning("", "El cultivo ya existe");
                                    }else{
                                    mpSpin.end();
                                    mModalAlert.showSuccess("", "¡Se insertó el Cultivo!");
                                    recargarCultivo(true);
                                        $scope.frmFormCultivo.$setPristine();
                                }
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
                        objCultivo.tipoCambio = 1;
                        proxyCampania.EditarCultivo(codigoCampania,codGrupCulti,objCultivo)
                            .then(function (response) {
                                if (response.operationCode == 200) {
                                    mpSpin.end();
                                    mModalAlert.showSuccess("", "¡Se modificó el Cultivo!");
                                   
                                    recargarCultivo(true);
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
                $scope.habilitarCul = function (codCultivo, estadoRegistro) {
                    var textoModal = "";
                    var objCultivo = {
                        "codCultivo": codCultivo,
                        "usuarioModificacion": usuarioSistema
                    };
                    mpSpin.start('Guardando información, por favor espere...');
                    proxyCampania.EditarCultivo(codigoCampania,codGrupCulti,objCultivo)
                        .then(function (response) {
                            if (response.operationCode == 200) {
                                if (estadoRegistro == 'I') {
                                    textoModal = "Habilitó";
                                } if (estadoRegistro == 'A') {
                                    textoModal = "Inhabilitó";
                                }
                                mpSpin.end();
                                mModalAlert.showSuccess("", "¡Se " + textoModal + " el Cultivo!").then(function (response) {
                                    recargarCultivo(false);
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
                $scope.mostrarEditarCultivos = function (item,index) {
                    $scope.mNombreCultivoEdit = {};
                    $scope.mCodCultivoEdit = {};
                    $scope.mAbrCultivoEdit = {};
                    if(item){              
                        $scope.mNombreCultivoEdit[index] = item.nombreCultivo;
                        $scope.mCodCultivoEdit[index] = item.codCultivo;
                        $scope.mAbrCultivoEdit[index] = item.abrevCultivo;    
                    }
                    var flag = $scope.flagMostrarEditarCultivo;
                    if (flag) {
                        $scope.flagMostrarEditarCultivo = false;
                        if ($scope.indexListaCultivo != index) {
                            $scope.flagMostrarEditarCultivo = true;
                            $scope.indexListaCultivo = index;
                        }
                    } else {
                        $scope.flagMostrarEditarCultivo = true;
                        $scope.indexListaCultivo = index;
                    }
                }
                function setPagingDataGrpC(page) {
                    //Grupo Cultivo
                    var pagedData = listaGrupCult.slice(
                        (page - 1) * $scope.sizePerPage,
                        page * $scope.sizePerPage
                    );
                    $scope.listaGrupCult = pagedData;
                }
                function setPagingDataCul(page) {

                    var pagedData = listaCultivo.slice(
                        (page - 1) * $scope.sizePerPageCul,
                        page * $scope.sizePerPageCul
                    );
                    $scope.listaCultivos = pagedData;
                }

                function cargarGrpCulCampania() {                   
                    mpSpin.start('Cargando, por favor espere...');
                    proxyCampania.GetGrupoCultivo(codigoCampania).then(function (response) {
                        if (response.operationCode === 200) {
                            listaGrupCult = response.data;
                            $scope.listaGrupCult = listaGrupCult;
                            
                            $scope.totalRecords = (response.data.length >0 ? response.data[0].totalRecords : 0);
                            $scope.currentPage = 1;
                            setPagingDataGrpC(1);
                            $scope.mostrarListadoGrpC();
                            listaGeneralGrpCul = listaGrupCult;
                            mpSpin.end();
                        } else {
                            mModalAlert.showWarning("Error al cargar los Cultivos", "");
                        }
                    });
                }
                function cargarCultivo() {
                    mpSpin.start('Cargando, por favor espere...');
                    proxyCampania.GetCultivo(codigoCampania,codGrupCulti).then(function (response) {
                        if (response.operationCode === 200) {
                            listaCultivo = response.data;
                            $scope.listaCultivos = listaCultivo;

                            $scope.totalRecordsCul = (response.data.length >0 ? response.data[0].totalRecords : 0);
                            $scope.mostrarEditarCultivo = false;
                            $scope.currentPageCul = 1;
                            setPagingDataCul(1);
                            $scope.mostrarListadoCul();
                            listaGeneralCultivo = listaCultivo;
                            mpSpin.end();
                        } else {
                            mModalAlert.showWarning("Error al cargar los Cultivos", "");
                        }
                    });
                }
                $scope.mostrarListadoGrpC = function () {
                    $scope.mDescCultivo =null;
                    $scope.mNuevoGrpCul = false;
                    $scope.mListaGrpCul = true;
                }

                $scope.mostrarOperGrpCul = function () {
                    $scope.mNuevoGrpCul = true;
                    $scope.frmFormGrupCultivo.$setPristine();
                    $scope.mListaGrpCul = false;
                }
                $scope.mostrarListadoCul = function (){
                    $scope.mNuevoCultivo = false;
                    $scope.mListaCultivo = true;
                    $scope.mNombreCultivo = null;
                    $scope.mCodCultivo = null;
                    $scope.mAbrCultivo = null;
                }

                $scope.mostrarOperCultivo = function () {
                    $scope.mNuevoCultivo = true;
                    $scope.frmFormCultivo.$setPristine();
                    $scope.mListaCultivo = false;
                }


                $scope.volverListaCultivo = function () {
                    $scope.currentPage = 1;
                    $scope.currentPageCul = 1;
                    cargarGrpCulCampania();
                    $scope.mGrupCultSec = true;
                    $scope.mCultivoSec = false;
                }
                function recargarListGruCul(procesar) {                    
                    cargarGrpCulCampania();
                    if (procesar) {
                        $scope.limpiarBuscador();
                    }
                    $scope.mDescCultivo = "";                    
                    $scope.frmFormCultivo.$setPristine();
                }

                function recargarCultivo(procesar) {                    
                    cargarCultivo();
                    if (procesar) {
                        $scope.limpiarBuscador();
                    }
                    $scope.flagMostrarEditarCultivo = false;
                    $scope.mNombreCultivo = "";
                    $scope.mCodCultivo = "";
                    $scope.mAbrCultivo = "";
                    $scope.frmFormCultivo.$setPristine();
                    
                }
                $scope.searchResults = function () {

                    switch ($scope.mGrupCultSec) {
                        case true:
                            var valBuscar = $scope.mNombreGrpCulBuscar;
                            listaBusGrupCul = [];
                            if (typeof valBuscar !== "undefined" && valBuscar != "") {
                                listaGeneralGrpCul.forEach(function (value, key) {
                                    var nomb = value.descCultivo.toUpperCase();
                                    var busq = valBuscar.toUpperCase();
                                    if (nomb.includes(busq)) {
                                        listaBusGrupCul.push(value);
                                    }
                                });
                                listaGrupCult = listaBusGrupCul;
                                $scope.listaGrupCult = listaGrupCult;
                                setPagingDataGrpC(1);
                                $scope.totalRecords = $scope.listaGrupCult.length;
                                $scope.flagMostrarEditarCultivo = false;
                            }
                            break;
                        case false:
                            var valBuscar = $scope.mNombreCultivoBuscar;
                                listaBusquedaCultivo= [];
                            if (typeof valBuscar !== "undefined" && valBuscar != "") {
                                listaGeneralCultivo.forEach(function (value, key) {
                                    var abr = value.abrevCultivo.toUpperCase();
                                    var nomb = value.nombreCultivo.toUpperCase();
                                    var busq = valBuscar.toUpperCase();
                                    if (nomb.includes(busq)|| ( busq.includes(abr)&& abr) ) {
                                        listaBusquedaCultivo.push(value);
                                    }

                                });
                                listaCultivo = listaBusquedaCultivo;
                                $scope.listaCultivos = listaBusquedaCultivo;
                                $scope.totalRecordsCul = $scope.listaCultivos.length;
                            }
                            break;
                    }
                }

                $scope.limpiarBuscador = function () {
                    switch ($scope.mGrupCultSec) {
                        case true:
                            cargarGrpCulCampania();
                            $scope.mNombreGrpCulBuscar = "";
                        case false:
                            cargarCultivo();
                            $scope.mNombreCultivoBuscar = "";
                            break;
                    }
                }



            }]).
        component('tabGrupoCultivoCampania', {
            templateUrl: '/atencionsiniestrosagricola/app/campanias/components/tab/tab-grupocultivo-campania.html',
            controller: 'tabGrupoCultivoCampaniaController',
            bindings: {
                masters: '=?',
                reloadMasters: '&?'
            }
        })
});