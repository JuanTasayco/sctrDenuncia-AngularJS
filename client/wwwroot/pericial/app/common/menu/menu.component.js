'use strict';

define(['angular', 'constants'], function(
  angular, constants) {

  MenuPericialController.$inject = [
    '$scope','$uibModal', 'pericialFactory', 'mModalAlert'
  ];

  function MenuPericialController(
    $scope,$uibModal, pericialFactory, mModalAlert
  ) {
      var vm = this;
      vm.$onInit = function() {
        vm.menuPericial = [
          {label: 'Supervisor', objMXKey: '', state: 'dashboardSupervisor', isSubMenu: false, actived: false, show: isSupervisor()},
          {label: 'General', objMXKey: '', state: 'dashboard', isSubMenu: false, actived: false, show: !isSupervisor()},
          {label: 'Servicios', objMXKey: '', state: 'bandejaServicios', isSubMenu: false, actived: false, show: true},
          {label: 'Reportes', objMXKey: '', state: 'reportes', isSubMenu: false, actived: false, show: true}
        ];

        if (vm.menuPericial.length < 7) {
          vm.showMoreFlag = false;
          vm.limiteMenus = 6;
        } else {
          vm.showMoreFlag = true;
          vm.limiteMenus = 5;
        }
        vm.showBtnBox = isTaller();
      };

      vm.fnShowModal = function(){

        pericialFactory.general.Resource_Parameter_Detail_Register_Type_List().then(function(response) {
          if (response.operationCode === constants.operationCode.success) {
            $scope.tipoRegistro = response.data;
            var vModalProof = $uibModal.open({
              backdrop: true, // background de fondo
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              size: 'md',
              templateUrl : '/pericial/app/common/menu/modalNuevoRegistro.html',
              controller : ['$scope', '$uibModalInstance', '$uibModal', '$timeout', '$state',
                function($scope, $uibModalInstance, $uibModal, $timeout, $state) {
                  var $ctrl = this;
                  /*#########################
                  # closeModal
                  #########################*/
                  $scope.closeModal = function () {
                    // $uibModalInstance.dismiss('cancel');
                    $uibModalInstance.close();
                  };
                  $scope.newRegistro = function () {
                    if($scope.value) {
                      $uibModalInstance.close();
                      // $state.go('nuevoRegistro', {reload: true, inherit: false});
                      $state.go('nuevoRegistro', {
                        idTipoRegistro: $scope.value
                      }, {reload: true, inherit: false});
                    }
                  };
                  $scope.setType = function (value) {
                    if(value) {
                      $scope.value = value;
                    }
                  };
                }]
            });
            vModalProof.result.then(function(){
              //Action after CloseButton Modal
              // console.log('closeButton');
            },function(){
              //Action after CancelButton Modal
              // console.log("CancelButton");
            });
          }
        })
          .catch(function(err){
            mModalAlert.showError(err.data.message, 'Error');
          });
      };

      function isTaller() {
        return (vm.rol === 'TALLER');
      }

      function isPerito() {
        return (vm.rol === 'PERITO');
      }

      function isSupervisor() {
        return (vm.rol === 'SUPERVISOR');
      }

      vm.isTaller = isTaller;
      vm.isPerito = isPerito;
      vm.isSupervisor = isSupervisor;

  } // end

  return angular.module('appPericial')
   .controller('MenuPericialController', MenuPericialController)
    .component('menuPericial', {
      templateUrl: '/pericial/app/common/menu/menu.html',
      controller: 'MenuPericialController',
      controllerAs: '$ctrl',
      bindings: {
        title: '=?',
        usuario: '=?',
        showBtn: '=?',
        rol: '=?'
      }
    })
  });
