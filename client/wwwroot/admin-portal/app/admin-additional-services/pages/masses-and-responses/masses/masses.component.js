'use strict';

define(['angular', 'coreConstants', 'system', 'lodash'], function (ng, coreConstants, system, _) {
    var folder = system.apps.ap.location;
    MassesController.$inject = ['$scope', '$stateParams', '$uibModal', 'mModalConfirm', 'mModalAlert'];
    function MassesController($scope, $stateParams, $uibModal, mModalConfirm, mModalAlert) {
        var vm = this;
        vm.$onInit = onInit;
        vm.tabs = [
            {
                code: 0,
                lbl: 'CHICLAYO'
            },
            {
                code: 1,
                lbl: 'CHICLAYO'
            },
            {
                code: 2,
                lbl: 'CHICLAYO'
            },
            {
                code: 3,
                lbl: 'CHICLAYO'
            },
            {
                code: 4,
                lbl: 'CHICLAYO'
            },
            {
                code: 5,
                lbl: 'CHICLAYO'
            }
        ]

        function onInit() {

        }



    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('MassesController', MassesController)
        .component('apMasses', {
            templateUrl: folder + '/app/admin-additional-services/pages/masses-and-responses/masses/masses.component.html',
            controller: 'MassesController',
            bindings: {
            }
        });;
});
