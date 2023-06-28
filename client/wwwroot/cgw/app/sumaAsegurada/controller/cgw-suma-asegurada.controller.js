define(["angular", "/cgw/app/factory/cgwFactory.js", "mfpModalQuestion"], function (ng) {
  
  cgwSumaAseguradaController.$inject = ["$scope", "cgwFactory", "$q", "$uibModal", "mModalAlert", 
    "oimClaims", "MxPaginador"];

  function cgwSumaAseguradaController($scope, cgwFactory, $q, $uibModal, mModalAlert, 
    oimClaims, MxPaginador) {
    $scope.mPagination = 1;
    $scope.pageSize = 10;

    var page = new MxPaginador();
    page.setNroItemsPorPagina($scope.pageSize);

    $scope.filterData = {};
    $scope.results = [];

    $scope.showNewItem = false;
    $scope.showEditItem = false;

    $scope.formData = { selectItem : null, newItem: null };

    $scope.nuevaSumaAsegurada = "/cgw/app/sumaAsegurada/component/nuevaSumaAsegurada.html";
    $scope.edicionSumaAsegurada = "/cgw/app/sumaAsegurada/component/edicionSumaAsegurada.html";

    $scope.optionsMoney = { scale: 2, simbol: { value: 'S/', align: 'left' } };

    $scope.getListCoverage = getListCoverage;
    $scope.getListDiagnostic = getListDiagnostic;

    //Formulario
    $scope.filtrar = filtrar;
    $scope.limpiar = limpiar;
    $scope.pageChanged = pageChanged;

    $scope.mostrarCrearRegistro = mostrarCrearRegistro;
    $scope.mostrarEditarRegistro = mostrarEditarRegistro;
    $scope.mostrarEliminarRegistro = mostrarEliminarRegistro;

    $scope.crearSumaAsegurada = crearSumaAsegurada;
    $scope.editarSumaAsegurada = editarSumaAsegurada;

    (
      function onLoad() {
        filtrar();
      }
    )();

    // Funcion que se activa al presionar el boton de busqueda
    function filtrar() {
      var beneficio = $scope.filterData && $scope.filterData.cobertura ? $scope.filterData.cobertura.code : "";
      var diagnostico = $scope.filterData && $scope.filterData.diagnostico ? $scope.filterData.diagnostico.code : ""

      $scope.paramsSearch = {
        Beneficio: beneficio,
        Diagnostico: diagnostico,
        PageNumber: 1,
        PageSize: $scope.pageSize,
      };

      buscar($scope.paramsSearch);
    }

    // Función que se activa al cambiar de página
    function pageChanged(event) {
      var beneficio = $scope.filterData && $scope.filterData.cobertura ? $scope.filterData.cobertura.code : "";
      var diagnostico = $scope.filterData && $scope.filterData.diagnostico ? $scope.filterData.diagnostico.code : ""
      
      $scope.paramsSearch = {
        Beneficio: beneficio,
        Diagnostico: diagnostico,
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

        $scope.showNewItem = false;
        $scope.showEditItem = false;
        $scope.selectItemPosition = -1;
        $scope.formData.selectItem = null;
        $scope.formData.newItem = null;

        cgwFactory.GetListSumaAsegurada(paramsSearch, true).then(function(response) {
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
      $scope.filterData = null;
      $scope.totalItems = 0;
      $scope.totalPages = 0;
      $scope.noResult = true;
      $scope.results = [];

      filtrar();
    }

    // Funcion que se activa al crear un nuevo registro
    function mostrarCrearRegistro() {
      $scope.formData.newItem = null;
      $scope.showNewItem = !$scope.showNewItem;
    }

    // Funcion que se activa al editar un registro
    function mostrarEditarRegistro(item, show, position) {
      if(show && item) {
        $scope.formData.selectItem = {
          id: item.id,
          cobertura: {
            code: item.cbnfco,
            name: item.dbnfco
          },
          diagnostico: {
            code: item.cdgnstco,
            name: item.ddgnstco
          },
          sumaAsegurada: Number(item.sasgrda)
        }
      } else {
        $scope.formData.selectItem = null;
      }
      $scope.selectItemPosition = position;
      $scope.showEditItem = show;
    }

    // Funcion que se activa al eliminar un registro
    function mostrarEliminarRegistro(item) {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        template: '<mfp-modal-question data="data" close="close()"></mfp-modal-question>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function clFn() {
            $uibModalInstance.close();
          };

          scope.eliminarRegistro = function() {
            eliminarSumaAsegurada(item);
            $uibModalInstance.close();
          };

          scope.data = {
            title: '¿Está seguro de eliminar la suma asegurada?',
            btns: [
              {
                lbl: 'No',
                accion: scope.close,
                clases: 'g-btn-transparent'
              },
              {
                lbl: 'Si',
                accion: scope.eliminarRegistro,
                clases: 'g-btn-verde'
              }
            ]
          };
        }] // end Controller uibModal
      });
    }

    // Funcion que consume servicio para crear nuevo registro
    function crearSumaAsegurada() {
      if($scope.formData.newItem && ($scope.formData.newItem.cobertura == null && $scope.formData.newItem.diagnostico == null)) {
        mModalAlert.showError("Debe ingresar cobertura o diagnostico", "Error");
      } else {
        var params = {
          cbnfco: $scope.formData.newItem.cobertura ? $scope.formData.newItem.cobertura.code : null,
          cdgnstco: $scope.formData.newItem.diagnostico ? $scope.formData.newItem.diagnostico.code : null,
          sasgrda: $scope.formData.newItem.sumaAsegurada,
          usuario: oimClaims.loginUserName.toUpperCase()
        }
        
        cgwFactory.SaveSumaAsegurada(params, true).then(function(response) {
          if (response.operationCode == 200) {
            limpiar();
          } else {
            mModalAlert.showError(response.message, 'Error');  
          }
        }, function(error) {
          mModalAlert.showError(error.data.message, 'Error');
        });
      }
    }

    // Funcion que consume servicio para editar un registro
    function editarSumaAsegurada() {
      if($scope.formData.selectItem && ($scope.formData.selectItem.cobertura == null && $scope.formData.selectItem.diagnostico == null)) {
        mModalAlert.showError("Debe ingresar cobertura o diagnostico", "Error");
      } else {
        var id = $scope.formData.selectItem.id;

        var params = {
          cbnfco: $scope.formData.selectItem.cobertura ? $scope.formData.selectItem.cobertura.code : null,
          cdgnstco: $scope.formData.selectItem.diagnostico ? $scope.formData.selectItem.diagnostico.code : null,
          sasgrda: $scope.formData.selectItem.sumaAsegurada,
          usuario: oimClaims.loginUserName.toUpperCase()
        }

        cgwFactory.EditSumaAsegurada(id, params, true).then(function(response) {
          if (response.operationCode == 200) {
            limpiar();
          } else {
            mModalAlert.showError(response.message, 'Error');
          }
        }, function(error) {
          mModalAlert.showError(error.data.message, 'Error');
        });
      }
    }

    // Funcion que consume servicio para eliminar un registro
    function eliminarSumaAsegurada(item) {      
      cgwFactory.DeleteSumaAsegurada(item.id, true).then(function(response) {
        if (response.operationCode == 200) {
          limpiar();
        } else {
          mModalAlert.showError(response.message, 'Error');
        }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    // Funcion que busca coberturas en base al texto colocado
    function getListCoverage(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var paramCoverage = {
          Filter: wilcar.toUpperCase()
        };

        var defer = $q.defer();
        cgwFactory.getCoberturaSearch(paramCoverage).then(function (response) {
          defer.resolve(response.data);
        });

        return defer.promise;
      }
    }

    // Funcion que busca diagnosticos en base al texto colocado
    function getListDiagnostic(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var paramDiagnostico = {
          diagnosticName: wilcar.toUpperCase()
        };

        var defer = $q.defer();
        cgwFactory.getListDiagnostic(paramDiagnostico, false).then(function (response) {
          defer.resolve(response.data.items);
        });

        return defer.promise;
      }
    }

  } //  end controller

  return ng
    .module("appCgw")
    .controller("CgwSumaAseguradaController",cgwSumaAseguradaController);
});
