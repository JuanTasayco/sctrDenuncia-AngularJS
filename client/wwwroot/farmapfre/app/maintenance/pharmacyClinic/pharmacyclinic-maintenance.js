define([
  'angular'
], function(angular) {

  var appPharmacyClinic = angular.module('farmapfre.app');

  appPharmacyClinic.controller('pharmacyclinicController',
    ['$scope', '$state', 'proxyProvider', 'proxyAlliedPharmacy', 'mModalAlert', 'mModalConfirm',
      function($scope, $state, proxyProvider, proxyAlliedPharmacy, mModalAlert, mModalConfirm) {
        $scope.frm = {};
        $scope.arg = {};
        $scope.keyRelation = false;
        $scope.noResultInfoClinics = true;
        $scope.noResultClinics = false;

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
          $scope.noResultInfoClinics = false;
          $scope.arg = filter;
          $scope.arg.pageNumber = $scope.pagination.currentPage;
          $scope.arg.pageLength= $scope.pagination.sizePerPage;

          proxyProvider.Search($scope.arg, true).then(function(response) {
            $scope.clinics = response.records;
            $scope.pagination.totalRecords = response.totalRecords;
            $scope.noResultClinics = $scope.pagination.totalRecords == 0 || !$scope.clinics ? true : false;
          });
        };

        $scope.pageChanged = function() {
          $scope.search($scope.arg);
        }

        // $scope.clearFilter = function() {
        //   clean();
        //   $scope.search();
        // }

        $scope.addRelation = function(clinic) {
          clinic.keyRelation = true;

          proxyProvider.GetRelationsProviderPharmaciesPremises(clinic.provider.id, clinic.branchOffice.id, true).then(function(res) {
            clinic.relationProviderPharmacies = res;
          });
        };

        $scope.cancel = function(clinic) {
          clinic.keyRelation = false;
          clinic.premisesList = [];
          clinic.pharmacy = null;
          clinic.premises = null;
          //$scope.getFarmacyAllied();
        };

        $scope.cancelRelation = function(item) {
          item.keyRelation = false;
          item.frm = {};
        };

        $scope.cancelEditRelation = function(item) {
          item.keyEdit = false;
          item.frm = {};
        };

        $scope.getFarmacyAllied = function () {
          proxyAlliedPharmacy.GetAlliedPharmacyForCollect().then(function (res) {
            $scope.farmacies = res;
          });
        };

        $scope.getFarmacyAllied();

        $scope.editRelation = function(clinic, relation) {
          relation.keyEdit = true;
          relation.frm = JSON.parse(JSON.stringify(relation));

          if(relation.frm.premises) {
            relation.frm.premises.address.fullDescription = relation.frm.premises.address.description + " (" + 
            relation.frm.premises.address.department.description + " - " + relation.frm.premises.address.province.description + " - "  +  relation.frm.premises.address.district.description +  ")";
          }

          if(relation.frm.frm) {
            delete relation.frm.frm;
          }

          $scope.changeFarmacies(relation.frm, clinic.provider.id, clinic.branchOffice.id, relation.frm.pharmacy.id);
        };

        $scope.changeFarmacies = function (item, providerId, branchOfficeId, pharmacyId) {
          item = item || {};
          item.premisesList = [];

          proxyProvider.GetPremisesForProviderBranchOfficePharmacy(providerId, branchOfficeId, pharmacyId).then(function(res) {
            item.premisesList = res;
          });
        };

        $scope.changeChecked = function(relation, clinic) {
          var request = {
            id: relation.id,
            providerCode: clinic.provider.id,
            branchOfficeCode: clinic.branchOffice.id,
            alliedPharmacyCode: relation.pharmacy.id,
            premisesCode: relation.premises.id,
            enabled: relation.status.enabled
          }

          proxyProvider.SaveRelationProviderPharmaciesPremises(request, false).then(function(response) {
            $scope.pageChanged();
            if(relation.status.enabled) {
              relation.status.description = 'HABILITADO'
            } else {
              relation.status.description = 'DESHABILITADO'
            }
          });
        }

        $scope.changePremises = function(premises) {
          if(premises) {
            premises.fullDescription = premises.address.description + " (" + 
            premises.address.department.description + " - " + premises.address.province.description + " - "  +  premises.address.district.description +  ")";
          } 
        }

        $scope.saveRelation = function (clinic, relation) {
          var customRelation = JSON.parse(JSON.stringify(relation));
          customRelation.pharmacy = relation.frm.pharmacy;
          customRelation.premises = relation.frm.premises;

          if(customRelation.frm) {
            delete customRelation.frm;
          }

          $scope.saveRelationPremisePharmacy(clinic, customRelation);
        };

        $scope.saveNewRelationPremisePharmacy = function (clinic) {
          clinic.frm.status = {"enabled": true };
          $scope.saveRelationPremisePharmacy(clinic, clinic.frm);
        };

        $scope.saveNewRelation = function (clinic) {
          var relacion = {"pharmacy": clinic.pharmacy, "premises": clinic.premises, "status": {"enabled": true} };
          // clinic.pharmacy = clinic.frm.pharmacy;
          // clinic.premises = clinic.frm.premises;
          $scope.saveRelationPremisePharmacy(clinic, relacion);
        };

        $scope.saveRelationPremisePharmacy = function (clinic, relacion) {
          var request = {};

          if(relacion.id) {
            request = {
              id: relacion.id,
              providerCode: clinic.provider.id,
              branchOfficeCode: clinic.branchOffice.id,
              alliedPharmacyCode: relacion.pharmacy.id,
              premisesCode: relacion.premises.id,
              enabled: relacion.status.enabled
            }
          } else {
            request = {
              providerCode: clinic.provider.id,
              branchOfficeCode: clinic.branchOffice.id,
              alliedPharmacyCode: relacion.pharmacy.id,
              premisesCode: relacion.premises.id,
              enabled: relacion.status.enabled
            }
          }

          proxyProvider.SaveRelationProviderPharmaciesPremises(request, false).then(function(response) {
            if(response) {
              mModalAlert.showSuccess('Se guardó satisfactoriamente.', 'Guardar Relación').then(function() {
                clinic.keyRelation = false;
                $scope.pageChanged();
              });
            }
            else {
              showMsgError();
            }
          }, function(err) {
            if(err.status === 500) {
              showMsgError();
            } else {
              mModalAlert.showWarning(err.data.message, 'Guardar Relación');
            }
            //clinic.keyRelation = false;
          });
        }

        showMsgError = function() {
          mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', 'Error');
        };
      }])
});