'use strict';

define(['angular', 'moment'], function(ng, moment) {
  scheduleController.$inject = [

    '$log',
    '$scope',
    '$state',
    '$filter',
    '$uibModal',
    'mModalAlert',
    '$rootScope',
    'inspecFactory',
    'ErrorHandlerService'
  ];

  function scheduleController(
    $log,
    $scope,
    $state,
    $filter,
    $uibModal,
    mModalAlert,
    $rootScope,
    inspecFactory,
    ErrorHandlerService
  ) {
    var vm = this;
    vm.$onInit = onInit;
    vm.selectAll = selectAll;
    vm.selectOne = selectOne;
    vm.today = moment().format('DD/MM/YYYY');
    vm.initColor = 'FCEB7C';
    vm.endColor = '583727';

    function onInit() {
      vm.selectedInspectors = [];
      queryInspectors();
    }

    function queryCalendar(startDate, endDate) {
      clearConcurrency();
      var params = {
        StartDateTime: startDate,
        EndDateTime: endDate
      };

      params.inspectors = vm.selectedInspectors.length > 0 ? getInspectors() : null;

      inspecFactory.schedule.getInspectorsAvailability(params, true).then(
        function(response) {
          if (ng.isArray(response)) {
            vm.events = response.map(function(event) {
              if (event.riskId) {
                setConcurrency(event.inspectorId);
                return {
                  start: moment(event.scheduleDate).toDate(),
                  end: moment(event.scheduleEndDate).toDate(),
                  backgroundColor: getInspectorColor(event.inspectorId),
                  data: {
                    phone: event.phone,
                    contact: event.contactName + ' ' + event.contactLastName,
                    address: event.department + ' / ' + event.province + ' / ' + event.district,
                    vehicle: event.vehicleBrand + ' / ' + event.vehicleModel + ' / ' + event.vehicleLicensePlate,
                    inspector: event.inspectorFullName,
                    inspectorId: event.inspectorId,
                    date: moment(event.scheduleDate).toDate()
                  }
                };
              } else {
                return {
                  start: moment(event.scheduleDate).toDate(),
                  end: moment(event.scheduleEndDate).toDate(),
                  backgroundColor: '#8f8f8f',
                  title: event.permissionAllowedReason + ': ' + event.inspectorFullName,
                  data: {
                    permission: true,
                    inspector: event.inspectorFullName,
                    inspectorId: event.inspectorId,
                    permissionEndDate: event.scheduleEndDate,
                    permissionStartDate: event.scheduleDate
                  }
                };
              }
            });
          }
        },
        function() {
          vm.events = [];
        }
      );
    }

    $scope.$on('permissionAgent', function(e, a) {
      var isEditing = ng.isDefined(a);
      var selectedInspectors = ng.copy(vm.selectedInspectors);
      if (isEditing) {
        var data = ng.copy(a.calEvent);
      }
      var vModal = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        size: 'lg',
        templateUrl: '/inspec/app/_app/common/calendar/modal-no-disponibilidad.html',
        controllerAs: '$ctrl',
        controller: [
          '$uibModalInstance',
          'mModalConfirm',
          function($uibModalInstance, mModalConfirm) {
            var vm = this;
            vm.closeModal = closeModal;
            vm.$onInit = onInit;
            vm.formData = {};
            vm.formData.mInspector = {};
            vm.selectProvider = selectProvider;
            vm.savePermission = savePermission;
            vm.editPermission = editPermission;
            vm.removePermission = removePermission;

            function onInit() {
              vm.minDate = moment().toDate();
              vm.isEditing = isEditing;
              vm.currentAgentPermissions = [];
              inspecFactory.common.getPermission().then(function(response) {
                vm.permissions = response;
              });

              inspecFactory.common
                .GetProviders(true)
                .then(function(response) {
                  return response.map(function(element) {
                    return {
                      name: element.providerName,
                      document: {
                        type: element.documentType,
                        code: element.documentCode
                      }
                    };
                  });
                })
                .then(function(providers) {
                  vm.providers = providers;
                });

              queryInspectorsInner();

              if (vm.isEditing) {
                vm.formData.mFechaInicio = data.start.toDate();
                vm.formData.mFechaFin = data.end.toDate();
                vm.formData.mInspector.inspectorId = data.data.inspectorId;
                vm.formData.mObsevaciones = data.data.permissionAllowedObservation;
              } else {
                vm.formData.mFechaInicio = new Date();
                if (selectedInspectors.length) {
                  if (selectedInspectors.length === 1) {
                    vm.formData.mInspector.inspectorId = selectedInspectors[0];
                  }
                }
              }
            }

            function editPermission(permision) {
              vm.oldFormData = ng.copy(vm.formData);
              vm.oldCurrentAgentPermissions = ng.copy(vm.currentAgentPermissions);
              vm.isEditPermission = true;
              vm.currentAgentPermissions = [];
              vm.formData.mFechaInicio = permision.startDate;
              vm.formData.mFechaFin = permision.endDate;
              vm.formData.mInspector.inspectorId = permision.inspectorId;
              vm.formData.mObsevaciones = permision.observations;
              vm.formData.mMotivo.parameterId = permision.reasonId;
            }

            function removePermission(permission) {
              mModalConfirm
                .confirmInfo(
                  '¿Está seguro de querer eliminar la siguiente no disponibilidad?',
                  'ELIMINAR NO DISPONIBILIDAD',
                  'ELIMINAR'
                )
                .then(function() {
                  return inspecFactory.schedule.deleteJournal(permission, true).then(function() {
                    _listPermission();
                  });
                });
            }

            function queryInspectorsInner(type, nro) {
              inspecFactory.common
                .searchInspectors(type, nro)
                .then(
                  function(response) {
                    return response.map(function(element) {
                      return {
                        fullName:
                          element.name +
                          ' ' +
                          (element.lastName ? element.lastName : '') +
                          ' ' +
                          (element.motherLastName ? element.motherLastName : ''),
                        inspectorId: element.inspectorId
                      };
                    });
                  },
                  function() {
                    return [];
                  }
                )
                .then(function(inspectors) {
                  vm.inspectors = inspectors;
                });
            }

            function selectProvider(proveedor) {
              if (proveedor.document) {
                queryInspectorsInner(proveedor.document.type, proveedor.document.code);
              } else {
                queryInspectorsInner();
              }
            }

            function closeModal(params) {
              $uibModalInstance.close(params);
            }

            function savePermission() {
              if (validateForm()) {
                var journal = {
                  inspectorId: vm.formData.mInspector.inspectorId,
                  reasonId: vm.formData.mMotivo.parameterId,
                  startDate: moment(vm.formData.mFechaInicio).format(),
                  endDate: moment(vm.formData.mFechaFin).format(),
                  observations: vm.formData.mObsevaciones
                };
                inspecFactory.schedule.addJournal(journal, true).then(
                  function() {
                    closeModal(true);
                    mModalAlert.showSuccess('Inspector bloqueado exitosamente', '');
                  },
                  function(e) {
                    vm.hasError = e.data.data.message;
                  }
                );
              }
            }

            function validateForm() {
              vm.frmProgram.markAsPristine();
              return vm.frmProgram.$valid;
            }

            function _listPermission() {
              var request = {
                InspectorId: vm.formData.mInspector,
                StartDate: moment().format('YYYY-MM-DD[T00:00:00-05:00]')
              };
              inspecFactory.schedule
                .listPermission(request, true)
                .then(function(response) {
                  vm.currentAgentPermissions = response;
                })
                .catch(function() {
                  vm.currentAgentPermissions = [];
                });
            }
            $scope.$watch(
              function() {
                return vm.formData.mFechaInicio;
              },
              function(newValue, oldValue) {
                var canProceed = moment(newValue).isBefore(moment(vm.minDate));
                if (canProceed && newValue !== oldValue) {
                  vm.formData.mFechaInicio = vm.minDate;
                } else {
                  vm.formData.mFechaFin = moment(newValue)
                    .add(30, 'minutes')
                    .toDate();
                }
              },
              true
            );

            $scope.$watch(
              function() {
                return vm.formData.mFechaFin;
              },
              function(newValue) {
                var canProceed = moment(newValue).isAfter(
                  moment(vm.formData.mFechaInicio)
                    .add(29, 'minutes')
                    .toDate()
                );
                if (!canProceed) {
                  vm.formData.mFechaFin = moment(vm.formData.mFechaInicio)
                    .add(30, 'minutes')
                    .toDate();
                }
              },
              true
            );

            $scope.$watch(
              function() {
                return vm.formData.mInspector;
              },
              function(newValue) {
                if (newValue && newValue.inspectorId) {
                  _listPermission();
                }
                if (newValue && newValue.inspectorId === null) {
                  vm.currentAgentPermissions = [];
                }
              }
            );
          }
        ]
      });
      vModal.result.then(
        function(params) {
          if (params) {
            queryInspectors();
          }
        },
        function() {
          //  todo
        }
      );
    });

    $scope.$on('programRequest', function(e, a) {
      var data = ng.copy(a);
      var inspectors = ng.copy(vm.inspectors);
      var selectedInspectors = ng.copy(vm.selectedInspectors);
      var riskId = ng.copy(vm.riskId);
      var requestId = ng.copy(vm.requestId);
      var licensePlate = ng.copy(vm.licensePlate);
      var reScheduledCode = ng.copy(vm.reScheduledCode);
      var modal = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        size: 'lg',
        templateUrl: '/inspec/app/_app/common/calendar/modal-programar.html',
        controllerAs: '$ctrl',
        controller: [
          '$scope',
          '$uibModalInstance',
          function($scope, $uibModalInstance) {
            var vm = this;
            vm.minDate = moment().toDate();
            vm.formData = {};
            vm.formData.mInspector = {};
            vm.formData.mFechaInicio = data.startDate;
            vm.formData.mFechaFin = data.endDate;
            vm.closeModal = closeModal;
            vm.showNextModalFleet = showNextModalFleet;
            vm.programRequest = programRequest;
            vm.inspectors = inspectors;
            vm.requestId = requestId;
            vm.riskId = riskId;

            if (selectedInspectors.length >= 1) {
              vm.inspectors = inspectors.filter(function(inspector) {
                return selectedInspectors.includes(inspector.inspectorId);
              });
              if (selectedInspectors.length === 1) {
                vm.formData.mInspector.inspectorId = selectedInspectors[0];
              }
            }

            function closeModal() {
              $uibModalInstance.close();
            }

            function getFleetAlerts() {
              return inspecFactory.requests.getFleetForAlerts(vm.requestId, true).then(function(response) {
                return response.data
              });
            }

            function showNextModalFleet() {
              if (validateForm()) {
                getFleetAlerts().then(function(associedFleet) {
                  vm.formData.associedFleet = associedFleet;
                  $uibModalInstance.close(vm.formData);
                });
              }
            }

            function programRequest() {
              if (validateForm()) {
                var params = {};
                params.items = [
                  {
                    riskId: +riskId,
                    requestId: +requestId,
                    inspectorId: vm.formData.mInspector.inspectorId,
                    scheduleDate: moment(vm.formData.mFechaInicio).format(),
                    scheduleDepartmentId: vm.formData.ubigeoData.mDepartamento.Codigo,
                    scheduleProvinceId: vm.formData.ubigeoData.mProvincia.Codigo,
                    scheduleDistrictId: vm.formData.ubigeoData.mDistrito.Codigo,
                    contactAddress: vm.formData.mDireccion,
                    contactReference: vm.formData.mReferencia,
                    reScheduledCode: reScheduledCode,
                    vehicleLicensePlate: licensePlate,
                    observations: vm.formData.mObservaciones,
                    endScheduleDate: moment(vm.formData.mFechaFin).format()
                  }
                ];

                inspecFactory.schedule.addSchedule(params, true).then(
                  function() {
                    closeModal();
                    mModalAlert.showSuccess('Solicitud programada exitosamente', '').then(function() {
                      $state.go('programaciones');
                    });
                  },
                  function(e) {
                    vm.hasError = e.data.data.message;
                  }
                );
              }
            }

            function validateForm() {
              vm.frmProgram.markAsPristine();
              vm.frmProgram.frmUbigeo.markAsPristine();
              return vm.frmProgram.$valid && vm.frmProgram.frmUbigeo.$valid;
            }

            $scope.$watch(
              function() {
                return vm.formData.mFechaInicio;
              },
              function(newValue, oldValue) {
                vm.hasError = false;
                var canProceed = moment(newValue).isBefore(moment(vm.minDate));
                if (canProceed && newValue !== oldValue) {
                  vm.formData.mFechaInicio = vm.minDate;
                } else {
                  vm.formData.mFechaFin = moment(newValue)
                    .add(30, 'minutes')
                    .toDate();
                }
              },
              true
            );

            $scope.$watch(
              function() {
                return vm.formData.mFechaFin;
              },
              function(newValue) {
                vm.hasError = false;
                var isAfter29Minutes = moment(newValue).isAfter(
                  moment(vm.formData.mFechaInicio)
                    .add(29, 'minutes')
                    .toDate()
                );
                var isBefore1Hour = moment(newValue).isBefore(
                  moment(vm.formData.mFechaInicio)
                    .add(1, 'hours')
                    .toDate()
                );

                if (!isAfter29Minutes) {
                  vm.formData.mFechaFin = moment(vm.formData.mFechaInicio)
                    .add(30, 'minutes')
                    .toDate();
                }
                if (!isBefore1Hour) {
                  vm.formData.mFechaFin = moment(vm.formData.mFechaInicio)
                    .add(1, 'hours')
                    .toDate();
                }
              },
              true
            );
          }
        ]
      });
      modal.result.then(function(formData) {
        if (formData) {
          $uibModal
            .open({
              backdrop: true,
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              size: 'lg',
              templateUrl: '/inspec/app/_app/common/modals/modal-replicate.html',
              controllerAs: '$ctrl',
              controller: 'ModalReplicateController',
              resolve: {
                modalTitle: function() {
                  return 'PROGRAMAR INSPECCIÓN';
                },
                buttonText: function() {
                  return 'PROGRAMAR';
                },
                associedFleet: function() {
                  return formData.associedFleet;
                },
                selectedRequests: function() {
                  return [];
                },
                riskId: function() {
                  return vm.riskId.toString();
                }
              }
            })
            .result.then(function(toProgram) {
              if (!toProgram) return
              var items = [];
              ng.forEach(toProgram, function(currentRiskId) {
                var item = {
                  riskId: +currentRiskId,
                  requestId: +requestId,
                  inspectorId: formData.mInspector.inspectorId,
                  scheduleDate: moment(formData.mFechaInicio).format(),
                  scheduleDepartmentId: formData.ubigeoData.mDepartamento.Codigo,
                  scheduleProvinceId: formData.ubigeoData.mProvincia.Codigo,
                  scheduleDistrictId: formData.ubigeoData.mDistrito.Codigo,
                  contactAddress: formData.mDireccion,
                  contactReference: formData.mReferencia,
                  reScheduledCode: reScheduledCode,
                  vehicleLicensePlate: _getLicensePlateByRiskId(formData.associedFleet, +currentRiskId),
                  observations: formData.mObservaciones,
                  endScheduleDate: moment(formData.mFechaFin).format()
                };
                items.push(item);
              });
              var params = {};
              params.items = items;
              inspecFactory.schedule.addSchedule(params, true).then(
                function() {
                  mModalAlert.showSuccess('Solicitud programada exitosamente', '').then(function() {
                    $state.go('programaciones');
                  });
                },
                function(e) {
                  ErrorHandlerService.handleError(e.data.data.message);
                }
              );
            });
        }
      });
      modal.closed.then(function() {
        $rootScope.$broadcast('unselect');
      });
    });

    function _getLicensePlateByRiskId(associedFleet, riskId) {
      return _.find(associedFleet, function flpbyr(item) {
        return item.riskId === riskId;
      }).vehicleLicensePlate;
    }

    $scope.$on('changedDates', function(e, args) {
      vm.args = args;
      queryCalendar(args.startDate, args.endDate);
    });

    $scope.$on('eventClick', function(e, args) {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        size: 'lg',
        templateUrl: '/inspec/app/_app/common/calendar/modal-detalle.html',
        controller: [
          '$scope',
          '$location',
          '$uibModalInstance',
          function($scope, $location, $uibModalInstance) {
            var vm = this;
            vm.closeModal = closeModal;
            vm.data = args.calEvent.data;

            function closeModal() {
              $uibModalInstance.close();
            }
          }
        ],
        controllerAs: '$ctrl'
      });
    });

    function getInspectors() {
      if (vm.selectedInspectors.length > 0) {
        return vm.selectedInspectors.join(',');
      } else {
        return null;
      }
    }

    function queryInspectors() {
      inspecFactory.common.getInspectorSchedule(true).then(function(response) {
        response.map(function(entry) {
          entry.fullName =
            entry.documentType === 'RUC' && entry.documentCode.startsWith('2')
              ? entry.name
              : (entry.name || '-') + ' ' + (entry.lastName || '-') + ' ' + (entry.motherLastName || '-');
          return entry;
        });
        vm.inspectors = response;
        setColorsInspector();
        vm.loadedInspectors = true;
      });
    }

    function setConcurrency(inspectorId) {
      if (vm.inspectors) {
        var inspector = vm.inspectors.find(function(inspector) {
          return inspector.inspectorId === inspectorId;
        });
        if (inspector) {
          inspector.concurrency = ng.isUndefined(inspector.concurrency) ? 1 : inspector.concurrency + 1;
        }
      }
    }

    function setColorsInspector() {
      for (var i = 0; i < vm.inspectors.length; i++) {
        var percent = i * 1 / vm.inspectors.length;
        var ratio = Math.round(percent * 100) / 100;
        var r = Math.ceil(
          parseInt(vm.initColor.substring(0, 2), 16) * ratio + parseInt(vm.endColor.substring(0, 2), 16) * (1 - ratio)
        );
        var g = Math.ceil(
          parseInt(vm.initColor.substring(2, 4), 16) * ratio + parseInt(vm.endColor.substring(2, 4), 16) * (1 - ratio)
        );
        var b = Math.ceil(
          parseInt(vm.initColor.substring(4, 6), 16) * ratio + parseInt(vm.endColor.substring(4, 6), 16) * (1 - ratio)
        );
        vm.inspectors[i].color = '#' + toHex(r) + toHex(g) + toHex(b);
      }
    }

    function toHex(x) {
      x = x.toString(16);
      return x.length === 1 ? '0' + x : x;
    }

    function getInspectorColor(inspectorId) {
      if (vm.inspectors) {
        var inspector = vm.inspectors.find(function(inspector) {
          return inspector.inspectorId === inspectorId;
        });
        if (inspector) {
          return inspector.color;
        } else {
          return '#CCCCCC';
        }
      } else {
        return '#CCCCCC';
      }
    }

    function selectAll(collection) {
      if (vm.selectedInspectors.length >= 0 && vm.selectedInspectors.length !== vm.inspectors.length) {
        ng.forEach(collection, function(value) {
          var found = vm.selectedInspectors.indexOf(value.inspectorId);
          if (found === -1) {
            vm.selectedInspectors.push(value.inspectorId);
          }
        });
        checkAll();
      } else {
        unCheckAll();
        vm.selectedInspectors = [];
      }
      queryCalendar(vm.args.startDate, vm.args.endDate);
    }

    function unCheckAll() {
      ng.forEach(vm.selectedInspectors, function(value) {
        var found = vm.inspectors.find(function(inspector) {
          return value === inspector.inspectorId;
        });
        if (found) {
          found.checked = false;
        }
      });
    }

    function checkAll() {
      ng.forEach(vm.selectedInspectors, function(value) {
        var found = vm.inspectors.find(function(inspector) {
          return value === inspector.inspectorId;
        });
        if (found) {
          found.checked = true;
        }
      });
    }

    function selectOne(id) {
      var found = vm.selectedInspectors.indexOf(id);
      if (found === -1) {
        vm.selectedInspectors.push(id);
      } else {
        vm.selectedInspectors.splice(found, 1);
      }
      queryCalendar(vm.args.startDate, vm.args.endDate);
    }

    function clearConcurrency() {
      ng.forEach(vm.inspectors, function(value) {
        value.concurrency = 0;
      });
    }
    function getRangeTime(){
      var time = vm.deliveryTime
      if (time && angular.isString(time)){
        var p = time.split('-');
        if (p.length >= 2){
          var from = getTime(p[0]);
          var to = getTime(p[1]);
          if (from && to)
            return 'de ' + $filter('date')(from, 'hh:mm a') + ' a ' + $filter('date')(to, 'hh:mm a');
          if (from || to)
            return $filter('date')(from || to, 'hh:mm a')
        }
        else if (p.length == 1){
          var tm = getTime(p[0]);
          if (tm){
            return $filter('date')(tm, 'hh:mm a')
          }
        }
      }
    }
    vm.getRangeTime = getRangeTime;
    function getTime(time){
      var p = time.split(":")
      var h = /^([0-9]|0[0-9]|1[0-9]|2[0-4])$/
      var m = /^([0-9]|0[0-9]|[1-5][0-9]|60)$/
      if (p.length == 2 && h.test(p[0]) && m.test(p[1])  ){
        var d = new Date();
        d.setHours(p[0]); d.setMinutes(p[1]);
        return d;
      }
    }
    $scope.$watchCollection(
      function() {
        return vm.selectedInspectors;
      },
      function(newVal) {
        vm.isAllSelected = vm.inspectors && newVal.length === vm.inspectors.length;
      }
    );
  }

  return ng
    .module('appInspec')
    .controller('ScheduleController', scheduleController)
    .component('inspecSchedule', {
      templateUrl: '/inspec/app/_app/common/schedule/schedule.html',
      controller: 'ScheduleController',
      controllerAs: '$ctrl',
      bindings: {
        canProgram: '=',
        isFleet: '=?',
        riskId: '=?',
        requestId: '=?',
        licensePlate: '=?',
        reScheduledCode: '=?',
        deliveryDate: "=?",
        deliveryTime: "=?"
      }
    });
});
