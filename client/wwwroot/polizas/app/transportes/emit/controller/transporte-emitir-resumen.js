(function($root, deps, action) {
	define(deps, action);
})(this, ['angular', 'constants', 'helper',  '/scripts/mpf-main-controls/components/modalConfirmation/component/modalConfirmation.js'], function(angular, constants, helper){
	angular.module('appTransportes').controller('transporteEmitSummary', ['$scope', '$state', '$uibModal', 'gaService', function($scope, $state, $uibModal, gaService) {
		var _self = $scope;

		console.log("Llega data transporte-emitir-resumen: ", $scope);

		$scope.onEmitirConfirmacion = function() {
			$scope.dataConfirmation = {
	          save:false,
	          titulo: "emitir la póliza",
	          cancelButton: "Seguir editando",
	          saveButton: "Emitir"
	        };
			var vModalConfirmation = $uibModal.open({
				backdrop: true, // background de fondo
				backdropClick: true,
				dialogFade: false,
				keyboard: true,
				scope: $scope,
				// size: 'lg',
				template : '<mpf-modal-confirmation data="dataConfirmation" close="close()"></mpf-modal-confirmation>',
				controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
					//CloseModal
					$scope.close = function () {
						if (_self.dataConfirmation.save == true) {
              gaService.add({ gaCategory: 'Emisa - Transporte', gaAction: 'MPF - Emisión', gaLabel: 'Botón: Emitir' });
							_self.$parent.guardarPoliza();
						}
						$uibModalInstance.close();
					};
				}]
			});
		}
	}]);
});
