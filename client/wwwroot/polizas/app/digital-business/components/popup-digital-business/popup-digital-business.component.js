define([
  'angular'
], function (angular) {
  'use strict';

  angular
    .module('appAutos')
    .component('mpfPopupDigitalBusiness', PopupDigitalBusinessComponent());

  function PopupDigitalBusinessComponent() {
    var component = {
      templateUrl: '/polizas/app/digital-business/components/popup-digital-business/popup-digital-business.template.html',
      controller: PopupDigitalBusinessComponentController,
      controllerAs: 'vm',
      bindings: {
        item: '=',
        success: '&',
        close: '&',
        dismiss: '&',
      }
    };

    return component;
  }

  PopupDigitalBusinessComponentController.$inject = ['$interval', '$scope', 'mModalAlert', 'digitalBusinessService'];
  function PopupDigitalBusinessComponentController($interval, $scope, mModalAlert, digitalBusinessService) {
    var vm = this;
    var timer;

    // Propiedades
    vm.dataSourceCompania = [];
    vm.dataSourceRamo = [];
    vm.isNew = true;

    // Funciones
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.saveDigitalBusiness = SaveDigitalBusiness;

    function onInit() {
      vm.isNew = !vm.item;
      if (vm.item) {
        vm.item.Template = _transformHtml(vm.item.Plantilla);
      }
    }

    function onDestroy() {
      $interval.cancel(timer);
    }

    function SaveDigitalBusiness() {
      if (_validationForm()) {
        vm.item.Nombre = (vm.item.Nombre).toUpperCase();
        vm.item.Descripcion = (vm.item.Descripcion).toUpperCase();
        digitalBusinessService[vm.isNew ? "insertDigitalBusiness" : "updateDigitalBusiness"](vm.item).then(_saveDigitalBusinessResponse, _saveDigitalBusinessError)
      }
    }

    // Funciones privadas
    function _saveDigitalBusinessResponse(response) {
      if (response.OperationCode === 200) {
        vm.success();
        mModalAlert.showSuccess("La acción solicitada se ha realizado correctamente", "Información actualizada");
      } else {
        _saveDigitalBusinessError(response);
      }
    }

    function _saveDigitalBusinessError(error) {
      mModalAlert.showError(error && error.data && error.data.Message || "Ha ocurrido un error al intentar grabar los datos", "Mantenimiento de Plantilla");
    }

    function _validationForm() {
      $scope.frmRegistro.markAsPristine();
      return $scope.frmRegistro.$valid;
    }

    function _transformHtml(str) {
      var entityMap = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        '&quot;': '"',
        '&#39;': "'",
        '&#x2F;': "/"
      };

      return String(str).replace(/(&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;)/g, function (s) {
        return entityMap[s];
      });
    }
  }
});
