define([
    'angular','/polizas/app/autos/autosHome/component/component.js'
], function(angular) {
    
    angular.module("appAutos").controller("homeController",['$scope', '$stateParams', '$q',function($scope, $stateParams, $q, authoObjectsProxy)
    {
       document.title = 'OIM - Pólizas Autos';
       console.log("homeController");

    }]);
});
