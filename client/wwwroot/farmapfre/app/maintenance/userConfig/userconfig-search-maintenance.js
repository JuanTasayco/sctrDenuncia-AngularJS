define([
    'angular'
  ], function(angular) {
    var appAutos = angular.module('farmapfre.app');
    appAutos.controller('searchUserConfigController', 
    ['$scope', 'proxyUser', 'proxyBODispatch', 'mModalAlert', 
    function($scope, proxyUser, proxyBODispatch, mModalAlert) {
      var title = 'Asignar Usuario a BO Despacho';
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

      searchBODispatchs = function() {
        var arg = { pageNumber: 1, pageLength: 99999, onlyCM: true };

        proxyBODispatch.Search(arg, false).then(function(response) {
          $scope.bodispatchs = response.records;
        });
      }

      searchBODispatchs();

      $scope.search = function(filter) {
        $scope.noResultInfo = false;
        $scope.arg.filter = !filter || undefined || '' || null ? null : filter;
        $scope.arg.pageNumber = $scope.pagination.currentPage;
        $scope.arg.pageLength = $scope.pagination.sizePerPage;

        proxyUser.GetUsersConfig($scope.arg.filter, null, $scope.arg.pageLength, $scope.arg.pageNumber, true).then(function(response) {
          $scope.users = response.records;
          $scope.pagination.totalRecords = response.totalRecords;
          $scope.noResult = $scope.pagination.totalRecords == 0 || !$scope.users ? true : false;
        });
      }

      $scope.search();

      $scope.pageChanged = function() {
        $scope.search($scope.frm.filter, true);
      }

      $scope.edit = function(user) {
        user.action = 2;
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
  