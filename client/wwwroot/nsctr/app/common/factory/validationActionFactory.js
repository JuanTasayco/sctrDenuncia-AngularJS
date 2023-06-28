'use strict'

define([
	'angular', 'constants','lodash', 'nsctr_constants'
], function(angular, constants, _,nsctr_constants){

		var appNsctr = angular.module('appNsctr');

        appNsctr.factory('validationActionFactory',
			['proxyMenu', '$q',
			function(proxyMenu, $q){

                function _filterData(data, filter, type){
                    var data_return = _.find(data , function(item){
                        return  item[type] === filter ? item : false;
                    })

                    return type != "nombreCorto" ? data_return : (data_return) ? true : false;
                    //return data_return;
                }
                return{
                    _filterData : _filterData,
                };
    
        }]);
        
});
