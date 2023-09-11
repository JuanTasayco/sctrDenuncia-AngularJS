'use strict';

define(['angular', 'coreConstants', 'lodash', 'endpointsConstants'], function (
  ng,
  coreConstants,
  _,
  endpointsConstants
) {
  MassesAndResponsesFactory.$inject = ['httpData', '$stateParams','CommonFactory'];
  function MassesAndResponsesFactory(httpData, $stateParams,CommonFactory) {
    var domain = endpointsConstants.default;


    return {

    };



  } // end factory

  return ng.module(coreConstants.ngMassesAndResponsesModule, []).factory('MassesAndResponsesFactory', MassesAndResponsesFactory);
});
