(function (factory) {
  define(factory);
})(function () {
  return {
    lib: {
      'proxyRenovacion': {
        name: 'proxyRenovacion',
        path: '/renovacion/app/proxy/renovacionService'
      },
      'renovacionTemplates': {
        name: 'renovacionTemplates',
        path: '/renovacion/renovacion.Templates'
      },
      'mpfModalTemplate': {
        name: "mpfModalTemplate",
        path: '/polizas/app/plantillas/modal/modalTemplate'
      },
      "renovacion_routes": {
        name: 'renovacion_routes',
        path: '/renovacion/app/app.routes'
      },
      'appRenovacion': {
        name: 'appRenovacion',
        path: '/renovacion/app/app'
      },
      'homeRenovacion': {
        name: 'homeRenovacion',
        path: '/renovacion/app/homeRenovacion'
      },
      'renovacionFactory': {
        name: 'renovacionFactory',
        path: '/renovacion/app/renovacion.factory'
      },
      'consultaRenovacionController': {
        name: 'consultaRenovacionController',
        path: '/renovacion/app/renovacion/components/bandeja/consulta-renovacion'
      },
      'mpfFiltroRenovacion': {
        name: 'mpfFiltroRenovacion',
        path: '/renovacion/app/renovacion/components/filtro/consulta-renovacion-filtro.directive'
      },
      'gestionProcesoController': {
        name: 'gestionProcesoController',
        path: '/renovacion/app/renovacion/components/gestion/gestion-proceso'
      },
      'renovacionBandejaFactory': {
        name: 'renovacionBandejaFactory',
        path: '/renovacion/app/renovacion/providers/renovacionBandeja.factory'
      },
      'renovacionBandejaService': {
        name: 'renovacionBandejaService',
        path: '/renovacion/app/renovacion/providers/renovacionBandeja.service'
      }
    },
    shim: {
      appRenovacion: {
        deps: [
          'angular_ui_route',
          'uIBootstrap',
          'oim_ocLazyLoad',
          'oim_layout',
          'lodash',
          'proxyRenovacion',
          'proxyLogin',
          'oim_security'
        ]
      },
      proxyRenovacion: { deps: ['wrap_gaia'] },
      renovacionTemplates: { deps: ['angular'] }
    },
    packages: {}
  };
});
