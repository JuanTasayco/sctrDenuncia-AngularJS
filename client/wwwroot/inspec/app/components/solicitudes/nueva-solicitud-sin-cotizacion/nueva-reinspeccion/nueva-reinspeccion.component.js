'use strict';

define(['angular', 'moment', 'constants', 'lodash', 'mpfPersonConstants', 'mpfPersonComponent'], function(ng, moment, constants, _) {
  solicitudNuevaSinCotizacionReinspeccion.$inject = [
    '$log',
    '$scope',
    '$state',
    'inspecFactory',
    'UserService',
    'mModalAlert',
    'ErrorHandlerService',
    '$anchorScroll',
    'oimAbstractFactory'
  ];

  function solicitudNuevaSinCotizacionReinspeccion(
    $log,
    $scope,
    $state,
    inspecFactory,
    UserService,
    mModalAlert,
    ErrorHandlerService,
    $anchorScroll,
    oimAbstractFactory
  ) {
    var vm = this;
    vm.$onInit = onInit();
    vm.goToNextStep = goToNextStep;
    vm.steping = steping;
    vm.createRequest = createRequest;
    vm.searchMarcaModelo = searchMarcaModelo;
    vm.getFunctionsModeloMarca = getFunctionsModeloMarca;
    vm.getFunctionsSubModelo = getFunctionsSubModelo;
    vm.getFuctionsYearFabric = getFuctionsYearFabric;
    vm.queryAgents = queryAgents;
    vm.loadMarca = loadMarca;

    function onInit() {
      vm.formData = {};
      vm.username = UserService.username;
      vm.user = UserService;
      vm.creationDate = moment(new Date()).format('DD/MM/YYYY');
      vm.agentRequest = {
        nombre: UserService.agentInfo.codigoAgente + ' >>> ' + UserService.agentInfo.codigoNombre,
        id: UserService.agentInfo.codigoAgente
      };
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

      stepHandler();
      queryRequestsTypes();
    }

    function queryRequestsTypes() {
      inspecFactory.common.getRequestType().then(function(response) {
        vm.requestType = _.find(response, function(element) {
          return element.parameterId === 1;
        });
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
            $log.log('Load step 3 data');
            break;
          default:
            $state.go('solicitudNuevaSinCotizacionReinspeccion.steps', {step: 1, anchor: 'anchor-1'});
        }
      });
    }

    function setAnchor(anchor) {
      ng.element(document).ready(function() {
        $anchorScroll(anchor);
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
      // ??
      if (value && value.codigoMarca === null) {
        vm.formData.ModeloMarca = null;
        vm.formData.mSubModelo = null;
        vm.formData.mYearFabric = null;
        // ? $scope.formData.yearSelected = false;
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
          }else {
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
          }else{
            mModalAlert.showError("El vehiculo ingresado no esta configurado para cotizar", "Error");
          }
        }
      } else {
        vm.formData.yearSelected = false;
      }
    }

    function loadValorSugerido(codigoMarca, codigoModelo, SubModeloCodigo,tipoVehiculo, Anio) {
      inspecFactory.vehicle.getValorSugerido(codigoMarca, codigoModelo, SubModeloCodigo,tipoVehiculo, Anio).then(
        function(response) {
          if (response.OperationCode == constants.operationCode.success) {
            vm.formData.vehicleValue = response.Data.Valor;
          }
        },
        function(error) {
          $log.log('Error en loadValorSugerido: ' + error);
        }
      );
    }

    function createRequest() {
      var params = {
        systemCode: oimAbstractFactory.getOrigin(),
        RequestTypeCode: vm.requestType.parameterId.toString(), // Normal 1 Flota 2
        RequestStatusCode: '1',
        AgentRequestId: +vm.agentRequest.id,
        InspectionTypeCode: vm.formData.applicantData.mInspectionType.parameterId,
        ConfirmationEmail: vm.formData.applicantData.mConfirmationEmail,
        CopyEmail: vm.formData.applicantData.mCopyEmail ? vm.formData.applicantData.mCopyEmail : null,
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
          AddressReference: vm.formData.contractorData.mReferencias
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
            VehicleTypeId: +vm.formData.Tipo,
            VehicleType: vm.formData.NombreTipo,
            VehicleVersion: (vm.formData.mVersion) ? vm.formData.mVersion.toUpperCase() : ''
          }
        ]
      };

      inspecFactory.requests
        .addRequest(params, true)
        .then(function(response) {
          $log.log('response', response);
          mModalAlert.showSuccess('Solicitud registrada correctamente', 'Nueva Solicitud Creada').then(function() {
            $state.go('solicitudes');
          });
        })
        .catch(function(e) {
          $log.log('e', e);
          ErrorHandlerService.handleError(e);
        });
    }

    function goToNextStep() {
      vm.nextStep = +vm.currentStep + 1;
      vm.formData.markAsPristine();

      if (vm.formData.frmApplicant) {
        vm.formData.frmApplicant.markAsPristine();
      }

      if (vm.formData.frmUbigeo) {
        vm.formData.frmUbigeo.markAsPristine();
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
        vm.lastStepEnded = +vm.nextStep;
        $state.go('solicitudNuevaSinCotizacionReinspeccion.steps', {
          step: vm.nextStep
        });
      }
      $log.log('vm.formData', vm.formData);
    }

    function steping(stepToGo, anchor) {
      if (stepToGo < vm.currentStep) {
        $state
          .go('solicitudNuevaSinCotizacionReinspeccion.steps', {step: stepToGo}, {reload: false, inherit: false})
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

  return ng
    .module('appInspec')
    .controller('SolicitudNuevaSinCotizacionReinspeccionController', solicitudNuevaSinCotizacionReinspeccion);
});
