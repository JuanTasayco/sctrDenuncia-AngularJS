define([
  'angular'
], function(angular) {

  var appAlliedPharmacies = angular.module('farmapfre.app');

  appAlliedPharmacies.controller('alliedpharmaciesController',
    ['$scope', '$state', '$q', 'proxyAlliedPharmacy', 'mModalAlert', 'mModalConfirm',
      function($scope, $state, $q, proxyAlliedPharmacy, mModalAlert, mModalConfirm) {
        $scope.frm = {};
        $scope.arg = {};
        $scope.noResultInfoPharmaciesAllied = true;
        $scope.noResultPharmacies = false;
        $scope.pharmacy = {};

        function clean() {
          $scope.pagination = {
            maxSize: 5,
            sizePerPage: 5,
            currentPage: 1,
            totalRecords: 0
          }
        }

        clean();

        $scope.new = function() {
          $state.go('createAlliedPharmacies');
        };

        $scope.detail = function(pharmacy) {
          $scope.pharmacy = pharmacy
          $state.go('detailAlliedPharmacies', { pharmacyid: $scope.pharmacy.id });
        };

        $scope.search = function(filter) {
          $scope.noResultInfoPharmaciesAllied = false;
          $scope.arg.pageNumber = $scope.pagination.currentPage;
          $scope.arg.pageLength= $scope.pagination.sizePerPage;

          $scope.arg.filter = !filter || undefined || '' || null ? null : filter;

          proxyAlliedPharmacy.Search($scope.arg, true).then(function(response) {
            $scope.pharmacies = response.records;
            $scope.pagination.totalRecords = response.totalRecords;
            $scope.noResultPharmacies = $scope.pagination.totalRecords == 0 || !$scope.pharmacies ? true : false;
          });

        };

        $scope.search();
       
        $scope.pageChanged = function() {
          $scope.search($scope.frm.filter, true);
        }

        $scope.clearFilter = function() {
          $scope.frm.filter = '';
          clean();
          $scope.search();
        }

        $scope.changeChecked = function(pharmacy) {
          var collect = pharmacy.itsCollect ? true :false;

          if(collect) {
            var request = {
              id: pharmacy.id,
              description: pharmacy.description,
              itsDelivery: pharmacy.itsDelivery ? true :false,
              itsCollect: pharmacy.itsCollect ? true :false,
              status : { enabled: pharmacy.status.enabled ? true :false },
              premises: {}
            };
          } else {
            var request = {
              id: pharmacy.id,
              description: pharmacy.description,
              itsDelivery: pharmacy.itsDelivery ? true :false,
              itsCollect: pharmacy.itsCollect ? true :false,
              status : { enabled: pharmacy.status.enabled ? true :false }
            };
          }

          proxyAlliedPharmacy.Save(request, true)
            .then(function(res) {
                pharmacy.status.description = pharmacy.status.enabled ? 'HABILITADO' : 'INHABILITADO';
              },
              function(err) {
                if(err.status === 500) {
                  showMsgError();
                } else {
                  pharmacy.status.description = pharmacy.status.enabled ? 'HABILITADO' : 'INHABILITADO';

                  if(pharmacy.status.enabled) {
                    mModalAlert.showWarning(err.data.message, 'Editar Farmacia Aliada').then(function() { });
                  }
                }
              });
        }

        showMsgError = function() {
          mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', 'Error');
        };
      }])
});