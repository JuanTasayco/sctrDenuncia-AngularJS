define([
  'angular',
  'lodash'
], function(ng, _) {

  AutoReemplazoProveedorController.$inject = ['gcwFactory', 'mModalAlert', '$rootScope', '$uibModal', 'mModalConfirm'];

  function AutoReemplazoProveedorController(gcwFactory, mModalAlert, $rootScope, $uibModal, mModalConfirm) {
    var vm = this;
    vm.$onInit = onInit;
    vm.searchProviders = searchProviders;
    vm.cleanProviders = cleanProviders;
    vm.showModal = showModal;


    function onInit() {
      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');
      cleanProviders();
      vm.cabecera = $rootScope.cabecera;
      vm.dataTicket = gcwFactory.getVariableSession('dataTicket');
    }

    function searchProviders() {
      var params = {};
      params = getParams();

      gcwFactory.getProvider(params, true)
        .then(function(response) {
          vm.providers = response.data;
          vm.noResult = false;
        });
    }

    function cleanProviders(refresh) {
      vm.formProveedor = {};
      if (refresh) { vm.providers = []; }
      // if (refresh) { searchProviders(); }
    }

    function getParams() {
      vm.currentPage = 1;
      return {
        ProviderDocumentNumber: vm.formProveedor.mInformacionProveedor,
        ProviderName: vm.formProveedor.mRazonSocial ? vm.formProveedor.mRazonSocial.toUpperCase() : null,
        StateCode: vm.formProveedor.mEstado ? vm.formProveedor.mEstado.value : null,
        CompanyId: 1
      };
    }

    function showModal(entry) {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: '/gcw/app/components/siniestros/auto-reemplazo/modal-proveedor.html',
        controllerAs: '$ctrl',
        controller: ['$timeout', '$uibModalInstance', function($timeout, $uibModalInstance) {
          var vm = this;
          vm.$onInit = init;
          vm.closeModal = closeModal;
          vm.searchByRuc = searchByRuc;

          function init() {
            vm.disabled = true;
            vm.isEdit = !!entry;
            vm.frmProveedor = {};
            if (vm.isEdit) {
              $timeout(function() {
                vm.disabled = false;
                vm.frmProveedor.mEmail = entry.provideremail;
                vm.frmProveedor.mEstado = {
                  value: entry.providerstatuscode
                };
                vm.frmProveedor.mPrecio = entry.priceday;
                vm.frmProveedor.mRazonSocial = entry.providername;
                vm.frmProveedor.mRuc = entry.providerdocumentnumber;
                vm.frmProveedor.mTelefono1 = entry.phonE1;
                vm.frmProveedor.mTelefono2 = entry.phonE2;
              });
            }
          }

          function searchByRuc() {
            vm.disabled = true;
            if (vm.frmProveedor.mRuc.length === 11) {
              gcwFactory.getProviderId(vm.frmProveedor.mRuc, true)
              .then(function(response) {
                if (response && response.operationCode === 200) {
                  vm.frmProveedor.mEmail = response.data.email;
                  vm.frmProveedor.mEstado = {
                    value: response.data.estadO_PROV
                  };
                  vm.frmProveedor.mPrecio = response.data.precio;
                  vm.frmProveedor.mRazonSocial = response.data.nombre;
                  vm.frmProveedor.mTelefono1 = response.data.teL1;
                  vm.frmProveedor.mTelefono2 = response.data.teL2;
                  vm.disabled = false;
                }
              })
            }
          }

          function closeModal(flag) {
            if (flag) {
              vm.frmProveedor.markAsPristine();
              if (vm.frmProveedor.$valid) {
                $uibModalInstance.close(vm.frmProveedor);
              }
            } else {
              $uibModalInstance.close();
            }
          }
        }]
      }).result.then(function(form) {
        if (form) {
          var params = {
            dayPrice: form.mPrecio,
            stateCode: form.mEstado.value,
            providerEmail: form.mEmail.toUpperCase(),
            providerName: form.mRazonSocial.toUpperCase(),
            providerDocumentNumber: form.mRuc,
            phone1: form.mTelefono1,
            phone2: form.mTelefono2,
            CompanyId: 1
          };
          if (entry) {
            params.providerId = entry.providerid;
            gcwFactory.updateProvider(params, true)
              .then(function(response) {
                mModalAlert.showSuccess('Se ha actualizado correctamente el proveedor','','').then(function(response) {
                  if (response) {
                    searchProviders();
                  }
                });

              })
              .catch(function() {
                mModalAlert.showError('Hubo un error al actualizar el proveedor', '', '', '', '', 'g-myd-modal');
              });
          } else {
            gcwFactory.addProvider(params, true)
              .then(function(response) {
                mModalAlert.showSuccess('Se ha registrado correctamente el proveedor', '', '', '', '', 'g-myd-modal').then(function(response) {
                  if (response) {
                    searchProviders();
                  }
                });
              })
              .catch(function() {
                mModalAlert.showError('Hubo un erro al registrar el proveedor', '', '', '', '', 'g-myd-modal');
              });
          }
        }
      });
    }

  } // end controller

  return ng.module('appGcw')
    .controller('AutoReemplazoProveedorController', AutoReemplazoProveedorController)
    .component('gcwAutoReemplazoProveedor', {
      templateUrl: '/gcw/app/components/siniestros/auto-reemplazo/auto-reemplazo-proveedor.html',
      controller: 'AutoReemplazoProveedorController',
      bindings: {
      }
    });
});
