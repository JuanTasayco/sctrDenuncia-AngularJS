/*global angular */
/*DEPRECATED*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive..mpMessageAdvanced1
 * @param {string} mpMessageAdvanced1 receives a text with the message content.
 * @description
 * DEPRECATED
 * Use Bootstrap's progress bar instead
 */
angular.module('mpMessageAdvanced1', [])
    .directive('mpMessageAdvanced1', function() {
        return {
            scope: {
                mpMessageAdvanced1: '@'
            },
            templateUrl: 'gaiafrontend/html/messageAdvanced1.html',
            link: function(scope, elm) {
                var progressbar = elm.find('.progressbar'),
                    progressLabel = elm.find('.progress-label', progressbar);
                progressbar.progressbar({
                    value: false,
                    change: function() {
                        progressLabel.text(progressbar.progressbar('value') + '%');
                    },
                    complete: function() {
                        progressLabel.text('Complete!');
                    }
                });
            }
        };
    });
