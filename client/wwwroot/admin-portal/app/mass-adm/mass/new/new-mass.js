define([
    'angular',
    'constants',
    'coreConstants',
    'generalConstants',
    'massAmdUtils'
  ], function(angular, constants, coreConstants, generalConstants, massAmdUtils) {
    var appAutos = angular.module(coreConstants.ngMainModule);
    appAutos.controller('massAdmNewMassController', 
    ['MassMaintenanceFactory', '$scope', '$state', '$window', '$filter', '$timeout', 'mModalAlert',
    function(MassMaintenanceFactory, $scope, $state, $window, $filter, $timeout, mModalAlert) {
      var vm = this;
      var title = 'Nueva Misa';
      var thisDay = new Date();

      $scope.title = title;
      $scope.patternUrl = generalConstants.youTubeLinkRegEx;
      $scope.altInputFormats = ['M!/d!/yyyy'];
      $scope.mask = constants.formats.dateFormatMask;
      $scope.pattern = constants.formats.dateFormatRegex;

      var defaultDateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        showWeeks: false,
        minDate: thisDay
      };

      $scope.dateOptionsDateTransmision = angular.copy(defaultDateOptions);
      $scope.dateOptionsAccessDate = angular.copy(defaultDateOptions);
      $scope.dateOptionsEndAccessDate = angular.copy(defaultDateOptions);

      $scope.popupDateTransmision = {
        opened: false
      };

      $scope.popupAccessDate = {
        opened: false
      };

      $scope.popupEndAccessDate = {
        opened: false
      };

      $scope.openDate = function(ind) {
        switch(ind){
          case 1: $scope.popupDateTransmision.opened = true; break;
          case 2: $scope.popupAccessDate.opened = true; break;
          case 3: $scope.popupEndAccessDate.opened = true; break;
        }
      };
    
      vm.$onInit = onInit;
      vm.cancel = cancel;
      vm.edit = edit;
      vm.cancelEdit = cancelEdit;
      vm.addDeceased = addDeceased;
      vm.push = push;
      vm.save = save;
      vm.deleteItem = deleteItem;
      vm.validateDateTimeTransmision = validateDateTimeTransmision;
      vm.validateDateTimeAccess = validateDateTimeAccess;
      vm.validateDateTimeEndAccess = validateDateTimeEndAccess;

      vm.misa = vm.misa || {};

      function onInit() {
        $scope.format = 'dd/MM/yyyy';
      }

      function addDeceased() {
        vm.newDeceased = {};
        vm.showAddDeceased = !vm.showAddDeceased;
      }

      function cancel(p) {
        // $state.go("massAdmTray");
        $window.history.back();
      }

      function edit(item) {
        item.edit = true;
      }

      function cancelEdit(item) {
        item.edit = false;
      }

      function push() {
        vm.fallecidos = vm.fallecidos || [];

        var obj = vm.fallecidos.filter(function(item) {
          return item.tipoDocumento.codigo === vm.newDeceased.tipoDocumento.codigo && item.numeroDocumento === vm.newDeceased.numeroDocumento;
        });

        if(obj.length == 0) {
          vm.fallecidos.push(vm.newDeceased);
          delete vm.newDeceased;
          vm.showAddDeceased = !vm.showAddDeceased;
        } else {
          buildResponse(null, { codigo: -1, message: 'Ya existe un fallecido con el mismo n&uacute;mero de documento.' });
        }
      }

      function buildResponse(title, res) {
        if (res.codigo != coreConstants.api.successfulCode) {
          return void mModalAlert.showError(res.message, 'Error');
        }
  
        mModalAlert.showSuccess(res.message, title).then(function() {
          $state.go("massAdmTray");
        });
      }

      function save() {
        var valid = true;

        if(!massAmdUtils.dateTimeValid(vm.misa.fechaIniTransmision, vm.misa.horaIniTransmision)) {
          delete vm.misa.fechaIniTransmision;
          delete vm.misa.horaIniTransmision;
          valid = false;
        }

        if(!massAmdUtils.dateTimeValid(vm.misa.fechaAcceso, vm.misa.horaAcceso)) {
          delete vm.misa.fechaAcceso;
          delete vm.misa.horaIniTransmision;
          valid = false;
        }

        if(!massAmdUtils.dateTimeValid(vm.misa.fechaFinAcceso, vm.misa.horaFinAcceso)) {
          delete vm.misa.fechaFinAcceso;
          delete vm.misa.horaFinAcceso;
          valid = false;
        }

        if(!valid) {
          return;
        }

        fallecidos = vm.fallecidos.map(function(item, idx) {
          return {
            tipoDocumento: item.tipoDocumento.codigo,
            numeroDocumento: item.numeroDocumento,
            nombres: item.nombres,
            apellidoPaterno: item.apellidoPaterno, 
            apellidoMaterno: item.apellidoMaterno,
            pariente: {
              tipoDocumento: item.pariente.tipoDocumento.codigo,
              numeroDocumento: item.pariente.numeroDocumento,
              nombres: item.pariente.nombres,
              apellidoPaterno: item.pariente.apellidoPaterno, 
              apellidoMaterno: item.pariente.apellidoMaterno,
              correo: item.pariente.correo,
              telefono: item.pariente.telefono
            }
          };
        });

        reqBody =  {
          fechaMisa: vm.misa.fechaIniTransmision,
          horaMisa: vm.misa.horaIniTransmision,
          codigoYouTube: vm.misa.video.url,
          fechaInicioUrl: vm.misa.fechaAcceso,
          horaInicioUrl: vm.misa.horaAcceso,
          fechaFinUrl: vm.misa.fechaFinAcceso,
          horaFinUrl: vm.misa.horaFinAcceso,
          fallecidos: fallecidos
        };

        MassMaintenanceFactory.CreateMass(reqBody, true).then(function(res) {
          buildResponse('¡MISA CREADA!', res);
        });
      }

      function deleteItem(arg) {
        massAmdUtils.removeItemFromArray(vm.fallecidos, arg);
      }

      $scope.$watchCollection('$ctrl.fallecidos', function (items) {
        items = items || [];
        $scope.frmMaintenanceMass.$setValidity('count', items.length >= 1);
      });

      function validateDateTimeTransmision(date, time) {
        if(!date && !time) {
          return true;
        }

        if(massAmdUtils.dateTimeValid(date, time) && massAmdUtils.dateTimeValid(date, time, $scope.dateOptionsDateTransmision.minDate)) {
          if(vm.misa.fechaAcceso) {
            var startDateTransmision = massAmdUtils.getFullDate(vm.misa.fechaIniTransmision, vm.misa.horaIniTransmision || '2359');
            var accessDate = massAmdUtils.getFullDate(vm.misa.fechaAcceso, vm.misa.horaAcceso || '0000');

            if(!accessDate) {
              return true;
            }

            return !(startDateTransmision < accessDate);
          } else {
            return true;
          }
        } else {
          return false;
        }
      }

      function validateDateTimeAccess(date, time) {
        if(!date && !time) {
          return true;
        }

        if(massAmdUtils.dateTimeValid(date, time) && massAmdUtils.dateTimeValid(date, time, $scope.dateOptionsAccessDate.minDate)) {
          var startDateTransmision = massAmdUtils.getFullDate(vm.misa.fechaIniTransmision, vm.misa.horaIniTransmision || '2359');
          if(!startDateTransmision) {
            return true;
          }
          var accessDate = massAmdUtils.getFullDate(vm.misa.fechaAcceso, vm.misa.horaAcceso);
          return !(startDateTransmision < accessDate);
        } else {
          return false;
        }
      }

      function validateDateTimeEndAccess(date, time) {
        if(!date && !time) {
          return true;
        }

        if(massAmdUtils.dateTimeValid(date, time) && massAmdUtils.dateTimeValid(date, time, $scope.dateOptionsEndAccessDate.minDate)) {
          var transmisionDate = massAmdUtils.getFullDate(vm.misa.fechaIniTransmision, vm.misa.horaIniTransmision || '0000');
          var endAccessDate = massAmdUtils.getFullDate(vm.misa.fechaFinAcceso, vm.misa.horaFinAcceso || '2359');
          return (transmisionDate < endAccessDate);
        } else {
          return false;
        }
      }

      $scope.$watch('$ctrl.misa.fechaIniTransmision', function(niu) {
        if(niu) {
          $scope.dateOptionsEndAccessDate.minDate = niu;

          if(vm.misa.fechaFinAcceso && (vm.misa.fechaFinAcceso < niu)) {
            delete vm.misa.fechaFinAcceso;
            delete vm.misa.horaFinAcceso;
          }
        } else {
          $scope.dateOptionsEndAccessDate.minDate = thisDay;

          if(vm.misa.horaIniTransmision) {
            delete vm.misa.horaIniTransmision;
          }
        }
      });

      $scope.$watch('$ctrl.misa.fechaAcceso', function(niu) {
        if(niu) {
            $scope.dateOptionsDateTransmision.minDate = niu;
        } else {
          $scope.dateOptionsDateTransmision.minDate = thisDay;
          delete vm.misa.horaAcceso;
        }
      });

      $scope.$watch('$ctrl.misa.fechaFinAcceso', function(niu) {
        if(!niu && vm.misa.horaFinAcceso) {
          delete vm.misa.horaFinAcceso
        }
      });

      $scope.$watch('$ctrl.misa.horaAcceso', function(niu) {
        if(niu) {
          var accessDate = massAmdUtils.getFullDate(vm.misa.fechaAcceso, vm.misa.horaAcceso || '0000');
          var endAccessDate = massAmdUtils.getFullDate(vm.misa.fechaFinAcceso, vm.misa.horaFinAcceso || '2359');
          if(endAccessDate <= accessDate) {
            delete vm.misa.fechaFinAcceso;
            delete vm.misa.horaFinAcceso;
          }
        }
      });

    }]
    );
  });