'use strict';

define(['angular', 'coreConstants', 'system'], function (ng, coreConstants, system) {
    var folder = system.apps.ap.location;
    CardItemController.$inject = ['$stateParams'];
    function CardItemController($stateParams) {
        var vm = this;
        vm.$onInit = onInit;
        function onInit() {
            console.log("CardItemController");
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('CardItemController', CardItemController)
        .component('apCardItem', {
            templateUrl: folder + '/app/admin-policy-section/components/card-item/card-item.component.html',            
            controller: 'CardItemController',
            transclude: true,
            bindings: {
            }
        });
});
