'use strict';

define(['angular', 'coreConstants', 'system', 'lodash'], function (ng, coreConstants, system, _) {
    var folder = system.apps.ap.location;
    ContentController.$inject = ['$scope', '$stateParams', '$uibModal', 'mModalConfirm', 'mModalAlert', '$q', 'AdminRamoFactory', 'MassesAndResponsesFactory', 'GeneralAdminMapfreTecuidamosFactory'];
    function ContentController($scope, $stateParams, $uibModal, mModalConfirm, mModalAlert, $q, AdminRamoFactory, MassesAndResponsesFactory, GeneralAdminMapfreTecuidamosFactory) {
        var vm = this;
        vm.$onInit = onInit;
        vm.$onDestroy = onDestroy;
        vm.openModal = openModal;
        vm.deleteFile = deleteFile;

        vm.form = {}
        vm.content = null;
        vm.elementsImage = [1, 2, 3, 4, 5]
        vm.arrayImages = []
        vm.productId = null;
        
        function onInit() {
            vm.servicesSelected = MassesAndResponsesFactory.getServiceSelected();
            vm.subServicesSelected = MassesAndResponsesFactory.getSubServiceSelected();
            AdminRamoFactory.subsChangeRamo(changeRamo);
            MassesAndResponsesFactory.subsChangeSubService(changeSubService);

            MassesAndResponsesFactory.emitComponentsReady();
        }

        function changeSubService(item) {
            vm.productId = item.code;
            MassesAndResponsesFactory.getServiceProducto(item.code).then(
                function (res) {
                    vm.arrayImages = []
                    vm.content = res;
                    _.forEach(vm.elementsImage, function pFe(item) {
                        var image = _.find(vm.content.images, function(y) {
                            return y.posicion === item
                        })
                        vm.arrayImages.push(
                            {
                                posicion: item,
                                rutaImagen: image? image.rutaImagen : null,
                                src: image? image.rutaImagen : null,
                            }
                        )
                    });
                }
            )
        }

        function readAsDataURL(file, scope) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.readAsDataURL(file);
            return deferred.promise;
        }

        function onLoad(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    var image = new Image();
                    image.src = reader.result;
                    image.onload = function () {
                        deferred.resolve({
                            base64: reader.result,
                            width: image.width,
                            height: image.height
                        });
                    };
                });
            };
        }

        function onError(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        }

        function openModal() {
            vm.form = ng.copy(vm.content);
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
                    $timeout(function () {

                        _.forEach(vm.elementsImage, function abc(item) {
                            var fileInput = document.getElementById('custom-file-input-'+item);

                            fileInput.addEventListener('change', function (x) {
                                var file = fileInput.files[0]
                                readAsDataURL(file, $scope).then(function (image) {
                                    
                                    GeneralAdminMapfreTecuidamosFactory.UploadImage(file).then(
                                        function(res) {
                                            vm.arrayImages[item-1].src  = image.base64
                                            vm.arrayImages[item-1].rutaImagen  = res.rutaTemporal
                                        }
                                    )
                                })

                            });
                        });
                        
                    }, 1);

                    $scope.save = function () {
                        if (!$scope.frmModal.$valid) {
                            $scope.frmModalBenefits.markAsPristine();
                            return;
                        }
                        updateContent($uibModalInstance) 

                    };

                    $scope.closeModal = function () {
                        $uibModalInstance.close();
                    };

                }]
            });
        }

        function updateContent(uibModalInstance) {
            var body = {
                "titulo": vm.form.title,
                "descripcion" : vm.form.description,
                "imagenes" : vm.arrayImages,
                "avisoActivo" : vm.form.activeNotice,
                "avisoDetalle" : vm.form.detailNotice
            }


            MassesAndResponsesFactory.updateProduct(vm.productId,body).then(
                function( res){
                    uibModalInstance.close();
                    MassesAndResponsesFactory.emitComponentsReady();
                }
            )
        }

        function onDestroy() {
            MassesAndResponsesFactory.unsubscribeChangeSubService();
        }

        function changeRamo() {
            // changeSubService(vm.servicesSelected.)
        }

        function deleteFile(index) {
            vm.arrayImages[index].rutaImagen = null;
            vm.arrayImages[index].src = null;
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
