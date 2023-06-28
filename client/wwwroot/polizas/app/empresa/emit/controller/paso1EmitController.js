(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'lodash',
  '/polizas/app/empresa/factory/empresasFactory.js'],
  function(angular, constants, _){

    var appAutos = angular.module('appAutos');

    appAutos.controller('empresaEmitS1Controller', [
    '$scope',
    '$window',
    '$state',
    'mainServices',
    'empresasFactory',
    'mModalAlert',
    function(
      $scope,
      $window,
      $state,
      mainServices,
      empresasFactory,
      mModalAlert){
      /*########################
      # _calendarSettings
      ########################*/
      function _calendarSettings(){
        $scope.emitS1.dateOptions = {
          minDate: new Date(),
          startingDay: 1,
          showWeeks: true
        };

        $scope.fnOpenCalendar = function() {
          $scope.emitS1.popupCalendar.opened = true;
        };

        $scope.emitS1.popupCalendar = {
          opened: false
        };

      }
      /*########################
      # _getFinVigencia
      ########################*/
      function _getFinVigencia(inicioVigencia){
        var vDateFinVigencia = new Date(inicioVigencia),
            vFinVigencia;
        vDateFinVigencia.setFullYear(vDateFinVigencia.getFullYear() + 1);
        vFinVigencia = $scope.emit.fnFilterDate(vDateFinVigencia, $scope.emit.FORMAT_DATE);
        return vFinVigencia;
      }

      function _initData(emissionStep){
        _calendarSettings();
        $scope.emitS1.mFechaVigenciaInicio =
        (emissionStep.FechaVigenciaInicio)
        ? mainServices.datePicker.fnFormatIn(emissionStep.FechaVigenciaInicio)
        : new Date();

        emissionStep.FechaVigenciaInicio = $scope.emit.fnFilterDate($scope.emitS1.mFechaVigenciaInicio, $scope.emit.FORMAT_DATE);
        emissionStep.FechaVigenciaFin = _getFinVigencia($scope.emitS1.mFechaVigenciaInicio);

        $scope.emitS1.McaInspeccion = emissionStep.McaInspeccion || 'N';

        $scope.emitS1.Categoria = {
          Codigo: ($scope.emit.step.Categoria == null) ? null : emissionStep.Categoria.Codigo,
          Descripcion: ($scope.emit.step.Categoria == null) ? "" : emissionStep.Categoria.Descripcion
        };
        $scope.emitS1.DescripcionGarantia = emissionStep.DescripcionGarantia;

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

        _initData($scope.emit.step);

      })();

      $scope.$watch('emitS1.McaInspeccion', function(){
        if($scope.emitS1.McaInspeccion == "N"){
          $scope.emitS1.Categoria = {};
          $scope.emitS1.DescripcionGarantia = "";
        }
      })

      $scope.categoriaData = empresasFactory.getCategoryInspeccion(1);

      /*########################
      # fnChangeDate
      ########################*/
      $scope.fnChangeDate = function(){
        $scope.emit.step.FechaVigenciaFin = _getFinVigencia($scope.emitS1.mFechaVigenciaInicio);
      };
      /*########################
      # fnChangeInspection
      ########################*/
      $scope.fnChangeInspection = function(){
        if ($scope.emit.step.McaInspeccion == 'N'){
          $scope.emit.step.Categoria = {
            DescripcionGarantia: '',
            Codigo: null
          }
        }
      }
      /*########################
      # fnNextStep
      ########################*/
      function _mergeEmissionStep(){
        var vEmissionStep = $scope.emit.step,
            vStep = $scope.emitS1;

        vEmissionStep.FechaVigenciaInicio = $scope.emit.fnFilterDate($scope.emitS1.mFechaVigenciaInicio, $scope.emit.FORMAT_DATE);
        vEmissionStep.Paso = 1;
        vEmissionStep.McaInspeccion = $scope.emitS1.McaInspeccion;
        if(vEmissionStep.McaInspeccion == 'S'){
          vEmissionStep.DescripcionGarantia = $scope.emitS1.DescripcionGarantia;
          vEmissionStep.Categoria = {
            Codigo: $scope.emitS1.Categoria.Codigo,
            Descripcion: $scope.emitS1.Categoria.Descripcion
          }
        }else{
          vEmissionStep.DescripcionGarantia = "";
          vEmissionStep.Categoria = {};
        }

        return vEmissionStep;
      }

      function _isValid(){
        if($scope.emitS1.McaInspeccion == 'S'){
          $scope.frmFirstStep.markAsPristine();
          return $scope.frmFirstStep.$valid;
        }else return true;
      }

      $scope.emitS1.fnNextStep = function(isNextStep, e){
        if(_isValid()){
          $scope.emit.step = _mergeEmissionStep();
          empresasFactory.proxyEmpresa.SaveEmissionStep($scope.emit.step, true).then(function(response){
            if(response.OperationCode == constants.operationCode.success){
              $state.go('empresaEmit.steps', {
                step: e.step
              });
            }
          });
        }else{
          e.cancel = true;
          mModalAlert.showWarning('Por favor corregir los errores antes de continuar', '');
        }
      };

      $scope.$on("changingStep", function(event, e){
        $scope.emitS1.fnNextStep(true, e);
      });


    }]);

  });
