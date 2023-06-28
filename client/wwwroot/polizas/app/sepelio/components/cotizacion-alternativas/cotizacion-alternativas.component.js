define([
    'angular', 'constants', 'constantsSepelios'
], function (ng, constants, constantsSepelios) {
    cotizacionAlternativasController.$inject = ['$state', 'mModalAlert', 'campoSantoFactory', 'campoSantoService', 'mModalConfirm'];
    function cotizacionAlternativasController($state, mModalAlert, campoSantoFactory, campoSantoService, mModalConfirm) {
        var vm = this;
        vm.selectProducto = selectProducto;
        vm.getProducto = getProducto;
        vm.seleccionarCotizacion = seleccionarCotizacion;
        vm.isAmpliacion = isAmpliacion;
        vm.enviarCorreoExepcional = enviarCorreoExepcional;
        vm.validControlForm = validControlForm;
        vm._getModalidad = _getModalidad;
        //variables
        vm.combo = {
            camposanto: [],
            modalidad: [],
            tipoContrato: [],
            producto: [],
            cuotas : []
        }

        vm.dataAlternativas = [];
        vm.modelo = {};
        vm.inputProductoDisable = true;
        vm.inputCuotasDisable = true;
        vm.tipologiaFinanciamiento = [];
        vm.btnseleccionarDisable = true;
        vm.showContratoRelacionado = false;
        vm.dataCorreoExepcional = {};
        vm.dataGuardadoSolicitado = {};

        vm.$onInit = function () {
            vm.constantsCps = constantsSepelios;
            vm.dataAlternativas = campoSantoFactory.getdataAlternativas();
            vm.DataEvaluarAlternativas = campoSantoFactory.getDataEvaluarAlternativas();
            vm.dataSimulacion = campoSantoFactory.getdataDetalleSimulacion();
            vm.codRamo = campoSantoFactory.cotizacion.datosCotizacion.ramo;
            vm.modelo.contratoRelacionado = vm.cotizacion.datosCotizacion.contratoRelacionado;
            _getCampoSanto();
            _getTipoContrato();
            _TipologiaFinanciamiento();
            vm.dataCorreoExepcional = campoSantoFactory.getdataCorreoExepcional();
            vm.dataGuardadoSolicitado = campoSantoFactory.getdataProspecto()
        };
        function selectProducto(codigo) {
            if (codigo !== undefined){
                vm.inputDescuentoDisable = false;
                vm.inputCuotasDisable = false;
                var productofind = vm.dataAlternativas.find(function (x) {
                    return x.idProducto === codigo
                });
                var finaciamientofind = vm.tipologiaFinanciamiento.find(function (x) {
                    return x.Codigo === productofind.idTipoFinanciamiento
                });
                getCuotas();
                vm.inputCuotasDisable = false;
            }
        }

        function getProducto() {
            vm.combo.producto = [];
            if (vm.modelo.modalidad){
                if (vm.modelo.modalidad.Codigo && vm.modelo.tipoContrato.Codigo) {
                    var IdPrima = vm.modelo.cuotas ? vm.modelo.cuotas.IdPrima : 1;
                    vm.inputProductoDisable = false;
                    if (vm.codRamo == 401 && vm.modelo.tipoContrato.Codigo == "2") {
                        if (vm.modelo.contratoRelacionado) {
                            _getProducto(IdPrima);
                            vm.inputProductoDisable = false
                        }
                    }
                    else {
                        _getProducto(IdPrima)
                        vm.inputProductoDisable = false
                    }
                }
                else {
                    vm.inputProductoDisable = true;
                }
            }
        }

        function getCuotas() {
            vm.modelo.producto.Codigo ? (vm.inputCuotasDisable = false , _getCuotas()) :  vm.inputCuotasDisable = true;
        }

        function enviarCorreoExepcional() {

            campoSantoService.guardarOperacion(vm.dataGuardadoSolicitado, 2)
                .then(function (response) {
                    if (response.OperationCode === 200){
                        var data = {
                            tipoCorreo: "S_RECIBIDO",
                            idTipoContrato: vm.dataCorreoExepcional.tipoContrato.Codigo,
                            nombreTipoContrato: vm.dataCorreoExepcional.tipoContrato.Descripcion,
                            idCategoria: vm.dataCorreoExepcional.idCategoria,
                            importe: vm.dataCorreoExepcional.productoPrecio,
                            idAgente: parseInt(JSON.parse(window.localStorage.getItem("profile")).codagent),
                            nombreAgente: JSON.parse(window.localStorage.getItem("profile")).agent,
                            comentario: vm.modelo.comentario,
                            idRamo: 400,
                            idCampoSanto: vm.dataCorreoExepcional.camposanto,
                            emailusuario: null,
                            idCotizacion: response.Data.idCotizacion
                        }
                        campoSantoService.enviarCorreoExepcional(data).then(function (response) {
                            if (response.OperationCode === 200) {
                                mModalAlert.showSuccess("Petición o solicitud enviada con éxito", "")
                                    .then(function (r) {
                                        if (r) { $state.go(constantsSepelios.ROUTES.BANDEJA_COTIZACION, {}, { reload: true, inherit: false }); }
                                    })
                            }
                            else {
                                mModalAlert.showWarning(response.Message, "")
                            }
                        })
                            .catch(function () {
                                mModalAlert.showWarning("Error al enviar", "")
                            });
                    }else{
                        if (response.OperationCode === 900){
                            mModalAlert.showWarning(response.Data.Message || response.Data, "")
                        }else{
                            mModalAlert.showWarning(response.Message, "")
                        }
                    }
                })
                .catch(function () {
                    mModalAlert.showWarning("Error al enviar", "")
                })
        }

        function isAmpliacion() {
            if(vm.modelo.tipoContrato){
                vm.modelo.tipoContrato.Codigo == "2" && vm.codRamo == "401" ? vm.showContratoRelacionado = true : vm.showContratoRelacionado = false;
            }
        }
        
        function validControlForm(controlName) {
            return vm.frmAlternativas && campoSantoFactory.validControlForm(vm.frmAlternativas, controlName);
        }

        function seleccionarCotizacion() {
            vm.frmAlternativas.markAsPristine();
            if (vm.frmAlternativas.$valid) {
                campoSantoFactory.cotizacion.datosCotizacion.idTipoFinanciamiento = campoSantoFactory.getIDTipoFinanciamiento(vm.modelo.cuotas.NumeroCuota);
                vm.DataEvaluarAlternativas.idCampoSanto = vm.modelo.camposanto.Codigo;
                vm.DataEvaluarAlternativas.idModalidad = vm.modelo.modalidad.Codigo;
                vm.DataEvaluarAlternativas.idProducto = vm.modelo.producto.Codigo;
                vm.DataEvaluarAlternativas.idFraccionamiento = vm.modelo.cuotas.Codigo;
                vm.DataEvaluarAlternativas.idTipoProducto = vm.modelo.tipoContrato.Codigo;

                campoSantoService.generarEvelacuion(vm.DataEvaluarAlternativas).then(function (response) {
                    vm.dataSimulacion.camposanto = vm.modelo.camposanto;
                    vm.dataSimulacion.modalidad = vm.modelo.modalidad
                    vm.dataSimulacion.producto = vm.modelo.producto;
                    vm.dataSimulacion.tipoContrato = vm.modelo.tipoContrato;
                    vm.dataSimulacion.cuotas = vm.modelo.cuotas;
                    vm.dataSimulacion.auto = vm.DataEvaluarAlternativas.idAuto;
                    if (response.Califica === 1) {
                        mModalAlert.showSuccess("Cliente califica con éxito", "").then(function (r2) {
                            if (r2) {
                                vm.cotizacion.datosCotizacion.contratoRelacionado = vm.modelo.contratoRelacionado;
                                campoSantoFactory.setdataDetalleSimulacion(vm.dataSimulacion);
                                campoSantoFactory.setComponenteView('simulador-cotizacion');
                                $state.go(constantsSepelios.ROUTES.COTIZACION_STEPS, { step: 2 }, { reload: true, inherit: false });
                            }
                        });
                    }
                    else {
                        mModalAlert.showWarning(response.Data.Message || response.Data, "");
                    }
                });
            }
        }
        function _TipologiaFinanciamiento() {
            campoSantoService.getTipologiaFinanciamiento().then(function (response) {
                vm.tipologiaFinanciamiento = response.Data;
            });
        }
        function _getCampoSanto() {
            vm.combo.tipoContrato = [];
            vm.combo.modalidad = [];
            vm.combo.producto = [];
            vm.combo.cuotas = [];
            campoSantoService.getProxyCamposanto(vm.codRamo).then(function (response) {
                vm.combo.camposanto = response.Data;
                vm.combo.camposanto = vm.combo.camposanto.filter(function (x) {
                    return vm.dataAlternativas.find(function (z) {
                        return z.idCampoSanto == x.Codigo
                    })
                });
            });
        }
        function _getTipoContrato() {
            vm.combo.modalidad = [];
            vm.combo.producto = [];
            vm.combo.cuotas = [];
            campoSantoService.getProxyTipoContrato(vm.codRamo).then(function (response) {
                vm.combo.tipoContrato = response.Data;
                vm.combo.tipoContrato = vm.combo.tipoContrato.filter(function (x) {
                    return vm.dataAlternativas.find(function (z) {
                        return z.idTipoProducto == x.Codigo
                    })
                });
            });
        }
        function _getModalidad() {
            vm.combo.producto = [];
            vm.combo.cuotas = [];
            if (vm.modelo.tipoContrato !== undefined) {
                campoSantoService.getProxyModalidad(vm.codRamo,vm.modelo.tipoContrato.Codigo,vm.modelo.camposanto.Codigo).then(function (response) {
                    vm.combo.modalidad = response.Data;
                    vm.combo.modalidad = vm.combo.modalidad.filter(function (x) {
                        return vm.dataAlternativas.find(function (z) {
                            return z.idModalidad == x.Codigo
                        })
                    });
                });
            }
        }
        function _getProducto(IdPrima) {
            vm.combo.cuotas = [];
            campoSantoService.getProxyProducto(vm.codRamo, vm.modelo.modalidad.Codigo, vm.modelo.camposanto.Codigo, IdPrima, vm.modelo.tipoContrato.Codigo).then(function (response) {
                vm.combo.producto = angular.copy(response.Data);
                vm.combo.producto = vm.combo.producto.filter(function (x) {
                    return vm.dataAlternativas.find(function (z) {
                        return z.idProducto == x.Codigo
                    })
                });
            });
        }
        function _getCuotas() {
            campoSantoService.getFraccionamiento(vm.codRamo).then(function (response) {
                vm.combo.cuotas = response.Data;
                vm.combo.cuotas = vm.combo.cuotas.filter(function (x) {
                    return vm.dataAlternativas.find(function (z) {
                        return z.idFraccionamiento == x.Codigo && z.idProducto == vm.modelo.producto.Codigo
                    })
                });
            });
        }

        function _getFraccionamientoProducto401() {
            if(vm.codRamo=="401"){
                campoSantoService.getFraccionamientoProducto401(vm.modelo.modalidad.Codigo, vm.modelo.camposanto.Codigo, vm.modelo.producto.Codigo, vm.modelo.tipoContrato.Codigo).then(function (response) {
                    var Fraccionamiento401 = response.Data;
                    vm.combo.cuotas = vm.combo.cuotas.filter(function (x) {
                        return Fraccionamiento401.find(function (z) {
                            return z.Codigo == x.Codigo
                        })
                    });  
                })
            }
        }

    } // end controller mpfcotizacionAlternativas
    return ng.module('appSepelio')
        .controller('cotizacionAlternativasController', cotizacionAlternativasController)
        .component('cpsCotizacionAlternativas', {
            templateUrl: '/polizas/app/sepelio/components/cotizacion-alternativas/cotizacion-alternativas.template.html',
            controller: 'cotizacionAlternativasController',
            bindings: {
                cotizacion: '=',
                form: '=?form',
            }
        })
});
