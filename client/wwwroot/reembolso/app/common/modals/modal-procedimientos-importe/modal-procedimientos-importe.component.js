'use strict';

define(['angular', 'lodash'], function (ng, _) {
  ReProcedimientosImporteModalController.$inject = ['reFactory', '$q', 'mModalAlert', '$log', 'reServices'];

  function ReProcedimientosImporteModalController(reFactory, $q, mModalAlert, $log, reServices) {
    var vm = this;
    vm.$onInit = onInit;
    vm.cerrar = cerrar;
    vm.getDiagnosticList = getDiagnosticList;
    vm.sendResumenProcedures = sendResumenProcedures;
    vm.onChangeTreatmentDate = onChangeTreatmentDate;
    vm.onChangeDiagnostic = onChangeDiagnostic;
    vm.onChangeSumImports = onChangeSumImports;
    vm.onChangeFarmacoImport = onChangeFarmacoImport;
    vm.addFarmaco = addFarmaco;
    vm.deleteFarmaco = deleteFarmaco;

    // functions declaration

    function onInit() {
      vm.medicCode = 6;
      vm.farmacosList = [];

      vm.itemsList = _setTreatmentDateAndFarmacosToProcedures(vm.proceduresList);
      vm.sumTotal = _sumImports();
      _setDiagnosticAllItem();
    }

    function cerrar() {
      vm.close(void 0);
    }

    function sendResumenProcedures() {
      if (vm.frmModal.$invalid) {
        vm.frmModal.markAsPristine();

        _validateDateIntoProcedures(vm.itemsList) && mModalAlert.showError('La fecha no debe ser mayor al día actual', 'Error');
        return void 0;
      }

      if (_validateDateIntoProcedures(vm.itemsList)) {
        mModalAlert.showError('La fecha no debe ser mayor al día actual', 'Error');
        return void 0;
      }

      if (_validateFarmacosIntoProcedures(vm.itemsList)) {
        mModalAlert.showError('Debes añadir un farmaco', 'Error');
        return void 0;
      }

      vm.close({
        $event: {
          data: ng.copy(vm.itemsList),
          status: 'ok'
        }
      })
    }

    function onChangeTreatmentDate(date) {
      date && _setDateAllItems(date);
    }

    function onChangeDiagnostic(diagnostic) {
      _setDiagnosticAllItem(diagnostic)
    }

    function onChangeSumImports() {
      vm.sumTotal = _sumImports();
    }

    function onChangeFarmacoImport(procedure) {
      procedure.importe = reServices.sumProperty(procedure.farmacos, 'import');
      vm.onChangeSumImports();
    }

    function getDiagnosticList(input) {
      if (input && input.length >= 3) {
        var criteria = {
          diagnosticName: input.toUpperCase()
        };

        var defer = $q.defer();
        reFactory.solicitud.GetDiagnosticList(criteria).then(
          function (res) {
            defer.resolve(res.data.items);
          },
          function (err) {
            mModalAlert.showError(err.data.message, 'Error');
          }
        );

        return defer.promise;
      }
    }

    function addFarmaco(procedure) {
      var item = {
        code: procedure.farmacos.length + 1,
        import: 0
      };
      procedure.farmacos.push(item);
    }

    function deleteFarmaco(procedure, farmaco) {
      procedure.farmacos = _.filter(procedure.farmacos, function (item) {
        return item.code !== farmaco.code;
      })

      procedure.farmacos = _setCodeToFarmacosList(procedure.farmacos);
      vm.onChangeFarmacoImport(procedure);
    }

    // private

    function _validateFarmacosIntoProcedures(list) {
      var invalidList = false;
      _.forEach(list, function (item) {
        if (item.farmacos) {
          invalidList = item.farmacos.length < 1;
        }
      })

      return invalidList;
    }

    function _validateDateIntoProcedures(list) {
      var invalidList = false;

      for (var i = 0; i < list.length; i++) {
        invalidList = list[i].treatmentDate.model > new Date();
        if (invalidList) {
          break;
        }
      }

      return invalidList;
    }

    function _setDateAllItems(date) {
      vm.itemsList = _.map(vm.itemsList, function (item) {
        var fecha = item.treatmentDate.model ?
          item.treatmentDate :
          new reFactory.common.DatePicker(date);
        fecha.setMaxDate(new Date());

        return _.assign({}, item, {
          treatmentDate: fecha
        })
      });
    }

    function _setDiagnosticAllItem(diagnostic) {
      vm.itemsList = _.map(vm.itemsList, function (item) {
        return _.assign({}, item, {
          diagnostic: vm.diagnostic ? vm.diagnostic : (item.diagnostic ? item.diagnostic : diagnostic)
        })
      });
    }

    function _setCodeToFarmacosList(list) {
      var count = 0;
      return _.map(list, function (item) {
        return _.assign({}, item, {
          code: ++count
        })
      })
    }

    function _setTreatmentDateAndFarmacosToProcedures(list) {
      return _.map(list, function (item) {
        return _.assign({}, item, _setFarmacosPropertyToObj(item), {
        treatmentDate: vm.treatmentInit ? new reFactory.common.DatePicker(new Date(vm.treatmentInit)) : _setMaxDateToProcedures(item)
        })
      });
    }

    function _setFarmacosPropertyToObj(obj) {
      return obj.procedureGroupCode === vm.medicCode && {
        farmacos: obj.farmacos || []
      }
    }

    function _setMaxDateToProcedures(procedure) {
      var date = procedure.treatmentDate ?
        procedure.treatmentDate :
        new reFactory.common.DatePicker();

      date.setMaxDate(new Date());
      return date;
    }

    function _sumImports() {
      var numsArr = _.map(vm.itemsList, function (item) {
        return parseFloat(item.importe || '0');
      })
      var sum = _.reduce(numsArr, function (prev, current) {
        return prev + current;
      });

      return sum;
    }

  }

  return ng
    .module('appReembolso')
    .controller('ReProcedimientosImporteModalController', ReProcedimientosImporteModalController)
    .component('reProcedimientosImporteModal', {
      templateUrl: '/reembolso/app/common/modals/modal-procedimientos-importe/modal-procedimientos-importe.html',
      controller: 'ReProcedimientosImporteModalController',
      bindings: {
        close: '&?',
        proceduresList: '<',
        diagnostic: '<',
        treatmentInit: '<'
      }
    });
});
