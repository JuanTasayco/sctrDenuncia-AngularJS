define(["angular", "/cgw/app/factory/cgwFactory.js", "mfpModalQuestion"], function(ng) {
  
  detalleAsignarClinicaRolController.$inject = ["$scope", "cgwFactory", "$q", 
    "mModalAlert", "oimClaims", "MxPaginador", "$uibModal", "$stateParams"];

  function detalleAsignarClinicaRolController($scope, cgwFactory, $q, 
    mModalAlert, oimClaims, MxPaginador, $uibModal, $stateParams) {
    $scope.mPagination = 1;
    $scope.pageSize = 10;

    var page = new MxPaginador();
    page.setNroItemsPorPagina($scope.pageSize);

    $scope.user = "";
    $scope.tab = 1;
    $scope.role = 1;
    $scope.filter = { text: "" };

    $scope.results = [];

    $scope.showNewItem = false;
    $scope.itemsToAdd = [];

    $scope.formData = { selectItem: "" };

    $scope.tabClinica = "/cgw/app/asignarClinicaRol/component/tabClinica.html";
    $scope.tabDiagnostico = "/cgw/app/asignarClinicaRol/component/tabDiagnostico.html";

    //Formulario
    $scope.setTab = setTab;
    $scope.filtrar = filtrar;
    $scope.limpiar = limpiar;
    $scope.pageChanged = pageChanged;

    //Lista
    $scope.agregarItem = agregarItem;
    $scope.mostrarBorrarClinica = mostrarBorrarClinica;
    $scope.mostrarBorrarDiagnostico = mostrarBorrarDiagnostico;

    //Nuevo Item
    $scope.borrarAgregado = borrarAgregado;
    $scope.cancelarAsignacion = cancelarAsignacion;
    $scope.guardarAsignacionClinica = guardarAsignacionClinica;
    $scope.guardarAsignacionDiagnostico = guardarAsignacionDiagnostico;

    $scope.addNewItem = addNewItem;
    $scope.getListClinic = getListClinic;
    $scope.getListDiagnostic = getListDiagnostic;

    (
      function onLoad() {
        obtenerDetalle();
        filtrar();
      }
    )();

    // Funcion que obtiene el detalle del registro a consultar
    function obtenerDetalle() {
      $scope.user = $stateParams.id;
      $scope.role = $stateParams.rol;

      $scope.detail = {
        nombres: $stateParams.usuario,
        rol: $scope.role == 1 ? 'Ejecutivo Mapfre' : 'Coordinador de Clinica'
      }
    }

    // Funcion que actualiza el tab seleccionado
    function setTab(tab) {
      $scope.tab = tab;
      $scope.showNewItem = false;
      
      limpiar();
    }

    // Funcion que se activa al presionar el boton de busqueda
    function filtrar() {
      $scope.paramsSearch = {
        IdUser: $scope.user,
        Filter: $scope.filter.text.toUpperCase(),
        PageNumber: 1,
        PageSize: $scope.pageSize
      };

      buscar($scope.paramsSearch);
  	}

    // Función que se activa al cambiar de página
    function pageChanged(event) {
      $scope.paramsSearch = {
        IdUser: $scope.user,
        Filter: $scope.filter.text.toUpperCase(),
        PageNumber: event,
        PageSize: $scope.pageSize
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

        if($scope.tab == 1) {
          if($scope.role == 1) {
            cgwFactory.GetListClinicExecutive(paramsSearch, true).then(function(response) {
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
              $scope.results = [];
              $scope.noResult = true;
              $scope.totalItems = 0;
              $scope.totalPages = 0;
              mModalAlert.showError(error.data.message, 'Error');
            });
          } else {
            cgwFactory.GetListClinicCoordinator(paramsSearch, true).then(function(response) {
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
              $scope.results = [];
              $scope.noResult = true;
              $scope.totalItems = 0;
              $scope.totalPages = 0;
              mModalAlert.showError(error.data.message, 'Error');
            });
          }
        } else {
          cgwFactory.ListDiagnosticExecutive(paramsSearch, true).then(function(response) {
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
            $scope.results = [];
            $scope.noResult = true;
            $scope.totalItems = 0;
            $scope.totalPages = 0;
            mModalAlert.showError(error.data.message, 'Error');
          });
        }
      }
    }

    // Funcion que se activa al limpiar filtros
    function limpiar() {
      $scope.filter.text = "";
      $scope.totalItems = 0;
      $scope.totalPages = 0;
      $scope.noResult = false;
      $scope.results = [];

      filtrar()
    }

    // Funcion que se activa al agregar un nuevo elemento a cualquier lista
    function agregarItem() {
      $scope.showNewItem = true;
      $scope.itemsToAdd = [];
      $scope.formData.selectItem = "";
    }

    // Funcion que se activa al eliminar un elemento de la lista de items a agregar
    function borrarAgregado(position) {
      $scope.itemsToAdd.splice(position, 1);
    }

    // Funcion que se activa al seleccionar un item de la lista
    function addNewItem() {
      if ($scope.formData.selectItem && $scope.formData.selectItem != "") {
        var existItem = _.find($scope.itemsToAdd, function (o) { 
          if($scope.tab == 1) {
            return o.cprvdr == $scope.formData.selectItem.cprvdr && o.nsprvdr == $scope.formData.selectItem.nsprvdr;
          } else {
            return o.code == $scope.formData.selectItem.code; 
          }
        }) || [];
        if(existItem.length == 0) {
          $scope.itemsToAdd.push($scope.formData.selectItem);
        } else {
          var message = $scope.tab == 1 ? "La clínica seleccionada ya se encuentra en la lista" : "El diagnóstico seleccionado ya se encuentra en la lista" ;
          mModalAlert.showWarning(message, "");
        }
      }

      setTimeout(function () {
        $scope.$apply(function () {
          $scope.formData.selectItem = "";
        });
      }, 100);
    }

    // Funcion que se activa al cancelar proceso de guardado de nuevos items
    function cancelarAsignacion() {
      $scope.itemsToAdd = [];
      $scope.showNewItem = false;
    }

    // Funcion que se activa al guardar asignacion de clinicas
    function guardarAsignacionClinica() {
      var clinics = [];

      $scope.itemsToAdd.forEach(function (element) {
        var clinic = {
          cprvdr: element.cprvdr,
          nsprvdr: element.nsprvdr
        };

        clinics.push(clinic);
      });

      var params = {
        clinics: clinics,
        usuario: oimClaims.loginUserName.toUpperCase()
      }

      if($scope.role == 1) {
        cgwFactory.RegisterClinicExecutive($scope.user, params, true).then(function(response) {
          if (response.operationCode == 200) {
            $scope.itemsToAdd = [];
            $scope.showNewItem = false;
            limpiar();
          } else {
            mModalAlert.showError(response.message, 'Error');
          }
        }, function(error) {
          mModalAlert.showError(error.data.message, 'Error');
        });
      } else {
        cgwFactory.RegisterClinicCoordinator($scope.user, params, true).then(function(response) {
          if (response.operationCode == 200) {
            $scope.itemsToAdd = [];
            $scope.showNewItem = false;
            limpiar();
          } else {
            mModalAlert.showError(response.message, 'Error');
          } 
        }, function(error) {
          mModalAlert.showError(error.data.message, 'Error');
        });
      }
    }

    // Funcion que se activa al guardar asignacion de diagnosticos
    function guardarAsignacionDiagnostico() {
      var diagnostics = [];

      $scope.itemsToAdd.forEach(function (element) {
        diagnostics.push(element.code);
      });

      var params = {
        listcdgnstco: diagnostics,
        usuario: oimClaims.loginUserName.toUpperCase()
      }

      cgwFactory.RegisterDiagnosticExecutive($scope.user, params, true).then(function(response) {
        if (response.operationCode == 200) {
          $scope.itemsToAdd = [];
          $scope.showNewItem = false;
          limpiar();
        } else {
          mModalAlert.showError(response.message, 'Error');
        }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    // Funcion que se activa al eliminar una clinica
    function mostrarBorrarClinica(item) {
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
            eliminarClinica(item);
            $uibModalInstance.close();
          };

          scope.data = {
            title: '¿Está seguro de eliminar la asignación de la clínica?',
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

    // Funcion que se activa al eliminar un diagnostico
    function mostrarBorrarDiagnostico(item) {
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
            eliminarDiagnóstico(item);
            $uibModalInstance.close();
          };

          scope.data = {
            title: '¿Está seguro de eliminar la asignación del diagnóstico?',
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

    // Funcion que consume servicio para eliminar un registro de clinica
    function eliminarClinica(item) {
      var params = { 
        cprvdr: item.cprvdr,
        nsucursal: item.nsprvdr
      };

      if($scope.role == 1) {
        cgwFactory.RemoveClinicExecutive($scope.user, params, true).then(function(response) {
          if (response.operationCode == 200) {
            limpiar();
          } else {
            mModalAlert.showError(response.message, 'Error');
          }
        }, function(error) {
          mModalAlert.showError(error.data.message, 'Error');
        });
      } else {
        cgwFactory.RemoveClinicCoordinator($scope.user, params, true).then(function(response) {
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

    // Funcion que consume servicio para eliminar un registro de diagnostico
    function eliminarDiagnóstico(item) {
      cgwFactory.RemoveDiagnosticExecutive($scope.user, item.cdgnstco, true).then(function(response) {
        if (response.operationCode == 200) {
          limpiar();
        } else {
          mModalAlert.showError(response.message, 'Error');
        }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    // Funcion que busca clinicas en base al texto colocado
    function getListClinic(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var Filter= wilcar.toUpperCase();

        var defer = $q.defer();
        if($scope.role == 1) {
          cgwFactory.GetListClinicNotAsignedExecutive(Filter, false).then(function (response) {
            defer.resolve(response.data.lista);
          });
        } else {
          cgwFactory.GetListClinicNotAsignedCoordinator($scope.user, Filter, false).then(function (response) {
            defer.resolve(response.data.lista);
          });
        }

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

  return ng.module("appCgw")
    .controller("DetalleAsignarClinicaRolController", detalleAsignarClinicaRolController)
    .directive("detalleClinicaRolTabsFixed", ['$timeout','$window', function($timeout,$window) {
      // Runs during compile
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          scope.widthWindow = $window.innerWidth;
          var rectTimeout = $timeout(function() {
            var rawDom = element.find('ul')[0]; 
            var rect = rawDom.getBoundingClientRect(),
              scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
              scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return {
              top: rect.top + scrollTop,
              left: rect.left + scrollLeft
            }
          }, 100);
          rectTimeout.then(function(positionTabs) {
            scope.heightScrollTabs = positionTabs.top;
            angular.element($window).bind('scroll', function() {
              if (this.pageYOffset >= scope.heightScrollTabs) {
                scope.boolChangeClassTabs = true;
              } else {
                scope.boolChangeClassTabs = false;
              }
              if (scope.widthWindow >= 1200) {
                scope.changeTabWidth = true;
              } else {
                scope.changeTabWidth = false;
              }
              scope.$apply();
            });
          });
        }
      };
    }]);
});
