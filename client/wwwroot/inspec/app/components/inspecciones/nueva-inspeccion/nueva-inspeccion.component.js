'use strict';

define(['angular', 'moment', 'constants', 'lodash', 'mpfPersonConstants', 'mpfPersonComponent'], function(ng, moment, constants, _, personConstants) {
  nuevaInspeccionController.$inject = [
    'inspecFactory',
    'UserService',
    '$stateParams',
    '$state',
    '$log',
    '$scope',
    'mModalConfirm',
    'mModalAlert',
    'ErrorHandlerService',
    '$anchorScroll',
    'proxyGeneral',
    'oimAbstractFactory',
    '$window'
  ];

  function nuevaInspeccionController(
    inspecFactory,
    UserService,
    $stateParams,
    $state,
    $log,
    $scope,
    mModalConfirm,
    mModalAlert,
    ErrorHandlerService,
    $anchorScroll,
    proxyGeneral,
    oimAbstractFactory,
    $window
  ) {
    var vm = this;
    vm.$onInit = onInit;
    vm.queryAgents = queryAgents;
    vm.goToNextStep = goToNextStep;
    vm.createRequest = createRequest;
    vm.validateMapfreDollars = validateMapfreDollars;
    vm.steping = steping;
    vm.calculatePremium = calculatePremium;
    vm.calculateDiscountCommission = calculateDiscountCommission;

    function onInit() {
      vm.username = UserService.username;
      vm.user = UserService;
      vm.creationDate = moment(new Date()).format('DD/MM/YYYY');
      vm.agent = $stateParams.agent;
      vm.agentRequest = {
        nombre:
          ($stateParams.agent ? $stateParams.agent.CodigoNombre : null) ||
          UserService.agentInfo.codigoAgente + ' >>> ' + UserService.agentInfo.codigoNombre,
        id: ($stateParams.agent ? $stateParams.agent.CodigoAgente : null) || UserService.agentInfo.codigoAgente
      };
      vm.quotationNumber = $stateParams.quotationNumber;
      queryQuotation();
      stepHandler();
      queryRequestsTypes();
      vm.lastStepEnded = 1;
      vm.fromQuotation = $stateParams.fromQuotation;
      vm.copyEmail = $stateParams.copyEmail;
      vm.companyCode = constants.module.polizas.autos.companyCode;
      vm.confirmationEmail = $stateParams.confirmationEmail;
      vm.appCode = personConstants.aplications.INSPECCIONES;
      vm.formCodeCN = personConstants.forms.SOL_INSPEC_CN;

      $scope.$on('personForm', function(event, data) {
        if (data.contratante) {
          vm.formData.contratante = data.contratante;
          vm.formData.contractorData = inspecFactory.setInspectContractor(data.contratante)
        }
      });
    }

    function queryQuotation() {
      inspecFactory.quotations
        .getQuotationsByNumber(vm.quotationNumber, true)
        .then(function(response) {
          var quotation = response.Data;
          vm.contractor = response.Data.Contratante;
          vm.formData.DctoIntegralidad = response.Data.MarcaPorDctoIntegralidad === 'S';
          vm.formData.PorDctoIntgPlaza = response.Data.PorDctoIntgPlaza
          return {
            dctoIntegralidad: quotation.MarcaPorDctoIntegralidad === 'S' ? true : false,
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
            nombreAgente: quotation.NombreAgente
          };
        })
        .then(function(quotation) {
          vm.dataCotizacion = quotation;
          vm.formData.contractorData = {
            mNomContratante: vm.contractor.Nombre,
            mApePatContratante: vm.contractor.ApellidoPaterno,
            mApeMatContratante: vm.contractor.ApellidoMaterno,
            mNroDocumento: vm.contractor.CodigoDocumento,
            mTipoDocumento: {
              Codigo: vm.contractor.TipoDocumento
            },
            mFechaNacimiento: vm.contractor.FechaNacimiento ? moment(vm.contractor.FechaNacimiento, "D/MM/YYYY h:mm:ss A").toDate() : null,
            mEstadoCivil: {
              CodigoEstadoCivil: !vm.contractor.CodigoEstadoCivil ? null : vm.contractor.CodigoEstadoCivil
            },
            mSexo: vm.contractor.Sexo === 0 ? "F" : "M",
            mProfesion: {
              Codigo: !vm.contractor.Profesion.Codigo ? null : vm.contractor.Profesion.Codigo
            },
            mDepartamento: {
              Codigo: vm.contractor.Ubigeo.CodigoDepartamento
            },
            mProvincia:{
              Codigo: vm.contractor.Ubigeo.CodigoProvincia
            },
            mDistrito: {
              Codigo: vm.contractor.Ubigeo.CodigoDistrito
            },
            mSelectVia: {
              Codigo: !vm.contractor.Ubigeo.CodigoVia ? null : vm.contractor.Ubigeo.CodigoVia
            },
            mVia: vm.contractor.Ubigeo.NombreVia,
            mSelectNumero: {
              Codigo: !vm.contractor.Ubigeo.CodigoNumero ? null : vm.contractor.Ubigeo.CodigoNumero
            },
            mNumero: vm.contractor.Ubigeo.NumeroDescripcion,
            mSelectInterior:{
              Codigo: !vm.contractor.Ubigeo.CodigoInterior ? null : vm.contractor.Ubigeo.CodigoInterior
            },
            mInterior: vm.contractor.Ubigeo.TextoInterior,
            mSelectZona: {
              Codigo: !vm.contractor.Ubigeo.CodigoZona ? null : vm.contractor.Ubigeo.CodigoZona
            },
            mZona: vm.contractor.Ubigeo.TextoZona,
            mReferencias: vm.contractor.Ubigeo.Referencia
          }
          vm.agentLoaded = true;

          _createObjectComponent(vm.formData, 'contractorData', vm.contractor);
        });
    }

    function _cambiarFormatoDatetime(fecha) {
      var fechaModificada = ng.isDate(fecha) ? $filter('date')(fecha, 'dd/MM/yyyy') : fecha;
      return fechaModificada;
    }

    function _createObjectComponent(obj, propertyName, data){
      obj[propertyName] = {
        TipoDocumento: data.TipoDocumento,
        NumeroDocumento: data.CodigoDocumento,
        Nombre: data.Nombre,
        ApellidoMaterno: data.ApellidoMaterno,
        ApellidoPaterno: data.ApellidoPaterno,
        FechaNacimiento: _cambiarFormatoDatetime(data.FechaNacimiento),
        Sexo: ng.isObject(data.Sexo) ? data.Sexo.Codigo : data.Sexo,
        nationality: {
          Codigo: ng.isObject(data.Pais) ? data.Pais.Codigo : ""
        },
        size: data.Talla,
        weight: data.Peso,
        Telefono: data.Telefono,
        Telefono2: data.Telefono2,
        CorreoElectronico: data.CorreoElectronico,
        Ubigeo: {
          Departamento: ng.isObject(data.Ubigeo) ? { Codigo: data.Ubigeo.CodigoDepartamento } : null,
          Provincia: ng.isObject(data.Ubigeo) ? { Codigo: data.Ubigeo.CodigoProvincia } : null,
          Distrito: ng.isObject(data.Ubigeo) ? { Codigo: data.Ubigeo.CodigoDistrito } : null
        },
        Direccion: ng.isObject(data.Ubigeo) ? data.Ubigeo.Direccion : ""
      };
      if(ng.isUndefined(data.Profesion)){
        obj[propertyName].Profesion = ''
      }else{
        obj[propertyName].Profesion = {
          codigo: ng.isObject(data.Profesion) ? data.Profesion.Codigo : "",
          descripcion: ng.isObject(data.Profesion) ? data.Profesion.Descripcion : ""
        }
      }
      if(ng.isUndefined(data.Ocupacion)){
        obj[propertyName].Ocupacion = ''
      }else{
        obj[propertyName].Ocupacion = {
          codigo: ng.isObject(data.Ocupacion) ? data.Ocupacion.codigo : "",
          descripcion: ng.isObject(data.Ocupacion) ? data.Ocupacion.descripcion : ""
        }
      }
      if(ng.isUndefined(data.EstadoCivil)){
        obj[propertyName].civilState = ''
      }else{
        obj[propertyName].civilState = {
          Codigo: data.EstadoCivil.CodigoEstadoCivil
        }
      }
    }

    function stepHandler() {
      $scope.$on('$stateChangeSuccess', function(scope, state, params) {
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
            $log.log('Load step 1 data');
            break;
          case 2:
            $log.log('Load step 2 data');
            break;
          case 3:
            calculatePremium();
            queryFinancingTypes();
            queryEndoserTypes();
            vm.formData.mMapfreDolar = vm.formData.mMapfreDolar ? vm.formData.mMapfreDolar : 0;
            vm.formData.discountCommission = vm.formData.discountCommission ? vm.formData.discountCommission : 0;
            vm.formData.endosatario = vm.formData.endosatario ? vm.formData.endosatario : 0;
            vm.searchRucEndoser = searchRucEndoser;
            vm.formData.PorDctoIntgPlaza = vm.formData.PorDctoIntgPlaza ? vm.formData.PorDctoIntgPlaza : 0;
            $log.log('Load step 3 data');
            break;
          case 4:
            $log.log('Load step 4 data');
            break;
          default:
            $state.go('inspeccionNueva.steps', {quotationNumber: params.quotationNumber, step: 1, anchor: 'anchor-1'});
        }
      });
    }

    function setAnchor(anchor) {
      ng.element(document).ready(function() {
        $anchorScroll(anchor);
      });
    }

    function steping(stepToGo, anchor) {
      if (stepToGo < vm.currentStep) {
        $state
          .go(
            'inspeccionNueva.steps',
            {
              quotationNumber: vm.quotationNumber,
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

    function queryRequestsTypes() {
      inspecFactory.common.getRequestType().then(function(response) {
        vm.requestType = _.find(response, function(element) {
          return element.parameterId === 1;
        });
      });
    }

    function queryFinancingTypes() {
      return inspecFactory.common.getListFinanciamiento(vm.dataCotizacion.tipoProducto).then(function(response) {
        vm.financingTypes = response;
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

    function queryEndoserTypes() {
      inspecFactory.common.getListEndosatario().then(function(response) {
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
          CodigoTipoVehiculo: +vm.dataCotizacion.vehiculoData.CodigoTipoVehiculo,
          CodigoUso: vm.dataCotizacion.vehiculoData.CodigoUso
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

    function calculatePremium() {
      var params = {
        PorDctoIntgPlaza: vm.formData.PorDctoIntgPlaza || 0,
        MarcaPorDctoIntegralidad: vm.formData.DctoIntegralidad ? "S" : "N",
        AutoConInspeccion: 'S', // S => EmisionAutoUsado
        InspeccionConCotizacion: 'S', // S => InspeccionConCotizacion
        numeroCotizacion: '', // Campo no requerido
        CodigoCorredor: vm.agentRequest.id, // 9808, //CodigoAgente
        TotalDsctoComision: 0, // Campo no requerido
        DsctoComision: 0, // Campo no requerido
        Vehiculo: {
          CodigoMarca: vm.dataCotizacion.vehiculoData.CodigoMarca,
          CodigoModelo: vm.dataCotizacion.vehiculoData.CodigoModelo,
          CodigoSubModelo: vm.dataCotizacion.vehiculoData.CodigoSubModelo,
          CodigoUso: vm.dataCotizacion.vehiculoData.CodigoUso,
          CodigoProducto: vm.dataCotizacion.codigoProducto, // NUEVO CAMPO
          CodigoTipo: vm.dataCotizacion.vehiculoData.CodigoTipoVehiculo, // NUEVO CAMPO
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
            CodigoRamo: constants.module.polizas.autos.codeRamo
          }
        },
        Contratante: {
          MCAMapfreDolar: vm.formData.mMapfreDolar > 0 ? 'S' : 'N', // ($scope.firstStep.dataContractor.SaldoMapfreDolar > 0) ? 'S' : 'N',
          ImporteMapfreDolar: parseFloat(vm.formData.contractorData.saldoMapfreDolares).toFixed(2) // $scope.firstStep.dataContractor.SaldoMapfreDolar
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

    function validateMapfreDollars() {
      if (vm.formData.mMapfreDolar >= vm.formData.comercialPremium) {
        vm.formData.mMapfreDolar = '';
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

    function goToNextStep() {
      vm.nextStep = +vm.currentStep + 1;
      vm.formData.markAsPristine();

      if (vm.formData.frmApplicant) {
        vm.formData.frmApplicant.markAsPristine();
      }

      if (+vm.currentStep === 2) {
        $scope.$broadcast('submitForm', true);
      }
      // TODO: Pruebas sobre esto
      if (+vm.currentStep === 1) {
        var hasAccesories = vm.formData.vehicleAccesoriesAmount > 0 && vm.formData.vehicleAccesoriesAmount < 4;
        if (hasAccesories) {
          vm.formData.$valid = (vm.formData.$valid && vm.formData.accesoriesEspecials) || vm.formData.accesoriesOthers;
        }
      }

      vm.obtenerDctoIntegralidad = obtenerDctoIntegralidad;
      function obtenerDctoIntegralidad() {
        vm.formData.PorDctoIntgPlaza =  0;
        if (vm.formData.DctoIntegralidad){
          if(vm.formData.contractorData.mTipoDocumento.Codigo && vm.formData.contractorData.mNroDocumento) {

          var pms = proxyGeneral
            .ObtenerDescuentoIntegralidad(
              constants.module.polizas.hogar.codeCia,
              vm.agentRequest.id,
              constants.module.polizas.hogar.codeRamo,
              vm.formData.contractorData.mTipoDocumento.Codigo,
              vm.formData.contractorData.mNroDocumento.toString(),
              true
            );
            pms.then(function(response) {
              if (response.OperationCode === constants.operationCode.success) {
                vm.formData.PorDctoIntgPlaza = response.Data;
              }
            })
            .catch(function(error) {
              ErrorHandlerService.handleError(error);
            });
          }else{
            mModalAlert.showWarning("Debe ingresar un número de documento antes de aplicar integralidad", "").then(function(){
              vm.formData.DctoIntegralidad = false;
            });
          }
        }
      }

      if (vm.formData.$valid) {
        vm.lastStepEnded = +vm.nextStep;
        if (+vm.currentStep === 1) {
          inspecFactory.vehicle
            .validatePlate(vm.formData.vehicleLicensePlate, true)
            .then(function() {
              $state.go('inspeccionNueva.steps', {
                quotationNumber: vm.quotationNumber,
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
                $state.go('inspeccionNueva.steps', {
                  quotationNumber: vm.quotationNumber,
                  step: vm.nextStep,
                  agent: $stateParams.agent,
                  confirmationEmail: $stateParams.confirmationEmail,
                  copyEmail: $stateParams.copyEmail
                });
              });
            });
        } else {
          $state.go('inspeccionNueva.steps', {
            quotationNumber: vm.quotationNumber,
            step: vm.nextStep,
            agent: $stateParams.agent,
            confirmationEmail: $stateParams.confirmationEmail,
            copyEmail: $stateParams.copyEmail
          });
        }
      }
      $log.log('vm.formData', vm.formData);
    }

    function createRequest() {

      var params = {
        systemCode: oimAbstractFactory.getOrigin(),
        PorDctoIntgPlaza: vm.formData.PorDctoIntgPlaza || 0,
        MarcaPorDctoIntegralidad: vm.dataCotizacion.dctoIntegralidad ? 'S' : 'N',
        AgentOwnerId: +vm.formData.applicantData.agentRequest.id,
        QuotationId: +vm.dataCotizacion.numero,
        RequestTypeCode: vm.requestType.parameterId.toString(), // Normal 1 Flota 2
        RequestStatusCode: '1',
        AgentRequestId: +vm.agentRequest.id,
        InspectionTypeCode: vm.formData.applicantData.mInspectionType.parameterId,
        ConfirmationEmail: vm.formData.applicantData.mConfirmationEmail,
        CopyEmail: vm.formData.applicantData.mCopyEmail ? vm.formData.applicantData.mCopyEmail : null,
        WithOutSchedule: true,
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
            VehicleVersion: (vm.dataCotizacion.vehiculoData.Version) ? vm.dataCotizacion.vehiculoData.Version.toUpperCase() : ''
          }

        ]
      };
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
  }

  return ng.module('appInspec').controller('NuevaInspeccionController', nuevaInspeccionController);
});
