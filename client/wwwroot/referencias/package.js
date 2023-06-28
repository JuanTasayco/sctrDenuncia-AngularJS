(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "referenciasPackage", [],
  function () {
    'use strict';
    return {
      lib: {
        'referenciasRoutes': {
          name: 'referenciasRoutes',
          path: '/referencias/app/app.routes'
        },
        'novitReferenciasTemplates': {
          name: 'novitReferenciasTemplates',
          path: '/referencias/template'
        },
        'appReferencias': {
          name: 'appReferencias',
          path: '/referencias/app/app'
        },
        'serviceReferencias': {
          name: 'serviceReferencias',
          path: '/referencias/app/proxy/serviceReferencias'
        },
        'localStorageService': {
          name: 'localStorageService',
          path: '/scripts/b_components/angular-local-storage/dist/angular-local-storage.min'
        },
        'angular-typeahead': {
          name: 'angular-typeahead',
          path: '/referencias/app/common/angular-typeahead.min'
        },
        'typeahead': {
          name: 'typeahead',
          path: '/referencias/app/common/typeahead.jquery.min'
        },
        'bloodhound': {
          name: 'bloodhound',
          path: '/referencias/app/common/bloodhound.min'
        },
        // Controladores
        'HomeController': {
          name: 'HomeController',
          path: '/referencias/app/home/home'
        },
        'RefsCrearController': {
          name: 'RefsCrearController',
          path: '/referencias/app/refsCrear/refsCrear'
        },
        'ResumenController': {
          name: 'ResumenController',
          path: '/referencias/app/resumen/resumen'
        },
        'editarRefsController': {
          name: 'EditarRefsController',
          path: '/referencias/app/editar-refs/editar-refs'
        },

        // Componentes
        'progressStepOne': {
          name: 'progressStepOne',
          path: '/referencias/app/components/progress/progress-step-one'
        },
        'progressStepTwo': {
          name: 'progressStepTwo',
          path: '/referencias/app/components/progress/progress-step-two'
        },
        'progressStepThree': {
          name: 'progressStepThree',
          path: '/referencias/app/components/progress/progress-step-three'
        },
        'progressStepFour': {
          name: 'progressStepFour',
          path: '/referencias/app/components/progress/progress-step-four'
        },
        'formFilters': {
          name: 'formFilters',
          path: '/referencias/app/components/filters/form-filters'
        },
        'modalRequerimientos': {
          name: 'modalRequerimientos',
          path: '/referencias/app/components/modals/modal-requerimientos'
        },
        'modalGrabarRefs': {
          name: 'modalGrabarRefs',
          path: '/referencias/app/components/modals/modal-grabar-refs'
        },
        'modalDetallep': {
          name: 'modalDetallep',
          path: '/referencias/app/components/modals/modal-detallep'
        },
        'modalRevisar': {
          name: 'modalRevisar',
          path: '/referencias/app/components/modals/modal-revisar'
        },
        'modalDetalled': {
          name: 'modalDetalled',
          path: '/referencias/app/components/modals/modal-detalled'
        },
        'modalAnular': {
          name: 'modalAnular',
          path: '/referencias/app/components/modals/modal-anular'
        },
        'modalDpdf': {
          name: 'modalDpdf',
          path: '/referencias/app/components/modals/modal-dpdf'
        },
        'mapaMapfre': {
          name: 'mapaMapfre',
          path: '/referencias/app/components/map/mapaClientes'
        },
        'referencias_security': {
          name: 'referencias_security',
          path: '/referencias/app/common/security/referencias.security'
        },
      },
      shim: {
        appReferencias: {
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
            'serviceReferencias',
            'angular-typeahead',
            'typeahead',
            'bloodhound',
            'novitReferenciasTemplates',
            'referencias_security'
          ]
        },
        novitReferenciasTemplates: {
          deps: ['angular']
        },
        'angular-typeahead': {
          deps: ['angular', 'typeahead', 'bloodhound']
        },
        bloodhound: {
          deps: ['jquery'],
          exports: 'Bloodhound'
        },
        typeahead: {
          deps: ['jquery'],
          init: function ($) {
            return require.s.contexts._.registry['typeahead.js'].factory($);
          }
        },
      },
      packages: {}
    };
  });
