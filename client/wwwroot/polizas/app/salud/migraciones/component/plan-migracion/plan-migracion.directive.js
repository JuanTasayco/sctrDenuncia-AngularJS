define([
  'angular', 'constants', 'saludFactory',
], function (angular, constants, saludFactory) {
  'use strict';

  angular
    .module('appSalud')
    .directive('mpfPlanMigracion', PlanMigracionDirective);

  PlanMigracionDirective.$inject = [];

  function PlanMigracionDirective() {
    var directive = {
      controller: PlanMigracionDirectiveController,
      controllerAs: 'vm',
      restrict: 'E',
      templateUrl: '/polizas/app/salud/migraciones/component/plan-migracion/plan-migracion.template.html',
      scope: {
        duracion: '=?ngModel',
        form: '=?form',
        disabled: '=?ngDisabled',
        ngValidation: '&onValidation'
      }
    };

    return directive;
  }

  PlanMigracionDirectiveController.$inject = ['$scope','oimPrincipal', 'saludFactory', 'mModalAlert', '$state', '$filter'];
  function PlanMigracionDirectiveController($scope,oimPrincipal, saludFactory, mModalAlert, $state, $filter) {

    $scope.format = 'dd/MM/yyyy';
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
      opened: false
    };

    $scope.popup2 = {
      opened: false
    };


    $scope.dateOptions = {
      initDate: new Date(),
      minDate: new Date(),
    };

    $scope.dateOptions2 = {
      initDate: new Date(),
      minDate: new Date(),
    };

    $scope.searchProvisionalCoverage = {};
    $scope.disabledForm = false;
    $scope.buscar = true;
    $scope.contratos = [];
    $scope.subContratos = [];
    $scope.fraccionamientos = [];
    $scope.userRoot = false;
    $scope.mAgente = {};

    $scope.activeBotonBuscar = ActiveBotonBuscar;
    $scope.buscarSubContratos = BuscarSubContratos;
    $scope.disabledDolaresUsar = DisabledDolaresUsar;
    $scope.getContratosPlanMigracion = GetContratosPlanMigracion;
    $scope.fnChangeMapfreDolares = ChangeMapfreDolares;

    (function load_PlanMigracionDirectiveController() {
      $scope.searchProvisionalCoverage = saludFactory.getMigracion() || {};
      $scope.mAgente = saludFactory.getAgente();
      if($scope.searchProvisionalCoverage.mContratoMigracion){
        $scope.getContratosPlanMigracion();
        $scope.buscarSubContratos($scope.searchProvisionalCoverage.mContratoMigracion);
      }
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
        $scope.searchProvisionalCoverage = saludFactory.getMigracion();
        cleanSecondForm()
        if($scope.searchProvisionalCoverage.Contratante && $scope.searchProvisionalCoverage.Contratante.SaldoMapfreDolar === 0){
          $scope.searchProvisionalCoverage.mUsarDolares = '2';
        }
        $scope.getContratosPlanMigracion();
      }
    });

    function cleanSecondForm() {
      $scope.searchProvisionalCoverage.mContratoMigracion = {
        nombreContratoMigracion: "--Seleccione--",
        numeroContrato: null,
        selectedEmpty: true
      }
      $scope.searchProvisionalCoverage.mSubContratoMigracion = {
        nombreSubContratoMigracion: '',
        numeroSubContrato: ''
      }
      $scope.searchProvisionalCoverage.mFinanciamiento = {
        Codigo: null,
        Descripcion: "--Seleccione--",
        selectedEmpty: true
      }
      $scope.fraccionamientos = [];
    }

    $scope.$on('$destroy', function(){
      listeFormStep();
    });

    $scope.generarCotizacion = function (formulario) {
      $scope.searchProvisionalCoverage.step1 = true;
      saludFactory.setMigracion($scope.searchProvisionalCoverage);
      var dataMigracion = angular.copy(saludFactory.getMigracion());
      dataMigracion.NumeroPolizaGrupo = $scope.searchProvisionalCoverage.mContratoMigracion.numPolizaGrupo;
      var requestCotizacion = _transformRequest(dataMigracion);

      saludFactory.cotizacionSaludMigracion(requestCotizacion, true)
        .then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            dataMigracion.cotizacion = response.Data;
            saludFactory.setMigracion(dataMigracion);
            $state.go('.', {
              step : 2
            });
          } else {
            mModalAlert.showError(response.Message, 'Error');
          }

        }).catch(function (err) {
        mModalAlert.showError(err.data.message, 'Error');
      });

    };

    function GetContratosPlanMigracion(){
      var codigoCia = ""+constants.module.polizas.salud.companyCode;
      var numeroContrato = ""+$scope.searchProvisionalCoverage.NumeroContrato;
      var numeroSubContrato = ""+$scope.searchProvisionalCoverage.NumeroSubContrato;
      var prioridadActual = ""+$scope.searchProvisionalCoverage.PrioridadActual;
      var continuidadActual = ""+$scope.searchProvisionalCoverage.ContinuidadActual;
      _obtenerContratos(codigoCia, numeroContrato, numeroSubContrato, prioridadActual, continuidadActual);
    }

    function _obtenerContratos(codigoCia, numeroContrato, numeroSubContrato, prioridadActual, continuidadActual){
        saludFactory.obtenerContratos(codigoCia, numeroContrato,numeroSubContrato, prioridadActual, continuidadActual, true).then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            $scope.contratos = response.Data;
          } else {
          }
        }).catch(function (err) {
        });
    }

    function BuscarSubContratos(numContrato){
      var subContrato = {nombreSubContratoMigracion: numContrato.nombreSubContratoMigracion, numeroSubContrato: numContrato.numeroSubContrato};
      $scope.searchProvisionalCoverage.mSubContratoMigracion = subContrato;
      $scope.subContratos = [subContrato];

      var codigoCia = constants.module.polizas.salud.companyCode;
      var codigoRamo = constants.module.polizas.referidos.salud;
      var numeroContrato = $scope.searchProvisionalCoverage.mContratoMigracion.numeroContrato;
      var numeroSubContrato = $scope.searchProvisionalCoverage.mSubContratoMigracion.numeroSubContrato;
      _obtenerFraccionamientos(codigoCia, codigoRamo, numeroContrato, numeroSubContrato);
    }

    function ChangeMapfreDolares(){
      if ($scope.searchProvisionalCoverage.mUsarDolares === '2') {
        $scope.searchProvisionalCoverage.mDolaresAusar = ''
      }
    }
    
    function _obtenerFraccionamientos(codigoCia, codigoRamo, numeroContrato, numeroSubContrato) {
      saludFactory.getFraccionamientoSalud(codigoCia, codigoRamo, numeroContrato, numeroSubContrato)
        .then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            $scope.fraccionamientos = response.Data;
          } else {
            mModalAlert.showError(response.Message, 'Error');
          }
        }).catch(function (err) {
        mModalAlert.showError(err.data.message, 'Error');
      });
    }

    function ActiveBotonBuscar() {
      if(!$scope.searchProvisionalCoverage.mNroDocumento){
        return true;
      }

      return false;
    }

    function DisabledDolaresUsar(){
      if(!$scope.searchProvisionalCoverage.Contratante){
        return false;
      }
      return !($scope.searchProvisionalCoverage.Contratante.SaldoMapfreDolar > 0 && $scope.searchProvisionalCoverage.mUsarDolares == 1);
    }

    function _dateToString(fecha) {
      var fechaModificada = angular.isDate(fecha) ? $filter('date')(fecha, 'dd/MM/yyyy') : fecha;
      return fechaModificada;
    }

    function _transformRequest(dataMigracion) {
      var request = {
        'codigoSistema': constants.ORIGIN_SYSTEMS.oim.code,
        'codigoAgente': dataMigracion.CodigoAgente,
        'codigoCia': constants.module.polizas.salud.companyCode,
        'fechaVigenciaDesdeMigracion': _dateToString(dataMigracion.mInicioMigracion),
        'fechaVigenciaHastaMigracion': _dateToString(dataMigracion.mFinMigracion),
        'codigoMoneda': dataMigracion.CodigoMoneda,
        'producto': {
          'codigoCompania': constants.module.polizas.salud.companyCode,
          'codigoRamo': constants.module.polizas.referidos.salud ,//dataMigracion.mProducto.CodigoRamo,
          'numeroContrato': dataMigracion.mContratoMigracion.numeroContrato,
          'numeroSubContrato': dataMigracion.mSubContratoMigracion.numeroSubContrato,
          'codProducto': dataMigracion.producto.CodigoProducto,
          'codSubProducto': 1,
          'codigoModalidad': "11603",//dataMigracion.mProducto.CodigoModalidad,
          'CodigoTipoPlan': 1
        },
        'asegurados': dataMigracion.Asegurados,
        'CodigoFraccionamiento': dataMigracion.mFinanciamiento.Codigo,
        'PrimaAnualizadaTotal': dataMigracion.PrimaAnualizadaTotal,
        'MapfreDolares': dataMigracion.mUsarDolares === '1' ? 'S' : 'N',
        'ImpMapfreDolares': dataMigracion.mDolaresAusar > 0 ? dataMigracion.mDolaresAusar : 0.0,
        'NumeroPoliza': dataMigracion.NumeroPoliza,
        'NumeroSuplementoCurso': dataMigracion.NumeroSuplementoCurso,
        'AjusteActualPoliza': !dataMigracion.AjusteActualPoliza ? 0 : parseFloat(dataMigracion.AjusteActualPoliza)
      };
      return request;
    }

  }

});
