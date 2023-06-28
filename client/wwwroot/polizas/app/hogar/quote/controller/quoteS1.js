(function($root, deps, action) {
  define(deps, action);
})(
  this,
  [
    "angular",
    "constants",
    "mpfPersonConstants",
    "lodash",
    "/scripts/mpf-main-controls/components/ubigeo/component/ubigeo.js",
    "/polizas/app/autos/autosEmitirUsado/component/groupPolize/groupPolize.js",
    "/scripts/mpf-main-controls/components/contractorAddress/component/contractorAddress.js",
    "hogarCpnteAlarmsTypes",
    "mpfPersonComponent"
  ],
  function(angular, constants, personConstants, _) {
    var appAutos = angular.module("appAutos");

    appAutos.controller("hogarQuoteS1Controller", [
      "$scope",
      "$state",
      "hogarFactory",
      "mModalAlert",
      "homeProducts",
      "homeDocumentTypes",
      "homeConstructionYears",
      "homeCategory",
      "homeMonitoringAlarm",
      "homeCurrencyList",
      "oimPrincipal",
      "mainServices",
      "proxyGeneral",
      "gaService",
      function(
        $scope,
        $state,
        hogarFactory,
        mModalAlert,
        homeProducts,
        homeDocumentTypes,
        homeConstructionYears,
        homeCategory,
        homeMonitoringAlarm,
        homeCurrencyList,
        oimPrincipal,
        mainServices,
        proxyGeneral,
        gaService
      ) {
        (function onLoad() {
          $scope.mainStep = $scope.mainStep || {};
          $scope.firstStep = $scope.firstStep || {};
          $scope.secondStep = $scope.secondStep || {};

          $scope.mainStep.showagente = true;
          $scope.mainStep.goback = false;
          $scope.mainStep.showtitle = true;

          if (homeProducts) $scope.firstStep.productData = homeProducts;
          if (homeDocumentTypes) $scope.firstStep.documentTypeData = homeDocumentTypes;
          if (homeConstructionYears) $scope.firstStep.constructionYearData = homeConstructionYears;
          if (homeCategory) $scope.firstStep.categoryData = homeCategory;
          if (homeMonitoringAlarm) $scope.firstStep.monitoringAlarmData = homeMonitoringAlarm;
          if (homeCurrencyList) $scope.firstStep.monedaData = homeCurrencyList;

          initErrorTipoContenido();
          if (typeof $scope.firstStep.paramsCalculatePremium == "undefined") initCheckBox();

          if ($scope.firstStep.dataContractor) {
            funDocNumLength($scope.firstStep.dataContractor.TipoDocumento);
            $scope.btnClearContractor = true;
          } else {
            funDocNumLength(null);
          }

          $scope.showCurrencyType = true;

          $scope.appCode = personConstants.aplications.HOGAR;
          $scope.formCode = personConstants.forms.COT_HOG_CN;
          $scope.companyCode = constants.module.polizas.hogar.codeCompany;
          $scope.firstStep.dataContractorPoliza = {};
          $scope.firstStep.formData = $scope.firstStep.formData || {};
          $scope.firstStep.setter && _setUbigeo();

          $scope.$on('personForm', function(event, data) {
            setFormData('dataContractorPoliza', data.datosPoliza);
          });

        })();

        function setFormData(name, data) {
          $scope.firstStep[name].mNomContratante = data.Nombre;
          $scope.firstStep[name].mApePatContratante = data.ApellidoPaterno;
          $scope.firstStep[name].mApeMatContratante = data.ApellidoMaterno;
          $scope.firstStep[name].mRazonSocial = data.documentNumber.substring(0, 2) === '20' ? data.Nombre : '';
          $scope.firstStep[name].mTipoDocumento = data.documentType;
          $scope.firstStep[name].mNumeroDocumento = data.documentNumber;
          $scope.firstStep[name].CodigoDocumento = data.documentNumber;
          $scope.firstStep[name].TipoDocumento = data.documentType;
          $scope.firstStep[name].documentType = data.documentType;
          $scope.firstStep[name].documentNumber = data.documentNumber;
          $scope.firstStep.formData = _.assign({}, data, {
            CodigoDocumento: data.documentNumber,
            TipoDocumento: data.documentType
          });

          $scope.firstStep['ubigeo'] = {
            codDepartment: $scope.firstStep.ubigeoData.mDepartamento.Codigo,
            codProvince: $scope.firstStep.ubigeoData.mProvincia.Codigo,
            codDistrict: $scope.firstStep.ubigeoData.mDistrito.Codigo
          }
        }

        function initErrorTipoContenido() {
          $scope.firstStep.errorTipoCobertura = {
            edificacion: false,
            contenido: false
          };
        }

        function initCheckBox() {
          $scope.firstStep.mEdificacion = {
            valueDefault: false
          };
          $scope.firstStep.mContenido = {
            valueDefault: false
          };
          $scope.firstStep.mCoberturaTerremotoEdificacion = {
            valueDefault: false
          };
          $scope.firstStep.mCoberturaTerremotoContenido = {
            valueDefault: false
          };
        }

        function disableNextStep() {
          $scope.$parent.secondStep = {};
        }

        function funDocNumLength(documentType) {
          $scope.firstStep.mNumeroDocumento = '';
          var numDocValidations = {};
          mainServices.documentNumber.fnFieldsValidated(numDocValidations, documentType, 1);

          $scope.docNumMaxLength = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
          $scope.docNumMinLength = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
          $scope.docNumType = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE;
          $scope.docNumTypeDisabled = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE_DISABLED;
        }

        $scope.showNaturalPerson = function(item) {
          //Show legalEntity
          if (item) {
            if (item.Codigo && $scope.firstStep.mNumeroDocumento) {
              $scope.firstStep.legarlEntity = !mainServices.fnShowNaturalRucPerson(
                item.Codigo,
                $scope.firstStep.mNumeroDocumento
              );
            } else if (item.Codigo == constants.documentTypes.ruc.Codigo) {
              $scope.firstStep.legarlEntity = true;
            } else {
              $scope.firstStep.legarlEntity = false;
            }
            funDocNumLength(item.Codigo);
            loadContractorData(true);
          }else{
            $scope.firstStep.mNumeroDocumento = ""
          }

        };

        $scope.clearMapfreDolares = function() {
          $scope.firstStep.mOpcionMapfreDolares = "No";
          $scope.firstStep.mMapfreDolares = "";
        };

        function clearContractor(cbo) {
          if (cbo) $scope.firstStep.mNumeroDocumento = "";
          $scope.firstStep.mNomContratante = "";
          $scope.firstStep.mApePatContratante = "";
          $scope.firstStep.mApeMatContratante = "";
          $scope.firstStep.mRazonSocial = "";
          $scope.firstStep.setter(null, null, null);
        }

        $scope.currentDoc = {};
        $scope.clean = function() {
          $scope.firstStep.PorDctoIntgPlaza = 0;
          $scope.firstStep.DctoIntegralidad = false;
          $scope.btnClearContractor = false;
          $scope.firstStep.mTipoDocumento = {
            Codigo: null
          };
          $scope.currentDoc["documentNumber"] = undefined;
          $scope.currentDoc["documentType"] = undefined;
          clearContractor(true);
        };

        $scope.loadContractorData = function(data) {
          if (data.isClear) {
            _cleanUbigeo();
          }

          if(!angular.isUndefined(data.documentType) && !angular.isUndefined(data.documentNumber)){
            $scope.firstStep.mTipoDocumento = data.documentType;
            $scope.firstStep.mNumeroDocumento = data.documentNumber;

            var paramsContractor = {
              codeCompany: constants.module.polizas.hogar.codeCompany,
              documentType: $scope.firstStep.mTipoDocumento.Codigo,
              documentNumber: $scope.firstStep.mNumeroDocumento
            };

            if (
              paramsContractor.documentType &&
              paramsContractor.documentNumber &&
              paramsContractor.documentNumber != "" &&
              ($scope.currentDoc["documentType"] !== paramsContractor.documentType ||
                $scope.currentDoc["documentNumber"] !== paramsContractor.documentNumber)
            ) {
              $scope.currentDoc = paramsContractor;
              $scope.clearMapfreDolares();
            }
          }
          if(!angular.isUndefined(data.ImporteMapfreDolar)){
            $scope.firstStep.mSaldoMapfreDolar = data.ImporteMapfreDolar;
            if ($scope.firstStep.mSaldoMapfreDolar > 0 && $scope.firstStep.mTipoDocumento.Codigo == "DNI") {
              $scope.showMapfreDollars = true;
            } else {
              $scope.showMapfreDollars = false;
            }
          }

          $scope.firstStep.codDepartment = $scope.firstStep.codDepartment || data.CodigoDepartamento;
          $scope.firstStep.codProvince = $scope.firstStep.codProvince || data.CodigoProvincia;
          $scope.firstStep.codDistrict = $scope.firstStep.codDistrict || data.CodigoDistrito;
          _setUbigeo();
        };

        $scope.errorTipoCobertura = function(e, c) {
          var vError = false;
          initErrorTipoContenido();
          var vMillion = 1000000;
          var ne = isNaN($scope.firstStep.mCostoEdificacion) ? 0 : Number($scope.firstStep.mCostoEdificacion);
          var nc = isNaN($scope.firstStep.mCostoContenido) ? 0 : Number($scope.firstStep.mCostoContenido);
          var value = ne + nc;
          if (value >= vMillion || value < 0) {
            if (e && c) {
              vError = true;
              $scope.firstStep.errorTipoCobertura = {
                edificacion: true,
                contenido: true
              };
            } else if (e) {
              vError = true;
              $scope.firstStep.errorTipoCobertura = {
                edificacion: true
              };
            } else if (c) {
              vError = true;
              $scope.firstStep.errorTipoCobertura = {
                contenido: true
              };
            }
          }
          return vError;
        };

        /*#########################
        # Steps
        #########################*/
        $scope.$on("changingStep", function(ib, e) {
          if (e.step > 1 && !changeData()) {
            if ($scope.validationForm() & $scope.firstStep.ubigeoValid.func()) {
              e.cancel = false;
            } else {
              e.cancel = true;
            }
          } else {
            e.cancel = true;
          }
        });

        /*#########################
        # changeData
        #########################*/
        function changeData() {
          var vIsEqual = false;
          if (
            typeof $scope.firstStep.paramsCalculatePremium != "undefined" &&
            typeof $scope.firstStep.data != "undefined"
          ) {
            var paramsCalculatePremium = _.isEqual(buildCalculatePremium(), $scope.firstStep.paramsCalculatePremium);
            var data = _.isEqual(currentData(), $scope.firstStep.data);
            vIsEqual = paramsCalculatePremium && data;
          }
          return !vIsEqual;
        }

        /*#########################
        # _requiredTypeCoverage
        #########################*/
        $scope._requiredTypeCoverage = function(item) {
          $scope.$broadcast("fnChangeModalityCode", item);
          if (item) {
            switch (item.Codigo) {
              case 0:
                $scope.showCurrencyType = true;
                $scope.firstStep.showDiscounts = false;
                $scope.firstStep.mDescuentoComercial = "";
                $scope.firstStep.endButton = "Siguiente";
                $scope.firstStep.goNextStep = 2;
                $scope.firstStep.groupPolizeData = "";
                $scope.firstStep.showGroupPolize = false;
                break;

              case 6: // Nuevo Mapfre 24
                $scope.showCurrencyType = false;
                $scope.firstStep.mMoneda = { Codigo: "1", Descripcion: "NUEVOS SOLES" };
                $scope.firstStep.showDiscounts = false;
                $scope.firstStep.mDescuentoComercial = "";
                $scope.firstStep.endButton = "Cotizar";
                $scope.firstStep.goNextStep = 3;
                $scope.firstStep.groupPolizeData = "12019";
                $scope.firstStep.showGroupPolize = true;
                break;

              case 30: // Smart 24
                $scope.showCurrencyType = false;
                $scope.firstStep.mMoneda = { Codigo: "1", Descripcion: "NUEVOS SOLES" };
                $scope.firstStep.showDiscounts = false;
                $scope.firstStep.mDescuentoComercial = "";
                $scope.firstStep.endButton = "Cotizar";
                $scope.firstStep.goNextStep = 3;
                $scope.firstStep.groupPolizeData = "12018";
                $scope.firstStep.showGroupPolize = true;
                break;

              case 31: // Ideal
                $scope.showCurrencyType = true;
                $scope.firstStep.showDiscounts = true;
                $scope.firstStep.endButton = "Siguiente";
                $scope.firstStep.goNextStep = 2;
                $scope.firstStep.showGroupPolize = false;
                $scope.firstStep.groupPolizeData = "";
                break;

              default:
                $scope.showCurrencyType = true;
                $scope.firstStep.showDiscounts = false;
                $scope.firstStep.mDescuentoComercial = "";
                $scope.firstStep.endButton = "Cotizar";
                $scope.firstStep.showGroupPolize = false;
                $scope.firstStep.groupPolizeData = "";
            }
          }
        };

        /*#########################
        # _errorTypeCoverage
        #########################*/
        $scope._errorTypeCoverage = function() {
          var vError = $scope.firstStep.mEdificacion.valueDefault || $scope.firstStep.mContenido.valueDefault;
          $scope.errorTypeCoverage = !vError;
          return $scope.errorTypeCoverage;
        };
        /*#########################
        # _errorValueContent
        #########################*/
        $scope._errorValueContent = function() {
          var vError = false;
          var vMax = 3000;
          var vCC = isNaN($scope.firstStep.mCostoContenido) ? 0 : Number($scope.firstStep.mCostoContenido);
          if (vCC > vMax) vError = true;
          return vError;
        };
        /*#########################
        # _errorValuableObject
        #########################*/
        $scope._errorValuableObject = function() {
          $scope.errorValuableObject = false;
          if (oimPrincipal.isAdmin()) {
            var vCC = isNaN($scope.firstStep.mCostoContenido) ? 0 : Number($scope.firstStep.mCostoContenido);
            var vMOV = isNaN($scope.firstStep.mMontoObjetosValiosos)
              ? 0
              : Number($scope.firstStep.mMontoObjetosValiosos);
            var vCCpercent = vCC * 0.2;
            if (vMOV > vCCpercent) $scope.errorValuableObject = true;
          }
          return $scope.errorValuableObject;
        };
        /*#########################
        # _errorDescCommercial
        #########################*/
        $scope._errorDescCommercial = function() {
          $scope.errorDescCommercial = false;
          var vMax = 10;
          var vDc = isNaN($scope.firstStep.mDescuentoComercial) ? 0 : Number($scope.firstStep.mDescuentoComercial);
          if (vDc > vMax) $scope.errorDescCommercial = true;
          return $scope.errorDescCommercial;
        };

        /*#########################
        # ValidationForm
        #########################*/
        $scope.validationForm = function() {
          $scope.frmFirstStep.markAsPristine();
          var vNoError = !$scope.errorTipoCobertura(
            $scope.firstStep.mCostoEdificacion,
            $scope.firstStep.mCostoContenido
          );
          var vValuableObject = !$scope._errorValuableObject();
          var vDescCommercial = !$scope._errorDescCommercial();
          return $scope.frmFirstStep.$valid && vNoError && vDescCommercial && vValuableObject;
        };

        /*#########################
        # onEventEmmit fnSendAlarmsData
        #########################*/
        $scope.$on("fnSendAlarmsData", function(event, dataAlarms) {
          $scope.firstStep.mKitSmart = dataAlarms.mKitSmart;
          $scope.firstStep.mTipoComunicacion = dataAlarms.mTipoComunicacion || { Codigo: null, Descripcion: null };
          $scope.firstStep.mVideoWeb = dataAlarms.mVideoWeb;
          $scope.firstStep.mLlaveroImagen = dataAlarms.mLlaveroImagen;
          $scope.firstStep.mServiceAlarma = dataAlarms.mServiceAlarma;
        });

        /*#########################
        # buildCalculatePremium
        #########################*/
        function buildCalculatePremium() {
          var paramsCalculatePremium = {
            CodigoCompania: constants.module.polizas.hogar.codeCompany,
            CodigoRamo: constants.module.polizas.hogar.codeRamo,
            CodigoModalidad: $scope.firstStep.mProducto.Codigo,
            Hogar: {
              FlagContrataRobo: constants.module.polizas.hogar.flagContrataRobo, //'S', //valorFijo CONFIRMADO
              PolizaGrupo: "",
              DsctoComercial: isNaN($scope.firstStep.mDescuentoComercial) ? 0 : $scope.firstStep.mDescuentoComercial, //0
              CodigoCategoria: $scope.firstStep.mCategoria.Codigo, //1,
              AnioInmueble: $scope.firstStep.mAnioConstruccion.Campo, //2016,
              ValorEdificacion:
                $scope.firstStep.mEdificacion.valueDefault && !isNaN($scope.firstStep.mCostoEdificacion)
                  ? $scope.firstStep.mCostoEdificacion
                  : 0, //20000,
              ValorContenido:
                $scope.firstStep.mContenido.valueDefault && !isNaN($scope.firstStep.mCostoContenido)
                  ? $scope.firstStep.mCostoContenido
                  : 0, //2000,
              ValorObjetosValiosos:
                $scope.firstStep.mContenido.valueDefault && !isNaN($scope.firstStep.mMontoObjetosValiosos)
                  ? $scope.firstStep.mMontoObjetosValiosos
                  : 0, //0,
              //CodigoAlarmaMonitoreo: ($scope.firstStep.mAlarmaMonitoreo.Codigo == null) ? '0' : $scope.firstStep.mAlarmaMonitoreo.Codigo, //0,
              FlagEdificacionValor: $scope.firstStep.mEdificacion.valueDefault ? "S" : "N", //'S',
              FlagContenidoValor: $scope.firstStep.mContenido.valueDefault ? "S" : "N", //'S',
              FlagContrataTerremotoEdificacion: $scope.firstStep.mCoberturaTerremotoEdificacion.valueDefault
                ? "S"
                : "N", //'N',
              FlagContrataTerremotoContenido: $scope.firstStep.mCoberturaTerremotoContenido.valueDefault ? "S" : "N", //'N',
              Ubigeo: {
                CodigoDepartamento: $scope.firstStep.ubigeoData.mDepartamento.Codigo, //15,
                CodigoProvincia: $scope.firstStep.ubigeoData.mProvincia.Codigo, //128,
                CodigoDistrito: $scope.firstStep.ubigeoData.mDistrito.Codigo //22
              }
            },
            Contratante: {
              ImporteAplicarMapfreDolar:
                $scope.firstStep.mOpcionMapfreDolares == "Si" && !isNaN($scope.firstStep.mMapfreDolares)
                  ? $scope.firstStep.mMapfreDolares
                  : 0 //0 Valor del inputText CONFIRMADO
            }
          };
          return paramsCalculatePremium;
        }

        /*#########################
        # buildQuoteParams
        #########################*/
        function buildQuoteParams() {
          var requestQuote = {
            riesgoHogar: [
              {
                codDepartamento: $scope.firstStep.ubigeoData.mDepartamento.Codigo,
                codZonaCumulo: $scope.firstStep.ubigeoData.mProvincia.Codigo,
                codSubZonaCumulo: $scope.firstStep.ubigeoData.mDistrito.Codigo,
                codDepartamentoSpecified: true,
                impEdificacion: 0,
                impEdificacionSpecified: true,
                anioContruccion: $scope.firstStep.mAnioConstruccion.Codigo,
                anioContruccionSpecified: true,
                mcaTerremotoEdificacion: "N",
                impContenido: 0,
                impContenidoSpecified: true,
                impRoboContenido: 0,
                impRoboContenidoSpecified: true,
                mcaTerremotoContenido: "N",
                impObjetosValiosos: 0,
                impObjetosValiososSpecified: true,
                impRoboObjetosValiosos: 0,
                impRoboObjetosValiososSpecified: true,
                mcaTerremotoObjetosVal: "N",
                impDesaparicion: 0,
                impDesonestidad: 0,
                mcaKitSmart: $scope.firstStep.mKitSmart == "1" ? "S" : "N",
                tipComunicacion: $scope.firstStep.mTipoComunicacion.Codigo,
                tipComunicacionSpecified: $scope.firstStep.mTipoComunicacion
                  ? $scope.firstStep.mTipoComunicacion.Codigo == null
                    ? false
                    : true
                  : false,
                mcaVideoWeb: $scope.firstStep.mVideoWeb == "1" ? "S" : "N",
                mcaLlaveroMedico: $scope.firstStep.mLlaveroImagen == "1" ? "S" : "N",
                mcaAlarmaMonitoreo: $scope.firstStep.mServiceAlarma == "1" ? "S" : "N"
              }
            ],
            cabecera: {
              codigoAplicacion: "OIM"
            },
            poliza: {
              pctDctoIntgPlaza: $scope.firstStep.PorDctoIntgPlaza || 0,
              pctDctoIntgPlazaSpecified: $scope.firstStep.DctoIntegralidad,
              fecEfecSpto: formatDate(JSON.parse(JSON.stringify(new Date()))),
              fecVctoSpto: formatDate(
                JSON.parse(
                  JSON.stringify(
                    new Date(
                      new Date().setYear(new Date().getFullYear() + ($scope.firstStep.mProducto.Codigo == 30 ? 2 : 1))
                    )
                  )
                )
              ),
              codAgt: $scope.mainStep.mAgente.codigoAgente,
              codAgtSpecified: true,
              pctDctoComercial: $scope.firstStep.mDescuentoComercial ? $scope.firstStep.mDescuentoComercial : 0,
              pctDctoComercialSpecified: $scope.firstStep.mDescuentoComercial ? true : false,
              moneda: {
                codMon: $scope.firstStep.mMoneda ? $scope.firstStep.mMoneda.Codigo : null,
                codMonSpecified: $scope.firstStep.mMoneda ? true : false,
                //"codMonIso": "PEN",
                nomMon: $scope.firstStep.mMoneda ? $scope.firstStep.mMoneda.Descripcion : null
              },
              mcaMapfreDolares: $scope.firstStep.mOpcionMapfreDolares == "No" ? "N" : "S",
              impMapfreDolares: $scope.firstStep.mMapfreDolares,
              impMapfreDolaresSpecified: $scope.firstStep.mOpcionMapfreDolares == "Si" ? true : false,
              numPolizaGrupo: $scope.firstStep.groupPolizeData,
              numPolizaGrupoSpecified: true
            },
            producto: {
              codRamo: constants.module.polizas.hogar.codeRamo,
              codRamoSpecified: true,
              codModalidad: $scope.firstStep.mProducto.Codigo,
              codModalidadSpecified: true,
              codCia: constants.module.polizas.hogar.codeCompany,
              codCiaSpecified: true
            },
            PorDctoIntgPlaza: $scope.firstStep.PorDctoIntgPlaza || 0,
            MarcaPorDctoIntegralidad: $scope.firstStep.DctoIntegralidad ? "S" : "N",
            documentType: $scope.firstStep.dataContractorPoliza.mTipoDocumento,
            documentNumber: $scope.firstStep.dataContractorPoliza.mNumeroDocumento,
          };

          return requestQuote;
        }

        /*#########################
        # buildDataParams
        #########################*/
        function buildDataParams() {
          var dataParams = {
            product: $scope.firstStep.mProducto,
            firstName: $scope.firstStep.dataContractorPoliza.mNomContratante,
            lastName: $scope.firstStep.dataContractorPoliza.mApePatContratante,
            motherLastName: $scope.firstStep.dataContractorPoliza.mApeMatContratante,
            companyName: $scope.firstStep.dataContractorPoliza.mRazonSocial,
            currency: $scope.firstStep.mMoneda.Descripcion,
            documentType: $scope.firstStep.dataContractorPoliza.mTipoDocumento,
            documentNumber: $scope.firstStep.dataContractorPoliza.mNumeroDocumento,
            ubigeo: {
              department: $scope.firstStep.ubigeoData.mDepartamento,
              province: $scope.firstStep.ubigeoData.mProvincia,
              district: $scope.firstStep.ubigeoData.mDistrito
            },
            yearConstruction: $scope.firstStep.mAnioConstruccion,
            category: $scope.firstStep.mCategoria,
            floorsNumber: $scope.firstStep.mNroPisos,
            basementsNumber: $scope.firstStep.mNroSotanos,
            comunicationType: $scope.firstStep.mTipoComunicacion,
            mcaKitSmart: $scope.firstStep.mKitSmart == "1" ? "S" : "N",
            mcaVideoWeb: $scope.firstStep.mVideoWeb == "1" ? "S" : "N",
            mcaLlaveroMedico: $scope.firstStep.mLlaveroImagen == "1" ? "S" : "N",
            mcaAlarmaMonitoreo: $scope.firstStep.mServiceAlarma == "1" ? "S" : "N"
          };

          return dataParams;
        }

        function formatDate(date) {
          var format = date.slice(0, 10);
          return format.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, "$3/$2/$1");
        }

        function currentData() {
          var data = {
            codigoAgente: $scope.mainStep.claims.codigoAgente,
            Contratante: {
              TipoDocumento: $scope.firstStep.mTipoDocumento.Codigo, //"DNI",
              CodigoDocumento: $scope.firstStep.mNumeroDocumento //"12345678"
            }
          };
          return data;
        }

        $scope.evalMapfreDollars = function(value) {
          $scope.showErrMapfreDollars = value > $scope.firstStep.mSaldoMapfreDolar ? true : false;
        };

        /*#########################
        # nextStep
        #########################*/
        $scope.nextStep = function() {
          $scope.$broadcast('submitForm', true);

          disableNextStep();
          if ($scope.validationForm() & $scope.firstStep.ubigeoValid.func()) {
            if ($scope._errorValueContent()) {
              mModalAlert.showWarning("RIESGO SUJETO A INSPECCIÓN", "EMITIR POR OFICINA").then(function(response) {
                if (response) _nextStep();
              });
            } else {
              _nextStep();
            }
          }
        };

        function evalNextStep() {
          var requestQuoteRequest = buildQuoteParams();
          var sendDataParams = buildDataParams();

          sendDataParams.mcaKitSmart = requestQuoteRequest.riesgoHogar[0].mcaKitSmart;
          if ($scope.firstStep.goNextStep == 2) {
            $state.go(".", {
              step: $scope.firstStep.goNextStep,
              paramsHogarModule: { request: requestQuoteRequest, data: sendDataParams }
            });
          } else {
            gaService.add({ gaCategory: 'Emisa - Hogar', gaAction: 'MPF - Cotización', gaLabel: 'Botón: Cotizar' });
            hogarFactory.quote(requestQuoteRequest, true).then(function(res) {
              if (res.Data.codError == "0") {
                $state.go(".", {
                  step: $scope.firstStep.goNextStep,
                  paramsHogarModule: { response: res.Data, data: sendDataParams }
                });
              } else {
                mModalAlert.showWarning("", res.Data.descError);
              }
            }, function(err) {
              if(err.status === constants.operationCode.code900) {
                mModalAlert.showError("", err.data.Message);
              }
            });
          }
        }

        function _nextStep() {
          if ($scope.showMapfreDollars) {
            if (($scope.firstStep.mMapfreDolares <= $scope.firstStep.mSaldoMapfreDolar)) {
              evalNextStep();
            }
          } else {
            evalNextStep();
          }
        }

        $scope.obtenerDctontegralidad = function() {
          if ($scope.firstStep.DctoIntegralidad) {
            proxyGeneral
              .ObtenerDescuentoIntegralidad(
                constants.module.polizas.hogar.codeCia,
                $scope.mainStep.claims.codigoAgente,
                constants.module.polizas.hogar.codeRamo,
                $scope.firstStep.mTipoDocumento.Codigo,
                $scope.firstStep.mNumeroDocumento,
                true
              )
              .then(function(response) {
                if (response.OperationCode == constants.operationCode.success) {
                  $scope.firstStep.PorDctoIntgPlaza = response.Data;
                }
              })
              .catch(function(error) {
                console.log("Error en obtenerDctontegralidad: " + error);
              });
          }
        };

        function _cleanUbigeo() {
          $scope.firstStep['ubigeo'] = {}
          $scope.firstStep.codDepartment = '';
          $scope.firstStep.codProvince = '';
          $scope.firstStep.codDistrict = '';
          _setUbigeo();
        }

        function _setUbigeo() {
          $scope.firstStep.ubigeo && _.keys($scope.firstStep.ubigeo).length > 1
            ? $scope.firstStep.setter($scope.firstStep.ubigeo.codDepartment, $scope.firstStep.ubigeo.codProvince, $scope.firstStep.ubigeo.codDistrict)
            : $scope.firstStep.setter($scope.firstStep.codDepartment, $scope.firstStep.codProvince, $scope.firstStep.codDistrict);
        }
      }
    ]);
  }
);
