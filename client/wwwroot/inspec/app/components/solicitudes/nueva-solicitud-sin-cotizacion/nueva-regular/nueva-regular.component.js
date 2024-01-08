'use strict';

define(['angular', 'moment', 'constants', 'lodash', 'mpfPersonConstants', 'mpfPersonComponent'], function (
  ng,
  moment,
  constants,
  _,
  personConstants
) {
  solicitudNuevaSinCotizacionRegular.$inject = [
    '$log',
    '$scope',
    '$state',
    'inspecFactory',
    'UserService',
    '$timeout',
    'mModalAlert',
    'ErrorHandlerService',
    '$uibModal',
    'mModalConfirm',
    '$anchorScroll',
    'proxyGeneral',
    'mainServices',
    'oimAbstractFactory',
    'oimClaims',
    'oimPrincipal',
    '$stateParams',
    'gaService',
    '$window'
  ];

  function solicitudNuevaSinCotizacionRegular(
    $log,
    $scope,
    $state,
    inspecFactory,
    UserService,
    $timeout,
    mModalAlert,
    ErrorHandlerService,
    $uibModal,
    mModalConfirm,
    $anchorScroll,
    proxyGeneral,
    mainServices,
    oimAbstractFactory,
    oimClaims,
    oimPrincipal,
    $stateParams,
    gaService,
    $window
  ) {
    var vm = this;
    vm.$onInit = onInit();
    vm.goToNextStep = goToNextStep;
    vm.searchMarcaModelo = searchMarcaModelo;
    vm.getFuctionsProducto = getFuctionsProducto;
    vm.getFunctionsModeloMarca = getFunctionsModeloMarca;
    vm.getFunctionsSubModelo = getFunctionsSubModelo;
    vm.getFuctionsYearFabric = getFuctionsYearFabric;
    vm.calculatePremium = calculatePremium;
    vm.createRequest = createRequest;
    vm.queryAgents = queryAgents;
    vm.steping = steping;
    vm.suggestedValueValidate = suggestedValueValidate;
    vm.loadMarca = loadMarca;
    vm.tieneVigencia = tieneVigencia;
    vm.validateVigencia = validateVigencia;
    vm.getDocumentData = getDocumentData;

    console.log(vm.dataVerify);

    if(vm.dataVerify){
      vm.dataVerify.isInTotalLose = false;
    }
    
    function onInit() {
      vm.username = UserService.username;
      vm.user = UserService;
      vm.creationDate = moment(new Date()).format('DD/MM/YYYY');
      vm.agentRequest = {
        nombre: UserService.agentInfo.codigoAgente + ' >>> ' + UserService.agentInfo.codigoNombre,
        id: UserService.agentInfo.codigoAgente,
      };
      vm.autosArray = constants.module.polizas.autos.productos0Km;
      vm.companyCode = constants.module.polizas.autos.companyCode;
      vm.appCode = personConstants.aplications.INSPECCIONES;
      vm.formCodeCN = personConstants.forms.SOL_INSPEC_CN;
      vm.lastStepEnded = 1;

      vm.dataFromRehabilitate = $stateParams.data ? _.assign({}, $stateParams.data) : null;
      vm.contractorFromRehabilitate = $stateParams.contractor ? _.assign({}, $stateParams.contractor) : null;

      vm.documentNumber = vm.contractorFromRehabilitate ? vm.contractorFromRehabilitate.documentNumber : '';
      vm.documentType = vm.contractorFromRehabilitate ? vm.contractorFromRehabilitate.documentTypeCode : '';

      $scope.$on('personForm', function (event, data) {
        if (data.contratante) {
          vm.formData.contratante = data.contratante;
          vm.formData.contractorData = inspecFactory.setInspectContractor(data.contratante);
        }
      });

      inspecFactory.vehicle.getTipoVehiculo().then(function (response) {
        if (response.OperationCode == constants.operationCode.success) {
          vm.tipoVehiculo = response.Data;
        }
      });

      stepHandler();
      queryRequestsTypes();
    }

    vm.$onDestroy = function () {
      vm.listener();
      vm.listenerPdf();
    };

    vm.updateAgent = updateAgent;
    function updateAgent() {
      vm.agentRequest = ng.copy(vm.agentRequest);
    }

    function getStatusAutoInspec() {
      vm.dataVerify = [];
      vm.dataCotizacion = {};

      var params = {
        vehicleAmount: vm.formData.vehicleValue,
        vehicleAccesoriesType: vm.formData.vehicleAccesoriesAmount >= 1 ? true : false,
        accesoriesCount: vm.formData.vehicleAccesoriesAmount,
        isNewVehicle: false,
        licensePlate: vm.formData.mPlaca,
        agentId: vm.agentRequest.id,
        SystemId: 1,
        productId: vm.formData.mProducto.CodigoProducto,
        profileId: oimPrincipal.get_role('INSPEC'),
        managerId: parseInt(oimClaims.gestorId),
        documentNumberContractor: vm.formData.contractorData.mNroDocumento.toString(),
        documentTypeContractor: vm.formData.contractorData.mTipoDocumento.Codigo,
      };

      inspecFactory.requests
        .verifyVehicleRules(params)
        .then(function (res) {
          vm.dataVerify = res.data;
          vm.dataCotizacion.statusAutoInspec = vm.dataVerify ? vm.dataVerify.isValidAutoInspec : false;
          vm.dataCotizacion.licenseExist = vm.dataCotizacion.statusAutoInspec;

          if (!vm.dataCotizacion.statusAutoInspec) {
            vm.dataVerify = {
              isValidAutoInspec: false,
            };
            fnIsInTotalLose(vm.formData.mPlaca);
          }
        })
        .catch(function (err) {
          console.error(err);
        });
    }

    function getInsurers() {
      inspecFactory.requests.getInsurer()
        .then(function(response) {
          vm.insurersList = response;
        })
        .catch(function(error) {
          console.error(error)
        })
    }

    function fnIsInTotalLose(license) {
      var params = {
        search: license,
        type: 'LicensePlate',
        pageNum: 1,
        pageSize: 10,
        sortingType: 1,
        history: true,
      };
      var pms = inspecFactory.management.getItemListTotalLost(params);
      pms
        .then(function (response) {
          if (response.operationCode == 200) {
            var totalItems = response.data.totalRow;
            if (totalItems > 0) vm.dataVerify.isInTotalLose = true;
            else vm.dataVerify.isInTotalLose = false;
          } else vm.dataVerify.isInTotalLose = false;
        })
        .catch(function (err) {
          ErrorHandlerService.handleError(err);
          vm.dataVerify.isInTotalLose = false;
        });
    }

    function alertsNotify() {
      var pms = inspecFactory.requests.alertsNotify(vm.paramsNotify);
      pms
        .then(function (response) {
          return response.data;
        })
        .catch(function (err) {
          ErrorHandlerService.handleError(err);
        });
    }

    function getDocumentData(data) {
      vm.documentNumber = data.CodigoDocumento;
      vm.documentType = data.TipoDocumento;
    }

    function queryRequestsTypes() {
      inspecFactory.common.getRequestType().then(function (response) {
        vm.requestType = _.find(response, function (element) {
          return element.parameterId === 1;
        });
      });
    }

    function stepHandler() {
      $scope.$on('$stateChangeSuccess', function (scope, state, params) {
        vm.currentStep = +params.step;
        var validStep = vm.currentStep > vm.lastStepEnded ? -1 : vm.currentStep;

        if (validStep) {
          setAnchor(params.anchor);
        }

        switch (validStep) {
          case 1:
            $log.log('Load step 1 data');
            if (vm.dataFromRehabilitate) {
              vm.formData.mTipoVehiculo = {
                CodigoTipo: vm.dataFromRehabilitate.vehicleTypeId,
                NombreTipo: vm.dataFromRehabilitate.vehicleType
              };
              vm.formData.ModeloMarca = {
                codigoMarca: vm.dataFromRehabilitate.vehicleBrandId,
                codigoModelo: vm.dataFromRehabilitate.vehicleModelId,
                marcaModelo: vm.dataFromRehabilitate.vehicleBrand + " " + vm.dataFromRehabilitate.vehicleModel,
                nombreMarca: vm.dataFromRehabilitate.vehicleBrand,
                nombreModelo: vm.dataFromRehabilitate.vehicleModel
              };
              vm.getFunctionsModeloMarca(vm.formData.ModeloMarca);
              vm.formData.mPlaca = vm.dataFromRehabilitate.vehicleLicensePlate;
              vm.formData.vehicleAccesoriesAmount = vm.dataFromRehabilitate.vehicleAccesoriesAmount.toString()
            }
            break;
          case 2:
            $log.log('Load step 2 data');
            evalAgentViewDcto();
            break;
          case 3:
            loadProductByUser();
            calculateDiscount();
            queryEndoserTypes();
            vm.formData.mMapfreDolar = vm.formData.mMapfreDolar ? vm.formData.mMapfreDolar : 0;
            vm.formData.discountCommission = vm.formData.discountCommission ? vm.formData.discountCommission : 0;
            vm.formData.endosatario = vm.formData.endosatario ? vm.formData.endosatario : 0;
            vm.searchRucEndoser = searchRucEndoser;
            vm.formData.PorDctoIntgPlaza = vm.formData.PorDctoIntgPlaza ? vm.formData.PorDctoIntgPlaza : 0;
            $log.log('Load step 3 data');
            break;
          case 4:
            getStatusAutoInspec();
            getInsurers();
            vm.formData.hasOtherInsurer = vm.formData.hasOtherInsurer || 0;
            $log.log('Load step 4 data');
            break;
          default:
            $state.go('solicitudNuevaSinCotizacionRegular.steps', {step: 1, anchor: 'anchor-1'});
        }
      });
    }

    function evalAgentViewDcto() {
      inspecFactory.common
        .getViewDctoByAgent(vm.agentRequest.id)
        .then(function (response) {
          vm.formData.viewDcto = response.Data;
        })
        .catch(function (e) {
          ErrorHandlerService.handleError(e);
        });
    }
    function setAnchor(anchor) {
      ng.element(document).ready(function () {
        $anchorScroll(anchor);
      });
    }

    function queryFinancingTypes() {
      return inspecFactory.common.getListFinanciamiento(vm.formData.mProducto.TipoProducto).then(function (response) {
        vm.financingTypes = response;
        if (vm.contractorFromRehabilitate) {
          vm.formData.financeType = _.find(vm.financingTypes.Data, { 'Codigo': vm.contractorFromRehabilitate.financeTypeId.toString() })
        }
      });
    }

    function queryEndoserTypes() {
      inspecFactory.common.getListEndosatario().then(function (response) {
        vm.endorserTypes = response;
      });
    }

    function queryAgents(inputValue) {
      return inspecFactory.common.getAgents(inputValue).then(function (response) {
        return response.Data.map(function (element) {
          return {
            nombre: element.CodigoNombre,
            id: element.CodigoAgente,
          };
        });
      });
    }

    function searchRucEndoser() {
      inspecFactory.common.getEndosatario(vm.formData.rucEndosatario).then(function (response) {
        vm.formData.rucEndosatarioObjeto = response.Data;
      });
    }

    function searchMarcaModelo(input) {
      if (input && input.length >= 3) {
        var params = {
          Texto: input.toUpperCase(),
          CodigoTipo: vm.formData.mTipoVehiculo.CodigoTipo,
        };
        return inspecFactory.vehicle.getListMarcaModelo(params);
      }
    }

    function getFunctionsModeloMarca(value) {
      if (value && value.codigoMarca === null) {
        vm.formData.ModeloMarca = null;
        vm.formData.mSubModelo = null;
        vm.formData.mYearFabric = null;
      } else {
        vm.formData.mSubModelo = null;
        vm.formData.mYearFabric = null;
        if (value) {
          loadSubModelo(vm.formData.mTipoVehiculo.CodigoTipo, value.codigoMarca, value.codigoModelo);
        }
      }
    }

    function loadSubModelo(codTipoVehiculo, codigoMarca, codigoModelo) {
      inspecFactory.vehicle.getListSubModelo(codTipoVehiculo, codigoMarca, codigoModelo).then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          vm.submodels = response.Data;
          vm.noSubmodels = false;
          if (vm.submodels.length === 0) {
            vm.noSubmodels = true;
            mModalAlert.showError('El vehiculo ingresado no esta configurado para cotizar', 'Error');
          } else {
            vm.formData.mSubModelo = vm.submodels[0];
            getFunctionsSubModelo(vm.submodels[0]);
          }
        } else if (response.Message.length > 0) {
          vm.noSubmodels = true;
        }
      });
    }

    function getFunctionsSubModelo(value) {
      if (!ng.isUndefined(value)) {
        if (value.Codigo === null) {
          vm.formData.mYearFabric = null;
          vm.formData.yearSelected = false;
        } else {
          vm.formData.mYearFabric = null;
          vm.formData.yearSelected = false;
          vm.formData.usoSelected = false;

          vm.formData.subModeloSelected = true;

          vm.formData.NombreTipo = value.NombreTipo;
          vm.formData.Tipo = value.Tipo;

          loadYearFabric(
            vm.formData.ModeloMarca.codigoMarca,
            vm.formData.ModeloMarca.codigoModelo,
            vm.formData.mSubModelo.Codigo
          );
        }
      }
    }

    function loadYearFabric(codigoMarca, codigoModelo, codigoSubModelo) {
      inspecFactory.vehicle.getListAnoFabricacion(codigoMarca, codigoModelo, codigoSubModelo).then(function (response) {
        if (response.OperationCode == constants.operationCode.success) {
          vm.years = response.Data;
          vm.noYear = false;
          if (vm.years.length == 0) {
            vm.noYear = true;
          }
          if (vm.dataFromRehabilitate) {
            vm.formData.mYearFabric = {
              Codigo: vm.dataFromRehabilitate.vehicleYear,
              Descripcion: vm.dataFromRehabilitate.vehicleYear
            };
            vm.getFuctionsYearFabric(vm.formData.mYearFabric);
          }
        } else if (response.Message.length > 0) {
          vm.noYear = true;
        }
      });
    }

    function getFuctionsYearFabric(value) {
      if (value != null || !ng.isUndefined(value)) {
        if (value.Codigo == null) {
          vm.formData.yearSelected = false;
        } else {
          vm.formData.yearSelected = true;
          if (vm.formData.mSubModelo && vm.formData.mSubModelo.Codigo) {
            loadValorSugerido(
              vm.formData.ModeloMarca.codigoMarca,
              vm.formData.ModeloMarca.codigoModelo,
              vm.formData.mSubModelo.Codigo,
              vm.formData.mTipoVehiculo.CodigoTipo,
              vm.formData.mYearFabric.Codigo
            );
          }
        }
      } else {
        vm.formData.yearSelected = false;
      }
    }

    function loadValorSugerido(codigoMarca, codigoModelo, SubModeloCodigo, mTipoVehiculo , Anio) {
      inspecFactory.vehicle.getValorSugerido(codigoMarca, codigoModelo, SubModeloCodigo , mTipoVehiculo, Anio).then(
        function (response) {
          if (response.OperationCode == constants.operationCode.success) {
            vm.formData.vehicleValue = response.Data.Valor;
            vm.vehicleValueMin = response.Data.Minimo;
            vm.vehicleValueMax = response.Data.Maximo;
          }
        },
        function (error) {
          $log.log('Error en loadValorSugerido: ' + error);
        }
      );
    }

    function loadProductByUser() {
      var vParams = {
        CodigoAplicacion: constants.module.polizas.description,
        Filtro: constants.module.polizas.autos.description,
        CodigoRamo: constants.module.polizas.autos.codeRamo,
        CodigoTipoVehiculo: vm.formData.Tipo,
      };

      inspecFactory.vehicle.getListProductoPorVehiculo(vParams).then(
        function (response) {
          if (response.OperationCode == constants.operationCode.success) {
            vm.products = response.Data.filter(function (product) {
              return product.TipoProducto !== 'RC';
            });
            $log.log(vm.products);
            vm.noProducts = false;
            if (vm.contractorFromRehabilitate) {
              vm.formData.mProducto = _.find(vm.products, { 'CodigoProducto': vm.contractorFromRehabilitate.productId })
              vm.getFuctionsProducto(vm.formData.mProducto)
            }
          } else if (response.Message.length > 0) {
            vm.noProducts = true;
          }
        },
        function (error) {
          $log.log('Error en getProducts: ' + error);
        }
      );

      if (ng.isDefined(vm.formData.mProducto)) {
        loadUso(vm.formData.mProducto.CodigoModalidad, vm.formData.mSubModelo.Tipo);
      }
    }
    function es0Km(val) {
      var producto0Km = false;
      for (var i = 0; i < vm.autosArray.length; i++) {
        if (vm.autosArray[i] == val) {
          producto0Km = true;
          break;
        }
      }
      return producto0Km;
    }

    function _setProduct() {
      vm.formData.mProducto = {
        CodigoProducto: null,
      };
    }

    function getFuctionsProducto(value) {
      if (value.CodigoProducto === null) {
        vm.formData.mUsoRiesgo = null;
      } else {
        if (es0Km(value.CodigoProducto)) {
          mModalAlert
            .showWarning(
              'El producto Auto 0Km y Auto 0Km X2 son exclusivamente para automoviles nuevos',
              'Seleccione otro producto'
            )
            .then(
              function (response) {
                if (response) {
                  _setProduct();
                }
              },
              function (error) {
                $timeout(function () {
                  _setProduct();
                }, 0);
                $log.log(error);
              },
              function (defaultError) {
                $log.log(defaultError);
              }
            );
        }
        vm.formData.mProducto.CodigoModalidad = value.CodigoModalidad;
        tieneVigencia(vm.formData.mProducto);
        loadUso(vm.formData.mProducto.CodigoModalidad, vm.formData.mSubModelo.Tipo, true);
        queryFinancingTypes();
      }
    }

    function loadUso(CodigoModalidad, TipoSubModelo, forceUpdate) {
      if (vm.formData.mProducto.CodigoProducto == 5 || vm.formData.mProducto.CodigoProducto == 20) {
        vm.formData.mUsoRiesgo = {};
        vm.riskUsages = {};
      } else {
        if (CodigoModalidad != null && TipoSubModelo != null) {
          vm.formData.mTipoUso = forceUpdate ? null : vm.formData.mTipoUso;
          inspecFactory.vehicle.getListTipoUso(CodigoModalidad, TipoSubModelo).then(
            function (response) {
              if (response.OperationCode == constants.operationCode.success) {
                vm.riskUsages = response.Data;
                vm.noRiskUsages = false;
                if (vm.riskUsages.length == 0) {
                  vm.noRiskUsages = true;
                }
              } else if (response.Message.length > 0) {
                vm.noRiskUsages = true;
              }
            },
            function (error) {
              $log.log('Error en getYearFabric: ' + error);
            }
          );
        }
      }
    }

    function suggestedValueValidate(value) {
      vm.suggestedValueError = false;
      if (ng.isUndefined(typeof value) || value < vm.vehicleValueMin || value > vm.vehicleValueMax) {
        vm.suggestedValueError = true;
      } else {
        vm.toggleValue = true;
        calculatePremium();
      }
    }

    function calculatePremium() {
      if (!vm.formData.mTipoUso) {
        return false;
      }

      var params = {
        PorDctoIntgPlaza: vm.formData.PorDctoIntgPlaza || 0,
        MarcaPorDctoIntegralidad: vm.formData.DctoIntegralidad ? 'S' : 'N',
        AutoConInspeccion: 'S',
        numeroCotizacion: '',
        CodigoCorredor: vm.agentRequest.id,
        TotalDsctoComision: 0,
        DsctoComision: 0,
        Vehiculo: {
          CodigoMarca: vm.formData.ModeloMarca.codigoMarca,
          CodigoModelo: vm.formData.ModeloMarca.codigoModelo,
          CodigoSubModelo: vm.formData.mSubModelo.Codigo,
          CodigoUso: vm.formData.mTipoUso.Codigo,
          CodigoProducto: +vm.formData.mProducto.CodigoProducto,
          CodigoTipo: vm.formData.Tipo,
          DsctoComercial: 0,
          AnioFabricacion: +vm.formData.mYearFabric.Descripcion,
          SumaAsegurada: vm.formData.vehicleValue,
          TipoVolante: constants.module.polizas.autos.tipoVolante,
          MCAGPS: constants.module.polizas.autos.MCAGPS,
          MCANUEVO: 'N',
          PolizaGrupo: '',
          ProductoVehiculo: {
            CodigoModalidad: vm.formData.mProducto.CodigoModalidad,
            CodigoCompania: constants.module.polizas.autos.companyCode,
            CodigoRamo: constants.module.polizas.autos.codeRamo,
          },
        },
        Contratante: {
          MCAMapfreDolar: vm.formData.saldoMapfreDolares > 0 ? 'S' : 'N',
          ImporteMapfreDolar: parseFloat(vm.formData.contractorData.saldoMapfreDolares).toFixed(2),
        },
        Ubigeo: {
          CodigoProvincia: vm.formData.contractorData.mProvincia.Codigo,
          CodigoDistrito: vm.formData.contractorData.mDistrito.Codigo,
        },
      };

      vm.dataCalculatePremium = {
        commercialPremium: 0.0,
        netPremium: 0.0,
        discountCommission: 0.0,
        emissionValue: 0.0,
        igv: 0.0,
        mapfreDollar: 0.0,
        total: 0.0,
      };

      inspecFactory.common.getCalculatePremium(params, true).then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          vm.dataCalculatePremium.netPremium = response.Data.Vehiculo.PrimaVehicular;
          vm.dataCalculatePremium.netPremiumReal = response.Data.Vehiculo.PrimaVehicularReal;
          vm.dataCalculatePremium.emissionValuePercent = response.Data.PorDerechoEmision / 100;
          calculateDiscount();
          updatePremium();
        } else {
          mModalAlert.showWarning(response.Message, 'Error BD');
          vm.formData.$valid = false;
        }
      });
    }

    function calculateDiscount() {
      if (!vm.formData.mProducto) {
        return false;
      }
      var params = {
        CodigoAgente: +vm.agentRequest.id,
        CodigoCia: constants.module.polizas.autos.companyCode,
        CodigoMoneda: constants.currencyType.dollar.code, // "2", //DOLLAR CONSTANTE
        CodigosProductos: [+vm.formData.mProducto.CodigoProducto],
        Vehiculo: {
          CodigoTipoVehiculo: +vm.formData.mSubModelo.Tipo,
          CodigoUso: vm.formData.mTipoUso.Codigo,
        },
      };
      inspecFactory.common.getCalculateDiscount(params, true).then(function (response) {
        vm.discountCommissionData = [];
        var vDiscountCommissionData = {
          AgenteComision: null,
          DsctoEspecial: 0,
          DsctoEspecialPorcentaje: '-',
          ValorDsctoEsp: 0,
        };
        if (response.Data && response.Data.Dsctos[0].Items.length) {
          ng.forEach(response.Data.Dsctos[0].Items, function (value) {
            vDiscountCommissionData = {
              AgenteComision: value.AgenteComision,
              DsctoEspecial: value.DsctoEspecial,
              DsctoEspecialPorcentaje: Math.abs(value.DsctoEspecial) + '%',
              ValorDsctoEsp: value.ValorDsctoEsp,
            };
            vm.discountCommissionData.push(vDiscountCommissionData);
          });
        } else {
          vm.discountCommissionData.push(vDiscountCommissionData);
        }
        calculateDiscountCommission();
      });
    }

    function calculateDiscountCommission() {
      if (
        angular.isUndefined(vm.formData.mDescuentoComision) ||
        vm.formData.mDescuentoComision.AgenteComision === null
      ) {
        vm.formData.discountCommission = 0.0;
      } else {
        var discountCommissionPercent = Math.abs(vm.formData.mDescuentoComision.DsctoEspecial) / 100;
        vm.formData.discountCommission = roundTwoDecimals(
          vm.dataCalculatePremium.netPremium * discountCommissionPercent
        );
      }
      updatePremium();
    }

    function updatePremium() {
      var netPremium = vm.dataCalculatePremium.netPremium - vm.formData.discountCommission - vm.formData.mMapfreDolar;
      vm.formData.emissionValue = roundTwoDecimals(netPremium * vm.dataCalculatePremium.emissionValuePercent);
      vm.formData.comercialPremium = roundTwoDecimals(vm.dataCalculatePremium.netPremium);
      vm.formData.igv = roundTwoDecimals((netPremium + vm.dataCalculatePremium.emissionValue) * 0.18);
      vm.formData.total = roundTwoDecimals(netPremium + vm.formData.emissionValue + vm.formData.igv);
    }

    function roundTwoDecimals(num) {
      return +(Math.round(num + 'e+2') + 'e-2');
    }

    function createRequest() {
      calificateAutoinspection(false);
    }

    function getReadableAddress() {
      return (
        vm.formData.contractorData.mSelectVia.Descripcion +
        ' ' +
        vm.formData.contractorData.mVia +
        ' ' +
        vm.formData.contractorData.mSelectNumero.Descripcion +
        ' ' +
        vm.formData.contractorData.mNumero
      );
    }

    function calificateAutoinspection(value) {
      if (vm.dataCotizacion.statusAutoInspec) {
        value = true;
      }
      var params = {
        systemCode: oimAbstractFactory.getOrigin(),
        RequestTypeCode: vm.requestType.parameterId.toString(), // Normal 1 Flota 2
        RequestStatusCode: '1',
        AgentRequestId: +vm.agentRequest.id,
        InspectionTypeCode: vm.formData.applicantData.mInspectionType.parameterId,
        ConfirmationEmail: vm.formData.applicantData.mConfirmationEmail,
        CopyEmail: vm.formData.applicantData.mCopyEmail ? vm.formData.applicantData.mCopyEmail : null,
        IsAnotherInsurer: vm.formData.hasOtherInsurer == 1,
        InsurerId: vm.formData.nInsurerName ? vm.formData.nInsurerName.cod : null,
        Contractor: {
          LicensePlate: vm.formData.mPlaca.toUpperCase(),
          AccesoriesAmount: 0,
          AccesoriesType: null,
          DocumentTypeCode: vm.formData.contractorData.mTipoDocumento.Codigo,
          DocumentType: vm.formData.contractorData.mTipoDocumento.Descripcion,
          DocumentNumber: vm.formData.contractorData.mNroDocumento.toString(),
          Name: vm.formData.contractorData.mNomContratante || vm.formData.contractorData.mRazonSocial,
          LastName: vm.formData.contractorData.mApePatContratante,
          MotherLastName: vm.formData.contractorData.mApeMatContratante,
          BirthDate: vm.formData.contractorData.mFechaNacimiento
            ? moment(vm.formData.contractorData.mFechaNacimiento).format('DD/MM/YYYY')
            : null,
          Sex: vm.formData.contractorData.mSexo,
          SexId: vm.formData.contractorData.mSexoId,
          CivilStateId: +vm.formData.contractorData.mEstadoCivil.CodigoEstadoCivil,
          CivilState: vm.formData.contractorData.mEstadoCivil.NombreEstadoCivil,
          ProductId: vm.formData.mProducto.CodigoProducto,
          Product: vm.formData.mProducto.NombreProducto,
          ProfessionId: +vm.formData.contractorData.mProfesion.Codigo,
          Profession: vm.formData.contractorData.mProfesion.Descripcion,
          NationalityCode: vm.formData.contractorData.mNacionalidad.Codigo,
          Nationality: vm.formData.contractorData.mNacionalidad.Descripcion,
          DepartmentId: +vm.formData.contractorData.mDepartamento.Codigo,
          Department: vm.formData.contractorData.mDepartamento.Descripcion,
          ProvinceId: +vm.formData.contractorData.mProvincia.Codigo,
          Province: vm.formData.contractorData.mProvincia.Descripcion,
          DistrictId: +vm.formData.contractorData.mDistrito.Codigo,
          District: vm.formData.contractorData.mDistrito.Descripcion,
          RoadTypeId: +vm.formData.contractorData.mSelectVia.Codigo,
          RoadType: vm.formData.contractorData.mSelectVia.Descripcion,
          RoadDescription: vm.formData.contractorData.mVia,
          NumberTypeId: +vm.formData.contractorData.mSelectNumero.Codigo,
          NumberType: vm.formData.contractorData.mSelectNumero.Descripcion,
          NumberDescription: vm.formData.contractorData.mNumero,
          InsideTypeId: +vm.formData.contractorData.mSelectInterior.Codigo,
          InsideType: vm.formData.contractorData.mSelectInterior.Descripcion,
          InsideDescription: vm.formData.contractorData.mInterior,
          ZoneTypeId: +vm.formData.contractorData.mSelectZona.Codigo,
          ZoneType: vm.formData.contractorData.mSelectZona.Descripcion,
          ZoneDescription: vm.formData.contractorData.mZona,
          AddressReference: vm.formData.contractorData.mReferencias,
          FinanceTypeId: +vm.formData.financeType.Codigo,
          FinanceType: vm.formData.financeType.Descripcion,
          EndorserId: null,
          EndorserName: null,
          MapfreDollar: vm.formData.mMapfreDolar,
        },
        Items: [
          {
            ContactName:
              constants.documentTypes.ruc.Codigo === vm.formData.contractorData.mTipoDocumento.Codigo
                ? vm.formData.contractorData.mContactName
                : vm.formData.contractorData.mNomContratante,
            ContactLastName: vm.formData.contractorData.mApePatContratante,
            ContactPhone: vm.formData.contractorData.mTelfPersonal,
            ContactOfficePhone: vm.formData.contractorData.mTelfOficina,
            ContactCelphone: vm.formData.contractorData.mCelular,
            ContactEmail: vm.formData.contractorData.mEmailPersonal,
            ContactOfficeEmail: vm.formData.contractorData.mEmailOficina,
            VehicleBrand: vm.formData.ModeloMarca.nombreMarca,
            VehicleBrandId: +vm.formData.ModeloMarca.codigoMarca,
            VehicleModel: vm.formData.ModeloMarca.nombreModelo,
            VehicleModelId: +vm.formData.ModeloMarca.codigoModelo,
            VehicleSubModel: vm.formData.mSubModelo.Descripcion,
            VehicleSubModelId: +vm.formData.mSubModelo.Codigo,
            VehicleYear: +vm.formData.mYearFabric.Descripcion,
            VehicleLicensePlate: vm.formData.mPlaca.toUpperCase(),
            DepartmentId: +vm.formData.contractorData.mDepartamento.Codigo,
            Department: vm.formData.contractorData.mDepartamento.Descripcion,
            ProvinceId: +vm.formData.contractorData.mProvincia.Codigo,
            Province: vm.formData.contractorData.mProvincia.Descripcion,
            DistrictId: +vm.formData.contractorData.mDistrito.Codigo,
            VehicleAccesoriesAmount: +vm.formData.vehicleAccesoriesAmount,
            VehicleAccesoriesType: vm.formData.accesoriesEspecials && !vm.formData.accesoriesOthers,
            VehicleTypeId: +vm.formData.Tipo,
            VehicleType: vm.formData.NombreTipo,
            VehicleVersion: vm.formData.mVersion ? vm.formData.mVersion.toUpperCase() : '',
          },
        ],
      };
      vm.paramsNotify = {
        TypeNotification: 1,
        Email: vm.formData.contractorData.mEmailPersonal,
        LicensePlate: vm.formData.mPlaca.toUpperCase(),
        Name: vm.formData.contractorData.mNomContratante || vm.formData.contractorData.mRazonSocial,
      };

      if (vm.formData.hasOtherInsurer == 1) {
        if (!vm.formData.nInsurerName.cod || !vm.formData.insurerPdf) {
          return mModalAlert.showWarning("Debes completar los datos de la otra aseguradora", 'Error');
        }
        params.isAutoInspection = true;
        params.isInTotalLose = vm.dataVerify.isInTotalLose;
        var request = {
          vehiclePlateNumber: vm.formData.mPlaca.toUpperCase(),
          documentType: vm.formData.contractorData.mTipoDocumento.Codigo,
          documentNumber: vm.formData.contractorData.mNroDocumento.toString(),
          email: vm.formData.contractorData.mEmailPersonal,
          departmentCode: +vm.formData.contractorData.mDepartamento.Codigo,
          provinceCode: +vm.formData.contractorData.mProvincia.Codigo,
          districtCode: +vm.formData.contractorData.mDistrito.Codigo,
          address: getReadableAddress(),
          phoneNumber: vm.formData.contractorData.mTelfPersonal,
          originInterface: 'INSPEC',
          userConsumer: vm.username,
        };
        return inspecFactory.requests
          .addRequest(params, true)
          .then(function (response) {
            vm.dataVerify.isInTotalLose && alertsNotify();
            $log.log('response', response);
            inspecFactory.requests.uploadPdfFromAnotherInsurer({
              RiskId: response.riskid,
              RequestId: response.requestid,
              FileName: vm.formData.fileName,
              FileBase64: vm.base64Pdf
            })
              .then(function(res) {
                mModalAlert
                  .showSuccess(
                    'Mensaje enviado, podrá ver el proceso de la autoinspección por la Bandeja de Solicitudes',
                    'Registrar autoinspección'
                  )
                  .then(function () {
                    request.inspectionRiskNumber = response.riskid;
                    inspecFactory.requests
                      .registerSelfInspections(request, true)
                      .then(function (response) {
                        if (response.code === 'S00') {
                          $state.go('solicitudes');
                        } else {
                          ErrorHandlerService.handleError(response.message);
                        }
                      })
                      .catch(function (e) {
                        ErrorHandlerService.handleError(e);
                      });
                  });
              })
              .catch(function(error) {
                console.error(error);
              })
          })
          .catch(function (e) {
            ErrorHandlerService.handleError(e);
          });
      }

      if (value && vm.dataCotizacion.licenseExist) {
        $uibModal
          .open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'lg',
            templateUrl: '/inspec/app/components/solicitudes/nueva-solicitud-individual/modal-autoinspeccion.html',
            controllerAs: '$ctrl',
            controller: [
              '$location',
              '$uibModalInstance',
              function ($location, $uibModalInstance) {
                var vm = this;
                vm.closeModal = closeModal;
                vm.confirm = confirm;
                vm.autoInspec = false;

                function closeModal() {
                  $uibModalInstance.close();
                }

                function confirm() {
                  $uibModalInstance.close(vm.autoInspec);
                }
              },
            ],
          })
          .result.then(function (autoInspec) {
            if (!ng.isUndefined(autoInspec)) {
              if (autoInspec) {
                // AUTOINSPECCIÓN
                gaService.add({ gaCategory: 'Solicitud - INSPECCION', gaAction: 'Sin Cotización - AUTOINSPECCIÓN', gaLabel: 'Modo: AUTOINSPECCIÓN'});                
                gaService.add({ gaCategory: 'Solicitud - INSPECCION', gaAction: 'Sin Cotización - Confirmar Solicitud - Confirmar', gaLabel: 'Botón: Confirmar'});
                params.isAutoInspection = true;
                params.isInTotalLose = vm.dataVerify.isInTotalLose;
                var request = {
                  vehiclePlateNumber: vm.formData.mPlaca.toUpperCase(),
                  documentType: vm.formData.contractorData.mTipoDocumento.Codigo,
                  documentNumber: vm.formData.contractorData.mNroDocumento.toString(),
                  email: vm.formData.contractorData.mEmailPersonal,
                  departmentCode: +vm.formData.contractorData.mDepartamento.Codigo,
                  provinceCode: +vm.formData.contractorData.mProvincia.Codigo,
                  districtCode: +vm.formData.contractorData.mDistrito.Codigo,
                  address: getReadableAddress(),
                  phoneNumber: vm.formData.contractorData.mTelfPersonal,
                  originInterface: 'INSPEC',
                  userConsumer: vm.username,
                };
                inspecFactory.requests
                  .addRequest(params, true)
                  .then(function (response) {
                    vm.dataVerify.isInTotalLose && alertsNotify();
                    $log.log('response', response);
                    mModalAlert
                      .showSuccess(
                        'Mensaje enviado, podrá ver el proceso de la autoinspección por la Bandeja de Solicitudes',
                        'Registrar autoinspección'
                      )
                      .then(function () {
                        request.inspectionRiskNumber = response.items[0].riskId;
                        inspecFactory.requests
                          .registerSelfInspections(request, true)
                          .then(function (response) {
                            if (response.code === 'S00') {
                              $state.go('solicitudes');
                            } else {
                              ErrorHandlerService.handleError(response.message);
                            }
                          })
                          .catch(function (e) {
                            ErrorHandlerService.handleError(e);
                          });
                      });
                  })
                  .catch(function (e) {
                    ErrorHandlerService.handleError(e);
                  });
              } else {
                // INSPECCIÓN REGULAR
                gaService.add({ gaCategory: 'Solicitud - INSPECCION', gaAction: 'Sin Cotización - INSPECCIÓN REGULAR', gaLabel: 'Modo: INSPECCIÓN REGULAR'}); 
                gaService.add({ gaCategory: 'Solicitud - INSPECCION', gaAction: 'Sin Cotización - Confirmar Solicitud - Confirmar', gaLabel: 'Botón: Confirmar'});
                inspecFactory.requests
                  .addRequest(params, true)
                  .then(function (response) {
                    vm.dataVerify.isInTotalLose && alertsNotify();
                    $log.log('response', response);
                    mModalAlert
                      .showSuccess('Solicitud registrada correctamente', 'Nueva Solicitud Creada')
                      .then(function () {
                        $state.go('solicitudes');
                      });
                  })
                  .catch(function (e) {
                    ErrorHandlerService.handleError(e);
                  });
              }
            }
          });
      } else {
        mModalConfirm
          .confirmInfo('¿Está seguro que desea crear la siguiente solicitud?', 'CREAR SOLICITUD', 'ACEPTAR')
          .then(function () {
            gaService.add({ gaCategory: 'Solicitud - INSPECCION', gaAction: 'Sin Cotización - Confirmar Solicitud - Aceptar', gaLabel: 'Botón: Aceptar de confirmación de solicitud', gaValue: 'Periodo Regular' });
            inspecFactory.requests
              .addRequest(params, true)
              .then(function (response) {
                vm.dataVerify.isInTotalLose && alertsNotify();
                $log.log('response', response);
                mModalAlert
                  .showSuccess('Solicitud registrada correctamente', 'Nueva Solicitud Creada')
                  .then(function () {
                    $state.go('solicitudes');
                  })
                  .catch(function (err) {
                    console.error(err);
                  });
              })
              .catch(function (e) {
                ErrorHandlerService.handleError(e);
              });
          });
      }
    }

    function goToNextStep() {
      vm.nextStep = +vm.currentStep + 1;
      vm.formData.markAsPristine();

      if (vm.formData.frmApplicant) {
        vm.formData.frmApplicant.markAsPristine();
      }

      if (+vm.currentStep === 2) {
        $scope.$broadcast('submitForm', true);
      }

      if (+vm.currentStep === 1) {
        var hasAccesories = vm.formData.vehicleAccesoriesAmount > 0 && vm.formData.vehicleAccesoriesAmount < 4;
        if (hasAccesories) {
          vm.formData.$valid = (vm.formData.$valid && vm.formData.accesoriesEspecials) || vm.formData.accesoriesOthers;
        }
      }

      vm.obtenerDctoIntegralidad = obtenerDctoIntegralidad;
      function obtenerDctoIntegralidad() {
        vm.formData.PorDctoIntgPlaza = 0;
        if (vm.formData.DctoIntegralidad) {
          if (vm.documentType && vm.documentNumber) {
            var pms = proxyGeneral.ObtenerDescuentoIntegralidad(
              constants.module.polizas.hogar.codeCia,
              vm.agentRequest.id,
              constants.module.polizas.hogar.codeRamo,
              vm.documentType,
              vm.documentNumber.toString(),
              true
            );
            pms
              .then(function (response) {
                if (response.OperationCode === constants.operationCode.success) {
                  vm.formData.PorDctoIntgPlaza = response.Data;
                }
              })
              .catch(function (error) {
                ErrorHandlerService.handleError(error);
              });
          } else {
            mModalAlert
              .showWarning('Debe ingresar un número de documento antes de aplicar integralidad', '')
              .then(function () {
                vm.formData.DctoIntegralidad = false;
              });
          }
        }
      }

      if (vm.formData.$valid && vm.formData.mSubModelo) {
        if (+vm.currentStep === 1) {
          inspecFactory.vehicle
            .validatePlate(vm.formData.mPlaca, true)
            .then(function () {
              vm.lastStepEnded = +vm.nextStep;
              $state.go('solicitudNuevaSinCotizacionRegular.steps', {step: vm.nextStep});
            })
            .catch(function () {
              ErrorHandlerService.handleWarning(
                'El número de placa ingresado ya se encuentra asociado a una póliza<br>¿Deseas continuar con la solicitud de todos modos?',
                'PLACA CON PÓLIZA EMITIDA',
                'Continuar'
              ).then(function () {
                vm.lastStepEnded = +vm.nextStep;
                $state.go('solicitudNuevaSinCotizacionRegular.steps', {step: vm.nextStep});
              });
            });
        } else if (+vm.currentStep === 3) {
          if (!vm.toggleValue) {
            ErrorHandlerService.handleWarningModal('Debe guardar el valor del auto', 'Advertencia');
          } else {
            vm.lastStepEnded = +vm.nextStep;
            $state.go('solicitudNuevaSinCotizacionRegular.steps', {step: vm.nextStep});
          }
        } else {
          vm.lastStepEnded = +vm.nextStep;
          $state.go('solicitudNuevaSinCotizacionRegular.steps', {step: vm.nextStep});
        }
      }
      $log.log('vm.formData', vm.formData);
    }

    function steping(stepToGo, anchor) {
      if (stepToGo < vm.currentStep) {
        $state
          .go('solicitudNuevaSinCotizacionRegular.steps', {step: stepToGo})
          .then(function() {
            setAnchor(anchor || 'anchor-1');
          });
      }
    }

    function loadMarca() {
      vm.formData.ModeloMarca = null;
      vm.formData.mSubModelo = null;
      vm.formData.mYearFabric = null;
      vm.formData.vehicleAmount = null;
    }

    function tieneVigencia(producto) {
      if (producto.McaVigencia === 'S') {
        vm.formData.mVigenciaMeses = producto.VigenciaMeses;
      }
      vm.formData.inicioVigencia = new Date();
    }

    function validateVigencia() {
      vm.limitDate = mainServices.date.fnAdd(new Date(), vm.formData.mVigenciaMeses, 'M');
    }

    function transformFileToBase64(file) {
      inspecFactory.common.getInputFileOnBase64(file)
        .then(function(base64) {
          vm.formData.fileName = file.name;
          vm.base64Pdf = base64;
        })
        .catch(function(error) {
          console.error(error);
        })
    }

    vm.listener = $scope.$watch('$ctrl.formData.inicioVigencia', function() {
      if (vm.formData.inicioVigencia && vm.formData.mProducto.McaVigencia === 'S') {
        vm.initDateV = angular.copy(vm.formData.inicioVigencia);
        vm.formData.finVigencia = mainServices.date.fnAdd(vm.initDateV, vm.formData.mVigenciaMeses, 'M');
        vm.limitDate = vm.formData.finVigencia;
      }
    });

    vm.listenerPdf = $scope.$watch(
      function() {
        return vm.formData.insurerPdf;
      },
      function(newValue) {
        if (newValue) {
          transformFileToBase64(newValue[0]);
        }
      }
    );
  }

  return ng
    .module('appInspec')
    .controller('SolicitudNuevaSinCotizacionRegularController', solicitudNuevaSinCotizacionRegular);
});
