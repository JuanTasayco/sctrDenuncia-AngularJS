define([
  'angular', 'constants', 'mpfPersonComponent'
], function (angular, constants) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .controller('mantenimientoVidaLeyController', MantenimientoVidaLeyController);

  MantenimientoVidaLeyController.$inject = ['$state', 'vidaLeyService', 'vidaLeyFactory', 'oimClaims', '$uibModal', '$scope', 'mModalConfirm', 'mModalAlert'];

  function MantenimientoVidaLeyController($state, vidaLeyService, vidaLeyFactory, oimClaims, $uibModal, $scope, mModalConfirm, mModalAlert) {

    var vm = this;

    vm.pagination = {
      currentPage: 1,
      maxSize: 10,
      totalItems: 0,
      items: [],
      noSearch: true,
      noResult: false
    }




    vm.parametrosReporte = {};
    vm.pdfURL = '';
    vm.clausulaList = [];
    vm.suscriptorList = [];

    vm.model = {};
    vm.model.Nombres = "";
    vm.model.Usuario = "";
    vm.model.codigoActividad = "";
    vm.model.Estado = {
      Valor1: null
    };
    vm.buscarDocumentosVidaLey = BuscarDocumentosVidaLey;
    vm.limpiarResultados = LimpiarResultados;
    vm.pageChanged = PageChanged;
    vm.irCotizacion = IrCotizacion;
    vm.isAgent = isAgent;
    vm.nuevoSuscriptor = showModalNuevoSuscriptor;
    vm.showClausula = showModalClausula;
    vm.showModalActividad = showModalActividad;
    vm.showModalEditSuscriptor = showModalEditSuscriptor;
    vm.showModalAsignacion = showModalAsignacion;
    vm.eliminarClausula = eliminarClausula;
    vm.filtrarClausula = getListClausula;
    vm.limpiarClausula = limpiarClausula;
    vm.filtrarSuscriptor = getListSuscriptor;
    vm.limpiarSuscriptor = limpiarSuscriptor;
    vm.user = {};

    (function load_BandejaCotizacionVidaLeyController() {
      vidaLeyFactory.setClaims(oimClaims);
      getListClausula();
      getListSuscriptor();
      getListEstados();
    })();

    function BuscarDocumentosVidaLey(filtros) {
      vm.limpiarResultados();
      _setRequestBuscarDocumentos(filtros);
      _buscarDocumentosVidaLey();
    }


    function PageChanged(currentPage) {
      vm.parametrosReporte.PaginaActual = currentPage;
      getListSuscriptor();
    }

    function IrCotizacion($event) {
      if ($event.evento === 'edit') {
        vidaLeyService.getCotizacion($event.documento.NumeroDocumento)
          .then(function (response) {
            if (response.OperationCode === constants.operationCode.success) {
              vidaLeyFactory.clearCotizacion();
              vidaLeyFactory.setCotizacion(response, $event.documento.Secuencia);
              $state.go(constantsVidaLey.ROUTES.COTIZACION_STEPS.url, { step: $event.documento.Secuencia + 1 });
            }
          });
      } else {
        $state.go(constantsVidaLey.ROUTES.RESUMEN.url, { documentoId: $event.documento.NumeroDocumento }, { reload: true, inherit: false });
      }
    }
    function LimpiarResultados() {
      vm.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalItems: 0,
        items: [],
        noSearch: true,
        noResult: false
      };
    }

    function _buscarDocumentosVidaLey() {
      vidaLeyService.busquedaDocumentos(vm.parametrosReporte).then(_buscarDocumentosVidaLeyResponse);
    }

    function limpiarClausula() {
      vm.model.codigoActividad = "";
      vidaLeyService.getListClausula(vm.model.codigoActividad, constants.module.polizas.vidaLey.codeRamo).then(function (response) {
        vm.clausulaList = response.Data;

      })
    }



    function getListClausula() {

      vidaLeyService.getListClausula(vm.model.codigoActividad.toUpperCase(), constants.module.polizas.vidaLey.codeRamo).then(function (response) {
        vm.clausulaList = response.Data;
        vm.pagination.totalItems = parseInt(response.TotalPaginas) * vm.pagination.maxSize;
      })
    }

    function getListSuscriptor() {

      var dataSuscriptor = {
        NombreCompleto: vm.model.Nombres.toUpperCase(),
        CodigoUsuario: vm.model.Usuario.toUpperCase(),
        Estado: vm.model.Estado.Valor1 ? vm.model.Estado.Valor1 : 0,
        CantidadFilasPorPagina: vm.pagination.maxSize,
        PaginaActual: vm.pagination.currentPage
      }

      vidaLeyService.getListSuscriptor(dataSuscriptor.NombreCompleto, dataSuscriptor.CodigoUsuario, dataSuscriptor.Estado, dataSuscriptor.CantidadFilasPorPagina, dataSuscriptor.PaginaActual).then(function (response) {
        vm.suscriptorList = response.Data.Lista;

        var nombreCompleto = vm.model.Nombres.toUpperCase();
        var codigoUsuario = vm.model.Usuario.toUpperCase();
        var estado = vm.model.Estado.Valor1 ? vm.model.Estado.Valor1 : 0;
        var cantidadFilasPorPagina = vm.pagination.maxSize;
        var paginaActual = vm.pagination.currentPage;

        vidaLeyService.getListSuscriptor(nombreCompleto, codigoUsuario, estado, cantidadFilasPorPagina, paginaActual).then(function (response) {
          vm.suscriptorList = response.Data.Lista;
          vm.pagination.noSearch = false;
          vm.pagination.totalItems = parseInt(response.Data.CantidadTotalPaginas) * vm.pagination.maxSize;
          vm.pagination.items = response.Data.Lista;
          vm.pagination.noResult = response.Data.Lista.length === 0;
        })
          .catch(function () {
            vm.pagination.noResult = true;
          })
      })
    }

    function getListEstados() {
      vidaLeyService.getListParametroDetalleGeneral(4).then(function (response) {
        vm.listEstados = response.Data;
      })
    }

    function limpiarSuscriptor() {
      vm.model.Usuario = "";
      vm.model.Nombres = "";
      vm.model.Estado = {
        Valor1: null
      };
      getListSuscriptor();
    }


    function _setRequestBuscarDocumentos(filtros) {
      vm.parametrosReporte = {
        NumDoc: (filtros && filtros.numeroCotizacion) || '',
        CodAgt: (filtros && filtros.agente) || '',
        TipDocCont: (filtros && filtros.tipoDocumento) || '',
        NumDocCont: (filtros && filtros.numeroDocumento) || '',
        FecIni: filtros && filtros.fechaInicial,
        FecFin: filtros && filtros.fechaFinal,
        CantidadFilasPorPagina: vm.pagination.maxSize,
        PaginaActual: vm.pagination.currentPage,
        ColumnaOrden: ''
      };
    }

    function _buscarDocumentosVidaLeyResponse(response) {
      vm.pagination.noSearch = false;
      vm.pagination.totalItems = parseInt(response.TotalPaginas) * vm.pagination.maxSize;
      vm.pagination.items = response.Data;
      vm.pagination.noResult = response.Data.length === 0;
    }

    function isAgent() {
      //validar por rol de usuario
      return true;
    }

    function eliminarClausula(idClausula) {
      mModalConfirm
        .confirmWarning("¿Esta seguro de eliminar la clausula?", "")
        .then(function (r) {
          if (r)
            vidaLeyService.deleteClausula(idClausula).then(function () {
              getListClausula();
            })
              .catch(function () {
                mModalAlert.showError("Se Produjo un Error", 'Error')
              })
        })
    }


    function showModalNuevoSuscriptor() {
      var vModalProof = $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        result: true,
        size: 'lg',
        templateUrl: 'app/vida-ley/popup/controller/popupNuevoSuscriptor.html',
        controller: ['$scope', '$uibModalInstance', '$uibModal',
          function ($scope, $uibModalInstance, $uibModal) {

            var vm = this;
            vm.user = vidaLeyFactory.getUser();

            vm.$onInit = function () {
              $scope.existeusuario = null;
              $scope.formData = {};
              $scope.form;
              $scope.formData.NombreCompleto = '';
              $scope.formData.ApellidoPaterno = '';
              $scope.formData.ApellidoMaterno = '';
              $scope.formData.CodigoDocumento = '';
              $scope.formData.Estado = {
                Valor1: null
              };
              $scope.formData.TipoDocumento = {
                Codigo: null
              }

              $scope.tipoDocumentosList = [];

              getSctrListTipoDocumento();
            }

            $scope.guardarSuscriptor = function () {

              $scope.form.frmMaintenanceForm.markAsPristine();

              if ($scope.formData.CodigoUsuario != undefined
                && $scope.formData.NombreCompleto != ''
                && $scope.formData.ApellidoPaterno != ''
                && $scope.formData.ApellidoMaterno != ''
                && $scope.formData.TipoDocumento != ''
                && $scope.formData.CodigoDocumento != ''
                && ($scope.formData.Correo != '' &&
                  !$scope.form.frmMaintenanceForm.nEmail.$invalid)
                && $scope.formData.Estado.Valor1 != null
                && $scope.existeusuario) {
                var suscriptorBody = {
                  "CodigoRamo": constants.module.polizas.vidaLey.codeRamo,
                  "CodigoUsuario": $scope.formData.CodigoUsuario,
                  "ApellidoPaterno": $scope.formData.ApellidoPaterno,
                  "ApellidoMaterno": $scope.formData.ApellidoMaterno,
                  "Nombres": $scope.formData.NombreCompleto,
                  "TipoDocumento": $scope.formData.TipoDocumento.Codigo,
                  "CodigoDocumento": $scope.formData.CodigoDocumento,
                  "Correo": $scope.formData.Correo,
                  "Estado": $scope.formData.Estado.Valor1,
                  "UsuarioCreacion": vm.user.codigoUsuario
                }
                vidaLeyService.saveSuscriptor(suscriptorBody).then(function (response) {
                  $uibModalInstance.close();
                  getListSuscriptor();

                })
                  .catch(function () {
                  })
              }
            }

            function getSctrListTipoDocumento() {
              vidaLeyService.getSctrListTipoDocumento().then(function (response) {
                $scope.tipoDocumentosList = response.Data;
              })

            }

            $scope.buscarUsuario = function () {
              var datafiltro = {
                "CodigoUsuario": $scope.formData.CodigoUsuario.toUpperCase()
              }
              vidaLeyService.getUsuarioOim(datafiltro).then(function (response) {
                if (response.Data != "") {
                  $scope.formData = response.Data
                  $scope.existeusuario = true
                }
                else {
                  $scope.existeusuario = false;
                }

                $scope.formData.TipoDocumento = {
                  Codigo: response.Data.TipoDocumento || null
                }

              })
            }


            $scope.closeModal = function () {
              $uibModalInstance.close();
            };

            vModalProof.result.then(function (response) {
            });
          }]
      });
    }

    function showModalEditSuscriptor(item) {
      var vModalProof = $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        result: true,
        size: 'lg',
        templateUrl: 'app/vida-ley/popup/controller/popupEditarSuscriptor.html',
        controller: ['$scope', '$uibModalInstance', '$uibModal',
          function ($scope, $uibModalInstance, $uibModal) {

            var vm = this;
            vm.user = vidaLeyFactory.getUser();
            vm.$onInit = function () {
              $scope.formData = {};
              $scope.form;
              $scope.formData = angular.copy(item);
              $scope.tipoDocumentosList = [];
              $scope.formData.Estado = {
                Valor1: item.Estado
              };
              $scope.formData.TipoDocumento = {
                Codigo: item.TipoDocumento
              }
              getSctrListTipoDocumento();
            }

            $scope.guardarSuscriptor = function () {
              $scope.form.frmMaintenanceForm.markAsPristine();
              if ($scope.formData.Nombres != ''
                && $scope.formData.ApellidoPaterno != ''
                && $scope.formData.ApellidoMaterno != ''
                && $scope.formData.TipoDocumento != ''
                && $scope.formData.CodigoDocumento != ''
                && $scope.formData.Correo != ''
                && $scope.formData.Estado.Valor1 != null) {
                var suscriptorBody = {
                  "CodigoRamo": constants.module.polizas.vidaLey.codeRamo,
                  "CodigoUsuario": $scope.formData.CodigoUsuario,
                  "ApellidoPaterno": $scope.formData.ApellidoPaterno,
                  "ApellidoMaterno": $scope.formData.ApellidoMaterno,
                  "Nombres": $scope.formData.Nombres,
                  "TipoDocumento": $scope.formData.TipoDocumento.Codigo,
                  "CodigoDocumento": $scope.formData.CodigoDocumento,
                  "Correo": $scope.formData.Correo,
                  "Estado": $scope.formData.Estado.Valor1,
                  "UsuarioCreacion": vm.user.codigoUsuario
                }
                vidaLeyService.updateSuscriptor($scope.formData.CodigoSuscriptor, suscriptorBody).then(function (response) {
                  $uibModalInstance.close();
                  limpiarSuscriptor();

                })
                  .catch(function () {
                  })
              }
            }

            function getSctrListTipoDocumento() {
              vidaLeyService.getSctrListTipoDocumento().then(function (response) {
                $scope.tipoDocumentosList = response.Data;
              })

            }

            $scope.closeModal = function () {
              $uibModalInstance.close();
            };

            vModalProof.result.then(function (response) {
            });
          }]
      });
    }


    function showModalClausula(item, flag) {
      var vModalProof = $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        result: true,
        size: 'lg',
        templateUrl: 'app/vida-ley/popup/controller/popupClausula.html',
        controller: ['$scope', '$uibModalInstance', '$uibModal',
          function ($scope, $uibModalInstance, $uibModal) {

            var vm = this;

            vm.$onInit = function () {
              $scope.model = {};
              $scope.item = item;
              $scope.flag = flag;
              buscarClausula();

            }
            $scope.volverActividad = function () {
              showModalActividad();
              $uibModalInstance.close();
            }

            function buscarClausula() {
              vidaLeyService.getClausula(item.CIIU).then(function (response) {
                $scope.model.clausulaDescripcion = response.Data.Detalle;
              })

            }

            $scope.grabareditarClausula = function () {
              var dataClausula = {
                "idClausula": item.IdClausula || 0,
                "codRamo": constants.module.polizas.vidaLey.codeRamo,
                "ciiu": item.CIIU || $scope.item.CodCiiu,
                "detalle": $scope.model.clausulaDescripcion
              }

              vidaLeyService.saveClausula(dataClausula).then(function () {
                getListClausula();
                $uibModalInstance.close();
              })
                .catch(function () {

                })
            }



            $scope.limpiar = function () {
              $scope.model.clausulaDescripcion = "";
            };

            $scope.closeModal = function () {
              $uibModalInstance.close();
            };

            vModalProof.result.then(function (response) {
            });
          }]
      });
    }

    function showModalActividad() {
      var vModalProof = $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        result: true,
        size: 'md',
        templateUrl: 'app/vida-ley/popup/controller/popupActividad.html',
        controller: ['$scope', '$uibModalInstance', '$uibModal',
          function ($scope, $uibModalInstance, $uibModal) {

            var vm = this;

            vm.$onInit = function () {
              $scope.model = {};
              $scope.btnsiguienteDisabled = true;
              $scope.lastIndexClick = null;
              _getListActividad();
            }

            function _getListActividad() {
              var actividad = $scope.model.actividad && $scope.model.actividad.toUpperCase() || '';
              $scope.codigoAgente = vidaLeyFactory.getUser().codigoAgente;
              vidaLeyService.getListActividadesEconomicas(actividad, '', '',parseInt($scope.codigoAgente), 1, 20, true)
                .then(function (response) {
                  $scope.listActividad = response.Data.ListActEconomica;
                });
            }

            $scope.selectActividad = function (item, index) {
              $scope.item = item;
              $scope.btnsiguienteDisabled = false;
              if ($scope.lastIndexClick != null) { $scope.listActividad[$scope.lastIndexClick].select = false; }
              $scope.listActividad[index].select = true;
              $scope.lastIndexClick = index;
            }

            $scope.buscarActividad = function () {
              _getListActividad();
            }

            $scope.siguiente = function () {
              showModalClausula($scope.item, 'nuevo');
              $uibModalInstance.close();
            }

            $scope.closeModal = function () {
              $uibModalInstance.close();
            };

            vModalProof.result.then(function (response) {
            });
          }]
      });
    }


    function showModalAsignacion(suscriptor) {
      var vModalProof = $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        result: true,
        size: 'lg',
        templateUrl: 'app/vida-ley/popup/controller/popupAsignacion.html',
        controller: ['$scope', '$uibModalInstance', '$uibModal',
          function ($scope, $uibModalInstance, $uibModal) {

            var vm = this;

            $scope.paginationAsignar = {
              currentPage: 1,
              maxSize: 100,
              totalItems: 0,
              items: [],
              noSearch: true,
              noResult: false
            }

            $scope.pageChanged = function (currentPage) {
              $scope.paginationAsignar.currentPage = currentPage;
              getListOficinas();
            }


            vm.$onInit = function () {
              $scope.model = {};
              $scope.model.codigoOficina = "";
              $scope.model.Oficina = "";
              $scope.btnsiguienteDisabled = true;
              $scope.lastIndexClick = null;
              $scope.suscriptorPadre = suscriptor.CodigoUsuario;
              $scope.tipoUpdate;
              $scope.listOfisuscriptor = [];
              getListOficinas();
            }
            $scope.buscarOficina = function () {
              getListOficinas();
            }


            function getListOficinas() {
              var oficinaBody = {
                CodigoOficina: $scope.model.codigoOficina || 0,
                NombreOficina: $scope.model.Oficina,
                CantidadFilasPorPagina: $scope.paginationAsignar.maxSize,
                PaginaActual: $scope.paginationAsignar.currentPage
              }

              vidaLeyService.getListSuscriptorOficina(oficinaBody.CodigoOficina, oficinaBody.NombreOficina, oficinaBody.CantidadFilasPorPagina, oficinaBody.PaginaActual).then(function (response) {
                $scope.listOficinas = response.Data.Lista;
                $scope.paginationAsignar.noSearch = false;
                $scope.paginationAsignar.totalItems = parseInt(response.Data.CantidadTotalPaginas) * 10;
                $scope.paginationAsignar.items = response.Data.Lista;
                $scope.paginationAsignar.noResult = response.Data.length === 0;
              })
            }

            $scope.agregarSuscriptor = function (ofi, model) {
              $scope.repetido = false;
              if (ofi.Indice)
                $scope.tipoUpdate = "S";
              else
                $scope.tipoUpdate = "N";
              var suscriptorBody = {
                "CodigoSuscriptor": suscriptor.CodigoSuscriptor,
                "CodigoOficina": ofi.CodigoOficina,
                "Eliminado": $scope.tipoUpdate
              }

              if ($scope.listOfisuscriptor.length > 0) {
                $scope.listOfisuscriptor = $scope.listOfisuscriptor.map(function (x) {
                  if (x.CodigoOficina == ofi.CodigoOficina) {
                    x.Eliminado = $scope.tipoUpdate
                    $scope.repetido = true
                  }
                  return x;
                });
                if ($scope.repetido == false)
                  $scope.listOfisuscriptor.push(suscriptorBody)
              }
              else {
                $scope.listOfisuscriptor.push(suscriptorBody);
              }
            }

            $scope.grabarOficina = function () {
              vidaLeyService.saveSuscriptorOficina($scope.listOfisuscriptor[0].CodigoSuscriptor,$scope.listOfisuscriptor).then(function (response) {
                getListOficinas();
                $uibModalInstance.close();
              })
            }



            $scope.closeModal = function () {
              $uibModalInstance.close();
            };

            vModalProof.result.then(function (response) {
            });
          }]
      });
    }

  }

});
