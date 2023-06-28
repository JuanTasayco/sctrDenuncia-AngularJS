(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "complaintDisabilitySearchFilterComponent", ["angular"], function (ng) {
  ng.module("sctrDenuncia.app")
    .controller("complaintDisabilitySearchFilterComponentController", ["$q", "proxyClient", "proxyDisabilityRequest", "$scope", "$stateParams",
      function ($q, proxyClient, proxyDisabilityRequest, $scope, $stateParams) {
        var vm = this;        

        function onInit() {
          _clean();
          loadAreas();
        }

        // Cargar maestro de areas para combobox
        function loadAreas() {
          proxyDisabilityRequest.parametros(99, null, null, 13, 20, 1, false).then(function (resp) {
            vm.areas = resp.data;
          });
        }

        // Validar fechas
        function isValidDates() {
          return (vm.frmFilter.fromDate.getTime() < vm.frmFilter.toDate.getTime());
        }

        // Validaciones previas al filtro de búsqueda
        function isValid() {
          if (!isValidDates()) {
            return {
              success: false,
              message: "La fecha denuncia desde debe ser menor que la fecha hasta"
            };
          }
          
          return { success: true };
        }

        // Accion de limpiar campos de formulario de busqueda
        function _clean() {
          vm.currentDate = new Date();
          vm.frmFilter = {};

          var today = new Date();
          today.setHours(0, 0, 0);
          var previewMonth = new Date();
          previewMonth.setHours(0, 0, 0);
          previewMonth.setDate(previewMonth.getDate() - 30);

          vm.frmFilter.toDate = today;
          vm.frmFilter.fromDate = previewMonth;

          vm.onClean();
          search();
        }

        // Generar objeto para realizar busqueda
        function search() {
          var r = isValid();

          if (r.success) {
            var req = {}            

            if(vm.frmFilter.requestNumber) req.requestNumber = vm.frmFilter.requestNumber;
            if(vm.frmFilter.documentNumber) req.documentNumber = vm.frmFilter.documentNumber;
            if(vm.frmFilter.insuredName) req.insuredName = vm.frmFilter.insuredName;
            if(vm.frmFilter.area) req.area = vm.frmFilter.area;
            if(vm.frmFilter.fromDate) req.fromDate = vm.frmFilter.fromDate;
            if(vm.frmFilter.toDate) req.toDate = vm.frmFilter.toDate;

            r.request = req;
          }
          
          vm.onSearch({ $filter: r });
        }

        function clear() {
          _clean();
        }

        vm.$onInit = onInit;
        vm.clear = clear;
        vm.search = search;
      }
    ])
    .component("complaintDisabilitySearchFilter", {
      templateUrl: "/sctrDenuncia/app/complaint/disabilitySearch/filter/complaint-search-filter.html",
      controller: "complaintDisabilitySearchFilterComponentController",
      bindings: {
        onSearch: "&",
        onClean: "&",
      },
    });
});
