define([
    'angular'
  ], function(angular) {
    var appAutos = angular.module('farmapfre.app');
    appAutos.controller('searchBoDispatchController', 
    ['$scope', '$state', 'proxyBODispatch', 'mModalAlert', 'mModalConfirm', 
    function($scope, $state, proxyBODispatch, mModalAlert, mModalConfirm) {
      var title = 'Relación BO Despachos - Sede - Almacén';
      $scope.title = title;
      $scope.frm = {};
      $scope.arg = {};
      $scope.noResultInfo = true;
      $scope.noResult = false;
      document.title = title;

      function clean() {
        $scope.pagination = {
            maxSize: 5,
            sizePerPage: 5,
            currentPage: 1,
            totalRecords: 0
        } 
      }

      clean();

      $scope.search = function(filter) {
        $scope.noResultInfo = false;
        $scope.arg.filter = !filter || undefined || '' || null ? null : filter;
        $scope.arg.pageNumber = $scope.pagination.currentPage;
        $scope.arg.pageLength= $scope.pagination.sizePerPage;

        proxyBODispatch.Search($scope.arg, true).then(function(response) {
          $scope.bodispatchs = response.records;
          $scope.pagination.totalRecords = response.totalRecords;
          $scope.noResult = $scope.pagination.totalRecords == 0 || !$scope.bodispatchs ? true : false;
        });
      }

      $scope.search();

      $scope.pageChanged = function() {
        $scope.search($scope.frm.filter, true);
      }

      $scope.delete = function(bodispatch) {
        mModalConfirm.confirmQuestion('¿Está seguro de eliminar el bo despacho?', 'Eliminar Bo Despacho', 'Si')
        .then(function(ok) {
            if(ok) {
              proxyBODispatch.Delete(bodispatch.id, true)
                .then(function(res) {
                    if(res.isOk) {
                        mModalAlert.showSuccess('El ' + bodispatch.description + ' se eliminó satisfactoriamente.', 'Eliminar Bo Despacho')
                        .then(function() {
                          $scope.search();
                        });
                    } else {
                        mModalAlert.showWarning(res.message, 'Eliminar Bo Despacho')
                    }
                }, function(err) {
                    showMsgError();
                });
            }
        });
      }

      $scope.edit = function(bodispatch) {
        bodispatch.action = 2;
      }

      $scope.new = function() {
        $state.go('createBoDispatch');
      }

      $scope.clearFilter = function() {
        $scope.frm.filter = '';
        clean();
        $scope.search();
      }

      showMsgError = function() {
          mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', 'Error');
      };
    }])
  });
  