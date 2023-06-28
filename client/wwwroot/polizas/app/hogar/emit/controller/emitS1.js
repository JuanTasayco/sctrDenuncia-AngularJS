(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/hogar/proxy/hogarFactory.js',
  '/polizas/app/autos/autosEmitirUsado/component/groupPolize/groupPolize.js'],
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('hogarEmitS1Controller',
      ['$scope', '$window', '$state', 'hogarFactory', '$timeout', 'mModalAlert',
      function($scope, $window, $state, hogarFactory, $timeout, mModalAlert){

        (function onLoad(){
          $scope.mainStep = $scope.mainStep || {};
          $scope.firstStep = $scope.firstStep || {};
          $scope.secondStep = $scope.secondStep || {};
          $scope.thirdStep = $scope.thirdStep || {};

          $scope.constants = $scope.constants || {};
          $scope.filters = $scope.filters || {};
          $scope.functions = $scope.functions || {};

          //
          if (typeof $scope.firstStep.vigenciaError == 'undefined') initVigenciaError();
          settingsVigencia();
          //

        })();

        /*##########################
        # Fecha Vigencia
        ##########################*/
        function initVigenciaError(){
          $scope.firstStep.vigenciaError = {
            error1: false,
            error2: false
          }
        }
        function settingsVigencia(){
          if (typeof $scope.firstStep.showVigencia == 'undefined') $scope.firstStep.showVigencia = true;

          $scope.today = function() {
            if (typeof $scope.firstStep.mInicioVigencia == 'undefined') $scope.firstStep.mInicioVigencia = new Date();
          };
          $scope.today();

          $scope.inlineOptions = {
            //customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
          };

          $scope.dateOptions = {
            dateDisabled: function(data){
              var date = data.date;
              var _today = new Date(); _today = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate());
              return  date < _today;
            },
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
          };

          $scope.toggleMin = function() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
          };

          $scope.toggleMin();

          $scope.open1 = function() {
            $scope.popup1.opened = true;
          };

          $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
          };

          $scope.format = constants.formats.dateFormat;
          $scope.altInputFormats = ['M!/d!/yyyy'];

          $scope.popup1 = {
            opened: false
          };
        }
        function validationDate(date1, date2){
          return date1.getFullYear() >= date2.getFullYear()
            && date1.getDate() >= date2.getDate()
            && date1.getMonth() >= date2.getMonth();
        }
        $scope.changeDate = function(){
          initVigenciaError();
          var _today = new Date();
          var ini = $scope.firstStep.mInicioVigencia;
          if (angular.isDate(ini)){
            $scope.firstStep.showVigencia = validationDate(ini,_today);
            if ( $scope.firstStep.showVigencia ) {
              var anual = 1;
              $scope.firstStep.mFinVigencia = new Date(ini.getFullYear() + anual, ini.getMonth(), ini.getDate());
            }else{
              $scope.firstStep.vigenciaError.error1 = true;
            }
          }
        }
        $scope.changeDate();
        //


        /*#########################
        # Steps
        #########################*/
        $scope.$on('changingStep', function(ib,e){
          if (e.step > 1){
            if (!$scope.validationForm()){
              e.cancel = true;
              mModalAlert.showWarning('Por favor verifique los datos ingresados (*)', 'Datos Erróneos');
            } else {
              if (e.step > $scope.mainStep.stepActive) { //e.step > $scope.mainStep.stepActive || changeData
                e.cancel = true;
              }
            }
          }
        });



        /*#########################
        # ValidationForm
        #########################*/
        $scope.validationForm = function(){
          return $scope.firstStep.showVigencia;
        };

        /*#########################
        # nextStep
        #########################*/
        $scope.nextStep = function(){
          if ($scope.validationForm()){
            $scope.mainStep.stepActive = 2;
            $state.go('.', {
              step: 2
            });
          }
        }

    }]);

  });
