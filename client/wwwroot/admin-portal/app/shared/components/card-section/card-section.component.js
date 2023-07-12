'use strict';

define(['angular', 'coreConstants', 'system'], function (ng, coreConstants, system) {
    var folder = system.apps.ap.location;
    CardSectionController.$inject = ['$stateParams','AdminRamoFactory'];
    function CardSectionController($stateParams, AdminRamoFactory) {
        var vm = this;
        vm.$onInit = onInit;
        vm.onSectionItemClick = onSectionItemClick;

        function onInit() {
            vm.sections = vm.items
        }

        function onSectionItemClick(item){
            vm.sections.filter(function (x) { return x.selected === true; }).forEach(function (x) { x.selected = false; });
            item.selected = true;
            AdminRamoFactory.setSectionSelected(item);
        }

    }

    return ng.module(coreConstants.ngMainModule)
        .controller('CardSectionController', CardSectionController)
        .component('apCardSection', {
            templateUrl: folder + '/app/shared/components/card-section/card-section.component.html',            
            controller: 'CardSectionController',
            bindings: {
                items: '='
            }
        });
});
