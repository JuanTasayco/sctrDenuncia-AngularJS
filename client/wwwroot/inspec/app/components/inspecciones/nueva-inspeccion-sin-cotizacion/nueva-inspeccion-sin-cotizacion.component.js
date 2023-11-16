'use strict';

define(['angular', 'moment', 'constants', 'lodash', 'mpfPersonConstants', 'mpfPersonComponent'], function(ng, moment, constants, _) {
  nuevaInspeccionSinCotizacion.$inject = [
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
    '$stateParams',
    '$anchorScroll',
    'oimAbstractFactory'
  ];

  function nuevaInspeccionSinCotizacion(
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
    $stateParams,
    $anchorScroll,
    oimAbstractFactory
  ) {
    var vm = this;
    vm.$onInit = onInit;
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

    function onInit() {
      vm.username = UserService.username;
      vm.user = UserService;
      vm.withOutEmission = vm.user.isAPermittedObject('SINEMI');
      vm.creationDate = moment(new Date()).format('DD/MM/YYYY');
      vm.agentRequest = {
        nombre:
          ($stateParams.agent ? $stateParams.agent.CodigoNombre : null) ||
          UserService.agentInfo.codigoAgente + ' >>> ' + UserService.agentInfo.codigoNombre,
        id: ($stateParams.agent ? $stateParams.agent.CodigoAgente : null) || UserService.agentInfo.codigoAgente
      };
      vm.autosArray = constants.module.polizas.autos.productos0Km;
      vm.copyEmail = $stateParams.copyEmail;
      vm.confirmationEmail = $stateParams.confirmationEmail;
      vm.lastStepEnded = 1;

      vm.companyCode = constants.module.polizas.autos.companyCode;
      vm.appCode = personConstants.aplications.INSPECCIONES;
      vm.formCodeCN = personConstants.forms.SOL_INSPEC_CN;

      $scope.$on('personForm', function(event, data) {
        if (data.contratante) {
          vm.formData.contratante = data.contratante; 
          vm.formData.contractorData = inspecFactory.setInspectContractor(data.contratante)
        }
      });

      inspecFactory.vehicle.getTipoVehiculo().then(function(response){
        if (response.OperationCode == constants.operationCode.success){
          vm.tipoVehiculo = response.Data;
        }
      });

      setSteps();
      stepHandler();
      queryRequestsTypes();
    }

    function setSteps() {
      vm.steps = {
        stateName: '.steps',
        stateParameter: 'step'
      };

      vm.steps.steps = [
        {description: 'Información del solicitante y vehículo'},
        {description: 'Datos del contratante / contacto'}
      ];

      if (!vm.withOutEmission) {
        vm.steps.steps.push({description: 'Datos de la emisión'});
      }

      vm.steps.steps.push({description: 'Confirmar solicitud'});
    }

    function queryRequestsTypes() {
      inspecFactory.common.getRequestType().then(function(response) {
        vm.requestType = _.find(response, function(element) {
          return element.parameterId === 1;
        });
      });
    }

    function stepHandler() {
      $scope.$on('$stateChangeSuccess', function(scope, state, params) {
        vm.currentStep = +params.step;
        var validStep = vm.currentStep > vm.lastStepEnded ? -1 : vm.currentStep;
        if (validStep) {
          setAnchor(params.anchor);
        }
        switch (validStep) {
          case 1:
            $log.log('Load step 1 data');
            break;
          case 2:
            $log.log('Load step 2 data');
            break;
          case 3:
            if (!vm.withOutEmission) {
              loadProductByUser();
              calculateDiscount();
              queryEndoserTypes();
              vm.formData.mMapfreDolar = vm.formData.mMapfreDolar ? vm.formData.mMapfreDolar : 0;
              vm.formData.discountCommission = vm.formData.discountCommission ? vm.formData.discountCommission : 0;
              vm.formData.endosatario = vm.formData.endosatario ? vm.formData.endosatario : 0;
              vm.searchRucEndoser = searchRucEndoser;
              $log.log('Load step 3 data');
            }
            break;
          case 4:
            $log.log('Load step 4 data');
            break;
          default:
            $state.go('inspeccionNuevaSinCotizacion.steps', {step: 1, anchor: 'anchor-1'});
        }
      });
    }

    function setAnchor(anchor) {
      ng.element(document).ready(function() {
        $anchorScroll(anchor);
      });
    }

    function queryFinancingTypes() {
      return inspecFactory.common.getListFinanciamiento(vm.formData.mProducto.TipoProducto).then(function(response) {
        vm.financingTypes = response;
      });
    }

    function queryEndoserTypes() {
      inspecFactory.common.getListEndosatario().then(function(response) {
        vm.endorserTypes = response;
      });
    }

    function queryAgents(inputValue) {
      return inspecFactory.common.getAgents(inputValue).then(function(response) {
        return response.Data.map(function(element) {
          return {
            nombre: element.CodigoNombre,
            id: element.CodigoAgente
          };
        });
      });
    }

    function searchRucEndoser() {
      inspecFactory.common.getEndosatario(vm.formData.rucEndosatario).then(function(response) {
        vm.formData.rucEndosatarioObjeto = response.Data;
      });
    }

    function searchMarcaModelo(input) {
      if (input && input.length >= 3) {
        var params = {
          Texto: input.toUpperCase(),
          CodigoTipo: vm.formData.mTipoVehiculo.CodigoTipo
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
      inspecFactory.vehicle.getListSubModelo(codTipoVehiculo, codigoMarca, codigoModelo).then(function(response) {
        if (response.OperationCode === constants.operationCode.success) {
          vm.submodels = response.Data;
          vm.noSubmodels = false;
          if (vm.submodels.length === 0) {
            vm.noSubmodels = true;
            mModalAlert.showError("El vehiculo ingresado no esta configurado para cotizar", "Error");
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
      inspecFactory.vehicle.getListAnoFabricacion(codigoMarca, codigoModelo, codigoSubModelo).then(function(response) {
        if (response.OperationCode == constants.operationCode.success) {
          vm.years = response.Data;
          vm.noYear = false;
          if (vm.years.length == 0) {
            vm.noYear = true;
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

    function loadValorSugerido(codigoMarca, codigoModelo, SubModeloCodigo , tipoVehiculo, Anio) {
      inspecFactory.vehicle.getValorSugerido(codigoMarca, codigoModelo, SubModeloCodigo , tipoVehiculo, Anio).then(
        function(response) {
          if (response.OperationCode == constants.operationCode.success) {
            vm.formData.vehicleValue = response.Data.Valor;
            vm.vehicleValueMin = response.Data.Minimo;
            vm.vehicleValueMax = response.Data.Maximo;
          }
        },
        function(error) {
          $log.log('Error en loadValorSugerido: ' + error);
        }
      );
    }

    function loadProductByUser() {
      var vParams = {
        CodigoAplicacion: constants.module.polizas.description,
        Filtro: constants.module.polizas.autos.description,
        CodigoRamo: constants.module.polizas.autos.codeRamo,
        CodigoTipoVehiculo: vm.formData.Tipo
      };

      inspecFactory.vehicle.getListProductoPorVehiculo(vParams).then(
        function(response) {
          if (response.OperationCode == constants.operationCode.success) {
            vm.products = response.Data.filter(function(product) {
              return product.TipoProducto !== 'RC';
            });
            $log.log(vm.products);
            vm.noProducts = false;
          } else if (response.Message.length > 0) {
            vm.noProducts = true;
          }
        },
        function(error) {
          $log.log('Error en getProducts: ' + error);
        }
      );

      if (angular.isDefined(vm.formData.mProducto)) {
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
        CodigoProducto: null
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
              function(response) {
                if (response) {
                  _setProduct();
                }
              },
              function(error) {
                $timeout(function() {
                  _setProduct();
                }, 0);
                $log.log(error);
              },
              function(defaultError) {
                $log.log(defaultError);
              }
            );
        }
        vm.formData.mProducto.CodigoModalidad = value.CodigoModalidad;
        loadUso(vm.formData.mProducto.CodigoModalidad, vm.formData.mSubModelo.Tipo, true);
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
            function(response) {
              if (response.OperationCode == constants.operationCode.success) {
                vm.riskUsages = response.Data;
                //vm.usos = response.Data;
                vm.noRiskUsages = false;
                if (vm.riskUsages.length == 0) {
                  vm.noRiskUsages = true;
                }
              } else if (response.Message.length > 0) {
                vm.noRiskUsages = true;
              }
            },
            function(error) {
              $log.log('Error en getYearFabric: ' + error);
            }
          );
        }
      }
      queryFinancingTypes();
    }

    function suggestedValueValidate(value) {
      vm.suggestedValueError = false;
      if (
        ng.isUndefined(typeof value) ||
        value < vm.vehicleValueMin ||
        value > vm.vehicleValueMax
      ) {
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
        systemCode: oimAbstractFactory.getOrigin(),
        AutoConInspeccion: 'S', // S => EmisionAutoUsado
        numeroCotizacion: '', // Campo no requerido
        CodigoCorredor: vm.agentRequest.id, // 9808, //CodigoAgente
        TotalDsctoComision: 0, // Campo no requerido
        DsctoComision: 0, // Campo no requerido
        Vehiculo: {
          CodigoMarca: vm.formData.ModeloMarca.codigoMarca,
          CodigoModelo: vm.formData.ModeloMarca.codigoModelo,
          CodigoSubModelo: vm.formData.mSubModelo.Codigo,
          CodigoUso: vm.formData.mTipoUso.Codigo,
          CodigoProducto: +vm.formData.mProducto.CodigoProducto, // NUEVO CAMPO
          CodigoTipo: vm.formData.mTipoVehiculo.CodigoTipo,
          DsctoComercial: 0, // Campo no requerido
          AnioFabricacion: +vm.formData.mYearFabric.Descripcion,
          SumaAsegurada: vm.formData.vehicleValue,
          TipoVolante: constants.module.polizas.autos.tipoVolante,
          MCAGPS: constants.module.polizas.autos.MCAGPS,
          MCANUEVO: 'N', // N => USADO
          PolizaGrupo: '',
          ProductoVehiculo: {
            CodigoModalidad: vm.formData.mProducto.CodigoModalidad,
            CodigoCompania: constants.module.polizas.autos.companyCode,
            CodigoRamo: constants.module.polizas.autos.codeRamo
          }
        },
        Contratante: {
          MCAMapfreDolar: vm.formData.saldoMapfreDolares > 0 ? 'S' : 'N', // ($scope.firstStep.dataContractor.SaldoMapfreDolar > 0) ? 'S' : 'N',
          ImporteMapfreDolar: vm.formData.contractorData.saldoMapfreDolares // $scope.firstStep.dataContractor.SaldoMapfreDolar
        },
        Ubigeo: {
          CodigoProvincia: vm.formData.contractorData.mProvincia.Codigo, // '128',//$scope.firstStep.dataInspection.Cod_prov,
          CodigoDistrito: vm.formData.contractorData.mDistrito.Codigo // '22',//$scope.firstStep.dataInspection.Cod_dep
        }
      };

      vm.dataCalculatePremium = {
        commercialPremium: 0.0,
        netPremium: 0.0,
        discountCommission: 0.0,
        emissionValue: 0.0,
        igv: 0.0,
        mapfreDollar: 0.0,
        total: 0.0
      };

      inspecFactory.common.getCalculatePremium(params, true).then(function(response) {
        if (response.OperationCode === constants.operationCode.success) {
          vm.dataCalculatePremium.netPremium = response.Data.Vehiculo.PrimaVehicular;
          vm.dataCalculatePremium.netPremiumReal = response.Data.Vehiculo.PrimaVehicularReal; // nuevo valor que se debe enviar en el grabar
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
          CodigoUso: vm.formData.mTipoUso.Codigo
        }
      };
      inspecFactory.common.getCalculateDiscount(params, true).then(function(response) {
        vm.discountCommissionData = [];
        var vDiscountCommissionData = {
          AgenteComision: null, // 0
          DsctoEspecial: 0,
          DsctoEspecialPorcentaje: '-',
          ValorDsctoEsp: 0
        };
        if (response.Data && response.Data.Dsctos[0].Items.length) {
          ng.forEach(response.Data.Dsctos[0].Items, function(value) {
            vDiscountCommissionData = {
              AgenteComision: value.AgenteComision,
              DsctoEspecial: value.DsctoEspecial,
              DsctoEspecialPorcentaje: Math.abs(value.DsctoEspecial) + '%',
              ValorDsctoEsp: value.ValorDsctoEsp
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
      var params = {
        RequestTypeCode: vm.requestType.parameterId.toString(), // Normal 1 Flota 2
        RequestStatusCode: '1',
        AgentRequestId: +vm.agentRequest.id,
        InspectionTypeCode: vm.formData.applicantData.mInspectionType.parameterId,
        ConfirmationEmail: vm.formData.applicantData.mConfirmationEmail,
        CopyEmail: vm.formData.applicantData.mCopyEmail ? vm.formData.applicantData.mCopyEmail : null,
        WithOutSchedule: true,
        Contractor: {
          LicensePlate: vm.formData.mPlaca.toUpperCase(),
          AccesoriesAmount: +vm.formData.vehicleAccesoriesAmount,
          AccesoriesType: vm.formData.vehicleAccesoriesType,
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
          EndorserId: null,
          EndorserName: null,
          MapfreDollar: vm.formData.mMapfreDolar
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
            ProvinceId: +vm.formData.contractorData.mProvincia.Codigo,
            DistrictId: +vm.formData.contractorData.mDistrito.Codigo,
            VehicleAccesoriesAmount: +vm.formData.vehicleAccesoriesAmount,
            VehicleAccesoriesType: vm.formData.accesoriesEspecials && !vm.formData.accesoriesOthers,
            VehicleTypeId: +vm.formData.Tipo,
            VehicleType: vm.formData.NombreTipo,
            VehicleVersion: (vm.formData.mVersion) ? vm.formData.mVersion.toUpperCase() : ''
          }
        ]
      };

      if (!vm.withOutEmission) {
        params.Contractor.ProductId = vm.formData.mProducto.CodigoProducto;
        params.Contractor.Product = vm.formData.mProducto.NombreProducto;
        params.Contractor.FinanceTypeId = +vm.formData.financeType.Codigo;
        params.Contractor.FinanceType = vm.formData.financeType.Descripcion;
      }

      mModalConfirm
        .confirmInfo(
          '¿Está seguro que desea crear el siguiente registro de inspección?',
          'REGISTRAR INSPECCIÓN',
          'ACEPTAR'
        )
        .then(function() {
          inspecFactory.requests
            .addRequest(params, true)
            .then(function(response) {
              $log.log('response', response);
              mModalAlert.showSuccess('Inspección registrada correctamente', 'Inspección Registrada').then(function() {
                $state.go('inspeccionRegistro', {
                  requestId: response.requestid,
                  riskId: response.riskid,
                  inspectionId: response.inspectionid
                });
              });
            })
            .catch(function(e) {
              ErrorHandlerService.handleError(e);
            });
        });
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

      if (vm.formData.$valid && vm.formData.mSubModelo) {
        if (+vm.currentStep === 1) {
          inspecFactory.vehicle
            .validatePlate(vm.formData.mPlaca, true)
            .then(function() {
              vm.lastStepEnded = +vm.nextStep;
              $state.go('inspeccionNuevaSinCotizacion.steps', {
                step: vm.nextStep,
                agent: $stateParams.agent,
                confirmationEmail: $stateParams.confirmationEmail,
                copyEmail: $stateParams.copyEmail
              });
            })
            .catch(function() {
              ErrorHandlerService.handleWarning(
                'El número de placa ingresado ya se encuentra asociado a una póliza<br>¿Deseas continuar con la solicitud de todos modos?',
                'PLACA CON PÓLIZA EMITIDA',
                'Continuar'
              ).then(function() {
                vm.lastStepEnded = +vm.nextStep;
                $state.go('inspeccionNuevaSinCotizacion.steps', {
                  step: vm.nextStep,
                  agent: $stateParams.agent,
                  confirmationEmail: $stateParams.confirmationEmail,
                  copyEmail: $stateParams.copyEmail
                });
              });
            });
        } else if (+vm.currentStep === 3) {
          if (!vm.withOutEmission) {
            if (!vm.toggleValue) {
              ErrorHandlerService.handleWarningModal('Debe guardar el valor del auto', 'Advertencia');
            } else {
              vm.lastStepEnded = +vm.nextStep;
              $state.go('inspeccionNuevaSinCotizacion.steps', {
                step: vm.nextStep,
                agent: $stateParams.agent,
                confirmationEmail: $stateParams.confirmationEmail,
                copyEmail: $stateParams.copyEmail
              });
            }
          } else {
            vm.lastStepEnded = +vm.nextStep;
            $state.go('inspeccionNuevaSinCotizacion.steps', {
              step: vm.nextStep,
              agent: $stateParams.agent,
              confirmationEmail: $stateParams.confirmationEmail,
              copyEmail: $stateParams.copyEmail
            });
          }
        } else if (+vm.currentStep === 2) {
          vm.lastStepEnded = vm.nextStep + (vm.withOutEmission ? 2 : 1);
          $state.go('inspeccionNuevaSinCotizacion.steps', {
            step: vm.nextStep + (vm.withOutEmission ? 1 : 0),
            agent: $stateParams.agent,
            confirmationEmail: $stateParams.confirmationEmail,
            copyEmail: $stateParams.copyEmail
          });
        } else {
          vm.lastStepEnded = +vm.nextStep;
          $state.go('inspeccionNuevaSinCotizacion.steps', {
            step: vm.nextStep,
            agent: $stateParams.agent,
            confirmationEmail: $stateParams.confirmationEmail,
            copyEmail: $stateParams.copyEmail
          });
        }
      }
      $log.log('vm.formData', vm.formData);
    }

    function steping(stepToGo, anchor) {
      if (stepToGo < vm.currentStep) {
        $state
          .go(
            'inspeccionNuevaSinCotizacion.steps',
            {
              step: stepToGo,
              agent: $stateParams.agent,
              confirmationEmail: $stateParams.confirmationEmail,
              copyEmail: $stateParams.copyEmail
            },
            {reload: false, inherit: false}
          )
          .then(function() {
            setAnchor(anchor || 'anchor-1');
          });
      }
    }

    function loadMarca(){
      vm.formData.ModeloMarca = null;
      vm.formData.mSubModelo = null;
      vm.formData.mYearFabric = null;
      vm.formData.vehicleAmount = null;
    }
  }

  return ng.module('appInspec').controller('NuevaInspeccionSinCotizacionController', nuevaInspeccionSinCotizacion);
});
