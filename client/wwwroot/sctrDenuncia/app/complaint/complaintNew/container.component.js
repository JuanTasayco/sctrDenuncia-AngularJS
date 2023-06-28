(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "complaintNewContainerComponent", ["angular"], function (ng) {
  ng.module("sctrDenuncia.app")
    .controller("complaintNewContainerComponentController", [
      "proxyComplaint",
      "mModalAlert",
      "$uibModal",
      "$scope",
      "$state",
      "accessSupplier",
      "$timeout",
      function (
        proxyComplaint,
        mModalAlert,
        $uibModal,
        $scope,
        $state,
        accessSupplier,
        $timeout
      ) {
        var vm = this;
        var funcsCmp = {};

        function onInit() {
          $scope.clear = false;
          vm.cleanForm = cleanForm;
        }

        function cleanForm() {
          $scope.clear = true;
          $timeout(function () {
            vm.denunciaProvisional = "";
            $scope.clear = false;
          }, 250);
        }

        function receptMethods(funcs) {
          funcsCmp = funcs;
        }

        function cancel() {
          accessSupplier.GetProfile().then(function (data) {
            if (data.userSubType === "2") {
              $state.reload();
            } else {
              $state.go("complaint.search");
            }
          });
        }

        function save() {
          var r = funcsCmp.getComplaint();
          var rp = funcsCmp.getProvisionalComplaint();
          var isProvisional = funcsCmp.isProvisional();
          if (!isProvisional && !r.isvalid) {
            mModalAlert.showError(r.message, "Denuncia");
            return;
          }
          if (isProvisional && !rp.isvalid) {
            mModalAlert.showError(rp.message, "Denuncia");
            return;
          }
          var mensaje =  "Se registró la denuncia satisfactoriamente."; 
          
          if (!isProvisional) {
          proxyComplaint.Register(r.request, "Guardando denuncia ...").then(
            function (response) {
              var d = response.data || response;
              vm.correlativo = d.item1;
              vm.nroSiniestro = d.item2;
                vm.observed = null;
                vm.vip = null;
                vm.showNewAfiliado = false;
                vm.denunciaProvisional = "N";
                
              if (vm.correlativo != -1) {
               
                  mModalAlert.showSuccess(
                    mensaje,
                    "Denuncia"
                  );
                } else {
                  mModalAlert.showError(
                    "Ha occurido un error al momento de guardar la denuncia, por favor comuniquese con el administrador.",
                    "Denuncia"
                  );
                  console.error(d.item3);
                }
              },
              function (response) {
                mModalAlert.showError(
                  "Ha occurido un error al momento de guardar la denuncia.",
                  "Denuncia"
                );
              }
            );
          } else {
            proxyComplaint
              .RegisterProvisional(rp.request, "Guardando denuncia ...")
              .then(
                function (response) {
                  var d = response.data || response;
                  vm.correlativo = d.item1;
                  vm.nroSiniestro = d.item2;
                  vm.observed = null;
                  vm.vip = null;
                  vm.showNewAfiliado = false;
                  vm.denunciaProvisional = "S";

                  if (vm.correlativo != -1) {
                mModalAlert.showSuccess(
                  "Se registró la denuncia satisfactoriamente.",
                  "Denuncia"
                );
              } else {
                mModalAlert.showError(
                  "Ha occurido un error al momento de guardar la denuncia, por favor comuniquese con el administrador.",
                  "Denuncia"
                );
                console.error(d.item3);
              }
            },
            function (response) {
              mModalAlert.showError(
                "Ha occurido un error al momento de guardar la denuncia.",
                "Denuncia"
              );
            }
          );
        }
        }

        vm.receptMethods = receptMethods;
        vm.cancel = cancel;
        vm.save = save;
        vm.$onInit = onInit;
      },
    ])
    .component("complaintNewContainer", {
      templateUrl:
        "/sctrDenuncia/app/complaint/complaintNew/container.component.html",
      controller: "complaintNewContainerComponentController",
      bindings: {},
    });
});
