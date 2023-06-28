(function($root, deps, action) {
    define(deps, action)
})(this, ['angular', 'constants', 'swal', 'lodash', '/polizas/app/autos/autosEmitirUsado/service/usedCarEmitFactory.js'],
    function(angular, constants, swal, _) {
        var appAutos = angular.module("appAutos");

        appAutos.controller('usedCarEmitS1', ['$scope', '$q', 'usedCarEmitFactory', '$state', 'proxyAutomovil', 'mpSpin', 'mModalAlert', 'mModalConfirm', '$filter', '$log',
            function($scope, $q, usedCarEmitFactory, $state, proxyAutomovil, mpSpin, mModalAlert, mModalConfirm, $filter, $log) {

                (function onLoad() {
                    $scope.mainStep = $scope.mainStep || {};
                    $scope.firstStep = $scope.firstStep || {};
                    $scope.secondStep = $scope.secondStep || {};
                    $scope.thirdStep = $scope.thirdStep || {};
                    $scope.fourthStep = $scope.fourthStep || {};
                    $scope.fiveStep = $scope.fiveStep || {};
                    $scope.summaryStep = $scope.summaryStep || {};

                    initVar();
                })();

                function initVar() {
                    if (typeof $scope.firstStep.showInspection == 'undefined') $scope.firstStep.showInspection = false;
                    $scope.errorInspection = {
                        value: false,
                        description: ''
                    };
                }

                $scope.validationForm = function() {
                    $scope.frmFirstStep.markAsPristine();
                    return $scope.frmFirstStep.$valid;
                };

                function disableNextStep() {
                    $scope.$parent.secondStep = {};
                    $scope.$parent.thirdStep = {};
                    $scope.$parent.fourthStep = {};
                    $scope.firstStep.nextStep = false;
                    $scope.secondStep.nextStep = false;
                    $scope.thirdStep.nextStep = false;
                    $scope.fourthStep.nextStep = false;
                }

                function sendEmailNotification(errorCode, dataInspection, dataContractor, dataClaims) {
                    var type = errorCode;
                    var paramsEmail = {
                        listaParam: [{
                                key: 'tipo',
                                value: '1'
                            },
                            {
                                key: 'ContratanteNombre',
                                value: dataContractor.Nombre
                            },
                            {
                                key: 'ContratanteApellidoPaterno',
                                value: dataContractor.ApellidoPaterno
                            },
                            {
                                key: 'ContratanteApellidoMaterno',
                                value: dataContractor.ApellidoMaterno
                            },
                            {
                                key: 'ContratanteCorreoElectronico',
                                value: dataContractor.CorreoElectronico
                            },
                            {
                                key: 'NumeroInspeccion',
                                value: dataInspection.NumeroInspeccion
                            },
                            {
                                key: 'NumeroSolicitud',
                                value: dataInspection.Nro_solicitud
                            },
                            {
                                key: 'NumeroPlaca',
                                value: dataInspection.NumeroPlaca
                            },
                            {
                                key: 'NumeroMotor',
                                value: dataInspection.Veh_nro_motor
                            },
                            {
                                key: 'VehiculoValor',
                                value: dataInspection.Veh_valor
                            },
                            {
                                key: 'RangoInspeccion',
                                value: dataInspection.RangoInspeccion
                            },
                            {
                                key: 'RangoTron',
                                value: dataInspection.RangoTron
                            },
                            {
                                key: 'RangoPermitido',
                                value: dataInspection.RangoPermitido
                            },
                            {
                                key: 'CodigoMarca',
                                value: dataInspection.Veh_marca
                            },
                            {
                                key: 'NombreMarca',
                                value: dataInspection.NomMarca
                            },
                            {
                                key: 'CodigoModelo',
                                value: dataInspection.Veh_modelo
                            },
                            {
                                key: 'NombreModelo',
                                value: dataInspection.NomModelo
                            },
                            {
                                key: 'CodigoSubModelo',
                                value: dataInspection.Veh_sub_modelo
                            },
                            {
                                key: 'NombreSubModelo',
                                value: dataInspection.NomSubModelo
                            },
                            {
                                key: 'AnioFabricacion',
                                value: dataInspection.Veh_ano
                            },
                            {
                                key: 'AgenteNombre',
                                value: dataClaims.nombreAgente
                            },
                            {
                                key: 'AgenteCodigo',
                                value: dataClaims.codigoAgente
                            }
                        ]
                    };

                    usedCarEmitFactory.sendEmailNotification(type, paramsEmail, true).then(function(response) {
                        if (response.OperationCode == constants.operationCode.success) {
                            mModalAlert.showSuccess('La notificación a sido enviada al área de suscripción', '', null, 5000);
                        } else {
                            mModalAlert.showError('La notificación no ha podido ser enviada al área de suscripción', '', null, 5000);
                        }
                    }, function(error) {
                    }, function(defaultError) {
                    });
                }

                function htmlModalConfirm(value, min, max) {
                    var vHtml = '<div class="row">' +
                        '<div class="col-md-12 mb-xs-4">' +
                        'El valor de inspección es USD ' + value + '. Puede emitir dentro del rango de valores (MIN: ' + min + ' - MAX ' + max + '), o solicitar actualización del valor de inspección y/o del sistema' +
                        '</div>' +
                        '</div>' +
                        '<div class="row">' +
                        '<div class="col-md-4 mb-xs-1">' +
                        '<a class="g-btn g-btn-verde block" id="btnOk" >Emitir en el rango</a>' +
                        '</div>' +
                        '<div class="col-md-4 mb-xs-1">' +
                        '<a class="g-btn g-btn-verde block" id="btnSendEmail" >Sol. Actualización</a>' +
                        '</div>' +
                        '<div class="col-md-4 mb-xs-1">' +
                        '<a class="g-btn g-btn-verde block" id="btnExit" >Salir</a>' +
                        '</div>' +
                        '</div>';
                    return vHtml;
                }

                function showModalConfirm(tit, html, type) {
                    var opt = {
                        title: tit,
                        html: html,
                        customClass: 'swal2-modal-custom',
                        type: type,
                        showCloseButton: true,
                        showCancelButton: false,
                        showConfirmButton: false,
                        allowOutsideClick: false //noClick fuera de pantalla
                    }
                    var promise = swal(opt);
                    return promise;
                }

                function errorSearchCarInspected(errorCode, carValue, valorSugerido) {
                    carValue = $filter('number')(carValue, 0.00);
                    switch (errorCode) {
                        case 1:
                            mModalConfirm.confirmWarning(
                                    'No es posible emitir la póliza porque el valor de inspección USD ' + carValue + ' es muy diferente a los valores permitidos por el sistema (MIN ' + valorSugerido.Minimo + ' - MAX ' + valorSugerido.Maximo + '). Notifique al área de suscripción para su actualización',
                                    'Enviar notificación para actualización',
                                    'Enviar Notificación')
                                .then(function(response) {
                                    if (response) {
                                        sendEmailNotification(errorCode, $scope.firstStep.dataInspection, $scope.firstStep.dataContractor, $scope.mainStep.claims);
                                    }
                                }, function(error) {
                                }, function(defaultError) {
                                });
                            break;
                        case 2:
                            showModalConfirm(
                                '¿Qué desea hacer?',
                                htmlModalConfirm(carValue, valorSugerido.Minimo, valorSugerido.Maximo),
                                'warning');

                            document.getElementById('btnOk').addEventListener('click', function(e) {
                                $scope.firstStep.showInspection = true;
                                swal.close();
                                $scope.nextStep(); //goNextStep
                            });

                            document.getElementById('btnSendEmail').addEventListener('click', function(e) {
                                sendEmailNotification(errorCode, $scope.firstStep.dataInspection, $scope.firstStep.dataContractor, $scope.mainStep.claims);
                                swal.close();
                            });

                            document.getElementById('btnExit').addEventListener('click', function(e) {
                                swal.close();
                            });
                            break;
                    }
                }

                function _paramsSearchCarInspected(value) {
                    var vParams = {
                        nroInspeccion: value
                    }
                    return vParams;
                }
                $scope.searchCarInspected = function(value) {
                    mpSpin.start();

                    if (typeof value == 'undefined') value = '';

                    value = value.toUpperCase();
                    value = value.replace(' ', '');
                    value = value.replace('-', '');
                    $scope.firstStep.mInspeccionPlaca = value;

                    //validation for nextStepsHeader
                    if (typeof $scope.firstStep.dataInspection != 'undefined') {
                        if ($scope.firstStep.dataInspection.NumeroInspeccion != value || $scope.firstStep.dataInspection.NumeroPlaca != value)
                            disableNextStep();
                    }

                    $scope.firstStep.showInspection = false;
                    $scope.errorInspection = {
                        value: false,
                        description: ''
                    };

                    if ($scope.validationForm()) {
                        var vParams = _paramsSearchCarInspected(value);
                        usedCarEmitFactory.searchCarInspected(vParams).then(function(response) {
                            if (response.OperationCode == constants.operationCode.success) {
                                $scope.firstStep.dataInspection = response.Data;

                                $scope.mydataInspec = response.Data;
                                // se coloca la data en la misma estructura que se obtiene del contratante, debido a que
                                // es la estructura definida para llenar los datos desde el paso 3
                                var dataDeInspeccionYContratante = {
                                  Nombre: $scope.mydataInspec.Nombres || '',
                                  ApellidoPaterno: $scope.mydataInspec.Ape_paterno || '',
                                  ApellidoMaterno: $scope.mydataInspec.Ape_materno || '',
                                  FechaNacimiento: $scope.mydataInspec.Fecha_nac || '',
                                  Sexo: $scope.mydataInspec.Sexo || '',
                                  Profesion: {
                                    Codigo: $scope.mydataInspec.Cod_profesion || '',
                                  },
                                  CorreoElectronico: $scope.mydataInspec.Email1 || $scope.mydataInspec.Email2 || '',
                                  Ubigeo: {
                                    CodigoVia: $scope.mydataInspec.CodTipoVia || '',
                                    Direccion: $scope.mydataInspec.Direccion || '',
                                    CodigoNumero: $scope.mydataInspec.CodDirecNro || '',
                                    TextoNumero: $scope.mydataInspec.DirecNro || '',
                                    CodigoInterior: $scope.mydataInspec.CodDirecInt || '',
                                    TextoInterior: $scope.mydataInspec.DirectInt || '',
                                    CodigoZona: $scope.mydataInspec.CodZonaIns || '',
                                    Referencia: $scope.mydataInspec.Lugar_ref || '',
                                    CodigoDepartamento: $scope.mydataInspec.Cod_dep || '',
                                    CodigoDistrito: $scope.mydataInspec.Cod_distri || '',
                                    CodigoProvincia: $scope.mydataInspec.Cod_prov || '',
                                    NombreDepartamento: $scope.mydataInspec.NombreDepartamento || '',
                                    NombreProvincia: $scope.mydataInspec.NombreProvincia || '',
                                    NombreDistrito: $scope.mydataInspec.NombreDistrito || ''
                                  }
                                }
                                $scope.firstStep.dataContractor = dataDeInspeccionYContratante;
                                //Contratante
                                var paramsSearchContractor = {
                                    tipoDocumento: response.Data.Tipo_doc,
                                    nroDocumento: response.Data.Nro_doc
                                }

                                if (response.Data.Tipo_doc && response.Data.Nro_doc){
                                  usedCarEmitFactory.searchContractor(paramsSearchContractor).then(function(data) {
                                    if (response.OperationCode == constants.operationCode.success) {
                                      $scope.firstStep.dataContractor = _.merge({}, dataDeInspeccionYContratante, data.Data);
                                    }
                                  }, function(error) {
                                    $log.info(error);
                                      mpSpin.end();

                                  }).catch(function (error) {
                                    $log.info(error);
                                    mpSpin.end();
                                  });
                                }

                                //Validación ValorAuto en rango
                                if (response.Data.Process > 0) {
                                    $scope.firstStep.showInspection = true;
                                    if (response.Data.RangoPermitido && response.Data.ValorSugerido.Valor) {
                                        $scope.firstStep.valorEmision = {
                                            Valor: response.Data.ValorSugerido.Valor,
                                            Minimo: response.Data.ValorSugerido.Minimo,
                                            Maximo: response.Data.ValorSugerido.Maximo,
                                        };
                                    } else $scope.firstStep.valorEmision = {};

                                } else {
                                    $scope.firstStep.valorEmision = {
                                        Valor: response.Data.ValorSugerido.Valor,
                                        Minimo: response.Data.ValorSugerido.Minimo,
                                        Maximo: response.Data.ValorSugerido.Maximo,
                                    };
                                    errorSearchCarInspected(response.Data.ErrorCode, response.Data.ValorSugerido.Valor, $scope.firstStep.valorEmision);
                                }

                            } else if (response.Message.length > 0) {
                                $scope.errorInspection.value = true;
                                $scope.errorInspection.description = response.Message.replace('\\n\\', '').replace(/\\/g, '');
                            }
                            mpSpin.end();
                        }, function(error) {
                            $log.info(error);
                            mpSpin.end();
                        });
                    } else {
                        mpSpin.end();
                    }
                };

                $scope.$on('changingStep', function(ib, e) {
                    if (typeof $scope.firstStep.nextStep == 'undefined') $scope.firstStep.nextStep = false;
                    if (e.step > 1 && $scope.firstStep.nextStep) {
                        if ($scope.validationForm() && $scope.firstStep.showInspection) {
                            e.cancel = false
                        } else {
                            e.cancel = true;
                            disableNextStep();
                        }
                    } else {
                        e.cancel = true;
                        disableNextStep();
                    }
                });


                $scope.nextStep = function() {
                    disableNextStep();
                    if ($scope.validationForm() && $scope.firstStep.showInspection) {
                      if ($scope.mainStep.claims.codigoAgente != '0'){
                        var paramsProducts = {
                            CodigoAplicacion: constants.module.polizas.description,
                            CodigoUsuario: $scope.mainStep.claims.codigoUsuario, //'DBISBAL', //VIENE DEL LOGIN
                            Filtro: constants.module.polizas.autos.description,
                            CodigoRamo: constants.module.polizas.autos.codeRamo,
                            CodigoTipoVehiculo: parseInt($scope.firstStep.dataInspection.Veh_tipo)
                        }
                        $scope.firstStep.nextStep = true;
                        mpSpin.start()
                        $state.go('.', {
                            step: 2,
                            paramsProducts: paramsProducts
                        });
                      }else{
                        mModalAlert.showError("No tiene un agente seleccionado", "Error");
                      }
                    }
                };

            }
        ]);
    });
