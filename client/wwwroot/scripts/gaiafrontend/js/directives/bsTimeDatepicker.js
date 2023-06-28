/*global angular */
angular.module('bsTimeDatepicker', ['mgcrea.ngStrap'])
    .config(['$provide', function($provide) {
        function $datePickerDecorator($delegate) {
            var $datepicker = $delegate;

            function newDatepickerFactory(element) {
                var $datepickerInstance = $datepicker.apply(this, arguments),
                    _show = $datepickerInstance.show,
                    _hide = $datepickerInstance.hide;

                function hideCalendar() {
                    $datepickerInstance.hide(true);
                }

                $datepickerInstance.show = function() {
                    _show();
                    angular.element(document).on('mousedown', hideCalendar);
                };

                $datepickerInstance.hide = function(blur) {
                    angular.element(document).off('mousedown', hideCalendar);
                    _hide(blur);
                };

                // Dirty trick/cheat to expose $datepicker instance
                element.data('$datepicker', $datepickerInstance);

                return $datepickerInstance;
            }

            newDatepickerFactory.defaults = $datepicker.defaults;
            return newDatepickerFactory;
        }

        function $timePickerDecorator($delegate) {
            var $timepicker = $delegate;

            function newTimepickerFactory(element) {
                var $timepickerInstance = $timepicker.apply(this, arguments),
                    _show = $timepickerInstance.show,
                    _hide = $timepickerInstance.hide;

                function hideTimer() {
                    $timepickerInstance.hide(true);
                }

                $timepickerInstance.show = function() {
                    _show();
                    setTimeout(function() {
                        angular.element(document).on('mousedown', hideTimer);
                    });
                };

                $timepickerInstance.hide = function(blur) {
                    angular.element(document).off('mousedown', hideTimer);
                    _hide(blur);
                };

                // Dirty trick/cheat to expose $timepicker instance
                element.data('$timepicker', $timepickerInstance);

                return $timepickerInstance;
            }

            newTimepickerFactory.defaults = $timepicker.defaults;
            return newTimepickerFactory;
        }

        $datePickerDecorator.$inject = ['$delegate', '$window'];
        $datePickerDecorator.$inject = ['$delegate', '$window'];

        $provide.decorator('$datepicker', $datePickerDecorator);
        $provide.decorator('$timepicker', $timePickerDecorator);
    }])
    // FIX Trello card: https://trello.com/c/TFNSkyAA
    .run(['$templateCache', function($templateCache) {
        $templateCache.put('datepicker/datepicker.tpl.html', '<div class="dropdown-menu datepicker" ng-class="\'datepicker-mode-\' + $mode" style="max-width: 320px"><table style="table-layout: fixed; height: 100%; width: 100%"><thead><tr class="text-center"><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$selectPane(-1)"><img src="gaiafrontend/img/chevron-left.png" style="width: 8px" /></button></th><th colspan="{{ rows[0].length - 2 }}"><button tabindex="-1" type="button" class="btn btn-default btn-block text-strong" ng-click="$toggleMode()"><strong style="text-transform: capitalize" ng-bind="title"></strong></button></th><th><button tabindex="-1" type="button" class="btn btn-default pull-right" ng-click="$selectPane(+1)"><img src="gaiafrontend/img/chevron-right.png" style="width: 8px" /></button></th></tr><tr ng-show="showLabels" ng-bind-html="labels"></tr></thead><tbody><tr ng-repeat="(i, row) in rows" height="{{ 100 / rows.length }}%"><td class="text-center" ng-repeat="(j, el) in row"><button tabindex="-1" type="button" class="btn btn-default" style="width: 100%" ng-class="{\'btn-primary\': el.selected, \'btn-info btn-today\': el.isToday}" ng-click="$select(el.date)" ng-disabled="el.disabled"><span ng-class="{\'text-muted\': el.muted}" ng-bind="el.label"></span></button></td></tr></tbody></table></div>');
    }])
    .run(['$templateCache', function($templateCache) {
        $templateCache.put('timepicker/timepicker.tpl.html', '<div class="dropdown-menu timepicker" style="min-width: 0px;width: auto"><table height="100%"><thead><tr class="text-center"><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(-1, 0)"><img src="gaiafrontend/img/flechaUp.png" style="width: 12px" /></button></th><th>&nbsp;</th><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(-1, 1)"><img src="gaiafrontend/img/flechaUp.png" style="width: 12px" /></button></th></tr></thead><tbody><tr ng-repeat="(i, row) in rows"><td class="text-center"><button tabindex="-1" style="width: 100%" type="button" class="btn btn-default" ng-class="{\'btn-primary\': row[0].selected}" ng-click="$select(row[0].date, 0)" ng-disabled="row[0].disabled"><span ng-class="{\'text-muted\': row[0].muted}" ng-bind="row[0].label"></span></button></td><td><span ng-bind="i == midIndex ? timeSeparator : \' \'"></span></td><td class="text-center"><button tabindex="-1" ng-if="row[1].date" style="width: 100%" type="button" class="btn btn-default" ng-class="{\'btn-primary\': row[1].selected}" ng-click="$select(row[1].date, 1)" ng-disabled="row[1].disabled"><span ng-class="{\'text-muted\': row[1].muted}" ng-bind="row[1].label"></span></button></td><td ng-if="showAM">&nbsp;</td><td ng-if="showAM"><button tabindex="-1" ng-show="i == midIndex - !isAM * 1" style="width: 100%" type="button" ng-class="{\'btn-primary\': !!isAM}" class="btn btn-default" ng-click="$switchMeridian()" ng-disabled="el.disabled">AM</button><button tabindex="-1" ng-show="i == midIndex + 1 - !isAM * 1" style="width: 100%" type="button" ng-class="{\'btn-primary\': !isAM}" class="btn btn-default" ng-click="$switchMeridian()" ng-disabled="el.disabled">PM</button></td></tr></tbody><tfoot><tr class="text-center"><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(1, 0)"><img src="gaiafrontend/img/flechaDown.png" style="width: 12px" /></i></button></th><th>&nbsp;</th><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(1, 1)"><img src="gaiafrontend/img/flechaDown.png" style="width: 12px" /></i></button></th></tr></tfoot></table></div>');
    }]);
