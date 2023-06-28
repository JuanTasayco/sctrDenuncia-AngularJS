(function($root, name, deps, action){
    $root.define(name, deps, action);
  })(window, "complaintHomeContainerComponent", ["angular"], function (ng) {
    ng.module("sctrDenuncia.app")
      .controller("complaintHomeContainerComponentController", [
        "$scope",
        function ($scope) {
          var vm = this;
          console.log("Version: 01/03/2023 14:00");
        }
      ])
      .component("complaintHomeContainer", {
        templateUrl:"/sctrDenuncia/app/complaint/home/home-component.html",
        controller: "complaintHomeContainerComponentController",
        bindings: {},
      });
  });
  