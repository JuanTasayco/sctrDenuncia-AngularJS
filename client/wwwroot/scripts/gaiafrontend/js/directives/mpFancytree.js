/*global angular, _ */
/*DEPRECATED*/
angular.module('mpFancytree', ['utils'])
    /**
     * @doc-component directive
     * @name gaiafrontend.directive.mpFancytree
     * @description
     * DEPRECATED
     * If you need this component ask for it through the UX department
     */
    .directive('mpFancytree', ['Loader',
        function(Loader) {
            var loadPlugin = Loader.load;

            function writeJsonList(currentElement, listElements, text) {
                var i = 0;
                for (i = 0; i < listElements.length; i = i + 1) {
                    if (listElements[i].li.ul) {
                        currentElement.append('<li><a href="">' + listElements[i].li.ul[0].li + '</a><ul></ul></li>');
                        writeJsonList(currentElement.find('li ul'), listElements[i].li.ul, listElements[i].li.ul[0].li);
                    } else {
                        if (listElements[i].li !== text) {
                            text = '';
                            if (listElements[i]['class'] && listElements[i].href) {
                                currentElement.append('<li class=' + listElements[i]['class'] + '><a href=' + listElements[i].href + '>' + listElements[i].li + '</a> </li>');
                            } else if (listElements[i]['class']) {
                                currentElement.append('<li class=' + listElements[i]['class'] + '><a href="">' + listElements[i].li + '</a> </li>');
                            } else if (listElements[i].href) {
                                currentElement.append('<li><a href=' + listElements[i].href + '>' + listElements[i].li + '</a> </li>');
                            } else {
                                currentElement.append('<li><a href="">' + listElements[i].li + '</a> </li>');
                            }
                        }
                    }
                }
            }

            function readJsonListElements(currentElement, argument) {
                _.each(argument, function(datos) {
                    writeJsonList(currentElement, datos);
                });
            }

            return {
                templateUrl: 'gaiafrontend/html/fancyTree.html',
                link: function(scope, elm, attrs) {
                    var treeElements = attrs.mpFancytree;

                    elm.find('.treextra').append('<ul></ul>');
                    angular.forEach(angular.fromJson(treeElements), function(datos) {
                        readJsonListElements(elm.find('.treextra ul'), datos);
                    });

                    function drawTree() {
                        elm.find('.treextra').fancytree({
                            checkbox: false,
                            activate: function(e, data) {
                                elm.find('div#statusLine').text('Active node: ' + data.node);
                            }
                        });
                    }

                    loadPlugin('jquery.fancytree.js').then(drawTree);
                }
            };
        }]);
