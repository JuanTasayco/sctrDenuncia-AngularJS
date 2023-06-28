'use strict';

define(['angular', 'constants', 'helper', 'saludFactory'], function(
  angular, constants, helper, saludFactory) {

    mantenedorPreguntasController.$inject = [
    '$scope', '$window', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'mModalConfirm', 'saludFactory'
  ];

  function mantenedorPreguntasController($scope, $window, $state, $timeout, mainServices, $uibModal, mModalAlert, mModalConfirm, saludFactory) {
 
    $scope.EstadoData =  [];
    $scope.firstStep = {};
    $scope.treeOptions = {
      dropped: function(e) {
        var request  = e.source.nodesScope.$modelValue;
        $scope.requestPreguntas = request.sort(function(a,b){return a.$$hashKey - b.$$hashKey})
        $timeout(function(){
          var indexPreguntas = 1;
          for ( var x in $scope.requestPreguntas) {
            $scope.requestPreguntas[x].Posicion = indexPreguntas;
            indexPreguntas = indexPreguntas + 1;
          }
          saludFactory.CreacionPregunta('ORDENAR',$scope.requestPreguntas)
          .then(function(response){
            if(response.OperationCode !== 200) {
              mModalAlert.showWarning(response.Message, '');
            }
          })
          .catch(function(error){
            mModalAlert.showWarning('Error', '');
          });
        }, 400)
        
       
      },
      beforeDrop : function (e) {
        return mModalConfirm.confirmWarning('¿Está seguro de mover el objeto ?', '')
      }
    }
    $scope.DataPreguntas = []
    $scope.preguntaTemplate = '/polizas/app/salud/preguntas/templates/pregunta.html';
    $scope.changeStatusMenu = ChangeStatusMenu;
    
    $scope.loadEstados = loadEstados;
    $scope.changetab = changetab;
    $scope.tab1 = true;
    $scope.tab2 = false;
    $scope.ListarPreguntasbyEstado = ListarPreguntasbyEstado;

    (function onLoad(){
      $scope.ListarPreguntasbyEstado("A");
    })();

    function loadEstados(){
      saludFactory.PolizaDpsCuestionarioPreguntasEstado().then(function(response) {
        if (response.Data) {
          $scope.EstadoData = response.Data;
          $scope.firstStep.mHabilitar = $scope.EstadoData[0];
          $scope.EstadoData.push({Codigo: "", Descripcion: "TODOS"});
          $scope.DataPreguntas = $scope.DataPreguntas2;
        }else {
          mModalAlert.showError(response.Message, 'Error');
        }
      }).catch(function(err){
        mModalAlert.showError(err.data.message, 'Error');
      });
    }
    function changetab(tab){
      if (tab == 1){
        $scope.tab1 = true
        $scope.tab2 = false
        $scope.ListarPreguntasbyEstado("A"); 
      }else{
        $scope.tab1 = false
        $scope.tab2 = true
        $scope.loadEstados();
        $scope.ListarPreguntasbyEstado(""); 

      }
  }

    function ListarPreguntasbyEstado(estado){
      saludFactory.ListarDpsCuestionarioPreguntas(estado).then(function(response) {
        if (response.Data) {
          $scope.DataPreguntas = response.Data
        }else {
          mModalAlert.showError(response.Message, 'Error');
        }
      }).catch(function(err){
        mModalAlert.showError(err.data.message, 'Error');
      });
    }
    

    function ChangeStatusMenu(menu){
      var nodeStatus = menu.$nodeScope.$modelValue;   
      saludFactory.CreacionPregunta('ESTADO', [{ "CodigoPregunta": nodeStatus.CodigoPregunta, "Estado": nodeStatus.Estado}])
      .then(function(response){
          if(response.OperationCode !== 200) {
            mModalAlert.showWarning(response.Message, '');
          }
      })
      .catch(function(error){
        mModalAlert.showWarning('Error', '');
      });
    }

    $scope.filtrar = function(){
        $scope.ListarPreguntasbyEstado($scope.firstStep.mHabilitar.Codigo);  
    }
    $scope.moveLastToTheBeginning = function () {
      var a = $scope.DataPreguntas.pop();
      $scope.DataPreguntas.splice(0, 0, a);
    };
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
        templateUrl : '/polizas/app/salud/popup/controller/popupAnadirPregunta.html',
        controller : ['$scope', '$uibModalInstance', '$filter',
          function($scope, $uibModalInstance, $filter) {
            /*## closeModal ##*/
            $scope.filterDate = $filter('date');
            $scope.pregunta = $scope.modelpregunta.Pregunta;
            $scope.titulo = $scope.modelpregunta.Titulo;
            $scope.fechaVigencia = new Date();
            $scope.altInputFormats = ['M!/d!/yyyy'];
            $scope.closeModal = function () {
              $uibModalInstance.close();
            };
            $scope.popupFecha = {
              opened: false
            };
            $scope.openFecha = function() {
              $scope.popupFecha.opened = true;
            };
            $scope.dateOptions = {
              formatYear: 'yy',
              startingDay: 1
            };

            $scope.guardarCuestionarioModal = function () {
              saludFactory.CreacionPregunta('NUEVO', [{  "titulo" : $scope.titulo , "pregunta": $scope.pregunta, "fechaEfecto" :  $scope.filterDate($scope.fechaVigencia, 'dd/MM/yyyy')}])
              .then(function(response){
                if(response.OperationCode !== 200) {
                  mModalAlert.showWarning(response.Message, '');
                }else{
                  $scope.filtrar();
                  $uibModalInstance.close();
                }
              })
              .catch(function(error){
                mModalAlert.showWarning('Error', '');
              });
            };
          }
        ]
      });
      vModalProof.result.then(function(){
        //$scope.cleanModal();
        //Action after CloseButton Modal
      },function(){
        //Action after CancelButton Modal
      });
    }
    $scope.longShortText = function(id){
      var preguntaDom = document.getElementById(id)
      if(preguntaDom.classList.contains('text-span-eclipse')){
        preguntaDom.classList.remove('text-span-eclipse');
      }else{
        preguntaDom.classList.add('text-span-eclipse');
      }

    }

  }
  return angular.module('appSalud')
    .controller('mantenedorPreguntasController', mantenedorPreguntasController)
});
