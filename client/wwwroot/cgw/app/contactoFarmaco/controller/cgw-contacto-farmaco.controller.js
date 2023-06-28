define(["angular", "/cgw/app/factory/cgwFactory.js", "mfpModalQuestion"], function (ng) {
  
  cgwContactoFarmacoController.$inject = ["$scope", "cgwFactory", "$uibModal", "mModalAlert", 
    "MxPaginador", "oimClaims"];

  function cgwContactoFarmacoController($scope, cgwFactory, $uibModal, mModalAlert, 
    MxPaginador, oimClaims) {
    $scope.mPagination = 1;
    $scope.pageSize = 10;

    var page = new MxPaginador();
    page.setNroItemsPorPagina($scope.pageSize);

    $scope.filter = "";
    $scope.results = [];
    $scope.filterPlaceholder = 'Nombre o apellido del contacto';

    $scope.showNewItem = false;
    $scope.showEditItem = false;

    $scope.formData = { selectItem : null, newItem: null };

    $scope.nuevoContactoFarmaco = '/cgw/app/contactoFarmaco/component/nuevoContactoFarmaco.html';
    $scope.edicionContactoFarmaco = '/cgw/app/contactoFarmaco/component/edicionContactoFarmaco.html';

    //Formulario
    $scope.filtrar = filtrar;
    $scope.limpiar = limpiar;
    $scope.pageChanged = pageChanged;

    $scope.mostrarCrearRegistro = mostrarCrearRegistro;
    $scope.mostrarEditarRegistro = mostrarEditarRegistro;
    $scope.mostrarEliminarRegistro = mostrarEliminarRegistro;

    $scope.crearContacto = crearContacto;
    $scope.editarContacto = editarContacto;

    (
      function onLoad() {
        filtrar();
      }
    )();

    // Funcion que se activa al presionar el boton de busqueda
    function filtrar() {
      $scope.paramsSearch = {
        Filter: $scope.filter ? $scope.filter.toUpperCase() : '',
        PageNumber: 1,
        PageSize: $scope.pageSize,
      };

      buscar($scope.paramsSearch);
    }

    // Función que se activa al cambiar de página
    function pageChanged(event) {
      $scope.paramsSearch = {
        Filter: $scope.filter ? $scope.filter.toUpperCase : '',
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

        cgwFactory.GetListContacto(paramsSearch, true).then(function(response) {
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
          nombres: item.nmbrs,
          apellidos: item.aplldos,
          correo: item.celctrnco
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
            eliminarContacto(item);
            $uibModalInstance.close();
          };

          scope.data = {
            title: '¿Está seguro de eliminar el contacto?',
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
    function crearContacto() {
      var params = {
        nmbrs: $scope.formData.newItem.nombres,
        aplldos: $scope.formData.newItem.apellidos,
        celctrnco: $scope.formData.newItem.correo,
        usuario: oimClaims.loginUserName.toUpperCase()
      }

      cgwFactory.SaveContacto(params, true).then(function(response) {
        if (response.operationCode == 200) {
          limpiar();
        } else {
          mModalAlert.showError(response.message, 'Error');
        }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    // Funcion que consume servicio para editar un registro
    function editarContacto() {
      var id = $scope.formData.selectItem.id;

      var params = {
        nmbrs: $scope.formData.selectItem.nombres,
        aplldos: $scope.formData.selectItem.apellidos,
        celctrnco: $scope.formData.selectItem.correo,
        usuario: oimClaims.loginUserName.toUpperCase()
      }

      cgwFactory.EditContacto(id, params, true).then(function(response) {
        if (response.operationCode == 200) {
          limpiar();
        } else {
          mModalAlert.showError(response.message, 'Error');
        }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    // Funcion que consume servicio para eliminar un registro
    function eliminarContacto(item) {
      cgwFactory.DeleteContacto(item.id, true).then(function(response) {
        if (response.operationCode == 200) {
          limpiar();
        } else {
          mModalAlert.showError(response.message, 'Error');
        }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

  } //  end controller

  return ng
    .module("appCgw")
    .controller("CgwContactoFarmacoController", cgwContactoFarmacoController);
});
