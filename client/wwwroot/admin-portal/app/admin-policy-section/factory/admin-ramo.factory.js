'use strict';

define(['angular', 'coreConstants', 'lodash', 'endpointsConstants'], function (
    ng,
    coreConstants,
    _,
    endpointsConstants
) {
    AdminRamoFactory.$inject = ['httpData', '$stateParams'];
    function AdminRamoFactory(httpData, $stateParams) {
        var domain = endpointsConstants.default;

        return {
        };



    } // end factory

    return ng.module(coreConstants.ngAdminRamoModule, []).factory('AdminRamoFactory', AdminRamoFactory);
});
