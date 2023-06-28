(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/restos/app/mainControls/services/states-service.js',
  '/restos/app/mainControls/services/allowedActions-service.js',
  '/restos/app/mainControls/services/parameters-service.js',
  '/restos/app/requestTray/services/requestTray-service.js',
  '/restos/app/requestTray/services/payTaxes-service.js'],
  function(angular, constants, helper) {

    var appRestos = angular.module('appRestos');

    appRestos.controller('requestTrayController',
      ['$scope', '$window', '$state', '$log',
        'mainServices', '$uibModal', 'mModalAlert', 'allowedStates',
        'requestTrayService', 'statesService', 'parametersService',
        'allowedActions', 'payTaxesService', '$anchorScroll',
      function($scope, $window, $state, $log, mainServices, $uibModal, mModalAlert, allowedStates,
               requestTrayService, statesService, parametersService,
               allowedActions, payTaxesService, $anchorScroll) {


        $scope.filters = {};

        $scope.itemsList = null;
        $scope.itemsPerPage = 10;
        $scope.currentPage = $state.params.pag || 1;
        $scope.allowedStates = allowedStates;

        function getList(filters) {
			console.log('filters 1208');
          filters = filters || {};
          requestTrayService.getList(filters, $scope.currentPage, $scope.itemsPerPage).then(function(res) {
            if(res.COD === 200) {
              try {
                $scope.itemsList = res.Resultado.LISTA.map(function (item) {
                  item.state = statesService.getStateDetails(item.ESTDO_SLCTD_Desc);
                  return item;
                });
                $scope.totalItems = res.Resultado.TOTAL;
              } catch (err) {
                if (res.COD === 400) {
                  $scope.itemsList = [];
                  $scope.totalItems = 0;
                  $log.info(res.MSJ);
                }
              }
            } else {
              $scope.itemsList = [];
              $scope.totalItems = 0;
              mModalAlert.showError(res.MSJ, '');
            }
          });
        }

        getList({});

        $scope.reset = function() {
          getList({});
        }

        $scope.dateFormat = 'dd/MM/yyyy';
        $scope.rFEC_DESDE_options = {
          minDate: null
        };
        $scope.rFEC_HASTA_options = {
          minDate: null
        };
        $scope.$watch('filters.FEC_DESDE', function(date) {
          if (!$scope.filters.FEC_DESDE) {
            return;
          }
          if ($scope.filters.FEC_DESDE > $scope.filters.FEC_HASTA) {
            $scope.filters.FEC_HASTA = null;
          } else {
            $scope.rFEC_HASTA_options.minDate = date;
          }
        });

        $scope.$watch('filters.FEC_HASTA', function(date) {
          if ($scope.filters.FEC_HASTA && $scope.filters.FEC_DESDE > $scope.filters.FEC_HASTA) {
            $scope.filters.FEC_DESDE = null;
          } else {
            $scope.rFEC_DESDE_options.maxDate = date;
          }
        });

        $scope.applyFilters = function(filters) {
          $state.go('requestTray', {pag: null}, {notify: false});
          $anchorScroll();
          $scope.currentPage = 1;
          getList(filters);
        };

        $scope.pageChanged = function(newPage, filters) {
          $state.go('requestTray', {pag: newPage}, {notify: false});
          $anchorScroll();
          getList(filters);
        };

        $scope.onlyNumbers = function(el) {
          if (!/\d+$/.test(el.$modelValue)) {
            el.$modelValue = null;
          }
        };

        $scope.canDo = function() {
          return [].slice.call(arguments).some(function(arg) {
            return allowedActions.indexOf(arg) > -1;
          });
        };

        $scope.exportList = function() {
          if ($scope.itemsList.length) {
            requestTrayService.exportList($scope.filters);
          } else {
            mModalAlert.showError('No hay resultados para exportar.', '');
          }
        };

        $scope.showModalPayTaxes = function() {
          var modal = $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'md',
            templateUrl : 'app/requestTray/components/modalPayTaxes.html',
            controller : ['$scope', '$uibModalInstance', '$uibModal',
              function($scope, $uibModalInstance, $uibModal) {
              $scope.fileToUpload = {
                file: null
              };
              $scope.closeModal = function () {
                $uibModalInstance.close();
              };
              $scope.payTaxes = function(){
                $scope.closeModal();
                payTaxes($scope.fileToUpload.file);
              };
            }]
          });
        };
        function payTaxes(file) {
          file.extension = file.filename.split('.').pop();
          payTaxesService.uploadPaymentFile(file).then(function(res) {
            if (res.Resultado && res.Resultado.length) {
              var message =  res.Resultado.reduce(function(message, item) {
                return message + '<p><b>' + item.ANIO + '</b>: ' + item.ESTADO + '</p>';
              }, '');

              mModalAlert[res.COD === 200 ? 'showWarning' : 'showError'](message, res.MSJ);
            } else {
              mModalAlert[res.COD === 200 ? 'showSuccess' : 'showError'](res.MSJ, '');
            }
          });
        }

        $scope.$watch('filters.FEC_DESDE', function() {
          if ($scope.filters.FEC_DESDE && $scope.filters.FEC_DESDE > $scope.filters.FEC_HASTA) {
            $scope.filters.FEC_DESDE = null;
          }
        });

        $scope.$watch('filters.FEC_HASTA', function() {
          if ($scope.filters.FEC_HASTA && $scope.filters.FEC_DESDE > $scope.filters.FEC_HASTA) {
            $scope.filters.FEC_HASTA = null;
          }
        });
        
    }]);

    appRestos.factory('requestTrayFactory', ['$q', 'statesService', 'allowedActionsService'
    , 'mapfreAuthetication'
    , 'accessSupplier',
      function($q, statesService, allowedActionsService
        , mapfreAuthetication
        , accessSupplier) {
      var allowedStates, allowedActions;

      function getAllowedStates() {
        var deferred = $q.defer();
        statesService.getAllowedStates().then(function(res) {
          
          allowedStates = res.Resultado;
          deferred.resolve(allowedStates);
        }, function(err) {
          deferred.reject(err);
        });

        return deferred.promise;
      }

      function getAllowedActions() {
        var deferred = $q.defer();
        allowedActionsService.getAllowedActions().then(function(res) {
          allowedActions = res.Resultado;
          deferred.resolve(allowedActions);
        }, function(err) {
          if (err.status === 500 && err.data.includes("Unauthorized")) {
            // redirect to login
            mapfreAuthetication.signOut()
            .then(function() {
              mapfreAuthetication.goLoginPage(false);
              accessSupplier.clean();
            });
          }
          deferred.reject(err);
        });

        return deferred.promise;
      }

      return {
        getAllowedStates: function() {
          if (allowedStates) {
            return $q.resolve(allowedStates);
          }
          return getAllowedStates();
        },
        getAllowedActions: function() {
          if (allowedActions) {
            return $q.resolve(allowedActions);
          }
          return getAllowedActions();
        }
      };
    }]);

  });
