/*global angular */
angular.module('mpTypeahead', ['utils'])
    /*TODO: Use $typeahead to build a custom directive. Do not wrap bsTypeahead.*/
    /**
     * @doc-component directive
     * @name gaiafrontend.directive.mpTypeahead
     * @param {expression} mp-typeahead-model The selected suggestion will be assigned to the result of the expression.
     * @param {expression} mp-typeahead-options Expression `ngOptions` alike to dynamically generate suggestions. See [ngOptions](https://code.angularjs.org/1.2.16/docs/api/ng/directive/select#-ngoptions-) documentation for more info.
     * @param {expression=} mp-typeahead-config The result of evaluating this expression should be an options object. Supported options are listed [here](http://mgcrea.github.io/angular-strap/##typeaheads-usage).
     * @description
     * This directive allows you to display an input that shows suggestions while typing.
     *
     * This directive wraps the AngularStrap `bs-typeahead` directive.
     * @example
       <doc:example>
        <doc:source>
        script
            function TypeaheadCtrl ($scope, $http) {
                $scope.selectedState = '';
                $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

                $scope.selectedIcon = '';
                $scope.icons = [{
                    value: 'Gear',
                    label: '<i class="glyphicon glyphicon-cog"></i> Gear'
                }, {
                    value: 'Globe',
                    label: '<i class="glyphicon glyphicon-globe"></i> Globe'
                }, {
                    value: 'Heart',
                    label: '<i class="glyphicon glyphicon-heart"></i> Heart'
                }, {
                    value: 'Camera',
                    label: '<i class="glyphicon glyphicon-camera"></i> Camera'
                }];

                $scope.selectedAddress = '';
                $scope.getAddress = function(viewValue) {
                    var params = {
                        address: viewValue,
                        sensor: false
                    };
                    return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
                        params: params
                    }).then(function(res) {
                        return res.data.results;
                    });
                };

            }
            TypeaheadCtrl.$inject = ['$scope', '$http'];
        div(ng-controller="TypeaheadCtrl")
            form.form-horizontal(role="form", name="typeaheadForm")
                .row
                    .form-group.col-md-6
                        label.control-label.col-md-2(for="state") State
                        .validable.col-md-10
                            input.form-control(type="text", id="state", name="state", placeholder="Enter state", mp-typeahead, mp-typeahead-model="selectedState", mp-typeahead-options="state for state in states")
                    .form-group.col-md-6
                        label.control-label.col-md-2(for="icon") Icon
                        .validable.col-md-10
                            input.form-control(type="text", id="icon", name="icon", placeholder="Enter icon", required="required", mp-typeahead, mp-typeahead-model="selectedIcon", mp-typeahead-options="icon as icon.label for icon in icons", mp-typeahead-config="{minLength: 0, html: 1}")
                .row
                    .form-group.col-md-6
                        label.control-label.col-md-2(for="address") Address
                        .validable.col-md-10
                            input.form-control(type="text", id="address", name="address", placeholder="Enter address", mp-typeahead, mp-typeahead-model="selectedAddress", mp-typeahead-options="address.formatted_address as address.formatted_address for address in getAddress($viewValue)")
                        p.col-md-offset-2.col-md-10.help-block (async via maps.googleapis.com)
        </doc:source>
       </doc:example>
     */
    .directive('mpTypeahead', ['$parse', '$compile', 'Utils', function ($parse, $compile, Utils) {
        return {
            priority: 9999,
            terminal: true,
            link: function (scope, element, attrs) {
                var config = $parse(attrs.mpTypeaheadConfig)(scope) || {},
                    attributes = $parse(attrs.mpTypeaheadAttributes)(scope) || {};

                element.attr('bs-typeahead', attrs.mpTypeahead);
                element.attr('ng-model', attrs.mpTypeaheadModel);
                element.attr('ng-options', attrs.mpTypeaheadOptions);

                // FIX: IE8 needs a minimum delay to work as intended
                config.delay = !angular.isDefined(config.delay) || +config.delay < 100 ? '100' : config.delay;
                // FIX: Watch options when used by mpOptionsList
                config.watchOptions = !!attrs.mpOptionsList;
                angular.forEach(config, function (value, option) {
                    element.attr('data-' + Utils.string.toHyphens(option), value);
                });

                // TODO: REVIEW
                // Because of mpOptionsList directive
                // If mpOptionsList assign these attrs they will be compiled twice
                // and some directives might not work as intended (ngClick expression will be evaluated twice)
                angular.forEach(attributes, function (value, attr) {
                    element.attr(Utils.string.toHyphens(attr), value);
                });

                angular.forEach(attrs.$attr, function (attr) {
                    if (attr.indexOf('mp-typeahead') > -1) element.removeAttr(attr);
                });

                $compile(element)(scope);
            }
        };
    }]);
