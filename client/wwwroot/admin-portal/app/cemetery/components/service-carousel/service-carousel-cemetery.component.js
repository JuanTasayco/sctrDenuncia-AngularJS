'use strict';

define([
	'angular',
	'system',
	'coreConstants'
], function (ng, system, coreConstants) {

	var folder = system.apps.ap.location;

	function ServiceCarouselCemeteryComponent() {

		//environments
		var vm = this;

		//methods
		vm.$onInit = onInit;
		vm.handleUploadCarousel = handleUploadCarousel;

		//events
		function onInit() {
			_initValues();
		}

		//init
		function _initValues() {
		}

		//upload
		function handleUploadCarousel(event, carousel) {
            vm.onUploadCarousel({ $event: { photoToUpload: event.photoToUpload } }).then(function (res) {
                var photo = { rutaTemporal: res.rutaTemporal, nombre: event.photoData.name, srcImg: event.photoData.photoBase64 };
                carousel.srcImg = photo.srcImg;
                carousel.rutaImagen = photo.rutaTemporal;
            });
        }

	}

	return ng
		.module(coreConstants.ngMainModule)
		.controller('ServiceCarouselCemeteryComponent', ServiceCarouselCemeteryComponent)
		.component('serviceCarouselCemetery', {
			templateUrl: folder + '/app/cemetery/components/service-carousel/service-carousel-cemetery.component.html',
			controller: 'ServiceCarouselCemeteryComponent',
			bindings: {
				format: '=?',
				carousels: '=?',
				showSwitch: '=?',
				showButton: '=?',
				onUploadCarousel: '&?',
			}
		});
});
