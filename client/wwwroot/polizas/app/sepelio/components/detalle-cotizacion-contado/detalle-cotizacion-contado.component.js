define([
    'angular', 'constants', 'constantsSepelios'
], function (ng, constants, constantsSepelios) {
    detalleCotizacionController.$inject = ['$scope','$state','mModalAlert', 'campoSantoFactory', 'campoSantoService', '$uibModal', '$filter'];
    function detalleCotizacionController($scope,$state,mModalAlert, campoSantoFactory, campoSantoService, $uibModal, $filter) {
        var vm = this;
        vm.irBandejaPoliza = irBandejaPoliza;
        vm.descargarPDF = descargarPDF;
        vm.enviarCotizacion = enviarCotizacion;

        vm.detalleCotizacion = {};
        vm.btnEnviarCorreo;
        vm.$onInit = function () {
            vm.constantsCps = constantsSepelios;
            campoSantoService.getCotizacion(campoSantoFactory.getidCotizacion())
            .then(function (response) {
                vm.detalleCotizacion = response.Data;
                var ramos = {400:"Necesidad Inmediata", 401:"Necesidad Futura"};
                vm.detalleCotizacion.ramo = ramos[vm.detalleCotizacion.idRamo];
                vm.detalleCotizacion.edad = campoSantoFactory.calcularEdad(vm.detalleCotizacion.fechaNacimiento);
            })
        };

        $scope.$on('changingStep', function(ib,e){
            e.cancel = true;
          });

        function irBandejaPoliza() {
            $state.go(constantsSepelios.ROUTES.BANDEJA_COTIZACION, {}, { reload: true, inherit: false });
        }
        function descargarPDF() {
            campoSantoService.descargarCotizacionPDF(vm.detalleCotizacion.idCotizacion, vm.detalleCotizacion.numeroCotizacion);
        }
        function enviarCotizacion(detalleCotizacion) {
            $uibModal.open({
                backdrop: true, // background de fondo
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                result: true,
                size: 'md',
                templateUrl: 'app/sepelio/popup/controller/popupEnviarCotizacion.html',
                controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout', 'mModalConfirm',
                    function ($scope, $uibModalInstance, $uibModal, $timeout, mModalConfirm) {
                        $scope.model = {
                            email : vm.detalleCotizacion.correoElectronico
                        }
                        $scope.enviar = function () {
                            vm.cotizacion.datosCotizacion.emailSend = $scope.model.email
                            var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
                            if (emailRegex.test($scope.model.email)) {
                                var data = {
                                    "tipoCorreo": "C_RECIBIDO",
                                    "idTipoContrato": detalleCotizacion.idProducto,
                                    "nombreTipoContrato": detalleCotizacion.nombreProducto,
                                    "idCategoria": detalleCotizacion.idCategoria,
                                    "importe": detalleCotizacion.costoFinal,
                                    "idAgente": detalleCotizacion.idAgente,
                                    "nombreAgente": detalleCotizacion.nombreAgente,
                                    "comentario": null,
                                    "idRamo": 400,
                                    "idCampoSanto": detalleCotizacion.idCampoSanto,
                                    "emailusuario": String($scope.model.email).toLowerCase(),
                                    "idCotizacion": detalleCotizacion.idCotizacion
                                }
                                campoSantoService.enviarCorreoExepcional(data).then(function (response) {
                                    if (response.OperationCode === constants.operationCode.success) {
                                        mModalAlert.showSuccess("Cotización enviada con éxito", "")
                                        .then(function (r) {
                                            if (r) {
                                                $uibModalInstance.close();
                                            }
                                        });
                                    }else{
                                        mModalAlert.showWarning(response.Message, "")
                                    }
                                }).catch(function () {
                                    mModalAlert.showWarning("Error al enviar correo", "")
                                })
                            }
                            else {
                                mModalAlert.showWarning("Ingresar Correo Valido", "")
                            }
                        };
                        $scope.closeModal = function () {
                            $uibModalInstance.close();
                        };
                    }]
            });
        }
    } // end controller
    return ng.module('appSepelio')
        .controller('detalleCotizacionController', detalleCotizacionController)
        .component('cpsDetalleCotizacion', {
            templateUrl: '/polizas/app/sepelio/components/detalle-cotizacion-contado/detalle-cotizacion-contado.template.html',
            controller: 'detalleCotizacionController',
            bindings: {
                cotizacion: '=',
                form: '=?form',
            }
        })
});
