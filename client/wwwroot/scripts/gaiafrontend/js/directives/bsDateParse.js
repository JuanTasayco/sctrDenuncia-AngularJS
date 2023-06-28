/*global angular, _*/
angular.module('bsDateParse', ['mgcrea.ngStrap'])
    .config(['$provide', function($provide) {

        function $dateParserDecorator($delegate, $locale, dateFilter) {
            var $dateParser = $delegate;

            function extendedDateParser(config) {
                var $dateParserInstance = $dateParser.apply(this, arguments),
                    defaults = {
                        format: 'shortDate',
                        strict: false
                    },
                    options = angular.extend({}, defaults, config),
                    regExpMap = {
                        'sss': '[0-9]{3}',
                        'ss': '[0-5][0-9]',
                        's': options.strict ? '[1-5]?[0-9]' : '[0-9]|[0-5][0-9]',
                        'mm': '[0-5][0-9]',
                        'm': options.strict ? '[1-5]?[0-9]' : '[0-9]|[0-5][0-9]',
                        'HH': '[01][0-9]|2[0-3]',
                        'H': options.strict ? '1?[0-9]|2[0-3]' : '[01]?[0-9]|2[0-3]',
                        'hh': '[0][1-9]|[1][012]',
                        'h': options.strict ? '[1-9]|1[012]' : '0?[1-9]|1[012]',
                        'a': 'AM|PM',
                        'EEEE': $locale.DATETIME_FORMATS.DAY.join('|'),
                        'EEE': $locale.DATETIME_FORMATS.SHORTDAY.join('|'),
                        'dd': '0[1-9]|[12][0-9]|3[01]',
                        'd': options.strict ? '[1-9]|[1-2][0-9]|3[01]' : '0?[1-9]|[1-2][0-9]|3[01]',
                        'MMMM': $locale.DATETIME_FORMATS.MONTH.join('|'),
                        'MMM': $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
                        'MM': '0[1-9]|1[012]',
                        'M': options.strict ? '[1-9]|1[012]' : '0?[1-9]|1[012]',
                        'yyyy': '[1]{1}[0-9]{3}|[2]{1}[0-9]{3}',
                        'yy': '[0-9]{2}',
                        'y': options.strict ? '-?(0|[1-9][0-9]{0,3})' : '-?0*[0-9]{1,4}'
                    },
                    setFnMap = {
                        'sss': Date.prototype.setMilliseconds,
                        'ss': Date.prototype.setSeconds,
                        's': Date.prototype.setSeconds,
                        'mm': Date.prototype.setMinutes,
                        'm': Date.prototype.setMinutes,
                        'HH': Date.prototype.setHours,
                        'H': Date.prototype.setHours,
                        'hh': Date.prototype.setHours,
                        'h': Date.prototype.setHours,
                        'EEEE': angular.noop(),
                        'EEE': angular.noop(),
                        'dd': Date.prototype.setDate,
                        'd': Date.prototype.setDate,
                        'a': function(value) {
                            var hours = this.getHours() % 12;
                            return this.setHours(value.match(/pm/i) ? hours + 12 : hours);
                        },
                        'MMMM': function(value) {
                            return this.setMonth($locale.DATETIME_FORMATS.MONTH.indexOf(value));
                        },
                        'MMM': function(value) {
                            return this.setMonth($locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value));
                        },
                        'MM': function(value) {
                            return this.setMonth(1 * value - 1);
                        },
                        'M': function(value) {
                            return this.setMonth(1 * value - 1);
                        },
                        'yyyy': Date.prototype.setFullYear,
                        'yy': function(value) {
                            return this.setFullYear(2000 + 1 * value);
                        },
                        'y': Date.prototype.setFullYear
                    };
                function daysInMonth(month, year) {
                    switch (month) {
                    case 2:
                        return (year % 4 === 0 && year % 100) || year % 400 === 0 ? 29 : 28;
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        return 30;
                    default:
                        return 31;
                    }
                }

                function isValid(year, month, day, hours, minutes) {

                    if (angular.isDefined(hours) || angular.isDefined(minutes)) {
                        return +hours >= 0 && +hours <= 24 && +minutes >= 0 && +minutes <= 59;
                    } else {
                        return +month > 0 && +month <= 12 && +day > 0 && +day <= daysInMonth(+month, +year);
                    }
                }

                function escapeReservedSymbols(text) {
                    return text.replace(/\//g, '[\\/]').replace('/-/g', '[-]').replace(/\./g, '[.]').replace(/\\s/g, '[\\s]');
                }

                function regExpForFormat(format) {
                    var keys = Object.keys(regExpMap),
                        i,
                        re;

                    re = format;
                    // Abstract replaces to avoid collisions
                    for (i = 0; i < keys.length; i += 1) {
                        re = re.split(keys[i]).join('${' + i + '}');
                    }
                    // Replace abstracted values
                    for (i = 0; i < keys.length; i += 1) {
                        re = re.split('${' + i + '}').join('(' + regExpMap[keys[i]] + ')');
                    }
                    format = escapeReservedSymbols(format);

                    return new RegExp('^' + re + '$', ['i']);
                }

                function setMapForFormat(format) {
                    var keys = Object.keys(setFnMap),
                        i,
                        map = [],
                        sortedMap = [],
                        index,
                        clonedFormat = format; // Map to setFn
                    for (i = 0; i < keys.length; i += 1) {
                        if (format.split(keys[i]).length > 1) {
                            index = clonedFormat.search(keys[i]);
                            format = format.split(keys[i]).join('');
                            if (setFnMap[keys[i]]) {
                                map[index] = setFnMap[keys[i]];
                            }
                        }
                    }
                    // Sort result map
                    angular.forEach(map, function(v) {
                        // conditional required since angular.forEach broke around v1.2.21
                        // related pr: https://github.com/angular/angular.js/pull/8525
                        if (v) {
                            sortedMap.push(v);
                        }
                    });
                    return sortedMap;
                }

                function sortMatches(matches, format) {
                    var myMap = {
                            'y': 0,
                            'yy': 0,
                            'yyyy': 0,
                            'M': 1,
                            'MM': 1,
                            'MMM': 1,
                            'MMMM': 1,
                            'd': 2,
                            'dd': 2,
                            'h': 3,
                            'hh': 3,
                            'HH': 3,
                            'H': 3,
                            'mm': 4,
                            'm': 4
                        },
                        arr = [],
                        response = [],
                        found;

                    _.forEach(myMap, function(pos, key) {
                        found = format.search(key);

                        if (found > -1) {
                            arr.push({
                                pos: pos,
                                found: found
                            });
                        }
                    });

                    _.sortBy(_.uniq(arr, 'pos'), 'found').forEach(function(aux, index) {
                        response[aux.pos] = matches[index];
                    });

                    return response;
                }

                $dateParserInstance.parse = function(value, baseDate, format) {
                    var formatDate = $locale.DATETIME_FORMATS[options.format] || options.format,
                        formatRegex,
                        formatSetMap,
                        matches,
                        sortedMatches,
                        sortedFormatSetMap,
                        date = new Date(),
                        i;

                    if (angular.isDate(value)) {
                        value = dateFilter(value, format || formatDate);
                    }

                    formatRegex = format ? regExpForFormat(format) : regExpForFormat(formatDate);
                    formatSetMap = format ? setMapForFormat(format) : setMapForFormat(formatDate);
                    matches = formatRegex.exec(value);

                    sortedMatches = matches ? sortMatches(_.rest(angular.copy(matches)), formatDate) : matches;
                    sortedFormatSetMap = formatSetMap ? sortMatches(formatSetMap, formatDate) : formatSetMap;
                    matches = matches !== null && isValid(sortedMatches[0], sortedMatches[1], sortedMatches[2], sortedMatches[3], sortedMatches[4]) ? matches : null;


                    if (!matches) {
                        return false;
                    }

                    date = baseDate && !isNaN(baseDate.getTime()) ? baseDate : new Date();

                    //for (i = sortedMatches.length - 1; i >= 0; i -= 1) {
                    for (i = 0; i < sortedMatches.length; i++) {
                        if (sortedFormatSetMap[i]) {
                            sortedFormatSetMap[i].call(date, sortedMatches[i]);
                        }
                    }
                    return date;
                };

                return $dateParserInstance;
            }

            return extendedDateParser;
        }

        $dateParserDecorator.$inject = ['$delegate', '$locale', 'dateFilter'];

        $provide.decorator('$dateParser', $dateParserDecorator);
    }]);
