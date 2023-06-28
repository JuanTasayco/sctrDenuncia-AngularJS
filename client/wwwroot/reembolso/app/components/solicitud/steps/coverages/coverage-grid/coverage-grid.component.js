'use strict';

define(['angular', 'lodash', 'ReembolsoActions'], function (ng, _, ReembolsoActions) {
  ReCoverageGridController.$inject = ['reFactory', '$log', '$ngRedux', '$state'];

  function ReCoverageGridController(reFactory, $log, $ngRedux, $state) {
    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
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
    .controller('ReCoverageGridController', ReCoverageGridController)
    .component('reCoverageGrid', {
      templateUrl: '/reembolso/app/components/solicitud/steps/coverages/coverage-grid/coverage-grid.html',
      controller: 'ReCoverageGridController as $ctrl',
      bindings: {
        tableList: '<',
        delete: '<?',
        edit: '<?',
        totalList: '<?',
        gridComprobantes: '<?',
        readOnly: '<?'
      }
    })
})
