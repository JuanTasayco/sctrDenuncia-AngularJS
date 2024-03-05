'use strict';
/* eslint-disable new-cap */

define(['system', 'coreConstants'], function(system, coreConstants) {
  var folder = system.apps.ap.location;
  var moduleName = coreConstants.ngMainModule;

  return [
    {
      abstract: true,
      name: 'root',
      views: {
        'top@root': {
          controller: 'topController',
          templateUrl: '/app/index/controller/template/top.html'
        },
        'header@root': {
          controller: 'headerController',
          templateUrl: '/app/index/controller/template/header.html'
        },
        'left_bar@root': {
          controller: 'leftBarController',
          templateUrl: '/app/index/controller/template/left_bar.html'
        },

        'body_left@root': {
          controller: 'bodyLeftController',
          templateUrl: '/app/index/controller/template/body_left.html'
        },
        'right_bar@root': {
          controller: 'rightBarController',
          templateUrl: '/app/index/controller/template/right_bar.html'
        },
        'footer@root': {
          controller: 'footerController',
          templateUrl: '/app/index/controller/template/footer.html'
        },
        'bottom@root': {
          controller: 'bottomController',
          templateUrl: '/app/index/controller/template/bottom.html'
        }
      },
      resolver: [
        {
          moduleName: moduleName,
          name: 'layout',
          files: [
            'topController',
            'headerController',
            'leftBarController',
            'bodyMiddelController',
            'bodyLeftController',
            'rightBarController',
            'footerController',
            'bottomController'
          ]
        }
      ]
    },
    {
      name: "accessdenied",
      code: "",
      description: "Acceso denegado",
      url: "/accessdenied",
      parent: "root",
      views: {
        content: {
          controller: [function () {}],
          templateUrl: "/app/handlerErr/template/access-denied.html",
        },
      },
    },
    {
      code: '',
      description: 'Home',
      name: 'home',
      parent: 'root',
      url: '/',
      views: {
        content: {
          controller: 'HomeComponent as $ctrl',
          templateUrl: folder + '/app/home/pages/main/home.component.html'
        }
      },
      resolve: {
        menu: [
          'SecurityFactory',
          function(SecurityFactory) {
            return SecurityFactory.getMenuHome().then(SecurityFactory.mapMenuHome);
          }
        ]
      },
      resolver: [
        {
          name: 'home',
          moduleName: moduleName,
          files: ['HomeComponent']
        }
      ]
    },
    {
      code: '',
      description: 'Administrador de servicios adicionales',
      name: 'adminAdditionalServices',
      parent: 'root',
      abstract: true,
      url: '',
      views: {
        content: {
          controller: 'AdditionalServicesComponent as $ctrl',
          templateUrl: folder + '/app/admin-additional-services/additional-services.component.html'
        }
      },
      resolve: {
        additionalServices: [
          "GeneralAdditionalServiceFactory",
          function(GeneralAdditionalServiceFactory) {
            return GeneralAdditionalServiceFactory.getAdditionalServices();
          }
        ]
      },
      resolver: [
        {
          name: 'adminAdditionalServices',
          moduleName: moduleName,
          files: ['AdditionalServicesComponent']
        }
      ]
    },
    {
      name: 'adminAdditionalServices.1234',
      code: '',
      description: 'Sección Misas y Responso',
      url: '',
      abstract: true,
      views: {
        contenido: {
          controller: 'MassesAndResponsesComponent as $ctrl',
          templateUrl: folder + '/app/admin-additional-services/pages/masses-and-responses/masses-and-responses.component.html'
        }
      },
      resolver: [
        {
          name: 'adminAdditionalServices.1234',
          moduleName: moduleName,
          files: [
            'MassesAndResponsesComponent'
          ]
        }
      ]
    },
    {
      name: 'adminAdditionalServices.1234.ranges',
      code: '',
      description: 'Misas',
      url: '/admin-additional-services/masses-and-responsos/ranges',
      views: {
        'contenido': {
          template: '<ap-ranges-and-date></ap-ranges-and-date>'
        }
      },
      resolver: [
        {
          name: 'adminAdditionalServices.1234.ranges',
          moduleName: moduleName,
          files: [
            'apRangesAndDate'
          ]
        }
      ]
    },
    {
      name: 'adminAdditionalServices.1234.content',
      code: '',
      description: 'Misas',
      url: '/admin-additional-services/masses-and-responsos/content',
      views: {
        'contenido': {
          template: '<ap-content></ap-content>'
        }
      },
      resolver: [
        {
          name: 'adminAdditionalServices.1234.content',
          moduleName: moduleName,
          files: [
            'apContent'
          ]
        }
      ]
    },
    {
      code: '',
      description: 'Administrador por ramos',
      name: 'adminPolicySection',
      parent: 'root',
      abstract: true,
      url: '',
      views: {
        content: {
          controller: 'AdminRamoComponent as $ctrl',
          templateUrl: folder + '/app/admin-policy-section/pages/admin-ramo/admin-ramo.component.html'
        }
      },
      resolve: {
        ramo: [
          'SecurityFactory',
          function(SecurityFactory) {
            return SecurityFactory.getProductsOfAdminPolicy().then(SecurityFactory.mapRamo);
          }
        ],
        sections: [
          "AdminRamoFactory",
          function(AdminRamoFactory) {
            return AdminRamoFactory.GetSection(true);
          }
        ]
      },
      resolver: [
        {
          name: 'adminPolicySection',
          moduleName: moduleName,
          files: ['AdminRamoComponent']
        }
      ]
    },
    {
      name: 'adminPolicySection.FFB1218',
      code: '',
      description: 'Sección Que quieres hacer',
      url: '/admin-policy-section/what-you-want-to-do',
      views: {
        'contenido': {
          template: '<ap-what-you-want-to-do></ap-what-you-want-to-do>'
        }
      },
      resolver: [
        {
          name: 'adminPolicySection.FFB1218',
          moduleName: moduleName,
          files: [
            'apWhatYouWantToDo'
          ]
        }
      ]
    },
    {
      name: 'adminPolicySection.A0D139A',
      code: '',
      description: 'Sección Asegurados por ramo',
      url: '/admin-policy-section/insurances-by-ramo',
      views: {
        'contenido': {
          template: '<ap-insurances-by-ramo></ap-insurances-by-ramo>'
        }
      },
      resolver: [
        {
          name: 'adminPolicySection.A0D139A',
          moduleName: moduleName,
          files: [
            'apInsurancesByRamo'
          ]
        }
      ]
    },
    {
      name: 'adminPolicySection.AAD771R',
      code: '',
      description: 'Sección Preguntas frecuentes',
      url: '/admin-policy-section/frequent-questions',
      views: {
        'contenido': {
          template: '<ap-frequent-questions></ap-frequent-questions>'
        }
      },
      resolver: [
        {
          name: 'adminPolicySection.AAD771R',
          moduleName: moduleName,
          files: [
            'apFrequentQuestions'
          ]
        }
      ]
    },
    {
      code: '',
      description: 'Administrador Mapfre tecuidamos',
      name: 'adminMapfreTecuidamos',
      parent: 'root',
      abstract: true,
      url: '',
      views: {
        content: {
          controller: 'AdminMapfreTecuidamosComponent as $ctrl',
          templateUrl: folder + '/app/admin-mapfre-tecuidamos/admin-mapfre-tecuidamos.component.html'
        }
      },
      resolve: {
        sections: [
          "GeneralAdminMapfreTecuidamosFactory",
          function(GeneralAdminMapfreTecuidamosFactory) {
            return GeneralAdminMapfreTecuidamosFactory.GetSection(true);
          }
        ]
      },
      resolver: [
        {
          name: 'adminMapfreTecuidamos',
          moduleName: moduleName,
          files: ['AdminMapfreTecuidamosComponent']
        }
      ]
    },
    {
      name: 'adminMapfreTecuidamos.CMB1201',
      code: '',
      description: 'Sección Beneficios',
      url: '/admin-mapfre-tecuidamos/benefits',
      views: {
        contenido: {
          controller: 'MyBenefitsController as $ctrl',
          templateUrl: folder + '/app/admin-mapfre-tecuidamos/pages/my-benefits/my-benefits.component.html'
        }
      },
      resolve: {
        commercialSegment: [
          "GeneralAdminMapfreTecuidamosFactory",
          function(GeneralAdminMapfreTecuidamosFactory) {
            return GeneralAdminMapfreTecuidamosFactory.GetParams(true);
          }
        ]
      },
      resolver: [
        {
          name: 'adminMapfreTecuidamos.CMB1201',
          moduleName: moduleName,
          files: [
            'apMyBenefits'
          ]
        }
      ]
    },
    {
      name: 'adminMapfreTecuidamos.CMD7702',
      code: '',
      description: 'Sección Que es',
      url: '/admin-mapfre-tecuidamos/what-is',
      views: {
        'contenido': {
          template: '<ap-what-is></ap-what-is>'
        }
      },
      resolver: [
        {
          name: 'adminMapfreTecuidamos.CMD7702',
          moduleName: moduleName,
          files: [
            'apWhatIs'
          ]
        }
      ]
    },
    {
      code: '',
      description: 'Lista de Carruseles',
      name: 'carouselTray',
      parent: 'root',
      url: '/carousel-tray/{codeApp}',
      views: {
        content: {
          controller: 'CarouselTrayComponent as $ctrl',
          templateUrl: folder + '/app/carousel-tray/pages/main/carousel-tray.component.html'
        }
      },
      resolve: {
        products: [
          'SecurityFactory',
          function(SecurityFactory) {
            return SecurityFactory.getProductsOfCarousel().then(SecurityFactory.mapProducts);
          }
        ]
      },
      resolver: [
        {
          name: 'carouselTray',
          moduleName: moduleName,
          files: ['CarouselTrayComponent']
        }
      ]
    },
    {
      breads: [
        {
          nameRoute: 'carouselTray',
          nameStateParams: ['codeApp']
        }
      ],
      code: '',
      description: 'Modificar carrusel',
      name: 'carouselModification',
      parent: 'root',
      url: '/carousel-tray/{codeApp}/modification/{idCarousel}',
      views: {
        content: {
          controller: 'CarouselModificationComponent as $ctrl',
          templateUrl: folder + '/app/carousel-tray/pages/carousel-modification/carousel-modification.component.html'
        }
      },
      resolver: [
        {
          name: 'carouselModification',
          moduleName: moduleName,
          files: ['CarouselModificationComponent']
        }
      ]
    },
    {
      breads: [
        {
          nameRoute: 'carouselTray',
          nameStateParams: ['codeApp']
        },
        {
          nameRoute: 'carouselModification',
          nameStateParams: ['codeApp', 'idCarousel']
        }
      ],
      code: '',
      description: 'Crear nuevo banner',
      name: 'addBanner',
      parent: 'root',
      url: '/carousel-tray/{codeApp}/modification/{idCarousel}/add-banner',
      views: {
        content: {
          controller: 'AddBannerComponent as $ctrl',
          templateUrl: folder + '/app/carousel-tray/pages/add-banner/add-banner.component.html'
        }
      },
      resolver: [
        {
          name: 'addBanner',
          moduleName: moduleName,
          files: ['AddBannerComponent']
        }
      ]
    },
    {
      breads: [
        {
          nameRoute: 'carouselTray',
          nameStateParams: ['codeApp']
        },
        {
          nameRoute: 'carouselModification',
          nameStateParams: ['codeApp', 'idCarousel']
        }
      ],
      code: '',
      description: 'Modificar banner',
      name: 'editBanner',
      parent: 'root',
      url: '/carousel-tray/{codeApp}/modification/{idCarousel}/edit-banner/{idBanner}',
      views: {
        content: {
          controller: 'AddBannerComponent as $ctrl',
          templateUrl: folder + '/app/carousel-tray/pages/add-banner/add-banner.component.html'
        }
      },
      resolver: [
        {
          name: 'addBanner',
          moduleName: moduleName,
          files: ['AddBannerComponent']
        }
      ]
    },
    {
      code: '',
      description: 'Lista de Banners',
      name: 'bannerRecords',
      parent: 'root',
      url: '/banner-records/{codeApp}',
      views: {
        content: {
          controller: 'BannerRecordsComponent as $ctrl',
          templateUrl: folder + '/app/carousel-tray/pages/banner-records/banner-records.component.html'
        }
      },
      resolver: [
        {
          name: 'bannerRecords',
          moduleName: moduleName,
          files: ['BannerRecordsComponent']
        }
      ]
    },
    {
      code: '',
      description: "Administrador de Misas",
      name: "massAdmHome",
      parent: "root",
      url: "/admin-misa",
      views: {
        content: {
          controller: 'MassAdmHomeComponent as $ctrl',
          templateUrl: folder + "/app/mass-adm/home/mass-adm-home.html"
        }
      },
      resolver: [
        {
          name: 'massAdmHome',
          moduleName: moduleName,
          files: ['MassAdmHomeComponent']
        }
      ]
    },
    {
      code: '',
      description: "Bandeja de Misas",
      name: "massAdmTray",
      parent: "root",
      url: "/admin-misa/bandeja",
      breads: ['massAdmHome'],
      views: {
        content: {
          templateUrl:  folder + "/app/mass-adm/mass/tray/mass-tray.html",
          controller: "massAdmTrayController as $ctrl"
        }
      },
      resolver: [
        {
          name: "massAdmTray",
          moduleName: moduleName,
          files: [
            "massAdmTrayController"]
        },
      ]
    },
    {
      code: '',
      description: "Nueva Misa",
      name: "massAdmNewMass",
      parent: "root",
      url: "/admin-misa/misa",
      breads: ['massAdmHome'],
      views: {
        content: {
          templateUrl:  folder + "/app/mass-adm/mass/new/new-mass.html",
          controller: "massAdmNewMassController as $ctrl"
        }
      },
      resolver: [
        {
          name: "massAdmNewMass",
          moduleName: moduleName,
          files: [
            "massAdmNewMassController"]
        },
      ]
    },
    {
      code: '',
      description: "Detalle de Misa",
      name: "massAdmMassDetail",
      parent: "root",
      url: "/admin-misa/misa/:misaid",
      breads: ['massAdmTray'],
      views: {
        content: {
          templateUrl:  folder + "/app/mass-adm/mass/detail/detail-mass.html",
          controller: "massAdmMassDetailController as $ctrl"
        }
      },
      resolve: {orderItem: ['massAdmMassDetail', '$stateParams', 'MassItemService', function(massAdmMassDetail, $stateParams, MassItemService) {
        return MassItemService.getMassById($stateParams.misaid, true)
      }]},
      resolver: [
        {
          name: "massAdmMassDetail",
          moduleName: moduleName,
          files: [
            "massAdmTrayController",
            "massAdmMassDetailController"
          ]
        },
      ]
    },
    //Cemetery
    {
      code: '',
      description: "Camposantos",
      name: "cemetery",
      parent: "root",
      url: "/cemetery",
      views: {
        content: {
          controller: 'CemeteryComponent as $ctrl',
          templateUrl: folder + "/app/cemetery/pages/main/cemetery.component.html"
        }
      },
      resolve: {
        role: [
          "oimClaims",
          "mainServices",
          "$state",
          function(oimClaims, mainServices, $state) {
            if (!mainServices.isAdminAdmPortalesApp(oimClaims.rolesCode)) {
                $state.go("accessdenied");
            }
          }
        ]
      },
      resolver: [
        {
          name: 'cemetery',
          moduleName: moduleName,
          files: [
            'CemeteryComponent',
          ]
        }
      ]
    },
    {
      breads: [
        {
          nameRoute: 'cemetery',
          nameStateParams: ['cemeteryId']
        }
      ],
      code: '',
      description: 'Información',
      name: 'cemeteryInfo',
      parent: 'root',
      url: '/cemetery/{cemeteryId}/cemetery-info',
      views: {
        content: {
          controller: 'CemeteryInfoComponent as $ctrl',
          templateUrl: folder + '/app/cemetery/pages/cemetery-info/cemetery-info.component.html'
        }
      },
      resolve: {
        role: [
          "oimClaims",
          "mainServices",
          "$state",
          function(oimClaims, mainServices, $state) {
            if (!mainServices.isAdminAdmPortalesApp(oimClaims.rolesCode)) {
                $state.go("accessdenied");
            }
          }
        ]
      },
      resolver: [
        {
          name: 'cemeteryInfo',
          moduleName: moduleName,
          files: ['CemeteryInfoComponent']
        }
      ]
    },   
    {
      breads: [
        {
          nameRoute: 'cemetery',
          nameStateParams: ['cemeteryId']
        }
      ],
      code: '',
      description: 'Espacios',
      name: 'cemeterySpace',
      parent: 'root',
      url: '/cemetery/{cemeteryId}/cemetery-space',
      views: {
        content: {
          controller: 'CemeterySpaceComponent as $ctrl',
          templateUrl: folder + '/app/cemetery/pages/cemetery-space/cemetery-space.component.html'
        }
      },
      resolve: {
        role: [
          "oimClaims",
          "mainServices",
          "$state",
          function(oimClaims, mainServices, $state) {
            if (!mainServices.isAdminAdmPortalesApp(oimClaims.rolesCode)) {
                $state.go("accessdenied");
            }
          }
        ]
      },
      resolver: [
        {
          name: 'cemeterySpace',
          moduleName: moduleName,
          files: ['CemeterySpaceComponent']
        }
      ]
    },
    {
      breads: [
        {
          nameRoute: 'cemetery',
          nameStateParams: ['cemeteryId']
        },
        {
          nameRoute: 'cemeterySpace',
          nameStateParams: ['cemeteryId']
        }
      ],
      code: '',
      description: 'Subespacios',
      name: 'cemeterySubspace',
      parent: 'root',
      url: '/cemetery/{cemeteryId}/cemetery-subspace/{spaceId}',
      views: {
        content: {
          controller: 'CemeterySubspaceComponent as $ctrl',
          templateUrl: folder + '/app/cemetery/pages/cemetery-subspace/cemetery-subspace.component.html'
        }
      },
      resolve: {
        role: [
          "oimClaims",
          "mainServices",
          "$state",
          function(oimClaims, mainServices, $state) {
            if (!mainServices.isAdminAdmPortalesApp(oimClaims.rolesCode)) {
                $state.go("accessdenied");
            }
          }
        ]
      },
      resolver: [
        {
          name: 'cemeterySubspace',
          moduleName: moduleName,
          files: ['CemeterySubspaceComponent']
        }
      ]
    },
    {
      code: '', 
      description: "Parámetros",
      name: "parameterGeneral",
      parent: "root",
      url: "/parameter-general",
      views: {
        content: {
          controller: 'ParameterGeneralComponent as $ctrl',
          templateUrl: folder + "/app/cemetery/pages/parameter-general/parameter-general.component.html"
        }
      },
      resolve: {
        role: [
          "oimClaims",
          "mainServices",
          "$state",
          function(oimClaims, mainServices, $state) {
            if (!mainServices.isAdminAdmPortalesApp(oimClaims.rolesCode)) {
                $state.go("accessdenied");
            }
          }
        ]
      },
      resolver: [
        {
          name: 'parameterGeneral',
          moduleName: moduleName,
          files: [
            'ParameterGeneralComponent',
          ]
        }
      ]
    },
    {
      breads: ['parameterGeneral'],
      code: '',
      description: "Configuración de espacios",
      name: "parameterSpace",
      parent: "root",
      url: "/parameter-space",
      views: {
        content: {
          controller: 'ParameterSpaceComponent as $ctrl',
          templateUrl: folder + "/app/cemetery/pages/parameter-space/parameter-space.component.html"
        }
      },
      resolve: {
        role: [
          "oimClaims",
          "mainServices",
          "$state",
          function(oimClaims, mainServices, $state) {
            if (!mainServices.isAdminAdmPortalesApp(oimClaims.rolesCode)) {
                $state.go("accessdenied");
            }
          }
        ]
      },
      resolver: [
        {
          name: 'parameterSpace',
          moduleName: moduleName,
          files: [
            'ParameterSpaceComponent',
          ]
        }
      ]
    },
    {
      breads: ['parameterGeneral','parameterSpace'],
      code: '',
      description: 'Subespacios',
      name: 'parameterSubspace',
      parent: 'root',
      url: '/parameter/parameter-subspace/{spaceId}',
      views: {
        content: {
          controller: 'ParameterSubspaceComponent as $ctrl',
          templateUrl: folder + '/app/cemetery/pages/parameter-subspace/parameter-subspace.component.html'
        }
      },
      resolve: {
        role: [
          "oimClaims",
          "mainServices",
          "$state",
          function(oimClaims, mainServices, $state) {
            if (!mainServices.isAdminAdmPortalesApp(oimClaims.rolesCode)) {
                $state.go("accessdenied");
            }
          }
        ]
      },
      resolver: [
        {
          name: 'parameterSubspace',
          moduleName: moduleName,
          files: ['ParameterSubspaceComponent']
        }
      ]
    },
    {
      name: 'errorCemetery',
      code: '',
      description: 'Error interno',
      parent: 'root',
      url: '/error-cemetery',
      views: {
        content: {
          controller: [function() {}],
          templateUrl: folder + '/app/cemetery/pages/error/500.html'
        }
      },
    },
    //Clinica Digital
    {
      name: 'adminClinicaDigital',
      code: '',
      description: 'Administrador Clínica Digital',
      url: '/admin-clinica-digital',
      parent: 'root',
      views: {
        content: {
          controller: 'AdminClinicaDigitalComponent as $ctrl',
          templateUrl: folder + '/app/admin-clinica-digital/admin-clinica-digital.component.html'
        }
      },
      resolve: {
        options: [
          "GeneralAdminClinicaDigitalFactory",
          function(GeneralAdminClinicaDigitalFactory) {
            return GeneralAdminClinicaDigitalFactory.GetOptions(true);
          }
        ]
      },
      resolver: [
        {
          name: 'adminClinicaDigital',
          moduleName: moduleName,
          files: ['AdminClinicaDigitalComponent']
        }
      ]
    },
    {
      name: 'adminClinicaDigital.termsConditions',
      code: '',
      description: 'Términos y Condiciones',
      parent: 'root',
      url: '/admin-clinica-digital/terms-conditions',
      breads: ['adminClinicaDigital'],
      views: {
        content: {
          controller: 'TermsConditionsComponent as $ctrl',
          templateUrl: folder + '/app/admin-clinica-digital/pages/terms-conditions/terms-conditions.component.html'
        }
      },
      resolve: {
        sections: [
          "GeneralAdminClinicaDigitalFactory",
          function(GeneralAdminClinicaDigitalFactory) {
            return GeneralAdminClinicaDigitalFactory.GetSections(true);
          }
        ]
      },
      resolver: [
        {
          name: 'adminClinicaDigital.termsConditions',
          moduleName: moduleName,
          files: ['TermsConditionsComponent']
        }
      ]
    },
    {
      name: 'adminClinicaDigital.termsConditions.deliveryMedicamentos',
      code: '',
      description: 'Servicio delivery medicamentos',
      url: '/admin-clinica-digital/terms-conditions/delivery-medicamentos',
      breads: ['adminClinicaDigital', 'adminClinicaDigital.termsConditions'],
      views: {
        contenido: {
          controller: 'EditorTermsConditionsController as $ctrl',
          templateUrl: folder + '/app/admin-clinica-digital/pages/editor-terms-conditions/editor-terms-conditions.component.html'
        }
      },
      resolve: {
        section: [
          "GeneralAdminClinicaDigitalFactory",
          function(GeneralAdminClinicaDigitalFactory) {
            return GeneralAdminClinicaDigitalFactory.GetDataSection('deliveryMedicamentos', true);
          }
        ],
        contenido: [
          "GeneralAdminClinicaDigitalFactory",
          function(GeneralAdminClinicaDigitalFactory) {
            return GeneralAdminClinicaDigitalFactory.GetContent('DEL_MED', true);
          }
        ]
      },
      resolver: [
        {
          name: 'adminClinicaDigital.termsConditions.deliveryMedicamentos',
          moduleName: moduleName,
          files: [
            'apEditorTermsConditions'
          ]
        }
      ]
    },
  ];
});