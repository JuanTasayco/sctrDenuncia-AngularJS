define(["angular", "/cgw/app/factory/cgwFactory.js"], function(ng) {

  detalleCondicionadoController.$inject = ["$scope", "$state", "$stateParams", "$q", "cgwFactory", 
    "oimClaims", "mModalAlert", "formularioEmpresas"];

  function detalleCondicionadoController($scope, $state, $stateParams, $q, cgwFactory, 
    oimClaims, mModalAlert, formularioEmpresas) {
    $scope.showEditItem = false;
    $scope.showDetail = true;
    $scope.validHtml = false;

    $scope.formData = { editItem: null };

    $scope.masters = { empresas: formularioEmpresas, ramos: null, productos: null,
      contratos: null, modalidades: null, productosSalud: null, subProductosSalud: null };

    $scope.edicionCondicionado = "/cgw/app/condicionados/component/edicionCondicionado.html";

    $scope.mostrarDetalle = mostrarDetalle;
    $scope.mostrarEdicionCondicionado = mostrarEdicionCondicionado;
    $scope.editarCondicionado = editarCondicionado;

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
        var id = $stateParams.id;
        obtenerDetalle(id);
      }
    )();

    // Funcion que obtiene el detalle del registro a consultar
    function obtenerDetalle(id) {
      cgwFactory.GetDetailCondicionado(id, true).then(function(response) {
        if (response.operationCode == 200) {
          if(response.data.length > 0) {
            $scope.detail = response.data[0];
            var cont = angular.element('<div>').html($scope.detail.cntndo).text();
            $scope.detail.cntndo = cont;
          } else {
            mModalAlert.showError('El condicionado que ha consultado no existe', 'Error').then(function () {
              $state.go('condicionados', {reload: true, inherit: false});
            });
          }
        }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    // Funcion que muestra / oculta detalle
    function mostrarDetalle() {
      $scope.showDetail = !$scope.showDetail;
    }

    // Funcion que muesra / ocultar vista de edicion
    function mostrarEdicionCondicionado(show) {
      $scope.showEditItem = show;
      $scope.formData.editItem = null;
      if(show) {
        $scope.formData.editItem = {
          mNombre : $scope.detail.dscrpcn,
          mEmpresa: { id: $scope.detail.ccmpnia },
          mProducto: { productCode: $scope.detail.cprdcto },
          mCliente: $scope.detail.cclnte ? { code: $scope.detail.cclnte, name: $scope.detail.rsaynmbrs } : null,
          info: $scope.detail.cntndo,
          mRamo:  $scope.detail.cramo ? { code: $scope.detail.cramo } : null,
          mContrato: $scope.detail.numcontrato ? { code: $scope.detail.numcontrato } : null,
          mModalidad: $scope.detail.cModalidad ? { code: $scope.detail.cModalidad } : null,
          mProductoSalud: $scope.detail.cProdSalud ? { code: $scope.detail.cProdSalud } : null,
          mSubProductoSalud: $scope.detail.cSubProdSalud ? { code: $scope.detail.cSubProdSalud } : null
        }

        cgwFactory.GetAllProductBy('SGA', $scope.detail.ccmpnia).then(function(response) {
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

        if($scope.detail.ccmpnia == "1" && $scope.detail.cprdcto == "S") {
          loadMasters($scope.detail.ccmpnia, $scope.detail.cramo, $scope.detail.cModalidad, $scope.detail.cProdSalud);
        }
      } else {
        $scope.formData.editItem = {
          mCliente: ""
        }
      }
    }

    // Funcion que se activa al procesar el guardado de condicionado
    function editarCondicionado() {
      var params = {
        ccmpnia: $scope.formData.editItem.mEmpresa ? $scope.formData.editItem.mEmpresa.id : null,
        cprdcto: $scope.formData.editItem.mProducto ? $scope.formData.editItem.mProducto.productCode : null,
        cclnte: $scope.formData.editItem.mCliente ? $scope.formData.editItem.mCliente.code : null,
        dscrpcn: $scope.formData.editItem.mNombre,
        cntndo: $scope.formData.editItem.info,
        cramo: $scope.formData.editItem.mRamo ? $scope.formData.editItem.mRamo.code : null,
        ncontrato: $scope.formData.editItem.mContrato ? $scope.formData.editItem.mContrato.code : null,
        cModalidad: $scope.formData.editItem.mModalidad ? $scope.formData.editItem.mModalidad.code : null,
        cProdSalud: $scope.formData.editItem.mProductoSalud ? $scope.formData.editItem.mProductoSalud.code : null,
        cSubProdSalud: $scope.formData.editItem.mSubProductoSalud ? $scope.formData.editItem.mSubProductoSalud.code : null,
        usuario: oimClaims.loginUserName.toUpperCase()
      }

      cgwFactory.EditCondicionado($scope.detail.id, params, true).then(function(response) {
        if (response.operationCode == 200) {
          $scope.showEditItem = false;
          obtenerDetalle($scope.detail.id);
        } else {
          mModalAlert.showError(response.message, 'Error');
        }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    // Funcion que obtiene los productos en base a una empresa
    function loadProducts (idCompany) {
      if ($scope.formData.editItem){
        $scope.formData.editItem.mProducto = null;
        $scope.formData.editItem.mRamo = null;
        $scope.formData.editItem.mContrato = null;
        $scope.formData.editItem.mModalidad = null;
        $scope.formData.editItem.mProductoSalud = null;
        $scope.formData.editItem.mSubProductoSalud = null;
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

    // Funcion que carga los maestros al inicio
    function loadMasters(idCompany, idRamo, idModalidad, idProductoSalud) {
      $scope.masters.ramos = null;
      $scope.masters.contratos = null;
      $scope.masters.modalidades = null;
      $scope.masters.productosSalud = null;
      $scope.masters.subProductosSalud = null;

      cgwFactory.GetListRamos(idCompany, true).then(function(response) {
        if (response.data) {
          $scope.masters.ramos = response.data;
        } else {
          $scope.masters.ramos = [];
        }
      }).catch(function(err){
        mModalAlert.showError(err.data, 'Error');
      });

      if(idRamo == 116) {
        cgwFactory.GetListContratos(idCompany, idRamo, true).then(function(response) {
          if (response.data) {
            $scope.masters.contratos = response.data;
          } else {
            $scope.masters.contratos = [];
          }
        }).catch(function(err){
          mModalAlert.showError(err.data, 'Error');
        });
      } else if(idRamo == 114 || idRamo == 115) {
        cgwFactory.GetListModalidades(idCompany, idRamo, true).then(function(response) {
          if (response.data) {
            $scope.masters.modalidades = response.data;
          } else {
            $scope.masters.modalidades = [];
          }
        }).catch(function(err){
          mModalAlert.showError(err.data, 'Error');
        });

        cgwFactory.GetListProductosSalud(idCompany, idRamo, idModalidad, true).then(function(response) {
          if (response.data) {
            $scope.masters.productosSalud = response.data;
          } else {
            $scope.masters.productosSalud = [];
          }
        }).catch(function(err){
          mModalAlert.showError(err.data, 'Error');
        });

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
    }

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
        if ($scope.formData.editItem){
          $scope.formData.editItem.mRamo = null;
          $scope.formData.editItem.mContrato = null;
          $scope.formData.editItem.mModalidad = null;
          $scope.formData.editItem.mProductoSalud = null;
          $scope.formData.editItem.mSubProductoSalud = null;
        } 
  
        $scope.masters.ramos = null;
        $scope.masters.contratos = null;
        $scope.masters.modalidades = null;
        $scope.masters.productosSalud = null;
        $scope.masters.subProductosSalud = null;
      }
    }

    // Funcion que valida si debe mostrar o no producto salud
    function mostrarProductoSalud() {
      if($scope.detail){
        return $scope.detail.ccmpnia == "1" && $scope.detail.cprdcto == "S";
      }
      return false;
    }

     // Funcion que valida si se debe o no mostrar el ramo
     function mostrarRamo() {
      if ($scope.formData.editItem && $scope.formData.editItem.mEmpresa && $scope.formData.editItem.mProducto){
        return $scope.formData.editItem.mEmpresa.id == 1 && $scope.formData.editItem.mProducto.productCode == "S";
      }
      return false;
    }

    // Funcion que valida las opciones a mostrar según el ramo seleccionado
    function loadRamoOpciones(idRamo) {
      var idCompany = 1;
      if ($scope.formData.editItem){
        idCompany = $scope.formData.editItem.mEmpresa.id;
        $scope.formData.editItem.mContrato = null;
        $scope.formData.editItem.mModalidad = null;
        $scope.formData.editItem.mProductoSalud = null;
        $scope.formData.editItem.mSubProductoSalud = null;
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
      if ($scope.formData.editItem) {
        idCompany = $scope.formData.editItem.mEmpresa.id;
        idRamo = $scope.formData.editItem.mRamo.code;
        $scope.formData.editItem.mProductoSalud = null;
        $scope.formData.editItem.mSubProductoSalud = null;
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
      if ($scope.formData.editItem) {
        idCompany = $scope.formData.editItem.mEmpresa.id;
        idRamo = $scope.formData.editItem.mRamo.code;
        idModalidad = $scope.formData.editItem.mModalidad.code;
        $scope.formData.editItem.mSubProductoSalud = null;
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
    
  } //  end controller

  return ng.module('appCgw')
    .controller('DetalleCondicionadoController', detalleCondicionadoController)
    .factory('loaderDetalleCondicionadoCGW', ['cgwFactory', '$q', function(cgwFactory, $q) {
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
