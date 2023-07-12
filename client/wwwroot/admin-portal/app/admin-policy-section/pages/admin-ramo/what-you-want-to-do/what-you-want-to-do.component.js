'use strict';

define(['angular', 'coreConstants','system'], function (ng, coreConstants, system) {
    var folder = system.apps.ap.location;
    WhatYouWantToDoController.$inject = ['$scope', 'AdminRamoFactory', '$stateParams','$uibModal'];
    function WhatYouWantToDoController($scope, AdminRamoFactory, $stateParams,$uibModal) {
        var vm = this;
        vm.$onInit = onInit;
        vm.content = null;
        vm.idProducto = null;
        vm.section = 'FFB1218';
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
            console.log("changeRamo",item)
            vm.idProducto = item.code
            AdminRamoFactory.GetSectionListContent(vm.section,item.code).then(
                function(data){
                    vm.content = data;
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
