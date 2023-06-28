'use strict';
define(['angular', 'lodash', 'dompurify'], function(ng, _, DOMPurify) {

  inputControllerFn.$inject = ['$scope'];

  function inputControllerFn(scope) {
    var vm = this,
      dompurifyConfig = { ALLOWED_TAGS: [] };
    vm.value = '';
    vm.requerido = vm.requerido === 'true' ? true : false;
    switch (vm.tipo) {
      case 'text':
      case 'caracter':
        scope.inputType = 'text';
        break;
      case 'numero':
      case 'dni':
        scope.inputType = 'number';
        break;
      case 'tiempo':
        scope.inputType = 'datetime-local';
        break;
      case 'email':
        scope.inputType = 'email';
        break;
      default:
        scope.inputType = 'text';
    }
    vm.$onInit = function() {
      vm.myform = scope.$parent[vm.mfForm];
      var unregisterWatch = scope.$watch('ctrl.valor', function(nv, ov) {
        if (nv && nv !== ov) {
          // we are replacing $sanitize service because it is not handling the Spanish characters
          vm.valor = DOMPurify.sanitize(nv, dompurifyConfig);
        }
      });
      scope.$on('$destroy', unregisterWatch);
    };

    vm.submitData = function(evt) {
      var keyCode = evt.charCode || evt.keyCode || evt.which || 0;
      if (keyCode === 13 && _.isEmpty(vm.myform[vm.id].$error) && 'callEnter' in vm) {
        vm.callEnter();
      } else {
        return;
      }
    };

    vm.showRequired = function srFn() {
      return vm.externalRequiredError || vm.myform[vm.id].$dirty;
    };

  } //  end inputControllerFn

  inputDirectiveFn.$inject = [];

  function inputDirectiveFn() {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {
        id: '@',
        valor: '=',
        tipo: '@',
        placeholder: '@',
        maxlong: '@?',
        minlong: '@?',
        requerido: '@?',
        patron: '@?',
        mfForm: '@',
        callEnter: '&?',
        externalRequiredError: '=?'
      },
      templateUrl: '/referencia/app/panel/component/mfinput.html',
      controller: 'InputController',
      controllerAs: 'ctrl'
    };
  } //  end inputDirectiveFn

  validacionFn.$inject = [];

  function validacionFn() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        tipo: '=',
        patron: '=?'
      },
      link: function(scope, element, attrs, ngModel) {

        if (scope.tipo === 'numero') {
          ngModel.$validators.stnumero = function(value) {
            var regexNum = /^-?\d+\.?\d*$/;
            return (value && regexNum.test(value));
          };
        } else if (scope.tipo === 'caracter') {
          ngModel.$validators.stcaracter = function(value) {
            var regexCar = /^[a-zA-Z\ \'ñÑáéíóúÁÉÍÓÚ\.\/]+$/gi;
            return (value && regexCar.test(value));
          };
        } else if (scope.tipo === 'alfanumerico') {
          ngModel.$validators.stcaracter = function(value) {
            var regexCar = /^[0-9a-zA-Z]+$/gi;
            return (value && regexCar.test(value));
          };
        } else if (scope.tipo === 'tiempo') {
          ngModel.$validators.sttiempo = function(value) {
            var regexTime = /^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])$/gi; // eslint-disable-line
            return (value && regexTime.test(value));
          };
        } else if (scope.tipo === 'email') {
          // http://emailregex.com/
          ngModel.$validators.stemail = function(value) {
            var regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i; // eslint-disable-line
            return (value && regexEmail.test(value));
          };
        } else if (scope.tipo === 'dni') {
          ngModel.$validators.stdni = function(value) {
            var regexDni = /^\d{8}$/;
            return (value && regexDni.test(value));
          };
        } else if (scope.tipo === 'telefono') {
          ngModel.$validators.stfono = function(value) {
            var regexFono = /^([\+][0-9]{1,3}([ \.\-])?)?([\(][0-9]{1,6}[\)])?([0-9 \.\-]{1,32})(([A-Za-z \:]{1,11})?[0-9]{1,4}?)$/;  // eslint-disable-line
            return (value && regexFono.test(value));
          };
        } else if (scope.tipo === 'regex') {
          ngModel.$validators.stregex = function(value) {
            var regexSt = new RegExp(scope.patron, 'gi');
            return (value && regexSt.test(value));
          };
        }
      }
    };

  } //  end validacionFn

  return ng.module('referenciaApp')
    .controller('InputController', inputControllerFn)
    .directive('mfinput', inputDirectiveFn)
    .directive('mfValidacion', validacionFn);
});
