'use strict';

define(['angular', 'coreConstants'], function (ng, coreConstants) {
    AdditionalServicesComponent.$inject = ['$stateParams', 'mModalConfirm','additionalServices','GeneralAdditionalServiceFactory'];
    function AdditionalServicesComponent($stateParams, mModalConfirm,additionalServices,GeneralAdditionalServiceFactory) {
        var vm = this;
        vm.$onInit = onInit;
        vm.fnCheckBox = fnCheckBox;
        // reemplazar por el valor del servicio
        vm.serviceSelected = {
            id: 1,
            name: 'MISAS Y REPONSOS',
            active: true,
            subServices:[
                {
                    code: 1,
                    lbl: "MISAS EN CAPILLA"
                },
                {
                    code: 2,
                    lbl: "RESPONSO EN SEPULTURA"
                }
            ]
        }
        vm.services = additionalServices;
        function onInit() {
            console.log("additionalServices",additionalServices);
            vm.services[0].selected = true;
            GeneralAdditionalServiceFactory.setServiceSelected(vm.services[0]);
            console.log("additionalServices End");
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
