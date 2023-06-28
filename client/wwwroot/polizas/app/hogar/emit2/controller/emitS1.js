(function($root, deps, action) {
  define(deps, action);
})(
  this,
  [
    'angular',
    'constants',
    'helper',
    '/polizas/app/hogar/proxy/hogarFactory.js',
    '/polizas/app/autos/autosEmitirUsado/component/groupPolize/groupPolize.js'
  ],
  function(angular, constants, helper) {
    var appAutos = angular.module('appAutos');

    appAutos.controller('hogarEmitt1Controller', [
      '$scope',
      '$window',
      '$state',
      'hogarFactory',
      '$timeout',
      'mModalAlert',
      '$stateParams',
      '$filter',
      function($scope, $window, $state, hogarFactory, $timeout, mModalAlert, $stateParams, $filter) {
        (function onLoad() {
          $scope.mainStep = $scope.mainStep || {};
          $scope.firstStep = $scope.firstStep || {};
          $scope.secondStep = $scope.secondStep || {};
          $scope.thirdStep = $scope.thirdStep || {};

          $scope.constants = $scope.constants || {};
          $scope.filters = $scope.filters || {};
          $scope.functions = $scope.functions || {};
        })();
        $scope.dateInvalid = false;
        $scope.firstStep.filterDate = $filter('date');
        $scope.firstStep.FORMAT_DATE = constants.formats.dateFormat;
        $scope.firstStep.FORMAT_MASK = constants.formats.dateFormatMask;
        $scope.firstStep.FORMAT_PATTERN = constants.formats.dateFormatRegex;
        $scope.firstStep.ALT_INPUT_FORMATS = ['M!/d!/yyyy'];

        $scope.firstStep.mFechaInicioVigencia = {};
        $scope.firstStep.mFechaInicioVigencia.model = new Date();
        $scope.firstStep.timeCurrentDate = new Date($scope.firstStep.mFechaInicioVigencia.model).getTime();

        function _setAddYears(codModalidad) {
          var currentYear = $scope.firstStep.mFechaInicioVigencia.model.getFullYear();
          var addYears = codModalidad == 30 ? currentYear + 2 : currentYear + 1;
          $scope.firstStep.mFechaFinVigencia = angular.copy($scope.firstStep.mFechaInicioVigencia.model);
          $scope.firstStep.mFechaFinVigencia = $scope.firstStep.filterDate(
            $scope.firstStep.mFechaFinVigencia.setYear(addYears),
            $scope.firstStep.FORMAT_DATE
          );
        }

        function setOptions(objDate) {
          objDate.options = {
            formatYear: 'yy',
            maxDate: null,
            minDate: $scope.firstStep.mFechaInicioVigencia.model,
            startingDay: 1
          };
        }

        setOptions($scope.firstStep.mFechaInicioVigencia);

        $scope.fnOpenCalendar = function(obj) {
          obj.open = true;
        };

        $scope.fnChangeDate = function() {
          if ($scope.firstStep.mFechaInicioVigencia.model) {
            var timeDate = new Date($scope.firstStep.mFechaInicioVigencia.model).getTime();
            if (timeDate >= $scope.firstStep.timeCurrentDate) {
              $scope.dateInvalid = false;
              _setAddYears($scope.dataHogar.CodigoModalidad);
            } else {
              $scope.dateInvalid = true;
            }
          }
        };

        function _getTypes(codModalidad) {
          hogarFactory.getTypes(codModalidad).then(function(res) {
            if (res.OperationCode == constants.operationCode.success) {
              $scope.tipoInmuebleData = res.Data;
            }
          });
        }

        function _getMaterials(codModalidad) {
          hogarFactory.getMaterials(codModalidad).then(function(res) {
            if (res.OperationCode == constants.operationCode.success) {
              $scope.materialRiesgoData = res.Data;
            }
          });
        }

        hogarFactory.getQuotation($stateParams.numDocument, true).then(function(response) {
          if (response.OperationCode == constants.operationCode.success) {
            $scope.dataGeneral = response.Data;
            $scope.dataHogar = $scope.dataGeneral.Hogar;
            _setAddYears($scope.dataHogar.CodigoModalidad);
            _getTypes($scope.dataHogar.CodigoModalidad);
            _getMaterials($scope.dataHogar.CodigoModalidad);
          }
        });

        $scope.nextStep = function() {
          $scope.frmFirstStep.markAsPristine();
          if ($scope.frmFirstStep.$valid) {
            if (!$scope.dateInvalid) {
              $scope.dataGeneral.mInicioVigencia = $scope.firstStep.filterDate(
                $scope.firstStep.mFechaInicioVigencia.model,
                $scope.firstStep.FORMAT_DATE
              );
              $scope.dataGeneral.finVigencia = $scope.firstStep.mFechaFinVigencia;
              $scope.dataGeneral.direccionInmueble = $scope.mDireccionRiesgo;
              $scope.dataGeneral.tipoInmueble = $scope.mTipoInmueble;
              $scope.dataGeneral.codigoMaterial = $scope.mMaterialRiesgo;

              $state.go('hogarEmitt2', {
                numDocument: $state.params.numDocument,
                paramsHogarEmit: $scope.dataGeneral
              });
            }
          }
        };
      }
    ]);
  }
);
