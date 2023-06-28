(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, "atencionsiniestrosagricolaPackage", [],
    function() {
      'use strict';
      return {
        lib: {
          'atencionsiniestrosagricolaRoutes': {
            name: 'atencionsiniestrosagricolaRoutes',
            path: '/atencionsiniestrosagricola/app/app.routes'
          },
          'novitAtencionsiniestrosagricolaTemplates': {
            name: 'novitAtencionsiniestrosagricolaTemplates',
            path: '/atencionsiniestrosagricola/template'
          },
          'appAtencionsiniestrosagricola': {
            name: 'appAtencionsiniestrosagricola',
            path: '/atencionsiniestrosagricola/app/app'
          },
          'serviceAtencionsiniestrosagricola': {
            name:'serviceAtencionsiniestrosagricola',
            path:'/atencionsiniestrosagricola/app/proxy/serviceAtencionsiniestrosagricola'
          },
          'localStorageService': {
            name: 'localStorageService',
            path: '/scripts/b_components/angular-local-storage/dist/angular-local-storage.min'
          },
          /* Libreria de graficos */
          'amexport':{
            name: 'amexport',
            path: '/atencionsiniestrosagricola/resources/scripts/vendor/amGraph/plugins/export.min'
          },
          'amcharts':{
            name: 'amcharts',
            path: '/atencionsiniestrosagricola/resources/scripts/vendor/amGraph/amcharts'
          },
          'amchartsSerial':{
            name: 'amchartsSerial',
            path: '/atencionsiniestrosagricola/resources/scripts/vendor/amGraph/serial'
          },
          'amchartsPie':{
            name: 'amchartsPie',
            path: '/atencionsiniestrosagricola/resources/scripts/vendor/amGraph/pie'
          },
          'amchartsThemes':{
            name: 'amchartsThemes',
            path: '/atencionsiniestrosagricola/resources/scripts/vendor/amGraph/themes/light'
          },
          'chart': {
            name: "chart",
            path: "/scripts/b_components/chart.js/dist/Chart.bundle"
          },
          // Controladores
          'AvisoController':{
            name:'AvisoController',
            path:'/atencionsiniestrosagricola/app/aviso/aviso'
          },
          'HomeController': {
            name:'HomeController',
            path:'/atencionsiniestrosagricola/app/home/home'
          },
          'KpiSiniestroController': {
            name:'KpiSiniestroController',
            path:'/atencionsiniestrosagricola/app/kpiSiniestro/kpiSiniestro'
          },
          'KpiCgwController':{
            name:'KpiCgwController',
            path:'/atencionsiniestrosagricola/app/kpiCgw/kpiCgw'
          },
          'KpiConfiguracionController':{
            name:'KpiConfiguracionController',
            path:'/atencionsiniestrosagricola/app/kpiConfiguracion/kpiConfiguracion'
          },          
          'RegistrarAvisoController':{
            name:'RegistrarAvisoController',
            path:'/atencionsiniestrosagricola/app/aviso/registrarAviso'
          },          
          'ModalContacto':{
            name:'ModalContacto',
            path:'/atencionsiniestrosagricola/app/consultaAvisoSiniestro/components/modalContacto/modalContacto'
          },          
          // Componentes
          'formAviso': {
            name:'formAviso',            
            path:'/atencionsiniestrosagricola/app/components/aviso/form-aviso'
          },
          'tabUsuarioCampania': {
            name:'tabUsuarioCampania',            
            path:'/atencionsiniestrosagricola/app/campanias/controllers/tab/tab-usuario-campania'
          },
          'tabGrupoCultivoCampania': {
            name:'tabGrupoCultivoCampania',            
            path:'/atencionsiniestrosagricola/app/campanias/controllers/tab/tab-grupocultivo-campania'
          },
          'tabGrupoParametroCampania': {
            name:'tabGrupoParametroCampania',            
            path:'/atencionsiniestrosagricola/app/campanias/controllers/tab/tab-grupoparametro-campania'
          },
          'tabSectorEstadCampania': {
            name:'tabSectorEstadCampania',            
            path:'/atencionsiniestrosagricola/app/campanias/controllers/tab/tab-sectorestad-campania'
          },
          'tabRelSectorCultivoCampania': {
            name:'tabRelSectorCultivoCampania',            
            path:'/atencionsiniestrosagricola/app/campanias/controllers/tab/tab-relsectorcultivo-campania'
          },
          'tabProducts':{
            name:'tabProducts',
            path:'/atencionsiniestrosagricola/app/components/products/tab-products'
          },
          'formFilters':{
            name:'formFilters',
            path:'/atencionsiniestrosagricola/app/components/filters/form-filters'
          },
          'modalFormFilters':{
            name:'modalFormFilters',
            path:'/atencionsiniestrosagricola/app/components/filters/modal-form-filters'
          },
          'listFilters':{
            name:'listFilters',
            path:'/atencionsiniestrosagricola/app/components/filters/list-filters'
          },
          'chartComponent': {
            name:'chartComponent',
            path:'/atencionsiniestrosagricola/app/components/indicators/chart-component'
          },
          'chartTextComponent': {
            name:'chartTextComponent',
            path:'/atencionsiniestrosagricola/app/components/indicators/chart-text-component'
          },
          'modalChartData': {
            name:'modalChartData',
            path:'/atencionsiniestrosagricola/app/components/indicators/modal-chart-data'
          },
          'configChart': {
            name:'configChart',
            path:'/atencionsiniestrosagricola/app/common/configChart'
          },
          'formSetting': {
            name:'formSetting',            
            path:'/atencionsiniestrosagricola/app/components/setting/form-setting'
          },
          'ConsultaAvisoSiniestroController': {
            name: 'ConsultaAvisoSiniestroController', 
            path: '/atencionsiniestrosagricola/app/controller/consulta-aviso-siniestro.js'
          },
          'mfpModalQuestion': {
            name: 'mfpModalQuestion',
            path: '/atencionsiniestrosagricola/app/consultaAvisoSiniestro/components/modalQuestion/modalQuestion.component'
          },
          'ModalReapertura': {
            name: 'ModalReapertura',
            path: '/atencionsiniestrosagricola/app/consultaAvisoSiniestro/components/modalReapertura/modalReapertura'
          }
        },
        shim: {
          appAtencionsiniestrosagricola: {
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
              'amchartsSerial',
              'amchartsThemes',
              'amchartsPie',
              'amexport',
              'serviceAtencionsiniestrosagricola',
              'configChart',
              'novitAtencionsiniestrosagricolaTemplates'
            ]
          },
          novitAtencionsiniestrosagricolaTemplates: {
            deps:['angular']
          },
          amexport: {
            deps:['amcharts']
          },
          amchartsPie: {
            deps:['amcharts']
          },
          amchartsSerial: {
            deps:['amcharts']
          },
          amchartsThemes: {
            deps:['amchartsSerial']
          },
          chartComponent: {
            deps:['amchartsThemes']
          }
        },
        packages: {}
      };
    });