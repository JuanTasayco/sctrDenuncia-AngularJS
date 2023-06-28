define(['angular', 'system', 'generalConstant', 'actterFactory'], function (angular, system, generalConstant) {
    companyContactController.$inject = ['$scope', 'actterFactory'];
    function companyContactController($scope, actterFactory) {
      var vm = this;
      vm.fields = generalConstant.FIELDS_COMPANY_CONTACT;
      vm.disabledFields = vm.disabledFields;
      vm.disabledFieldsForm = disabledFieldsForm;

      this.$onInit = function () {
      }

      function disabledFieldsForm(control) {
        return _.find(vm.disabledFields, function (field) {
          return control == field;
        })
      }
    }
  
    return angular
      .module(generalConstant.APP_MODULE)
      .controller('companyContactController', companyContactController)
      .component('companyContact', {
        templateUrl: system.apps.actter.location + '/app/common/components/company-contact/company-contact.html',
        controller: 'companyContactController as vm',
        bindings: {
          form: '=',
          paramsForm: '=',
          disabledFields : '='
        }
      });
  });