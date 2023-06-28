/*global angular, _ */
/*DEPRECATED*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpInputCalendarthe week.
 * @description
 * Use mpTimeDatepicker instead
 */
angular.module('mpInputCalendar', [])
    .directive('mpInputCalendar', ['$parse', '$q', '$filter', '$locale', 'Language', 'Loader', 'HttpSrv', 'UserSrv',
        function($parse, $q, $filter, $locale, Language, Loader, HttpSrv, UserSrv) {
            return {
                replace: true,
                templateUrl: 'gaiafrontend/html/inputCalendar.html',
                link: function(scope, elem, attrs) {
                    var calendarId = attrs.mpInputCalendarId,
                        calendarModel = attrs.mpInputCalendarModel,
                        calendarInputs = attrs.mpInputCalendarInputs,
                        calendarFormat,
                        calendarAccesskey = attrs.mpInputCalendarAccesskey,
                        calendarClass = attrs.mpInputCalendarClass,
                        calendarDisabled = attrs.mpInputCalendarDisabled,
                        calendarEnableDays = attrs.mpInputCalendarEnableDays,
                        inputsQty,
                        templateBase = 'gaiafrontend/html/inputCalendar{inputsQty}.html',
                        templateUrl,
                        templatePromise,
                        lang = Language.get().languageId,
                        localeFile = 'i18n/datepicker-' + lang + '.js',
                        localePromise,
                        pluginFile = 'jquery.inputmask.js',
                        pluginPromise;

                    inputsQty = parseInt(calendarInputs, 10) === 1 ? 1 : 3;
                    templateUrl = templateBase.replace('{inputsQty}', inputsQty);
                    templatePromise = HttpSrv.get(templateUrl);
                    localePromise = Loader.load(localeFile);
                    pluginPromise = Loader.load(pluginFile);

                    scope.userInfo = UserSrv.info;
                    // if (_.isEmpty(scope.userInfo)) {
                    //     UserSrv.getInfo();
                    // }

                    function initCalendar(data) {
                        var templateContent = data[0],
                            dayRegExp = /d/g,
                            // dayRegExp = /d/gi,
                            monthRegExp = /M/g,
                            // monthRegExp = /M/gi,
                            yearRegExp = /y/g,
                            // yearRegExp = /y/gi,
                            elemLabels,
                            elemInputs;

                        elem.append(templateContent);
                        elemLabels = elem.find('label');
                        elemInputs = elem.find('.date');

                        function getMask(format) {
                            var formattedDateSample = $filter('date')(new Date(), format);
                            return formattedDateSample.replace(/[a-z]/gi, 'a').replace(/[0-9]/gi, '9');
                        }

                        function addAccesskey() {
                            elemInputs.attr('accesskey', calendarAccesskey);
                        }

                        function addClasses() {
                            elemInputs.addClass(calendarClass);
                        }

                        function getMatches(regexp) {
                            return calendarFormat.match(regexp) || [];
                        }

                        function getFormat(regexp) {
                            return getMatches(regexp).join('');
                        }

                        function getLength(regexp) {
                            return getMatches(regexp).length;
                        }

                        function getPosition(regexp) {
                            return calendarFormat.search(regexp);
                        }

                        function getInput(regexp) {
                            return angular.element(_.find(elemInputs, function(input) {
                                return angular.element(input).is('[id$=' + getFormat(regexp) + ']');
                            }));
                        }

                        function getInputValue(regexp) {
                            var inputValue;

                            if (inputsQty > 1) {
                                inputValue = getInput(regexp).val();
                            } else {
                                inputValue = elemInputs.val().substr(getPosition(regexp), getLength(regexp));
                            }

                            return inputValue;
                        }

                        function getDay() {
                            return getInputValue(dayRegExp);
                        }

                        function getMonth() {
                            return (+getInputValue(monthRegExp) - 1).toString();
                        }

                        function getCentury() {
                            return (new Date()).getFullYear().toString().substr(0, 2);
                        }

                        function getYear() {
                            var yearLength = getLength(yearRegExp),
                                inputYear = getInputValue(yearRegExp);

                            return yearLength === 2 && inputYear ? getCentury() + inputYear : inputYear;
                        }

                        function updateModel(day, month, year) {
                            var date = new Date(0);

                            function setDayMonthYear(day, month, year) {
                                date.setFullYear(parseInt(year, 10));
                                date.setMonth(parseInt(month, 10));
                                date.setDate(parseInt(day, 10));
                            }

                            setDayMonthYear(day, month, year);

                            function convertToUTC(date) {
                                var MS_IN_ONE_MINUTE = 60000;
                                return date - (date.getTimezoneOffset() * MS_IN_ONE_MINUTE);
                            }

                            $parse(calendarModel).assign(scope, convertToUTC(date));
                        }

                        function updateView(data) {
                            var formattedDate = $filter('date')(data, calendarFormat),
                                formattedDay = $filter('date')(data, getFormat(dayRegExp)),
                                formattedMonth = $filter('date')(data, getFormat(monthRegExp)),
                                formattedYear = $filter('date')(data, getFormat(yearRegExp));

                            if (inputsQty > 1) {
                                getInput(dayRegExp).inputmask('remove').val(formattedDay).inputmask(getMask(getFormat(dayRegExp)));
                                getInput(monthRegExp).inputmask('remove').val(formattedMonth).inputmask(getMask(getFormat(monthRegExp)));
                                getInput(yearRegExp).inputmask('remove').val(formattedYear).inputmask(getMask(getFormat(yearRegExp)));
                            } else {
                                elemInputs.inputmask('remove').val(formattedDate).inputmask(getMask(calendarFormat));
                            }
                        }

                        function prepareThreeInputs() {
                            var unsortedDayMonthYear = [],
                                sortedDayMonthYear;

                            unsortedDayMonthYear.push({
                                position: getPosition(dayRegExp),
                                format: getFormat(dayRegExp),
                                length: getLength(dayRegExp)
                            });
                            unsortedDayMonthYear.push({
                                position: getPosition(monthRegExp),
                                format: getFormat(monthRegExp),
                                length: getLength(monthRegExp)
                            });
                            unsortedDayMonthYear.push({
                                position: getPosition(yearRegExp),
                                format: getFormat(yearRegExp),
                                length: getLength(yearRegExp)
                            });

                            sortedDayMonthYear = _.sortBy(unsortedDayMonthYear, 'position');

                            _.each(sortedDayMonthYear, function(dayMonthYear, i) {
                                var id = calendarId + '-' + dayMonthYear.format,
                                    mask = getMask(dayMonthYear.format);

                                elemLabels.eq(i).attr('for', id);
                                elemInputs.eq(i).attr('id', id);
                                elemInputs.eq(i).attr('name', id);
                                elemInputs.eq(i).inputmask(mask);
                            });
                        }

                        function prepareSinlgeInput() {
                            elemLabels.attr('for', calendarId + '-date');
                            elemInputs.attr('id', calendarId + '-date');
                            elemInputs.attr('name', calendarId + '-date');
                            elemInputs.inputmask(getMask(calendarFormat));
                        }

                        function angularDateFormatToDatepickerDateFormat(format) {
                            if (!angular.isString(format)) {
                                return format;
                            }

                            /* REMOVE UNSUPPORTED ANGULARJS FORMATS */
                            format = format.replace(/HH/g, '').replace(/hh/g, '').replace(/mm/g, '').replace(/ss/g, '').replace(/.sss/g, '').replace(/,sss/g, '');

                            /* ANGULARJS- DATEPICKER- DESCRIPTION
                             * MM       - mm        - month of year (two digit)
                             * yy       - y         - year (two digit)
                             * yyyy     - yy        - year (four digit)
                             */
                            format = format.replace(/MM/g, 'mm').replace(/yy/g, 'y');

                            return format;
                        }

                        function manageEnableDays() {
                            // Only c
                            var element = angular.element('#ui-datepicker-div');

                            if (calendarEnableDays) {
                                element.removeClass('enable-days');
                            } else {
                                element.addClass('enable-days');
                            }
                        }

                        function addIdsAndBehaviour() {
                            if (inputsQty > 1) {
                                prepareThreeInputs();
                            } else {
                                prepareSinlgeInput();
                            }

                            elemInputs.datepicker({
                                showOn: 'button',
                                buttonImageOnly: true,
                                buttonImage: 'gaiafrontend/img/ico-calendar-on.png',
                                dateFormat: angularDateFormatToDatepickerDateFormat(calendarFormat),
                                beforeShow: function() {
                                    manageEnableDays();
                                },
                                onSelect: function(dataText, dataInstance) {
                                    scope.$apply(function() {
                                        updateModel(dataInstance.currentDay, dataInstance.currentMonth, dataInstance.currentYear);
                                    });
                                }
                            });

                            // <IE9 FIX since :last-child selector is not supported
                            elem.find('.ui-datepicker-trigger:last-child').show();
                        }

                        function manageDisable(disabled) {
                            if (disabled) {
                                elemInputs.datepicker('option', 'disabled', true);
                                elemInputs.attr('disabled', 'disabled');
                                elem.find('.ui-datepicker-trigger').addClass('disabled');
                            } else {
                                elemInputs.datepicker('option', 'disabled', false);
                                elemInputs.removeAttr('disabled');
                                elem.find('.ui-datepicker-trigger').removeClass('disabled');
                            }
                        }

                        function prepareDOM() {
                            if (calendarAccesskey) {
                                addAccesskey();
                            }

                            if (calendarClass) {
                                addClasses();
                            }

                            if (calendarId) {
                                addIdsAndBehaviour();
                            }
                        }

                        // This method modifies the input AngularJS date format so we the the inputmask can be fixed (no dynamic mask supported yet)
                        function standarizeFormat(angularFormat) {
                            if (!angular.isString(angularFormat)) {
                                return angularFormat;
                            }

                            // * EEEE     - day name long -> dd
                            // * EEE      - day name short -> dd
                            // * dd       - day of month (two digit) -> dd
                            // * d        - day of month (no leading zero) -> dd
                            angularFormat = angularFormat.replace(/D/g, 'd');
                            angularFormat = angularFormat.replace(/EEEE/g, 'EEE').replace(/EEE/g, 'dd').replace(/dd/g, 'd').replace(/d/g, 'dd');
                            // * MMMM     - month name long -> MM
                            // * MMM      - month name short -> MM
                            // * MM       - month of year (two digit) -> MM
                            // * M        - month of year (no leading zero) -> MM
                            angularFormat = angularFormat.replace(/m/g, 'M');
                            angularFormat = angularFormat.replace(/MMMM/g, 'MMM').replace(/MMM/g, 'MM').replace(/MM/g, 'M').replace(/M/g, 'MM');
                            // * yy       - year (two digit) -> yy
                            // * yyyy     - year (four digit) -> yyyy
                            // * y        - year (one digit) -> y
                            angularFormat = angularFormat.replace(/Y/g, 'y');

                            // * HH       - hour in day, padded (00-23) -> HH
                            // * H        - hour in day (0-23) -> HH
                            // * hh       - hour in am/pm, padded (01-12) -> hh
                            // * h        - hour in am/pm, (1-12) -> hh
                            // * mm       - minute in hour, padded (00-59) -> mm
                            // * m        - minute in hour (0-59) -> mm
                            // * ss       - second in minute, padded (00-59) -> ss
                            // * s        - second in minute (0-59) -> ss
                            // * (.|,)sss - millisecond in second, padded (000-999) -> .sss|,sss

                            // * a        - am/pm marker -> a

                            // * Z        - 4 digit (+sign) representation of the timezone offset (-1200-+1200) -> Z

                            return angularFormat;
                        }

                        calendarFormat = standarizeFormat(attrs.mpInputCalendarFormat);

                        if (!calendarFormat) {
                            calendarFormat = standarizeFormat($locale.DATETIME_FORMATS.shortDate);
                            scope.$watch('userInfo.applicationData.formattingAndMask.shortDate', function(userInfoDateFormat) {
                                calendarFormat = standarizeFormat(userInfoDateFormat || calendarFormat);
                                prepareDOM();
                            });
                        } else {
                            prepareDOM();
                        }

                        if (calendarModel) {
                            elemInputs.on('change', function() { //REVIEW: fixed the updateModel weird event action
                                scope.$apply(function() {
                                    updateModel(getDay(), getMonth(), getYear());
                                });
                            });
                            scope.$watch(calendarModel, updateView);
                        }

                        if (calendarDisabled) {
                            scope.$watch(calendarDisabled, manageDisable);
                        }

                        if (calendarEnableDays) {
                            calendarEnableDays = !!$parse(attrs.mpInputCalendarEnableDays)(scope);
                        }
                    }

                    $q.all([templatePromise, localePromise, pluginPromise])
                        .then(initCalendar);
                }
            };
        }]);
