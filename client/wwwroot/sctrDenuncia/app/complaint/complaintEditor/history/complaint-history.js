(function($root, name, deps, action){
    $root.define(name, deps, action)
})(window, "complaintHistoryComponent", ['angular'], function(ng){
    ng.module('sctrDenuncia.app').
    controller('complaintHistoryComponentController',[function(){
        
        var vm = this;
        function getPagada(){
            var acum = 0;
            ng.forEach(vm.viewdata.liquidations,function(a){
                acum += ng.isNumber(a.importe)?a.importe:0;
            });
            return acum
        }
        function getPendiente(){
            var acum = 0;
            ng.forEach(vm.viewdata.guaranteeLatters,function(a){
                if (a.estado != "7") acum += ng.isNumber(a.monAprobado)?a.monAprobado:0;
            });
            return acum
        }
        vm.getPagada = getPagada;
        vm.getPendiente = getPendiente;
    }]).
    component("complaintHistory", {
        templateUrl: "/sctrDenuncia/app/complaint/complaintEditor/history/complaint-history.html",
        controller: "complaintHistoryComponentController",
        bindings: {
            viewdata: "=?"
        }
    })
});
