'use strict';

define(['angular', 'coreConstants', 'mapfreTecuidamosConstants', 'system', 'lodash'], function (ng, coreConstants, mapfreTecuidamosConstants, system, _) {
    var folder = system.apps.ap.location;
    MyBenefitsController.$inject = ['$scope', '$stateParams', '$uibModal', 'mModalConfirm', 'mModalAlert','commercialSegment', 'GeneralAdminMapfreTecuidamosFactory', 'AdminRamoFactory', '$q'];
    function MyBenefitsController($scope, $stateParams, $uibModal, mModalConfirm, mModalAlert,commercialSegment, GeneralAdminMapfreTecuidamosFactory, AdminRamoFactory, $q) {
        var vm = this;
    
        vm.$onInit = onInit;
        vm.$onDestroy = onDestroy;
        vm.click = click;
        vm.accordionBenefits = true;
        vm.accordionAssistance = true;
        vm.items = commercialSegment;
        vm.benefits = {};
        vm.assistance = {};
        vm.editBenefits = editBenefits;
        vm.editAssistance = editAssistance;
        vm.addOrEditItemsBenefits = addOrEditItemsBenefits;
        vm.onClickItemsBenefitsRemove = onClickItemsBenefitsRemove;
        vm.deleteFile = deleteFile;
        vm.setIcon = setIcon;

        vm.file = {
            image: {
                src: '',
                upload: false
            },
            pdf: {
                src: '',
                upload: false
            }
        }

        var watchFileModel;
        var watchPDFModel;

        function onInit() {
            
            vm.iconsBenefits = mapfreTecuidamosConstants.ICONS_BENEFICIOS_CM
            ///
            vm.fileTypes = '.jpg,.jpeg,.png'
            vm.fileTypesPdf = '.pdf'

            ///
            AdminRamoFactory.setSectionSelected(AdminRamoFactory.getSections()[0]);

            vm.selectedTab = commercialSegment[0].code
            getData()
            watcherFileModel();
            watcherPDFModel();
        }

        function onDestroy() {
            watchFileModel();
            watchPDFModel();
        }

        function watcherFileModel() {
            watchFileModel = $scope.$watchCollection('$ctrl.photoFile', function (newValue) {
                    if (newValue && newValue.length > 0) {
                        ng.forEach(newValue, function (item, index) {
                            createPreview(newValue[index]);
                        });
                    }
                },
                true
            );
        }

        function watcherPDFModel() {
            watchPDFModel = $scope.$watchCollection('$ctrl.pdfFile', function (newValue) {
                    if (newValue && newValue.length > 0) {
                        ng.forEach(newValue, function (item, index) {
                            createPreviewPdf(newValue[index]);
                        });
                    }
                },
                true
            );
        }

        function createPreview(file) {
            // if (file.size / kb > vm.maxKbSize) {
            //     return void mModalAlert.showWarning('La imagen supera los ' + vm.maxMbSize + 'MB', 'No se pudo generar la carga del archivo');
            // }

            var photo = { name: file.name.replace(/ /g, '-') };

            readAsDataURL(file, $scope).then(function (image) {
                // if (image.width != vm.imgWidth || image.height != vm.imgHeight) {
                //     return void mModalAlert.showError( 'Las dimensiones del imagen deben ser: ' + vm.imgWidth + 'px x ' + vm.imgHeight + 'px<br>Actualmente: ' + image.width + 'px x ' + image.height + 'px', 'Error');
                // }
                photo.photoBase64 = image.base64;

                GeneralAdminMapfreTecuidamosFactory.UploadImage(file).then(
                    function(res) {
                        vm.formAssistance.linkImage = res.rutaTemporal;
                        vm.file.image.upload = true;
                        vm.file.image.src = image.base64;
                    }
                )
                // vm.onUpload({ $event: { photoToUpload: file, photoData: photo } });
            });
        }

        function createPreviewPdf(file) {
            // if (file.size / kb > vm.maxKbSize) {
            //     return void mModalAlert.showWarning('La imagen supera los ' + vm.maxMbSize + 'MB', 'No se pudo generar la carga del archivo');
            // }

            var pdf = { name: file.name.replace(/ /g, '-') };

            getBase64(file, $scope).then(function (item) {
                // if (image.width != vm.imgWidth || image.height != vm.imgHeight) {
                //     return void mModalAlert.showError( 'Las dimensiones del imagen deben ser: ' + vm.imgWidth + 'px x ' + vm.imgHeight + 'px<br>Actualmente: ' + image.width + 'px x ' + image.height + 'px', 'Error');
                // }
                pdf.base64 = item.base64;

                GeneralAdminMapfreTecuidamosFactory.UploadImage(file).then(
                    function(res) {
                        vm.formAssistance.linkPdf= res.rutaTemporal;
                        vm.formAssistance.nameFile = pdf.name;
                        vm.file.pdf.upload = true;
                        vm.file.pdf.src = pdf.name;
                        vm.file.pdf.name = pdf.name;
                    }
                )
                // vm.onUpload({ $event: { photoToUpload: file, photoData: photo } });
            });
        }

        function readAsDataURL(file, scope) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.readAsDataURL(file);
            return deferred.promise;
        }

        function getBase64(file, onLoadCallback) {
            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.onload = function () { resolve(reader.result); };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
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

        function onLoadPDF(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    var pdf = new FileReader();
                    pdf.src = reader.result;
                    pdf.onload = function () {
                        deferred.resolve({
                            base64: reader.result,
                        });
                    };
                });
            };
        }

        function getBase64(file, onLoadCallback) {
            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.onload = function () { resolve(reader.result); };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        function onError(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        }

        function click(tab) {
            vm.selectedTab = tab.code;

            getData()
        }

        function getData() {

            GeneralAdminMapfreTecuidamosFactory.getSectionListContent(  
                'B' +AdminRamoFactory.getSectionSelected().code ,
                vm.selectedTab,
                "BENEFICIO",
                true
            ).then(
                function( res) {
                    res.contenido = _.map(res.contenido, function (p) {
                        var item = _.assign(p,{
                            link: p.dataService.link, 
                            internalLink: p.dataService.linkInterno,
                            title: p.dataService.titulo
                        }) 
                        delete item.dataService
                        return item
                    });
                    vm.benefits = res
                    vm.benefits.title = vm.benefits.titulo;
                    vm.benefits.description = vm.benefits.descripcion;
                    
                }
            )

            GeneralAdminMapfreTecuidamosFactory.getSectionListContent(  
                'A' +AdminRamoFactory.getSectionSelected().code ,
                vm.selectedTab,
                "ASISTENCIA",
                false
            ).then(
                function( res) {
                    res.contenido = _.map(res.contenido, function (p) {
                        var item = _.assign(p,{
                            linkImage: p.dataService.rutaImagen, 
                            linkPdf: p.dataService.rutaPdf,
                            title: p.dataService.titulo,
                            textButton: p.dataService.textoEvento,
                            nameFile: p.dataService.nombreArchivoPdf,
                            description:  _transformHtml(p.dataService.descContenido)
                        }) 
                        delete item.dataService
                        return item
                    });
                    vm.assistance = res
                }
            )

        }

        function editBenefits() {
            vm.formBenefits =ng.copy({
                title: vm.benefits.title,
                description: vm.benefits.description,
            }); 

            $uibModal.open({
                backdrop: true, // background de fondo
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                scope: $scope,
                size: 'md',
                templateUrl: '/admin-portal/app/admin-mapfre-tecuidamos/pages/my-benefits/modal-benefits.html',
                controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout', function ($scope, $uibModalInstance, $uibModal, $timeout) {
                    //CloseModal
                    $scope.closeModal = function () {
                        $uibModalInstance.close();
                    };

                    $scope.saveBenefits = function () {
                        if (!$scope.frmModalBenefits.$valid) {
                            $scope.frmModalBenefits.markAsPristine();
                            return;
                        }
                        updateBenefits($uibModalInstance) 
                    };
                }]
            });
        }

        function updateBenefits(uibModalInstance) {
            var body = {
                titulo: vm.formBenefits.title,
                descripcion: vm.formBenefits.description,
                activo: true,
            }

            GeneralAdminMapfreTecuidamosFactory.updateSection(  
                'B' +AdminRamoFactory.getSectionSelected().code ,
                vm.selectedTab,
                body,
                "BENEFICIO",
                true
            ).then(function() {
                uibModalInstance.close()
                getData();
            })
        }

        function addOrEditItemsBenefits(data) {
            if(data){
                vm.formItemsBenefits = ng.copy(data);
                vm.formItemsBenefits.check = !data.internalLink;
                vm.typeFormItemsBenefits = "EDITAR BENEFICIO"
            }else {
                vm.formItemsBenefits = {}
                vm.typeFormItemsBenefits = "AGREGAR BENEFICIO"
            }

            $uibModal.open({
                backdrop: true, // background de fondo
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                scope: $scope,
                size: 'lg',
                templateUrl: '/admin-portal/app/admin-mapfre-tecuidamos/pages/my-benefits/modal-items-benefits.html',
                controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout', function ($scope, $uibModalInstance, $uibModal, $timeout) {
                    //CloseModal
                    $timeout(function () {
                        vm.svgList = document.getElementById('svgList');
                        document.getElementById('selectButton').addEventListener('click', function(e) {
                            vm.svgList.classList.toggle('hidden');
                        });
                    }, 1);
                    

                    $scope.closeModal = function () {
                        $uibModalInstance.close();
                    };

                    $scope.saveItemsBenefits = function () {
                        if (!$scope.frmModalItemsBenefits.$valid) {
                            $scope.frmModalItemsBenefits.markAsPristine();
                            return;
                        }

                        mModalConfirm.confirmInfo(
                            null,
                            '¿Estás seguro de '+ (data ? 'modificar' : 'guardar') +' el beneficio?',
                            'SI').then(function (response) {
                                if (response) {
                                    data ? updateItemsBenefits(vm.formItemsBenefits, $uibModalInstance) : saveItemsBenefits(vm.formItemsBenefits, $uibModalInstance)
                                }
                            }).catch(function (error) { });;

                        

                    };
                }]
            });
        }

        function updateItemsBenefits(form,uibModalInstance) {
            var body = {
                "icono": form.icon,
                "titulo": form.title,
                "link": form.link,
                "linkInterno": !form.check,
                "accion": "UPDATE"
            }

            GeneralAdminMapfreTecuidamosFactory.updateCardSection(  
                'B' +AdminRamoFactory.getSectionSelected().code ,
                vm.selectedTab,
                form.contentId,
                body,
                "BENEFICIO",
                true
            ).then(function() {
                uibModalInstance.close()
                getData();
            })
        }

        function saveItemsBenefits(form,uibModalInstance) {
            var body = {
                "icono": form.icon,
                "titulo": form.title,
                "link": form.link,
                "linkInterno": !form.check,
                "accion": "UPDATE"
            }

            GeneralAdminMapfreTecuidamosFactory.saveCardSection(  
                'B' +AdminRamoFactory.getSectionSelected().code ,
                vm.selectedTab,
                body,
                "BENEFICIO",
                true
            ).then(function() {
                uibModalInstance.close()
                getData();
            })
        }

        function onClickItemsBenefitsRemove(data) {
            mModalConfirm.confirmInfo(
                null,
                '¿Estás seguro de eliminar el beneficio?',
                'SI').then(function (response) {
                    if (response) {
                        GeneralAdminMapfreTecuidamosFactory.deleteCardSection(
                            'B' +AdminRamoFactory.getSectionSelected().code ,
                            vm.selectedTab,
                            data.contentId,
                            true
                        ).then(
                            function () {
                                getData();
                            }
                        ).catch(function (error) {
                            mModalAlert
                                .showError('Ocurrió un error al eliminar', 'ERROR');
                        })
                    }
                }).catch(function (error) { });;

        }

        function editAssistance(data) {
            vm.formAssistance =ng.copy({
                title: data.title,
                description: data.description,
                linkImage: data.linkImage,
                linkPdf: data.linkPdf,
                textButton: data.textButton,
                contentId: data.contentId,
            }); 

            vm.file.image.src = data.linkImage;
            vm.file.pdf.src = data.linkPdf;
            vm.file.pdf.name = data.nameFile;
            $uibModal.open({
                backdrop: true, // background de fondo
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                scope: $scope,
                size: 'lg',
                templateUrl: '/admin-portal/app/admin-mapfre-tecuidamos/pages/my-benefits/modal-assistance.html',
                controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout', function ($scope, $uibModalInstance, $uibModal, $timeout) {
                    //CloseModal
                    $scope.closeModal = function () {
                        $uibModalInstance.close();
                    };

                    $scope.saveAssistance = function () {
                        if (!$scope.frmModalAssistance.$valid) {
                            $scope.frmModalAssistance.markAsPristine();
                            return;
                        }
                        updateAssistance($uibModalInstance) 
                    };

                    $scope.onQuillEditorChanged = function(){
                        formValidate();
                        !$scope.frmModalAssistance.$valid && $scope.frmModalAssistance.markAsPristine();
                    }

                    function formValidate(){
                        var isValide = htmlEncode(vm.formAssistance.description).length > 4000;
                        $scope.frmModalAssistance.nDescContenido.$error.maxlength = isValide;
                        $scope.frmModalAssistance.$valid = !isValide;
                    }
                }]
            });
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

        function updateAssistance(uibModalInstance) {
            var body = {
                titulo: vm.formAssistance.title,
                descContenido: vm.formAssistance.description,
                textoEvento: vm.formAssistance.textButton,
                rutaImagen: vm.formAssistance.linkImage,
                rutaPdf: vm.formAssistance.linkPdf,
                nombreArchivoPdf: vm.formAssistance.nameFile,
                accion: "UPDATE"
            }

            GeneralAdminMapfreTecuidamosFactory.updateCardSection(  
                'A' +AdminRamoFactory.getSectionSelected().code ,
                vm.selectedTab,
                vm.formAssistance.contentId,
                body,
                "ASISTENCIA",
                true
            ).then(function() {
                uibModalInstance.close()
                getData();
            })
        }

        function deleteFile(type) {
            vm.file[type].upload = false;
            vm.file[type].src = null;
            vm.file[type].name = null;
        }

        function setIcon(key) {
            vm.formItemsBenefits.icon = key;
            vm.svgList.classList.toggle('hidden');
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('MyBenefitsController', MyBenefitsController)
        .component('apMyBenefits', {
            templateUrl: folder + '/app/admin-mapfre-tecuidamos/pages/my-benefits/my-benefits.component.html',
            controller: 'MyBenefitsController',
            bindings: {
            }
        });;
});
