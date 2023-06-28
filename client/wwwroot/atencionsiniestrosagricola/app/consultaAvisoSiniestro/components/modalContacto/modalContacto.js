(function ($root, name, deps, action) {
    $root.define(name, deps, action)
})(window, 'ModalContacto', ['angular', '/atencionsiniestrosagricola/app/utilities/agricolaUtilities.js'], function (angular) {
    angular.module('atencionsiniestrosagricola.app').
        controller('ModalContactoController', ['$rootScope', '$scope', 'mModalAlert', 'mpSpin', 'proxyLookup', 'proxyContacto',
            function ($rootScope, $scope, mModalAlert, mpSpin, proxyLookup, proxyContacto) {
                var vm = this;
                var usuario = "";
                vm.$onInit = function () {
                    cargarTipoDocumento();
                    usuario = $scope.$parent.usuario;
                }

                $scope.agregarContacto = function () {
                    var objContacto = {
                        "tipoDocumento": $scope.mTipoDocumento.codigo,
                        "numDocumento": $scope.mNumDocumento,
                        "nombre": $scope.mNombreContacto,
                        "apellido": $scope.mApellidoContacto,
                        "telefono": $scope.mTelefono,
                        "correo": $scope.mCorreo,
                        "usuarioRegistro": usuario,
                    };
                    mpSpin.start('Guardando información, por favor espere...');
                    proxyContacto.InsertContacto(objContacto)
                        .then(function (response) {
                            if (response.operationCode == 200) {
                                mpSpin.end();
                                if (response.data.codigo == 0) {
                                    mModalAlert.showSuccess("", "¡Se creó el contacto!").then(function (response) {
                                        $scope.closeModal();
                                        objContacto.nombre = objContacto.nombre +' ' +objContacto.apellido; 
                                        $rootScope.objContacto =  objContacto;       
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
                $scope.closeModal = function () {
                    $scope.$parent.closeModal();
                }

                function cargarTipoDocumento() {
                    var objFiltro = {
                        cmstro: "107",
                        prmtro1: "",
                        prmtro2: "",
                        prmtro3: "",
                        prmtro4: ""
                    }
                    mpSpin.start('Cargando, por favor espere...');
                    proxyLookup.GetFiltros(objFiltro).then(function (response) {
                        if (response.operationCode === 200) {
                            $scope.listaTipoDocumento = response.data;
                            mpSpin.end();
                        } else {
                            mModalAlert.showWarning("Error al cargar los Tipos de Documento", "");
                        }
                    });

                }

            }]).
        component('modalContacto', {
            templateUrl: '/atencionsiniestrosagricola/app/consultaAvisoSiniestro/components/modalContacto/modalContacto.html',
            controller: 'ModalContactoController',
            bindings: {
                masters: '=?',
                reloadMasters: '&?'
            }
        })
});