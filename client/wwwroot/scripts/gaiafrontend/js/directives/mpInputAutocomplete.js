/*global angular, _ */
/*DEPRECATED*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpInputAutocomplete
 * @description
 * DEPRECATED
 * Use mpTypeahead instead
 */
angular.module('mpInputAutocomplete', [])
    .directive('mpInputAutocomplete', ['$timeout',
        function($timeout) {
            var COMBOBOX_SHOW_ALL_BUTTON_CLASS = 'combobox-show-all-button';
            return {
                require: '?ngModel',
                link: function(scope, lElm, lAttrs, ngModelCtrl) {
                    var input = lElm,
                        showAllButton,
                        showAllButtonOnClick,
                        wasOpen = false,
                        suggestions,
                        formattersIncluded = false;

                    // Remove old "show all button" if input is recompiled
                    lElm.siblings('.' + COMBOBOX_SHOW_ALL_BUTTON_CLASS).remove();
                    if (lAttrs.mpInputAutocompleteCombobox) {
                        showAllButtonOnClick = function () {
                            input.focus();

                            // Close if already visible
                            if (wasOpen) {
                                return;
                            }

                            // Pass empty string as value to search for, displaying all results
                            input.autocomplete('search', '');
                        };

                        showAllButton = angular.element('<a>')
                            .attr('tabIndex', -1)
                            .attr('title', 'Show all items')
                            .addClass(COMBOBOX_SHOW_ALL_BUTTON_CLASS)
                            .mousedown(function() {
                                wasOpen = input.autocomplete('widget').is(':visible');
                            })
                            .on('click', showAllButtonOnClick);

                        input.after(showAllButton);
                    }

                    function toUser(value) {
                        var suggestionFound;

                        suggestionFound = _.find(suggestions, function(suggestion) {
                            return suggestion.value === value;
                        });

                        return suggestionFound ? suggestionFound.label : undefined;
                    }

                    function fromUser(label) {
                        var suggestionFound;

                        suggestionFound = _.find(suggestions, function(suggestion) {
                            return suggestion.label === label;
                        });

                        return suggestionFound ? suggestionFound.value : undefined;
                    }

                    function updateSuggestions(suggs) {
                        var autocompleteSource = [];

                        suggestions = suggs;

                        function includeFormatters() {
                            ngModelCtrl.$formatters.push(toUser);
                            ngModelCtrl.$parsers.push(fromUser);
                            formattersIncluded = true;
                        }

                        if (_.isPlainObject(suggestions[0])) { // Suggestions is an array of objects with "label" and "value" properties

                            if (!formattersIncluded) {
                                includeFormatters();
                            }

                            _.each(suggestions, function(suggestion) {
                                autocompleteSource.push(suggestion.label);
                            });
                        } else {
                            Array.prototype.push.apply(autocompleteSource, suggestions);
                        }

                        input.autocomplete({
                            source: autocompleteSource,
                            minLength: 0,
                            select: function () {
                                // FIX. The angular model does not update if input event is not triggered
                                // when selecting from suggestions
                                $timeout(function () {
                                    // FIX. <IE9 do not support input event
                                    if (angular.element('html').hasClass('lt-ie9')) {
                                        input.trigger('change');
                                    } else {
                                        input.trigger('input');
                                    }
                                }, 0);
                            }
                        });
                    }

                    if (lAttrs.ngDisabled) {
                        scope.$watch(lAttrs.ngDisabled, function (disabled) {
                            if (disabled) {
                                input.addClass('disabled');
                                if (showAllButton) {
                                    showAllButton.addClass('not-allowed').off('click');
                                }
                            } else if (!disabled) {
                                input.removeClass('disabled');
                                if (showAllButton) {
                                    showAllButton.removeClass('not-allowed').on('click', showAllButtonOnClick);
                                }
                            }
                        });
                    }

                    scope.$watch(lAttrs.mpInputAutocomplete, function(suggestions) {
                        if (suggestions) {
                            updateSuggestions(suggestions);
                            // FIX. When the model has a value before suggestions were loaded the description input does not display as intended
                            if (ngModelCtrl.$modelValue) {
                                var viewValue = toUser(ngModelCtrl.$modelValue);
                                ngModelCtrl.$setViewValue(viewValue);
                                ngModelCtrl.$render();
                            }
                            // FIX END
                        }
                    }, true);
                }
            };
        }]);
