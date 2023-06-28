'use strict';

define(['angular', 'coreConstants', 'system', 'lodash'], function(ng, coreConstants, system, _) {
  var folder = system.apps.ap.location;

  BannerUploadController.$inject = ['$scope', 'AddBannerFactory'];
  function BannerUploadController($scope, AddBannerFactory) {
    var vm = this;
    var watchPreFotosModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.handleUploadDesktopHD = handleUploadDesktopHD;
    vm.handleUploadDesktop = handleUploadDesktop;
    vm.handleUploadTablet = handleUploadTablet;
    vm.handleUploadResponsive = handleUploadResponsive;

    function onInit() {
      vm.fotosBanners = (vm.fotosBanners || []).length ? vm.fotosBanners : [];
      var arrFotosBanner = _cleanArrayFotos(vm.fotosBanners) || [];
      vm.imgDesktopHD = arrFotosBanner[0] ? [].concat(arrFotosBanner[0]) : [];
      vm.imgDesktop = arrFotosBanner[1] ? [].concat(arrFotosBanner[1]) : [];
      vm.imgTablet = arrFotosBanner[2] ? [].concat(arrFotosBanner[2]) : [];
      vm.imgResponsive = arrFotosBanner[3] ? [].concat(arrFotosBanner[3]) : [];
      watcherPreFotosModel();
    }

    function onDestroy() {
      watchPreFotosModel();
    }

    function watcherPreFotosModel() {
      watchPreFotosModel = $scope.$watchCollection(
        '$ctrl.fotosBanners',
        function(preFotos) {
          _.forEach(preFotos, function(pre, index) {
            if (pre[0] && pre[0].srcImg) {
              switch (index) {
                case 0:
                  vm.imgDesktopHD = pre;
                  break;
                case 1:
                  vm.imgDesktop = pre;
                  break;
                case 2:
                  vm.imgTablet = pre;
                  break;
                case 3:
                  vm.imgResponsive = pre;
                  break;
              }
            }
          });
        },
        true
      );
    }

    function _cleanArrayFotos(arrFotos) {
      return _.map(ng.copy(arrFotos), function maf(item) {
        return item && item.nombreFisico ? item : null;
      });
    }

    function _setFotoDocByIdx(idx, resp, photoData) {
      vm.fotosBanners[idx] = AddBannerFactory.getObjFotoDoc(resp, photoData);
    }

    // Upload Handlers

    function handleUploadDesktopHD(event) {
      vm.onUploadDesktopHd({$event: {photoToUpload: event.photoToUpload}}).then(function ucsPr(resp) {
        _setFotoDocByIdx(0, resp, event.photoData);
        vm.imgDesktopHD[0] = AddBannerFactory.getFotoConB64(resp, event.photoData);
      });
    }

    function handleUploadDesktop(event) {
      vm.onUploadDesktopHd({$event: {photoToUpload: event.photoToUpload}}).then(function ucsPr(resp) {
        _setFotoDocByIdx(1, resp, event.photoData);
        vm.imgDesktop[0] = AddBannerFactory.getFotoConB64(resp, event.photoData);
      });
    }

    function handleUploadTablet(event) {
      vm.onUploadDesktopHd({$event: {photoToUpload: event.photoToUpload}}).then(function ucsPr(resp) {
        _setFotoDocByIdx(2, resp, event.photoData);
        vm.imgTablet[0] = AddBannerFactory.getFotoConB64(resp, event.photoData);
      });
    }

    function handleUploadResponsive(event) {
      vm.onUploadDesktopHd({$event: {photoToUpload: event.photoToUpload}}).then(function ucsPr(resp) {
        _setFotoDocByIdx(3, resp, event.photoData);
        vm.imgResponsive[0] = AddBannerFactory.getFotoConB64(resp, event.photoData);
      });
    }
  } // end controller

  return ng
    .module(coreConstants.ngMainModule)
    .controller('BannerUploadController', BannerUploadController)
    .component('apBannerUpload', {
      templateUrl: folder + '/app/carousel-tray/components/banner-upload/banner-upload.component.html',
      controller: 'BannerUploadController',
      bindings: {
        fotosBanners: '=?',
        onUploadDesktopHd: '&?',
        onUploadDesktop: '&?',
        onUploadTablet: '&?',
        onUploadResponsive: '&?',
        opt: '=?'
      }
    });
});
