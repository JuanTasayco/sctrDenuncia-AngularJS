'use strict';

define([
  'angular', 'constants', 'nsctr_constants', 'lodash',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs',
  'nsctrApplicationFactory',
  'nsctrModalHistoryJs',
  'nsctrModalCreateApplicationJs',
  'classApplicationStateFilter'
], function(angular, constants, nsctr_constants, _) {

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrAccordionPolicyController',
    ['$rootScope', '$scope','$state', 'mainServices', 'nsctrFactory', 'nsctrService', 'nsctrRoles',
    '$timeout', 'mModalAlert', '$uibModal', 'nsctrApplicationFactory',
    function($rootScope, $scope, $state, mainServices, nsctrFactory, nsctrService, nsctrRoles,
    $timeout, mModalAlert, $uibModal, nsctrApplicationFactory) {
      /*########################
      # _self
      ########################*/
      var _self = this;

      /*########################
      # _showCheckPolicy
      ########################*/
      function _showCheckPolicy() {
        var vRoles = [nsctrRoles.GESTOR_CORREDORES, nsctrRoles.DIRECTOR, nsctrRoles.BROKERMANUAL];

        return _.contains(vRoles, _self.user.role) || _self.user.isAdmin;
      }


      _self.fnShowOnboarding = function (event,item) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        mModalAlert.showWarning('La póliza ' + item + ' se encuentra con control técnico, por favor comunicarse con su ejecutivo comercial para su aprobación.', 'ALERTA');
      }

      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function() {
        _self.MODULE = $state.current.module;
        //_self.showCheckPolicy = _showCheckPolicy();
        _self.applications = _self.applications || [];
        
        var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+_self.MODULE.appCode)), "PROCESOS_ACCIONES", "nombreCabecera");
        _self.segurityHistory = nsctrFactory.validation._filterData(segurity.items, "HISTORIAL", "nombreCorto");
        _self.segurityAddApp = nsctrFactory.validation._filterData(segurity.items, "CREAR_APLICACION_MANEJABLE", "nombreCorto");
        _self.showCheckPolicy = nsctrFactory.validation._filterData(segurity.items, "GENERAR_CONSTANCIA_MANUAL", "nombreCorto");
      };

      /*#######################
      # fnShowHistory
      #######################*/
      _self.fnShowHistory = function(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        $scope.modalHistory = {
          mainData: {
            itemPolicy: _self.policy
          },
          data: {}
        }
        var vOptModal = nsctrService.fnDefaultModalOptions($scope, {
                          template: '<nsctr-modal-history main-data="modalHistory.mainData" data="modalHistory.data"></nsctr-modal-history>'
                        });
        vOptModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
          function($scope, $uibModalInstance, $uibModal) {
            $scope.$on('fnCloseModal_modalHistory', function() {
              $uibModalInstance.close();
            });
        }];

        $uibModal.open(vOptModal);
      };

      /*#######################
      # fnOpenToggle
      #######################*/
      function _clearSearchedApplications() {
        _self.applications = [];
        nsctrApplicationFactory.setApplications(_self.applications);
      }

      function _paramsSearchedApplications(itemPolicy) {
        var vParams = {
          NSCTRSystemType:        _self.module.code,
          insuredCollective:      itemPolicy.insuredCollective,
          policyDateEnd:          itemPolicy.policyDateEnd,
          declarationType :       itemPolicy.declarationType,
          pensionPolicyNumber :   itemPolicy.pensionPolicyNumber,
          healthPolicyNumber :    itemPolicy.healthPolicyNumber,
          agentId :               itemPolicy.agentId,
          rolCode :               _self.user.role,
          clientDocumentType :    itemPolicy.clientDocumentType,
          clientDocumentNumber :  itemPolicy.clientDocumentNumber,
        };
        return vParams;
      }
      function _getApplications(data) {
        return _.map(data, function(fv, fk) {
          fv.applications = _.map(fv.applications, function(sv, sk) {
            sv.policyIndex = _self.policy.index;
            sv.applicationsIndex = fk;
            sv.index = sk;
            sv.mCheckApplication = !!_.find(nsctrApplicationFactory.getSelectedApplications(), function(tv, tk) {
              return tv.policyIndex === sv.policyIndex &&
                      tv.applicationsIndex === sv.applicationsIndex &&
                      tv.index === sv.index;
            });

            return sv;
          });

          return fv;
        });
      }

      _self.fnOpenToggle = function(itemPolicy) {
        _self.itemPolicy = itemPolicy;
        var policymsg = "";
        
        policymsg = itemPolicy.flgEsProvisionalSalud == 'S' ? itemPolicy.healthPolicyNumber : policymsg +  "";
        policymsg =  itemPolicy.flgEsProvisionalPension == 'S' ? (policymsg ? policymsg + ' y '  + itemPolicy.pensionPolicyNumber : policymsg + itemPolicy.pensionPolicyNumber ) : policymsg + " ";

        $timeout(function() {
          var vToggle = itemPolicy.openToggle;
          if (vToggle){
            _clearSearchedApplications();
            var vParams = _paramsSearchedApplications(itemPolicy);
            nsctrFactory.common.proxyApplication.ServicesApplicationsByClient(vParams, true).then(function(response) {
              if (constants.operationCode.success === response.operationCode && response.data && response.data.length) {
                _self.applications = _getApplications(response.data);
                nsctrApplicationFactory.setApplications(_self.applications);
              } else{
                itemPolicy.openToggle = !vToggle;
                if(!response.data.length){
                  mModalAlert.showWarning('No existen aplicaciones vigentes para declarar', 'ALERTA')
                }else{
                  mModalAlert.showWarning('La póliza ' + policymsg + ' se encuentra con control técnico, por favor comunicarse con su ejecutivo comercial para su aprobación.', 'ALERTA');
                }
              }
            }).catch(function() {
              itemPolicy.openToggle = !vToggle;
              mModalAlert.showWarning('La póliza ' + policymsg + ' se encuentra con control técnico, por favor comunicarse con su ejecutivo comercial para su aprobación.', 'ALERTA');
            });
          }
        }, 0);
      };

      /*#######################
      # fnGetClassApplicationState
      #######################*/
      _self.fnGetClassApplicationState = function(state) {
        return nsctrService.fnGetClassApplicationState(state);
      };

      /*#######################
      # fnCheckPolicy
      #######################*/
      _self.fnCheckPolicy = function(event){
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        _self.checkPolicy();
      };

      /*#######################
      # fnCheckApplication
      #######################*/
      _self.fnCheckApplication = function(application, applications, event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        _self.checkApplication({
          itemApplication: application,
          applications: applications
        });
      };

      /*#######################
      # fnOpenTooltipEllipses
      #######################*/
      _self.fnOpenTooltipEllipses = function(event, openTooltip){
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        openTooltip = !openTooltip;
      };

      /*#######################
      # fnCreateApplication
      #######################*/
      _self.showCreateApplication = function(itemApplication){
        var vValidMonthsNumber = mainServices.date.fnDiff(itemApplication.policyDateStart, itemApplication.policyDateEnd, 'M') > 0,
            //Filtered by state declared
            vApplicationsFiltered = _.filter(itemApplication.applications, function(elem, key){
              return elem.state == nsctr_constants.state.declared.description.toLowerCase();
            }),
            vIsDeclared = vApplicationsFiltered.length === itemApplication.applications.length,
            vIsCreateByUser = itemApplication.flgIsCreateByUser,
            vShowButton = vValidMonthsNumber && vIsDeclared && !vIsCreateByUser && _self.segurityAddApp;
        return vShowButton;
      };

      _self.fnCreateApplication = function(event, itemPolicy, itemApplication){
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        _self.modalCreateApplication = {
          mainData:{
            itemApplication: itemApplication
          },
          data: {}
        };
        var vOptModal = nsctrService.fnDefaultModalOptions($scope, {
                          template: '<nsctr-modal-create-application main-data="$ctrl.modalCreateApplication.mainData" data="$ctrl.modalCreateApplication.data"></nsctr-modal-create-application>'
                        });
        vOptModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
          function($scope, $uibModalInstance, $uibModal){
            /*########################
            # fnCloseModal_modalCreateApplication
            ########################*/
            $scope.$on('fnCloseModal_modalCreateApplication', function(event, actionButton) {
              if (actionButton == constants.actionButton.cancel) {
                $uibModalInstance.dismiss('cancel');
              } else {
                $uibModalInstance.close(actionButton);
              }
            });
        }];

        $uibModal.open(vOptModal).result.then(function(actionButton){
          //Action after CloseButton Modal
          _self.fnOpenToggle(itemPolicy);
        },function(){
          //Action after CancelButton Modal
        });
      };

      _self.isProvisional = function(application) {
        var flags = nsctr_constants.lifeLaw.code === _self.module.code
          ? [_self.policy.flgEsProvisionalPension, application.flgEsProvisional]
          : [_self.policy.flgEsProvisionalPension, _self.policy.flgEsProvisionalSalud, application.flgEsProvisional];

        return _.some(flags, function(flag) { return flag === 'S'; });
      };

      _self.showCheckApplication = function(application) {
        var isInProcess = application.state.toUpperCase() === nsctr_constants.state.inProcess.description;

        return !_self.isProvisional(application) && !isInProcess;
      };

      _self.isInProcess = function (state) {
        return state.toUpperCase() === nsctr_constants.state.inProcess.description;
      }

  }]).component('nsctrAccordionPolicy',{
    templateUrl: function($state, $element, $attrs) {
      var currentModule = $state.current.module;
      return '/nsctr/app/common/components/accordion-policy/' + currentModule.prefixState + '.component.html';
    },
    controller: 'nsctrAccordionPolicyController',
    bindings: {
      module: '=',
      user: '=',
      policy: '=',
      checkPolicy: '&',
      checkApplication: '&'
    }
  });
});
