'use strict';

define(['angular', 'moment', 'constants', 'lodash', 'mpfPersonConstants', 'mpfPersonComponent'], function (
  ng,
  moment,
  constants,
  _,
  personConstants
) {
  solicitudNuevaIndividualController.$inject = [
    '$scope',
    '$state',
    '$window',
    '$log',
    '$stateParams',
    'inspecFactory',
    'UserService',
    'mModalConfirm',
    'ErrorHandlerService',
    'mModalAlert',
    '$uibModal',
    '$anchorScroll',
    'proxyGeneral',
    'oimAbstractFactory',
    'oimClaims',
    'oimPrincipal',
    'gaService'
  ];

  function solicitudNuevaIndividualController(
    $scope,
    $state,
    $window,
    $log,
    $stateParams,
    inspecFactory,
    UserService,
    mModalConfirm,
    ErrorHandlerService,
    mModalAlert,
    $uibModal,
    $anchorScroll,
    proxyGeneral,
    oimAbstractFactory,
    oimClaims,
    oimPrincipal,
    gaService
  ) {
    $window.document.title = 'OIM - Inspecciones Autos - Solicitud Nueva';
    var vm = this;
    vm.$onInit = onInit;
    vm.queryAgents = queryAgents;
    vm.goToNextStep2 = goToNextStep2;
    vm.goToNextStep = goToNextStep;
    vm.createRequest = createRequest;
    vm.validateMapfreDollars = validateMapfreDollars;
    vm.steping = steping;
    vm.calculatePremium = calculatePremium;
    vm.calculateDiscountCommission = calculateDiscountCommission;
    // vm.calcularPrimaProducto = calcularPrimaProducto;
    vm.calculateDescuentoComercial = calculateDescuentoComercial;
    vm.getDocumentData = getDocumentData;
    vm.documentNumber = '';
    vm.documentType = '';
    var primaNeta = 0;
    
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
      vm.quotationNumber = $stateParams.quotationNumber;
      queryQuotation();
      stepHandler();
      queryRequestsTypes();
      vm.lastStepEnded = 1;
      vm.fromQuotation = $stateParams.fromQuotation;
      vm.companyCode = constants.module.polizas.autos.companyCode;
      vm.appCode = personConstants.aplications.INSPECCIONES;
      vm.formCodeCN = personConstants.forms.SOL_INSPEC_CN;
      $scope.$on('personForm', function(event, data) {
        if (data.contratante) {
          vm.formData.contractorValid = data.valid;
          vm.formData.contratante = data.contratante;
          vm.formData.contractorData = inspecFactory.setInspectContractor(data.contratante);
        }
      });

      $scope.$on('nextStepFromBlackList', function(event, data) {
        if (data && vm.formData.contractorValid) {
          vm.formData.contratante.esFraudulento && guardarDatosAuditoria(vm.formData.contratante.datosFraudulentos, vm.quotationNumber.split('-')[1]);
          executeToNextStep();
        }
      });
      var profile = JSON.parse(window.localStorage.getItem('profile'));
      vm.esEjecutivo = !profile.isAgent && profile.userSubType === "1";
      vm.esAgente = profile.isAgent && profile.userSubType === "1";
      vm.esCorredor = profile.userSubType === "3";
    }

    vm.updateAgent = updateAgent;
    function updateAgent() {
      vm.agentRequest = ng.copy(vm.agentRequest);
    }
    
	//INICIO BUILDSOFT
    function calculateDescuentoComercial(descuentoComercial) {
      if (descuentoComercial) {
        console.log(primaNeta);
        const descuento = roundTwoDecimals(Math.abs(primaNeta * descuentoComercial.AgenteComercial) / 100);
        vm.formData.comercialPremium = primaNeta - descuento;
        vm.formData.discountComercial = roundTwoDecimals(primaNeta*(descuentoComercial.AgenteComercial / 100));
        vm.formData.total = vm.formData.comercialPremium + vm.formData.igv;
      }
    }
    //FIN BUILDSOFT

    function getStatusAutoInspec() {
      vm.dataVerify = [];
      vm.dataCotizacion.licenseExist = false;

      var params = {
        vehicleAmount: vm.dataCotizacion.vehiculoData.ValorComercial,
        vehicleAccesoriesType: vm.formData.vehicleAccesoriesAmount >= 1 ? true : false,
        accesoriesCount: vm.formData.vehicleAccesoriesAmount,
        isNewVehicle: false,
        licensePlate: vm.formData.vehicleLicensePlate,
        agentId: vm.agentRequest.id,
        SystemId: 1,
        productId: vm.dataCotizacion.codigoProducto,
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
            fnIsInTotalLose(vm.formData.vehicleLicensePlate);
          }
        })
        .catch(function (err) {
          console.error(err);
        });
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
          console.error(err);
        });
    }

    function getDocumentData(data) {
      vm.documentNumber = data.CodigoDocumento;
      vm.documentType = data.TipoDocumento;
      vm.formData.contractorData.esFraudulento = data.esFraudulento;
    }

    function _cambiarFormatoDatetime(fecha) {
      var fechaModificada = angular.isDate(fecha) ? $filter('date')(fecha, 'dd/MM/yyyy') : fecha;
      return fechaModificada;
    }

    function _createObjectComponent(obj, propertyName, data) {
      obj[propertyName] = {
        TipoDocumento: data.TipoDocumento,
        NumeroDocumento: data.CodigoDocumento,
        Nombre: data.Nombre,
        ApellidoMaterno: data.ApellidoMaterno,
        ApellidoPaterno: data.ApellidoPaterno,
        FechaNacimiento: _cambiarFormatoDatetime(data.FechaNacimiento),
        Sexo: angular.isObject(data.Sexo) ? data.Sexo.Codigo : data.Sexo,
        nationality: {
          Codigo: angular.isObject(data.Pais) ? data.Pais.Codigo : '',
        },
        size: data.Talla,
        weight: data.Peso,
        Telefono: data.Telefono,
        Telefono2: data.Telefono2,
        CorreoElectronico: data.CorreoElectronico,
        Ubigeo: {
          Departamento: angular.isObject(data.Ubigeo) ? {Codigo: data.Ubigeo.CodigoDepartamento} : null,
          Provincia: angular.isObject(data.Ubigeo) ? {Codigo: data.Ubigeo.CodigoProvincia} : null,
          Distrito: angular.isObject(data.Ubigeo) ? {Codigo: data.Ubigeo.CodigoDistrito} : null,
        },
        Direccion: angular.isObject(data.Ubigeo) ? data.Ubigeo.Direccion : '',
      };
      if (angular.isUndefined(data.Profesion)) {
        obj[propertyName].Profesion = '';
      } else {
        obj[propertyName].Profesion = {
          codigo: angular.isObject(data.Profesion) ? data.Profesion.Codigo : '',
          descripcion: angular.isObject(data.Profesion) ? data.Profesion.Descripcion : '',
        };
      }
      if (angular.isUndefined(data.Ocupacion)) {
        obj[propertyName].Ocupacion = '';
      } else {
        obj[propertyName].Ocupacion = {
          codigo: angular.isObject(data.Ocupacion) ? data.Ocupacion.codigo : '',
          descripcion: angular.isObject(data.Ocupacion) ? data.Ocupacion.descripcion : '',
        };
      }
      if (angular.isUndefined(data.EstadoCivil)) {
        obj[propertyName].civilState = '';
      } else {
        obj[propertyName].civilState = {
          Codigo: data.EstadoCivil.CodigoEstadoCivil,
        };
      }
    }

    function queryQuotation() {
      inspecFactory.quotations
        .getQuotationsByNumber(vm.quotationNumber, true)
        .then(function (response) {
          var quotation = response.Data;
          var contractor = {
            ocupacion: {
              indice: quotation.Contratante.Ocupacion ? quotation.Contratante.Ocupacion.Indice : 0,
            },
            mFechaNacimiento: quotation.Contratante.FechaNacimiento
              ? moment(quotation.Contratante.FechaNacimiento, 'D/MM/YYYY h:mm:ss A').toDate()
              : null,
            mapfreDollar: quotation.Contratante.importeAplicarMapfreDolar
              ? quotation.Contratante.importeAplicarMapfreDolar
              : '',
            mTelfPersonal: quotation.Contratante.telefono ? quotation.Contratante.telefono : '',
            mCelular: quotation.Contratante.telefono ? quotation.Contratante.telefono : '',
            mEmailPersonal: quotation.Contratante.CorreoElectronico ? quotation.Contratante.CorreoElectronico : '',
            mTelfOficina: quotation.Contratante.Telefono2 ? quotation.Contratante.Telefono2 : '',
            mRazonSocial: quotation.Contratante.Nombre ? quotation.Contratante.Nombre : '',
            mNomContratante: quotation.Contratante.Nombre ? quotation.Contratante.Nombre : '',
            mApePatContratante: quotation.Contratante.ApellidoPaterno ? quotation.Contratante.ApellidoPaterno : '',
            mApeMatContratante: quotation.Contratante.ApellidoMaterno ? quotation.Contratante.ApellidoMaterno : '',
            mTipoDocumento: {
              Codigo: quotation.Contratante.TipoDocumento ? quotation.Contratante.TipoDocumento : null,
            },
            TipoDocumento: {
              Codigo: quotation.Contratante.TipoDocumento ? quotation.Contratante.TipoDocumento : null,
            },
            CodigoDocumento: quotation.Contratante.CodigoDocumento ? quotation.Contratante.CodigoDocumento : '',
            mNroDocumento: quotation.Contratante.CodigoDocumento ? quotation.Contratante.CodigoDocumento : '',
            documentType: quotation.Contratante.CodigoDocumento ? quotation.Contratante.CodigoDocumento : '',
            importeMapfreDolar: quotation.Contratante.ImporteMapfreDolar ? quotation.Contratante.ImporteMapfreDolar : 0,
            MCAMapfreDolar: quotation.Contratante.MCAMapfreDolar,
            mSexo: quotation.Contratante.Sexo === '1' || quotation.Contratante.Sexo === 'M' ? 'M' : 'F',
            mEstadoCivil: {
              CodigoEstadoCivil:
                quotation.Contratante.CodigoEstadoCivil !== 0 ? quotation.Contratante.CodigoEstadoCivil : null,
            },
            mNacionalidad: {},
            mDepartamento: {
              Codigo:
                quotation.Contratante.Ubigeo.CodigoDepartamento !== ''
                  ? quotation.Contratante.Ubigeo.CodigoDepartamento
                  : null,
            },
            mProvincia: {
              Codigo:
                quotation.Contratante.Ubigeo.CodigoProvincia !== '' ? quotation.Contratante.Ubigeo.CodigoProvincia : '',
            },
            mDistrito: {
              Codigo:
                quotation.Contratante.Ubigeo.CodigoDistrito !== '' ? quotation.Contratante.Ubigeo.CodigoDistrito : '',
            },
            mSelectVia: {
              Codigo: quotation.Contratante.Ubigeo.CodigoVia !== '' ? quotation.Contratante.Ubigeo.CodigoVia : null,
            },
            mSelectNumero: {
              Codigo:
                quotation.Contratante.Ubigeo.CodigoNumero !== '' ? quotation.Contratante.Ubigeo.CodigoNumero : null,
            },
            mSelectInterior: {
              Codigo:
                quotation.Contratante.Ubigeo.CodigoInterior !== '' ? quotation.Contratante.Ubigeo.CodigoInterior : null,
            },
            mSelectZona: {
              Codigo: quotation.Contratante.Ubigeo.CodigoZona !== '' ? quotation.Contratante.Ubigeo.CodigoZona : null,
            },
            mVia: quotation.Contratante.Ubigeo ? quotation.Contratante.Ubigeo.ViaDescripcion : '',
            mNumero: quotation.Contratante.Ubigeo ? quotation.Contratante.Ubigeo.TextoNumero : '',
            mInterior: quotation.Contratante.Ubigeo ? quotation.Contratante.Ubigeo.TextoInterior : '',
            mZona: quotation.Contratante.Ubigeo ? quotation.Contratante.Ubigeo.TextoZona : '',
            mReferencias: quotation.Contratante.Ubigeo ? quotation.Contratante.Ubigeo.Referencia : '',
            mProfesion: {
              Codigo: quotation.Contratante.Profesion.Codigo !== '' ? quotation.Contratante.Profesion.Codigo : null,
            },
          };
          vm.formData.contractorData = contractor;
          vm.formData.DctoIntegralidad = quotation.MarcaPorDctoIntegralidad === 'S';
          vm.formData.PorDctoIntgPlaza = quotation.PorDctoIntgPlaza;

          _createObjectComponent(vm.formData, 'contractorData', response.Data.Contratante);

          return {
            numero: quotation.NumeroDocumento,
            producto: quotation.NombreProducto,
            codigoProducto: quotation.CodigoProducto,
            nombreProducto: quotation.NombreProducto,
            tipoProducto: quotation.TipoProducto,
            tipoUso: quotation.Vehiculo.NombreUso,
            primaNeta: quotation.PrimaNeta,
            circulacion:
              quotation.Vehiculo.Ubigeo.NombreDepartamento +
              ', ' +
              quotation.Vehiculo.Ubigeo.NombreProvincia +
              ', ' +
              quotation.Vehiculo.Ubigeo.NombreDistrito,
            auto:
              quotation.Vehiculo.NombreMarca +
              ' ' +
              quotation.Vehiculo.NombreModelo +
              ', ' +
              quotation.Vehiculo.AnioFabricacion,
            tipoAuto: quotation.Vehiculo.NombreTipoVehiculo,
            valorAuto: quotation.Vehiculo.ValorComercial,
            polizaGrupo: quotation.PolizaGrupo || '-',
            marca: quotation.Vehiculo.NombreMarca,
            modelo: quotation.Vehiculo.NombreModelo,
            subModelo: quotation.Vehiculo.NombreSubModelo,
            anioFabricacion: quotation.Vehiculo.AnioFabricacion,
            departamento: quotation.Contratante.Ubigeo.CodigoDepartamento,
            distrito: quotation.Contratante.Ubigeo.CodigoDistrito,
            provincia: quotation.Contratante.Ubigeo.CodigoProvincia,
            vehiculoData: quotation.Vehiculo,
            codigoAgente: quotation.CodigoAgente,
            nombreAgente: quotation.NombreAgente,
          };
        })
        .then(function (quotation) {
          vm.dataCotizacion = quotation;
          vm.agentLoaded = true;
        });
    }

    function stepHandler() {
      $scope.$on('$stateChangeSuccess', function (scope, state, params) {
        vm.currentStep = +params.step;
        if (!params.quotationNumber) {
          $state.go('solicitudes');
        }
        var validStep = vm.currentStep > vm.lastStepEnded ? -1 : vm.currentStep;
        if (validStep) {
          setAnchor(params.anchor);
        }
        switch (validStep) {
          case 1:
            $log.log("Load step 1 data");
            vm.formData.vehicleLicensePlate = $stateParams.vehiclePlate || '';
            break;
          case 2:
            $log.log("Load step 2 data");
            evalAgentViewDcto();
            break;
          case 3:
            calculatePremium();
            queryFinancingTypes();
            queryEndoserTypes();
            // calcularPrimaProducto();
            vm.formData.mMapfreDolar = vm.formData.mMapfreDolar ? vm.formData.mMapfreDolar : 0;
            vm.formData.discountCommission = vm.formData.discountCommission ? vm.formData.discountCommission : 0;
            vm.formData.endosatario = vm.formData.endosatario ? vm.formData.endosatario : 0;
            vm.searchRucEndoser = searchRucEndoser;
            vm.formData.discountComercial = vm.formData.discountComercial ? vm.formData.discountComercial : 0;
            $log.log('Load step 3 data');
            break;
          case 4:
            getStatusAutoInspec();
            $log.log('Load step 4 data');
            break;
          default:
            $state.go('solicitudNuevaIndividual.steps', {
              quotationNumber: params.quotationNumber,
              step: 1,
              anchor: 'anchor-1',
            });
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

    function steping(stepToGo, anchor) {
      if (stepToGo < vm.currentStep) {
        $state
          .go(
            'solicitudNuevaIndividual.steps',
            {quotationNumber: vm.quotationNumber, step: stepToGo},
            {reload: false, inherit: false}
          )
          .then(function () {
            setAnchor(anchor || 'anchor-1');
          });
      }
    }

    function queryRequestsTypes() {
      inspecFactory.common.getRequestType().then(function (response) {
        vm.requestType = _.find(response, function (element) {
          return element.parameterId === 1;
        });
      });
    }

    function queryFinancingTypes() {
      return inspecFactory.common.getListFinanciamiento(vm.dataCotizacion.tipoProducto).then(function (response) {
        vm.financingTypes = response;
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

    function queryEndoserTypes() {
      inspecFactory.common.getListEndosatario().then(function (response) {
        vm.endorserTypes = response;
      });
    }

    function calculateDiscount() {
      var params = {
        CodigoAgente: +vm.dataCotizacion.codigoAgente,
        CodigoCia: constants.module.polizas.autos.companyCode,
        CodigoMoneda: constants.currencyType.dollar.code, // "2", //DOLLAR CONSTANTE
        CodigosProductos: [vm.dataCotizacion.codigoProducto],
        Vehiculo: {
		  CodigoUso: vm.dataCotizacion.vehiculoData.CodigoUso,
          CodigoTipoVehiculo: +vm.dataCotizacion.vehiculoData.CodigoTipoVehiculo,          
		  CodigoMarca: vm.dataCotizacion.vehiculoData.CodigoMarca,//buildsoft
          CodigoModelo: vm.dataCotizacion.vehiculoData.CodigoModelo,//buildsoft
          CodigoTipo: vm.dataCotizacion.vehiculoData.CodigoTipoVehiculo,//buildsoft
          AnioFabricacion: vm.dataCotizacion.vehiculoData.AnioFabricacion,//buildsoft
        },
      };
      inspecFactory.common.getCalculateDiscount(params, true).then(function (response) {
	 //INICIO BUILDSOFT
        vm.descuentoComercialData = [];
        console.log(response);
        
		if (response.Data && response.Data.Dsctos[0].ItemsComercial.length) {
          ng.forEach(response.Data.Dsctos[0].ItemsComercial, function (value) {
            var vDescuentoComercialData = {
                AgenteComercial: value.DsctoComercial,
                DsctoComercialPorcentaje: value.DsctoEspValor
              };
            vm.descuentoComercialData.push(vDescuentoComercialData);
			  
          });
        }
		
     //FIN BUILDSOFT
        vm.discountCommissionData = [];
        var vDiscountCommissionData = {
          AgenteComision: null, // 0
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

    function calculatePremium() {
      var params = {
        PorDctoIntgPlaza: vm.formData.PorDctoIntgPlaza || 0,
        MarcaPorDctoIntegralidad: vm.formData.DctoIntegralidad ? 'S' : 'N',
        AutoConInspeccion: 'S', // S => EmisionAutoUsado
        InspeccionConCotizacion: 'S', // S => InspeccionConCotizacion
        numeroCotizacion: vm.dataCotizacion.numero, // Campo no requerido
        CodigoCorredor: vm.agentRequest.id, // 9808, //CodigoAgente
        TotalDsctoComision: 0, // Campo no requerido
        DsctoComision: 0, // Campo no requerido
        Vehiculo: {
          CodigoMarca: vm.dataCotizacion.vehiculoData.CodigoMarca,
          CodigoModelo: vm.dataCotizacion.vehiculoData.CodigoModelo,
          CodigoSubModelo: vm.dataCotizacion.vehiculoData.CodigoSubModelo,
          CodigoUso: vm.dataCotizacion.vehiculoData.CodigoUso,
          CodigoProducto: vm.dataCotizacion.codigoProducto, // NUEVO CAMPO
          CodigoTipo: vm.dataCotizacion.vehiculoData.CodigoTipoVehiculo,
          DsctoComercial: 0, // Campo no requerido
          AnioFabricacion: vm.dataCotizacion.vehiculoData.AnioFabricacion,
          SumaAsegurada: vm.dataCotizacion.vehiculoData.ValorComercial,
          TipoVolante: constants.module.polizas.autos.tipoVolante,
          MCAGPS: vm.dataCotizacion.vehiculoData.MCAGPS,
          MCANUEVO: 'N', // N => USADO
          PolizaGrupo: '',
          ProductoVehiculo: {
            CodigoModalidad: vm.dataCotizacion.vehiculoData.ProductoVehiculo.CodigoModalidad,
            CodigoCompania: constants.module.polizas.autos.companyCode,
            CodigoRamo: constants.module.polizas.autos.codeRamo,
          },
        },
        Contratante: {
          MCAMapfreDolar: vm.formData.mMapfreDolar > 0 ? 'S' : 'N',
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
          vm.dataCalculatePremium.netPremiumReal = response.Data.Vehiculo.PrimaVehicularReal; // nuevo valor que se debe enviar en el grabar
          vm.dataCalculatePremium.emissionValuePercent = response.Data.PorDerechoEmision / 100;
          calculateDiscount();
          updatePremium();
          primaNeta = vm.formData.comercialPremium;
        } else {
          mModalAlert.showWarning(response.Message, 'Error BD');
          vm.formData.$valid = false;
        }
      });
    }

    function validateMapfreDollars() {
      if (vm.formData.mMapfreDolar >= vm.formData.comercialPremium) {
        vm.formData.mMapfreDolar = '';
      }
      updatePremium();
    }

    function updatePremium() {
      var netPremium = vm.dataCalculatePremium.netPremium - vm.formData.discountCommission - vm.formData.mMapfreDolar;
	  console.log("netPremium=",vm.dataCalculatePremium.netPremium, "-", vm.formData.discountCommission,"-", vm.formData.mMapfreDolar);
      vm.formData.emissionValue = roundTwoDecimals(netPremium * vm.dataCalculatePremium.emissionValuePercent);
      vm.formData.comercialPremium = roundTwoDecimals(vm.dataCalculatePremium.netPremium);
	  console.log("emissionValue",vm.dataCalculatePremium.emissionValue);
      vm.formData.igv = roundTwoDecimals((netPremium + vm.dataCalculatePremium.emissionValue) * 0.18);
	  console.log("IGV",vm.formData.igv);
      vm.formData.total = roundTwoDecimals(netPremium + vm.formData.emissionValue + vm.formData.igv);
    }

    function roundTwoDecimals(num) {
      return +(Math.round(num + 'e+2') + 'e-2');
    }

    function goToNextStep() {
      vm.nextStep = +vm.currentStep + 1;
      vm.formData.markAsPristine();

      if (vm.formData.frmApplicant) {
        vm.formData.frmApplicant.markAsPristine();
      }

      if (+vm.currentStep === 2) {
        vm.formData.contractorValid = false;
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
        if (vm.formData.DctoIntegralidad) {
          if (vm.documentType && vm.documentNumber) {
            proxyGeneral
              .ObtenerDescuentoIntegralidad(
                constants.module.polizas.autos.companyCode,
                vm.agentRequest.id,
                constants.module.polizas.autos.codeRamo,
                vm.documentType,
                vm.documentNumber
              )
              .then(function (response) {
                if (response.OperationCode === constants.operationCode.success) {
                  vm.formData.PorDctoIntgPlaza = response.Data;
                }
              })
              .catch(function (error) {
                console.log('Error en obtenerDctontegralidad: ' + error);
              });
          }
        } else {
          vm.formData.PorDctoIntgPlaza = 0;
        }
      }

      if (vm.formData.$valid && vm.formData.contractorValid) {
        executeToNextStep();
        /*
        if (+vm.currentStep === 1) {
          inspecFactory.vehicle
            .validatePlate(vm.formData.vehicleLicensePlate, true)
            .then(function () {
              vm.lastStepEnded = +vm.nextStep;
              $state.go('solicitudNuevaIndividual.steps', {quotationNumber: vm.quotationNumber, step: vm.nextStep});
            })
            .catch(function () {
              ErrorHandlerService.handleWarning(
                'El número de placa ingresado ya se encuentra asociado a una póliza<br>¿Deseas continuar con la solicitud de todos modos?',
                'PLACA CON PÓLIZA EMITIDA',
                'Continuar'
              ).then(function () {
                vm.lastStepEnded = +vm.nextStep;
                $state.go('solicitudNuevaIndividual.steps', {quotationNumber: vm.quotationNumber, step: vm.nextStep});
              });
            });
        } else {
          vm.lastStepEnded = +vm.nextStep;
          $state.go('solicitudNuevaIndividual.steps', {quotationNumber: vm.quotationNumber, step: vm.nextStep});
        }
        */
      }
      $log.log('vm.formData', vm.formData);
    }

    function executeToNextStep() {
      if (+vm.currentStep === 1) {
        inspecFactory.vehicle
          .validatePlate(vm.formData.vehicleLicensePlate, true)
          .then(function () {
            vm.lastStepEnded = +vm.nextStep;
            $state.go('solicitudNuevaIndividual.steps', {quotationNumber: vm.quotationNumber, step: vm.nextStep});
          })
          .catch(function () {
            ErrorHandlerService.handleWarning(
              'El número de placa ingresado ya se encuentra asociado a una póliza<br>¿Deseas continuar con la solicitud de todos modos?',
              'PLACA CON PÓLIZA EMITIDA',
              'Continuar'
            ).then(function () {
              vm.lastStepEnded = +vm.nextStep;
              $state.go('solicitudNuevaIndividual.steps', {quotationNumber: vm.quotationNumber, step: vm.nextStep});
            });
          });
      } else {
        vm.lastStepEnded = +vm.nextStep;
        $state.go('solicitudNuevaIndividual.steps', {quotationNumber: vm.quotationNumber, step: vm.nextStep});
      }
    }

    function goToNextStep2() {
      vm.formData.contractorValid = false;
      vm.formData.markAsPristine();

      if (+vm.currentStep === 1) {
        var hasAccesories = vm.formData.vehicleAccesoriesAmount > 0 && vm.formData.vehicleAccesoriesAmount < 4;
        if (hasAccesories) {
          vm.formData.$valid = (vm.formData.$valid && vm.formData.accesoriesEspecials) || vm.formData.accesoriesOthers;
        }
      }

      if (vm.formData.$valid) {
        validBlackListLicensePlate(vm.formData.vehicleLicensePlate);
      }
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

    function validBlackListLicensePlate(licencePlate) {
      vm.formData.placaFrudulenta = false;
      var reqLN = [ { "tipo": "NUM_MATRICULA", "valor": licencePlate } ];

      inspecFactory.blackList.ValidBlackList(reqLN, true).then(function (response) {
        var datosLN = [];
        
        if(response.OperationCode === constants.operationCode.success) {
          var msg = "";
          var element = response.Data[0];

          if(element.Resultado) {
            msg = "El n&uacute;mero placa est&aacute; en la tabla de Cliente/Unidad inelegible por estudios t&eacute;cnicos.";
            var elemetLN = { 
              codAplicacion: personConstants.aplications.INSPECCIONES,
              numCotizacion: vm.quotationNumber.split('-')[1],
              tipoDato: element.Tipo,
              valorDato: element.Valor
            };
            datosLN.push(elemetLN);
          }

          if(msg != "") {
            if(vm.esEjecutivo) {
              mModalAlert.showError(msg, 'Error');
            } else {
              confirmarListaNegra(datosLN);
            }
          } else {
            vm.formData.contractorValid = true;
            goToNextStep();
          }
        }
      }, function (err) {
        console.log('Error en lista negra. Continuando con flujo anterior.');
        executeToNextStep();
      });
    }

    function confirmarListaNegra(datosLN) {
      mModalConfirm.confirmError('Cliente/Unidad inelegible por estudios t&eacute;cnicos, la emisi&oacute;n estar&aacute; supedita a revisi&oacute;n.<br/><br/>&iquest;DESEA CONTINUAR CON LA SOLICITUD?', '', 'SI', undefined, 'NO')
      .then(function(ok) {
          if(ok) {
            datosLN.forEach(function(element) {
              element.aceptaAdvertencia = true;
              inspecFactory.blackList.saveAuditBlackList(element).then();  
            });

            vm.formData.placaFrudulenta = true;
            vm.formData.contractorValid = true;
            goToNextStep();
          } 
      });
    }

    function guardarDatosAuditoria(lista, cotizacion) {
      lista.forEach(function(element) {
        element.numCotizacion = cotizacion;
        inspecFactory.blackList.saveAuditBlackList(element).then();  
      });
    }

    function calificateAutoinspection(value) {
      if (vm.dataCotizacion.statusAutoInspec) {
        value = true;
      }
      var params = {
        systemCode: oimAbstractFactory.getOrigin(),
        AgentOwnerId: +vm.formData.applicantData.agentRequest.id,
        QuotationId: +vm.dataCotizacion.numero,
        RequestTypeCode: vm.requestType.parameterId.toString(), // Normal 1 Flota 2
        RequestStatusCode: "1",
        RehabilitatedRequestId: $stateParams.requestId,
        AgentRequestId: +vm.agentRequest.id,
        InspectionTypeCode: vm.formData.applicantData.mInspectionType.parameterId,
        ConfirmationEmail: vm.formData.applicantData.mConfirmationEmail,
        CopyEmail: vm.formData.applicantData.mCopyEmail ? vm.formData.applicantData.mCopyEmail : null,
        Contractor: {
          LicensePlate: vm.formData.vehicleLicensePlate.toUpperCase(),
          AccesoriesAmount: +vm.formData.vehicleAccesoriesAmount,
          AccesoriesType: vm.formData.vehicleAccesoriesType,
          DocumentTypeCode: vm.formData.contractorData.mTipoDocumento.Codigo,
          DocumentType: vm.formData.contractorData.mTipoDocumento.Descripcion,
          DocumentNumber: vm.formData.contractorData.mNroDocumento.toString(),
          ProductId: vm.dataCotizacion.codigoProducto,
          Product: vm.dataCotizacion.nombreProducto,
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
          NationalityCode: vm.formData.contractorData.mNacionalidad
            ? vm.formData.contractorData.mNacionalidad.Codigo
            : '',
          Nationality: vm.formData.contractorData.mNacionalidad
            ? vm.formData.contractorData.mNacionalidad.Descripcion
            : '',
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
          EconomyActivity: !vm.formData.contractorData.mActividadEconomica
            ? ''
            : vm.formData.contractorData.mActividadEconomica.Codigo,
          AgentOwnerComission: vm.formData.discountCommission,
          VehicleGroupPolicy: vm.dataCotizacion.polizaGrupo == '-' ? '' : vm.dataCotizacion.polizaGrupo,
          VehicleCodeUse: vm.dataCotizacion.vehiculoData.CodigoUso,
          VehicleModality: vm.dataCotizacion.vehiculoData.ProductoVehiculo.CodigoModalidad,
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
            VehicleBrand: vm.dataCotizacion.marca,
            VehicleBrandId: +vm.dataCotizacion.vehiculoData.CodigoMarca,
            VehicleModel: vm.dataCotizacion.modelo,
            VehicleModelId: +vm.dataCotizacion.vehiculoData.CodigoModelo,
            VehicleSubModel: vm.dataCotizacion.subModelo,
            VehicleSubModelId: +vm.dataCotizacion.vehiculoData.CodigoSubModelo,
            VehicleYear: vm.dataCotizacion.anioFabricacion,
            VehicleLicensePlate: vm.formData.vehicleLicensePlate.toUpperCase(),
            DepartmentId: +vm.formData.contractorData.mDepartamento.Codigo,
            ProvinceId: +vm.formData.contractorData.mProvincia.Codigo,
            DistrictId: +vm.formData.contractorData.mDistrito.Codigo,
            VehicleAccesoriesAmount: +vm.formData.vehicleAccesoriesAmount,
            VehicleAccesoriesType: vm.formData.accesoriesEspecials && !vm.formData.accesoriesOthers,
            VehicleTypeId: +vm.dataCotizacion.vehiculoData.CodigoTipoVehiculo,
            VehicleType: vm.dataCotizacion.vehiculoData.NombreTipoVehiculo,
            VehicleVersion: vm.dataCotizacion.vehiculoData.Version
              ? vm.dataCotizacion.vehiculoData.Version.toUpperCase()
              : '',
          },
        ],
      };
      vm.paramsNotify = {
        TypeNotification: 1,
        Email: vm.formData.contractorData.mEmailPersonal,
        LicensePlate: vm.formData.vehicleLicensePlate.toUpperCase(),
        Name: vm.formData.contractorData.mNomContratante || vm.formData.contractorData.mRazonSocial,
      };

      var tieneDatosFraudulentos = vm.formData.contratante.esFraudulento || vm.formData.placaFrudulenta;

      if (value && vm.dataCotizacion.licenseExist && !tieneDatosFraudulentos) {
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
                gaService.add({ gaCategory: 'Solicitud - INSPECCION', gaAction: 'Con Cotización - AUTOINSPECCIÓN', gaLabel: 'Modo: AUTOINSPECCIÓN'});                
                gaService.add({ gaCategory: 'Solicitud - INSPECCION', gaAction: 'Con Cotización - Confirmar Solicitud - Confirmar', gaLabel: 'Botón: Confirmar'});
                params.isAutoInspection = true;
                params.isInTotalLose = vm.dataVerify.isInTotalLose;
                var request = {
                  vehiclePlateNumber: vm.formData.vehicleLicensePlate.toUpperCase(),
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
                gaService.add({ gaCategory: 'Solicitud - INSPECCION', gaAction: 'Con Cotización - INSPECCIÓN REGULAR', gaLabel: 'Modo: INSPECCIÓN REGULAR'}); 
                gaService.add({ gaCategory: 'Solicitud - INSPECCION', gaAction: 'Con Cotización - Confirmar Solicitud - Confirmar', gaLabel: 'Botón: Confirmar'});
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
                    $log.log('e', e);
                    ErrorHandlerService.handleError(e);
                  });
              }
            }
          });
      } else {
        mModalConfirm
          .confirmInfo('¿Está seguro que desea crear la siguiente solicitud?', 'CREAR SOLICITUD', 'ACEPTAR')
          .then(function () {
            gaService.add({ gaCategory: 'Solicitud - INSPECCION', gaAction: 'Con Cotización - Confirmar Solicitud - Aceptar', gaLabel: 'Botón: Aceptar de confirmación de solicitud', gaValue: 'Periodo Regular' });
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
  }
  return ng.module('appInspec').controller('SolicitudNuevaIndividualController', solicitudNuevaIndividualController);
});
