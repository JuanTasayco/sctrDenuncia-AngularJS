'use strict';

define(['angular', 'lodash', 'ReembolsoActions'], function (ng, _, ReembolsoActions) {
  ModalAssignBrokerController.$inject = ['reFactory', '$q', 'mModalAlert', '$ngRedux', '$log'];

  function ModalAssignBrokerController(reFactory, $q, mModalAlert, $ngRedux, $log) {
    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.cerrar = cerrar;
    vm.assignBroker = assignBroker;
    vm.getBrokerList = getBrokerList;
    vm.getEjecutivoList = getEjecutivoList;
    vm.changeCompany = changeCompany;

    // functions declaration

    function onInit() {
      actionsRedux = $ngRedux.connect(
        mapStateToThis,
        ReembolsoActions
      )(vm);

      vm.consultData = vm.edit ? _mapFormEdit(vm.data) : _mapFormInit(vm.data);

      _getCompanies();
      _getStates();
      !vm.consultData.company.companyId && changeCompany();
    }

    function onDestroy() {
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        solicitud: state.solicitud,
      };
    }

    function assignBroker() {
      if (vm.frmBroker.$invalid) {
        vm.frmBroker.markAsPristine();
        return void 0;
      }

      var request = _mapRequestService(vm.consultData.idRefundBroker || 0);
      var serviceName = vm.edit ? 'UpdateAssignment' : 'SaveAssignmentNew';
      var service = reFactory.solicitud[serviceName];

      service(request)
        .then(function (res) {
          res.isValid ?
            vm.close({
              $event: {
                data: vm.consultData,
                status: 'ok'
              }
            }) :
            mModalAlert.showError(res.brokenRulesCollection[0].description, 'Error');
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        })
    }

    function cerrar() {
      vm.close(void 0);
    }

    function changeCompany() {
      if (vm.consultData.company.idCompany) {
        _getProductType(vm.consultData.company.idCompany);
      }
    }

    function getBrokerList(input) {
      var criteria = input.toUpperCase();

      var defer = $q.defer();
      reFactory.solicitud.GetBrokerList(criteria).then(
        function (res) {
          defer.resolve(res.data);
        },
        function (err) {
          mModalAlert.showError(err.data.message, 'Error');
        }
      );

      return defer.promise;
    }

    function getEjecutivoList(input) {
      var criteria = input.toUpperCase();

      var defer = $q.defer();
      reFactory.solicitud.GetEjecutivoList(criteria).then(
        function (res) {
          defer.resolve(res.data);
        },
        function (err) {
          mModalAlert.showError(err.data.message, 'Error');
        }
      );

      return defer.promise;
    }

    // privates

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

    function _getStates() {
      reFactory.solicitud
        .GetAllDocumentStatus()
        .then(function (res) {
          vm.states = res.data;
        })
        .catch(function (err) {
          vm.states = [];
          $log.error('Fallo en el servidor', err);
        });
    }

    function _mapFormInit(data) {
      return _.assign({}, {
        broker: data.broker,
        company: data.company.idCompany ? data.company : {
          idCompany: null
        },
        ejecutivo: data.ejecutivo,
        idRefundBroker: 0,
        productType: data.productType ? data.productType : {
          productCode: null
        },
        state: data.state.idDocumentStatus ? data.state : {
          idDocumentStatus: null
        }
      })
    }

    function _mapFormEdit(dataEdit) {
      return _.assign({}, {
        broker: {
          description: dataEdit.brokerDescription,
          idBroker: dataEdit.idBroker
        },
        company: {
          idCompany: dataEdit.idCompany
        },
        ejecutivo: {
          description: dataEdit.executiveDescription,
          executiveCode: dataEdit.executiveCode
        },
        idRefundBroker: dataEdit.idRefundBroker,
        productType: {
          productCode: dataEdit.productCode
        },
        state: {
          idDocumentStatus: dataEdit.idDocumentStatus
        }
      })
    }

    function _mapRequestService(idRefundBroker) {
      return _.assign({}, {
        executiveCode: vm.consultData.ejecutivo.executiveCode,
        idBroker: vm.consultData.broker.idBroker,
        idCompany: vm.consultData.company.idCompany,
        idDocumentStatus: vm.consultData.state.idDocumentStatus,
        idRefundBroker: idRefundBroker,
        productCode: vm.consultData.productType.productCode
      })
    }
  }

  return ng
    .module('appReembolso')
    .controller('ModalAssignBrokerController', ModalAssignBrokerController)
    .component('reModalAssignBroker', {
      templateUrl: '/reembolso/app/common/modals/modal-assign-broker/modal-assign-broker.html',
      controller: 'ModalAssignBrokerController',
      bindings: {
        close: '&?',
        data: '<',
        edit: '<'
      }
    });
});
