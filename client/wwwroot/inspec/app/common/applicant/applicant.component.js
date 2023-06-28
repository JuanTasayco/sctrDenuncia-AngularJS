'use strict';

define(['angular', 'lodash'], function(ng, _) {
  applicantController.$inject = ['$scope', '$log', 'accessSupplier', 'inspecFactory'];

  function applicantController($scope, $log, oimClaims, inspecFactory) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      vm.data = vm.data || {};
      vm.title = vm.title || 'Información del solicitante';
      queryInspectionTypes();
      vm.data.mConfirmationEmail = vm.data.mConfirmationEmail || vm.confirmationEmail || oimClaims.profile().userEmail;
      vm.data.mCopyEmail = vm.data.mCopyEmail || vm.copyEmail;
    }

    function setAgentQuotation() {
      if (!vm.data.agentRequest) {
        vm.data.agentRequest = {
          nombre: vm.agentCode + ' >>> ' + vm.agentName,
          id: vm.agentCode
        };
      }
    }

    function queryInspectionTypes() {
      inspecFactory.common.getInspectionType(true).then(function(response) {
        vm.inspectionTypes = response;
        if (vm.fromQuotation) {
          $log.log('response', response);
          if (!vm.data.mInspectionType) {
            vm.data.mInspectionType = vm.inspectionTypes[1];
          }
        } else if (vm.fromNoQuotation) {
          var index = _.findIndex(vm.inspectionTypes, function(type) {
            return type.parameterId === vm.inspectionType;
          });

          if (index !== -1) {
            vm.data.mInspectionType = vm.inspectionTypes[index];
          }
        }
      });
    }

    $scope.$watch(
      function() {
        return vm.agentLoaded;
      },
      function(newValue) {
        if (newValue) {
          if (vm.fromQuotation) {
            setAgentQuotation();
          }
        }
      }
    );
  }
  return ng
    .module('appInspec')
    .controller('ApplicantController', applicantController)
    .component('inspecApplicant', {
      templateUrl: '/inspec/app/common/applicant/applicant.html',
      controller: 'ApplicantController',
      controllerAs: '$ctrl',
      bindings: {
        data: '=',
        origin: '=',
        fromQuotation: '=?',
        fromNoQuotation: '=?',
        inspectionType: '=?',
        agentCode: '=?',
        agentName: '=?',
        agentLoaded: '=?',
        copyEmail: '=',
        confirmationEmail: '=',
        anchor: '=?'
      }
    });
});
