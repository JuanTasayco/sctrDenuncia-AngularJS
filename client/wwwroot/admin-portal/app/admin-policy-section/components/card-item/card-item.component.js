'use strict';

define(['angular', 'coreConstants', 'system'], function (ng, coreConstants, system) {
    var folder = system.apps.ap.location;
    CardItemController.$inject = ['$stateParams','AdminRamoFactory'];
    function CardItemController($stateParams,AdminRamoFactory) {
        var vm = this;
        vm.$onInit = onInit;
        vm.card;
        vm.fnCheckBox = fnCheckBox;

        function onInit() {
            console.log("CardItemController");
            vm.card = vm.item
            console.log(vm.card)
        }

        function fnCheckBox(item) {
            console.log(item)
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('CardItemController', CardItemController)
        .component('apCardItem', {
            templateUrl: folder + '/app/admin-policy-section/components/card-item/card-item.component.html',            
            controller: 'CardItemController',
            transclude: true,
            bindings: {
                item: '=',
            }
        });
});
