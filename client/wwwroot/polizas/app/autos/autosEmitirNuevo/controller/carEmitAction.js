(function($root, deps, action) {
  define(deps, action);
})(this, ["angular", "constants", "helper", "lodash", "polizasFactory"], function(angular, constants, helper, _) {
  angular.module("appAutos")
    .controller("carEmitAction", [
    "$scope",
    "$state",
    "emitFactory",
    "proxyInspeccion",
    "mainServices",
    "proxyContratante",
    "oimPrincipal",
    "polizasFactory",
    function(
      $scope,
      $state,
      emitFactory,
      proxyInspeccion,
      mainServices,
      proxyContratante,
      oimPrincipal,
      polizasFactory) {
      // auto emit: paso 3

      $scope.fnSetRequiredManager = function(){
        $scope.formData.IS_REQUIRED_RC = polizasFactory.isFinanciamiento12CuotasMensual($scope.formData.tipoFinanciamiento.codigo);
        $scope.formData.IS_REQUIRED_RT = polizasFactory.isFinanciamiento12CuotasMensual($scope.formData.tipoFinanciamiento.codigo);
      }

      // function getDerechoEmision() {
        proxyInspeccion
          .GetPorcentajeDerechoEmision(
            {
              CodigoAgente: $scope.formData.selectedAgent.codigoAgente,
              CodigoMoneda: "2",
              CodigoRamo: "301",
              CodigoProducto: $scope.quotation.vehiculo.productoVehiculo.codigoProducto,
              NumeroPolizaGrupo: $scope.formData.grupoPoliza ? $scope.formData.grupoPoliza.grupoPolize || "" : "",
              McaGps: $scope.quotation.vehiculo.mcagps,
              FechaRiesgo: $scope.formData.dt
            },
            true
          )
          .then(
            function(response) {
              $scope.derechoEmision = helper.clone(response, true).data;
            },
            function error(response) {
              console.error("Error en el derecho de emision");
              $scope.derechoEmision = { porcentajeDerechoEmision: 3, impMinInsp: 5 };
            });

            $scope.GetDerechoEmision = function(withDiscount) {;
                if ($scope.derechoEmision) {
                    var prima = $scope.quotation.primaNeta
                    if (withDiscount) prima = $scope.primaNetaCalcMapfreDolar();
                    var derEmi = ($scope.derechoEmision.porcentajeDerechoEmision / 100) * prima;
                    derEmi = derEmi >= $scope.derechoEmision.impMinInsp ? derEmi : $scope.derechoEmision.impMinInsp;
                    return derEmi;
                }
                return 0;
            }

            $scope.hideDsctoComercial = function () {
              return Math.abs($scope.quotation.vehiculo.dsctoComercial || 0) === 0
            }
            $scope.dsctoComercialCal = function() {
              return $scope.quotation.montoPrima * (Math.abs($scope.quotation.vehiculo.dsctoComercial) / 100)
            }

            $scope.primaCalc = function() {
                return $scope.GetDerechoEmision() + ($scope.quotation.primaNeta);
            }
            $scope.primaNetaCalcMapfreDolar = function() {
                return ($scope.quotation.primaNeta - ($scope.formData.discountMDolar || 0));
            }
            $scope.primaComercialCalcMapfreDolar = function() {
                return $scope.GetDerechoEmision(true) + $scope.primaNetaCalcMapfreDolar();

      };

      function cleanMafreDolar() {
        $scope.formData.showMpfDolar = false;
        $scope.formData.inputMapreDolares = 0;
        $scope.formData.discountMDolar = 0;
      }
      $scope.currencyType = "$";

      function resolvePromises() {
        emitFactory.getEndosatarios().then(function(response) {
          var r = helper.clone(response.data, true).data;
          angular.forEach(r, function(a, c) {
            a.code = a.codigo;
            a.codigo = a.tipoDocumento + " - " + a.codigo;
          });
          $scope.endosatarios = r;
        });

        if (oimPrincipal.get_role() == "BANSEG") {
          emitFactory
            .getFinanciamientosROL(
              "automovil".toUpperCase(),
              $scope.quotation.vehiculo.productoVehiculo.codigoProducto,
              oimPrincipal.get_role()
            )
            .then(function(response) {
              $scope.financimientos = helper.clone(response.data, true).data;

              if ($scope.formData.esRC) {
                $scope.desabilitarFinanciamiento = true;
                $scope.financiamientoRC = "Al contado";
                var tipoFinanciamiento = _.find($scope.financimientos, function(it) {
                  return it.codigo === "10001";
                });

                $scope.formData.tipoFinanciamiento = tipoFinanciamiento;
              }
            });
        } else {
          emitFactory
            .getFinanciamientos("automovil".toUpperCase(), $scope.quotation.vehiculo.productoVehiculo.codigoProducto)
            .then(function(response) {
              $scope.financimientos = helper.clone(response.data, true).data;

              if ($scope.formData.esRC) {
                $scope.desabilitarFinanciamiento = true;
                $scope.financiamientoRC = "Al contado";
                var tipoFinanciamiento = _.find($scope.financimientos, function(it) {
                  return it.codigo === "10001";
                });

                $scope.formData.tipoFinanciamiento = tipoFinanciamiento;
              }
            });
        }
      }

      function hanlderEvents() {
        $scope.changeSum = function() {
          var validChange = $scope.formData.tempSumEndosar <= $scope.quotation.vehiculo.valorComercial;

          $scope.formData.mSumaEndosar =
            validChange && !$scope.sumEndorseToggle ? $scope.formData.tempSumEndosar : $scope.formData.mSumaEndosar;

          $scope.sumEndorseError = !validChange && !$scope.sumEndorseToggle;

          if (validChange) $scope.sumEndorseToggle = !$scope.sumEndorseToggle;
        };

        $scope.isValidFormStep3 = function() {
          $scope.frmEmitN3.markAsPristine();
          var vValidateSearchEndorsee = _validateSearchEndorsee();
          var v =
            $scope.frmEmitN3.$valid &&
            !$scope.sumEndorseError &&
            (!$scope.formData.showMpfDolar || !$scope.isOutRange()) &&
            vValidateSearchEndorsee;
          return v;
        };
        $scope.isCompany = function() {
          return !mainServices.fnShowNaturalRucPerson(
            $scope.formData.contractor.mTipoDocumento.Codigo,
            $scope.formData.contractor.mNumeroDocumento
          );
        };

        $scope.cleanMDolar = function() {
          cleanMafreDolar();
          $scope.formData.showMpfDolar = true;
        };
        $scope.addDiscount = function(value) {
          if (value && value > 0 && value <= $scope.formData.contractor.saldoMapfreDolares) {
            $scope.formData.discountMDolar = parseFloat($scope.formData.inputMapreDolares);
          } else {
            $scope.formData.discountMDolar = 0.0;
          }
        };
        $scope.isOutRange = function() {
          var v = !$scope.formData.contractor
            ? 0
            : !$scope.formData.contractor.saldoMapfreDolares
            ? 0
            : $scope.formData.contractor.saldoMapfreDolares;

          return v < $scope.iNTInputMapreDolares();
        };
        $scope.iNTInputMapreDolares = function() {
          var v = parseInt($scope.formData.inputMapreDolares);
          return isNaN(v) ? 0 : v;
        };
      }

      function setCurrentContract() {
        if ($scope.formData.contractor && $scope.formData.contractor.mTipoDocumento) {
          $scope.currentContract.TipoDocumento = $scope.formData.contractor.mTipoDocumento.Codigo;
          $scope.currentContract.CodigoDocumento = $scope.formData.contractor.mNumeroDocumento;
        }
      }

      function tryResetMapfreDolar() {
        if (
          $scope.currentContract &&
          $scope.formData.contractor &&
          $scope.formData.contractor.mTipoDocumento &&
          ($scope.currentContract.TipoDocumento !== $scope.formData.contractor.mTipoDocumento.Codigo ||
            $scope.currentContract.CodigoDocumento !== $scope.formData.contractor.mNumeroDocumento)
        ) {
          cleanMafreDolar();
        }
        setCurrentContract();
      }
      $scope.$on("$stateChangeSuccess", function(s, state, param, d) {
        tryResetMapfreDolar();
      });

      (function onLoad() {
        function allowLoadStep() {
          if (!$scope.formData.step2$Valid || !$scope.formData.step1$Valid) {
            $state.go("newEmit.steps", { step: 1 });
          }
        }

        allowLoadStep();

        $scope.sumEndorseToggle = true;

        $scope.formData.mSumaEndosar =
          $scope.formData.mSumaEndosar || ($scope.quotation.vehiculo ? $scope.quotation.vehiculo.valorComercial : 0);

        $scope.formData.tempSumEndosar = $scope.formData.tempSumEndosar || $scope.formData.mSumaEndosar;

        $scope.currentContract = $scope.currentContract || {};

        $scope.sumEndorseError = false;

        resolvePromises();

        hanlderEvents();
        $scope.formData.inputMapreDolares = 0;

        if (!$scope.formData.mOpcionEndosatario) $scope.formData.mOpcionEndosatario = 0;
      })();

      $scope.previews = function() {};
      $scope.next = function() {
        if (!$scope.isValidFormStep3()) {
          return;
        }
        $scope.formData.step3$Valid = true;
        $state.go("newEmit.steps", { step: 4 });
      };

      /*########################
            # Endosatario
            ########################*/
      function _validateSearchEndorsee() {
        var vValidate = true;
        if ($scope.formData.mOpcionEndosatario > 0) {
          if ($scope.formData.mOpcionEndosatario == 1)
            $scope.formData.errorEndorsee.error2 = !$scope.formData.showLabelEndorsee;
          vValidate = $scope.formData.mEndosario.codigo != null;
        }
        return vValidate;
      }
      function _initErrorEndorsee() {
        $scope.formData.errorEndorsee = {
          error1: false,
          error2: false
        };
      }
      function _clearSearchEndorsee() {
        $scope.formData.showLabelEndorsee = false;
        $scope.formData.mEndosario = {
          codigo: null
        };
        _initErrorEndorsee();
      }
      $scope.fnClearEndorsee = function(option) {
        if (option != 1) $scope.formData.mBuscarEndosatario = "";
        _clearSearchEndorsee();
      };
      $scope.fnSearchEndorsee = function(documentNumber, showLabelEndorsee) {
        _clearSearchEndorsee();
        if (showLabelEndorsee) {
          $scope.formData.showLabelEndorsee = false;
        } else {
          proxyContratante.GetEndosatarioTercero(documentNumber, true).then(
            function(response) {
              if (response.OperationCode == constants.operationCode.success) {
                $scope.formData.mEndosario = helper.clone(response.Data, true);
                $scope.formData.showLabelEndorsee = true;
              } else {
                $scope.formData.errorEndorsee.error1 = true;
              }
            },
            function(error) {
            },
            function(defaultError) {
            }
          );
        }
      };


    }
  ]);
});
