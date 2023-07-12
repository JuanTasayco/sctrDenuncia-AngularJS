'use strict';

define(['angular', 'coreConstants', 'system'], function (ng, coreConstants, system) {
    var folder = system.apps.ap.location;
    CardItemController.$inject = ['$stateParams', 'AdminRamoFactory'];
    function CardItemController($stateParams, AdminRamoFactory) {
        var vm = this;
        vm.$onInit = onInit;
        vm.fnCheckBox = fnCheckBox;

        function onInit() {
        }

        function fnCheckBox(item) {
            console.log(item)
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
            }
        });
});
