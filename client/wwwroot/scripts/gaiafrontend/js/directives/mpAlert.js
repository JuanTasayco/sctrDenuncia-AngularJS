/*global angular */
angular.module('mpAlert', [])
    .constant('MpAlertConfig', {
        types: {
            success: 'success',
            info: 'info',
            warning: 'warning',
            danger: 'danger'
        }
    })
    .controller('MpAlertCtrl', ['$scope', '$attrs', 'MpAlertConfig', function ($scope, $attrs, MpAlertConfig) {
        $scope.defaultType = MpAlertConfig.types.warning;
        $scope.closeable = $attrs.hasOwnProperty('mpAlertClose');
        $scope.hasCodeToDisplay = $attrs.hasOwnProperty('mpAlertCode') && $scope.code();
    }])
    /**
        * @doc-component directive
        * @name gaiafrontend.directive.mpAlert
        * @description
        * This component has been migrated to "GAIA Site"
        * There you will find its documentation and several examples.
        * "GAIA Site" is an application created by the Architecture Area to learn and play with GAIA. Is available in RAS. Direct links are available below in this page.
        * @example
        <doc:example>
             <doc:source>
             label GAIA site direct links are:
             a(href='https://wportalinterno.es.mapfre.net/com.ibm.ram.repository.web/faces/_rlvid.jsp?_rap=!assetDetails&_rvip=/home.jsp&guid=13A33828-B921-8DC5-DEDA-8B8D7C0EBC81') Intranet /
             a(href='https://wportalinterno.mapfre.com/com.ibm.ram.repository.web/faces/_rlvid.jsp?_rap=!assetDetails&_rvip=/home.jsp&guid=13A33828-B921-8DC5-DEDA-8B8D7C0EBC81') Internet
             </doc:source>
        </doc:example>
    */
    .directive('mpAlert', function () {
        return {
            templateUrl: 'gaiafrontend/html/alert.html',
            controller: 'MpAlertCtrl',
            transclude: true,
            replace: true,
            scope: {
                type: '@mpAlert',
                close: '&mpAlertClose',
                code: '&mpAlertCode'
            }
        };
    });

/*    LET THIS COMMENT HERE UNTIL ERROR DATA MODEL HAS BEEN REVIEWED*/
/*    .directive('mpAlert', ['$window', 'AlertSrv',
        function($window, AlertSrv) {
            return {
                templateUrl: "gaiafrontend/html/alert.html",

                link: function(scope) {
                    scope.alert = AlertSrv.getAlert();
                    scope.removeAlert = AlertSrv.removeAlert;
                    scope.$watch('alert', function (alert) {
                        if (alert) {
                            $window.scrollTo(0, 0);
                        }
                    }, true);
                }
            };
        }])
    .directive('mpValidationError', function() {
        return {
            restrict: 'A',
            replace: true,
            template: '<a href=""></a>',
            link: function(scope, elem, attrs) {
                var errorText = attrs.mpValidationError,
                    formName = attrs.mpValidationErrorFormName,
                    inputName = attrs.mpValidationErrorInputName,
                    formElem = formName ? angular.element('form[name="' + formName + '"]') : undefined,
                    formScope = formElem && formElem.length ? formElem.scope() : undefined,
                    inputElem = formElem && formElem.length ? formElem.find('[name="' + inputName + '"]') : undefined;

                function forceFormValidationErrorBehaviour() {
                    formScope[formName][inputName].$setValidity('server', false);
                    angular.extend(formScope[formName][inputName], {$errorText: errorText});

                    inputElem.on('focus', function () {
                        scope.$apply(function () {
                            formScope[formName][inputName].$setValidity('server', true);
                        });
                    });
                }

                function addValidationErrorLinkBehaviour() {
                    elem.text(errorText)
                        .on('click', function(ev) {
                            ev.preventDefault();

                            if (inputElem && inputElem.length) {
                                inputElem.focus();
                            }
                        });
                }

                forceFormValidationErrorBehaviour();
                addValidationErrorLinkBehaviour();
            }
        };
    });
*/
