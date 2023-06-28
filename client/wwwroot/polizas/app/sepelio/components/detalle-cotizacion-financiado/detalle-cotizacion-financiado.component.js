define([
    'angular', 'constants', 'constantsSepelios', 'cpsformEmision'
], function (ng, constants, constantsSepelios, cpsformEmision) {
    detalleCotizacionFinanController.$inject = ['$scope', 'mModalAlert', 'campoSantoFactory', 'campoSantoService', 'mModalConfirm', '$uibModal', '$state', '$filter'];
    function detalleCotizacionFinanController($scope, mModalAlert, campoSantoFactory, campoSantoService, mModalConfirm, $uibModal, $state, $filter) {
        var vm = this;
        vm.enviarCotizacion = enviarCotizacion;
        vm.irBandejaPoliza = irBandejaPoliza
        vm.descargarPdf = descargarPdf
        vm.fnGetUltimoImporte =fnGetUltimoImporte
        vm.$onInit = function () {
            vm.constantsCps = constantsSepelios;
            getCotizacion();
        };
        $scope.$on('changingStep', function(ib,e){
            e.cancel = true;
          });
        function irBandejaPoliza() {
            $state.go(constantsSepelios.ROUTES.BANDEJA_COTIZACION, {}, { reload: true, inherit: false });
        }
        function enviarCotizacion() {
            $uibModal.open({
                backdrop: true, // background de fondo
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                scope: $scope,
                result: true,
                size: 'md',
                templateUrl: 'app/sepelio/popup/controller/popupEnviarCotizacion.html',
                controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout', 'mModalConfirm',
                    function ($scope, $uibModalInstance, $uibModal, $timeout, mModalConfirm) {
                        $scope.model = {
                            email : vm.detalle.correoElectronico
                        }
                        $scope.enviar = function () {
                            vm.cotizacion.datosCotizacion.emailSend = $scope.model.email
                            var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
                            if (emailRegex.test($scope.model.email)) {
                                campoSantoService.enviarCorreoExepcional(campoSantoFactory.sendEmailExepcional()).then(function (response) {
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
        function getCotizacion() {
            campoSantoService.getCotizacion(vm.cotizacion.datosCotizacion.idCotizacion)
            .then(function (response) {
                if (response.OperationCode === constants.operationCode.success) {
                vm.detalle = response.Data;
                var ramos = {400:"Necesidad Inmediata", 401:"Necesidad Futura"};
                vm.detalle.ramo = ramos[vm.detalle.idRamo];
                vm.detalle.edad = campoSantoFactory.calcularEdad(vm.detalle.fechaNacimiento);
                }
            })
        }
        function descargarPdf() {
            campoSantoService.descargarCotizacionPDF(vm.detalle.idCotizacion, vm.detalle.numeroCotizacion);
        }
        function fnGetUltimoImporte(detalle){
           return detalle.Recibos[1].importe;
        }
    } // end controller
    return ng.module('appSepelio')
        .controller('detalleCotizacionFinanController', detalleCotizacionFinanController)
        .component('cpsDetalleCotizacionFinan', {
            templateUrl: '/polizas/app/sepelio/components/detalle-cotizacion-financiado/detalle-cotizacion-financiado.template.html',
            controller: 'detalleCotizacionFinanController',
            bindings: {
                cotizacion: "="
            }
        })
});
