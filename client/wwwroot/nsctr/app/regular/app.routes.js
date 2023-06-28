define(
['constants', 'nsctr_constants'],
function (constants, nsctr_constants) {

  var MODULE_REGULAR = nsctr_constants.regular;

  var data = [
    {
      module: MODULE_REGULAR,
      name: 'regularSearchClient',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: ['regularSearchClient'],
      description: MODULE_REGULAR.description,
      url: '/regular/processes/searchClient',
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          template: '<nsctr-search-client></nsctr-search-client>'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'regularSearchClient',
          moduleName: 'appNsctr',
          files: [
            'nsctrSearchClientJs'
          ]
        }]
    },
    {
      module: MODULE_REGULAR,
      name: 'regularClient',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: ['regularSearchClient'],
      description: 'Perfil Cliente',
      url: '/regular/processes/client',
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
          name: 'regularClient',
          moduleName: 'appNsctr',
          files: [
            'nsctrClientJs'
          ]
        }]
    },
    {
      module: MODULE_REGULAR,
      name: 'regularDeclaration',
      movementType: nsctr_constants.movementType.declaration.code,
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'regularSearchClient',
        {
          nameRoute: 'regularClient',
          nameStateParams: ['client']
        }
      ],
      description: 'Declaración',
      params:{
        step: null
      },
      urls:[
        {
          url: '/regular/processes/client/declaration',
          abstract: true,
          parent: 'nsctrContentTemplate',
          thenRoutes: ['/regular/processes/client/declaration/1'],
          views: {
            content: {
              controller: 'nsctrDIController',
              templateUrl: '/nsctr/app/common/components/declarationInclusion/template/declaration/declaration.html'
            }
          },
          resolve: {}
        },
        {
          name: 'regularDeclaration.steps',
          url: '/:step',
          params: {
            showRisksList             : null,
            client                    : null,
            selectedApplications      : null,
            paramsRisksPremium        : null,
            paramsPendingRisksPremium : null
          },
          templateUrl: function($stateParam) {
            var steps = [undefined,
                '/nsctr/app/regular/processes/declaration/component/declarationS1.html',
                '/nsctr/app/common/components/declarationInclusion/template/declaration/declarationS2.html'
            ];
            return steps[$stateParam.step];
          },
          resolve: {
            risksList: ['nsctrFactoryResolve', 'regularDeclaration', '$stateParams', function(nsctrFactoryResolve, regularDeclaration, $stateParams) {
              if ($stateParams.step < 2) return nsctrFactoryResolve.Declaration_Step1_GetRisksLists($stateParams.selectedApplications, true);
            }],
            risksPremium: ['nsctrFactoryResolve', 'regularDeclaration', '$stateParams', function(nsctrFactoryResolve, regularDeclaration, $stateParams) {
              if ($stateParams.step > 1) return nsctrFactoryResolve.CSServiceRiskPrimaDeclaracion($stateParams.paramsRisksPremium, $stateParams.paramsPendingRisksPremium, true);
            }]
          },
          controllerProvider: function($stateParams) {
            var steps = [undefined,
              'regularDeclarationS1Controller',
              'nsctrDIS2Controller'
            ];
            return steps[$stateParams.step];
          }
        }
      ],
      resolver: [{
        name: 'regularDeclaration',
        moduleName: 'appNsctr',
        files: [
          'regularDeclarationS1Controller',
          'nsctrDIS2Controller',
          'nsctrDIController',
          'nsctrFactoryResolveJs'
        ]
      }]
    },
    {
      module: MODULE_REGULAR,
      name: 'regularDeclarationGenerated',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'regularSearchClient',
        {
          nameRoute: 'regularClient',
          nameStateParams: ['client']
        }
      ],
      description: 'Declaración',
      url: '/regular/processes/client/declarationGenerated/:idProof',
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
          name: 'regularDeclarationGenerated',
          moduleName: 'appNsctr',
          files: [
            'nsctrSummaryJs'
          ]
        }]
    },
    {
      module: MODULE_REGULAR,
      name: 'regularExclusionGenerated',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'regularSearchClient',
        {
          nameRoute: 'regularClient',
          nameStateParams: ['client']
        }
      ],
      description: 'Exclusion',
      url: '/regular/processes/client/exclusionGenerated/:idProof',
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
          name: 'regularExclusionGenerated',
          moduleName: 'appNsctr',
          files: [
            'nsctrSummaryJs'
          ]
        }]
    },
    {
      module: MODULE_REGULAR,
      name: 'regularInclusion',
      movementType: nsctr_constants.movementType.inclusion.code,
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'regularSearchClient',
        {
          nameRoute: 'regularClient',
          nameStateParams: ['client']
        }
      ],
      description: 'Inclusión de Planilla',
      params:{
        step: null
      },
      urls:[
        {
          url: '/regular/processes/client/inclusion',
          abstract: true,
          parent: 'nsctrContentTemplate',
          thenRoutes: ['/regular/processes/client/inclusion/1'],
          views: {
            content: {
              controller: 'nsctrDIController',
              templateUrl: '/nsctr/app/common/components/declarationInclusion/template/inclusion/inclusion.html'
            }
          },
          resolve: {}
        },
        {
          name: 'regularInclusion.steps',
          url: '/:step',
          params: {
            showRisksList         : null,
            client                : null,
            selectedApplications  : null,
            paramsRisksPremium    : null
          },
          templateUrl: function($stateParam) {
            var steps = [undefined,
                '/nsctr/app/regular/processes/inclusion/component/inclusionS1.html',
                '/nsctr/app/common/components/declarationInclusion/template/inclusion/inclusionS2.html'
            ];
            return steps[$stateParam.step];
          },
          resolve: {
            risksList: ['nsctrFactoryResolve', 'regularInclusion', '$stateParams', function(nsctrFactoryResolve, regularInclusion, $stateParams) {
              if ($stateParams.step < 2) return nsctrFactoryResolve.Declaration_Step1_GetRisksLists($stateParams.selectedApplications, true);
            }],
            risksPremium: ['nsctrFactoryResolve', 'regularInclusion', '$stateParams', function(nsctrFactoryResolve, regularInclusion, $stateParams) {
              if ($stateParams.step > 1) return nsctrFactoryResolve.CSServiceRiskPrimaDeclaracion($stateParams.paramsRisksPremium, null, true);
            }]
          },
          controllerProvider: function($stateParams) {
            var steps = [undefined,
              'regularInclusionS1Controller',
              'nsctrDIS2Controller'
            ];
            return steps[$stateParams.step];
          }
        }
      ],
      resolver: [{
        name: 'regularInclusion',
        moduleName: 'appNsctr',
        files: [
          'regularInclusionS1Controller',
          'nsctrDIS2Controller',
          'nsctrDIController',
          'nsctrFactoryResolveJs'
        ]
      }]
    },
    {
      module: MODULE_REGULAR,
      name: 'regularInclusionGenerated',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'regularSearchClient',
        {
          nameRoute: 'regularClient',
          nameStateParams: ['client']
        }
      ],
      description: 'Inclusión',
      url: '/regular/processes/client/inclusionGenerated/:idProof',
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
          name: 'regularInclusionGenerated',
          moduleName: 'appNsctr',
          files: [
            'nsctrSummaryJs'
          ]
        }]
    },
    {
      module: MODULE_REGULAR,
      name: 'regularProofs',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'regularSearchClient',
        {
          nameRoute: 'regularClient',
          nameStateParams: ['client']
        }
      ],
      description: 'Constancias',
      url: '/regular/processes/client/proofs',
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
        documentTypes: ['nsctrFactoryResolve', 'regularProofs', '$stateParams', function(nsctrFactoryResolve, regularProofs, $stateParams){
          return nsctrFactoryResolve.ServicesListDocumentType(nsctr_constants.insured.code, MODULE_REGULAR.code, false);
        }]
      },
      resolver:
        [{
          name: 'regularProofs',
          moduleName: 'appNsctr',
          files: [
            'nsctrProofsJs',
            'nsctrFactoryResolveJs'
          ]
        }]
    },
    {
      module: MODULE_REGULAR,
      name: 'regularReplacePayroll',
      activeMenu: 'processes',
      nsctrSecurity: {
        headerName: nsctr_constants.securityCode.processes.headerName
      },
      breads: [
        'regularSearchClient',
        {
          nameRoute: 'regularClient',
          nameStateParams: ['client']
        },
        {
          nameRoute: 'regularProofs',
          nameStateParams: ['client', 'selectedApplications']
        }
      ],
      description: 'Reemplazar Planilla',
      url: '/regular/processes/client/proofs/replacePayroll',
      parent: 'nsctrContentTemplate',
      params:{
        client:               null,
        selectedApplications: null,
        paramsReplacePayroll: null
      },
      views: {
        content: {
          controller: 'regularReplacePayrollController',
          templateUrl: '/nsctr/app/regular/processes/replacePayroll/controller/replacePayroll.html'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'regularReplacePayroll',
          moduleName: 'appNsctr',
          files: [
            'regularReplacePayrollController'
          ]
        }]
    },
    {
      module: MODULE_REGULAR,
      name: 'regularSearchInsured',
      activeMenu: 'queries',
      nsctrSecurity: {
        codeObj: {
          dev: nsctr_constants.securityCode.insureds.codeObj.dev,
          prod: nsctr_constants.securityCode.insureds.codeObj.prod
        }
      },
      breads: ['regularSearchClient'],
      description: 'Búsqueda de Asegurados',
      url: '/regular/queries/searchInsured',
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          template: '<nsctr-search-insured></nsctr-search-insured>'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'regularSearchInsured',
          moduleName: 'appNsctr',
          files: [
            'nsctrSearchInsuredJs'
          ]
        }]
    },
    {
      module: MODULE_REGULAR,
      name: 'regularInsuredMovements',
      activeMenu: 'queries',
      nsctrSecurity: {
        codeObj: {
          dev: nsctr_constants.securityCode.insureds.codeObj.dev,
          prod: nsctr_constants.securityCode.insureds.codeObj.prod
        }
      },
      breads: ['regularSearchClient'],
      description: 'Movimientos del Asegurado',
      url: '/regular/queries/insuredMovements',
      params: {
        insured: null
      },
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          template: '<nsctr-insured-movements></nsctr-insured-movements>'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'regularInsuredMovements',
          moduleName: 'appNsctr',
          files: [
            'nsctrInsuredMovementsJs'
          ]
        }]
    },
    {
      module: MODULE_REGULAR,
      name: 'regularSearchProofs',
      activeMenu: 'queries',
      nsctrSecurity: {
        codeObj: {
          dev: nsctr_constants.securityCode.proofs.codeObj.dev,
          prod: nsctr_constants.securityCode.proofs.codeObj.prod
        }
      },
      breads: ['regularSearchClient'],
      description: 'Búsqueda de constancias',
      url: '/regular/queries/searchProofs',
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          template: '<nsctr-search-proofs></nsctr-search-proofs>'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'regularSearchProofs',
          moduleName: 'appNsctr',
          files: [
            'nsctrSearchProofsJs'
          ]
        }]
    },
    {
      module: MODULE_REGULAR,
      name: 'regularSearchProvisionalCoverage',
      activeMenu: 'coverages',
      nsctrSecurity: {
        codeObj: {
          dev: nsctr_constants.securityCode.provisional.codeObj.dev,
          prod: nsctr_constants.securityCode.provisional.codeObj.prod
        }
      },
      breads: ['regularSearchClient'],
      description: 'Bandeja de Coberturas Provisionales',
      url: '/regular/coverages/searchProvisionalCoverage',
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
          name: 'regularSearchProvisionalCoverage',
          moduleName: 'appNsctr',
          files: [
            'nsctrSearchProvisionalCoverageJs'
          ]
        }]
    },
    {
      module: MODULE_REGULAR,
      name: 'regularProvisionalCoverage',
      activeMenu: 'coverages',
      nsctrSecurity: {
        codeObj: {
          dev: nsctr_constants.securityCode.provisional.codeObj.dev,
          prod: nsctr_constants.securityCode.provisional.codeObj.prod
        }
      },
      breads: ['regularSearchClient'],
      description: 'Cobertura Provisional',
      url: '/regular/coverages/provisionalCoverage',
      parent: 'nsctrContentTemplate',
      views: {
        content: {
          template: '<nsctr-provisional-coverage></nsctr-provisional-coverage>'
        }
      },
      resolve: {},
      resolver:
        [{
          name: 'regularProvisionalCoverage',
          moduleName: 'appNsctr',
          files: [
            'nsctProvisionalCoverageJs'
          ]
        }]
    }
  ];

  return data;
});