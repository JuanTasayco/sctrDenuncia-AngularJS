'use strict';

/**
 * Timepicker:
 * Input para HH:MM AM/PM
 *
 * @param {boolean} isHhMm - true o false, fijar formato de entrada y salida en HH:MM
 * @param {boolean} isReadOnly - true o false, para permitir que se pueda tipear dentro de los inputs de HH, MM
 * @param {object} labelData - data para el label e indicar si es requerido el campo
 * @param {Object} modelo - binding hacia el modelo padre. Se puede setear la hora desde este campo
 * @param {string} requerido - true o false, para realizar la validación
 */

define(['angular'], function (ng) {
  MpfTimepickerController.$inject = ['$filter', '$scope', '$timeout', '$window', '$document', '$element'];

  function MpfTimepickerController($filter, $scope, $timeout, $window, $document, $element) {
    var vm = this;
    var watchModelo;
    var isChangeFromWatcher;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.showTimepicker = showTimepicker;
    vm.updateTime = updateTime;

    function onInit() {
      // config del uib-timepicker
      vm.hstep = 1;
      vm.mstep = 1;
      vm.ismeridian = true;
      watcherModelo();
      _render();
    }


    function onDestroy() {
      $document.off('click', _documentClickBind);
      watchModelo();
    }

    function watcherModelo() {
      watchModelo = $scope.$watch('$ctrl.modelo', function(nv, ov) {
        if (nv) {
          _render();
          isChangeFromWatcher = true
        }
      });
    }

    function _prefixNumberWithZero(num) {
      return num < 10 ? '0' + num : num;
    }

    function _getHour(time) {
      var hour = time.getHours();
      return _prefixNumberWithZero(hour);
    }

    function _getMinute(time) {
      var minute = time.getMinutes();
      return _prefixNumberWithZero(minute);
    }

    function _comunicarDataAlExterior() {
      isChangeFromWatcher = false;
      vm.modelo = vm.isHhMm ? _getHHMM() : ng.copy(vm.mTimepicker); // envio de la data hacia afuera
    }

    function _getHHMM() {
      var hour = vm.mTimepicker && _getHour(vm.mTimepicker) || '00';
      var minutes = vm.mTimepicker && _getMinute(vm.mTimepicker) || '00';

      return hour + ':' + minutes;
    }

    function _pintarDataEnInput() {
      vm.mTimepickerInput = $filter('date')(vm.mTimepicker, 'shortTime');
    }

    function _render() {
      vm.mTimepicker = vm.isHhMm ? _parseHHMMToDate() : _getDateTime();
      vm.modelo && _pintarDataEnInput();
      isChangeFromWatcher || vm.modelo && _comunicarDataAlExterior();
    }

    function _getDateTime() {
      return vm.modelo || new Date();
    }

    function _parseHHMMToDate() {
      var date = new Date();
      var defaultTime = vm.modelo || _getCurrentTimeHHMM();
      var arrTime = defaultTime.split(':');
      var hour = arrTime[0];
      var minutes = arrTime[1];
      date.setHours(hour, minutes);

      return date;
    }

    function _getCurrentTimeHHMM() {
      var date = new Date();
      var hour = date.getHours();
      var minutes = _getMinute(date);

      return hour + ':' + minutes;
    }

    function _documentClickBind(ev) {
      if (!vm.isVisibleTimepicker && vm.ngDisabled) {
        return void 0;
      }

      var dpContainsTarget = !ng.isUndefined($element[0].contains) && $element[0].contains(ev.target);
      if (vm.isVisibleTimepicker && !dpContainsTarget) {
        $document.off('click', _documentClickBind);
        $scope.$apply(function sco() {
          vm.isVisibleTimepicker = false;
        });
      }
    }

    function showTimepicker() {
      vm.isVisibleTimepicker = !vm.isVisibleTimepicker;
      vm.isVisibleTimepicker && _render()
      $document.on('click', _documentClickBind);
    }

    function updateTime() {
      _pintarDataEnInput();
      _comunicarDataAlExterior();
    }
  } // end controller

  return ng
    .module('mapfre.controls')
    .controller('MpfTimepickerController', MpfTimepickerController)
    .component('mpfTimepicker', {
      templateUrl: '/scripts/mpf-main-controls/components/mpf-timepicker/mpf-timepicker.html',
      controller: 'MpfTimepickerController',
      bindings: {
        isHhMm: '=?',
        isReadOnly: '@?',
        labelData: '<?',
        modelo: '=?',
        name: '@?',
        ngDisabled: '=?',
        requerido: '@?'
      }
    });
});
