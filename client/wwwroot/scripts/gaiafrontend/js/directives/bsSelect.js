/*global angular, _ */
angular.module('bsSelect', ['mgcrea.ngStrap'])
    .config(['$provide', function ($provide) {

        function $selectDecorator($delegate, $window, $timeout) {
            var $select = $delegate,
                isNative = /(ip(a|o)d|iphone|android)/ig.test($window.navigator.userAgent),
                isTouch = ('createTouch' in $window.document) && isNative;

            function newSelectFactory(element, controller, config) {
                var $selectInstance = $select.apply(this, arguments),
                    scope = $selectInstance.$scope,
                    options = angular.extend({}, $select.defaults, config),
                    _show = $selectInstance.show,
                    _hide = $selectInstance.hide,
                    stringToFind = '';

                scope.$selecting = function (index) {
                    return scope.$focusedIndex === index;
                }

                $selectInstance.$getIndex = function(value) {
                    var l = scope.$matches.length,
                        i = l;
                    if (!l) return;
                    for (i = l; i--;) {
                        if (_.isEqual(scope.$matches[i].value, value)) break;
                    }
                    if (i < 0) return;
                    return i;
                };

                function scrollOnKeyDown (element, keyPress) {
                    var itemHeight = element.find('li').outerHeight(),
                        dropdownHeight = $selectInstance.$element.height(),
                        currentItemTop = options.multiple ? scope.$focusedIndex * itemHeight : scope.$activeIndex * itemHeight,
                        minItemTopVisible = element.scrollTop(),
                        maxItemTopVisible = minItemTopVisible + dropdownHeight,
                        currentItemBottom = currentItemTop + itemHeight,
                        scrolling;

                    if (currentItemTop > minItemTopVisible && currentItemBottom < maxItemTopVisible) {
                        return;
                    } else if (keyPress === 38 && (currentItemBottom + dropdownHeight) > dropdownHeight) {
                        scrolling = currentItemBottom - itemHeight;
                    } else if (keyPress === 40 && dropdownHeight < currentItemBottom) {
                        scrolling = currentItemBottom - dropdownHeight;
                    }
                    element.scrollTop(scrolling);
                }

                $selectInstance.$onKeyDown = function(evt) {
                    if (evt.keyCode > 47 && evt.keyCode < 58 || evt.keyCode > 64 && evt.keyCode < 91 || evt.keyCode === 32) {
                        stringToFind += String.fromCharCode(evt.keyCode);
                        var arrElements = _.pluck(_.filter(scope.$matches, function(n) {return n}), 'label');
                        var indexToSelect = _.findIndex(arrElements, function(item) {
                          return item.toUpperCase().indexOf (stringToFind, 0) === 0;
                        });

                        if (indexToSelect !== -1){
                            $selectInstance.select(indexToSelect);
                            $selectInstance.show();
                        }

                        $timeout( function(){
                            stringToFind = '';
                        }, 1000);

                        return;
                    } else if (!/^(38|40|13|9)$/.test(evt.keyCode)){
                        return;
                    }

                    if ($selectInstance.$isVisible()) {
                        evt.preventDefault();
                        evt.stopPropagation();

                        $timeout(function () {
                            if (options.multiple) {
                                // Select with enter/tab
                                if (evt.keyCode === 13 || evt.keyCode === 9) {
                                    if (angular.isDefined(scope.$focusedIndex)) {
                                        if (evt.keyCode === 13) $selectInstance.select(scope.$focusedIndex);
                                        if (evt.keyCode === 9) $selectInstance.hide();
                                    } else {
                                        $selectInstance.hide();
                                    }
                                    return;
                                }

                                // Navigate with keyboard
                                if (evt.keyCode === 38) {
                                    if (angular.isUndefined(scope.$focusedIndex)) {
                                        scope.$focusedIndex = scope.$matches.length - 1;
                                        scrollOnKeyDown($selectInstance.$element, evt.keyCode);
                                    } else if (scope.$focusedIndex > 0) {
                                        scope.$focusedIndex--;
                                        scrollOnKeyDown($selectInstance.$element, evt.keyCode);
                                    }
                                } else if (evt.keyCode === 40) {
                                    if (angular.isUndefined(scope.$focusedIndex)) {
                                        scope.$focusedIndex = 0;
                                        scrollOnKeyDown($selectInstance.$element, evt.keyCode);
                                    } else if (scope.$focusedIndex < scope.$matches.length - 1) {
                                        scope.$focusedIndex++;
                                        scrollOnKeyDown($selectInstance.$element, evt.keyCode);
                                    }
                                }

                            } else {
                                // Select with enter/tab
                                if (evt.keyCode === 13) {
                                    return $selectInstance.select(scope.$activeIndex);
                                }
                                if (evt.keyCode === 9) {
                                    return $selectInstance.hide(true);
                                }
                                // Navigate with keyboard
                                if (evt.keyCode === 38 && scope.$activeIndex > 0) {
                                    scope.$activeIndex--;
                                    scrollOnKeyDown($selectInstance.$element, evt.keyCode);
                                } else if (evt.keyCode === 40 && scope.$activeIndex < scope.$matches.length - 1) {
                                    scope.$activeIndex++;
                                    scrollOnKeyDown($selectInstance.$element, evt.keyCode);
                                } else if (angular.isUndefined(scope.$activeIndex)) scope.$activeIndex = 0;
                            }
                        });
                    }
                };

                $selectInstance.$onMouseDown = function(evt) {
                    if (angular.isDefined(scope.$focusedIndex)) scope.$focusedIndex = undefined;
                    // Prevent blur on mousedown on .dropdown-menu
                    if (!isTouch) {
                        evt.preventDefault();
                        evt.stopPropagation();
                    }
                };

                $selectInstance.$onClick = function (evt) {
                    evt.stopPropagation();
                };

                function hideOptions() {
                    $selectInstance.hide(true);
                }

                $selectInstance.show = function () {
                    //angular.element(document).on('click', hideOptions);
                    setTimeout(function () {
                        $selectInstance.$element.on('click', $selectInstance.$onClick);
                    });
                    _show();
                };

                $selectInstance.hide = function () {
                    angular.element(document).off('click', hideOptions);
                    $selectInstance.$element.off('click', $selectInstance.$onClick);
                    _hide(true);
                };

                $selectInstance.select = function(index) {
                    var value = scope.$matches[index].value;
                    scope.$apply(function() {
                        $selectInstance.activate(index);
                        if (options.multiple) {
                            controller.$setViewValue(scope.$activeIndex.map(function(index) {
                                return scope.$matches[index].value;
                            }));
                        } else if (scope.$activeIndex === 0 && scope.$matches[index].label.length === 0) {
                            controller.$setViewValue(scope.$matches[index].label);
                            controller.$modelValue = undefined;
                            $selectInstance.hide();
                        } else {
                            controller.$setViewValue(value);
                            // Hide if single select
                            $selectInstance.hide();
                        }
                    });
                    // Emit event
                    scope.$emit(options.prefixEvent + '.select', value, index);
                };

                return $selectInstance;
            }

            newSelectFactory.defaults = $select.defaults;
            newSelectFactory.defaults.minLength = 0;

            return newSelectFactory;
        }


        function $bsSelectDirectiveDecorator($delegate) {
            var bsSelectDirective = $delegate[0];

            // Force the element to be a <button> to avoid default directive support for <select> markup
            bsSelectDirective.replace = true;
            bsSelectDirective.template = '<button></button>';

            return $delegate;
        }

        $provide.decorator('$select', $selectDecorator);
        $provide.decorator('bsSelectDirective', $bsSelectDirectiveDecorator);
    }])
    // FIX Trello card: https://trello.com/c/wnrPJ4mi
    .run(['$templateCache', 'Utils', function ($templateCache, Utils) {
        if (Utils.platform.isIE8()) {
            $templateCache.put('select/select.tpl.html', '<ul tabindex="-1" class="select dropdown-menu" ng-show="$isVisible()" role="select"><li ng-if="$showAllNoneButtons"><div class="btn-group" style="margin-bottom: 5px; margin-left: 5px"><button class="btn btn-default btn-xs" ng-mousedown="$selectAll()">All</button> <button class="btn btn-default btn-xs" ng-mousedown="$selectNone()">None</button></div></li><li role="presentation" ng-repeat="match in $matches" ng-class="{active: $isActive($index), selecting: $selecting($index)}"><a style="cursor: default" role="menuitem" tabindex="-1" ng-mousedown="$select($index, $event)"><span ng-bind="match.label"></span> <i class="{{$iconCheckmark}} pull-right" ng-if="$isMultiple && $isActive($index) && $selecting($index)"></i></a></li></ul>');
        } else if (!Utils.platform.isTactile()) {
            $templateCache.put('select/select.tpl.html', '<ul tabindex="-1" class="select dropdown-menu" ng-show="$isVisible()" role="select"><li ng-if="$showAllNoneButtons"><div class="btn-group" style="margin-bottom: 5px; margin-left: 5px"><button class="btn btn-default btn-xs" ng-click="$selectAll()">All</button> <button class="btn btn-default btn-xs" ng-click="$selectNone()">None</button></div></li><li role="presentation" ng-repeat="match in $matches" ng-class="{active: $isActive($index), selecting: $selecting($index)}"><a style="cursor: default" role="menuitem" tabindex="-1" ng-click="$select($index, $event)"><span ng-bind="match.label"></span> <i class="{{$iconCheckmark}} pull-right" ng-if="$isMultiple && $isActive($index) && $selecting($index)"></i></a></li></ul>');
        }
    }]);
