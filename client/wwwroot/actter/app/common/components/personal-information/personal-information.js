define(['angular','lodash', 'constants', 'system', 'generalConstant', 'actterFactory'], function (angular, _, constants, system, generalConstant) {
  personalInformationController.$inject = ['$scope', 'proxyCliente', '$uibModal', 'mModalAlert', '$filter'];
  function personalInformationController($scope, proxyCliente, $uibModal, mModalAlert, $filter) {
    var vm = this;

    vm.toDay = new Date();
    vm.filterDate = $filter('date');
    vm.formatDate = constants.formats.dateFormat;

    vm.openModal = openModal;
    vm.updateContact = updateContact;
    vm.requiredFieldsForm = requiredFieldsForm;
    vm.disabledFieldsForm = disabledFieldsForm;
    vm.notRequiredFields = vm.notRequiredFields;
    vm.disabledFields = vm.disabledFields
    vm.fields = generalConstant.FIELDS_PERSONAL_INFORMATION;
    
    vm.$onInit = function () {
      vm.numeroDocumento = vm.form.documento.numero;
      if(vm.form.tipoPersona.codigo=='N') vm.isRuc = true;
    }

    function openModal() {
      vm.modalForm = {
        documento: vm.form.documento,
        numeroDocumento: vm.numeroDocumento,
        nombre: vm.form.nombre,
        apellidoPaterno: vm.form.apellidoPaterno,
        apellidoMaterno: vm.form.apellidoMaterno,
        fechaNacimiento: vm.form.fechaNacimiento,
        sexo: vm.form.sexo
      }
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: '/actter/app/common/components/modals/modal-actualizar-cliente.html',
        controller: ['$scope', '$uibModalInstance', function (scope, $uibModalInstance) {
          scope.close = function () {
            $uibModalInstance.close();
          };
          scope.send = function (value) {
            if(!scope.formModalClienteUpdate.$valid){
              scope.formModalClienteUpdate.markAsPristine();
              return;
            }
            vm.updateContact($uibModalInstance);
          }
        }]
      })
    }

    function updateContact (uibModalInstance) {
      var solicitud = _.assign({}, vm.modalForm);
      solicitud.documento.numero = vm.numeroDocumento;
      solicitud.fechaNacimiento = vm.filterDate(solicitud.fechaNacimiento, vm.formatDate);
      solicitud.apellidoPaterno = solicitud.apellidoPaterno.toUpperCase();
      solicitud.apellidoMaterno = solicitud.apellidoMaterno.toUpperCase();
      solicitud.nombre = solicitud.nombre.toUpperCase();
      var dataSend = {
        contratante: vm.form.documento.descripcion + " " + vm.numeroDocumento,
        datosActuales: {
          documento: {
            codigo: vm.form.documento.codigo,
            numero: vm.form.documento.numero
          },
          nombre: vm.form.nombre,
          apellidoPaterno: vm.form.apellidoPaterno,
          apellidoMaterno: vm.form.apellidoMaterno,
          fechaNacimiento: vm.filterDate(vm.form.fechaNacimiento, vm.formatDate),
          sexo: vm.form.sexo
        },
        solicitud: solicitud
      }

      proxyCliente.enviarEmail(dataSend, true).then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          mModalAlert
            .showSuccess('Solicitud enviada satisfactoriamente', 'SOLICITUD ENVIADA').then(function (res) {
              if (res) {
                uibModalInstance.close();
              }
            });
        }else if(response.OperationCode === constants.operationCode.code900){
          mModalAlert
            .showError(response.Data.mensaje, 'ERROR');
        } else {
          mModalAlert
            .showError('Ocurrió un error al actualizar los datos', 'ERROR');
        }
      }).catch(function (error) {
        mModalAlert
          .showError('Ocurrió un error al enviar la solicitud', 'ERROR');
      })
    }

    function requiredFieldsForm(control) {
      return _.find(vm.notRequiredFields, function (field) {
        return control == field;
      })
    }

    function disabledFieldsForm(control) {
      return _.find(vm.disabledFields, function (field) {
        return control == field;
      })
    }
    
    $scope.showModalActivities = function () {
      var vModal = $uibModal.open({
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        template: '<search-Activity hiden-period="true" on-activity="selectActivity($event)" on-close="closeModal()" type-periodo="typePeriodo"></search-Activity>',
        controller: ['$scope', '$uibModalInstance', '$uibModal',
          function ($scope, $uibModalInstance) {
            $scope.selectActivity = function (event) {
              $uibModalInstance.close(event);
            }
            $scope.closeModal = function () {
              $uibModalInstance.close({});
            };
          }]
      });
      vModal.result.then(function (response) {
        if (response.selectedItem) {
          vm.form.actividadEconomica = {
            codigo : response.selectedItem.Codigo,
            descripcion: response.selectedItem.Descripcion
          }
        }
      });
    };

  }

  return angular
    .module(generalConstant.APP_MODULE)
    .controller('personalInformationController', personalInformationController)
    .component('personalInformation', {
      templateUrl: system.apps.actter.location + '/app/common/components/personal-information/personal-information.html',
      controller: 'personalInformationController as vm',
      bindings: {
        form: '=',
        paramsForm: '=',
        countries: '=',
        notRequiredFields: "=",
        disabledFields:"="
      }
    });
});