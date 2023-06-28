/*TODO: Refactor to decorator */
/*global angular, _, $script */
 angular.module('state', ['ui.router'])
    .provider('State', function ($stateProvider) {
        var GAIA_DICTIONARY = 'gaiafrontend/i18n/messages.json',
            DEFAULT_DICTIONARY = 'commons/i18n/messages.json';

        function resolveDependencies(dependencies) {
           return ['$q', '$state', '$rootScope', function($q, $state, $rootScope) {
                var deferred = $q.defer(),
                    currentState = $state.$current;

                delete currentState.resolve.dependencies;

                $script(dependencies, function() {
                    $rootScope.$apply(function() {
                        deferred.resolve();
                    });
                });

                return deferred.promise;
            }];
        }

        function resolveDictionary(dictionary) {
            return ['$state', 'i18n', function($state, i18n) {
                var currentState = $state.$current;

                delete currentState.resolve.dictionary;

                return i18n.getDictionary(dictionary);
            }];
        }

        function resolveDictionaryCollection(dictionaryCollection) {
            return ['$state', 'i18n', function($state, i18n) {
                var currentState = $state.$current;

                delete currentState.resolve.dictionary;

                return i18n.getDictionary.apply(this, dictionaryCollection);
            }];
        }

        function resolveDictionaryEndpoint(endpoint) {
            return ['$state', 'i18n', 'Language', function($state, i18n, Language) {
                var currentState = $state.$current,
                    lang = Language.get().languageId,
                    endpoint2 = [GAIA_DICTIONARY];

                if(angular.isArray(endpoint)){
                    for(var i=0;i<endpoint.length;i++){
                        endpoint2.push(endpoint[i].replace(/:lang|{lang}/, lang));
                    }

                }else{
                     endpoint2.push(endpoint.replace(/:lang|{lang}/, lang));
                }

                delete currentState.resolve.dictionary;

                return i18n.getDictionary.apply(this, endpoint2);
            }];
        }

        function resolveState(config) {
            var state = {
                    resolve: {}
                };

            _.extend(state, config);

            function manageDependenciesProperty() {
                if (config.dependencies && config.dependencies.length) {
                    state.resolve.dependencies = resolveDependencies(config.dependencies);
                }
            }

            function manageDictionaryProperty() {
                if (angular.isString(config.dictionary)) {
                    // A dictionary is mandatory so gaiafrontend text translations are displayed properly
                    state.resolve.dictionary = resolveDictionary(config.dictionary || DEFAULT_DICTIONARY);
                } else if (angular.isObject(config.dictionary)) {
                    if(angular.isArray(config.dictionary)){
                        state.resolve.dictionary = resolveDictionaryCollection(config.dictionary || DEFAULT_DICTIONARY);
                    }else{
                        state.resolve.dictionary = resolveDictionaryEndpoint(config.dictionary.endpoint);
                    }
                }
            }

            manageDependenciesProperty();
            manageDictionaryProperty();

            return $stateProvider.state(state);
        }

        function resolveStates(states) {
            var sortedStates = [],
                pendingStatesToFindChildren = [];

            function removeStateFromStates(statesIndex) {
                states.splice(statesIndex, 1);
            }

            function addStateToSortedStates(state) {
                sortedStates.push(state);
            }

            function addToPendingStatesToFindChildren(stateName) {
                pendingStatesToFindChildren.push(stateName);
            }

            function getStatesWhoseParentIs(parentStateName) {
                return _.where(states, {
                    parent: parentStateName
                }) || [];
            }

            function manageStates(statesToManage) {
                _.forEach(statesToManage, function(stateToManage) {
                    removeStateFromStates(_.findIndex(states, stateToManage));
                    addStateToSortedStates(stateToManage);
                    addToPendingStatesToFindChildren(stateToManage.name);
                });
            }

            (function sortStates() {
                manageStates(getStatesWhoseParentIs(undefined));

                while (pendingStatesToFindChildren.length) {
                    manageStates(getStatesWhoseParentIs(pendingStatesToFindChildren.shift()));
                }
            }());

            _.forEach(sortedStates, function(state) {
                resolveState(state);
            });
        }

        return {
            resolve: function (states) {
                resolveStates(states);
                // To allow retro-compatibility
                return angular.noop;
            },
            resolveState: function (state) {
                resolveState(state);
                return angular.noop;
            },
            $get: function () {
                return {
                    resolve: resolveStates,
                    resolveState: resolveState
                };
            }
        };
    });
