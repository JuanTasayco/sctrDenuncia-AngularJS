(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, "kpissaludPackage", [],
    function() {
      'use strict';
      return {
        lib: {
          'kpissaludRoutes': {
            name: 'kpissaludRoutes',
            path: '/kpissalud/app/app.routes'
          },
          'novitKpissaludTemplates': {
            name: 'novitKpissaludTemplates',
            path: '/kpissalud/template'
          },
          'appKpissalud': {
            name: 'appKpissalud',
            path: '/kpissalud/app/app'
          },
          'serviceKpissalud': {
            name:'serviceKpissalud',
            path:'/kpissalud/app/proxy/serviceKpissalud'
          },
          'localStorageService': {
            name: 'localStorageService',
            path: '/scripts/b_components/angular-local-storage/dist/angular-local-storage.min'
          },
          /* Libreria de graficos */
          'amexport':{
            name: 'amexport',
            path: '/kpissalud/resources/scripts/vendor/amGraph/plugins/export.min'
          },
          'amcharts':{
            name: 'amcharts',
            path: '/kpissalud/resources/scripts/vendor/amGraph/amcharts'
          },
          'amchartsSerial':{
            name: 'amchartsSerial',
            path: '/kpissalud/resources/scripts/vendor/amGraph/serial'
          },
          'amchartsPie':{
            name: 'amchartsPie',
            path: '/kpissalud/resources/scripts/vendor/amGraph/pie'
          },
          'amchartsThemes':{
            name: 'amchartsThemes',
            path: '/kpissalud/resources/scripts/vendor/amGraph/themes/light'
          },
          'chart': {
            name: "chart",
            path: "/scripts/b_components/chart.js/dist/Chart.bundle"
          },
          // Controladores
          'HomeController': {
            name:'HomeController',
            path:'/kpissalud/app/home/home'
          },
          'KpiSiniestroController': {
            name:'KpiSiniestroController',
            path:'/kpissalud/app/kpiSiniestro/kpiSiniestro'
          },
          'KpiCgwController':{
            name:'KpiCgwController',
            path:'/kpissalud/app/kpiCgw/kpiCgw'
          },
          'KpiConfiguracionController':{
            name:'KpiConfiguracionController',
            path:'/kpissalud/app/kpiConfiguracion/kpiConfiguracion'
          },
          // Componentes
          'tabProducts':{
            name:'tabProducts',
            path:'/kpissalud/app/components/products/tab-products'
          },
          'formFilters':{
            name:'formFilters',
            path:'/kpissalud/app/components/filters/form-filters'
          },
          'modalFormFilters':{
            name:'modalFormFilters',
            path:'/kpissalud/app/components/filters/modal-form-filters'
          },
          'listFilters':{
            name:'listFilters',
            path:'/kpissalud/app/components/filters/list-filters'
          },
          'chartComponent': {
            name:'chartComponent',
            path:'/kpissalud/app/components/indicators/chart-component'
          },
          'chartTextComponent': {
            name:'chartTextComponent',
            path:'/kpissalud/app/components/indicators/chart-text-component'
          },
          'modalChartData': {
            name:'modalChartData',
            path:'/kpissalud/app/components/indicators/modal-chart-data'
          },
          'configChart': {
            name:'configChart',
            path:'/kpissalud/app/common/configChart'
          },
          'formSetting': {
            name:'formSetting',            
            path:'/kpissalud/app/components/setting/form-setting'
          }
        },
        shim: {
          appKpissalud: {
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
              'serviceKpissalud',
              'configChart',
              'novitKpissaludTemplates'
            ]
          },
          novitKpissaludTemplates: {
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