(function($root, name, deps, action){
    $root.define(name, deps, action)
})(window, "complaintSearchResultComponent", ['angular'], function(ng){
    ng.module('sctrDenuncia.app').
    controller('complaintSearchResultComponentController',[function(){
        var states = [{code:'R',name:"REGISTRADA"},{code:'H',name:"RECHAZADA"},{code:'P',name:"APROBADA"},{code:'F',name:"FINALIZADA"}]

        var vm = this;
        function _pageChanged(){
            vm.pageChanged();
        }
        function getNameState(state){
            var cstate = states[0];
            if (state){
                cstate = _.find(states, function(x){ return x.code == state});
                if (!cstate) cstate = states[0];
            }
            return cstate.name;
        }
        vm._pageChanged = _pageChanged;
        vm.getNameState = getNameState;
    }]).
    component("complaintSearchResult", {
        templateUrl: "/sctrDenuncia/app/complaint/search/result/complaint-search-result.html",
        controller: "complaintSearchResultComponentController",
        bindings: {
            result: "=?",
            pagination: "=?",
            pageChanged: "&",
            noResult: "=?"
        }
    })
});
