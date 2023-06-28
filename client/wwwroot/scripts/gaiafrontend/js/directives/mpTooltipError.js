/*global angular*/
angular.module('mpTooltipError', [])
    .directive('mpTooltipError', function () {
        return {
            template: function (element, attrs) {
                return  '<div class="error-alert">' +
                            '<img src="gaiafrontend/img/icons/contrlAmrll_S.png" ' +
                            // 'mp-tooltip="' + formCtrl.$name + '[\'' + ngModelCtrl.$name + '\'].$errorText" ' +
                            'mp-tooltip="' + attrs.mpTooltipError + '.$errorText" ' +
                            'mp-tooltip-type="error" />' +
                        '</div>';
            },
            replace: true,
            require: '^?form',
            scope: true,
            link: function(scope, element, attrs, formCtrl) {
                if (formCtrl) scope[attrs.mpTooltipError] = formCtrl[attrs.mpTooltipError];
            }
        };
    });
