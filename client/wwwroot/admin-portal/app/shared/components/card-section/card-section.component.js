'use strict';

define(['angular', 'coreConstants', 'system'], function (ng, coreConstants, system) {
    var folder = system.apps.ap.location;
    CardSectionController.$inject = ['$stateParams'];
    function CardSectionController($stateParams) {
        var vm = this;
        vm.$onInit = onInit;
        vm.onSectionItemClick = onSectionItemClick;

        function onInit() {
            vm.sections = vm.items
        }

        function onSectionItemClick(item){
            vm.sections.filter(x => x.selected).forEach(x => x.selected = false);
            item.selected = true;
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
