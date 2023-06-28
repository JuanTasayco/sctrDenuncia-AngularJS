(function($root, name, deps, action) {
  $root.define(name, deps, action)
})(window, "localesItemMaintenanceComponent", ['angular'], function(ng) {
  ng.module('farmapfre.app').
  controller('localesItemMaintenanceComponentController',
    ['$scope','proxyBODispatch', 'proxyBODistrict', 'proxyDistrict', 'mModalAlert', 'mModalConfirm', '$state', '$timeout',
      function(mModalAlert) {
        var vm = this;
        vm.frm = {};

        showMsgError = function() {
          mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', 'Error');
        };
      }]).
  component("localesItemMaintenance", {
    templateUrl: "/farmapfre/app/maintenance/alliedPharmacies/detailAlliedPharmacies/components/locales-item-maintenance-component.html",
    controller: "bodistrictItemMaintenanceComponentController",
    bindings: {
      onRefresh: '&',
      type:"=?",
      local:"=?"
    }
  })
});
