(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper', '$timeout','$uibModal', 'mModalAlert', 'mModalConfirm', ], 
  function(angular, constants, helper, $timeout, $uibModal, mModalAlert, mModalConfirm){

    var appCallerDashboard = angular.module('appCallerDashboard');

    appCallerDashboard.controller('callerDashboardLlamarController', 
      ['$scope', '$window', '$state', '$timeout','$uibModal', 'mModalAlert', 'mModalConfirm', 
      function($scope, $window, $state, $timeout, $uibModal, mModalAlert, mModalConfirm){
        
        $scope.showAtender = function(click){
          mModalConfirm.confirmInfo('','¿DESEAS ATENDER ESTA SOLICITUD?','ATENDER').then(function(response){   
          }); 
        }

        $scope.ordenarPorData = [
          { Descripcion: 'Mayor tiempo de espera', Codigo: '0'},
          { Descripcion: 'Menor tiempo de espera', Codigo: '1'},
          { Descripcion: 'Prioridad', Codigo: '2'}
        ];

        $scope.dashboard = [
          { numero: '1234', tipo:'Ambulancia', fechaHora:'27/05/2017 12:00:00', duracion: '00:35:00', nomUsuario: 'Mario Gonzalo Sanchez Gomez', cel: '993487900', nroDocumento: '41185200', lat: '40.712784', lon: '74.005941'}, 
          { numero: '1234', tipo:'Ambulancia', fechaHora:'27/05/2017 12:00:00', duracion: '00:35:00', nomUsuario: 'Mario Gonzalo Sanchez Gomez', cel: '993487900', nroDocumento: '41185200', lat: '40.712784', lon: '74.005941'}, 
          { numero: '1234', tipo:'Ambulancia', fechaHora:'27/05/2017 12:00:00', duracion: '00:35:00', nomUsuario: 'Mario Gonzalo Sanchez Gomez', cel: '993487900', nroDocumento: '41185200', lat: '40.712784', lon: '74.005941'}, 
          { numero: '1234', tipo:'Ambulancia', fechaHora:'27/05/2017 12:00:00', duracion: '00:35:00', nomUsuario: 'Mario Gonzalo Sanchez Gomez', cel: '993487900', nroDocumento: '41185200', lat: '40.712784', lon: '74.005941'}, 
          { numero: '1234', tipo:'Ambulancia', fechaHora:'27/05/2017 12:00:00', duracion: '00:35:00', nomUsuario: 'Mario Gonzalo Sanchez Gomez', cel: '993487900', nroDocumento: '41185200', lat: '40.712784', lon: '74.005941'}, 
          { numero: '1234', tipo:'Ambulancia', fechaHora:'27/05/2017 12:00:00', duracion: '00:35:00', nomUsuario: 'Mario Gonzalo Sanchez Gomez', cel: '993487900', nroDocumento: '41185200', lat: '40.712784', lon: '74.005941'}, 
        ];

        (function onLoad(){
          $scope.mainStep = $scope.mainStep || {};

        })();

    }]);
    // }]).factory('loadercallerDashboardHomeController', ['callerDashboardFactory', '$q', function(callerDashboardFactory, $q){
    //   var claims;

    //   //Claims
    //   function getClaims(){
    //    var deferred = $q.defer();
    //     hogarFactory.getClaims().then(function(response){
    //       claims = response;
    //       deferred.resolve(claims);
    //     }, function (error){
    //       deferred.reject(error.statusText);
    //     });
    //     return deferred.promise; 
    //   }

    //   return {
    //     getClaims: function(){
    //       if(claims) return $q.resolve(claims);
    //       return getClaims();
    //     }
    //   }

    // }])

  });
