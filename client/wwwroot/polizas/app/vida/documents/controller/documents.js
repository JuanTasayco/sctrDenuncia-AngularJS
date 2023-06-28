(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/scripts/mpf-main-controls/components/modalSendEmailPoliza/component/modalSendEmailPoliza.js', //MSAAVEDRA 20210805
  '/polizas/app/vida/proxy/vidaFactory.js'], 
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('vidaDocumentsController', 
      ['$scope', '$window', '$state', '$timeout', '$filter', 'oimPrincipal','$uibModal',  
      function($scope, $window, $state, $timeout, $filter, oimPrincipal,$uibModal){
    
        (function onLoad(){
          $scope.main = $scope.main || {};
          
          $scope.main.isAdmin = oimPrincipal.isAdmin();
          $scope.main.agent = oimPrincipal.getAgent();
          
          $scope.main.filterDate = $filter('date');

          $scope.vidaDocuments = {
            pendingQuotes:{
              code: 1,
              name: 'pendingQuotes',
              title: 'Cotizaciones Pendientes'
            },
            emittedQuotes:{
              code: 2,
              name: 'emittedQuotes',
              title: 'Cotizaciones Emitidas'
            },
            referred:{
              code: 3,
              name: 'referred',
              title: 'Referidos'
            }
          };

        })();
        
        $scope.$on('$stateChangeSuccess', function (s, state, param, d) {
          var page = _.find($scope.vidaDocuments, function(item){
            return item.name == param.doc;
          });
          $scope.currentDoc = page;
        });

	     //MSAAVEDRA 20210804
          $scope.enviarPolizaMail = function (item, codCia) {
			console.log('traza', '1');
            console.log('codCia', codCia);
            console.log('vida', item);
            $scope.emailData = {
              CodigoCia: codCia,
              NumeroPoliza: item.NumeroPoliza,
              Aplicacion: 0,//item.Aplicacion,
              Suplemento: 0,//item.Suplemento,
              SuplementoAplicacion: 0,//item.SuplementoAplicacion
            }
			console.log('traza', '2');
            console.log('$scope.emailData', $scope.emailData);
			console.log('traza', '3');
            //Modal
            //console.log('envioPoliza', constants.modalSendEmail.envioPoliza);
            $scope.optionSendEmail = constants.modalSendEmail.envioPoliza;
            var vModalSendEmail = $uibModal.open({
              backdrop: true, // background de fondo
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              // size: 'lg',
              template: '<mpf-modal-send-email-poliza action="optionSendEmail" data="emailData" close="close()"></mpf-modal-send-email-poliza>',
              controller: ['$scope', '$uibModalInstance', '$uibModal', function ($scope, $uibModalInstance, $uibModal) {
                //CloseModal
                $scope.close = function () {
                  $uibModalInstance.close();
                };
              }]
            });

          };
          //FIN MSAAVEDA
		  
    }]).factory('loaderVidaDocumentsController', ['vidaFactory', '$q', function(vidaFactory, $q){
        var products;
      //Products
      function getProducts(showSpin){
        var deferred = $q.defer();
        vidaFactory.getProducts(showSpin).then(function(response){
          products = response.Data;
          deferred.resolve(products);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      return {
        getProducts: function(showSpin){
          if(products) return $q.resolve(products);
          return getProducts(showSpin);
        }
      };

    }]);

  });