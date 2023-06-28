'use strict';

define(['angular', 'lodash', 'reConstants'], function (ng, _, reConstants) {
  ReProcedimientosModalController.$inject = ['reFactory', '$q', 'mModalAlert', '$log'];

  function ReProcedimientosModalController(reFactory, $q, mModalAlert, $log) {
    var vm = this;
    vm.$onInit = onInit;
    vm.cerrar = cerrar;
    vm.removeFromTagsList = removeFromTagsList;
    vm.showResumen = showResumen;
    vm.onChangeProceduresSelected = onChangeProceduresSelected;
    vm.onCheck = onCheck;
    vm.searchProcedures = searchProcedures;

    // functions declaration

    function onInit() {
      vm.isEditComprobante = vm.edit;
      vm.proceduresSelected = ng.copy(vm.proceduresSelectedList) || [];
      _getProceduresList()
    }

    function cerrar() {
      vm.close(void 0);
    }

    function searchProcedures(criteria) {
      if (criteria !== undefined) {
        if (vm.coverage === reConstants.coverages.gastosCuracion) {
          vm.arrFilterList = _.filter(vm.proceduresListWithSelect, function(item) {
            return (item.description.includes(vm.criteria.toUpperCase()) ||
            item.code.includes(vm.criteria)) && item.code !== '507' && item.code !== '508' && item.code !== '509' && item.code !== '372'
          })
        } else {
          vm.arrFilterList = _.filter(vm.proceduresListWithSelect, function (item) {
            return item.description.includes(vm.criteria.toUpperCase()) ||
              item.code.includes(vm.criteria);
          });
        }

      }
    }

    function removeFromTagsList(tag) {
      var idx = _findIndexArr(vm.arrFilterList, tag);
      vm.arrFilterList[idx].selected = false;
      vm.arrFilterList[idx].invoiceProcedureItemNumber = 0;

      vm.proceduresSelected = _.filter(vm.proceduresSelected, function (item) {
        return item.code !== tag.code;
      })
    }

    function onChangeProceduresSelected() {}

    function onCheck(procedure) {
      procedure.selected = !procedure.selected;

      if (vm.isEditComprobante) {
        if (procedure.selected) {
          procedure.invoiceProcedureItemNumber = vm.proceduresSelected.length === 1 ?
            1 : vm.proceduresSelected[vm.proceduresSelected.length - 2].invoiceProcedureItemNumber + 1;
        }
      }

      if (!procedure.selected) {
        vm.proceduresSelected = _.filter(vm.proceduresSelected, function (item) {
          return item.code !== procedure.code;
        });
      }

      vm.proceduresListWithSelect = _.map(vm.proceduresListWithSelect, function (item) {
        return _.assign({}, item, {
          selected: item.code === procedure.code ? procedure.selected : item.selected
        })
      });
    }

    function showResumen() {
      if (vm.proceduresSelected.length > 0) {
        var procedureList;
        if (!vm.isEditComprobante) {
          var count = 0;
          procedureList = _.map(vm.proceduresSelected, function (item) {
            return _.assign({}, item, {
              invoiceProcedureItemNumber: ++count
            })
          })
        } else {
          procedureList = ng.copy(vm.proceduresSelected);
        }

        vm.close({
          $event: {
            data: procedureList,
            status: 'ok'
          }
        })
      } else {
        mModalAlert.showError('Debes elegir por lo menos un procedimiento', 'Error')
      }
    }

    // private

    function _getProceduresList() {
      reFactory.solicitud
        .GetAllProcedures(vm.idCompany)
        .then(function (res) {
          vm.proceduresList = res.isValid ? res.data : [];
          vm.proceduresListWithSelect = _.map(vm.proceduresList, function (item) {
            return _.assign({}, item, _setPropertyObjects(item), {
              invoiceProcedureItemNumber: 0
            })
          });

          if (vm.coverage === reConstants.coverages.gastosCuracion) {
            vm.arrFilterList = _.filter(vm.proceduresListWithSelect, function(item) {
              return item.code !== '507' && item.code !== '508' && item.code !== '509' && item.code !== '372'
            })
          } else {
            vm.arrFilterList = ng.copy(vm.proceduresListWithSelect);
          }
        })
        .catch(function (err) {
          $log.error(err);
        })
    }

    function _setPropertyObjects(item) {
      if (vm.proceduresSelected.length > 0) {
        return _.assign({}, item, {
          selected: _compareItemsArrByProperty(vm.proceduresSelected, item, 'selected')
        })
      } else {
        return _.assign({}, item, {
          selected: false
        })
      }
    }

    function _compareItemsArrByProperty(arr, itemFromOtherArr, property) {
      var findElement = _.find(arr, function (item) {
        return itemFromOtherArr.code === item.code
      })

      return _.keys(findElement).length > 0 ? findElement[property] : null;
    }

    function _findIndexArr(arr, element) {
      var idx = _.findIndex(arr, function (item) {
        return item.code === element.code
      });

      return idx;
    }

  }

  return ng
    .module('appReembolso')
    .controller('ReProcedimientosModalController', ReProcedimientosModalController)
    .component('reProcedimientosModal', {
      templateUrl: '/reembolso/app/common/modals/modal-procedimientos/modal-procedimientos.html',
      controller: 'ReProcedimientosModalController',
      bindings: {
        close: '&?',
        proceduresSelectedList: '<',
        edit: '<',
        idCompany: '<',
        coverage: '<'
      }
    });
});
