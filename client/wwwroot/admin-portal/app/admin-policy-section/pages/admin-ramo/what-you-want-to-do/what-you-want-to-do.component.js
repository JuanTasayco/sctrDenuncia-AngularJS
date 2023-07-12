'use strict';

define(['angular', 'coreConstants','system','lodash'], function (ng, coreConstants, system, _) {
    var folder = system.apps.ap.location;
    WhatYouWantToDoController.$inject = ['$scope', 'AdminRamoFactory', '$stateParams','$uibModal'];
    function WhatYouWantToDoController($scope, AdminRamoFactory, $stateParams,$uibModal) {
        var vm = this;
        vm.$onInit = onInit;
        vm.content = null;
        vm.ramo = null;
        vm.section = null; ;
        vm.openModal = openModal;
        vm.form

        function onInit() {
            console.log("WhatYouWantToDoController");
            AdminRamoFactory.subsChangeRamo(changeRamo);
            AdminRamoFactory.subsClickSectionAdd(onClickSectionAdd)
            AdminRamoFactory.emitComponentsReady();
        }

        function onClickSectionAdd(item) {
            console.log(item)
        }

        function changeRamo(item) {
            vm.content = null;
            vm.section = AdminRamoFactory.getSectionSelected();
            vm.ramo = item
            AdminRamoFactory.getSectionListContent(vm.section.code,item.code).then(
                function(data){
                    vm.content = data;
                    console.log("changeRamo",vm.content)
                }
            )
        }

        function openModal() {
            $uibModal.open({
                backdrop: true, // background de fondo
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                scope: $scope,
                size: 'md',
                templateUrl: '/admin-portal/app/admin-policy-section/pages/admin-ramo/what-you-want-to-do/modal-form.html',
                controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout', function ($scope, $uibModalInstance, $uibModal, $timeout) {
                    //CloseModal
                    $scope.closeModal = function () {
                        $uibModalInstance.close();
                    };


                    $scope.save = function () {
                        console.log("entro al save",$scope.frmLabel)
                        if (!$scope.frmLabel.$valid) {
                            $scope.frmLabel.markAsPristine();
                            return;
                        }
                    };
                }]
            });
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('WhatYouWantToDoController', WhatYouWantToDoController)
        .component('apWhatYouWantToDo', {
            templateUrl: folder + '/app/admin-policy-section/pages/admin-ramo/what-you-want-to-do/what-you-want-to-do.component.html',
            controller: 'WhatYouWantToDoController',
            bindings: {
            }
          });;
});
