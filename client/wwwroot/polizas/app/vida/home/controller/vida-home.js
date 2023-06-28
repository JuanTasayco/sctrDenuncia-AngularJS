define([
    'angular'
], function(angular) {

    angular.module("appVida").controller("ctrlHomeVida", ['$scope', '$state', '$stateParams', '$q', '$window', 'oimAuthorize', 'oimPrincipal', function($scope, $state, $stateParams, $q, $window, oimAuthorize, oimPrincipal) {
        $scope.startEmit = function() {
            $state.go("vidaDocuments.docs", { doc: 'pendingQuotes' }, { reload: true });
        }

        $scope.canCotizar = !!oimAuthorize.isAuthorized($state.get("vidacotizar")) || oimPrincipal.isAdmin();
        $scope.canConsul = oimPrincipal.isAdmin() //!!oimAuthorize.isAuthorized($state.get("vidaDocuments"));
        $scope.canFile = !!oimAuthorize.isAuthorized($state.get("vidaFileInterest")) || oimPrincipal.isAdmin();
        $scope.canMaintenance = !!oimAuthorize.isAuthorized($state.get("vidaMaintenance")) || oimPrincipal.isAdmin();
        $scope.canSummary = !!oimAuthorize.isAuthorized($state.get("vidaSummaryReport")) || oimPrincipal.isAdmin();
        // $scope.canEmit = !!oimAuthorize.isAuthorized($state.get("vidaemit")) || oimPrincipal.isAdmin();
        $scope.canEmit = oimPrincipal.isAdmin();
        var vRole = oimPrincipal.get_role();
        $scope.canConsultarResumenComparativo = oimPrincipal.isAdmin() || _.contains(["SUPERVISOR", "GESTOR", "DIRECTOR", "AGENTE", "AGENTEPE"], vRole);
    }]);
});