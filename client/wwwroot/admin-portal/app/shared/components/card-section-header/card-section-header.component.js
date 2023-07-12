'use strict';

define(['angular', 'coreConstants', 'system'], function (ng, coreConstants, system) {
    var folder = system.apps.ap.location;
    CardSectionHeaderController.$inject = ['$stateParams','AdminRamoFactory'];
    function CardSectionHeaderController($stateParams,AdminRamoFactory) {
        var vm = this;
        vm.$onInit = onInit;
        vm.card;
        vm.fnCheckBox = fnCheckBox;

        function onInit() {
        }

        function fnCheckBox(item) {
            var body = {
                seccionId: vm.section.code,
                activo: item.activo
            }
            AdminRamoFactory.updateStatusSection(vm.section.code,vm.ramo.code,body).then(
                function( data ) {
                    if(data.codigo === 1001){
                        item.activo = !item.activo
                    }
                },
                function(){
                    item.activo = !item.activo
                }
            )
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('CardSectionHeaderController', CardSectionHeaderController)
        .component('apCardSectionHeader', {
            templateUrl: folder + '/app/shared/components/card-section-header/card-section-header.component.html',            
            controller: 'CardSectionHeaderController',
            bindings: {
                card : '=',
                section: '=',
                ramo: '=',
            }
        });
});
