"use strict";
define(["angular"], function (ng) {
  mapaClienteCtrl.$inject = [];

  function mapaClienteCtrl() {
    var vm = this;
    vm.name = "mapaClienteCtrl"; // hack for uglification
    vm.changeMap = "Peru";
    // bound to svg
    vm.openMap = function omFn(lvl, loc, isChangingMap, ev) {
      if (ev) {
        vm.loadclass = "is-loading";
        var currentPath = ev.currentTarget;
        var selectedPath = ev.currentTarget.parentNode.querySelector(
          ".is-selected"
        );

        if (selectedPath) {
          selectedPath.setAttribute("class", "");
        }

        currentPath.setAttribute("class", "is-selected");
      }

      vm.openmap({ a: lvl, b: loc, c: isChangingMap });
    };
  }

  mapaMapfreDirectiveFn.$inject = [];
  function mapaMapfreDirectiveFn() {
    function linkFn(scope, element, attrs, controller) {
      if (
        controller.constructor.name === "mapaRegistroCtrl" ||
        controller.name === "mapaRegistroCtrl"
      ) {
        scope.$on("changeProvincia", function lsFn(event, data) {
          var node = jQuery(element).find("#" + data.id);
          controller.openMap(2, data.id, true, null, node);
        });
      } else {
        scope.$on("getPlace", function lsFn(event, data) {
          var lvl = data.lvl;
          var pathProv;

          if (lvl === 1) {
            pathProv = element.find(".is-selected");
            pathProv.length && pathProv["0"].setAttribute("class", "");
          } else if (lvl === 2) {
            pathProv = element.find("#" + data.pl);

            //  add class to path
            pathProv.length &&
              pathProv["0"].setAttribute("class", "is-selected");
          }
        });
      }
    }

    return {
      restrict: "E",
      templateUrl: "/referencias/app/components/map/mapaClientes.html",
      bindToController: true,
      controller: "@",
      controllerAs: "$ctrl",
      name: "controllerName",
      link: linkFn,
      scope: {
        lugar: "=?",
        p1: "=?",
        p2: "=?",
        namelugar: "=?",
        loadclass: "=?",
        mapsvg: "=?",
        openmap: "&?",
        enabledmap: "=?",
      },
    };
  }

  mapaRegistroCtrl.$inject = [];

  function mapaRegistroCtrl() {
    var vm = this;
    vm.name = "mapaRegistroCtrl"; // hack for uglification
    vm.changeMap = "Peru";
    // bound to svg
    vm.openMap = function omFn(lvl, loc, isChangingMap, ev, node) {
      if (ev || node) {
        var currentPath = {},
          selectedPath = {};
        var mapEnabled = vm.enabledmap;
        if (ev && mapEnabled) {
          currentPath = ev.currentTarget;
          selectedPath = currentPath.parentNode.querySelector(".is-selected");
        } else if (node) {
          currentPath = node[0];
          selectedPath = currentPath.parentNode.querySelector(".is-selected");
        }

        if (selectedPath && mapEnabled) {
          selectedPath.setAttribute("class", "");
        }

        if (Object.keys(currentPath).length != 0) {
          currentPath.setAttribute("class", "is-selected");
        }
      } else {
        vm.loadclass = "is-loading"; // when moving from Peru to Departamento
      }
      vm.openmap({ a: lvl, b: loc, c: isChangingMap });
    };
  }

  return ng
    .module("referencias.app")
    .controller("MapaClienteController", mapaClienteCtrl)
    .controller("MapaRegistroController", mapaRegistroCtrl)
    .directive("mapaMapfre", mapaMapfreDirectiveFn);
});
