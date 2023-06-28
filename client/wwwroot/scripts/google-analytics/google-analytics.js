define(['angular', 'system', 'lodash', 'constants'],
  function(angular, system, _, constants) {
    angular
      .module('oim.google.analytics', [])
      .service('gaService', ['$window', function($window) {
        function _getSite() {
          return $window.localStorage['appOrigin'] || 'OIM';
        }

        function _getApp() {
          var pathname = location.pathname.replaceAll('/', '');
          var REGEX_PATHNAME = new RegExp(pathname, 'i');

          return _.find(system.apps, function(app) {
            return REGEX_PATHNAME.test(app.location);
          }) || {};
        }

        function _getUserType() {
          var profile = JSON.parse(localStorage.getItem('profile')) || {};
          var userType = _.find(constants.typeLogin, function(fv) {
            return (fv.code === profile.code);
          }) || {};

          if (userType.code === constants.typeLogin.ejecutivo.code && profile.isAgent) {
            userType.name = 'Ejecutivo Agente';
          }

          return userType;
        }

        function _getGlobalValues() {
          var site = _getSite();
          var app = _getApp();
          var userType = _getUserType();

          return {
            'g.site': site,
            'g.app': app.menuName || '',
            'g.userType': userType.name || ''
          };
        }

        function _replaceValues(label, properties) {
          var labelNew = label;
          Object.keys(properties).forEach(function(name) {
            if (typeof properties[name] === 'object' && properties[name]) {
              Object.keys(properties[name]).forEach(function(nameS) {
                labelNew = labelNew.replace('{{' + nameS + '}}', properties[name][nameS]);
              });
            } else {
              labelNew = labelNew.replace('{{' + name + '}}', properties[name]);
            }
          });

          return labelNew;
        }

        function _getValues(label, data) {
          var labelNew = label;
          if (label) {
            var existsGlobals = label.match(/{{g\.[a-zA-Z]+}}/gi);

            if (existsGlobals) {
              labelNew = _replaceValues(labelNew, _getGlobalValues());
            }
          }

          return labelNew;
        }

        function _getDimensions(value) {
          if (!value) { return {}; }

          var values = value.split(',');

          return values.reduce(function(previous, current) {
            var currentSplit = current.split(':');
            previous[currentSplit[0]] = currentSplit[1];

            return previous;
          }, {});
        }

        function _add(ga) {
          if (!$window.dataLayer) $window.dataLayer = [];

          var gaEvent = {
            event: ga.gaEvent || 'ga_event',
            category: _getValues(ga.gaCategory),
            action: _getValues(ga.gaAction),
            label: _getValues(ga.gaLabel),
            valueCustom: _getValues(ga.gaValue)
          };

          var dimensions = _getDimensions(_getValues(ga.gaDimensions));
          var newGaEvent = angular.extend({}, gaEvent, dimensions);

          $window.dataLayer.push(newGaEvent);
        }

        return {
          add: _add
        }
      }])
      .directive('gaClick', function(gaService) {
        return {
          restrict: 'A',
          scope: {
            gaEvent: '=?',
            gaCategory: '=',
            gaAction: '=',
            gaLabel: '=',
            gaValue: '=?',
            gaData: '=?'
          },
          link: function (scope, element) {
            element.bind('click', function() {
              gaService.add(scope);
            });
          }
        };
      });
  });
