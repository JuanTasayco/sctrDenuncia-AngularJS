'use strict';

define(['angular', 'coreConstants', 'system'], function (ng, coreConstants, system) {
    var folder = system.apps.ap.location;
    CardSectionController.$inject = ['$stateParams'];
    function CardSectionController($stateParams) {
        var vm = this;
        vm.$onInit = onInit;
        function onInit() {
            console.log("CardSectionController");
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('CardSectionController', CardSectionController)
        .component('apCardSection', {
            templateUrl: folder + '/app/shared/components/card-section/card-section.component.html',            
            controller: 'CardSectionController',
            bindings: {
            }
        });
});
