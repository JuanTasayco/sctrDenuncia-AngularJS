'use strict';

define(['angular', 'coreConstants', 'system', 'lodash'], function (ng, coreConstants, system, _) {
    var folder = system.apps.ap.location;
    InsurancesByRamoController.$inject = ['$scope', 'AdminRamoFactory', '$stateParams', '$uibModal', 'mModalConfirm', 'mModalAlert'];
    function InsurancesByRamoController($scope, AdminRamoFactory, $stateParams, $uibModal, mModalConfirm, mModalAlert) {
        var vm = this;
        vm.$onInit = onInit;
        vm.$onDestroy = onDestroy;
        vm.content = null;
        vm.ramo = null;
        vm.section = null;;
        vm.form = {}
        vm.focusTitle = true
        vm.typeForm = "AGREGAR PRODUCTO"

        vm.onEditTitle = onEditTitle;
        vm.onSaveTitle = onSaveTitle;
        vm.titleContent = null;
        vm.isEditTitle = false;
        vm.configView = {
            buttonAdd: 'Agregar producto',
            titleCard: 'Título de producto'
        }

        function onInit() {
            AdminRamoFactory.subsChangeRamo(changeRamo);
            AdminRamoFactory.subsClickSectionAdd(onClickSectionAdd);
            AdminRamoFactory.subsClickSectionRemove(onClickSectionRemove);
            AdminRamoFactory.subsClickSectionOrder(onClickSectionOrder);
            AdminRamoFactory.setSectionSelected(AdminRamoFactory.getSections()[1]);
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
                '¿Estás seguro de eliminar el producto?',
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

        function onEditTitle(){
            vm.isEditTitle = true;
        }

        function onClickSectionAdd(data) {
            if (!data.isNew) {
                vm.form =  ng.copy(data.item);
                vm.typeForm = "EDITAR PRODUCTO"
            } else {
                vm.form = {
                    header: {},
                    sections: [],
                    footer: {}
                }
                vm.typeForm = "AGREGAR PRODUCTO"
            }

            $uibModal.open({
                backdrop: true, // background de fondo
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                scope: $scope,
                size: 'lg',
                templateUrl: '/admin-portal/app/admin-policy-section/pages/admin-ramo/insurances-by-ramo/modal-form.html',
                controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout', function ($scope, $uibModalInstance, $uibModal, $timeout) {
                    //CloseModal
                    $scope.closeModal = function () {
                        $uibModalInstance.close();
                    };

                    $scope.save = function () {
                        if (!$scope.frmModal.$valid) {
                            $scope.frmModal.markAsPristine();
                            return;
                        }
                        mModalConfirm.confirmInfo(
                            null,
                            '¿Estás seguro de '+ (data.isNew ? 'guardar' : 'modificar') +' el producto?',
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
                "titulo": form.header.title,
                "subTitulo": form.header.subTitle,
                "detalle": form.header.detail,
                "infoAdicional": form.header.additionInformation,

                "link": form.footer.urlButton,
                "linkInterno": !form.footer.externaLink,
                "footerTitulo": form.footer.productPrice,
                "footerSubTitulo": form.footer.detail,
                "textoEvento": form.footer.titleButton,

                "secciones": form.sections,
                "boldDetalle": form.boldDetail,
                "estiloRojo": form.footer.isButtonInfo,
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
                "titulo": form.header.title,
                "subTitulo": form.header.subTitle,
                "detalle": form.header.detail,
                "infoAdicional": form.header.additionInformation,

                "link": form.footer.urlButton,
                "linkInterno": !form.footer.externaLink,
                
                "footerTitulo": form.footer.productPrice,
                "footerSubTitulo": form.footer.detail,
                "textoEvento": form.footer.titleButton,

                "secciones": form.sections,
                "boldDetalle": form.boldDetail,
                "estiloRojo": form.footer.isButtonInfo,
                "activo": true,
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
            vm.isEditTitle = false;
            vm.section = AdminRamoFactory.getSectionSelected();
            vm.ramo = item
            AdminRamoFactory.getSectionListContent(vm.section.code, item.code).then(
                function (data) {
                    data.contenido = _.map(data.contenido, function (p) {
                        var item = _.assign(p,{
                            title: p.dataService.titulo,
                            header : {
                                title: p.dataService.titulo,
                                subTitle: p.dataService.subTitulo,
                                detail: p.dataService.detalle,
                                additionInformation: p.dataService.infoAdicional
                            },
                            sections: p.dataService.secciones,
                            footer: {
                                productPrice: p.dataService.footerTitulo,
                                detail: p.dataService.footerSubTitulo,
                                titleButton: p.dataService.textoEvento,
                                urlButton: p.dataService.link,
                                externaLink: !p.dataService.linkInterno,
                                isButtonInfo: p.dataService.estiloRojo
                            },
                            boldDetail:  p.dataService.boldDetalle,
                            //redStyle:  p.dataService.estiloRojo,
                        }) 
                        delete item.dataService
                        return item
                    });

                    vm.content =  data;
                    vm.titleContent =  data.titulo;
                }
            )
        }

        function onSaveTitle() {
            mModalConfirm.confirmInfo(
                null,
                '¿Estás seguro de actulizar el titulo de producto?',
                'SI'
            ).then(function (response) {
                if (response) {
                    var body = {
                        seccionId: vm.section.code,
                        activo: vm.content.activo,
                        titulo: vm.titleContent,
                    }
                    AdminRamoFactory.updateStatusSection(vm.section.code, vm.ramo.code, body).then(
                        function () {
                            vm.content.titulo = vm.titleContent;
                            vm.isEditTitle = false;
                        }
                    )
                }
            });
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('InsurancesByRamoController', InsurancesByRamoController)
        .component('apInsurancesByRamo', {
            templateUrl: folder + '/app/admin-policy-section/pages/admin-ramo/insurances-by-ramo/insurances-by-ramo.component.html',
            controller: 'InsurancesByRamoController',
            bindings: {
            }
        });;
});

