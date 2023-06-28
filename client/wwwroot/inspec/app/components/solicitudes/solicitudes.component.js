'use strict';

define(['angular', 'moment', 'lodash', 'constants'], function(ng, moment, _, constants) {
  solicitudesController.$inject = [
    'inspecConstant',
    '$scope',
    'mainServices',
    '$state',
    '$uibModal',
    'inspecFactory',
    '$rootScope',
    'UserService',
    'ErrorHandlerService',
    '$window',
    'mModalConfirm',
    'gaService'
  ];

  function solicitudesController(
    inspecConstant,
    $scope,
    mainServices,
    $state,
    $uibModal,
    inspecFactory,
    $rootScope,
    UserService,
    ErrorHandlerService,
    $window,
    mModalConfirm,
    gaService
  ) {
    var vm = this;

    vm.$onInit = onInit;
    vm.pageChanged = pageChanged;
    vm.goToAlerts = goToAlerts;
    vm.onClickCheckbox = onClickCheckbox;
    vm.downloadPDF = downloadPDF;
    vm.onClickRehabilitate = onClickRehabilitate;

    function onInit() {
      vm.user = UserService;
      vm.selectedRequests = [];
      vm.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalRecords: 0,
        mOrderBy: {Descripcion: 'Más reciente', Codigo: '1'}
      };
    }

    function handleQueryServiceResult(response) {
      var hideList = ['3', '6', '7'];
      vm.requests = response.data.map(function(element) {
        var isDefined = _.find(vm.selectedRequests, function(req) {
          return req.numero === element.nroSolicitud;
        });

        return {
          numero: element.nroSolicitud,
          numeroRiesgo: element.nroRiesgo,
          estado: element.descMcaEstadoRiesgo,
          agente: element.agente,
          proveedor: element.descProveedor,
          fecha: moment(element.fecCreaSol).toDate(),
          contacto: ((element.nombreContacto || '') + ' ' + (element.apellidosContacto || '')).trim(),
          idEstado: element.mcaEstadoSol,
          telefono1: element.telefono1,
          telefono2: element.celular,
          telefonos: ((element.telefono1 || '') + (element.celular ? ' / ' + element.celular : '')).trim(),
          vehiculo: element.marca,
          placa: element.placa,
          hasCheck: !_.contains(hideList, element.mcaEstadoSol),
          usuario: element.usrCreaSol,
          checked: isDefined ? true : false,
          idEstadoPrevio: element.previousState,
          sourceId: element.sourceId,
          inspectionId: element.inspectionId,
          canNotEmit: element.requestTypeCode === '2' || element.inspectionTypeCode === '2' || element.sourceId === 0,
          confirmationEmail: element.confirmationEmail,
          requestTypeCode: element.requestTypeCode,
          marca: element.marca,
          modelo: element.modelo,
          nroSolicitudRehabilitada: element.nroSolicitudRehabilitada,
          isAnotherInsurer: element.mcaOtraAseguradora,
          idInspecPresencial: element.mcaReqInspeccionPresencial === 'S' ? '10' : null,
          inspecPresencial: element.mcaReqInspeccionPresencial === 'S' ? 'INSP. PRESENCIAL' : null
        };
      });
      vm.firstQueryCompleted = true;
      vm.pagination.totalRecords = response.totalCount;
    }

    function doFilter(filledArguments) {
      filledArguments.pageNumber = vm.pagination.currentPage;
      filledArguments.pageSize = vm.pagination.maxSize;
      filledArguments.sort = vm.pagination.mOrderBy.Codigo;
      inspecFactory.requests.getRequests(filledArguments, true).then(function(response) {
        handleQueryServiceResult(response);
      });
    }

    function onClickCheckbox(model) {
      var index = _.findIndex(vm.selectedRequests, function(request) {
        return request === model;
      });
      if (index !== -1) {
        vm.selectedRequests.splice(index, 1);
      } else {
        vm.selectedRequests.push(model);
      }
      $scope.$broadcast('changedSelectedRequests', vm.selectedRequests.length);
    }

    $scope.$on('fullFilter', function(e, a) {
      vm.pagination.currentPage = 1;
      $rootScope.$broadcast('resetOrderBy');
      doFilter(a);
    });

    $scope.$on('filter', function(e, a) {
      doFilter(a);
    });

    $scope.$on('clearFilter', function(e, a) {
      vm.selectedRequests = [];
      vm.pagination.currentPage = 1;
      $scope.$broadcast('changedSelectedRequests', vm.selectedRequests.length);
      $rootScope.$broadcast('resetOrderBy');
      doFilter(a);
    });

    $scope.$on('showNewRequest', function() {
      var user = vm.user;
      $uibModal
        .open({
          backdrop: true,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          size: 'lg',
          templateUrl: '/inspec/app/components/solicitudes/modal-nueva-solicitud.html',
          controllerAs: '$ctrl',
          controller: [
            '$state',
            '$uibModalInstance',
            function($state, $uibModalInstance) {
              var vm = this;
              vm.closeModal = closeModal;
              vm.toNextStep = toNextStep;
              vm.tipoRegistroData = [
                {
                  description: 'Individual',
                  parameterId: 1
                },
                {
                  description: 'Flota',
                  parameterId: 2
                }
              ];
              if (user.isAPermittedObject('SOLESP')) {
                vm.tipoRegistroData.push({description: 'Especial', parameterId: 3});
              }
              vm.tipoRegistroData.push({description: 'TREC', parameterId: 4});

              function closeModal() {
                $uibModalInstance.close();
              }

              function toNextStep() {
                gaService.add({ gaCategory: 'Solicitud - INSPECCION', gaAction: 'Tipo de Registro ' + vm.mTipoRegistro.description, gaLabel: 'Botón: Confirmar Solicitud', gaValue: 'Periodo Regular' });
                if (vm.mTipoRegistro.parameterId === 1) {
                  $state.go('cotizaciones', {fromRequest: true});
                } else if (vm.mTipoRegistro.parameterId === 2) {
                  $state.go('solicitudNuevaFlota');
                } else if (vm.mTipoRegistro.parameterId === 3){
                  $state.go('solicitudNuevaEspecial');
                } else {
                  $state.go('solicitudNuevaTrec');
                }
              }
            }
          ]
        })
        .result.then(
          function() {
            //	todo
          },
          function() {
            //	todo
          }
        );
    });

    $scope.$on('showVoid', function() {
      var selectedRequests = ng.copy(vm.selectedRequests);
      $uibModal
        .open({
          backdrop: true,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          size: 'lg',
          templateUrl: '/inspec/app/components/solicitudes/modal-anular.html',
          controllerAs: '$ctrl',
          controller: [
            '$scope',
            '$uibModalInstance',
            '$uibModal',
            'mModalAlert',
            function($scope, $uibModalInstance, $uibModal, mModalAlert) {
              var vm = this;
              vm.closeModal = closeModal;
              vm.voidRequests = voidRequests;
              vm.frmAnularSolicitud = {};

              function closeModal() {
                $uibModalInstance.close();
              }

              function voidRequests() {
                vm.frmAnularSolicitud.markAsPristine();
                if (vm.frmAnularSolicitud.$valid) {
                  var values = [];
                  var requestData = {};
                  requestData.VoidReason = vm.mMotivo;
                  selectedRequests.forEach(function(solicitud) {
                    var preparedData = {
                      RiskId: solicitud.numeroRiesgo,
                      RequestId: solicitud.numero
                    };
                    values.push(preparedData);
                  });
                  requestData.Data = values;
                  inspecFactory.requests
                    .voidRequest(requestData, true)
                    .then(function() {
                      $uibModalInstance.close(true);
                      mModalAlert
                        .showSuccess('Solicitud anulada exitósamente', '')
                        .catch(function() {})
                        .then(function() {
                          $rootScope.$broadcast('callFilterFromChildren');
                          $rootScope.$broadcast('changedSelectedRequests', 0);
                        });
                    })
                    .catch(function(e) {
                      ErrorHandlerService.handleError(e);
                    });
                }
              }
            }
          ]
        })
        .result.then(function(response) {
          if (response) {
            vm.selectedRequests = [];
          }
        });
    });

    $scope.$on('showNewInspection', function() {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        templateUrl: '/inspec/app/components/solicitudes/modal-nueva-inspeccion.html',
        controllerAs: '$ctrl',
        controller: [
          '$state',
          '$scope',
          '$uibModalInstance',
          function($state, $scope, $uibModalInstance) {
            var vm = this;
            vm.$onInit = onInit;
            vm.queryAgents = queryAgents;

            vm.nextStep = nextStep;
            vm.closeModal = closeModal;
            vm.queryUser = queryUser;
            vm.setEmail = setEmail;
            vm.mNotificarA = {};

            function onInit() {
              vm.user = UserService;
              vm.optCotizacionPrevia = '1';
              vm.formData = {};
              vm.notificarAData = [
                {
                  Descripcion: 'Agente',
                  Codigo: '0'
                },
                {
                  Descripcion: 'Coordinador',
                  Codigo: '1'
                }
              ];

              if (!vm.user.isAPermittedObject('MODAGE') && !vm.user.isAPermittedObject('SINEMI')) {
                vm.mNotificarA.Codigo = '1';
              } else {
                vm.mNotificarA.Codigo = '0';
              }

              queryCoordinators();
            }

            function queryUser() {
              if (vm.formData.mAgent.CodigoAgente) {
                inspecFactory.common.getAgentById(vm.formData.mAgent.CodigoAgente, true).then(function(response) {
                  vm.userOIMData = response;
                });
              }
            }
            function setEmail() {
              if (vm.formData.mUserOIM) {
                vm.formData.mEmailConfirm = vm.formData.mUserOIM.useremail;
              }
            }

            function queryAgents(inputValue) {
              return inspecFactory.common.getAgents(inputValue).then(function(response) {
                return response.Data;
              });
            }

            function queryCoordinators() {
              var params = {
                pageNumber: 1,
                pageSize: 100
              };

              inspecFactory.management.coordinatorSearch(params, true).then(function(response) {
                vm.coordinators = response.data.map(function(record) {
                  return {
                    userid: record.userid,
                    userfullname: record.username + ' ' + record.userlastname + ' ' + record.usermotherlastname
                  };
                });
              });
            }

            function nextStep() {
              vm.formData.markAsPristine();
              if (vm.formData.$valid) {
                if (vm.optCotizacionPrevia === '1') {
                  $state.go('cotizaciones', {
                    fromInspec: true,
                    confirmationEmail: vm.formData.mEmailConfirm,
                    copyEmail: vm.formData.mEmailCopia,
                    agent: vm.formData.mAgent
                  });
                } else if (vm.optCotizacionPrevia === '0') {
                  $state.go('inspeccionNuevaSinCotizacion.steps', {
                    step: 1,
                    confirmationEmail: vm.formData.mEmailConfirm,
                    copyEmail: vm.formData.mEmailCopia,
                    agent: vm.formData.mAgent
                  });
                }
              }
            }

            function closeModal() {
              $uibModalInstance.close();
            }
          }
        ]
      });
    });

    function pageChanged() {
      $rootScope.$broadcast('callFilterFromChildren');
    }

    function goToAlerts(requestId, riskId, sourceId) {
      $state.go('solicitudesDetalle', {requestId: requestId, riskId: riskId, tab: 'alerts', source: sourceId});
    }

    function downloadPDF(req) {
      var vFileName = 'INS_'+req.inspectionId+'.pdf';
      inspecFactory.reports.downloadPdf(req.numeroRiesgo, req.inspectionId, true).then(function(res) {
        mainServices.fnDownloadFileBase64(res, 'pdf', vFileName, false);
      });
    }

    function onClickRehabilitate(requestId) {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        size: 'md',
        templateUrl: '/inspec/app/components/solicitudes/modal-rehabilitate.html',
        controller: [
          '$scope',
          '$uibModalInstance',
          function($scope, $uibModalInstance) {
            var vm = this;
            vm.closeModal = closeModal;
            vm.requestId = requestId;

            function closeModal() {
              $uibModalInstance.close();
            }
          }
        ],
        controllerAs: '$ctrl'
      });
    }
  }

  return ng
    .module('appInspec')
    .controller('SolicitudesController', solicitudesController)
    .component('inspecSolicitudes', {
      templateUrl: '/inspec/app/components/solicitudes/solicitudes.html',
      controller: 'SolicitudesController',
      controllerAs: '$ctrl'
    });
});
