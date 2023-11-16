'use strict';

define(['angular', 'coreConstants', 'system'], function (ng, coreConstants, system) {
    var folder = system.apps.ap.location;
    CardSectionHeaderController.$inject = ['$stateParams', 'AdminRamoFactory', 'mModalConfirm'];
    function CardSectionHeaderController($stateParams, AdminRamoFactory, mModalConfirm) {
        var vm = this;
        vm.$onInit = onInit;
        vm.card;
        vm.fnCheckBox = fnCheckBox;
        vm.onSectionAddclick = onSectionAddclick;

        function onInit() {
        }

        function onSectionAddclick() {
            AdminRamoFactory.emitClickSectionAdd({ isNew: true, section: vm.section, ramo: vm.ramo });
        }

        function fnCheckBox(item) {
            mModalConfirm.confirmInfo(
                null,
                '¿Estás seguro de ' + (item.activo ? 'habilitar' : 'inhabilitar') + ' toda la sección?',
                'SI').then(function (response) {
                    if (response) {
            var body = {
                seccionId: vm.section.code,
                activo: item.activo
            }
                        AdminRamoFactory.updateStatusSection(vm.section.code, vm.ramo.code, body).then(
                            function (data) {
                                if (data.codigo === 1001) {
                        item.activo = !item.activo
                    }
                },
                            function () {
                    item.activo = !item.activo
                }
            )
        }
                }).catch(function (error) { item.activo = !item.activo });;
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('CardSectionHeaderController', CardSectionHeaderController)
        .component('apCardSectionHeader', {
            templateUrl: folder + '/app/shared/components/card-section-header/card-section-header.component.html',            
            controller: 'CardSectionHeaderController',
            bindings: {
                card: '=',
                section: '=',
                ramo: '=',
                config: '='
            }
        });
});
