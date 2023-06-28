(function ($root, name, deps, action) {
  $root.define(name, deps, action)
})(window, 'formSetting', ['angular'], function (angular) {
  angular.module('kpissalud.app').
    controller('formSettingController', ['$scope', '$state', function ($scope, $state) {
      var vm = this;
      vm.$onInit = onInit;

      function applyUpdateConfig(option) {
        vm.updateConfigApply({ $option: option });
      }

      function validEqual(option, v1,vc1,v2,vc2) {
        var act = false;
        if (option == 1) {
          var vF1 = v1 == vc1 || v1 > 12 || v1 == null || v1 == '';
          return vF1;
        }
        if (option == 2 || option == 3 || option == 4 || option == 6) {          
          if (v1 == vc1 && v2 == vc2)
            return true;
          if (v1 == '' || v1 == null)
            return true;
          if (v2 == '' || v2 == null)
            return true;
        }
        if (option == 5) {
          var vF1 = v1 == vc1 || v1 == null || v1 == '';
          return vF1;
        }
        return act;
      }

      function onInit() {
        vm.applyUpdateConfig = applyUpdateConfig;
        vm.validEqual = validEqual;
      }
    }]).
    component('formSetting', {
      templateUrl: '/kpissalud/app/components/setting/form-setting.html',
      controller: 'formSettingController',
      bindings: {
        config: '=?',
        configCopy: '=?',
        updateConfigApply: '&?'
      }
    })
});