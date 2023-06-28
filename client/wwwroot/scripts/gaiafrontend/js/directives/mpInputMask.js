/*TODO: REVIEW*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpInputMask
 * @description
 * This directive will be used for add a mask to an input.
 * Default masking definitions
 *   9 : numeric
 *   a : alfabetic
 *   * : alfanumeric
 * @example
   <doc:example module="mpInputMask">
    <doc:source>
    form(ng-model="formInputMask")
    input#inputMask(type="text", mp-input-mask="aaaa-9999", name="inputMask")
    </doc:source>
   </doc:example>
 */
/*global angular */
angular.module('mpInputMask', [])
    .directive('mpInputMask', ['Loader', '$timeout',
        function(Loader, timeout) {
            return {
                require: 'ngModel',
                link: function(scope, elm, attrs, ctrl) {
                    var loadPlugin = Loader.load('jquery.inputmask.js'),
                        mask = attrs.mpInputMask;

                    function initMask() {
                        if(elm.inputmask) {
                          elm.inputmask(mask);
                        }
                        else {
                          timeout(function() { elm.inputmask(mask); }, 500);
                        }
                    }

                    loadPlugin.then(initMask);

                    elm.on('keyup', function() {
                        if(elm.val() === "") {
                            ctrl.$setViewValue("");
                            elm.change();
                        }
                    });

                }
            };
        }]);
