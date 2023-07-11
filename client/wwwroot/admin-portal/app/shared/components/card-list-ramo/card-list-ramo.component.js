'use strict';

define(['angular', 'coreConstants', 'system'], function (ng, coreConstants, system) {
    var folder = system.apps.ap.location;
    CardListRamoController.$inject = ['$stateParams', 'AdminRamoFactory'];
    function CardListRamoController($stateParams, AdminRamoFactory) {

        var divListRamoScrollIncrement = 66;
        var vm = this;
        
        vm.$onInit = onInit;
        vm.onPrevius = onPrevius;
        vm.onNext = onNext;
        vm.onRamoItemClick = onRamoItemClick;

        vm.ramos = [
            {
                icon: '',
                name: 'VEHICULAR',
                selected: true,
            },
            {
                icon: '',
                name: 'SALUD',
                selected: false,
            }, {
                icon: '',
                name: 'HOGAR',
                selected: false,
            }, {
                icon: '',
                name: 'VIDA Y AHORROS',
                selected: false,
            }, {
                icon: '',
                name: 'VIAJES',
                selected: false,
            }, {
                icon: '',
                name: 'DECESOS',
                selected: false,
            }, {
                icon: '',
                name: 'SOAT',
                selected: false,
            }, {
                icon: '',
                name: 'SOAT 2',
                selected: false,
            }, {
                icon: '',
                name: 'SOAT 3',
                selected: false,
            }, {
                icon: '',
                name: 'SOAT 4',
                selected: false,
            }
        ]

        function onInit() {
            console.log("CardListRamoController");
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
            vm.ramos.filter(x => x.selected).forEach(x => x.selected = false);
            item.selected = true;

            AdminRamoFactory.executeChangeRamos(item);
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('CardListRamoController', CardListRamoController)
        .component('apCardListRamo', {
            templateUrl: folder + '/app/shared/components/card-list-ramo/card-list-ramo.component.html',
            controller: 'CardListRamoController',
            bindings: {
            }
        });
});
