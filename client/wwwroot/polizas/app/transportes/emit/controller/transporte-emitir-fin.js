(function($root, deps, action) {
	define(deps, action);
})(this, ['angular', 'constants', 'helper', '/polizas/app/transportes/emit/service/transporteEmitFactory.js'
, '/scripts/mpf-main-controls/components/modalAssessment/component/modalAssessment.js'], function(angular, constants, helper){
	angular.module('appTransportes').controller('transporteEmitFin', ['$scope', 'transporteEmitFactory', '$state', '$uibModal',function($scope, transporteEmitFactory, $state, $uibModal) {
		// var _self = $scope;
		console.log("$scope.encuesta", $scope.encuesta);
		if($scope.encuesta){
			if($scope.encuesta.mostrar == 1){
				mostrarEncuesta();
			}
		}

		function mostrarEncuesta(){
			console.log("$scope.encuesta", $scope.encuesta);
			$scope.encuesta.tipo = 'P';
			$scope.dataConfirmation = {
			  save:false,
			  valor: 0,
			  encuesta: $scope.encuesta
			};
			var vModalConfirmation = $uibModal.open({
			  backdrop: 'static', // background de fondo
        	  keyboard: false,
			  scope: $scope,
			  // size: 'lg',
			  template : '<mpf-modal-assessment data="dataConfirmation" close="close()"></mpf-modal-assessment>',
			  controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
				//CloseModal
				$scope.close = function () {
				  $uibModalInstance.close();
				};
			  }]
			});
			vModalConfirmation.result.then(function(){
			},function(){
			});
		}
	}]);
});