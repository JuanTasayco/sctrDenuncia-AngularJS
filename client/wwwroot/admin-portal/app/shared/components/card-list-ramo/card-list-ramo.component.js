'use strict';

define(['angular', 'coreConstants', 'system'], function (ng, coreConstants, system) {
    var folder = system.apps.ap.location;
    CardListRamoController.$inject = ['$stateParams', 'AdminRamoFactory'];
    function CardListRamoController($stateParams, AdminRamoFactory) {

        var divListRamoScrollIncrement = 66;
        var vm = this;
        var vmParams;
        
        vm.$onInit = onInit;
        vm.onPrevius = onPrevius;
        vm.onNext = onNext;
        vm.onRamoItemClick = onRamoItemClick;

        function onInit() {
            vm.ramos = vm.items;
            AdminRamoFactory.subsComponentsReady(function (){ 
                vm.onRamoItemClick(vm.ramos[0]); 
            });
        }
        
        function onPrevius() {
            var divListRamos = document.getElementById("divListRamos");
            divListRamos.scrollLeft = divListRamos.scrollLeft - divListRamoScrollIncrement;
        }

        function onNext() {
            var divListRamos = document.getElementById("divListRamos");
            divListRamos.scrollLeft = divListRamos.scrollLeft + divListRamoScrollIncrement;
        }

        function onRamoItemClick(item){

            console.log(AdminRamoFactory.getSectionSelected());
            vm.ramos.filter(function (x) { return x.selected === true; }).forEach(function (x) { x.selected = false; });
            item.selected = true;
            AdminRamoFactory.executeChangeRamos(item)
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('CardListRamoController', CardListRamoController)
        .component('apCardListRamo', {
            templateUrl: folder + '/app/shared/components/card-list-ramo/card-list-ramo.component.html',
            controller: 'CardListRamoController',
            bindings: {
                items: '='
            }
        });
});
