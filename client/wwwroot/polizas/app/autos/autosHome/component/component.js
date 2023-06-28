'use strict';

define([
    'angular', 'lodash', '/polizas/app/autos/autosHome/service/autosFactory.js',
], function(angular, _, factory) {

    var appAutos = angular.module('appAutos')

    appAutos.controller('ctrlHomeAutos', ['$scope', 'autosFactory', '$q', '$stateParams', '$state', '$rootScope', '$location', function($scope, autosFactory, $q, $stateParams, $state, $rootScope, $location)
    {
      autosFactory.setCotizacionFechaHora(null);
    	$scope.irACotizar = function(){
				$rootScope.formData = {};
				$state.go('autosQuote.steps', {step: 1}, {reload: true, inherit: false});
    	}

      var queryParam = $location.search()

      if (queryParam.quoteId) {
        autosFactory.getDocument(queryParam.quoteId).then(function(res) {
          $rootScope.dataFromInspec = _.assign({}, res.Data, { vehicleLicensePlate: queryParam.placa, requestId: queryParam.requestId });
          $state.go('autosQuote.steps', {step: 1}, {reload: true, inherit: false});
        }).catch(function (err) {
          console.error(err);
        })
      }
    }])

});

