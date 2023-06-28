define(["angular", "/cgw/app/factory/cgwFactory.js"], function (ng) {

  ModalScanAuditoriaController.$inject = ["$scope", "$state", "MxPaginador", "cgwFactory"];

  function ModalScanAuditoriaController($scope, $state, MxPaginador, cgwFactory) {
    var vm = this;
    $scope.mPagination = 1;
    $scope.pageSize = 5;

    var page = new MxPaginador();
    page.setNroItemsPorPagina($scope.pageSize);

    $scope.filter = "";
    $scope.results = [];
    $scope.disabledScan = true;
    $scope.disabledSaveClinics = true;

    $scope.formData = { selectItem : null, checkAllItems: false, selectPostion: -1 };
    $scope.clinicas = [];
    $scope.clinicsToAdd = {};

    //Solicitar Scan
    $scope.solicitarScan = solicitarScan;
    $scope.guardarAsignacion = guardarAsignacion;
    $scope.showClinics = showClinics;
    $scope.hideClinics = hideClinics;
    $scope.selectAllClinics = selectAllClinics;
    $scope.selectClinic = selectClinic;
    $scope.isDisabledScan = isDisabledScan;

    //Lista de resultados
    $scope.filtrar = filtrar;
    $scope.limpiar = limpiar;
    $scope.pageChanged = pageChanged;
    
    $scope.addClinics = false;
    $scope.agregarClinicas ="/cgw/app/consultaCG/component/modalScanAuditoria/agregarClinicas/agregarClinicas.html";

    (
      function onLoad() {
        filtrar();
      }
    )();

    // Funcion que se activa para mostrar seleccion de clinicas
    function showClinics(item, index) {
      $scope.addClinics = true;
      $scope.formData.selectItem = item;
      $scope.formData.selectPostion = index;
      listarClinicas(item.cod_usuario);
    }

    // Funcion que se activa para ocultar seleccion de clinicas
    function hideClinics() {
      $scope.addClinics = false;
      $scope.formData.selectItem = null;
      $scope.formData.selectPostion = -1;
      $scope.clinicas = [];
      $scope.noResultClinics = true;
    }

    // Funcion que se activa al seleccionar todas las clinicas
    function selectAllClinics() {
      var selectAll = $scope.formData.checkAllItems;
      $scope.disabledSaveClinics = !selectAll;
      angular.forEach($scope.clinicas, function(itm){ itm.checkItem = selectAll; });
    }

    // Funcion que se activa al seleccionar una clinica
    function selectClinic() {
      var haveClinicsSelect = _.find($scope.clinicas, function (o) { return o.checkItem; }) || [];
      $scope.disabledSaveClinics = haveClinicsSelect.length == 0;
      $scope.formData.checkAllItems = $scope.clinicas.every(function(itm){ return itm.checkItem; })
    }

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

        cgwFactory.GetCoordinatorByGuaranteeLetter(vm.carta.Year, vm.carta.Number, paramsSearch, true).then(function(response) {
          if (response.data) {
            if (response.data.lista.length > 0) {
              $scope.results = response.data.lista;
              seleccionarClinicasCoordinador();
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

    // Funcion que obtiene la lista de clinicas de un coordinador
    function listarClinicas(IdUser) {
      var params = {
        PageNumber: 1,
        PageSize: 100,
      };

      cgwFactory.GetClinicsByCoordinatorToScanRequest(vm.carta.Year, vm.carta.Number, IdUser, params, true).then(function(response) {
        if (response.operationCode == 200) {
          if (response.data) {
            if (response.data.lista.length > 0) {
              $scope.clinicas = response.data.lista;
              cargarClinicasSeleccionadas(IdUser);
              $scope.noResultClinics = false;
            } else {
              $scope.clinicas = [];
              $scope.noResultClinics = true;
            }
          } else {
            $scope.clinicas = [];
            $scope.noResultClinics = true;
          }
        }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    // Funcion que se activa al cancelar proceso de solicitar SCAN
    function solicitarScan() {
      var listScan = [];
      var items = Object.values($scope.clinicsToAdd);
      angular.forEach(items, function(itm){ 
        angular.forEach(itm, function(itm2){ 
          listScan.push(itm2);
        });
      });
      
      var params = { usuario: vm.carta.UserLogin, listscan: listScan };

      cgwFactory.SaveScanRequest(vm.carta.Year, vm.carta.Number, params, true).then(function(response) {
        if (response.operationCode == 200) {
          vm.close();
          $state.reload();
        } else {
          mModalAlert.showError(response.message, 'Error');
        }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    // Funcion que se activa al procesar el guardado de clinicas seleccionadas
    function guardarAsignacion() {
      var totalSelect = 0;
      var items = [];
      
      var currentCoordinator = $scope.clinicas[0].coordinator;
      if($scope.clinicsToAdd.hasOwnProperty(currentCoordinator)) {
        delete $scope.clinicsToAdd[currentCoordinator];
      }

      angular.forEach($scope.clinicas, function(itm){ 
        if(itm.checkItem) {
          var element = {
            coordinator: itm.coordinator,
            codClinic: itm.codClinic,
            nSucClinic: itm.nSucClinic
          };
          items.push(element);
          $scope.clinicsToAdd[itm.coordinator] = items;
          totalSelect++;
        }
      });

      $scope.disabledScan = Object.keys($scope.clinicsToAdd).length === 0;

      $scope.formData.selectItem.cant_scan = String(totalSelect);
      $scope.clinicas[$scope.formData.selectPostion] = $scope.formData.selectItem;

      $scope.formData.selectPostion = -1;
      $scope.formData.selectItem = null;
      $scope.addClinics = false;
    }

    // Funcion que valida si boton solicitar scan está habilidado o no
    function isDisabledScan() {
      $scope.disabledScan = Object.keys($scope.clinicsToAdd).length === 0;
      return $scope.disabledScan;
    }

    // Funcion que obtiene las clinicas por coordinador para seleccionarlas
    function seleccionarClinicasCoordinador() {
      angular.forEach($scope.results, function(itm){ 
        var clinicas = $scope.clinicsToAdd[itm.cod_usuario] || [];
        if(clinicas.length == 0) {
          var params = { PageNumber: 1, PageSize: 100 };
    
          cgwFactory.GetClinicsByCoordinatorToScanRequest(vm.carta.Year, vm.carta.Number, itm.cod_usuario, params, true).then(function(response) {
            if (response.operationCode == 200) {
              if (response.data) {
                if (response.data.lista.length > 0) {
                  clinicas = response.data.lista;
                  var items = [];
                  angular.forEach(clinicas, function(itm2){
                    var element = {
                      coordinator: itm2.coordinator,
                      codClinic: itm2.codClinic,
                      nSucClinic: itm2.nSucClinic
                    };
                    items.push(element);
                    $scope.clinicsToAdd[itm.cod_usuario] = items;
                  });
                } else {
                  clinicas = [];
                }
              } else {
                clinicas = [];
              }
              itm.cant_scan = String(clinicas.length);
            }
          });
        } else {
          calcularCantidadClinicasSeleccionadas();
        }
      });
    }

    // Funcion que calcula la cantidad de clinicas seleccionadas
    function calcularCantidadClinicasSeleccionadas() {
      angular.forEach($scope.results, function(itm){ 
        var clinicas = $scope.clinicsToAdd[itm.cod_usuario] || [];
        itm.cant_scan = String(clinicas.length);
      });
    }

    // Funcion que genera el check en caso se haya seleccionado antes algunas clinicas
    function cargarClinicasSeleccionadas(coordinatorId) {
      var items = $scope.clinicsToAdd[coordinatorId] || [];
      angular.forEach($scope.clinicas, function(itm){ 
        if(items.length == 0) {
          $scope.formData.checkAllItems = true;
          selectAllClinics();
        } else {
          angular.forEach(items, function(itm2){
            if(itm2.codClinic == itm.codClinic && itm2.nSucClinic == itm.nSucClinic){
              itm.checkItem = true;  
            }
          });
        }
      });
      selectClinic();
    }
  } //  end controller

  return ng
    .module("appCgw")
    .controller("ModalScanAuditoriaController", ModalScanAuditoriaController)
    .component("mfpModalScanAuditoria", {
      templateUrl: "/cgw/app/consultaCG/component/modalScanAuditoria/modalScanAuditoria.html",
      controller: "ModalScanAuditoriaController",
      bindings: {
        close: "&?",
        carta: "=?",
      }
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
