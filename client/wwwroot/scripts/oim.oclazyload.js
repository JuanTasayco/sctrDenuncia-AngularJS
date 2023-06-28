define(
[
    'angular', 'helper'
], function(angular, helper)
{
    
    'use strict'
    angular.module('oim.oc.lazyload',['ui.router']).config(['mServiceStateProvider', '$stateProvider' , function(mServiceState, $stateProvider)
    {
        
        
        $stateProvider.decorator('views', function($state, parent)
        {
            
            var result = {},
            views = parent($state);
            angular.forEach(views, function(value, name)
            {
                mServiceState.normalize(value);
            });

            return views;
        })
    }]).provider('mServiceState', ['$stateProvider', '$urlRouterProvider', function($stateProvider,  $urlRouterProvider){
        var  $this = this;
        
        function mx_bundel(state, resolver)
        {
            if (resolver.resolveTemplate === true)
            {
                var _df;
                return {
                    templateProvider: function()
                    {
                        _df.promise();
                    },
                    resolve: ['$templateCache', '$ocLazyLoad', '$q', function($templateCache, $ocLazyLoad, $q)
                    {
                    
                        _df = $q.defer();
                        var promise_r = $ocLazyLoad.load(
                            {
                                name: resolver.moduleName,
                                files: angular.isArray(resolver.files) ? resolver.files : [resolver.files]

                            }).then(function()
                            {
                                _df.resolve(state.templateUrl  &&  $templateCache.get(state.templateUrl));
                            });
                         return promise_r;
                    }]
                };    
            }
            else
            {
                return {
                   
                    resolve: ['$templateCache', '$ocLazyLoad', '$q', function($templateCache, $ocLazyLoad, $q)
                    {
                        var promise_r = $ocLazyLoad.load(
                            {
                                name: resolver.moduleName,
                                files: angular.isArray(resolver.files) ? resolver.files : [resolver.files]

                            });
                        return promise_r;
                    }]
                }; 
            }
        }
        this.setEquivalentThen = function(value){
            
            if (angular.isArray(value.thenRoutes)){
                angular.forEach(value.thenRoutes, function(b){
                    $urlRouterProvider.when(value.url, b)
                });
                
            }
        }
        this.bundel = mx_bundel;
        this.normalize = function (value){
            
            value.resolve = value.resolve || {};
            if (angular.isArray(value.resolver)){
                angular.forEach(value.resolver, function(r, k)
                    {
                        var bundel = mx_bundel(value, r);
                        if (value.templateUrl && r.resolveTemplate === true){
                            value.templateUrl= value.templateUrl;
                            value.templateProvider = bundel.templateProvider;
                        }
                        value.resolve[r.name] = bundel.resolve 
                    })
            }
            return value;
        }
        this.appends = function (states, apply){
            
            helper.normalizeRoutes(states, function(name, value){
                if (angular.isFunction(apply)) 
                    apply(value);
                $stateProvider.state(name, $this.normalize(value));
                $this.setEquivalentThen(value);
            })
        }
        this.$get = [function(){
            return { };
        }]
    }])
});