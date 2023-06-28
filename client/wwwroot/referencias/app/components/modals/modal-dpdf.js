(function ($root, name, deps, action) {
    $root.define(name, deps, action)
})(window, 'modalDpdf', ['angular'], function (angular) {
    angular.module('referencias.app').
        controller('modalDpdfController', ['$scope', 'mpSpin', '$stateParams', '$q', function ($scope, mpSpin, $stateParams, $q) {
            var vm = this;
            vm.$onInit = onInit;


            function onInit() {
                vm.cerrar = cerrar;
                vm.downloadPdf = downloadPdf;
                $scope.isEdit = $stateParams.isEdit;

            }

            function downloadPdf() {
                var CReferencia = vm.data.idReferencia != null ? vm.data.idReferencia : null;
                var params = { CReferencia: CReferencia };
                vm.download({ $params: params });
            }

            function cerrar() {
                vm.close();
            }

        }])
        .component('modalDpdf', {
            templateUrl: '/referencias/app/components/modals/modal-dpdf.html',
            controller: 'modalDpdfController',
            bindings: {
                data: '=?',
                close: '&?',
                download: '&?',
                modify: '&?'
            }
        })
});