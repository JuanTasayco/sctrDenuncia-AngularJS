define(
['constants', 'nsctr_constants'],
function (constants, nsctr_constants) {

  var MODULE_LIFE_LAW = nsctr_constants.lifeLaw;

  var data = [
    {
      module: MODULE_LIFE_LAW,
      name: 'lifeLawSearchClient',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: ['lifeLawSearchClient'],
      description: MODULE_LIFE_LAW.description,
      url: '/lifeLaw/processes/searchClient',
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
          name: 'lifeLawSearchClient',
          moduleName: 'appNsctr',
          files: [
            'nsctrSearchClientJs'
          ]
        }]
    },
    {
      module: MODULE_LIFE_LAW,
      name: 'lifeLawClient',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: ['lifeLawSearchClient'],
      description: 'Perfil Cliente',
      url: '/lifeLaw/processes/client',
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
          name: 'lifeLawClient',
          moduleName: 'appNsctr',
          files: [
            'nsctrClientJs'
          ]
        }]
    },
    {
      module: MODULE_LIFE_LAW,
      name: 'lifeLawDeclaration',
      movementType: nsctr_constants.movementType.declaration.code,
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'lifeLawSearchClient',
        {
          nameRoute: 'lifeLawClient',
          nameStateParams: ['client']
        }
      ],
      description: 'Declaración',
      params:{
        step: null
      },
      urls:[
        {
          url: '/lifeLaw/processes/client/declaration',
          abstract: true,
          parent: 'nsctrContentTemplate',
          thenRoutes: ['/lifeLaw/processes/client/declaration/1'],
          views: {
            content: {
              controller: 'nsctrDIController',
              templateUrl: '/nsctr/app/common/components/declarationInclusion/template/declaration/declaration.html'
            }
          },
          resolve: {}
        },
        {
          name: 'lifeLawDeclaration.steps',
          url: '/:step',
          params: {
            showRisksList             : null,
            selectedApplicationsPolicies: null,
            client                    : null,
            selectedApplications      : null,
            paramsRisksPremium        : null,
            paramsPendingRisksPremium : null
          },
          templateUrl: function($stateParam) {
            var steps = [undefined,
                '/nsctr/app/lifeLaw/processes/declaration/component/declarationS1.html',
                '/nsctr/app/common/components/declarationInclusion/template/declaration/declarationS2.html'
            ];
            return steps[$stateParam.step];
          },
          resolve: {
            risksList: ['nsctrFactoryResolve', 'lifeLawDeclaration', '$stateParams', function(nsctrFactoryResolve, lifeLawDeclaration, $stateParams) {
              if ($stateParams.step < 2) return nsctrFactoryResolve.Declaration_Step1_GetRisksLists($stateParams.selectedApplications, true);
            }],
            risksPremium: ['nsctrFactoryResolve', 'lifeLawDeclaration', '$stateParams', function(nsctrFactoryResolve, lifeLawDeclaration, $stateParams) {
              if ($stateParams.step > 1) return nsctrFactoryResolve.CSServiceRiskPrimaDeclaracion($stateParams.paramsRisksPremium, $stateParams.paramsPendingRisksPremium, true);
            }]
          },
          controllerProvider: function($stateParams) {
            var steps = [undefined,
              'lifeLawDeclarationS1Controller',
              'nsctrDIS2Controller'
            ];
            return steps[$stateParams.step];
          }
        }
      ],
      resolver: [{
        name: 'lifeLawDeclaration',
        moduleName: 'appNsctr',
        files: [
          'lifeLawDeclarationS1Controller',
          'nsctrDIS2Controller',
          'nsctrDIController',
          'nsctrFactoryResolveJs'
        ]
      }]
    },
    {
      module: MODULE_LIFE_LAW,
      name: 'lifeLawDeclarationGenerated',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'lifeLawSearchClient',
        {
          nameRoute: 'lifeLawClient',
          nameStateParams: ['client']
        }
      ],
      description: 'Declaración',
      url: '/lifeLaw/processes/client/declarationGenerated/:idProof',
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
          name: 'lifeLawDeclarationGenerated',
          moduleName: 'appNsctr',
          files: [
            'nsctrSummaryJs'
          ]
        }]
    },
    {
      module: MODULE_LIFE_LAW,
      name: 'lifeLawExclusionGenerated',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'lifeLawSearchClient',
        {
          nameRoute: 'lifeLawClient',
          nameStateParams: ['client']
        }
      ],
      description: 'Declaración',
      url: '/lifeLaw/processes/client/exclusionGenerated/:idProof',
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
          name: 'lifeLawExclusionGenerated',
          moduleName: 'appNsctr',
          files: [
            'nsctrSummaryJs'
          ]
        }]
    },
    {
      module: MODULE_LIFE_LAW,
      name: 'lifeLawInclusion',
      movementType: nsctr_constants.movementType.inclusion.code,
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'lifeLawSearchClient',
        {
          nameRoute: 'lifeLawClient',
          nameStateParams: ['client']
        }
      ],
      description: 'Inclusión de Planilla',
      params:{
        step: null
      },
      urls:[
        {
          url: '/lifeLaw/processes/client/inclusion',
          abstract: true,
          parent: 'nsctrContentTemplate',
          thenRoutes: ['/lifeLaw/processes/client/inclusion/1'],
          views: {
            content: {
              controller: 'nsctrDIController',
              templateUrl: '/nsctr/app/common/components/declarationInclusion/template/inclusion/inclusion.html'
            }
          },
          resolve: {}
        },
        {
          name: 'lifeLawInclusion.steps',
          url: '/:step',
          params: {
            showRisksList         : null,
            selectedApplicationsPolicies  : null,
            client                : null,
            selectedApplications  : null,
            paramsRisksPremium    : null
          },
          templateUrl: function($stateParam) {
            var steps = [undefined,
                '/nsctr/app/lifeLaw/processes/inclusion/component/inclusionS1.html',
                '/nsctr/app/common/components/declarationInclusion/template/inclusion/inclusionS2.html'
            ];
            return steps[$stateParam.step];
          },
          resolve: {
            risksList: ['nsctrFactoryResolve', 'lifeLawInclusion', '$stateParams', function(nsctrFactoryResolve, lifeLawInclusion, $stateParams) {
              if ($stateParams.step < 2) return nsctrFactoryResolve.Declaration_Step1_GetRisksLists($stateParams.selectedApplications, true);
            }],
            risksPremium: ['nsctrFactoryResolve', 'lifeLawInclusion', '$stateParams', function(nsctrFactoryResolve, lifeLawInclusion, $stateParams) {
              if ($stateParams.step > 1) return nsctrFactoryResolve.CSServiceRiskPrimaDeclaracion($stateParams.paramsRisksPremium, null, true);
            }]
          },
          controllerProvider: function($stateParams) {
            var steps = [undefined,
              'lifeLawInclusionS1Controller',
              'nsctrDIS2Controller'
            ];
            return steps[$stateParams.step];
          }
        }
      ],
      resolver: [{
        name: 'lifeLawInclusion',
        moduleName: 'appNsctr',
        files: [
          'lifeLawInclusionS1Controller',
          'nsctrDIS2Controller',
          'nsctrDIController',
          'nsctrFactoryResolveJs'
        ]
      }]
    },
    {
      module: MODULE_LIFE_LAW,
      name: 'lifeLawInclusionGenerated',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'lifeLawSearchClient',
        {
          nameRoute: 'lifeLawClient',
          nameStateParams: ['client']
        }
      ],
      description: 'Inclusión',
      url: '/lifeLaw/processes/client/inclusionGenerated/:idProof',
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
          name: 'lifeLawInclusionGenerated',
          moduleName: 'appNsctr',
          files: [
            'nsctrSummaryJs'
          ]
        }]
    },
    {
      module: MODULE_LIFE_LAW,
      name: 'lifeLawProofs',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'lifeLawSearchClient',
        {
          nameRoute: 'lifeLawClient',
          nameStateParams: ['client']
        }
      ],
      description: 'Constancias',
      url: '/lifeLaw/processes/client/proofs',
      params:{
        client                : null,
        selectedApplications  : null
      },
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          template: '<nsctr-proofs resolve="{documentTypes: $resolve.documentTypes}""></nsctr-proofs>'
        }
      },
      resolve: {
        documentTypes: ['nsctrFactoryResolve', 'lifeLawProofs', '$stateParams', function(nsctrFactoryResolve, lifeLawProofs, $stateParams){
          return nsctrFactoryResolve.ServicesListDocumentType(nsctr_constants.insured.code, MODULE_LIFE_LAW.code, false);
        }]
      },
      resolver:
        [{
          name: 'lifeLawProofs',
          moduleName: 'appNsctr',
          files: [
            'nsctrProofsJs',
            'nsctrFactoryResolveJs'
          ]
        }]
    },
    {
      module: MODULE_LIFE_LAW,
      name: 'lifeLawReplacePayroll',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'lifeLawSearchClient',
        {
          nameRoute: 'lifeLawClient',
          nameStateParams: ['client']
        },
        {
          nameRoute: 'lifeLawProofs',
          nameStateParams: ['client', 'selectedApplications']
        }
      ],
      description: 'Reemplazar Planilla',
      url: '/lifeLaw/processes/client/proofs/replacePayroll',
      parent: 'nsctrContentTemplate',
      params:{
        client:               null,
        selectedApplications: null,
        paramsReplacePayroll: null
      },
      views: {
        content: {
          controller: 'lifeLawReplacePayrollController',
          templateUrl: '/nsctr/app/lifeLaw/processes/replacePayroll/controller/replacePayroll.html'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'lifeLawReplacePayroll',
          moduleName: 'appNsctr',
          files: [
            'lifeLawReplacePayrollController'
          ]
        }]
    },
    {
      module: MODULE_LIFE_LAW,
      name: 'lifeLawSearchInsured',
      activeMenu: 'queries',
      nsctrSecurity: {
        codeObj: {
          dev: nsctr_constants.securityCode.insureds.codeObj.dev,
          prod: nsctr_constants.securityCode.insureds.codeObj.prod
        }
      },
      breads: ['lifeLawSearchClient'],
      description: 'Búsqueda de Asegurados',
      url: '/lifeLaw/queries/searchInsured',
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          template: '<nsctr-search-insured></nsctr-search-insured>'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'lifeLawSearchInsured',
          moduleName: 'appNsctr',
          files: [
            'nsctrSearchInsuredJs'
          ]
        }]
    },
    {
      module: MODULE_LIFE_LAW,
      name: 'lifeLawInsuredMovements',
      activeMenu: 'queries',
      nsctrSecurity: {
        codeObj: {
          dev: nsctr_constants.securityCode.insureds.codeObj.dev,
          prod: nsctr_constants.securityCode.insureds.codeObj.prod
        }
      },
      breads: ['lifeLawSearchClient'],
      description: 'Movimientos del Asegurado',
      url: '/lifeLaw/queries/insuredMovements',
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
          name: 'lifeLawInsuredMovements',
          moduleName: 'appNsctr',
          files: [
            'nsctrInsuredMovementsJs'
          ]
        }]
    },
    {
      module: MODULE_LIFE_LAW,
      name: 'lifeLawSearchProofs',
      activeMenu: 'queries',
      nsctrSecurity: {
        codeObj: {
          dev: nsctr_constants.securityCode.proofs.codeObj.dev,
          prod: nsctr_constants.securityCode.proofs.codeObj.prod
        }
      },
      breads: ['lifeLawSearchClient'],
      description: 'Búsqueda de constancias',
      url: '/lifeLaw/queries/searchProofs',
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          template: '<nsctr-search-proofs></nsctr-search-proofs>'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'lifeLawSearchProofs',
          moduleName: 'appNsctr',
          files: [
            'nsctrSearchProofsJs'
          ]
        }]
    },
    {
      module: MODULE_LIFE_LAW,
      name: 'lifeLawSearchProvisionalCoverage',
      activeMenu: 'coverages',
      nsctrSecurity: {
        codeObj: {
          dev: nsctr_constants.securityCode.provisional.codeObj.dev,
          prod: nsctr_constants.securityCode.provisional.codeObj.prod
        }
      },
      breads: ['lifeLawSearchClient'],
      description: 'Bandeja de Coberturas Provisionales',
      url: '/lifeLaw/coverages/searchProvisionalCoverage',
      params: {
        isBack: null
      },
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          template: '<nsctr-search-provisional-coverage></nsctr-search-provisional-coverage>'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'lifeLawSearchProvisionalCoverage',
          moduleName: 'appNsctr',
          files: [
            'nsctrSearchProvisionalCoverageJs'
          ]
        }]
    },
    {
      module: MODULE_LIFE_LAW,
      name: 'lifeLawProvisionalCoverage',
      activeMenu: 'coverages',
      nsctrSecurity: {
        codeObj: {
          dev: nsctr_constants.securityCode.provisional.codeObj.dev,
          prod: nsctr_constants.securityCode.provisional.codeObj.prod
        }
      },
      breads: ['lifeLawSearchClient'],
      description: 'Cobertura Provisional',
      url: '/lifeLaw/coverages/provisionalCoverage',
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          template: '<nsctr-provisional-coverage></nsctr-provisional-coverage>'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'lifeLawProvisionalCoverage',
          moduleName: 'appNsctr',
          files: [
            'nsctProvisionalCoverageJs'
          ]
        }]
    }
  ];

  return data;
});
