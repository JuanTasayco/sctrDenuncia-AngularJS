'use strict';

define(['angular', 'coreConstants', 'system', 'lodash'], function (ng, coreConstants, system, _) {
    var folder = system.apps.ap.location;
    ContentController.$inject = ['$scope', '$stateParams', '$uibModal', 'mModalConfirm', 'mModalAlert'];
    function ContentController($scope, $stateParams, $uibModal, mModalConfirm, mModalAlert) {
        var vm = this;
        vm.$onInit = onInit;
        vm.openModal = openModal;

        vm.form = {}

        function onInit() {
            console.log("entro contetn")
        }

        function openModal() {

            $uibModal.open({
                backdrop: true, // background de fondo
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                scope: $scope,
                size: 'lg',
                templateUrl: '/admin-portal/app/admin-additional-services/pages/masses-and-responses/content/modal-form.html',
                controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout', function ($scope, $uibModalInstance, $uibModal, $timeout) {
                    //CloseModal
                    $scope.closeModal = function () {
                        $uibModalInstance.close();
                    };

                }]
            });
        }

    
    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('ContentController', ContentController)
        .component('apContent', {
            templateUrl: folder + '/app/admin-additional-services/pages/masses-and-responses/content/content.component.html',
            controller: 'ContentController',
            bindings: {
            }
        });;
});
