/*global angular */
/*DEPRECATED*/
angular.module('mpInputFile', [])
    .directive('mpInputFile', function() {
        return {
            scope: {
                mpInputFile: '@'
            },
            templateUrl: 'gaiafrontend/html/inputFile.html'
        };
    });
