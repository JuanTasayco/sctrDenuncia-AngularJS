define([
  'angular', 'constants', 'constantsSepelios', 'campoSantoService', 'cpsDatosTomador', 'cpsDatosBeneficiario', 'cpsDatosAval', 'cpsDatosAdicionales', 'cpsCheckDocumentos'
], function (angular, constants, constantsSepelios, cpsDatosTomador, cpsDatosBeneficiario, cpsDatosAval, cpsDatosAdicionales, cpsCheckDocumentos) {
  'use strict';

  angular
    .module("appSepelio")
    .controller('repositorioDocumentosCamposantoController', repositorioDocumentosCamposantoController);

  repositorioDocumentosCamposantoController.$inject = ['$scope', '$state', '$stateParams', 'mainServices', 'mModalAlert', 'mpSpin', '$uibModal', 'mModalConfirm', 'campoSantoService', 'campoSantoFactory', 'sepelioAuthorize', 'proxyMenu'];

  function repositorioDocumentosCamposantoController($scope, $state, $stateParams, mainServices, mModalAlert, mpSpin, $uibModal, mModalConfirm, campoSantoService, campoSantoFactory, sepelioAuthorize, proxyMenu) {
    $scope.isReadOnly = !campoSantoFactory.isPreemitidoEditable();
    $scope.cotizacion = {};
    $scope.modelo = {};
    $scope.codeModule = $state.current.nombreCorto || $state.toOimState.nombreCorto || null;
    (function load_repositorioDocumentosCamposantoController() {
      $scope.format = constants.formats.dateFormat;
      $scope.tab = 1;
      proxyMenu.GetSubMenu('EMISA-CAMPOSANTO', true)
        .then(function (response) {
          sepelioAuthorize.setHomeMenu(response.data);
          if (!sepelioAuthorize.isAuthorized('ACCIONES')) {
            $state.go('accessdenied');
          }
        })
        .catch(function (error) {
          $state.go('accessdenied');
        });
      $scope.validadores = {
        minStartDate: new Date(),
        minStartDateFormat: campoSantoFactory.formatearFecha(new Date())
      }
      $scope.userRoot = campoSantoFactory.userRoot();
      campoSantoFactory.setCotizacionProducto($scope.cotizacion);
      $scope.cotizacion = campoSantoFactory.cotizacion;
      $scope.showTabs = false;
      campoSantoService.getCotizacion(campoSantoFactory.getidCotizacion())
        .then(function (response) {
          $scope.showTabs = true;
          $scope.cotizacion.datosCotizacion = response.Data;
          if ($scope.cotizacion.datosCotizacion) {
            $scope.cotizacion.datosCotizacion.fecEfec = new Date($scope.cotizacion.datosCotizacion.fecEfec);
            $scope.cotizacion.datosCotizacion.fecVcto = new Date($scope.cotizacion.datosCotizacion.fecVcto);
          }
          $scope.cotizacion.datosCotizacion.cuotaInicial = $scope.cotizacion.datosCotizacion.cuotaInicial ? parseFloat($scope.cotizacion.datosCotizacion.cuotaInicial).toFixed(2) : $scope.cotizacion.datosCotizacion.cuotaInicial = "-";
        });
    })();

    $scope.onFechaEfecto = function () {
      campoSantoService.getFechaVencimiento(campoSantoFactory.getCotizacionEmision()).then(function (response) {
        $scope.cotizacion.datosCotizacion.fecVcto = new Date(response.Data.fechaVencimiento);
      })
    }
    
    $scope.validate = function (itemName) {
      return sepelioAuthorize.menuItem($scope.codeModule, itemName);
    }


    $scope.volver = function () {
      $state.go(constantsSepelios.ROUTES.BANDEJA_COTIZACION, {}, { reload: true, inherit: false });
    }
    $scope.getTab = function (item) {
      $scope.tab = item
    }

    $scope.guardarCambios = function () {
      $scope.request = ""
      switch ($scope.tab) {
        case 1:
          mModalAlert.showSuccess("Cotización guardada correctamente.", "COTIZACION GUARDADA");
          break;
        case 2:
          $scope.api = "GuardarTomador";
          $scope.request = campoSantoFactory.getModelTomador()
          break;
        case 3:
          $scope.api = "GuardarBeneficiario";
          $scope.request = campoSantoFactory.getModelBenefiario()
          break;
        case 4:
          $scope.api = "GuardarAval";
          $scope.request = campoSantoFactory.getModelAval()
          break;
        case 5:
          $scope.api = "GuardarAdicional";
          $scope.request = campoSantoFactory.getModelDatosAdicionales();
        default:
          break;
      }

      campoSantoService.guardarFechaEfectoCotizacion(campoSantoFactory.getCotizacionFechaEfecto());
      
      if ($scope.tab != 1) {
        if ($scope.tab === 4 && $scope.request == null){
          return;
        }
        campoSantoService.guardarPreEmision($scope.request, $scope.api, campoSantoFactory.getidCotizacion()).then(function (response) {
          if (response.OperationCode === undefined){
            response = response.data;
          }
          if(response.OperationCode === constants.operationCode.success || response.OperationCode === 204){
              mModalAlert.showSuccess("Cotización guardada correctamente.", "COTIZACION GUARDADA").then(function (rs) {
              })
              if ($scope.tab == 5) {
                $scope.cotizacion.datosAdicionales.idAsociado = response.Data.idAsociado;
              }
          } else if(response.OperationCode === constants.operationCode.code900){
            mModalAlert.showWarning(response.Data.Message || response.Data, "");
          } else {
            mModalAlert.showWarning("Error al guardar la cotizacion", "")
          }
        }).catch(function (error) {
          mModalAlert.showWarning(error.Data, error.Message);
        });
      }
    };

    function showMessage(response, callback){
      if (response.OperationCode === undefined){
        response = response.data;
      }
      if(response.OperationCode === constants.operationCode.success){
        return true;
      } else if(response.OperationCode === constants.operationCode.code900){
        mModalAlert.showWarning(response.Data.Message || response.Data, "").then(function (r2) {
          if (callback) callback(response);
        });
      } else if(response.OperationCode === 600){
        mModalAlert.showWarning(response.Message, "Error al emitir - Contrato en estado Provisional").then(function (r2) {
          if (callback) callback(response);
        });
      } else {
        mModalAlert.showWarning(response.Message, "Error al guardar la emisión").then(function (r2) {
          if (callback) callback(response);
        });
      }
      $scope.error = true;
      return false;
    }

    function guardarTabs() {
      $scope.request = "";
      $scope.error = false;
      
      var apis = ['GuardarTomador', 'GuardarBeneficiario', 'GuardarAval', 'GuardarAdicional', 'PreEmitir'];

      $scope.api = apis[0];
      campoSantoService.guardarPreEmision(campoSantoFactory.getModelTomador(), $scope.api , campoSantoFactory.getidCotizacion()).then(function (response) {
        if (showMessage(response)){
          $scope.api = apis[1];
          campoSantoService.guardarPreEmision(campoSantoFactory.getModelBenefiario(), $scope.api , campoSantoFactory.getidCotizacion()).then(function (response) {
            if (showMessage(response)){
              if ($scope.cotizacion.datosCotizacion.idPago==='FINANCIADO' || $scope.cotizacion.datosCotizacion.idPago==='DIRECTO'){
                var datoAval = campoSantoFactory.getModelAval();
              $scope.api = apis[2];
                if (datoAval == null){
                  _GuardarDatosAdicionales(apis); 
                }else{
              campoSantoService.guardarPreEmision(campoSantoFactory.getModelAval(), $scope.api, campoSantoFactory.getidCotizacion()).then(function (response) {
                if (showMessage(response)){
                    _GuardarDatosAdicionales(apis); 
                    }
                  });
                }
              }else{
                _GuardarDatosAdicionales(apis); 
              }
                }
              });
            }
          });
        }

    function _GuardarDatosAdicionales(apis){
      $scope.api = apis[3];
      campoSantoService.guardarPreEmision(campoSantoFactory.getModelDatosAdicionales(), $scope.api, campoSantoFactory.getidCotizacion()).then(function (response) {
        if (showMessage(response)){
          _GuardarCotizacion();
        }
      });
    }

    function _validaControlTecnico(response){
      if (response.OperationCode === 600) $state.go(constantsSepelios.ROUTES.BANDEJA_COTIZACION, {}, { reload: true, inherit: false });
    }

    function _GuardarCotizacion() {
      if (!$scope.error) {
        $scope.cotizacion.datosCotizacion.estado = $scope.flagEstado;
        campoSantoService.guardarOperacion(campoSantoFactory.getCotizacionEmision(), 2)
          .then(function (response) {
            if (showMessage(response)){
              if ($scope.cotizacion.datosCotizacion.estado === 'EMITIDO'){
                campoSantoService.guardarEmision({
                  idCotizacion: $scope.cotizacion.datosCotizacion.idCotizacion
                })
                .then(function (response) {
                  if (showMessage(response, _validaControlTecnico)){
                    mModalAlert.showSuccess("Se guardo correctamente", "Cotización Emitida") 
                    .then(function (r2) {
                      if (r2) $state.go(constantsSepelios.ROUTES.BANDEJA_COTIZACION, {}, { reload: true, inherit: false });
                    });   
                  }
                });
              }else{
                mModalAlert.showSuccess("Se guardo correctamente", "La solicitud fue enviada al emisor")
                .then(function (r2) {
                  if (r2) $state.go(constantsSepelios.ROUTES.BANDEJA_COTIZACION, {}, { reload: true, inherit: false });
                });
              }              
            }
          })
          .catch(function (e) {
            mModalAlert.showWarning("Error al guardar la cotización", "")
            $scope.btndisabledPre_emitr = false;
          });
      }
    }

    $scope.denegarCotizacion = function (tipo, editable, cotizacion) {
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
              $scope.titulo = tipo === "O" ? "OSBERVADO" : "RECHAZADO";
              $scope.subtitulo = tipo === "O" ? "la observación" : "rechazo";
            }

            $scope.guardar = function () {
              $scope.msjerrorMotivo = null;
              if(!$scope.model.motivo){
                $scope.msjerrorMotivo = "Debe eligir un motivo";
              } else if($scope.isEditableComentario){
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
                "estado": tipo === "O" ? "OBSERVADO" : "RECHAZADO"
              }
              campoSantoService.cerrarCotizacion(data).then(function (response) {
                if (showMessage(response)){
                  if(tipo === "O") {
                    mModalAlert.showSuccess("Se observó la cotizacion correctamente", "")
                      .then(function (r2) {
                        $state.go(constantsSepelios.ROUTES.BANDEJA_COTIZACION, {}, { reload: true, inherit: false });
                      });
                  }
                  else {
                        mModalAlert.showSuccess("Se rechazó la cotizacion correctamente", "")
                          .then(function (r) {
                            $state.go(constantsSepelios.ROUTES.BANDEJA_COTIZACION, {}, { reload: true, inherit: false });
                          })
                  }
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

    $scope.guardarCotizacion = function (flagEstado) {
      $scope.btndisabledPre_emitr = true;
      $scope.frmDatos.frmRepositorioDocumentos.markAsPristine();
      $scope.frmDatos.frmDTomador.markAsPristine();
      $scope.frmDatos.frmDBeneficiario.markAsPristine();
      $scope.frmDatos.frmDAval.markAsPristine();
      $scope.frmDatos.frmDatosAdicionales.markAsPristine();
      $scope.flagEstado = flagEstado;
      
      if ($scope.frmDatos.frmRepositorioDocumentos.$invalid) {
        mModalAlert.showWarning("Campos requeridos en el Tab Check Documentos", "")
        $scope.btndisabledPre_emitr = false;
      }
      else if ($scope.frmDatos.frmDTomador.$invalid) {
        mModalAlert.showWarning("Campos requeridos en el Tab Datos del Tomador", "")
        $scope.btndisabledPre_emitr = false;
      }
      else if ($scope.frmDatos.frmDBeneficiario.$invalid) {
        mModalAlert.showWarning("Campos requeridos en el Tab Datos de los beneficiarios", "")
        $scope.btndisabledPre_emitr = false;
      }
      else if ($scope.frmDatos.frmDAval.$invalid && ($scope.cotizacion.datosCotizacion.idPago === 'FINANCIADO' || $scope.cotizacion.datosCotizacion.idPago === 'DIRECTO')) {
        mModalAlert.showWarning("Campos requeridos en el Tab Datos del Aval", "")
        $scope.btndisabledPre_emitr = false;
      }
      else if ($scope.frmDatos.frmDatosAdicionales.$invalid && !($scope.cotizacion.datosCotizacion.idRamo==401 && !$scope.userRoot)) {
        mModalAlert.showWarning("Campos requeridos en el Tab Datos Adicionales", "")
        $scope.btndisabledPre_emitr = false;
      }
      else {
        guardarTabs();
      }
    }

  }

});
