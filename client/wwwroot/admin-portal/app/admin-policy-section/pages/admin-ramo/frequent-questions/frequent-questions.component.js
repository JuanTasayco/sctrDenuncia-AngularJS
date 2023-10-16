'use strict';

define(['angular', 'coreConstants', 'system', 'lodash'], function (ng, coreConstants, system, _) {
    var folder = system.apps.ap.location;
    FrequentQuestionsController.$inject = ['$scope', 'AdminRamoFactory', '$stateParams', '$uibModal', 'mModalConfirm', 'mModalAlert'];
    function FrequentQuestionsController($scope, AdminRamoFactory, $stateParams, $uibModal, mModalConfirm, mModalAlert) {
        var vm = this;
        vm.$onInit = onInit;
        vm.$onDestroy = onDestroy;
        vm.content = null;
        vm.ramo = null;
        vm.section = null;;
        vm.form = {}
        vm.focusTitle = true
        vm.typeForm = "AGREGAR PREGUNTA"
        vm.configView = {
            buttonAdd: 'Agregar pregunta',
            titleCard: 'Título de pregunta'
        }

        function onInit() {
            
            AdminRamoFactory.subsChangeRamo(changeRamo);
            AdminRamoFactory.subsClickSectionAdd(onClickSectionAdd);
            AdminRamoFactory.subsClickSectionRemove(onClickSectionRemove);
            AdminRamoFactory.subsClickSectionOrder(onClickSectionOrder);
            AdminRamoFactory.setSectionSelected(AdminRamoFactory.getSections()[2]);
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
                '¿Estás seguro de eliminar la pregunta?',
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
                vm.form = _.assign({},data.item) ;
                vm.focusTitle  =  true;
                vm.typeForm = "EDITAR PREGUNTA"
            } else {
                vm.focusTitle  =  false;
                vm.form = {}
                vm.typeForm = "AGREGAR PREGUNTA"
            }

            $uibModal.open({
                backdrop: true, // background de fondo
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                scope: $scope,
                size: 'md',
                templateUrl: '/admin-portal/app/admin-policy-section/pages/admin-ramo/frequent-questions/modal-form.html',
                controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout', function ($scope, $uibModalInstance, $uibModal, $timeout) {
                    //CloseModal
                    $scope.closeModal = function () {
                        $uibModalInstance.close();
                    };

                    $scope.save = function () {
                        formValidate();
                        if (!$scope.frmModal.$valid) {
                            $scope.frmModal.markAsPristine();
                            return;
                        }
                        mModalConfirm.confirmInfo(
                            null,
                            '¿Estás seguro de '+ (data.isNew ? 'guardar' : 'modificar') +' la pregunta?',
                            'SI').then(function (response) {
                                if (response) {
                                    data.isNew ? saveCard(vm.form, $uibModalInstance) : updateCard(vm.form, $uibModalInstance)
                                }
                            }).catch(function (error) { });;
                    };

                    $scope.onQuillEditorChanged = function(){
                        formValidate();
                        !$scope.frmModal.$valid && $scope.frmModal.markAsPristine();
                    }

                    function formValidate(){
                        var isValide = htmlEncode(vm.form.description).length > 4000;
                        $scope.frmModal.nDescContenido.$error.maxlength = isValide;
                        $scope.frmModal.$valid = !isValide;
                    }
            
                }]
            });
        }

        function updateCard(form, uibModalInstance) {
            
            var body = {
                "titulo": form.title,
                "principal": form.isMain,
                "descContenido": form.description,
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
                "principal": form.isMain,
                "descContenido": form.description,
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
                            title: p.dataService.titulo,
                            description: _transformHtml(p.dataService.descContenido), 
                            isMain: p.dataService.principal
                        }) 
                        delete item.dataService
                        return item
                    });
                    vm.content =  data
                }
            )
        }

        function htmlEncode(input) {
            var textArea = document.createElement("textarea");
            textArea.innerText = input;
            return textArea.innerHTML.split("<br>").join("\n");
          }

        function _transformHtml(str) {
            var entityMap = {
              "&amp;": "&",
              "&lt;": "<",
              "&gt;": ">",
              '&quot;': '"',
              '&#39;': "'",
              '&#x2F;': "/"
            };
      
            return String(str).replace(/(&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;)/g, function (s) {
              return entityMap[s];
            });
          }
        
    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('FrequentQuestionsController', FrequentQuestionsController)
        .component('apFrequentQuestions', {
            templateUrl: folder + '/app/admin-policy-section/pages/admin-ramo/frequent-questions/frequent-questions.component.html',
            controller: 'FrequentQuestionsController',
            bindings: {
            }
        });;
});
