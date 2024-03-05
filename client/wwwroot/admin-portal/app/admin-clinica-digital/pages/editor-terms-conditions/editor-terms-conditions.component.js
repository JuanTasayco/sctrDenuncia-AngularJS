'use strict';

define(['angular', 'coreConstants','system', ], function (ng, coreConstants, system) {
    var folder = system.apps.ap.location;
    EditorTermsConditionsController.$inject = ['$scope', 'section', 'contenido', 'GeneralAdminClinicaDigitalFactory', 'mModalAlert', 'oimClaims'];
    function EditorTermsConditionsController($scope, section, contenido, GeneralAdminClinicaDigitalFactory, mModalAlert, oimClaims) {
        var vm = this;
        vm.$onInit = onInit;
        vm.onQuillEditorChanged = onQuillEditorChanged;
        vm.saveTerms = saveTerms;

        function onInit() {
            vm.description = _transformHtml(contenido);
            vm.section = section;
        }

        function onQuillEditorChanged(){
            !$scope.frmTermsConditions.$valid && $scope.frmTermsConditions.markAsPristine();
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

        function saveTerms() {
            if (!$scope.frmTermsConditions.$valid) {
                $scope.frmTermsConditions.markAsPristine();
                return;
            }
            
            updateTermsConditions();
        }

        function updateTermsConditions() {
            var user = oimClaims.loginUserName.toUpperCase()

            var body = {
                termConditionDescription: vm.description,
                creationUser: user
            };

            GeneralAdminClinicaDigitalFactory.UpdateContent(vm.section.code,
                body,
                true
            ).then(function(res) {
                if(res.status === 1){
                    mModalAlert.showSuccess('Se actualizaron correctamente los datos', '');
                } else {
                    var message = res.message ? res.message : 'Ocurrió un error al registrar';
                    mModalAlert.showError(message, 'ERROR');
                }
            })
            .catch(function (error) {
                mModalAlert.showError('Ocurrió un error al registrar', 'ERROR');
            })
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('EditorTermsConditionsController', EditorTermsConditionsController)
        .component('apEditorTermsConditions', {
            templateUrl: folder + '/app/admin-clinica-digital/pages/editor-terms-conditions/editor-terms-conditions.component.html',
            controller: 'EditorTermsConditionsController',
            bindings: {
            }
        });
});
