'use strict';

  define([
    'angular', 'constants', '/polizas/app/autos/autosCotizar2/service/autosCotizarFactory.js'
	], function(angular, constants, factory) {

  appAutos.module("appAutos").controller("autosCotiController",['$scope', '$stateParams', 'autosCotizarFactory', '$q', '$rootScope', '$location', '$window', '$state', function($scope, $stateParams, autosCotizarFactory, $q, $rootScope, $location, $window, $state)
  {
		console.log('autosCotiController');

  	$scope.formData = $rootScope.frm || {};

    $scope.$watch('formData', function(nv)
    {
      $rootScope.frm =  nv;
    });

  }])

});

