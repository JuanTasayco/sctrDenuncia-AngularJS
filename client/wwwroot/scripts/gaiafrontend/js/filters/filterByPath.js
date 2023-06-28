angular.module('filterByPath', [])
    .filter('filterByPath', ['$parse',
        function($parse) {
            var regExp = /^\w+/g;

            return function(array, path, expression) {
                var context = {},
                    propName = path.match(regExp)[0],
                    results = [];

                if (!expression && expression !== 0 || expression === '') {
                    return array;
                }
                (function filter(array, collection) {
                    collection.push.apply(collection, _.filter(array, function(item) {
                        var input;
                        context[propName] = item;
                        input = $parse(path)(context) === 0 || angular.isNumber($parse(path)(context)) || angular.isString($parse(path)(context)) ? $parse(path)(context) : '';
                        return angular.isString(expression) && String(input).toLowerCase().search(expression.toLowerCase()) >= 0;
                    }));
                }(array, results));
                return results;
            }
        }
    ]);
