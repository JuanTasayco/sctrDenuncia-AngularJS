'use strict';

define(['angular', 'lodash', 'ReembolsoActions'], function (ng, _, ReembolsoActions) {
  ReGridController.$inject = ['reFactory', '$log', '$ngRedux', '$state'];

  function ReGridController(reFactory, $log, $ngRedux, $state) {
    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
    vm.$onChanges = onChanges;
    vm.$onDestroy = onDestroy;
    vm.editCoverageItem = editCoverageItem;
    vm.deleteCoverageItem = deleteCoverageItem;
    vm.sumTotalList = sumTotalList;

    function onInit() {
      try{
        actionsRedux = $ngRedux.connect(
          mapStateToThis,
          ReembolsoActions
        )(vm);
      }catch (err){
        $state.go('solicitud.init');
      }
    }

    function onChanges(changes) {
      console.log(changes);
    }

    function onDestroy() {
      try{
        actionsRedux();
      }catch (err){
        $state.go('solicitud.init');
      }
    }

    function mapStateToThis(state) {
      return {
        coverage: state.solicitud.coverage,
        productCode: state.solicitud.product.code
      };
    }

    function editCoverageItem(item) {
      vm.edit(item);
    }

    function deleteCoverageItem(data) {
      vm.delete(data);
    }

    function sumTotalList(sum) {
      vm.totalList(sum);
    }

  }

  return ng
    .module('appReembolso')
    .controller('ReGridController', ReGridController)
    .component('reGrid', {
      templateUrl: '/reembolso/app/common/grid/grid.html',
      controller: 'ReGridController as $ctrl',
      bindings: {
        tableHeaderList: '<',
        tableBodyList: '<',
        tableBodyFields: '<',
        tableList: '<',
        delete: '<?',
        edit: '<?',
        totalList: '<?',
        gridComprobantes: '<?'
      }
    })
})
