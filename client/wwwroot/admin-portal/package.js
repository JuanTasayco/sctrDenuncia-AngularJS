'use strict';

define(['system'], function(system) {
  var folder = system.apps.ap.location;

  return {
    lib: {
      appRoutes: {
        name: 'appRoutes',
        path: folder + '/app/app.routes'
      },
      app: {
        name: 'app',
        path: folder + '/app/app'
      },
      moment: {
        name: 'moment',
        path: '/scripts/b_components/moment/min/moment.min'
      },
      ngRaven: {
        name: 'ngRaven',
        path: '/scripts/b_components/raven-js/dist/angular/raven.min'
      },
      redux: {
        name: 'redux',
        path: '/scripts/b_components/redux/index'
      },
      ngRedux: {
        name: 'ngRedux',
        path: '/scripts/b_components/ng-redux/dist/ng-redux.min'
      },
      logger: {
        name: 'logger',
        path: folder + '/app/shared/scripts/redux-logger'
      },
      'checklist-model': {
        name: 'checklist-model',
        path: '/scripts/b_components/checklist-model/checklist-model'
      },
      SecurityFactory: {
        name: 'SecurityFactory',
        path: folder + '/app/shared/factory/security.factory'
      },
      HomeComponent: {
        name: 'HomeComponent',
        path: folder + '/app/home/pages/main/home.component'
      },
      apCardSectionHeader: {
        name: 'apCardSectionHeader',
        path: folder + '/app/shared/components/card-section-header/card-section-header.component'
      },
      apCardSection: {
        name: 'apCardSection',
        path: folder + '/app/shared/components/card-section/card-section.component'
      },
      apCardItem: {
        name: 'apCardItem',
        path: folder + '/app/admin-policy-section/components/card-item/card-item.component'
      },
      apCardListRamo: {
        name: 'apCardListRamo',
        path: folder + '/app/shared/components/card-list-ramo/card-list-ramo.component'
      },
      // Servicios Adicionales
      AdditionalServicesComponent: {
        name: 'AdditionalServicesComponent',
        path: folder + '/app/admin-additional-services/additional-services.component'
      },
      MassesAndResponsesComponent: {
        name: 'MassesAndResponsesComponent',
        path: folder + '/app/admin-additional-services/pages/masses-and-responses/masses-and-responses.component'
      },
      apRangesAndDate: {
        name: 'apRangesAndDate',
        path: folder + '/app/admin-additional-services/pages/masses-and-responses/ranges-and-date/ranges-and-date.component'
      },
      apContent: {
        name: 'apContent',
        path: folder + '/app/admin-additional-services/pages/masses-and-responses/content/content.component'
      },
      // componenentes Servicios Adicionales
      apTabServices: {
        name: 'apTabServices',
        path: folder + '/app/admin-additional-services/components/tab/tab.component'
      },
      AdminRamoComponent: {
        name: 'AdminRamoComponent',
        path: folder + '/app/admin-policy-section/pages/admin-ramo/admin-ramo.component'
      },
      apWhatYouWantToDo: {
        name: 'apWhatYouWantToDo',
        path: folder + '/app/admin-policy-section/pages/admin-ramo/what-you-want-to-do/what-you-want-to-do.component'
      },
      apInsurancesByRamo: {
        name: 'apInsurancesByRamo',
        path: folder + '/app/admin-policy-section/pages/admin-ramo/insurances-by-ramo/insurances-by-ramo.component'
      },
      apInsurancesByRamoFormSections: {
        name: 'apInsurancesByRamoFormSections',
        path: folder + '/app/admin-policy-section/pages/admin-ramo/insurances-by-ramo/sections/sections.component'
      },
      apInsurancesByRamoFormSectionsList: {
        name: 'apInsurancesByRamoFormSectionsList',
        path: folder + '/app/admin-policy-section/pages/admin-ramo/insurances-by-ramo/sections/section/section.component'
      },
      apInsurancesByRamoFormSectionsAddOrEdit: {
        name: 'apInsurancesByRamoFormSectionsAddOrEdit',
        path: folder + '/app/admin-policy-section/pages/admin-ramo/insurances-by-ramo/sections/add-update-section/add-update-section.component'
      },
      apFrequentQuestions: {
        name: 'apFrequentQuestions',
        path: folder + '/app/admin-policy-section/pages/admin-ramo/frequent-questions/frequent-questions.component'
      },
      CarouselTrayComponent: {
        name: 'CarouselTrayComponent',
        path: folder + '/app/carousel-tray/pages/main/carousel-tray.component'
      },
      CarouselModificationComponent: {
        name: 'CarouselModificationComponent',
        path: folder + '/app/carousel-tray/pages/carousel-modification/carousel-modification.component'
      },
      AdminRamoFactory: {
        name: 'AdminRamoFactory',
        path: folder + '/app/admin-policy-section/factory/admin-ramo.factory'
      },
      GeneralAdminRamoFactory: {
        name: 'GeneralAdminRamoFactory',
        path: folder + '/app/admin-policy-section/factory/general.factory'
      },
      CarouselTrayFactory: {
        name: 'CarouselTrayFactory',
        path: folder + '/app/carousel-tray/factory/carousel-tray.factory'
      },
      GeneralAdditionalServiceFactory: {
        name: 'GeneralAdditionalServiceFactory',
        path: folder + '/app/admin-additional-services/factory/general.factory'
      },
      MassesAndResponsesFactory: {
        name: 'MassesAndResponsesFactory',
        path: folder + '/app/admin-additional-services/factory/masses-and-responses.factory'
      },
      BannerRecordsFactory: {
        name: 'BannerRecordsFactory',
        path: folder + '/app/carousel-tray/factory/banner-records.factory'
      },
      CarouselModificationFactory: {
        name: 'CarouselModificationFactory',
        path: folder + '/app/carousel-tray/factory/carousel-modification.factory'
      },
      AddBannerFactory: {
        name: 'AddBannerFactory',
        path: folder + '/app/carousel-tray/factory/add-banner.factory'
      },
      apTab: {
        name: 'apTab',
        path: folder + '/app/carousel-tray/components/tab/tab.component'
      },
      apCarousel: {
        name: 'apCarousel',
        path: folder + '/app/carousel-tray/components/carousel/carousel.component'
      },
      AddBannerComponent: {
        name: 'AddBannerComponent',
        path: folder + '/app/carousel-tray/pages/add-banner/add-banner.component'
      },
      BannerRecordsComponent: {
        name: 'BannerRecordsComponent',
        path: folder + '/app/carousel-tray/pages/banner-records/banner-records.component'
      },
      coreConstants: {
        name: 'coreConstants',
        path: folder + '/app/shared/constants/core.constants'
      },
      generalConstants: {
        name: 'generalConstants',
        path: folder + '/app/shared/constants/general.constants'
      },
      endpointsConstants: {
        name: 'endpointsConstants',
        path: folder + '/app/shared/constants/endpoints.constants'
      },
      homeConstants: {
        name: 'homeConstants',
        path: folder + '/app/shared/constants/home.constants'
      },
      productsConstants: {
        name: 'productsConstants',
        path: folder + '/app/shared/constants/products.constants'
      },
      carouselTrayUtils: {
        name: 'carouselTrayUtils',
        path: folder + '/app/carousel-tray/utils/carousel-tray.utils'
      },
      carouselModificationUtils: {
        name: 'carouselModificationUtils',
        path: folder + '/app/carousel-tray/utils/carousel-modification.utils'
      },
      addBannerUtils: {
        name: 'addBannerUtils',
        path: folder + '/app/carousel-tray/utils/add-banner.utils'
      },
      apBannerUpload: {
        name: 'apBannerUpload',
        path: folder + '/app/carousel-tray/components/banner-upload/banner-upload.component'
      },
      apImageUploader: {
        name: 'apImageUploader',
        path: folder + '/app/carousel-tray/components/banner-upload/image-uploader/image-uploader.component'
      },
      localStorageUtils: {
        name: 'localStorageUtils',
        path: folder + '/app/carousel-tray/utils/localstorage.utils'
      },
      owl: {
        name: 'owl',
        path: folder + '/app/shared/scripts/owl'
      },
      massAmdUtils: {
        name: 'massAmdUtils',
        path: folder + '/app/mass-adm/utils/mass-adm.utils'
      },
      CommonFactory: {
        name: 'CommonFactory',
        path: folder + '/app/shared/factory/common.factory'
      },
      MassAdmHomeComponent: {
        name: 'MassAdmHomeComponent',
        path: folder + '/app/mass-adm/home/mass-adm-home'
      },
      massAdmTrayController: {
        name: 'massAdmTrayController',
        path: folder + '/app/mass-adm/mass/tray/mass-tray'
      },
      massAdmMassDetailController: {
        name: 'massAdmMassDetailController',
        path: folder + '/app/mass-adm/mass/detail/detail-mass'
      },
      MassMaintenanceFactory: {
        name: 'MassMaintenanceFactory',
        path: folder + '/app/mass-adm/factory/mass-maintenance.factory'
      },
      MassTrayFactory: {
        name: 'MassTrayFactory',
        path: folder + '/app/mass-adm/factory/mass-tray.factory'
      },
      massAdmNewMassController: {
        name: 'massAdmNewMassController',
        path: folder + '/app/mass-adm/mass/new/new-mass'
      },
      addDeceasedComponent: {
        name: 'addDeceasedComponent',
        path: folder + '/app/mass-adm/mass/components/deceased/add/add-deceased.component'
      },
      summaryDeceasedComponent: {
        name: 'summaryDeceasedComponent',
        path: folder + '/app/mass-adm/mass/components/deceased/summary/summary-deceased.component'
      },
      summaryMassComponent: {
        name: 'summaryMassComponent',
        path: folder + '/app/mass-adm/mass/components/summary/summary-mass.component'
      },
      //cemetery
      CemeteryFactory: {
        name: 'CemeteryFactory',
        path: folder + '/app/cemetery/factory/cemetery.factory'
      },
      CemeteryComponent: {
        name: 'CemeteryComponent',
        path: folder + '/app/cemetery/pages/main/cemetery.component'
      },
      CemeteryInfoComponent: {
        name: 'CemeteryInfoComponent',
        path: folder + '/app/cemetery/pages/cemetery-info/cemetery-info.component'
      },
      CemeterySpaceComponent: {
        name: 'CemeterySpaceComponent',
        path: folder + '/app/cemetery/pages/cemetery-space/cemetery-space.component'
      },
      CemeterySubspaceComponent: {
        name: 'CemeterySubspaceComponent',
        path: folder + '/app/cemetery/pages/cemetery-subspace/cemetery-subspace.component'
      },
      ParameterGeneralComponent: {
        name: 'ParameterGeneralComponent',
        path: folder + '/app/cemetery/pages/parameter-general/parameter-general.component'
      },
      ParameterSpaceComponent: {
        name: 'ParameterSpaceComponent',
        path: folder + '/app/cemetery/pages/parameter-space/parameter-space.component'
      },
      ParameterSubspaceComponent: {
        name: 'ParameterSubspaceComponent',
        path: folder + '/app/cemetery/pages/parameter-subspace/parameter-subspace.component'
      },
      popupCemetery: {
        name:'popupCemetery',
        path: folder + '/app/cemetery/components/popup/popup-cemetery.component'      
      },
      popupParameter: {
        name:'popupParameter',
        path: folder + '/app/cemetery/components/popup/popup-parameter.component'      
      },
      navbarCemetery: {
        name:'navbarCemetery',
        path: folder + '/app/cemetery/components/navbar/navbar-cemetery.component'      
      },
      tabCemetery: {
        name:'tabCemetery',
        path: folder + '/app/cemetery/components/tab/tab-cemetery.component'      
      },
      uploadButtonCemetery: {
        name: 'uploadButtonCemetery',
        path: folder + '/app/cemetery/components/upload-button/upload-button-cemetery.component'
      },
      bannerCemetery: {
        name: 'bannerCemetery',
        path: folder + '/app/cemetery/components/banner/banner-cemetery.component'
      },
      galleryCemetery: {
        name: 'galleryCemetery',
        path: folder + '/app/cemetery/components/gallery/gallery-cemetery.component'
      },
      serviceCarouselCemetery: {
        name: 'serviceCarouselCemetery',
        path: folder + '/app/cemetery/components/service-carousel/service-carousel-cemetery.component'
      },
      additionalServiceCemetery: {
        name: 'additionalServiceCemetery',
        path: folder + '/app/cemetery/components/additional-service/additional-service-cemetery.component'
      },
      errorCemetery: {
        name: 'errorCemetery',
        path: folder + '/app/cemetery/components/error/500.html'
      },
      cemeteryConstants: {
        name: 'cemeteryConstants',
        path: folder + '/app/cemetery/common/cemetery.constants'
      },
      cemeteryUtils: {
        name: 'cemeteryUtils',
        path: folder + '/app/cemetery/utils/cemetery.utils'
      },
    },
    shim: {
      appAP: {
        deps: ['angular_ui_route', 'uIBootstrap', 'oim_ocLazyLoad', 'oim_layout', 'lodash', 'oim_security', 'ngRedux']
      },
      logger: {
        deps: ['ngRedux']
      },
      ngRedux: {
        deps: ['angular', 'redux']
      },
      AdminRamoComponent: {
        deps: ['apCardSection', 'apCardListRamo', 'apCardItem', 'apCardSectionHeader']
      },
      AdditionalServicesComponent: {
        deps: ['apCardListRamo','apTabServices']
      },
      apInsurancesByRamo: {
        deps: ['apInsurancesByRamoFormSections']
      },
      apInsurancesByRamoFormSections: {
        deps: ['apInsurancesByRamoFormSectionsList','apInsurancesByRamoFormSectionsAddOrEdit']
      },
      CarouselTrayComponent: {
        deps: ['apTab', 'apCarousel']
      },
      AddBannerComponent: {
        deps: ['apBannerUpload']
      },
      // apWhatYouWantToDo: {
      //   deps: ['apCardSection', 'apCardListRamo', 'apCardItem', 'apCardSectionHeader']
      // },
      apCardListRamo: {
        deps: []
      },
      apCardSection: {
        deps: []
      },
      apBannerUpload: {
        deps: ['apImageUploader']
      },
      apCarousel: {
        deps: ['owl']
      },
      owl: {
        deps: ['jquery']
      },
      massAdmNewMassController: {
        deps: ['addDeceasedComponent', 'summaryDeceasedComponent']
      },
      massAdmMassDetailController: {
        deps: ['addDeceasedComponent', 'summaryDeceasedComponent', 'summaryMassComponent']
      },
      //Cemetery
      CemeteryComponent: {
        deps: ['navbarCemetery','popupCemetery']
      },
      CemeteryInfoComponent: {
        deps: ['navbarCemetery', 'tabCemetery', 'bannerCemetery', 'galleryCemetery', 'serviceCarouselCemetery', 'additionalServiceCemetery']
      },
      CemeterySpaceComponent: {
        deps: ['navbarCemetery', 'tabCemetery']
      },
      CemeterySubspaceComponent: {
        deps: ['navbarCemetery', 'galleryCemetery'],
      },
      ParameterGeneralComponent: {
        deps: ['navbarCemetery', 'tabCemetery', 'bannerCemetery', 'serviceCarouselCemetery', 'additionalServiceCemetery']
      },
      ParameterSpaceComponent: {
        deps: ['navbarCemetery', 'tabCemetery']
      },
      ParameterSubspaceComponent: {
        deps: ['navbarCemetery', 'tabCemetery','popupParameter', 'uploadButtonCemetery', 'galleryCemetery']
      },
      bannerCemetery: {
        deps:['uploadButtonCemetery']
      },
      galleryCemetery: {
        deps:['uploadButtonCemetery']
      },
      serviceCarouselCemetery: {
        deps:['uploadButtonCemetery']
      },
      additionalServiceCemetery: {
        deps:['popupParameter']
      },
      popupParameter: {
        deps:['uploadButtonCemetery']
      }
    },
    packages: {}
  };
});
