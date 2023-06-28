(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "progressStepOne", ["angular"], function (angular) {
  angular
    .module("referencias.app")
    .controller("progressStepOneController", [
      "$scope",
      "$uibModal",
      "mpSpin",
      "proxyAsegurado",
      "$q",
      function ($scope, $uibModal, mpSpin, proxyAsegurado, $q) {
        var vm = this;
        vm.$onInit = onInit;

        function onInit() {
          vm.buscadorPaciente = buscadorPaciente;
          vm.validarDatosP = validarDatosP;
          vm.editPaciente = editPaciente;
          vm.selectResult = selectResult;
          vm.showModaldetalleP = showModaldetalleP;
          vm.showResults = false;
          vm.pacientList = [];
          vm.filters.pacienteSelect = {};
        }

        $scope.getStyle = function (estado) {
          if (estado === "VIGENTE") return { "background-color": "#00B09F" };
          if (estado != "VIGENTE") return { "background-color": " #999999" };
        };

        function validarDatosP() {
          var dni = vm.NumDoc != null && vm.NumDoc != "";
          var name = vm.Nombre != null && vm.Nombre != "";
          var lastname = vm.Apellido != null && vm.Apellido != "";
          return dni || (name && lastname);
        }

        function buscadorPaciente() {
          var CTipProd =
            vm.filters.ac_Producto != null
              ? vm.filters.ac_Producto.value
              : null;
          var NumDoc = vm.NumDoc;
          var Nombre = vm.Nombre;
          var Apellido = vm.Apellido;

          mpSpin.start();
          proxyAsegurado
            .ListarAsegurados({
              CTipProd: CTipProd,
              NumDoc: NumDoc,
              Nombre: Nombre,
              Apellido: Apellido,
            })
            .then(function (response) {
              mpSpin.end();
              if (response.codErr == 0) {
                vm.pacientList = response.listaAsegurados;
                vm.showResults = true;
                vm.showemptymsg = false;
              } else {
                vm.showemptymsg = true;
              }
            });
        }

        function editPaciente() {
          $scope.$parent.currentStep = 1;
          vm.filters.pacienteSelect = {};
          vm.showResults = false;
          vm.showRest = false;
          vm.edit = true;
          vm.filters.nomRspnsble = "";
          vm.filters.telRspnsble = "";
          vm.filters.mailRspnsble = "";
          vm.filters.tipoReferencia = null;
          vm.filters.tiporeferencianame = "";
          vm.filters.ac_Condicion = { value: "" };
          vm.filters.ac_Diagnostico = "";
          vm.filters.ac_cdprtmntoDestino = null;
          vm.filters.an_cprvncaDestino = null;
          vm.filters.ac_Categoria = null;
          vm.filters.ac_Entidad = null;
          vm.filters.ac_Institucion = null;
          vm.filters.ac_Convenio = null;
          vm.filters.ac_CentroDest = null;
          vm.filters.fRefeForzada = false;
          vm.filters.listChecked = [];
          $scope.$parent.ListProve = [];
          $scope.$parent.ListProveAll = [];

          if (!(vm.oSiteds != undefined && vm.listaAsegurados.oSiteds != null)) {
            vm.filters.ac_CentroOrg1 = "";
            vm.filters.ac_cdprtmntoOrigen = null;
            vm.filters.an_cprvncaOrigen = null;
          }

          vm.oneEdit();
        }

        function selectResult(item) {
          vm.filters.pacienteSelect = item;
          vm.showResults = false;
          vm.edit = false;

          var loadMapa = false;
          var oSiteds = item.oSiteds;

          if (oSiteds != null && Object.keys(oSiteds).length != 0) {
            loadMapa = true;

            vm.filters.ac_cdprtmntoOrigen = {
              value: oSiteds.idDep,
              text: oSiteds.nomDep,
            };
            vm.filters.an_cprvncaOrigen = {
              value: oSiteds.idProv,
              text: oSiteds.nomProv,
            };
            vm.filters.ac_CentroOrg1 = {
              value: oSiteds.idClinica,
              text: oSiteds.nombre,
            };
          }

          vm.nextStep({ $data: vm.filters, $loadMapa: loadMapa });
        }

        function showModaldetalleP(data) {
          $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: "lg",
            template:
              "<modal-detallep data='modalDetallep' close='close()'></modal-detallep>",
            controller: [
              "$scope",
              "$uibModalInstance",
              function ($scope, $uibModalInstance) {
                $scope.modalDetallep = data;
                $scope.close = function (data) {
                  $uibModalInstance.close();
                };
              },
            ],
          });
        }
      },
    ])
    .component("progressStepOne", {
      templateUrl:
        "/referencias/app/components/progress/progress-step-one.html",
      controller: "progressStepOneController",
      bindings: {
        step: "=?",
        masters: "=?",
        filters: "=?",
        edit: "=?",
        showEdit: "=?",
        nextStep: "&?",
        oneEdit: "&?",
      },
    });
});
