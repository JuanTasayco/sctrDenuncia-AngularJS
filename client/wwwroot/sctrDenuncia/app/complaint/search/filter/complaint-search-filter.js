(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "complaintSearchFilterComponent", ["angular"], function (ng) {
  ng.module("sctrDenuncia.app")
    .controller("complaintSearchFilterComponentController", [
      "$q",
      "proxyClient",
      "$scope",
      "$stateParams",
      function ($q, proxyClient, $scope, $stateParams) {
        var vm = this;

        vm.$onInit = onInit;

        function onInit() {
          vm.opciones = [
            { codigo: true, descripcion: "Si" },
            { codigo: false, descripcion: "No" }
          ]

          _clean();
          trySearch("ruc", "SeekCompany", "company");
          trySearch("dni", "SeekClient", "asured");
        }

        function trySearch(type, nameMethod, field) {
          if ($stateParams.documentNumber)
            if (($stateParams.type || "").trim().toLowerCase() == type)
              proxyClient[nameMethod]($stateParams.documentNumber).then(
                function (response) {
                  if (response && response.length > 0) {
                    vm.frmFilter = vm.frmFilter || {};
                    vm.frmFilter[field] = response[0];
                    search();
                  }
                }
              );
        }

        function isValidDates() {
          return (
            vm.frmFilter.fromDate.getTime() < vm.frmFilter.toDate.getTime()
          );
        }

        function isValid() {
          changeValid();
          if (!$scope.frmFilterComplaint.$valid || vm.invalidAsureClient) {
            return {
              success: false,
              message: "Verifique que los datos ingresados estén correctos",
            };
          }
          if (!isValidDates())
            return {
              success: false,
              message:
                "La fecha denuncia desde debe ser menor que la fecha hasta",
            };
          return { success: true };
        }

        function _clean() {
          vm.currentDate = new Date();
          vm.invalidAsureClient = false;
          vm.frmFilter = vm.frmFilter || {};

          var today = new Date();
          today.setHours(0, 0, 0);
          var previewMonth = new Date();
          previewMonth.setHours(0, 0, 0);
          previewMonth.setDate(previewMonth.getDate() - 30);

          vm.frmFilter.toDate = today;
          vm.frmFilter.fromDate = previewMonth;
          vm.frmFilter.marcaProvisional = null;
          delete vm.frmFilter.company;
          delete vm.frmFilter.asured;
          vm.onClean();
        }

        function seekCompany(wildcar) {
          var deferred = $q.defer();
          var params = { Wildcard : wildcar };
          proxyClient.SeekCompanyWithSpecialChar(params).then(
            function (r) {
              angular.forEach(r, function (a, b) {
                a.fulltext = a.documentNumber + " - " + a.fullname;
              });
              deferred.resolve(r);
            },
            function (r) {
              deferred.reject(r);
            }
          );
          return deferred.promise;
        }

        function seekAsured(wildcar) {
          var deferred = $q.defer();

          proxyClient.SeekClient(wildcar).then(
            function (r) {
              angular.forEach(r, function (a, b) {
                a.fulltext = a.documentNumber + " - " + a.fullname;
              });
              deferred.resolve(r);
            },
            function (r) {
              deferred.reject(r);
            }
          );
          return deferred.promise;
        }

        function changeValid() {
          vm.invalidAsureClient = !(
            vm.frmFilter.asured || vm.frmFilter.company
          );
        }

        function search() {
          var r = isValid();
          if (r.success) {
            var req = {
              aseguradoDni:
                vm.frmFilter && vm.frmFilter.asured
                  ? vm.frmFilter.asured.documentNumber
                  : "",
              clientRuc:
                vm.frmFilter && vm.frmFilter.company
                  ? vm.frmFilter.company.documentNumber
                  : "",
              endDate: vm.frmFilter.toDate,
              startDate: vm.frmFilter.fromDate,
              marcaProvisional: vm.frmFilter.marcaProvisional.codigo
            };
            r.request = req;
          }

          vm.onSearch({ $filter: r });
        }

        function clear() {
          _clean();
        }

        vm.changeValid = changeValid;
        vm.clear = clear;
        vm.seekCompany = seekCompany;
        vm.seekAsured = seekAsured;
        vm.search = search;
      },
    ])
    .component("complaintSearchFilter", {
      templateUrl:
        "/sctrDenuncia/app/complaint/search/filter/complaint-search-filter.html",
      controller: "complaintSearchFilterComponentController",
      bindings: {
        onSearch: "&",
        onClean: "&",
      },
    });
});
