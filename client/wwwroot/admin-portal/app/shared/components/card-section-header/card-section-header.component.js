'use strict';

define(['angular', 'coreConstants', 'system'], function (ng, coreConstants, system) {
    var folder = system.apps.ap.location;
    CardSectionHeaderController.$inject = ['$stateParams'];
    function CardSectionHeaderController($stateParams) {
        var vm = this;
        vm.$onInit = onInit;
        function onInit() {
            console.log("CardSectionHeaderController");
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('CardSectionHeaderController', CardSectionHeaderController)
        .component('apCardSectionHeader', {
            templateUrl: folder + '/app/shared/components/card-section-header/card-section-header.component.html',            
            controller: 'CardSectionHeaderController',
            bindings: {
            }
        });
});
