(function($root, name, deps, action){
  $root.define(name, deps, action);
})(window, "complaintIndexController", ["angular"], function (ng) {
  ng.module("sctrDenuncia.app")
    .controller("complaintIndexController", [
      "$scope",
      function ($scope) {
        var vm = this;
      },
    ])
    .component("complaintListEmpty", {
        templateUrl: "/complaint-list-empty.html",
        controller: "complaintListEmptyController",
        bindings: {
        textEmpty: "=?",
        textFirstEmpty: "=?",
      },
    })
    .controller("complaintListEmptyController", [
      function () {
        var vm = this;
      },
    ]);
});
