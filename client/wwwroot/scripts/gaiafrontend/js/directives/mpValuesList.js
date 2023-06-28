/*TODO: TODO UPDATE DOC*/
/**
* @doc-component directive
* @name gaiafrontend.directive.mpValuesList
* @description
* Documentation pending.
*/
/*global angular */
angular.module('mpValuesList', [])
    .constant('ValuesListConfig', {
        url: 'api/valuesList'
    })
    .factory('ValuesListSrv', ['HttpSrv', 'ValuesListConfig', function (HttpSrv, ValuesListConfig) {
        return {
            get: function getValuesList(data) {
                return HttpSrv.post(ValuesListConfig.url, data);
            }
        };
    }])
    .controller('ValuesListCtrl', ['$scope', '$parse', '$modal', '$filter', function ($scope, $parse, $modal, $filter) {
        $scope.model = $scope.model = {};

        function translateColNames(deferred) {
            return function (valuesListResponse) {
                if (valuesListResponse.config && valuesListResponse.config.colNames) {
                    angular.forEach(valuesListResponse.config.colNames, function (colName, index, colNames) {
                        colNames[index] = $filter('translate')(colName);
                    });
                }
                return deferred.resolve(valuesListResponse);
            }
        }

        this.open = function () {
            $modal.open({
                backdrop: 'static',
                template: '<div class="modal-container">' +
                    '<div class="modal-body">' +
                    '<div mp-grid="valuesListGrid" mp-grid-pager="valuesListPager" mp-grid-options="valuesList.config" mp-grid-model="valuesList.model" mp-grid-data="valuesList.data">' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '<button type="button" class="btn btn-navigation pull-left" ng-click="cancel()">' + $filter('translate')('mpValuesList.cancel') + '</button>' +
                    '<button type="button" class="btn btn-navigation" ng-click="accept()">' + $filter('translate')('mpValuesList.accept') + '</button' +
                    '</div>' +
                    '</div>',
                scope: $scope,
                controller: ['$scope', '$modalInstance', 'valuesListResponse', '$rootScope',
                    function ($scope, $modalInstance, valuesListResponse, $rootScope) {
                        var valuesListInputData = $scope.inputData || {},
                            inputData = valuesListInputData.data || valuesListInputData;

                        if (angular.isUndefined(inputData.insVal) || angular.isUndefined(inputData.lstIdn) || angular.isUndefined(inputData.lstVrs)) {
                            throw new Error('"insVal", "lstIdn" and "lstVrs" are mandatory input data properties');
                        }

                        $scope.valuesList = valuesListResponse;

                        $scope.$parent.config = $scope.valuesList.config;

                        $scope.cancel = function () {
                            $modalInstance.dismiss();
                        };

                        $scope.accept = function () {
                            if ($scope.valuesList && $scope.valuesList.model) {
                                $modalInstance.close($scope.valuesList.model);
                            } else {
                                $scope.cancel();
                            }
                        };

                        var unRegisterStateEvent = $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                            $scope.cancel();
                            });

                        $scope.$on('$destroy', function() {
                            unRegisterStateEvent();
                        });

                        $scope.$on('valuesListGridSet', function (event, grid) {
                            grid.jqGrid('navGrid', '#valuesListPager', {
                                edit: false,
                                add: false,
                                del: false,
                                search: false,
                                refresh: false
                            });

                            grid.jqGrid('navButtonAdd', '#valuesListPager', {
                                caption: $filter('translate')('mpValuesList.search'),
                                buttonicon: 'ui-icon-search',
                                onClickButton: function () {
                                    grid[0].triggerToolbar();
                                }
                            });

                            grid.jqGrid('filterToolbar', {
                                searchOperators: true,
                                searchOnEnter: true,
                                autosearch: true
                            });

                            if ($scope.filter) $scope.filter({$scope: $scope});

                            //TODO: searchOptions.sopt could come from the service
                            grid.jqGrid('getGridParam', 'colModel').forEach(function (col) {
                                grid.jqGrid('setColProp', col.name, {
                                    searchoptions: {
                                        defaultValue: $parse(col.name)($scope.model) || '',
                                        sopt: ['cn', 'nc', 'eq', 'ne', 'lt', 'le', 'gt', 'ge', 'bw', 'bn', 'in', 'ni', 'ew', 'en']
                                    }
                                });
                            });

                            grid[0].clearToolbar();
                            grid[0].triggerToolbar();
                        });
                    }
                ],
                size: 'lg',
                resolve: {
                    valuesListResponse: ['ValuesListSrv', '$q', function (ValuesListSrv, $q) {
                        var deferred = $q.defer();

                        ValuesListSrv.get($scope.inputData)
                            .then(translateColNames(deferred), deferred.reject);

                        return deferred.promise;
                    }]
                }
            }).result
                .then(function (data) {
                    $scope.model = data;
                });
        };
    }])
    .directive('mpValuesList', function () {
        return {
            templateUrl: 'gaiafrontend/html/valuesList.html',
            replace: true,
            scope: {
                inputData: '=mpValuesList',
                model: '=mpValuesListModel',
                config: '=?mpValuesListConfig',
                filter: '&?mpValuesListFilter'
            },
            controller: 'ValuesListCtrl',
            require: 'mpValuesList',
            link: function (scope, element, attrs, ValuesList) {
                element.on('click', ValuesList.open);
                element.on('$destroy', function () {
                    element.off('click', ValuesList.open);
                })
            }
        };
    });
