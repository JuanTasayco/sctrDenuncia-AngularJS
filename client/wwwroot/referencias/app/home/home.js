define(['angular', 'constants'], function (ng, constants) {

  HomeController.$inject = ['$scope', 'localStorageService', 'mpSpin', 'proxyFiltro', '$q'];

  function HomeController($scope, localStorageService, mpSpin, proxyFiltro, $q) {
    (
      function onLoad() {
        $scope.showFilters = true;
        $scope.filtersData = {};
        $scope.masters = {};
        localStorageService.set('filtersData', $scope.filtersData);

        loadDataFilters();

        function loadDataFilters() {
          mpSpin.start();

          proxyFiltro.ListarFiltros({ cFiltro: "1", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.departamentos = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "3", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.tipos = response.listaFiltros;
              }
            });

          proxyFiltro.ListarFiltros({ cFiltro: "19", modificador: "" })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.masters.usuario = response.listaFiltros;
              }
            });

          mpSpin.end();

        }

        $scope.reloadFiltersData = function (search, params, showLoad) {
          switch (search) {
            case 'prvnceOrgn':
              if (params.cFiltro, params.modificador) {
                if (showLoad) mpSpin.start();
                proxyFiltro.ListarFiltros(params)
                  .then(function (response) {
                    if (response.codErr == 0) {
                      $scope.masters.provinciasOrigen = response.listaFiltros;
                    }
                  });
                if (showLoad) mpSpin.end();

              } else {
                $scope.masters.provincias = [];
              }
              break;
            case 'prvnceDstn':
              if (params.cFiltro, params.modificador) {
                if (showLoad) mpSpin.start();
                proxyFiltro.ListarFiltros(params)
                  .then(function (response) {
                    if (response.codErr == 0) {
                      $scope.masters.provinciasDestino = response.listaFiltros;
                    }
                  });
                if (showLoad) mpSpin.end();
              } else {
                $scope.masters.provincias = [];
              }
              break;
          }
        }
      }
    )();
  }

  return ng.module('referencias.app')
    .controller('HomeController', HomeController);
});