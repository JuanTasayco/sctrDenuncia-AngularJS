define(["angular", "/cgw/app/factory/cgwFactory.js"], function (ng) {

  cgwAsignarClinicaRolController.$inject = ["$scope", "cgwFactory", "$state", "mModalAlert", "MxPaginador", "localStorageService"];

  function cgwAsignarClinicaRolController($scope, cgwFactory, $state, mModalAlert, MxPaginador, localStorageService) {
    $scope.mPagination = 1;
    $scope.pageSize = 10;

    var page = new MxPaginador();
    page.setNroItemsPorPagina($scope.pageSize);

    $scope.filter = "";
    $scope.results = [];
    $scope.finishSearch = false;

    //Formulario
    $scope.setRole = setRole;
    $scope.filtrar = filtrar;
    $scope.limpiar = limpiar;
    $scope.pageChanged = pageChanged;
    $scope.verDetalle = verDetalle;

    $scope.labelBuscador = 'Nombre del ejecutivo';

    (
      function onLoad() {
        initData();
        filtrar();
      }
    )();

    // Inicializar data
    function initData() {
      var value = localStorageService.get('assignClinicRole');
      if (!value) {
        $scope.role = 1;
        $scope.labelBuscador = 'Nombre o apellido del ejecutivo';
      } else {
        $scope.role = value;
        $scope.labelBuscador = 'Nombre o apellido del coordinador';
      }
    }

    // Funcion que se activa al seleccionar el rol
    function setRole(role) {
      $scope.role = role;
      $scope.labelBuscador = role == 1 ? 'Nombre o apellido del ejecutivo' : 'Nombre o apellido del coordinador';
      localStorageService.set('assignClinicRole', $scope.role);
      $scope.finishSearch = false;
      
      limpiar();
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

        if($scope.role == 1) {
          cgwFactory.GetListExecutives(paramsSearch, true).then(function(response) {
            $scope.finishSearch = true;
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
        } else {
          cgwFactory.GetListCoordinator(paramsSearch, true).then(function(response) {
            $scope.finishSearch = true;
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

    // Funcion que se activa al seleccionar un registro
    function verDetalle(item) {
      $state.go(
        "detalleAsignarClinicaRol",
        { id: item.cod_usuario, rol: $scope.role, usuario: item.nom_persona1 + ' ' + item.ape_paterno + ' ' + item.ape_materno },
        { reload: true, inherit: false }
      );
    }
  } //  end controller

  return ng
    .module("appCgw")
    .controller("CgwAsignarClinicaRolController",cgwAsignarClinicaRolController);
});
