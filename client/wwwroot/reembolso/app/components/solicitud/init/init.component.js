'use strict';

define(['angular', 'lodash', 'ReembolsoActions'], function (ng, _, ReembolsoActions) {
  InitSolicitudController.$inject = ['reFactory', '$ngRedux', '$log', 'mModalConfirm'];

  function InitSolicitudController(reFactory, $ngRedux, $log, mModalConfirm) {
    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.changeCompany = changeCompany;
    vm.continueToStepone = continueToStepone;

    // function declaration

    function onInit() {
      actionsRedux = $ngRedux.connect(
        mapStateToThis,
        ReembolsoActions
      )(vm);
      vm.solicitudInit = {};
      _getCompanies();
      vm.reduxCleanState();
    }

    function onDestroy() {
      actionsRedux();
    }

    function changeCompany(idCompany) {
      if (!idCompany) {
        vm.productType = [];
        return void 0;
      }

      vm.solicitudInit.productType = null;
      _getProductType(vm.solicitudInit.company.idCompany);
    }

    function continueToStepone() {
      var company = {
        company: {
          id: vm.solicitudInit.company.idCompany,
          name: vm.solicitudInit.company.companyName
        },
      }
      var product = {
        product: {
          code: vm.solicitudInit.productType.productCode,
          name: vm.solicitudInit.productType.productDescription
        }
      }
      vm.reduxUpdateCompany(company);
      vm.reduxUpdateProduct(product);
    }

    function mapStateToThis(state) {
      return {
        solicitud: state
      };
    }

    function _getCompanies() {
      reFactory.solicitud
        .GetAllCompany()
        .then(function (res) {
          vm.companiesList = res.data;
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        });
    }

    function _getProductType(companyId) {
      reFactory.solicitud
        .GetProductsByCompany(companyId)
        .then(function (res) {
          vm.productType = res.data;
        })
        .catch(function (err) {
          vm.productType = [];
          $log.error('Fallo en el servidor', err);
        });
    }
  }

  return ng
    .module('appReembolso')
    .controller('InitSolicitudController', InitSolicitudController)
    .component('reInitSolicitud', {
      templateUrl: '/reembolso/app/components/solicitud/init/init.html',
      controller: 'InitSolicitudController',
      bindings: {}
    });
});
