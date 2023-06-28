(function($root, deps, action) {
  define(deps, action);
})(
  this,
  ["angular", "constants", "/polizas/app/autos/autosEmitirUsado/service/usedCarEmitFactory.js", "polizasFactory"],
  function(angular, constants) {
    angular.module("appAutos").controller("usedCarEmitS4", [
      "$scope",
      "usedCarEmitFactory",
      "proxyAutomovil",
      "carEndorsee",
      "carDiscountCommission",
      "$window",
      "carGps",
      "$state",
      "$filter",
      "mModalAlert",
      "oimPrincipal",
      "mainServices",
      "polizasFactory",
      "proxyGeneral",
      'oimAbstractFactory',
      function(
        $scope,
        usedCarEmitFactory,
        proxyAutomovil,
        carEndorsee,
        carDiscountCommission,
        $window,
        carGps,
        $state,
        $filter,
        mModalAlert,
        oimPrincipal,
        mainServices,
        polizasFactory,
        proxyGeneral,
        oimAbstractFactory
      ) {
        (function onLoad() {

          $scope.swPremium = false;

          $scope.mainStep = $scope.mainStep || {};
          $scope.firstStep = $scope.firstStep || {};
          $scope.secondStep = $scope.secondStep || {};
          $scope.thirdStep = $scope.thirdStep || {};
          $scope.fourthStep = $scope.fourthStep || {};
          $scope.fiveStep = $scope.fiveStep || {};
          $scope.summaryStep = $scope.summaryStep || {};
          //INICIO BUILDSOFT
          var paramsBs = {
                CodigoAgente: $scope.mainStep.claims.codigoAgente,
                CodigoCia: constants.module.polizas.autos.companyCode,
                CodigoMoneda: constants.module.polizas.autos.codeCurrency,
                CodigosProductos: [$scope.secondStep.mProducto.CodigoProducto],
                Vehiculo: {
                  CodigoTipoVehiculo: $scope.firstStep.dataInspection.Veh_tipo,
                  CodigoUso: $scope.secondStep.mTipoUso.Codigo,
                  
                  CodigoMarca: $scope.firstStep.dataInspection.Veh_marca,//buildsoft
                  CodigoModelo: $scope.firstStep.dataInspection.Veh_modelo,//buildsoft
                  CodigoTipo: $scope.firstStep.dataInspection.Veh_tipo,//buildsoft           
                  AnioFabricacion: $scope.firstStep.dataInspection.Veh_ano
        
                }
              };
          //FIN BUILDSOFT

          if (
            Object.keys($scope.firstStep).length <= 1 ||
            Object.keys($scope.secondStep).length < 1 ||
            Object.keys($scope.thirdStep).length < 1
          ) {
            $state.go(".", {
              step: 1
            });
          }

          varInit();
          initEmitError();
          evalAgentViewDcto();

          if (oimPrincipal.get_role() == "BANSEG") {
            var params = {
              value1: "automovil".toUpperCase(),
              value2: $scope.secondStep.mProducto.CodigoProducto, //$scope.quotation.vehiculo.productoVehiculo.codigoProducto,
              value3: oimPrincipal.get_role()
            };
            usedCarEmitFactory.getFinancingROL(params).then(
              function(response) {
                $scope.financingData = response.Data;
              },
              function(error) {
                mModalAlert.showError(error.data.message, "Error");
              }
            );
          } else {
            var params2 = {
              value1: "automovil".toUpperCase(),
              value2: $scope.secondStep.mProducto ? $scope.secondStep.mProducto.CodigoProducto : ''
            };
            usedCarEmitFactory.getFinancing(params2).then(
              function(response) {
                $scope.financingData = response.Data;
              },
              function(error) {
                mModalAlert.showError(error.data.message, "Error");
              }
            );
          }

          if (carEndorsee) $scope.endorseeData = carEndorsee;
          if (!$scope.fourthStep.mOpcionEndosatario) $scope.fourthStep.mOpcionEndosatario = 0;
          if (typeof $scope.fourthStep.mSumaEndosar == "undefined") {
            $scope.fourthStep.mSumaEndosar = $scope.secondStep.dataCarValue && $scope.secondStep.dataCarValue.Valor;
          }

          $scope.fourthStep.discountCommissionData = [];
          var vDiscountCommissionData = {
            AgenteComision: null, //0
            DsctoEspecial: 0,
            DsctoEspecialPorcentaje: "-",
            ValorDsctoEsp: 0
          };
          console.log(carDiscountCommission);
          //debugger;
        //INICIO BUILDSOFT

        var vDescuentoComercialDataTmp = {
          DsctoComercial: '0',
          DsctoEspValor: '0 %'
        }
        $scope.fourthStep.discountComercialDataBs = [vDescuentoComercialDataTmp];
        // $scope.fourthStep.discountComercialDataBs = [];
        console.log("parametros entrada: ",paramsBs);
        proxyAutomovil.GetDescuentoComision(paramsBs, true).then(function (response) {       
          console.log("GetDescuentoComision bs: ",response);            
          if (response.Data && response.Data.Dsctos[0].ItemsComercial.length) {
            angular.forEach(response.Data.Dsctos[0].ItemsComercial, function (value) {              
                var vDescuentoComercialData = {
                  DsctoComercial: value.DsctoComercial,
                  DsctoEspValor: value.DsctoEspValor
                };
                $scope.fourthStep.discountComercialDataBs.push(vDescuentoComercialData);                
            });
          }
          $scope.fourthStep.nDescuentoComercial.DsctoComercial = '0';
          console.log("lista despues del proxyautomovil bs ",$scope.fourthStep.discountComercialDataBs); 
        });
          //FIN BUILDSOFT
          if (carDiscountCommission && carDiscountCommission.Dsctos[0].Items.length > 0) {
            angular.forEach(carDiscountCommission.Dsctos[0].Items, function(value, key) {
              vDiscountCommissionData = {
                AgenteComision: value.AgenteComision,
                DsctoEspecial: value.DsctoEspecial,
                DsctoEspecialPorcentaje: $scope.Math.abs(value.DsctoEspecial) + "%",
                ValorDsctoEsp: value.ValorDsctoEsp
              };
              $scope.fourthStep.discountCommissionData.push(vDiscountCommissionData);
            });
          } else {
            $scope.fourthStep.discountCommissionData.push(vDiscountCommissionData);
          }

          $scope.fourthStep.flgDsctoComercial = "N";
          //$scope.fourthStep.discountComercialData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function(dscto) { return { DsctoEspValor: dscto + '%', DsctoComercial: -1 * dscto };  });
          if (carDiscountCommission && carDiscountCommission.Dsctos[0]) {
            $scope.fourthStep.flgDsctoComercial = carDiscountCommission.Dsctos[0].FlgDsctoComercial;
          }
        })();

        $scope.fnSetRequiredManager = function(){
          $scope.fiveStep = {};
          $scope.mainStep.IS_REQUIRED_RC = $scope.fourthStep.mTipoFinanciamiento.Codigo === '10012'
          $scope.mainStep.IS_REQUIRED_RT = $scope.fourthStep.mTipoFinanciamiento.Codigo === '10012'
        }

        function varInit() {
          $scope.fourthStep.sumEndorseToggle = true; //endorsee
          $scope.sumEndorseError = false; //endorsee
          $scope.fourthStep.mMapfreDolar = 0;
          $scope.Math = $window.Math;
          if (typeof $scope.fourthStep.dataCalculatePremium == "undefined") {
            $scope.fourthStep.dataCalculatePremium = {
              commercialPremium: 0.0,
              netPremium: 0.0,
              discountCommission: 0.0,
              discountComercial: 0.0,
              emissionValue: 0.0,
              igv: 0.0,
              mapfreDollar: 0.0,
              total: 0.0
            };
          }

          if (typeof $scope.fourthStep.showCalculatePremium == "undefined")
            $scope.fourthStep.showCalculatePremium = false;
          if (typeof $scope.fourthStep.mapfreDollarTotal == "undefined") $scope.fourthStep.mapfreDollarTotal = false;
          if (typeof $scope.fourthStep.mapfreDollarError == "undefined") $scope.fourthStep.mapfreDollarError = false;
        }

        function roundTwoDecimals(num) {
          return +($scope.Math.round(num + "e+2") + "e-2");
        }

        function _calculatePremium() {
          var netPremium =
            $scope.fourthStep.dataCalculatePremium.netPremium -
            $scope.fourthStep.dataCalculatePremium.discountCommission -
            $scope.fourthStep.dataCalculatePremium.discountComercial -
            $scope.fourthStep.dataCalculatePremium.mapfreDollar;
          $scope.fourthStep.dataCalculatePremium.emissionValue = roundTwoDecimals(
            netPremium * $scope.fourthStep.dataCalculatePremium.emissionValuePercent
          );
          $scope.fourthStep.dataCalculatePremium.commercialPremium = roundTwoDecimals(
            $scope.fourthStep.dataCalculatePremium.netPremium
          );
          $scope.fourthStep.dataCalculatePremium.igv = roundTwoDecimals(
            (netPremium + $scope.fourthStep.dataCalculatePremium.emissionValue) * 0.18
          );
          $scope.fourthStep.dataCalculatePremium.total = roundTwoDecimals(
            netPremium +
              $scope.fourthStep.dataCalculatePremium.emissionValue +
              $scope.fourthStep.dataCalculatePremium.igv
          );
        }

        function initEmitError() {
          $scope.emitError = {
            value: false,
            description: ""
          };
        }

        function evalAgentViewDcto(){
          var params = {CodigoAgente: $scope.mainStep.claims.codigoAgente}
          proxyGeneral.EsDescuentoIntegralidadParaAgentes(params, false)
          .then(function(response){
            $scope.fourthStep.viewDcto = response.Data
          });
        }

        $scope.endorseeChange = function(endorsee) {
          $scope.fourthStep.showCalculatePremium = false; //Oculta Calculo prima porque se ha modifcado la suma a endosar
        };

        $scope.sumEndorseAction = function(sumEndorse) {
          if ($scope.fourthStep.sumEndorseToggle) {
            $scope.fourthStep.sumEndorseToggle = false;
          } else {
            $scope.sumEndorseError = false;
            if (
              typeof sumEndorse == "undefined" ||
              sumEndorse == "" ||
              sumEndorse < 0 ||
              sumEndorse > $scope.secondStep.dataCarValue.Valor
            ) {
              $scope.sumEndorseError = true;
            } else {
              $scope.fourthStep.showCalculatePremium = false; //Oculta Calculo prima porque se ha modifcado la suma a endosar
              $scope.fourthStep.sumEndorseToggle = true;
            }
          }
        };

        $scope.calculateDiscountCommission = function(discountCommission) {
          if (typeof discountCommission == "undefined" || discountCommission.AgenteComision == null) {
            $scope.fourthStep.dataCalculatePremium.discountCommission = 0.0;
          } else {
            var discountCommissionPercent = $scope.Math.abs(discountCommission.DsctoEspecial) / 100;
            $scope.fourthStep.dataCalculatePremium.discountCommission = roundTwoDecimals(
              $scope.fourthStep.dataCalculatePremium.netPremium * discountCommissionPercent
            );
          }
          _calculatePremium();
        };

        $scope.calculateDiscountComercial = function(discountComercial) {
          if (typeof discountComercial == "undefined") {
            $scope.fourthStep.dataCalculatePremium.discountComercial = 0.0;
          } else {
            var discountComercialPercent = $scope.Math.abs(discountComercial.DsctoComercial) / 100;
            $scope.fourthStep.dataCalculatePremium.discountComercial = roundTwoDecimals(
              $scope.fourthStep.dataCalculatePremium.netPremium * discountComercialPercent
            );
          }
          _calculatePremium();
        };

        $scope.addMapfreDollar = function(value) {
          $scope.fourthStep.mapfreDollarTotal = false;
          $scope.fourthStep.mapfreDollarError = false;
          var mapfreDolarDisponible = $scope.thirdStep.dataContractor.saldoMapfreDolares || 0;
          if (typeof value != "undefined" && (value > 0 && value <= mapfreDolarDisponible)) {
            $scope.fourthStep.dataCalculatePremium.mapfreDollar = value;
            $scope.fourthStep.mapfreDollarTotal = true;
          } else {
            $scope.fourthStep.dataCalculatePremium.mapfreDollar = 0.0;
            $scope.fourthStep.mapfreDollarError = true;
          }
          _calculatePremium();
        };

        $scope.closeMapfreDollar = function() {
          $scope.fourthStep.mMapfreDolar = "";
          $scope.fourthStep.dataCalculatePremium.mapfreDollar = 0.0;
          $scope.fourthStep.mapfreDollarTotal = false;
          $scope.fourthStep.mapfreDollarError = false;
          _calculatePremium();
        };

        $scope.calculatePremium = function() {
          //Para no ejecutar tantas veces el servicio, cuando seleciona un endosatario
          var paramsCalculatePremium = {
            MarcaPorDctoIntegralidad: $scope.fourthStep.DctoIntegralidad ? "S" : "N",
            PorDctoIntgPlaza: $scope.fourthStep.PorDctoIntgPlaza ? $scope.fourthStep.PorDctoIntgPlaza : 0,
            AutoConInspeccion: "S", // S => EmisionAutoUsado
            numeroCotizacion: "", //Campo no requerido
            CodigoCorredor: $scope.mainStep.claims.codigoAgente, //9808, //CodigoAgente
            TotalDsctoComision: 0, //Campo no requerido
            DsctoComision: 0, //Campo no requerido
            Vehiculo: {
              CodigoTipo: $scope.firstStep.dataInspection.Veh_tipo,
              CodigoMarca: $scope.firstStep.dataInspection.Veh_marca,
              CodigoModelo: $scope.firstStep.dataInspection.Veh_modelo,
              CodigoSubModelo: $scope.firstStep.dataInspection.Veh_sub_modelo,
              CodigoUso: $scope.secondStep.mTipoUso.Codigo,
              CodigoProducto: $scope.secondStep.mProducto.CodigoProducto, //NUEVO CAMPO
              DsctoComercial: 0, //Campo no requerido
              AnioFabricacion: $scope.firstStep.dataInspection.Veh_ano,
              SumaAsegurada: $scope.fourthStep.mSumaEndosar,
              TipoVolante: $scope.firstStep.dataInspection.Veh_timon,
              MCAGPS: carGps,
              MCANUEVO: "N", // N => USADO
              PolizaGrupo:
                typeof $scope.secondStep.groupPolizeData == "undefined"
                  ? ""
                  : $scope.secondStep.groupPolizeData.groupPolize, //SINO EXISTE VALOR VACIO => ''
              ProductoVehiculo: {
                CodigoModalidad: $scope.secondStep.mProducto.CodigoModalidad,
                CodigoCompania: constants.module.polizas.autos.companyCode,
                CodigoRamo: constants.module.polizas.autos.codeRamo
              },
              CodTipoFrecUso: "", //$scope.thirdStep.vehicleDetailsContractor.mTypeVehicle.Codigo,
              CodAnioLicencia: $scope.thirdStep.vehicleDetailsContractor.mAntiguedadLicencia.Codigo,
              CodGuardaGaraje: $scope.thirdStep.vehicleDetailsContractor.mGaraje,
              CodConductorUnico: $scope.thirdStep.vehicleDetailsContractor.mUnicoConductor,
              CodEventoUltimosAnios: $scope.thirdStep.vehicleDetailsContractor.mAccidentesVehicle.Codigo,
              CodTipoUsoVehiculo: $scope.thirdStep.vehicleDetailsContractor.mUseVehicle.Codigo,
              DesTipoFrecUso: "", //$scope.thirdStep.vehicleDetailsContractor.mTypeVehicle.Nombre,
              DesAnioLicencia: $scope.thirdStep.vehicleDetailsContractor.mAntiguedadLicencia.Nombre,
              DesEventoUltimosAnios: $scope.thirdStep.vehicleDetailsContractor.mAccidentesVehicle.Nombre,
              DesTipoUsoVehiculo: $scope.thirdStep.vehicleDetailsContractor.mUseVehicle.Nombre,
              TipoTransmision: $scope.secondStep.isEmblem ? { Codigo: $scope.thirdStep.vehicleDetailsContractor.VehicleTransmission.Codigo } : undefined,
              ScoreMorosidad: $scope.secondStep.isEmblem ? $scope.thirdStep.dataContractor.scoreMorosidad : undefined
            },
            Contratante: {
              MCAMapfreDolar: $scope.fourthStep.mMapfreDolar > 0 ? "S" : "N", //($scope.firstStep.dataContractor.SaldoMapfreDolar > 0) ? 'S' : 'N',
              ImporteMapfreDolar: $scope.fourthStep.mMapfreDolar, //$scope.firstStep.dataContractor.SaldoMapfreDolar
              EstadoCivil: $scope.secondStep.isEmblem ? { Codigo: $scope.thirdStep.dataContractor.mEstadoCivil.Codigo } : undefined,
              FechaExpedicion: $scope.secondStep.isEmblem ? validateExpirationDate($scope.thirdStep.dataContractor) : undefined
            },
            Ubigeo: {
              CodigoProvincia: $scope.firstStep.dataContractor.Ubigeo.CodigoProvincia, //'128',//$scope.firstStep.dataInspection.Cod_prov,
              CodigoDistrito: $scope.firstStep.dataContractor.Ubigeo.CodigoDistrito //'22',//$scope.firstStep.dataInspection.Cod_dep
            }
          };

          usedCarEmitFactory.getCalculatePremium(paramsCalculatePremium, true).then(
            function(response) {
              if (response.OperationCode == constants.operationCode.success) {
                $scope.fourthStep.dataCalculatePremium.netPremium = response.Data.Vehiculo.PrimaVehicular;
                $scope.fourthStep.dataCalculatePremium.netPremiumReal = response.Data.Vehiculo.PrimaVehicularReal; //nuevo valor que se debe enviar en el grabar
                $scope.fourthStep.dataCalculatePremium.emissionValuePercent = response.Data.PorDerechoEmision / 100;
                _calculatePremium();
                $scope.fourthStep.showCalculatePremium = true;
              } else {
                mModalAlert.showWarning(response.Message, "Error BD");
              }
            },
            function(error) {},
            function(defaultError) {}
          );
        };

        function _getPickUp(typeVehicle) {
          var vResult = "N";
          if (typeVehicle == "6" || typeVehicle == "7") {
            vResult = "S";
          }
          return vResult;
        }

        $scope.validationForm = function() {
          $scope.frmForthStep.markAsPristine();
          var vValidateSearchEndorsee = _validateSearchEndorsee();
          return $scope.frmForthStep.$valid &&
          $scope.fourthStep.showCalculatePremium &&
          vValidateSearchEndorsee;
        };

        $scope.nextStep = function(){
          $scope.swPremium = true;
          if(!$scope.validationForm()){
            return;
          }else{
            $state.go('.',{step: 5});
          }
        }

        $scope.$on("changingStep", function(ib, e) {
          if (e.step <= 4) {
            e.cancel = false;
          } else {
            e.cancel = true;
          }
        });

        /*########################
			# Endosatario
      ########################*/
        function _validateSearchEndorsee() {
          var vValidate = true;
          if ($scope.fourthStep.mOpcionEndosatario > 0) {
            if ($scope.fourthStep.mOpcionEndosatario == 1)
              $scope.fourthStep.errorEndorsee.error2 = !$scope.fourthStep.showLabelEndorsee;
            vValidate = $scope.fourthStep.mEndosatario.Codigo != null;
          }
          return vValidate;
        }
        function _initErrorEndorsee() {
          $scope.fourthStep.errorEndorsee = {
            error1: false,
            error2: false
          };
        }
        function _clearSearchEndorsee() {
          $scope.fourthStep.showLabelEndorsee = false;
          $scope.fourthStep.mEndosatario = {
            Codigo: null
          };
          _initErrorEndorsee();
        }
        $scope.fnClearEndorsee = function(option) {
          if (option != 1) $scope.fourthStep.mBuscarEndosatario = "";
          _clearSearchEndorsee();
        };
        $scope.fnSearchEndorsee = function(documentNumber, showLabelEndorsee) {
          _clearSearchEndorsee();
          if (showLabelEndorsee) {
            $scope.fourthStep.showLabelEndorsee = false;
          } else {
            usedCarEmitFactory.searchEndorsee(documentNumber, true).then(
              function(response) {
                if (response.OperationCode == constants.operationCode.success) {
                  $scope.fourthStep.mEndosatario = response.Data;
                  $scope.fourthStep.showLabelEndorsee = true;
                } else {
                  $scope.fourthStep.errorEndorsee.error1 = true;
                }
              },
              function(error) {
              },
              function(defaultError) {
              }
            );
          }
        };

        function validateExpirationDate(formData) {
          if (
            formData.expirationDay && formData.expirationDay.Codigo &&
            formData.expirationMonth && formData.expirationMonth.Codigo &&
            formData.expirationYear && formData.expirationYear.Codigo
          ) {
            return (formData.expirationDay.Descripcion + "/" + formData.expirationMonth.Descripcion + "/" + formData.expirationYear.Descripcion);
          }
        }

        $scope.isCompany = function() {
          return !mainServices.fnShowNaturalRucPerson(
            $scope.thirdStep.dataContractor.mTipoDocumento.Codigo,
            $scope.thirdStep.dataContractor.mNumeroDocumento
          );
        };

        $scope.obtenerDctontegralidad = function() {
          $scope.fourthStep.PorDctoIntgPlaza = 0;
          if ($scope.fourthStep.DctoIntegralidad) {
            proxyGeneral
              .ObtenerDescuentoIntegralidad(
                constants.module.polizas.autos.companyCode,
                $scope.mainStep.claims.codigoAgente,
                constants.module.polizas.autos.codeRamo,
                $scope.thirdStep.dataContractor.mTipoDocumento.Codigo,
                $scope.thirdStep.dataContractor.mNumeroDocumento
              )
              .then(function(response) {
                if (response.OperationCode == constants.operationCode.success) {
                    $scope.fourthStep.PorDctoIntgPlaza = response.Data;
                }
              })
              .catch(function(error) {
                console.log("Error en obtenerDctontegralidad: " + error);
              });
          }
        };
      }
    ]);
  }
);
