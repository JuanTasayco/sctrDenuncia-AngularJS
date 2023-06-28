(function($root, deps, action) {
  define(deps, action);
})(this, ['angular', 'constants', 'helper',
'modalSendEmail'],
function(angular, constants, helper) {

  angular.module('appVida').controller('vidaCotizarController',
    ['$scope', '$state', 'proxyCotizacion', 'mModalAlert', '$filter', 'httpData', 'oimProxyPoliza', 'proxyGeneral',
    function($scope, $state,
    proxyCotizacion, mModalAlert, $filter, httpData, oimProxyPoliza, proxyGeneral) {
          (function onLoad() {
              $scope.mainStep = $scope.mainStep || {};
              $scope.firstStep = $scope.firstStep || {};
              $scope.secondStep = $scope.secondStep || {};

              $scope.mainStep.FORMAT_DATE = $scope.mainStep.FORMAT_DATE || constants.formats.dateFormat;
              $scope.mainStep.FORMAT_MASK = $scope.mainStep.FORMAT_MASK || constants.formats.dateFormatMask;
              $scope.mainStep.FORMAT_PATTERN = $scope.mainStep.FORMAT_PATTERN || constants.formats.dateFormatRegex;
              $scope.mainStep.ALT_INPUT_FORMATS = $scope.mainStep.ALT_INPUT_FORMATS || ['M!/d!/yyyy'];
              
          })();

          $scope.pasosVida = [
              { description: 'Datos de la póliza' },
              { description: 'Resultado cotización' }
          ];

          $scope.$on('$stateChangeSuccess', function(s, state, param, d) {
              $scope.currentStep = param.step;
          });

          function getEncuesta(vQuoteNumber, codeRamo){
            var codCia = constants.module.polizas.vida.companyCode;
      
            proxyGeneral.GetEncuesta(codCia, codeRamo, false).then(function(response) {
              if(response.OperationCode == constants.operationCode.success){
				if (Object.keys(response.Data.Pregunta).length > 0){
					$scope.encuesta = response.Data;
					$scope.encuesta.CodigoCompania = codCia;
					$scope.encuesta.CodigoRamo = codeRamo;
					$scope.encuesta.numOperacion = vQuoteNumber;
				  
				  
				  $state.go('vidaQuoted', {
					quotationNumber: vQuoteNumber,
					encuesta: $scope.encuesta,
					comesQuote: true
				  });
				  
				}else{
					$state.go('vidaQuoted', {
						quotationNumber: vQuoteNumber,
						comesQuote: true
					});
				}
              }
            }, function(error){
              console.log('Error en getEncuesta: ' + error);
			  
			  $state.go('vidaQuoted', {
				quotationNumber: vQuoteNumber,
				comesQuote: true
			  });
            })
          }

          $scope.guardarCotizacionVida = function (requestCotizacion, save) {
            const pathParams = {
              opcMenu: localStorage.getItem('currentBreadcrumb')
             };

            httpData.post(
              oimProxyPoliza.endpoint + 'api/cotizacion/orquestador/vida?COD_OBJETO=.&OPC_MENU=' + pathParams.opcMenu,
              requestCotizacion,
              undefined,
              true
            )
            .then(function(data) {
              if (data.OperationCode == 200) {
                if (save) {
                  var vQuoteNumber = data.Data.Cotizacion.NumeroCotizacionEncript;
                  if(requestCotizacion.optionEdit == 1) {
                    mModalAlert.showInfo('COTIZACIÓN ACTUAL EDITADA. SE GENERÓ UN NUEVO NÚMERO DE COTIZACIÓN ' + vQuoteNumber, 'ALERTA');
                  }
				  
				  getEncuesta(vQuoteNumber, requestCotizacion.producto.codRamo);
				  
                  
                }
                else {
                  $scope.secondStep = data.Data.Cotizacion;
                  $scope.secondStep.FechaEfecto = $scope.firstStep.fechaVigencia;
                  var partesFecha = $scope.secondStep.FechaEfecto.split('/');
                  var anioVencimiento = parseInt(partesFecha[2]) + parseInt($scope.firstStep.duracionSeguro.Value);
                  $scope.secondStep.FechaEfectoVencimiento = partesFecha[0] + '/' + partesFecha[1] + '/' + anioVencimiento;

                  $state.go('.', {
                      step: 2
                  });
                }
              }
              else {
                  mModalAlert.showWarning(data.Message, "ALERTA");
              }
            }, function(error) {
              if (save) {
                mModalAlert.showError('No se pudo grabar, consulte con su administrador', 'ERROR');
              }
              else {
                mModalAlert.showError('No se pudo calcular, consulte con su administrador', 'ERROR');
              }
            });
          };

          $scope.cotizacionVida = function(optionEdit) {
              var cotizacion = {
                  Agente: {
                    CodigoAgente: $scope.mainStep.mAgente.codigoAgente
                  },
                  "FechaEfecto": $filter("date")($scope.firstStep.fechaVigencia, constants.formats.dateFormat),
                  "FormaPago": $scope.firstStep.fraccionamientoPago.CodeResult,
                  "DuracionSeguro": $scope.firstStep.duracionSeguro,
                  "DuracionPago": $scope.firstStep.duracionPago,
                  "DuracionAnualidad": $scope.firstStep.duracionAnualidad,
                  "capitalEstimado1": $scope.firstStep.rentEstimada1,
                  "capitalEstimado2": $scope.firstStep.rentEstimada2,
                  "ActivoCapitalEstimado1": $scope.firstStep.activoCapitalEstimado1,
                  "ActivoCapitalEstimado2": $scope.firstStep.mRent2 ? "S" : "N",
                  "mcaEmpleado": $scope.firstStep.empMapfre,
                  "Producto": {
                      "CodigoProducto": $scope.firstStep.producto.CodigoProducto,
                      "CodigoMoneda": $scope.firstStep.producto.CodigoMoneda
                  },
                  "Asegurado": {
                      "TipoDocumento": $scope.firstStep.tipoDocumentoAsegurado.TipoDocumento,
                      "NumeroDocumento": $scope.firstStep.numDocAsegurado,
                      "FechaNacimiento": $filter("date")($scope.firstStep.fechaNacimiento.model, constants.formats.dateFormat),
                      "Sexo": $scope.firstStep.sexo == "H" ? '1' : '0',
                      "Nombre": $scope.firstStep.nombreAsegurado,
                      "ApellidoPaterno": $scope.firstStep.apellidoPaternoAsegurado,
                      "ApellidoMaterno": $scope.firstStep.apellidoMaternoAsegurado
                  },
                  "Contratante": {
                      "TipoDocumento": $scope.firstStep.tipoDocumento.TipoDocumento,
                      "NumeroDocumento": $scope.firstStep.numDoc,
                      "FechaNacimiento": ($scope.firstStep.dataContratante && $scope.firstStep.dataContratante.FechaNacimiento) ? $scope.firstStep.dataContratante.FechaNacimiento : '',
                      "Sexo": ($scope.firstStep.dataContratante.Sexo) ? $scope.firstStep.dataContratante.Sexo : '',
                      "Nombre": $scope.firstStep.nombre,
                      "ApellidoPaterno": $scope.firstStep.apellidoPaterno,
                      "ApellidoMaterno": $scope.firstStep.apellidoMaterno,
                      "TelefonoCasa": $scope.firstStep.TelefonoCasa || $scope.firstStep.dataContratante.Telefono || $scope.firstStep.telefonoFijo || "",
                      "TelefonoOficina": $scope.firstStep.TelefonoOficina || $scope.firstStep.dataContratante.TelefonoOficina || "999999999",
                      "TelefonoMovil": $scope.firstStep.TelefonoMovil || $scope.firstStep.dataContratante.Telefono2 || $scope.firstStep.telefonoCelular || "",
                      "mCorreoElectronico": $scope.firstStep.dataContratante.CorreoElectronico || ""
                  },
                  "optionEdit": optionEdit,
                  "coberturas": []
              }

              $scope.firstStep.coberturas.forEach(function(item) {
                  if (item.Checked) {
                      cotizacion.coberturas.push({
                          "chkSeleccionCobertura": "S",
                          "CodigoCobertura": item.CodigoCobertura,
                          "MarcaPrincipal": item.MarcaPrincipal,
                          "MontoCobertura": item.MontoCobertura
                      });
                  }
              });

              proxyCotizacion.calcularCotizacionVida(cotizacion, true).then(function(data) {
                  if (data.OperationCode == 200) {
                      $scope.firstStep.back = true; //para el back => return paso 1 => Utilizado en paso1 - $scope.$watch('data.mIgualAsegurado'
                      $scope.optionEdit = cotizacion.optionEdit;
					  $scope.secondStep = data.Data;
					  if (data.Message) {
                        mModalAlert.showWarning(data.Message, 'ALERTA')
                          .then(function() {
                            $state.go('.', { step: 2 });
                          });
                      } else {
                        $state.go('.', { step: 2 });
                      }
                  } else {
                      mModalAlert.showError(data.Message, 'ERROR');
                  }

              });
          };
          $scope.gotoStep = function(step) {
              if ($scope.currentStep > step) {
                  $state.go('.', {
                      step: step
                  });
              }
          };

  }]).factory('loaderVidaController', ['vidaFactory', '$q', 'mainServices',
  function(vidaFactory, $q, mainServices){
    var lists, quotation;

    function loadLists(showSpin){
      var vArrayServices = [
        vidaFactory.proxyProducto.GetListProductoVida(),
        vidaFactory.proxyTipoDocumento.getTipoDocumentoVida(),
        vidaFactory.proxyGeneral.GetListEstadoCivil(),
        vidaFactory.proxyGeneral.GetListFrecuenciaPago(null, null, false)
      ];
      var deferred = $q.defer();
      mainServices.fnReturnSeveralPromise(vArrayServices, showSpin).then(function(response){
        lists = response;
        deferred.resolve(lists);
      }, function (error){
        deferred.reject(error.statusText);
      });
      return deferred.promise;
    }

    function getQuotation(quoteNumber, showSpin){
      var deferred = $q.defer();
      vidaFactory.proxyCotizacion.buscarCotizacionVidaPorCodigo(quoteNumber, showSpin).then(function(response){
        quotation = response.Data;
        deferred.resolve(quotation);
      }, function (error){
        deferred.reject(error.statusText);
      });
      return deferred.promise;
    }

    return {
      loadLists: function(showSpin){
        if (lists) return $q.resolve(lists);
        return loadLists(showSpin);
      },
      getQuotation: function(quoteNumber, showSpin){
        return getQuotation(quoteNumber, showSpin);
      },
    };

  }]);
});
