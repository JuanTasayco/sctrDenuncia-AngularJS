(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "modalnuevoafiliado", ["angular"], function (angular) {
  angular
    .module("sctrDenuncia.app")
    .controller("modalnuevoafiliadoController", [
      "$scope",
      "$state",
      "$q",
      "proxyClient",
      function ($scope, $state, $q, proxyClient) {
        var vm = this;
        vm.$onInit = onInit;
        vm.data = [];
        vm.showNoResult = false;

        function onInit() {
          vm.cerrar = cerrar;
          vm.searchAfiliate = searchAfiliate;
        }

        function searchAfiliate() {
          proxyClient
            .GetAseguradoByDocument("DNI", vm.num_documento, true)
            .then(function (response) {
              if(!response.hasOwnProperty("data")) {
                if(response.respuesta == "1") {
                  if(response.ape_paterno == "" && response.nombres == ""){
                    vm.showNoResult = true;
                    vm.newAfiliate = null;
                  } else {
                  vm.showNoResult = false;
              vm.newAfiliate = response;
                  validateAfiliate(response);
                  }
                } else {
                  vm.showNoResult = true;
                  vm.newAfiliate = null;
                }
              } else {
                vm.showNoResult = true;
                vm.newAfiliate = null;
              }
            });
        }

        function validateAfiliate(data) {
          proxyClient
          .SeekClient(vm.num_documento, true)
          .then(function (response) {
            if (response != "") {
              vm.showButtons = false;
            } else {
              vm.showButtons = true;
            }
          });
        }

        function cerrar() {
          $scope.$parent.$parent.newAfiliate = Object.assign({},vm.newAfiliate);
          vm.close(vm.newAfiliate);
        }
      },
    ])
    .component("modalnuevoafiliado", {
      templateUrl:
        "/sctrDenuncia/app/components/modals/modal-nuevo-afiliado.html",
      controller: "modalnuevoafiliadoController",
      bindings: {
        title: "=?",
        data: "=?",
        table: "=?",
        close: "&?",
      },
    });
});
