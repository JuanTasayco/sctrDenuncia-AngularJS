/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpDocumentValidator
 * @restrict C
 * @param {string} mpDocumentValidator receives a string with the type of validation.
 * @description
 * Directive at level of input that implements the DocumentValidator service.
 * @example
   <doc:example module="mpDocumentValidator">
    <doc:source>
    input.form-control(type="text", name="dni", mp-document-validator="'nif'", placeholder="00000000X", ng-model="documentValidator.dni", required)
    </doc:source>
   </doc:example>
 */
/*global angular*/
angular.module('mpDocumentValidator', [])

    .directive('mpDocumentValidator', ['DocumentValidator', function (DocumentValidator) {
            return {
                scope: {
                    typeDocument: '=mpDocumentValidator'
                },
                require: 'ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {

                    function validateDocument(value) {
                        return DocumentValidator[scope.typeDocument](value);
                    }
                    scope.$watch(function () {
                        return ngModelCtrl.$modelValue;
                    }, function (newValue) {
                        if (!angular.isUndefined(newValue)) {
                            ngModelCtrl.$setValidity('document', validateDocument(newValue));
                        }
                    });
                }
            };
        }]);
