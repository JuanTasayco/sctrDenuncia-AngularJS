(function($root, deps, action) {
  define(deps, action);
})(this, ["angular", "modalSendEmail"], function(angular) {
  var appAutos = angular.module("appAutos");

  appAutos.controller("hogarQuoteS2Controller", [
    "$scope",
    "$state",
    "hogarFactory",
    "mModalAlert",
    "mpSpin",
    function(
      $scope,
      $state,
      hogarFactory,
      mModalAlert,
      mpSpin
    ) {
      (function onLoad() {
        $scope.mainStep = $scope.mainStep || {};
        $scope.firstStep = $scope.firstStep || {};
        $scope.secondStep = $state.params.paramsHogarModule || {};

        if (Object.keys($scope.secondStep).length > 0) {
          $scope.mainStep.showagente = true;
          $scope.mainStep.goback = true;
          $scope.mainStep.showtitle = true;
        } else {
          $state.go(".", {
            step: 1
          });
        }
      })();

      var edificacionValue = 0;
      var contenidoValue = 0;
      var objetosValue = 0;
      var contenidoRoboValue = 0;
      var objetosRoboValue = 0;

      $scope.secondStep.mCoberturaTerremotoContenido = {};
      $scope.secondStep.mCoberturaTerremotoEdificacion = {};
      $scope.secondStep.mCoberturaTerremotoObjetos = {};

      $scope.secondStep.mCoberturaIncendioObjetos = {};
      $scope.secondStep.mCoberturaRoboObjetos = {};

      $scope.onChangeEdificacion = function(val) {
        if (val) {
          edificacionValue = parseInt(val);
          if (val.length >= 1) {
            $scope.secondStep.mCoberturaIncendioEdificacion = {
              valueDefault: true
            };
          }
        } else {
          edificacionValue = 0;
          $scope.secondStep.mCoberturaIncendioEdificacion = {
            valueDefault: false
          };
        }
      };

      $scope.onChangeContenido = function(val) {
        if (val) {
          contenidoValue = parseInt(val);
          if (val.length >= 1) {
            $scope.showObjetos = true;
            $scope.secondStep.mCoberturaIncendioContenido = {
              valueDefault: true
            };
            $scope.secondStep.mCoberturaRoboContenido = {
              valueDefault: true
            };
          }
        } else {
          contenidoValue = 0;
          objetosValue = 0;
          contenidoRoboValue = 0;
          objetosRoboValue = 0;
          $scope.showObjetos = false;
          $scope.mObjetosValor = "";
          $scope.mObjetosValorRobo = "";
          $scope.mContenidoValorRobo = "";
          $scope.secondStep.mCoberturaIncendioContenido = {
            valueDefault: false
          };
          $scope.secondStep.mCoberturaRoboContenido = {
            valueDefault: false
          };
          $scope.secondStep.mCoberturaTerremotoContenido = {
            valueDefault: false
          };
          $scope.secondStep.mCoberturaIncendioObjetos = {
            valueDefault: false
          };
          $scope.secondStep.mCoberturaRoboObjetos = {
            valueDefault: false
          };
          $scope.secondStep.mCoberturaTerremotoObjetos = {
            valueDefault: false
          };
        }
      };

      $scope.onChangeObjetos = function(val) {
        if (val) {
          objetosValue = parseInt(val);
          if (val.length >= 1) {
            $scope.secondStep.mCoberturaIncendioObjetos = {
              valueDefault: true
            };
            $scope.secondStep.mCoberturaRoboObjetos = {
              valueDefault: true
            };
          }
        } else {
          objetosValue = 0;
          $scope.secondStep.mCoberturaIncendioObjetos = {
            valueDefault: false
          };
          $scope.secondStep.mCoberturaRoboObjetos = {
            valueDefault: false
          };
        }
      };

      $scope.sumDeclarado = function() {
        $scope.totalDeclarado = edificacionValue + contenidoValue + objetosValue;
      };

      $scope.onChangeContenidoRobo = function(val) {
        contenidoRoboValue = val ? parseInt(val) : 0;
      };

      $scope.onChangeObjetosRobo = function(val) {
        objetosRoboValue = val ? parseInt(val) : 0;
      };

      $scope.sumRobo = function() {
        $scope.totalRobado = contenidoRoboValue + objetosRoboValue;
      };

      $scope.$watch("secondStep.mCoberturaRoboContenido.valueDefault", function(value) {
        if (!value) {
          objetosRoboValue = 0;
          $scope.mObjetosValorRobo = "";
        }
        $scope.sumRobo();
      });

      $scope.$watch("secondStep.mCoberturaRoboObjetos.valueDefault", function(value) {
        if (!value) {
          objetosRoboValue = 0;
          $scope.mObjetosValorRobo = "";
        }
        $scope.sumRobo();
      });

      function formatDate(date) {
        var format = date.slice(0, 10);
        return format.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, "$3/$2/$1");
      }

      function buildQuotationComparativo(request) {
        request.riesgoHogar[0].tipComunicacion = 1;
        request.riesgoHogar[0].tipComunicacionSpecified = true;
        request.riesgoHogar[0].mcaVideoWeb = "N";
        request.riesgoHogar[0].mcaLlaveroMedico = "N";
        request.riesgoHogar[0].mcaAlarmaMonitoreo = "S";

        var hogarIdealTradicional = JSON.parse(JSON.stringify(request));
        var hogarIdealSmart = JSON.parse(JSON.stringify(request));
        var hogar24horas = JSON.parse(JSON.stringify(request));
        var hogarSmart = JSON.parse(JSON.stringify(request));

        hogarIdealTradicional.riesgoHogar[0].mcaKitSmart = "N";
        hogarIdealTradicional.riesgoHogar[0].mcaAlarmaMonitoreo = "N";
        hogarIdealTradicional.producto.codModalidad = "31";

        hogarIdealSmart.riesgoHogar[0].mcaKitSmart = "N";
        hogarIdealSmart.riesgoHogar[0].mcaAlarmaMonitoreo = "N";
        hogarIdealSmart.producto.codModalidad = "31";

        hogar24horas.riesgoHogar[0].mcaKitSmart = "N";
        hogar24horas.producto.codModalidad = "6";
        hogar24horas.poliza.numPolizaGrupo = "12019";

        hogarSmart.riesgoHogar[0].mcaKitSmart = "S";
        hogarSmart.producto.codModalidad = "30";
        hogarSmart.poliza.fecVctoSpto = formatDate(
          JSON.parse(JSON.stringify(new Date(new Date().setYear(new Date().getFullYear() + 2))))
        );
        hogarSmart.poliza.numPolizaGrupo = "12018";

        return [hogarIdealTradicional, hogarIdealSmart, hogar24horas, hogarSmart];
      }

      $scope.nextStep = function() {
        var sendDataParams = $scope.secondStep.data;
        var requestParams = $scope.secondStep.request;
        var goNextStep = requestParams.producto.codModalidad == "0" ? 4 : 3;

        requestParams.PorDctoIntgPlaza = $scope.firstStep.PorDctoIntgPlaza || 0;
        requestParams.MarcaPorDctoIntegralidad = $scope.firstStep.DctoIntegralidad ? "S" : "N";
        requestParams.riesgoHogar[0].impContenido = $scope.mContenidoValor || 0;
        requestParams.riesgoHogar[0].impDesaparicion = $scope.mDesaparicionMisteriosa || 0;
        requestParams.riesgoHogar[0].impDesonestidad = $scope.mDeshonestidadEmpleado || 0;
        // TODO: se comenta lineas para descartar error en el request - pendiente de confirmacion por back
        // requestParams.riesgoHogar[0].impDesaparicionSpecified = true;
      //  requestParams.riesgoHogar[0].impDesonestidadSpecified = true;
        requestParams.riesgoHogar[0].impEdificacion = $scope.mEdificacionValor || 0;
        requestParams.riesgoHogar[0].impObjetosValiosos = objetosValue;
        requestParams.riesgoHogar[0].impRoboContenido = $scope.mContenidoValorRobo || 0;
        requestParams.riesgoHogar[0].impRoboObjetosValiosos = $scope.mObjetosValorRobo || 0;
        requestParams.riesgoHogar[0].mcaTerremotoContenido = $scope.secondStep.mCoberturaTerremotoContenido.valueDefault
          ? "S"
          : "N";
        requestParams.riesgoHogar[0].mcaTerremotoEdificacion = $scope.secondStep.mCoberturaTerremotoEdificacion
          .valueDefault
          ? "S"
          : "N";
        requestParams.riesgoHogar[0].mcaTerremotoObjetosVal = $scope.secondStep.mCoberturaTerremotoObjetos.valueDefault
          ? "S"
          : "N";

        requestParams.riesgoHogar[0].mcaIncendioContenido = $scope.secondStep.mCoberturaIncendioContenido.valueDefault
          ? "S"
          : "N";
        requestParams.riesgoHogar[0].mcaIncendioEdificacion = $scope.secondStep.mCoberturaIncendioEdificacion
          .valueDefault
          ? "S"
          : "N";
        requestParams.riesgoHogar[0].mcaIncendioObjetosVal = $scope.secondStep.mCoberturaIncendioObjetos.valueDefault
          ? "S"
          : "N";

        requestParams.riesgoHogar[0].mcaRoboContenido = $scope.secondStep.mCoberturaRoboContenido.valueDefault
          ? "S"
          : "N";
        requestParams.riesgoHogar[0].mcaRoboObjetosVal = $scope.secondStep.mCoberturaRoboObjetos.valueDefault
          ? "S"
          : "N";
        requestParams.riesgoHogar[0].mcaKitSmart = $scope.secondStep.request.riesgoHogar[0].mcaKitSmart;

        var requestParamsGeneral =
          requestParams.producto.codModalidad == "0" ? buildQuotationComparativo(requestParams) : requestParams;

        var validateRoboContenido;
        var validateRoboObjetos;

        function quoteWrap() {

          if (requestParams.producto.codModalidad === '0') {
            $scope.primas = [];
            for(var i = 0; i<= requestParamsGeneral.length; i++){
              var item = requestParamsGeneral[i];
              var pms = hogarFactory.quote(item, true)
              pms.then(function(response){
                if(response.Data.codError === '0'){
                  mpSpin.start();
                  $scope.primas.push(response.Data);
                }else{
                  $scope.keepGoing = false;
                  mpSpin.end();
                  mModalAlert.showWarning(response.Data.descError, '')
                }
              });
              if(!$scope.keepGoing){
                break;
              }
            }
            var hogarIdealTradicionalPrima = $scope.primas[0];
            var hogarIdealSmartPrima = $scope.primas[1];
            var hogar24horasPrima = $scope.primas[2];
            var hogarSmartPrima = $scope.primas[3];
            if (hogarIdealTradicionalPrima && hogarIdealSmartPrima && hogar24horasPrima && hogarSmartPrima) {
              mpSpin.end();
              $state.go(".", {
                step: goNextStep,
                paramsHogarModule: {
                  data: sendDataParams,
                  requestQuotation: requestParamsGeneral,
                  hogarIdealTradicionalPrima: hogarIdealTradicionalPrima,
                  hogarIdealSmartPrima: hogarIdealSmartPrima,
                  hogar24horasPrima: hogar24horasPrima,
                  hogarSmartPrima: hogarSmartPrima
                }
              });
            }
          } else {
            hogarFactory.quote(requestParamsGeneral, true).then(function(res) {
              if (res.Data.codError == "0") {
                $state.go(".", {
                  step: goNextStep,
                  paramsHogarModule: {
                    response: res.Data,
                    data: sendDataParams,
                    requestQuotation: requestParamsGeneral
                  }
                });
              }else{
                mpSpin.end();
                mModalAlert.showWarning(res.Data.descError, '');
                return;
              }
            });
          }
        }

        if ($scope.mEdificacionValor > 0) {
          if ($scope.secondStep.mCoberturaRoboContenido.valueDefault) {
            if ($scope.mContenidoValorRobo > 0) {
              validateRoboContenido = true;
            } else {
              validateRoboContenido = false;
              mModalAlert.showInfo("", "Debe ingresar un valor para robo de contenido");
            }
          } else {
            validateRoboContenido = true;
          }

          if ($scope.secondStep.mCoberturaRoboObjetos.valueDefault) {
            if ($scope.mObjetosValorRobo > 0) {
              validateRoboObjetos = true;
            } else {
              validateRoboObjetos = false;
              mModalAlert.showInfo("", "Debe ingresar un valor para robo de objetos");
            }
          } else {
            validateRoboObjetos = true;
          }

          if (validateRoboContenido && validateRoboObjetos) {
            quoteWrap();
          }
        } else {
          mModalAlert.showInfo("", "Debe ingresar un valor para edificación");
        }
      };
    }
  ]);
});
