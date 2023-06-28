'use strict';

define([
	'angular', 'constants'
], function(angular, constants){

	var appControls = angular.module('mapfre.controls');

	appControls.controller('ctrlModalAssessment', ['$scope', '$window', '$state', '$timeout', 'proxyGeneral', 'mModalAlert', function($scope, $window, $state, $timeout, proxyGeneral, mModalAlert){

		var _self = this;
		_self.data.save = false;
		$scope.rating = 0;

		console.log("ctrlModalAssessment:", _self.data);

		if (!_self.data.saveButton) {
			_self.data.saveButton = "Guardar";
		}

		_self.save = function(){
			if($scope.rating > 0){
				_self.data.save = true;
				_self.data.valor = $scope.rating;
				saveAssest();
			}	
		}

		function saveAssest(){
			var paramsEncuesta = {
				valor: _self.data.valor,
				tipo: _self.data.encuesta.tipo, // C: Cottización, P: Poliza
				numOperacion: _self.data.encuesta.numOperacion,
				CodigoCompania: _self.data.encuesta.CodigoCompania,
				CodigoRamo: _self.data.encuesta.CodigoRamo,
				Pregunta: _self.data.encuesta.Pregunta
			  };
		
			  proxyGeneral.GuardarEncuesta(paramsEncuesta, true).then(function(response) {
				_self.close();
				if (response.OperationCode == constants.operationCode.success){
				  mModalAlert.showSuccess("Se ha guardado la encuesta satisfactoriamente.", "Encuesta").
					then(function() {
					  
					})
				}
			  }, function() {
				_self.close();
				mModalAlert.showWarning("Ha ocurrido un error al intentar guardar la encuesta", "Encuesta");
			  }); 
		}
	}]).controller("RatingStarsController", RatingStarsController)
	.component('mpfModalAssessment',{
		templateUrl: '/scripts/mpf-main-controls/components/modalAssessment/component/modalAssessment.html',
		controller: 'ctrlModalAssessment',
		bindings: {		
			data: '=',
			close: '&'
		}
	}).directive("mpfRatingStars", RatingStarsDirective)

	function RatingStarsController($scope, $attrs, $timeout) {
		var that = this;
		void 0 === that.readOnly && (that.readOnly = !1), that.initStarsArray = function() {
			that.starsArray = that.getStarsArray(), that.validateStars()
		}, that.getStarsArray = function() {
			for (var starsArray = [], index = 0; index < that.maxRating; index++) {
				var starItem = {
					index: index,
					"class": "rating__star ico-mapfre_start"
				};
				
				starsArray.push(starItem)
			}
			return starsArray
		}, that.setRating = function(rating) {
			that.readOnly || (that.rating = rating, that.validateStars(that.rating), $timeout(function() {
				that.onRating({
					rating: that.rating
				}), $scope.$apply()
			}))
		}, that.setMouseOverRating = function(rating) {
			that.readOnly || that.validateStars(rating)
		}, that.validateStars = function(rating) {
			if (that.starsArray && 0 !== that.starsArray.length) for (var index = 0; index < that.starsArray.length; index++) {
				var starItem = that.starsArray[index];
				rating - 1 >= index ? starItem["class"] = "rating__star ico-mapfre_start_active" : starItem["class"] = "rating__star ico-mapfre_start"
			}
		}
	}
	
	function RatingStarsDirective() {
		function link(scope, element, attrs, ctrl) {
			(!attrs.maxRating || parseInt(attrs.maxRating) <= 0) && (attrs.maxRating = "5"), scope.$watch("ctrl.maxRating", function(oldVal, newVal) {
				ctrl.initStarsArray()
			}), scope.$watch("ctrl.rating", function(oldVal, newVal) {
				ctrl.validateStars(ctrl.rating)
			})
		}
		return {
			restrict: "E",
			replace: !0,
			templateUrl: "/scripts/mpf-main-controls/components/modalAssessment/component/rating-start-directive.html",
			scope: {},
			
			controller: "RatingStarsController",
			controllerAs: "ctrl",
			bindToController: {
				maxRating: "@?",
				rating: "=?",
				readOnly: "=?",
				onRating: "&"
			},
			
			link: link
		}
	}
	
});


