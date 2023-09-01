'use strict';

define(['angular', 'coreConstants'], function (ng, coreConstants) {
    AdditionalServicesComponent.$inject = ['$stateParams','mModalConfirm'];
    function AdditionalServicesComponent($stateParams,mModalConfirm) {
        var vm = this;
        vm.$onInit = onInit;
        vm.fnCheckBox = fnCheckBox;
        // reemplazar por el valor del servicio
        vm.serviceSelected = {
            name: 'MISAS Y REPONSOS',
            activo: true
        }
        vm.services = [
            {
                code: 'MASSES-RESPONSES',
                name: 'MISAS Y REPONSOS',
                selected: true,
                icon: "",
                url: "/images/ico-ramos/apps.svg"
            }
        ]

        function onInit() {
            // vm.ramos = ramo
            // vm.sections = sections
            // AdminRamoFactory.setSections(sections);
        }

        function fnCheckBox(item) {
            mModalConfirm.confirmInfo(
                null,
                '¿Estás seguro de ' + (item.activo ? 'habilitar' : 'inhabilitar') + ' todo el servicio?',
                'SI').then(function (response) {
                    if (response) {
                        // var body = {
                        //     seccionId: vm.section.code,
                        //     activo: item.activo
                        // }
                        // AdminRamoFactory.updateStatusSection(vm.section.code, vm.ramo.code, body).then(
                        //     function (data) {
                        //         if (data.codigo === 1001) {
                        //             item.activo = !item.activo
                        //         }
                        //     },
                        //     function () {
                        //         item.activo = !item.activo
                        //     }
                        // )
                    }
                }).catch(function (error) { 
                    item.activo = !item.activo
                 });
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule).controller('AdditionalServicesComponent', AdditionalServicesComponent);
});
