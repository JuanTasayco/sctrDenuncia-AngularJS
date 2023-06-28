define([
  'angular', 'lodash', 'constantsSepelios', 'campoSantoService', 'campoSantoFactory',  'mpfPersonComponent'
], function (angular, _, constantsSepelios, campoSantoService, campoSantoFactory) {
  'use strict';

  angular
    .module("appSepelio")
    .controller('bandejaPolizaCampoSantoController', bandejaPolizaCampoSantoController);

  bandejaPolizaCampoSantoController.$inject = ['$scope', '$state', 'mainServices', 'mModalAlert', '$uibModal', 'mModalConfirm', 'campoSantoService', 'campoSantoFactory'];

  function bandejaPolizaCampoSantoController($scope, $state, mainServices, mModalAlert, $uibModal, mModalConfirm, campoSantoService, campoSantoFactory) {
    $scope.cntsSepelios = constantsSepelios
    $scope.selectOption = false;
    $scope.listMotivos = [];
    $scope.listaBandeja = [];
    $scope.modelo = {};
    $scope.camposanto = [];
    $scope.tipoContrato = [];
    $scope.estado = [];

    $scope.pagination = {
      currentPage: 1,
      maxSize: 10,
      totalItems: 0,
      items: [],
      noSearch: true,
      noResult: true
    };
    $scope.ramo = [
      {
        Codigo: $scope.cntsSepelios.RAMOS.NI,
        Text:  $scope.cntsSepelios.RAMOS.NI_TEXT,
      },
      {
        Codigo: $scope.cntsSepelios.RAMOS.NF,
        Text:  $scope.cntsSepelios.RAMOS.NF_TEXT,
      }];
    $scope.reserva = $scope.cntsSepelios.RESERVAS;
    var coloresEstado = {
      "PROSPECTO": 'g-tags--yellow', "COTIZADO": "g-tags--green", "EMITIDO": 'g-tags--orange',
      "SOLICITADO": 'g-tags--green', "PRE-EMITIDO": 'g-tags--purple', "RECHAZADO": 'g-tags--dark', 
      "CERRADO": 'g-tags--dark', "OBSERVADO": 'g-tags--dark' , "APROBADO": "g-tags--green",
      "PROVISIONAL": 'g-tags--orange'
    };

    (function load_bandejaPolizaCampoSantoController() {
      _fechaActual();
      _getEstadoCotizacionXRol("AGENTE");
      _listarCotizaciones();
      $scope.userRoot = campoSantoFactory.userRoot();
    })();

    function _fechaActual() {
      var fechaActual = new Date();
      fechaActual.toISOString();
      $scope.modelo.inicio = fechaActual;
      $scope.modelo.fin = fechaActual;
      $scope.validadores = {
        maxEndDate: fechaActual
      }

    }

    $scope._getCampoSanto = function (ramo) {
      if(ramo.Codigo !== null){
        campoSantoService.getProxyCamposanto(ramo.Codigo).then(function (response) {
          $scope.camposanto = response;
        });
        campoSantoService.getProxyTipoContrato(ramo.Codigo).then(function (response) {
          $scope.tipoContrato = response;
        });
      }else{
        $scope.camposanto = [];
        $scope.tipoContrato = []
      }
    }

    function _getEstadoCotizacionXRol(rol) {
      campoSantoService.getEstadoCotizacionXRol(rol).then(function (response) {
        $scope.estado = response;
      });
    }

    function _listarCotizacionesService(data) {
      campoSantoService.bandejaCotizaciones(data).then(function (response) {
        var listaBandeja = response.Data;
        $scope.listaBandeja = listaBandeja.map(function (obj) {
          obj.color = coloresEstado[obj.estado];
          return obj;
        });
        $scope.pagination.noSearch = false;
        $scope.pagination.totalItems = parseInt(response.totalPaginas) * $scope.pagination.maxSize;
        $scope.pagination.items = response.Data;
        $scope.pagination.noResult = response.Data.length === 0;
      });
    }

    function _listarCotizaciones() {
      var data = {
        "tipoBusqueda": 2,
        "idRamo": $scope.modelo.ramo && $scope.modelo.ramo.Codigo ? $scope.modelo.ramo.Codigo : null ,
        "reserva": $scope.modelo.reserva && $scope.modelo.reserva.Codigo ? $scope.modelo.reserva.Codigo : null ,
        "numerocotizacion": $scope.modelo.numeroCotizacion,
        "nombreAsegurado": $scope.modelo.nombreAsegurado,
        "idCampoSanto": $scope.modelo.camposanto ? $scope.modelo.camposanto.Codigo : null,
        "idTipoContrato": $scope.modelo.tipoContrato ? $scope.modelo.tipoContrato.Codigo : null,
        "estado": $scope.modelo.estado ? $scope.modelo.estado.Codigo : null,
        "fechaInicio": campoSantoFactory.formatearFechaNacimiento($scope.modelo.inicio),
        "fechaFin": campoSantoFactory.formatearFechaNacimiento($scope.modelo.fin),
        "numeroPagina": $scope.pagination.currentPage,
        "numeroRegistros": $scope.pagination.maxSize
      }
      _listarCotizacionesService(data);
    }

    $scope.pageChanged = function (currentPage) {
      $scope.pagination.currentPage = currentPage;
      _listarCotizaciones();
    }

    $scope.verMas = function (item, isSolicitado, isCotizacion) {
      if ((item.estado === "EMITIDO" || item.estado === "PROVISIONAL") && !isCotizacion){
        $state.go(constantsSepelios.ROUTES.REPOSITORIO_DOCUMENTOS, { reload: true, inherit: false });
        campoSantoFactory.setidCotizacion(item.idCotizacion);
        campoSantoFactory.setdataProspecto(null);
        campoSantoFactory.setPreemitidoEditable(false);
      }else{
        campoSantoFactory.setPreemitidoEditable(true);
      if (item.idPago === "FINANCIADO" || isSolicitado || item.idPago === "DIRECTO") {
        campoSantoFactory.setComponenteView(constantsSepelios.view.detalleFina);
      }
      if (item.idPago === "CONTADO") {
        campoSantoFactory.setComponenteView(constantsSepelios.view.detalleConta);
      }
     
      campoSantoFactory.setidCotizacion(item.idCotizacion);
      campoSantoFactory.setdataDetalleSimulacion(item);
      $state.go(constantsSepelios.ROUTES.COTIZACION_STEPS, { step: 2 }, { reload: true, inherit: false });
    }
    }

    $scope.descargarPDFemision = function (item,tipoOperacion) {
      item.select = false;
      campoSantoService.descargarArchivo(item.idCotizacion,tipoOperacion).then(function (response) {
        if (response.OperationCode == 200){
          mainServices.fnDownloadFileBase64(response.Data, "pdf", tipoOperacion + '_' + item.numeroCotizacion + '.pdf', false);
        }else{
          mModalAlert.showWarning(response.Data.Message || response.Data, '');
        }
      }).catch(function (error){
        mModalAlert.showError(error.data.Data, error.data.Message);
      })
    }

    $scope.changeDate = function () {
      if ($scope.modelo.fin < $scope.modelo.inicio) {
        $scope.modelo.fin = angular.copy($scope.modelo.inicio);
      }
    }

    $scope.filtrarCotizaciones = function () {
      $scope.pagination.currentPage = 1;
      _listarCotizaciones();
    }

    $scope.limpiar = function () {
      $scope.modelo.numeroCotizacion = null;
      $scope.modelo.nombreAsegurado = null;
      $scope.modelo.camposanto = null;
      $scope.modelo.tipoContrato = null;
      $scope.modelo.estado = null;
      $scope.modelo.inicio = null;
      $scope.modelo.fin = null;
      $scope.modelo.ramo = null;
      $scope.modelo.reserva = null;
      $scope.pagination.currentPage = 1;
      $scope.pagination.maxSize = 10;
      _fechaActual();
      _listarCotizaciones();
    }

    $scope.preEmitir = function (item) {
      $state.go(constantsSepelios.ROUTES.REPOSITORIO_DOCUMENTOS, { reload: true, inherit: false });
      campoSantoFactory.setidCotizacion(item.idCotizacion);
      campoSantoFactory.setdataProspecto(null);
      if (item.estado === "EMITIDO"){
        campoSantoFactory.setPreemitidoEditable(false);
      }else{
        campoSantoFactory.setPreemitidoEditable(true);
      }
    }

    $scope.continuar = function (item) {
      campoSantoFactory.setidCotizacion(item.idCotizacion);
      campoSantoFactory.setdataProspecto(null);
     if(item.paginaActual > 1){
      if (item.estado === 'RECHAZADO'){
        item.paginaActual = 1;
      }else if (item.estado === 'APROBADO' && !item.cuotaInicial){
        item.paginaActual = 1;
      }else if (item.idPago === "FINANCIADO" || item.idPago === "DIRECTO") {

        campoSantoFactory.setComponenteView('simulador-cotizacion');

        campoSantoService.getCotizacion(campoSantoFactory.getidCotizacion())
        .then(function (response) {
          campoSantoFactory.setdataDetalleSimulacion(response.Data);
          $state.go(constantsSepelios.ROUTES.COTIZACION_STEPS, { step: item.paginaActual }, { reload: true, inherit: false });
        })
        return;
      }
     }

      $state.go(constantsSepelios.ROUTES.COTIZACION_STEPS, { step: item.paginaActual }, { reload: true, inherit: false });

    }

    $scope.aprobar = function (cotizacion) {
      var dataCorreoExepcional = {
        "tipoCorreo": "S_APROBADO",
        "idCotizacion": cotizacion.idCotizacion
      }
      var data = {
        "idCotizacion": cotizacion.idCotizacion,
        "estado": "APROBADO"
      }
      mModalConfirm
      .confirmWarning("¿Esta seguro de aprobar la cotización?", "")
      .then(function (r) {
        campoSantoService.cerrarCotizacion(data).then(function (response) {
          if (response.OperationCode === 200) {
            campoSantoService.enviarCorreoExepcional(dataCorreoExepcional).then(function (response) {
              if (response.OperationCode === 200) {
                mModalAlert.showSuccess("Se aprobó la cotización correctamente", "")
                  .then(function (r) {
                    _listarCotizaciones();
                  })
              }
              else {
                mModalAlert.showWarning(response.Message, "")
              }
            });
          }
        })
      });
    }

    $scope.cerrar = function (tipo, editable, cotizacion) {
      var vModalProof = $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        result: true,
        size: 'lg',
        templateUrl: 'app/sepelio/popup/controller/popupDenegarCotizacion.html',
        controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
          function ($scope, $uibModalInstance, $uibModal, $timeout) {
            var vm = this;
            $scope.listMotivosCerrar = [];
            $scope.model = {};
            $scope.mCheck;
            vm.$onInit = function () {
              $scope.isEditable = editable;
              if (!editable) {
                $scope.isEditableComentario = false;
              }
              campoSantoService.getMotivosCotizacion(tipo).then(function (response) {
                $scope.listMotivos = response.Data;
              });
              $scope.solicitante = cotizacion.nombre + ' ' + cotizacion.materno + ' ' + cotizacion.paterno;
              $scope.model.comentario = cotizacion.descripcionMotivo;
              $scope.model.motivo = cotizacion.idMotivo ? cotizacion.idMotivo : 1;
              $scope.titulo = tipo === "C" ? "CERRADO" : tipo === 'O' ? "OBSERVADO" : "RECHAZADO";
              $scope.subtitulo = tipo === "C" ? "cierre" : tipo === 'O' ? "la observación" :"rechazo";
            }

            $scope.guardar = function () {
              $scope.msjerrorMotivo = null;
              if(!$scope.model.motivo){
                $scope.msjerrorMotivo = "Debe eligir un motivo";
              }else if($scope.isEditableComentario){
                if(!$scope.model.comentario){
                  $scope.msjerrorComentario = "Este campo es obligatorio";
                }
                else{
                  $scope.msjerrorComentario = null;
                  cerrarCotizacion();
                }
              }
              else{
                $scope.msjerrorComentario = null;
                cerrarCotizacion();
              }
            }

            function cerrarCotizacion() {
              var data = {
                "idCotizacion": cotizacion.idCotizacion,
                "textoMotivo": $scope.model.comentario,
                "idMotivo": $scope.model.motivo,
                "estado": tipo === "C" ? "CERRADO" : "RECHAZADO"
              }
              campoSantoService.cerrarCotizacion(data).then(function (response) {
                if(tipo === "C") {
                  mModalAlert.showSuccess("Se cerró la cotizacion correctamente", "")
                    .then(function (r2) {
                      if (r2) {
                        $uibModalInstance.close();
                        _listarCotizaciones();
                      }
                    });
                }
                else {
                  var dataCorreoExepcional = {
                    "tipoCorreo": "S_RECHAZADO",
                    "comentario": $scope.model.comentario,
                    "idCotizacion": cotizacion.idCotizacion
                  }
                  campoSantoService.enviarCorreoExepcional(dataCorreoExepcional).then(function (response) {
                    if (response.OperationCode === 200) {
                      mModalAlert.showSuccess("Se rechazó la cotizacion correctamente", "")
                        .then(function (r) {
                          $uibModalInstance.close();
                          _listarCotizaciones();
                        })
                    }
                    else {
                      mModalAlert.showWarning(response.Message, "")
                    }
                  });
                }
              })
            }

            $scope.changeMotivo = function () {
              var motivo = $scope.listMotivos.find(function (m) {
                return m.Codigo == $scope.model.motivo;
              })
              if (motivo.Descripcion.toUpperCase() === "OTROS") {
                $scope.isEditableComentario = true;
              }
              else {
                $scope.isEditableComentario = false;
                $scope.model.comentario = "";
              }
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
