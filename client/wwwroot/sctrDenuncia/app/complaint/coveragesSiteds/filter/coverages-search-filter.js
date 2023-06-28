
(function($root, name, deps, action){
    $root.define(name, deps, action)
})(window, "coveragesSearchFilterComponent", ['angular'], function(ng){
    ng.module('sctrDenuncia.app').
    controller('coveragesSearchFilterComponentController', ['proxyClinicCoverage', "$scope",
    "$stateParams","$q",
    function(proxyClinicCoverage,$scope,$stateParams,$q){
        var vm = this;
        vm.$onInit = onInit;
        
        function onInit(){
            trySearch("ruc", "SeekCompany", "company");             
          if(vm.dataview  == null){
            vm.planInvalid = true;
          }   
        }        
          if(vm.dataview.noPlan){
            proxyClinicCoverage.GetPlan(vm.dataview.noPlan).then(
            function(response){
              vm.dataview.noPlanString = response;
            }
            );
          }
        function trySearch(type, nameMethod, field) {
            if ($stateParams.documentNumber)
              if (($stateParams.type || "").trim().toLowerCase() == type)
                proxyClient[nameMethod]($stateParams.documentNumber).then(
                  function (response) {
                    if (response && response.length > 0) {
                      vm.frmFilter = vm.frmFilter || {};
                      vm.frmFilter[field] = response[0];
                      search();
        }
        }
                );
            }
            

        function seekCompany(wildcar) {
            var deferred = $q.defer();
            var params = { Wildcard : wildcar };
            proxyClinicCoverage.SeekCompanyWithSpecialChar(params).then(
              function (r) {
                angular.forEach(r, function (a, b) {
                    a.fulltext = a.ndidntdd + " - " + a.rsaynmbrs + " - "+ a.rsabrvda + " - " + a.dscrsl;
                });
                deferred.resolve(r);
              },
              function (r) {
                deferred.reject(r);
            }   
            );
            return deferred.promise;
        }
        function changeClinic(){
            var param = vm.data
            param.coverge = {codigo:null}
            vm.coverages=[]
            if (param.clinic && param.clinic.codigo){
                proxyClinicCoverage
                .GetCoverageByClinic(param.clinic.codigoProveedor, param.clinic.numeroSucursalProveedor, vm.dataview.noPlan)
                .then(function(response){
                    vm.coverages = response;
                })
            }
        }
        //function getAttentionMax(){
        //    var attentions = vm.dataview.attentions
        //    return _.maxBy(attentions, function(v){ return v.numAutorizacionSITEDS; })
        //}
        function buscar(){      
          if(vm.frmFilter == null){
            vm.aseguradoInvalid = true;
            return;
          }
          if(vm.planInvalid){
            return;
        }
            vm.onSearch({$filters: {
                noPlan: vm.dataview.noPlan, 
                    nroDocumento: vm.frmFilter.company.ndidntdd
            }}); 
        }
        function validateAsegurado(){          
          vm.aseguradoInvalid = false;
        }
        function clear(){
            vm.frmFilter = null;
            vm.planInvalid = false;
            validateAsegurado();
            vm.onClean();
        }
        vm.validateAsegurado = validateAsegurado;
        vm.changeClinic = changeClinic;
        vm.buscar = buscar;
        vm.seekCompany = seekCompany;
        vm.clear = clear;
    }]).
    component("coveragesSearchFilter", {
        templateUrl: "/sctrDenuncia/app/complaint/coveragesSiteds/filter/coverages-search-filter.html",
        controller: "coveragesSearchFilterComponentController",
        bindings: {
            onSearch: '&',
            onClean: '&',
            dataview: "=?"
        }
    })
});
