define([
  'angular', 'lodash', 'constants', 'constantsVidaLey', 'mpfPersonConstants', 'mpfPersonDirective', 'mpfModalConfirmationSteps', 'mpfPersonComponent'
], function (angular, _, constants, constantsVidaLey, personConstants) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .controller('emisionContratanteVidaLeyController', EmisionContratanteVidaLeyController);

  EmisionContratanteVidaLeyController.$inject = ['$scope', '$state', '$timeout', 'mainServices', 'mModalAlert', 'mpSpin', '$uibModal', 'vidaLeyService', 'vidaLeyFactory'];

  function EmisionContratanteVidaLeyController($scope, $state, $timeout, mainServices, mModalAlert, mpSpin, $uibModal, vidaLeyService, vidaLeyFactory) {
    var vm = this;

    vm.formService = constantsVidaLey.VALIDATORS.CONTRATANTE;

    vm.companyCode = constants.module.polizas.accidentes.companyCode;
    vm.appCode = personConstants.aplications.VIDA_LEY;
    vm.formCode = personConstants.forms.EMI_VIDALEY_CN;
    $scope.personData = {};

    vm.desactivarControl = DesactivarControl;
    vm.validControlForm = ValidControlForm;
    vm.activeBotonSiguiente = ActiveBotonSiguiente;
    vm.showModalConfirmation = ShowModalConfirmation;
    vm.stepDisabled = StepDisabled;
    vm.getValidations = GetValidations;
    vm.checkRequired = CheckRequired;
    
    (function load_ResumenVidaLeyController() {
      _getCotizacion($state.params.quotation);
      $scope.$on('personForm', function (event, data) {
        if (data.contractor) {
          $scope.contractorValid = data.valid;
          $scope.personData = data.contractor;
          setFormData("dataContractor2", "contractorAddress", data.compContratante, data.legalPerson);
        }
      });
    })();

    function _getCotizacion(documentId) {
      vidaLeyService.getCotizacion(documentId)
        .then(function (response) {
          if(response.OperationCode === constants.operationCode.success) {
            vm.quoteData = response.Data;
           vidaLeyFactory.setStep1Emit(response.Data);
           $timeout(function () {
             $scope.personData = vidaLeyFactory.getPersonData(vm.quoteData);
          }, 500);
           
           
          }
        });
    }
    
    $scope.getDataContacto = function(data){
      $scope.personData = data;
    }

    function DesactivarControl() {
      return vm.contratante && vm.contratante.mTipoDocumento && vm.contratante.mTipoDocumento.Codigo == null
    }

    function ValidControlForm(form, controlName) {
      return vidaLeyFactory.validControlForm(form, controlName);
    }

    function ActiveBotonSiguiente() {
      return true;
    }

    function ShowModalConfirmation() {
        if (_validationForm()) {
          $scope.dataConfirmation = {
            save: false,
            title: '¿Estás seguro que quieres guardar los datos?',
            subTitle: 'Recuerda que una vez guardados los datos no podrás hacer cambios',
            lblClose: 'Seguir editando',
            lblSave: 'Guardar y continuar'
          };
          var vModalSteps = $uibModal.open({
            backdrop: true, 
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            template: '<mpf-modal-confirmation-steps data="dataConfirmation" close="close()"></mpf-modal-confirmation-steps>',
            controller: ['$scope', '$uibModalInstance', '$uibModal', function ($scope, $uibModalInstance, $uibModal) {
              $scope.close = function () {
                $uibModalInstance.close();
              };
            }]
          });
          vModalSteps.result.then(function () {
            var dataConfirmationWatch = $scope.$watch('dataConfirmation', function (value) {
              if (value.save) _grabarEmisionPaso1();
            });
            $scope.$on('$destroy', function () { dataConfirmationWatch(); });
          }, function () { });
        } else {
          mModalAlert.showWarning('Observación', 'Debe llenar todos los datos obligatorios.');
        }
    }

    function StepDisabled() {
      return vidaLeyFactory.getCompleteStepEmit(constantsVidaLey.STEPS.EMISION.CONTACTO)
    }

    function GetValidations(controlCode) {
      var findControl = _findControlObject(controlCode);
      return findControl ? findControl.Validations : {};
    }

    function CheckRequired(controlCode) {
      var controlObject = _findControlObject(controlCode)
      if (controlObject) {
        var findRequired = _.find(controlObject.Validations, function(item) { return item.Type === 'REQUIRED' });
        return findRequired ? true : false;
      }
      return false;
    }

    function _grabarEmisionPaso1() {
        if (_validationForm()) {
          vidaLeyFactory.setRiskCenter(vm.quoteData.Principal.CentroRiesgo);
          vidaLeyFactory.setParametrosContacto($scope.personData);
          vidaLeyFactory.setParamsStep1Emit($scope.personData);
          vidaLeyService.grabarEmision(constantsVidaLey.STEPS.EMISION.CONTACTO, vidaLeyFactory.paramsStep1Emit())
            .then(function (response) {
              _goStepTwo();
            })
            .catch(function (error) {
              mModalAlert.showError(error.Message, "¡Error!")
            });
        }
    }

    function _findControlObject(controlCode) {
      return !angular.isUndefined(vm.formService) && _.find(vm.formService.Controls, function (item) { return item.Code === controlCode });
    }

    function _validationForm() {
      $scope.frmContratante.personForm.markAsPristine();
      return $scope.frmContratante.personForm && $scope.frmContratante.personForm.$valid;
    }

    function _goStepTwo() {
      $state.go(constantsVidaLey.ROUTES.EMISION_STEPS.url, { step: constantsVidaLey.STEPS.EMISION.RESULTADOS });
    }

  }

});
