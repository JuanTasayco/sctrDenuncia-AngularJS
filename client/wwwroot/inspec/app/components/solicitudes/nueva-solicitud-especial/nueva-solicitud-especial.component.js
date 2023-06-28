'use strict';

define(['angular', 'moment', 'constants', 'lodash'], function(ng, moment, constants, _) {
  solicitudNuevaEspecialController.$inject = [
    '$scope',
    '$state',
    '$log',
    'inspecFactory',
    'UserService',
    'mModalConfirm',
    'ErrorHandlerService',
    'mModalAlert',
    '$anchorScroll',
    'oimAbstractFactory',
    'gaService',
  ];

  function solicitudNuevaEspecialController(
    $scope,
    $state,
    $log,
    inspecFactory,
    UserService,
    mModalConfirm,
    ErrorHandlerService,
    mModalAlert,
    $anchorScroll,
    oimAbstractFactory,
    gaService
  ) {
    var vm = this;
    vm.$onInit = onInit;
    vm.queryAgents = queryAgents;
    vm.goToNextStep = goToNextStep;
    vm.createRequest = createRequest;
    vm.steping = steping;
    vm.searchMarcaModelo = searchMarcaModelo;
    vm.getFunctionsModeloMarca = getFunctionsModeloMarca;
    vm.getFunctionsSubModelo = getFunctionsSubModelo;
    vm.getFuctionsYearFabric = getFuctionsYearFabric;
    vm.loadMarca = loadMarca;

    function onInit() {
      vm.username = UserService.username;
      vm.user = UserService;
      vm.creationDate = moment(new Date()).format('DD/MM/YYYY');
      vm.agentRequest = {
        nombre: UserService.agentInfo.codigoAgente + ' >>> ' + UserService.agentInfo.codigoNombre,
        id: UserService.agentInfo.codigoAgente
      };

      inspecFactory.vehicle.getTipoVehiculo().then(function(response){
        if (response.OperationCode == constants.operationCode.success){
          vm.tipoVehiculo = response.Data;
        }
      });

      stepHandler();
      queryRequestsTypes();
      vm.lastStepEnded = 1;
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

    function queryRequestsTypes() {
      inspecFactory.common.getRequestType().then(function(response) {
        vm.requestType = _.find(response, function(element) {
          return element.parameterId === 3;
        });
      });
    }

    function createRequest() {
      vm.formData.markAsPristine();

      if (vm.formData.frmContractor) {
        vm.formData.frmContractor.markAsPristine();
      }

      if (vm.formData.frmContractor.$valid) {
        var params = {
          systemCode: oimAbstractFactory.getOrigin(),
          RequestTypeCode: '3',
          RequestStatusCode: '1',
          AgentRequestId: +vm.agentRequest.id,
          InspectionTypeCode: vm.formData.applicantData.mInspectionType.parameterId,
          ConfirmationEmail: vm.formData.applicantData.mConfirmationEmail,
          CopyEmail: vm.formData.applicantData.mCopyEmail ? vm.formData.applicantData.mCopyEmail : null,
          WithOutSchedule: true,
          Contractor: {
            LicensePlate: vm.formData.mPlaca.toUpperCase()
          },
          Items: [
            {
              ContactName: vm.formData.contractorData.mContactName || vm.formData.contractorData.mRazonSocial,
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
              DepartmentId: +vm.formData.ubigeoData.mDepartamento.Codigo || null,
              ProvinceId: vm.formData.ubigeoData.mProvincia ? +vm.formData.ubigeoData.mProvincia.Codigo : null,
              DistrictId: vm.formData.ubigeoData.mDistrito ? +vm.formData.ubigeoData.mDistrito.Codigo : null,
              VehicleTypeId: +vm.formData.Tipo,
              VehicleType: vm.formData.NombreTipo,
              VehicleVersion: (vm.formData.mVersion) ? vm.formData.mVersion.toUpperCase() : ''
            }
          ]
        };

        mModalConfirm
          .confirmInfo('¿Está seguro que desea crear la siguiente solicitud?', 'CREAR SOLICITUD', 'ACEPTAR')
          .then(function() {
            gaService.add({ gaCategory: 'Solicitud - INSPECCION', gaAction: 'Sin Cotización - Crear Solicitud Especial - Aceptar', gaLabel: 'Botón: Aceptar'});
            inspecFactory.requests
              .addRequest(params, true)
              .then(function(response) {
                $log.log('response', response);
                mModalAlert
                  .showSuccess('Solicitud registrada correctamente', 'Nueva Solicitud Creada')
                  .then(function() {
                    $state.go('solicitudes');
                  });
              })
              .catch(function(e) {
                ErrorHandlerService.handleError(e);
              });
          });
      }
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
            $state.go('solicitudNuevaEspecial.steps', {
              step: 1,
              anchor: 'anchor-1'
            });
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
        $state.go('solicitudNuevaEspecial.steps', {step: stepToGo}, {reload: false, inherit: false}).then(function() {
          setAnchor(anchor || 'anchor-1');
        });
      }
    }

    function goToNextStep() {
      vm.nextStep = +vm.currentStep + 1;
      vm.formData.markAsPristine();

      if (vm.formData.frmApplicant) {
        vm.formData.frmApplicant.markAsPristine();
      }

      if (vm.formData.$valid  && vm.formData.mSubModelo) {
        if (+vm.currentStep === 1) {
          inspecFactory.vehicle
            .validatePlate(vm.formData.mPlaca, true)
            .then(function() {
              vm.lastStepEnded = +vm.nextStep;
              $state.go('solicitudNuevaEspecial.steps', {step: vm.nextStep});
            })
            .catch(function() {
              ErrorHandlerService.handleWarning(
                'El número de placa ingresado ya se encuentra asociado a una póliza<br>¿Deseas continuar con la solicitud de todos modos?',
                'PLACA CON PÓLIZA EMITIDA',
                'Continuar'
              ).then(function() {
                vm.lastStepEnded = +vm.nextStep;
                $state.go('solicitudNuevaEspecial.steps', {step: vm.nextStep});
              });
            });
        } else {
          vm.lastStepEnded = +vm.nextStep;
          $state.go('solicitudNuevaEspecial.steps', {step: vm.nextStep});
        }
      }
      $log.log('vm.formData', vm.formData);
    }

    function loadMarca(){
      vm.formData.ModeloMarca = null;
      vm.formData.mSubModelo = null;
      vm.formData.mYearFabric = null;
      vm.formData.vehicleAmount = null;
    }
  }

  return ng.module('appInspec').controller('SolicitudNuevaEspecialController', solicitudNuevaEspecialController);
});
