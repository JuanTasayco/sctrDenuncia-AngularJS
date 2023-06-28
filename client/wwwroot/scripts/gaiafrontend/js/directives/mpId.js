/*global angular */
/*DEPRECATED*/
angular.module('mpId', [])
    .directive('mpId', function() {
        //DNI mask:   elm.attr("ui-mask","99999999-a");
        //NIE mask:   elm.attr("ui-mask","a9999999-a");

        function sendValidity(valid, ctrl) {
            ctrl.$setValidity('identity', valid);
        }

        function validDni(dni) {
            var chararter = dni.substr(8),
                dniNumber = dni.substr(0, 8),
                lockup = 'TRWAGMYFPDXBNJZSQVHLCKE';
            return angular.uppercase(chararter) === lockup.charAt(dniNumber % 23);
        }

        function validNie() {
            // var firstChararter = nie.substr(0, 0),
            //     lastChararter = nie.substr(8),
            //     nieNumber = nie.substr(0, 8);
            return true; // esperando validacion
        }

        function validFormat(text) {

            if (text === undefined || text === null) {
                return false;
            }
            if (text.match(/^\d{8}[a-zA-Z]$/)) {
                return validDni(text);
            }
            if (text.match(/^[a-zA-Z]\d{7}[a-zA-Z]$/)) {
                //return 'NIE';
                return validNie(text);
            } else {
                return false; //return 'FORMAT ERROR';
            }
        }

        return {
            restrict: 'A',
            require: 'ng-model',
            link: function(scope, elm, attrs, ctrl) {
                var valid;

                function toUser(modelvalue) {
                    valid = validFormat(modelvalue);
                    sendValidity(valid, ctrl);

                    return valid ? modelvalue : undefined;
                }

                function fromUser(text) {
                    valid = validFormat(text);
                    sendValidity(valid, ctrl);

                    return valid ? text : undefined;
                }
                //sendValidity(valid)
                ctrl.$formatters.push(toUser);
                ctrl.$parsers.push(fromUser);

            }
        };
    });
