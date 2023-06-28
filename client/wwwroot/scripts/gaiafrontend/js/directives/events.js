/*global angular */
angular.module('events', [])
    .value('Events', {
        $formControlError: function(string) {
            return '$error(' + string + ')';
        },
        $formControlFocus: function(string) {
            return '$focus(' + string + ')';
        },
        $formControlClick: function(string) {
            return '$click(' + string + ')';
        },
        $formControlReady: function(string) {
            return '$ready(' + string + ')';
        },
        $languageChanged: '$languageChanged'
    });
