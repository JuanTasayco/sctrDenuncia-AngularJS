define([
  'angular', 'constantsRiesgosGenerales', 'constants', 'resumenTrabajosEspecificos', 'resumenTrec',
  'resumenHidrocarburo', 'rrggResumenCar', 'rrggResVigLimp', 'resumenTransporte', 'resumenEventos', 'resumenDemoliciones'
], function (angular, constantsRiesgosGenerales, constants) {
  'use strict';

  angular
    .module("appRrgg")
    .controller('cotizacionRrggStep2Controller', cotizacionRrggStep2Controller);

  cotizacionRrggStep2Controller.$inject = ['$scope', '$state', 'mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory', 'mModalConfirm', 'riesgosGeneralesCommonFactory'];

  function cotizacionRrggStep2Controller($scope, $state, mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory, mModalConfirm, riesgosGeneralesCommonFactory) {

    (function load_cotizacionRrggStep2Controller() {
      $scope.constantsRrgg = constantsRiesgosGenerales
      $scope.cotizacion = riesgosGeneralesFactory.getTramite();
      $scope.estadoValidate = false;
      riesgosGeneralesService.getProxyPametros(0, constantsRiesgosGenerales.PARAMETROS.TIP_CAMBIO)
        .then(function (response) {
          riesgosGeneralesFactory.cotizacion.tipoCambio = response.Data[0].Valor;
        });
      if ($scope.cotizacion.NroTramite !== 0)
        riesgosGeneralesService.resumen($scope.cotizacion.NroTramite, $scope.cotizacion.Grupo)
          .then(function (response) {
            if (response.OperationCode === constants.operationCode.success) {
              $scope.cotizacionResumen = response.Data
              if (response.Data.Grupo === constantsRiesgosGenerales.GRUPO.TREC) {
                $scope.cotizacionResumen.listaEquipos = $scope.cotizacionResumen.listaEquipos.map(function (equipo) {
                  return {
                    Orden: equipo.Orden,
                    ValorEquipo: equipo.ValorEquipo,
                    Descripcion: { Codigo: equipo.CodDescripcion },
                    DetalleEquipo: equipo.DetalleEquipo,
                    MarcaEquipo: equipo.MarcaEquipo,
                    Anio: equipo.Anio.toString(),
                    SerieMotor: equipo.SerieMotor
                  }
                });
                if ($scope.cotizacionResumen.TipoTrabajo) {
                  if ($scope.cotizacionResumen.TipoTrabajo.Estado.trim() === "99") {
                    $scope.maximosValidate = true
                  }
                }
                validateMontosMaximosTRE();
                validateDescuentosTRE();
              }
              if (response.Data.Grupo === constantsRiesgosGenerales.GRUPO.TRAB_ESPECIFICOS) {
                validateMontosMaximosTEE();
                validateDescuentosTEE();
                validateFechaDesdeTEE();
                validateUbigeo();
                if (!$scope.cotizacionResumen.CantTrabajadores) {
                  $scope.cotizacionResumen.CantTrabajadores = "0"
                }
              }
              if (response.Data.Grupo === constantsRiesgosGenerales.GRUPO.HIDROCARBURO) {
                $scope.cotizacionResumen.TipoAseguramiento = $scope.cotizacionResumen.Giro.TipoAseguramiento;
                validateDescuentosHDR();
                validateUitHidro();
                validateUbigeo();
              }
              if (response.Data.Grupo === constantsRiesgosGenerales.GRUPO.CAR || response.Data.Grupo === constantsRiesgosGenerales.GRUPO.CARLITE) {
                validateDescuentosCAR();
                validateUbigeo();
                setTimeout(function () {
                  if (!$scope.estadoValidate) {
                    validateMaximaDuracionCar();
                  }
                  if (!$scope.estadoValidate) {
                    validateFechaDesdeCAL();
                  }
                }, 200);

                setTimeout(function () {
                  if (!$scope.estadoValidate) {
                    validateSumas();
                  }
                }, 300);
              }
              if (response.Data.Grupo === constantsRiesgosGenerales.GRUPO.TRANSPORTE) {
                validateFechaDesdeRetro();
                validateUbigeo();
                setTimeout(function () {
                  if (!$scope.estadoValidate) {
                    validateMontoMaximoParamSimple($scope.constantsRrgg.PARAMETROS.CONSIDERACIONES);
                  }
                }, 200);
              }

              if (response.Data.Grupo === constantsRiesgosGenerales.GRUPO.EVENTOS) {
                validateMontoMaximoParamSimple($scope.constantsRrgg.PARAMETROS.SUM_MAX_ASEGURADA);
                validateEventos();
                validateUbigeo();
                setTimeout(function () {
                  if (!$scope.estadoValidate) {
                    validateFechaDesdeRetro();
                  }
                }, 200);

              }
              if (response.Data.Grupo === constantsRiesgosGenerales.GRUPO.DEMOLICIONES) {
                validateMontoMaximoParamTabla($scope.cotizacionResumen.SumaAsegurada);
                validateUbigeo();
                setTimeout(function () {
                  if (!$scope.estadoValidate) {
                    validateDescuentosDEM();
                  }
                  if (!$scope.estadoValidate) {
                    validateFechaDesdeRetro();
                  }
                }, 200);

              }
              if (response.Data.Grupo === constantsRiesgosGenerales.GRUPO.VIGLIMP) {
                validateUbigeo()
                if ($scope.cotizacionResumen.SumaAseguradaRC >= 0) {
                  validateMontoMaximoParamTabla($scope.cotizacionResumen.SumaAseguradaRC);
                }
                if ($scope.cotizacionResumen.SumaAseguradaDesh >= 0) {
                  validateMontoMaximoParamTabla($scope.cotizacionResumen.SumaAseguradaDesh);
                }
                setTimeout(function () {
                  if (!$scope.estadoValidate) {
                    validateDescuentosVIG();
                  }
                  if (!$scope.estadoValidate) {
                    validateFechaDesdeTEE();
                  }
                }, 200);


                if (!$scope.cotizacionResumen.CantidadTrabajadores) {
                  $scope.cotizacionResumen.CantidadTrabajadores = "0"
                }
              }
              if (!$scope.cotizacionResumen.CantidadUbicaciones) {
                $scope.cotizacionResumen.CantidadUbicaciones = "0"
              }
              riesgosGeneralesFactory.cotizacion.form = $scope.cotizacionResumen
              $scope.cotizacionResumen.IdProducto = $scope.cotizacionResumen.CodigoRiesgoGeneral || $scope.cotizacionResumen.IdProducto
            } else {
              
              mModalAlert.showError(response.Message, "¡Error de Resultado!")
            }

            setTimeout(function () {
              var req = {
                HayError : $scope.maximosValidate || $scope.ubigeoValidate
              }
              console.log(req);
              riesgosGeneralesService.cotizacionError($scope.cotizacion.NroTramite, req)
            }, 1500);


            
          }).catch(function (error) {
            mModalAlert.showError(error.Message, "¡Error de Resultado!")
          });
    })();

    $scope.EditarCotizacion = function () {
      riesgosGeneralesFactory.cotizacion.editar = true;
      $state.go(constantsRiesgosGenerales.ROUTES.COTIZACION_STEPS, { step: constantsRiesgosGenerales.STEPS.COTIZACION });
    }
    $scope.GoStepEmision = function () {
      $scope.setTramite(1)
      $state.go(constantsRiesgosGenerales.ROUTES.COTIZACION_STEPS, { step: constantsRiesgosGenerales.STEPS.EMISION });
    }
    $scope.GoStepSuscriptor = function () {
      $scope.setTramite(2)
      $state.go(constantsRiesgosGenerales.ROUTES.COTIZACION_STEPS, { step: constantsRiesgosGenerales.STEPS.EMISION });
    }
    $scope.setTramite = function (validateEmision) {
      riesgosGeneralesFactory.cotizacion.tramite = {
        NroTramite: $scope.cotizacionResumen.NumeroTramite,
        Grupo: $scope.cotizacionResumen.Grupo,
        IdProducto: $scope.cotizacionResumen.CodigoRiesgoGeneral,
        CodigoAgente: $scope.cotizacionResumen.Agente.Codigo,
        CantTrabajadores: $scope.cotizacionResumen.CantTrabajadores || $scope.cotizacionResumen.CantidadTrabajadores,
        TipoEmision: validateEmision,
        Cobertura: $scope.cotizacionResumen.Cobertura,
        Moneda: $scope.cotizacionResumen.Moneda,
        FechaCotizacion: $scope.cotizacionResumen.FechaCotizacion,
        Vigencia: $scope.cotizacionResumen.Vigencia ? $scope.cotizacionResumen.Vigencia.Valor : 0,
        ResCotizacion: $scope.cotizacionResumen
      }
    }
    $scope.dowloadPdf = function () {
      mModalConfirm.confirmWarning('', $scope.constantsRrgg.SMS_INFO.DATA_SENSIBLE, 'ACEPTAR').then(function (response) {
        riesgosGeneralesService.dowloadPdf($scope.cotizacionResumen.NumeroTramite, $scope.cotizacionResumen.Grupo)
      });
    }
    function validateMontosMaximosTRE() {
      var canEquipos = $scope.cotizacionResumen.listaEquipos.length;
      riesgosGeneralesService.getProxyPametros($scope.cotizacion.IdProducto, $scope.constantsRrgg.PARAMETROS.MAX_EQUIPOS)
        .then(function (response) {
          var montoMax = 0
          var montoMaxOne = response.Data[1].Valor
          var montoMaxTwo = response.Data[0].Valor
          if (canEquipos === 1) montoMax = montoMaxOne
          if (canEquipos >= 2) montoMax = montoMaxTwo
          //cuando es soles calcula por TC
          if (parseInt($scope.cotizacionResumen.Moneda.Codigo) === 1) {
            montoMax = riesgosGeneralesCommonFactory.convertDolaresAsoles(montoMax).montoMaximo;
          }
          $scope.cotizacionResumen.listaEquipos.forEach(function (element) {
            if (parseFloat(element.ValorEquipo) > parseFloat(montoMax)) {
              $scope.maximosValidate = true
            }
          });
        });
    }
    function validateMontosMaximosTEE() {
      var maximosValidate = []
      if ($scope.cotizacionResumen.ValorContrato) {
        maximosValidate.push({
          parametro: $scope.constantsRrgg.PARAMETROS.VAL_MAX_CONTRATO.COD,
          codigoParam: $scope.constantsRrgg.PARAMETROS.VAL_MAX_CONTRATO.MONTO_MAX_DOL,
          value: $scope.cotizacionResumen.ValorContrato
        })
      }
      if ($scope.cotizacionResumen.SumaAsegurada) {
        maximosValidate.push({
          parametro: $scope.constantsRrgg.PARAMETROS.SUM_MAX_ASEGURADA,
          codigoParam: $scope.constantsRrgg.PARAMETROS.VAL_MAX_CONTRATO.RESPON_MAX_DOL,
          value: $scope.cotizacionResumen.SumaAsegurada
        })
      }
      if ($scope.cotizacionResumen.SumaAseguradaDesh) {
        maximosValidate.push({
          parametro: $scope.constantsRrgg.PARAMETROS.SUM_MAX_ASEGURADA,
          codigoParam: $scope.constantsRrgg.PARAMETROS.VAL_MAX_CONTRATO.DESH_MAX_DOL,
          value: $scope.cotizacionResumen.SumaAseguradaDesh
        })
      }
      maximosValidate.forEach(function (item) {
        var paramData = {
          CodigoRiesgoGeneral: $scope.cotizacion.IdProducto,
          value: item.value,
          parametro: item.parametro,
          codigoParam: item.codigoParam,
          type: "R",
          moneda: $scope.cotizacionResumen.Moneda,
          tipoCambio: riesgosGeneralesFactory.cotizacion.tipoCambio
        }
        riesgosGeneralesCommonFactory.validateMontoMaximoTEE(paramData).then(function (response) {
          $scope.maximosValidate = response
        });
      });
    }
    function validateDescuentosTRE() {
      var paramData = {
        CodigoRiesgoGeneral: $scope.cotizacion.IdProducto,
        DescuentoDirector: $scope.cotizacionResumen.DescuentoDirector,
        type: "R"
      }
      riesgosGeneralesCommonFactory.validateDescuentosTRE(paramData).then(function (response) {
        $scope.maximosValidate = response
      });
    }
    function validateDescuentosTEE() {
      var paramData = {
        CodigoRiesgoGeneral: $scope.cotizacion.IdProducto,
        SumaAsegurada: $scope.cotizacionResumen.SumaAsegurada,
        DescuentoDirector: $scope.cotizacionResumen.DescuentoDirector,
        type: "R",
        moneda: $scope.cotizacionResumen.Moneda,
      }
      riesgosGeneralesCommonFactory.validateDescuentosTEE(paramData).then(function (response) {
        $scope.maximosValidate = response
      });
    }
    function validateFechaDesdeTEE() {
      var fDesde = $scope.cotizacionResumen.FechaDesde || $scope.cotizacionResumen.DuracionDesde
      riesgosGeneralesService.validacionFecha(riesgosGeneralesFactory.FormatearFechaMes(fDesde)).then(function (response) {
        if (!$scope.estadoValidate) {
          if (!response.Data) {
            $scope.estadoValidate = true;
            $scope.maximosValidate = true;
          }
        }
      });
    }
    function validateFechaDesdeCAL() {
      var fDesde = $scope.cotizacionResumen.FechaDesde || $scope.cotizacionResumen.DuracionDesde
      riesgosGeneralesService.validacionFecha(riesgosGeneralesFactory.FormatearFechaMes(fDesde), $scope.cotizacion.IdProducto).then(function (response) {
        if (!$scope.estadoValidate) {
          if (!response.Data) {
            $scope.estadoValidate = true;
            $scope.maximosValidate = true;
          }
        }
      });
    }
    function validateDescuentosHDR() {
      riesgosGeneralesService.getProxyPametros($scope.cotizacion.IdProducto, $scope.constantsRrgg.PARAMETROS.GIRO_NEGOCIO.COD).then(function (response) {
        var giro = response.Data.find(function (element) { return element.Codigo === $scope.cotizacionResumen.Giro.Codigo });
        $scope.cotizacionResumen.Giro = giro
        var paramData = {
          CodigoRiesgoGeneral: $scope.cotizacion.IdProducto,
          Giro: giro,
          CantidadElementos: $scope.cotizacionResumen.CantidadElementos,
          DescuentoDirector: $scope.cotizacionResumen.DescuentoDirector,
          type: "R"
        }
        riesgosGeneralesCommonFactory.validateDescuentosHDR(paramData).then(function (response) {
          $scope.maximosValidate = response
        })
      });

    }
    function validateDescuentosCAR() {
      var paramData = {
        CodigoRiesgoGeneral: $scope.cotizacion.IdProducto,
        DescuentoDirector: $scope.cotizacionResumen.DescuentoDirector,
        MontoObra: $scope.cotizacionResumen.MontoObra,
        moneda: $scope.cotizacionResumen.Moneda,
        type: "R"
      }
      riesgosGeneralesCommonFactory.validateDescuentoCAR(paramData).then(function (response) {
        if (!$scope.estadoValidate) {
          $scope.estadoValidate = response;
          $scope.maximosValidate = response;
        }
      });
    }

    function validateDescuentosDEM() {
      var paramData = {
        CodigoRiesgoGeneral: $scope.cotizacion.IdProducto,
        DescuentoDirector: $scope.cotizacionResumen.DescuentoDirector,
        MontoObra: $scope.cotizacionResumen.MontoObra,
        moneda: $scope.cotizacionResumen.Moneda,
        type: "R"
      }
      riesgosGeneralesCommonFactory.validateDescuentosDEM(paramData).then(function (response) {
        if (!$scope.estadoValidate) {
          $scope.estadoValidate = response;
          $scope.maximosValidate = response;
        }
      });
    }

    function validateMaximaDuracionCar() {
      var days = riesgosGeneralesCommonFactory.dayDiff($scope.cotizacionResumen.DuracionDesde, $scope.cotizacionResumen.DuracionHasta);
      var paramData = {
        days: days,
        CodigoRiesgoGeneral: $scope.cotizacion.IdProducto,
        Grupo: $scope.cotizacion.Grupo,
        FromDate: new Date($scope.cotizacionResumen.DuracionDesde),
        type: "R"
      }
      riesgosGeneralesCommonFactory.validFechasMaximas(paramData).then(function (response) {
        if (!$scope.estadoValidate) {
          $scope.estadoValidate = response;
          $scope.maximosValidate = response;
        }
      });;
    }
    function validateMontoMaximoParamSimple(param) {
      var paramData = {
        Grupo: $scope.cotizacion.Grupo,
        codCabeceraParam: param,
        CodigoRiesgoGeneral: $scope.cotizacion.IdProducto,
        sumaAsegurada: $scope.cotizacionResumen.SumaAsegurada,
        moneda: $scope.cotizacionResumen.Moneda,
        type: "R"
      }
      riesgosGeneralesCommonFactory.validateMontoMaximoParamSimple(paramData).then(function (response) {
        if (!$scope.estadoValidate) {
          $scope.maximosValidate = response
        }
      });
    }
    function validateUitHidro() {
      var paramData = {
        CodigoRiesgoGeneral: $scope.cotizacion.IdProducto,
        CantidadUit: $scope.cotizacionResumen.CantidadUit,
        ValorUit: $scope.cotizacionResumen.ValorUit,
        moneda: $scope.cotizacionResumen.Moneda,
        type: "R"
      }
      riesgosGeneralesCommonFactory.validateMontoMaximoHidro(paramData).then(function (response) {
        $scope.maximosValidate = response
      });
    }
    function validateMontoMaximoParamTabla(sumaAsegurada) {
      var paramData = {
        Grupo: $scope.cotizacion.Grupo,
        codCabeceraParam: $scope.constantsRrgg.PARAMETROS.T_NETA_ANUAL,
        CodigoRiesgoGeneral: $scope.cotizacion.IdProducto,
        sumaAsegurada: sumaAsegurada,
        moneda: $scope.cotizacionResumen.Moneda,
        type: "R"
      }
      riesgosGeneralesCommonFactory.validateMontoMaximoParamTabla(paramData).then(function (response) {
        if (!$scope.estadoValidate) {
          $scope.estadoValidate = response;
          $scope.maximosValidate = response;
        }
        else {
          $scope.maximosValidate = true;
        }
      });
    }
    function validateDescuentosVIG() {
      var paramData = {
        CodigoRiesgoGeneral: $scope.cotizacion.IdProducto,
        DescuentoDirector: $scope.cotizacionResumen.DescuentoDirector,
        CantidadTrabajadores: $scope.cotizacionResumen.CantidadTrabajadores,
        moneda: $scope.cotizacionResumen.Moneda,
        type: "R"
      }
      riesgosGeneralesCommonFactory.validateDescuentosVIG(paramData).then(function (response) {
        if (!$scope.estadoValidate) {
          $scope.maximosValidate = response
        }
      });;
    }
    function validateEventos() {
      var days = riesgosGeneralesCommonFactory.dayDiff($scope.cotizacionResumen.FechaEventoDesde, $scope.cotizacionResumen.FechaEventoHasta);
      if (days > 184) {
        $scope.estadoValidate = true;
        $scope.maximosValidate = true;
      }
    }

    function validateFechaDesdeRetro() {
      var fDesde = $scope.cotizacionResumen.FechaEventoDesde || $scope.cotizacionResumen.FechaDesde || $scope.cotizacionResumen.DuracionDesde;
      riesgosGeneralesService.validacionFecha(riesgosGeneralesFactory.FormatearFechaMes(fDesde), $scope.cotizacionResumen.CodigoRiesgoGeneral).then(function (response) {
        if (!response.Data) {
          $scope.maximosValidate = true
          $scope.estadoValidate = true;
        }
      });
    }

    function validateSumas() {
      var paramData = {
        CodigoRiesgoGeneral: $scope.cotizacion.IdProducto,
        MontoObra: $scope.cotizacionResumen.MontoObra,
        moneda: $scope.cotizacionResumen.Moneda,
        Grupo: $scope.cotizacion.Grupo,
        type: "R"
      }
      riesgosGeneralesCommonFactory.validateMontosCAR(paramData).then(function (response) {
        if (!$scope.estadoValidate) {
          $scope.estadoValidate = !response;
          $scope.maximosValidate = !response;
        }
      });
    }

    function validateUbigeo(){
      var cotizacionResumen = $scope.cotizacionResumen
      var restringido = false
      if (cotizacionResumen.Grupo == constantsRiesgosGenerales.GRUPO.HIDROCARBURO){
        if( cotizacionResumen.listaUbicaciones){
          for (var i = 0; i < cotizacionResumen.listaUbicaciones.length; i++) {
            var ubicacion = cotizacionResumen.listaUbicaciones[i];
            riesgosGeneralesService.getRestriccionUbigeo(ubicacion.Departamento.Codigo, ubicacion.Provincia.Codigo,ubicacion.Distrito.Codigo)
            .then(function (response) {
              if (!restringido){
                restringido = response.Data.Restringido
                $scope.ubigeoValidate = restringido
              }
            })
            
          }
        }
      } else {
        riesgosGeneralesService.getRestriccionUbigeo(cotizacionResumen.Departamento.Codigo, cotizacionResumen.Provincia.Codigo,cotizacionResumen.Distrito.Codigo)
          .then(function (response) {
            restringido = response.Data.Restringido
            $scope.ubigeoValidate = restringido
          })
      }
      
    }
  }

});
