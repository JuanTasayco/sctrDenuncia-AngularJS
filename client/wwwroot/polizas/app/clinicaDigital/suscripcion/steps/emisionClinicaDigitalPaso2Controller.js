'use strict';

define(['angular', 'constantsSalud', 'lodash'], function (angular, constantsSalud, _) {

  emisionClinicDigitalPaso2Controller.$inject = ['$scope', 'mModalAlert', 'mModalConfirm', 'saludSuscripcionFactory', 'saludFactory' , '$stateParams', '$state', '$window','mainServices'];

  function emisionClinicDigitalPaso2Controller($scope, mModalAlert, mModalConfirm, saludSuscripcionFactory, saludFactory , $stateParams, $state, $window, mainServices) {

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

    var _getDocumentos = function () {
      var params = {
        cod_grupo_documento: 7,
        valores: [
          {
            etiqueta: "CNTNDD",
            valor: "S"
          }],
      }
      saludFactory.getInformacionDocumentos1(params, true)
        .then(function(res) {
          if (res.COD === 200) {
            res.Resultado.forEach(function (elemento) {
              elemento.fileNombre = elemento.NOMBRE_ARCHIVO;
            });
            $scope.documentosInfo = res.Resultado;
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
          file: documento.file[0]
        }
        saludSuscripcionFactory.cargaAltaDocumental(vParams, true)
          .then(function (response) {
            if (response.OperationCode == 200) {
              documento.fileGuardado = response.Data.ValueResult;
              documento.fileNombre = documento.file[0].name;
              documento.fileSize = response.Data.ObjectResult.Size;
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
      delete(documento.fileSize);
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
            data.archivos.push({
              CodigoTipo: documento.COD_GD,
              DescripcionTipo: documento.DSCRPCN,
              Nombre: documento.fileGuardado,
              NombreOriginal: documento.fileNombre,
              Peso: documento.fileSize,
              McaObservado: documento.MCA_OBSRVDO,
              Id_documento: documento.ID_DOCUMENTO
            });
          }
        });
        saludFactory.registrarSuscripcion(data, true).then( function (res) {
          if (res.OperationCode == 200) {
            mModalAlert.showSuccess('Se guardaron los archivos con éxito', 'Enviado').then(function(x){
              $state.go("saludDocuments");
            });
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

    var _cargarInfoPasos = function (numeroCotizacion, showSpin) {
      saludSuscripcionFactory.getPaso1ClinicaDigital(numeroCotizacion, showSpin, true).then(function (data) {         
        if( data.NumeroDocumento === numeroCotizacion){
          console.log('1',data)          
          $scope.firstStep = angular.copy(data);
        }else{
          $state.go('.', {
            step: 1
          });
        }
        
      });
      _getDocumentos();
    }

    $scope.descargarCuestionario = function () {
      $window.open(constants.system.api.endpoints.policy + 'api/salud/dps/' + $stateParams.quotationNumber);
    }

    $scope.fnLoadFile = function (index) {
      var fileInput = document.querySelector('#file' + index);
      if (!fileInput.value) {
        return;
      }
      setTimeout(function () {
        var listFiles = $scope.documentosInfo[index].file;
        var fd = new FormData();
        fd.append('NumeroCotizacion', $scope.firstStep.NumeroDocumento || $stateParams.quotationNumber);
        $scope.documentosInfo[index].fileGuardado = [];
        $scope.documentosInfo[index].fileNombre = [];
        angular.forEach(listFiles, function pFe(item) {
          fd.append('file', item);
          if ($scope.documentosInfo[index].fileNombre && $scope.documentosInfo[index].fileGuardado.length === 1){
            return mModalConfirm.confirmWarning('¿Desea reemplazar el archivo?', '').then(function (res){
              if (res == true){                
                cargaAltaDocumental(item, index);
              }              
            });
          }else{
            cargaAltaDocumental(item, index);
          }  
          
        });   
        
      }, 100);
    }
    
    function getValueResult(data) { 
      
      return data.ValueResult;
    }
    function cargaAltaDocumental(item, index){
      console.log(item)
      if(item){
        mainServices.fnFileSerializeToBase64(item).then( function(res){
          $scope.documentosInfo[index].fileGuardado = $scope.documentosInfo[index].fileGuardado.concat([
            {
              nombre: item.name,
              codigoTipo: $scope.documentosInfo[index].COD_GD,
              fileBase64: res
            }]);
        });
        $scope.documentosInfo[index].fileNombre = $scope.documentosInfo[index].fileNombre.concat(item.name);
        _abrirModalExito('Se cargó el archivo correctamente.');
      }else {
        _abrirModalError('Hubo un problema al subir el archivo.');
        $scope.limpiarArchivos(index)
      }
      console.log($scope.documentosInfo[index]);
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
      
      delete($scope.documentosInfo[index].fileGuardado);
      delete($scope.documentosInfo[index].fileNombre);
    }
    
    
    $scope.limpiarArchivo = function (seccion, doc) {
      if ($scope.documentosInfo[seccion].fileGuardado.length===1) {
        var fileInput = document.querySelector('#file' + seccion);
        fileInput.value = '';
      }
      
      $scope.documentosInfo[seccion].fileGuardado.splice(doc, 1);
      $scope.documentosInfo[seccion].fileNombre.splice(doc, 1);
      
    }

    $scope.suscripcion = function () {
      if (_validarForm()) {
        $scope.firstStep.emisionClinicaDigital.ArchivosGestorDocumental = [];
        
        $scope.documentosInfo.forEach(function (documento) {
          if (documento.fileGuardado) {
            $scope.firstStep.emisionClinicaDigital.ArchivosGestorDocumental = $scope.firstStep.emisionClinicaDigital.ArchivosGestorDocumental.concat(documento.fileGuardado);
          }
        });
        saludFactory.EmisionClinicaDigital($scope.firstStep.emisionClinicaDigital, true).then( function (res) {
          if (res.OperationCode == 200) {
            mModalAlert.showSuccess("El número de póliza generado es: <b>" + res.Data.NumeroPoliza + "</b>", 'Exitoso').then(function(result){
              $state.go("clinicaDigitalDocuments") 
            });
          } else {
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

  return angular.module('appClinicaDigital')
    .controller('emisionClinicDigitalPaso2Controller', emisionClinicDigitalPaso2Controller)
});
