(function ($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, "modalsearchpolicy", ["angular"], function (angular) {
    angular
      .module("sctrDenuncia.app")
      .controller("modalsearchpolicyController", [
        "oimProxySctrDenuncia",
        "$scope",
        "$state",
        "$q",
        "$http",
        "proxyInsurancePolicy",
        "$rootScope",
        "mpSpin",
        "mModalAlert",
        "$filter",
        function (oimProxySctrDenuncia, $scope, $state, $q, $http, proxyInsurancePolicy, $rootScope, mpSpin, mModalAlert,$filter) {
          var vm = this;
          vm.$onInit = onInit;
  
          function onInit() {    
            vm.data = { items: [] };      
            vm.cerrar = cerrar;
            polizas();
          }
  
          function polizas() {
            mpSpin.start();
            var deferred = $q.defer();  
            proxyInsurancePolicy.GetByDocument(
              vm.afiliado.nroDocAsegurado,vm.afiliado.nroDocCliente,vm.afiliado.fecAccidente.toISOString()
            ).then(function (response) {
              if (response) {
                deferred.resolve(response);
                vm.data.items = response;                
              }
              if(response.length==0){
                mModalAlert.showError("El asegurado no tiene pólizas disponibles con la fecha indicada", "Póliza");
              }
              mpSpin.end();
            });
          }
   

          function cerrar(policy) {
            $rootScope.hasPolicy = true;
            $rootScope.tipPoliza  = policy.tipoPoliza; 
            $rootScope.nroPolizaSalud = policy.nroPoliza;

            $rootScope.vigencia = $filter('date')(new Date(policy.fecIniVig),'dd/MM/yyyy') + " al " + $filter('date')(new Date(policy.fecFinVig),'dd/MM/yyyy');
            vm.close();
          }        
        },
      ])
      .component("modalsearchpolicy", {
        templateUrl: "/sctrDenuncia/app/components/modals/modal-searchpolicy.html",
        controller: "modalsearchpolicyController",
        bindings: {
          role: "=?",
          params: "=?",
          afiliado: "=?",
          close: "&?",
        },
      });
  });
  