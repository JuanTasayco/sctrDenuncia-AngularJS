/*global angular */
angular.module('form', ['ng'])
    .config(['$provide', function($provide) {

        function formDirectiveDecorator($delegate) {
            var formDirective = $delegate[0],
                formController = formDirective.controller;

            function indexOf(array, obj) {
                if (array.indexOf) return array.indexOf(obj);

                for (var i = 0; i < array.length; i++) {
                    if (obj === array[i]) return i;
                }
                return -1;
            }

            function arrayRemove(array, value) {
                var index = indexOf(array, value);
                if (index >= 0)
                    array.splice(index, 1);
                return value;
            }

            function newFormController() {
                var controls = [],
                    ctrl = this,
                    addControl,
                    removeControl;

                formController.apply(ctrl, arguments);

                addControl = ctrl.$addControl;
                ctrl.$addControl = function(control) {
                    addControl.apply(this, arguments);
                    controls.push(control);
                };

                removeControl = ctrl.$removeControl;
                ctrl.$removeControl = function(control) {
                    removeControl.apply(this, arguments);
                    arrayRemove(controls, control);
                };

                ctrl.$dirtify = function() {
                    angular.forEach(controls, function(control) {
                        if (control.$dirtify) {
                            control.$dirtify();
                        }
                    });
                };
            }

            newFormController.$inject = ['$element', '$attrs', '$scope', '$animate']

            formDirective.controller = newFormController;

            return $delegate;
        }

        formDirectiveDecorator.$inject = ['$delegate'];

        $provide.decorator('formDirective', formDirectiveDecorator);
    }])
