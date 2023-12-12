'use strict';

define(['angular', 'coreConstants'], function (ng, coreConstants) {
    AdditionalServicesComponent.$inject = ['$stateParams', 'mModalConfirm','additionalServices','MassesAndResponsesFactory', 'AdminRamoFactory'];
    function AdditionalServicesComponent($stateParams, mModalConfirm, additionalServices, MassesAndResponsesFactory, AdminRamoFactory) {
        var vm = this;
        vm.$onInit = onInit;
        vm.fnCheckBox = fnCheckBox;
        
        function onInit() {
            vm.services = additionalServices;
            vm.services[0].selected = true;
            vm.serviceSelected = vm.services[0];
            MassesAndResponsesFactory.setServiceSelected(vm.serviceSelected);
            AdminRamoFactory.subsChangeRamo(changeRamo);
        }

        function fnCheckBox(item) {
            mModalConfirm.confirmInfo(
                null,
                '¿Estás seguro de ' + (item.active ? 'habilitar' : 'inhabilitar') + ' todo el servicio?',
                'SI').then(function (response) {
                    if (response) {
                        var body = {
                            activo: item.active
                        }
                        
                        vm.serviceSelected = AdminRamoFactory.getRamoSelected();
                        MassesAndResponsesFactory.updateServiceSection(vm.serviceSelected.id, body).then(
                            function (data) {
                                if (data.codigo === 1001) {
                                    item.activo = !item.activo
                                }
                            },
                            function () {
                                item.activo = !item.activo
                            }
                        )
                    }
                }).catch(function (error) { 
                    item.active =!item.active
                });
        }

        function changeRamo(item) {
            vm.serviceSelected = item;
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule).controller('AdditionalServicesComponent', AdditionalServicesComponent);
});
