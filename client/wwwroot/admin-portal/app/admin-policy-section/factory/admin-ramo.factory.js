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
        var listSubsClickSectionAdd = [];
        var listSubsClickSectionRemove = [];
        var listSubsClickSectionOrder = [];
        var itemSectionSelected = null;

        return {
            GetSection: GetSection,
            getSectionListContent: getSectionListContent,
            executeChangeRamos : executeChangeRamos,
            updateStatusSection : updateStatusSection,
            setSectionSelected : setSectionSelected,
            getSectionSelected : getSectionSelected,
            emitClickSectionAdd : emitClickSectionAdd,
            subsClickSectionAdd : subsClickSectionAdd,
            emitClickSectionRemove : emitClickSectionRemove,
            subsClickSectionRemove : subsClickSectionRemove,
            emitClickSectionOrder : emitClickSectionOrder,
            subsClickSectionOrder : subsClickSectionOrder,
            subsChangeRamo : subsChangeRamo,
            emitComponentsReady : emitComponentsReady,
            subsComponentsReady : subsComponentsReady,
            updateCardSection: updateCardSection,
            saveCardSection: saveCardSection,
            deleteCardSection: deleteCardSection,
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

        function deleteCardSection(seccionId, idProducto, contenidoId) {
            return GeneralAdminRamoFactory.deleteCardSection(coreConstants.codigoAppMassAdm, seccionId, idProducto, contenidoId  ,true);
        }

        function saveCardSection(seccionId, idProducto, body) {
            return GeneralAdminRamoFactory.saveCardSection(coreConstants.codigoAppMassAdm, seccionId, idProducto , body ,true);
        }

        function setSectionSelected(item){
            itemSectionSelected = item;
        }

        function getSectionSelected(){
            return itemSectionSelected;
        }

        function emitClickSectionAdd(item){
            for (var index = 0; index < listSubsClickSectionAdd.length; index++) {
                listSubsClickSectionAdd[index](item);
            }
        }

        function subsClickSectionAdd(fn){
            listSubsClickSectionAdd.push(fn);
        }

        function emitClickSectionRemove(item){
            for (var index = 0; index < listSubsClickSectionRemove.length; index++) {
                listSubsClickSectionRemove[index](item);
            }
        }

        function subsClickSectionRemove(fn){
            listSubsClickSectionRemove.push(fn);
        }

        function emitClickSectionOrder(item){
            for (var index = 0; index < listSubsClickSectionOrder.length; index++) {
                listSubsClickSectionOrder[index](item);
            }
        }

        function subsClickSectionOrder(fn){
            listSubsClickSectionOrder.push(fn);
        }

        function emitComponentsReady(){
            for (var index = 0; index < listComponentsReady.length; index++) {
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
            for (var index = 0; index < listSubsChangeRamo.length; index++) {
                listSubsChangeRamo[index](item);
            }
        }

    } // end factory

    return ng.module(coreConstants.ngAdminRamoModule, []).factory('AdminRamoFactory', AdminRamoFactory);
});
