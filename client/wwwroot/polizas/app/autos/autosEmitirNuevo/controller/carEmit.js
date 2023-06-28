(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'helper', 'constants'], function(angular, helper, constants){

    angular.module("appAutos").controller('carEmitController', ['$scope', 'oimPrincipal', '$stateParams', 'emitFactory', 'quotationCar', '$state', '$timeout', 'claims', 'mainServices',
    function($scope, oimPrincipal, $stateParams, emitFactory, quotationCar, $state, $timeout, claims, mainServices){
        function LoadAgent(){
            if (claims){
                $scope.formData._loginAgent = {
                    codigoUsuario: claims[2].value.toUpperCase(),
                    nombreAgente: claims[6].value.toUpperCase(),
                    codigoNombre: claims[6].value.toUpperCase(),
                    codigoAgente: claims[7].value
                }
                $scope.userRoot = oimPrincipal.isAdmin()

                if (!$scope.userRoot)
                    $scope.formData.selectedAgent = $scope.formData._loginAgent;
                else if ( $scope.quotation && $scope.quotation.codigoAgente)
                {
                        $scope.formData.selectedAgent = { codigoAgente: $scope.quotation.codigoAgente, codigoNombre: $scope.quotation.nombreAgente }
                }
            }
        }
        console.log("carEmitController");



        $scope.formData = $scope.formData || {};
        $scope.currentContract = $scope.currentContract || {};


        var _self = this;
        if (!$scope.$ctrl)
            $scope.$ctrl =_self;

        $scope.idQuotation =  $stateParams.quotation
        $scope.quotation = $scope.quotation || quotationCar.data;

        $scope.formData.contractor = $scope.quotation.contratante;

        LoadAgent();


        $scope.labelGral = [
			{id: 'S', valor: 'SI'},
			{id: 'N', valor: 'NO'},
			{id: 'RUC', valor: 'RUC'},
			{id: 'nZero', valor: 1},
			{id: 'two', valor: 2},
			{id: 'U', valor: 'Usado'}
		];


       (function eventHandler (){
            $scope.$on('$stateChangeSuccess', function (s, state, param, d) {
                $scope.currentStep = param.step;
            });

            $scope._steping = function(step){
                var e = { cancel : false, step: step }

                $scope.$broadcast('changingStep', e);

                return !e.cancel;
            }

            $scope.isCompany = function(value){
              var vIsCompany = false;
              if (value && value.mTipoDocumento && value.mNumeroDocumento){
                vIsCompany = !mainServices.fnShowNaturalRucPerson(value.mTipoDocumento.Codigo, value.mNumeroDocumento);
              }
              return vIsCompany;
            }
        })();

    }]).factory('loaderEmitNew', ['emitFactory', '$q', 'proxyDocumento',
    function( emitFactory, $q, proxyDocumento){
        var colors, claims, quotationCar = {}

        function tryGetQuotationCar(qID){
                var deferred = $q.defer();
                var m = proxyDocumento.ObtenerCotizacionEmisionVehiculo(constants.module.polizas.autos.companyCode, qID, constants.module.polizas.autos.codeRamo)
                m.then(function(r){ quotationCar[qID] = helper.clone(r, true); deferred.resolve(quotationCar[qID]); },
                    function(r){ deferred.reject(r); });
                return deferred.promise;

                }

         function getClaims(){
            var deferred = $q.defer();
            emitFactory.getClaims().then(function(response){
                claims = helper.clone(response.data, true) ;
                deferred.resolve(claims);
            }, function (error){
                deferred.reject(error.statusText);
            });
            return deferred.promise;
        }
        function tryGetCarCalors(){
            var deferred = $q.defer();
            var m = emitFactory.getColors();
             m.then(function(r){  colors = helper.clone(r.data, true); deferred.resolve(colors); }, function(r){ deferred.reject(r); });
            return deferred.promise;

        }
        return { load: function(qID){
                   if(quotationCar[qID]) {

                       return $q.resolve(quotationCar[qID]);
                   }
                   quotationCar = {};
                    return tryGetQuotationCar(qID);
                },
                carCalors: function(){
                     if(colors) return $q.resolve(colors);
                    return tryGetCarCalors();
                },
                _claims: function(){
                     if(claims) return $q.resolve(claims);
                    return getClaims();
                }
            }
    }])
});
