'use strict';

define(['angular', 'coreConstants', 'system'], function (ng, coreConstants, system) {
    var folder = system.apps.ap.location;
    CardListRamoController.$inject = ['$stateParams'];
    function CardListRamoController($stateParams) {
        var vm = this;
        vm.$onInit = onInit;
        vm.onPrevius = onPrevius;
        vm.onNext = onNext;

        vm.listRamo = [
            {
                icon: '',
                name: 'VEHICULAR',
                selected: false,
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
            console.log("CardListRamoController");
        }
        function onNext() {
            var divListRamos = document.getElementById("divListRamos");
            divListRamos.scrollTop = 50;
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
