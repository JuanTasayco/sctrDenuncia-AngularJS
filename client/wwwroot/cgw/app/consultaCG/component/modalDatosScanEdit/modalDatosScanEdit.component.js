define(["angular", "/cgw/app/factory/cgwFactory.js"], function (ng) {
  
  ModalDatosScanEditController.$inject = ["$scope", "MxPaginador", "cgwFactory"];

  function ModalDatosScanEditController($scope, MxPaginador, cgwFactory) {
    var vm = this;
    $scope.mPagination = 1;
    $scope.pageSize = 10;

    var page = new MxPaginador();
    page.setNroItemsPorPagina($scope.pageSize);

    $scope.results = [];
    $scope.disabledDatosScan = true;
    $scope.totalEvaluados = 0;

    //Guardar Datos Scan
    $scope.guardarDatosScan = guardarDatosScan;
    $scope.selectItem = selectItem;

    //Lista de resultados
    $scope.pageChanged = pageChanged;
    $scope.selectAll = selectAll;
    
    (
      function onLoad() {
        filtrar();
      }
    )();

    // Funcion que se activa al seleccionar COBERTURA
    function selectItem() {
      var total = 0;
      angular.forEach($scope.results, function(itm){ 
        if(itm.checkItem == "S" || itm.checkItem == "N") total++;
      });

      $scope.totalEvaluados = total;
      $scope.disabledDatosScan = false;
    }

    // Funcion que se activa al presionar el boton de busqueda
    function filtrar() {
      $scope.paramsSearch = {
        PageNumber: 1,
        PageSize: $scope.pageSize,
      };

      buscar($scope.paramsSearch);
    }

    // Función que se activa al cambiar de página
    function pageChanged(event) {
      $scope.paramsSearch = {
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

        cgwFactory.GetClinicsByCoordinatorToScanEdit(vm.carta.Year, vm.carta.Number, vm.carta.UserLogin, paramsSearch, true).then(function(response) {
          if (response.data) {
            if (response.data.lista.length > 0) {
              $scope.results = response.data.lista;
              cargarClinicasSeleccionadas();
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

    // Funcion que se activa al procesar el guardado de nuevos items
    function guardarDatosScan() {
      var listScan = [];
      angular.forEach($scope.results, function(itm){ 
        if(itm.checkItem == "S" || itm.checkItem == "N") {
          var item  = {
            coordinator: itm.coordinator,
            codClinic: itm.codClinic,
            nSucClinic: itm.nSucClinic,
            scanIndicator: itm.checkItem,
            comments: itm.comentario ? itm.comentario.toUpperCase() : ""
          }

          listScan.push(item);
        }
      });
      var params = { usuario: vm.carta.UserLogin, listscan: listScan };
      
      cgwFactory.SaveScanData(vm.carta.Year, vm.carta.Number, params, true).then(function(response) {
        if (response.operationCode == 200) {
          vm.close();
        } else {
          mModalAlert.showError(response.message, 'Error');
        }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    // Funcion que genera el check en caso se haya seleccionado antes algunas clinicas
    function cargarClinicasSeleccionadas() {
      angular.forEach($scope.results, function(itm){ itm.checkItem = itm.scanIndicator; itm.comentario = itm.comments; });
      selectItem();
    }

    // Funcion que selecciona todas las clinicas en base a la opción superior
    function selectAll(selectAllItems) {
      angular.forEach($scope.results, function(itm){ itm.checkItem = selectAllItems; });
      selectItem();
    }

  } //  end controller

  return ng
    .module("appCgw")
    .controller("ModalDatosScanEditController", ModalDatosScanEditController)
    .component("mfpModalDatosScanEdit", {
      templateUrl:
        "/cgw/app/consultaCG/component/modalDatosScanEdit/modalDatosScanEdit.html",
      controller: "ModalDatosScanEditController",
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
