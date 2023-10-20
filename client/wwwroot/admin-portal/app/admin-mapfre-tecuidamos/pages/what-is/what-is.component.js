'use strict';

define(['angular', 'coreConstants', 'system', 'lodash'], function (ng, coreConstants, system, _) {
    var folder = system.apps.ap.location;
    WhatIsController.$inject = ['$scope', '$stateParams', '$uibModal', 'mModalConfirm', 'mModalAlert', 'AdminRamoFactory', 'GeneralAdminMapfreTecuidamosFactory'];
    function WhatIsController($scope, $stateParams, $uibModal, mModalConfirm, mModalAlert, AdminRamoFactory, GeneralAdminMapfreTecuidamosFactory ) {
        var vm = this;
        
        vm.$onInit = onInit;
        vm.editWhatIs = editWhatIs;

        function onInit() {
            AdminRamoFactory.setSectionSelected(AdminRamoFactory.getSections()[1]);

            getData()
        }

        function getData() {

            GeneralAdminMapfreTecuidamosFactory.getSectionListContent(  
                AdminRamoFactory.getSectionSelected().code ,
                "MTC",
                undefined,
                true
            ).then(
                function( res) {
                    res.contenido = _.map(res.contenido, function (p) {
                        var item = _.assign(p,{
                            title: p.dataService.titulo,
                            description:  _transformHtml(p.dataService.descContenido),
                            link: p.dataService.link
                        }) 
                        delete item.dataService
                        return item
                    });
                    vm.whatIs = res.contenido[0]
                    
                }
            )

        }

        function editWhatIs() {
            vm.form =ng.copy({
                title: vm.whatIs.title,
                description: vm.whatIs.description,
                link: vm.whatIs.link,
            }); 

            $uibModal.open({
                backdrop: true, // background de fondo
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                scope: $scope,
                size: 'lg',
                templateUrl: '/admin-portal/app/admin-mapfre-tecuidamos/pages/what-is/modal-form.html',
                controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout', function ($scope, $uibModalInstance, $uibModal, $timeout) {
                    //CloseModal
                    $scope.closeModal = function () {
                        $uibModalInstance.close();
                    };

                    $scope.saveAssistance = function () {
                        if (!$scope.frmModal.$valid) {
                            $scope.frmModal.markAsPristine();
                            return;
                        }
                        updateWhatIs($uibModalInstance) 
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

        function updateWhatIs(uibModalInstance) {
            var body = {
                titulo: vm.form.title,
                descContenido: vm.form.description,
                link: vm.form.link,
                activo: true,
                accion: "UPDATE"
            }

            GeneralAdminMapfreTecuidamosFactory.updateCardSection(  
                AdminRamoFactory.getSectionSelected().code ,
                vm.whatIs.idProduct,
                vm.whatIs.contentId,
                body,
                undefined,
                true
            ).then(function() {
                uibModalInstance.close()
                getData();
            })
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
        .controller('WhatIsController', WhatIsController)
        .component('apWhatIs', {
            templateUrl: folder + '/app/admin-mapfre-tecuidamos/pages/what-is/what-is.component.html',
            controller: 'WhatIsController',
            bindings: {
            }
        });;
});
