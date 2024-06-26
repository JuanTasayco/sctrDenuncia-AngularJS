'use strict';
/* eslint-disable new-cap */

define(['angular', 'lodash', 'coreConstants', 'homeConstants', 'productsConstants'], function(
  ng,
  _,
  coreConstants,
  homeConstants,
  productsConstants
) {
  SecurityFactory.$inject = ['accessSupplier'];

  function SecurityFactory(accessSupplier) {
    return {
      getMenuHome: getMenuHome,
      getProductsOfCarousel: getProductsOfCarousel,
      getProductsOfForm: getProductsOfForm,
      getProductsOfAdminPolicy: getProductsOfAdminPolicy,
      mapMenuHome: mapMenuHome,
      mapProducts: mapProducts,
      mapRamo: mapRamo,
    };

    function getMenuHome() {
      return _getSubMenu().then(_getMainObj.bind(null, 'PUBLICAR'));
    }

    function getProductsOfCarousel() {
      return _getSubMenu().then(_getMainObj.bind(null, 'CARRUSELES'));
    }

    function getProductsOfForm() {
      return _getSubMenu().then(_getMainObj.bind(null, 'FORMULARIOS'));
    }

    function getProductsOfAdminPolicy() {
      return _getSubMenu().then(_getMainObj.bind(null, 'ADM_RAMO'));
    }

    function mapRamo(obj) {
      return _.map(obj.items, function(p) {
        return { icon :p.iconObjMx , name: p.nombreLargo, code: p.nombreCorto , url: '/images/ico-ramos/' + p.ruta, selected : false};
      });
    }

    function mapProducts(obj) {
      return _.map(obj.items, function(p) {
        return {code: p.ruta, lbl: p.nombreLargo, ico: productsConstants.getIcoByCode(p.ruta)};
      });
    }

    function mapMenuHome(obj) {
      var items = _.map(obj.items, function(p) {
        return {code: p.nombreCorto, lbl: p.nombreLargo, ruta: p.ruta, img: homeConstants.img[p.nombreCorto]};
      });

      return _.filter(items, function(item) {
        return item.img;
      });
    }

    // private

    function _getMainObj(key, arrSubMenus) {
      return _.find(arrSubMenus, function(o) {
        return o.nombreCabecera === key;
      });
    }

    function _getSubMenu() {
      return accessSupplier.GetSubMenu();
    }
  } // end factory

  return ng.module(coreConstants.ngSecurityModule, []).factory('SecurityFactory', SecurityFactory);
});
