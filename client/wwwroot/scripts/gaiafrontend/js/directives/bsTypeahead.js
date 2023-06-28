/*global angular, _ */
angular.module('bsTypeahead', ['mgcrea.ngStrap'])
    .config(['$provide', function($provide) {

        $provide.decorator('$typeahead', function ($delegate, $timeout) {
            var $typeahead = $delegate;

            function newTypeaheadFactory(element, controller, config) {
                var $typeaheadInstance = $typeahead.apply(this, arguments),
                    options = angular.extend({}, $typeahead.defaults, config),
                    scope = $typeaheadInstance.$scope,
                    parentScope = config.scope;

                $typeaheadInstance.select = function(index) {
                    var value = scope.$matches[index].label.length !== 0 && index !== 0 ? scope.$matches[index].value : scope.$matches[index].label;
                    if (scope.$matches[index].label.length !== 0 && scope.$matches[index].value !== 0) {
                        controller.$setViewValue(value);
                        controller.$render();
                        scope.$resetMatches();
                        if (parentScope) parentScope.$digest();
                        // Emit event
                        scope.$emit(options.prefixEvent + '.select', value, index);
                    } else {
                        controller.$setViewValue(value);
                        controller.$modelValue = undefined;
                    }

                };

                $typeaheadInstance.$onKeyDown = function(evt) {

                    if (!/^(38|40|13)$/.test(evt.keyCode)) return;

                    if ($typeaheadInstance.$isVisible()) {
                        evt.preventDefault();
                        evt.stopPropagation();

                        $timeout(function () {
                            // Select with enter
                            if ((evt.keyCode === 13) && scope.$matches.length) {
                                return scope.$select(scope.$activeIndex);
                            }

                            // Navigate with keyboard
                            else if (evt.keyCode === 38 && scope.$activeIndex > 0) scope.$activeIndex--;
                            else if (evt.keyCode === 40 && scope.$activeIndex < scope.$matches.length - 1) scope.$activeIndex++;
                            else if (angular.isUndefined(scope.$activeIndex)) scope.$activeIndex = 0;
                        });
                    }
                };

                return $typeaheadInstance;
            }
            newTypeaheadFactory.defaults = $typeahead.defaults;
            newTypeaheadFactory.defaults.minLength = 0;

            return newTypeaheadFactory;
        });

        $provide.decorator('bsTypeaheadDirective', function($delegate, $window, $parse, $q, $typeahead, $parseOptions) {
            var bsTypeaheadDirective = $delegate[0];

            var defaults = $typeahead.defaults;

            bsTypeaheadDirective.compile = function() {
                return function(scope, element, attr, controller) {
                    // Directive options
                    var options = {
                        scope: scope
                    };
                    angular.forEach(['placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'template', 'filter', 'limit', 'minLength', 'watchOptions', 'selectMode', 'comparator', 'id'], function(key) {
                        if (angular.isDefined(attr[key])) options[key] = attr[key];
                    });

                    // Build proper ngOptions
                    var filter = options.filter || defaults.filter;
                    var limit = options.limit || defaults.limit;

                    var comparator = options.comparator || defaults.comparator;

                    var ngOptions = attr.ngOptions;
                    if (filter) ngOptions += ' | ' + filter + ':$viewValue';
                    if (limit) ngOptions += ' | limitTo:' + limit;
                    if (comparator) ngOptions += ':' + comparator;

                    var parsedOptions = $parseOptions(ngOptions);

                    parsedOptions.displayValue = function(modelValue) {
                        var valuesFn = $parse(parsedOptions.$match[7]),
                            values = valuesFn(options.scope),
                            valueName = parsedOptions.$match[4] || parsedOptions.$match[6],
                            valueFn = $parse(parsedOptions.$match[2] ? parsedOptions.$match[1] : valueName),
                            displayFn = $parse(parsedOptions.$match[2] || parsedOptions.$match[1]),
                            scope = {},
                            value = _.find(values, function (val) {
                                scope[valueName] = val;
                                return _.isEqual(valueFn(scope), modelValue);
                            });
                        scope[valueName] = value;
                        //TODO. REVIEW THIS MESS
                        return displayFn(scope);
                    };

                    parsedOptions.saveValue = function (viewValue) {
                        var valuesFn = $parse(parsedOptions.$match[7]),
                            vals = valuesFn(options.scope),
                            valueName = parsedOptions.$match[4] || parsedOptions.$match[6],
                            valueFn = $parse(parsedOptions.$match[2] ? parsedOptions.$match[1] : valueName),
                            displayFn = $parse(parsedOptions.$match[2] || parsedOptions.$match[1]),
                            scope = {},
                            value = _.find(vals, function (val) {
                                scope[valueName] = val;
                                if (typeof(viewValue) !== 'string'){
                                    return _.isEqual(displayFn(scope), viewValue);
                                }else{
                                    if(displayFn(scope) && viewValue){
                                        return _.isEqual(displayFn(scope).toLowerCase(), viewValue.toLowerCase());
                                    }else{
                                        return '';
                                    }
                                }
                            });
                            if (typeof(viewValue) !== 'string' && !angular.isUndefined(viewValue)){
                                element[0].value = viewValue;
                            } else if (displayFn(scope) && viewValue && _.isEqual(displayFn(scope).toLowerCase(), viewValue.toLowerCase())){
                                element[0].value = displayFn(scope);
                            }
                            scope[valueName] = value;
                            //FIX to solve when de model selected is 0
                            return valueFn(scope) === 0 ? 0 : (valueFn(scope) || viewValue)
                    }

                    // Initialize typeahead
                    var typeahead = $typeahead(element, controller, options);

                    // Watch options on demand
                    if (options.watchOptions) {
                        // Watch ngOptions values before filtering for changes, drop function calls
                        var watchedOptions = parsedOptions.$match[7].replace(/\|.+/, '').replace(/\(.*\)/g, '').trim();
                        scope.$watch(watchedOptions, function() {
                            // console.warn('scope.$watch(%s)', watchedOptions, newValue, oldValue);
                            parsedOptions.valuesFn(scope, controller).then(function(values) {
                                typeahead.update(values);
                                controller.$render();
                            });
                        }, true);
                    }

                    // Watch model for changes
                    scope.$watch(attr.ngModel, function(newValue) {
                        // console.warn('$watch', element.attr('ng-model'), newValue);
                        scope.$modelValue = newValue; // Publish modelValue on scope for custom templates
                        parsedOptions.valuesFn(scope, controller)
                            .then(function(values) {
                                // Prevent input with no future prospect if selectMode is truthy
                                // @TODO test selectMode
                                if (options.selectMode && !values.length && newValue.length > 0) {
                                    controller.$setViewValue(controller.$viewValue.substring(0, controller.$viewValue.length - 1));
                                    return;
                                }

                                var isVisible = typeahead.$isVisible();
                                if (isVisible) typeahead.update(values);
                                // Do not re-queue an update if a correct value has been selected
                                if (values.length === 1 && values[0].value === newValue) return;
                                if (!isVisible) typeahead.update(values);
                                // Queue a new rendering that will leverage collection loading
                                // controller.$render();
                                if(!angular.isUndefined(newValue) && newValue.length > 0){
                                    //setTimeout(function(){element[0].value = newValue;}, 1);
                                    controller.$viewValue = newValue;
                                }
                            });
                    });

                    // modelValue -> $formatters -> viewValue
                    controller.$formatters.push(function(modelValue) {
                        var displayValue = parsedOptions.displayValue(modelValue);
                        return displayValue === undefined ? '' : displayValue;
                    });

                    controller.$parsers.push(function (viewValue) {
                        var modelValue = parsedOptions.saveValue(viewValue);
                        return modelValue === undefined ? '' : modelValue;
                    });

                    // Model rendering in view
                    function render() {
                        // console.warn('$render', element.attr('ng-model'), 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue, 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue);
                        if (controller.$isEmpty(controller.$viewValue)) return element.val('');
                        var index = typeahead.$getIndex(controller.$modelValue);
                        var selected = angular.isDefined(index) ? typeahead.$scope.$matches[index].label : controller.$modelValue;
                        selected = angular.isObject(selected) ? parsedOptions.displayValue(selected) : (angular.isDefined(index) ? selected : (!angular.isObject(selected)) ? controller.$modelValue : '');
                        element.val(selected || selected === 0 ? selected.toString().replace(/<(?:.|\n)*?>/gm, '').trim() : '');
                    }

                    // IMPORTANT! When the directive is manually compiled controller.$render is overwritten by AngularJS input[type="text"] directive
                    // This code solve the problem. REVIEW!!!
                    scope.$watch(function() {
                        return controller.$render;
                    }, function($render) {
                        if ($render !== render) controller.$render = render;
                    });

                    // Garbage collection
                    scope.$on('$destroy', function() {
                        if (typeahead) typeahead.destroy();
                        options = null;
                        typeahead = null;
                    });
                };
            }
            return $delegate;
        });
    }])
    // FIX Trello card: https://trello.com/c/wnrPJ4mi
    .run(['$templateCache', function($templateCache) {
        $templateCache.put('typeahead/typeahead.tpl.html', '<ul tabindex="-1" class="typeahead dropdown-menu" ng-show="$isVisible()" role="select"><li role="presentation" ng-repeat="match in $matches" ng-class="{active: $index == $activeIndex}"><a role="menuitem" tabindex="-1" ng-mousedown="$select($index, $event)" ng-bind="match.label"></a></li></ul>');
    }]);
