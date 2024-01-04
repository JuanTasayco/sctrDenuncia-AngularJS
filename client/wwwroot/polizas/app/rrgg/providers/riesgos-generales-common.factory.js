define([
  'angular', 'constantsRiesgosGenerales', 'constants'
], function (angular, constantsRiesgosGenerales, constants) {
  'use strict';

  angular
    .module("appRrgg")
    .factory('riesgosGeneralesCommonFactory', riesgosGeneralesCommonFactory);

  riesgosGeneralesCommonFactory.$inject = ['httpData', '$q', 'mainServices', 'mModalAlert', 'riesgosGeneralesFactory', 'riesgosGeneralesService', 'mModalConfirm'];

  function riesgosGeneralesCommonFactory(httpData, $q, mainServices, mModalAlert, riesgosGeneralesFactory, riesgosGeneralesService, mModalConfirm) {
    var factory = {
      validateDescuentosTRE: validateDescuentosTRE,
      validateDescuentosTEE: validateDescuentosTEE,
      validateDescuentosHDR: validateDescuentosHDR,
      validateMontoMaximoTEE: validateMontoMaximoTEE,
      validateDescuentoCAR: validateDescuentoCAR,
      validateDescuentosVIG: validateDescuentosVIG,
      validateMontoMaximoParamTabla: validateMontoMaximoParamTabla,
      validateMontoMaximoParamSimple: validateMontoMaximoParamSimple,
      validateMontoMaximoVIG: validateMontoMaximoVIG,
      convertDolaresAsoles: convertDolaresAsoles,
      formatMilesToNumber: formatMilesToNumber,
      totalEquipos: TotalEquipos,
      dayDiff: dayDiff,
      addDay: addDay,
      validFechasMaximas: validFechasMaximas,
      validateMontoMaximoHidro: validateMontoMaximoHidro,
      validateMontosCAR: validateMontosCAR,
      validateDescuentosDEM: validateDescuentosDEM
    };
    return factory;
    function validateDescuentosTRE(paramData) {
      var deferred = $q.defer();
      riesgosGeneralesService.getProxyPametros(paramData.CodigoRiesgoGeneral, constantsRiesgosGenerales.PARAMETROS.DESC_COMER_SIMPLE.COD)
        .then(function (response) {
          if (parseFloat(paramData.DescuentoDirector) > parseFloat(response.Data[0].Valor)) {
            if (paramData.type === "C") {
              var jsonData = { validator: constantsRiesgosGenerales.PARAMETROS.DESC_COMER_SIMPLE.COD, currency: false, moneda: paramData.moneda }
              mModalAlert.showWarning(riesgosGeneralesFactory.getSmsError(response.Data[0].Valor, jsonData), "MAPFRE:LIMITE DE DESCUENTO");
            } else if (paramData.type === "R") {
              deferred.resolve(true);
            }
          }
        }, function (error) {
          deferred.reject(error.statusText);
        });
      return deferred.promise;
    }
    function validateDescuentosTEE(paramData) {
      var deferred = $q.defer();

      riesgosGeneralesService.getProxyPametros(paramData.CodigoRiesgoGeneral, constantsRiesgosGenerales.PARAMETROS.DESC_COMERCIAL)
        .then(function (response) {

          var maxDescuento;
          var descuento = parseFloat(paramData.DescuentoDirector);

          var sumaAsegurada = parseInt(paramData.moneda.Codigo) === 2 ? parseFloat(formatMilesToNumber(paramData.SumaAsegurada)) :
          parseFloat(formatMilesToNumber(paramData.SumaAsegurada)) / parseFloat(riesgosGeneralesFactory.cotizacion.tipoCambio);

          var descuento1 = response.Data.find(function (data) { return data.Codigo === "S0539" });
          var descuento2 = response.Data.find(function (data) { return data.Codigo === "S0540" });
          if (sumaAsegurada <= parseFloat(descuento1.Valor2)) {
            if (descuento > parseFloat(descuento1.Valor)) {
              maxDescuento = descuento1
            }
          } else if (sumaAsegurada > parseFloat(descuento2.Valor2)) {
            if (descuento > parseFloat(descuento2.Valor)) {
              maxDescuento = descuento2
            }
          } else {
            if (descuento > parseFloat(descuento1.Valor2)) {
              maxDescuento = descuento1
            }
          }

          if (paramData.type === "C") {
            if (maxDescuento) {
              var jsonData = { validator: constantsRiesgosGenerales.PARAMETROS.DESC_COMER_SIMPLE.COD, currency: false, moneda: paramData.moneda }
              mModalAlert.showWarning(riesgosGeneralesFactory.getSmsError(maxDescuento.Valor, jsonData), "MAPFRE:LIMITE DE DESCUENTO");
            }
          }
          if (paramData.type === "R") {
            if (maxDescuento) {
              deferred.resolve(true);
            }
          }
        }, function (error) {
          deferred.reject(error.statusText);
        });

      return deferred.promise;
    }
    function validateDescuentosHDR(paramData) {
      var deferred = $q.defer();
      var jsonData = { validator: constantsRiesgosGenerales.PARAMETROS.DESC_COMER_SIMPLE.COD, currency: false, moneda: null }
      var descuentos = paramData.Giro.Detalle.filter(function (element) { return element.Tipo.Codigo === constantsRiesgosGenerales.PARAMETROS.DESC_COMER_SIMPLE.VALUE_REGISTER })
      if (descuentos.length) {
        descuentos.sort(function (a, b) { return parseInt(a.Valor2) - parseInt(b.Valor2) });
        for (var index = 0; index < descuentos.length; index++) {
          var element = descuentos[index];
          if (parseInt(paramData.CantidadElementos) <= parseInt(element.Valor2)) {
            if (parseFloat(paramData.DescuentoDirector) > parseFloat(element.Valor)) {
              if (paramData.type === "C") {
                mModalAlert.showWarning(riesgosGeneralesFactory.getSmsError(element.Valor, jsonData), "MAPFRE:LIMITE DE DESCUENTO");
                return
              } else if (paramData.type === "R") {
                deferred.resolve(true);
              }
            }
          }
        }
      } else {
        riesgosGeneralesService.getProxyPametros(paramData.CodigoRiesgoGeneral, constantsRiesgosGenerales.PARAMETROS.OTRS_DESC)
          .then(function (response) {
            if (parseFloat(paramData.DescuentoDirector) > parseFloat(response.Data[0].Valor)) {
              if (paramData.type === "C") {
                mModalAlert.showWarning(riesgosGeneralesFactory.getSmsError(response.Data[0].Valor, jsonData), "MAPFRE:LIMITE DE DESCUENTO");
              } else if (paramData.type === "R") {
                deferred.resolve(true);
              }
            }
          });

      }
      return deferred.promise;
    }
    function validateMontoMaximoTEE(paramData) {
      var deferred = $q.defer();
      var jsonData = {};
      riesgosGeneralesService.getProxyPametros(paramData.CodigoRiesgoGeneral, paramData.parametro)
        .then(function (response) {
          var montoMaximo = parseFloat(_.find(response.Data, function (element) { return element.Codigo == paramData.codigoParam }).Valor);
          //cuando es soles calcula por TC
          if (parseInt(paramData.moneda.Codigo) === 1) {
            var result = convertDolaresAsoles(montoMaximo);
            montoMaximo = result.montoMaximo;
            jsonData.simboloMoneda = result.simboloMoneda
          }
          if (parseFloat(paramData.value) > montoMaximo) {
            if (paramData.type === "C") {
              jsonData.tipoContrato = paramData.input;
              jsonData.moneda = paramData.moneda;
              jsonData.currency = true;
              mModalAlert.showWarning(riesgosGeneralesFactory.getSmsError(montoMaximo, jsonData), paramData.cabeceraSms);
            }
            if (paramData.type === "R") {
              deferred.resolve(true);
            }
          }
        });
      return deferred.promise;
    }
    function tasasForSoles(dataT) {
      for (var index = 0; index < dataT.length; index++) {
        var element = dataT;
        element[index][1] = convertDolaresAsoles(element[index][1]).montoMaximo;
        if (index < dataT.length - 1) {
          element[index + 1][0] = element[index][1] + 1;
        }
      }
    }

    function validateDescuentosDEM(paramData) {
      var deferred = $q.defer();
      riesgosGeneralesService.tablaParametrobyProducto(paramData.CodigoRiesgoGeneral, constantsRiesgosGenerales.PARAMETROS.T_NETA_ANUAL, 2)
        .then(function (response) {
          var jsonData = { validator: constantsRiesgosGenerales.PARAMETROS.DESC_COMER_SIMPLE.COD, currency: false, moneda: null }
          var group = Object.values(_.groupBy(response.Data, 'Grupo'));
          group.forEach(function (item, index) {
            group[index] = _.groupBy(item, "Orden");
          })
          var dataT = _getData(group[0])
          if (parseInt(paramData.moneda.Codigo) === 1) {
            tasasForSoles(dataT)
          }
          dataT.forEach(function (element) {
            if (parseFloat(paramData.DescuentoDirector) > parseFloat(element[3])) {
              if (paramData.type === "C") {
                mModalConfirm.confirmWarning(riesgosGeneralesFactory.getSmsError(element[3], jsonData), "MAPFRE: DESCUENTO MÁXIMO").then(function (response) {
                  deferred.resolve(true);
                }).catch(function (error) {
                  deferred.resolve(false);
                });
              }
              if (paramData.type === "R") {
                deferred.resolve(true);
              }
            }
            else {
              deferred.resolve(0);
            }
          });
        })
      return deferred.promise;
    }

    function validateDescuentoCAR(paramData) {
      var deferred = $q.defer();
      riesgosGeneralesService.tablaParametrobyProducto(paramData.CodigoRiesgoGeneral, constantsRiesgosGenerales.PARAMETROS.T_NETA_ANUAL, 2)
        .then(function (response) {
          var jsonData = { validator: constantsRiesgosGenerales.PARAMETROS.DESC_COMER_SIMPLE.COD, currency: false, moneda: null }
          var group = Object.values(_.groupBy(response.Data, 'Grupo'));
          group.forEach(function (item, index) {
            group[index] = _.groupBy(item, "Orden");
          })
          var dataT = _getData(group[0])
          if (parseInt(paramData.moneda.Codigo) === 1) {
            tasasForSoles(dataT)
          }
          dataT.forEach(function (element) {
            var montoObra = parseFloat(paramData.MontoObra || paramData.SumaAsegurada || 0)
            var amount1 = parseFloat(element[0])
            var amount2 = parseFloat(element[1])
            if (montoObra >= amount1 && montoObra <= amount2) {
              if (parseFloat(paramData.DescuentoDirector) > parseFloat(element[3])) {
                if (paramData.type === "C") {
                  mModalConfirm.confirmWarning(riesgosGeneralesFactory.getSmsError(element[3], jsonData), "MAPFRE: DESCUENTO MÁXIMO").then(function (response) {
                    deferred.resolve(true);
                  }).catch(function (error) {
                    deferred.resolve(true);
                  });
                }
                if (paramData.type === "R") {
                  deferred.resolve(true);
                }
              }
            }
          });
        })
      return deferred.promise;
    }


    function validateDescuentosVIG(paramData) {
      var deferred = $q.defer();
      var jsonData = { validator: constantsRiesgosGenerales.PARAMETROS.DESC_COMER_SIMPLE.COD, currency: false, moneda: null }
      riesgosGeneralesService.tablaParametrobyProducto(paramData.CodigoRiesgoGeneral, constantsRiesgosGenerales.PARAMETROS.DES_X_PERS, 0)
        .then(function (response) {
          var group = Object.values(_.groupBy(response.Data, 'Grupo'));
          group.forEach(function (item, index) {
            group[index] = _.groupBy(item, "Orden");
          })
          for (var index = 0; index < _getData(group[0]).length; index++) {
            var element = _getData(group[0])[index];
            if (parseInt(paramData.CantidadTrabajadores) <= parseInt(element[1])) {
              if (parseFloat(paramData.DescuentoDirector) > parseFloat(element[2])) {
                if (paramData.type === "C") {
                  mModalAlert.showWarning(riesgosGeneralesFactory.getSmsError(element[2], jsonData), "MAPFRE:LIMITE DE DESCUENTO");
                  return;
                } else if (paramData.type === "R") {
                  deferred.resolve(true);
                }
              }
            } else {
              var ultimoDescuento = _getData(group[0]).pop()[2];
              if (parseFloat(paramData.DescuentoDirector) > parseFloat(ultimoDescuento)) {
                if (paramData.type === "C") {
                  mModalAlert.showWarning(riesgosGeneralesFactory.getSmsError(ultimoDescuento, jsonData), "MAPFRE:LIMITE DE DESCUENTO");
                  return;
                } else if (paramData.type === "R") {
                  deferred.resolve(true);
                }
              }
            }
          }
        })
      return deferred.promise;
    }
    function validateMontoMaximoParamTabla(paramData) {
      var deferred = $q.defer();
      var jsonData = { tipoContrato: constantsRiesgosGenerales.RAMO.RESPON_CIVIL, currency: true, moneda: paramData.moneda }
      riesgosGeneralesService.tablaParametrobyProducto(paramData.CodigoRiesgoGeneral, paramData.codCabeceraParam, 2)
        .then(function (response) {
          var group = Object.values(_.groupBy(response.Data, 'Grupo'));
          group.forEach(function (item, index) {
            group[index] = _.groupBy(item, "Orden");
          })
          var sumaMaxima = ""
          if (paramData.Grupo === constantsRiesgosGenerales.GRUPO.DEMOLICIONES) {
            sumaMaxima = _getData(group[0]).pop()[1]
          }
          if (paramData.Grupo === constantsRiesgosGenerales.GRUPO.VIGLIMP) {
            sumaMaxima = _getData(group[0]).pop()[0]
          }
          //cuando es soles calcula por TC
          if (parseInt(paramData.moneda.Codigo) === 1) {
            var result = convertDolaresAsoles(sumaMaxima);
            sumaMaxima = result.montoMaximo;
            jsonData.simboloMoneda = result.simboloMoneda
          }
          if (parseFloat(paramData.sumaAsegurada) > parseFloat(sumaMaxima)) {
            if (paramData.type === "C") {
              mModalConfirm.confirmWarning(riesgosGeneralesFactory.getSmsError(sumaMaxima, jsonData), "MAPFRE:LIMITE DE SUMA ASEGURADA").then(function (response) {
                deferred.resolve(true);
              }).catch(function (error) {
                deferred.resolve(false);
              });
            } else if (paramData.type === "R") {
              deferred.resolve(true);
            }
          } else {
            deferred.resolve(0);
          }
        })
      return deferred.promise;
    }
    function validateMontoMaximoVIG(paramData) {
      var deferred = $q.defer();
      var jsonData = { tipoContrato: constantsRiesgosGenerales.RAMO.RESPON_CIVIL }
      riesgosGeneralesService.tablaParametrobyProducto(paramData.CodigoRiesgoGeneral, constantsRiesgosGenerales.PARAMETROS.T_NETA_ANUAL, 2)
        .then(function (response) {
          var group = Object.values(_.groupBy(response.Data, 'Grupo'));
          group.forEach(function (item, index) {
            group[index] = _.groupBy(item, "Orden");
          })
          var sumaMaxima = _getData(group[0]).pop()[0]
          if (paramData.sumaAsegurada > sumaMaxima) {
            if (paramData.type === "C") {
              mModalAlert.showWarning(riesgosGeneralesFactory.getSmsError(sumaMaxima, jsonData), "MAPFRE:LIMITE DE SUMA ASEGURADA");
              return;
            } else if (paramData.type === "R") {
              deferred.resolve(true);
            }
          }
        })
      return deferred.promise;
    }
    function validateMontoMaximoParamSimple(paramData) {
      var deferred = $q.defer();
      var jsonData = { tipoContrato: constantsRiesgosGenerales.RAMO.RESPON_CIVIL, currency: true, moneda: paramData.moneda }
      riesgosGeneralesService.getProxyPametros(paramData.CodigoRiesgoGeneral, paramData.codCabeceraParam)
        .then(function (response) {
          var montoMaximo = ""
          if (paramData.Grupo === constantsRiesgosGenerales.GRUPO.EVENTOS) {
            montoMaximo = response.Data[0].Valor;
          }
          if (paramData.Grupo === constantsRiesgosGenerales.GRUPO.TRANSPORTE) {
            montoMaximo = response.Data[2].Valor;
          }
          //cuando es soles calcula por TC
          if (parseInt(paramData.moneda.Codigo) === 1) {
            var result = convertDolaresAsoles(montoMaximo);
            montoMaximo = result.montoMaximo;
            jsonData.simboloMoneda = result.simboloMoneda
          }
          var amount = parseFloat(montoMaximo);
          if (parseFloat(paramData.sumaAsegurada) > amount) {
            if (paramData.type === "C") {
              mModalConfirm.confirmWarning(riesgosGeneralesFactory.getSmsError(amount, jsonData), "MAPFRE:LIMITE DE SUMA ASEGURADA").then(function (response) {
                deferred.resolve(true);
              }).catch(function (error) {
                deferred.resolve(false);
              });
            }
            if (paramData.type === "R") {
              deferred.resolve(true);
            }
          } else {
            deferred.resolve(0);
          }
        });
      return deferred.promise;
    }
    function _getData(data) {
      return Object.values(data).map(function (element) {
        return element.map(function (item) {
          return item.Dato
        })
      })
    }
    function convertDolaresAsoles(monto, titulo) {
      var jsonData = {};
      jsonData.montoMaximo = monto * parseFloat(riesgosGeneralesFactory.cotizacion.tipoCambio);
      if (riesgosGeneralesFactory.cotizacion.producto.Grupo === constantsRiesgosGenerales.GRUPO.DEMOLICIONES) {
        if (jsonData.montoMaximo > 0 && titulo === "DESDE") {
          jsonData.montoMaximo = jsonData.montoMaximo - 2;
        }
      }
      jsonData.simboloMoneda = "S/ ";
      return jsonData;
    }
    function formatMilesToNumber(n) {
      if (n) {
        var valid = n.toString().split("").includes(",")
        return valid ? n.replace(/\,/g, "") : parseFloat(n)
      }
      else {
        return n;
      }
    }
    function TotalEquipos(equipos) {
      return equipos.reduce(function (sum, value) {
        return value.ValorEquipo ?
          sum + parseFloat(formatMilesToNumber(value.ValorEquipo)) : sum
      }, 0);
    }
    function dayDiff(fecIni, fecFin) {
      var difference = Math.abs(new Date(fecFin) - new Date(fecIni));
      var days = difference / (1000 * 3600 * 24);
      return days;
    }
    function addDay(DuracionDesde, days) {
      var nuevaFechaDesde = new Date(DuracionDesde)
      return new Date(nuevaFechaDesde.setDate(nuevaFechaDesde.getDate() + days))
    }
    function validFechasMaximas(paramData) {
      var deferred = $q.defer();
      riesgosGeneralesService.getProxyPametros(paramData.CodigoRiesgoGeneral, constantsRiesgosGenerales.PARAMETROS.DURACION)
        .then(function (response) {
          var months = parseInt(response.Data[0].Valor);
          var days = parseInt(response.Data[0].Valor2);
          var newDay = factory.addDay(paramData.FromDate, days);
          if (newDay.getDate() !== paramData.FromDate.getDate()) {
            days++;
          }
          if (paramData.days > days) {
            if (paramData.type === "C") {
              if (paramData.Grupo === constantsRiesgosGenerales.GRUPO.CAR) {
                mModalAlert.showWarning("EL LÍMITE MÁXIMO DE DURACIÓN ES DE " + months + " MESES", "TIEMPO MÁXIMO DE DURACIÓN");
                deferred.resolve(true);
              }
              if (paramData.Grupo === constantsRiesgosGenerales.GRUPO.CARLITE) {
                mModalConfirm.confirmWarning("EL LÍMITE MÁXIMO DE DURACIÓN ES DE " + months + " MESES, VOLVER A INSERTAR LA FECHA DE TERMINO", "TIEMPO MÁXIMO DE DURACIÓN", "REINTENTAR").then(function (response) {
                  deferred.resolve(true);
                }).catch(function (error) {
                  deferred.resolve(true);
                });
              }
              if (paramData.Grupo === constantsRiesgosGenerales.GRUPO.VIGLIMP) {
                mModalConfirm.confirmWarning("PERÍODO SUPERA EL MÁXIMO PERIODO PERMITIDO, " + months + " MESES, VOLVER A INSERTAR LA FECHA DE TERMINO", "TIEMPO MÁXIMO PERMITIDO", "REINTENTAR").then(function (response) {
                  deferred.resolve(true);
                }).catch(function (error) {
                  deferred.resolve(true);
                });
              }
            }
            if (paramData.type === "R") {
              deferred.resolve(true);
            }
          }
        });
      return deferred.promise;
    }
    function validateMontoMaximoHidro(paramData) {
      var deferred = $q.defer();
      var jsonData = { tipoContrato: constantsRiesgosGenerales.RAMO.RESPON_CIVIL, currency: true, moneda: paramData.moneda,simboloMoneda : "$" }
      riesgosGeneralesService.tablaParametrobyProducto(paramData.CodigoRiesgoGeneral, constantsRiesgosGenerales.PARAMETROS.T_NETA_ANUAL, 2)
        .then(function (response) {
          var group = Object.values(_.groupBy(response.Data, 'Grupo'));
          group.forEach(function (item, index) {
            group[index] = _.groupBy(item, "Orden");
          })
          var sumaMaxima = _getData(group[0]).pop()[1]
          var maxUit = sumaMaxima / paramData.ValorUit * riesgosGeneralesFactory.cotizacion.tipoCambio;
          //cuando es soles calcula por TC

          if (parseFloat(paramData.CantidadUit) > parseFloat(maxUit)) {
            if (paramData.type === "C") {
              mModalAlert.showWarning(riesgosGeneralesFactory.getSmsError(sumaMaxima, jsonData), "MAPFRE:LIMITE DE SUMA ASEGURADA");
              return;
            } else if (paramData.type === "R") {
              deferred.resolve(true);
            }
          }
        })
      return deferred.promise;
    }
    function validateMontosCAR(paramData) {
      var deferred = $q.defer();
      var jsonData = { producto: paramData.Grupo, tipoContrato: constantsRiesgosGenerales.RAMO.RESPON_CIVIL, currency: true, moneda: paramData.moneda }
      riesgosGeneralesService.tablaParametrobyProducto(paramData.CodigoRiesgoGeneral, constantsRiesgosGenerales.PARAMETROS.T_NETA_ANUAL, 2)
        .then(function (response) {
          var group = Object.values(_.groupBy(response.Data, 'Grupo'));
          group.forEach(function (item, index) {
            group[index] = _.groupBy(item, "Orden");
          })
          var sumaMaxima = _getData(group[0]).pop()[1]
          var sumaMinima = response.Data.find(function (data) {
            return data.Campo === "C0057"
          }).Dato 
          //cuando es soles calcula por TC
          if (parseInt(paramData.moneda.Codigo) === 1) {
            var result = convertDolaresAsoles(sumaMaxima);
            sumaMaxima = result.montoMaximo;
            jsonData.simboloMoneda = result.simboloMoneda
          }
          var tasaMaxima = parseFloat(sumaMaxima)
          var tasaMinima = parseFloat(sumaMinima)
          if (parseFloat(paramData.MontoObra) > tasaMaxima) {
            if (paramData.type === "C") {
              mModalConfirm.confirmWarning(riesgosGeneralesFactory.getSmsError(tasaMaxima, jsonData), "MAPFRE:LIMITE DE SUMA ASEGURADA").then(function (response) {
                deferred.resolve(true);
              }).catch(function (error) {
                deferred.resolve(true);
              });
            } else if (paramData.type === "R") {
              deferred.resolve(true);
            }
          }

          if (parseFloat(paramData.MontoObra) < tasaMinima) {
            if (paramData.type === "C") {
              mModalConfirm.confirmWarning("La suma asegurada no puede ser menor a US$" + tasaMinima + ". Para montos menores, SOLICITAR VoBo de Suscripción", "MAPFRE:SUMA ASEGURADA MÍNIMA").then(function (response) {
                deferred.resolve(true);
              }).catch(function (error) {
                deferred.resolve(true);
              });
            } else if (paramData.type === "R") {
              deferred.resolve(true);
            }
            
          } 
          
        })
      return deferred.promise;
    }

    function _buscarParametro(group, propiedad, value) {
      let parametro = null;
      for (let i = 0; i < group.length; i++) {
          const array = group[i];
          for (let j = 0; j < array.length; j++) {
              const objeto = array[j];
              if (objeto[propiedad] === value) {
                parametro = objeto;
                  break;
              }
          }
          if (parametro) {
              break;
          }
      }
      return parametro;
  }
  }

});
