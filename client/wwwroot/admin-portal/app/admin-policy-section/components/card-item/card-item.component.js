'use strict';

define(['angular', 'coreConstants', 'system'], function (ng, coreConstants, system) {
    var folder = system.apps.ap.location;
    CardItemController.$inject = ['$stateParams', 'AdminRamoFactory','mModalConfirm'];
    function CardItemController($stateParams, AdminRamoFactory,mModalConfirm) {
        var vm = this;
        vm.$onInit = onInit;
        vm.fnCheckBox = fnCheckBox;
        vm.onSectionAddclick = onSectionAddclick;
        vm.onSectionRemoveclick = onSectionRemoveclick;
        vm.onSectionOrderclick = onSectionOrderclick;

        function onInit() {
        }

        function onSectionAddclick() {
            AdminRamoFactory.emitClickSectionAdd({ isNew: false, section: vm.section, ramo: vm.ramo, item: vm.card });
        }

        function onSectionRemoveclick() {
            AdminRamoFactory.emitClickSectionRemove({ section: vm.section, ramo: vm.ramo, item: vm.card });
        }

        function onSectionOrderclick(next) {
            if ((next && vm.card.orderUp) || (!next && vm.card.orderDown)) {
                AdminRamoFactory.emitClickSectionOrder({ section: vm.section, ramo: vm.ramo, item: vm.card, next: next });
            }
        }

        function fnCheckBox(item) {
            mModalConfirm.confirmInfo(
                null,
                '¿Estás seguro de ' + (item.active ? 'habilitar' : 'inhabilitar') + ' el componente?',
                'SI').then(function (response) {
                    if (response) {
            var body = {
                accion: "ACTIVE",
                activo: item.active
            }
            AdminRamoFactory.updateCardSection(vm.section.code, vm.ramo.code, item.contentId, body).then(
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
                }).catch(function (error) {  item.active =!item.active });;
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('CardItemController', CardItemController)
        .component('apCardItem', {
            templateUrl: folder + '/app/admin-policy-section/components/card-item/card-item.component.html',
            controller: 'CardItemController',
            transclude: true,
            bindings: {
                card: '=',
                section: '=',
                ramo: '=',
                config: '='
            }
        });
});
