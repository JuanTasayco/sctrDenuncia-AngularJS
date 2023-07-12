'use strict';

define(['angular', 'coreConstants', 'system'], function (ng, coreConstants, system) {
    var folder = system.apps.ap.location;
    CardSectionHeaderController.$inject = ['$stateParams','AdminRamoFactory'];
    function CardSectionHeaderController($stateParams,AdminRamoFactory) {
        var vm = this;
        vm.$onInit = onInit;
        vm.card;
        vm.fnCheckBox = fnCheckBox;
        vm.onSectionAddclick = onSectionAddclick;

        function onInit() {
            console.log("CardSectionHeaderController");
        }

        function onSectionAddclick(){
            AdminRamoFactory.emitClickSectionAdd({ aaa : 'eee' });
        }

        function fnCheckBox(item) {
            console.log(item)
            var body = {
                seccionId: vm.section,
                activo: item.activo
            }
            AdminRamoFactory.UpdateStatusSection(vm.section,vm.idProducto,body).then(
                function( data ) {
                    console.log(data)
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
                idProducto: '=',
            }
        });
});
