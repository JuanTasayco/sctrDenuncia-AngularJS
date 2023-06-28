'use strict';

define([
    'angular',
    'lodash',
    'system',
    'coreConstants'
], function (ng, _, system, coreConstants) {

    var folder = system.apps.ap.location;

    function BannerCemeteryController() {

        //environments
        var vm = this;

        //methods
        vm.$onInit = onInit;
        vm.$onDestroy = onDestroy;
        vm.handleUploadBannerOne = handleUploadBannerOne;
        vm.handleUploadBannerTwo = handleUploadBannerTwo;
        vm.handleUploadBannerThree = handleUploadBannerThree;
        vm.handleUploadCarousel = handleUploadCarousel;

        //events
        function onInit() {
        }

        function onDestroy() {
        }

        //upload
        function handleUploadBannerOne(event) {
            vm.onUploadBannerOne({ $event: { photoToUpload: event.photoToUpload } }).then(function (res) {
                var photo = { rutaTemporal: res.rutaTemporal, nombre: event.photoData.name, srcImg: event.photoData.photoBase64 };
                vm.form.rutaImagenBanner = photo.rutaTemporal;
                vm.form.rutaImagenBannerOne = photo.rutaTemporal;
                vm.form.srcImgBannerOne = photo.srcImg;
            });
        }

        function handleUploadBannerTwo(event) {
            vm.onUploadBannerTwo({ $event: { photoToUpload: event.photoToUpload } }).then(function (res) {
                var photo = { rutaTemporal: res.rutaTemporal, nombre: event.photoData.name, srcImg: event.photoData.photoBase64 };
                vm.form.rutaImagenBannerTwo = photo.rutaTemporal;
                vm.form.srcImgBannerTwo = photo.srcImg;
            });
        }

        function handleUploadBannerThree(event) {
            vm.onUploadBannerThree({ $event: { photoToUpload: event.photoToUpload } }).then(function (res) {
                var photo = { rutaTemporal: res.rutaTemporal, nombre: event.photoData.name, srcImg: event.photoData.photoBase64 };
                vm.form.rutaImagenBannerThree = photo.rutaTemporal;
                vm.form.srcImgBannerThree = photo.srcImg;
            });
        }

        function handleUploadCarousel(event) {
            vm.onUploadCarousel({ $event: { photoToUpload: event.photoToUpload } }).then(function (res) {
                var photo = { rutaTemporal: res.rutaTemporal, nombre: event.photoData.name, srcImg: event.photoData.photoBase64 };
                vm.form.rutaImagenCarrusel = photo.rutaTemporal;
                vm.form.srcImgCarousel = photo.srcImg;
            });
        }
    }

    return ng
        .module(coreConstants.ngMainModule)
        .controller('BannerCemeteryController', BannerCemeteryController)
        .component('bannerCemetery', {
            templateUrl: folder + '/app/cemetery/components/banner/banner-cemetery.component.html',
            controller: 'BannerCemeteryController',
            bindings: {
                form: '=?',
                format: '=?',
                component: '=?',
                onUploadBannerOne: '&?',
                onUploadBannerTwo: '&?',
                onUploadBannerThree: '&?',
                onUploadCarousel: '&?',
            }
        });
});
