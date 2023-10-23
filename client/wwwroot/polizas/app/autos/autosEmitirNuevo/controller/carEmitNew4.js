(function($root, deps, action) {
  define(deps, action);
})(this, ["angular", "constants", "helper", "lodash", "polizasFactory"], function(angular, constants, helper, _) {
  angular.module("appAutos").controller("carEmitNew4", [
    "$scope",
    "$state",
    '$q',
    '$timeout',
    "emitFactory",
    "mpSpin",
    "mModalAlert",
    "$filter",
    "proxyInspeccion",
    "polizasFactory",
    "proxyGeneral",
    "mainServices",
    'autosFactory',
    'encrypterFactory',
    function(
      $scope,
      $state,
      $q,
      $timeout,
      emitFactory,
      mpSpin,
      mModalAlert,
      $filter,
      proxyInspeccion,
      polizasFactory,
      proxyGeneral,
      mainServices,
      autosFactory,
      encrypterFactory) {
      // auto emit: paso 4
      $scope.CODIGO_GESTOR_COBRO_REGISTRO_CUENTA = 'DB';
      $scope.CODIGO_GESTOR_COBRO_REGISTRO_TARJETA = 'TA';

      (function onLoad() {
        
        encrypterFactory.loadDefaultKey();

        $scope.formData.registro = polizasFactory.isFinanciamiento12CuotasMensual($scope.formData.tipoFinanciamiento && $scope.formData.tipoFinanciamiento.codigo) ? $scope.CODIGO_GESTOR_COBRO_REGISTRO_CUENTA : '';

        if (typeof $scope.formData.selectLoadFile == 'undefined') $scope.formData.selectLoadFile = true;
        $scope.errorAttachFile = !$scope.formData.selectLoadFile;

        $scope.formData = $scope.formData || {}
        if (angular.isUndefined($scope.formData.selectLoadFile)) $scope.formData.selectLoadFile = true;
        $scope.errorAttachFile = !$scope.formData.selectLoadFile;

        function allowLoadStep() {
          if (!$scope.formData.step3$Valid || !$scope.formData.step2$Valid || !$scope.formData.step1$Valid) {
            $state.go("newEmit.steps", { step: 1 });
          } else {
            getDerechoEmision();
          }
        }
        allowLoadStep();
        getEncuesta();

        $scope.entidades = emitFactory.getFinancialEntities(true);
        $scope.tipoCuentas = emitFactory.getAccountTypes(true);
        $scope.tipoTarjetas = emitFactory.getCardsType(true);
        $scope.monedas = emitFactory.getCoins(true);

        $scope.sumEndorseToggle = true;

        $scope.formData.mSumaEndosar =
          $scope.formData.mSumaEndosar || ($scope.quotation.vehiculo ? $scope.quotation.vehiculo.valorComercial : 0);

        $scope.formData.tempSumEndosar = $scope.formData.tempSumEndosar || $scope.formData.mSumaEndosar;

        $scope.currentContract = $scope.currentContract || {};

        $scope.sumEndorseError = false;
        $scope.formData.inputMapreDolares = 0;

        if (!$scope.formData.mOpcionEndosatario) $scope.formData.mOpcionEndosatario = 0;
        console.log('SOCIOS BS ACCIONISTAS: ',$scope.formData);
      })();

      function getDerechoEmision() {
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
            }
          );
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

      $scope.isRegistroCuenta = function () {
        return ($scope.formData && $scope.formData.registro) === $scope.CODIGO_GESTOR_COBRO_REGISTRO_CUENTA;
      }

      $scope.isRegistroTarjeta = function () {
        return ($scope.formData && $scope.formData.registro) === $scope.CODIGO_GESTOR_COBRO_REGISTRO_TARJETA;
      }

      $scope.GetDerechoEmision = function(withDiscount) {
        if ($scope.derechoEmision) {
          var prima = $scope.quotation.primaNeta;
          if (withDiscount) prima = $scope.primaNetaCalcMapfreDolar();
          var derEmi = ($scope.derechoEmision.porcentajeDerechoEmision / 100) * prima;
          derEmi = derEmi >= $scope.derechoEmision.impMinInsp ? derEmi : $scope.derechoEmision.impMinInsp;
          return derEmi;
        }
        return 0;
      };

      $scope.primaCalc = function() {
        return $scope.GetDerechoEmision() + $scope.quotation.primaNeta;
      };
      $scope.primaNetaCalcMapfreDolar = function() {
        return $scope.quotation.primaNeta - ($scope.formData.discountMDolar || 0);
      };
      $scope.primaComercialCalcMapfreDolar = function() {
        return $scope.GetDerechoEmision(true) + $scope.primaNetaCalcMapfreDolar();
      };

      $scope.currencyType = "$";

      $scope.isValidFormStep4 = function() {
        $scope.frmEmitN4.markAsPristine();
        if ($scope.isRegistroCuenta()) {
          var v =
          $scope.frmEmitN4.$valid &&
          $scope.formData.entidad.Codigo != null &&
          $scope.formData.tipoCuenta.Codigo != null &&
          $scope.formData.moneda != null &&
          $scope.formData.ctaCalcular != '' &&
          $scope.formData.codigoGestorEn.Codigo != null;
        } else {
          var v =
          $scope.frmEmitN4.$valid &&
          $scope.formData.tipoTarjeta.Codigo != null &&
          $scope.formData.codigoTarjeta.Codigo != null &&
          $scope.formData.numeroTarjeta != '' &&
          $scope.formData.fechaTarjeta != '' &&
          $scope.formData.codigoGestorTa.Codigo != null;
        }

        return v;
      };

      //clearCollectionManager
      function _clearCollectionManager(option, allFields){
        switch (option){
          case $scope.CODIGO_GESTOR_COBRO_REGISTRO_CUENTA:
            if (allFields){
              $scope.formData.entidad = {
                Codigo: null
              };
            }
            $scope.formData.oficina = '';
            $scope.formData.tipoCuenta = {
              Codigo: null
            };
            $scope.formData.moneda = {
              Codigo: null
            };
            $scope.formData.ctaCalcular = '';
            $scope.formData.cuenta = '';
            $scope.formData.codigoGestorEn = {
              Codigo: null
            };
          break;
          case $scope.CODIGO_GESTOR_COBRO_REGISTRO_TARJETA:
            if (allFields){
              $scope.formData.tipoTarjeta = {
                Codigo: null
              };
            }
            $scope.formData.codigoTarjeta = {
              Codigo: null
            };
            $scope.formData.numeroTarjeta = '';
            $scope.formData.fechaTarjeta = '';
            $scope.formData.codigoGestorTa = {
              Codigo: null
            };
          break;
        }
      }

      $scope.clearCollectionManager = function(option, allFields){
        _clearCollectionManager(option, allFields);
      }

      $scope.onEntidadChange = function(item) {
        _clearCollectionManager($scope.CODIGO_GESTOR_COBRO_REGISTRO_CUENTA, false);
        if (!item) return;

        $scope.formData.codigoGestoresEn = [];
        $scope.formData.oficina = item.CodigoOficiona;
        $scope.formData.minCuenta = item.LongitudMinimo || 0;
        $scope.formData.maxCuenta = item.LongitudMaximo || 0;

        proxyGeneral.GetListGestor($scope.CODIGO_GESTOR_COBRO_REGISTRO_CUENTA, item.Codigo, true).then(function(response) {
          $scope.formData.codigoGestoresEn = response.Data;
        }, function() {
          console.log(arguments);
        });
      };


      $scope.onCtaCalcular = function(item) {
        var vCodeEntity = $scope.formData.entidad && $scope.formData.entidad.Codigo !== null;
        var vAccountType = $scope.formData.tipoCuenta && $scope.formData.tipoCuenta.Codigo !== null;
        var vCodeCurrency = $scope.formData.moneda && $scope.formData.moneda.Codigo !== null;

        if (vCodeEntity && vAccountType && vCodeCurrency){
          $scope.formData.cuentaNoFormat = item || '';
          proxyGeneral.GetEnmascarCuenta($scope.formData.entidad.Codigo, $scope.formData.tipoCuenta.Codigo, $scope.formData.moneda.Codigo, item, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              $scope.formData.cuentaNoFormat = response.Data.NumeroCuenta;
              $scope.formData.cuenta = response.Data.NumeroCuentaEnmascarado;
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

        $scope.formData.codigoTarjetas = [];
        $scope.formData.codigoGestoresTa = [];
        $scope.formData.minTarjeta =item.LongitudMinimo || 0;
        $scope.formData.maxTarjeta =item.LongitudMaximo || 0;

        var vServiceCards = proxyGeneral.GetListCodigoTarjeta("2",item.Codigo, false);
        var vServiceManagers = proxyGeneral.GetListGestor($scope.CODIGO_GESTOR_COBRO_REGISTRO_TARJETA,item.Codigo, false);
        $q.all([vServiceCards, vServiceManagers]).then(function(response) {
          var vCards = response[0];
          var vManagers = response[1];
          if (vCards.OperationCode == constants.operationCode.success){
            $scope.formData.codigoTarjetas = vCards.Data;
          }
          if (vManagers.OperationCode == constants.operationCode.success){
            $scope.formData.codigoGestoresTa = vManagers.Data;
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
          var vCardType = $scope.formData.tipoTarjeta && $scope.formData.tipoTarjeta.Codigo !== null,
              vCardNumber = $scope.formData.numeroTarjeta || '';

          if (vCardType){
            $scope.formData.numeroTarjetaNoFormat = vCardNumber;
            proxyGeneral.GetEnmascarTarjeta($scope.formData.tipoTarjeta.Codigo, vCardNumber, true).then(function(data){
              if (data.OperationCode == constants.operationCode.success){
                $scope.numeroCambiando = true;
                $scope.formData.numeroTarjetaNoFormat = data.Data.NumeroCuenta;
                $scope.formData.numeroTarjeta = data.Data.NumeroCuentaEnmascarado;
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

      /*#######################
      # Archivo cargomático
      #######################*/
      $scope.fnChangeLoadFile = function(){

        $timeout(function(){
          var vFile = $scope.formData.fmLoadFile || {};
          if (!angular.isUndefined(vFile[0]) && getFileSizeMB(vFile[0].size) > 4) {
            mModalAlert.showError(
              "El tamaño del archivo que estás tratando de guardar supera el máximo permitido por el servidor (4 Mb). El archivo no ha sido guardado, por favor validar lo siguiente: <br/><br/>" +
              "- Intenta reducir el tamaño del archivo, verificando la resolución de la imagen.<br/>" +
              "- Asegúrate que estés adjuntando solo la imagen al que corresponde el título del documento.", 'Error');
            $scope.formData.nameLoadFile = '';
            $scope.formData.selectLoadFile = true;
          } else {
            $scope.formData.nameLoadFile = vFile[0].name;
            $scope.formData.selectLoadFile = false;
          }
        }, 0);
      };

      var getFileSizeMB = function (size) {
        return size / 1024 / 1024;
      }

      function buildEmition() {
        var fn = $filter("date");
        var formData = $scope.formData;

        var codigoCompania = 1;
        var format = "yyyy/MM/dd";
        var em = {
          PorDctoIntgPlaza: $scope.formData.PorDctoIntgPlaza || 0,
          MarcaPorDctoIntegralidad: $scope.formData.DctoIntegralidad ? "S" : "N",
          NumeroSolicitud: typeof formData.mNroSolic == "undefined" ? "" : formData.mNroSolic,
          PrimaPactada: typeof formData.mPrimaPactada == "undefined" ? "" : formData.mPrimaPactada,
          ScoreContratante: $scope.formData.contractor.mScore ? $scope.formData.contractor.mScore : -1,
          CodigoCompania: codigoCompania,
          CodigoTipoEntidad: "1",
          TipoEmision: "1",
          ModalidadEmision: "N",
          MCAEndosatario: "N",
          MCAInformeInspeccion: "N",
          MCAInspeccionPrevia: "N",
          SNEmite: "S",
          FlgCheckAsegurado: "SI", //(formData.aseguradoFlag) ? "SI" : "NO",
          MontoPrima: $scope.quotation.montoPrima,
          Poliza: {
            CodigoFinanciamiento: formData.tipoFinanciamiento.codigo,
            ModalidadPrimeraCuota: "IND",
            CodigoCompania: codigoCompania,
            CodigoRamo: "301",
            MCAModalidad: "N",
            InicioVigencia: fn(formData.dt, format),
            FinVigencia: fn(formData.finVigencia, format),
            PolizaGrupo: formData.grupoPoliza.groupPolize
          },
          Contratante: {
            Nombre: !$scope.isCompany() ? formData.contractor.mNomContratante : formData.contractor.mRazonSocial,
            ApellidoMaterno: !$scope.isCompany() ? formData.contractor.mApeMatContratante : "",
            ApellidoPaterno: !$scope.isCompany() ? formData.contractor.mApePatContratante : "",
            FechaNacimiento: !$scope.isCompany()
              ? fn(
                  new Date(
                    formData.contractor.mYear.id,
                    formData.contractor.mMonth.id - 1,
                    formData.contractor.mDay.id
                  ),
                  format
                )
              : "",
            TipoDocumento: formData.contractor.mTipoDocumento.Codigo,
            CodigoDocumento: formData.contractor.mNumeroDocumento,
            Sexo: !$scope.isCompany() ? (formData.contractor.mSexo === "H" ? "1" : "0") : "",
            Telefono: formData.contractor.mTelefonoFijo,
            Telefono2: formData.contractor.mTelefonoCelular,
            CorreoElectronico: formData.contractor.mCorreoElectronico,
            MCAMapfreDolar: formData.discountMDolar > 0 ? "S" : "N",
            MCAFisico: "S",
            ImporteAplicarMapfreDolar: formData.discountMDolar,
            Direccion: formData.addressContractor.mNombreVia,
            Profesion: {
              Codigo: formData.contractor.mProfesion ? formData.contractor.mProfesion.Codigo : ""
            },
            ActividadEconomica: {
              Codigo: formData.contractor.mActividadEconomica ? formData.contractor.mActividadEconomica.Codigo || 0 : 0
            },
            Ubigeo: {
              CodigoNumero: formData.addressContractor.mTipoNumero.Codigo,
              TextoNumero: formData.addressContractor.mNumeroDireccion,
              CodigoInterior: formData.addressContractor.mTipoInterior.Codigo,
              TextoInterior: formData.addressContractor.mNumeroInterior,
              CodigoZona: formData.addressContractor.mTipoZona.Codigo,
              TextoZona: formData.addressContractor.mNombreZona,
              Referencia: formData.addressContractor.mDirReferencias,
              CodigoDepartamento: formData.addressContractor.ubigeoData.mDepartamento.Codigo,
              CodigoProvincia: formData.addressContractor.ubigeoData.mProvincia.Codigo,
              CodigoDistrito: formData.addressContractor.ubigeoData.mDistrito.Codigo,
              CodigoVia: formData.addressContractor.mTipoVia.Codigo
            },
            EstadoCivil: formData.contractor.civilState && formData.contractor.civilState.Codigo ? { Codigo: formData.contractor.civilState.Codigo } : undefined,
            FechaExpedicion: validateExpirationDate(formData)
          },
          Endosatario: {
            CodigoEndosatario: "",
            TipoDocumento: "",
            CodigoDocumento: "",
            Nombre: "",
            SumaEndosatario: 0
          },
          Documento: {
            NumeroAnterior: $scope.quotation.numeroDocumento,
            NumeroTicket: "",
            CodigoEstado: "1",
            CodigoUsuario: "",
            CodigoUsuarioRED: "Usuario",
            CodigoProducto: $scope.quotation.vehiculo.productoVehiculo.codigoProducto, //"5"
            FlagDocumento: "",
            CodigoProceso: "2",
            McaAsegNuevo: "N",
            NombreDocumento: "",
            RutaDocumento: "",
            MontoPrima: $scope.quotation.montoPrima,
            CodigoMoneda: "2",
            NumeroPlaca: "",
            CodigoAgente: formData.selectedAgent ? formData.selectedAgent.codigoAgente : "",
            MarcaAsistencia: "",
            Ubigeo: {
              CodigoDepartamento: "",
              CodigoProvincia: "",
              CodigoDistrito: ""
            }
          },
          Vehiculo: {
            CodigoTipo: "1",
            NumeroChasis: formData.mNumeroChasis,
            NumeroMotor: formData.mNumeroMotor,
            ZonaTarifa: "A",
            CodigoMoneda: "2",
            CodigoColor: formData.mColor.codigo,
            NumeroPlaca: !formData.enTramite ? formData.mPlaca : "E/T",
            MCANUEVO: "S",
            MCAGPS: "S",
            PolizaGrupo: formData.grupoPoliza.groupPolize,
            ProductoVehiculo: {
              CodigoProducto: $scope.quotation.vehiculo.productoVehiculo.codigoProducto
            },
            CodTipoFrecUso: "", //formData.vehicleDetailsContractor.mTypeVehicle.Codigo,
            CodAnioLicencia: formData.vehicleDetailsContractor.mAntiguedadLicencia.Codigo,
            CodGuardaGaraje: formData.vehicleDetailsContractor.mGaraje,
            CodConductorUnico: formData.vehicleDetailsContractor.mUnicoConductor,
            CodEventoUltimosAnios: formData.vehicleDetailsContractor.mAccidentesVehicle.Codigo,
            CodTipoUsoVehiculo: formData.vehicleDetailsContractor.mUseVehicle.Codigo,
            DesTipoFrecUso: "", //formData.vehicleDetailsContractor.mTypeVehicle.Nombre,
            DesAnioLicencia: formData.vehicleDetailsContractor.mAntiguedadLicencia.Nombre,
            DesEventoUltimosAnios: formData.vehicleDetailsContractor.mAccidentesVehicle.Nombre,
            DesTipoUsoVehiculo: formData.vehicleDetailsContractor.mUseVehicle.Nombre,
            Version: $scope.quotation.vehiculo.version ? $scope.quotation.vehiculo.version : "",
            DsctoComercial: $scope.quotation.vehiculo.dsctoComercial || 0,
            TipoTransmision: $scope.quotation.vehiculo.tipoTransmision && $scope.quotation.vehiculo.tipoTransmision.codigo ? { Codigo: $scope.quotation.vehiculo.tipoTransmision.codigo } : undefined,
            ScoreMorosidad: $scope.formData.scoreMorosidad || undefined
          },
          Inspector: {
            Nombre: "",
            ApellidoPaterno: "",
            Telefono: "0",
            Telefono2: "0",
            Observacion: ""
          },
          Inspeccion: {
            NumeroInspeccionTRON: ""
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
          ListaAccionista: $scope.formData.accionistas
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

        if (!formData.aseguradoFlag) {
          em.AseguradoAutos_2 = {
            Nombre: !$scope.isCompany() ? formData.contractor2.mNomContratante : formData.contractor2.mRazonSocial,
            ApellidoMaterno: !$scope.isCompany() ? formData.contractor2.mApeMatContratante : "",
            ApellidoPaterno: !$scope.isCompany() ? formData.contractor2.mApePatContratante : "",
            FechaNacimiento: !$scope.isCompany()
              ? fn(
                  new Date(
                    formData.contractor2.mYear.id,
                    formData.contractor2.mMonth.id - 1,
                    formData.contractor2.mDay.id
                  ),
                  format
                )
              : "",
            TipoDocumento: formData.contractor2.mTipoDocumento.Codigo,
            CodigoDocumento: formData.contractor2.mNumeroDocumento,
            Sexo: !$scope.isCompany() ? (formData.contractor2.mSexo === "H" ? "1" : "0") : "",
            Telefono: formData.contractor2.mTelefonoFijo,
            Telefono2: formData.contractor2.mTelefonoCelular,
            CorreoElectronico: formData.contractor2.mCorreoElectronico,
            MCAMapfreDolar: formData.discountMDolar > 0 ? "S" : "N",
            MCAFisico: "S",
            ImporteAplicarMapfreDolar: formData.discountMDolar,
            Direccion: formData.addressContractor2.mNombreVia,
            Profesion: {
              Codigo: formData.contractor2.mProfesion.Codigo
            },
            ActividadEconomica: {
              Codigo: formData.contractor2.mActividadEconomica
                ? formData.contractor2.mActividadEconomica.Codigo || 0
                : 0
            },
            Ubigeo: {
              CodigoNumero: formData.addressContractor2.mTipoNumero.Codigo,
              TextoNumero: formData.addressContractor2.mNumeroDireccion,
              CodigoInterior: formData.addressContractor2.mTipoInterior.Codigo,
              TextoInterior: formData.addressContractor2.mNumeroInterior,
              CodigoZona: formData.addressContractor2.mTipoZona.Codigo,
              TextoZona: formData.addressContractor2.mNombreZona,
              Referencia: formData.addressContractor2.mDirReferencias,
              CodigoDepartamento: formData.addressContractor2.ubigeoData.mDepartamento.Codigo,
              CodigoProvincia: formData.addressContractor2.ubigeoData.mProvincia.Codigo,
              CodigoDistrito: formData.addressContractor2.ubigeoData.mDistrito.Codigo,
              CodigoVia: formData.addressContractor2.mTipoVia.Codigo
            }
          };
        } else {
          em.AseguradoAutos_2 = {
            Nombre: !$scope.isCompany() ? formData.contractor.mNomContratante : formData.contractor.mRazonSocial,
            ApellidoMaterno: !$scope.isCompany() ? formData.contractor.mApeMatContratante : "",
            ApellidoPaterno: !$scope.isCompany() ? formData.contractor.mApePatContratante : "",
            FechaNacimiento: !$scope.isCompany()
              ? fn(
                  new Date(
                    formData.contractor.mYear.id,
                    formData.contractor.mMonth.id - 1,
                    formData.contractor.mDay.id
                  ),
                  format
                )
              : "",
            TipoDocumento: formData.contractor.mTipoDocumento.Codigo,
            CodigoDocumento: formData.contractor.mNumeroDocumento,
            Sexo: !$scope.isCompany() ? (formData.contractor.mSexo === "H" ? "1" : "0") : "",
            Telefono: formData.contractor.mTelefonoFijo,
            Telefono2: formData.contractor.mTelefonoCelular,
            CorreoElectronico: formData.contractor.mCorreoElectronico,
            MCAMapfreDolar: formData.discountMDolar > 0 ? "S" : "N",
            MCAFisico: "S",
            ImporteAplicarMapfreDolar: formData.discountMDolar,
            Direccion: formData.addressContractor.mNombreVia,
            Profesion: {
              Codigo: formData.contractor.mProfesion ? formData.contractor.mProfesion.Codigo : ""
            },
            ActividadEconomica: {
              Codigo: formData.contractor.mActividadEconomica ? formData.contractor.mActividadEconomica.Codigo || 0 : 0
            },
            Ubigeo: {
              CodigoNumero: formData.addressContractor.mTipoNumero.Codigo,
              TextoNumero: formData.addressContractor.mNumeroDireccion,
              CodigoInterior: formData.addressContractor.mTipoInterior.Codigo,
              TextoInterior: formData.addressContractor.mNumeroInterior,
              CodigoZona: formData.addressContractor.mTipoZona.Codigo,
              TextoZona: formData.addressContractor.mNombreZona,
              Referencia: formData.addressContractor.mDirReferencias,
              CodigoDepartamento: formData.addressContractor.ubigeoData.mDepartamento.Codigo,
              CodigoProvincia: formData.addressContractor.ubigeoData.mProvincia.Codigo,
              CodigoDistrito: formData.addressContractor.ubigeoData.mDistrito.Codigo,
              CodigoVia: formData.addressContractor.mTipoVia.Codigo
            }
          };
        }
        if (formData.mEndosario && formData.mEndosario.codigo)
        {
          em.Endosatario = {
            CodigoEndosatario: "",
            TipoDocumento: formData.mEndosario.tipoDocumento,
            CodigoDocumento: formData.mEndosario.code || formData.mEndosario.codigo,
            Nombre: formData.mEndosario.descripcion,
            SumaEndosatario: formData.mSumaEndosar
          };
        }

        // Cargo Recurrente
        em.GestorCobro = angular.extend(em.GestorCobro, _getGestorCobro());

        em = polizasFactory.setReferidoNumber(em);
        return em;
      }

      function _getGestorCobro() {
        var formData = ($scope.formData || {});
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

      $scope.isCompany = function() {
        return !mainServices.fnShowNaturalRucPerson(
          $scope.formData.contractor.mTipoDocumento.Codigo,
          $scope.formData.contractor.mNumeroDocumento
        );
      };

      function _paramsCargaAltaDocumental(){
        var vFile = $scope.formData.fmLoadFile || {};
        var vParams = {
          NumeroCotizacion: $scope.quotation.numeroDocumento,
          fieldNameHere: vFile[0]
        };
        return vParams;
      }

      $scope.isRequiredFile = function() {
        var gestor = _getGestorCobro();
        return $scope.formData.IS_REQUIRED_RC || !!(gestor && gestor.CodigoGestor &&  gestor.TipoGestor);
      }

      $scope.previews = function() {};

      $scope.emit = function() {
        console.log('SOCIOS BS ACCIONISTAS: ',em);
        if($scope.isRequiredFile()){
          if (!$scope.isValidFormStep4()) {
            return;
          }
        }
        var em = buildEmition();

        var vParamsCargaAltaDocumental = _paramsCargaAltaDocumental();

        if(vParamsCargaAltaDocumental.fieldNameHere) {
          autosFactory.cargaAltaDocumental(vParamsCargaAltaDocumental)
          .then(function (rsCargaAltaDocumental) {
            if (rsCargaAltaDocumental.OperationCode == constants.operationCode.success){
              em.GestorCobro.NombreArchivoCargomatico = rsCargaAltaDocumental.Data.ValueResult;
              emitFactory.sendEmision({valueEncrypt:encrypterFactory.handler(em)}).then(sendEmision_Response);
            }else{
              mModalAlert.showError(rsCargaAltaDocumental.Message, 'Error Archivo cargomático');
            }
          });
        }else{
          emitFactory.sendEmision({valueEncrypt:encrypterFactory.handler(em)}).then(sendEmision_Response);
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

    function sendEmision_Response(rsEmision) {
      if (
        rsEmision.Data && rsEmision.Data.ControlTecnico && rsEmision.Data.ControlTecnico.EsInformativo === true && rsEmision.Data.ControlTecnico.Codigo === "384" ) {
          var auxMensaje = rsEmision.Data.ControlTecnico.Descripcion
          mModalAlert.showInfo(auxMensaje , "¡Poliza Emitida!").then(function() {
            $scope.formData.contractor = {};
            $state.go("resumenNewEmit", { emitionId: rsEmision.Data.NumeroDocumento });
          });
        }
        else if (
        rsEmision.OperationCode == constants.operationCode.success &&
        rsEmision.Data.NumeroDocumento &&
        rsEmision.Data.NumeroDocumento != "" &&
        rsEmision.Data.NumeroDocumento != 0
      ) {
        var auxMensaje = !rsEmision.Data.DescripcionAdicional ? '' : rsEmision.Data.DescripcionAdicional 
        mModalAlert.showInfo("Se ha Emitido la poliza satisfactoriamente" + auxMensaje, "¡Poliza Emitida!").then(function() {
          $scope.formData.contractor = {};
          $state.go("resumenNewEmit", { emitionId: rsEmision.Data.NumeroDocumento });
        });
      } else {
        if (rsEmision.OperationCode == constants.operationCode.code900) mModalAlert.showError(rsEmision.Message, "¡Error!");
        else mModalAlert.showError("No se ha generado el numero de documento.", "¡Error!");
      }
    }
  }]);
});
