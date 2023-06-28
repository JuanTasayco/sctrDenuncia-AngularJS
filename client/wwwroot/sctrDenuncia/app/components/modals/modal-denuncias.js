(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "modaldenuncias", ["angular"], function (angular) {
  angular
    .module("sctrDenuncia.app")
    .controller("modaldenunciasController", [
      "oimProxySctrDenuncia",
      "$scope",
      "$state",
      "$q",
      "$http",
      "proxyComplaint",
      "$rootScope",
      "mpSpin",
      "mModalAlert",
      function (oimProxySctrDenuncia, $scope, $state, $q, $http, proxyComplaint, $rootScope, mpSpin, mModalAlert) {
        var vm = this;
        vm.$onInit = onInit;

        function onInit() {
          vm.data = { items: [] };
          
          vm.cerrar = cerrar;
          vm.imprimir = imprimir;

          denuncias();
        }

        function denuncias() {
          var deferred = $q.defer();

          proxyComplaint.GetCompaintClient(vm.params).then(function (response) {
              if (response) {
              deferred.resolve(response);
                vm.data.items = response.items;
              }
          });
        }

        function cerrar() {
          vm.close();
        }

        function imprimir(item) {
          mpSpin.start()
          $http.get(
            oimProxySctrDenuncia.endpoint + 'api/complaint/download/' +  item.nroDenuncia + '/' + item.periodoDenuncia + '/' + item.codAfiliado,
            { transformRequest: angular.identity, responseType: 'blob' }
          )
          .success(function (data, status, headers) {
            var defaultFileName ='denuncia-' + '-' + item.periodoDenuncia + '-' + item.nroDenuncia + '-'+ item.codAfiliado;
            var type = headers('Content-Type');
            var blob = new Blob([data], { type: type });
            saveAs(blob, defaultFileName);
            mpSpin.end();
          }, function(data, status) {
            mModalAlert.showError("Ha sucedido un error al momento de descargar el archivo", "Documento");
            mpSpin.end();
          });
        }
      },
    ])
    .component("modaldenuncias", {
      templateUrl: "/sctrDenuncia/app/components/modals/modal-denuncias.html",
      controller: "modaldenunciasController",
      bindings: {
        role: "=?",
        params: "=?",
        afiliado: "=?",
        close: "&?",
      },
    });
});
