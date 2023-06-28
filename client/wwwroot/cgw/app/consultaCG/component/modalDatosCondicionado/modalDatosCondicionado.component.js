define(["angular", "/cgw/app/factory/cgwFactory.js"], function(ng) {
  
    ModalDatosCondicionadoController.$inject = ["$scope", "cgwFactory"];
    
    function ModalDatosCondicionadoController($scope, cgwFactory) {
    }
    
    return ng.module("appCgw")
      .controller("ModalDatosCondicionadoController", ModalDatosCondicionadoController)
      .component("mfpModalDatosCondicionado", {
        templateUrl: "/cgw/app/consultaCG/component/modalDatosCondicionado/modalDatosCondicionado.html",
        controller: "ModalDatosCondicionadoController",
        bindings: {
          close: '&?',
          data: '=?'
        }
      })
      .directive("preventDefault", function() {
        return function(scope, element, attrs) {
            angular.element(element).bind("click", function(event) {
                event.preventDefault();
                event.stopPropagation();
            });
        }
      });
  });
    