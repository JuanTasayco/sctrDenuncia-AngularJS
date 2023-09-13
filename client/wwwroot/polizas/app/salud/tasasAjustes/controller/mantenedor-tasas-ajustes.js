'use strict';
define([
  'angular', 'constants'
], function(angular, constants){

  var appSalud = angular.module('appSalud');

  appSalud.controller('mantenedorTasasAjustesController', ['$scope', 'saludFactory', 'mModalAlert','$uibModal',
    function($scope, saludFactory, mModalAlert, $uibModal){
    var vm = this;

    vm.combos = {};
    vm.parametros = {};

    var flagFirstAction = false;

    function init() {
      _loadContratos();
      _loadClases();
      clearPager();
    }

    // Limpiar paginador
    function clearPager() {
      vm.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalItems: 0,
        items: [],
        noSearch: true,
        noResult: false
      };
    }
    
    // Cargar combo de contratos
    function _loadContratos() {
      saludFactory.getProducts().then(function(response) {
        if (response.OperationCode === constants.operationCode.success) {
          vm.combos.contratos = response.Data;
        } else {
          vm.combos.contratos = [];
        }
      });
    }

    // Cargar combo de clases
    function _loadClases() {
      saludFactory.listarClases().then(function(response) {
        if(response.OperationCode == 200) {
          vm.combos.clases = response.Data;
        } else {
          vm.combos.clases = [];
        }
      });
    }

    // Funcion de accion para un item del listado
    function accionItem(event) {
      if(event.evento === 'estado'){
        changeStatus(event.tasa);
      } else if(event.evento === 'editar'){
        showModalEditarTasaAjuste(event.tasa.tasaId);
      }
    }

    // Cambio de estado desde el listado
    function changeStatus(data) {
      var request = {
        mcaActivo: data.mcaActivo
      };

      saludFactory.actualizarTasasAjustes(data.tasaId, 2, request, true).then(function(response) {
        if(response.operationCode !== 1) {
          mModalAlert.showError('Hubo un error al actualizar la tasa de ajuste', 'Tasa de ajuste');
        }
      });
    }

    // Funcion para mostrar formulario para nueva tasa de ajuste
    function showModalAgregarTasaAjuste() {
      showModalTasaAjuste(null, 'Agregar tasa de ajuste');
    }

    // Funcion para mostrar formulario para editar tasa de ajuste
    function showModalEditarTasaAjuste(tasaAjusteId) {
      showModalTasaAjuste(tasaAjusteId, 'Editar tasa de ajuste');
    }

    // Mostrar modal de tasa de ajustes
    function showModalTasaAjuste(tasaAjusteId, title){
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'sm',
        templateUrl : '/polizas/app/salud/popup/controller/popupTasaAjuste.html',
        controller : ['$scope', '$uibModalInstance', 'saludFactory', 'mModalAlert',
          function($scope, $uibModalInstance, saludFactory, mModalAlert) {
            $scope.tasa = {};
            $scope.isEditable = tasaAjusteId !== null;

            $scope.clases = vm.combos.clases;
            $scope.contratos = vm.combos.contratos;
            $scope.title = title;

            if($scope.isEditable) {
              saludFactory.obtenerTasaAjuste(tasaAjusteId, true).then(function(response) {
                if(response.operationCode == 1) {
                  $scope.tasa.clase = _.find($scope.clases, function (x) { return x.descripcionClase && x.descripcionClase.toLowerCase() == response.tasaAjuste.clase.toLowerCase().trim(); });
                  $scope.tasa.contrato = _.find($scope.contratos, function (x) { return x.NumeroSubContrato == response.tasaAjuste.subContrato; });;
                  $scope.tasa.porcentajeAjuste = response.tasaAjuste.porcentajeAjuste;
                  $scope.tasa.mcaActivo = response.tasaAjuste.mcaActivo;
                } else {
                  mModalAlert.showError('Hubo un error al obtener el detalle de la tasa de ajuste', 'Tasa de ajuste');
                }
              });
            }

            $scope.closeModal = function () {
              $uibModalInstance.close();
            };

            $scope.guardar = function () {
              if (!$scope.formTasaAjuste.$valid) {
                $scope.formTasaAjuste.markAsPristine();
                mModalAlert.showError("Verifique que los datos estén correctos.", "Tasa de Ajuste");
                return;
              }

              if($scope.tasa.porcentajeAjuste > 100 || $scope.tasa.porcentajeAjuste < -100) {
                $scope.formTasaAjuste.markAsPristine();
                mModalAlert.showError("El porcentaje de ajuste no se encuentra en el rango válido.", "Tasa de Ajuste");
                return;
              }

              var request = {
                porcentajeAjuste: $scope.tasa.porcentajeAjuste,
                mcaActivo: $scope.tasa.mcaActivo
              };

              if($scope.isEditable) {
                saludFactory.actualizarTasasAjustes(tasaAjusteId, 1, request, true).then(function(response) {
                  if(response.operationCode == 1) {
                    $uibModalInstance.close();
                    buscarTasas();
                  } else if(response.operationCode == 400) {
					mModalAlert.showError(response.mensaje, 'Tasa de ajuste');  
				  } else {
                    mModalAlert.showError('Hubo un error al actualizar la tasa de ajuste', 'Tasa de ajuste');
                  }
                });
              } else {
                request.clase = $scope.tasa.clase.descripcionClase;
                request.contrato = $scope.tasa.contrato.NumeroContrato;
                request.subContrato = $scope.tasa.contrato.NumeroSubContrato;

                saludFactory.registrarTasaAjuste(request, true).then(function(response) {
                  if(response.operationCode == 1) {
                    $uibModalInstance.close();
                    buscarTasas();
                  } else if(response.operationCode == 400) {
					mModalAlert.showError(response.mensaje, 'Tasa de ajuste');  
				  } else {
                    mModalAlert.showError('Hubo un error al registrar la tasa de ajuste', 'Tasa de ajuste');
                  }
                });
              }
            };
          }
        ]
      });
    }

    // Funcion callback de buscador
    function searchTasas(filtros) {
      setRequestData(filtros);
      buscarTasas();
    }

    // Setear los datos de filtros
    function setRequestData(filtros) {
      vm.parametros = {
        clase: (filtros && filtros.clase) || '',
        contrato: (filtros && filtros.contrato) || null,
        subContrato: (filtros && filtros.subContrato) || null,
        tamanio: vm.pagination.maxSize,
        pagina: vm.pagination.currentPage
      };
    }

    // Buscar tasas via ws
    function buscarTasas() {
      saludFactory.buscarTasasAjustes(vm.parametros, true).then(function(response) {
        flagFirstAction = false;

        if(response.operationCode === 1) {
          vm.pagination.totalItems = parseInt(response.nroRegistros);
          vm.pagination.items = response.clases;
          vm.pagination.noSearch = false;
          vm.pagination.noResult = response.clases.length === 0;
        } else {
          mModalAlert.showError('Hubo un problema en la búsqueda', 'Tasa de Ajuste');
          vm.pagination.totalItems = 0;
          vm.pagination.noSearch = true;
          vm.pagination.noResult = false;
          vm.pagination.items = [];
        }
      });
    }

    // Limpiar filtros
    function limpiarResultados() {
      clearPager();
    }

    // Cambiar de pagina
    function pageChanged(currentPage) {
      vm.parametros.pagina = currentPage;
      buscarTasas();
    }

    vm.$onInit = init;
    vm.showModalAgregarTasaAjuste = showModalAgregarTasaAjuste;
    vm.accionItem = accionItem;
    vm.searchTasas = searchTasas;
    vm.limpiarResultados = limpiarResultados;
    vm.pageChanged = pageChanged;
  }]);
});
