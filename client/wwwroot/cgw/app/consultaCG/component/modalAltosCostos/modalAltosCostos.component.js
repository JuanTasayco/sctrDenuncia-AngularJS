define(["angular", "/cgw/app/factory/cgwFactory.js"], function(ng) {
  
  ModalAltosCostosController.$inject = ["$scope", "$q", "cgwFactory"];
  
  function ModalAltosCostosController($scope, $q, cgwFactory) {
    var vm = this;

    $scope.results = [];
    $scope.optionsNumber = { scale: 0 };
    $scope.optionsMoney = { scale: 2, simbol: { value: 'S/', align: 'left' } };
    $scope.listFormaFarmaceutica = [];
    $scope.listMedicamento = [];

    $scope.countInitial = 0;

    $scope.selectMedicine = selectMedicine;
    $scope.getListMedicamento = getListMedicamento;
    $scope.agregarMedicamento = agregarMedicamento;
    $scope.calcularPrecioTotal = calcularPrecioTotal;

    $scope.listar = listar;
    $scope.eliminar = eliminar;
    $scope.disabledGuardar = disabledGuardar;

    $scope.guardar = guardar;

    (
      function onLoad() {
        listar();
      }
    )();

    function getListMedicamento(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var params = {
          Filter: wilcar.toUpperCase()
        };

        var defer = $q.defer();
        cgwFactory.GetMedicines(params, false).then(function (response) {
          defer.resolve(response.data.lista);
        });

        return defer.promise;
      }
    }

    // Funciont para agregar medicamento
    function agregarMedicamento() {
      var emptyMedicine = {local: true};
      $scope.results.push(emptyMedicine);
    }
    
    // Función para guardar registros
    function guardar() {
      var listMed = [];
      angular.forEach($scope.results, function(itm){ 
        if(itm.cantidad &&  itm.comercialCost && itm.medicamento) {
          var item  = {
            articleCod: itm.medicamento ? itm.medicamento.articleCod.trim() : null ,
            cantidad: itm.cantidad,
            comercialCost: itm.comercialCost,
          }

          listMed.push(item);
        }
      });

      if(listMed.length > 0) {
        var params = { usuario: vm.carta.UserLogin, listMed: listMed };
        
        cgwFactory.SaveHighCostMedicine(vm.carta.Year, vm.carta.Number, vm.carta.Version, params, true).then(function(response) {
          if (response.operationCode == 200) {
            vm.close();
          } else {
            mModalAlert.showError(response.message, 'Error');
          }
        }, function(error) {
          mModalAlert.showError(error.data.message, 'Error');
        });
      }
    }

    // Funcion para listar items
    function listar() {
      cgwFactory.GetHighCostMedicine(vm.carta.Year, vm.carta.Number, vm.carta.Version, true).then(function(response) {
        if (response.data) {
          $scope.results = response.data;
          angular.forEach($scope.results, function(itm){ 
            itm.local = false; 
            itm.medicamento = {
              articleDesc: itm.articleDesc,
              articleCod: itm.articleCod.trim()
            }
          });
          $scope.countInitial = $scope.results.length;
          agregarMedicamento();
        } else {
          $scope.results = [];
          $scope.countInitial = 0;
        }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    // Funcion para eliminar item
    function eliminar(position) {
      var copy = angular.copy($scope.results);
        copy.splice(position, 1);
      
        $scope.results = [];
        setTimeout(function () {
          $scope.results = copy;
          $scope.$apply();
        }, 100);
      }

    // Funcion para validar estado de boton guardar
    function disabledGuardar() {
      var disabled = false;
      angular.forEach($scope.results, function(itm){ 
        if(!itm.cantidad ||  !itm.comercialCost || !itm.medicamento) {
          disabled = true;
        }
      });

      var changeList = $scope.countInitial != $scope.results.length - 1;

      return disabled;
    }

    // Funcio para recalcular el precio total
    function calcularPrecioTotal(item) {
      if(item.cantidad && item.comercialCost) item.totalCost = Number(item.cantidad) * Number(item.comercialCost);
    }

    // Funcion que se dispara al seleccionar medicamento
    function selectMedicine(item) {
      if(item.medicamento.puntro) {
        item.comercialCost = Number(item.medicamento.puntro);
      }
    }

  }
  
  return ng.module("appCgw")
    .controller("ModalAltosCostosController", ModalAltosCostosController)
    .component("mfpModalAltosCostos", {
      templateUrl: "/cgw/app/consultaCG/component/modalAltosCostos/modalAltosCostos.html",
      controller: "ModalAltosCostosController",
      bindings: {
        close: '&?',
        carta: '=?'
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
  