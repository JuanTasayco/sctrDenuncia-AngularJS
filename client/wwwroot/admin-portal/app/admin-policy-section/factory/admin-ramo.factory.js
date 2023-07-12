'use strict';

define(['angular', 'coreConstants', 'lodash', 'endpointsConstants'], function (
    ng,
    coreConstants,
    _,
    endpointsConstants
) {
    AdminRamoFactory.$inject = ['httpData', '$stateParams','CommonFactory','GeneralAdminRamoFactory'];
    function AdminRamoFactory(httpData, $stateParams,CommonFactory, GeneralAdminRamoFactory) {
        var domain = endpointsConstants.default;
        var listSubsChangeRamo = [];

        return {
            GetSection: GetSection,
            GetSectionListContent: GetSectionListContent,
            executeChangeRamos : executeChangeRamos,
            UpdateStatusSection : UpdateStatusSection,
            subsChangeRamo : subsChangeRamo,
        };

        function GetSection(showSpin) {
            return CommonFactory.GetSection(coreConstants.codigoAppMassAdm,209, showSpin);
        }

        function GetSectionListContent(seccionId, idProducto) {
            return GeneralAdminRamoFactory.GetSectionListContent(coreConstants.codigoAppMassAdm, seccionId, idProducto, true);
        }

        function UpdateStatusSection(seccionId, idProducto, body) {
            return GeneralAdminRamoFactory.UpdateStatusSection(coreConstants.codigoAppMassAdm, seccionId, idProducto, body ,true);
        }

        function subsChangeRamo(fn){
            listSubsChangeRamo.push(fn);
        }

        function executeChangeRamos(item){
            for (let index = 0; index < listSubsChangeRamo.length; index++) {
                listSubsChangeRamo[index](item);
            }
        }

    } // end factory

    return ng.module(coreConstants.ngAdminRamoModule, []).factory('AdminRamoFactory', AdminRamoFactory);
});
