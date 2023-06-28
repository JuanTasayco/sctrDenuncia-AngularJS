/*global angular */
/*DEPRECATED*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpMessageAdvanced2
 * @param {string} mpMessageAdvanced2 receives a text with the message content.
 * @param {string=} mp-message-advanced2-complete we set the text that will appear once charging is complete.
 * @description
 * DEPRECATED
 * Use Bootstrap's progress bar instead
 */
angular.module('mpMessageAdvanced2', [])
    .directive('mpMessageAdvanced2', function() {
        return {
            replace: true,
            scope: {
                mpMessageAdvanced2: '@'
            },
            templateUrl: 'gaiafrontend/html/messageAdvanced2.html',
            link: function(scope, elm, attrs) {
                var advenceprogressbar = elm.find('.advanceProgressbar'),
                    progressLabel = elm.find('.progress-label', advenceprogressbar);

                advenceprogressbar.progressbar({
                    value: false,
                    change: function() {
                        progressLabel.text(advenceprogressbar.progressbar('value') + '%');
                    },
                    complete: function() {
                        progressLabel.text(attrs.mpMessageAdvanced2Complete);
                    }
                });

                function progress() {
                    var val = advenceprogressbar.progressbar('value') || 0;
                    advenceprogressbar.progressbar('value', val + 1);
                    if (val < 99) {
                        setTimeout(progress, 100);
                    }
                }
                setTimeout(progress, 3000);
            }
        };
    });
