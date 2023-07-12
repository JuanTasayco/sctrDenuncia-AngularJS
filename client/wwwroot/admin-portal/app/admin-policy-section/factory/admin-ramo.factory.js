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
        var listComponentsReady = [];
        var itemSectionSelected = null;

        return {
            GetSection: GetSection,
            getSectionListContent: getSectionListContent,
            executeChangeRamos : executeChangeRamos,
            updateStatusSection : updateStatusSection,
            setSectionSelected : setSectionSelected,
            getSectionSelected : getSectionSelected,
            subsChangeRamo : subsChangeRamo,
            emitComponentsReady : emitComponentsReady,
            subsComponentsReady : subsComponentsReady,
            updateCardSection: updateCardSection
        };

        function GetSection(showSpin) {
            return CommonFactory.GetSection(coreConstants.codigoAppMassAdm,209, showSpin);
        }

        function getSectionListContent(seccionId, idProducto) {
            return GeneralAdminRamoFactory.getSectionListContent(coreConstants.codigoAppMassAdm, seccionId, idProducto, true);
        }

        function updateStatusSection(seccionId, idProducto, body) {
            return GeneralAdminRamoFactory.updateStatusSection(coreConstants.codigoAppMassAdm, seccionId, idProducto, body ,true);
        }

        function updateCardSection(seccionId, idProducto, contenidoId, body) {
            return GeneralAdminRamoFactory.updateCardSection(coreConstants.codigoAppMassAdm, seccionId, idProducto, contenidoId , body ,true);
        }

        function setSectionSelected(item){
            itemSectionSelected = item;
        }

        function getSectionSelected(){
            return itemSectionSelected;
        }

        function emitComponentsReady(){
            for (let index = 0; index < listComponentsReady.length; index++) {
                listComponentsReady[index]();
            }
        }

        function subsComponentsReady(fn){
            listComponentsReady.push(fn);
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
