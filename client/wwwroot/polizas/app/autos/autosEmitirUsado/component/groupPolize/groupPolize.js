'use strict';

define([
	'angular', 'constants', '/polizas/app/autos/autosEmitirUsado/service/usedCarEmitFactory.js'
], function(angular, constants){

	var appAutos = angular.module('appAutos');

	appAutos.controller('ctrlGroupPolize', ['$scope', '$window', '$state', 'usedCarEmitFactory', 'mpSpin', function($scope, $window, $state, usedCarEmitFactory, mpSpin){

		var _self = this;

		function initVarGroupPolize(){
			if (typeof _self.data !== 'undefined'){
				_self.data.errorGroupPolize = false;
				_self.data.showGroupPolize = false;
			}
		}

		function clearGroupPolize(){
			if (typeof _self.data !== 'undefined') {
				_self.data = {};
				_self.data.groupPolize = '';
				_self.data.groupPolizeDescription = '';
			}
		}

		_self.searchGroupPolize = function(groupPolize){
			clearGroupPolize();
			initVarGroupPolize();
			if ((typeof groupPolize !== 'undefined') && groupPolize != ''){
				var paramsGroupPolize = {
					codGrupoPoliza: groupPolize
				}
				var methodName =_self.enableV2 === true ? "getGroupPolizev2" : "getGroupPolize"

				usedCarEmitFactory[methodName](paramsGroupPolize).then(function(response){
					_self.data ={}
					if (response.OperationCode == constants.operationCode.success){

						_self.data.groupPolize = response.Data.PolizaGrupo;
						_self.data.groupPolizeDescription = response.Data.NombrePolizaGrupo;
						_self.data.cantidadDias = response.Data.CantidadDias;
						_self.data.showGroupPolize = true;
					}else{
						//204 - éxito, pero no existe NombrePoliza
						if (typeof _self.data !== 'undefined') _self.data.errorGroupPolize = true;
					}
				});
			} else {
				//204 - éxito, pero no existe NombrePoliza
				if (typeof _self.data !== 'undefined') _self.data.errorGroupPolize = true;
			}
		};

		_self.closeGroupPolize = function(){
			clearGroupPolize();
			initVarGroupPolize();
		};

	}]).component('mpfGroupPolize',{
		templateUrl: '/polizas/app/autos/autosEmitirUsado/component/groupPolize/groupPolize.html',
		controller: 'ctrlGroupPolize',
		bindings: {
			data: '=',
			enableV2:"=?"
		}
	})


});
