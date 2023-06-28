(function (factory) {
  define(factory);
})(function () {

  function _assign(arrayObj) {
    var vAssign = {};
    for (var i = 0; i < arrayObj.length; i++) {
      var vValue = arrayObj[i];
      for (var item in vValue) {
        vAssign[item] = vValue[item];
      }
    }
    return vAssign;
  }

  var vLibNsctr = {
    //nsctr_constants
    "nsctr_constants": {
      name: 'nsctr_constants',
      path: '/nsctr/app/common/constant/nsctr.constants'
    },
    //routes
    "nsctr_routes": {
      name: 'nsctr_routes',
      path: '/nsctr/app/app.routes'
    },
    //app
    'appNsctr': {
      name: 'appNsctr',
      path: '/nsctr/app/app'
    },
    //proxy
    'proxyNsctr': {
      name: 'proxyNsctr',
      path: '/nsctr/app/proxy/serviceNsctr'
    },
    //nsctrSecurity
    'nsctr_security': {
      name: 'nsctr_security',
      path: '/nsctr/app/common/security/nsctr.security'
    },
    //nsctrFactory
    'nsctrFactoryJs': {
      name: 'nsctrFactoryJs',
      path: '/nsctr/app/common/factory/nsctrFactory'
    },
    //nsctrFactoryService
    'nsctrFactoryServiceJs': {
      name: 'nsctrFactoryServiceJs',
      path: '/nsctr/app/common/factory/nsctrFactoryService'
    },
    //objectFactory
    'objectFactoryJs': {
      name: 'objectFactoryJs',
      path: '/nsctr/app/common/factory/objectFactory'
    },
    //nsctrFactoryResolve
    'nsctrFactoryResolveJs': {
      name: 'nsctrFactoryResolveJs',
      path: '/nsctr/app/common/factory/nsctrFactoryResolve'
    },
    //menuFactory
    'menuFactoryJs': {
      name: 'menuFactoryJs',
      path: '/nsctr/app/common/factory/menuFactory'
    },
    //commonFactory
    'commonFactoryJs': {
      name: 'commonFactoryJs',
      path: '/nsctr/app/common/factory/commonFactory'
    },
    'validationActionFactoryJs': {
      name: 'validationActionFactoryJs',
      path: '/nsctr/app/common/factory/validationActionFactory'
    },
    //nsctrService
    'nsctrServiceJs': {
      name: 'nsctrServiceJs',
      path: '/nsctr/app/common/service/nsctrService'
    },
    //nsctrRoles
    'nsctrRolesJs': {
      name: 'nsctrRolesJs',
      path: '/nsctr/app/common/constant/nsctrRoles'
    },
    'nsctrApplicationFactory': {
      name: 'nsctrApplicationFactory',
      path: '/nsctr/app/common/factory/application.factory'
    },
    //components
    'nsctrContentTemplateJs': {
      name: 'nsctrContentTemplateJs',
      path: '/nsctr/app/common/components/contentTemplate/contentTemplate.component'
    },
    'nsctrHorizontalMenuJs': {
      name: 'nsctrHorizontalMenuJs',
      path: '/nsctr/app/common/components/horizontalMenu/horizontalMenu.component'
    },
    'nsctrColFilterJs': {
      name: 'nsctrColFilterJs',
      path: '/nsctr/app/common/components/colFilter/colFilter.component'
    },
    'nsctrAccordionPolicyController': {
      name: 'nsctrAccordionPolicyController',
      path: '/nsctr/app/common/components/accordion-policy/accordion-policy.component'
    },
    'nsctrNoResultFilterJs': {
      name: 'nsctrNoResultFilterJs',
      path: '/nsctr/app/common/components/noResultFilter/noResultFilter.component'
    },
    'nsctrModalOnboardingJs': {
      name: 'nsctrModalOnboardingJs',
      path: '/nsctr/app/common/components/modalOnboarding/modalOnboarding.component'
    },
    'nsctrProofsSearcherJs': {
      name: 'nsctrProofsSearcherJs',
      path: '/nsctr/app/common/components/proofsSearcher/proofsSearcher.component'
    },
    'nsctrSearchedProofsJs': {
      name: 'nsctrSearchedProofsJs',
      path: '/nsctr/app/common/components/searchedProofs/searchedProofs.component'
    },
    'nsctrModalCreateApplicationJs': {
      name: 'nsctrModalCreateApplicationJs',
      path: '/nsctr/app/common/components/modalCreateApplication/modalCreateApplication.component'
    },
    'nsctrModalSendEmailFilesJs': {
      name: 'nsctrModalSendEmailFilesJs',
      path: '/nsctr/app/common/components/modalSendEmailFiles/modalSendEmailFiles.component'
    },
    'nsctrSearchInsuredJs': {
      name: 'nsctrSearchInsuredJs',
      path: '/nsctr/app/common/components/searchInsured/searchInsured.component'
    },
    'nsctrInsuredMovementsJs': {
      name: 'nsctrInsuredMovementsJs',
      path: '/nsctr/app/common/components/insuredMovements/insuredMovements.component'
    },
    'nsctrModalInsuredJs': {
      name: 'nsctrModalInsuredJs',
      path: '/nsctr/app/common/components/modalInsured/modalInsured.component'
    },
    'nsctrSearchedPoliciesJs': {
      name: 'nsctrSearchedPoliciesJs',
      path: '/nsctr/app/common/components/searchedPolicies/searchedPolicies.component'
    },
    'nsctrModalHistoryJs': {
      name: 'nsctrModalHistoryJs',
      path: '/nsctr/app/common/components/modalHistory/modalHistory.component'
    },
    'nsctrFixedResultsJs': {
      name: 'nsctrFixedResultsJs',
      path: '/nsctr/app/common/components/fixedResults/fixedResults.component'
    },
    'nsctrModalManualProofJs': {
      name: 'nsctrModalManualProofJs',
      path: '/nsctr/app/common/components/modalManualProof/modalManualProof.component'
    },
    'nsctrSearchProofsJs': {
      name: 'nsctrSearchProofsJs',
      path: '/nsctr/app/common/components/searchProofs/searchProofs.component'
    },
    'nsctrSearchClientJs': {
      name: 'nsctrSearchClientJs',
      path: '/nsctr/app/common/components/searchClient/searchClient.component'
    },
    'nsctrSummaryJs': {
      name: 'nsctrSummaryJs',
      path: '/nsctr/app/common/components/summary/summary.component'
    },
    'nsctrClientInformationJs': {
      name: 'nsctrClientInformationJs',
      path: '/nsctr/app/common/components/clientInformation/clientInformation.component'
    },
    'nsctrSearchProvisionalCoverageJs': {
      name: 'nsctrSearchProvisionalCoverageJs',
      path: '/nsctr/app/common/components/searchProvisionalCoverage/searchProvisionalCoverage.component'
    },
    'nsctProvisionalCoverageJs': {
      name: 'nsctProvisionalCoverageJs',
      path: '/nsctr/app/common/components/provisionalCoverage/provisionalCoverage.component'
    },
    'nsctrModalReniecListJs': {
      name: 'nsctrModalReniecListJs',
      path: '/nsctr/app/common/components/modalReniecList/modalReniecList.component'
    },
    'nsctrModalReniecListRejectJs': {
      name: 'nsctrModalReniecListRejectJs',
      path: '/nsctr/app/common/components/modalReniecListReject/modalReniecListReject.component'
    },
    'nsctrClientJs': {
      name: 'nsctrClientJs',
      path: '/nsctr/app/common/components/client/client.component'
    },
    'nsctrProofsJs': {
      name: 'nsctrProofsJs',
      path: '/nsctr/app/common/components/proofs/proofs.component'
    },
    'nsctrModalGenerateProofJs': {
      name: 'nsctrModalGenerateProofJs',
      path: '/nsctr/app/common/components/proofs/modalGenerateProof/modalGenerateProof.component'
    },
    'nsctrTypeLoadJs': {
      name: 'nsctrTypeLoadJs',
      path: '/nsctr/app/common/components/typeLoad/typeLoad.component'
    },
    'nsctrWorkersList': {
      name: 'nsctrWorkersList',
      path: '/nsctr/app/common/components/workersList/workersList.component'
    },
    'nsctrRiskPremiumTableJs': {
      name: 'nsctrRiskPremiumTableJs',
      path: '/nsctr/app/common/components/riskPremiumTable/riskPremiumTable.component'
    },
    'nsctrPendingRiskPremiumTableJs': {
      name: 'nsctrPendingRiskPremiumTableJs',
      path: '/nsctr/app/common/components/pendingRiskPremiumTable/pendingRiskPremiumTable.component'
    },
    'nsctrDIController': {
      name: 'nsctrDIController',
      path: '/nsctr/app/common/components/declarationInclusion/declarationInclusion'
    },
    'nsctrDIS2Controller': {
      name: 'nsctrDIS2Controller',
      path: '/nsctr/app/common/components/declarationInclusion/declarationInclusionS2'
    },
    //pages
    'nsctrHomeController': {
      name: 'nsctrHomeController',
      path: '/nsctr/app/home/controller/home'
    }
  };


  var vLibRegular = {
    //routes
    "regular_routes": {
      name: 'regular_routes',
      path: '/nsctr/app/regular/app.routes'
    },
    //common
    'regularFactoryJs': {
      name: 'regularFactoryJs',
      path: '/nsctr/app/regular/common/factory/factory'
    },
    //processes
    'regularDeclarationS1Controller': {
      name: 'regularDeclarationS1Controller',
      path: '/nsctr/app/regular/processes/declaration/controller/declarationS1'
    },
    'regularInclusionS1Controller': {
      name: 'regularInclusionS1Controller',
      path: '/nsctr/app/regular/processes/inclusion/controller/inclusionS1'
    },
    'regularReplacePayrollController': {
      name: 'regularReplacePayrollController',
      path: '/nsctr/app/regular/processes/replacePayroll/controller/replacePayroll'
    },
    classApplicationStateFilter: {
      name: 'classApplicationStateFilter',
      path: '/nsctr/app/common/filters/class-application-state.filter'
    }
  };


  var vLibMining = {
    //routes
    "mining_routes": {
      name: 'mining_routes',
      path: '/nsctr/app/mining/app.routes'
    },
    //common
    'miningFactoryJs': {
      name: 'miningFactoryJs',
      path: '/nsctr/app/mining/common/factory/factory'
    },
    //components
    'miningDIController': {
      name: 'miningDIController',
      path: '/nsctr/app/mining/common/components/declarationInclusion/declarationInclusion'
    },
    'miningDIS1Controller': {
      name: 'miningDIS1Controller',
      path: '/nsctr/app/mining/common/components/declarationInclusion/declarationInclusionS1'
    },
    'miningDIS2Controller': {
      name: 'miningDIS2Controller',
      path: '/nsctr/app/mining/common/components/declarationInclusion/declarationInclusionS2'
    },
    'miningModalWorkerDataJs': {
      name: 'miningModalWorkerDataJs',
      path: '/nsctr/app/mining/common/components/modalWorkerData/modalWorkerData.component'
    },
    'miningMaintenanceTypesJs': {
      name: 'miningMaintenanceTypesJs',
      path: '/nsctr/app/mining/common/components/maintenanceTypes/maintenanceTypes.component'
    },
    'miningModalMaintenanceJs': {
      name: 'miningModalMaintenanceJs',
      path: '/nsctr/app/mining/common/components/maintenanceTypes/modalMaintenance/modalMaintenance.component'
    },
    'miningCheckFilterJs': {
      name: 'miningCheckFilterJs',
      path: '/nsctr/app/mining/common/components/checkFilter/checkFilter.component'
    },
    'miningTypeRegisterJs': {
      name: 'miningTypeRegisterJs',
      path: '/nsctr/app/mining/common/components/typeRegister/typeRegister.component'
    },
    'miningSearchPopupJs': {
      name: 'miningSearchPopupJs',
      path: '/nsctr/app/mining/common/components/searchPopup/searchPopup.component'
    },
    'miningSearchedCensusJs': {
      name: 'miningSearchedCensusJs',
      path: '/nsctr/app/mining/common/components/searchedCensus/searchedCensus.component'
    },
    'miningModalUpdateIndividualCensusJs': {
      name: 'miningModalUpdateIndividualCensusJs',
      path: '/nsctr/app/mining/common/components/modalUpdateIndividualCensus/modalUpdateIndividualCensus.component'
    },
    //processes
    'miningReplacePayrollController': {
      name: 'miningReplacePayrollController',
      path: '/nsctr/app/mining/processes/replacePayroll/controller/replacePayroll'
    },
    //evaluations
    'miningEvaluationController': {
      name: 'miningEvaluationController',
      path: '/nsctr/app/mining/evaluations/evaluation/controller/evaluation'
    },
    'miningAddEvaluationController': {
      name: 'miningAddEvaluationController',
      path: '/nsctr/app/mining/evaluations/addEvaluation/controller/addEvaluation'
    },
    'miningDetailEvaluationController': {
      name: 'miningDetailEvaluationController',
      path: '/nsctr/app/mining/evaluations/detailEvaluation/controller/detailEvaluation'
    },
    //queries
    'miningQueriesCensusIndividualController': {
      name: 'miningQueriesCensusIndividualController',
      path: '/nsctr/app/mining/queries/census/individual/controller/individual'
    },
    'miningQueriesCensusMassiveController': {
      name: 'miningQueriesCensusMassiveController',
      path: '/nsctr/app/mining/queries/census/massive/controller/massive'
    },
    //maintenance
    'miningMaintenanceAssignationController': {
      name: 'miningMaintenanceAssignationController',
      path: '/nsctr/app/mining/maintenance/maintenanceAssignation/controller/maintenanceAssignation'
    },
    //reports
    'miningReportsController': {
      name: 'miningReportsController',
      path: '/nsctr/app/mining/reports/controller/reports'
    }
  };


  var vLibLifeLaw = {
    //routes
    "lifeLaw_routes": {
      name: 'lifeLaw_routes',
      path: '/nsctr/app/lifeLaw/app.routes'
    },
    //common
    'lifeLawFactoryJs': {
      name: 'lifeLawFactoryJs',
      path: '/nsctr/app/lifeLaw/common/factory/factory'
    },
    //processes
    'lifeLawDeclarationS1Controller': {
      name: 'lifeLawDeclarationS1Controller',
      path: '/nsctr/app/lifeLaw/processes/declaration/controller/declarationS1'
    },
    'lifeLawInclusionS1Controller': {
      name: 'lifeLawInclusionS1Controller',
      path: '/nsctr/app/lifeLaw/processes/inclusion/controller/inclusionS1'
    },
    'lifeLawReplacePayrollController': {
      name: 'lifeLawReplacePayrollController',
      path: '/nsctr/app/lifeLaw/processes/replacePayroll/controller/replacePayroll'
    }
  };

  var vLib = _assign([vLibNsctr, vLibRegular, vLibMining, vLibLifeLaw]);

  return {
    lib: vLib,
    shim: {
      'appNsctr': {
        deps: [
          'angular_ui_route',
          'uIBootstrap',
          'oim_ocLazyLoad',
          'oim_layout',
          'lodash',
          'proxyNsctr',
          'proxyLogin',
          'oim_security',
          'wrap_gaia',
          'nsctr_security'
        ]
      },
      'nsctrFactoryJs': {
        deps: [
          'menuFactoryJs',
          'commonFactoryJs',
          'regularFactoryJs',
          'miningFactoryJs',
          'lifeLawFactoryJs',
          'objectFactoryJs'
        ]
      },
      'nsctrFactoryResolveJs': {
        deps: [
          'nsctrFactoryJs'
        ]
      },
      'proxyNsctr': {
        deps: ['wrap_gaia']
      }
    },
    packages: {

    }
  };

});
