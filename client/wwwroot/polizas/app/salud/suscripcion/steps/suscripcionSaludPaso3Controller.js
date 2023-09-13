'use strict';

define(['angular', 'constantsSalud', 'lodash'], function (angular, constantsSalud, _) {

  suscripcionSaludPaso3Controller.$inject = ['$scope', 'mModalAlert', 'mModalConfirm', 'saludSuscripcionFactory', 'saludFactory' , '$stateParams', '$state', '$window'];

  function suscripcionSaludPaso3Controller($scope, mModalAlert, mModalConfirm, saludSuscripcionFactory, saludFactory , $stateParams, $state, $window) {

    var vm = this;
    $scope.filesT = [];
    $scope.motivoSolicitud = [];
    $scope.itemSaludBandeja = [];
    $scope.MotivoDPS = false
    vm.$onInit = function() {
      $scope.documentosInfo  = [];
      $scope.itemSaludBandeja = saludSuscripcionFactory.getitemSaludBandeja();
      $scope.documentosSalud = [];
      $scope.pdfUrl = {};
      $scope.observacionModal = '';

      _cargarInfoPasos($stateParams.quotationNumber, true);
    };

    var _revisarPeticion = function (item) {
        _getDocumentos(item);      
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

      if (!$scope.firstStep.comentarioAdicional4) {
        validForm = false;
        msjError = 'Es necesario ingresar un comentario.';
        mModalAlert.showError(msjError, 'Error');
        return validForm;
      }

      return validForm;
    }

    $scope.fnLoadFile4 = function (documento) {
      setTimeout(function () {
        var vParams = {
          NumeroCotizacion: $scope.itemSaludBandeja.NumeroDocumento,
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
              $scope.limpiarArchivo4(documento)
            }
          })
      }, 100);
    }

    $scope.limpiarArchivo4 = function (documento) {
      delete(documento.file);
      delete(documento.fileGuardado);
      documento.fileNombre = "";
      angular.forEach(angular.element("input[type='file']"), function(inputElem) {
        angular.element(inputElem).val(null);
      });
    }
    $scope.suscripcion4 = function () {
      if (_validarFormArchivos()) {
        var data = {
          NumeroDocumento: $scope.itemSaludBandeja.NumeroDocumento,
          CorrelativoGestorDocumental: $scope.itemSaludBandeja.CorrelativoGestorDocumental || 0,
          Paso: 4,
          Producto: {
            CodigoCompania: $scope.itemSaludBandeja.CodigoCia,
            CodigoRamo: $scope.itemSaludBandeja.CodigoRamo
          },
          archivos: [],
          Comentario: $scope.firstStep.comentarioAdicional4
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
          if (res.OperationCode == 200) {
            mModalAlert.showSuccess('Se guardaron los archivos con éxito', 'Enviado').then(function(x){
              $state.go("saludDocuments");
            });
          } else if(res.OperationCode == 204){
            mModalAlert.showSuccess(res.Data.MessageResult, 'Info').then(function(x){
              $state.go("saludDocuments");
            });
          }
          else {
            if (res.Data) {
              if (res.Data.Message) {
                mModalAlert.showError(res.Data.Message, 'Error'); 
              }else{
                mModalAlert.showError(res.Data.MessageResult, 'Error');  
              }
            } else {
              mModalAlert.showError(res.Message, 'Error');
            }
          }
        });
      }
    }

    var _validarPermiso = function (firstStep) {
      $scope.MotivoDPS =  $scope.motivoSolicitud.indexOf("DPS") >= 0
      if (firstStep.EstadoSolicitud != '' && $scope.motivoSolicitud.length === 0) {
        $state.go('resumenSuscripcionSalud', { quotationNumber: firstStep.NumeroDocumento }, {reload: true, inherit: false});
      } else if (
        firstStep.MotivoSolicitud.TipoMotivo.Codigo != constantsSalud.requestReasoNewPolicyCode &&
        !firstStep.MotivoSolicitud.NumeroPolizaMigracion
      ) {
        $state.go('.', {
          step: 1
        });
      } else if (angular.isUndefined(firstStep.NumeroCuestionario)) {
        $state.go('.', {
          step: 2
        });
      }
    }

    var _cargarInfoPasos = function (numeroCotizacion, showSpin) {
      $scope.motivoSolicitud = saludSuscripcionFactory.getmotivoSolicitud();
      saludSuscripcionFactory.getPaso1(numeroCotizacion, showSpin).then(function (data) {
        _validarPermiso(data);
        $scope.firstStep = angular.copy(data);
      });
      if($scope.motivoSolicitud.length > 0){
        _revisarPeticion($scope.itemSaludBandeja);
      }else{
        saludSuscripcionFactory.getPaso3($stateParams.quotationNumber).then(function (data) {
          $scope.documentosInfo = angular.copy(data);
        });        
      }      
    }

    $scope.descargarCuestionario = function () {
      var vFileName = 'CUESTIONARIO_COTIZACION_' + $stateParams.quotationNumber + '.pdf';
      saludFactory.GenerarCuestionarioFile($stateParams.quotationNumber, vFileName);
    }

    $scope.fnLoadFile = function (index) {
      var fileInput = document.querySelector('#file' + index);
      if (!fileInput.value) {
        return;
      }
      setTimeout(function () {
        var listFiles = index === 1 ? $scope.documentosInfo[index].file[0] :  $scope.documentosInfo[index].file;

        var fd = new FormData();
        fd.append('NumeroCotizacion', $scope.firstStep.NumeroDocumento ? $scope.firstStep.NumeroDocumento : $scope.firstStep.NumeroDocumentoEncript);
        fd.append('CodigoGestorDocumental', $scope.documentosInfo[index].COD_GD);
        
        if(index === 1 ) {
          fd.append('file', listFiles);         
        } else {
          angular.forEach(listFiles, function pFe(item) {
            fd.append('file', item);
          });
        }
        if (index === 1 ){
          if ($scope.documentosInfo[index].fileNombre && $scope.documentosInfo[index].fileGuardado.length === 1){
            return mModalConfirm.confirmWarning('¿Desea reemplazar el archivo?', '').then(function (res){
              if (res == true){
                cargaAltaDocumental(fd, index);
              }              
            });
          }else{
            cargaAltaDocumental(fd, index);
          }
        }else{
          cargaAltaDocumental(fd, index);
        }       
        
      }, 100);
    }
    
    function getValueResult(data) { 
      
      return data.ValueResult;
    }
    function cargaAltaDocumental(fd, index){
      saludSuscripcionFactory.cargaAltaDocumental(fd, true)
      .then(function (response) {
        if (response.OperationCode == 200) {
          if(!$scope.documentosInfo[index].fileGuardado || index === 1) {
            $scope.documentosInfo[index].fileGuardado = response.Data.map(getValueResult);
          } 
          else if($scope.documentosInfo[index].fileGuardado && index !== 1) {
            $scope.documentosInfo[index].fileGuardado = $scope.documentosInfo[index].fileGuardado.concat(response.Data.map(getValueResult))
          }
         if(!$scope.documentosInfo[index].fileNombre || index === 1) {
          $scope.documentosInfo[index].fileNombre = _.toArray($scope.documentosInfo[index].file).map(getFileName);
         } 
         else if($scope.documentosInfo[index].fileNombre && index !== 1) {
          var newListFile = _.toArray($scope.documentosInfo[index].file).map(getFileName);
          $scope.documentosInfo[index].fileNombre = $scope.documentosInfo[index].fileNombre.concat(getFileNameFormat(newListFile,$scope.documentosInfo[index].fileNombre));
         }
          
          $scope.documentosInfo[index].file = null;

          _abrirModalExito('Se cargó el archivo correctamente.');
          saludSuscripcionFactory.setPaso3($scope.documentosInfo);
        } else {
          _abrirModalError('Hubo un problema al subir el archivo.');
          $scope.limpiarArchivos(index)
        }
      })
    }
    
    function getFileName(file) {       
      return file.name;
    }
    
    function getFileNameFormat(file, fileNombre) {
      var newFileArray = []
      file.forEach(function (f) {
        if(fileNombre.indexOf(f) !== -1){
          var newFileName = f
          while(fileNombre.indexOf(newFileName) !== -1 ){
            newFileName = newFileName.split('.');
            newFileName = newFileName[0]+'(1).'+newFileName[1]
          }
          newFileArray.push(newFileName);
        }else{
          newFileArray.push(f);
        }
      });
      return newFileArray;
    }

    $scope.limpiarArchivos = function (index) {
      var fileInput = document.querySelector('#file' + index);
      fileInput.value = '';
      if($scope.documentosInfo[index].fileGuardado){
        delete($scope.documentosInfo[index].fileGuardado);
      }
     
      delete($scope.documentosInfo[index].fileNombre);
    }
    
    
    $scope.limpiarArchivo = function (seccion, doc) {
      if($scope.documentosInfo[seccion].fileGuardado){
        saludFactory.DeleteAttachFileDocument($scope.firstStep.NumeroDocumento ? $scope.firstStep.NumeroDocumento : $scope.firstStep.NumeroDocumentoEncript,
          $scope.documentosInfo[seccion].fileGuardado[doc], true).then(function(res){
  
            if ($scope.documentosInfo[seccion].fileGuardado.length===1) {
              var fileInput = document.querySelector('#file' + seccion);
              fileInput.value = '';
            }
            
            $scope.documentosInfo[seccion].fileGuardado.splice(doc, 1);
            $scope.documentosInfo[seccion].fileNombre.splice(doc, 1);
  
        })
      }
      
    }

    $scope.suscripcion = function () {
      if (_validarForm()) {
        var data = {
          NumeroCotizacion: $scope.firstStep.NumeroCotizacion,
          NumeroDocumento: $scope.firstStep.NumeroDocumento,
          CorrelativoGestionDocumental: 0,
          Paso: 3,
          Producto: {
            CodigoCompania: $scope.firstStep.Producto.CodigoCompania,
            CodigoRamo: $scope.firstStep.Producto.CodigoRamo
          },
          archivos: []
        }

        $scope.documentosInfo.forEach(function (documento) {
          if (documento.fileGuardado) {
            documento.fileGuardado.forEach(function (documentoFile, index) {            
                data.archivos.push({
                  CodigoTipo: documento.COD_GD,
                  DescripcionTipo: documento.DSCRPCN,
                  NombreTemp: documentoFile,
                  NombreOriginal: documento.fileNombre[index]
                });
            });
          }
        });
        saludFactory.registrarSuscripcion(data, true).then( function (res) {
          if (res.OperationCode == 200) {
            mModalAlert.showSuccess(res.Message || "Su solicitud ha sido generada. El número de cotización es <b>" + $stateParams.quotationNumber + "</b>, será validado por el suscriptor. Gracias", 'Exitoso').then(function(result){
              $state.go("saludDocuments") 
            });
          }
          else if(res.OperationCode == 204){
            mModalAlert.showSuccess(res.Data.MessageResult, 'Exitoso').then(function(x){
              $state.go("saludDocuments");
            });
          }
          else {
            if (res.Data) {
              _abrirModalError(res.Data.Message);
            } else {
              _abrirModalError(res.Message);
            }
          }
        });
      }
    }

    var _validarForm = function () {
      var validForm = true;
      var msjError = '';

      for (var i = 0; i < $scope.documentosInfo.length; i++) {
        var archivo = $scope.documentosInfo[i];
        if (!archivo.fileGuardado && archivo.MCA_OBLGTRO == 'S') {
          validForm = false;
          msjError = 'Es necesario adjuntar el archivo: "' + archivo.DSCRPCN + '".';
          _abrirModalError(msjError);
          break;
        }
        if (archivo.fileGuardado && archivo.fileGuardado.length == 0 ) {
          validForm = false;
          msjError = 'Es necesario adjuntar el archivo: "' + archivo.DSCRPCN + '".';
          _abrirModalError(msjError);
          break;
        }
      }

      return validForm;
    }

    function _abrirModalError(msjError) {
      mModalAlert.showError(msjError, 'Error');
    }

    function _abrirModalExito(msj) {
      mModalAlert.showSuccess(msj, 'Exitoso');
    }
    
  }

  return angular.module('appSalud')
    .controller('suscripcionSaludPaso3Controller', suscripcionSaludPaso3Controller)
});
