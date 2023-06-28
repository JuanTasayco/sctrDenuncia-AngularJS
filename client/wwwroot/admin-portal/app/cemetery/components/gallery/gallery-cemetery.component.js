'use strict';

define([
    'angular',
    'lodash',
    'system',
    'coreConstants'
], function (ng, _, system, coreConstants) {

    var folder = system.apps.ap.location;

    function GalleryCemeteryController() {

        //environments
        var vm = this;

        //methods
        vm.$onInit = onInit;
        vm.$onDestroy = onDestroy;
        vm.handleUploadGallery = handleUploadGallery;

        //events
        function onInit() {
        }

        function onDestroy() {
        }

        //upload
        function handleUploadGallery(event, gallery) {
            vm.onUploadGallery({ $event: { photoToUpload: event.photoToUpload } }).then(function (res) {
                var photo = { rutaTemporal: res.rutaTemporal, nombre: event.photoData.name, srcImg: event.photoData.photoBase64 };
                gallery.srcImg = photo.srcImg;
                //cemetery
                gallery.rutaImagen = photo.rutaTemporal;
                //parameter
                gallery.valor6 = photo.rutaTemporal;
            });
        }

    }

    return ng
        .module(coreConstants.ngMainModule)
        .controller('GalleryCemeteryController', GalleryCemeteryController)
        .component('galleryCemetery', {
            templateUrl: folder + '/app/cemetery/components/gallery/gallery-cemetery.component.html',
            controller: 'GalleryCemeteryController',
            bindings: {
                format: '=?',
                galleries: '=?',
                onUploadGallery: '&?',
            }
        });
});
