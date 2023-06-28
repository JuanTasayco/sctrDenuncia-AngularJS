'use strict';

define(['angular', 'coreConstants', 'lodash', 'localStorageUtils', 'jquery'], function(
  ng,
  coreConstants,
  _,
  localStorageUtils,
  $
) {
  CarouselModificationComponent.$inject = [
    '$scope',
    'CarouselModificationFactory',
    '$stateParams',
    'mModalAlert',
    'mModalConfirm'
  ];
  function CarouselModificationComponent(
    $scope,
    CarouselModificationFactory,
    $stateParams,
    mModalAlert,
    mModalConfirm
  ) {
    var vm = this;
    vm.scope = $scope;
    var watchActiveModel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.onChangeStatus = onChangeStatus;
    vm.onRemoveBanner = onRemoveBanner;
    vm.onBannerUp = onBannerUp;
    vm.onBannerDown = onBannerDown;
    vm.validateString = validateString;
    vm.assignBanner = assignBanner;
    vm.clearSearch = clearSearch;
    vm.codeApp = $stateParams.codeApp;

    function onInit() {
      _initValues();
      _getCarousel();
      watcherActiveModel();
    }

    function onDestroy() {
      watchActiveModel();
    }

    function onChangeStatus(newStatus) {
      if (newStatus) {
        _updateCarouselStatus(newStatus);
        return void 0;
      }

      var title =
        'Desea desactivar el "' +
        vm.carousel.titulo +
        '"? Recuerde que al desactivarlo todo el carrusel quedará oculto.';
      mModalConfirm.confirmWarning(title, '', vm.carousel.lblActivateBtn).then(function() {
        _updateCarouselStatus(newStatus);
      });
    }

    function onRemoveBanner(banner) {
      var title = '¿Seguro que desea quitar el banner "' + banner.campania + '" del "' + vm.carousel.titulo + '"?';
      mModalConfirm.confirmWarning(title, '', 'Quitar').then(function() {
        _removeBanner(banner.idBanner);
      });
    }

    function onBannerUp(banner) {
      var list = vm.carousel.listaBanners;
      var i = list.findIndex(function(b) {
        return b.orden === banner.orden;
      });
      var bodyReq = [
        {idBanner: banner.idBanner, orden: banner.orden - 1},
        {idBanner: list[i - 1].idBanner, orden: list[i - 1].orden + 1}
      ];
      _updateBanner(bodyReq);
    }

    function onBannerDown(banner) {
      var list = vm.carousel.listaBanners;
      var i = list.findIndex(function(b) {
        return b.orden === banner.orden;
      });
      var bodyReq = [
        {idBanner: banner.idBanner, orden: banner.orden + 1},
        {idBanner: list[i + 1].idBanner, orden: list[i + 1].orden - 1}
      ];
      _updateBanner(bodyReq);
    }

    // private

    function _getCarousel() {
      var idCarousel = vm.idCarousel;
      CarouselModificationFactory.GetCarousel(idCarousel, true).then(function(res) {
        vm.carousel = res;
        vm.canCreateBanner = res.listaBanners.length >= vm.carouselLimit;
        vm.tooltipLimit = vm.canCreateBanner
          ? 'Este carrusel ya cuenta con el máximo de ' + vm.carouselLimit + ' banners'
          : null;
      });
    }

    function _updateCarouselStatus(newStatus) {
      var data = {idCarrusel: +vm.idCarousel, activo: newStatus};
      CarouselModificationFactory.UpdateCarousel(data, true).then(function(res) {
        if (!res.success) {
          return void 0;
        }

        if (newStatus) {
          var message = '"' + vm.carousel.titulo + '" activado';
          mModalAlert.showSuccess(message.toUpperCase(), '', null, 0, 'aceptar');
        }

        _getCarousel();
      });
    }

    function _removeBanner(idBanner) {
      var queryReq = {
        idCarrusel: vm.idCarousel
      };
      CarouselModificationFactory.RemoveBanner(idBanner, queryReq, true).then(function(res) {
        if (!res.success) {
          return void 0;
        }

        _getCarousel();
      });
    }

    function _updateBanner(bannerList) {
      var queryReq = {
        idCarrusel: vm.idCarousel
      };
      CarouselModificationFactory.UpdateBanner(bannerList, queryReq, true).then(function(res) {
        if (res.success) {
          _getCarousel();
        }
      });
    }

    function _getBannersExistentes() {
      var queryReq = {
        busqueda: vm.searchModel.trim(),
        idCarrusel: vm.idCarousel
      };
      CarouselModificationFactory.GetBannersExistentes(queryReq, true).then(function(res) {
        vm.listBannersExist = res;
      });
    }

    function assignBanner(item) {
      var queryReq = {
        idCarrusel: vm.idCarousel,
        idBanner: item.idBanner
      };
      CarouselModificationFactory.AssignBanner(queryReq, true).then(function(res) {
        vm.scope.active = false;
        if (res) {
          mModalAlert.showSuccess('El banner se agregó correctamente', '').then(function() {
            _getCarousel();
          });
        }
      });
    }

    function validateString() {
      if (vm.searchModel.trim().length === 0 || vm.searchModel.trim().length >= 3) {
        _getBannersExistentes();
      }
    }

    function clearSearch() {
      vm.searchModel = '';
      _getBannersExistentes();
    }

    function watcherActiveModel() {
      watchActiveModel = $scope.$watchCollection(
        'active',
        function(value) {
          vm.searchModel = '';
          if (value) {
            _getBannersExistentes();
          }
        },
        true
      );
    }

    function _initValues() {
      vm.searchModel = '';
      vm.idCarousel = $stateParams.idCarousel;
      vm.carouselLimit = localStorageUtils.getParameter('ADMPORTALES_CARRUSEL_LIMITE_BANNER');
      vm.tooltipLimit = '';
      vm.canCreateBanner = true;
    }
  } // end controller

  function AutoActive() {
    function link(scope, element) {
      // eslint-disable-next-line angular/angularelement
      var $component = $(element);
      $(document).mouseup(function(e) {
        var currentElement = e.target;
        var active = $component.is(currentElement) || !!$component.has(currentElement).length;
        scope.active !== active && (scope.active = active);
        scope.$apply();
      });
    }

    return {
      restrict: 'A',
      link: link
    };
  }

  return ng
    .module(coreConstants.ngMainModule)
    .controller('CarouselModificationComponent', CarouselModificationComponent)
    .directive('autoActive', AutoActive);
});
