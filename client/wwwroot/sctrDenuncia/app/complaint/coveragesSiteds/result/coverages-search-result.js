(function($root, name, deps, action){
    $root.define(name, deps, action)
})(window, "coveragesSearchResultComponent", ['angular'], function(ng){
    ng.module('sctrDenuncia.app').
    controller('coveragesSearchResultComponentController', ['proxyClinicCoverage', 'mModalAlert',
    function(proxyClinicCoverage, mModalAlert){
        var vm = this;
        
        vm.$onInit = onInit;
        function onInit(){
            
        }

        function getAttentionMax(){
            var attentions = vm.dataview.attentions
            return _.max(attentions, function(v){ return v.numAutorizacionSITEDS; })
        }

        function viewDetail(cov){
            var atention = getAttentionMax()
            vm.coverageSelected = cov;
            if (atention){
                var req  = {
                    apellidoPaterno: vm.dataview.apellidoPaterno,
                    apellidoMaterno: vm.dataview.apellidoMaterno,
                    nombres: vm.dataview.nombres
                }
                proxyClinicCoverage
                .getDetail1(vm.dataview.noPlan, cov.codigoRenipress, vm.dataview.nroPolizaSalud, cov.ruc, req, true)
                .then(function(response){

                    var r = response && response.result ? response.result: response; 
                    if (!r.isPagado)
                        mModalAlert.showInfo("La póliza tiene recibos pendientes, favor de verificar", "Recibos Pendientes");
                    vm.detailsCoverage = r.items
                    vm.onSelectedItem({$titular: r.titular, $paciente: r.paciente, $recibo: r.recibos})
                })
            }
            
        }

        function clean(){
            vm.detailsCoverage = []
        }
        
        vm.viewDetail = viewDetail
        
        vm.emitMethods ({$fn:{ clean: clean }}) ;
    }]).
    component("coveragesSearchResult", {
        templateUrl: "/sctrDenuncia/app/complaint/coveragesSiteds/result/coverages-search-result.html",
        controller: "coveragesSearchResultComponentController",
        bindings: {
            coverages: '=?',
            emitMethods: "&",
            dataview: "=?",
            onSelectedItem:"&"
        }
    })
});
