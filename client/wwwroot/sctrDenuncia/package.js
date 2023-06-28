(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "sctrDenunciaPackage", [],
  function () {
    'use strict';
    return {
      lib: {

        'sctrDenunciaRoutes': {
          name: 'sctrDenunciaRoutes',
          path: '/sctrDenuncia/app/app.routes'
        },
        'complaintIndexController': {
          name: 'complaintIndexController',
          path: '/sctrDenuncia/app/complaint/index-controller'
        },
        'novitSctrDenunciaTemplates': {
          name: 'novitSctrDenunciaTemplates',
          path: '/sctrDenuncia/template'
        },

        'appSctrDenuncia': {
          name: 'appSctrDenuncia',
          path: '/sctrDenuncia/app/app'
        },

        'serviceSctrDenuncia': {
          name: 'serviceSctrDenuncia',
          path: '/sctrDenuncia/app/proxy/serviceSctrDenuncia'
        },

        'complaintEditorDetailComponent': {
          name: 'complaintEditorDetailComponent',
          path: '/sctrDenuncia/app/complaint/complaintEditor/detail/complaint-editor-detail'
        },
        'complaintHistoryComponent': {
          name: 'complaintHistoryComponent',
          path: '/sctrDenuncia/app/complaint/complaintEditor/history/complaint-history'
        },
        'complaintEditorManagementComponent': {
          name: 'complaintEditorManagementComponent',
          path: '/sctrDenuncia/app/complaint/complaintEditor/management/complaint-editor-managment'
        },
        'complaintEditorContainerComponent': {
          name: 'complaintEditorContainerComponent',
          path: '/sctrDenuncia/app/complaint/complaintEditor/container-component'
        },

        'complaintSearchFilterComponent': {
          name: 'complaintSearchFilterComponent',
          path: '/sctrDenuncia/app/complaint/search/filter/complaint-search-filter'
        },
        'complaintSearchResultComponent': {
          name: 'complaintSearchResultComponent',
          path: '/sctrDenuncia/app/complaint/search/result/complaint-search-result'
        },
        'complaintSearchContainerComponent': {
          name: 'complaintSearchContainerComponent',
          path: '/sctrDenuncia/app/complaint/search/container-component'
        },

        'coveragesSearchFilterComponent': {
          name: 'coveragesSearchFilterComponent',
          path: '/sctrDenuncia/app/complaint/coveragesSiteds/filter/coverages-search-filter'
        },
        'coveragesSearchResultComponent': {
          name: 'coveragesSearchResultComponent',
          path: '/sctrDenuncia/app/complaint/coveragesSiteds/result/coverages-search-result'
        },
        'coveragesSearchComponent': {
          name: 'coveragesSearchComponent',
          path: '/sctrDenuncia/app/complaint/coveragesSiteds/container-component'
        },


        'complaintNewComponent': {
          name: 'complaintNewComponent',
          path: '/sctrDenuncia/app/complaint/complaintNew/input/complaint-input'
        },
        'complaintNewContainerComponent': {
          name: 'complaintNewContainerComponent',
          path: '/sctrDenuncia/app/complaint/complaintNew/container.component'
        },

        // SCTR INVALIDEZ
        'complaintHomeContainerComponent': {
          name: 'complaintHomeContainerComponent',
          path: '/sctrDenuncia/app/complaint/home/home-component'
        },

        'complaintDisabilitySearchFilterComponent': {
          name: 'complaintDisabilitySearchFilterComponent',
          path: '/sctrDenuncia/app/complaint/disabilitySearch/filter/complaint-search-filter'
        },
        'complaintDisabilitySearchResultComponent': {
          name: 'complaintDisabilitySearchResultComponent',
          path: '/sctrDenuncia/app/complaint/disabilitySearch/result/complaint-search-result'
        },
        'complaintDisabilitySearchContainerComponent': {
          name: 'complaintDisabilitySearchContainerComponent',
          path: '/sctrDenuncia/app/complaint/disabilitySearch/container-component'
        },

        'complaintDisabilityNewComponent': {
          name: 'complaintDisabilityNewComponent',
          path: '/sctrDenuncia/app/complaint/disabilityNew/input/complaint-input'
        },
        'complaintDisabilityNewContainerComponent': {
          name: 'complaintDisabilityNewContainerComponent',
          path: '/sctrDenuncia/app/complaint/disabilityNew/container.component'
        },

        'complaintDisabilityEditorDetailComponent': {
          name: 'complaintDisabilityEditorDetailComponent',
          path: '/sctrDenuncia/app/complaint/disabilityEditor/detail/complaint-editor-detail'
        },
        'complaintDisabilityHistoryComponent': {
          name: 'complaintDisabilityHistoryComponent',
          path: '/sctrDenuncia/app/complaint/disabilityEditor/history/complaint-history'
        },
        'complaintDisabilityEditorMedicalAppointmentComponent': {
          name: 'complaintDisabilityEditorMedicalAppointmentComponent',
          path: '/sctrDenuncia/app/complaint/disabilityEditor/medicalAppointment/complaint-editor-medical-appointment'
        },
        'complaintDisabilityEditorMedicalAuditComponent': {
          name: 'complaintDisabilityEditorMedicalAuditComponent',
          path: '/sctrDenuncia/app/complaint/disabilityEditor/medicalAudit/complaint-editor-medical-audit'
        },
        'complaintDisabilityEditorContainerComponent': {
          name: 'complaintDisabilityEditorContainerComponent',
          path: '/sctrDenuncia/app/complaint/disabilityEditor/container-component'
        },

        //Modals
        'modalsearchpolicy': {
          name: 'modalsearchpolicy',
          path: '/sctrDenuncia/app/components/modals/modal-searchpolicy'
        },
        'modaldenuncias': {
          name: 'modaldenuncias',
          path: '/sctrDenuncia/app/components/modals/modal-denuncias'
        },
        'modalnuevoafiliado': {
          name: 'modalnuevoafiliado',
          path: '/sctrDenuncia/app/components/modals/modal-nuevo-afiliado'
        }

      },
      shim: {
        appSctrDenuncia: {
          deps: [
            'wrap_gaia',
            'angular_route',
            'angular_ocLazyLoad',
            'angular_ui_route',
            'oim_ocLazyLoad',
            'oim_theme_service',
            'oim_commons',
            'mDirective',
            'oim_layout',
            'serviceSctrDenuncia',
            'novitSctrDenunciaTemplates',
            'fileSaver'
          ]
        },
        novitSctrDenunciaTemplates: {
          deps: ['angular']
        }

      },
      packages: {}
    };
  });