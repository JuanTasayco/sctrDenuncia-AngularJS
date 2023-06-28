/*TODO: REVIEW*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpRichTextEditor
 * @param {string=} mp-rich-text-editor Property of the scope, supports all of the standard TinyMCE initialization options.
 * @description
 * Visit Issuestracker for more information and examples of this component.
 */
/*global tinymce*/
(function() {
    'use strict';

    function mpRichTextEditor($rootScope, $compile, $timeout, $window, $sce, mpRichTextEditorConfig, Loader, Language) {
        mpRichTextEditorConfig = mpRichTextEditorConfig || {};
        var generatedIds = 0;
        var ID_ATTR = 'mp-rich-text-editor';
        if (mpRichTextEditorConfig.baseUrl) {
            tinymce.baseURL = mpRichTextEditorConfig.baseUrl;
        }

        return {
            require: ['ngModel', '^?form'],
            link: function(scope, element, attrs, ctrls) {

                function originalLink() {
                    if (!$window.tinymce) {
                        return;
                    }

                    var ngModel = ctrls[0],
                        form = ctrls[1] || null;

                    var expression, options, tinyInstance,
                        updateView = function(editor) {
                            var content = editor.getContent({
                                format: options.format
                            }).trim();
                            content = $sce.trustAsHtml(content);

                            ngModel.$setViewValue(content);
                            if (!$rootScope.$$phase) {
                                scope.$apply();
                            }
                        };

                    function toggleDisable(disabled) {
                        if (disabled) {
                            ensureInstance();

                            if (tinyInstance) {
                                tinyInstance.getBody().setAttribute('contenteditable', false);
                            }
                        } else {
                            ensureInstance();

                            if (tinyInstance) {
                                tinyInstance.getBody().setAttribute('contenteditable', true);
                            }
                        }
                    }

                    // generate an ID
                    attrs.$set('id', ID_ATTR + '-' + generatedIds++);

                    expression = {
                        language: Language.get().languageId
                    };

                    angular.extend(expression, scope.$eval(attrs.mpRichTextEditor));

                    options = {
                        // Update model when calling setContent
                        // (such as from the source editor popup)
                        setup: function(ed) {
                            ed.on('init', function() {
                                ngModel.$render();
                                ngModel.$setPristine();
                                if (form) {
                                    form.$setPristine();
                                }
                            });

                            // Update model on button click
                            ed.on('ExecCommand', function() {
                                ed.save();
                                updateView(ed);
                            });

                            // Update model on change
                            ed.on('change', function() {
                                ed.save();
                                updateView(ed);
                            });

                            ed.on('blur', function() {
                                element[0].blur();
                            });

                            // Update model when an object has been resized (table, image)
                            ed.on('ObjectResized', function() {
                                ed.save();
                                updateView(ed);
                            });

                            ed.on('remove', function() {
                                element.remove();
                            });

                            if (expression.setup) {
                                expression.setup(ed, {
                                    updateView: updateView
                                });
                            }
                        },
                        format: 'raw',
                        selector: '#' + attrs.id
                    };
                    // extend options with initial mpRichTextEditorConfig and
                    // options from directive attribute value
                    angular.extend(options, mpRichTextEditorConfig, expression);
                    // Wrapped in $timeout due to $tinymce:refresh implementation, requires
                    // element to be present in DOM before instantiating editor when
                    // re-rendering directive
                    $timeout(function() {
                        tinymce.init(options);
                        toggleDisable(scope.$eval(attrs.ngDisabled));
                    });

                    ngModel.$formatters.unshift(function(modelValue) {
                        return modelValue ? $sce.trustAsHtml(modelValue) : '';
                    });

                    ngModel.$parsers.unshift(function(viewValue) {
                        return viewValue ? $sce.getTrustedHtml(viewValue) : '';
                    });

                    ngModel.$render = function() {
                        ensureInstance();

                        var viewValue = ngModel.$viewValue ?
                            $sce.getTrustedHtml(ngModel.$viewValue) : '';

                        // instance.getDoc() check is a guard against null value
                        // when destruction & recreation of instances happen
                        if (tinyInstance &&
                            tinyInstance.getDoc()
                        ) {
                            tinyInstance.setContent(viewValue);
                            // Triggering change event due to TinyMCE not firing event &
                            // becoming out of sync for change callbacks
                            tinyInstance.fire('change');
                        }
                    };

                    attrs.$observe('disabled', toggleDisable);

                    // This block is because of TinyMCE not playing well with removal and
                    // recreation of instances, requiring instances to have different
                    // selectors in order to render new instances properly
                    scope.$on('$tinymce:refresh', function(e, id) {
                        var eid = attrs.id;
                        if (angular.isUndefined(id) || id === eid) {
                            var parentElement = element.parent();
                            var clonedElement = element.clone();
                            clonedElement.removeAttr('id');
                            clonedElement.removeAttr('style');
                            clonedElement.removeAttr('aria-hidden');
                            tinymce.execCommand('mceRemoveEditor', false, eid);
                            parentElement.append($compile(clonedElement)(scope));
                        }
                    });

                    scope.$on('$destroy', function() {
                        ensureInstance();

                        if (tinyInstance) {
                            tinyInstance.remove();
                            tinyInstance = null;
                        }
                    });

                    function ensureInstance() {
                        if (!tinyInstance) {
                            tinyInstance = tinymce.get(attrs.id);
                        }
                    }
                }
                Loader.load('tinymce/tinymce.js')
                    .then(originalLink);
                    // .then(Loader.load('theme.min.js'))
                // Loader.load('tinymce.min.js')
                //     .then(function () {
                //         return Loader.load('theme.min.js')
                //     }).then(originalLink);
            }
        };
    }
    (angular.module('mpRichTextEditor', ['utils']))
        .value('mpRichTextEditorConfig', {})
        .directive('mpRichTextEditor', ['$rootScope', '$compile', '$timeout', '$window', '$sce', 'mpRichTextEditorConfig', 'Loader', 'Language', mpRichTextEditor]);

}());
