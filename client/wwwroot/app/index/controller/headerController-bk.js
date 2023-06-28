(function(deps,factory){
    
    factory();

})([], function(){
    var appHome =  angular.module('oim.layout');
    appHome.controller("headerController",['$scope','$rootScope', '$http', '$q', '$window', 'authorizedResource', function ($scope, $rootScope, $http, $q, $window, authorizedResource){
        
        var host = constants.system.api.endpoints.security;
        function init(){
            var clone = helper.clone(authorizedResource.accessMenu)
            if (clone){
                var more = 
                $scope.menu = [{name: "Inicio", href:'/'}].concat(clone.concat([{ name : "MÁS FUNCIONALIDADES", href : ""}]));
               // $scope.menu = [{name: "Inicio", href:'/'}].concat($rootScope.optionsMenu.concat([more]));
               // console.log($scope.menu);
            }
        }

        $rootScope.$watch('optionsMenu', function(){
            init()
        })

        $scope.setAplication = function(aplicacion){
            //$rootScope.CodigoAplicacion = aplicacion.code        
            window.localStorage['CodigoAplicacion'] = angular.toJson(aplicacion.code); // Tranforma a JSon, porque el 'localStorage', solo lee string
            window.location.href = aplicacion.href;
        };

    }]);
})

