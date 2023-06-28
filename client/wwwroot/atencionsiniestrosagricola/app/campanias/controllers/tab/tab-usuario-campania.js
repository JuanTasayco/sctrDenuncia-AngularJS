(function ($root, name, deps, action) {
    $root.define(name, deps, action)
})(window, 'tabUsuarioCampania', ['angular', 'mfpModalQuestion', '/atencionsiniestrosagricola/app/utilities/agricolaUtilities.js'], function (angular) {
    angular.module('atencionsiniestrosagricola.app').
        controller('tabUsuarioCampaniaController', ['$rootScope', '$scope', '$http', '$uibModal', 'mpSpin', 'mModalAlert', 'proxyCampania', 'proxyLookup','$timeout',
            function ($rootScope, $scope, $http, $uibModal, mpSpin, mModalAlert, proxyCampania, proxyLookup,$timeout) {
                var vm = this;
                //Usuario
                usuarioSistema = "";
                mTablListaUsuario = 0;

                //Codigo de campaña
                codigoCampania = 0;

                //Flags de opciones
                $scope.flagMostrarEditarUsuario = false;
                $scope.indexListaUsuario = 0;

                //Paginación y búsqueda

                $scope.maxSize = 10;
                $scope.sizePerPage = 10;
                $scope.currentPage = 1;
                $scope.totalRecords = 0;
                $scope.changePage = setPagingData;


                //Usuarios
                var listaBusquedaUsuarios = []; //Lista de búsqueda
                var listaUsuarios = []; //Lista que alimenta al listado en la vista
                var listaGeneralUsuarios = []; //Lista que almacena todos los registros

                $scope.cargaUsuarios = false;
                vm.$onInit = function () {
                    usuarioSistema = vm.masters.usuarioSistema;
                    codigoCampania = vm.masters.codigoCampania;
                    $scope.mListaUsuarios = true;
                    //Inicialización de arreglos
                    $scope.listaDepartamentos = [];

                }
                //Manejo de cargas por tab
                $rootScope.$watch('mTabCampania', function () {
                    cargarTabUsuario();
                }, true);

                function cargarTabUsuario() {
                    var tabActivo = $rootScope.mTabCampania;
                    if (tabActivo == 1) {
                        $scope.estadoRegistro = vm.masters.estadoRegistro;
                        cargarUsuariosCampania();
                    }
                }

                $scope.mostrarEditarUsuario = function (item,index) {
                    var flag = $scope.flagMostrarEditarUsuario;
                    $scope.mNombreUsuarioEdit = {};
                    vm.mDepartamentoUsuarioEdit = {}; 
                    $scope.mNombreUsuarioEdit[index] = item.nombreUsuario;
                    vm.mDepartamentoUsuarioEdit[index] = {};
                    vm.mDepartamentoUsuarioEdit[index].codigo = item.codigoDepartamento; 
                    if (flag) {
                        $scope.flagMostrarEditarUsuario = false;
                        if ($scope.indexListaUsuario != index) {
                            $scope.flagMostrarEditarUsuario = true;
                            $scope.indexListaUsuario = index;
                        }
                    } else {
                        $scope.flagMostrarEditarUsuario = true;
                        $scope.indexListaUsuario = index;
                    }
                }


                $scope.registrarUsuario = function (nombreUsuario, departamentoUsuario) {

                    var objUsuario = {
                        "nombreUsuario": nombreUsuario,
                        "codigoDepartamento": departamentoUsuario.codigo,
                        "usuarioRegistro": usuarioSistema
                    };
                    mpSpin.start('Guardando información, por favor espere...');
                    proxyCampania.InsertUsuarioCampania(codigoCampania,objUsuario)
                        .then(function (response) {
                            if (response.operationCode == 200) {
                                mpSpin.end();
                                if (response.data.codigo == 0) {
                                    mModalAlert.showSuccess("", "¡Se asignó el usuario!").then(function (response) {
                                        cargarUsuariosCampania();
                                        $scope.frmFormUsuario.$setPristine();
                                    });
                                } else {
                                    mModalAlert.showError("", response.data.descripcion);
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

                $scope.editarUsuario = function (codUnico, nombreUsuario, departamentoUsuario) {
                    var objUsuario = {
                        "nombreUsuario": nombreUsuario,
                        "codigoDepartamento": departamentoUsuario.codigo,
                        "usuarioModificacion": usuarioSistema,
                        "codUnico": codUnico
                    };
                    mpSpin.start('Guardando información, por favor espere...');
                    proxyCampania.editUsuarioCampania(codigoCampania,objUsuario)
                        .then(function (response) {
                            if (response.operationCode == 200) {
                                if (response.data.codigo == 0) {
                                    mModalAlert.showSuccess("", "¡Se actualizó la asignación!").then(function (response) {
                                        cargarUsuariosCampania();   
                                    });
                                    mpSpin.end();
                                } else {
                                    mModalAlert.showError("", response.data.descripcion);
                                    mpSpin.end();
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


                function setPagingData(page) {
                    var pagedData = listaUsuarios.slice(
                        (page - 1) * $scope.sizePerPage,
                        page * $scope.sizePerPage
                    );
                    $scope.listaUsuarios = pagedData;
                }

                $scope.eliminarUsuario = function (nombreUsuario, codDepartamento) {
                    $uibModal.open({
                        backdrop: 'static',
                        backdropClick: true,
                        dialogFade: false,
                        keyboard: false,
                        scope: $scope,
                        template: '<mfp-modal-question data="data"></mfp-modal-question>',
                        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                            $scope.closeModal = function () {
                                $uibModalInstance.close();
                            };
                            $scope.eliminarUsuario = function () {
                                mpSpin.start('Guardando información, por favor espere...');
                                $uibModalInstance.close();
                                proxyCampania.deleteUsuarioCampania(codigoCampania,nombreUsuario,codDepartamento)
                                .then(function (response) {
                                    if (response.operationCode == 200) {
                                        mpSpin.end();
                                        if (response.data.codigo == 0) {
                                            mModalAlert.showSuccess("", "¡Se eliminó el usuario!").then(function (response) {
                                                $scope.flagMostrarEditarUsuario = false;
                                                cargarUsuariosCampania();
                                            });
                                        } else {
                                            mModalAlert.showError("", response.data.descripcion);
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

                            },
                                $scope.data = {
                                    title: '¿Está seguro de eliminar el usuario?',
                                    subtitle: '',
                                    //buttonConfirm: 'Sí',
                                    //buttonNoConfirm: 'No'
                                    btns: [
                                        {
                                            lbl: 'No',
                                            accion: $scope.closeModal,
                                            clases: 'g-btn-transparent'
                                        },
                                        {
                                            lbl: 'Sí',
                                            accion: $scope.eliminarUsuario,
                                            clases: 'g-btn-verde'
                                        }
                                    ]
                                };
                        }]
                    });
                }
                function cargarUsuariosCampania() {
                    mpSpin.start('Cargando, por favor espere...');
                    proxyCampania.GetUsuariosCampania(codigoCampania).then(function (response) {
                        if (response.operationCode === 200) {
                            listaUsuarios = response.data;
                            $scope.listaUsuarios = listaUsuarios;

                            $scope.totalRecords = $scope.listaUsuarios.length;
                            $scope.currentPage = 1;
                            setPagingData($scope.currentPage);
                            listaGeneralUsuarios = listaUsuarios;
                            
                            cargarDepartamentos();
                            $scope.mostrarListado();
                            mpSpin.end();
                        } else {
                            mModalAlert.showWarning("Error al cargar los usuarios", "");
                        }
                    });
                }

                function cargarDepartamentos() {
                    var objFiltro = {
                        cmstro: "105",
                        prmtro1: codigoCampania,
                        prmtro2: "",
                        prmtro3: "",
                        prmtro4: ""
                    }
                        proxyLookup.GetFiltros(objFiltro).then(function (response) {
                            if (response.operationCode === 200) {                                
                                $scope.listaDepartamentos = response.data;
                            } else {
                                mModalAlert.showWarning("Error al cargar los departamentos", "");
                            }
                        });
                }
                $scope.mostrarOperacion = function () {
                    $scope.mNombreUsuario = "";
                    $scope.mDepartamentoUsuario = "";
                    $scope.mAsignacionUsuarios = true;
                    $scope.frmFormUsuario.$setPristine();
                    $scope.mListaUsuarios = false;
                }

                $scope.mostrarListado = function () {                    
                    $scope.mAsignacionUsuarios = false;
                    $scope.flagMostrarEditarUsuario = false;
                    $scope.mListaUsuarios = true;
                }

                $scope.searchResults = function () {
                    listaBusquedaUsuarios = [];
                    var valBuscar = $scope.mNombreUsuarioBuscar;
                    if (typeof valBuscar !== "undefined" && valBuscar != "") {
                        listaGeneralUsuarios.forEach(function (value, key) {
                            var nomb = value.nombreUsuario.toUpperCase();
                            var busq = valBuscar.toUpperCase();
                            var dep = value.nombreDepartamento.toUpperCase();

                            if (nomb.includes(busq) || dep.includes(busq)) {
                                listaBusquedaUsuarios.push(value);
                            }
                        });
                        listaUsuarios = listaBusquedaUsuarios;

                        $scope.listaUsuarios = listaBusquedaUsuarios;
                        setPagingData(1);
                        $scope.totalRecords = $scope.listaUsuarios.length;
                        $scope.flagMostrarEditarUsuario = false;
                    }
                }

                $scope.limpiarBuscador = function () {
                    cargarUsuariosCampania();
                    $scope.mNombreUsuarioBuscar = "";
                }
            }]).
        component('tabUsuarioCampania', {
            templateUrl: '/atencionsiniestrosagricola/app/campanias/components/tab/tab-usuario-campania.html',
            controller: 'tabUsuarioCampaniaController',
            bindings: {
                masters: '=?',
                reloadMasters: '&?'
            }
        })
});