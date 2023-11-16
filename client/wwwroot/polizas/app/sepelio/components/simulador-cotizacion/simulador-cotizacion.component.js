define([
    'angular', 'constants', 'constantsSepelios', 'cpsformEmision'
], function (ng, constants, constantsSepelios, cpsformEmision) {
    simuladorCotizacionController.$inject = ['mModalAlert', 'campoSantoFactory', 'campoSantoService', 'mModalConfirm', '$state', '$scope', '$timeout'];
    function simuladorCotizacionController(mModalAlert, campoSantoFactory, campoSantoService, mModalConfirm, $state, $scope, $timeout) {
        var vm = this;
        vm.descuentoProducto = descuentoProducto;
        vm.simular = simular;
        vm.saveSimulacion = saveSimulacion;
        vm.importeInicialFixed = ImporteInicialFixed;

        vm.$onInit = function () {
            vm.constantsCps = constantsSepelios;

            $scope.$on('personForm', function (event, data) {
                if (data.contratante) {
                  $scope.contractorValid = data.valid;
                  $scope.personData = data.contratante;
                }
              });

            if(vm.cotizacion.datosCotizacion.producto){
                vm.cotizacion.datosCotizacion.producto.Precio = parseFloat(vm.cotizacion.datosCotizacion.producto.Precio).toFixed(2);

                vm.montoTotal = vm.cotizacion.datosCotizacion.producto.Precio;
                vm.cotizacion.simulador.importeInicial = vm.cotizacion.datosCotizacion.cuotaInicial;
                vm.cotizacion.simulador.descuento = vm.cotizacion.datosCotizacion.descuento;

            }else{
                if(vm.cotizacion.datosCotizacion.costoTotal){
                    vm.cotizacion.datosCotizacion.producto = {
                        Precio : vm.cotizacion.datosCotizacion.costoTotal
                    }

                    vm.cotizacion.simulador.importeInicial = vm.cotizacion.datosCotizacion.cuotaInicial;

                    vm.cotizacion.simulador.descuento = vm.cotizacion.datosCotizacion.descuento;

                }else if(vm.cotizacion.datosCotizacion.simulacion){
                    vm.cotizacion.datosCotizacion.producto = {
                        Precio : vm.cotizacion.datosCotizacion.simulacion
                    }
                }
                
            }

            
            vm.montoTotal = vm.cotizacion.datosCotizacion.producto.Precio;
            vm.person = vm.cotizacion.datosCotizacion.personData || campoSantoFactory.getDataCotizacion();   
            vm.descuentoProducto();

             if(vm.cotizacion.datosCotizacion.step > 1 ){
                vm.montoTotal =  vm.cotizacion.datosCotizacion.simulacion.precioProducto;
                vm.cotizacion.simulador.montoTotal = vm.montoTotal;
                vm.cotizacion.simulador.montoFinal = vm.montoTotal;

                if(vm.cotizacion.datosCotizacion.producto) {
                    vm.cotizacion.datosCotizacion.producto.Precio =  vm.cotizacion.datosCotizacion.simulacion.precioProducto;
                } else {
                    vm.cotizacion.datosCotizacion.producto = {
                        Precio: vm.cotizacion.datosCotizacion.simulacion.precioProducto
                    } 
                }
                 
                 vm.cotizacion.simulador.descuento = vm.cotizacion.datosCotizacion.simulacion.descuento;
                 vm.cotizacion.simulador.importeInicial = vm.cotizacion.datosCotizacion.simulacion.cuotaInicial;
                 vm.descuentoProducto();
                 vm.importeInicialFixed();
  
             }
            
        };

        $timeout(
            (function(){vm.simular()}), 1000
        )

        function descuentoProducto() {
            if (vm.cotizacion.simulador.descuento > 0) {
                vm.cotizacion.simulador.descuento = vm.cotizacion.simulador.descuento <= 100 ? vm.cotizacion.simulador.descuento : 100;
                vm.resSimulador = null;
                vm.cotizacion.simulador.montoTotal = (vm.montoTotal - (vm.cotizacion.simulador.descuento * vm.montoTotal) / 100).toFixed(2);
                validateMontoInicial();
            }
            else {
                validateMontoInicial();
                vm.cotizacion.simulador.montoTotal = vm.montoTotal;
            }
        }
        function ImporteInicialFixed() {
            if(vm.cotizacion.simulador.importeInicial>=0){
                vm.cotizacion.simulador.importeInicial = parseFloat(vm.cotizacion.simulador.importeInicial).toFixed(2);
            }
        }
        function validateMontoInicial() {
            if (vm.cotizacion.simulador.importeInicial>=0) {
                if (parseFloat(vm.cotizacion.simulador.importeInicial) > parseFloat(vm.cotizacion.simulador.montoTotal)) {
                    return vm.montoTopeCuotaInicial = true;
                } else {
                    vm.montoTopeCuotaInicial = false;
                    var montoFinal = parseFloat(vm.cotizacion.simulador.montoTotal) - parseFloat(vm.cotizacion.simulador.importeInicial);
                    vm.cotizacion.simulador.montoFinal = montoFinal.toFixed(2);
                }
            } else {
                vm.cotizacion.simulador.montoFinal = vm.montoTotal
            }
        }
        function simular() {
            vm.frmSimulador && vm.frmSimulador.markAsPristine()
            if (vm.frmSimulador && vm.frmSimulador.$valid && !vm.montoTopeCuotaInicial && vm.cotizacion.simulador.importeInicial>0 ||
                vm.cotizacion.datosCotizacion.step > 1 ) {
                vm.cotizacion.datosCotizacion.estadoCotizacion!=="APROBADO" ? vm.cotizacion.datosCotizacion.estadoCotizacion = "PROSPECTO" : "";

                campoSantoService.simulador(campoSantoFactory.modelSimuladacion()).then(function (response) {
                    
                    if (response.OperationCode === constants.operationCode.success) {
                        vm.resSimulador = response.Data;
                    }
                    else {
                        mModalAlert.showWarning(response.Message, "")
                    }
                })
                .catch(function (error) {
                });
            }
        }
        function cotizar() {
            if(vm.cotizacion.datosCotizacion.directo){
                vm.cotizacion.datosCotizacion.estadoCotizacion = "PRE-EMITIDO";
            } else{
                vm.cotizacion.datosCotizacion.estadoCotizacion = "COTIZADO";
            }
            mModalConfirm.confirmWarning("¿Esta seguro de cotizar el contrato?", 'ACEPTAR').then(function (confirm) {
                if (confirm) {


                    var evaluacion = campoSantoFactory.GetDataEvaluacion();
                    var requestSimulacion = angular.extend({}, campoSantoFactory.modelSimuladacion(), {
                        calificacion: evaluacion ? evaluacion.CalificacionCliente : ''
                    });

                    campoSantoService.guardarOperacion(requestSimulacion, 2).then(function (response) {
                        if (response.OperationCode === constants.operationCode.success) {
                            vm.cotizacion.datosCotizacion.idCotizacion = response.Data.idCotizacion;
                            if(vm.cotizacion.datosCotizacion.directo){
                                campoSantoFactory.setidCotizacion(response.Data.idCotizacion);
                                $state.go(constantsSepelios.ROUTES.REPOSITORIO_DOCUMENTOS, { reload: true, inherit: false });
                                return;
                            }
                            vm.cotizacion.step.view = "detalle-cotizacion-financiado";
                        } else {
                            if (response.OperationCode === 900){
                                mModalAlert.showWarning(response.Data.Message || response.Data, "")
                            }else{
                                mModalAlert.showWarning(response.Message, "")
                            }
                        }
                    }).catch(function (error){
                        mModalAlert.showError(error.data ? error.data.Data : error.Data, error.Message);
                    });
                }
            });
        }
        function saveSimulacion(validate) {
            if (!validate) {
                if (vm.cotizacion.datosCotizacion.estadoCotizacion!=='APROBADO'){
            vm.cotizacion.datosCotizacion.estadoCotizacion = "PROSPECTO";
                }

                var evaluacion = campoSantoFactory.GetDataEvaluacion();
                var requestSimulacion = angular.extend({}, campoSantoFactory.modelSimuladacion(), {
                    calificacion: evaluacion ? evaluacion.CalificacionCliente : ''
                });
                

            campoSantoService.guardarOperacion(requestSimulacion, 2).then(function (response) {
                if (response.OperationCode === constants.operationCode.success) {
                        mModalAlert.showSuccess("Se guardo correctamente", "Simulación Guardada").then(function (r2) {
                            vm.idCotizacion = response.Data.idCotizacion;
                            $state.go(constantsSepelios.ROUTES.BANDEJA_COTIZACION, {}, { reload: true, inherit: false });
                        })
                    } else {
                        if (response.OperationCode === 900){
                            mModalAlert.showWarning(response.Data.Message || response.Data, "")
                        }else{
                            mModalAlert.showWarning(response.Message, "")
                        }
                    }
                }).catch(function (error){
                    mModalAlert.showError(error.data ? error.data.Data : error.Data, error.Message);
                });
            } else {
                        cotizar();
                    }
        }
    } // end controller
    return ng.module('appSepelio')
        .controller('simuladorCotizacionController', simuladorCotizacionController)
        .component('cpsSimuladorCotizacion', {
            templateUrl: '/polizas/app/sepelio/components/simulador-cotizacion/simulador-cotizacion.template.html',
            controller: 'simuladorCotizacionController',
            bindings: {
                cotizacion: '=',
                form: '=?form',
            }
        })
});
