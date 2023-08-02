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
      name: 'adminPolicySection.WhatYouWantToDo',
      code: '',
      description: 'Seccion Que quieres hacer',
      url: '/admin-policy-section/what-you-want-to-do',
      views: {
        'contenido': {
          template: '<ap-what-you-want-to-do></ap-what-you-want-to-do>'
        }
      },
      resolver: [
        {
          name: 'adminPolicySection.WhatYouWantToDo',
          moduleName: moduleName,
          files: [
            'apWhatYouWantToDo'
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
  ];
});