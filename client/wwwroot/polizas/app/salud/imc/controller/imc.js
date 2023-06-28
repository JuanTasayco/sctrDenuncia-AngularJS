'use strict';

define(['angular', 'constants', 'helper', 'saludFactory'], function(
  angular, constants, helper, saludFactory) {

    mantenedorImcController.$inject = [
    '$scope', '$window', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'mModalConfirm', 'saludFactory'
  ];

  function mantenedorImcController($scope, $window, $state, $timeout, mainServices, $uibModal, mModalAlert, mModalConfirm, saludFactory) {
     
    $scope.Data = []
  
    $scope.imcTemplate = '/polizas/app/salud/imc/templates/imc.html';
    $scope.ListarImc = ListarImc;
    $scope.EliminaImc = EliminaImc;

    (function onLoad(){
      $scope.ListarImc(true);
    })();

    function ListarImc(showpin){
      saludFactory.ListarImc(showpin).then(function(response) {
        if (response.Data) {
          $scope.Data = response.Data
        }else {
          mModalAlert.showError(response.Message, 'Error');
        }
      }).catch(function(err){
        mModalAlert.showError(err.data.message, 'Error');
      });
    }

    function EliminaImc(model){
      saludFactory.EliminaImc(model.CodigoImc).then(function(response) {
        $scope.ListarImc(false);
      }).catch(function(err){
        mModalAlert.showError(err.data.message, 'Error');
      });
    }

    $scope.openModalAnadir = function(model) {
      if(model){
        $scope.modelpregunta = model;
      }else{
        $scope.modelpregunta = '';
      }
      var vModalProof = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        templateUrl : '/polizas/app/salud/popup/controller/popupAnadirImc.html',
        controller : ['$scope', '$uibModalInstance', '$filter',
          function($scope, $uibModalInstance, $filter) {
            /*## closeModal ##*/
            $scope.codigo = $scope.modelpregunta.CodigoImc;
            $scope.imcdesde = $scope.modelpregunta.ImcDesde;
            $scope.imchasta = $scope.modelpregunta.ImcHasta;
            $scope.edaddesde = $scope.modelpregunta.EdadDesde;
            $scope.edadhasta = $scope.modelpregunta.EdadHasta;
            $scope.sobretasa = $scope.modelpregunta.Sobretasa;
            $scope.resultado = $scope.modelpregunta.Resultado;

            $scope.closeModal = function () {
              $uibModalInstance.close();
            };

            $scope.guardarCuestionarioModal = function () {
              if ($scope.modelpregunta.CodigoImc){
                console.log({
                  "CodigoImc": $scope.codigo,
                  "ImcDesde": $scope.imcdesde,
                  "ImcHasta": $scope.imchasta,
                  "Resultado": $scope.resultado,
                  "Sobretasa": $scope.sobretasa,
                  "CodigoEstado": "A",
                  "EdadDesde": $scope.edaddesde,
                  "EdadHasta": $scope.edadhasta
                })
                saludFactory.ActualizaImc({
                  "CodigoImc": $scope.codigo,
                  "ImcDesde": $scope.imcdesde,
                  "ImcHasta": $scope.imchasta,
                  "Resultado": $scope.resultado,
                  "Sobretasa": $scope.sobretasa,
                  "CodigoEstado": "A",
                  "EdadDesde": $scope.edaddesde,
                  "EdadHasta": $scope.edadhasta
                }).then(function(response){
                  if(response.OperationCode !== 200) {
                    mModalAlert.showWarning(response.Message, '');
                  }else{
                    $scope.ListarImc(false);
                    $uibModalInstance.close();
                  }
                })
                .catch(function(error){
                  mModalAlert.showWarning('Error', '');
                });
              }else {
                console.log($scope.modelpregunta)
                saludFactory.GrabarImc({
                  "CodigoImc": $scope.codigo,
                  "ImcDesde": $scope.imcdesde,
                  "ImcHasta": $scope.imchasta,
                  "Resultado": $scope.resultado,
                  "Sobretasa": $scope.sobretasa,
                  "CodigoEstado": "A",
                  "EdadDesde": $scope.edaddesde,
                  "EdadHasta": $scope.edadhasta
                }).then(function(response){
                  if(response.OperationCode !== 200) {
                    mModalAlert.showWarning(response.Message, '');
                  }else{
                    $scope.ListarImc(false);
                    $uibModalInstance.close();
                  }
                })
                .catch(function(error){
                  mModalAlert.showWarning('Error', '');
                });
              }
              
            };
          }
        ]
      });
      vModalProof.result.then(function(){
      },function(){
      });
    }

  }
  return angular.module('appSalud')
    .controller('mantenedorImcController', mantenedorImcController)
});
