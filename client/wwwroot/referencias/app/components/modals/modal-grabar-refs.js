(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "modalGrabarRefs", ["angular"], function (angular) {
  angular
    .module("referencias.app")
    .controller("modalGrabarRefsController", ["$scope", "$state", "$filter", '$q', function ($scope, $state, $filter, $q) {
      var vm = this;
      vm.$onInit = onInit;

      function onInit() {
        vm.cerrar = cerrar;
        vm.generarRef = generarRef;
        vm.validarGrabar = validarGrabar;
      }

      function validarGrabar() {
        var observaciones = vm.observaciones != null && vm.observaciones != "";
        return observaciones;
      }

      function cerrar() {
        vm.close();
      }

      function generarRef() {
        vm.save({
          $observaciones: vm.observaciones,
          $requerimientos: vm.requerimientos
        });
      }
    }
    ])
    .component("modalGrabarRefs", {
      templateUrl: "/referencias/app/components/modals/modal-grabar-refs.html",
      controller: "modalGrabarRefsController",
      bindings: {
        save: "&?",
        close: "&?"
      }
    });
});
