/*TODO: REVIEW*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpWysiwyg
 * @param {string=} mp-wysiwyg-options to activate the plugin with custom options you can use the attribute mp-wysiwyg-optionsque receive a JSON with wysiwyg options as shown in the example above.
 * @description
 * DEPRECATED
 * Use mpRichTextEditor instead
 */
/*global angular */
angular.module('mpWysiwyg', ['utils'])
    .directive('mpWysiwyg', ['Loader',
        function(Loader) {
            var loadPlugin = Loader.load;

            return {
                templateUrl: 'gaiafrontend/html/wysiwyg.html',
                link: function(scope, elm, attrs) {
                    function drawWysiwyg() {
                        var containerWidth = elm.css('width').toString(),
                            containerWidthParts,
                            containerWidthBigger,
                            textarea = elm.find('textarea');

                        containerWidthParts = containerWidth.split('px');
                        containerWidthBigger = parseInt(containerWidthParts[0], 10) + 20;
                        textarea.css('width', containerWidthBigger + 'px');

                        if (attrs.mpWysiwygOptions) {
                            textarea.wysiwyg(JSON.parse(attrs.mpWysiwygOptions));
                        } else {
                            textarea.wysiwyg();
                        }
                    }

                    loadPlugin('wysiwyg.js').then(function() {
                        loadPlugin('jquery.wysiwyg.js').then(drawWysiwyg);
                    });

                }
            };
        }]);
