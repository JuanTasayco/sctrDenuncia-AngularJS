'use strict';

define(['angular', 'moment', 'fullcalendarLanguage'], function(ng, moment) {
  return ng
    .module('appInspec')
    .controller('CalendarController', function() {})
    .component('inspecCalendar', {
      templateUrl: '/inspec/app/_app/common/calendar/calendar.html',
      controller: 'CalendarController',
      controllerAs: '$ctrl',
      bindings: {
        events: '=?',
        canProgram: '=?',
        onlyOneEvent: '=?',
        inspectionDate: '=?'
      }
    })
    .directive('fullCalendar', [
      '$log',
      '$rootScope',
      'mModalAlert',
      '$timeout',
      '$state',
      function($log, rootScope, mModalAlert, $timeout, $state) {
        return {
          restrict: 'A',
          scope: {
            options: '=fullCalendar'
          },
          link: function(scope, element) {
            var defaultOptions = {};
            if (scope.options.onlyOneEvent) {
              defaultOptions = {
                nowIndicator: true,
                defaultView: 'agendaDay',
                minTime: '08:00:00',
                maxTime: '20:00:00',
                header: {left: '', center: 'title', right: ''},
                allDaySlot: false,
                events: [],
                displayEventEnd: true,
                eventRender: function(event, element) {
                  if (event.data) {
                    var html = '<b>Telefono:</b> ' + event.data.phone;
                    element.find('.fc-title').html(html);
                  }
                },
                defaultDate: moment(scope.options.inspectionDate),
                eventClick: function(calEvent) {
                  rootScope.$broadcast('eventClick', {calEvent: calEvent});
                }
              };
            } else {
              defaultOptions = {
                // contentHeight: 'auto',
                nowIndicator: true,
                eventDurationEditable: false,
                allDaySlot: false,
                eventLimit: 2,
                displayEventEnd: true,
                views: {
                  agenda: {
                    minTime: '08:00:00',
                    maxTime: '20:00:00',
                    selectable: !ng.isUndefined(scope.options.canProgram) && scope.options.canProgram
                  }
                },
                viewRender: function(view) {
                  rootScope.$broadcast('changedDates', {
                    // startDate: view.start.format('DD/MM/YYYY'),
                    // endDate: view.end.subtract(1, 'd').format('DD/MM/YYYY')
                    startDate: view.start.format('YYYY-MM-DD[T00:00:00-05:00]'),
                    endDate: view.end.subtract(1, 'd').format('YYYY-MM-DD[T00:00:00-05:00]')
                  });
                },
                header: {left: 'prev,next,title', right: 'agendaDay,agendaWeek,month'},
                locale: 'es',
                timezone: 'local',
                selectHelper: true,
                unselectAuto: false,
                dayClick: function(date) {
                  $(element).fullCalendar('gotoDate', date);
                  $(element).fullCalendar('changeView', 'agendaDay');
                },
                select: function(start, end, allDay, view) {
                  if (view.name === 'agendaDay' || view.name === 'agendaWeek') {
                    // var check = $.fullCalendar.formatDate(start,'yyyy-MM-dd');
                    if (start.isBefore(moment())) {
                      // Previous Day. show message if you want otherwise do nothing.
                      // So it will be unselectable
                      mModalAlert.showError('Debe seleccionar una fecha y hora mayor a la actual', '');
                      calendar.fullCalendar('unselect');
                    } else {
                      rootScope.$broadcast('programRequest', {startDate: start.toDate(), endDate: end.toDate()});
                    }
                  }
                },
                eventClick: function(calEvent) {
                  if (calEvent.data.permission) {
                    if (moment().isBefore(calEvent.start)) {
                      if ($state.current.name === 'agenda') {
                        rootScope.$broadcast('permissionAgent', {calEvent: calEvent});
                      }
                    }
                  } else {
                    rootScope.$broadcast('eventClick', {calEvent: calEvent});
                  }
                },
                defaultView: !scope.options.canProgram ? 'agendaWeek' : 'agendaDay',
                editable: true,
                events: [],
                eventRender: function(event, element) {
                  if (event.data && !event.title) {
                    var html = '<b>Telefono:</b> ' + event.data.phone + '<br><b>Dirección:</b> ' + event.data.address;
                    element.find('.fc-title').html(html);
                  }
                }
              };
            }

            ng.extend({}, defaultOptions, scope.options);
            var calendar = $(element).fullCalendar(defaultOptions);

            scope.$watch(
              'options',
              function(newValue) {
                if (!ng.isUndefined(newValue.events)) {
                  try {
                    calendar.fullCalendar('removeEventSources');
                    calendar.fullCalendar('addEventSource', newValue.events);
                  } catch (e) {}
                }
              },
              true
            );
            scope.$on('unselect', function() {
              calendar.fullCalendar('unselect');
            });

            rootScope.$on(
              'forceRenderCalendar',
              function() {
                $timeout(function() {
                  $('#oneEventCalendar').fullCalendar('render');
                  $('#oneEventCalendar').fullCalendar('rerenderEvents');
                }, 50);
              },
              true
            );
          }
        };
      }
    ]);
});
