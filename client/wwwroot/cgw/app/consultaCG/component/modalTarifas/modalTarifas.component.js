define(['angular', '/cgw/app/factory/cgwFactory.js'], function(ng) {
  
  ModalTarifasController.$inject = ['$scope', 'MxPaginador', 'cgwFactory'];

  function ModalTarifasController($scope, MxPaginador, cgwFactory) {
    var vm = this;
    $scope.mPagination = 1;
    $scope.pageSize = 10;

    var page = new MxPaginador();
    page.setNroItemsPorPagina($scope.pageSize);

    $scope.tab = 1;
    $scope.results = [];

    $scope.setTab = setTab;
    $scope.pageChanged = pageChanged;
    $scope.openConceptos = openConceptos;

    (
      function onLoad() {
        filtrar();
      }
    )();

    // Funcion que se activa para buscar resultados
    function filtrar() {
      var paramsSearch = {
        PageNumber: 1,
        PageSize: $scope.pageSize
      };

      buscar(paramsSearch);
    }

    // Funcion que actualiza el tab seleccionado
    function setTab(tab) {
      $scope.tab = tab;
      
      filtrar();
    }

    function buscar(paramsSearch ) {
      if (paramsSearch) {
        if (paramsSearch.PageNumber === 1) {
          $scope.totalItems = 0;
          $scope.mPagination = 1;
        }

        if($scope.tab == 1) {
          cgwFactory.GetServicesByGl(vm.carta.Year, vm.carta.Number, paramsSearch , true).then(function(response) {
            if (response.data) {
              if (response.data.length > 0) {
                $scope.totalItems = response.data[0].count;
                if($scope.totalItems == 0) {
                  $scope.results = [];
                  $scope.noResult = true;
                  $scope.totalPages = 0;
                } else {
                $scope.results = response.data;
                  $scope.totalPages = Math.ceil(response.data[0].count / $scope.pageSize);
                $scope.noResult = false;
                }
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
        } else {
          cgwFactory.GetPackagesByGl(vm.carta.Year, vm.carta.Number, paramsSearch , true).then(function(response) {
            if (response.data) {
              if (response.data.length > 0) {
                $scope.results = response.data;
                $scope.totalItems = response.data[0].count;
                if($scope.totalItems == 0) {
                  $scope.results = [];
                  $scope.noResult = true;
                  $scope.totalPages = 0;
                } else {
                  $scope.results = response.data;
                  $scope.totalPages = Math.ceil(response.data[0].count / $scope.pageSize);
                $scope.noResult = false;
                }
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
    }

    function openConceptos(item) {
      if(item && item.listaConcepto && item.listaConcepto.length > 0) item.show = !item.show;
    }

    // Función que se activa al cambiar de página
    function pageChanged(event) {
      $scope.paramsSearch = {
        PageNumber: event,
        PageSize: $scope.pageSize,
      };

      buscar($scope.paramsSearch);
    }

  }
  
  return ng.module('appCgw')
    .controller('ModalTarifasController', ModalTarifasController)
    .component('mfpModalTarifas', {
      templateUrl: '/cgw/app/consultaCG/component/modalTarifas/modalTarifas.html',
      controller: 'ModalTarifasController',
      bindings: {
        close: '&?',
        carta: '=?'
      }
    })
    .directive('preventDefault', function() {
      return function(scope, element, attrs) {
          angular.element(element).bind('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
          });
      }
    });
});
  