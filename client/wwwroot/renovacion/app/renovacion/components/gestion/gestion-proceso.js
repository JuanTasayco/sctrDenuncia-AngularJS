define([
    'angular', 'constants', 'lodash'
], function (angular, constants, _) {
    'use strict';

    angular
        .module('appReno')
        .controller('gestionProcesoController', GestionProcesoController);

    GestionProcesoController.$inject = ['$scope', '$state', 'renovacionBandejaService', 'oimPrincipal', 'mModalAlert', 'mModalConfirm', '$uibModal'];
    function GestionProcesoController($scope, $state, renovacionBandejaService, oimPrincipal, mModalAlert, mModalConfirm, $uibModal) {
        var vm = this;

        vm.polizaID = $state.params.polizaID
        vm.selectedTable = -1;
        vm.toggleTableRisk = ToggleTableRisk;
        vm.renovarPoliza = RenovarPoliza;
        vm.preRenovarPoliza = PreRenovarPoliza;
        vm.validarCliente = ValidarCliente;
        vm.clienteAlerta = [];
        vm.anularPoliza = AnularPoliza;
        vm.cambiarCombo = CambiarCombo;
        vm.cancelarAccion = CancelarAccion;
        vm.getParametros = GetParametros;
        vm.generarPdfPreRenovacion = GenerarPdfPreRenovacion;
        vm.actualizarSelect = ActualizarSelect;
        vm.generarPdf = GenerarPdf;
        vm.poliza = {};
        vm.editableValue = EditableValue;
        vm.formatValues = FormatValues;
        vm.getValues = GetValues;
        vm.suplementos = [];
        vm.suplemento = {};
        vm.comboUsoRiesgos = [];
        vm.comboModalidadRiesgos = [];
        vm.combopctComisionAgtRiesgos = [];
        vm.clienteValido = false;
        vm.getPoliza = GetPoliza;
        vm.endosatarios = [];
        vm.endosatariosReno = []
        vm.riesgos = [];
        vm.tipoProceso = '';
        vm.tipos_documentos = [];
        vm.copiaPoliza = [];
        vm.fracPago = [];
        vm.modalidad = [];
        vm.pctComisionAgt = [];
        vm.limiteUso = [];
        vm.copiaRiesgo = [];
        vm.camposDinamicosRiesgosRenovaciones = [];
        vm.camposDinamicosPolizaRenovaciones = [];
        vm.nuevoValoresPoliza = [];
        vm.nuevoValoresRiesgos = [];
        vm.usoVehiculo = [];
        vm.nUsoVehiculo = '';
        vm.pctComisionAGT = '';
        vm.camposDinamicosPoliza = [];
        vm.camposDinamicosRiesgos = [];
        vm.eliminarEndosatario = EliminarEndosatario;
        // vm.asignarValorRiesgo = AsignarValorRiesgo;
        vm.splitString = SplitString;
        vm.validarRUCDNI = ValidarRUCDNI;
        vm.documentoValido = false;
        vm.diasVencimiento = 0;
        vm.minMaxVal = 0;
        vm.polizaPorcentaje = 0;
        vm.alerts = [];
        vm.changeEndosatario = false;
        vm.formEnvioCorreo = {
            correos: []
        }
        vm.numIntentos=0;
        vm.correos = [];
        (function load_GestionProcesoController() {
            $scope.formParametro = $scope.formParametro || {};
            $scope.formEnvioCorreo = $scope.formEnvioCorreo || {};

            if (vm.polizaID) {
                vm.getPoliza(vm.polizaID)
            }
        })();


        function AssignPreventEvent(input, input2) {
            if (input)
                input.addEventListener('keypress', function (evt) {
                    var key = String.fromCharCode(evt.keyCode);
                    var importe_mapfre_dolar = document.getElementById('MCA_IMPORTE_MAPFRE_DOLAR')
                    var importe_ms_mapfre_dolar = document.getElementById('TOTAL_MAPFRE_DOLAR_USAR')


                    this.value = ''
                    if ((key !== 's' && key !== 'S' && key !== 'n' && key !== 'N') || evt.target.value.length > 0) {
                        evt.returnValue = false;
                        return false
                    } else {
                        if (input == importe_mapfre_dolar) {
                            DisableField(importe_ms_mapfre_dolar, key);
                        }

                        if (input2) {
                            DisableField(input2, key)
                        }
                    }

                })
        }

        function GetParametros() {
            renovacionBandejaService.obtenerParametros().then(function (response) {
                if (response) {
                    vm.tipos_documentos = response.parametros.filter(function (e) { return e.grupo === '001' });
                    vm.diasVencimiento = +response.parametros.filter(function (e) { return e.grupo === '006' })[0]['descripcion'];
                    vm.minMaxVal = response.parametros.filter(function (e) { return e.grupo === '009' });
                }

            }).catch(function () {
                console.error('errores')
                // mModalAlert.showWarning('Error general del sistema', 'ALERTA')
            });
        }
        $scope.showModalEndosatario = function (option, index, event) {
            $scope.message = false;
            $scope.usuarioNoExiste = false;
            $scope.formParametro.mRiesgo = void (0);
            $scope.formParametro.mtipoDocumento = '';
            $scope.formParametro.mNumeroDocumento = '';
            $scope.formParametro.mNombreEndosatario = '';
            $scope.formParametro.nroRiesgo = void (0);
            $scope.formParametro.tipDocumEndosatario = '';
            $scope.formParametro.endosatarios = [];
            $scope.formParametro.clienteValido = false;
            $scope.formParametro.materiaAsegurada = '';
            //Modal
            var vModal = $uibModal.open({
                backdrop: true, // background de fondo
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                windowTopClass: 'popup',
                templateUrl: '/renovacion/app/renovacion/views/modales/modal-endosatario.html',
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    //CloseModal
                    $scope.closeModal = function () {
                        $uibModalInstance.close();
                    };
                    $scope.tipos_documentos1 = vm.tipos_documentos
                    $scope.riesgos_generados = vm.riesgos[0].map(function (riesgo) {
                        return { codigo: riesgo.numRiesgo, descripcion: riesgo.nombreRiesgo }
                    })
                    $scope.cambioRiesgo = function (seleccion) {
                        $scope.formParametro.nroRiesgo = seleccion.codigo;
                        $scope.formParametro.materiaAsegurada = seleccion.descripcion;
                    }
                    $scope.guardarEndosatario = function () {
                        if(!vm.endosatariosReno.some(function (endosatario) {
                            return endosatario && endosatario.nroRiesgo == $scope.formParametro.nroRiesgo
                        })){

                            vm.endosatariosReno.push({
                                codDocumEndosatario: $scope.formParametro.mNumeroDocumento,
                                nroRiesgo: $scope.formParametro.nroRiesgo,
                                tipDocumEndosatario: $scope.formParametro.tipDocumEndosatario,
                                endosatario: $scope.formParametro.mNombreEndosatario,
                                nomEndosatario: $scope.formParametro.mNombreEndosatario,
                                fechaVencimientoCesion: null,
                                impCesion: null,
                                materiaAsegurada: $scope.formParametro.materiaAsegurada
                            })
                            
                            if(vm.poliza.codEstadoRenovacion == 'PRE_RNVD' && !vm.changeEndosatario){
                                vm.changeEndosatario = true;
                                mModalAlert.showWarning('Ha modificado el endosatario, ejecutar nuevamente la pre renovación', 'ALERTA');
                            }
                            $scope.closeModal();
                        } else {
                            mModalAlert.showWarning('Esta permitido solo un endosatario por riesgo', 'ALERTA');
                        }
                    }
                    $scope.cambioTipoDocumento = function (seleccion) {
                        $scope.formParametro.tipDocumEndosatario = seleccion.codigo
                        $scope.formParametro.mNombreEndosatario = ''
                    }


                    $scope.escribirValor = function (valor) {
                        if ($scope.formParametro.mtipoDocumento.codigo === 'DNI' && valor.length == 8) {
                            var bodyDocumento =
                            {
                                "tipoCombo": "bsqEndosatario",
                                "parametrosJson": JSON.stringify({ codCia: vm.copiaPoliza[0].poliza.producto.codCia, tipDocum: $scope.formParametro.mtipoDocumento.codigo, codDocum: valor })//
                            }
                            renovacionBandejaService.obtenerParametrosFiltrados(bodyDocumento).then(function (response) {
                                if (response.codError == null) {
                                    $scope.formParametro.clienteValido = true;
                                    $scope.formParametro.mNombreEndosatario = response.parametros[0].valor;
                                } else {
                                    $scope.formParametro.clienteValido = false
                                }
                            }).catch(function (error) {
                                console.error(error)
                                $scope.formParametro.clienteValido = false
                                mModalAlert.showWarning('Error general del sistema', 'ALERTA')
                            })
                        } else {
                            $scope.formParametro.mNombreEndosatario = '';
                            $scope.formParametro.clienteValido = false
                        }
                        if ($scope.formParametro.mtipoDocumento.codigo === 'RUC' && valor.length == 11) {
                            var bodyDocumento2 =
                            {
                                "tipoCombo": "bsqEndosatario",
                                "parametrosJson": JSON.stringify({ codCia: vm.copiaPoliza[0].poliza.producto.codCia, tipDocum: $scope.formParametro.mtipoDocumento.codigo, codDocum: valor })//
                            }
                            renovacionBandejaService.obtenerParametrosFiltrados(bodyDocumento2).then(function (response) {
                                if (response.codError == null) {
                                    $scope.formParametro.clienteValido = true;
                                    $scope.formParametro.mNombreEndosatario = response.parametros[0].valor;
                                } else {
                                    $scope.formParametro.clienteValido = false
                                }
                            }).catch(function (error) {
                                console.error(error)
                                $scope.formParametro.clienteValido = false
                                mModalAlert.showWarning('Error general del sistema', 'ALERTA')
                            })
                        } else {
                            $scope.formParametro.mNombreEndosatario = '';
                            $scope.formParametro.clienteValido = false
                        }

                    }
                }]
            });
        }
        $scope.showModalEnvioCorreo = function (option, index, event) {
            //Modal
            var vaModal = $uibModal.open({
                backdrop: true, // background de fondo
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                windowTopClass: 'popup',
                templateUrl: '/renovacion/app/renovacion/views/modales/modal-notificacion.html',
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    //CloseModal
                    $scope.closeModal = function () {
                        $uibModalInstance.close();
                    };
                    var emailRegex = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/i;
                    $scope.formEnvioCorreo = {
                        correo: '',
                        correos: []
                    };
                    vm.correos = []
                    $scope.enviarCorreo = function () {

                        if (vm.poliza.codEstadoRenovacion) {
                            var id = vm.polizaID
                            var body = {
                                "codAgt": vm.poliza.codAgente,
                                "codCia": vm.poliza.codCia,
                                "numApli": vm.poliza.numApli,
                                "numSpto": vm.copiaPoliza[option].poliza.numSptoOrigen,
                                "numSptoApli": vm.copiaPoliza[option].poliza.numSptoApli,
                                "numSptoOrigen": vm.copiaPoliza[option].poliza.numSptoOrigen,
                                "emails": vm.correos,
                                "numPoliza": id,
                                "usuario": vm.poliza.usuario,
                            }
                            if (vm.suplementos.length > 1 && vm.suplementos[1].poliza.tipoSuplemento == 'prerenovacion' && option == 1) {
                                var body2 = {
                                    "codCia": vm.poliza.codCia,
                                    "codRamo": vm.poliza.producto.codRamo,
                                    //"numSpto": vm.poliza.numSpto,
                                    "emails": vm.correos,
                                    "numPoliza": id,
                                    "usuario": vm.poliza.usuario,
                                    "fecEfecSpto": vm.suplementos[1].poliza.fecEfecPoliza,
                                    "fecVctoSpto": vm.suplementos[1].poliza.fecVctoPoliza
                                }
                                renovacionBandejaService.enviarCorreoPreRenovacion(body2, id).then(function (response) {
                                    $uibModalInstance.close();
                                    if(response.codError != 0 ){
                                        if(response.codError == 99 && response.descError == '99'){
                                            mModalAlert.showInfo('Correo enviado', 'OK')
                                        }else{
                                            mModalAlert.showWarning(response.descError, 'ALERTA')
                                        }
                                    }else{
                                            mModalAlert.showInfo('Correo enviado', 'OK')
                                    }
                                }).catch(function (error) {
                                    console.error(error)
                                    mModalAlert.showWarning('Error general del sistema', 'ALERTA')
                                })
                            } else {
                                renovacionBandejaService.enviarCorreoRenovacion(body, id).then(function (response) {
                                    $uibModalInstance.close();
                                    if(response.codError != 0 ){
                                        if(response.codError == 99 && response.descError == '99'){
                                            mModalAlert.showInfo('Correo enviado', 'OK')
                                        }else{
                                            mModalAlert.showWarning(response.descError, 'ALERTA')
                                        }
                                    }else{
                                            mModalAlert.showInfo('Correo enviado', 'OK')
                                    }
                                }).catch(function (error) {
                                    console.error(error)
                                    mModalAlert.showWarning('Error general del sistema', 'ALERTA')
                                })
                            }
                        }

                    }
                    $scope.agregarCorreo = function () {
                        
                        if(!emailRegex.test($scope.formEnvioCorreo.correo)){
                            mModalAlert.showWarning('Correo electronico invalido', 'ALERTA');
                        }else{
                            if ($scope.formEnvioCorreo.correos.length < 2) {
                                vm.correos.push(
                                    $scope.formEnvioCorreo.correo
                                )
                                $scope.formEnvioCorreo = {
                                    correos: vm.correos
                                }
                            } else {
                                mModalAlert.showWarning('Máximo dos correo para envio', 'ALERTA');
                            }
                        }
                        
                    }
                    $scope.eliminarcorreo = function (index) {
                        if (index > -1) {
                            vm.correos.splice(index, 1)
                            $scope.formEnvioCorreo = {
                                correos: vm.correos
                            }
                        }
                    }
                }]
            });
        }

        function ActualizarSelect(value, index) {
            if (value > 0) {
                vm.copiaRiesgo[0][index].codUsoVehiculo = value.codigo
            }

        }
        function ToggleTableRisk(riesgo) {
            riesgo.isOpen = !riesgo.isOpen;

            // vm.selectedTable = parseInt(tableNumber);
            vm.copiaRiesgo[0].forEach(function (riesgo, index) {
                setTimeout(function () {
                    var gps = document.getElementById(index + '-MCA_GPS');
                    var vehNuevo = document.getElementById(index + '-MCA_VEH_NUEVO');
                    var mcaEndoso = document.getElementById(index + '-MCA_ENDOSO');
                    var dsctEspe = document.getElementById(index + '-USO_DSCT_ESPE');
                    var anioVehi = document.getElementById(index + '-ANIO_SUB_MODELO');
                    var valueVehi = document.getElementById(index + '-VAL_SUB_MODELO');
                    var dsct_maximo = document.getElementById(index + '-PCT_DSCTO_COMERCIAL_ESPECIAL');
                    var pctAgente = document.getElementById(index + '-PCT_COMISION_AGT');
                    if (vm.minMaxVal && valueVehi) {
                        var maxVal = (parseInt(riesgo.valSubModelo) * (vm.minMaxVal[1].descripcion)) / 100 + parseInt(riesgo.valSubModelo);
                        var minVal = parseInt(riesgo.valSubModelo) - (parseInt(riesgo.valSubModelo) * (+vm.minMaxVal[0].descripcion)) / 100;
                        MaxMinValueRiesgo(valueVehi,maxVal,minVal,'blur')
                    }

                    if (riesgo.usoDsctEspe === 'N' || riesgo.usoDsctEspe == null) {
                        DisableField(pctAgente, riesgo.usoDsctEspe)
                    }

                    if (dsct_maximo) {
                        var maxDescuentoEspecial = parseFloat(vm.polizaPorcentaje) + parseFloat(riesgo.pctDsctoComercialEspecial);
                        if (maxDescuentoEspecial < 0) {
                            MaxMinValueRiesgo(dsct_maximo,0,maxDescuentoEspecial,'input')

                        } else {
                            MaxMinValueRiesgo(dsct_maximo,maxDescuentoEspecial,0,'input')
                        }
                    }
                    JustNumbers(anioVehi);
                    JustNumbers(dsct_maximo);
                    MaxMinValueRiesgo(anioVehi, new Date().getFullYear(), 0,'input')
                    AssignPreventEvent(gps);
                    AssignPreventEvent(vehNuevo);
                    AssignPreventEvent(mcaEndoso);
                    AssignPreventEvent(dsctEspe, pctAgente);
                }, 1000)
            })

        }

        function downloadPDF(pdf) {
            var linkSource = 'data:application/pdf;base64,' + pdf;
            var downloadLink = document.createElement("a");
            var fileName = 'poliza-' + vm.poliza.numPoliza + '.pdf';
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
        }

        function GenerarPdf(index) {
            var id = parseInt(vm.poliza.numPoliza)
            var body = {
                codAgt: vm.poliza.codigoAgente,
                codCia: vm.poliza.codCia,
                numApli: vm.poliza.numApli,
                numPoliza: vm.poliza.numPoliza,
                numSpto: vm.copiaPoliza[index].poliza.numSptoOrigen,
                numSptoApli: vm.copiaPoliza[index].poliza.numSptoApli,
                numSptoOrigen: vm.copiaPoliza[index].poliza.numSptoOrigen,
                tipoImpresion: "P"

            }
            
            renovacionBandejaService.generarPdf(body, id).then(function (response) {
                if (response && response.codError == 0) {
                    downloadPDF(response.documento)
                } else {
                    mModalAlert.showWarning(response.descError, 'ALERTA');
                }
            }).catch(function (error) {
                console.error(error)
                mModalAlert.showWarning('Error general del sistema', 'ALERTA')
            })
        }

        function SplitString(value, index) {
            return _splitStrings(value, index)
        }

        function _splitStrings(value, index) {
            if (value) {
                return value.split('|')[index];
            } else {
                return ''
            }

        }

        function GenerarPdfPreRenovacion(polizaPrerenovada) {

            var id = parseInt(vm.poliza.numPoliza)
            var body = {
                "codRamo": vm.poliza.producto.codRamo,
                "codCia": vm.poliza.codCia,
                "numPoliza": vm.poliza.numPoliza,
                "fecEfecSpto": polizaPrerenovada.fecEfecPoliza,
                "fecVctoSpto": polizaPrerenovada.fecVctoPoliza

            }
            renovacionBandejaService.generarPdfPreRenovacion(body, id).then(function (response) {
                if (response && response.codError == 0) {
                    downloadPDF(response.documento)
                } else {
                    mModalAlert.showWarning(response.descError, 'ALERTA');
                }
            }).catch(function (error) {
                console.error(error)
                mModalAlert.showWarning('Error general del sistema', 'ALERTA')
            })
        }

        function EliminarEndosatario(seleccion, index) {
            mModalConfirm.confirmWarning('', '¿Esta seguro que desea eliminar el endosatario', 'Si', 'No')
                .then(function (response) {

                    if (vm.endosatariosReno[index] && seleccion) {
                        if (vm.endosatariosReno[index].nroRiesgo == seleccion.nroRiesgo) {
                            vm.endosatariosReno.splice(index, 1);
                        }
                    } else {
                        vm.endosatariosReno.splice(index, 1)
                    }
                    if(vm.poliza.codEstadoRenovacion == 'PRE_RNVD' && !vm.changeEndosatario){
                        vm.changeEndosatario = true;
                        mModalAlert.showWarning('Ha modificado el endosatario, ejecutar nuevamente la pre renovación', 'ALERTA');
                    }
                }, function (response) {
                    return false;
                });
        }

        function CancelarAccion(type) {
            // console.log(type)
            if (type) {
                mModalConfirm.confirmWarning('', '¿Esta seguro que desea salir del proceso de ' + type + '?', 'Si', 'No')
                    .then(function (response) {
                        window.location.href = '/renovacion/'
                    }, function (response) {
                        return false;
                    });
            } else {
                mModalConfirm.confirmWarning('', '¿Esta seguro que desea salir del proceso de ' + type + '?', 'Si', 'No')
                    .then(function (response) {
                        window.location.href = '/renovacion/'
                    }, function (response) {
                        return false;
                    });
            }
        }

        function EditableValue() {
            if (vm.poliza.codEstadoRenovacion == 'PDE_RNV' || vm.poliza.codEstadoRenovacion == 'PRE_RNVD') {
                return true;
            } else {
                return false;
            }

        }

        function GetValues(value, type) {
            if (type == 1) {
                return _.cloneDeep(vm.poliza[value]);
            } else if (type == 2) {
                return _.cloneDeep(vm.copiaPoliza[1].poliza[value]);
            } else {
                return ''
            }
        }




        function FormatValues(value) {
            if (value) {
                return JSON.parse(JSON.stringify(value.toLowerCase().split('_').map(function (capital, index) {
                    if (index > 0) {
                        return capital.charAt(0).toUpperCase() + capital.slice(1);
                    } else {
                        return capital
                    }
                }).join('')));
            }


        }

        function iterarDeepObject(object) {
            Object.keys(object).forEach(function (key) {
                if (object[key] !== null && typeof object[key] === 'object') {
                    iterarDeepObject(object[key]);
                    return
                }
                object[key] = null
            })

        }

        function GetPoliza(id) {

            renovacionBandejaService.obtenerPolizaId(id).then(function (response) {
                if (response) {
                    vm.changeEndosatario = false;
                    vm.suplementos = response.suplementos;
                    vm.poliza = response.suplementos[0].poliza;
                    var suplemento_2 = response.suplementos[1];
                    if (suplemento_2 && suplemento_2.poliza.codEstadoRenovacion == 'RENOVADA') {
                        vm.poliza = response.suplementos[1].poliza;
                        // vm.poliza.codEstadoPoliza = vm.suplementos[0].poliza.codEstadoRenovacion;
                        // vm.poliza.estadoPoliza = vm.suplementos[0].poliza.estadoPoliza;
                        // vm.poliza.codEstadoRenovacion = vm.suplementos[0].poliza.codEstadoRenovacion;
                    }
                    vm.copiaPoliza = JSON.parse(JSON.stringify(response.suplementos));
                    vm.camposDinamicosPoliza = response.suplementos[0].poliza.camposDinamicos.sort(function (a, b) {
                        return a.numSecu - b.numSecu || ((a.codCampo < b.codCampo) ? -1 : (a.codCampo > b.codCampo) ? 1 :0);
                    });

                    vm.nuevoValoresPoliza = JSON.parse(JSON.stringify(response.suplementos[0]));
                    iterarDeepObject(vm.nuevoValoresPoliza)
                    
                    if (response.suplementos.length > 1) {
                        vm.camposDinamicosPolizaRenovaciones = response.suplementos[1].poliza.camposDinamicos.sort(function (a, b) {
                            return a.numSecu - b.numSecu || ((a.codCampo < b.codCampo) ? -1 : (a.codCampo > b.codCampo) ? 1 :0);
                        });
                        vm.camposDinamicosRiesgosRenovaciones = [];
                        response.suplementos[0].riesgos.map(function(riesgo) {
                            var item = response.suplementos[1].riesgos.find(function (riesgo_b){
                                return riesgo_b.numRiesgo == riesgo.numRiesgo;
                            })
                            if(item){
                                item.camposDinamicos.sort(function (a,b){
                                    return a.numSecu - b.numSecu
                                })
                                vm.camposDinamicosRiesgosRenovaciones.push(item.camposDinamicos);
                            }
                            if(vm.camposDinamicosRiesgosRenovaciones.length>0){
                                if(vm.poliza.codEstadoRenovacion == 'PRE_RNVD'){
                                    vm.camposDinamicosRiesgosRenovaciones.map(function(camposriesgo){
                                        return camposriesgo.map(function(campoDinamico){
                                            if(campoDinamico.codCampo == "PCT_DTO_COMERCIAL"){
                                                var campoDinamico1 = camposriesgo.filter(function(valor){
                                                    return valor.codCampo == 'PCT_DSCTO_COMERCIAL_ESPECIAL' ||
                                                    valor.codCampo == 'PCT_DSCTO_ESPECIAL' ||
                                                    valor.codCampo == 'PCT_DSCTO_SCORE';
                                                });
    
                                                var sum = 0;
                                                campoDinamico1.map(function(a){
                                                    var valor = a.txtCampo? parseFloat(a.txtCampo): 0;
                                                    sum = sum + valor
                                                });
                                                campoDinamico.txtCampo = sum;
                                                campoDinamico.valCampo = sum;
                                            }
                                        })
                                    });
                                }
                            }
                            
                        })
                    }


                    vm.riesgos = JSON.parse(JSON.stringify(response.suplementos.map(function (suplemento) {
                        return suplemento.riesgos;
                    })))
                    vm.copiaRiesgo = JSON.parse(JSON.stringify(response.suplementos.map(function (suplemento) {
                        return suplemento.riesgos.map(function (riesgo) {
                            for (var element in riesgo) {
                                riesgo.camposDinamicos.forEach(function (campo) {
                                    if (vm.formatValues(campo.codCampo) == element) {
                                        riesgo[element] = campo.valCampo;
                                    }
                                    if (campo.codCampo == 'COD_USO_VEHI') {
                                        riesgo['codUsoVehiculo'] = campo.valCampo
                                    }

                                    if (campo.codCampo == 'NUM_MATRICULA') {
                                        riesgo['numPlacaVehiculo'] = campo.valCampo
                                    }
                                    if (campo.codCampo == 'NUM_SERIE') {
                                        riesgo['numSerieVehiculo'] = campo.valCampo
                                    }
                                    if (campo.codCampo == 'NUM_MOTOR') {
                                        riesgo['numMotorVehiculo'] = campo.valCampo
                                    }
                                    if (campo.codCampo == 'MCA_VEH_NUEVO') {
                                        riesgo['mcaNuevoVehiculo'] = campo.valCampo
                                    }
                                    if (campo.codCampo == 'PCT_DSCTO_ESPECIAL') {
                                        riesgo['pctDsctoEspecial'] = campo.valCampo ? campo.valCampo : null
                                    }
                                    if (campo.codCampo == 'PCT_COMISION_AGT') {
                                        riesgo['pctComisAgt'] = campo.valCampo
                                    }
                                    if (campo.codCampo == 'LIM_RC_AUSENCIA_CONTROL') {
                                        riesgo['limRcAuscControl'] = campo.valCampo
                                    }
                                })

                            }
                            return riesgo
                        });
                    })))
                    if (vm.riesgos[0] && vm.riesgos[0].length> 0) {
                        vm.camposDinamicosRiesgos = response.suplementos[0].riesgos.map(function (riesgo) {
                            return riesgo.camposDinamicos.sort(function (a, b) {
                                return a.numSecu - b.numSecu;
                            });
                        });

                    }


                    vm.endosatariosReno = response.suplementos.map(function (suplemento) {
                        return suplemento.riesgos.map(function (riesgo) {
                            return riesgo.endosatario;
                        });
                    })[0].filter(function (endosatario) {
                        if (endosatario) {
                            return endosatario
                        }
                    });
                    if (response.suplementos.length > 1) {
                        vm.suplemento = response.suplementos[1].poliza
                        vm.endosatarios = response.suplementos.map(function (suplemento) {
                            return suplemento.riesgos.map(function (riesgo) {
                                return riesgo.endosatario;
                            });
                        })[0].filter(function (endosatario) {
                            if (endosatario) {
                                return endosatario
                            }
                        });
                        vm.endosatariosReno = response.suplementos.map(function (suplemento) {
                            return suplemento.riesgos.map(function (riesgo) {
                                return riesgo.endosatario;
                            });

                        })[1].filter(function (endosatario) {
                            if (endosatario) {
                                return endosatario
                            }
                        });
                    }

                    var body = {
                        cliente: {
                            "tipDocum": response.suplementos[0].poliza.tipoDocCliente,
                            "codDocum": response.suplementos[0].poliza.numDocCliente
                        },
                        listaValidacion: [
                            "CF",
                            "CP",
                            "CI",
                            "CO",
                            "MO",
                            "DE"
                        ]
                    }
                    vm.validarCliente(body);
                    vm.getParametros();
                    if (vm.riesgos[0] && vm.riesgos[0].length > 0) {
                        vm.riesgos[0].forEach(function (riesgo, index) {
                            riesgo.isOpen = false;
                            if (riesgo.codTipVehi) {
                                ObtenerCombos(
                                    {
                                        "tipoCombo": "usoVehiculo",
                                        "parametrosJson": JSON.stringify({ codCia: response.suplementos[0].poliza.producto.codCia, codRamo: response.suplementos[0].poliza.producto.codRamo, codTipoVehiculo: _splitStrings(riesgo.codTipVehi, 0) })//
                                    }
                                ).then(function (response) {
                                    if (response) {
                                        vm.usoVehiculo = response
                                        vm.comboUsoRiesgos[index] = response
                                    }
                                })
                            } else {
                                vm.comboUsoRiesgos[index] = []
                            }

                            if (riesgo.codTipVehi && riesgo.codUsoVehiculo) {
                                ObtenerCombos(
                                    {
                                        "tipoCombo": "modalidad",
                                        "parametrosJson": JSON.stringify({ codCia: response.suplementos[0].poliza.producto.codCia, codRamo: response.suplementos[0].poliza.producto.codRamo, codTipoVehiculo: _splitStrings(riesgo.codTipVehi, 0), codUsoVehiculo: _splitStrings(riesgo.codUsoVehiculo, 0) })//
                                    }
                                ).then(function (response) {
                                    if (response) {
                                        vm.comboModalidadRiesgos[index] = response
                                    }
                                })
                            } else {
                                vm.comboModalidadRiesgos[index] = []
                            }

                            if (riesgo.codTipVehi && riesgo.codUsoVehiculo && riesgo.codModalidad) {
                                ObtenerCombos(
                                    {
                                        "tipoCombo": "pctComisionAgt",
                                        "parametrosJson": JSON.stringify({ codCia: response.suplementos[0].poliza.producto.codCia, codRamo: response.suplementos[0].poliza.producto.codRamo, codTipoVehiculo: _splitStrings(riesgo.codTipVehi, 0), codUsoVehiculo: _splitStrings(riesgo.codUsoVehiculo, 0), codMoneda: response.suplementos[0].poliza.moneda.codMon, codAgente: response.suplementos[0].poliza.codAgente })//
                                    }
                                ).then(function (response) {
                                    if (response) {
                                        vm.combopctComisionAgtRiesgos[index] = response
                                        /* response.map(function (element) {
                                            return { first: _splitStrings(element.codigo, 0), second: _splitStrings(element.codigo, 1), third: _splitStrings(element.codigo, 2) }
                                        })*/
                                    }
                                })
                            } else {
                                vm.combopctComisionAgtRiesgos[index] = []
                            }

                            if (riesgo.codTipVehi && riesgo.codUsoVehiculo && riesgo.codModalidad) {
                                ObtenerCombos(
                                    {
                                        "tipoCombo": "limRcAuscControl",
                                        "parametrosJson": JSON.stringify({ codCia: response.suplementos[0].poliza.producto.codCia, codRamo: response.suplementos[0].poliza.producto.codRamo })//
                                    }
                                ).then(function (response) {
                                    if (response) {
                                        vm.limiteUso[index] = response
                                    }
                                })
                            } else {
                                vm.limiteUso[index] = []
                            }

                            ObtenerCombos({
                                "tipoCombo": 'maxPctjeEspecial',
                                "parametrosJson": JSON.stringify({
                                    codCia: response.suplementos[0].poliza.producto.codCia,
                                    numPoliza: response.suplementos[0].poliza.numPoliza,
                                    codRamo: response.suplementos[0].poliza.producto.codRamo,
                                    numRiesgo: riesgo.numRiesgo
                                })
                            }).then(function (response) {
                                if (response && response.length > 0) {
                                    vm.polizaPorcentaje = response[0].valor;
                                }
                            })



                        })
                    }


                    ObtenerCombos(
                        {
                            "tipoCombo": "fracPago",
                            "parametrosJson": JSON.stringify({ codRamo: response.suplementos[0].poliza.producto.codRamo })//
                        }
                    ).then(function (response) {
                        if (response) {
                            vm.fracPago = response
                        }
                    });


                    if (response.suplementos[0].riesgos[0] && response.suplementos[0].riesgos[0].codUsoVehiculo) {
                        vm.nUsoVehiculo = _splitStrings(response.suplementos[0].riesgos[0].codUsoVehiculo, 0)
                    }

                    var importemapfredolar = vm.camposDinamicosPoliza.filter(function (campo) {
                        return campo.codCampo === 'MCA_IMPORTE_MAPFRE_DOLAR'
                    })[0]

                    var importeMapfreDolarMaximo = vm.camposDinamicosPoliza.filter(function (campo) {
                        return campo.codCampo === 'IMP_SALDO_MAPFRE_DOLAR'
                    })[0]

                    setTimeout(function () {
                        var importe_mapfre_dolar = document.getElementById('MCA_IMPORTE_MAPFRE_DOLAR')
                        var importe_ms_mapfre_dolar = document.getElementById('TOTAL_MAPFRE_DOLAR_USAR')
                        var impo_cuota_inicial = document.getElementById('IMP_CUOTA_INICIAL')

                        if (importe_mapfre_dolar) {
                            AssignPreventEvent(importe_mapfre_dolar);
                        }

                        if (importe_ms_mapfre_dolar) {
                            // console.log('importe maximo dolar', importeMapfreDolarMaximo)
                            //Maxvalue(importe_ms_mapfre_dolar, vm.poliza.impSaldoMapfreDolar, 0);
                            Maxvalue(importe_ms_mapfre_dolar, importeMapfreDolarMaximo.valCampo, 0);
                            JustNumbers(importe_ms_mapfre_dolar);
                            if (importemapfredolar.valCampo == 'N' || importemapfredolar.valCampo == null) {
                                DisableField(importe_ms_mapfre_dolar, importemapfredolar.valCampo);
                            }
                        }
                        if (impo_cuota_inicial && vm.suplementos.length > 1) {
                            JustNumbers(impo_cuota_inicial);
                            Maxvalue(impo_cuota_inicial, vm.suplementos[1].poliza.impRecibos, 0);
                        } else {
                            JustNumbers(impo_cuota_inicial);
                            Maxvalue(impo_cuota_inicial, 0, 0);
                        }

                    }, 1000)
                    vm.numIntentos=0;
                }
            }).catch(function (error) {
                vm.numIntentos++;
                if(vm.numIntentos < 3){
                    vm.getPoliza(id)
                }else{
                    console.error(error)
                    mModalAlert.showError('Error al obtener la póliza', '¡Error!');
                    vm.numIntentos=0;
                }
            })
        }

        function CambiarCombo(e, type,index) {
            
            if (type == 'Modalidad') {
                vm.copiaRiesgo[0][index].codModalidadDsct = e
                if (vm.copiaRiesgo.length > 1) {
                    vm.copiaRiesgo[1][index].codModalidadDsct = e
                }
            }
            if (type == 'PCT_COMISION_AGT') {
                vm.copiaRiesgo[0][index].pctComisAgt = _splitStrings(e, 0)

                vm.copiaRiesgo[0][index].pctAgtComisRenov = _splitStrings(e, 1)

                vm.copiaRiesgo[0][index].pctDsctoComercial = _splitStrings(e, 2)
                if (vm.copiaRiesgo.length > 1) {
                    vm.copiaRiesgo[1][index].pctComisAgt = _splitStrings(e, 0)

                    vm.copiaRiesgo[1][index].pctAgtComisRenov = _splitStrings(e, 1)

                    vm.copiaRiesgo[1][index].pctDsctoComercial = _splitStrings(e, 2)
                }
                
            }
        }


        function AnularPoliza() {
            mModalConfirm.confirmWarning('', '¿Esta seguro que desea anular la póliza', 'Si', 'No')
                .then(function (response) {
                    var body = {
                        poliza: {
                            codCia: vm.poliza.producto.codCia,
                            numPoliza: vm.poliza.numPoliza
                        }
                    }
                    var id = parseInt(vm.poliza.numPoliza)
                    renovacionBandejaService.procesoAnular(body, id).then(function (response) {
                        if (response.codError == 0) {
                            vm.getPoliza(vm.polizaID)
                        } else {
                            if(response.error.length > 0){
                                var errores = response.error.map(function (error) {
                                    return error.descErrorBatch
                                }).join('<br>')
                                mModalAlert.showError(errores, response.descError);
                            }else{
                                mModalAlert.showError("", response.descError);
                            }
                            
                        }
                    }).catch(function (error) {
                        console.error(error)
                        mModalAlert.showError('Error al anular la póliza', '¡Error!')
                    })
                }, function (response) {
                    return false;
                });
        }

        function RenovarPoliza() {
            mModalConfirm.confirmWarning('', '¿Esta seguro que renovar la póliza', 'Si', 'No')
                .then(function (response) {
                    var fullbody = {
                        poliza: {
                            numPoliza: vm.copiaPoliza[0].poliza.numPoliza,
                        },
                        producto: {
                            codCia: vm.copiaPoliza[0].poliza.producto.codCia,
                            codRamo: vm.copiaPoliza[0].poliza.producto.codRamo,
                        },
                    }

                    var id = parseInt(vm.poliza.numPoliza)
                    renovacionBandejaService.procesoRenovar(fullbody, id).then(function (response) {
                        if (response.codError == 0) {
                            vm.getPoliza(vm.polizaID)
                        } else {
                            if (response.codError == 6) {
                                vm.getPoliza(vm.polizaID)
                                mModalAlert.showWarning("", response.descError);
                            }
                            if(response.error.length > 0){
                                var errores = response.error.map(function (error) {
                                    return error.descErrorBatch
                                }).join('<br>')
                                mModalAlert.showError(errores, response.descError);
                            }
                            else{
                                mModalAlert.showError("",response.descError);
                            }
                        }
                    }).catch(function (error) {
                        console.error(error)
                        mModalAlert.showError('Error al renovar la póliza', '¡Error!')
                    })
                }, function (response) {
                    return false;
                });

        }

        function PreRenovarPoliza() {
            // console.log(vm.nuevoValoresPoliza.poliza);
            mModalConfirm.confirmWarning('', '¿Esta seguro que desea Prerenovar la póliza', 'Si', 'No')
                .then(function (response) {
                    var fullbody = {}

                    if (vm.suplementos.length == 1) {
                        console.log(vm.nuevoValoresPoliza);
                        fullbody = {
                            poliza: {
                                abrevOficina: vm.nuevoValoresPoliza.poliza.abrevOficina,
                                codCia: vm.copiaPoliza[0].poliza.codCia,
                                codEstadoPoliza: vm.nuevoValoresPoliza.poliza.codEstadoPoliza,
                                codEstadoRenovacion: vm.nuevoValoresPoliza.poliza.codEstadoRenovacion,
                                codigoAgente: vm.nuevoValoresPoliza.poliza.codigoAgente,
                                conceptosDesglose: {
                                    impBoni: vm.nuevoValoresPoliza.poliza.conceptosDesglose.impBoni,
                                    impImptos: vm.nuevoValoresPoliza.poliza.conceptosDesglose.impImptos,
                                    impInteres: vm.nuevoValoresPoliza.poliza.conceptosDesglose.impInteres,
                                    impPneta: vm.nuevoValoresPoliza.poliza.conceptosDesglose.impPneta,
                                    impPnetaBoni: vm.nuevoValoresPoliza.poliza.conceptosDesglose.impPnetaBoni,
                                    impPrimaTotal: vm.nuevoValoresPoliza.poliza.conceptosDesglose.impPrimaTotal,
                                    impRecargos: vm.nuevoValoresPoliza.poliza.conceptosDesglose.impRecargos
                                },
                                estadoPoliza: vm.nuevoValoresPoliza.poliza.estadoPoliza,
                                estadoRenovacion: vm.nuevoValoresPoliza.poliza.estadoRenovacion,
                                fecEfecPoliza: vm.nuevoValoresPoliza.poliza.fecEfecPoliza,
                                fecVctoPoliza: vm.nuevoValoresPoliza.poliza.fecVctoPoliza,
                                fraccionamiento: {
                                    codFraccPago: vm.nuevoValoresPoliza.poliza.fraccionamiento.codFraccPago,
                                    numCuotas: vm.nuevoValoresPoliza.poliza.fraccionamiento.numCuotas
                                },
                                impCuotaInicial: vm.nuevoValoresPoliza.poliza.impCuotaInicial == null ? 0 : vm.nuevoValoresPoliza.poliza.impCuotaInicial,
                                impMapfreDolares: vm.nuevoValoresPoliza.poliza.mcaImporteMapfreDolar ? parseFloat(vm.nuevoValoresPoliza.poliza.totalMapfreDolarUsar) : vm.nuevoValoresPoliza.poliza.impMapfreDolares,
                                impSaldoMapfreDolar: vm.nuevoValoresPoliza.poliza.impSaldoMapfreDolar,
                                mcaProvisional: vm.nuevoValoresPoliza.poliza.mcaProvisional,
                                mcaImporteMapfreDolar: vm.nuevoValoresPoliza.poliza.mcaImporteMapfreDolar,
                                moneda: {
                                    codMon: vm.nuevoValoresPoliza.poliza.moneda.codMon,
                                    codMonIso: vm.nuevoValoresPoliza.poliza.moneda.codMonIso,
                                    nomMon: vm.nuevoValoresPoliza.poliza.moneda.nomMon,
                                },
                                nombreCompletoAgente: vm.nuevoValoresPoliza.poliza.nombreCompletoAgente,
                                nombreOficina: vm.nuevoValoresPoliza.poliza.nombreOficina,
                                numApli: vm.nuevoValoresPoliza.poliza.numApli,
                                numDiasVencimiento: vm.nuevoValoresPoliza.poliza.numDiasVencimiento,
                                numDocAgente: vm.nuevoValoresPoliza.poliza.numDocAgente,
                                numPoliza: vm.copiaPoliza[0].poliza.numPoliza,
                                numSpto: vm.copiaPoliza[0].poliza.numSpto,
                                numSptoApli: vm.nuevoValoresPoliza.poliza.numSptoApli,
                                tipoDocAgente: vm.nuevoValoresPoliza.poliza.tipoDocAgente,
                                totalMapfreDolarUsar: parseFloat(vm.nuevoValoresPoliza.poliza.totalMapfreDolarUsar),
                                usuario: vm.nuevoValoresPoliza.poliza.usuario
                            },
                            producto: {
                                codCia: vm.copiaPoliza[0].poliza.producto.codCia,
                                codRamo: vm.copiaPoliza[0].poliza.producto.codRamo,
                                codModalidad: vm.nuevoValoresPoliza.poliza.producto.codModalidad,
                                codPlan: vm.nuevoValoresPoliza.poliza.producto.codPlan,
                                codProducto: vm.nuevoValoresPoliza.poliza.producto.codProducto,
                                codSubProducto: vm.nuevoValoresPoliza.poliza.producto.codSubProducto,
                                mcaEmiteSalud: vm.nuevoValoresPoliza.poliza.producto.mcaEmiteSalud,
                                numContrato: vm.nuevoValoresPoliza.poliza.producto.numContrato,
                                numPolizaGrupo: vm.nuevoValoresPoliza.poliza.producto.numPolizaGrupo,
                                numSubContrato: vm.nuevoValoresPoliza.poliza.producto.numSubContrato
                            },
                        }
                    } else if (vm.suplementos.length > 1) {
                        fullbody = {
                            poliza: {
                                abrevOficina: vm.nuevoValoresPoliza.poliza.abrevOficina || vm.copiaPoliza[1].poliza.abrevOficina,
                                codCia: vm.nuevoValoresPoliza.poliza.codCia || vm.copiaPoliza[1].poliza.codCia,
                                codEstadoPoliza: vm.nuevoValoresPoliza.poliza.codEstadoPoliza || vm.copiaPoliza[1].poliza.codEstadoPoliza,
                                codEstadoRenovacion: vm.nuevoValoresPoliza.poliza.codEstadoRenovacion || vm.copiaPoliza[1].poliza.codEstadoRenovacion,
                                codigoAgente: vm.nuevoValoresPoliza.poliza.codigoAgente || vm.copiaPoliza[1].poliza.codigoAgente,
                                conceptosDesglose: {
                                    impBoni: vm.nuevoValoresPoliza.poliza.conceptosDesglose.impBoni || vm.copiaPoliza[1].poliza.conceptosDesglose.impBoni,
                                    impImptos: vm.nuevoValoresPoliza.poliza.conceptosDesglose.impImptos || vm.copiaPoliza[1].poliza.conceptosDesglose.impImptos,
                                    impInteres: vm.nuevoValoresPoliza.poliza.conceptosDesglose.impInteres || vm.copiaPoliza[1].poliza.conceptosDesglose.impInteres,
                                    impPneta: vm.nuevoValoresPoliza.poliza.conceptosDesglose.impPneta || vm.copiaPoliza[1].poliza.conceptosDesglose.impPneta,
                                    impPnetaBoni: vm.nuevoValoresPoliza.poliza.conceptosDesglose.impPnetaBoni || vm.copiaPoliza[1].poliza.conceptosDesglose.impPnetaBoni,
                                    impPrimaTotal: vm.nuevoValoresPoliza.poliza.conceptosDesglose.impPrimaTotal || vm.copiaPoliza[1].poliza.conceptosDesglose.impPrimaTotal,
                                    impRecargos: vm.nuevoValoresPoliza.poliza.conceptosDesglose.impRecargos || vm.copiaPoliza[1].poliza.conceptosDesglose.impRecargos
                                },
                                estadoPoliza: vm.nuevoValoresPoliza.poliza.estadoPoliza || vm.copiaPoliza[1].poliza.estadoPoliza,
                                estadoRenovacion: vm.nuevoValoresPoliza.poliza.estadoRenovacion || vm.copiaPoliza[1].poliza.estadoRenovacion,
                                fecEfecPoliza: vm.nuevoValoresPoliza.poliza.fecEfecPoliza || vm.copiaPoliza[1].poliza.fecEfecPoliza,
                                fecVctoPoliza: vm.nuevoValoresPoliza.poliza.fecVctoPoliza || vm.copiaPoliza[1].poliza.fecVctoPoliza,
                                fraccionamiento: {
                                    codFraccPago: parseInt(vm.nuevoValoresPoliza.poliza.fraccionamiento.codFraccPago) || vm.camposDinamicosPolizaRenovaciones.filter(function (campo) {
                                        return campo.codCampo === 'COD_FRACC_PAGO'
                                    })[0].valCampo,
                                    numCuotas: vm.nuevoValoresPoliza.poliza.fraccionamiento.numCuotas || vm.copiaPoliza[1].poliza.fraccionamiento.numCuotas
                                },
                                impCuotaInicial: vm.nuevoValoresPoliza.poliza.impCuotaInicial == null ? 0 : vm.nuevoValoresPoliza.poliza.impCuotaInicial,
                                impMapfreDolares: vm.nuevoValoresPoliza.poliza.mcaImporteMapfreDolar ? parseFloat(vm.nuevoValoresPoliza.poliza.totalMapfreDolarUsar) : vm.nuevoValoresPoliza.poliza.impMapfreDolares || vm.copiaPoliza[1].poliza.impMapfreDolares,
                                impSaldoMapfreDolar: vm.nuevoValoresPoliza.poliza.impSaldoMapfreDolar || vm.copiaPoliza[1].poliza.impSaldoMapfreDolar,
                                mcaProvisional: vm.nuevoValoresPoliza.poliza.mcaProvisional || vm.copiaPoliza[1].poliza.mcaProvisional,
                                mcaImporteMapfreDolar: vm.nuevoValoresPoliza.poliza.mcaImporteMapfreDolar? vm.nuevoValoresPoliza.poliza.mcaImporteMapfreDolar.toUpperCase() : vm.copiaPoliza[1].poliza.mcaImporteMapfreDolar? vm.copiaPoliza[1].poliza.mcaImporteMapfreDolar : null,
                                moneda: {
                                    codMon: vm.nuevoValoresPoliza.poliza.moneda.codMon || vm.copiaPoliza[1].poliza.moneda.codMon,
                                    codMonIso: vm.nuevoValoresPoliza.poliza.moneda.codMonIso || vm.copiaPoliza[1].poliza.moneda.codMonIso,
                                    nomMon: vm.nuevoValoresPoliza.poliza.moneda.nomMon || vm.copiaPoliza[1].poliza.moneda.nomMon,
                                },
                                nombreCompletoAgente: vm.nuevoValoresPoliza.poliza.nombreCompletoAgente || vm.copiaPoliza[1].poliza.nombreCompletoAgente,
                                nombreOficina: vm.nuevoValoresPoliza.poliza.nombreOficina || vm.copiaPoliza[1].poliza.nombreOficina,
                                numApli: vm.nuevoValoresPoliza.poliza.numApli || vm.copiaPoliza[1].poliza.numApli,
                                numDiasVencimiento: vm.nuevoValoresPoliza.poliza.numDiasVencimiento || vm.copiaPoliza[1].poliza.numDiasVencimiento,
                                numDocAgente: vm.nuevoValoresPoliza.poliza.numDocAgente || vm.copiaPoliza[1].poliza.numDocAgente,
                                numPoliza: vm.nuevoValoresPoliza.poliza.numPoliza || vm.copiaPoliza[1].poliza.numPoliza,
                                numSpto: vm.nuevoValoresPoliza.poliza.numSpto || vm.copiaPoliza[1].poliza.numSpto,
                                numSptoApli: vm.nuevoValoresPoliza.poliza.numSptoApli || vm.copiaPoliza[1].poliza.numSptoApli,
                                tipoDocAgente: vm.nuevoValoresPoliza.poliza.tipoDocAgente || vm.copiaPoliza[1].poliza.tipoDocAgente,
                                totalMapfreDolarUsar: parseFloat(vm.nuevoValoresPoliza.poliza.totalMapfreDolarUsar) || parseFloat(vm.copiaPoliza[1].poliza.totalMapfreDolarUsar),
                                usuario: vm.nuevoValoresPoliza.poliza.usuario || vm.copiaPoliza[1].poliza.usuario
                            },
                            producto: {
                                codCia: vm.nuevoValoresPoliza.poliza.producto.codCia || vm.copiaPoliza[1].poliza.producto.codCia,
                                codRamo: vm.nuevoValoresPoliza.poliza.producto.codRamo || vm.copiaPoliza[1].poliza.producto.codRamo,
                                codModalidad: vm.nuevoValoresPoliza.poliza.producto.codModalidad || vm.copiaPoliza[1].poliza.producto.codModalidad,
                                codPlan: vm.nuevoValoresPoliza.poliza.producto.codPlan || vm.copiaPoliza[1].poliza.producto.codPlan,
                                codProducto: vm.nuevoValoresPoliza.poliza.producto.codProducto || vm.copiaPoliza[1].poliza.producto.codProducto,
                                codSubProducto: vm.nuevoValoresPoliza.poliza.producto.codSubProducto || vm.copiaPoliza[1].poliza.producto.codSubProducto,
                                mcaEmiteSalud: vm.nuevoValoresPoliza.poliza.producto.mcaEmiteSalud || vm.copiaPoliza[1].poliza.producto.mcaEmiteSalud,
                                numContrato: vm.nuevoValoresPoliza.poliza.producto.numContrato || vm.copiaPoliza[1].poliza.producto.numContrato,
                                numPolizaGrupo: vm.nuevoValoresPoliza.poliza.producto.numPolizaGrupo || vm.copiaPoliza[1].poliza.producto.numPolizaGrupo,
                                numSubContrato: vm.nuevoValoresPoliza.poliza.producto.numSubContrato || vm.copiaPoliza[1].poliza.producto.numSubContrato
                            },
                        }
                    }
                    // console.log(vm.nuevoValoresPoliza);
                    if (vm.copiaRiesgo[0].length != 0 && vm.suplementos.length == 1) {
                        
                        for (var i = 0; i < vm.copiaRiesgo[0].length; i++) {
                            if(vm.endosatariosReno.some(function (endosatario){
                                return endosatario && endosatario.nroRiesgo == vm.copiaRiesgo[0][i]['numRiesgo'];
                            })){
                                vm.copiaRiesgo[0][i].endosatario = vm.endosatariosReno.find(function (endosatario){
                                    return endosatario.nroRiesgo == vm.copiaRiesgo[0][i]['numRiesgo'];
                                })
                            } else {
                                vm.copiaRiesgo[0][i].endosatario = {}
                            }
                            
                            delete vm.copiaRiesgo[0][i].camposDinamicos;
                            for (var key in vm.copiaRiesgo[0][i]) {
                                if (key == 'numRiesgo') {
                                    vm.copiaRiesgo[0][i][key] = vm.copiaRiesgo[0][i][key]
                                } else if (key == 'endosatario') {
                                    vm.copiaRiesgo[0][i][key] = vm.copiaRiesgo[0][i][key]
                                } else if (key == 'pctDsctoComercial') {
                                    vm.copiaRiesgo[0][i][key] = parseFloat('3000000'+convertDsctToString(vm.nuevoValoresPoliza.riesgos[i]['pctDsctoComercialEspecial'])+'3000000')
                                    // vm.copiaRiesgo[0][i][key] = vm.nuevoValoresPoliza.riesgos[i]['pctDsctoComercialEspecial'] || ''
                                } else if (key == 'codModalidadDsct') {
                                    vm.copiaRiesgo[0][i][key] = vm.copiaRiesgo[0][i][key]
                                } 
                                // else if (key == 'usoDsctEspe') {
                                //     vm.copiaRiesgo[0][i][key] = vm.nuevoValoresPoliza.riesgos[i]['usoDsctEspe']? vm.nuevoValoresPoliza.riesgos[i]['usoDsctEspe'].toUpperCase(): vm.nuevoValoresPoliza.riesgos[i]['usoDsctEspe'];
                                // }
                                else {
                                    vm.copiaRiesgo[0][i][key] = vm.nuevoValoresPoliza.riesgos[i][key]? typeof vm.nuevoValoresPoliza.riesgos[i][key] == 'string'?vm.nuevoValoresPoliza.riesgos[i][key].toUpperCase():vm.nuevoValoresPoliza.riesgos[i][key] : vm.nuevoValoresPoliza.riesgos[i][key];
                                    // vm.copiaRiesgo[0][i][key] = vm.nuevoValoresPoliza.riesgos[i][key]
                                }
                            }
                        }
                        fullbody.riesgoVehiculo = vm.copiaRiesgo[0]
                    }

                    if (vm.suplementos.length > 1) {

                        for (var j = 0; j < vm.copiaRiesgo[1].length; j++) {
                            
                            if(vm.endosatariosReno.some(function (endosatario){
                                return endosatario && endosatario.nroRiesgo == vm.copiaRiesgo[1][j]['numRiesgo'];
                            })){
                                
                                vm.copiaRiesgo[1][j].endosatario = vm.endosatariosReno.find(function (endosatario){
                                    return endosatario.nroRiesgo == vm.copiaRiesgo[1][j]['numRiesgo'];
                                })
                            } else {
                                vm.copiaRiesgo[1][j].endosatario = {}
                            }
                            delete vm.copiaRiesgo[1][j].camposDinamicos;
                            for (var key in vm.copiaRiesgo[1][j]) {
                                if (key == 'pctDsctoComercial') {
                                    // if (vm.nuevoValoresPoliza.riesgos[j]['pctDsctoComercialEspecial'] || vm.copiaRiesgo[1][j]['pctDsctoComercialEspecial']) {
                                    //     vm.copiaRiesgo[1][j][key] = vm.nuevoValoresPoliza.riesgos[j]['pctDsctoComercialEspecial'] || vm.copiaRiesgo[1][j]['pctDsctoComercialEspecial']

                                    // } else {
                                    //     vm.copiaRiesgo[1][j][key] = vm.copiaRiesgo[1][j]['pctDsctoComercialEspecial'] || ''
                                    // }
                                    if (vm.nuevoValoresPoliza.riesgos[j]['pctDsctoComercialEspecial']) {
                                        vm.copiaRiesgo[1][j][key] = parseFloat(convertDsctToString(vm.copiaRiesgo[1][j]['pctDsctoEspecial'])+convertDsctToString(vm.nuevoValoresPoliza.riesgos[j]['pctDsctoComercialEspecial'])+convertDsctToString(vm.copiaRiesgo[1][j]['pctDsctoScore']))
                                    } else {
                                        vm.copiaRiesgo[1][j][key] = parseFloat(convertDsctToString(vm.copiaRiesgo[1][j]['pctDsctoEspecial'])+convertDsctToString(vm.copiaRiesgo[1][j]['pctDsctoComercialEspecial'])+convertDsctToString(vm.copiaRiesgo[1][j]['pctDsctoScore']))
                                    }
                                } else if (key == 'endosatario') {
                                    vm.copiaRiesgo[1][j][key] = vm.copiaRiesgo[1][j][key]
                                // } else if (key == 'usoDsctEspe') {
                                //     vm.copiaRiesgo[1][j][key] = vm.nuevoValoresPoliza.riesgos[j]['usoDsctEspe']? vm.nuevoValoresPoliza.riesgos[j]['usoDsctEspe'].toUpperCase() : vm.copiaRiesgo[1][j]['usoDsctEspe'].toUpperCase()
                                } else {
                                    vm.copiaRiesgo[1][j][key] = vm.nuevoValoresPoliza.riesgos[j][key]? typeof vm.nuevoValoresPoliza.riesgos[j][key] == 'string'?vm.nuevoValoresPoliza.riesgos[j][key].toUpperCase():vm.nuevoValoresPoliza.riesgos[j][key] : vm.copiaRiesgo[1][j][key]
                                    //vm.copiaRiesgo[1][j][key] = vm.nuevoValoresPoliza.riesgos[j][key] || vm.copiaRiesgo[1][j][key]
                                }
                            }
                            
                        }

                        fullbody.riesgoVehiculo = vm.copiaRiesgo[1]
                    }
                    // console.log('body',fullbody);
                    var id = parseInt(vm.poliza.numPoliza)
                    renovacionBandejaService.procesoPreRenovar(fullbody, id).then(function (response) {
                        if (response.codError == 0) {
                            vm.getPoliza(vm.polizaID)
                        } else {

                            if (response.codError == 6) {
                                vm.getPoliza(vm.polizaID)
                                mModalAlert.showWarning("",response.descError);
                            }
                            if(response.error.length > 0){
                                var errores = response.error.map(function (error) {
                                    return error.descErrorBatch
                                }).join('<br>')
                                mModalAlert.showError(errores, response.descError);
                            }else{
                                mModalAlert.showError("",response.descError);
                            }
                        }
                    }).catch(function (error) {
                        console.error(error)
                        mModalAlert.showError('Error al prerenovar la póliza', '¡Error!')
                    })
                }, function (response) {
                    return false;
                });


        }

        function ValidarCliente(body) {
            renovacionBandejaService.validarCliente(body).then(function (response) {
                if (response.codError === 0) {
                    vm.clienteValido = true;
                    if (vm.clienteValido && vm.poliza.codEstadoPoliza == 'V' && vm.poliza.numDiasVencimiento <= vm.diasVencimiento && vm.poliza.codEstadoRenovacion == 'PDE_RNV') {
                        vm.tipoProceso = 'Pre-Renovación'
                    } else if (vm.clienteValido && vm.poliza.codEstadoPoliza == 'V' && vm.poliza.codEstadoRenovacion == 'PRE_RNVD' || vm.poliza.numDiasVencimiento <= vm.diasVencimiento) {
                        vm.tipoProceso = 'Renovacion'
                    } else if (vm.clienteValido || vm.poliza.codEstadoRenovacion == 'RENOVADA') {
                        vm.tipoProceso = 'Anulacion'
                    } else {
                        vm.tipoProceso = ''
                    }
                } else {
                    vm.clienteValido = false;
                    vm.alerts.push(response.descError);
                }
            }).catch(function (error) {
                mModalAlert.showWarning('Error al validar cliente', '¡Error!')
            })
        }

        function ObtenerCombos(body) {
            return renovacionBandejaService.obtenerParametrosFiltrados(body).then(function (response) {
                if (response.codError == null) {
                    return response.parametros || null
                } else {
                    mModalAlert.showWarning(response.descError, 'ALERTA');
                }
            }).catch(function (error) {
                console.error(error)
                // mModalAlert.showWarning('Error general del sistema', 'ALERTA')
            })
        }

        function ValidarRUCDNI(body) {
            renovacionBandejaService.obtenerParametrosFiltrados(body).then(function (response) {
                if (response.codError == null) {
                    $scope.formParametro.clienteValido = true;
                    console.log($scope.formParametro.clienteValido)
                } else {
                    $scope.formParametro.clienteValido = false
                }
            }).catch(function (error) {
                console.error(error)
                $scope.formParametro.clienteValido = false
                mModalAlert.showWarning('Error general del sistema', 'ALERTA')
            })
        }

        function JustNumbers(input) {
            if(input){
                input.addEventListener('keypress', function (evt) {
                    if (!((evt.keyCode >= 48 && evt.keyCode <= 57) || evt.keyCode == 46 || evt.keyCode == 45)) {
                        evt.returnValue = false;
                        return false
                    }
                })
            }
        }

        function Maxvalue(input, maxVal, minVal) {
            input.addEventListener('input', function (evt) {
                var num = this.value
                var max = parseFloat(maxVal) || 0
                var min = minVal;
                if (num.length > 1 && isNaN(num)) {
                    mModalAlert.showWarning('El dato ingresado debe ser numérico ', 'ALERTA', 3000);
                    this.value = "";
                    vm.nuevoValoresPoliza.poliza[vm.formatValues(this.id)] = null;
                } else if (parseFloat(num) > max) {
                    this.value = max
                    mModalAlert.showWarning('Valor Máximo ' + max, 'ALERTA', 3000)
                    vm.nuevoValoresPoliza.poliza[vm.formatValues(this.id)] = max;
                } else if (parseFloat(num) < min ) {
                    this.value = min
                    mModalAlert.showWarning('Valor Mínimo ' + min, 'ALERTA', 3000)
                    vm.nuevoValoresPoliza.poliza[vm.formatValues(this.id)] = min;
                } else {
                    this.value = num
                }
            })
        }

        function MaxMinValueRiesgo(input, maxVal, minVal, type) {
            input.addEventListener(type, function (evt) {
                var num = this.value
                var max = parseFloat(maxVal)|| 0;
                var min = minVal;
                var info = this.id.split('-');
                if (num.length > 1 && isNaN(num)) {
                    mModalAlert.showWarning('El dato ingresado debe ser numérico ', 'ALERTA', 3000);
                    this.value = "";
                    vm.nuevoValoresPoliza.riesgos[parseInt(info[0])][vm.formatValues(info[1])] = null;
                } else if (parseFloat(num) > max) {
                    this.value = max
                    vm.nuevoValoresPoliza.riesgos[parseInt(info[0])][vm.formatValues(info[1])] = max;
                    mModalAlert.showWarning('Valor Máximo ' + max, 'ALERTA', 3000)
                } else if (parseFloat(num) < min ) {
                    this.value = min
                    vm.nuevoValoresPoliza.riesgos[parseInt(info[0])][vm.formatValues(info[1])] = min;
                    mModalAlert.showWarning('Valor Mínimo ' + min, 'ALERTA', 3000)
                } else {
                    this.value = num
                }

            })
        }

        function DisableField(input, value) {
            if (value == 'N' || value == 'n' || value == null) {
                input.disabled = true
            } else {
                input.disabled = false
            }
        }


        function convertDsctToString(number){
            if(number == null){
                return '3000000'
            }
            if(number >=0){
                return '2'+(Math.round(number*10000)).toString().padStart(6,'0');
            }
            if(number < 0){
                return '1'+(Math.round(Math.abs(number)*10000)).toString().padStart(6,'0');
            }
        }
    }

});
