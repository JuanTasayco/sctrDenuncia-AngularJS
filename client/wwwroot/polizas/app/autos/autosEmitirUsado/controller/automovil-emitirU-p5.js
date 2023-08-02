(function($root, deps, action) {
  define(deps, action);
})(
  this,
  ["angular"
  , "constants"
  , "/polizas/app/autos/autosEmitirUsado/service/usedCarEmitFactory.js"
  , "emitFactory"],
  function(angular, constants) {
    angular.module("appAutos").controller("usedCarEmitS5", [
      "$scope",
      "usedCarEmitFactory",
      "carEndorsee",
      "carDiscountCommission",
      "$window",
      "carGps",
      "mpSpin",
      "$state",
      "$filter",
      "mModalAlert",
      "oimPrincipal",
      "proxyGeneral",
      'emitFactory',
      'autosFactory',
      'polizasFactory',
      '$timeout',
      '$q',
      function(
        $scope,
        usedCarEmitFactory,
        carEndorsee,
        carDiscountCommission,
        $window,
        carGps,
        mpSpin,
        $state,
        $filter,
        mModalAlert,
        oimPrincipal,
        proxyGeneral,
        emitFactory,
        autosFactory,
        polizasFactory,
        $timeout,
        $q
      ) {
        $scope.CODIGO_GESTOR_COBRO_REGISTRO_CUENTA = 'DB';
        $scope.CODIGO_GESTOR_COBRO_REGISTRO_TARJETA = 'TA';

        (function onLoad() {

          $scope.entidades = emitFactory.getFinancialEntities(true);
          $scope.tipoCuentas = emitFactory.getAccountTypes(true);
          $scope.tipoTarjetas = emitFactory.getCardsType(true);
          $scope.monedas = emitFactory.getCoins(true);

          $scope.mainStep = $scope.mainStep || {};
          $scope.firstStep = $scope.firstStep || {};
          $scope.secondStep = $scope.secondStep || {};
          $scope.thirdStep = $scope.thirdStep || {};
          $scope.fourthStep = $scope.fourthStep || {};
          $scope.summaryStep = $scope.summaryStep || {};

          $scope.fiveStep = $scope.fiveStep || {};
          $scope.fiveStep.registro = polizasFactory.isFinanciamiento12CuotasMensual($scope.fourthStep.mTipoFinanciamiento.Codigo) ? $scope.CODIGO_GESTOR_COBRO_REGISTRO_CUENTA : '';
          if (angular.isUndefined($scope.fiveStep.selectLoadFile)) $scope.fiveStep.selectLoadFile = true;
          $scope.errorAttachFile = !$scope.fiveStep.selectLoadFile;

          if (
            Object.keys($scope.firstStep).length <= 1 ||
            Object.keys($scope.secondStep).length < 1 ||
            Object.keys($scope.thirdStep).length < 1 ||
            Object.keys($scope.fourthStep).length < 1
          ) {
            $state.go(".", {
              step: 1
            });
          }

          varInit();
          initEmitError();
          getEncuesta();

          var params = {
            value1: "automovil".toUpperCase(),
            value2: $scope.secondStep.mProducto.CodigoProducto,
          };
          if (oimPrincipal.get_role() == "BANSEG") {
            params.value3 = oimPrincipal.get_role();
            var pms = usedCarEmitFactory.getFinancingROL(params);
          } else {
            var pms = usedCarEmitFactory.getFinancing(params);
          }
          pms.then(
            function(response) {
              $scope.financingData = response.Data;
            },
            function(error) {
              mModalAlert.showError(error.data.message, "Error");
            }
          );

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
        })();


      function roundTwoDecimals(num) {
        return +($scope.Math.round(num + "e+2") + "e-2");
      }

      function getEncuesta(){
        var codCia = constants.module.polizas.autos.companyCode;
        var codeRamo = constants.module.polizas.autos.codeRamo;

        proxyGeneral.GetEncuesta(codCia, codeRamo, false).then(function(response) {
          if(response.OperationCode == constants.operationCode.success){
            if (Object.keys(response.Data.Pregunta).length > 0){
              $scope.encuesta = response.Data;
            }else{
              $scope.encuesta = {};
              $scope.encuesta.mostrar = 0;
            }
          }
        }, function(error){
          console.log('Error en getEncuesta: ' + error);
        })
      }


      //clearCollectionManager
      function _clearCollectionManager(option, allFields){
        switch (option){
          case $scope.CODIGO_GESTOR_COBRO_REGISTRO_CUENTA:
            if (allFields){
              $scope.fiveStep.entidad = {
                Codigo: null
              };
            }
            $scope.fiveStep.oficina = '';
            $scope.fiveStep.tipoCuenta = {
              Codigo: null
            };
            $scope.fiveStep.moneda = {
              Codigo: null
            };
            $scope.fiveStep.ctaCalcular = '';
            $scope.fiveStep.cuenta = '';
            $scope.fiveStep.codigoGestorEn = {
              Codigo: null
            };
          break;
          case $scope.CODIGO_GESTOR_COBRO_REGISTRO_TARJETA:
            if (allFields){
              $scope.fiveStep.tipoTarjeta = {
                Codigo: null
              };
            }
            $scope.fiveStep.codigoTarjeta = {
              Codigo: null
            };
            $scope.fiveStep.numeroTarjeta = '';
            $scope.fiveStep.fechaTarjeta = '';
            $scope.fiveStep.codigoGestorTa = {
              Codigo: null
            };
          break;
        }
      }

      $scope.isRegistroCuenta = function () {
        return $scope.fiveStep.registro === $scope.CODIGO_GESTOR_COBRO_REGISTRO_CUENTA;
      }

      $scope.isRegistroTarjeta = function () {
        return $scope.fiveStep.registro === $scope.CODIGO_GESTOR_COBRO_REGISTRO_TARJETA;
      }

      $scope.clearCollectionManager = function(option, allFields){
        _clearCollectionManager(option, allFields);
      }

      $scope.onEntidadChange = function(item) {
        _clearCollectionManager($scope.CODIGO_GESTOR_COBRO_REGISTRO_CUENTA, false);
        if (!item) return;

        $scope.fiveStep.codigoGestoresEn = [];
        $scope.fiveStep.oficina = item.CodigoOficiona;
        $scope.fiveStep.minCuenta = item.LongitudMinimo || 0;
        $scope.fiveStep.maxCuenta = item.LongitudMaximo || 0;

        proxyGeneral.GetListGestor($scope.CODIGO_GESTOR_COBRO_REGISTRO_CUENTA, item.Codigo, true).then(function(response) {
          $scope.fiveStep.codigoGestoresEn = response.Data;
        }, function() {
          console.log(arguments);
        });
      };

      $scope.onCtaCalcular = function(item) {
        var vCodeEntity = $scope.fiveStep.entidad && $scope.fiveStep.entidad.Codigo !== null;
        var vAccountType = $scope.fiveStep.tipoCuenta && $scope.fiveStep.tipoCuenta.Codigo !== null;
        var vCodeCurrency = $scope.fiveStep.moneda && $scope.fiveStep.moneda.Codigo !== null;

        if (vCodeEntity && vAccountType && vCodeCurrency){
          $scope.fiveStep.cuentaNoFormat = item || '';
          proxyGeneral.GetEnmascarCuenta($scope.fiveStep.entidad.Codigo, $scope.fiveStep.tipoCuenta.Codigo, $scope.fiveStep.moneda.Codigo, item, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              $scope.fiveStep.cuentaNoFormat = response.Data.NumeroCuenta;
              $scope.fiveStep.cuenta = response.Data.NumeroCuentaEnmascarado;
            }else{
              mModalAlert.showWarning(response.Data.Message, 'ALERT');
            }
          }, function() {
            console.log(arguments);
          });
        }
      };

      $scope.onTipoTarjetaChange = function(item) {
        _clearCollectionManager($scope.CODIGO_GESTOR_COBRO_REGISTRO_TARJETA, false);

        if (!item) return;

        mpSpin.start();

        $scope.fiveStep.codigoTarjetas = [];
        $scope.fiveStep.codigoGestoresTa = [];
        $scope.fiveStep.minTarjeta =item.LongitudMinimo || 0;
        $scope.fiveStep.maxTarjeta =item.LongitudMaximo || 0;

        var vServiceCards = proxyGeneral.GetListCodigoTarjeta("2",item.Codigo, false);
        var vServiceManagers = proxyGeneral.GetListGestor($scope.CODIGO_GESTOR_COBRO_REGISTRO_TARJETA,item.Codigo, false);
        $q.all([vServiceCards, vServiceManagers]).then(function(response) {
          var vCards = response[0];
          var vManagers = response[1];
          if (vCards.OperationCode == constants.operationCode.success){
            $scope.fiveStep.codigoTarjetas = vCards.Data;
          }
          if (vManagers.OperationCode == constants.operationCode.success){
            $scope.fiveStep.codigoGestoresTa = vManagers.Data;
          }
          mpSpin.end();
        }, function(error){
          mpSpin.end();
        }, function(defaultError){
          mpSpin.end();
        });
      };


      $scope.numeroCambiando = false;
      $scope.numeroFormateado = false;
      $scope.onNumeroChange = function() {
        if ($scope.numeroCambiando) {
          return;
        }
        $scope.numeroFormateado = false;
      };

      $scope.onNumeroBlur = function() {
        if (!$scope.numeroFormateado) {
          var vCardType = $scope.fiveStep.tipoTarjeta && $scope.fiveStep.tipoTarjeta.Codigo !== null,
              vCardNumber = $scope.fiveStep.numeroTarjeta || '';

          if (vCardType){
            $scope.fiveStep.numeroTarjetaNoFormat = vCardNumber;
            proxyGeneral.GetEnmascarTarjeta($scope.fiveStep.tipoTarjeta.Codigo, vCardNumber, true).then(function(data){
              if (data.OperationCode == constants.operationCode.success){
                $scope.numeroCambiando = true;
                $scope.fiveStep.numeroTarjetaNoFormat = data.Data.NumeroCuenta;
                $scope.fiveStep.numeroTarjeta = data.Data.NumeroCuentaEnmascarado;
                $scope.numeroCambiando = false;
                $scope.numeroFormateado = true;
              }else{
                mModalAlert.showWarning(data.Data.Message, 'ALERTA');
              }
            }, function() {
              console.log(arguments);
            });
          }
        }
      };

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

        function initEmitError() {
          $scope.emitError = {
            value: false,
            description: ""
          };
        }

        function _getPickUp(typeVehicle) {
          var vResult = "N";
          if (typeVehicle == "6" || typeVehicle == "7") {
            vResult = "S";
          }
          return vResult;
        }

        function buildEmission() {
          var filterDate = $filter("date");
          var formatDate = "dd/MM/yyyy";
          var paramsEmit = {
            NumeroCotizacion: usedCarEmitFactory.getNumCotizacion(),
            PorDctoIntgPlaza: $scope.fourthStep.PorDctoIntgPlaza || 0,
            MarcaPorDctoIntegralidad: $scope.fourthStep.DctoIntegralidad ? "S" : "N",
            NumeroSolicitud: typeof $scope.secondStep.mNroSolic == "undefined" ? "" : $scope.secondStep.mNroSolic,
            PrimaPactada: typeof $scope.secondStep.mPrimaPactada == "undefined" ? "" : $scope.secondStep.mPrimaPactada,
            ScoreContratante: $scope.thirdStep.dataContractor.mScore ? $scope.thirdStep.dataContractor.mScore : -1,
            FlgCheckAsegurado: "SI",
            CodigoCompania: constants.module.polizas.autos.companyCode,
            CodigoTipoEntidad: 1,
            TipoEmision: 7,
            ModalidadEmision: "I",
            MCAEndosatario: $scope.fourthStep.mOpcionEndosatario > 0 ? "S" : "N", //'N',
            MCAInformeInspeccion: "N",
            MCAInspeccionPrevia: "S",
            SNEmite: "S",
            Poliza: {
              CodigoFinanciamiento: $scope.fourthStep.mTipoFinanciamiento.Codigo, //'10001',
              ModalidadPrimeraCuota: "IND",
              CodigoCompania: constants.module.polizas.autos.companyCode, //"1",
              CodigoRamo: constants.module.polizas.autos.codeRamo, //"301",
              MCAModalidad: "N",
              InicioVigencia: filterDate($scope.secondStep.mInicioVigencia, formatDate), //"24/10/2016",
              FinVigencia: filterDate($scope.secondStep.mFinVigencia, formatDate), //"24/10/2017",
              PolizaGrupo:
                typeof $scope.secondStep.groupPolizeData == "undefined"
                  ? ""
                  : $scope.secondStep.groupPolizeData.groupPolize //"" //POLIZADATA
            },
            Contratante: {
              Nombre: $scope.thirdStep.dataContractor.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor.mNomContratante
                : $scope.thirdStep.dataContractor.mRazonSocial, //"JUAN",
              ApellidoPaterno: $scope.thirdStep.dataContractor.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor.mApePatContratante
                : "", //"PEREZ2",
              ApellidoMaterno: $scope.thirdStep.dataContractor.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor.mApeMatContratante
                : "", //"PEREZ",
              FechaNacimiento: $scope.thirdStep.dataContractor.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor.mDay.description +
                  "/" +
                  $scope.thirdStep.dataContractor.mMonth.description +
                  "/" +
                  $scope.thirdStep.dataContractor.mYear.description
                : "", //"28/01/1980",
              TipoDocumento: $scope.thirdStep.dataContractor.mTipoDocumento.Codigo, //"DNI",
              CodigoDocumento: $scope.thirdStep.dataContractor.mNumeroDocumento, //"12345678",
              Sexo: $scope.thirdStep.dataContractor.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor.mSexo == "H"
                  ? 1
                  : 0
                : "", //"H",
              Telefono: $scope.thirdStep.dataContractor.mTelefonoFijo, //"125748",
              Telefono2: $scope.thirdStep.dataContractor.mTelefonoCelular, //"125452",
              CorreoElectronico: $scope.thirdStep.dataContractor.mCorreoElectronico, //"RICARDOSANCHEZC10@GMAIL.COM",
              MCAMapfreDolar: parseFloat($scope.fourthStep.dataCalculatePremium.mapfreDollar) > 0 ? "S" : "N", //"N" --> SI INGRES MAPFRE DOLLAR
              MCAFisico: "S",
              ImporteAplicarMapfreDolar: $scope.fourthStep.dataCalculatePremium.mapfreDollar, //"0", //--- SI ENGRESA MAPFREDOLLARVALOR
                           Profesion: {
                Codigo: $scope.thirdStep.dataContractor.showNaturalRucPerson
                  ? $scope.thirdStep.dataContractor.mProfesion.Codigo
                  : null //"99"
              },
              ActividadEconomica: {
                Codigo: $scope.thirdStep.dataContractor.showNaturalRucPerson
                  ? ""
                  : $scope.thirdStep.dataContractor.mActividadEconomica.Codigo //""
              },
              Ubigeo: {
                CodigoNumero:
                  $scope.thirdStep.dataContractorAddress.mTipoNumero.Codigo !== null
                    ? $scope.thirdStep.dataContractorAddress.mTipoNumero.Codigo
                    : "",
                TextoNumero: $scope.thirdStep.dataContractorAddress.mNumeroDireccion, //"845",
                CodigoInterior:
                  $scope.thirdStep.dataContractorAddress.mTipoInterior.Codigo !== null
                    ? $scope.thirdStep.dataContractorAddress.mTipoInterior.Codigo
                    : "",
                TextoInterior: $scope.thirdStep.dataContractorAddress.mNumeroInterior, //"05",
                CodigoZona:
                  $scope.thirdStep.dataContractorAddress.mTipoZona.Codigo !== null
                    ? $scope.thirdStep.dataContractorAddress.mTipoZona.Codigo
                    : "",
                TextoZona: $scope.thirdStep.dataContractorAddress.mNombreZona, //"DSGS",
                Referencia: $scope.thirdStep.dataContractorAddress.mDirReferencias, //"",
                CodigoDepartamento: $scope.thirdStep.dataContractorAddress.ubigeoData.mDepartamento && $scope.thirdStep.dataContractorAddress.ubigeoData.mDepartamento.Codigo || '', //"15",
                CodigoProvincia: $scope.thirdStep.dataContractorAddress.ubigeoData.mProvincia && $scope.thirdStep.dataContractorAddress.ubigeoData.mProvincia.Codigo || '', //"128",
                CodigoDistrito: $scope.thirdStep.dataContractorAddress.ubigeoData.mDistrito && $scope.thirdStep.dataContractorAddress.ubigeoData.mDistrito.Codigo || '', //"30",
                CodigoVia:
                  $scope.thirdStep.dataContractorAddress.mTipoVia.Codigo !== null
                    ? $scope.thirdStep.dataContractorAddress.mTipoVia.Codigo
                    : ""
              },
              Direccion: $scope.thirdStep.dataContractorAddress.mNombreVia, //Se agrego, es el texto de vía
              EstadoCivil: $scope.secondStep.isEmblem ? { Codigo: $scope.thirdStep.dataContractor.mEstadoCivil.Codigo } : undefined,
              FechaExpedicion: $scope.secondStep.isEmblem ? validateExpirationDate($scope.thirdStep.dataContractor) : undefined
            },
            Endosatario: {
              CodigoEndosatario: "",
              TipoDocumento:
                $scope.fourthStep.mOpcionEndosatario > 0 ? $scope.fourthStep.mEndosatario.TipoDocumento : "", //DEBE IR VALORES
              CodigoDocumento: $scope.fourthStep.mOpcionEndosatario > 0 ? $scope.fourthStep.mEndosatario.Codigo : "",
              SumaEndosatario: $scope.fourthStep.mOpcionEndosatario > 0 ? $scope.fourthStep.mSumaEndosar : 0
            },
            Documento: {
              NumeroAnterior: "",
              NumeroTicket: "",
              CodigoEstado: "1",
              CodigoUsuario: $scope.mainStep.claims.codigoUsuario, //"DBISBAL", // VIENE DEL LOGIN
              CodigoUsuarioRED: constants.module.polizas.autos.networkUser, //"Usuario", // FIJO
              CodigoProducto: $scope.secondStep.mProducto.CodigoProducto, //"5",
              FlagDocumento: "",
              CodigoProceso: "2",
              CodigoAgente: $scope.mainStep.claims.codigoAgente, //'9808', //"818", // VIENE DEL LOGIN
              McaAsegNuevo: "N",
              NombreDocumento: "",
              RutaDocumento: "",
              MontoPrima: $scope.fourthStep.dataCalculatePremium.total, //"9718.34", //TOTAL PASO 4
              CodigoMoneda: constants.currencyType.dollar.code, //"2", //DOLLAR CONSTANTE
              NumeroPlaca: "",
              MarcaAsistencia: "",
              Ubigeo: {
                CodigoDepartamento: "",
                CodigoProvincia: "",
                CodigoDistrito: ""
              }
            },
            Vehiculo: {
              CodigoTipo: $scope.firstStep.dataInspection.Veh_tipo, //"1", // TIPO VEHICULO
              NumeroChasis: $scope.firstStep.dataInspection.NumeroChasis, //"DRER65474",
              NumeroMotor: $scope.firstStep.dataInspection.Veh_nro_motor, //"DF64GF65H4G18",
              ZonaTarifa: "", //"A", //SERVICIO APARTE // SE ENVIA VACIO, LA LOGICA LA REALIZA BACKEND
              CodigoMoneda: constants.currencyType.dollar.code,
              CodigoColor: $scope.firstStep.dataInspection.CodigoColor, //"1",
              NumeroPlaca: $scope.firstStep.dataInspection.NumeroPlaca, //"TNT015",
              MCANUEVO: "N",
              MCAGPS: carGps, //"N", // SERVICIO carGps
              PolizaGrupo:
                typeof $scope.secondStep.groupPolizeData == "undefined"
                  ? ""
                  : $scope.secondStep.groupPolizeData.groupPolize, //"" //POLIZADATA
              ProductoVehiculo: {
                CodigoProducto: $scope.secondStep.mProducto.CodigoProducto, //"5" // PASO 2
                CodigoMoneda: constants.currencyType.dollar.code
              },
              CodTipoFrecUso: "",
              CodAnioLicencia: $scope.thirdStep.vehicleDetailsContractor.mAntiguedadLicencia.Codigo,
              CodGuardaGaraje: $scope.thirdStep.vehicleDetailsContractor.mGaraje,
              CodConductorUnico: $scope.thirdStep.vehicleDetailsContractor.mUnicoConductor,
              CodEventoUltimosAnios: $scope.thirdStep.vehicleDetailsContractor.mAccidentesVehicle.Codigo,
              CodTipoUsoVehiculo: $scope.thirdStep.vehicleDetailsContractor.mUseVehicle.Codigo,
              DesTipoFrecUso: "",
              DesAnioLicencia: $scope.thirdStep.vehicleDetailsContractor.mAntiguedadLicencia.Nombre,
              DesEventoUltimosAnios: $scope.thirdStep.vehicleDetailsContractor.mAccidentesVehicle.Nombre,
              DesTipoUsoVehiculo: $scope.thirdStep.vehicleDetailsContractor.mUseVehicle.Nombre,
              Version: $scope.firstStep.dataInspection.Veh_version ? $scope.firstStep.dataInspection.Veh_version : "",
              TipoTransmision: $scope.secondStep.isEmblem ? { Codigo: $scope.thirdStep.vehicleDetailsContractor.VehicleTransmission.Codigo } : undefined,
              ScoreMorosidad: $scope.secondStep.isEmblem ? $scope.thirdStep.dataContractor.scoreMorosidad : undefined
            },
            Inspector: {
              Nombre: $scope.firstStep.dataInspection.NombreInspector, //"CARLOS ENRIQUE", //NombreInspector PASO 1 - INSPECCION
              ApellidoPaterno: $scope.firstStep.dataInspection.ApellidosInspector, //"", //ApellidosInspector PASO 1 - INSPECCION
              Telefono: "0",
              Telefono2: "0",
              Observacion: ""
            },
            Inspeccion: {
              NumeroInspeccionTRON: $scope.firstStep.dataInspection.NumeroInspeccionTRON, //"2001719", //NumeroInspeccionTRON PASO 1 - INSPECCION
              FlagAccMusical: "N", // AGREAGR A SERVICIO INSPECION - POR CONFIRMAR
              CadenaAccesoriosCodigo: "", // AGREAGR A SRVICIO INSPECION - POR CONFIRMAR
              CadenaAccesoriosValor: "" // AGREAGR A SRVICIO INSPECION - POR CONFIRMAR
            },
            Cotizacion: {
              CodigoCompania: constants.module.polizas.autos.companyCode, //"1", // -
              CodigoTipoEntidad: "1", //-
              CodigoCorredor: $scope.mainStep.claims.codigoAgente, //'9808', //"818", // VIENE DEL LOGIN
              numeroInspeccion: $scope.firstStep.dataInspection.NumeroInspeccion, //"2001719", //NUMERO DE INSPECION  QUE INGRESE PASO 1
              mcaInspeccionPrevia: "S",
              DocumentosAsociados: [
                {
                  CodigoEstado: "1", // FIJO
                  CodigoUsuarioRED: constants.module.polizas.autos.networkUser, //"Usuario", // FIJO siempre es Usuario
                  CodigoUsuario: $scope.mainStep.claims.codigoUsuario, //"DBISBAL", // VIENE LOGIN
                  CodigoProceso: "1", // FIJO
                  CodigoProducto: $scope.secondStep.mProducto.CodigoProducto, //"5", // FIJO
                  CodigoAgente: $scope.mainStep.claims.codigoAgente, //'9808', //"818", // VIENE DEL LOGIN
                  MarcaAsistencia: "N", //FIJO
                  FlgAplicaDsctoComision: $scope.fourthStep.mDescuentoComision.AgenteComision == null ? "N" : "S", //"S", //POR CONFIRMAR //LOGICA COTIZACION-FlagDctoComision
                  DsctoComercial: getDescuentoComercial(), //FIJO
                  DsctoPorComision:
                    $scope.fourthStep.mDescuentoComision.AgenteComision == null
                      ? 0
                      : $scope.fourthStep.mDescuentoComision.DsctoEspecial, //"0", //FIJO //LOGICA COTIZACION-ComisionAgt
                  TotalDscto:
                    $scope.fourthStep.mDescuentoComision.AgenteComision == null
                      ? 0
                      : $scope.fourthStep.mDescuentoComision.DsctoEspecial, //"0", //FIJO //LOGICA COTIZACION-TotalDsctoComision
                  TuComision:
                    $scope.fourthStep.mDescuentoComision.AgenteComision == null
                      ? 0
                      : $scope.fourthStep.mDescuentoComision.AgenteComision, //"0", //LOGICA COTIZACION-DsctoComision
                  MontoPrima: $scope.fourthStep.dataCalculatePremium.total, //"9718.34", // TOTAL PASO4
                  PrimaNeta: $scope.fourthStep.dataCalculatePremium.netPremiumReal,
                  Ubigeo: {
                    CodigoDepartamento: $scope.thirdStep.dataContractorAddress.ubigeoData.mDepartamento && $scope.thirdStep.dataContractorAddress.ubigeoData.mDepartamento.Codigo || '', //"", //FIJO por ver
                    CodigoProvincia: $scope.thirdStep.dataContractorAddress.ubigeoData.mProvincia && $scope.thirdStep.dataContractorAddress.ubigeoData.mProvincia.Codigo || '', //"", //FIJO por ver
                    CodigoDistrito: $scope.thirdStep.dataContractorAddress.ubigeoData.mDistrito && $scope.thirdStep.dataContractorAddress.ubigeoData.mDistrito.Codigo || '' //"" //FIJO por ver
                  }
                }
              ],
              Vehiculo: {
                AnioFabricacion: $scope.firstStep.dataInspection.Veh_ano, //"2016",
                CodigoCategoria: "2",
                CodigoMarca: $scope.firstStep.dataInspection.Veh_marca, //"15",
                CodigoModelo: $scope.firstStep.dataInspection.Veh_modelo, //"23",
                CodigoSubModelo: $scope.firstStep.dataInspection.Veh_sub_modelo, //"1",
                CodigoTipo: $scope.firstStep.dataInspection.Veh_tipo, //"1",
                CodigoUso: $scope.secondStep.mTipoUso.Codigo, //"8",
                DsctoComercial: getDescuentoComercial(), //FIJO
                NombreMarca: $scope.firstStep.dataInspection.NomMarca, //"HYUNDAI",
                NombreModelo: $scope.firstStep.dataInspection.NomModelo, //"ELANTRA",
                MCAGPS: carGps, //"N",
                MCANUEVO: "S",
                MCAPICKUP: _getPickUp($scope.firstStep.dataInspection.Veh_tipo), //'S', //FIJO // Ahora no es fijo, existe una logica
                NombreTipo: $scope.firstStep.dataInspection.VehiculoTipo, //"AUTOMOVIL", // PENDIENTE SERVICIO en firstStep-Inspection
                MCAREQUIEREGPS: carGps, //"S", // SERVICIO carGps
                PolizaGrupo:
                  typeof $scope.secondStep.groupPolizeData == "undefined"
                    ? ""
                    : $scope.secondStep.groupPolizeData.groupPolize, //"" //POLIZADATA
                SumaAsegurada: $scope.fourthStep.mSumaEndosar, //"19990", //SUMASAGEUAD FINAL
                TipoVolante: $scope.firstStep.dataInspection.Veh_timon, //"I",  // PASO1
                ZonaTarifa: "", //"A", // SE ENVIA VACIO, LA LOGICA LA REALIZA BACKEND
                ProductoVehiculo: {
                  CodigoProducto: $scope.secondStep.mProducto.CodigoProducto //"5" //FIJO
                }
              },
              Contratante: {
                Nombre: $scope.thirdStep.dataContractor.showNaturalRucPerson
                  ? $scope.thirdStep.dataContractor.mNomContratante
                  : $scope.thirdStep.dataContractor.mRazonSocial, //"JUAN",
                ApellidoPaterno: $scope.thirdStep.dataContractor.showNaturalRucPerson
                  ? $scope.thirdStep.dataContractor.mApePatContratante
                  : "", //"PEREZ",
                MCAMapfreDolar: "N",
                ImporteMapfreDolar: roundTwoDecimals($scope.thirdStep.dataContractor.saldoMapfreDolares), //saldoMapfreDolares desde componente //"-2.93"
                Ubigeo: {
                  CodigoDepartamento: $scope.thirdStep.dataContractorAddress.ubigeoData.mDepartamento && $scope.thirdStep.dataContractorAddress.ubigeoData.mDepartamento.Codigo || '',
                  CodigoProvincia: $scope.thirdStep.dataContractorAddress.ubigeoData.mProvincia && $scope.thirdStep.dataContractorAddress.ubigeoData.mProvincia.Codigo || '',
                  CodigoDistrito: $scope.thirdStep.dataContractorAddress.ubigeoData.mDistrito && $scope.thirdStep.dataContractorAddress.ubigeoData.mDistrito.Codigo || ''
                }
              }
            },
            GestorCobro: {
              CodigoEntidad: 0,
              CuentaCorriente: '',
              CodigoTipoCuenta: 0,
              CodigoMoneda: 0,
              CodigoOficina: '',
              CuentaCalcular: '',
              TipoTarjeta: 0,
              CodigoTarjeta: 0,
              NumeroTarjeta: '',
              FechaVencimientoTarjeta: '',
              TipoGestor: '',
              CodigoGestor: 0,
              NombreArchivoCargomatico: ''
            },
            ListaAccionista: $scope.thirdStep.accionistas
            .map(function(it) {return {
                    TipDocumento:                      it.documentType.Codigo,
                    NroDocumento:                      it.documentNumber || '',
                    ApellidoMaterno:                   it.ApellidoMaterno || '',
                    ApellidoPaterno:                   it.ApellidoPaterno || '',
                    Nombres:                           it.Nombre || '',
                    RazonSocial:                       it.RazonSocial || '',
                    Relacion:                          it.Relacion.Codigo,
					PorParticipacion:                  it.PorParticipacion,
              };
            })

          };

          if (!$scope.thirdStep.aseguradoFlag) {
            paramsEmit.AseguradoAutos_2 = {
              Nombre: $scope.thirdStep.dataContractor2.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor2.mNomContratante
                : $scope.thirdStep.dataContractor2.mRazonSocial, //"JUAN",
              ApellidoPaterno: $scope.thirdStep.dataContractor2.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor2.mApePatContratante
                : "", //"PEREZ2",
              ApellidoMaterno: $scope.thirdStep.dataContractor2.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor2.mApeMatContratante
                : "", //"PEREZ",
              FechaNacimiento: $scope.thirdStep.dataContractor2.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor2.mDay.description +
                  "/" +
                  $scope.thirdStep.dataContractor2.mMonth.description +
                  "/" +
                  $scope.thirdStep.dataContractor2.mYear.description
                : "", //"28/01/1980",
              TipoDocumento: $scope.thirdStep.dataContractor2.mTipoDocumento.Codigo, //"DNI",
              CodigoDocumento: $scope.thirdStep.dataContractor2.mNumeroDocumento, //"12345678",
              Sexo: $scope.thirdStep.dataContractor2.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor.mSexo == "H"
                  ? 1
                  : 0
                : "", //"H",
              Telefono: $scope.thirdStep.dataContractor2.mTelefonoFijo, //"125748",
              Telefono2: $scope.thirdStep.dataContractor2.mTelefonoCelular, //"125452",
              CorreoElectronico: $scope.thirdStep.dataContractor2.mCorreoElectronico, //"RICARDOSANCHEZC10@GMAIL.COM",
              MCAMapfreDolar: $scope.fourthStep.dataCalculatePremium.mapfreDollar > 0 ? "S" : "N", //"N" --> SI INGRES MAPFRE DOLLAR
              MCAFisico: "S",
              ImporteAplicarMapfreDolar: $scope.fourthStep.dataCalculatePremium.mapfreDollar, //"0", //--- SI ENGRESA MAPFREDOLLARVALOR
              Profesion: {
                Codigo: $scope.thirdStep.dataContractor2.showNaturalRucPerson
                  ? $scope.thirdStep.dataContractor2.mProfesion.Codigo
                  : null //"99"
              },
              ActividadEconomica: {
                Codigo: $scope.thirdStep.dataContractor2.showNaturalRucPerson
                  ? ""
                  : $scope.thirdStep.dataContractor2.mActividadEconomica.Codigo //""
              },
              Ubigeo: {
                CodigoNumero:
                  $scope.thirdStep.dataContractorAddress2.mTipoNumero.Codigo !== null
                    ? $scope.thirdStep.dataContractorAddress2.mTipoNumero.Codigo
                    : "",
                TextoNumero: $scope.thirdStep.dataContractorAddress2.mNumeroDireccion, //"845",
                CodigoInterior:
                  $scope.thirdStep.dataContractorAddress2.mTipoInterior.Codigo !== null
                    ? $scope.thirdStep.dataContractorAddress2.mTipoInterior.Codigo
                    : "",
                TextoInterior: $scope.thirdStep.dataContractorAddress2.mNumeroInterior, //"05",
                CodigoZona:
                  $scope.thirdStep.dataContractorAddress2.mTipoZona.Codigo !== null
                    ? $scope.thirdStep.dataContractorAddress2.mTipoZona.Codigo
                    : "",
                TextoZona: $scope.thirdStep.dataContractorAddress2.mNombreZona, //"DSGS",
                Referencia: $scope.thirdStep.dataContractorAddress2.mDirReferencias, //"",
                CodigoDepartamento: $scope.thirdStep.dataContractorAddress2.ubigeoData.mDepartamento.Codigo, //"15",
                CodigoProvincia: $scope.thirdStep.dataContractorAddress2.ubigeoData.mProvincia.Codigo, //"128",
                CodigoDistrito: $scope.thirdStep.dataContractorAddress2.ubigeoData.mDistrito.Codigo, //"30",
                CodigoVia:
                  $scope.thirdStep.dataContractorAddress2.mTipoVia.Codigo !== null
                    ? $scope.thirdStep.dataContractorAddress2.mTipoVia.Codigo
                    : ""
              },
              Direccion: $scope.thirdStep.dataContractorAddress2.mNombreVia //Se agrego, es el texto de vía
            };
          } else {
            paramsEmit.AseguradoAutos_2 = {
              Nombre: $scope.thirdStep.dataContractor.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor.mNomContratante
                : $scope.thirdStep.dataContractor.mRazonSocial, //"JUAN",
              ApellidoPaterno: $scope.thirdStep.dataContractor.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor.mApePatContratante
                : "", //"PEREZ2",
              ApellidoMaterno: $scope.thirdStep.dataContractor.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor.mApeMatContratante
                : "", //"PEREZ",
              FechaNacimiento: $scope.thirdStep.dataContractor.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor.mDay.description +
                  "/" +
                  $scope.thirdStep.dataContractor.mMonth.description +
                  "/" +
                  $scope.thirdStep.dataContractor.mYear.description
                : "", //"28/01/1980",
              TipoDocumento: $scope.thirdStep.dataContractor.mTipoDocumento.Codigo, //"DNI",
              CodigoDocumento: $scope.thirdStep.dataContractor.mNumeroDocumento, //"12345678",
              Sexo: $scope.thirdStep.dataContractor.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor.mSexo == "H"
                  ? 1
                  : 0
                : "", //"H",
              Telefono: $scope.thirdStep.dataContractor.mTelefonoFijo, //"125748",
              Telefono2: $scope.thirdStep.dataContractor.mTelefonoCelular, //"125452",
              CorreoElectronico: $scope.thirdStep.dataContractor.mCorreoElectronico, //"RICARDOSANCHEZC10@GMAIL.COM",
              MCAMapfreDolar: $scope.fourthStep.dataCalculatePremium.mapfreDollar > 0 ? "S" : "N", //"N" --> SI INGRES MAPFRE DOLLAR
              MCAFisico: "S",
              ImporteAplicarMapfreDolar: $scope.fourthStep.dataCalculatePremium.mapfreDollar, //"0", //--- SI ENGRESA MAPFREDOLLARVALOR
              Profesion: {
                Codigo: $scope.thirdStep.dataContractor.showNaturalRucPerson
                  ? $scope.thirdStep.dataContractor.mProfesion.Codigo
                  : null //"99"
              },
              ActividadEconomica: {
                Codigo: $scope.thirdStep.dataContractor.showNaturalRucPerson
                  ? ""
                  : $scope.thirdStep.dataContractor.mActividadEconomica.Codigo //""
              },
              Ubigeo: {
                CodigoNumero:
                  $scope.thirdStep.dataContractorAddress.mTipoNumero.Codigo !== null
                    ? $scope.thirdStep.dataContractorAddress.mTipoNumero.Codigo
                    : "",
                TextoNumero: $scope.thirdStep.dataContractorAddress.mNumeroDireccion, //"845",
                CodigoInterior:
                  $scope.thirdStep.dataContractorAddress.mTipoInterior.Codigo !== null
                    ? $scope.thirdStep.dataContractorAddress.mTipoInterior.Codigo
                    : "",
                TextoInterior: $scope.thirdStep.dataContractorAddress.mNumeroInterior, //"05",
                CodigoZona:
                  $scope.thirdStep.dataContractorAddress.mTipoZona.Codigo !== null
                    ? $scope.thirdStep.dataContractorAddress.mTipoZona.Codigo
                    : "",
                TextoZona: $scope.thirdStep.dataContractorAddress.mNombreZona, //"DSGS",
                Referencia: $scope.thirdStep.dataContractorAddress.mDirReferencias, //"",
                CodigoDepartamento: $scope.thirdStep.dataContractorAddress.ubigeoData.mDepartamento && $scope.thirdStep.dataContractorAddress.ubigeoData.mDepartamento.Codigo || '',
                CodigoProvincia: $scope.thirdStep.dataContractorAddress.ubigeoData.mProvincia && $scope.thirdStep.dataContractorAddress.ubigeoData.mProvincia.Codigo || '',
                CodigoDistrito: $scope.thirdStep.dataContractorAddress.ubigeoData.mDistrito && $scope.thirdStep.dataContractorAddress.ubigeoData.mDistrito.Codigo || '',
                CodigoVia:
                  $scope.thirdStep.dataContractorAddress.mTipoVia.Codigo !== null
                    ? $scope.thirdStep.dataContractorAddress.mTipoVia.Codigo
                    : ""
              },
              Direccion: $scope.thirdStep.dataContractorAddress.mNombreVia //Se agrego, es el texto de vía
            };
          }

          // Cargo Recurrente
          paramsEmit.GestorCobro = angular.extend(paramsEmit.GestorCobro, _getGestorCobro());

          return paramsEmit;
        }

        function _getGestorCobro() {
          var formData = ($scope.fiveStep || {});
          var gestorCobro = {
            CuentaCalcular: formData.ctaCalcular ? formData.ctaCalcular : '',
            TipoGestor: formData.registro ? formData.registro : ''
          };

          if ($scope.isRegistroCuenta()) {
            var regitroCuenta = {
              CodigoEntidad: formData.entidad ? formData.entidad.Codigo : 0,
              CuentaCorriente: formData.cuentaNoFormat || '',
              CodigoTipoCuenta: formData.tipoCuenta ? formData.tipoCuenta.Codigo : 0,
              CodigoMoneda: formData.moneda ? formData.moneda.Codigo : 0,
              CodigoOficina: formData.oficina || '',
              CuentaCalcular: formData.ctaCalcular ? formData.ctaCalcular : '',
              CodigoGestor: formData.codigoGestorEn ? formData.codigoGestorEn.Codigo : ''
            }

            gestorCobro = angular.extend(gestorCobro, regitroCuenta);
          }

          if ($scope.isRegistroTarjeta()) {
            var registroTarjeta = {
              TipoTarjeta: formData.tipoTarjeta ? formData.tipoTarjeta.Codigo : 0,
              CodigoTarjeta: formData.codigoTarjeta ? formData.codigoTarjeta.Codigo : 0,
              NumeroTarjeta: formData.numeroTarjetaNoFormat || '',
              FechaVencimientoTarjeta: formData.fechaTarjeta || '',
              CodigoGestor: formData.codigoGestorTa ? formData.codigoGestorTa.Codigo : ''
            }

            gestorCobro = angular.extend(gestorCobro, registroTarjeta);
          }

          return gestorCobro;
        }

        function validateExpirationDate(formData) {
          if (
            formData.expirationDay && formData.expirationDay.Codigo &&
            formData.expirationMonth && formData.expirationMonth.Codigo &&
            formData.expirationYear && formData.expirationYear.Codigo
          ) {
            return (formData.expirationDay.Descripcion + "/" + formData.expirationMonth.Descripcion + "/" + formData.expirationYear.Descripcion);
          }
        }

        function buildSummary() {
          var filterDate = $filter("date");
          var formatDate = "dd/MM/yyyy";

          var dataSummary = {
            polizaAutos: {
              autoAsegurado:
                $scope.firstStep.dataInspection.NomMarca +
                " " +
                $scope.firstStep.dataInspection.NomModelo +
                " " +
                $scope.firstStep.dataInspection.NomSubModelo,
              primaNeta: $scope.fourthStep.dataCalculatePremium.netPremium,
              circulacion:
                $scope.firstStep.dataContractor.Ubigeo.NombreDepartamento +
                ", " +
                $scope.firstStep.dataContractor.Ubigeo.NombreProvincia +
                ", " +
                $scope.firstStep.dataContractor.Ubigeo.NombreDistrito,
              valorAuto: $scope.secondStep.dataCarValue.Valor,
              producto: $scope.secondStep.mProducto.NombreProducto,

              tipoUso: $scope.secondStep.mTipoUso.Descripcion
            },
            datosPoliza: {
              fechaInicio: filterDate($scope.secondStep.mInicioVigencia, formatDate),
              fechaTermino: filterDate($scope.secondStep.mFinVigencia, formatDate),
              polizaGrupo:
                typeof $scope.secondStep.groupPolizeData == "undefined"
                  ? ""
                  : $scope.secondStep.groupPolizeData.groupPolizeDescription,
              numeroPlaca: $scope.firstStep.dataInspection.NumeroPlaca,
              numeroChasis: $scope.firstStep.dataInspection.NumeroChasis,
              numeroMotor: $scope.firstStep.dataInspection.Veh_nro_motor,
              colorVehiculo:
                $scope.secondStep.dataColor && $scope.secondStep.dataColor.Descripcion
                  ? $scope.secondStep.dataColor.Descripcion
                  : ""
            },
            datosContratante: {
              tipoDocumento: $scope.thirdStep.dataContractor.mTipoDocumento.Codigo,
              numeroDocumento: $scope.thirdStep.dataContractor.mNumeroDocumento,
              nombre: $scope.thirdStep.dataContractor.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor.mNomContratante
                : $scope.thirdStep.dataContractor.mRazonSocial,
              apellidoPaterno: $scope.thirdStep.dataContractor.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor.mApePatContratante
                : "",
              apellidoMaterno: $scope.thirdStep.dataContractor.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor.mApeMatContratante
                : "",
              fechaNacimiento: $scope.thirdStep.dataContractor.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor.mDay.description +
                  "/" +
                  $scope.thirdStep.dataContractor.mMonth.description +
                  "/" +
                  $scope.thirdStep.dataContractor.mYear.description
                : "",
              genero: $scope.thirdStep.dataContractor.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor.mSexo == "H"
                  ? "Masculino"
                  : "Femenino"
                : "",
              profesion: $scope.thirdStep.dataContractor.showNaturalRucPerson
                ? $scope.thirdStep.dataContractor.mProfesion.Descripcion
                : "",
              telefonoFijo: $scope.thirdStep.dataContractor.mTelefonoFijo,
              telefonoMovil: $scope.thirdStep.dataContractor.mTelefonoCelular,
              correoElectronico: $scope.thirdStep.dataContractor.mCorreoElectronico,
              departamento: $scope.thirdStep.dataContractorAddress.ubigeoData.mDepartamento && $scope.thirdStep.dataContractorAddress.ubigeoData.mDepartamento.Descripcion || '',
              provincia: $scope.thirdStep.dataContractorAddress.ubigeoData.mProvincia && $scope.thirdStep.dataContractorAddress.ubigeoData.mProvincia.Descripcion || '',
              distrito: $scope.thirdStep.dataContractorAddress.ubigeoData.mDistrito && $scope.thirdStep.dataContractorAddress.ubigeoData.mDistrito.Descripcion || '',
              via:
                $scope.thirdStep.dataContractorAddress.mTipoVia.Codigo !== null
                  ? $scope.thirdStep.dataContractorAddress.mTipoVia.Descripcion +
                    " " +
                    $scope.thirdStep.dataContractorAddress.mNombreVia
                  : "",
              enumeracion:
                $scope.thirdStep.dataContractorAddress.mTipoNumero.Codigo !== null
                  ? $scope.thirdStep.dataContractorAddress.mTipoNumero.Descripcion +
                    " " +
                    $scope.thirdStep.dataContractorAddress.mNumeroDireccion
                  : "",
              interior:
                $scope.thirdStep.dataContractorAddress.mTipoInterior.Codigo !== null
                  ? $scope.thirdStep.dataContractorAddress.mTipoInterior.Descripcion +
                    " " +
                    $scope.thirdStep.dataContractorAddress.mNumeroInterior
                  : "",
              zona:
                $scope.thirdStep.dataContractorAddress.mTipoZona.Codigo !== null
                  ? $scope.thirdStep.dataContractorAddress.mTipoZona.Descripcion +
                    " " +
                    $scope.thirdStep.dataContractorAddress.mNombreZona
                  : "",
              referencia: $scope.thirdStep.dataContractorAddress.mDirReferencias,
              tipoFinanciamiento: $scope.fourthStep.mTipoFinanciamiento.Descripcion,
              mapfreDolares: $scope.thirdStep.dataContractor.saldoMapfreDolares, //saldoMapfreDolares desde componente
              endosatario: $scope.fourthStep.mOpcionEndosatario > 0 ? $scope.fourthStep.mEndosatario.Descripcion : "",
              sumaEndosar: $scope.fourthStep.mOpcionEndosatario > 0 ? $scope.fourthStep.mSumaEndosar : ""
            },
            dscto: {
              dsctoComercial: Math.abs(getDescuentoComercial()),
              discountComercial: $scope.fourthStep.dataCalculatePremium.discountComercial
            }
          };
          return dataSummary;
        }

        $scope.validationForm = function() {
          $scope.frmEmitU5.markAsPristine();
          return $scope.frmEmitU5.$valid;
        };

        $scope.$on("changingStep", function(ib, e) {
          if (e.step <= 5) {
            e.cancel = false;
          } else {
            e.cancel = true;
          }
        });

        /*#######################
        # Archivo cargomático
        #######################*/
        $scope.isRequiredFile = function() {
          var gestor = _getGestorCobro();
          return $scope.mainStep.IS_REQUIRED_RC || !!(gestor && gestor.CodigoGestor &&  gestor.TipoGestor);
        }

        $scope.fnChangeLoadFile = function(){

          $timeout(function(){
            var vFile = $scope.fiveStep.fmLoadFile || {};
            if (!angular.isUndefined(vFile[0]) && getFileSizeMB(vFile[0].size) > 4) {
              mModalAlert.showError(
                "El tamaño del archivo que estás tratando de guardar supera el máximo permitido por el servidor (4 Mb). El archivo no ha sido guardado, por favor validar lo siguiente: <br/><br/>" +
                "- Intenta reducir el tamaño del archivo, verificando la resolución de la imagen.<br/>" +
                "- Asegúrate que estés adjuntando solo la imagen al que corresponde el título del documento.", 'Error');
              $scope.fiveStep.nameLoadFile = '';
              $scope.fiveStep.selectLoadFile = true;
            } else {
              $scope.fiveStep.nameLoadFile = vFile[0].name;
              $scope.fiveStep.selectLoadFile = false;
            }
          }, 0);
        };

        function _paramsCargaAltaDocumental(){
          var vFile = $scope.fiveStep.fmLoadFile || {};
          var vParams = {
            NumeroCotizacion: $scope.firstStep.dataInspection.NumeroInspeccion.toString()+'_USED',
            fieldNameHere: vFile[0]
          };
          return vParams;
        }

        var getFileSizeMB = function (size) {
          return size / 1024 / 1024;
        }

        $scope.sendEmission = function () {
          if ($scope.isRequiredFile($scope.fourthStep.mTipoFinanciamiento.Codigo)) {
            if (!$scope.validationForm()) {
              return;
            }
          }
          var em = buildEmission();

          if ($scope.mainStep.claims.codigoAgente != "0") {
            $scope.fiveStep.dataSummary = buildSummary();

            em = polizasFactory.setReferidoNumber(em);
            var vParamsCargaAltaDocumental = _paramsCargaAltaDocumental();

            if (vParamsCargaAltaDocumental.fieldNameHere) {

              autosFactory.cargaAltaDocumental(vParamsCargaAltaDocumental)
                .then(function (rsCargaAltaDocumental) {
                  if (rsCargaAltaDocumental.OperationCode == constants.operationCode.success) {
                    em.GestorCobro.NombreArchivoCargomatico = rsCargaAltaDocumental.Data.ValueResult;
                    emitFactory.sendEmisionInspeccion(em).then(sendEmision_Response);
                  } else {
                    mModalAlert.showError(rsCargaAltaDocumental.Message, 'Error Archivo cargomático');
                  }
                });
            } else {
              emitFactory.sendEmisionInspeccion(em).then(sendEmision_Response);
            }
          }
        };

        function sendEmision_Response(response) {
          if (response.Data && response.Data.ControlTecnico && response.Data.ControlTecnico.EsInformativo === true && response.Data.ControlTecnico.Codigo === "384" ) {
            $scope.fiveStep.dataPDF = response.Data;
            var auxMensaje = response.Data.ControlTecnico.Descripcion
            mModalAlert.showInfo(auxMensaje , "¡Poliza Emitida!").then(function() {
              $state.go('.', { step: 6 });
            });
          }
          else if (response.OperationCode == constants.operationCode.success &&
              response.Data.NumeroDocumento &&
              response.Data.NumeroDocumento != "" &&
              response.Data.NumeroDocumento != 0){
              $scope.fiveStep.dataPDF = response.Data;
              var auxMensaje = !response.Data.DescripcionAdicional ? '' : response.Data.DescripcionAdicional
              mModalAlert.showInfo(auxMensaje , "¡Exito!").then(function() {
                $state.go('.', { step: 6 });
              });
          }else{
            mModalAlert.showError(response.Message, 'ERROR EMISIÓN');
          }
          
        }

        function getDescuentoComercial() {
          return ($scope.fourthStep.nDescuentoComercial && $scope.fourthStep.nDescuentoComercial.DsctoComercial) || 0;
        }
      }
    ]);
  }
);
