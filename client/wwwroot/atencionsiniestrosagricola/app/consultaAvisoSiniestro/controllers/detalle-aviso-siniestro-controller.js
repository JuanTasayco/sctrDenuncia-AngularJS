define(['angular', 'constants', 'mfpModalQuestion', '/atencionsiniestrosagricola/app/utilities/agricolaUtilities.js'],
    function (ng, constants) {
        detalleAvisoSiniestroController.$inject = ['$scope', '$filter', '$state', '$stateParams', '$http', '$q', '$timeout', '$uibModal', 'oimClaims', 'agricolaUtilities', 'proxyAgricolaSecurity', 'proxyAviso', 'proxyCampania', 'proxyLookup', 'authorizedResource', 'oimProxyAtencionsiniestrosagricola', 'mpSpin', 'mModalAlert'];
        function detalleAvisoSiniestroController($scope, $filter, $state, $stateParams, $http, $q, $timeout, $uibModal, oimClaims, agricolaUtilities, proxyAgricolaSecurity, proxyAviso, proxyCampania, proxyLookup, authorizedResource, oimURL, mpSpin, mModalAlert) {

            var vmDet = this;
            var regexGeo = /\-\d{1,2}\.\d{1,6}$/g;
            vmDet.formDataSave = [];
            $scope.listaFechaSiembra = [];
            vmDet.paramsDatosGenerales = {
                CodAviso: ""
            };
            var nombreUsuario = "";
            var byte = 1000;
            var kb = 3072;
            var maxKbSize = kb * byte;
            $scope.maxDateFecActual = new Date();
            var fechaIniVigencia;
            var fechaFinVigencia;
            vmDet.$onInit = function () {
                mpSpin.start('Cargando, por favor espere...');
                var groupApplication = parseInt(oimClaims.userSubType);
                groupApplication = 1; //default
                proxyAgricolaSecurity.GetRole().then(function (response) {
                    if(response.codRol !="ADMINISTRADOR"){
                        nombreUsuario = authorizedResource.profile.loginUserName;
                    }
                    if (response != undefined && (response.codRol == "ADMINISTRADOR" || response.codRol == "AJUSTADOR")) {
                        iniciarDetalleAviso();
                    } else {
                        mpSpin.end();
                        mModalAlert.showError("No puede acceder al Detalle de Aviso Siniestro", "Error").then(function (response) {
                            $state.go('home', undefined, { reload: true, inherit: false });
                        }, function (error) {
                            window.location.href = '/';
                        });
                    }
                    $scope.idRol = response.codRol;
                }, function (response) {
                    mpSpin.end();
                    mModalAlert.showError("No puede acceder al Detalle de Aviso Siniestro", "Error").then(function (response) {
                        $state.go('home', undefined, { reload: true, inherit: false });
                    }, function (error) {
                        window.location.href = '/';
                    });
                });
            }

            function iniciarDetalleAviso() {
                var listPromises = [];
                mpSpin.start('Cargando información, por favor espere...');
                $scope.codigoAviso = $stateParams.idAviso;
                $scope.codigoCampania = $stateParams.idCampania;
                vmDet.codigoBusquedaDetalle = { "CodAviso": $stateParams.idAviso };
                var pTipoParticipante = { "cmstro": "6" };
                var pTipoDocumento = { "cmstro": "11" };
                var pDeclaracion = { "cmstro": "7" };
                var pEvaluacion = { "cmstro": "15" };

                $scope.step1Eval2 = false;
                $scope.step1Eval3 = false;
                $scope.showCrtlTrabajoCampo = true;

                $scope.stepActivo = 0;
                $scope.executeDetalle = true;

                $scope.nuevoLote = true;
                $scope.abrirNuevoLote = false;
                $scope.continuarStep3 = false;

                $scope.format = 'dd/MM/yyyy';
                $scope.maxDateSteps = new Date();
                $scope.noResultParticipant = false;
                $scope.maxLengthDoc = 0;
                $scope.maxLengthDoc3 = 0;
                $scope.loteCalculo = {};
                $scope.nroLotesMax = 0;
                $scope.validEvaluaRequerida = true;
                $scope.validDiferirFecha = true;

                $scope.listaLotes = [];
                $scope.estadoLote = 1;
                $scope.estadoIdLote = -1;
                $scope.validSuperficie = true;
                $scope.validRendimiento = true;
                $scope.validSuperficieCero = true;
                $scope.validRendimientoCero = true;
                $scope.validLatitud = true;
                $scope.validLongitud = true;
                $scope.validProduccion = true;

                $scope.arrayFiles = [];
                $scope.validaFechaFirstFifteenth = true;

                listPromises.push(showDatosGenerales());
                listPromises.push(getTipoParticipante(pTipoParticipante));
                listPromises.push(getTipoDocumento(pTipoDocumento));
                listPromises.push(getDeclaracion(pDeclaracion));
                listPromises.push(getEvaluacion(pEvaluacion));

                $q.all(listPromises).then(function (result) {
                    var iDatosGenerales = result.map(function (o) { return o.id; }).indexOf('datosGenerales');

                    if (result[iDatosGenerales].operationCode == 200) {
                        var listPostPromises = [];
                        listPostPromises.push(showAjusteDetalle());
                        listPostPromises.push(getNroLotesCampania(result[iDatosGenerales].codCampania));
                        listPostPromises.push(reloadFiltersData('tsnstro', { cmstro: "3", prmtro1: "", prmtro2: result[iDatosGenerales].codCampania, prmtro3: "", prmtro4: "" }));
                        listPostPromises.push(reloadFiltersData('efnlgco', { cmstro: "104", prmtro1: result[iDatosGenerales].codCultivo, prmtro2: "", prmtro3: result[iDatosGenerales].codCampania, prmtro4: "" }));

                        $q.all(listPostPromises).then(function (result) {
                            var iDatosDetalle = result.map(function (o) { return o.id; }).indexOf('datosDetalle');
                            if (result[iDatosDetalle].operationCode == 200) {
                                mpSpin.end();
                            } else {
                                mpSpin.end();
                                mModalAlert.showError("Ocurrio un error el mostrar la información", "Error");
                            }
                        });
                    } else {
                        mpSpin.end();
                        mModalAlert.showError("Ocurrio un error el mostrar la información", "Error");
                    }
                });

                $scope.upDatosAjuste = false;
                $scope.upDatosCampo = false;
                $scope.upLote = false;
                $scope.upDatosFinales = false;
                $scope.upDocumentos = false;
            }
            $scope.descargarLogReapertura = function(){
                mpSpin.start('Cargando, por favor espere...');
                var url = oimURL.endpoint + 'api/avisos/'+ $scope.codigoCampania+'/'+ $scope.codigoAviso;
                $http.get(
                    url,
                    { responseType: "arraybuffer" })
                    .success(
                        function (data, status, headers) {
                            var type = headers('Content-Type');
                            var defaultFileName = "Log_" + $scope.codigoCampania + "_" + $scope.codigoAviso + ".xlsx";
    
                            defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
    
                            var blob = new Blob([data], { type: type });
                            var link = document.createElement('a');
                            link.href = window.URL.createObjectURL(blob);
                            link.download = defaultFileName;
                            link.click();
    
                            mpSpin.end();
                        }, function (data, status) {
                            mpSpin.end();
                        })
                    .error(function (data, status, headers) {
                        mModalAlert.showWarning("Ocurrió un error al descargar el archivo, inténtelo nuevamente", "");
                    });
            }

            $scope.descargaExcel = function () {
                mpSpin.start();

                var params = {
                    CodAviso: $scope.codigoAviso,
                    CodCampania: "",
                    FecIni: "",
                    FecFin: "",
                    CodCultivo: "",
                    CodRegion: "",
                    CodProvincia: "",
                    CodDistrito: "",
                    CodSectorEst: "",
                    CodEstado: ""
                }

                var url = oimURL.endpoint + 'api/avisos/ListaExcel';

                $http.post(
                    url,
                    params,
                    { responseType: "arraybuffer" })
                    .success(
                        function (data, status, headers) {
                            var type = headers('Content-Type');
                            var disposition = headers('Content-Disposition');
                            var defaultFileName = 'AvisoSiniestro.xlsx';

                            if (disposition) {
                                var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
                                if (match[1]) defaultFileName = match[1];
                            }

                            defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');

                            var blob = new Blob([data], { type: type });
                            var link = document.createElement('a');
                            link.href = window.URL.createObjectURL(blob);
                            link.download = defaultFileName;
                            link.click();

                            mpSpin.end();
                        }, function (data, status) {
                            mpSpin.end();
                            mModalAlert.showWarning("Ocurrió un error al descargar el archivo, inténtelo nuevamente", "");
                        })
                    .error(function (data, status, headers) {
                        mpSpin.end();
                        mModalAlert.showWarning("Ocurrió un error al descargar el archivo, inténtelo nuevamente", "");
                    });
            }

            function showDatosGenerales() {
                var deferred = $q.defer();
                vmDet.paramsDatosGenerales = {
                    CodAviso: $scope.codigoAviso,
                    CodCampania: $scope.codigoCampania
                };
                var params = vmDet.paramsDatosGenerales;

                proxyAviso.DetalleAviso(params).then(function (response) {
                    if (response.operationCode == 200) {
                        $scope.objAvisoDatosGenerales = response.data;
                        Object.assign($scope.objAvisoDatosGenerales, {
                            montoSeguraTotal: (response.data.montoAseguradoHA !== undefined && response.data.superficieAsegurada !== undefined ?
                                (parseFloat(response.data.montoAseguradoHA) * parseFloat(response.data.superficieAsegurada)).toFixed(2) : '')
                        });
                        $scope.codEstado = response.data.codEstado;
                        switch (response.data.codEstado) {
                            case "1":
                                $scope.showBtAjuste = true;
                                $scope.iniciarAjuste = false;
                                $scope.upGeneral = false;
                                break;
                            case "2":
                                $scope.showBtAjuste = false;
                                $scope.iniciarAjuste = true;
                                $scope.upGeneral = true;
                                break;
                            case "3":
                                $scope.showBtAjuste = false;
                                $scope.iniciarAjuste = true;
                                $scope.upGeneral = false;
                                break;
                            case "4":
                                $scope.showBtAjuste = false;
                                $scope.iniciarAjuste = true;
                                $scope.upGeneral = false;
                                break;
                        }

                        Object.assign(response.data, { id: 'datosGenerales', operationCode: 200 });
                        deferred.resolve(response.data);
                    } else {
                        Object.assign(response, { id: 'datosGenerales', operationCode: 400 });
                        deferred.resolve(response);
                    }
                }, function (response) {
                    Object.assign(response, { id: 'datosGenerales', operationCode: 400 });
                    deferred.resolve(response);
                });

                return deferred.promise;
            }
            
            function evaluarFechaSiembra(fechasiembra){
                var fecIni = agricolaUtilities.toDate(fechaIniVigencia);
                var fecFin = agricolaUtilities.toDate(fechaFinVigencia);
                var fecSiembra = agricolaUtilities.toDate(fechasiembra);
                if(fecSiembra>= fecFin){                    
                return fechaFinVigencia;
                }
                else if(fecIni>= fecSiembra){
                    return fechaIniVigencia;
                }
                else{
                    return fechasiembra;
                }
            }
            
            function preparedVigencias() {
                var fecIniVigencia = fechaIniVigencia.substr(6, 4) + fechaIniVigencia.substr(3, 2) + fechaIniVigencia.substr(0, 2);
                var fecFinVigencia = fechaFinVigencia.substr(6, 4) + fechaFinVigencia.substr(3, 2) + fechaFinVigencia.substr(0, 2);
                var wFecActual = $filter('date')(new Date(), 'yyyyMMdd');
                var wFecFin = fecFinVigencia;
                
                if (wFecActual <= fecFinVigencia) {
                    var vDiaFecActual = new Date();
                    if(vDiaFecActual.getDate()>= 15){
                        vDiaFecActual.setDate(15);
                    }else{
                        vDiaFecActual.setDate(1);
                    }                    
                    wFecFin =  $filter('date')(vDiaFecActual, 'yyyyMMdd');                    
                }                
                for (var i = fecIniVigencia; i <= wFecFin; i++) {
                    var wCi = i + "";
                    if (((wCi.substr(6, 2) * 1) === 1 || (wCi.substr(6, 2) * 1) === 15) && (wCi.substr(4, 2) * 1) >= 1 && (wCi.substr(4, 2) * 1) <= 12) {
                        var wDescrip = wCi.substr(6, 2) + "/" + wCi.substr(4, 2) + "/" + wCi.substr(0, 4);
                        var item = {
                            codigo: wDescrip,
                            descripcion: wDescrip
                        };                        
                        $scope.listaFechaSiembra.push(item);
                  
                    }
                }
                var objSiembra = {};
                var fechaSiembra = $scope.listaFechaSiembra.filter(function(item){
                    if(objSiembra.hasOwnProperty(item.codigo)){
                        return false;
                    }else{
                        objSiembra[item.codigo] = true;
                        return true;
                    }
                });
                    $scope.listaFechaSiembra = fechaSiembra;
            }

            function getTipoParticipante(param) {
                var deferred = $q.defer();
                proxyLookup.GetFiltros(param, true).then(function (response) {
                    if (response.operationCode === 200 && response.data.length > 0) {
                        $scope.dsTipoPart = response.data;
                        $scope.mTipoPart = ((response.data.map(function (o) { return o.codigo; }).indexOf("P02")) >= 0 ? { codigo: "P02" } : { codigo: null });
                        $scope.dsTipoPart2 = response.data;
                        $scope.mTipoPart2 = ((response.data.map(function (o) { return o.codigo; }).indexOf("P02")) >= 0 ? { codigo: "P02" } : { codigo: null });
                        Object.assign(response.data, { id: 'datosTipoParticipante', operationCode: 200 });
                        deferred.resolve(response.data);
                    } else {
                        Object.assign(response, { id: 'datosTipoParticipante', operationCode: 400 });
                        deferred.resolve(response);
                    }
                }, function (response) {
                    Object.assign(response, { id: 'datosTipoParticipante', operationCode: 400 });
                    deferred.resolve(response);
                });
                return deferred.promise;
            }

            function getTipoDocumento(param) {
                var deferred = $q.defer();
                proxyLookup.GetFiltros(param, true).then(function (response) {
                    if (response.operationCode === 200) {
                        $scope.dsTipoDocument = response.data;
                        $scope.dsTipoDocument2 = response.data;
                        $scope.mTipoDocument = ((response.data.map(function (o) { return o.codigo; }).indexOf("DNI")) >= 0 ? { codigo: "DNI" } : { codigo: null });
                        $scope.mTipoDocument2 = ((response.data.map(function (o) { return o.codigo; }).indexOf("DNI")) >= 0 ? { codigo: "DNI" } : { codigo: null });
                        $scope.mTipoDocument3 = ((response.data.map(function (o) { return o.codigo; }).indexOf("DNI")) >= 0 ? { codigo: "DNI" } : { codigo: null });
                        $scope.maxLengthDoc = 8;
                        $scope.maxLengthDoc2 = 8;
                        $scope.maxLengthDoc3 = 8;
                        Object.assign(response.data, { id: 'datosTipoDocumento', operationCode: 200 });
                        deferred.resolve(response.data);
                    } else {
                        Object.assign(response, { id: 'datosTipoDocumento', operationCode: 400 });
                        deferred.resolve(response);
                    }
                }, function (response) {
                    Object.assign(response, { id: 'datosTipoDocumento', operationCode: 400 });
                    deferred.resolve(response);
                });
                return deferred.promise;
            }

            function getDeclaracion(param) {
                var deferred = $q.defer();
                proxyLookup.GetFiltros(param, true).then(function (response) {
                    if (response.operationCode === 200) {
                        $scope.dsDeclaracion = response.data;
                        Object.assign(response.data, { id: 'datosDeclaracion', operationCode: 200 });
                        deferred.resolve(response.data);
                    } else {
                        Object.assign(response, { id: 'datosDeclaracion', operationCode: 400 });
                        deferred.resolve(response);
                    }
                }, function (response) {
                    Object.assign(response, { id: 'datosDeclaracion', operationCode: 400 });
                    deferred.resolve(response);
                });
                return deferred.promise;
            }

            function getEvaluacion(param) {
                var deferred = $q.defer();
                proxyLookup.GetFiltros(param, true).then(function (response) {
                    if (response.operationCode === 200) {
                        $scope.dsEvaluaRequerida = response.data.sort(agricolaUtilities.orderCodeMaestro);
                        Object.assign(response.data, { id: 'datosEvaluacion', operationCode: 200 });
                        deferred.resolve(response.data);
                    } else {
                        Object.assign(response, { id: 'datosEvaluacion', operationCode: 400 });
                        deferred.resolve(response);
                    }
                }, function (response) {
                    Object.assign(response, { id: 'datosEvaluacion', operationCode: 400 });
                    deferred.resolve(response);
                });
                return deferred.promise;
            }

            function showAjusteDetalle() {
                var deferred = $q.defer();
                mpSpin.start('Cargando información, por favor espere...');
                proxyAviso.DetalleAjuste(vmDet.paramsDatosGenerales).then(function (response) {
                    if (response.operationCode === 200) {
                        if (response.data.paso !== undefined) {
                            var listPostDetalleProm = [];
                            $scope.ajusteDetalle = response.data;
                            $scope.stepActivo = (response.data.paso !== undefined ? (response.data.paso == 5 ? 5 : response.data.paso + 1) : 0);
                            $scope.showBtEditar = ($scope.objAvisoDatosGenerales.codEstado === "2" ? true : false);
                            $scope.showFinalizar = ($scope.objAvisoDatosGenerales.codEstado === "2" ? true : false);
                            $scope.listaLotes = response.data.lotes;
                            $scope.mEvaluaRequerida = ($scope.ajusteDetalle.requTrasEvaluacion === "" ? 1 : $scope.ajusteDetalle.requTrasEvaluacion);

                            listPostDetalleProm.push(loteCalculosStep3());
                            listPostDetalleProm.push(detalleStep4(response.data.lotes));
                            listPostDetalleProm.push(getChevronDetale());
                            listPostDetalleProm.push(showSteps(response.data.paso, response.data.requTrasEvaluacion));

                            $q.all(listPostDetalleProm).then(function (result) {
                                deferred.resolve({ id: 'datosDetalle', operationCode: 200 });
                            });
                        } else {
                            showSteps(0, null);
                            Object.assign(response.data, { id: 'datosDetalle', operationCode: 200 });
                            deferred.resolve(response.data);
                        }
                    } else {
                        Object.assign(response, { id: 'datosDetalle', operationCode: 400 });
                        deferred.resolve(response);
                    }
                }, function (response) {
                    Object.assign(response, { id: 'datosDetalle', operationCode: 400 });
                    deferred.resolve(response);
                });

                return deferred.promise;
            }

            function getNroLotesCampania(codCampania) {
                var deferred = $q.defer();
                var params = {
                    codCamp: codCampania,
                    usro: nombreUsuario
                }
                proxyCampania.GetCampaniaActiva(params).then(function (response) {
                    if (response.operationCode === 200) {
                        $scope.nroLotesMax = (response.data !== undefined && response.data.nMaxLotePermitido !== undefined ? response.data.nMaxLotePermitido : 0);
                        Object.assign(response.data, { id: 'datosNroLotesCampania', operationCode: 200 });
                        deferred.resolve(response.data);
                        fechaIniVigencia = response.data.fecIni;
                        fechaFinVigencia = response.data.fecFin;
                        preparedVigencias();
                    } else {
                        Object.assign(response, { id: 'datosNroLotesCampania', operationCode: 400 });
                        deferred.resolve(response);
                    }
                }, function (response) {
                    Object.assign(response, { id: 'datosNroLotesCampania', operationCode: 400 });
                    deferred.resolve(response);
                });
                return deferred.promise;
            }

            function reloadFiltersData(search, params) {
                var deferred = $q.defer();
                switch (search) {
                    case 'tsnstro':
                        proxyLookup.GetFiltros(params).then(function (response) {
                            if (response.operationCode == 200) {
                                $scope.listaTipoSiniestro = response.data;
                                Object.assign(response.data, { id: 'datosTipoSiniestro', operationCode: 200 });
                                deferred.resolve(response.data);
                            } else {
                                Object.assign(response, { id: 'datosTipoSiniestro', operationCode: 400 });
                                deferred.resolve(response);
                            }
                        }, function (response) {
                            Object.assign(response, { id: 'datosTipoSiniestro', operationCode: 400 });
                            deferred.resolve(response);
                        });
                        break;
                    case 'efnlgco':
                        if (params.prmtro1) {
                            proxyLookup.GetFiltros(params).then(function (response) {
                                if (response.operationCode == 200) {
                                    $scope.listaEstadoFenologico = response.data;
                                    Object.assign(response.data, { id: 'datosEstadoFenologico', operationCode: 200 });
                                    deferred.resolve(response.data);
                                } else {
                                    Object.assign(response, { id: 'datosEstadoFenologico', operationCode: 400 });
                                    deferred.resolve(response);
                                }
                            }, function (response) {
                                Object.assign(response, { id: 'datosEstadoFenologico', operationCode: 400 });
                                deferred.resolve(response);
                            });
                        } else {
                            $scope.listaEstadoFenologico = [];
                            deferred.resolve({ id: 'datosEstadoFenologico', operationCode: 400 });
                        }
                        break;
                }
                return deferred.promise;
            }

            function showSteps(stepNumber, EvalType) {
                switch (stepNumber) {
                    case 0:
                        $scope.step1save = false;
                        $scope.step2save = false;
                        $scope.prevFormStep2 = true;
                        $scope.step3save = false;
                        $scope.prevFormStep3 = true;
                        $scope.step4save = false;
                        $scope.prevFormStep4 = true;
                        $scope.step5save = false;
                        $scope.prevFormStep5 = true;
                        break;
                    case 1:
                        switch (EvalType) {
                            case "1":
                                $scope.step1save = true;
                                $scope.step2save = false;
                                $scope.prevFormStep2 = false;
                                $scope.step3save = false;
                                $scope.prevFormStep3 = true;
                                $scope.step4save = false;
                                $scope.prevFormStep4 = true;
                                $scope.step5save = false;
                                $scope.prevFormStep5 = true;

                                $scope.mTipoPart2 = ($scope.ajusteDetalle.participante1.codTipPrsona !== undefined ? { codigo: $scope.ajusteDetalle.participante1.codTipPrsona } : { codigo: null });
                                $scope.mTipoDocument2 = ($scope.ajusteDetalle.participante1.tipDocum !== undefined ? { codigo: $scope.ajusteDetalle.participante1.tipDocum } : { codigo: null });
                                switch ($scope.ajusteDetalle.participante1.tipDocum) {
                                    case "CEX":
                                        $scope.maxLengthDoc2 = 12;
                                        break;
                                    case "PAS":
                                        $scope.maxLengthDoc2 = 12;
                                        break;
                                    case "DNI":
                                        $scope.maxLengthDoc2 = 8;
                                        break;
                                    case "RUC":
                                        $scope.maxLengthDoc2 = 11;
                                        break;
                                    default:
                                        $scope.maxLengthDoc2 = 15;
                                        break;
                                };
                                $scope.mNumDocument2 = ($scope.ajusteDetalle.participante1.codDocum !== undefined ? $scope.ajusteDetalle.participante1.codDocum : undefined);
                                $scope.mNombre2 = ($scope.ajusteDetalle.participante1.nombre !== undefined ? $scope.ajusteDetalle.participante1.nombre : undefined);
                                $scope.mApellidoPat2 = ($scope.ajusteDetalle.participante1.apepatrno !== undefined ? $scope.ajusteDetalle.participante1.apepatrno : undefined);
                                $scope.mApellidoMat2 = ($scope.ajusteDetalle.participante1.apematrno !== undefined ? $scope.ajusteDetalle.participante1.apematrno : undefined);
                                break;
                            case "2":
                                $scope.step1save = true;
                                $scope.showCrtlTrabajoCampo = false;
                                $scope.step5save = false;
                                $scope.prevFormStep5 = false;
                                break;
                            case "3":
                                $scope.step1save = true;
                                $scope.showCrtlTrabajoCampo = false;
                                $scope.step5save = false;
                                $scope.prevFormStep5 = false;
                                break;
                        }
                        break;
                    case 2:
                        $scope.step1save = true;
                        $scope.step2save = true;
                        $scope.prevFormStep2 = false;
                        $scope.step3save = false;
                        $scope.prevFormStep3 = false;
                        $scope.step4save = false;
                        $scope.prevFormStep4 = true;
                        $scope.step5save = false;
                        $scope.prevFormStep5 = true;
                        break;
                    case 3:
                        $scope.step1save = true;
                        $scope.step2save = true;
                        $scope.prevFormStep2 = false;
                        $scope.step3save = true;
                        $scope.prevFormStep3 = false;
                        $scope.step4save = false;
                        $scope.prevFormStep4 = false;
                        $scope.step5save = false;
                        $scope.prevFormStep5 = true;
                        break;
                    case 4:
                        $scope.step1save = true;
                        $scope.step2save = true;
                        $scope.prevFormStep2 = false;
                        $scope.step3save = true;
                        $scope.prevFormStep3 = false;
                        $scope.step4save = true;
                        $scope.prevFormStep4 = false;
                        $scope.step5save = false;
                        $scope.prevFormStep5 = false;
                        break;
                    case 5:
                        switch (EvalType) {
                            case "1":
                                $scope.step1save = true;
                                $scope.step2save = true;
                                $scope.prevFormStep2 = false;
                                $scope.step3save = true;
                                $scope.prevFormStep3 = false;
                                $scope.step4save = true;
                                $scope.prevFormStep4 = false;
                                $scope.step5save = ($scope.ajusteDetalle.documentos.length > 0 ? true : false);
                                $scope.prevFormStep5 = false;
                                $scope.showFinalizar = ($scope.ajusteDetalle.documentos.length > 0 ? true : false);
                                break;
                            case "2":
                                $scope.step1save = true;
                                $scope.showCrtlTrabajoCampo = false;
                                $scope.step5save = ($scope.ajusteDetalle.documentos.length > 0 ? true : false);
                                $scope.prevFormStep5 = false;
                                $scope.showFinalizar = ($scope.ajusteDetalle.documentos.length > 0 ? true : false);
                                break;
                            case "3":
                                $scope.step1save = true;
                                $scope.showCrtlTrabajoCampo = false;
                                $scope.step5save = ($scope.ajusteDetalle.documentos.length > 0 ? true : false);;
                                $scope.prevFormStep5 = false;
                                $scope.showFinalizar = ($scope.ajusteDetalle.documentos.length > 0 ? true : false);
                                break;
                        }
                        break;
                }
            }

            $scope.clickChevronGeneral = function (boolChevron) {
                $scope.upGeneral = boolChevron;
            }

            $scope.showAjuste = function () {
                mpSpin.start('Actualizando información, por favor espere...');
                vmDet.formDataSave.step0 = {
                    "Aviso": {
                        "CodCampania": $scope.codigoCampania,
                        "CodAviso": $scope.codigoAviso
                    },
                    "Usuario": authorizedResource.profile.loginUserName,
                    "Paso": 0
                }
                proxyAviso.AjustarAviso($scope.codigoCampania,$scope.codigoAviso,vmDet.formDataSave.step0).then(function (response) {
                    if (response.operationCode == 200) {
                        iniciarDetalleAviso();
                    } else {
                        mpSpin.end();
                        mModalAlert.showError('Ocurrio un error al iniciar el ajuste', 'Error');
                    }
                }, function (response) {
                    mpSpin.end();
                    mModalAlert.showError('Ocurrio un error al iniciar el ajuste', 'Error');
                });
            }

            //STEP 1
            $scope.clickChevronDatosAjuste = function (boolChevron) {
                $scope.upDatosAjuste = boolChevron;
            }

            $scope.showCrtlEval = function (valueEvaluacion) {
                $scope.mObservacionEvalua = undefined;
                $scope.mFechaDiferir = undefined;
                $scope.validEvaluaRequerida = true;
                $scope.mEvaluaRequerida = valueEvaluacion;

                if (valueEvaluacion === '2') {
                    $scope.step1Eval2 = true;
                    $scope.step1Eval3 = false;
                    $scope.showCrtlTrabajoCampo = false;
                    $scope.validDiferirFecha = true;
                    $scope.mObservacionEvalua = 'No se realiza la evaluación de campo, porque los daños en el cultivo asegurado no son significativos, por lo tanto, el asegurado desiste del presente reclamo y se declara no indemnizable. Si hubiera nuevos siniestros estos podrán ser avisados por el asegurado.';
                } else if (valueEvaluacion === '3') {
                    $scope.step1Eval2 = true;
                    $scope.step1Eval3 = true;
                    $scope.showCrtlTrabajoCampo = false;
                    $scope.validDiferirFecha = true;
                    $scope.mObservacionEvalua = '';
                }
                else {
                    $scope.step1Eval2 = false;
                    $scope.step1Eval3 = false;
                    $scope.showCrtlTrabajoCampo = true;
                    $scope.validDiferirFecha = true;
                }
                $scope.frmAjuste1.$setPristine();
            }

            $scope.continueStep1 = function () {
                $scope.step1save = false;
                $scope.showFinalizar = false;
                $scope.stepActivo = 1;
                $scope.mEspeAsignado = ($scope.ajusteDetalle.especialistaAsignado !== undefined ? $scope.ajusteDetalle.especialistaAsignado : undefined);
                $scope.mActaInspec = ($scope.ajusteDetalle.nroActaInspeccion !== undefined ? $scope.ajusteDetalle.nroActaInspeccion : undefined);
                $scope.mFechaInspec = ($scope.ajusteDetalle.fecInspeccion !== undefined ? agricolaUtilities.toDate($scope.ajusteDetalle.fecInspeccion) : undefined);
                $scope.mTipoPart = ($scope.ajusteDetalle.participante1.codTipPrsona !== undefined ? { codigo: $scope.ajusteDetalle.participante1.codTipPrsona } : { codigo: null });
                $scope.mTipoDocument = ($scope.ajusteDetalle.participante1.tipDocum !== undefined ? { codigo: $scope.ajusteDetalle.participante1.tipDocum } : { codigo: null });
                switch ($scope.ajusteDetalle.participante1.tipDocum) {
                    case "CEX":
                        $scope.maxLengthDoc = 12;
                        break;
                    case "PAS":
                        $scope.maxLengthDoc = 12;
                        break;
                    case "DNI":
                        $scope.maxLengthDoc = 8;
                        break;
                    case "RUC":
                        $scope.maxLengthDoc = 11;
                        break;
                    default:
                        $scope.maxLengthDoc = 15;
                        break;
                };

                $scope.mNumDocument = ($scope.ajusteDetalle.participante1.codDocum !== undefined ? $scope.ajusteDetalle.participante1.codDocum : undefined);
                $scope.mNombre = ($scope.ajusteDetalle.participante1.nombre !== undefined ? $scope.ajusteDetalle.participante1.nombre : undefined);
                $scope.mApellidoPat = ($scope.ajusteDetalle.participante1.apepatrno !== undefined ? $scope.ajusteDetalle.participante1.apepatrno : undefined);
                $scope.mApellidoMat = ($scope.ajusteDetalle.participante1.apematrno !== undefined ? $scope.ajusteDetalle.participante1.apematrno : undefined);
                $scope.mEvaluaRequerida = ($scope.ajusteDetalle.requTrasEvaluacion !== undefined ? $scope.ajusteDetalle.requTrasEvaluacion : undefined);
                $scope.step1Eval2 = ($scope.ajusteDetalle.requTrasEvaluacion === "2" || $scope.ajusteDetalle.requTrasEvaluacion === "3" ? true : false);
                $scope.mObservacionEvalua = ($scope.ajusteDetalle.requTrasEvaluacion === "2" || $scope.ajusteDetalle.requTrasEvaluacion === "3" ? $scope.ajusteDetalle.observacion : undefined);
                $scope.step1Eval3 = ($scope.ajusteDetalle.requTrasEvaluacion === "3" ? true : false);
                $scope.mFechaDiferir = ($scope.ajusteDetalle.requTrasEvaluacion === "3" ? agricolaUtilities.toDate($scope.ajusteDetalle.fecDiferirHasta) : undefined);
            }

            $scope.saveStep1 = function () {
                var deferred = $q.defer();
                mpSpin.start('Validando la información, por favor espere...');
                $scope.frmAjuste1.markAsPristine();
                $scope.validEvaluaRequerida = ($scope.frmAjuste1.nEvaluaRequerida.$valid === true ? true : false);
                $scope.validDiferirFecha = ($scope.mEvaluaRequerida !== "3" ||
                    ($scope.mEvaluaRequerida === "3" && $scope.mFechaDiferir !== undefined && $scope.mFechaDiferir !== '') ? true : false);

                if ($scope.frmAjuste1.$valid && $scope.validEvaluaRequerida && $scope.validDiferirFecha) {
                    vmDet.formDataSave.step1 = {
                        "Aviso": {
                            "CodCampania": $scope.codigoCampania,
                            "CodAviso": $scope.codigoAviso
                        },
                        "FecInspeccion": agricolaUtilities.formatearFecha($scope.mFechaInspec),
                        "NroActaInspeccion": $scope.mActaInspec,
                        "EspecialistaAsignado": $scope.mEspeAsignado,
                        "RequTrasEvaluacion": $scope.mEvaluaRequerida,
                        "Observacion": ($scope.mEvaluaRequerida === "2" || $scope.mEvaluaRequerida === "3" ? ($scope.mObservacionEvalua === "" ? null : $scope.mObservacionEvalua) : null),
                        "FecDiferirHasta": ($scope.mEvaluaRequerida === "3" ? agricolaUtilities.formatearFecha($scope.mFechaDiferir) : null),
                        "Participante1": {
                            "TipPer": $scope.mTipoPart.codigo,
                            "TipDocum": $scope.mTipoDocument.codigo,
                            "CodDocum": $scope.mNumDocument,
                            "NOMBRE": $scope.mNombre,
                            "APEPATRNO": $scope.mApellidoPat,
                            "APEMATRNO": $scope.mApellidoMat,
                        },
                        "Usuario": authorizedResource.profile.loginUserName,
                        "Paso": 1
                    }

                    proxyAviso.AjustarAviso($scope.codigoCampania,$scope.codigoAviso,vmDet.formDataSave.step1).then(function (response) {
                        if (response.operationCode === 200) {
                            if ($scope.executeDetalle === true) {
                                var listPromise = [];
                                listPromise.push(showAjusteDetalle());
                                $q.all(listPromise).then(function (result) {                            
                                    var indexDetalle = result.map(function (o) { return o.id; }).indexOf('datosDetalle');
                                    if (result[indexDetalle].operationCode == 200) {
                                        mpSpin.end();
                                        deferred.reject('PASO 1: Registro con éxito');
                                    } else {
                                        mpSpin.end();
                                        mModalAlert.showError("Ocurrio un error el mostrar la información", "Error");
                                        deferred.reject('PASO 1: Error en el registro');
                                    }
                                });
                            } else {
                                mpSpin.end();
                                deferred.reject('PASO 1: Registro con éxito');
                                $state.go('consultaAvisoSiniestro', undefined, { reload: true, inherit: false });
                            }
                        }
                        else {
                            mpSpin.end();
                            mModalAlert.showError("Ocurrio un error al registrar los Datos de Ajuste", "Error");
                            deferred.reject('PASO 1: Error en el registro');
                        }
                    }, function (response) {
                        mpSpin.end();
                        mModalAlert.showError("Ocurrio un error al registrar los Datos de Ajuste", "Error");
                        deferred.reject('PASO 1: Error en el registro');
                    });
                } else {
                    mpSpin.end();
                    mModalAlert.showWarning("Verifique la información ingresada en el formulario", "");
                    deferred.reject('PASO 1: Error en el formulario');
                }
                return deferred.promise;
            }

            $scope.$watch('mFechaDiferir', function (v) {
                $scope.validDiferirFecha = (v != undefined ? true : false);
            });

            //STEP 2
            $scope.clickChevronDatosCampo = function (boolChevron) {
                $scope.upDatosCampo = boolChevron;
            }

            $scope.continueStep2 = function () {
                $scope.step2save = false;
                $scope.showFinalizar = false;
                $scope.stepActivo = 2;
                $scope.mDeclaracion = ($scope.ajusteDetalle.tipDictamen !== undefined ? { codigo: $scope.ajusteDetalle.tipDictamen } : { codigo: null });
                $scope.mFechaProgAjuste = ($scope.ajusteDetalle.fecProgAjuste !== undefined ? agricolaUtilities.toDate($scope.ajusteDetalle.fecProgAjuste) : undefined);
                $scope.mActaAjuste = ($scope.ajusteDetalle.nroActaAjuste !== undefined ? $scope.ajusteDetalle.nroActaAjuste : undefined);
                $scope.mFechaAjuste = ($scope.ajusteDetalle.fecAjusteCampo !== undefined ? agricolaUtilities.toDate($scope.ajusteDetalle.fecAjusteCampo) : undefined);
                $scope.mTipoPart2 = ($scope.ajusteDetalle.participante2.codTipPrsona != undefined ? { codigo: $scope.ajusteDetalle.participante2.codTipPrsona } : { codigo: null });
                $scope.mTipoDocument2 = ($scope.ajusteDetalle.participante2.tipDocum !== undefined ? { codigo: $scope.ajusteDetalle.participante2.tipDocum } : { codigo: null });
                switch ($scope.ajusteDetalle.participante2.tipDocum) {
                    case "CEX":
                        $scope.maxLengthDoc2 = 12;
                        break;
                    case "PAS":
                        $scope.maxLengthDoc2 = 12;
                        break;
                    case "DNI":
                        $scope.maxLengthDoc2 = 8;
                        break;
                    case "RUC":
                        $scope.maxLengthDoc2 = 11;
                        break;
                    default:
                        $scope.maxLengthDoc2 = 15;
                        break;
                };
                $scope.mNumDocument2 = ($scope.ajusteDetalle.participante2.codDocum !== undefined ? $scope.ajusteDetalle.participante2.codDocum : undefined);
                $scope.mNombre2 = ($scope.ajusteDetalle.participante2.nombre !== undefined ? $scope.ajusteDetalle.participante2.nombre : undefined);
                $scope.mApellidoPat2 = ($scope.ajusteDetalle.participante2.apepatrno !== undefined ? $scope.ajusteDetalle.participante2.apepatrno : undefined);
                $scope.mApellidoMat2 = ($scope.ajusteDetalle.participante2.apematrno !== undefined ? $scope.ajusteDetalle.participante2.apematrno : undefined);
            }

            $scope.saveStep2 = function () {
                var deferred = $q.defer();
                mpSpin.start('Validando la información, por favor espere...');
                $scope.frmAjuste2.markAsPristine();

                if ($scope.frmAjuste2.$valid) {
                    vmDet.formDataSave.step2 = {
                        "Aviso": {
                            "CodCampania": $scope.codigoCampania,
                            "CodAviso": $scope.codigoAviso
                        },
                        "TipDictamen": $scope.mDeclaracion.codigo,
                        "FecProgAjuste": agricolaUtilities.formatearFecha($scope.mFechaProgAjuste),
                        "NroActaAjuste": $scope.mActaAjuste,
                        "FecAjusteCampo": agricolaUtilities.formatearFecha($scope.mFechaAjuste),
                        "Participante2": {
                            "TipPer": $scope.mTipoPart2.codigo,
                            "TipDocum": $scope.mTipoDocument2.codigo,
                            "CodDocum": $scope.mNumDocument2,
                            "NOMBRE": $scope.mNombre2,
                            "APEPATRNO": $scope.mApellidoPat2,
                            "APEMATRNO": $scope.mApellidoMat2,
                        },
                        "Usuario": authorizedResource.profile.loginUserName,
                        "Paso": 2
                    }

                    proxyAviso.AjustarAviso($scope.codigoCampania,$scope.codigoAviso,vmDet.formDataSave.step2).then(function (response) {
                        if (response.operationCode === 200) {
                            if ($scope.executeDetalle === true) {
                                var listPromise = [];
                                listPromise.push(showAjusteDetalle());
                                $q.all(listPromise).then(function (result) {
                                    var indexDetalle = result.map(function (o) { return o.id; }).indexOf('datosDetalle');
                                    if (result[indexDetalle].operationCode == 200) {
                                        mpSpin.end();
                                        deferred.reject('PASO 2: Registro con éxito');
                                    } else {
                                        mpSpin.end();
                                        mModalAlert.showError("Ocurrio un error el mostrar la información", "Error");
                                        deferred.reject('PASO 2: Error en el registro');
                                    }
                                });
                            } else {
                                mpSpin.end();
                                deferred.reject('PASO 2: Registro con éxito');
                                $state.go('consultaAvisoSiniestro', undefined, { reload: true, inherit: false });
                            }
                        }
                        else {
                            mpSpin.end();
                            mModalAlert.showError("Ocurrio un error al registrar los Datos de Campo", "Error");
                            deferred.reject('PASO 2: Error en el registro');
                        }
                    }, function (response) {
                        mpSpin.end();
                        mModalAlert.showError("Ocurrio un error al registrar los Datos de Campo", "Error");
                        deferred.reject('PASO 2: Error en el registro');
                    });
                } else {
                    mpSpin.end();
                    mModalAlert.showWarning("Verifique la información ingresada en el formulario", "");
                    deferred.reject('PASO 2: Error en el formulario');
                }

                return deferred.promise;
            }

            //STEP 3
            $scope.clickChevronLote = function (boolChevron) {
                $scope.upLote = boolChevron;
            }

            $scope.continueStep3 = function () {
                $scope.step3save = false;
                $scope.nuevoLote = false;
                $scope.abrirNuevoLote = true;
                $scope.continuarStep3 = true;
                $scope.showFinalizar = false;
                $scope.stepActivo = 3;
            }

            //agregar nuevo lote
            $scope.openNewLote = function () {
                $scope.nuevoLote = true;
                $scope.abrirNuevoLote = false;
                $scope.continuarStep3 = false;
                //1=nuevo, 2=editar,3=eliminar
                $scope.estadoLote = 1;
                limpiarControles(3);
                $scope.changeTipDocStep3();
            }
            $scope.changeGeoposition = function (modelGeo) {
                if (modelGeo == 'mLatitud') {
                    $timeout(function () {
                        if (('' + $scope.mLatitud).length > 0) {
                            $scope.validLatitud = (('' + $scope.mLatitud).match(regexGeo) ? true : false);
                        }else{
                            $scope.validLatitud = true;
                        }
                    });
                }
                if (modelGeo == 'mLongitud') {
                    $timeout(function () {
                        if (('' + $scope.mLongitud).length > 0) {
                            $scope.validLongitud = (('' + $scope.mLongitud).match(regexGeo) ? true : false);
                        }else{
                            $scope.validLongitud = true;                            
                        }
                    });
                }
            }

            //grabar lote
            $scope.saveFinishLote = function () {
                $scope.frmAjuste3.markAsPristine();
                $scope.calcProdObtenida();
                if (typeof $scope.mLatitud === "undefined") { $scope.mLatitud = ""; }
                if (typeof $scope.mLongitud === "undefined") { $scope.mLongitud = ""; }
                if ($scope.mLatitud === "0") { $scope.mLatitud = ""; }
                if ($scope.mLongitud === "0") { $scope.mLongitud = ""; }

                var validFechaSiembra = $scope.validaFechaFirstFifteenth;
                var validSuperficie = $scope.validSuperficie;
                var validRendimiento = $scope.validRendimiento;
                var validSuperficieCero = $scope.validSuperficieCero;
                var validRendimientoCero = $scope.validRendimientoCero;
                var validProduccion = $scope.validProduccion;
                var validLatitud = $scope.validLatitud;
                var validLongitud = $scope.validLongitud;

                if (validFechaSiembra === true) {
                    if ($scope.frmAjuste3.$valid) {
                        if (validLatitud === true && validLongitud === true && validSuperficie === true && validRendimiento === true && validSuperficieCero === true && validProduccion === true) {
                            if ($scope.estadoLote === 1) {
                                $scope.listaLotes.push({
                                    "nombrecomunidad": $scope.mNombreComuni,
                                    "fechasiembra": $scope.mFechaSiembra.codigo,
                                    "codestadofenologico": $scope.mEstadoFenelog.codigo,
                                    "fechaocurrencia": agricolaUtilities.formatearFecha($scope.mFechaOcurrencia),
                                    "codtiposiniestro": $scope.mTipoSiniestro.codigo,
                                    "latitud": $scope.mLatitud,
                                    "longitud": $scope.mLongitud,
                                    "superficiesembrada": $scope.mSuperSembra,
                                    "rendimientoobtenidoha": $scope.mRendObten,
                                    "produccionobtenidolote": $scope.mProdObten,
                                    "productor": {
                                        "tipDocum": $scope.mTipoDocument3.codigo,
                                        "codDocum": $scope.mNumDocument3,
                                        "nombre": $scope.mNombre3,
                                        "apepatrno": $scope.mApellidoPat3,
                                        "apematrno": $scope.mApellidoMat3
                                    }
                                });
                            }
                            if ($scope.estadoLote === 2) {
                                var objIndex = $scope.estadoIdLote;
                                var objLote = {
                                    "nombrecomunidad": $scope.mNombreComuni,
                                    "fechasiembra": $scope.mFechaSiembra.codigo,
                                    "codestadofenologico": $scope.mEstadoFenelog.codigo,
                                    "fechaocurrencia": agricolaUtilities.formatearFecha($scope.mFechaOcurrencia),
                                    "codtiposiniestro": $scope.mTipoSiniestro.codigo,
                                    "latitud": $scope.mLatitud,
                                    "longitud": $scope.mLongitud,
                                    "superficiesembrada": $scope.mSuperSembra,
                                    "rendimientoobtenidoha": $scope.mRendObten,
                                    "produccionobtenidolote": $scope.mProdObten,
                                    "productor": {
                                        "tipDocum": $scope.mTipoDocument3.codigo,
                                        "codDocum": $scope.mNumDocument3,
                                        "nombre": $scope.mNombre3,
                                        "apepatrno": $scope.mApellidoPat3,
                                        "apematrno": $scope.mApellidoMat3
                                    }
                                };
                                $scope.listaLotes[objIndex] = objLote;
                            }
                            limpiarControles(3);
                            $scope.nuevoLote = false;
                            $scope.abrirNuevoLote = true;
                            $scope.continuarStep3 = true;
                            $scope.estadoLote = 1;
                            loteCalculosStep3();
                        }
                    }
                } else {
                    mModalAlert.showWarning("La Fecha de Siembra debe ser mayor o igual a la Fecha del Aviso: "
                        + $scope.objAvisoDatosGenerales.fecAviso + " y solo los dias 1 o 15 del mes.", "");
                }
            }

            $scope.cancelarNuevoLote = function () {
                $scope.nuevoLote = false;
                $scope.abrirNuevoLote = true;
                $scope.continuarStep3 = true;
                limpiarControles(3);
            }

            $scope.saveStep3 = function () {
                var deferred = $q.defer();
                var newListaLotes = [];
                var paramNroLotes = $scope.nroLotesMax;

                ng.forEach($scope.listaLotes, function (item, key) {
                    newListaLotes.push({
                        "NOMBRECOMUNIDAD": item.nombrecomunidad,
                        "FECHASIEMBRA": item.fechasiembra,
                        "CODESTADOFENOLOGICO": item.codestadofenologico,
                        "FECHAOCURRENCIA": item.fechaocurrencia,
                        "CODTIPOSINIESTRO": item.codtiposiniestro,
                        "LATITUD": item.latitud,
                        "LONGITUD": item.longitud,
                        "SUPERFICIESEMBRADA": item.superficiesembrada,
                        "RENDIMIENTOOBTENIDOHA": item.rendimientoobtenidoha,
                        "PRODUCCIONOBTENIDOLOTE": item.produccionobtenidolote,
                        "Productor": {
                            "TipDocum": item.productor.tipDocum,
                            "CodDocum": item.productor.codDocum,
                            "NOMBRE": item.productor.nombre,
                            "APEPATRNO": item.productor.apepatrno,
                            "APEMATRNO": item.productor.apematrno
                        }
                    });

                });

                if (newListaLotes.length > 0) {
                    vmDet.formDataSave.step3 =
                    {
                        "Aviso": {
                            "CodCampania": $scope.codigoCampania,
                            "CodAviso": $scope.codigoAviso
                        },
                        "TotPrdLote": $scope.loteCalculo.totalProducObtenida,
                        "TotSuprfcSembrada": $scope.loteCalculo.totalSuperSembrada,
                        "Lotes": newListaLotes,
                        "Usuario": authorizedResource.profile.loginUserName,
                        "Paso": 3
                    };

                    mpSpin.start('Guardando información, por favor espere...');
                    proxyAviso.AjustarAviso($scope.codigoCampania,$scope.codigoAviso,vmDet.formDataSave.step3).then(function (response) {
                        if (response.operationCode === 200) {
                            if ($scope.executeDetalle === true) {
                                var listPromise = [];
                                $scope.step3save = true;
                                $scope.nuevoLote = false;
                                $scope.abrirNuevoLote = false;
                                $scope.continuarStep3 = false;
                                listPromise.push(showAjusteDetalle());
                                $q.all(listPromise).then(function (result) {
                                    var indexDetalle = result.map(function (o) { return o.id; }).indexOf('datosDetalle');
                                    if (result[indexDetalle].operationCode == 200) {
                                        mpSpin.end();
                                        deferred.reject('PASO 3: Registro con éxito');
                                    } else {
                                        mpSpin.end();
                                        mModalAlert.showError("Ocurrio un error el mostrar la información", "Error");
                                        deferred.reject('PASO 3: Error en el registro');
                                    }
                                });
                            } else {
                                mpSpin.end();
                                deferred.reject('PASO 3: Registro con éxito');
                                $state.go('consultaAvisoSiniestro', undefined, { reload: true, inherit: false });
                            }
                        }
                        else {
                            mpSpin.end();
                            mModalAlert.showError("Ocurrio un error al registrar lote", "Error");
                            deferred.reject('PASO 3: Error en el registro');
                        }
                    }, function (response) {
                        mpSpin.end();
                        mModalAlert.showError("Ocurrio un error al registrar lote", "Error");
                        deferred.reject('PASO 3: Error en el registro');
                    });
                } else {
                    mpSpin.end();
                    mModalAlert.showWarning("Para continuar con el siguiente paso, debe tener grabado al menos un lote.", "");
                    deferred.reject('PASO 3: Error en cantidad de lotes');
                }

                return deferred.promise;
            }

            $scope.loteDeleteStep3 = function (key) {
                $uibModal.open({
                    backdrop: 'static',
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: false,
                    scope: $scope,
                    //size: 'xs',
                    //templateUrl: 'app/consultaAvisoSiniestro/components/modalDeleteLote.html',
                    template: '<mfp-modal-question data="data"></mfp-modal-question>',
                    controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                        $scope.closeModal = function () {
                            $uibModalInstance.close();
                        };
                        $scope.deleteLote = function () {
                            $scope.listaLotes.splice(key, 1);
                            var listPromises = [];
                            listPromises.push(loteCalculosStep3());

                            $q.all(listPromises).then(function () {
                                detalleStep4($scope.listaLotes);
                                $uibModalInstance.close();
                                if ($scope.listaLotes.length === 0) {
                                    $scope.openNewLote();
                                }
                            });
                        };
                        $scope.data = {
                            title: '¿Está seguro de eliminar el lote?',
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
                                    accion: $scope.deleteLote,
                                    clases: 'g-btn-verde'
                                }
                            ]
                        };
                    }]
                });
            }

            $scope.loteEditViewStep3 = function (item, key) {
                $scope.nuevoLote = true;
                $scope.abrirNuevoLote = false;
                $scope.continuarStep3 = false;
                $scope.validSuperficie = true;
                $scope.validRendimiento = true;
                $scope.validSuperficieCero = true;
                $scope.validRendimientoCero = true;
                $scope.validProduccion = true;
                $scope.estadoLote = 2;
                $scope.estadoIdLote = key;
                $scope.mNombreComuni = item.nombrecomunidad;
                $scope.mFechaSiembra =  (item.fechasiembra !== undefined ? { codigo: evaluarFechaSiembra(item.fechasiembra) } : { codigo: null });
                $scope.mEstadoFenelog = (item.codestadofenologico !== undefined ? { codigo: item.codestadofenologico } : { codigo: null });
                $scope.mFechaOcurrencia = (item.fechaocurrencia !== undefined ? agricolaUtilities.toDate(item.fechaocurrencia) : undefined);
                $scope.mTipoSiniestro = (item.codtiposiniestro !== undefined ? { codigo: item.codtiposiniestro } : { codigo: null });
                $scope.mLatitud = item.latitud.toString();
                $scope.mLongitud = item.longitud.toString();
                $scope.mSuperSembra = item.superficiesembrada;
                $scope.mRendObten = item.rendimientoobtenidoha;
                $scope.mProdObten = item.produccionobtenidolote;
                $scope.mTipoDocument3 = (item.productor.tipDocum !== undefined ? { codigo: item.productor.tipDocum } : { codigo: null });
                $scope.mNumDocument3 = item.productor.codDocum;
                $scope.mNombre3 = item.productor.nombre;
                $scope.mApellidoPat3 = item.productor.apepatrno;
                $scope.mApellidoMat3 = item.productor.apematrno;
                $scope.changeTipDocStep3();
            }

            loteCalculosStep3 = function () {
                $scope.loteCalculo.totalSuperSembrada = 0.00;
                $scope.loteCalculo.totalProducObtenida = 0.00;
                ng.forEach($scope.listaLotes, function (value, key) {
                    $scope.loteCalculo.totalSuperSembrada = ($scope.loteCalculo.totalSuperSembrada * 1) + (value.superficiesembrada * 1);
                    $scope.loteCalculo.totalProducObtenida = ($scope.loteCalculo.totalProducObtenida * 1) + (value.produccionobtenidolote * 1);
                });
                $scope.continuarStep3 = ($scope.listaLotes.length > 0 ? true : false);
            };

            $scope.calcProdObtenida = function () {
                var listPromises = [];
                var superficie = $scope.mSuperSembra;
                var redimiento = $scope.mRendObten;
                $scope.validSuperficie = ((superficie == undefined || (superficie !== undefined && superficie.toString().length <= 10)) ? true : false);
                $scope.validRendimiento = ((redimiento == undefined || (redimiento !== undefined && redimiento.toString().length <= 10)) ? true : false);
                $scope.validSuperficieCero = ((superficie > 0) ? true : false);
                $scope.validRendimientoCero = ((redimiento > 0) ? true : false);

                listPromises.push(validateSuperficie());
                listPromises.push(validateRendimiento());

                $q.all(listPromises).then(function (result) {
                    var superSembrada = ($scope.mSuperSembra !== undefined ? parseFloat($scope.mSuperSembra) : null) || 0;
                    var rendiObtenido = ($scope.mRendObten !== undefined ? parseFloat($scope.mRendObten) : null) || 0;

                    if (superSembrada !== null && rendiObtenido !== null) {
                        var resultProdObtenida = (superSembrada * rendiObtenido).toFixed(2);
                        $scope.mProdObten = resultProdObtenida;
                        $scope.validProduccion = (resultProdObtenida.toString().length > 10 ? false : true);
                    } else {
                        $scope.mProdObten = undefined;
                        $scope.validProduccion = true;
                    }
                });
            };

            function validateSuperficie() {
                var deferred = $q.defer();
                $timeout(function () {
                    var superf = $scope.mSuperSembra;
                    $scope.mSuperSembra = ((superf != undefined && superf.toString().length > 10) ? superf.toString().substring(0, 10) : superf);
                    deferred.resolve($scope.mSuperSembra);
                });
                return deferred.promise;
            }

            function validateRendimiento() {
                var deferred = $q.defer();
                $timeout(function () {
                    var rendim = $scope.mRendObten;
                    $scope.mRendObten = ((rendim != undefined && rendim.toString().length > 10) ? rendim.toString().substring(0, 10) : rendim);
                    deferred.resolve($scope.mRendObten);
                });
                return deferred.promise;
            }

            

            //STEP4
            $scope.clickChevronDatosFinales = function (boolChevron) {
                $scope.upDatosFinales = boolChevron;
            }

            detalleStep4 = function (arrayLotes) {
                if (arrayLotes !== undefined && arrayLotes.length > 0) {
                    var arrayEstadoFeno = [];
                    var arrayTipoSinies = [];
                    var arrayFecSiembra = [];

                    arrayLotes.forEach(function (value, key) {
                        arrayEstadoFeno.push(arrayLotes[key].nomestadofenologico);
                        arrayTipoSinies.push(arrayLotes[key].nomtiposiniestro);
                        arrayFecSiembra.push((arrayLotes[key].fechasiembra !== '' ? arrayLotes[key].fechasiembra.substring(0, 10) : ''));
                    });

                    var step4causa = agricolaUtilities.getMostCommon($scope.objAvisoDatosGenerales.nomTipSini, arrayTipoSinies);
                    var step4estfeno = agricolaUtilities.getMostCommon($scope.objAvisoDatosGenerales.nomEstadoFenologicoIni, arrayEstadoFeno);
                    var step4fecSiembra = agricolaUtilities.getMostCommon($scope.objAvisoDatosGenerales.fecIniSiembra, arrayFecSiembra);
                    var wrendimiento = 0;

                    if ($scope.loteCalculo.totalSuperSembrada > 0) {
                        wrendimiento = ($scope.loteCalculo.totalProducObtenida !== undefined && $scope.loteCalculo.totalSuperSembrada !== undefined ?
                            (parseFloat($scope.loteCalculo.totalProducObtenida) / parseFloat($scope.loteCalculo.totalSuperSembrada)).toFixed(2) : '');
                    }

                    $scope.listaStep4 = {
                        causa: (step4causa !== undefined ? step4causa : $scope.objAvisoDatosGenerales.nomTipSini),
                        dictamen: (($scope.loteCalculo.totalProducObtenida !== undefined && $scope.loteCalculo.totalSuperSembrada !== undefined) ? (
                            (parseFloat($scope.loteCalculo.totalProducObtenida) / parseFloat($scope.loteCalculo.totalSuperSembrada))
                                <= parseFloat($scope.objAvisoDatosGenerales.rendimientoAsegurado) ? 'INDEMNIZABLE' : 'NO INDEMNIZABLE') : ''),
                        codDictamen: (($scope.loteCalculo.totalProducObtenida !== undefined && $scope.loteCalculo.totalSuperSembrada !== undefined) ? (
                            (parseFloat($scope.loteCalculo.totalProducObtenida) / parseFloat($scope.loteCalculo.totalSuperSembrada))
                                <= parseFloat($scope.objAvisoDatosGenerales.rendimientoAsegurado) ? 'D01' : 'D02') : ''),
                        fenologia: (step4estfeno !== undefined ? step4estfeno : $scope.objAvisoDatosGenerales.nomEstadoFenologicoIni),
                        fechaSiembra: (step4fecSiembra !== undefined ? step4fecSiembra : $scope.objAvisoDatosGenerales.fecIniSiembra),
                        produccionTotal: ($scope.loteCalculo.totalProducObtenida !== undefined ? parseFloat($scope.loteCalculo.totalProducObtenida).toFixed(2) : ''),
                        totalSuperficie: ($scope.loteCalculo.totalSuperSembrada !== undefined ? parseFloat($scope.loteCalculo.totalSuperSembrada).toFixed(2) : ''),
                        redimiento: parseFloat(wrendimiento).toFixed(2),
                        montoIndemniza: ($scope.ajusteDetalle.suprfSembSecEsta !== undefined ?
                            (parseFloat($scope.objAvisoDatosGenerales.montoAseguradoHA) * parseFloat($scope.ajusteDetalle.suprfSembSecEsta)).toFixed(2) : '')
                    };
                }
                else {
                    $scope.listaStep4 = {
                        causa: $scope.objAvisoDatosGenerales.nomTipSini,
                        dictamen: '',
                        codDictamen: '',
                        fenologia: $scope.objAvisoDatosGenerales.nomEstadoFenologicoIni,
                        fechaSiembra: $scope.objAvisoDatosGenerales.fecIniSiembra,
                        produccionTotal: '',
                        totalSuperficie: '',
                        redimiento: '',
                        montoIndemniza: ($scope.ajusteDetalle.suprfSembSecEsta !== undefined ?
                            (parseFloat($scope.objAvisoDatosGenerales.montoAseguradoHA) * parseFloat($scope.ajusteDetalle.suprfSembSecEsta)).toFixed(2) : '')
                    };
                }
            }

            $scope.calcMontoIndem = function () {
                var superfSembrada = $scope.mSuperEstadis;
                if (superfSembrada !== undefined && superfSembrada !== '') {
                    $scope.listaStep4.montoIndemniza = (parseFloat($scope.objAvisoDatosGenerales.montoAseguradoHA) *
                        parseFloat(superfSembrada)).toFixed(2);
                } else {
                    $scope.listaStep4.montoIndemniza = '';
                }
            }

            $scope.continueStep4 = function () {
                $scope.step4save = false;
                $scope.showFinalizar = false;
                $scope.stepActivo = 4;
                $scope.mSuperEstadis = ($scope.ajusteDetalle.suprfSembSecEsta !== undefined ? $scope.ajusteDetalle.suprfSembSecEsta : undefined);
                $scope.mObservaciones = ($scope.ajusteDetalle.observacion != undefined ? $scope.ajusteDetalle.observacion : undefined);
            }

            $scope.saveStep4 = function () {
                var deferred = $q.defer();
                mpSpin.start('Validando la información, por favor espere...');
                $scope.frmAjuste4.markAsPristine();

                if ($scope.frmAjuste4.$valid) {
                    vmDet.formDataSave.step4 = {
                        "Aviso": {
                            "CodCampania": $scope.codigoCampania,
                            "CodAviso": $scope.codigoAviso
                        },
                        "SuprfSembSecEsta": $scope.mSuperEstadis,
                        "Observacion": $scope.mObservaciones,
                        "Usuario": authorizedResource.profile.loginUserName,
                        "Paso": 4
                    }

                    proxyAviso.AjustarAviso($scope.codigoCampania,$scope.codigoAviso,vmDet.formDataSave.step4).then(function (response) {
                        if (response.operationCode === 200) {
                            if ($scope.executeDetalle === true) {
                                var listPromise = [];
                                listPromise.push(showAjusteDetalle());
                                $q.all(listPromise).then(function (result) {
                                    var indexDetalle = result.map(function (o) { return o.id; }).indexOf('datosDetalle');
                                    if (result[indexDetalle].operationCode == 200) {
                                        mpSpin.end();
                                        deferred.reject('PASO 4: Registro con éxito');
                                    } else {
                                        mpSpin.end();
                                        mModalAlert.showError("Ocurrio un error el mostrar la información", "Error");
                                        deferred.reject('PASO 4: Error en el registro');
                                    }
                                });
                            } else {
                                mpSpin.end();
                                deferred.reject('PASO 4: Registro con éxito');
                                $state.go('consultaAvisoSiniestro', undefined, { reload: true, inherit: false });
                            }
                        }
                        else {
                            mpSpin.end();
                            mModalAlert.showError("Ocurrio un error al registar los Datos Finales", "Error");
                            deferred.reject('PASO 4: Error en el registro');
                        }
                    }, function (response) {
                        mpSpin.end();
                        mModalAlert.showError("Ocurrio un error al registar los Datos Finales", "Error");
                        deferred.reject('PASO 4: Error en el registro');
                    });
                } else {
                    mpSpin.end();
                    mModalAlert.showWarning("Verifique la información ingresada en el formulario", "");
                    deferred.reject('PASO 4: Error en el formulario');
                }

                return deferred.promise;
            }

            //STEP 5
            $scope.clickChevronDocumentos = function (boolChevron) {
                $scope.upDocumentos = boolChevron;
            }

            $scope.$watch('fileActa1', function (nv) {
                if (!(typeof nv === 'undefined')) {
                    $scope.filesAI1 = [];
                    ng.forEach(nv, function (value, key) {
                        if (value.size > maxKbSize) {
                            mModalAlert.showWarning('El archivo [' + value.name + '] en el campo Acta de Inspección 1, excede el tamaño máximo de ' + kb + ' kb.', '');
                            return void 0;
                        }
                        var validTypeFormat = validFormatFile(value.type, 'fileActa1');
                        if (validTypeFormat === false) {
                            mModalAlert.showWarning('El archivo [' + value.name + '] en el campo Acta de Inspección 1, no tiene el formato correcto, formatos admitidos: jpg, jpeg, pdf', '');
                            return void 0;
                        }
                        $scope.filesAI1.push(value);
                        var reader = new FileReader();
                        reader.readAsDataURL($scope.fileActa1[key]);
                        reader.onload = function () {
                        };
                        reader.onerror = function (error) {
                        };

                        agricolaUtilities.getBase64($scope.fileActa1[0]).then(function (result) {
                            Object.assign($scope.filesAI1[0], { base64: result.split('base64,')[1], docfileType: "ACTA DE INSPECCION 1" });
                            if ($scope.filesAI1[0].base64 === undefined) {
                                mModalAlert.showWarning("No se puede cargar archivos vacíos en " + $scope.filesAI1[0].docfileType + ", ingrese un archivo correcto.", "");
                                $scope.fileActa1 = undefined;
                                $scope.filesAI1 = undefined;
                                return void 0;
                            }
                        });
                    });
                }
            });

            $scope.$watch('fileActa2', function (nv) {
                if (!(typeof nv === 'undefined')) {
                    $scope.filesAI2 = [];
                    ng.forEach(nv, function (value, key) {
                        if (value.size > maxKbSize) {
                            mModalAlert.showError('El archivo [' + value.name + '] en el campo Acta de Inspección 2, excede el tamaño máximo de ' + kb + ' kb.', 'Error');
                            return void 0;
                        }
                        var validTypeFormat = validFormatFile(value.type, 'fileActa2');
                        if (validTypeFormat === false) {
                            mModalAlert.showWarning('El archivo [' + value.name + '] en el campo Acta de Inspección 2, no tiene el formato correcto, formatos admitidos: jpg, jpeg, pdf', '');
                            return void 0;
                        }
                        $scope.filesAI2.push(value);
                        var reader = new FileReader();
                        reader.readAsDataURL($scope.fileActa2[key]);
                        reader.onload = function () {
                        };
                        reader.onerror = function (error) {
                        };

                        agricolaUtilities.getBase64($scope.fileActa2[0]).then(function (result) {
                            Object.assign($scope.filesAI2[0], { base64: result.split('base64,')[1], docfileType: "ACTA DE INSPECCION 2" });
                            if ($scope.filesAI2[0].base64 === undefined) {
                                mModalAlert.showWarning("No se puede cargar archivos vacíos en " + $scope.filesAI2[0].docfileType + ", ingrese un archivo correcto.", "");
                                $scope.fileActa2 = undefined;
                                $scope.filesAI2 = undefined;
                                return void 0;
                            }
                        });
                    });
                }
            });

            $scope.$watch('fileActaAjuste', function (nv) {
                if (!(typeof nv === 'undefined')) {
                    $scope.filesAJU = [];
                    ng.forEach(nv, function (value, key) {
                        if (value.size > maxKbSize) {
                            mModalAlert.showError('El archivo [' + value.name + '] en el campo Acta de ajuste, excede el tamaño máximo de ' + kb + ' kb.', 'Error');
                            return void 0;
                        }
                        var validTypeFormat = validFormatFile(value.type, 'fileActaAjuste');
                        if (validTypeFormat === false) {
                            mModalAlert.showWarning('El archivo [' + value.name + '] en el campo Acta de ajuste, no tiene el formato correcto, formatos admitidos: jpg, jpeg, pdf', '');
                            return void 0;
                        }
                        $scope.filesAJU.push(value);
                        var reader = new FileReader();
                        reader.readAsDataURL($scope.fileActaAjuste[key]);
                        reader.onload = function () {
                        };
                        reader.onerror = function (error) {
                        };

                        agricolaUtilities.getBase64($scope.fileActaAjuste[0]).then(function (result) {
                            Object.assign($scope.filesAJU[0], { base64: result.split('base64,')[1], docfileType: "ACTA DE AJUSTE" });
                            if ($scope.filesAJU[0].base64 === undefined) {
                                mModalAlert.showWarning("No se puede cargar archivos vacíos en " + $scope.filesAJU[0].docfileType + ", ingrese un archivo correcto.", "");
                                $scope.fileActaAjuste = undefined;
                                $scope.filesAJU = undefined;
                                return void 0;
                            }
                        });
                    });
                }
            });

            $scope.$watch('fileCartografia', function (nv) {
                if (!(typeof nv === 'undefined')) {
                    $scope.filesCAR = [];
                    ng.forEach(nv, function (value, key) {
                        if (value.size > maxKbSize) {
                            mModalAlert.showError('El archivo [' + value.name + '] en el campo Cartografía, excede el tamaño máximo de ' + kb + ' kb.', 'Error');
                            return void 0;
                        }
                        var validTypeFormat = validFormatFile(value.type, 'fileCartografia');
                        if (validTypeFormat === false) {
                            mModalAlert.showWarning('El archivo [' + value.name + '] en el campo Cartografía, no tiene el formato correcto, formatos admitidos: jpg, jpeg, pdf', '');
                            return void 0;
                        }
                        $scope.filesCAR.push(value);
                        var reader = new FileReader();
                        reader.readAsDataURL($scope.fileCartografia[key]);
                        reader.onload = function () {
                        };
                        reader.onerror = function (error) {
                        };

                        agricolaUtilities.getBase64($scope.fileCartografia[0]).then(function (result) {
                            Object.assign($scope.filesCAR[0], { base64: result.split('base64,')[1], docfileType: "CARTOGRAFIA" });
                            if ($scope.filesCAR[0].base64 === undefined) {
                                mModalAlert.showWarning("No se puede cargar archivos vacíos en " + $scope.filesCAR[0].docfileType + ", ingrese un archivo correcto.", "");
                                $scope.fileCartografia = undefined;
                                $scope.filesCAR = undefined;
                                return void 0;
                            }
                        });
                    });
                }
            });

            $scope.$watch('fileFotografia', function (nv) {
                if (!(typeof nv === 'undefined')) {
                    $scope.filesFOT = [];
                    ng.forEach(nv, function (value, key) {
                        if (value.size > maxKbSize) {
                            mModalAlert.showError('El archivo [' + value.name + '] en el campo Fotografía excede el tamaño máximo de ' + kb + ' kb.', 'Error');
                            return void 0;
                        }

                        var validTypeFormat = validFormatFile(value.type, 'fileFotografia');
                        if (validTypeFormat === false) {
                            mModalAlert.showWarning('El archivo [' + value.name + '] en el campo Fotografía, no tiene el formato correcto, formatos admitidos: doc, docx, jpg, jpeg, pdf', '');
                            return void 0;
                        }

                        $scope.filesFOT.push(value);
                        var reader = new FileReader();
                        reader.readAsDataURL($scope.fileFotografia[key]);
                        reader.onload = function () {
                        };
                        reader.onerror = function (error) {
                        };

                        agricolaUtilities.getBase64($scope.fileFotografia[0]).then(function (result) {
                            Object.assign($scope.filesFOT[0], { base64: result.split('base64,')[1], docfileType: "FOTOGRAFIA" });
                            if ($scope.filesFOT[0].base64 === undefined) {
                                mModalAlert.showWarning("No se puede cargar archivos vacíos en " + $scope.filesFOT[0].docfileType + ", ingrese un archivo correcto.", "");
                                $scope.fileFotografia = undefined;
                                $scope.filesFOT = undefined;
                                return void 0;
                            }
                        });
                    });
                }
            });

            function validFormatFile(valueType, typeDoc) {
                if (typeDoc === 'fileActa1' || typeDoc === 'fileActa2' || typeDoc === 'fileActaAjuste' || typeDoc === 'fileCartografia') {
                    if (valueType === 'image/jpeg' || valueType === 'application/pdf') {
                        return true;
                    } else {
                        return false;
                    }
                } else if (typeDoc === 'fileFotografia') {
                    if (valueType === 'application/msword' || valueType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                        || valueType === 'image/jpeg' || valueType === 'application/pdf') {
                        return true;
                    } else {
                        return false;
                    }
                }
            }

            $scope.deleteFile = function (typeControl) {
                if (typeControl === 'AI1') {
                    $scope.filesAI1 = undefined;
                    $scope.fileActa1 = undefined;
                } else if (typeControl === 'AI2') {
                    $scope.filesAI2 = undefined;
                    $scope.fileActa2 = undefined;
                } else if (typeControl === 'AJU') {
                    $scope.filesAJU = undefined;
                    $scope.fileActaAjuste = undefined;
                } else if (typeControl === 'CAR') {
                    $scope.filesCAR = undefined;
                    $scope.fileCartografia = undefined;
                } else if (typeControl === 'FOT') {
                    $scope.filesFOT = undefined;
                    $scope.fileFotografia = undefined;
                } else {

                }
                $scope.arrayFiles = [];
            }

            $scope.continueStep5 = function () {
                $scope.step5save = false;
                $scope.showFinalizar = false;
                $scope.stepActivo = 5;
                limpiarControles(5);
            }

            function validarSaveStep5() {
                mpSpin.start();
                var dataStep5 = ($scope.ajusteDetalle.documentos != undefined ? $scope.ajusteDetalle.documentos : []);
                var listPromises = [];
                listPromises.push(recopilarDocumentos());
                $q.all(listPromises).then(function (result) {
                    if (result[0].length === 0) {
                        if (dataStep5.length > 0) {
                            mpSpin.end();
                            $state.go('consultaAvisoSiniestro', undefined, { reload: true, inherit: false });
                        } else {
                            mpSpin.end();
                            mModalAlert.showWarning("El ajuste no cuenta con archivos cargados.", "");
                        }
                    } else {
                        cargarArrayDocumentos();
                    }
                });
            }

            function recopilarDocumentos() {
                var deferred = $q.defer();
                $scope.arrayFiles = [];

                if ($scope.filesAI1 !== undefined && $scope.filesAI1.length > 0) {
                    $scope.arrayFiles.push({
                        "tipoArchivo": $scope.filesAI1[0].docfileType,
                        "nomArchivo": $scope.filesAI1[0].name,
                        "ArchivoBase64": $scope.filesAI1[0].base64
                    });
                }

                if ($scope.filesAI2 !== undefined && $scope.filesAI2.length > 0) {
                    $scope.arrayFiles.push({
                        "tipoArchivo": $scope.filesAI2[0].docfileType,
                        "nomArchivo": $scope.filesAI2[0].name,
                        "ArchivoBase64": $scope.filesAI2[0].base64
                    });
                }

                if ($scope.filesAJU !== undefined && $scope.filesAJU.length > 0) {
                    $scope.arrayFiles.push({
                        "tipoArchivo": $scope.filesAJU[0].docfileType,
                        "nomArchivo": $scope.filesAJU[0].name,
                        "ArchivoBase64": $scope.filesAJU[0].base64
                    });
                }

                if ($scope.filesCAR !== undefined && $scope.filesCAR.length > 0) {
                    $scope.arrayFiles.push({
                        "tipoArchivo": $scope.filesCAR[0].docfileType,
                        "nomArchivo": $scope.filesCAR[0].name,
                        "ArchivoBase64": $scope.filesCAR[0].base64
                    });
                }

                if ($scope.filesFOT !== undefined && $scope.filesFOT.length > 0) {
                    $scope.arrayFiles.push({
                        "tipoArchivo": $scope.filesFOT[0].docfileType,
                        "nomArchivo": $scope.filesFOT[0].name,
                        "ArchivoBase64": $scope.filesFOT[0].base64
                    });
                }

                deferred.resolve($scope.arrayFiles);
                return deferred.promise;
            }

            $scope.saveStep5 = function () {
                mpSpin.start('Cargando los documentos, por favor espere...');
                var listPromises = [];
                listPromises.push(recopilarDocumentos());
                $q.all(listPromises).then(function (result) {
                    if (result[0].length > 0) {
                        cargarArrayDocumentos();
                    } else {
                        $scope.arrayFiles = [];
                        mpSpin.end();
                        mModalAlert.showWarning("El ajuste no cuenta con archivos cargados.", "");
                    }
                });
            }

            function cargarArrayDocumentos() {
                var listPromises = [];
                ng.forEach($scope.arrayFiles, function (value, key) {
                    vmDet.formDataSave.step5 = {
                        "Aviso": {
                            "CodCampania": $scope.codigoCampania,
                            "CodAviso": $scope.codigoAviso
                        },
                        "Documentos": [{
                            "tipoArchivo": $scope.arrayFiles[key].tipoArchivo,
                            "nomArchivo": $scope.arrayFiles[key].nomArchivo,
                            "ArchivoBase64": $scope.arrayFiles[key].ArchivoBase64
                        }],
                        "Usuario": authorizedResource.profile.loginUserName,
                        "Paso": 5
                    }
                    listPromises.push(enviarDocumentosBD(vmDet.formDataSave.step5));
                });

                $q.all(listPromises).then(function (result) {
                    var indexValidSend = result.map(function (o) { return o.returnResult; }).indexOf('Error');
                    if (indexValidSend === -1) {
                        if ($scope.executeDetalle === true) {
                            var listPromise = [];
                            limpiarControles(5);
                            listPromise.push(showAjusteDetalle());
                            $q.all(listPromise).then(function (result) {
                                var indexDetalle = result.map(function (o) { return o.id; }).indexOf('datosDetalle');
                                if (result[indexDetalle].operationCode == 200) {
                                    mpSpin.end();
                                } else {
                                    mpSpin.end();
                                    mModalAlert.showError("Ocurrio un error el mostrar la información", "Error");
                                }
                            });
                        } else {
                            mpSpin.end();
                            $state.go('consultaAvisoSiniestro', undefined, { reload: true, inherit: false });
                        }
                    } else {
                        mpSpin.end();
                        mModalAlert.showError("No se puede cargar archivos vacíos, ingrese un archivo correcto.", "Error");
                    }
                });
            }

            function enviarDocumentosBD(params) {
                var deferred = $q.defer();
                proxyAviso.AjustarAviso($scope.codigoCampania,$scope.codigoAviso,params).then(function (response) {
                    if (response.operationCode === 200) {
                        deferred.resolve({ typeFile: params.Documentos[0].tipoArchivo, returnResult: 'Success' });
                    }
                    else {
                        deferred.resolve({ typeFile: params.Documentos[0].tipoArchivo, returnResult: 'Error' });
                    }
                }, function (response) {
                    deferred.resolve({ typeFile: params.Documentos[0].tipoArchivo, returnResult: 'Error' });
                });
                return deferred.promise;
            }

            $scope.downloadFileDB = function (tipoArchivo, nomArchivo) {
                mpSpin.start();

                var params = {
                    CodAviso: $scope.codigoAviso,
                    CodCampania: $scope.codigoCampania,
                    tipoArchivo: tipoArchivo,
                }

                var url = oimURL.endpoint + 'api/avisos/Archivo/Descargar';

                $http.post(
                    url,
                    params,
                    { responseType: "arraybuffer" })
                    .success(
                        function (data, status, headers) {
                            var type = headers('Content-Type');
                            var disposition = headers('Content-Disposition');
                            var defaultFileName = nomArchivo;

                            if (disposition) {
                                var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
                                if (match[1]) defaultFileName = match[1];
                            }

                            defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');

                            var blob = new Blob([data], { type: type });
                            var link = document.createElement('a');
                            link.href = window.URL.createObjectURL(blob);
                            link.download = defaultFileName;
                            link.click();

                            mpSpin.end();
                        }, function (data, status) {
                            mpSpin.end();
                        })
                    .error(function (data, status, headers) {
                        mModalAlert.showWarning("Ocurrió un error al descargar el archivo, inténtelo nuevamente", "");
                    });
            }

            $scope.deleteFileDB = function (tipoArchivo) {
                $uibModal.open({
                    backdrop: 'static',
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: false,
                    scope: $scope,
                    //size: 'xs',
                    //templateUrl: 'app/consultaAvisoSiniestro/components/modalDeleteFile.html',
                    template: '<mfp-modal-question data="data"></mfp-modal-question>',
                    controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                        $scope.closeModal = function () {
                            $uibModalInstance.close();
                        };
                        $scope.deleteFile = function () {
                            vmDet.formDataSave.step5 = {
                                "Aviso": {
                                    "CodCampania": $scope.codigoCampania,
                                    "CodAviso": $scope.codigoAviso
                                },
                                "Documentos": [{
                                    "tipoArchivo": tipoArchivo,
                                    "nomArchivo": "",
                                    "ArchivoBase64": ""
                                }],
                                "Usuario": authorizedResource.profile.loginUserName,
                                "Paso": 5
                            }

                            proxyAviso.AjustarAviso($scope.codigoCampania,$scope.codigoAviso,vmDet.formDataSave.step5).then(function (response) {
                                if (response.operationCode === 200) {
                                    var listPromise = [];
                                    $uibModalInstance.close();
                                    listPromise.push(showAjusteDetalle());
                                    $q.all(listPromise).then(function (result) {
                                        var indexDetalle = result.map(function (o) { return o.id; }).indexOf('datosDetalle');
                                        if (result[indexDetalle].operationCode == 200) {
                                            mpSpin.end();
                                        } else {
                                            mpSpin.end();
                                            mModalAlert.showError("Ocurrio un error el mostrar la información", "Error");
                                        }
                                    });
                                }
                                else {
                                    $uibModalInstance.close();
                                    mModalAlert.showError("Ocurrio un error al eliminar el documento", "Error");
                                }
                            }, function (response) {
                                $uibModalInstance.close();
                                mModalAlert.showError("Ocurrio un error al eliminar el documento", "Error");
                            });
                        };
                        $scope.data = {
                            title: '¿Desea eliminar el documento?',
                            subtitle: 'Se eliminará el documento de ' + tipoArchivo,
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
                                    accion: $scope.deleteFile,
                                    clases: 'g-btn-verde'
                                }
                            ]
                        };
                    }]
                });
            }
            $scope.showModalReapertura = function () {
                $uibModal.open({
                    backdrop: 'static',
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: false,
                    scope: $scope,
                    //size: 'xs',
                    //templateUrl: 'app/consultaAvisoSiniestro/components/modalReapertura/modalReapertura.html',
                    template: '<modal-reapertura data="data"></modal-reapertura>',
                    controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                        $scope.closeModal = function () {
                            $uibModalInstance.close();
                        };
                        $scope.showModal = function () {

                        },
                        $scope.data = {
                           codigoAviso : $scope.codigoAviso,
                           codigoCampania : $scope.codigoCampania,
                           usuario: oimClaims.loginUserName
                        };
                    }]
                });
            }
            $scope.finalizarAjuste = function () {
                mpSpin.start('Validando la información, por favor espere...');

                vmDet.formDataSave.stepX = {
                    "Aviso": {
                        "CodCampania": $scope.codigoCampania,
                        "CodAviso": $scope.codigoAviso
                    },
                    "Usuario": authorizedResource.profile.loginUserName,
                    "Paso": 99
                }

                proxyAviso.AjustarAviso($scope.codigoCampania,$scope.codigoAviso,vmDet.formDataSave.stepX).then(function (response) {
                    if (response.operationCode === 200) {
                        iniciarDetalleAviso();
                    } else if (response.operationCode === 400) {
                        mpSpin.end();
                        mModalAlert.showWarning(("PASO " + agricolaUtilities.getPartText(response.message, "|", 0) + ": " + agricolaUtilities.getPartText(response.message, "|", 1)), "");
                    }
                    else {
                        mpSpin.end();
                        mModalAlert.showError("Ocurrio un error al finalizar el ajuste", "Error");
                    }
                }, function (response) {
                    mpSpin.end();
                    mModalAlert.showError("Ocurrio un error al finalizar el ajuste", "Error");
                });
            }

            $scope.saveAllStep = function () {
                var deferred = $q.defer();
                $scope.executeDetalle = false;
                var nroStep = $scope.stepActivo;
                switch (nroStep) {
                    case 1:
                        deferred.resolve($scope.saveStep1());
                        break;
                    case 2:
                        deferred.resolve($scope.saveStep2());
                        break;
                    case 3:
                        deferred.resolve($scope.saveStep3());
                        break;
                    case 4:
                        deferred.resolve($scope.saveStep4());
                        break;
                    case 5:
                        deferred.resolve(validarSaveStep5());
                        break;
                    default:
                        deferred.resolve('goToConsultaAvisoSiniestro');
                        $state.go('consultaAvisoSiniestro', undefined, { reload: true, inherit: false });
                        break;
                }
                return deferred.promise;
            }

            function limpiarControles(nroStep) {
                switch (nroStep) {
                    case 3:
                        $scope.mNombreComuni = undefined;
                        $scope.mFechaSiembra = undefined;
                        $scope.mEstadoFenelog = { codigo: null };
                        $scope.mFechaOcurrencia = undefined;
                        $scope.mTipoSiniestro = { codigo: null };
                        $scope.mLatitud = undefined;
                        $scope.mLongitud = undefined;
                        $scope.mSuperSembra = undefined;
                        $scope.mRendObten = undefined;
                        $scope.mProdObten = undefined;
                        $scope.mTipoDocument3 = { codigo: 'DNI' };
                        $scope.mNumDocument3 = undefined;
                        $scope.mNombre3 = undefined;
                        $scope.mApellidoPat3 = undefined;
                        $scope.mApellidoMat3 = undefined;
                        $scope.validSuperficie = true;
                        $scope.validRendimiento = true;
                        $scope.validProduccion = true;
                        $scope.frmAjuste3.$setPristine();
                        $scope.validLatitud = true;
                        $scope.validLongitud = true;
                        break;
                    case 5:
                        $scope.filesAI1 = undefined;
                        $scope.fileActa1 = undefined;
                        $scope.filesAI2 = undefined;
                        $scope.fileActa2 = undefined;
                        $scope.filesAJU = undefined;
                        $scope.fileActaAjuste = undefined;
                        $scope.filesCAR = undefined;
                        $scope.fileCartografia = undefined;
                        $scope.filesFOT = undefined;
                        $scope.fileFotografia = undefined;
                        $scope.arrayFiles = [];
                        break;
                    default:
                        break;
                }
            }
            $scope.clicFileImport = function (e) {
                document.getElementById(e).value =null;
            }
            $scope.changeTipoDoc = function (stepNumber) {
                switch (stepNumber) {
                    case "step1":
                        $scope.mNumDocument = undefined;
                        $scope.mNombre = undefined;
                        $scope.mApellidoPat = undefined;
                        $scope.mApellidoMat = undefined;
                        switch ($scope.mTipoDocument.codigo) {
                            case "CEX":
                                $scope.maxLengthDoc = 12;
                                break;
                            case "PAS":
                                $scope.maxLengthDoc = 12;
                                break;
                            case "DNI":
                                $scope.maxLengthDoc = 8;
                                break;
                            case "RUC":
                                $scope.maxLengthDoc = 11;
                                break;
                            default:
                                $scope.maxLengthDoc = 15;
                                break;
                        }
                        break;
                    case "step2":
                        $scope.mNumDocument2 = undefined;
                        $scope.mNombre2 = undefined;
                        $scope.mApellidoPat2 = undefined;
                        $scope.mApellidoMat2 = undefined;
                        switch ($scope.mTipoDocument2.codigo) {
                            case "CEX":
                                $scope.maxLengthDoc2 = 12;
                                break;
                            case "PAS":
                                $scope.maxLengthDoc2 = 12;
                                break;
                            case "DNI":
                                $scope.maxLengthDoc2 = 8;
                                break;
                            case "RUC":
                                $scope.maxLengthDoc2 = 11;
                                break;
                            default:
                                $scope.maxLengthDoc2 = 15;
                                break;
                        }
                        break;
                    case "step3":
                        $scope.mNumDocument3 = undefined;
                        $scope.mNombre3 = undefined;
                        $scope.mApellidoPat3 = undefined;
                        $scope.mApellidoMat3 = undefined;
                        switch ($scope.mTipoDocument3.codigo) {
                            case "CEX":
                                $scope.maxLengthDoc3 = 12;
                                break;
                            case "PAS":
                                $scope.maxLengthDoc3 = 12;
                                break;
                            case "DNI":
                                $scope.maxLengthDoc3 = 8;
                                break;
                            case "RUC":
                                $scope.maxLengthDoc3 = 11;
                                break;
                            default:
                                $scope.maxLengthDoc3 = 15;
                                break;
                        }
                        break;
                    default:
                        break;
                }
            }

            $scope.changeTipDocStep3 = function () {
                switch ($scope.mTipoDocument3.codigo) {
                    case "CEX":
                        $scope.maxLengthDoc3 = 12;
                        break;
                    case "PAS":
                        $scope.maxLengthDoc3 = 12;
                        break;
                    case "DNI":
                        $scope.maxLengthDoc3 = 8;
                        break;
                    case "RUC":
                        $scope.maxLengthDoc3 = 11;
                        break;
                    default:
                        $scope.maxLengthDoc3 = 15;
                        break;
                }
            }

            $scope.consultPerson = function (stepNumber) {
                var deferred = $q.defer();
                var tipoDoc = null;
                var nroDoc = null;
                if (stepNumber === 'step1') {
                    tipoDoc = $scope.mTipoDocument.codigo;
                    nroDoc = $scope.mNumDocument;
                } else if (stepNumber === 'step2') {
                    tipoDoc = $scope.mTipoDocument2.codigo;
                    nroDoc = $scope.mNumDocument2;
                } else if (stepNumber === 'step3') {
                    tipoDoc = $scope.mTipoDocument3.codigo;
                    nroDoc = $scope.mNumDocument3;
                }

                if (tipoDoc !== null && nroDoc !== undefined && nroDoc !== "") {
                    mpSpin.start('Cargando información, por favor espere...');
                    var paramSearchPerson = { tipoDoc: tipoDoc, numDoc: nroDoc }
                    proxyLookup.GetEquifax(paramSearchPerson).then(function (response) {
                        if (response.operationCode === 200 && response.data.persona.respuesta === "1") {
                            deferred.resolve(response.data);
                            if (stepNumber === 'step1') {
                                $scope.mNombre = response.data.persona.nombres;
                                $scope.mApellidoPat = response.data.persona.ape_paterno;
                                $scope.mApellidoMat = response.data.persona.ape_materno;
                                $scope.noResultParticipant = false;
                            } else if (stepNumber === 'step2') {
                                $scope.mNombre2 = response.data.persona.nombres;
                                $scope.mApellidoPat2 = response.data.persona.ape_paterno;
                                $scope.mApellidoMat2 = response.data.persona.ape_materno;
                                $scope.noResultParticipant2 = false;
                            } else if (stepNumber === 'step3') {
                                $scope.mNombre3 = response.data.persona.nombres;
                                $scope.mApellidoPat3 = response.data.persona.ape_paterno;
                                $scope.mApellidoMat3 = response.data.persona.ape_materno;
                                $scope.noResultParticipant3 = false;
                            }
                            mpSpin.end();
                        }
                        else {
                            deferred.reject(response);
                            if (stepNumber === 'step1') {
                                $scope.mNombre = "";
                                $scope.mApellidoPat = "";
                                $scope.mApellidoMat = "";
                                $scope.noResultParticipant = true;
                            } else if (stepNumber === 'step2') {
                                $scope.mNombre2 = "";
                                $scope.mApellidoPat2 = "";
                                $scope.mApellidoMat2 = "";
                                $scope.noResultParticipant2 = true;
                            } else if (stepNumber === 'step3') {
                                $scope.mNombre3 = "";
                                $scope.mApellidoPat3 = "";
                                $scope.mApellidoMat3 = "";
                                $scope.noResultParticipant3 = true;
                            }
                            mpSpin.end();
                        }
                    });
                } else {
                    mpSpin.end();
                    deferred.reject(null);
                    $scope.mNombre = undefined;
                    $scope.mApellidoPat = undefined;
                    $scope.mApellidoMat = undefined;
                }
                return deferred.promise;
            }

            function getChevronDetale() {
                $scope.upDatosAjuste = $scope.upDatosAjuste;
                $scope.upDatosCampo = $scope.upDatosCampo;
                $scope.upLote = $scope.upLote;
                $scope.upDatosFinales = $scope.upDatosFinales;
                $scope.upDocumentos = $scope.upDocumentos;
            }
        }
        return ng.module('atencionsiniestrosagricola.app')
            .controller('DetalleAvisoSiniestroController', detalleAvisoSiniestroController)
            .directive('preventDefault', function () {
                return function (scope, element, attrs) {
                    ng.element(element).bind('click', function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                    });
                }
            });
    });