/*global angular */
angular.module('mpTimeDatepicker', [])
    /**
        * @doc-component directive
        * @name gaiafrontend.directive.mpTimeDatepicker
        * @description
        * This component has been migrated to "GAIA Site"
        * There you will find its documentation and several examples.
        * "GAIA Site" is an application created by the Architecture Area to learn and play with GAIA. Is available in RAS. Direct links are available below in this page.
        * @example
        <doc:example>
             <doc:source>
             label GAIA site direct links are:
             a(href='https://wportalinterno.es.mapfre.net/com.ibm.ram.repository.web/faces/_rlvid.jsp?_rap=!assetDetails&_rvip=/home.jsp&guid=13A33828-B921-8DC5-DEDA-8B8D7C0EBC81') Intranet /
             a(href='https://wportalinterno.mapfre.com/com.ibm.ram.repository.web/faces/_rlvid.jsp?_rap=!assetDetails&_rvip=/home.jsp&guid=13A33828-B921-8DC5-DEDA-8B8D7C0EBC81') Internet
             </doc:source>
        </doc:example>
    */
    .directive('mpTimeDatepicker', ['$parse', 'Utils', '$compile', function ($parse, Utils, $compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var dateWrapper,
                    timeWrapper,
                    id = attrs.mpTimeDatepickerId,
                    name = attrs.mpTimeDatepickerName,
                    model = attrs.mpTimeDatepickerModel,
                    timer = !!$parse(attrs.mpTimeDatepickerTimer)(),
                    dateOptions = $parse(attrs.mpTimeDatepickerDateData)(),
                    timeOptions = $parse(attrs.mpTimeDatepickerTimeData)(),
                    disabledFn = $parse(attrs.mpTimeDatepickerDisabled),
                    isIE8 = Utils.platform.isIE8(),
                    defaults = {
                        date: {
                            dateFormat: 'dd/MM/yyyy',
                            placeholder: 'dd/MM/yyyy'
                        },
                        time: {
                            timeFormat: 'HH:mm',
                            placeholder: 'HH:mm'
                        }
                    };

                function addOptions(input, options) {
                    angular.forEach(options, function(value, key) {
                        if (key.match(/placeholder|size|/g)) {
                            input.attr(Utils.string.toHyphens(key), value);
                        } else {
                            input.attr('data-' + Utils.string.toHyphens(key), value);
                        }
                    });
                }

                function addMask(element, type) {
                    var typeMask;
                    if (type === 'time') {
                        typeMask = defaults.time.timeFormat;
                    } else {
                        typeMask = defaults.date.dateFormat;
                    }
                    element.attr('mp-input-mask', typeMask.replace(new RegExp(/(\w)/g), '9'));
                }

                function createDate(formatoFecha) {
                    var iconDate = angular.element('<img>').attr( 'src', 'gaiafrontend/img/icon/calendar.png' ).addClass('glyphicon-calendar'),
                        inputDate = angular.element('<input>')
                            .addClass('form-control datepicker')
                            .attr('type', 'text')
                            .attr('id', id)
                            .attr('name', name)
                            .attr('size', '10')
                            .attr('ng-model', model)
                            .attr('ng-disabled', attrs.mpTimeDatepickerDisabled)
                            .attr('ng-required', attrs.mpTimeDatepickerRequired)
                            .attr('bs-datepicker', '');

                    angular.extend(defaults.date, dateOptions);
                    if(angular.isUndefined(dateOptions)){
                        defaults.date.placeholder = formatoFecha || defaults.date.dateFormat;
                        defaults.date.dateFormat = formatoFecha || defaults.date.dateFormat;
                    }else{
                        defaults.date.placeholder = formatoFecha || dateOptions.dateFormat || defaults.date.dateFormat;
                        defaults.date.dateFormat = formatoFecha || dateOptions.dateFormat || defaults.date.dateFormat;
                    }
                    addMask(inputDate, 'date');

                    dateWrapper = angular.element('<div>').addClass('validable');

                    if (timer) {
                        dateWrapper.addClass('col-md-6');
                    }


                    if (isIE8) {
                        defaults.date.delay = parseInt(defaults.date.delay, 10) > 100 ? defaults.date.delay : '100';
                        if (defaults.date.trigger !== 'manual') defaults.date.trigger = 'click';
                    }

                    addOptions(inputDate, defaults.date);

                    dateWrapper.append(inputDate);
                    dateWrapper.append(iconDate);
                }

                function createTime(formatoHora) {
                    if (!timer) {
                        return;
                    }

                    var iconTime = angular.element('<img>').attr( 'src', 'gaiafrontend/img/icon/time.png' ).addClass('glyphicon-time'),
                        inputTime = angular.element('<input>')
                            .addClass('form-control timepicker')
                            .attr('type', 'text')
                            .attr('id', id + '_time')
                            .attr('name', name + '_time')
                            .attr('size', '8')
                            .attr('ng-model', model)
                            .attr('ng-disabled', attrs.mpTimeDatepickerDisabled)
                            .attr('ng-required', attrs.mpTimeDatepickerRequired)
                            .attr('bs-timepicker', '');

                    angular.extend(defaults.time, timeOptions);
                    if(angular.isUndefined(timeOptions)){
                        defaults.time.placeholder = formatoHora || defaults.time.timeFormat;
                        defaults.time.timeFormat = formatoHora || defaults.time.timeFormat;
                    } else {
                        defaults.time.placeholder = formatoHora || timeOptions.timeFormat || defaults.time.timeFormat;
                        defaults.time.timeFormat = formatoHora || timeOptions.timeFormat || defaults.time.timeFormat;
                    }
                    addMask(inputTime, 'time');

                    timeWrapper = angular.element('<div>').addClass('col-md-6 validable');


                    if (isIE8) {
                        defaults.time.delay = parseInt(defaults.time.delay, 10) > 100 ? defaults.time.delay : '100';
                        if (defaults.time.trigger !== 'manual') defaults.time.trigger = 'click';
                    }

                    addOptions(inputTime, defaults.time);

                    timeWrapper.append(inputTime);
                    timeWrapper.append(iconTime);
                }

                function createWrapper() {
                    element.append(dateWrapper);
                    element.append(timeWrapper);
                }

                function createClass() {
                    element.addClass('timeDatepicker');
                }

                var dateInput = element.find('input').eq(0),
                    dateIcon = element.find('img.glyphicon-calendar').eq(0),
                    $datepicker = dateInput.data('$datepicker'),
                    $dateNgController = dateInput.data('$ngModelController'),
                    timeInput = element.find('input').eq(1),
                    timeIcon = element.find('img.glyphicon-time').eq(0),
                    $timepicker = timeInput.data('$timepicker'),
                    $timeNgController = timeInput.data('$ngModelController');

                function listenClick(element, $tooltipInstance) {
                    function iconClick(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        if (!disabledFn(scope) && $tooltipInstance) $tooltipInstance.toggle();
                    }

                    element.on('click', iconClick);

                    return function () {
                        element.off('click', iconClick);
                    }
                }

                var unlistenDateIconClick = listenClick(dateIcon, $datepicker);
                var unlistenTimeIconClick = listenClick(timeIcon, $timepicker);

                if ($dateNgController) $dateNgController.$parsers.push(function (viewValue) {
                    // No date is not an invalid date. This parser overwrites bsDatepicker directive parser
                    if (viewValue === null || viewValue === '') {
                        $dateNgController.$setValidity('date', true);
                    }
                    return viewValue;
                });

                if ($timeNgController) $timeNgController.$parsers.push(function (viewValue) {
                    // No time is not an invalid date. This parser overwrites bsTimepickerpicker directive parser
                    if (viewValue === null || viewValue === '') {
                        $timeNgController.$setValidity('date', true);
                    }
                    return viewValue;
                });

                var watcherForModel = scope.$watch(function (scope) {
                    return $parse(attrs.mpTimeDatepickerModel)(scope);
                }, function (newValue) {
                    if (newValue && typeof newValue !== 'number') {
                        if(typeof newValue === 'string'){
                            newValue =  new Date(newValue);
                        }
                        scope[attrs.mpTimeDatepickerModel] = newValue.getTime();
                    }
                    if (angular.isUndefined(newValue)) {
                        if(!angular.isUndefined($datepicker)){
                            $datepicker.update(new Date());
                        }
                        element.addClass('only-today');
                    } else {
                        element.removeClass('only-today');
                    }
                });

                scope.$on('$destroy', function () {
                    unlistenDateIconClick();
                    $datepicker = null;
                    dateIcon = null;
                    dateInput = null;
                    unlistenTimeIconClick();
                    $timepicker = null;
                    timeIcon = null;
                    timeInput = null;
                    watcherForModel();
                });

                var formatoFecha;
                angular.forEach($parse(attrs.mpTimeDatepickerDateData)(), function(value, key) {
                    if (key==='dateFormat') {
                        formatoFecha = value;
                    }
                });

                var valorFormatoFecha = $parse(formatoFecha)(scope);


                var valorFormatoHora
                if (timer) {
                    var formatoHora;
                    angular.forEach($parse(attrs.mpTimeDatepickerTimeData)(), function(value, key) {
                        if (key==='timeFormat') {
                            formatoHora = value;
                        }
                    });

                    if(formatoHora && formatoHora.indexOf(':') > 0){
                        valorFormatoHora = formatoHora;
                    }else{
                        valorFormatoHora = $parse(formatoHora)(scope);
                    }
                }

                if (!element.contents().length) {
                    createDate(valorFormatoFecha);
                    createTime(valorFormatoHora);
                    createWrapper();
                    createClass();
                    $compile(element)(scope);
                }

            }
        };
    }]);
