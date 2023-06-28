(function($root, name, deps, action){
  $root.define(name, deps, action)
})(window, "complaintDisabilitySearchResultComponent", ['angular'], function(ng){
  ng.module('sctrDenuncia.app')
    .controller('complaintDisabilitySearchResultComponentController',['$scope', 
      function($scope){
        var vm = this;

        vm.stateSelected = 1;

        $scope.$watch("$ctrl.resetStatus", function (newValue) {
          if(newValue) vm.stateSelected = 1;
        });

        function _pageChanged(){
          vm.pageChanged({ $status: vm.stateSelected });
        }

        function selectState(state) {
          vm.stateSelected = state.codigoEstado;
          vm.pagination.currentPage = 1;
          _pageChanged();
        }
        
        vm._pageChanged = _pageChanged;
        vm.selectState = selectState;
      }
    ])
    .component("complaintDisabilitySearchResult", {
      templateUrl: "/sctrDenuncia/app/complaint/disabilitySearch/result/complaint-search-result.html",
      controller: "complaintDisabilitySearchResultComponentController",
      bindings: {
        result: "=?",
        statesCount: "=?",
        pagination: "=?",
        pageChanged: "&",
        noResult: "=?",
        isSearched: "=?",
        resetStatus: "=?"
      }
    })
});
