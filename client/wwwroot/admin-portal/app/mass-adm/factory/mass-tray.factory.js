'use strict';

define([
    'angular',
    'coreConstants',
    'endpointsConstants',
    'lodash',
], function(ng, coreConstants, endpointsConstants, _) {

    MassTrayFactory.$inject = ['$q', 'httpData', '$log', 'mpSpin', '$stateParams', 'CommonFactory'];

    function MassTrayFactory($q, httpData, $log, mpSpin, $stateParams, CommonFactory) {

        var domain = endpointsConstants.default;

        return {
            SearchMass: SearchMass
        };

        function SearchMass(queryReq, showSpin) {
            return httpData
                .get(
                domain + 'api/v1/misas',
                {
                    params: _.assign(
                    // {
                    //     codigoApp: $stateParams.codeApp
                    // },
                    queryReq
                    )
                },
                undefined,
                showSpin
                )
                .then(function(res) {
                return _.assign(res, {listaResultados: res.listaResultados});
                });
        }
    }

    return ng.module(coreConstants.ngMassTrayModule, []).factory('MassTrayFactory', MassTrayFactory);
});