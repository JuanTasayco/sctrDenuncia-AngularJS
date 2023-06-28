define([
    'angular'
  ], function(angular) {
  
    var appBoDistrict = angular.module('farmapfre.app');
  
    appBoDistrict.controller('bodistrictController', 
    ['$scope', '$state', 'proxyBODistrict','mModalAlert', 'mModalConfirm', 
    	function($scope, $state, proxyBODistrict, mModalAlert, mModalConfirm) {
      $scope.frm = {};
      $scope.arg = {};
      $scope.noResultInfoDistricts = true;
      $scope.noResultDistricts = false;

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

        $scope.noResultInfoDistricts = false;
        $scope.arg.filter = !filter || undefined || '' || null ? null : filter;
        $scope.arg.pageNumber = $scope.pagination.currentPage;
        $scope.arg.pageLength= $scope.pagination.sizePerPage;

        proxyBODistrict.Search($scope.arg, true).then(function(response) {
          $scope.bodistricts = response.records;
          $scope.pagination.totalRecords = response.totalRecords;
          $scope.noResultDistricts = $scope.pagination.totalRecords == 0 || !$scope.bodistricts ? true : false;
        });
      }

      $scope.search();

      $scope.pageChanged = function() {
        $scope.search($scope.frm.filter, true);
      }


//
    $scope.delete = function(bodistrict) {
        mModalConfirm.confirmQuestion('¿Está seguro de eliminar el BO distrito '+bodistrict.district.description+'?', 'Eliminar Bo Distrito', 'Si')
        .then(function(ok) {
            if(ok) {
              
              proxyBODistrict.Delete(bodistrict.district.id, true)
                .then(function(res) {
                    if(res.isOk) {
                        mModalAlert.showSuccess('El BO distrito ' + bodistrict.district.description + ' se eliminó satisfactoriamente.', 'Eliminar Bo Distrito')
                        .then(function() {
                          $scope.search();
                        });
                    } else {
                        mModalAlert.showWarning(res.message, 'Eliminar Bo Distrito')
                    }
                }, function(err) {
                    showMsgError();
                });

            }
        });
      }

      $scope.edit = function(bodistrict) {
        bodistrict.action = 2;
      }

      $scope.new = function() {
        $state.go('createBoDistrict');
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
  