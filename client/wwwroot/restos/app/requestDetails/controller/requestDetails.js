(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/restos/app/mainControls/services/states-service.js',
  '/restos/app/mainControls/services/allowedActions-service.js',
  '/restos/app/mainControls/services/parameters-service.js',
  '/restos/app/requestDetails/services/requestDetails-service.js',
  '/restos/app/requestDetails/services/inventory-service.js',
  '/restos/app/requestDetails/services/documents-service.js',
  '/restos/app/requestDetails/services/payments-service.js',
  '/restos/app/requestDetails/services/comments-service.js',
  '/restos/app/requestDetails/services/notification-service.js'],
  function(angular, constants, helper){

    var appRestos = angular.module('appRestos');

    appRestos.controller('requestDetailsController',
      ['$scope', '$state', '$timeout', 'mainServices', '$uibModal', '$log', 'mModalAlert',
        'requestData', 'params', 'allowedActions', 'allowedStates', 'allowedStatesToUpdate',
        'allowedDocuments', 'requestDetailsService', 'statesService', 'inventoryService',
        'paymentsService', 'history', 'documentsService', 'commentsService', 'notificationService',
      function($scope, $state, $timeout, mainServices, $uibModal, $log, mModalAlert,
               requestData, params, allowedActions, allowedStates, allowedStatesToUpdate,
               allowedDocuments, requestDetailsService, statesService, inventoryService,
               paymentsService, history, documentsService, commentsService, notificationService ) {

        var initializing = true;
        $scope.requestChanged = false;

        $scope.idRequest = +$state.params.solicitud;
        $scope.params = params;
        $scope.allowedDocuments = allowedDocuments;
        $scope.request = requestData;

        $scope.showingInventory = ($scope.request.state.code === 1 || $scope.request.state.code  === 6) ? false : true;
        $scope.history = history;

        $scope.payments = null;
        $scope.showAddPayment = false;

        $scope.documentToUpload = {
          documentType: null,
          file: null
        };

        $scope.canDo = function() {
          return [].slice.call(arguments).some(function(arg) {
            return allowedActions.indexOf(arg) > -1;
          });
        };

        function setDataChanged() {
          if (initializing) {
            $timeout(function () {
              initializing = false;
            });
          } else {
            $scope.requestChanged = true;
          }
        }
        $scope.$watchCollection('request.DatosGenerales', setDataChanged);
        $scope.$watchCollection('request.Vehiculo', setDataChanged);

        $scope.showInventory = function(show) {
          $scope.showingInventory = !!show;
        };

        $scope.addPaymentForm = {
          NUM_PLCA: requestData.Vehiculo.NUM_PLCA
        };
        getListPayments();

        $scope.activeTabIndex = function(activeTab) {
          switch (activeTab) {
            case 'generalData':
              return 0;
            case 'vehicle':
              return 1;
            case 'documents':
              return 2;
            case 'history':
              return 3;
            case 'payments':
              return 4;
          }
        }($state.params.tab);

        $scope.showView = function(tab) {
          $state.go('details.' + tab, { notify: false } );
        };

        $scope.notifyPickLetter = function() {
          notificationService.notifyPickLetter($scope.idRequest).then(function(res) {
            if (res.COD === 200) {
              mModalAlert.showSuccess('La notificación se ha enviado correctamente', '');
            } else {
              mModalAlert.showError(res.MSJ, '');
            }
          });
        };

        $scope.notifyAuction = function() {
          notificationService.notifyAuction($scope.idRequest).then(function(res) {
            if (res.COD === 200) {
              mModalAlert.showSuccess('La notificación se ha enviado correctamente', '');
            } else {
              mModalAlert.showError(res.MSJ, '');
            }
          });
        };

        if ($scope.request.state.code === 8) {
          $scope.hasInventoryDifferences = inventoryService.hasInventoryDifferences($scope.request.Inventario);
        }

        $scope.notifyInventoryDifferences = function() {
          notificationService.notifyInventoryDifferences($scope.idRequest).then(function(res) {
            if (res.COD === 200) {
              mModalAlert.showSuccess('La notificación se ha enviado correctamente', '');
            } else {
              mModalAlert.showError(res.MSJ, '');
            }
          });
        };

        $scope.downloadDocument = function(docType, fileName) {
          documentsService.downloadDocument(docType, $scope.idRequest).then(function(res) {
            if (res.COD === 200) {
              fetch('data:application/pdf;base64,' + res.Resultado)
                .then(function(res) {
                  return res.blob();
                })
                .then(function(blob) {
                  var a = document.createElement('a');
                  document.body.appendChild(a);
                  a.style = 'display: none';
                  var url = (window.URL || window.webkitURL).createObjectURL(blob);
                  a.href = url;
                  a.download = fileName;
                  a.click();
                  (window.URL || window.webkitURL).revokeObjectURL(blob);
                });
            } else {
              mModalAlert.showError(res.MSJ, '');
            }
          });
        };

        $scope.uploadDocument = function(document) {
          documentsService.uploadDocument(
            document.file.base64,
            document.file.filename,
            document.documentType,
            $scope.idRequest
          ).then(function(res) {
            if (res.COD === 200) {
              $scope.resetUploadDocumentForm();
              if (res.Resultado === 'S') {
                $scope.showStateChangedModal('El documento se cargó correctamente');
                getUpdatedRequest();
              } else {
                mModalAlert.showSuccess('El documento se cargó correctamente', '');
                requestDetailsService.getDetails($scope.idRequest).then(function(res) {
                  $scope.request.Documentos = res.Resultado.Documentos;
                });
              }
            } else {
              mModalAlert.showError(res.MSJ, '');
            }
          });
        };

        $scope.resetUploadDocumentForm = function() {
          $scope.showUploadDocs = false;
          $scope.documentToUpload = {
            documentType: null,
            file: null
          };
        };

        function getListPayments() {
          paymentsService.listPayments($scope.request.Vehiculo.NUM_PLCA).then(function(res) {
            $scope.payments = res.Resultado;
          });
        }

        $scope.addPayment = function() {
          paymentsService.addPayment($scope.addPaymentForm).then(function(res) {
            if(res.COD === 200) {
              $log.info(res.MSJ);
              mModalAlert.showSuccess(res.MSJ, '').then(function() {
                $scope.showAddPayment = false;
                getListPayments();
                $scope.resetAddPaymentForm();
              });
            } else if(res.COD === 400) {
              $log.info('Ups! Algo fue mal');
              mModalAlert.showError(res.MSJ, '');
            }
          });
        };

        $scope.resetAddPaymentForm = function() {
          $scope.addPaymentForm = {
            NUM_PLCA: requestData.Vehiculo.NUM_PLCA
          };
        };

        // Validación tipo documento
        $scope.docPattern = /^.*$/;
        $scope.setDocPattern = function(docType) {
          switch (docType) {
            case 'DNI':
              $scope.docPattern = /^\d{8}$/;
              break;
            case 'CEX':
              $scope.docPattern = /^\d{9}$/;
              break;
            case 'RUC':
              $scope.docPattern = /^\d{11}$/;
              break;
            default:
              $scope.docPattern = /^.*$/;
              break;
          }
        };

        $scope.saveInventory = function(action) {
          inventoryService.registerInventory($scope.idRequest, $scope.request.Inventario, action).then(function(res) {
            if(res.COD === 200) {
              $log.info(res.MSJ);
              if (res.Resultado === 'S') {
                var newState = $scope.request.state.code === 6 ? 8 : 2;
                $scope.showStateChangedModal('El inventario se registró correctamente', newState);
              } else {
                mModalAlert.showSuccess(res.MSJ, '');
                getUpdatedRequest();
              }
            } else {
              $log.info('Ups! Algo fue mal');
              mModalAlert.showError(res.MSJ, '').then(function() {
                getUpdatedRequest();
              });
            }
          });
        };

        $scope.canUpdateTo = function() {
          return [].slice.call(arguments).some(function(arg) {
            return allowedStatesToUpdate.indexOf(arg) > -1;
          });
        };

        var oldRequest = angular.copy($scope.request);
        $scope.updateRequest = function() {
          requestDetailsService.updateRequest($scope.request).then(function(res) {
            if(res.COD === 200) {
              mModalAlert.showSuccess('Los datos se actualizaron correctamente', '');
              $scope.requestChanged = false;
              oldRequest = angular.copy($scope.request);
            } else {
              mModalAlert.showError(res.MSJ, '').then(function() {
                $scope.request = angular.copy(oldRequest);
              });
            }
          });
        };

        function defineModal(templateUrl, controller) {
          $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'md',
            templateUrl: templateUrl,
            controller: controller
          });
        }

        $scope.updateState = function(newState) {
          defineModal(
            'app/requestDetails/components/modalStateToChange.html',
            ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
              $scope.state = statesService.getStateDetails(newState || $scope.request.state.code + 1);

              $scope.closeModal = function () {
                $uibModalInstance.close();
              };

              if($scope.state.code === 5) {
                $scope.adjudicatarioData = {};
                $scope.adjudicatario = {};
              }
              $scope.update = function() {
                if ($scope.adjudicatario) {
                  for (var prop in $scope.adjudicatario) {
                    if ($scope.adjudicatario.hasOwnProperty(prop)) {
                      $scope.request.DatosGenerales[prop] = $scope.adjudicatario[prop].toUpperCase();
                    }
                  }
                }
                $uibModalInstance.close();
                requestDetailsService.updateRequest($scope.request, newState).then(function(res) {
                  if(res.COD === 200) {
                    $scope.showStateChangedModal(null, newState);
                  } else {
                    mModalAlert.showError(res.MSJ, '');
                  }
                });
              };
            }]
          );
        };

        $scope.showStateChangedModal = function(title, newState) {
          defineModal(
            'app/requestDetails/components/modalStateChanged.html',
            ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
              $scope.title = title;
              $scope.state = statesService.getStateDetails(newState || $scope.request.state.code + 1);

              $scope.closeModal = function () {
                $uibModalInstance.close();
              };
              $scope.saveComment = function (comment) {
                if (!comment) {
                  comment = 'Sin comentarios';
                }

                function done() {
                  if (allowedStates.some(function(state) { return +state.CODIGO === $scope.state.code; })) {
                    getUpdatedRequest();
                    $uibModalInstance.close();
                  } else {
                    $state.go('requestTray');
                  }
                }
                
                commentsService.addComment(comment.toUpperCase(), $scope.idRequest).then(function (res) {
                  if (res.COD === 200) {
                    done();
                  } else {
                    mModalAlert.showError(res.MSJ, '').then(function () {
                      done();
                    });
                  }
                });
              };
            }]
          );
        };

        function getUpdatedRequest() {
          initializing = true;
          requestDetailsService.getDetails($scope.idRequest).then(function(res) {
            $scope.request = res.Resultado;
            $scope.request.state = statesService.getStateDetails(res.Resultado.DatosGenerales.ESTDO_SLCTD_DESC);
            $scope.requestChanged = false;
            $scope.showingInventory = false;
            setTimeout(function() {
              $scope.showingInventory = ($scope.request.state.code === 1 || $scope.request.state.code  === 6) ? false : true;
            });
          });
          requestDetailsService.getHistory($scope.idRequest).then(function(res) {
            $scope.history = res.Resultado;
          });

        }
    }]);

    appRestos.factory('requestDetailsFactory', ['$q', 'parametersService', 'requestDetailsService',
      'documentsService', 'statesService', 'allowedActionsService'
      , 'mapfreAuthetication'
      , 'accessSupplier',
      function($q, parametersService, requestDetailsService,
        documentsService, statesService, allowedActionsService
        , mapfreAuthetication
        , accessSupplier) {
        var params,
            allowedActions,
            allowedStates,
            allowedStatesToUpdate,
            allowedDocuments;

        function getRequestData(idRequest) {
          var deferred = $q.defer();
          requestDetailsService.getDetails(idRequest).then(function(res) {
            var requestDetails = res.Resultado;
            requestDetails.state = statesService.getStateDetails(requestDetails.DatosGenerales.ESTDO_SLCTD_DESC);
            deferred.resolve(requestDetails);
          }, function(err) {
            deferred.reject(err);
          });

          return deferred.promise;
        }

        function getParams() {
          var deferred = $q.defer();

          $q.all([
            parametersService.getEngineTypes(),
            parametersService.getCurrencies(),
            parametersService.getSteeringWheelTypes(),
            parametersService.getIdTypes(),
          ]).then(function(res) {

            params = {
              engineTypes: res[0].Resultado,
              currencies: res[1].Resultado,
              steeringWheelTypes: res[2].Resultado,
              idTypes: res[3].Resultado
            };

            deferred.resolve(params);
          }, function(err) {
            deferred.reject(err);
          });

          return deferred.promise;
        }

        function getHistory(idRequest) {
          var deferred = $q.defer();
          requestDetailsService.getHistory(idRequest).then(function(res) {
            deferred.resolve(res.Resultado);
          }, function(err) {
            deferred.reject(err);
          });

          return deferred.promise;
        }

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

        function getAllowedStatesToUpdate() {
          var deferred = $q.defer();
          requestDetailsService.getAllowedStatesToUpdate().then(function(res) {
            allowedStatesToUpdate = res.Resultado;
            deferred.resolve(allowedStatesToUpdate);
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

        function getAllowedDocuments() {
          var deferred = $q.defer();
          documentsService.getAllowedDocuments().then(function(res) {
            allowedDocuments = res.Resultado;
            deferred.resolve(allowedDocuments);
          }, function(err) {
            deferred.reject(err);
          });

          return deferred.promise;
        }

        return {
          getRequestData: function(idRequest) {
            return getRequestData(idRequest);
          },
          getHistory: function(idRequest) {
            return getHistory(idRequest);
          },
          getParams: function() {
            if (params) {
              return $q.resolve(params);
            }
            return getParams();
          },
          getAllowedActions: function() {
            if (allowedActions) {
              return $q.resolve(allowedActions);
            }
            return getAllowedActions();
          },
          getAllowedStates: function() {
            if (allowedStates) {
              return $q.resolve(allowedStates);
            }
            return getAllowedStates();
          },
          getAllowedStatesToUpdate: function() {
            if (allowedStatesToUpdate) {
              return $q.resolve(allowedStatesToUpdate);
            }
            return getAllowedStatesToUpdate();
          },
          getAllowedDocuments: function() {
            if (allowedDocuments) {
              return $q.resolve(allowedDocuments);
            }
            return getAllowedDocuments();
          }
        };
      }
    ]);
  });
