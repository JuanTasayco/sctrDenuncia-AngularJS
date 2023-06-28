define([
  'angular', 'constants', 'saludFactory',
], function (angular, constants, saludFactory) {
  'use strict';

  angular
    .module("appSalud")
    .directive('mpfDatosPolizaMigrar', DatosPolizaMigrarDirective);

  DatosPolizaMigrarDirective.$inject = [];

  function DatosPolizaMigrarDirective() {
    var directive = {
      controller: DatosPolizaMigrarDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/salud/migraciones/component/datos-poliza/datos-poliza.template.html',
      scope: {
        duracion: '=?ngModel',
        form: '=?form',
        disabled: '=?ngDisabled',
        ngValidation: '&onValidation',
        ngSubmitForm: '&onSubmitForm'
      }
    };

    return directive;
  }

  DatosPolizaMigrarDirectiveController.$inject = ['$scope', 'saludFactory', 'mModalAlert', '$stateParams'];
  function DatosPolizaMigrarDirectiveController($scope, saludFactory, mModalAlert, $stateParams) {

    $scope.format = 'dd/MM/yyyy';
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
      opened: false
    };

    $scope.popup2 = {
      opened: false
    };

    $scope.popup3 = {
      opened: false
    };

    $scope.dateOptions = {
      initDate: new Date(),
    };

    $scope.dateOptions2 = {
      initDate: new Date(),
    };

    $scope.dateOptions3 = {
      initDate: new Date(),
    };

    $scope.searchProvisionalCoverage = {};
    $scope.disabledForm = true;
    $scope.buscar = true;

    $scope.activeBotonBuscar = ActiveBotonBuscar;
    $scope.buscarLimpiarPoliza = BuscarLimpiarPoliza;
    $scope.changeNumeroPoliza = ChangeNumeroPoliza;

    if ($stateParams.token) {
      $scope.disabledPolize = true;

      saludFactory.GetPolizaPorToken($stateParams.token, true).then(function (response) {
        if (response.OperationCode === constants.operationCode.success && Object.keys(response.Data).length !== 0) {
          $scope.searchProvisionalCoverage.NumeroPoliza = response.Data.NumeroPoliza;
        } else {
          _limpiarPoliza();
          $scope.invalidToken = true;
          mModalAlert.showWarning(response.Message, 'Error');
        }
      }).catch(function (err) {
        _limpiarPoliza();
        $scope.invalidToken = true;
        mModalAlert.showError(err.data.message, 'Error');
      });
    }

    (function load_DatosPolizaMigrarDirectiveController() {
      $scope.searchProvisionalCoverage = saludFactory.getMigracion() || {};
    })();

    $scope.open = function() {
      $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
      $scope.popup2.opened = true;
    };

    $scope.open3 = function() {
      $scope.popup3.opened = true;
    };

    var listeFormStep = $scope.$watch('form', function(nv){
      if(nv === 1){
        $scope.frmPolizaMigracion.markAsPristine();
        $scope.ngValidation({ '$event': { evento: $scope.frmPolizaMigracion.$valid } });
      }
    });

    $scope.$on('$destroy', function(){
      listeFormStep();
    });

    $scope.continuarMigracion = function (formulario) {
      var dataMigracion = $scope.searchProvisionalCoverage;
      var mcaEstado = dataMigracion.McaEstado;
      var inicioMigracion = dataMigracion.FechaVigenciaDesde;
      var finMigracion = dataMigracion.FechaVigenciaHasta;
      var parseInicioMigracion = _stringDateToDateFormat(inicioMigracion, '/');
      var parseFinMigracion = _stringDateToDateFormat(finMigracion, '/');

      if(mcaEstado === 'XX'){
        inicioMigracion = dataMigracion.FechaUltimoReciboPagado;
        parseInicioMigracion = _stringDateToDateFormat(inicioMigracion, '/');
      }
      if(mcaEstado === 'PR'){
        var difYears = parseFinMigracion.getFullYear() - parseInicioMigracion.getFullYear();

        parseInicioMigracion.setFullYear(parseInicioMigracion.getFullYear()+difYears);
        //parseInicioMigracion.setDate(parseInicioMigracion.getDate()+1);

        var copyParseInicioMigracion = angular.copy(parseInicioMigracion);
        copyParseInicioMigracion.setFullYear(copyParseInicioMigracion.getFullYear()+difYears);
        parseFinMigracion = copyParseInicioMigracion;
      }
      dataMigracion.mInicioMigracion = parseInicioMigracion;
      dataMigracion.mFinMigracion = parseFinMigracion;
      saludFactory.setMigracion(dataMigracion);
      $scope.ngSubmitForm({ '$event': { evento: formulario.$valid } });
    };


    function ActiveBotonBuscar() {
      if(!$scope.searchProvisionalCoverage.NumeroPoliza || $scope.invalidToken){
        return true;
      }

      return false;
    }

    function BuscarLimpiarPoliza(){
      if($scope.buscar){
          _buscarPoliza();
      } else {
        _limpiarPoliza();
      }

    }

    function ChangeNumeroPoliza(){
      _limpiarPolizaEsp();
    }
    
    function _limpiarPolizaEsp() {
      $scope.buscar = true;
      var numPoliza = $scope.searchProvisionalCoverage.NumeroPoliza;
      $scope.searchProvisionalCoverage = {};
      $scope.searchProvisionalCoverage.NumeroPoliza = numPoliza;
      saludFactory.setMigracion({});
    }
    
    function _buscarPoliza(){
      $scope.buscar = false;
      var codigoCia = constants.module.polizas.salud.companyCode;
      var codigoRamo = constants.module.polizas.referidos.salud;
      var numeroPoliza = $scope.searchProvisionalCoverage.NumeroPoliza;

      saludFactory.obtenerPolizaxNumero(codigoCia, codigoRamo, numeroPoliza, true).then(function (response) {
        if (response.OperationCode === constants.operationCode.success && Object.keys(response.Data).length !== 0) {
          $scope.searchProvisionalCoverage = _transformDataPoliza(response.Data);
        } else {
          mModalAlert.showWarning(response.Message, 'Error');
        }
      }).catch(function (err) {
        _limpiarPoliza();
        mModalAlert.showError(err.data.message, 'Error');
      });
    }

    function _transformDataPoliza(data){
        data.mDesdeCobertura = _stringDateToDateFormat(data.FechaVigenciaDesde, '/');
        data.mHastaCobertura = _stringDateToDateFormat(data.FechaVigenciaHasta, '/');
        data.mUltimoCobertura = _stringDateToDateFormat(data.FechaUltimoReciboPagado,'/');
        return data;

    }

    function _limpiarPoliza() {
      $scope.buscar = true;
      $scope.searchProvisionalCoverage = {};
      saludFactory.setMigracion({});
    }

    function _stringDateToDateFormat(dateString, stringSeparetor){

      if(!dateString) {
        return null;
      }

      var dateElements = dateString.split(stringSeparetor);
      return new Date(+dateElements[2], +dateElements[1] - 1, +dateElements[0]);
    }

  }

});
