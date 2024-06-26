'use strict';

define(['angular', 'coreConstants', 'system', 'lodash'], function (ng, coreConstants, system, _) {
    var folder = system.apps.ap.location;
    WhatYouWantToDoController.$inject = ['$scope', 'AdminRamoFactory', '$stateParams', '$uibModal', 'mModalConfirm', 'mModalAlert'];
    function WhatYouWantToDoController($scope, AdminRamoFactory, $stateParams, $uibModal, mModalConfirm, mModalAlert) {
        var vm = this;
        vm.$onInit = onInit;
        vm.$onDestroy = onDestroy;
        vm.content = null;
        vm.ramo = null;
        vm.section = null;;
        vm.form = {}
        vm.focusTitle = true
        vm.typeForm = "AGREGAR"
        vm.configView = {
            buttonAdd: 'Agregar etiqueta',
            titleCard: 'Título de etiqueta'
        }

        function onInit() {
            AdminRamoFactory.subsChangeRamo(changeRamo);
            AdminRamoFactory.subsClickSectionAdd(onClickSectionAdd);
            AdminRamoFactory.subsClickSectionRemove(onClickSectionRemove);
            AdminRamoFactory.subsClickSectionOrder(onClickSectionOrder);
            AdminRamoFactory.setSectionSelected(AdminRamoFactory.getSections()[0]);
            AdminRamoFactory.emitComponentsReady();
        }

        function onDestroy() {
            AdminRamoFactory.clearChangeRamo();
            AdminRamoFactory.unsubscribeSectionAdd();
            AdminRamoFactory.unsubscribeSectionRemove();
            AdminRamoFactory.unsubscribeSectionOrder();
        }

        function onClickSectionRemove(data) {
            mModalConfirm.confirmInfo(
                null,
                '¿Estás seguro de eliminar la etiqueta?',
                'SI').then(function (response) {
                    if (response) {
                        AdminRamoFactory.deleteCardSection(vm.section.code, vm.ramo.code, data.item.contentId).then(
                            function () {
                                changeRamo(vm.ramo)
                            }
                        ).catch(function (error) {
                            mModalAlert
                                .showError('Ocurrió un error al eliminar', 'ERROR');
                        })
                    }
                }).catch(function (error) { });;

        }

        function onClickSectionOrder(data) {
            var body = {
                "orden": data.next ? (data.item.order - 1) : (data.item.order + 1),
                "accion": "ORDER"
            }

            AdminRamoFactory.updateCardSection(vm.section.code, vm.ramo.code, data.item.contentId, body).then(
                function (data) {
                    changeRamo(vm.ramo)
                }
            )
        }

        function onClickSectionAdd(data) {
            if (!data.isNew) {
                vm.form.title = data.item.title;
                vm.form.url = data.item.link;
                vm.form.check = !data.item.internalLink;
                vm.form.contentId = data.item.contentId;
                vm.form.active = data.item.active;
                vm.form.order = data.item.order;
                vm.focusTitle  =  true;
                vm.typeForm = "EDITAR"
            } else {
                vm.focusTitle  =  false;
                vm.form = {}
                vm.typeForm = "AGREGAR"
            }

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
                        if (!$scope.frmLabel.$valid) {
                            $scope.frmLabel.markAsPristine();
                            return;
                        }
                        mModalConfirm.confirmInfo(
                            null,
                            '¿Estás seguro de '+ (data.isNew ? 'guardar' : 'modificar') +' la etiqueta?',
                            'SI').then(function (response) {
                                if (response) {
                                    data.isNew ? saveCard(vm.form, $uibModalInstance) : updateCard(vm.form, $uibModalInstance)
                                }
                            }).catch(function (error) { });;
                    };
                }]
            });
        }

        function updateCard(form, uibModalInstance) {
            
            var body = {
                "titulo": form.title,
                "link": form.url,
                "linkInterno": !form.check,
                "activo": form.active,
                "orden": form.order,
                "accion": "UPDATE"
            }

            AdminRamoFactory.updateCardSection(vm.section.code, vm.ramo.code, vm.form.contentId, body).then(
                function (data) {
                    uibModalInstance.close()
                    changeRamo(vm.ramo)
                }
            )
        }

        function saveCard(form, uibModalInstance) {
            var body = {
                "titulo": form.title,
                "link": form.url,
                "linkInterno": !form.check,
                "activo": true
            }

            AdminRamoFactory.saveCardSection(vm.section.code, vm.ramo.code, body).then(
                function (data) {
                    uibModalInstance.close()
                    changeRamo(vm.ramo)
                }
            )
        }

        function changeRamo(item) {
            vm.content = null;
            vm.section = AdminRamoFactory.getSectionSelected();
            vm.ramo = item
            AdminRamoFactory.getSectionListContent(vm.section.code, item.code).then(
                function (data) {
                    data.contenido = _.map(data.contenido, function (p) {
                        var item = _.assign(p,{
                            link: p.dataService.link, 
                            internalLink: p.dataService.linkInterno,
                            title: p.dataService.titulo
                        }) 
                        delete item.dataService
                        return item
                    });
                    vm.content =  data
                }
            )
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
