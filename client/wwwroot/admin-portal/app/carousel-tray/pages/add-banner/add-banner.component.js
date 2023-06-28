'use strict';

define(['angular', 'coreConstants', 'generalConstants', 'lodash', 'addBannerUtils', 'localStorageUtils'], function(
  ng,
  coreConstants,
  generalConstants,
  _,
  addBannerUtils,
  localStorageUtils
) {
  AddBannerComponent.$Inject = ['AddBannerFactory', '$stateParams', '$window', 'mModalConfirm', 'mModalAlert'];
  function AddBannerComponent(AddBannerFactory, $stateParams, $window, mModalConfirm, mModalAlert) {
    var vm = this;
    vm.$onInit = onInit;

    vm.grabar = grabar;
    vm.cancelar = cancelar;
    vm.onStartDateChanged = onStartDateChanged;
    vm.onUrlChange = onUrlChange;
    vm.uploadDesktopHD = uploadDesktopHD;
    vm.uploadDesktop = uploadDesktop;
    vm.uploadTablet = uploadTablet;
    vm.uploadResponsive = uploadResponsive;
    vm.onCheckAll = onCheckAll;
    vm.onCheck = onCheck;
    vm.isAllChecked = true;
    vm.mCheckAll;
    var tmp = [];

    function onInit() {
      _initValues();
      _getOptions();
    }

    function cancelar() {
      var title =
        '¿Seguro que desea salir de esta página? Recuerde que al regresar los datos de esta pagina se perderán';
      mModalConfirm.confirmDanger(title, '', 'Regresar').then(function() {
        _cancel();
      });
    }

    function buildResponse(title, res) {
      if (res.codigo != coreConstants.api.successfulCode) {
        return void 0;
      }

      var message = res.descripcion + '<div class="text-left ml-md-3 mb-md-2">';
      _.forEach(res.carruseles, function(c) {
        message += '<br>- ' + c.titulo;
      });
      message += '</div>';
      mModalAlert.showSuccess(message, title).then(function() {
        $window.history.back();
      });
    }

    function grabar() {
      if (vm.form.$invalid) {
        vm.form.markAsPristine();
        return void 0;
      }

      var reqBody = {
        campania: vm.frm.campaignName,
        link: vm.frm.addressLink,
        descripcion: vm.frm.bannerDescription,
        fechaInicio: addBannerUtils.getDDMMYYYY(vm.frm.startDate),
        fechaFin: addBannerUtils.getDDMMYYYY(vm.frm.endDate),
        imgDesktopHdNombre: vm.frm.fotosBanners[0].nombreImagen || '',
        imgDesktopNombre: vm.frm.fotosBanners[1].nombreImagen || '',
        imgTabletNombre: vm.frm.fotosBanners[2].nombreImagen || '',
        imgMobileNombre: vm.frm.fotosBanners[3].nombreImagen || '',
        imgDesktopHd: vm.frm.fotosBanners[0].nombreFisico || '',
        imgDesktop: vm.frm.fotosBanners[1].nombreFisico || '',
        imgTablet: vm.frm.fotosBanners[2].nombreFisico || '',
        imgMobile: vm.frm.fotosBanners[3].nombreFisico || '',
        carruseles: _getCarouselList()
      };

      if (reqBody.carruseles.length === 0) {
        return void mModalAlert.showWarning('Por favor seleccione un carrusel dónde mostrar', '');
      }

      if ($stateParams.idBanner) {
        reqBody.idBanner = parseInt($stateParams.idBanner);

        AddBannerFactory.UpdateBanner([reqBody], vm.idCarousel, true).then(function(res) {
          buildResponse('¡BANNER MODIFICADO!', res);
        });
      } else {
        AddBannerFactory.CreateBanner(reqBody, true).then(function(res) {
          buildResponse('¡BANNER CREADO!', res);
        });
      }
    }

    function convertStringToDate(dateString) {
      var parts = dateString.split('/');
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    function getBannerDetail(req) {
      AddBannerFactory.GetBannerDetail(req, true).then(function(res) {
        if (res.length > 0) {
          vm.frm.campaignName = res[0].campania;
          vm.frm.addressLink = res[0].link;
          vm.frm.bannerDescription = res[0].descripcion;
          vm.frm.startDate = convertStringToDate(res[0].fechaInicio);
          vm.frm.endDate = convertStringToDate(res[0].fechaFin);
          _.forEach(res[0].carruseles, function(c) {
            vm.frm.carouselList[c.idCarrusel] = true;
            tmp[c.idCarrusel] = true;
          });

          vm.frm.fotosBanners[0] = res[0].imgDesktopHd
            ? [AddBannerFactory.getFotoConB64({}, {photoBase64: res[0].imgDesktopHd, name: res[0].imgDesktopHdNombre})]
            : [];
          vm.frm.fotosBanners[1] = res[0].imgDesktop
            ? [AddBannerFactory.getFotoConB64({}, {photoBase64: res[0].imgDesktop, name: res[0].imgDesktopNombre})]
            : [];
          vm.frm.fotosBanners[2] = res[0].imgTablet
            ? [AddBannerFactory.getFotoConB64({}, {photoBase64: res[0].imgTablet, name: res[0].imgTabletNombre})]
            : [];
          vm.frm.fotosBanners[3] = res[0].imgMobile
            ? [AddBannerFactory.getFotoConB64({}, {photoBase64: res[0].imgMobile, name: res[0].imgMobileNombre})]
            : [];
        }
      });
    }

    function onStartDateChanged() {
      var minDate = new Date(vm.frm.startDate);
      vm.maxDate = new Date(minDate.setMonth(minDate.getMonth() + 3));
    }

    function onUrlChange() {
      var isValid = generalConstants.urlRegEx.test(vm.frm.addressLink);
      vm.form.nLinkDireccion.$invalid = !isValid;
    }

    function onCheckAll() {
      vm.isAllChecked = !vm.isAllChecked;
      if (vm.isAllChecked) {
        tmp = _.assign([], vm.frm.carouselList);
        vm.frm.carouselList = _.map(vm.frm.carouselList, function() {
          return false;
        });
      } else {
        vm.frm.carouselList = _.assign([], tmp);
      }
    }

    function onCheck() {
      vm.isAllChecked = vm.mCheckAll = false;
    }

    // Upload de imagenes

    function uploadDesktopHD(event) {
      return AddBannerFactory.UploadImage(event.photoToUpload);
    }

    function uploadDesktop(event) {
      return AddBannerFactory.UploadImage(event.photoToUpload);
    }

    function uploadTablet(event) {
      return AddBannerFactory.UploadImage(event.photoToUpload);
    }

    function uploadResponsive(event) {
      return AddBannerFactory.UploadImage(event.photoToUpload);
    }

    // private

    function _getOptions() {
      AddBannerFactory.GetOptions(true).then(function(res) {
        vm.options = res;
      });
    }

    function _getCarouselList() {
      return _.compact(
        _.map(vm.frm.carouselList, function(item, idx) {
          return item ? {idCarrusel: idx} : null;
        })
      );
    }

    function _cancel() {
      $window.history.back();
    }

    function _initValues() {
      vm.idCarousel = $stateParams.idCarousel;
      vm.formTitle = $stateParams.idBanner ? 'Modificar Banner' : 'Crear nuevo Banner';
      vm.btnText = $stateParams.idBanner ? 'GUARDAR CAMBIOS' : 'CREAR BANNER';
      var carouselLimit = localStorageUtils.getParameter('ADMPORTALES_CARRUSEL_LIMITE_BANNER');
      vm.tooltipLimit = 'Este carrusel ya contiene ' + carouselLimit + ' banners';
      vm.frm = AddBannerFactory.setForm();
      if (vm.idCarousel > 0) {
        vm.frm.carouselList[vm.idCarousel] = true;
        tmp[vm.idCarousel] = true;
      }
      onStartDateChanged();
      if ($stateParams.idBanner) {
        getBannerDetail({idBanner: $stateParams.idBanner});
      }
    }
  } // end controller

  return ng.module(coreConstants.ngMainModule).controller('AddBannerComponent', AddBannerComponent);
});
