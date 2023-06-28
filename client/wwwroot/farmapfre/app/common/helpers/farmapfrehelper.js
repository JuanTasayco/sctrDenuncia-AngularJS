define([
    'angular',
    'moment'
], function(ng, moment) {
    'use strict';
    var appFarmapfre = ng.module('farmapfre.app');

    appFarmapfre.factory('farmapfrehelper', ['$q', function($q) {

        function getDateWithFormat(date) {
            if (!date) {
                return null;
            }
            moment.locale('es');
            var date = moment(date);
            return parseInt(date.format('Hmmss')) > 0 ? date.format('DD/MM/YYYY h:mm a') : date.format('DD/MM/YYYY');
        }

        return {
            getDateWithFormat: getDateWithFormat
        }
    }]);
});