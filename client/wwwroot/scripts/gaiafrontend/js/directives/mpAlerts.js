/*global angular */
angular.module('mpAlerts', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.alertsSrv
     * @description
     * This service allows you to store alerts.
     *
     * This service is used by `mpAlert` directive to display alerts.
     * @example
       <doc:example>
        <doc:source>
        script
            function MyCtrl($scope, AlertsSrv) {
                $scope.addError = function () {
                    var alert = {
                        title: "Error",
                        description: "Validation error",
                        details: ["ZIP code is not valid."]
                    };

                    AlertsSrv.danger(alert, alert);
                };
            }
            MyCtrl.$inject = ["$scope", "AlertsSrv"];
        div(ng-controller="MyCtrl", ng-hide="hide")
            div(mp-alerts)
            p
                button.btn.btn-default(type="button", ng-click="addError()") Add error
        </doc:source>
       </doc:example>
     */
    .factory('AlertsSrv', ['MpAlertConfig', function (MpAlertConfig) {
        var alerts = [];

        function addAlert(alert) {
            alerts.unshift(alert);
        }

        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.alertsSrv
         * @name gaiafrontend.service.alertsSrv#Alert
         * @param {string=} title Alert title.
         * @param {string=} description Alert description.
         * @param {array=} errors Error objects array. Each error object should have these properties: `form`, `formControl` and `description`
         * @return {object} An Alert instance with the following methods. `addError(description[, form, formControl])` Adds a validation error to the Alert. `form` is the form name. `formControl` is the control (input, textarea, select) name. `description` is the text to display. `clearErrors()` Clear the Alert errors.
         * @description
         * This is an Alert constructor.
         */
        function Alert(title, description) {
            this.title = title || '';
            this.description = description || '';
            this.errors = [];
        }
        Alert.prototype.addError = function (description, form, formControl) {
            var error = {
                form: form,
                formControl: formControl,
                description: description
            };

            this.errors.push(error);

            return error;
        };
        Alert.prototype.clearErrors = function () {
            return this.errors.splice(0, this.errors.length);
        };
        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.alertsSrv
         * @name gaiafrontend.service.alertsSrv#success
         * @param {object} content Object containing the success alert content.
         * @param {expression=} code Expression that once evaluated will be displayed as code inside the alert box.
         * @description
         * This method adds a success alert.
         */
        function success(content, code) {
            var alert = {};
            alert.type = MpAlertConfig.types.success;
            alert.content = content;
            if (code) {
                alert.code = code;
            }

            addAlert(alert);
        }

        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.alertsSrv
         * @name gaiafrontend.service.alertsSrv#info
         * @param {object} content Object containing the info alert content.
         * @param {expression=} code Expression that once evaluated will be displayed as code inside the alert box.
         * @description
         * This method adds an info alert.
         */
        function info(content, code) {
            var alert = {};
            alert.type = MpAlertConfig.types.info;
            alert.content = content;
            if (code) {
                alert.code = code;
            }

            addAlert(alert);
        }

        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.alertsSrv
         * @name gaiafrontend.service.alertsSrv#warning
         * @param {object} content Object containing the warning alert content.
         * @param {expression=} code Expression that once evaluated will be displayed as code inside the alert box.
         * @description
         * This method adds a warning alert.
         */
        function warning(content, code) {
            var alert = {};
            alert.type = MpAlertConfig.types.warning;
            alert.content = content;
            if (code) {
                alert.code = code;
            }

            addAlert(alert);
        }


        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.alertsSrv
         * @name gaiafrontend.service.alertsSrv#danger
         * @param {object} content Object containing the danger alert content.
         * @param {expression=} code Expression that once evaluated will be displayed as code inside the alert box.
         * @description
         * This method adds a danger alert.
         */
        function danger(content, code) {
            var alert = {};
            alert.type = MpAlertConfig.types.danger;
            alert.content = content;
            if (code) {
                alert.code = code;
            }

            addAlert(alert);
        }


        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.alertsSrv
         * @name gaiafrontend.service.alertsSrv#get
         * @return {array} An array with the current alerts.
         * @description
         * This method returns an array with all the alerts stored.
         */
        function getAlerts() {
            return alerts;
        }

        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.alertsSrv
         * @name gaiafrontend.service.alertsSrv#remove
         * @param {integer} index Index of the alert we want to remove
         * @description
         * This method removes the indicated alert from the stored alerts..
         */
        function removeAlert(index) {
            alerts.splice(index, 1);
        }

        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.alertsSrv
         * @name gaiafrontend.service.alertsSrv#clear
         * @description
         * This method clear all alerts stored.
         */
        function clearAlerts() {
            alerts.splice(0, alerts.length);
        }

        return {
            Alert: Alert,
            success: success,
            info: info,
            warning: warning,
            danger: danger,
            error: danger,
            get: getAlerts,
            remove: removeAlert,
            clear: clearAlerts
        };
    }])
    /**
        * @doc-component directive
        * @name gaiafrontend.directive.mpAlerts
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
    .directive('mpAlerts', ['AlertsSrv', '$rootScope', 'Events', function (AlertsSrv, $rootScope, Events) {
        return {
            templateUrl: 'gaiafrontend/html/alerts.html',
            scope: true,
            link: function (scope, elem) {
                elem.addClass('mp-alerts');

                scope.alerts = AlertsSrv.get();

                scope.remove = AlertsSrv.remove;

                scope.clear = AlertsSrv.clear;

                scope.focusFormControl = function (form, formControl) {
                    if (form && formControl) {
                        $rootScope.$broadcast(Events.$formControlFocus(form + formControl));
                    }
                };

                scope.$on('$stateChangeSuccess', function() {
                    AlertsSrv.clear();
                });
            }
        };
    }]);
