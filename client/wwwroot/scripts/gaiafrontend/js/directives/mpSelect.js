/*global angular */
angular.module('mpSelect', ['utils'])
    /*TODO: Use $select to build a custom directive. Do not wrap bsTypeahead.*/
    /**
     * @doc-component directive
     * @name gaiafrontend.directive.mpSelect
     * @param {expression} mp-select-model The selected option will be assigned to the result of the expression.
     * @param {expression} mp-select-options Expression `ngOptions` alike to dynamically generate options. See [ngOptions](https://code.angularjs.org/1.2.16/docs/api/ng/directive/select#-ngoptions-) documentation for more info.
     * @param {expression=} mp-select-config The result of evaluating this expression should be an options object. Supported options are listed [here](http://mgcrea.github.io/angular-strap/##selects-usage).
     * @description
     * This directive allows you to display a dropdown component as a select .
     *
     * This directive wraps the AngularStrap `bs-select` directive.
     * @example
       <doc:example>
        <doc:source>
        script
            function SelectCtrl($scope) {
                $scope.selectedIcon = '';
                $scope.selectedIcons = ['Globe', 'Heart'];
                $scope.icons = [{
                    value: 'Gear',
                    label: '<span class="glyphicon glyphicon-cog"></span> Gear'
                }, {
                    value: 'Globe',
                    label: '<span class="glyphicon glyphicon-globe"></span> Globe'
                }, {
                    value: 'Heart',
                    label: '<span class="glyphicon glyphicon-heart"></span> Heart'
                }, {
                    value: 'Camera',
                    label: '<span class="glyphicon glyphicon-camera"></span> Camera'
                }];
            }
            SelectCtrl.$inject = ['$scope'];
        div(ng-controller="SelectCtrl")
            form.form-horizontal(role="form", name="selectForm")
                .row
                    .form-group.col-md-6
                        label.control-label.col-md-2(for="select1") Single:
                        .validable.col-md-10
                            data ={delay: 10, html: 1, placeholder: "Choose bro'"}
                            select.form-control(type="button", id="select1", name="select1", required="required", mp-select, mp-select-model="selectedIcon", mp-select-options="icon.value as icon.label for icon in icons", mp-select-config="#{JSON.stringify(data)}")
                    .form-group.col-md-6
                        label.control-label.col-md-2(for="select2") Multiple:
                        .validable.col-md-10
                            select.form-control(type="button", id="select2", name="select2", required="required", mp-select, mp-select-model="selectedIcons", mp-select-options="icon.value as icon.label for icon in icons", mp-select-config="{multiple: 1, html: 1}")

        </doc:source>
       </doc:example>
     */
    .directive('mpSelect', ['$parse', '$compile', 'Utils', function ($parse, $compile, Utils) {
        return {
            link: function(scope, element, attributes) {
                var config,
                    attrs;

                if (angular.isUndefined(attributes.bsSelect)) {
                    config = $parse(attributes.mpSelectConfig)(scope);
                    // FIX: IE8 needs a minimum delay to work as intended
                    config = config || {};
                    config.delay = !angular.isDefined(config.delay) || parseInt(config.delay, 10) < 100 ? '100' : config.delay;
                    config.trigger = 'focus';
                    // TODO: REVIEW
                    // Because of mpOptionsList directive
                    // If mpOptionsList assign these attributes they will be compiled twice
                    // and some directives might not work as intended (ngClick expression will be evaluated twice)
                    attrs = $parse(attributes.mpSelectAttributes)(scope);
                    attrs = attrs || {};
                    angular.forEach(attrs, function (value, attr) {
                        element.attr(Utils.string.toHyphens(attr), value);
                    });

                    element
                        .addClass('select')
                        .attr('bs-select', attributes.mpSelect)
                        .attr('ng-model', attributes.mpSelectModel)
                        .attr('ng-options', attributes.mpSelectOptions);

                    angular.forEach(config, function (value, option) {
                        element.attr('data-' + Utils.string.toHyphens(option), value);
                    });

                    $compile(element)(scope);
                }
            }
        };
    }]);
