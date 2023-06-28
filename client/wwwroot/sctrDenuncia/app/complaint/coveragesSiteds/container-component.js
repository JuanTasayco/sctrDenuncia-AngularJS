(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "coveragesSearchComponent", ["angular"], function (ng) {
  ng.module("sctrDenuncia.app")
    .controller("coveragesSearchComponentController", [
      "proxyClinicCoverage",
      "complaintItemService",
      "$stateParams",
      "sctrParantesto",
      "sctrEstadoPaciente",
      function (
        proxyClinicCoverage,
        complaintItemService,
        $stateParams,
        sctrParantesto,
        sctrEstadoPaciente
      ) {
        var vm = this;
        vm.isSearched = false;
        vm.dataview = complaintItemService.getComplaintSctrState();
        vm.codasegurado = $stateParams.codasegurado;
        vm.nrodenuncia = $stateParams.nrodenuncia;
        vm.periodo = $stateParams.periodo;
        vm.$onInit = onInit;
        var funcsResult;
        function onInit() {}

        function onsearch(filter) {
          funcsResult.clean();
          proxyClinicCoverage
            .GetCoverageClinic(
              filter.noPlan ? filter.noPlan :0 ,
              filter.nroDocumento,
              "Buscando..."
            )
            .then(function (response) {
              vm.coveragesClinc = response;
              vm.isSearched = true;
            });
        }
        function calcEge(fecha) {
          if (!fecha) return "Desconocido";
          var hoy = new Date();
          var cumpleanos = new Date(fecha);
          var edad = hoy.getFullYear() - cumpleanos.getFullYear();
          var m = hoy.getMonth() - cumpleanos.getMonth();

          if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
            edad--;
          }

          return edad;
        }
        function emitMethodsResult(fn) {
          funcsResult = fn;
        }
        function onSelectedItem($titular, $paciente, $recibo) {
          vm.pacienteData = $paciente;
          vm.titularData = $titular;
          vm.reciboData = $recibo;
        }
        function getEstado(p) {
          var value = _.find(sctrEstadoPaciente, function (x) {
            return x.codigo.toLowerCase() == (p || "").toLowerCase().trim();
          });
          return value ? value.descripcion : "";
        }
        function getParentesco(p) {
          var value = _.find(sctrParantesto, function (x) {
            return x.codigo.toLowerCase() == (p || "").toLowerCase().trim();
          });
          return value ? value.descripcion : "";
        }
        function onClean() {
          vm.pacienteData = null;
          vm.titularData = null;
          vm.isSearched = false;
          vm.coveragesClinc = [];
        }
        vm.getParentesco = getParentesco;
        vm.getEstado = getEstado;
        vm.emitMethodsResult = emitMethodsResult;
        vm.onsearch = onsearch;
        vm.onClean = onClean;
        vm.onSelectedItem = onSelectedItem;
        vm.calcEge = calcEge;
      },
    ])
    .component("coveragesSearch", {
      templateUrl:
        "/sctrDenuncia/app/complaint/coveragesSiteds/container-component.html",
      controller: "coveragesSearchComponentController",
      bindings: {},
    })
    .constant("sctrParantesto", [
      { codigo: "1", descripcion: "TITULAR" },
      { codigo: "2", descripcion: "CONYUGUE" },
      { codigo: "3", descripcion: "CONCUBINA(O)" },
      { codigo: "4", descripcion: "MADRE GESTANTE" },
      { codigo: "5", descripcion: "HIJO NO INCAPACITADO" },
      { codigo: "6", descripcion: "HIJO INCAPACITADO" },
      { codigo: "7", descripcion: "PADRES" },
      { codigo: "8", descripcion: "HERMANO(A)" },
      { codigo: "9", descripcion: "ABUELO(A)" },
      { codigo: "10", descripcion: "TIO(A)" },
      { codigo: "11", descripcion: "NIETO(A)" },
      { codigo: "12", descripcion: "SOBRINO(A)" },
      { codigo: "13", descripcion: "PRIMO(A)" },
      { codigo: "14", descripcion: "PADRES DEL CONYUGUE" },
      { codigo: "15", descripcion: "HIJO(A) DEL CONYUGUE" },
      { codigo: "16", descripcion: "VIUDO(A)" },
      { codigo: "17", descripcion: "OTROS" },
    ])
    .constant("sctrEstadoPaciente", [
      { codigo: "1", descripcion: "VIGENTE" },
      { codigo: "2", descripcion: "SIN COBERTURA" },
      { codigo: "6", descripcion: "INACTIVO" },
      { codigo: "7", descripcion: "SUSPENDIDO" },
      { codigo: "8", descripcion: "LATENTE" },
      { codigo: "9", descripcion: "RENOVADA" },
    ]);
});
