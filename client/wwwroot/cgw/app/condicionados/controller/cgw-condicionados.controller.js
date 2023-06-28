define(["angular", "/cgw/app/factory/cgwFactory.js", "mfpModalQuestion"], function (ng) {
  
  cgwCondicionadoController.$inject = ["$scope", "cgwFactory", "$q", "$state", "$uibModal", 
    "mModalAlert", "oimClaims", "MxPaginador","formularioEmpresas"];

  function cgwCondicionadoController($scope, cgwFactory, $q, $state, $uibModal, 
    mModalAlert, oimClaims, MxPaginador, formularioEmpresas) {
    $scope.mPagination = 1;
    $scope.pageSize = 10;

    var page = new MxPaginador();
    page.setNroItemsPorPagina($scope.pageSize);

    $scope.filter = "";
    $scope.results = [];
    $scope.filterPlaceholder = 'Nombre del condicionado o cliente';

    $scope.showNewItem = false;
    $scope.validHtml = false;

    $scope.formData = { newItem: null };

    $scope.masters = { empresas: formularioEmpresas, ramos: null, productos: null,
      contratos: null, modalidades: null, productosSalud: null, subProductosSalud: null };

    $scope.nuevoCondicionado = '/cgw/app/condicionados/component/nuevoCondicionado.html';

    $scope.mostrarEliminarRegistro = mostrarEliminarRegistro;

    $scope.mostrarProductoSalud = mostrarProductoSalud;
    $scope.loadProducts = loadProducts;
    $scope.loadRamos = loadRamos;
    $scope.mostrarRamo = mostrarRamo;
    $scope.loadRamoOpciones = loadRamoOpciones;
    $scope.loadContratos = loadContratos;
    $scope.loadModalidades = loadModalidades;
    $scope.loadProductosSalud = loadProductosSalud;
    $scope.loadSubProductosSalud = loadSubProductosSalud;
    $scope.getListClients = getListClients;

    //Formulario
    $scope.filtrar = filtrar;
    $scope.limpiar = limpiar;
    $scope.pageChanged = pageChanged;
    $scope.verDetalle = verDetalle;

    $scope.mostrarCrearRegistro = mostrarCrearRegistro;
    $scope.crearCondicionado = crearCondicionado;

    $scope.onEditorCreated = function (editor) {
      $scope.editor = editor;
    };

    $scope.contentChanged = function (editor, html, text, content, delta, oldDelta, source) {
      $scope.validHtml = text.length > 1;
    }

    $scope.undoEditor = function() {
      $scope.editor.history.undo();
    };

    $scope.redoEditor = function() {
      $scope.editor.history.redo();
    };

    (
      function onLoad() {
        filtrar();
      }
    )();

    // Funcion que se activa al presionar el boton de busqueda
    function filtrar() {
      $scope.paramsSearch = {
        Filter: $scope.filter ? $scope.filter.toUpperCase() : "",
        PageNumber: 1,
        PageSize: $scope.pageSize,
      };

      buscar($scope.paramsSearch);
    }

    // Función que se activa al cambiar de página
    function pageChanged(event) {
      $scope.paramsSearch = {
        Filter: $scope.filter ? $scope.filter.toUpperCase() : "",
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
        $scope.formData.newItem = null;

        cgwFactory.GetListCondicionado(paramsSearch, true).then(function(response) {
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
            eliminarCondicionado(item);
            $uibModalInstance.close();
          };

          scope.data = {
            title: '¿Está seguro de eliminar el condicionado?',
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
    function crearCondicionado() {
      var params = {
        ccmpnia: $scope.formData.newItem.mEmpresa ? $scope.formData.newItem.mEmpresa.id : null,
        cprdcto: $scope.formData.newItem.mProducto ? $scope.formData.newItem.mProducto.productCode : null,
        cclnte: $scope.formData.newItem.mCliente ? $scope.formData.newItem.mCliente.code : null,
        dscrpcn: $scope.formData.newItem.mNombre,
        cntndo: $scope.formData.newItem.info ? $scope.formData.newItem.info : null,
        cramo: $scope.formData.newItem.mRamo ? $scope.formData.newItem.mRamo.code : null,
        ncontrato: $scope.formData.newItem.mContrato ? $scope.formData.newItem.mContrato.code : null,
        cModalidad: $scope.formData.newItem.mModalidad ? $scope.formData.newItem.mModalidad.code : null,
        cProdSalud: $scope.formData.newItem.mProductoSalud ? $scope.formData.newItem.mProductoSalud.code : null,
        cSubProdSalud: $scope.formData.newItem.mSubProductoSalud ? $scope.formData.newItem.mSubProductoSalud.code : null,
        usuario: oimClaims.loginUserName.toUpperCase()
      }
      
      cgwFactory.SaveCondicionado(params, true).then(function(response) {
        if (response.operationCode == 200) {
          limpiar();
        } else {
          mModalAlert.showError(response.message, 'Error');
        }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    // Funcion que consume servicio para eliminar un condicionado
    function eliminarCondicionado(item) {
      cgwFactory.DeleteCondicionado(item.id, true).then(function(response) {
        if (response.operationCode == 200) {
          limpiar();
        } else {
          mModalAlert.showError(response.message, 'Error');
        }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    // Funcion que valida si debe mostrar o no producto salud
    function mostrarProductoSalud(item) {
      return item.ccmpnia == "1" && item.cprdcto == "S";
    }

    // Funcion que obtiene los productos en base a una empresa
    function loadProducts (idCompany) {
      if ($scope.formData.newItem){
        $scope.formData.newItem.mProducto = null;
        $scope.formData.newItem.mRamo = null;
        $scope.formData.newItem.mContrato = null;
        $scope.formData.newItem.mModalidad = null;
        $scope.formData.newItem.mProductoSalud = null;
        $scope.formData.newItem.mSubProductoSalud = null;
      } 

      $scope.masters.productos = null;
      $scope.masters.ramos = null;
      $scope.masters.contratos = null;
      $scope.masters.modalidades = null;
      $scope.masters.productosSalud = null;
      $scope.masters.subProductosSalud = null;

      if (idCompany) {
        cgwFactory.GetAllProductBy('SGA', idCompany).then(function(response) {
          if (response.data) {
            $scope.masters.productos = response.data;
          } else {
            if (!response.isValid) {
              var message = '';
              
              ng.forEach(response.brokenRulesCollection, function(error) {
                message += error.description + ' ';
              });

              mModalAlert.showError(message, 'Error');
            }
          }
        }).catch(function(err){
          mModalAlert.showError(err.data, 'Error');
        });
      }
    };

    // Funcion que obtiene los ramos al seleccionar compañia
    function loadRamos(idCompany, idProduct) {
      if(idCompany == 1 && idProduct == "S") {
        cgwFactory.GetListRamos(idCompany, true).then(function(response) {
          if (response.data) {
            $scope.masters.ramos = response.data;
          } else {
            $scope.masters.ramos = [];
          }
        }).catch(function(err){
          mModalAlert.showError(err.data, 'Error');
        });
      } else {
        if ($scope.formData.newItem){
          $scope.formData.newItem.mRamo = null;
          $scope.formData.newItem.mContrato = null;
          $scope.formData.newItem.mModalidad = null;
          $scope.formData.newItem.mProductoSalud = null;
          $scope.formData.newItem.mSubProductoSalud = null;
        } 
  
        $scope.masters.ramos = null;
        $scope.masters.contratos = null;
        $scope.masters.modalidades = null;
        $scope.masters.productosSalud = null;
        $scope.masters.subProductosSalud = null;
      }
    }

    // Funcion que valida si se debe o no mostrar el ramo
    function mostrarRamo() {
      if ($scope.formData.newItem && $scope.formData.newItem.mEmpresa && $scope.formData.newItem.mProducto){
        return $scope.formData.newItem.mEmpresa.id == 1 && $scope.formData.newItem.mProducto.productCode == "S";
      }
      return false;
    }

    // Funcion que valida las opciones a mostrar según el ramo seleccionado
    function loadRamoOpciones(idRamo) {
      var idCompany = 1;
      if ($scope.formData.newItem){
        idCompany = $scope.formData.newItem.mEmpresa.id;
        $scope.formData.newItem.mContrato = null;
        $scope.formData.newItem.mModalidad = null;
        $scope.formData.newItem.mProductoSalud = null;
        $scope.formData.newItem.mSubProductoSalud = null;
      } 

      $scope.masters.contratos = null;
      $scope.masters.modalidades = null;
      $scope.masters.productosSalud = null;
      $scope.masters.subProductosSalud = null;

      if(idRamo == 116) {
        loadContratos(idCompany, idRamo);
      } else if(idRamo == 114 || idRamo == 115) {
        loadModalidades(idCompany, idRamo);
      }
    }

    // Funcion que obtiene los contratos al seleccionar ramo 116
    function loadContratos(idCompany, idRamo) {
      cgwFactory.GetListContratos(idCompany, idRamo, true).then(function(response) {
        if (response.data) {
          $scope.masters.contratos = response.data;
        } else {
          $scope.masters.contratos = [];
        }
      }).catch(function(err){
        mModalAlert.showError(err.data, 'Error');
      });
    }

    // Funcion que obtiene las modalidades en base al ramo seleccionado (diferente a 116)
    function loadModalidades(idCompany, idRamo) {
      cgwFactory.GetListModalidades(idCompany, idRamo, true).then(function(response) {
        if (response.data) {
          $scope.masters.modalidades = response.data;
        } else {
          $scope.masters.modalidades = [];
        }
      }).catch(function(err){
        mModalAlert.showError(err.data, 'Error');
      });
    }
    
    // Funcion que obtiene los productos salud en base a la modalidad seleccionada
    function loadProductosSalud(idModalidad) {
      var idCompany = 1;
      var idRamo;
      if ($scope.formData.newItem) {
        idCompany = $scope.formData.newItem.mEmpresa.id;
        idRamo = $scope.formData.newItem.mRamo.code;
        $scope.formData.newItem.mProductoSalud = null;
        $scope.formData.newItem.mSubProductoSalud = null;
      }

      $scope.masters.productosSalud = null;
      $scope.masters.subProductosSalud = null;

      cgwFactory.GetListProductosSalud(idCompany, idRamo, idModalidad, true).then(function(response) {
        if (response.data) {
          $scope.masters.productosSalud = response.data;
        } else {
          $scope.masters.productosSalud = [];
        }
      }).catch(function(err){
        mModalAlert.showError(err.data, 'Error');
      });
    }
    
    // Funcion que obtiene los sub productos salud en base al productos salud seleccionado
    function  loadSubProductosSalud(idProductoSalud) {
      var idCompany = 1;
      var idRamo, idModalidad, idProductoSalud;
      if ($scope.formData.newItem) {
        idCompany = $scope.formData.newItem.mEmpresa.id;
        idRamo = $scope.formData.newItem.mRamo.code;
        idModalidad = $scope.formData.newItem.mModalidad.code;
        $scope.formData.newItem.mSubProductoSalud = null;
      }

      $scope.masters.subProductosSalud = null;

      cgwFactory.GetListSubProductosSalud(idCompany, idRamo, idModalidad, idProductoSalud, true).then(function(response) {
        if (response.data) {
          $scope.masters.subProductosSalud = response.data;
        } else {
          $scope.masters.subProductosSalud = [];
        }
      }).catch(function(err){
        mModalAlert.showError(err.data, 'Error');
      });
    }

    // Funcion que busca clientes en base al texto colocado
    function getListClients(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var paramClient = {
          Code : '',
          Name : wilcar.toUpperCase()
        };

        var defer = $q.defer();
        cgwFactory.getClienteSearch(paramClient, false).then(function (response) {
          defer.resolve(response.data.items);
        });
        
        return defer.promise;
      }
    }

    // Funcion que se activa al seleccionar un registro
    function verDetalle(item) {
      $state.go("detalleCondicionado", { id: item.id }, { reload: true, inherit: false });
    }

  } //  end controller

  return ng.module("appCgw")
    .controller("CgwCondicionadoController",cgwCondicionadoController)
    .factory('loaderCondicionadosCGW', ['cgwFactory', '$q', function(cgwFactory, $q) {
      var _empresas;

      function initListEmpresas() {
        var deferred = $q.defer();
        cgwFactory.getListCompany(true).then(function(response) {
          if (response.data.items.length > 0) {
            _empresas = response.data.items;
            deferred.resolve(_empresas);
          }
        }, function(error) {
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      return {
        initListEmpresas: function() {
          if (_empresas) return $q.resolve(_empresas);
          return initListEmpresas();
        }
      }
    }]);
});
