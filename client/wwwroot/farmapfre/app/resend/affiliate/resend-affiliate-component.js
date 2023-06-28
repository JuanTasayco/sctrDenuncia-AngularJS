(function($root, name, deps, action) {
    $root.define(name, deps, action)
})(window, "resendAffiliateComponent", ['angular', 'mfpModalReportInfoSendEmail'], function(ng){
    ng.module('farmapfre.app').
    controller('resendAffiliateComponentController', 
    ['$scope', '$state', '$uibModal', 'mModalAlert', 'proxyInsured', 
    function ($scope, state, $uibModal, mModalAlert, proxyInsured) {
        var vm = this;
        vm.noResultInfo = true;
        vm.noResult = false;
        vm.formData = {};

        $scope.formData = {};
        $scope.emailCboLbl = {
            label: 'Correo electrónico ',
            required: true
        };
        $scope.celularInputLbl = {
            label: 'Celular ',
            required: true
        };

        var mainArgs;

        vm.search = function (arg) {
            mainArgs = arg;
            proxyInsured.GetInsured(arg.documentTypeCode, arg.filter, true).then(function(response) {
                vm.noResultInfo = false;
                if(response) {
                    if(response.documentNumber) {
                        vm.noResult = false;
                        vm.insured = response;
                        $scope.formData.phoneNumber = response.phoneNumber;
                        $scope.formData.email = response.email;
                    } else {
                        vm.noResult = true;
                        vm.insured = null; 
                    }
                }
            }, function(err) {
                vm.noResultInfo = true;
                vm.noResult = false;
                vm.showMsgError();
            });
        }

        vm.pageChanged = function() {
            search(mainArgs, true);
        }

        vm.resend = function() {
            vm.formData.companyId = vm.insured.company.id;
            vm.formData.documentType = { code: vm.insured.documentType.id };
            vm.formData.documentNumber = vm.insured.documentNumber;
            vm.formData.phoneNumber = $scope.frmResendLinkInsured.nCelular.$error.onlyNumber ? '' : $scope.formData.phoneNumber;
            vm.formData.email = $scope.formData.email;

            proxyInsured.SendDeliveredSmsEmail(vm.formData, true).then(function(response) {
                mModalAlert.showSuccess('El enlace del beneficiario fue reenviado sin problemas.', '¡Reenvío exitoso!');
            }, function(err) {
                vm.showMsgError();
            });
        }

        vm.verDetalle = function(order) {
            state.go('order.item', { orderid: order.id } );
        }

        vm.cleanSearch = function() {
            vm.noResultInfo = true;
            vm.noResult = false;
            vm.formData = {};
            vm.insured = null;
        }

        vm.showMsgError = function() {
            mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', 'Error');
        };

        vm.showModalReport = function() {
            var modal = $uibModal.open({
                backdrop: 'static',
                backdropClick: false,
                dialogFade: false,
                keyboard: false,
                scope: $scope,
                size: 'md',
                windowTopClass: 'modal--md fade',
                template: '<mfp-modal-report-info-send-email close="close()"></mfp-modal-report-info-send-email>',
                controller : ['$scope', '$uibModalInstance',
                    function($scope, $uibModalInstance) {
                    $scope.close = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        };
    }]).
    component("resendAffiliate", {
        templateUrl: "/farmapfre/app/resend/affiliate/resend-affiliate-component.html",
        controller: "resendAffiliateComponentController",
        bindings: {
        }
    })
});