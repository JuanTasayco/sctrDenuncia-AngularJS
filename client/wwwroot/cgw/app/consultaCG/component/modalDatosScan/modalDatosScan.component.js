define(["angular", "/cgw/app/factory/cgwFactory.js"], function (ng) {

  ModalDatosScanController.$inject = ["$scope", "MxPaginador", "cgwFactory"];

  function ModalDatosScanController($scope, MxPaginador, cgwFactory) {
    var vm = this;
    $scope.mPagination = 1;
    $scope.pageSize = 10;

    var page = new MxPaginador();
    page.setNroItemsPorPagina($scope.pageSize);

    $scope.filter = "";
    $scope.results = [];
    
    //Lista de resultados
    $scope.filtrar = filtrar;
    $scope.limpiar = limpiar;
    $scope.pageChanged = pageChanged;
    $scope.openClinicas = openClinicas;

    (
      function onLoad() {
        filtrar();
      }
    )();

    // Funcion que se activa al presionar el boton de busqueda
    function filtrar() {
      $scope.paramsSearch = {
        Filter: $scope.filter,
        PageNumber: 1,
        PageSize: $scope.pageSize,
      };

      buscar($scope.paramsSearch);
    }

    // Función que se activa al cambiar de página
    function pageChanged(event) {
      $scope.paramsSearch = {
        Filter: $scope.filter,
        PageNumber: event,
        PageSize: $scope.pageSize,
      };

      buscar($scope.paramsSearch);
    }

    // Funcion que consume servicio de busqueda
    function buscar(paramsSearch) {
      if (paramsSearch) {
        if (paramsSearch.PageNumber === 1) {
          $scope.totalItems = 0;
          $scope.mPagination = 1;
        }

        cgwFactory.GetScanData(vm.carta.Year, vm.carta.Number, paramsSearch, true).then(function(response) {
          if (response.data) {
            if (response.data.lista.length > 0) {
              $scope.results = response.data.lista;
              $scope.totalItems = response.data.cant;
              $scope.totalPages = Math.ceil(response.data.cant / $scope.pageSize);
              $scope.noResult = false;
            } else {
              $scope.results = [];
              $scope.noResult = true;
              $scope.totalItems = 0;
              $scope.totalPages = 0;
            }
          } else {
            $scope.results = [];
            $scope.noResult = true;
            $scope.totalItems = 0;
            $scope.totalPages = 0;
          }
        }, function(error) {
          mModalAlert.showError(error.data.message, 'Error');
        });   
      }
    }

    // Funcion que se activa al limpiar filtros
    function limpiar() {
      $scope.filter = "";
      $scope.totalItems = 0;
      $scope.totalPages = 0;
      $scope.noResult = true;
      $scope.results = [];

      filtrar();
    }

    // Funcion para mostrar/ocultar clinicas
    function openClinicas(item) {
      item.show = !item.show;
    };

  } //  end controller

  return ng
    .module("appCgw")
    .controller("ModalDatosScanController", ModalDatosScanController)
    .component("mfpModalDatosScan", {
      templateUrl: "/cgw/app/consultaCG/component/modalDatosScan/modalDatosScan.html",
      controller: "ModalDatosScanController",
      bindings: {
        close: "&?",
        carta: "=?",
      },
    })
    .directive("preventDefault", function () {
      return function (scope, element, attrs) {
        angular.element(element).bind("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
        });
      };
    });
});
