'use strict';

define(['angular', 'moment', 'lodash', 'mpfPersonConstants', 'mpfPersonComponent'], function(ng, moment, _) {
  solicitudNuevaFlotaController.$inject = [
    '$scope',
    '$state',
    '$window',
    '$log',
    'inspecFactory',
    'UserService',
    'mModalConfirm',
    'ErrorHandlerService',
    'mModalAlert',
    '$uibModal',
    '$anchorScroll',
    'oimAbstractFactory',
    'gaService'
  ];
  function solicitudNuevaFlotaController(
    $scope,
    $state,
    $window,
    $log,
    inspecFactory,
    UserService,
    mModalConfirm,
    ErrorHandlerService,
    mModalAlert,
    $uibModal,
    $anchorScroll,
    oimAbstractFactory,
    gaService
  ) {
    $window.document.title = 'OIM - Inspecciones Autos - Solicitud Nueva';
    var vm = this;
    vm.$onInit = onInit;
    vm.goToNextStep = goToNextStep;
    vm.queryAgents = queryAgents;
    vm.showEditContacto = showEditContacto;
    vm.createRequest = createRequest;
    vm.removeContacto = removeContacto;
    vm.steping = steping;

    function onInit() {
      vm.formData = {};
      vm.username = UserService.username;
      vm.user = UserService;
      vm.creationDate = moment(new Date()).format('DD/MM/YYYY');
      vm.agentRequest = {
        nombre: UserService.agentInfo.codigoAgente + ' >>> ' + UserService.agentInfo.codigoNombre,
        id: UserService.agentInfo.codigoAgente
      };
      vm.pagination = {
        currentPage: 1,
        pageSize: 10
      };
      vm.lastStepEnded = 1;
      stepHandler();
      queryRequestsTypes();

      vm.companyCode = constants.module.polizas.autos.companyCode;
      vm.appCode = personConstants.aplications.INSPECCIONES;
      vm.formCodeCN = personConstants.forms.SOL_INSPEC_CN;

      $scope.$on('personForm', function(event, data) {
        if (data.contratante) {
          vm.formData.contratante = data.contratante;
          vm.formData.contractorData = inspecFactory.setInspectContractor(data.contratante)
        }
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
          default:
            $state.go('solicitudNuevaFlota.steps', {step: 1, anchor: 'anchor-1'});
        }
      });
    }

    function setAnchor(anchor) {
      ng.element(document).ready(function() {
        $anchorScroll(anchor);
      });
    }

    function goToNextStep() {
      vm.nextStep = +vm.currentStep + 1;
      vm.formData.markAsPristine();

      if (vm.formData.frmApplicant) {
        vm.formData.frmApplicant.markAsPristine();
      }

      if (!vm.formData.fileName) {
        vm.formData.invalidPlanilla = true;
      }

      if (+vm.currentStep === 2) {
        $scope.$broadcast('submitForm', true);
        vm.createRequest();
      }

      if (vm.formData.$valid) {
        if (+vm.currentStep === 1 && !vm.formData.invalidPlanilla) {
          vm.lastStepEnded = +vm.nextStep;
          $state.go('solicitudNuevaFlota.steps', {step: vm.nextStep});
        }
      }
      $log.log('vm.formData', vm.formData);
    }

    function steping(stepToGo, anchor) {
      if (stepToGo < vm.currentStep) {
        $state.go('solicitudNuevaFlota.steps', {step: stepToGo}, {reload: false, inherit: false}).then(function() {
          setAnchor(anchor || 'anchor-1');
        });
      }
    }

    function queryRequestsTypes() {
      inspecFactory.common.getRequestType().then(function(response) {
        vm.requestType = _.find(response, function(element) {
          return element.parameterId === 2;
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

    function showEditContacto(option) {
      var selectedContact = angular.copy(option);
      $uibModal
        .open({
          backdrop: true,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          size: 'lg',
          controllerAs: '$ctrl',
          templateUrl: '/inspec/app/_app/common/edit-contact/modal-edit-contacto.html',
          controller: [
            '$location',
            '$uibModalInstance',
            function($location, $uibModalInstance) {
              var vm = this;
              vm.frmContact = {};
              vm.selectedContact = selectedContact;
              vm.saveData = saveData;
              vm.closeModal = closeModal;

              function saveData(data) {
                vm.frmContact.markAsPristine();
                vm.frmContact.frmUbigeo.markAsPristine();
                if (vm.frmContact.$valid) {
                  data.fullName = data.contactName + ' ' + data.contactLastName;
                  closeModal(data);
                }
              }

              function closeModal(data) {
                $uibModalInstance.close(data);
              }
            }
          ]
        })
        .result.then(function(newData) {
          if (newData) {
            updateContact(newData);
          }
        });
    }

    function removeContacto(id) {
      var index = _.findIndex(vm.tblSolicitudFlota, function(item) {
        return item.id == id;
      });

      if (index !== -1) {
        vm.tblSolicitudFlota.splice(index, 1);
        vm.pagination.totalItems = vm.tblSolicitudFlota.length;
        if (vm.pagination.totalItems === 0) {
          vm.formData.invalidPlanilla = true;
          vm.formData.planilla = null;
        }
      }
    }

    function updateContact(data) {
      data.ubigeoDataFull =
        data.ubigeoData.mDepartamento.Descripcion +
        ' - ' +
        data.ubigeoData.mDistrito.Descripcion +
        ' - ' +
        data.ubigeoData.mProvincia.Descripcion;
      data.phone = data.contactPhone + ' / ' + data.contactCelphone;

      var index = _.findIndex(vm.tblSolicitudFlota, function(item) {
        return item.id === data.id;
      });
      if (index !== -1) {
        vm.tblSolicitudFlota[index] = upperCaseObject(data);
      }
    }

    function upperCaseObject(obj) {
      var newObj = {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          var value = obj[key];
          newObj[key] = ng.isString(value) ? value.toUpperCase() : value;
        }
      }
      return newObj;
    }

    function uploadFile() {
      vm.tblSolicitudFlota = [];
      inspecFactory.requests.loadExcel(vm.formData.planilla[0]).then(
        function(response) {
          if (response.code === '200') {
            vm.formData.fileName = vm.formData.planilla[0].name;
            vm.formData.fileLoaded = true;
            vm.tblSolicitudFlota = response.data.map(function(row, index) {
              row.id = index + 1;
              row.fullName = row.contactName + ' ' + row.contactLastName;
              row.phone = row.contactPhone + ' / ' + row.contactCelphone;
              return row;
            });
            vm.pagination.totalItems = vm.tblSolicitudFlota.length;
          } else {
            vm.formData.invalidPlanilla = true;
            vm.formData.planilla = null;
            ErrorHandlerService.handleError(response.msg);
          }
        },
        function(err) {
          vm.formData.invalidPlanilla = true;
          vm.formData.planilla = null;
          ErrorHandlerService.handleError(err.data.message);
        }
      );
    }

    function createRequest() {
      vm.formData.markAsPristine();
      if (vm.formData.frmContractor) {
        vm.formData.frmContractor.frmUbigeo.markAsPristine();
        vm.formData.frmContractor.markAsPristine();
      }
      if (vm.formData.$valid) {
        var params = {
          systemCode: oimAbstractFactory.getOrigin(),
          RequestTypeCode: vm.requestType.parameterId.toString(), // Normal 1 Flota 2
          RequestStatusCode: '1',
          AgentRequestId: +vm.agentRequest.id,
          InspectionTypeCode: vm.formData.applicantData.mInspectionType.parameterId,
          ConfirmationEmail: vm.formData.applicantData.mConfirmationEmail,
          CopyEmail: vm.formData.applicantData.mCopyEmail ? vm.formData.applicantData.mCopyEmail : null,
          Contractor: {
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
            AddressReference: vm.formData.contractorData.mReferencias
          },
          Items: vm.tblSolicitudFlota.map(function(element) {
            return {
              ContactName: element.contactName,
              ContactLastName: element.contactLastName,
              ContactPhone: element.contactPhone,
              ContactOfficePhone: element.contactOfficePhone,
              ContactCelphone: element.contactCelphone,
              ContactEmail: element.contactEmail,
              ContactOfficeEmail: element.contactEmail,
              VehicleBrand: element.vehicleBrand,
              VehicleModel: element.vehicleModel,
              VehicleSubModel: element.vehicleSubModel,
              VehicleYear: element.vehicleYear,
              VehicleLicensePlate: element.vehicleLicensePlate,
              DepartmentId: element.ubigeoData
                ? +element.ubigeoData.mDepartamento.Codigo
                : +vm.formData.contractorData.mDepartamento.Codigo,
              ProvinceId: element.ubigeoData
                ? +element.ubigeoData.mProvincia.Codigo
                : +vm.formData.contractorData.mProvincia.Codigo,
              DistrictId: element.ubigeoData
                ? +element.ubigeoData.mDistrito.Codigo
                : +vm.formData.contractorData.mDistrito.Codigo,
              VehicleAccesoriesAmount: 0,
              VehicleAccesoriesType: 0
            };
          })
        };

        $log.log('params', params);

        mModalConfirm
          .confirmInfo('¿Está seguro que desea crear la siguiente solicitud?', 'CREAR SOLICITUD', 'ACEPTAR')
          .then(function() {
            gaService.add({ gaCategory: 'Solicitud - INSPECCION', gaAction: 'Sin Cotización - Crear Solicitud Flota - Aceptar', gaLabel: 'Botón: Aceptar'});
            inspecFactory.requests
              .addRequest(params, true)
              .then(function() {
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

    $scope.$watch(
      function() {
        return vm.formData.planilla;
      },
      function(newValue) {
        if (newValue) {
          vm.formData.invalidPlanilla = false;
          vm.formData.fileLoaded = false;
          vm.formData.fileName = '';
          vm.pagination = {
            currentPage: 1,
            pageSize: 10
          };
          uploadFile();
        }
      }
    );
  }

  return ng
    .module('appInspec')
    .controller('SolicitudNuevaFlotaController', solicitudNuevaFlotaController)
    .directive('uploadFile', [
      '$window',
      function($window) {
        return {
          restrict: 'A',
          link: function(scope, element) {
            element.bind('click', function() {
              $window.document.querySelector('.input__file').click();
            });
          }
        };
      }
    ]);
});
