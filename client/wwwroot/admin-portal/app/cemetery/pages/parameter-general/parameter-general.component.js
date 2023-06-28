'use strict';

define([
  'angular',
  'lodash',
  'coreConstants',
  'cemeteryConstants',
  'cemeteryUtils'
], function (ng, _, coreConstants, cemeteryConstants, cemeteryUtils) {

  ParameterGeneralComponent.$inject = ['$state', 'mModalAlert', '$q', '$window', '$log', 'CemeteryFactory'];

  function ParameterGeneralComponent($state, mModalAlert, $q, $window, $log, CemeteryFactory) {

    //environments
    var vm = this;
    vm.form = {};
    vm.format = {};
    vm.component = cemeteryConstants.COMPONENT.PARAMETER;
    vm.tabs = [{ name: "General", active: true, href: "parameterGeneral" }, { name: "Configuración de espacios", active: false, href: "parameterSpace" }]

    //methods
    vm.$onInit = onInit;
    vm.uploadBannerOne = uploadBannerOne;
    vm.uploadBannerTwo = uploadBannerTwo;
    vm.uploadBannerThree = uploadBannerThree;
    vm.uploadCarousel = uploadCarousel;
    vm.updateParameters = updateParameters;

    //events
    function onInit() {
      _setScrollTop();
      _initValues();
      _setData();
    }

    //init
    function _initValues() {
      vm.formatCodes = [cemeteryConstants.FORMAT.BANNERS, cemeteryConstants.FORMAT.CAROUSEL, cemeteryConstants.FORMAT.ADDITIONAL_SERVICE];
      vm.formats = [];
      vm.parameters = [];
      vm.carousels = [];
    }

    //scroll
    function _setScrollTop() {
      $window.scroll(0, 0);
    }

    //upload
    function uploadBannerOne(event) {
      return CemeteryFactory.UploadImage(event.photoToUpload);
    }

    function uploadBannerTwo(event) {
      return CemeteryFactory.UploadImage(event.photoToUpload);
    }

    function uploadBannerThree(event) {
      return CemeteryFactory.UploadImage(event.photoToUpload);
    }

    function uploadCarousel(event) {
      return CemeteryFactory.UploadImage(event.photoToUpload);
    }

    //set
    function _setData() {
      var defered = $q.defer();
      var promise = defered.promise;
      try {
        _getListSync().then(function (res) {
          _setDataForm().then(function (res) {
            defered.resolve();
          });
        });
      } catch (e) {
        $log.log('Error', e);
        defered.reject(e);
        $state.go('errorCemetery', {}, { reload: true, inherit: false });
      }
      return promise;
    }

    //methods promises
    function _getParameters() {
      var defered = $q.defer();
      var promise = defered.promise;
      CemeteryFactory.GetParameters(cemeteryConstants.PARAMETER.SUBDOMAIN.GENERAL).then(function (res) {
        vm.parameters = _.sortBy(res.data, function (data) { return data.idParametro; });
        defered.resolve();
      }).catch(function (error) {
        defered.reject(error);
        $state.go('errorCemetery', {}, { reload: true, inherit: false });
      });
      return promise;
    }

    function _getListSync() {
      var defered = $q.defer();
      var promise = defered.promise;
      try {
        CemeteryFactory.LoginApiGateway().then(function (res) {
          _getParameters().then(function (res) {
            defered.resolve();
          });
        });
      } catch (e) {
        $log.log('Error', e);
        defered.reject(e);
        $state.go('errorCemetery', {}, { reload: true, inherit: false });
      }
      return promise;
    }

    function _updateParameters() {
      var defered = $q.defer();
      var promise = defered.promise;
      var modifiedParameters = _getModifiedParameters();
      CemeteryFactory.UpdateParameters({ parametros: modifiedParameters }).then(function (res) {
        defered.resolve();
      }).catch(function (error) {
        defered.reject(error);
        mModalAlert.showError(error.data.mensaje, 'Error');
      });

      return promise;
    }

    //validate
    function _validationForm() {
      if (!vm.form.cintillo.valor1) {
        mModalAlert.showWarning("Ingrese cintillo", 'Advertencia');
        return false;
      }

      if (!vm.form.titular.valor1) {
        mModalAlert.showWarning("Ingrese Titular", 'Advertencia');
        return false;
      }

      if (!vm.form.contenido.valor1) {
        mModalAlert.showWarning("Ingrese Contenido", 'Advertencia');
        return false;
      }

      if (!vm.form.whatsapp.valor1) {
        mModalAlert.showWarning("Ingrese Whatsapp", 'Advertencia');
        return false;
      }

      if (!vm.form.clausula.valor1) {
        mModalAlert.showWarning("Ingrese Cláusula de protección de datos", 'Advertencia');
        return false;
      }

      if (!vm.form.libro.valor1) {
        mModalAlert.showWarning("Ingrese Libro de reclamaciones", 'Advertencia');
        return false;
      }

      return true;
    }

    //set form
    function _setDataForm() {
      var defered = $q.defer();
      var promise = defered.promise;

      vm.form.bannerOne = _.find(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.BANNER, valor4: 'GRAL_BANNER_PRP_1' });
      vm.form.bannerTwo = _.find(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.BANNER, valor4: 'GRAL_BANNER_PRP_2' });
      vm.form.bannerThree = _.find(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.BANNER, valor4: 'GRAL_BANNER_PRP_3' });
      vm.form.srcImgBannerOne = cemeteryUtils.concatenateWithTime(vm.form.bannerOne.valor2);
      vm.form.srcImgBannerTwo = cemeteryUtils.concatenateWithTime(vm.form.bannerTwo.valor2);
      vm.form.srcImgBannerThree = cemeteryUtils.concatenateWithTime(vm.form.bannerThree.valor2);
      vm.form.rutaImagenBannerOne = "";
      vm.form.rutaImagenBannerTwo = "";
      vm.form.rutaImagenBannerThree = "";
      vm.form.cintillo = _.find(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.HEADBAND });
      vm.form.titular = _.find(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.HEADLINE });
      vm.form.contenido = _.find(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.CONTENT });
      vm.form.contenido.valor3 = cemeteryUtils.transformHtml(vm.form.contenido.valor3);
      vm.form.whatsapp = _.find(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.WHATSAPP });
      vm.carousels = _.filter(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.CAROUSEL_SERVICE });
      vm.form.carousels = _buildCarousels();
      vm.form.services = _.filter(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.ADDITIONAL_SERVICE });
      vm.formats = _.filter(vm.parameters, function (parameter) { if (_.contains(vm.formatCodes, parameter.nombre)) return parameter; });
      vm.format.banner = _.find(vm.formats, { nombre: cemeteryConstants.FORMAT.BANNERS });
      vm.format.serviceCarousel = _.find(vm.formats, { nombre: cemeteryConstants.FORMAT.CAROUSEL });
      vm.format.aditionalService = _.find(vm.formats, { nombre: cemeteryConstants.FORMAT.ADDITIONAL_SERVICE });
      vm.form.clausula = _.find(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.DATA_PROTECTION_CLAUSE });
      vm.form.libro = _.find(vm.parameters, { nombre: cemeteryConstants.PARAMETER.NAME.CLAIM_BOOK });

      defered.resolve();
      return promise;
    }

    //method business
    function _buildCarousels() {
      _.forEach(vm.carousels, function (carousel) {
        carousel.srcImg = cemeteryUtils.concatenateWithTime(carousel.valor2);
        carousel.rutaImagen = "";
      });

      return vm.carousels;
    }

    function _getModifiedParameters() {
      var modifiedParameters = [];

      vm.form.cintillo.valor5 = '0';
      vm.form.titular.valor5 = '0';
      vm.form.contenido.valor5 = '0';
      vm.form.whatsapp.valor5 = '0';
      vm.form.clausula.valor5 = '0';
      vm.form.libro.valor5 = '0';

      modifiedParameters.push(vm.form.cintillo);
      modifiedParameters.push(vm.form.titular);
      modifiedParameters.push(vm.form.contenido);
      modifiedParameters.push(vm.form.whatsapp);
      modifiedParameters.push(vm.form.clausula);
      modifiedParameters.push(vm.form.libro);

      if (vm.form.rutaImagenBannerOne !== "") {
        vm.form.bannerOne.valor2 = "";
        vm.form.bannerOne.valor5 = "1";
        vm.form.bannerOne.valor6 = vm.form.rutaImagenBannerOne;
        modifiedParameters.push(vm.form.bannerOne);
      }

      if (vm.form.rutaImagenBannerTwo !== "") {
        vm.form.bannerTwo.valor2 = "";
        vm.form.bannerTwo.valor5 = "1";
        vm.form.bannerTwo.valor6 = vm.form.rutaImagenBannerTwo;
        modifiedParameters.push(vm.form.bannerTwo);
      }

      if (vm.form.rutaImagenBannerThree !== "") {
        vm.form.bannerThree.valor2 = "";
        vm.form.bannerThree.valor5 = "1";
        vm.form.bannerThree.valor6 = vm.form.rutaImagenBannerThree;
        modifiedParameters.push(vm.form.bannerThree);
      }

      _.forEach(vm.form.carousels, function (carousel) {
        if (carousel.rutaImagen !== "") {
          carousel.valor2 = "";
          carousel.valor5 = "1";
          carousel.valor6 = carousel.rutaImagen;
          modifiedParameters.push(carousel);
        }
      });

      return modifiedParameters;
    }

    function updateParameters() {
      if (_validationForm()) {
        CemeteryFactory.LoginApiGateway().then(function (res) {
          _updateParameters().then(function (res) {
            _setData();
            mModalAlert.showSuccess("", "Cambios realizados");
          });
        });
      }
    }

  }

  return ng.module(coreConstants.ngMainModule).controller('ParameterGeneralComponent', ParameterGeneralComponent);
});
