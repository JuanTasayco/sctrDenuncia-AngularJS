(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "complaintSearchContainerComponent", ["angular"], function (ng) {
  ng.module("sctrDenuncia.app")
    .controller("complaintSearchContainerComponentController", [
      "proxyComplaint",
      "mModalAlert",
      "$uibModal",
      "$scope",
      function (proxyComplaint, mModalAlert, $uibModal, $scope) {
            var vm = this;
            function cleanPager() {
                vm.pagination = {
                    maxSize: 10,
            sizePerPage: 10,
                    currentPage: 1,
            totalRecords: 0,
          };
            }
            function onInit() {
                cleanPager();
            }
            function onSearch($filter) {
                search($filter);
            }
            function onClean() {
                cleanPager();
          delete vm.resultItems;
                vm.isSearched = false;
            }

            function search($filter) {
                if (!$filter || $filter.success === true) {
            vm.currentFilter = $filter
              ? $filter.request || vm.currentFilter
              : vm.currentFilter;
            vm.currentFilter.pager = {
              size: vm.pagination.sizePerPage,
              pageNumber: vm.pagination.currentPage,
            };

                    proxyComplaint
                        .Search(vm.currentFilter, "Buscando denuncias...")
                        .then(function (resp) {
                vm.resultItems = resp.items;
                            vm.pagination.totalRecords = resp.recordCount;
                vm.noResult =
                  (vm.pagination.totalRecords || 0) == 0 || !vm.resultItems;
                            vm.isSearched = true;
                        });
          } else {
            mModalAlert.showError(
              $filter.message,
              "B&uacute;squeda de Denuncias"
            );
                }
            }
            function pageChanged() {
                search();
            }
            vm.$onInit = onInit;
            vm.onSearch = onSearch;
            vm.onClean = onClean;
            vm.pageChanged = pageChanged;
      },
    ])
    .component("complaintSearchContainer", {
      templateUrl:
        "/sctrDenuncia/app/complaint/search/container-component.html",
            controller: "complaintSearchContainerComponentController",
      bindings: {},
    });
});
