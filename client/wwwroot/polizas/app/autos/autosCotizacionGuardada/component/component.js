'use strict';

define([
    'angular', 'angular_animate', '/polizas/app/autos/autosHome/service/autosFactory.js'
], function(angular, angular_animate, factory, helper, constants) {
    
    var appAutos = angular.module('appAutos')
    
    appAutos.controller('cotizacionGuardadController', ['$scope', 'autosFactory', '$q', function($scope, autosFactory, $q)
    {  


    }])

    appAutos.filter('makePositive', function() {
            return function(num) { return Math.abs(num); }
    });


    appAutos.filter('isEmpty', function () {
        var bar;
        return function (obj) {
            for (bar in obj) {
                if (obj.hasOwnProperty(bar)) {
                    return false;
                }
            }
            return true;
        };
    });
    
});
    
