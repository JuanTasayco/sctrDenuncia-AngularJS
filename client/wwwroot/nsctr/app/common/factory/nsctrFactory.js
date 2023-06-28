'use strict'

define([
	'angular', 'constants',
	'menuFactoryJs',
	'commonFactoryJs',
	'regularFactoryJs',
	'miningFactoryJs',
	'lifeLawFactoryJs',
	'validationActionFactoryJs',
	'objectFactoryJs'
], function(angular, constants){

		var appNsctr = angular.module('appNsctr');
		/*########################
    # factory
    ########################*/
		appNsctr.factory('nsctrFactory',
			['menuFactory', 'commonFactory', 'regularFactory', 'miningFactory', 'lifeLawFactory',
			'objectFactory','validationActionFactory',
			function(menuFactory, commonFactory, regularFactory, miningFactory, lifeLawFactory,
			objectFactory,validationActionFactory){

				return{
					menu 	 	: menuFactory,
					common 	: commonFactory,
					regular : regularFactory,
					mining 	: miningFactory,
					lifeLaw : lifeLawFactory,
					object 	: objectFactory,
					validation: validationActionFactory
				};

		}]);

});

