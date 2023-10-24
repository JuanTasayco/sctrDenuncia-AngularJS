(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'helper', 'lodash',
    '/polizas/app/documentos/proxy/documentosFactory.js',
    '/polizas/app/accidentes/doc/service/accidentesGuardadoFactory.js',
    'saludFactory',
    '/polizas/app/autos/autosDocs/service/automovilDocsFactory.js',
    '/polizas/app/sctr/emitir/service/sctrEmitFactory.js',
    '/polizas/app/hogar/proxy/hogarFactory.js',
    '/polizas/app/autos/autosHome/service/autosFactory.js',
    'modalSendEmail',
	'/scripts/mpf-main-controls/components/modalSendEmailPoliza/component/modalSendEmailPoliza.js', //MSAAVEDRA 20210805
    'mpfModalQuestion',
    'saludSuscripcionFactory', '/polizas/app/soat/soatDoc/service/soatGuardadoFactory.js'],

  function(angular, constants, helper, _){

    var appAutos = angular.module('appAutos');

    appAutos.controller('documentTrayController',
      ['$scope', '$window', '$state', '$timeout', '$filter', 'documentosFactory', 'oimPrincipal', 'mModalAlert', '$sce', 'accidentesGuardadoFactory', 'automovilDocsFactory', 'sctrEmitFactory', 'hogarFactory', '$stateParams', '$uibModal', 'proxySoat', '$q', 'accessSupplier', 'proxyContratante', 'saludFactory', 'saludSuscripcionFactory', 'mainServices', 'mModalConfirm', 'proxyReporte', 'soatGuardadoFactory',
        function($scope, $window, $state, $timeout, $filter, documentosFactory, oimPrincipal, mModalAlert, $sce, accidentesGuardadoFactory, automovilDocsFactory, sctrEmitFactory, hogarFactory, $stateParams, $uibModal, proxySoat, $q, accessSupplier, proxyContratante, saludFactory, saludSuscripcionFactory, mainServices, mModalConfirm, proxyReporte, soatGuardadoFactory){

          var _self = this;
          var base = constants.system.api.endpoints.policy;

          (function onLoad(){

              $scope.main = $scope.main || {};
              $scope.filterDate = $filter('date');
              $scope.openModalDocumentSalud = openModalDocumentSalud;
              $scope.openModalDocumentSaludComentarios = openModalDocumentSaludComentarios;
              $scope.statesSalud = constants.module.polizas.salud.stateDocuments;
              $scope.subStatesDocuments = constants.module.polizas.salud.subStatesDocuments;
              $scope.IS_COMPANY_CLIENT = oimPrincipal.isCompanyClient();

              $scope.showButton = function (item) {
                console.log('item', item);
                if(item.EstadoPoliza === 'MIGRADO' && item.EstadoEmision === $scope.statesSalud.emitida){
                  return false;
                }
                if(item.EstadoSolicitud !== 'RECHAZADO' && item.EstadoSolicitud !== $scope.statesSalud.emitida){
                  return true;
                }
                if(item.EstadoEmision === $scope.statesSalud.noVigente && item.EstadoSolicitud === ''){
                  return true;
                }
                if(item.EstadoPoliza !== 'MIGRADO' && item.EstadoEmision !== $scope.statesSalud.emitida){
                  return true;
                }
                if(item.EstadoPoliza === 'MIGRADO' && item.EstadoEmision !== $scope.statesSalud.emitida){
                  return true;
                }

              };

              $scope.optionSeeMore = {
              Accidentes:{
                codeRamo: 101,
                description: 'Accidentes',
                downloadPDF: function(param){
                  //No se va a realizar
                },
                goTo: function(param){
                  $state.go('getAccidente', {quotation:param.NumeroDocumento}, {reload: true, inherit: false});
                }
              },
              Hogar:{
                codeRamo: 120,
                description: 'Hogar',
                downloadPDF: function(param){
                  _hogarDownloadPDF(param);
                },
                goTo: function(param){
                  $state.go('hogarGeneratedLetter', {
                    numDocument: param.NumeroDocumento
                  });
                },
                goToEmit: function(param){
                  // _hogarDownloadPDF(param);
                  $state.go('hogarEmittResumen', {
                    numDocument: param.NumeroDocumento
                  });
                }
              },
              Transporte:{
                codeRamo: '252,253',
                codeRamoArray:[252,253],
                description: 'Transporte',
                downloadPDF: function(param){
                  _transporteDownloadPDF(param);
                },
                goTo: function(param){
                  _transporteDownloadPDF(param); //No redirecciona, deberia generar PDF
                }
              },
              Empresas:{
                codeRamo: '273,274',
                description: 'Empresas',
                downloadPDF: function(param){
                  _empresasDownloadPDF(param);
                },
                goTo: function(param){
                  _empresasDownloadPDF(param); //No redirecciona, deberia generar PDF
                }
              },
              Autos:{
                codeRamo: 301,
                description: 'Autos',
                downloadPDF: function(param){
                  _autoDownloadPDF(param);
                },
                goTo: function(param){
                  var key = 'documentosCotizacion';
                  automovilDocsFactory.addVariableSession(key, param.NumeroDocumento);
                  $state.go('cotizacionGuardadaAutos', {documentosCotizacion: param.NumeroDocumento}); // Redireccionamiento
                }
              },
              Soat:{
                codeRamo: 302,
                description: 'Soat',
                downloadPDF: function(param){
                  _soatDownloadPDF(param);
                },
                goTo: function(param){
                  _soatDownloadPDF(param); //No redirecciona, deberia generar PDF
                }
              },
              Sctr:{
                codeRamo: '701,702',
                codeRamoArray:[701,702],
                description: 'Sctr',
                downloadPDF: function(param){
                  _sctrDownloadPDF(param); //Va al paso 5 para generar el pdf
                },
                goTo: function(param){
                  _sctrStep(param); //Va al paso indicado
                }
              },
              Salud:{
                codeRamo: '114,115,116',
                codeRamoArray:[114,115,116],
                description: 'Salud',
                downloadPDF: function(param){
                  //No se va a realizar
                },
                goTo: function(param){
                  $state.go('cotizacionGuardadaSalud', {numDoc:param.NumeroDocumento}, {reload: true, inherit: false});
                }
              },
              ClinicaDigital:{
                codeRamo: '0',
                codeRamoArray:[0],
                description: 'ClinicaDigital',
                downloadPDF: function(param){
                  //No se va a realizar
                },
                goTo: function(param){
                  $state.go('cotizacionGuardadaClinicaDigital', {numDoc:param.NumeroDocumento}, {reload: true, inherit: false});
              }
            }
            }

            $scope.saludURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/documento/descargarExcel/salud');

            $scope.productoFilterData = _self.productDataSource;

            settingsVigencia();

            if(_self.subModule==='Soat'){
              anularSOAT();
              getEstadosSOAT();
              GetListModalidadSoatDigital();
              GetListEstadoPagoPoliza();
            }

            if(_self.subModule==='Salud'){
              getListPolizas();
              getListEstadosSolicitud();
              getListMotivosObservacion();
            }

            $scope.documentNumber = $stateParams.documentNumber;
            _clearFilterResult();
            _filter('1', $scope.documentNumber, true);
          })();

          // Salud
          function openModalDocumentSalud(item){
            saludSuscripcionFactory.setmotivoSolicitud(item.DetalleMotivoSolicitud)
            saludSuscripcionFactory.setitemSaludBandeja(item)
            if ( item.DetalleMotivoSolicitud.length > 0 ){
              if(item.DetalleMotivoSolicitud.length === 1){
                if (item.DetalleMotivoSolicitud[0] === 'CP'){
                  $state.go('suscripcionSalud.steps', {quotationNumber: item.NumeroDocumento, step: 1});
                }else if(item.DetalleMotivoSolicitud[0] === 'DPS'){
                  $state.go('suscripcionSalud.steps', {quotationNumber: item.NumeroDocumento, step: 2});
                }else{
                  $state.go('suscripcionSalud.steps', {quotationNumber: item.NumeroDocumento, step: 3});
                }
              }else{
                $state.go('suscripcionSalud.steps', {quotationNumber: item.NumeroDocumento, step: 1});
              }

            }else{
              var codSolicitudObservacion = item.CodigoSolicitud;
              var modalSize =  codSolicitudObservacion == $scope.subStatesDocuments.observada.documentos ? 'lg' : 'md';
              var vModalProof = $uibModal.open({
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                scope: $scope,
                size: modalSize,
                templateUrl : function() {
                  switch(codSolicitudObservacion){
                    //observada
                    case $scope.subStatesDocuments.observada.documentos:
                    var tpl = 'popupAdjuntarDocumento.html';
                    break;
                    //aprobadas
                    case $scope.subStatesDocuments.aprobada.exclusion:
                    var tpl = 'popupExclusion.html';
                    break;
                    case $scope.subStatesDocuments.aprobada.recargo:
                    var tpl = 'popupRecargo.html';
                    break;
                    case $scope.subStatesDocuments.aprobada.continuidad:
                    var tpl = 'popupContinuidad.html';
                    break;
                  }
                  return '/polizas/app/salud/popup/controller/'+tpl;
                },
                controller : ['$scope', '$uibModalInstance',
                  function($scope, $uibModalInstance) {

                    var vm = this;

                    vm.$onInit = function () {
                      $scope.documentosSalud = [];
                      $scope.pdfUrl = {};
                      $scope.codApli = '';
                      $scope.ipOrigen = '';
                      $scope.observacionModal = '';
                      _revisarPeticion();
                    }

                    var _revisarPeticion = function () {
                      if (codSolicitudObservacion == $scope.subStatesDocuments.observada.documentos) {
                        _getDocumentos(item);
                      }
                    }

                    var _validarFormArchivos = function () {
                      var validForm = true;
                      var msjError = '';

                      for (var i = 0; i < $scope.documentosSalud.length; i++) {
                        var archivo = $scope.documentosSalud[i];
                        if (!archivo.fileGuardado && archivo.MCA_OBSRVDO === 'S' && archivo.MCA_OBLGTRO === 'S') {
                          validForm = false;
                          msjError = 'Es necesario adjuntar el archivo: "' + archivo.DSCRPCN + '".';
                          mModalAlert.showError(msjError, 'Error');
                          return validForm;
                        }
                      }

                      if (!$scope.comentarioAdicional) {
                        validForm = false;
                        msjError = 'Es necesario ingresar un comentario.';
                        mModalAlert.showError(msjError, 'Error');
                        return validForm;
                      }

                      return validForm;
                    }

                    $scope.fnLoadFile = function (documento) {
                      setTimeout(function () {
                        var vParams = {
                          NumeroCotizacion: item.NumeroDocumento,
                          CodigoGestorDocumental:documento.COD_GD,
                          file: documento.file[0]
                        }
                        saludSuscripcionFactory.cargaAltaDocumental(vParams, true)
                          .then(function (response) {
                            var responseCarga = response.Data;
                            if (response.OperationCode == 200) {
                              documento.fileGuardado = responseCarga;
                              documento.fileNombre = documento.file[0].name;
                            } else {
                              _abrirModalError('Hubo un problema al subir el archivo.');
                              $scope.limpiarArchivo(documento)
                            }
                          })
                      }, 100);
                    }

                    $scope.limpiarArchivo = function (documento) {
                      delete(documento.file);
                      delete(documento.fileGuardado);
                      documento.fileNombre = "";
                      angular.forEach(angular.element("input[type='file']"), function(inputElem) {
                        angular.element(inputElem).val(null);
                      });
                    }

                    $scope.suscripcion = function () {
                      if (_validarFormArchivos()) {
                        var data = {
                          NumeroDocumento: item.NumeroDocumento,
                          CorrelativoGestorDocumental: item.CorrelativoGestorDocumental || 0,
                          Paso: 4,
                          Producto: {
                            CodigoCompania: item.CodigoCia,
                            CodigoRamo: item.CodigoRamo
                          },
                          archivos: [],
                          Comentario: $scope.comentarioAdicional
                        }

                        $scope.documentosSalud.forEach(function (documento) {
                          if (documento.fileGuardado) {
                            documento.fileGuardado.forEach(function (documentoFile, index) {
                            data.archivos.push({
                              CodigoTipo: documento.COD_GD,
                              DescripcionTipo: documento.DSCRPCN,
                                NombreTemp: documentoFile.ValueResult,
                                NombreOriginal: documento.fileNombre[index],
                                Peso: documentoFile.fileSize,
                              McaObservado: documento.MCA_OBSRVDO,
                              Id_documento: documento.ID_DOCUMENTO
                            });
                          });
                          }
                        });
                        saludFactory.registrarSuscripcion(data, true).then( function (res) {
                          $scope.closeModal();
                          if (res.OperationCode == 200) {
                            mModalAlert.showSuccess('Se guardaron los archivos con éxito', 'Enviado');
                            $scope.filter($scope.actualPage);
                          } else {
                            if (res.Data) {
                              mModalAlert.showError(res.Data.Message, 'Error');
                            } else {
                              mModalAlert.showError(res.Message, 'Error');
                            }
                          }
                        });
                      }
                    }
                    /*no */
                    $scope.rechazar = function () {
                      if(!_validFormModal()) {
                        mModalAlert.showError('Es necesario agregar una observación', 'Error');
                        return;
                      }

                      mModalConfirm.confirmWarning('¿Está seguro de Rechazar la suscripción?', '')
                        .then(function (response) {
                          params = {
                            COD_COTIZACION : item.NumeroDocumento,
                            CTRSLTDO : 5,
                            OBSRVCN : $scope.observacionModal
                          }
                          saludFactory.actualizarDatosCotizacion(params, true)
                            .then(function (res) {
                              $scope.closeModal();
                              if (res.COD === 200) {
                                mModalAlert.showSuccess(res.MSJ, 'Rechazado');
                                $scope.filter($scope.actualPage);
                              } else {
                                mModalAlert.showError(res.MSJ, 'Error');
                              }
                            });
                        }, function (response) {
                          return false;
                        });
                    }
                    /*no */
                    $scope.getExcelModal = function () {
                      var params = {
                        tipoReporte: 1,
                        num_solicitud: item.NumeroDocumento
                      }
                      saludFactory.getReporteDocumentosModal(params, true)
                        .then(function (res) {
                          if (res.COD != 200 ) {
                            mModalAlert.showError('Hubo un error el proceso de descarga', 'Error');
                          } else {
                            if (res.Resultado === null) {
                              mModalAlert.showError(res.MSJ, 'Error');
                            } else {
                              var fileBase64 = res.Resultado.Base64;
                              var fileName = 'CotizacionN_' + params.num_solicitud + '_Reporte.pdf';
                              mainServices.fnDownloadFileBase64(fileBase64, 'pdf', fileName, false);
                            }
                          }
                        });
                    };
                    /*no */
                    $scope.aceptar =  function () {
                      if(!_validFormModal()) {
                        mModalAlert.showError('Es necesario agregar una observación', 'Error');
                        return;
                      }
                      params = {
                        COD_COTIZACION : item.NumeroDocumento,
                        CTRSLTDO : 4,
                        OBSRVCN : $scope.observacionModal
                      }

                      saludFactory.actualizarDatosCotizacion(params, true)
                        .then(function (res) {
                          $scope.closeModal();
                          if (res.COD === 200) {
                            mModalAlert.showSuccess(res.MSJ, 'Enviado');
                            $scope.filter($scope.actualPage);
                          } else {
                            mModalAlert.showError(res.MSJ, 'Error');
                          }
                        });
                    }
                    /*## closeModal ##*/
                    $scope.closeModal = function () {
                      $uibModalInstance.close();
                    };
                    /**no*/
                    var _validFormModal = function () {
                      var formValid = $scope.modalForm.$valid;
                      return formValid;
                    }

                    var _getDocumentos = function (item) {
                      var params = {
                        cod_grupo_documento: 4,
                        valores: [
                          {
                            etiqueta: "CNTNDD",
                            valor: "S"
                          },
                          {
                            etiqueta: "cod_cotizacion",
                            valor: item.NumeroDocumento
                          }
                        ],
                        NumeroCorrelativo: item.CorrelativoGestorDocumental,
                        CodigoUsuario: item.CodigoUsuario,
                        NumeroDocumento: item.NumeroDocumento,
                        CodigoCompania: item.CodigoCia,
                        NumeroRamo: item.CodigoRamo
                      }

                      saludFactory.getInformacionDocumentosModal(params, true)
                        .then(function(res) {
                          if (res.OperationCode === 200) {
                            res.Data.Resultado.forEach(function (elemento) {
                              elemento.fileNombre = elemento.NOMBRE_ARCHIVO;
                            });
                            $scope.documentosSalud = res.Data.Resultado;
                            $scope.comentario = res.Data.Comentario;
                          } else {
                            mModalAlert.showError(res.MSJ, 'Error');
                          }
                        });
                    }
                  }]
              });
              vModalProof.result.then(function(){
                //Action after CloseButton Modal
                $scope.documentosSalud = [];
              },function(){
                $scope.documentosSalud = [];
                //Action after CancelButton Modal
              });
            }

          }

          // Salud
          function openModalDocumentSaludComentarios(item){
            var modalSize =  'md';
            var vModalProof = $uibModal.open({
              backdrop: true,
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              size: modalSize,
              templateUrl : '/polizas/app/salud/popup/controller/popupComentariosList.html',
              controller : ['$scope', '$uibModalInstance',
                function($scope, $uibModalInstance) {

                  var vm = this;

                  vm.$onInit = function () {
                    $scope.documentosSalud = [];
                    _revisarPeticion();
                  }

                  var _revisarPeticion = function () {
                      _getDocumentos(item);
                  }

                  $scope.Corregir =  function () {
                    $scope.openModalDocumentSalud(item);
                  }
                  /*## closeModal ##*/
                  $scope.closeModal = function () {
                    $uibModalInstance.close();
                  };

                  var _getDocumentos = function (item) {
                    var params = {
                      cod_grupo_documento: 4,
                      valores: [
                        {
                          etiqueta: "CNTNDD",
                          valor: "S"
                        },
                        {
                          etiqueta: "cod_cotizacion",
                          valor: item.NumeroDocumento
                        }
                      ],
                      NumeroCorrelativo: item.CorrelativoGestorDocumental,
                      CodigoUsuario: item.CodigoUsuario,
                      NumeroDocumento: item.NumeroDocumento,
                      CodigoCompania: item.CodigoCia,
                      NumeroRamo: item.CodigoRamo
                    }

                    saludFactory.getInformacionDocumentosModal(params, true)
                      .then(function(res) {
                        if (res.OperationCode === 200) {
                          $scope.comentario = res.Data.Comentario;
                        } else {
                          mModalAlert.showError(res.MSJ, 'Error');
                        }
                      });
                  }
                }]
            });
            vModalProof.result.then(function(){
              //Action after CloseButton Modal
              $scope.documentosSalud = [];
            },function(){
              $scope.documentosSalud = [];
              //Action after CancelButton Modal
            });


          }

          // Salud
          function getListPolizas(){
            saludFactory.getListPolizas(false).then(function(response){
              if (response.OperationCode == constants.operationCode.success){
                if (response.Data.length > 0){
                  _self.polizasDataSource = response.Data;
                }
              }
            }, function(error){
              mModalAlert.showError(error.data.message, "Error");
            });
          }

          // Salud
          function getListEstadosSolicitud(){
            saludFactory.getListEstadosSolicitud(false).then(function(response){
              if (response.OperationCode == constants.operationCode.success){
                if (response.Data.length > 0){
                  _self.estadosSolicitudDataSource = response.Data;
                }
              }
            }, function(error){
              mModalAlert.showError(error.data.message, "Error");
            });
          }

          // Salud
          function getListMotivosObservacion(){
            saludFactory.getListMotivosObservacion(false).then(function(response){
              if (response.OperationCode == constants.operationCode.success){
                if (response.Data.length > 0){
                  _self.motivosObservacionDataSource = response.Data;
                }
              }
            }, function(error){
              mModalAlert.showError(error.data.message, "Error");
            });
          }

          //hogar
          $scope.isHogar = function() {
            return isHogar();
          };
          $scope.isClinicaDigital =  function() {
            return isClinicaDigital();
          };

          function isHogar() {
            return (_self.subModule==='Hogar');
          }

          $scope.isSalud = function () {
            return isSalud();
          }

          function isSalud() {
            return (_self.subModule==='Salud');
          }
          function isClinicaDigital() {
            return (_self.subModule==='ClinicaDigital');
          }
          $scope.nameProducto = function(){
            if (_self.subModule==='ClinicaDigital'){
              return 'Planes'
            }else{
              return 'Productos'
            }
          }

          $scope.isQuoteHogar = function() {
            return (isHogar() && ($state.current.name === "getQuotesHogar"));
          };

          //hogar
          $scope.showPlacaEndosatario = function(item){
            if(item){
              return (item.CodigoRamo === 301 &&  item.EstadoEmision === "EMITIDA");
            }
          };

          $scope.showModalEditPlaca = function(item){
            var vModalProof = $uibModal.open({
              backdrop: true, // background de fondo
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              size: 'md',
              templateUrl : 'app/autos/documents/controller/ModalEditPlaca.html',
              // template : '<mpf-modal-send-email action="action" data="emailData" close="close()"></mpf-modal-send-email>',
              controller : ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
                function($scope, $uibModalInstance, $uibModal, $timeout) {
                  /*#########################
                  # closeModal
                  #########################*/
                  $scope.closeModal = function () {
                    // $uibModalInstance.dismiss('cancel');
                    $uibModalInstance.close();
                  };

                  $scope.modificarPlaca = function(tipo){//0 placa 1 endosatario
                    var paramsPlacaEndosatario = {
                      CodCia: item.CodigoCia.toString(),
                      TipoOperacion : (tipo === 1) ? "ENDOSATARIO" : "PLACA",
                      NumeroPoliza : item.NumeroPoliza,
                      NumeroRiesgo : "1",
                      CodigoCampo : (tipo === 1) ?  "" : "NUM_MATRICULA",
                      ValorCampo : $scope.mPlaca,  // SOlO CUANDO ES "PLACA" ENVIAR EL VALOR DE LA PLACA
                      TipoDocumento : "", // SOLO CUANDO ES "ENDOSATARIO"
                      CodDocumento : "", // SOLO CUANDO ES "ENDOSATARIO"
                      MotivoSPTO : "CAMBIO DE MATRICULA OIM", // SOLO CUANDO ES "PLACA" ENVIAR "CAMBIO DE MATRICULA OIM"
                    };
                    $scope.activeButton = true;
                    documentosFactory.modificarPlacaEndosatario(paramsPlacaEndosatario).then(function(response){
                      $scope.activeButton = false;
                      if (response.OperationCode === constants.operationCode.success){
                        mModalAlert.showSuccess(response.Data.MotivoSPTO, 'Cambio realizado').then(function(response){
                          $uibModalInstance.close();
                          $state.reload();
                        });


                      }else{
                        mModalAlert.showError(response.Message, 'Error');
                      }
                    }, function(error){
                      mModalAlert.showError(response.Message, 'Error');
                    });
                  }
                }]
            });
          };

          $scope.showModalEditEndo = function(item){
            documentosFactory.getEndosatarios().then(function(response) {
              var r = helper.clone(response.data, true).data;
              angular.forEach(r, function(a, c) {
                a.code = a.codigo;
                a.codigo = a.tipoDocumento + ' - ' + a.codigo;

              })
              $scope.endosatarios = r;
            });


            var vModalProof = $uibModal.open({
              backdrop: true, // background de fondo
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              size: 'lg',
              templateUrl : 'app/autos/documents/controller/ModalEditEndo.html',
              // template : '<mpf-modal-send-email action="action" data="emailData" close="close()"></mpf-modal-send-email>',
              controller : ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
                function($scope, $uibModalInstance, $uibModal, $timeout) {
                  /*#########################
                  # closeModal
                  #########################*/
                  $scope.closeModal = function () {
                    // $uibModalInstance.dismiss('cancel');
                    $uibModalInstance.close();
                  };
                  function _initErrorEndorsee(){
                    $scope.main.errorEndorsee = {
                      error1 : false,
                      error2 : false,
                    };
                  }
                  function _clearSearchEndorsee(){
                    $scope.main.showLabelEndorsee = false;
                    $scope.mEndosatario = {
                      codigo : null
                    };
                    _initErrorEndorsee();
                  }
                  $scope.fnClearEndorsee = function(option){
                    if (option != 2) $scope.mEndosatario = '';
                    _clearSearchEndorsee();
                  }
                  $scope.fnSearchEndorsee = function(mEndosatario, showLabelEndorsee){
                    // _clearSearchEndorsee();
                    if (showLabelEndorsee){
                      $scope.main.showLabelEndorsee = false;
                    }else{
                      proxyContratante.GetEndosatarioTercero(mEndosatario, true).then(function(response){
                        if (response.OperationCode == constants.operationCode.success){
                          $scope.mEndosatario = helper.clone(response.Data, true);
                          $scope.main.showLabelEndorsee = true;
                          $scope.rucEndosatario = mEndosatario;
                        }else{
                          $scope.main.errorEndorsee.error1 = true;
                        }
                      }, function(error){
                        // console.log('error');
                      }, function(defaultError){
                        // console.log('errorDefault');
                      });
                    }
                  }
                  $scope.modificarEndosatario = function(tipo){//0 placa 1 endosatario
                    var paramsPlacaEndosatario = {
                      CodCia: item.CodigoCia.toString(),
                      TipoOperacion : (tipo == 1) ? "ENDOSATARIO" : "PLACA",
                      NumeroPoliza : item.NumeroPoliza,
                      NumeroRiesgo : "1",
                      CodigoCampo : (tipo == 1) ?  "" : "NUM_MATRICULA",
                      ValorCampo : "",  // SOlO CUANDO ES "PLACA" ENVIAR EL VALOR DE LA PLACA
                      TipoDocumento : "RUC", // SOLO CUANDO ES "ENDOSATARIO"
                      CodDocumento : ($scope.mEndosatario.code) ? $scope.mEndosatario.code : ($scope.rucEndosatario) ? $scope.rucEndosatario : '', // SOLO CUANDO ES "ENDOSATARIO"
                      MotivoSPTO : "", // SOLO CUANDO ES "PLACA" ENVIAR "CAMBIO DE MATRICULA OIM"
                    };

                    $scope.activeButton = true;
                    documentosFactory.modificarPlacaEndosatario(paramsPlacaEndosatario).then(function(response){
                      $scope.activeButton = false;
                      if (response.OperationCode == constants.operationCode.success){
                        mModalAlert.showSuccess(response.Data.MotivoSPTO, 'Cambio realizado').then(function(response){
                          $uibModalInstance.close();
                          $state.reload();
                        });


                      }else{
                        mModalAlert.showError(response.Message, 'Error');
                      }
                    }, function(error){
                      mModalAlert.showError(response.Message, 'Error');
                    });
                  }
                }]
            });
          };

          function anularSOAT(){
            var defer = $q.defer()
            proxySoat.ValidarOficinaParaAnularPoliza(false).then(function(response){
              $scope.permitirAnular = !(response.Data && response.Data.Bloqueado == "1");
            }, function(response){
              defer.reject(response);
            });
            return defer.promise;
          }

          $scope.vigenteAnular = function(item){
            return vigenteAnular(item);
          }

          function vigenteAnular(item){
            if(new Date(item.FechaRegistroValidar) <= new Date(new Date().setHours(23,59,59,999))){
              $scope.permitirAnular = true;
              return true;
            }else{
              $scope.permitirAnular = false;
              return false;
            }
            $scope.changeDate();
          }

          function getEstadosSOAT(){
            proxySoat.GetListEstadoPoliza(false).then(function(response){
              if (response.OperationCode == constants.operationCode.success){
                if (response.Data.length > 0){
                  _self.estadoDataSource = response.Data;
                }
              }
            }, function(error){
              mModalAlert.showError(error.data.message, "Error");
            });
          }

          function GetListModalidadSoatDigital(){
            proxySoat.GetListModalidadSoatDigital(false).then(function(response){
              if (response.OperationCode == constants.operationCode.success){
                if (response.Data.length > 0){
                  _self.modalidadesSOAT = response.Data;
                }
              }
            }, function(error){
              mModalAlert.showError(error.data.message, "Error");
            });
          }

          function GetListEstadoPagoPoliza(){
            proxySoat.GetListEstadoPagoPoliza(false).then(function(response){
              if (response.OperationCode == constants.operationCode.success){
                if (response.Data.length > 0){
                  _self.estadoPagoDataSource = response.Data;
                }
              }
            }, function(error){
              mModalAlert.showError(error.data.message, "Error");
            });
          }

          $scope.checkValue = function(item){
            if(_self.subModule=='Soat' && _self.modalidadesSOAT){
              var a = _self.modalidadesSOAT.lastIndexOf(item.toString());
              if(a == -1){
                return false;
              }else{
                return true;
              }
            }
          }

          function settingsVigencia(){

            $scope.today = function() {
              if (typeof $scope.mDesdeFilter == 'undefined') $scope.mDesdeFilter = new Date();
              if (typeof $scope.mHastaFilter == 'undefined') $scope.mHastaFilter = new Date();
            };
            $scope.today();

            $scope.inlineOptions = {
              minDate: new Date(),
              showWeeks: true
            };

            $scope.dateOptionsDesdeFilter = {
              formatYear: 'yy',
              maxDate: new Date(),
              minDate: new Date(),
              startingDay: 1
            };

            $scope.dateOptionsHastaFilter = {
              formatYear: 'yy',
              maxDate: new Date(),
              minDate: $scope.mDesdeFilter,
              startingDay: 1
            };

            $scope.toggleMin = function() {
              $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
              $scope.dateOptionsDesdeFilter.minDate = $scope.inlineOptions.minDate;
              $scope.dateOptionsHastaFilter.minDate = $scope.inlineOptions.minDate;
            };
            $scope.toggleMin();

            $scope.openDesdeFilter = function() {
              $scope.popupDesdeFilter.opened = true;
            };
            $scope.openHastaFilter = function() {
              $scope.popupHastaFilter.opened = true;
            };

            $scope.format = constants.formats.dateFormat;
            $scope.altInputFormats = ['M!/d!/yyyy'];

            $scope.popupDesdeFilter = {
              opened: false
            };
            $scope.popupHastaFilter = {
              opened: false
            };

            $scope.changeDate = function(){
              if ($scope.mHastaFilter < $scope.mDesdeFilter){
                $scope.mHastaFilter = $scope.mDesdeFilter;
              }
            }
            $scope.changeDate();
          }
          /*########################
          # _clearFilter
          ########################*/
          function _clearFilter(){
            $scope.mProductoFilter = {
              CodigoProducto: null
            };
            $scope.mDesdeFilter = new Date();
            $scope.mHastaFilter = new Date();
            $scope.mContratanteFilter = '';
            $scope.documentNumber = '';
            $scope.mEstadoFilter = "";
            $scope.mEstadoPagoFilter = "";
            $scope.mPolizaFilter = {
              Codigo: ''
            };
            $scope.mEstadoSolicitudFilter = "";
            $scope.mNumeroCotizacion = "";
            $scope.mMotivoFilter = "";
          }
          $scope.clearFilter = function(){
            _clearFilter();
            _clearFilterResult();
            _filter('1',undefined,false);
          }

          /*########################
          # filter
          ########################*/
          function _getCodeRamo(){
            var vCodeRamo = '0';
            if (_self.subModule){
              var vOptionSeeMore = _.find($scope.optionSeeMore, function(item){
                return item.description.toUpperCase() == _self.subModule.toUpperCase();
              });
              if (vOptionSeeMore) vCodeRamo = vOptionSeeMore.codeRamo; //$scope.codeRamo = vOptionSeeMore.codeRamo;
            }

            return vCodeRamo;
          }

          $scope.CODE_RAMO_AUTOS = constants.module.polizas.autos.codeRamo;
          $scope.codeRamoCurrent = _getCodeRamo();

          function _isAccidentes(){
            var vModule = 'Accidentes';
            return _self.subModule && _self.subModule.toUpperCase() == vModule.toUpperCase();
          }
          function _getCodigoProducto(){
            var vCodigoProducto = '0';
            if (typeof $scope.mProductoFilter != 'undefined'){
              var vValue = $scope.mProductoFilter[_self.productValueField];
              if (vValue != null) {
                vCodigoProducto = vValue;
              }else{
                if (_isAccidentes()) vCodigoProducto = 49;
              }
            }else{
              if (_isAccidentes()) vCodigoProducto = 49;
            }
            return vCodigoProducto;
          }
          function _clearFilterResult(){
            $scope.totalItems = 0;
            $scope.items = [];
          }
          function _buildFilter(currentPage, documentNumber){
            var data = {
              CodigoProducto:         _getCodigoProducto(), //vCodigoProducto, //(typeof $scope.mProductoFilter == 'undefined' || $scope.mProductoFilter.CodigoProducto == null) ? '0' : $scope.mProductoFilter.CodigoProducto, //'0',
              NumeroDocumento:        documentNumber || '0', //'0',
              FechaInicio:            $scope.filterDate($scope.mDesdeFilter, constants.formats.dateFormat), //'16/02/2017',
              FechaFinal:             $scope.filterDate($scope.mHastaFilter, constants.formats.dateFormat), //'16/02/2017',
              NombreContratante:      (typeof $scope.mContratanteFilter == 'undefined') ? '' : $scope.mContratanteFilter, //'',
              CodigoUsuario:          oimPrincipal.getUsername().toUpperCase(), //'WEBMASTER',
              GrupoAplicacion:        oimPrincipal.getUserSubType(), //'0',
              CodigoRolUsuario:       oimPrincipal.get_role().toUpperCase(), //'ADM',
              // CodigoRamo:             _getCodeRamo(), //$scope.codeRamo, //'0',
              CodigoRamoStr:          _getCodeRamo(), //$scope.codeRamo, //'0',
              CantidadFilasPorPagina: '10',
              PaginaActual:           currentPage
            }

            /*Empresas*/
            if(_self.subModule=='Empresas'){
              data.CodigoProceso = '2';
            }
            /*Soat*/
            if(_self.subModule=='Soat'){
              if($scope.mEstadoFilter){
                if($scope.mEstadoFilter.Codigo){
                  data.CodigoEstado =  ($scope.mEstadoFilter.Codigo) ? $scope.mEstadoFilter.Codigo : "" // VACIO cuando es todos, sino por el estado V vigente o A anulado
                }else{
                  data.CodigoEstado =  "";
                }
              }else{
                data.CodigoEstado =  "";
              }

              data.NumeroPoliza = ($scope.documentNumber) ? $scope.documentNumber : "";

              if($scope.mEstadoPagoFilter){
                if($scope.mEstadoPagoFilter.Codigo){
                  data.CodigoEstadoPago =  ($scope.mEstadoPagoFilter.Codigo) ? $scope.mEstadoPagoFilter.Codigo : "" // VACIO cuando es todos, sino por el estado V vigente o A anulado
                }else{
                  data.CodigoEstadoPago = "";
                }
              }else{
                data.CodigoEstadoPago = "";
              }
            } /* Hogar*/
            else if (isHogar()) { // hogar
              data.CodigoProceso = ($state.current.name === "getQuotesHogar") ? "1" : "2"; // 1 cotizacon y 2 emision
              data.CodigoRamoStr = _getCodeRamo();
            }
            /* Hogar*/

            if(_self.subModule === 'Soat' && $scope.documentNumber){
              data.NumeroPoliza =  $scope.documentNumber;
            }
            /* Hogar*/

            //SaludV2
            if(_self.subModule ==='Salud'){
              data.CodEstadoPoliza = ($scope.mPolizaFilter) ? $scope.mPolizaFilter.Codigo : "0";
              data.productoSalud =  {
                codigoCompania: ($scope.mProductoFilter) ? $scope.mProductoFilter.CodigoCompania : 0,
                codigoRamo: ($scope.mProductoFilter) ? $scope.mProductoFilter.CodigoRamo : 0,
                numeroContrato: ($scope.mProductoFilter) ? $scope.mProductoFilter.NumeroContrato : 0,
                numeroSubContrato: ($scope.mProductoFilter) ? $scope.mProductoFilter.NumeroSubContrato : 0
              };
              if (!data.productoSalud.numeroSubContrato) {
                data.productoSalud =  {
                  codigoCompania: 0,
                  codigoRamo: 0,
                  numeroContrato: 0,
                  numeroSubContrato: 0
                };
              }
              data.EstadoCotizacion = $scope.mEstadoSolicitudFilter ? $scope.mEstadoSolicitudFilter.descripcionCotizacion : "";
              data.MotivoObs = $scope.mMotivoFilter ? $scope.mMotivoFilter.codigoMotivo : "";
              data.NumeroDocumento = $scope.mNumeroCotizacion ? $scope.mNumeroCotizacion : "";
            }

            if(_self.subModule ==='ClinicaDigital'){
              data.CodigoProducto = (typeof $scope.mProductoFilter != 'undefined' && $scope.mProductoFilter.CodigoProducto != null) ? $scope.mProductoFilter.CodigoProducto : 0;
              data.CodigoModalidad = ($scope.mProductoFilter && typeof $scope.mProductoFilter.CodigoModalidad != 'undefined') ? $scope.mProductoFilter.CodigoModalidad : 0;
              data.CodigoPlan = ($scope.mProductoFilter && typeof $scope.mProductoFilter.CodigoPlan != 'undefined') ? $scope.mProductoFilter.CodigoPlan : 0;
              data.CodigoRamo = ($scope.mProductoFilter && typeof $scope.mProductoFilter.CodigoRamo != 'undefined') ? $scope.mProductoFilter.CodigoRamo : 0;
              data.CodigoSubProducto = ($scope.mProductoFilter && typeof $scope.mProductoFilter.CodigoSubProducto != 'undefined') ? $scope.mProductoFilter.CodigoSubProducto : 0;
              data.productoSalud =  {
                codigoCompania: ($scope.mProductoFilter) ? $scope.mProductoFilter.CodigoCompania : 0,
                codigoRamo: ($scope.mProductoFilter) ? $scope.mProductoFilter.CodigoRamo : 0,
                numeroContrato: ($scope.mProductoFilter) ? $scope.mProductoFilter.NumeroContrato : 0,
                numeroSubContrato: ($scope.mProductoFilter) ? $scope.mProductoFilter.NumeroSubContrato : 0
              };
              if (!data.productoSalud.numeroSubContrato) {
                data.productoSalud =  {
                  codigoCompania: 0,
                  codigoRamo: 0,
                  numeroContrato: 0,
                  numeroSubContrato: 0
                };
              }
            }

            return data;
          }
          function _filter(currentPage, documentNumber, firstTime){
            // _clearFilterResult();
            $scope.actualPage = currentPage;
            $scope.noResultInfo = false;
            $scope.noResult = false;
            var params;

            // if(_self.subModule=='Soat'){
            //   params = _buildFilter(currentPage, $scope.documentNumber);
            // }else{
            params = _buildFilter(currentPage, documentNumber);
            //}

            $scope.buildFilterOld = helper.clone(params, false); //Clonamos

            if(_self.subModule=='Soat'){
              documentosFactory.filterDocumentsSOAT(params, true).then(function(response){
                if (response.OperationCode === constants.operationCode.success){
                  if (response.Data.Lista.length > 0){
                    $scope.totalItems = parseInt(response.Data.CantidadTotalPaginas) * 10;
                    $scope.items = response.Data.Lista;
                  }else{
                    (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
                  }
                }else{
                  (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
                }
              }, function(error){
                (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
              }, function(defaultError){
                (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
              });
            } else if (isHogar()) { // hogar
            documentosFactory.filterDocumentsHogar(params, true).then(function(response) {
              if (response.OperationCode === constants.operationCode.success) {
                if (response.Data.Lista.length > 0) {
                  $scope.totalItems = parseInt(response.Data.CantidadTotalPaginas) * 10;
                  $scope.items = response.Data.Lista;
                  //debugger;
                } else {
                  (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
                  // $scope.noResult = true;
                }
              } else {
                (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
                // $scope.noResult = true;
                // mModalAlert.showError(response.Message, 'Error');
              }
            }, function(error) {
              (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
              // $scope.noResult = true;
              // console.log('error');
            }, function(defaultError) {
              (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
              // $scope.noResult = true;
              // console.log('errorDefault');
            });
          }else if(isSalud()){
              documentosFactory.filterDocumentsSalud(params, true).then(function(response){
                if (response.OperationCode === constants.operationCode.success){
                  if (response.Data.Lista.length > 0){
                    $scope.totalItems = parseInt(response.Data.CantidadTotalPaginas) * 10;

                    $scope.items = response.Data.Lista;
                  }else{
                    (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
                  }
                }else{
                  (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
                }
              }, function(error){
                (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
              }, function(defaultError){
                (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
              });
            }else if(isClinicaDigital()){
              documentosFactory.filterDocumentsClinicaDigital(params, true).then(function(response){
                if (response.OperationCode === constants.operationCode.success){
                  if (response.Data.Lista.length > 0){
                    $scope.totalItems = parseInt(response.Data.CantidadTotalPaginas) * 10;
                    $scope.items = response.Data.Lista;
            }else {
                    (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
                  }
                }else{
                  (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
                }
              }, function(error){
                (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
              }, function(defaultError){
                (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
              });
            }
            else {
              documentosFactory.filterDocuments(params, true).then(function(response){
                if (response.OperationCode === constants.operationCode.success){
                  if (response.Data.Lista.length > 0){
                    $scope.totalItems = parseInt(response.Data.CantidadTotalPaginas) * 10;
                    $scope.items = response.Data.Lista;
                  }else{
                    (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
                  }
                }else{
                  (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
                }
              }, function(error){
                (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
              }, function(defaultError){
                (firstTime) ? $scope.noResultInfo = true : $scope.noResult = true;
              });
            }



          }
          $scope.filter = function(currentPage){
            if ($scope.documentNumber && _self.subModule!='Soat') {
              $state.go('documentos', {
                documentNumber:''
              });
            }
            $scope.mPagination = currentPage;
            _clearFilterResult();
            _filter(currentPage,undefined,false);
          };
          /*########################
          # Filter x page
          ########################*/
          $scope.pageChanged = function(page){
            _filter(page,undefined,false);
          };
          /*########################
          # changeFilter
          ########################*/
          function _changeFilter(){
            var vPage = (typeof $scope.mPagination == 'undefined') ? '1' : $scope.mPagination;
            var vIsEqual = _.isEqual(_buildFilter(vPage), $scope.buildFilterOld);
            return !vIsEqual;
          }
          /*#########################
          # actionButton
          #########################*/
          $scope.actionSaludButton = function (numeroDocumento, estadoCotizacion, item) {
            saludSuscripcionFactory.setmotivoSolicitud(item.DetalleMotivoSolicitud);
            if(isClinicaDigital()){
            if (estadoCotizacion === '') {
                $state.go('cotizacionGuardadaClinicaDigital', { numDoc: numeroDocumento}, { reload: true, inherit: false });
              }
              else {
                $state.go('resumenSuscripcionSalud', { quotationNumber: numeroDocumento }, {reload: true, inherit: false});
              }
            }else{

              if(item.EstadoPoliza === 'MIGRADO' && item.EstadoEmision === 'VIGENTE'){
                var codigoCia = constants.module.polizas.salud.companyCode;
                var codigoRamo = constants.module.polizas.referidos.salud;
                var numeroPoliza = item.NumeroPolizaOriginal;

                var searchProvisionalCoverage = {};
                var cotizacion = {
                  "NumeroCotizacion": "",
                  "NumeroDocumento": item.NumeroDocumento,
                  "CodeResult": "0",
                };
                saludFactory.obtenerPolizaxNumero(codigoCia, codigoRamo, numeroPoliza, true).then(function (response) {
                  if (response.OperationCode === constants.operationCode.success && Object.keys(response.Data).length !== 0) {
                    cotizacion.NumeroCotizacion = response.Data.NumeroCotizacion;
                    searchProvisionalCoverage = _transformData(response.Data);
                    searchProvisionalCoverage.step1 = true;
                    searchProvisionalCoverage.cotizacion = cotizacion;
                    saludFactory.setMigracion(searchProvisionalCoverage);
                    $state.go('saludMigraciones.steps', {step: 2}, {reload: true, inherit: false});
                  } else {
                    mModalAlert.showWarning(response.Message, 'Error');
                  }
                }).catch(function (err) {

                });
              } else {
                $state.go('resumenSuscripcionSalud', { quotationNumber: numeroDocumento }, {reload: true, inherit: false});
              }
            }
          }

          $scope.descargarPdfSalud = function (numeroPoliza, mcaProvisional) {
            if (mcaProvisional !== 'N') {
              mModalAlert.showInfo("Póliza pendiente de aprobación de control técnico, espere su aprobación por favor.", "¡Alerta!")
              return;
            }

            proxyReporte.DescargarPoliza(1, numeroPoliza, true)
              .then(function (res) {
                var fileName = 'N_' + numeroPoliza + ".pdf";
                mainServices.fnDownloadFileBase64(res, 'pdf', fileName, true);
              })
              .catch(function (err) {
                mModalAlert.showError(err.data.Message, "Error")
              });
          }

          $scope.actionButton = function(index){
            var vItem = $scope.items[index];
            saludSuscripcionFactory.setmotivoSolicitud(vItem.DetalleMotivoSolicitud)
            var vOptionSeeMore = _.find($scope.optionSeeMore, function(item){
              var vCodeRamos = '' + item.codeRamo;
              vCodeRamos = _.map(vCodeRamos.split(','), function (c) {
                return '' + c;
              });
              if (_.contains(vCodeRamos, '' + vItem.CodigoRamo)){
                return item;
              }
          });

            if (vItem.MensajeAlerta !== ''){
              mModalAlert.showWarning(vItem.MensajeAlerta, 'Advertencia');
              if(vItem.CodigoRamo === constants.module.polizas.accidentes.codeRamo && vItem.TipoDocumento !== 'COTIZACION'){
                $state.go('accidentesEmitted', {quotationNumber: vItem.NumeroDocumento});
              }
            }else if (vItem.EstadoEmision === 'EMITIDA' && !isHogar()){
              // pdf
              if (vOptionSeeMore) vOptionSeeMore.downloadPDF(vItem);
            }else{
              if (isHogar() && ($state.current.name !== "getQuotesHogar")){
               if (vOptionSeeMore)  vOptionSeeMore.goToEmit(vItem);
              }else if (isSalud()){
                $scope.optionSeeMore.Salud.goTo(vItem);
              }
              else if (isClinicaDigital()){
                $scope.optionSeeMore.ClinicaDigital.goTo(vItem);
              }else{
                if (vOptionSeeMore) vOptionSeeMore.goTo(vItem);
              }
            }
          };
          /*#########################
          # downloadPDF
          #########################*/
          $scope.downloadExcel = function(){
            if ($scope.items.length > 0 && _changeFilter()){
              _filter('1',undefined,false)
            }
            if (!$scope.noResult){
              $scope.excelData = _buildFilter('1');
              if(_self.subModule ==='Salud' || _self.subModule ==='ClinicaDigital' ) {
                $window.setTimeout(function(){
                  document.getElementById('frmDownloadExcelSalud').submit();
                });
              } else {
                var vFileName = 'OIM - Cotizaciones y Pólizas' + '.xls';
                documentosFactory.generarExcel($scope.excelData, vFileName);

              }
            }
          };



          /*#########################
          # SCTR
          #########################*/
          function _sctrStep(item){
            var nroCotizacion = item.NumeroDocumento;
            var paramsCoti = {
              NumeroSolicitud:  nroCotizacion,
              Tipo:             1,
              TipoRol:          '' //'SUS'
            };
            sctrEmitFactory.getCotizacion(paramsCoti, true).then(function(response){

              if (response.OperationCode === constants.operationCode.success){
                $scope.cotizacion = response.Data;
                // console.log($scope.cotizacion.length);
                //tipo de seguro
                if($scope.cotizacion.length==2){
                  $scope.salud = true;
                  $scope.pension = true;
                }else if($scope.cotizacion[0].CodigoCompania==3){
                  $scope.salud = true;

                }else if($scope.cotizacion[0].CodigoCompania==2){
                  $scope.pension = true;

                }

                //paso
                if($scope.cotizacion[0].Solicitud.CodigoEstado=='RE' && $scope.cotizacion[0].Solicitud.SecuenciaReg==2){
                  $scope.paso2 = true;

                  irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 2, nroCotizacion);

                }

                if($scope.cotizacion[0].Solicitud.CodigoEstado=='RE' && $scope.cotizacion[0].Solicitud.SecuenciaReg==3){
                  $scope.paso3 = true;
                  $scope.tasasAceptadas = true;

                  irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 3, nroCotizacion);

                  //si rol es admin mostrar tasas

                  irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 3, nroCotizacion);

                }else if($scope.cotizacion[0].Solicitud.CodigoEstado=='RT' && $scope.cotizacion[0].Solicitud.SecuenciaReg==3){
                  $scope.paso3 = true;
                  $scope.tasasAceptadas = false;

                  irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 3, nroCotizacion);

                }else if($scope.cotizacion[0].Solicitud.CodigoEstado=='AT'){
                  $scope.paso4 = true;

                  irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 4, nroCotizacion);

                }else if($scope.cotizacion[0].Solicitud.CodigoEstado=='ER' || $scope.cotizacion[0].Solicitud.CodigoEstado=='CT'){
                  // $scope.paso3 = true;

                  // irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 3, nroCotizacion);

                }else if($scope.cotizacion[0].Solicitud.CodigoEstado=='SC'){
                  $scope.paso3 = true;
                  irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 3, nroCotizacion);

                }else if($scope.cotizacion[0].Solicitud.CodigoEstado=='AS'){
                  $scope.paso3 = true;
                  irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 3, nroCotizacion);

                }else if($scope.cotizacion[0].Solicitud.CodigoEstado=='RS'){
                  $scope.paso3 = true;
                  irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 3, nroCotizacion);

                }else if($scope.cotizacion[0].Solicitud.CodigoEstado=='ER'){
                  $scope.paso4 = true;
                  irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 4, nroCotizacion);

                }else if($scope.cotizacion[0].Solicitud.CodigoEstado=='EM' || $scope.cotizacion[0].Solicitud.CodigoEstado=='EP'){
                  //$scope.paso5 = true;
                  irACotizar($scope.cotizacion[0].Solicitud.TipoPeriodo, 5, nroCotizacion);
                }

              }
            });
          }
          function irACotizar(tipo, paso, nroCotizacion){
            if(tipo==constants.module.polizas.sctr.periodoCorto.TipoPeriodo){//periodo corto
              $state.go('sctrEmitir.steps', {tipo: tipo, quotation:nroCotizacion, step: paso});
            }else{//periodo largo
              $state.go('sctrEmitir.steps', {tipo: tipo, quotation:nroCotizacion, step: paso});
            }
          }

          /*#########################
          # buildPDF'S
          #########################*/
          function _soatDownloadPDF(item){
            if (item.NumeroPoliza) {
              var data = {
                CodigoCompania:   constants.module.polizas.soat.companyCode,
                NumeroPoliza:     item.NumeroPoliza,
                CodigoProceso:    'EMIS0001',
                CodigoRamo:       item.CodigoRamo,
                Usuario:          item.CodigoUsuario,
                NumApliShipTo:    '0',
                numeroShipTo:     '0',
                numeroAplicacion: '0'
              }
              $scope.pdfData = data;

              if (oimPrincipal.get_role().toUpperCase() == "AGTDIG") {
                $window.open(base + 'api/documento/descargarSoatEmisionPDF/' + item.NumeroPoliza);
              } else {
                var vFileName = 'OIM_SOAT_' + item.NumeroPoliza + '.pdf';
                soatGuardadoFactory.generarPDF($scope.pdfData, vFileName);
              }
            }
          }
          function _transporteDownloadPDF(item){
            var data = {
              CodigoCompania:       constants.module.polizas.soat.companyCode, //1,
              NumeroDocumento:      item.NumeroDocumento,
              CodigoAgente:         item.CodigoAgente, //'9808', //SERVICIO
              NumeroPoliza:         item.NumeroPoliza, //3021700000225,
              Suplemento :          '0',
              Aplicacion :          item.Aplicacion, //'11', //SERVICIO
              SuplementoAplicacion: '0',
              TipoImpresion :       'A',
              CodApli: $window.localStorage['appCodeSubMenu'] || '',
              IpOrigen: $window.localStorage['clientIp'] || '',
              CodigoUsuario: oimPrincipal.getUsername().toUpperCase()
            }
            $scope.pdfData = data;
            $scope.pdfURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/reporte/transporte/emision');

            $window.setTimeout(function(){
              document.getElementById('frmDownloadPDF').submit();
            });
          }
          function _hogarDownloadPDF(item){
            var vFileName = 'OIM - ' + item.NumeroPoliza + '.pdf';
            documentosFactory.generarArchivo(item.NumeroPoliza, vFileName);
          }
          function _autoDownloadPDF(item){
            var vFileName = 'OIM - ' + item.NumeroPoliza + '.pdf';
            documentosFactory.generarArchivo(item.NumeroPoliza, vFileName);
          }
          function _sctrDownloadPDF(item){
            //$state.go('sctrEmitir.steps', {tipo:'PN', quotation: 189131, step: 5});
            $state.go('sctrEmitir.steps', {
              tipo: item.TipPeriodo,
              quotation: item.NumeroDocumento,
              step: 5
            });
          }
          function _empresasDownloadPDF(item){
            var vUrl = constants.system.api.endpoints.policy + 'api/empresa/descarga/emision/' + item.CodigoCia + '/' + item.NumeroPoliza;
            $window.open(vUrl, '_blank');
          }

          $scope.isSoat = function(){
            if(_self.subModule=='Soat'){
              return true;
            }else{
              return false;
            }
          }

          $scope.status = function(item){
            return false;
          };

          $scope.anularSOAT = function(item){
            if(vigenteAnular(item)){
              $uibModal.open({
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                scope: $scope,
                template: '<mpf-modal-question data="data" close="close()"></mfp-modal-question>',
                controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
                  scope.close = function clFn() {
                    $uibModalInstance.close();
                  };
                  scope.anularPoliza = function acFn() {
                    var paramsAnular = {
                      CodigoRamo: item.CodigoRamo,
                      NumeroPoliza: item.NumeroPoliza
                    };

                    $uibModalInstance.close();
                    documentosFactory.anularSOAT(paramsAnular, true).then(function(response){
                      if (response.OperationCode == constants.operationCode.success){
                        mModalAlert.showError("Poliza anulada", "Anulada").then(function(response){
                          $uibModalInstance.close();
                          $state.reload();
                        });
                      }else{

                      }
                    }, function(error){
                      mModalAlert.showError(error.data.message, "Error");
                    }, function(defaultError){
                      mModalAlert.showError(error.data.message, "Error");
                    });
                  };
                  // Los parametros que recibe el componente estan detallados en el js del componente
                  scope.data = {
                    title: '¿Está seguro de anular la póliza?',
                    btns: [
                      {
                        lbl: 'Cancelar',
                        accion: scope.close,
                        clases: 'g-btn-transparent'
                      },
                      {
                        lbl: 'Anular',
                        accion: scope.anularPoliza,
                        clases: 'g-btn-verde'
                      }
                    ],
                    txtThx: "Póliza anulada exitosamente"
                  };

                }] // end Controller uibModal
              });
            }
          };

          function _paramsSendEmail(item){
            $scope.vParams = {
              NumeroPoliza: item.NumeroPoliza,
              MailTo: ""
            };
            return $scope.vParams;
          }

          $scope.enviarMailSOAT = function(item){
            if(oimPrincipal.get_role().toUpperCase() == "AGTDIG"){
              $scope.action = constants.modalSendEmail.agenteDigital.action;
              $scope.dataEmail = {
                CodigoCompania:   constants.module.polizas.soat.companyCode,
                NumeroPoliza:     item.NumeroPoliza,
                CodigoProceso:    'EMIS0001',
                CodigoRamo:       item.CodigoRamo,
                Usuario:          item.CodigoUsuario,
                NumApliShipTo:    '0',
                numeroShipTo:     '0',
                numeroAplicacion: '0'
              }
              var vModalSendEmail = $uibModal.open({
                backdrop: true, // background de fondo
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                scope: $scope,
                // size: 'lg',
                //template : '<mpf-nsctr-modal-send-email-files data="dataEmail" close="closeModalSendEmailFiles()"></mpf-nsctr-modal-send-email-files>',
                template : '<mpf-modal-send-email action="action"  data="dataEmail" close="close()"></mpf-modal-send-email>',
                controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
                  //CloseModal
                  $scope.close = function () {
                    $uibModalInstance.close();
                  };
                }]
              });
            } else{
              $scope.action = constants.modalSendEmail.soatElectronico.action;
              $scope.dataEmail = _paramsSendEmail(item);
              var vModalSendEmail = $uibModal.open({
                backdrop: true, // background de fondo
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                scope: $scope,
                // size: 'lg',
                //template : '<mpf-nsctr-modal-send-email-files data="dataEmail" close="closeModalSendEmailFiles()"></mpf-nsctr-modal-send-email-files>',
                template : '<mpf-modal-send-email action="action"  data="dataEmail" close="close()"></mpf-modal-send-email>',
                controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
                  //CloseModal
                  $scope.close = function () {
                    $uibModalInstance.close();
                  };
                }]
              });
            }


          };


		       //MSAAVEDRA 20210804
          $scope.enviarPolizaMail = function (item) {
            console.log('item',item);
            $scope.emailData = {
              CodigoCia: item.CodigoCia,
              NumeroPoliza: item.NumeroPoliza,
              Aplicacion: item.Aplicacion,
              Suplemento: item.Suplemento,
              SuplementoAplicacion: item.SuplementoAplicacion
            }

            //Modal
            console.log('envioPoliza',constants.modalSendEmail.envioPoliza);
            $scope.optionSendEmail = constants.modalSendEmail.envioPoliza;
            var vModalSendEmail = $uibModal.open({
              backdrop: true, // background de fondo
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              // size: 'lg',
              template: '<mpf-modal-send-email-poliza action="optionSendEmail" data="emailData" close="close()"></mpf-modal-send-email-poliza>',
              controller: ['$scope', '$uibModalInstance', '$uibModal', function ($scope, $uibModalInstance, $uibModal) {
                //CloseModal
                $scope.close = function () {
                  $uibModalInstance.close();
                };
              }]
            });

          };
          //FIN MSAAVEDA
          function _transformData(data){
            data.mDesdeCobertura = _stringDateToDateFormat(data.FechaVigenciaDesde, '/');
            data.mHastaCobertura = _stringDateToDateFormat(data.FechaVigenciaHasta, '/');
            data.mUltimoCobertura = _stringDateToDateFormat(data.FechaUltimoReciboPagado,'/');
            return data;

          }

          function _stringDateToDateFormat(dateString, stringSeparetor){

            if(!dateString) {
              return null;
            }

            var dateElements = dateString.split(stringSeparetor);
            return new Date(+dateElements[2], +dateElements[1] - 1, +dateElements[0]);
          }


        }]).component('mpfDocumentTray',{
      templateUrl: function($element, $attrs){
        if($attrs.subModule === "Hogar") {
          return '/scripts/mpf-main-controls/components/documentTray/component/hogar.html';
        } else if($attrs.subModule === "Salud" || $attrs.subModule === "ClinicaDigital" ) {
          return '/scripts/mpf-main-controls/components/documentTray/component/salud.html';
        } else {
          return '/scripts/mpf-main-controls/components/documentTray/component/documentTray.html';
        }
      },
      controller: 'documentTrayController',
      bindings: {
        title: '@',
        subModule: '@',
        productValueField: '@',
        productTextField: '@',
        productDataSource: '='
        // documentNumber: '=?'
      }
    })
  });
