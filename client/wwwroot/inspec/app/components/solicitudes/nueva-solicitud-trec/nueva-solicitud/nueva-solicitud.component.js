'use strict';

define(['angular', 'moment', 'lodash', 'mpfPersonConstants', 'mpfPersonComponent'], function (ng, moment, _) {
  solicitudNuevaController.$inject = [
    '$scope',
    '$state',
    '$window',
    'inspecFactory',
    'mModalConfirm',
    'mModalAlert',
    '$uibModal'
  ];
  function solicitudNuevaController(
    $scope,
    $state,
    $window,
    inspecFactory,
    mModalConfirm,
    mModalAlert,
    $uibModal
  ) {
    $window.document.title = 'OIM - Inspecciones Autos - Solicitud Nueva';
    var vm = this;
    vm.$onInit = onInit;
    vm.showNewInspection = showNewInspection;
    vm.returnNewSolicitudTrec = returnNewSolicitudTrec;
    vm.removeVehicule = removeVehicule;
    vm.createSolicitud = createSolicitud;
    vm.editarSolicutd = editarSolicutd;
    vm.disabled = true;
    vm.vehiculosLen = 0
    vm.new = true;
    function onInit() {
      vm.formSolcitud = {};
      vm.solicitudData = {};
      vm.solicitudId = $state.params.solicitudId
      if ((vm.solicitudId) != 0 && vm.solicitudId != null) {
        loadSolicitud(vm.solicitudId)
      } else {
        vm.solicitudData = {
          contratante_nombre: '',
          tomador_foto_nombre: '',
          tomador_foto_correo: '',
          tomador_foto_dni: '',
          tomador_foto_celular: '',
          vehiculos: []
        }
      }
    }
    function loadSolicitud(solicitudId) {
      inspecFactory.autoInspeccion
        .getAutoInspeccionSolicitud(solicitudId)
        .then(function (response) {
          if (response) {
            vm.solicitudData = {
              codigo: response.id_solicitud + '?' + response.codigo,
              contratante_nombre: response.contratante_nombre,
              tomador_foto_nombre: response.tomador_foto_nombre,
              tomador_foto_correo: response.tomador_foto_correo,
              tomador_foto_dni: response.tomador_foto_dni,
              tomador_foto_celular: response.tomador_foto_celular,
              vehiculos: response.vehiculos
            }
            vm.vehiculosLen = response.vehiculos.length
          }
        })
        .catch(function (error) {
          console.log('lo que tiene el error', error);
        });
    }
    function createSolicitud() {
      vm.formSolcitud.markAsPristine();
      if (vm.formSolcitud.$valid && vm.solicitudData.vehiculos.length > 0) {
        inspecFactory.autoInspeccion
          .postAutoInspeccionSolicitud(vm.solicitudData)
          .then(function (response) {
            if (response) {
              mModalAlert
                .showSuccess('Solicitud guardada exitosamente', 'Correcto')
                .then(function () {
                  $state.go('solicitudNuevaTrec', {});
                });
            }
          })
          .catch(function (error) {
            mModalAlert.showError(error.data.message, 'Error', null, 4000);
          });
      } else {
        var messageAlert = vm.solicitudData.vehiculos.length > 0 ? 'Ingrese la información. Es obligatorio' : 'Ingrese las maquinarias. Es obligatorio';
        mModalAlert.showWarning(messageAlert, 'Alerta', null, 3000);
      }
    }
    function editarSolicutd() {
      vm.formSolcitud.markAsPristine();
      if (vm.formSolcitud.$valid && vm.solicitudData.vehiculos.length > 0) {
        var solicitudId_ = vm.solicitudId
        var request = vm.solicitudData;
        request.id_solicitud= parseInt(solicitudId_);
        request.id_usuario_comercial= 0;
        request.estado= 1;
        
        inspecFactory.autoInspeccion
          .editAutoInspeccionSolicitud(request, solicitudId_)
          .then(function (response) {
            if (response) {
              mModalAlert
                .showSuccess('Solicitud editada exitosamente', 'Correcto')
                .then(function () {
                  $state.go('solicitudNuevaTrec', {});
                });
            }
          })
          .catch(function (error) {
            mModalAlert.showError(error.data.message, 'Error', null, 4000);
          });
      } else {
        var messageAlert = vm.solicitudData.vehiculos.length > 0 ? 'Ingrese la información. Es obligatorio' : 'Ingrese las maquinarias. Es obligatorio';
        mModalAlert.showWarning(messageAlert, 'Alerta', null, 3000);
      }
    }
    function showNewInspection(option) {
      var selectedID = angular.copy(option);
      var mainVM = vm;
      $uibModal
        .open({
          backdrop: 'static',
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          size: 'lg',
          controllerAs: '$ctrl',
          templateUrl: '/inspec/app/components/solicitudes/nueva-solicitud-trec/nueva-solicitud/modal-nueva-solicitud-trec.html',
          controller: [
            '$location',
            '$uibModalInstance',
            function ($location, $uibModalInstance) {
              var vm = this;
              vm.formVehicule = {};
              vm.vehiculeData = {};
              vm.new = true;
              vm.closeModal = closeModal;
              vm.addVehicle = addVehicle;
              vm.editValues = editValues;

              vm.vehiculeData = {
                tipo: '',
                marca: '',
                modelo: '',
                serie_motor: '',
                placa: '',
                anio_fabricacion: '',

              }
              if (selectedID != undefined) {
                vm.vehiculeData.tipo = mainVM.solicitudData.vehiculos[selectedID].tipo,
                  vm.vehiculeData.marca = mainVM.solicitudData.vehiculos[selectedID].marca,
                  vm.vehiculeData.modelo = mainVM.solicitudData.vehiculos[selectedID].modelo,
                  vm.vehiculeData.serie_motor = mainVM.solicitudData.vehiculos[selectedID].serie_motor,
                  vm.vehiculeData.placa = mainVM.solicitudData.vehiculos[selectedID].placa,
                  vm.vehiculeData.anio_fabricacion = mainVM.solicitudData.vehiculos[selectedID].anio_fabricacion,
                  vm.new = false;

              }
              function addVehicle() {
                vm.formVehicule.markAsPristine();
                if (vm.formVehicule.$valid) {
                  mainVM.solicitudData.vehiculos.push(vm.vehiculeData);
                  vm.vehiculeData = {
                    tipo: '',
                    marca: '',
                    modelo: '',
                    serie_motor: '',
                    placa: '',
                    anio_fabricacion: ''
                  }
                  mainVM.vehiculosLen = mainVM.solicitudData.vehiculos.length;
                } else {
                  mModalAlert.showWarning('Ingrese la información requerida. Es obligatorio', 'Alerta', null, 3000);
                }
              }
              function closeModal(data) {
                $uibModalInstance.close(data);
              }
              function editValues() {
                vm.formVehicule.markAsPristine();
                if (vm.formVehicule.$valid) {
                  mainVM.solicitudData.vehiculos[selectedID] = vm.vehiculeData;
                  closeModal();
                } else {
                  mModalAlert.showWarning('Ingrese la información requerida. Es obligatorio', 'Alerta', null, 3000);
                }
              }
            }
          ]
        })
        .result.then(function (newData) {
          if (newData) {
            updateContact(newData);
          }
        });
    }
    function removeVehicule(index) {
      mModalConfirm
        .confirmInfo('¿Está seguro que desea eliminar la maquinaria?', 'ELIMINAR MAQUINARIA', 'ACEPTAR')
        .then(function () {
          vm.solicitudData.vehiculos.splice(index, 1);
          vm.vehiculosLen = parseInt(vm.vehiculosLen) - 1;
        });
    }
    function returnNewSolicitudTrec() {
      $state.go('solicitudNuevaTrec', {});
    }
  }

  return ng
    .module('appInspec')
    .controller('SolicitudNuevaController', solicitudNuevaController)
    .directive('uploadFile', [
      '$window',
      function ($window) {
        return {
          restrict: 'A',
          link: function (scope, element) {
            element.bind('click', function () {
              $window.document.querySelector('.input__file').click();
            });
          }
        };
      }
    ]);
});
