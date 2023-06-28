define([
    'angular',
    'constants',
    'coreConstants',
    'generalConstants',
    'massAmdUtils'
  ], function(angular, constants, coreConstants, generalConstants, massAmdUtils) {
    var appAutos = angular.module(coreConstants.ngMainModule);
    appAutos.controller('massAdmMassDetailController', 
    ['$scope', '$state', '$window', 'mModalAlert', 'mModalConfirm', 'MassMaintenanceFactory', 'MassItemService',
    function($scope, $state, $window, mModalAlert, mModalConfirm, MassMaintenanceFactory, MassItemService) {
      var vm = this;
      var title = 'Misa No. ';
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
      vm.dataItem = MassItemService.getCurrentMassItem();

      vm.addNewDeceased = addNewDeceased;
      vm.showDeceased = showDeceased;
      vm.save = save;
      vm.cancel = cancel;
      vm.cancelEdit = cancelEdit;
      vm.anular = anular;
      vm.deleteDeceased = deleteDeceased;
      vm.saveDeceased = saveDeceased;
      vm.handleEdit = handleEdit;
      vm.cancelUpdateMisa = cancelUpdateMisa;
      
      vm.dateTimeValid = dateTimeValid;


      vm.validateDateTimeTransmision = validateDateTimeTransmision;
      vm.validateDateTimeAccess = validateDateTimeAccess;
      vm.validateDateTimeEndAccess = validateDateTimeEndAccess;

      vm.frm = vm.frm || {};


      function onInit() {
        $scope.format = 'dd/MM/yyyy';
        $scope.minDate = thisDay;
        validateReadonly();
      }

      function showDeceased() {
        vm.newDeceased = {};
        vm.showAddDeceased = !vm.showAddDeceased;
      }

      function cancel(p) {
        // $state.go("massAdmTray");
        $window.history.back();
      }

      function cancelEdit(item) {
        item.edit = false;
      }

      function anular() {
        mModalConfirm.confirmWarning('¿Está seguro de anular la misa?', 'Anular Misa', '')
        .then(function (response) {
          reqBody = { estado: { codigo: '4' } };

          MassMaintenanceFactory.UpdateMass(vm.dataItem.idMisa, reqBody, true)
          .then(function(res) {
            if (!res.success) {
              mModalAlert.showError(res.mensaje, 'Error').then(function() {
                return void 0;
              });
            } else {
              MassItemService.getMassById(vm.dataItem.idMisa, true).then(function(res) {
                vm.dataItem = res;
                validateReadonly();
              });
            }
          }, function(err) {
            return void mModalAlert.showError('Ocurrió un error al anular la misa', 'Error');
          });
        }, function (error) { });
      }

      function addNewDeceased() {
        var obj = vm.dataItem.fallecidos.filter(function(item) {
          return item.tipoDocumento.codigo === vm.newDeceased.tipoDocumento.codigo && item.numeroDocumento === vm.newDeceased.numeroDocumento;
        });

        if(obj.length == 0) {
          addDeceased(vm.newDeceased);
          delete vm.newDeceased;
          vm.showAddDeceased = !vm.showAddDeceased;
        } else {
          mModalAlert.showError('Ya existe un fallecido con el mismo n&uacute;mero de documento.', 'Error');
        }
      }

      function saveDeceased(item) {
        reqBody = {
          idFallecido: item.idFallecido,
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
        
        MassMaintenanceFactory.UpdateDeceased(vm.dataItem.idMisa, reqBody, true)
        .then(function(res) {
          if (!res.success) {
            mModalAlert.showError(res.mensaje, 'Error').then(function() {
              return void 0;
            });
          } else {
            MassItemService.getMassById(vm.dataItem.idMisa, true).then(function(res) {
              vm.dataItem = res;
            });
            // return void mModalAlert.showSuccess('El registro se modificó satisfactoriamente', 'Modificar Fallecido');
          }
        }, function(err) {
          return void mModalAlert.showError('Ocurrió un error al mofificar al fallecido', 'Error');
         });
      }

      function deleteDeceased(arg) {
        mModalConfirm.confirmWarning('¿Esta seguro de eliminar el fallecido?', 'Eliminar fallecido', '')
        .then(function (response) {
          MassMaintenanceFactory.DeleteDeceased(vm.dataItem.idMisa, arg.idFallecido, true)
          .then(function(res) {
            
            if (!res.success) {
              mModalAlert.showError(res.mensaje, 'Error').then(function() {
                return void 0;
              });
            } else {
              MassItemService.getMassById(vm.dataItem.idMisa, true).then(function(res) {
                vm.dataItem = res;
              });
              // return void mModalAlert.showSuccess('El registro se eliminó satisfactoriamente', 'Eliminar Fallecido');
            }
          }, function(err) {
            return void mModalAlert.showError('Ocurrió un error al eliminar el fallecido', 'Error');
          });
        }, function (error) { });
      }

      function handleEdit() {
        vm.dataItem.edit = true;

        vm.frm = JSON.parse(JSON.stringify(vm.dataItem));
        vm.frm.fechaIniTransmision = new Date(vm.dataItem.fechaMisa);
        vm.frm.fechaAcceso = new Date(vm.dataItem.fechaInicioUrl);
        vm.frm.fechaFinAcceso = new Date(vm.dataItem.fechaFinUrl);
        vm.frm.horaIniTransmision = angular.copy(vm.dataItem.horaMisa);
        vm.frm.horaAcceso = angular.copy(vm.dataItem.horaInicioUrl);
        vm.frm.horaFinAcceso = angular.copy(vm.dataItem.horaFinUrl);
      }

      function save() {
        if(!$scope.frmUpdateMass.$valid) {
          return void mModalAlert.showError('Algunos datos no son v&aacute;lidos', 'Error');
        }

        var valid = true;

        if(!massAmdUtils.dateTimeValid(vm.frm.fechaIniTransmision, vm.frm.horaIniTransmision)) {
          delete vm.frm.fechaIniTransmision;
          delete vm.frm.horaIniTransmision;
          valid = false;
        }

        if(!massAmdUtils.dateTimeValid(vm.frm.fechaAcceso, vm.frm.horaAcceso)) {
          delete vm.frm.fechaAcceso;
          delete vm.frm.horaIniTransmision;
          valid = false;
        }

        if(!massAmdUtils.dateTimeValid(vm.frm.fechaFinAcceso, vm.frm.horaFinAcceso)) {
          delete vm.frm.fechaFinAcceso;
          delete vm.frm.horaFinAcceso;
          valid = false;
        }

        if(!valid) {
          return;
        }

        reqBody = JSON.parse(JSON.stringify(vm.frm));
        reqBody.fechaMisa = vm.frm.fechaIniTransmision;
        reqBody.horaMisa = vm.frm.horaIniTransmision;
        reqBody.fechaInicioUrl = vm.frm.fechaAcceso;
        reqBody.horaInicioUrl = vm.frm.horaAcceso;
        reqBody.fechaFinUrl = vm.frm.fechaFinAcceso;
        reqBody.horaFinUrl = vm.frm.horaFinAcceso;

        MassMaintenanceFactory.UpdateMass(vm.dataItem.idMisa, reqBody, true)
          .then(function(res) {
            if (!res.success) {
              mModalAlert.showError(res.mensaje, 'Error').then(function() {
                return void 0;
              });
            } else {
              mModalAlert.showSuccess("Misa modificada correctamente", "Modificación de Misa");

              MassItemService.getMassById(vm.dataItem.idMisa, false).then(function(res) {
                vm.dataItem = res;
              });
            }
          }, function(err) {
            return void mModalAlert.showError('Ocurrió un error al anular la misa', 'Error');
          });
      }

      function cancelUpdateMisa() {
        vm.dataItem.edit = false;
      }

      function dateTimeValid(date, time) {
        return massAmdUtils.dateTimeValid(date, time);
      }

      $scope.copyToClipboard = function (name) {
        massAmdUtils.copyToClipboard(name);
      }

      function addDeceased(item) {
        reqBody =  {
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

        MassMaintenanceFactory.CreateDeceased(vm.dataItem.idMisa, reqBody, true)
        .then(function(res) {
          if (!res.success) {
            mModalAlert.showError(res.mensaje, 'Error').then(function() {
              return void 0;
            });
          } else {
            mModalAlert.showSuccess('¡FALLECIDO AGREGADO!', "Modificación de Misa");

            MassItemService.getMassById(vm.dataItem.idMisa, false).then(function(res) {
              vm.dataItem = res;
            });
          }
        }, function(err) {
          return void mModalAlert.showError('Ocurrió un error al agregar al fallecido', 'Error');
        });
      }

      function validateReadonly() {
        vm.readonly = vm.dataItem.estado.codigo !== "1";
      }

      function validateDateTimeTransmision(date, time) {
        if(!date && !time) {
          return true;
        }

        if(massAmdUtils.dateTimeValid(date, time) && massAmdUtils.dateTimeValid(date, time, $scope.dateOptionsDateTransmision.minDate)) {
          if(vm.frm.fechaAcceso) {
            var startDateTransmision = massAmdUtils.getFullDate(vm.frm.fechaIniTransmision, vm.frm.horaIniTransmision || '2359');
            var accessDate = massAmdUtils.getFullDate(vm.frm.fechaAcceso, vm.frm.horaAcceso || '0000');

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
          var startDateTransmision = massAmdUtils.getFullDate(vm.frm.fechaIniTransmision, vm.frm.horaIniTransmision || '2359');
          if(!startDateTransmision) {
            return true;
          }
          var accessDate = massAmdUtils.getFullDate(vm.frm.fechaAcceso, vm.frm.horaAcceso);
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
          var transmisionDate = massAmdUtils.getFullDate(vm.frm.fechaIniTransmision, vm.frm.fechaIniTransmision || '0000');
          var endAccessDate = massAmdUtils.getFullDate(vm.frm.fechaFinAcceso, vm.frm.horaFinAcceso || '2359');
          return (transmisionDate < endAccessDate);
        } else {
          return false;
        }
      }

      $scope.$watch('$ctrl.frm.fechaIniTransmision', function(niu) {
        if(niu) {
          $scope.dateOptionsEndAccessDate.minDate = niu;

          if(vm.frm.fechaFinAcceso && (vm.frm.fechaFinAcceso < niu)) {
            delete vm.frm.fechaFinAcceso;
            delete vm.frm.horaFinAcceso;
          }
        } else {
          $scope.dateOptionsEndAccessDate.minDate = thisDay;

          if(vm.frm.horaIniTransmision) {
            delete vm.frm.horaIniTransmision;
          }
        }
      });

      $scope.$watch('$ctrl.frm.fechaAcceso', function(niu) {
        if(niu) {
            $scope.dateOptionsDateTransmision.minDate = niu;
        } else {
          $scope.dateOptionsDateTransmision.minDate = thisDay;
          delete vm.frm.horaAcceso;
        }
      });

      $scope.$watch('$ctrl.frm.fechaFinAcceso', function(niu) {
        if(!niu && vm.frm.horaFinAcceso) {
          delete vm.frm.horaFinAcceso
        }
      });

      $scope.$watch('$ctrl.frm.horaAcceso', function(niu) {
        if(niu) {
          var accessDate = massAmdUtils.getFullDate(vm.frm.fechaAcceso, vm.frm.horaAcceso || '0000');
          var endAccessDate = massAmdUtils.getFullDate(vm.frm.fechaFinAcceso, vm.frm.horaFinAcceso || '2359');
          if(endAccessDate <= accessDate) {
            delete vm.frm.fechaFinAcceso;
            delete vm.frm.horaFinAcceso;
          }
        }
      });

    }]
    );
  });