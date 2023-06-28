'use strict';

define(['angular', 'moment', 'lodash'], function(ng, moment, _) {
  solicitudDetalleController.$inject = [
    '$filter',
    '$stateParams',
    '$window',
    '$timeout',
    '$uibModal',
    '$state',
    'mModalConfirm',
    'UserService',
    'inspecFactory',
    'ErrorHandlerService'
  ];

  function solicitudDetalleController(
    $filter,
    $stateParams,
    $window,
    $timeout,
    $uibModal,
    $state,
    mModalConfirm,
    UserService,
    inspecFactory,
    ErrorHandlerService
  ) {
    var vm = this;
    vm.$onInit = onInit;
    vm.doProgram = doProgram;
    vm.doCreateInspection = doCreateInspection;
    vm.goToInspection = goToInspection;
    vm.showEditContacto = showEditContacto;
    vm.showFrustrate = showFrustrate;
    vm.showReprogram = showReprogram;
    vm.showProgramTab = showProgramTab;
    $window.document.title = 'OIM - Detalle de Solicitud #' + $stateParams.requestId;

    function onInit() {
      vm.user = UserService;
      vm.requestId = $stateParams.requestId;
      vm.riskId = $stateParams.riskId;
      inspecFactory.requests.getRequestById(vm.requestId, vm.riskId, true).then(function(response) {
        setResponse(response);
        setContrator();
        queryTypes();

        var fullPhone =
          vm.request.item.contactPhone +
          ' / ' +
          (vm.request.item.contactCelphone ? vm.request.item.contactCelphone : '-');

        vm.event = {
          start: moment(vm.request.item.scheduleDate).toDate(),
          end: vm.request.item.endScheduleDate
            ? moment(vm.request.item.endScheduleDate).toDate()
            : moment(vm.request.item.scheduleDate)
                .add(30, 'minutes')
                .toDate(),
          backgroundColor: '#583727',
          title: 'Telefono: ' + fullPhone,
          data: {
            phone: fullPhone,
            contact: vm.request.item.contactName + ' ' + vm.request.item.contactLastName,
            address:
              vm.request.item.departmentCirculationPlace +
              ' / ' +
              vm.request.item.provinceCirculationPlace +
              ' / ' +
              vm.request.item.districtCirculationPlace,
            vehicle:
              vm.request.item.vehicleBrand +
              ' / ' +
              vm.request.item.vehicleModel +
              ' / ' +
              vm.request.item.vehicleLicensePlate,
            inspector: vm.request.item.inspectorName,
            inspectorId: vm.request.item.inspectorId,
            date: moment(vm.request.item.scheduleDate).toDate()
          }
        };
      });
    }

    function setResponse(response) {
      vm.request = response;
      vm.request.idInspecPresencial = vm.request.mcaReqInspeccionPresencial === 'S' ? '10' : null,
      vm.request.inspecPresencial = vm.request.mcaReqInspeccionPresencial === 'S' ? 'INSP. PRESENCIAL' : null
      vm.newSource = !!response.sourceId;
      vm.request.item = response.items[0];
      vm.request.creationDate = moment(response.items[0].riskCreationDate).toDate();
      vm.request.agentRequest = response.agentRequestId + ' - ' + response.agentRequestName;
      vm.request.vehicleFull =
        vm.request.item.vehicleBrand + ' / ' + vm.request.item.vehicleModel;
      vm.formData = {
        confirmationEmail: vm.request.confirmationEmail,
        mFechaSolicitud: ng.copy(vm.request.creationDate),
        mFechaSolicitudFormated: $filter('date')(vm.request.creationDate, 'shortTime')
      };
      vm.isFleet = vm.request.requestTypeCode === '2';
    }

    function queryTypes() {
      inspecFactory.common.getRequestType(true).then(function(response) {
        vm.formData.requestType = _.find(response, function(value) {
          return value.parameterId === +vm.request.requestTypeCode;
        });

        inspecFactory.common.getInspectionType(true).then(function(response) {
          vm.formData.inspectionType = _.find(response, function(value) {
            return value.parameterId === +vm.request.inspectionTypeCode;
          });
          if(vm.request.isAutoInspection) vm.formData.inspectionType.description = "AUTOINSPECCIÓN"
          initForm();
        });
      });
    }

    function initForm() {
      if ($stateParams.tab) {
        switch ($stateParams.tab) {
          case 'alerts':
            vm.activeTab = 3;
            vm.showTabs = true;
            break;
          case 'program':
            doProgram();
            break;
          case 'showProgram':
            vm.activeTab = 2;
            vm.showTabs = true;
            break;
          default:
            vm.activeTab = 0;
            vm.showTabs = true;
        }
      } else {
        vm.showTabs = true;
        vm.activeTab = 0;
      }
    }

    function setContrator() {
      vm.originContrator = vm.request.contractor || {};
      vm.originContrator.ubigeoData = {
        mDepartamento: {},
        mProvincia: {},
        mDistrito: {}
      };
      vm.originContrator.contactName = vm.request.item.contactName;
      vm.originContrator.contactLastName = vm.request.item.contactLastName;
      vm.originContrator.contactPhone = vm.request.item.contactPhone;
      vm.originContrator.contactOfficePhone = vm.request.item.contactOfficePhone;
      vm.originContrator.contactCelphone = vm.request.item.contactCelphone;
      vm.originContrator.contactEmail = vm.request.item.contactEmail;
      vm.originContrator.vehicleBrand = vm.request.item.vehicleBrand;
      vm.originContrator.vehicleLicensePlate = vm.request.item.vehicleLicensePlate;
      vm.originContrator.vehicleModel = vm.request.item.vehicleModel;
      vm.originContrator.vehicleYear = vm.request.item.vehicleYear;
      vm.originContrator.ubigeoData.mDepartamento.Codigo = vm.request.item.departmentId;
      vm.originContrator.ubigeoData.mProvincia.Codigo = vm.request.item.provinceId;
      vm.originContrator.ubigeoData.mDistrito.Codigo = vm.request.item.districtId;
    }

    function doProgram() {
      vm.programming = true;
      $timeout(function() {
        vm.activeTab = 1;
        vm.showTabs = true;
      });
    }

    function showProgramTab() {
      return (
        (vm.request.item.riskStatusCode === '2' ||
          vm.request.item.riskStatusCode === '3' ||
          vm.request.item.riskStatusCode === '4' ||
          vm.request.item.riskStatusCode === '5') &&
        vm.event.data.inspectorId !== null
      );
    }

    function showFrustrate() {
      var riskId = ng.copy(vm.riskId);
      var request = ng.copy(vm.request);
      $uibModal
        .open({
          backdrop: true,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          size: 'lg',
          templateUrl: '/inspec/app/components/solicitudes/solicitud-detalle/modal-frustrar.html',
          controllerAs: '$ctrl',
          controller: [
            '$uibModalInstance',
            'mModalAlert',
            function($uibModalInstance, mModalAlert) {
              var vm = this;
              vm.closeModal = closeModal;
              vm.frustrate = frustrate;
              vm.$onInit = onInit;
              vm.frmFrustrate = {};

              function onInit() {
                inspecFactory.common.getFrustrateType(true).then(function(response) {
                  vm.frustrateTypes = response;
                });
              }

              function frustrate() {
                vm.frmFrustrate.markAsPristine();
                if (vm.frmFrustrate.$valid) {
                  var params = {
                    isFrustrated: true,
                    items: [
                      {
                        riskId: +request.item.riskId,
                        requestId: +request.item.requestId,
                        inspectorId: request.item.inspectorId,
                        scheduleDepartmentId: +request.item.scheduleDepartmentId,
                        scheduleProvinceId: +request.item.scheduleProvinceId,
                        scheduleDistrictId: +request.item.scheduleDistrictId,
                        contactAddress: request.item.contactAddress,
                        contactReference: request.item.contactReference,
                        vehicleLicensePlate: request.item.vehicleLicensePlate,
                        observations: request.item.observations
                      }
                    ]
                  };

                  inspecFactory.schedule.addSchedule(params, true).then(function() {
                    var alert = {
                      RiskId: +riskId,
                      AlertTypeCode: '2',
                      AlertStatusCode: '2',
                      AlertMessage:
                        vm.frmFrustrate.mMotivo.parameterId === 6
                          ? vm.frmFrustrate.mDescripcion
                          : vm.frmFrustrate.mMotivo.description,
                      UserRoleTarget: 'SOLICITANTE',
                      SendTypeCode: 'A',
                      SendEmailCode: 'S',
                      IsFrustratedCode: 'S',
                      FrustrateId: vm.frmFrustrate.mMotivo.parameterId
                    };
                    closeModal();
                    inspecFactory.requests.addAlert(alert, true).then(function() {
                      mModalAlert.showSuccess('Solicitud frustrada exitosamente', '').then(function() {
                        $state.go('programaciones');
                      });
                    });
                  });
                }
              }

              function closeModal() {
                $uibModalInstance.close();
              }
            }
          ]
        })
        .result.then(
          function() {
            //  todo
          },
          function() {
            //  todo
          }
        );
    }

    function showReprogram() {
      mModalConfirm
        .confirmInfo('¿Está seguro que quieres reprogramar la inspección?', 'REPROGRAMAR INSPECCIÓN', 'REPROGRAMAR')
        .then(function() {
          var params = {};
          params.items = [
            {
              riskId: +vm.request.item.riskId,
              requestId: +vm.request.item.requestId,
              inspectorId: vm.request.item.inspectorId,
              scheduleDepartmentId: +vm.request.item.scheduleDepartmentId,
              scheduleProvinceId: +vm.request.item.scheduleProvinceId,
              scheduleDistrictId: +vm.request.item.scheduleDistrictId,
              contactAddress: vm.request.item.contactAddress,
              contactReference: vm.request.item.contactReference,
              reScheduledCode: 'S',
              vehicleLicensePlate: vm.request.item.vehicleLicensePlate,
              observations: vm.request.item.observations
            }
          ];
          inspecFactory.schedule.addSchedule(params, true).then(function() {
            $state.go('solicitudesDetalle', {requestId: vm.requestId, riskId: vm.riskId, tab: 'program'});
          });
        });
    }

    function showEditContacto() {
      var selectedContact = ng.copy(vm.originContrator);
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
              vm.onlyEditContact = true;

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

    function updateContact(newData) {
      var request = {
        items: [
          {
            requestId: vm.request.item.requestId,
            riskId: vm.request.item.riskId,
            contactName: newData.contactName.toUpperCase(),
            contactLastName: newData.contactLastName.toUpperCase(),
            contactPhone: newData.contactPhone,
            contactOfficePhone: newData.contactOfficePhone,
            contactCelphone: newData.contactCelphone,
            contactEmail: newData.contactEmail.toUpperCase(),
            vehicleBrand: newData.vehicleBrand,
            vehicleLicensePlate: newData.vehicleLicensePlate,
            vehicleModel: newData.vehicleModel,
            vehicleYear: newData.vehicleYear,
            departmentId: newData.ubigeoData.mDepartamento.Codigo,
            provinceId: newData.ubigeoData.mProvincia.Codigo,
            districtId: newData.ubigeoData.mDistrito.Codigo
          }
        ]
      };

      inspecFactory.requests
        .updateRequest(request)
        .then(function() {
          vm.request.item = ng.extend(vm.request.item, request.items[0]);
          setContrator();
          if (!vm.isFleet) {
            vm.formData.contractorData.mCelular = vm.originContrator.contactCelphone;
            vm.formData.contractorData.mTelfPersonal = vm.originContrator.contactPhone;
            vm.formData.contractorData.mEmailPersonal = vm.originContrator.contactEmail;
          }
        })
        .catch(function(error) {
          ErrorHandlerService.handleError(error.data);
        });
    }

    function doCreateInspection() {
      $state.go('inspeccionRegistro', {requestId: vm.requestId, riskId: vm.riskId});
    }

    function goToInspection() {
      $state.go('inspeccionRegistro', {
        requestId: vm.requestId,
        riskId: vm.riskId
      });
    }
  }

  return ng
    .module('appInspec')
    .controller('SolicitudDetalleController', solicitudDetalleController)
    .component('inspecSolicitudDetalle', {
      templateUrl: '/inspec/app/components/solicitudes/solicitud-detalle/solicitud-detalle.html',
      controller: 'SolicitudDetalleController',
      controllerAs: '$ctrl'
    });
});
