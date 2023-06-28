define(
['constants', 'nsctr_constants'],
function (constants, nsctr_constants) {

  var MODULE_MINING = nsctr_constants.mining;

  var data = [
    {
      module: MODULE_MINING,
      name: 'miningSearchClient',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: ['miningSearchClient'],
      description: MODULE_MINING.description,
      url: '/mining/processes/searchClient',
      parent: 'nsctrContentTemplate',
      params: {
        insured: null
      },
      views: {
        content: {
          template: '<nsctr-search-client></nsctr-search-client>'
        }
      },
      resolver:
        [{
          name: 'miningSearchClient',
          moduleName: 'appNsctr',
          files: [
            'nsctrSearchClientJs'
          ]
        }]
    },
    {
      module: MODULE_MINING,
      name: 'miningClient',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: ['miningSearchClient'],
      description: 'Perfil Cliente',
      url: '/mining/processes/client',
      params: {
        client: null,
        policyNumber: null
      },
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          template: '<nsctr-client></nsctr-client>'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'miningClient',
          moduleName: 'appNsctr',
          files: [
            'nsctrClientJs'
          ]
        }]
    },
    {
      module: MODULE_MINING,
      name: 'miningDeclaration',
      movementType: nsctr_constants.movementType.declaration.code,
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'miningSearchClient',
        {
          nameRoute: 'miningClient',
          nameStateParams: ['client']
        }
      ],
      description: 'Declaración',
      params:{
        step: null
      },
      urls:[
        {
          url: '/mining/processes/client/declaration',
          abstract: true,
          parent: 'nsctrContentTemplate',
          thenRoutes: ['/mining/processes/client/declaration/1'],
          views: {
            content: {
              controller: 'miningDIController',
              templateUrl: '/nsctr/app/mining/common/components/declarationInclusion/template/declaration/declaration.html'
            }
          },
          resolve: {
            rolesPermission: ['nsctrFactoryResolve', 'miningDeclaration', '$stateParams', function(nsctrFactoryResolve, miningDeclaration, $stateParams) {
              return nsctrFactoryResolve.GetRolesPermissionAbleStatus(MODULE_MINING, true);
            }]
          }
        },
        {
          name: 'miningDeclaration.steps',
          url: '/:step',
          params: {
            showRisksList                 : null,
            client                        : null,
            selectedApplicationsPolicies  : null,
            selectedApplications          : null,
            paramsRisksPremium            : null,
            paramsPendingRisksPremium     : null
          },
          templateUrl: function($stateParam) {
            var steps = [undefined,
                '/nsctr/app/mining/common/components/declarationInclusion/template/declaration/declarationS1.html',
                '/nsctr/app/mining/common/components/declarationInclusion/template/declaration/declarationS2.html',
            ];
            return steps[$stateParam.step];
          },
          resolve: {
            locations: ['nsctrFactoryResolve', 'miningDeclaration', '$stateParams', function(nsctrFactoryResolve, miningDeclaration, $stateParams) {
              var vCodEmpresa = ($stateParams.client)
                                  ? $stateParams.client.codEmpresa
                                  : '0';
              return nsctrFactoryResolve.ServicesGetAllLocationsByEnterprise(vCodEmpresa, true);
            }],
            risksList: ['nsctrFactoryResolve', 'miningDeclaration', '$stateParams', function(nsctrFactoryResolve, miningDeclaration, $stateParams) {
              if ($stateParams.step < 2) return nsctrFactoryResolve.Declaration_Step1_GetRisksLists($stateParams.selectedApplications, true);
            }],
            risksPremium: ['nsctrFactoryResolve', 'miningDeclaration', '$stateParams', function(nsctrFactoryResolve, miningDeclaration, $stateParams) {
              if ($stateParams.step > 1) return nsctrFactoryResolve.CSServiceRiskPrimaDeclaracion($stateParams.paramsRisksPremium, $stateParams.paramsPendingRisksPremium, true);
            }]
          },
          controllerProvider: function($stateParams) {
            var steps = [undefined,
              'miningDIS1Controller',
              'miningDIS2Controller'
            ];
            return steps[$stateParams.step];
          }
        }
      ],
      resolver: [{
        name: 'miningDeclaration',
        moduleName: 'appNsctr',
        files: [
          'miningDIS1Controller',
          'miningDIS2Controller',
          'miningDIController',
          'nsctrFactoryResolveJs'
        ]
      }]
    },
    {
      module: MODULE_MINING,
      name: 'miningDeclarationGenerated',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'miningSearchClient',
        {
          nameRoute: 'miningClient',
          nameStateParams: ['client']
        }
      ],
      description: 'Declaración',
      url: '/mining/processes/client/declarationGenerated/:idProof',
      params:{
        client: null
      },
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          template: '<nsctr-summary movement-type=' + nsctr_constants.movementType.declaration.code + '></nsctr-summary>'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'miningDeclarationGenerated',
          moduleName: 'appNsctr',
          files: [
            'nsctrSummaryJs'
          ]
        }]
    },
    {
      module: MODULE_MINING,
      name: 'miningExclusionGenerated',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'miningSearchClient',
        {
          nameRoute: 'miningClient',
          nameStateParams: ['client']
        }
      ],
      description: 'Declaración',
      url: '/mining/processes/client/exclusionGenerated/:idProof',
      params:{
        client: null
      },
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          template: '<nsctr-summary movement-type=' + nsctr_constants.movementType.exclusion.code + '></nsctr-summary>'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'miningExclusionGenerated',
          moduleName: 'appNsctr',
          files: [
            'nsctrSummaryJs'
          ]
        }]
    },
    {
      module: MODULE_MINING,
      name: 'miningInclusion',
      movementType: nsctr_constants.movementType.inclusion.code,
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'miningSearchClient',
        {
          nameRoute: 'miningClient',
          nameStateParams: ['client']
        }
      ],
      description: 'Inclusión de Planilla',
      params:{
        step: null
      },
      urls:[
        {
          url: '/mining/processes/client/inclusion',
          abstract: true,
          parent: 'nsctrContentTemplate',
          thenRoutes: ['/mining/processes/client/inclusion/1'],
          views: {
            content: {
              controller: 'miningDIController',
              templateUrl: '/nsctr/app/mining/common/components/declarationInclusion/template/inclusion/inclusion.html'
            }
          },
          resolve: {
            rolesPermission: ['nsctrFactoryResolve', 'miningInclusion', '$stateParams', function(nsctrFactoryResolve, miningInclusion, $stateParams) {
              return nsctrFactoryResolve.GetRolesPermissionAbleStatus(MODULE_MINING, true);
            }]
          }
        },
        {
          name: 'miningInclusion.steps',
          url: '/:step',
          params: {
            showRisksList                 : null,
            client                        : null,
            selectedApplicationsPolicies  : null,
            selectedApplications          : null,
            paramsRisksPremium            : null
          },
          templateUrl: function($stateParam) {
            var steps = [undefined,
                '/nsctr/app/mining/common/components/declarationInclusion/template/inclusion/inclusionS1.html',
                '/nsctr/app/mining/common/components/declarationInclusion/template/inclusion/inclusionS2.html',
            ];
            return steps[$stateParam.step];
          },
          resolve: {
            locations: ['nsctrFactoryResolve', 'miningInclusion', '$stateParams', function(nsctrFactoryResolve, miningInclusion, $stateParams) {
              var vCodEmpresa = ($stateParams.client)
                                  ? $stateParams.client.codEmpresa
                                  : '0';
              return nsctrFactoryResolve.ServicesGetAllLocationsByEnterprise(vCodEmpresa, true);
            }],
            risksList: ['nsctrFactoryResolve', 'miningInclusion', '$stateParams', function(nsctrFactoryResolve, miningInclusion, $stateParams) {
              if ($stateParams.step < 2) return nsctrFactoryResolve.Declaration_Step1_GetRisksLists($stateParams.selectedApplications, true);
            }],
            risksPremium: ['nsctrFactoryResolve', 'miningInclusion', '$stateParams', function(nsctrFactoryResolve, miningInclusion, $stateParams) {
              if ($stateParams.step > 1) return nsctrFactoryResolve.CSServiceRiskPrimaDeclaracion($stateParams.paramsRisksPremium, null, true);
            }]
          },
          controllerProvider: function($stateParams) {
            var steps = [undefined,
              'miningDIS1Controller',
              'miningDIS2Controller'
            ];
            return steps[$stateParams.step];
          }
        }
      ],
      resolver: [{
        name: 'miningInclusion',
        moduleName: 'appNsctr',
        files: [
          'miningDIS1Controller',
          'miningDIS2Controller',
          'miningDIController',
          'nsctrFactoryResolveJs'
        ]
      }]
    },
    {
      module: MODULE_MINING,
      name: 'miningInclusionGenerated',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'miningSearchClient',
        {
          nameRoute: 'miningClient',
          nameStateParams: ['client']
        }
      ],
      description: 'Inclusión',
      url: '/mining/processes/client/inclusionGenerated/:idProof',
      params:{
        client: null
      },
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          template: '<nsctr-summary movement-type=' + nsctr_constants.movementType.inclusion.code + '></nsctr-summary>'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'miningInclusionGenerated',
          moduleName: 'appNsctr',
          files: [
            'nsctrSummaryJs'
          ]
        }]
    },
    {
      module: MODULE_MINING,
      name: 'miningProofs',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'miningSearchClient',
        {
          nameRoute: 'miningClient',
          nameStateParams: ['client']
        }
      ],
      description: 'Constancias',
      url: '/mining/processes/client/proofs',
      params:{
        client                        : null,
        selectedApplicationsPolicies  : null,
        selectedApplications          : null
      },
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          template: '<nsctr-proofs resolve="{documentTypes: $resolve.documentTypes}""></nsctr-proofs>'
        }
      },
      resolve: {
        documentTypes: ['nsctrFactoryResolve', 'miningProofs', '$stateParams', function(nsctrFactoryResolve, miningProofs, $stateParams){
          return nsctrFactoryResolve.ServicesListDocumentType(nsctr_constants.insured.code, MODULE_MINING.code, false);
        }]
      },
      resolver:
        [{
          name: 'miningProofs',
          moduleName: 'appNsctr',
          files: [
            'nsctrProofsJs',
            'nsctrFactoryResolveJs'
          ]
        }]
    },
    {
      module: MODULE_MINING,
      name: 'miningReplacePayroll',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'miningSearchClient',
        {
          nameRoute: 'miningClient',
          nameStateParams: ['client']
        },
        {
          nameRoute: 'miningProofs',
          nameStateParams: ['client', 'selectedApplicationsPolicies', 'selectedApplications']
        }
      ],
      description: 'Reemplazar Planilla',
      url: '/mining/processes/client/proofs/replacePayroll',
      parent: 'nsctrContentTemplate',
      params:{
        client                        : null,
        selectedApplicationsPolicies  : null,
        selectedApplications          : null,
        paramsReplacePayroll          : null
      },
      views: {
        content: {
          controller: 'miningReplacePayrollController',
          templateUrl: '/nsctr/app/mining/processes/replacePayroll/controller/replacePayroll.html'
        }
      },
      resolve: {
        rolesPermission: ['nsctrFactoryResolve', 'miningReplacePayroll', '$stateParams', function(nsctrFactoryResolve, miningReplacePayroll, $stateParams) {
          return nsctrFactoryResolve.GetRolesPermissionAbleStatus(MODULE_MINING, true);
        }]
      },
      resolver:
        [{
          name: 'miningReplacePayroll',
          moduleName: 'appNsctr',
          files: [
            'miningReplacePayrollController',
            'nsctrFactoryResolveJs'
          ]
        }]
    },
    {
      module: MODULE_MINING,
      name: 'miningEvaluation',
      activeMenu: 'evaluations',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.evaluations.headerName
      },
      breads: ['miningSearchClient'],
      description: 'Evaluaciones',
      url: '/mining/evaluations/evaluation',
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          controller: 'miningEvaluationController',
          templateUrl: '/nsctr/app/mining/evaluations/evaluation/controller/evaluation.html'
        }
      },
      resolve: {
        evaluationDoctors: ['loaderMiningEvaluationController', 'miningEvaluation', function(loaderMiningEvaluationController, miningEvaluation){
          return loaderMiningEvaluationController.getDoctors(true);
        }]
      },
      resolver:
        [{
          name: 'miningEvaluation',
          moduleName: 'appNsctr',
          files: [
            'miningEvaluationController'
          ]
        }]
    },
    {
      module: MODULE_MINING,
      name: 'miningAddEvaluation',
      activeMenu: 'evaluations',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.evaluations.headerName
      },
      breads: ['miningSearchClient'],
      description: 'Agregar evaluación',
      url: '/mining/evaluations/addEvaluation',
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          controller: 'miningAddEvaluationController',
          templateUrl: '/nsctr/app/mining/evaluations/addEvaluation/controller/addEvaluation.html'
        }
      },
      resolve: {
        // addEvaluationDoctors: ['loaderMiningAddEvaluationController', 'miningAddEvaluation', function(loaderMiningAddEvaluationController, miningAddEvaluation){
        //   return loaderMiningAddEvaluationController.getDoctors(true);
        // }]
        addEvaluationLists: ['loaderMiningAddEvaluationController', 'miningAddEvaluation', function(loaderMiningAddEvaluationController, miningAddEvaluation){
          return loaderMiningAddEvaluationController.getLists(true);
        }]
      },
      resolver:
        [{
          name: 'miningAddEvaluation',
          moduleName: 'appNsctr',
          files: [
            'miningAddEvaluationController'
          ]
        }]
    },
    {
      module: MODULE_MINING,
      name: 'miningDetailEvaluation',
      activeMenu: 'evaluations',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.evaluations.headerName
      },
      breads: ['miningSearchClient'],
      description: 'Consulta de evaluación',
      url: '/mining/evaluations/detailEvaluation',
      params: {
        evaluation: null
      },
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          controller: 'miningDetailEvaluationController',
          templateUrl: '/nsctr/app/mining/evaluations/detailEvaluation/controller/detailEvaluation.html'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'miningDetailEvaluation',
          moduleName: 'appNsctr',
          files: [
            'miningDetailEvaluationController'
          ]
        }]
    },
    {
      module: MODULE_MINING,
      name: 'miningSearchInsured',
      activeMenu: 'queries',
      nsctrSecurity: {
        codeObj: {
          dev: nsctr_constants.securityCode.insureds.codeObj.dev,
          prod: nsctr_constants.securityCode.insureds.codeObj.prod
        }
      },
      breads: ['miningSearchClient'],
      description: 'Búsqueda de Asegurados',
      url: '/mining/queries/searchInsured',
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          template: '<nsctr-search-insured></nsctr-search-insured>'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'miningSearchInsured',
          moduleName: 'appNsctr',
          files: [
            'nsctrSearchInsuredJs'
          ]
        }]
    },
    {
      module: MODULE_MINING,
      name: 'miningInsuredMovements',
      activeMenu: 'queries',
      nsctrSecurity: {
        codeObj: {
          dev: nsctr_constants.securityCode.insureds.codeObj.dev,
          prod: nsctr_constants.securityCode.insureds.codeObj.prod
        }
      },
      breads: ['miningSearchClient'],
      description: 'Movimientos del Asegurado',
      url: '/mining/queries/insuredMovements',
      parent: 'nsctrContentTemplate',
      params: {
        insured: null
      },
      views: {
        content: {
          template: '<nsctr-insured-movements></nsctr-insured-movements>'
        }
      },
      resolver:
        [{
          name: 'miningInsuredMovements',
          moduleName: 'appNsctr',
          files: [
            'nsctrInsuredMovementsJs'
          ]
        }]
    },
    {
      module: MODULE_MINING,
      name: 'miningQueriesCensusIndividual',
      activeMenu: 'queries',
      nsctrSecurity: {
        codeObj: {
          dev: nsctr_constants.securityCode.censusIndividual.codeObj.dev,
          prod: nsctr_constants.securityCode.censusIndividual.codeObj.prod
        }
      },
      breads: ['miningSearchClient'],
      description: 'Búsqueda de padrón',
      url: '/mining/queries/census/individual',
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          controller: 'miningQueriesCensusIndividualController',
          templateUrl: '/nsctr/app/mining/queries/census/individual/controller/individual.html'
        }
      },
      resolve: {
        lists: ['loaderMiningQueriesCensusIndividualController', 'miningQueriesCensusIndividual', '$stateParams', function(loaderMiningQueriesCensusIndividualController, miningQueriesCensusIndividual, $stateParams){
          return loaderMiningQueriesCensusIndividualController.getLists(true);
        }]
      },
      resolver:
        [{
          name: 'miningQueriesCensusIndividual',
          moduleName: 'appNsctr',
          files: [
            'miningQueriesCensusIndividualController'
          ]
        }]
    },
    {
      module: MODULE_MINING,
      name: 'miningQueriesCensusMassive',
      activeMenu: 'queries',
      nsctrSecurity: {
        codeObj: {
          dev: nsctr_constants.securityCode.censusMassive.codeObj.dev,
          prod: nsctr_constants.securityCode.censusMassive.codeObj.prod
        }
      },
      breads: ['miningSearchClient'],
      description: 'Búsqueda masiva de padrón',
      url: '/mining/queries/census/massive',
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          controller: 'miningQueriesCensusMassiveController',
          templateUrl: '/nsctr/app/mining/queries/census/massive/controller/massive.html'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'miningQueriesCensusMassive',
          moduleName: 'appNsctr',
          files: [
            'miningQueriesCensusMassiveController'
          ]
        }]
    },
    {
      module: MODULE_MINING,
      name: 'miningSearchProofs',
      activeMenu: 'queries',
      nsctrSecurity: {
        codeObj: {
          dev: nsctr_constants.securityCode.proofs.codeObj.dev,
          prod: nsctr_constants.securityCode.proofs.codeObj.prod
        }
      },
      breads: ['miningSearchClient'],
      description: 'Búsqueda de constancias',
      url: '/mining/queries/searchProofs',
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          template: '<nsctr-search-proofs></nsctr-search-proofs>'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'miningSearchProofs',
          moduleName: 'appNsctr',
          files: [
            'nsctrSearchProofsJs'
          ]
        }]
    },
    {
      module: MODULE_MINING,
      name: 'miningMaintenanceMedic',
      activeMenu: 'maintenance',
      nsctrSecurity: {
        codeObj: {
          dev: nsctr_constants.securityCode.medics.codeObj.dev,
          prod: nsctr_constants.securityCode.medics.codeObj.prod
        }
      },
      breads: ['miningSearchClient'],
      description: 'Médicos',
      url: '/mining/maintenance/maintenanceMedic',
      parent: 'nsctrContentTemplate',
      validationAction:'MANTENIMIENTO_MEDICOS',
      views: {
        content: {
          template: '<mining-maintenance-types type=' + nsctr_constants.medic.code + '></mining-maintenance-types>'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'miningMaintenanceMedic',
          moduleName: 'appNsctr',
          files: [
            'miningMaintenanceTypesJs'
          ]
        }]
    },
    {
      module: MODULE_MINING,
      name: 'miningMaintenanceLocation',
      activeMenu: 'maintenance',
      nsctrSecurity: {
        codeObj: {
          dev: nsctr_constants.securityCode.locations.codeObj.dev,
          prod: nsctr_constants.securityCode.locations.codeObj.prod
        }
      },
      breads: ['miningSearchClient'],
      description: 'Locaciones',
      url: '/mining/maintenance/maintenanceLocation',
      parent: 'nsctrContentTemplate',
      validationAction:'MANTENIMIENTO_LOCACIONES',
      views: {
        content: {
          template: '<mining-maintenance-types type=' + nsctr_constants.location.code + '></mining-maintenance-types>'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'miningMaintenanceLocation',
          moduleName: 'appNsctr',
          files: [
            'miningMaintenanceTypesJs'
          ]
        }]
    },
    {
      module: MODULE_MINING,
      name: 'miningMaintenanceAssignation',
      activeMenu: 'maintenance',
      nsctrSecurity: {
        codeObj: {
          dev: nsctr_constants.securityCode.asignations.codeObj.dev,
          prod: nsctr_constants.securityCode.asignations.codeObj.prod
        }
      },
      breads: ['miningSearchClient'],
      description: 'Asignaciones',
      url: '/mining/maintenance/maintenanceAssignation',
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          controller: 'miningMaintenanceAssignationController',
          templateUrl: '/nsctr/app/mining/maintenance/maintenanceAssignation/controller/maintenanceAssignation.html'
        }
      },
      resolve: {
        // searchClientDocumentTypes: ['loaderNsctrSearchClientController', 'nsctrSearchClient', '$stateParams', function(loaderNsctrSearchClientController, nsctrSearchClient, $stateParams){
        //   return loaderNsctrSearchClientController.getDocumentTypes();
        // }]
      },
      resolver:
        [{
          name: 'miningMaintenanceAssignation',
          moduleName: 'appNsctr',
          files: [
            'miningMaintenanceAssignationController'
          ]
        }]
    },
    {
      module: MODULE_MINING,
      name: 'miningReports',
      activeMenu: 'reports',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.reports.headerName
      },
      breads: ['miningSearchClient'],
      description: 'Reporte de evaluación',
      url: '/mining/reports',
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          controller: 'miningReportsController',
          templateUrl: '/nsctr/app/mining/reports/controller/reports.html'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'miningReports',
          moduleName: 'appNsctr',
          files: [
            'miningReportsController'
          ]
        }]
    }

  ];

  return data;
});
