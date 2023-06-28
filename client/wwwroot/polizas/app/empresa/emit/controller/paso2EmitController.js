define([
  'angular',
  'constants',
  '/polizas/app/empresa/factory/empresasFactory.js',
  'helper',
  'lodash'
], function(angular, constants, helper, _){

  var appAutos = angular.module('appAutos');

  appAutos.controller('empresaEmitS2Controller', [
  	'$scope',
    '$window',
    '$state',
    'mainServices',
    'empresasFactory',
    'mModalAlert',
    '$timeout',
    '$q',
  	function(
      $scope,
      $window,
      $state,
      mainServices,
      empresasFactory,
      mModalAlert,
      $timeout,
      $q
      ){
      /*########################
      # _getList
      ########################*/
      function _getList(emissionStep){
        var vCiaCode = emissionStep.Producto.CodigoCia;

        $scope.emitS2.materialData = empresasFactory.obtenerListaMaterial();
        $scope.emitS2.usoData = empresasFactory.obtenerListaUso();
        $scope.emitS2.tipoConstruccData = empresasFactory.proxyGeneral.GetListTipoConstruccion(vCiaCode, false);

        $scope.emitS2.codAbonadoData = empresasFactory.proxyContratante.GetAbonado('', '', false);
      }
      /*########################
      # _calendarSettings
      ########################*/
      function _calendarSettings(item){
        $scope.inlineOptions = {
          minDate: new Date(),
          showWeeks: true
        };

        item.dateOptions = {
          formatYear: 'yy',
          minDate: new Date(),
          startingDay: 1,
        };

        $scope.fnOpenCalendar = function(item) {
          item.popupCalendar.opened = true;
        };

        item.popupCalendar = {
          opened: false
        };
      }

      //initData
      function _initData(emissionStep){
        var risks = emissionStep.Riesgos;
        var today = new Date();
        for(var i = 0; i < risks.length; i++){
          if(emissionStep.McaInspeccion == "S"){
            risks[i].Inspeccion = {
              McaAlarma: (risks[i].Inspeccion && risks[i].Inspeccion.McaAlarma) ? risks[i].Inspeccion.McaAlarma : 'S',
              McaRociclador: (risks[i].Inspeccion && risks[i].Inspeccion.McaRociclador) ? risks[i].Inspeccion.McaRociclador : 'S',
              McaGabinete: (risks[i].Inspeccion && risks[i].Inspeccion.McaGabinete) ? risks[i].Inspeccion.McaGabinete : 'S',
              McaDetectoHumo: (risks[i].Inspeccion && risks[i].Inspeccion.McaDetectoHumo) ? risks[i].Inspeccion.McaDetectoHumo : 'S',
              McaVigilanciaPropia: (risks[i].Inspeccion && risks[i].Inspeccion.McaVigilanciaPropia) ? risks[i].Inspeccion.McaVigilanciaPropia : 'S',
              McaVigilanciaPrivada: (risks[i].Inspeccion && risks[i].Inspeccion.McaVigilanciaPrivada) ? risks[i].Inspeccion.McaVigilanciaPrivada : 'S',
              McaCercoElectrico: (risks[i].Inspeccion && risks[i].Inspeccion.McaCercoElectrico) ? risks[i].Inspeccion.McaCercoElectrico : 'S',
              McaVigilanciaEdificio: (risks[i].Inspeccion && risks[i].Inspeccion.McaVigilanciaEdificio) ? risks[i].Inspeccion.McaVigilanciaEdificio : 'S',
              McaVigilanciaVecinal: (risks[i].Inspeccion && risks[i].Inspeccion.McaVigilanciaVecinal) ? risks[i].Inspeccion.McaVigilanciaVecinal : 'S',
              FechaInspeccion: (risks[i].Inspeccion && risks[i].Inspeccion.FechaInspeccion) ? risks[i].Inspeccion.FechaInspeccion : $scope.emit.fnFilterDate(today, $scope.emit.FORMAT_DATE),
              Inspector: {
                Codigo: (!angular.isUndefined(risks[i].Inspeccion)) ? risks[i].Inspeccion.Inspector.Codigo : null,
                Descripcion: (!angular.isUndefined(risks[i].Inspeccion)) ? risks[i].Inspeccion.Inspector.Descripcion : null
              }
            };

            if(!angular.isUndefined(risks[i].Inspeccion.Inspector) && risks[i].Inspeccion.Inspector.Codigo != null){
              risks[i].mInspector = {
                numDocumentoCont: risks[i].Inspeccion.Inspector.Codigo,
                NombreInspector: risks[i].Inspeccion.Inspector.Descripcion
              }
            }
          }

          if(risks[i].Convenio6.McaContratado == 'S'){
            risks[i].Convenio6.NombreArchivo = (risks[i].Convenio6.NombreArchivo) ? risks[i].Convenio6.NombreArchivo : '';
            risks[i].Convenio6.NombreArchivoServer = (risks[i].Convenio6.NombreArchivoServer) ? (risks[i].Convenio6.NombreArchivoServer) : '';
          }

          if(risks[i].Convenio7.McaContratado == 'S'){
            risks[i].Convenio7.NombreArchivo = (risks[i].Convenio7.NombreArchivo) ? risks[i].Convenio7.NombreArchivo : '';
            risks[i].Convenio7.NombreArchivoServer = (risks[i].Convenio7.NombreArchivoServer) ? risks[i].Convenio7.NombreArchivoServer : '';
          }

          risks[i].NumeroSotano = (risks[i].NumeroSotano == 0) ? "" : risks[i].NumeroSotano;
        } //end for
      } //end _initData
      /*########################
      # onLoad
      ########################*/
      (function onLoad(){

        $scope.emit = $scope.emit || {};
        $scope.emitS1 = $scope.emitS1 || {};
        $scope.emitS2 = $scope.emitS2 || {};
        $scope.emitS2.Riesgos = $scope.emitS2.Riesgos || [];
        $scope.emitS3 = $scope.emitS3 || {};
        $scope.emitS4 = $scope.emitS4 || {};

        $scope.maxLengthAbonado = 4;

        _initData($scope.emit.step);
        _getList($scope.emit.step);

      })(10);

      $scope._saveRisk = _saveRisk;
      $scope.updateInspector = updateInspector;

      function updateInspector(risk, inspector){
        inspector.numDocumentoCont = risk.Inspeccion.Inspector.Codigo;
        inspector.NombreInspector = risk.Inspeccion.Inspector.Descripcion;
      }

      /*########################
      # fnInitCalendar
      ########################*/
      $scope.fnInitCalendar = function(item){
        _calendarSettings(item);
        item.mFechaInspeccion = (item.Inspeccion && item.Inspeccion.FechaInspeccion) ? mainServices.datePicker.fnFormatIn(item.Inspeccion.FechaInspeccion) : new Date();
      }
      /*########################
      # fnDownloadInsuredPayroll
      ########################*/
      $scope.fnDownloadInsuredPayroll = function(idTemplate){
        empresasFactory.proxyFile.CSGetTemplate(idTemplate, true).then(function(response){
          if (response.byteLength > 0){
            var vFileName = 'Formato_excel_de_Convenio.xlsx';
            mainServices.fnDownloadFileBase64(response, 'excel', vFileName, true);
          }
        });
      };
      /*########################
      # fnLoadFile
      ########################*/
      function _paramsCSLoadExcel(index, item, agreement){
        var vFile = item.fmFile || {};
        return {
          NumeroDocumento:  $scope.emit.step.NumeroDocumento, //item.NumeroDocumento,
          IndexRisk:        index,
          NumeroRiesgo:     item.NumeroRiesgo,
          Convenio:         agreement,
          Empleados:        (agreement == 'VI') ? item.Convenio6.NumeroAsegurados : item.Convenio7.NumeroEmpleados,
          File:             vFile[0]
        };
      }
      function _clearFileName(item, agreement){
        var vAgreement = (agreement == 'VI') ? 'Convenio6' : 'Convenio7';
        item[vAgreement].NombreArchivo = '';
      }
      $scope.fnLoadFile = function(index, item, agreement){
        _clearFileName(item, agreement);
        $timeout(function(){
          var vParams = _paramsCSLoadExcel(index, item, agreement);
          $scope.emitS2.risk = vParams;
          empresasFactory.proxyEmpresa.CSLoadExcel(vParams, true).then(function(response){
            switch (response.OperationCode){
              case constants.operationCode.success:
                var vAgreement = ($scope.emitS2.risk.Convenio == 'VI') ? 'Convenio6' : 'Convenio7';
                item[vAgreement].NombreArchivo = angular.copy($scope.emitS2.risk.File.name);
                item[vAgreement].NombreArchivoServer = response.Data.NombreArchivoServer;
                $scope.emitS2.risk = {};
                mModalAlert.showSuccess('El archivo se ha cargado con éxito', '');
                break;
              case constants.operationCode.code900:
                if (response.Message !== ''){
                  $scope.emitS2.risk = {};
                  mModalAlert.showWarning(response.Message, 'ALERTA');
                }else{
                  $scope.errorFile = response.Data.errores;
                  var uibModalOptions = {
                    scope: $scope,
                    size: 'md',
                    controller : ['$scope', '$uibModalInstance',
                          function($scope, $uibModalInstance) {
                      /*########################
                      # fnChangeLoadFile
                      ########################*/
                      $scope.fnChangeLoadFile = function(){
                        $timeout(function(){
                          var vEmissionStep = $scope.emit.step,
                              vRisk = $scope.emitS2.risk;

                          vEmissionStep.Riesgos[vRisk.IndexRisk].fmFile = $scope.emitS2.fmFile;
                          $scope.tplModalOptions.fnClose();
                          $scope.fnLoadFile(vRisk.IndexRisk, vEmissionStep.Riesgos[vRisk.IndexRisk], vRisk.Convenio);
                        }, 0);
                      };
                    }]
                  };
                  var modalOptions = {
                    showIcon: 'warning',
                    title: 'Se han encontrado errores',
                    templateContent: 'errorFile.html',
                    showCancelButton: false,
                    showConfirmButton: false
                  };
                  mainServices.fnShowModal(uibModalOptions, modalOptions);
                }
              break;
              case 500:
                mModalAlert.showWarning(response.Message, 'ALERTA');
              break;
            }
          });
        }, 0);
      }
      /*########################
      # _saveEmissionStep
      ########################*/
      function _mergeEmissionStep(item, index){
        var emissionStep = $scope.emit.step;
        angular.forEach(emissionStep.Riesgos, function(item, index){
          if(emissionStep.McaInspeccion == "S"){
            item.Inspeccion = item.Inspeccion || {};
            item.Inspeccion.FechaInspeccion = (item.mFechaInspeccion) ? $scope.emit.fnFilterDate(item.mFechaInspeccion, $scope.emit.FORMAT_DATE) : '';
            item.Inspeccion.Inspector = {
              Codigo: (item.mInspector) ? item.mInspector.numDocumentoCont : null,
              Descripcion: (item.mInspector) ? item.mInspector.NombreInspector : null
            }
          }

          if(item.Convenio6.McaContratado == "S"){
            item.Convenio6.NombreArchivo = (item.Convenio6.NombreArchivo == "") ? "" : item.Convenio6.NombreArchivo;
            item.Convenio6.NombreArchivoServer = (item.Convenio6.NombreArchivoServer == "") ? "" : item.Convenio6.NombreArchivoServer;
          }

          if(item.Convenio7.McaContratado == "S"){
            item.Convenio7.NombreArchivo = (item.Convenio7.NombreArchivo == "") ? "" : item.Convenio7.NombreArchivo;
            item.Convenio7.NombreArchivoServer = (item.Convenio7.NombreArchivoServer == "") ? "" : item.Convenio7.NombreArchivoServer
          }

          item.NumeroSotano = (item.NumeroSotano==0) ? 0 : item.NumeroSotano;
        });
        emissionStep.Paso = 2;
        return emissionStep;
      }

      function _saveRisk(item, i){
        $scope.emit.step = _mergeEmissionStep(item, i);
        empresasFactory.guardarPaso($scope.emit.step).then(function(response){
          if (response.OperationCode == constants.operationCode.success){
            mModalAlert.showSuccess('Se registró el riesgo con éxito', '');
          }else{
            mModalAlert.showWarning('Ocurrió un error al intentar guardar los cambios', '');
          }
        });
      }

      function _saveEmissionStep(isNextStep, e){
        $scope.emit.step = _mergeEmissionStep();
        empresasFactory.proxyEmpresa.SaveEmissionStep($scope.emit.step, true)
        .then(function(response){
          if (response.OperationCode == constants.operationCode.success){
            if(isNextStep)
              $state.go('empresaEmit.steps', {step: "3"});
            else if(e.step == 2){
              e.cancel = true;
              mModalAlert.showSuccess('Se registró el riesgo con éxito', '');
            }
          }
        });
      }

      function evaluaAnioConstruccion(r, anio){
        if(anio > 0){
          var today = new Date();
          var year = today.getFullYear();
          if(parseInt(anio) >= 1600 && parseInt(anio) <= year){
            r.errorAnioRange = false;
            return true;
          }else{
            r.errorAnioRange = true;
            return false;
          }
        }else
          return false;
      }

      function _validFiles(convenio){
        if(angular.isUndefined(convenio.NombreArchivo) || convenio.NombreArchivo == ""){
          $scope.errorConvenioFile = true;
          return false;
        }else{
          $scope.errorConvenioFile = false;
          return true;
        }
      }

      function _isValid(risk, i){
        var validFile6 = (risk.Convenio6.McaContratado == "S") ? _validFiles(risk.Convenio6) : true;
        var validFile7 = (risk.Convenio7.McaContratado == "S") ? _validFiles(risk.Convenio7) : true;
        $scope.emitS2.frmRisk[i].markAsPristine();
        return evaluaAnioConstruccion(risk, risk.AnioConstruccion) &&
        validFile6 && validFile7 &&
        $scope.emitS2.frmRisk[i].$valid;
      }

      /*########################
      # fnSaveRisk
      ########################*/
      $scope.fnSaveRisk = function(item, i){
        if(_isValid(item, i)) _saveEmissionStep(false, {cancel: true, step: "2"});
        else mModalAlert.showWarning('Por favor corregir los errores antes de continuar', '');
      };

      /*########################
      # fnNextStep
      ########################*/
      $scope.emitS2.fnNextStep = function(isNextStep, e){
        var numRiesgos = $scope.emit.step.Riesgos.length;
        var sw = -1;
        if(isNextStep){
          for(var i=0; i < numRiesgos; i++){
            var risk = $scope.emit.step.Riesgos[i];
            if(!_isValid(risk, i)){
              sw = 0; break;
            }else sw = 1;

          }

          if(sw == 1){
            _saveEmissionStep(isNextStep, e);
          }else{
            e.cancel = true;
            mModalAlert.showWarning('Por favor corregir los errores antes de continuar', '');
          }

        }else $state.go('empresaEmit.steps', {step: e.step});

      };

      $scope.$on("changingStep", function(event, e){
        if(e.step <= 2) $scope.emitS2.fnNextStep(false, e);
        else $scope.emitS2.fnNextStep(true, e);
      });

      //Autocomplete Inspector
      $scope.getListInspector = function(wilcar){

        if(wilcar && wilcar.length >= 2){
          var txt = wilcar.toUpperCase();
        }

        var defer = $q.defer();

        empresasFactory.autocompleteInspector(txt).then(
          function(response){
            if(response.Data.length > 0){
              $scope.sinResultados = false;
            }else{
              $scope.sinResultados = true;
            }
            defer.resolve(response.Data)
        });

        return defer.promise;

      };

  }]);


});
