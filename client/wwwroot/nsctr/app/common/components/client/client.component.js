'use strict';

define([
  'angular', 'constants', 'nsctr_constants', 'lodash',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs',
  'nsctrClientInformationJs',
  'nsctrModalOnboardingJs',
  'nsctrAccordionPolicyController',
  'nsctrFixedResultsJs',
  'nsctrProofsSearcherJs',
  'nsctrSearchedProofsJs',
  'nsctrApplicationFactory',
], function(angular, constants, nsctr_constants, _){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrClientController',
    ['$rootScope', '$scope', 'mainServices', 'nsctrFactory', 'nsctrService', 'nsctrRoles', '$stateParams',
    '$state', '$timeout', '$window', '$uibModal', 'mModalAlert', 'nsctrApplicationFactory', 'gaService',
    function($rootScope, $scope, mainServices, nsctrFactory, nsctrService, nsctrRoles, $stateParams,
    $state, $timeout, $window, $uibModal, mModalAlert, nsctrApplicationFactory, gaService){
      /*########################
      # _self
      ########################*/
      var _self = this;
      _self.noResultMessage =  "No hay pólizas del mes actual o mes futuro para gestionar.";

      /*########################
      # _setPolicyNumber
      ########################*/
      function _setPolicyNumber(policyNumber) {
        _self.tabPolicies.mNroPoliza = policyNumber || '';
        _self.tabProofs.mNroPolizaPT = policyNumber || '';
      }

      /*########################
      # _searchPolicies
      ########################*/
      function _paramSearchPolicies() {
        var vParams = {
          NSCTRSystemType:      _self.MODULE.code,
          clientDocumentNumber: _self.STATE_PARAMS['client'].documentNumber,
          clientDocumentType:   _self.STATE_PARAMS['client'].documentType,
          agentId:              _self.STATE_PARAMS['client'].agentId,
          policyNumber:         _self.tabPolicies.mNroPoliza || '',
          insuredCollective:    '',
          rowByPage:            '10',
          orderBy:              '',
          currentPage:          _self.tabPolicies.mPagination.currentPage
        };

        return vParams;
      }

      function _searchPolicies(firstTime) {
        firstTime = firstTime || false;
        var vParams = _paramSearchPolicies();
        nsctrFactory.common.proxyPolicy.ServicesPoliciesCompleteByClient(vParams, true).then(function(response) {
          if (response.operationCode === constants.operationCode.success && response.data && response.data.length) {
            _self.tabPolicies.dataList.setDataList(response.data, response.data.length);
            _self.tabPolicies.mPagination.setTotalItems(_self.tabPolicies.dataList.totalItemsPagination);
          }else{
            (firstTime) ? _self.tabPolicies.noPolicies = true : _self.tabPolicies.noResultFilter.setNoResult(true);
            _self.noResultMessage = response.message;
          }
        }).catch(function() {
          (firstTime) ? _self.tabPolicies.noPolicies = true : _self.tabPolicies.noResultFilter.setNoResult(true);
          _self.noResultMessage = response.message;
        });
      }

      /*########################
      # _tabSelected - clickTab - tabActive
      ########################*/
      function _initTabPolicies(){
        _self.tabPolicies.noResultFilter = new nsctrFactory.object.oNoResultFilter();
        _self.tabPolicies.dataList = new nsctrFactory.object.oDataList(constants.paginationType.front);
        _self.tabPolicies.mPagination = new nsctrFactory.object.oPagination();
        _clearFixedResults();
        _searchPolicies(_self.tabPolicies.firstTime);
        _self.tabPolicies.firstTime = false;
        _self.tabPolicies.noPolicies = false;
      }

      function _initTabProofs(){
        _self.tabProofs.firstTime = false;
        _self.tabProofs.activeTab = 1;
        $timeout(function() {
          $rootScope.$broadcast('fnSearchProofs_proofsSearcher', false);
        }, 0);

        var textToAnalytics = nsctrService.fnSearchUrlforGoogleAnalytics();

        var appCode = window.localStorage['appOrigin'] ? window.localStorage['appOrigin'] : 'OIM'
        gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + ' - Pestaña Constancias', gaLabel: 'Botón: Constancias', gaValue: 'Periodo Regular' });
      }

      function _tabSelected(activeTab){
        switch (activeTab){
          case 0:
            _initTabPolicies();
            break;
          case 1:
            _initTabProofs();
            break;
        }
      }

      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function() {
        _self.data = _self.data || {};
        _self.tabPolicies = _self.tabPolicies || {};
        _self.tabProofs = _self.tabProofs || {};

        _self.MODULE = $state.current.module;
        _self.IS_MODULE = nsctrService.fnIsModule(_self.MODULE);
        _self.VALID_PAGE = nsctrService.fnValidatePage();

        var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+_self.MODULE.appCode)), "PROCESOS_ACCIONES", "nombreCabecera");
        _self.segurityOmboarding = nsctrFactory.validation._filterData(segurity.items, "MODAL_ONBOARDING", "nombreCorto");
        _self.seguritySearch = nsctrFactory.validation._filterData(segurity.items, "BUSCAR_POLIZA", "nombreCorto");

        if (_self.VALID_PAGE){

          _self.STATE_PARAMS = new nsctrFactory.object.oStateParams();
          _self.USER = new nsctrFactory.object.oUser();

          _self.data.activeTabSelected = 0;
          _self.tabPolicies.firstTime = true;
          _self.tabProofs.firstTime = true;

          _setPolicyNumber($stateParams['policyNumber']);
          _tabSelected(_self.data.activeTabSelected);
        }else{
          var vStateName = _self.MODULE.prefixState + 'SearchClient';
          $state.go(vStateName, {});
        }
      };

      /*########################
      # fnGoBack
      ########################*/
      _self.fnGoBack = function() {
        var vStateName = _self.MODULE.prefixState + 'SearchClient';
        $state.go(vStateName, {});
      };

      /*########################
      # fnTabSelected - clickTab - tabActive
      ########################*/
      _self.fnTabSelected = function(activeTab) {
        if (_self.tabPolicies.firstTime || _self.tabProofs.firstTime) _tabSelected(activeTab);
      };

      /*########################
      # fnShowOnboarding
      ########################*/
      function _onboarding() {
        var vSliders = {
          firstSlider: [
            {
              image: '/images/nsctr/onboarding/declarationInclusion/01.jpg',
              title: 'Proceso de Declaración e Inclusión',
              description: 'Busca la póliza con la que quieres trabajar y dale click al botón que se encuentra a la derecha para ver las aplicaciones que tiene.'
            },
            {
              image: '/images/nsctr/onboarding/declarationInclusion/02.jpg',
              title: 'Proceso de Declaración e Inclusión',
              description: 'Desde el detalle de la póliza selecciona las aplicaciones con las que quieras realizar la constancia.'
            },
            {
              image: '/images/nsctr/onboarding/declarationInclusion/03.jpg',
              title: 'Proceso de Declaración e Inclusión',
              description: 'En la parte inferior de la página aparecerá un detalle con las aplicaciones que hayas seleccionado y al expandirlo podrás ver las opciones de declarar e incluir.'
            }
          ],
          secondSlider: [
            {
              image: '/images/nsctr/onboarding/manualProof/01.jpg',
              title: 'Proceso de Constancia Manual',
              description: 'Busca la póliza con la que quieres trabajar y selecciónala con un check.'
            },
            {
              image: '/images/nsctr/onboarding/manualProof/02.jpg',
              title: 'Proceso de Constancia Manual',
              description: 'En la parte inferior de la página aparecerá un detalle con las pólizas que hayas seleccionado y al expandirlo podrás ver la opción para generar la constancia manual.'
            }
          ]
        };
        return vSliders;
      }

      _self.fnShowOnboarding = function() {
        _self.onboarding = _onboarding();
        var vOptModal = nsctrService.fnDefaultModalOptions(
                        $scope, {
                          size: 'lg',
                          template: '<nsctr-modal-onboarding first-slider="$ctrl.onboarding.firstSlider" second-slider="$ctrl.onboarding.secondSlider"></nsctr-modal-onboarding>'
                        });
        vOptModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
          function($scope, $uibModalInstance, $uibModal){
            /*########################
            # fnCloseModalOnboarding
            ########################*/
            $scope.$on('fnCloseModalOnboarding', function() {
              $uibModalInstance.close();
            });
        }];

        $uibModal.open(vOptModal);
      };

      /*########################
      # fnDownloadPayroll
      ########################*/
      _self.fnDownloadPayroll = function(){
        nsctrFactory.common.proxyLookupFiles.CSServicesTemplateExcel(_self.MODULE).then(function(data){
					mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
				});
      };

      /*########################
      # fnSearchPolicies / fnClearSearchPolicies
      ########################*/
      function _clearPoliciesSearcher() {
        _self.tabPolicies.mNroPoliza = '';
      }

      function _clearSearchedPolicies(){
        _self.tabPolicies.noResultFilter.setNoResultFilter(false, false);
        _self.tabPolicies.dataList.setDataList();
        _self.tabPolicies.mPagination.setCurrentPage(1);
        _self.tabPolicies.mPagination.setTotalItems(0);
      }

      function _clearFixedResults() {
        _self.tabPolicies.selectedPolicies = [];
        _self.tabPolicies.selectedApplications = [];
        nsctrApplicationFactory.setSelectedApplications(_self.tabPolicies.selectedApplications);
        _self.tabPolicies.selectedApplicationsPolicies = {};
        _self.tabPolicies.applicationActionButtons = [];
        _self.tabPolicies.openToggleSelectedPolicies = false;
        _self.tabPolicies.openToggleSelectedApplications = false;
      }

      _self.fnSearchPolicies = function() {
        _clearSearchedPolicies();
        _clearFixedResults();
        _searchPolicies();
      };

      _self.fnClearSearchPolicies = function() {
        _clearPoliciesSearcher();
        _clearSearchedPolicies();
        _clearFixedResults();
        _searchPolicies();
      };

      /*########################
      # fnChangePage
      ########################*/
      function _closeTogglePolicies(){
        angular.forEach(_self.tabPolicies.dataList.list, function(fv, fk){
          fv.openToggle = false;
        });
      }
      _self.fnChangePage = function(){
        _closeTogglePolicies();
        _self.tabPolicies.dataList.setDataListByPage(_self.tabPolicies.mPagination.currentPage);
      };

      /*########################
      # fnCheckPolicy
      ########################*/
      function _validateCheckPolicy(itemPolicy, selectedPolicies) {
        var vValidate = !selectedPolicies.length;

        if (selectedPolicies.length > 0 && selectedPolicies.length < 2) {
          var vPensionItemPolicy = itemPolicy.pensionPolicyNumber !== null,
              vHealthItemPolicy = itemPolicy.healthPolicyNumber !== null;
          vValidate = !!_.find(selectedPolicies, function(value1, key1) {
            var vPensionSelectedPolicies = value1.pensionPolicyNumber !== null,
                vHealthSelectedPolicies = value1.healthPolicyNumber !== null;

            return vPensionItemPolicy !== vPensionSelectedPolicies &&
                    vHealthItemPolicy !== vHealthSelectedPolicies;
          });
        }

        return vValidate;
      }

      function _addSelectedPolicies(itemPolicy) {
        var vItemPolicy = angular.copy(itemPolicy);
        _self.tabPolicies.selectedPolicies.push(vItemPolicy);
      }

      function _removeSelectedPolicies(itemPolicy, isFixedResults) {
        var vIndex = _.findIndex(_self.tabPolicies.selectedPolicies, function(fv, fk) {
            return fv.index === itemPolicy.index;
          });

        if (vIndex !== -1) {
          if (isFixedResults) {
            _self.tabPolicies.dataList.allList[itemPolicy.index].mCheckPolicy = false;
          }
          _self.tabPolicies.selectedPolicies.splice(vIndex, 1);
          _self.tabPolicies.openToggleSelectedPolicies = !!_self.tabPolicies.selectedPolicies.length;
        }
      }

      _self.fnCheckPolicy = function(itemPolicy) {
        if (!_self.tabPolicies.selectedApplications.length) {
          itemPolicy.mCheckPolicy = _validateCheckPolicy(itemPolicy, _self.tabPolicies.selectedPolicies);
          if (itemPolicy.mCheckPolicy) {
            _addSelectedPolicies(itemPolicy);
          } else {
            _removeSelectedPolicies(itemPolicy);
          }
        } else {
          mModalAlert.showWarning('Para continuar debes seleccionar otra aplicación', '');
        }
      };

      _self.fnRemoveSelectedPolicies = function(itemPolicy) {
        _removeSelectedPolicies(itemPolicy, true);
      };

      /*########################
      # fnCheckApplication
      ########################*/
      function _validateCheckApplications(itemApplication, applications, selectedApplications) {
        var vValidate = !selectedApplications.length;

        if (vValidate) {
          itemApplication.mCheckApplication = true;
          if (!_self.IS_MODULE.lifeLaw && applications.length <= 2) {
            var index = _.findIndex(applications, function(fv, fk){
              return fv.applicationType !== itemApplication.applicationType;
            });
            if (index !== -1) { applications[index].mCheckApplication = true; }
          }
        } else if (selectedApplications.length < 2) {
          vValidate = !!_.find(selectedApplications, function(fv, fk) {
            return itemApplication.applicationType !== fv.applicationType;
          });
          itemApplication.mCheckApplication = vValidate;
        }

        return vValidate;
      }

      function _omitSelectedApplicationsPoliciesFields(firstValue, secondValue) {
        var vOmitFields = (!firstValue || !secondValue)
                            ? (!firstValue)
                              ? ['pensionPolicyNumber', 'pensionRiskList', 'pensionRisks']
                              : ['healthPolicyNumber', 'healthRiskList', 'healthRisks']
                            : [];

        return vOmitFields;
      }

      function _addSelectedApplications(itemApplication, applications) {
        var vApplications = angular.copy(applications);
        if (_self.tabPolicies.selectedApplications.length) {
          angular.forEach(vApplications, function(fv, fk) {
            if (fv.mCheckApplication && fv.applicationType === itemApplication.applicationType) {
              _self.tabPolicies.selectedApplications.push(fv);
            }
          });
        } else {
          _self.tabPolicies.selectedApplications = _.filter(vApplications, function(fv) {
            return fv.mCheckApplication;
          });
        }
        nsctrApplicationFactory.setSelectedApplications(_self.tabPolicies.selectedApplications);
        _setApplicationActionButtons(_self.tabPolicies.selectedApplications);
      }

      function _removeSelectedApplications(itemApplication){
        var vIndex = _.findIndex(_self.tabPolicies.selectedApplications, function(fv, fk) {
          return fv.policyIndex === itemApplication.policyIndex &&
                  fv.applicationsIndex === itemApplication.applicationsIndex &&
                  fv.index === itemApplication.index;
        });
        if (vIndex !== -1) {
          _self.tabPolicies.selectedApplications.splice(vIndex, 1);
          nsctrApplicationFactory.setSelectedApplications(_self.tabPolicies.selectedApplications);
          _removeSelectedApplicationsPolicies(_self.tabPolicies.selectedApplications);
          _setApplicationActionButtons(_self.tabPolicies.selectedApplications);
        }
      }

      function _addSelectedApplicationsPolicies(itemPolicy) {
        var vOmit = _omitSelectedApplicationsPoliciesFields(itemPolicy.pensionPolicyNumber, itemPolicy.healthPolicyNumber);
        _self.tabPolicies.selectedApplicationsPolicies = _.merge({}, _self.tabPolicies.selectedApplicationsPolicies, _.omit(itemPolicy, vOmit));
      }

      function _removeSelectedApplicationsPolicies(selectedApplications){
        if (!selectedApplications.length) {
          _self.tabPolicies.selectedApplicationsPolicies = {};
          _self.tabPolicies.openToggleSelectedApplications = !!selectedApplications.length;
        } else {
          var vOmit = _omitSelectedApplicationsPoliciesFields(selectedApplications[0].applicationType === 'P', selectedApplications[0].applicationType === 'S');
          _self.tabPolicies.selectedApplicationsPolicies = _.omit(_self.tabPolicies.selectedApplicationsPolicies, vOmit);
        }
      }

      function _setApplicationActionButtons(selectedApplications) {
        if (selectedApplications.length) {
          var vMOVEMENT_TYPE = nsctr_constants.movementType;
          var actionButtons = [
            {
              actionButton: vMOVEMENT_TYPE.proof.operationType,
              description: 'Planilla',
              attribute: 'showPlanilla'
            },
            {
              actionButton: vMOVEMENT_TYPE.declaration.operationType,
              description: 'Declarar',
              attribute: 'showDeclaration'
            },
            {
              actionButton: vMOVEMENT_TYPE.inclusion.operationType,
              description: 'Incluir',
              attribute: 'showInclusion'
            }
          ];
          _self.tabPolicies.applicationActionButtons = actionButtons.filter(function(fv, fk) {
            var vShowButton = selectedApplications.reduce(function(previous, current, index, array) {
              previous[fv.attribute] = (angular.isUndefined(previous[fv.attribute]))
                                          ? (current[fv.attribute] === nsctr_constants.flag.true)
                                          : (previous[fv.attribute] || current[fv.attribute] === nsctr_constants.flag.true);
              return previous;
            }, {});
            return vShowButton[fv.attribute];
          });
        }
      }

      _self.fnCheckApplication = function(itemApplication, applications, itemPolicy) {
        if (!_self.tabPolicies.selectedPolicies.length) {
          var vCheckApplication = _validateCheckApplications(itemApplication, applications, _self.tabPolicies.selectedApplications);
          if (vCheckApplication) {
            _addSelectedApplicationsPolicies(itemPolicy);
            _addSelectedApplications(itemApplication, applications);
          } else {
            itemApplication.mCheckApplication = vCheckApplication;
            _removeSelectedApplications(itemApplication);
          }
        } else {
          mModalAlert.showWarning('Para continuar debes seleccionar otra póliza', '');
        }
      };

      _self.fnRemoveSelectedApplications = function(itemApplication) {
        var vItemApplication = _.find(nsctrApplicationFactory.getApplications(), function(fv, fk) {
          return !!_.find(fv.applications, function(sv, sk) {
            return sv.policyIndex === itemApplication.policyIndex &&
                    sv.applicationsIndex === itemApplication.applicationsIndex &&
                    sv.index === itemApplication.index;
          });
        });
        if (vItemApplication) {
          vItemApplication.applications[itemApplication.index].mCheckApplication = false;
        }
        _removeSelectedApplications(itemApplication);
      };

  }]).component('nsctrClient',{
    templateUrl: '/nsctr/app/common/components/client/client.component.html',
    controller: 'nsctrClientController',
    bindings: {
      data: '=?'
    }
  });
});