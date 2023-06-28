define([
  'angular',
  'constants',
  '/polizas/app/empresa/factory/empresasFactory.js',
  'polizasFactory'
], function(angular, constants){

  var appAutos = angular.module('appAutos');

  appAutos.controller('empresaEmitS4Controller', [
  	'$scope', '$window', '$state', 'mainServices', 'empresasFactory', 'empresaListFourthStep', 'mModalAlert','polizasFactory', 'oimAbstractFactory', 'proxyGeneral',
  	function($scope, $window, $state, mainServices, empresasFactory, empresaListFourthStep, mModalAlert, polizasFactory, oimAbstractFactory, proxyGeneral){
      /*########################
      # _initData
      ########################*/
      function _initData(emissionStep){
        switch(emissionStep.Producto.CodigoProducto){
          case 129:
            emissionStep.SumaAseguradaTotal = 40000;
          break;
          case 130:
            emissionStep.SumaAseguradaTotal = 78000;
          break;
        }

        $scope.emitS4.mBusquedaEndosatario = (emissionStep.Endosatario && emissionStep.Endosatario.McaOpcion) ? emissionStep.Endosatario.McaOpcion : '1';
        $scope.emitS4.mSumaEndosar = emissionStep.SumaAseguradaTotal;
      }
      /*########################
      # onLoad
      ########################*/
      (function onLoad(){

        $scope.emit = $scope.emit || {};
        $scope.emitS1 = $scope.emitS1 || {};
        $scope.emitS2 = $scope.emitS2 || {};
        $scope.emitS3 = $scope.emitS3 || {};
        $scope.emitS4 = $scope.emitS4 || {};

        if (empresaListFourthStep){
          $scope.emitS4.financingTypeData = empresaListFourthStep[0].Data;
          $scope.emitS4.endorseeData = empresaListFourthStep[1].Data;
        }

        _initData($scope.emit.step);
        getEncuesta();

      })();

      function getEncuesta(){
        var codCia = constants.module.polizas.empresas.companyCode;
        var codeRamo = $scope.emit.step.Producto.CodigoRamo;

        proxyGeneral.GetEncuesta(codCia, codeRamo, false).then(function(response) {
          if(response.OperationCode == constants.operationCode.success){
            if (Object.keys(response.Data.Pregunta).length > 0){
              $scope.encuesta = response.Data;
              $scope.encuesta.CodigoCompania = codCia;
					    $scope.encuesta.CodigoRamo = codeRamo;
            }else{
              $scope.encuesta = {};
              $scope.encuesta.mostrar = 0;
            }
          }
        }, function(error){
          console.log('Error en getEncuesta: ' + error);
        })
      }

      /*########################
      # fnClearOptionEndorsee
      ########################*/
      $scope.fnClearOptionEndorsee = function(isSearchEndorsee){
        var vEmissionStep = $scope.emit.step;
        if ($scope.emitS4.mBusquedaEndosatario == 2){
          vEmissionStep.Endosatario = (isSearchEndorsee) ? {Codigo:vEmissionStep.Endosatario.Codigo} : {Codigo:null};
        }else{
          vEmissionStep.Endosatario = {Codigo:null}
        }
        $scope.emitS4.mSumaEndosar = vEmissionStep.SumaAseguradaTotal;
        $scope.emitS4.showLabelEndorsee = false;
        $scope.emitS4.showInputSumEndorse = false;
        $scope.emitS4.sumEndorseError = false;
      };
      /*########################
      # fnSearchEndorsee
      ########################*/
      $scope.fnSearchEndorsee = function(){
        if ($scope.emitS4.showLabelEndorsee){
          $scope.emitS4.showLabelEndorsee = false;
        }else{
          $scope.fnClearOptionEndorsee(true);
          var vEndorseeRuc = ($scope.emit.step.Endosatario && $scope.emit.step.Endosatario.Codigo) ? $scope.emit.step.Endosatario.Codigo : '';
          $scope.emitS4.showLabelEndorsee = false;
          if (vEndorseeRuc !== ''){
            empresasFactory.proxyContratante.GetEndosatarioTerceroByRuc(vEndorseeRuc, true).then(function(response){
              var vData = response.data || response.Data;
              if (response.OperationCode == constants.operationCode.success){
                if (vData){
                  $scope.emit.step.Endosatario = vData;
                }else{
                  mModalAlert.showWarning('No existe el endosatario', 'ALERTA');
                }
                $scope.emitS4.showLabelEndorsee = (vData) ? true : false;
              }else{
                mModalAlert.showWarning('No existe el endosatario', 'ALERTA');
              }
            });
          }else{
            mModalAlert.showWarning('Debe ingresar el ruc del endosatario', 'ALERTA');
          }
        }
      };
      /*########################
      # fnChangeEndorsee
      ########################*/
      $scope.fnChangeEndorsee = function(){
        var vEmissionStep = $scope.emit.step;
        $scope.emitS4.showLabelEndorsee = (vEmissionStep.Endosatario && vEmissionStep.Endosatario.Codigo !== null);
      };
      /*########################
      # fnModifyValue
      ########################*/
      $scope.fnModifyValue = function(){
        var vShowInputSumEndorse = $scope.emitS4.showInputSumEndorse,
            vSumEndorseError = false;
        if (vShowInputSumEndorse){
          vSumEndorseError = ($scope.emitS4.mSumaEndosar > $scope.emit.step.SumaAseguradaTotal);
          vShowInputSumEndorse = vSumEndorseError;
        }else{
          vShowInputSumEndorse = !vShowInputSumEndorse;
        }
        $scope.emitS4.sumEndorseError = vSumEndorseError;
        $scope.emitS4.showInputSumEndorse = vShowInputSumEndorse;
      };
      /*########################
      # fnNextStep & fnEmit
      ########################*/
      function _mergeEmissionStep(){
        var vEmissionStep = $scope.emit.step;

        vEmissionStep.Endosatario = vEmissionStep.Endosatario || {};
        vEmissionStep.Endosatario.McaOpcion = $scope.emitS4.mBusquedaEndosatario;

        if ($scope.emitS4.mBusquedaEndosatario > 1){
          vEmissionStep.Endosatario.SumaEndosatario = $scope.emitS4.mSumaEndosar;
        }
        vEmissionStep.Paso = 4;

        return vEmissionStep;
      }

      $scope.emitS4.fnNextStep = function(goStep){
        $scope.emit.step = _mergeEmissionStep();
        empresasFactory.proxyEmpresa.SaveEmissionStep($scope.emit.step, true).then(function(response){
          if (response.OperationCode == constants.operationCode.success){
            $state.go('empresaEmit.steps', {
              step: goStep
            });
          }
        });
      };
      $scope.fnEmit = function(){
        $scope.emit.step = _mergeEmissionStep();
        $scope.emit.step = polizasFactory.setReferidoNumber($scope.emit.step);
        $scope.emit.step.CodigoSistema = oimAbstractFactory.getOrigin();
        mainServices.fnReturnSeveralPromise([
          empresasFactory.proxyEmpresa.SaveEmissionStep($scope.emit.step, false),
          empresasFactory.proxyEmpresa.grabarEmision($scope.emit.step, false)
          ], true).then(function(response){
            var vEmission = response[1];
            if (vEmission.OperationCode == constants.operationCode.success){
              if($scope.encuesta.mostrar == 1){
                $scope.encuesta.numOperacion = vEmission.Data.NumeroDocumento;
                $state.go('emitEmpresaResumen', {
                  emissionNumber: vEmission.Data.NumeroDocumento,
                  encuesta: $scope.encuesta
                });
              }else{
                $state.go('emitEmpresaResumen', {
                  emissionNumber: vEmission.Data.NumeroDocumento
                });
              }
            }else{
              mModalAlert.showWarning(vEmission.Message, 'ALERTA');
            }
        });
      };

  }]);

});
