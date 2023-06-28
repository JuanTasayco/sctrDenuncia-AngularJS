(function($root, deps, action) {
	define(deps, action);
})(this, ['angular', 'constants', 'helper'], function(angular, constants, helper) {

	var app = angular.module("appVida");

	app.component('referidos', {
		bindings: {
			data : "="
		},
		templateUrl: 'app/vida/emit/component/referido/referido.html',

		controller: function() {
			var _self = this;
			_self.current = {
				contractor :{},
				contractorAddress:{}
			};
			_self.editing = false;
			_self.itemEditing = null;

			if (!_self.data) {
				_self.data = [];
			}

			_self.currentStep = _self.data.length == 0 ? 1 : 2;

			_self.nuevoReferido = function() {
				_self.current = {};
				_self.currentStep = 1;
			}

			_self.cancelarReferido = function() {
				_self.currentStep = _self.data.length == 0 ? 1 : 2;
			}

			_self.guardarReferido = function() {
				_self.formulario.markAsPristine();
				if (!_self.formulario.$valid) {
					return;
				}
				if (!_self.editing) {
					_self.data.push(_self.current);
				} else {
					angular.copy(_self.current, _self.itemEditing);
				}

				_self.currentStep = _self.data.length == 0 ? 1 : 2;
			}

			_self.editarReferido = function(item) {
				_self.editing = true;
				_self.itemEditing = item;
				_self.current = angular.copy(item);
				_self.currentStep = 1;
			}

			_self.borrarReferido = function(index) {
				_self.data.splice(index, 1);
				_self.current = {};
				_self.currentStep = _self.data.length == 0 ? 1 : 2;
			}
		}
	});
});