(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, "medicalCenterPackage", [],
    function() {
      'use strict';
      return {
        lib: {
          'medicalCenterRoutes': {
            name: 'medicalCenterRoutes',
            path: '/medicalCentral/app/app.routes'
          },
          'novitMedicalCenterTemplates': {
            name: 'novitMedicalCenterTemplates',
            path: '/medicalCentral/template'
          },
       
          'appMedicalCenter': {
            name: 'appMedicalCenter',
            path: '/medicalCentral/app/app'
          },
          'mcReportContainer': {
            name: 'mcReportContainer',
            path: '/medicalCentral/app/dashboard/common/components/container'
          },
          'reportFilter': {
            name: 'reportFilter',
            path: '/medicalCentral/app/dashboard/common/components/filterPanel'
          },
          'serviceMedicalCenter':{
            name: 'serviceMedicalCenter',
            path: '/medicalCentral/app/proxy/serviceMedicalCenter'
          },
          'dataTransform':{
            name: 'dataTransform',
            path: '/medicalCentral/app/dashboard/common/dataTransform'
          },
          'rendererCharReportWeb':{
            name: 'rendererCharReportWeb',
            path: '/medicalCentral/app/dashboard/common/rendererCharReportWeb'
          },
          mcReportController:{
            name:'mcReportController',
            path: '/medicalCentral/app/dashboard/common/reportController'
          },
          /*BEGIN report*/
          'consultationsBySpecialtyChart': {
            name: 'consultationsBySpecialtyChart',
            path: '/medicalCentral/app/dashboard/consultationsBySpecialty/components/parts/chart'
          },
          'consultationsBySpecialtyBarChart': {
            name: 'consultationsBySpecialtyBarChart',
            path: '/medicalCentral/app/dashboard/consultationsBySpecialty/components/parts/barChart'
          },
          'consultationsBySpecialtyMatrix': {
            name: 'consultationsBySpecialtyMatrix',
            path: '/medicalCentral/app/dashboard/consultationsBySpecialty/components/parts/matrix'
          },

          'demandStructureChart': {
            name: 'demandStructureChart',
            path: '/medicalCentral/app/dashboard/demandStructure/components/parts/chart'
          },
          'demandStructureMatrix': {
            name: 'demandStructureMatrix',
            path: '/medicalCentral/app/dashboard/demandStructure/components/parts/matrix'
          },

          'ocupabilityBySpecialtyMatrix': {
            name: 'ocupabilityBySpecialtyMatrix',
            path: '/medicalCentral/app/dashboard/ocupabilityBySpecialty/components/parts/matrix'
          },

          'portfolioRaisingChart': {
            name: 'portfolioRaisingChart',
            path: '/medicalCentral/app/dashboard/portfolioRaising/components/parts/chart'
          },
          'portfolioRaisingMatrix': {
            name: 'portfolioRaisingMatrix',
            path: '/medicalCentral/app/dashboard/portfolioRaising/components/parts/matrix'
          },

          
          'structureBillingByConceptMatrix': {
            name: 'structureBillingByConceptMatrix',
            path: '/medicalCentral/app/dashboard/structureBillingByConcept/components/parts/matrix'
          },

          'structureBillingByPortfolioChart': {
            name: 'structureBillingByPortfolioChart',
            path: '/medicalCentral/app/dashboard/structureBillingByPortfolio/components/parts/chart'
          },
          'structureBillingByPortfolioMatrix': {
            name: 'structureBillingByPortfolioMatrix',
            path: '/medicalCentral/app/dashboard/structureBillingByPortfolio/components/parts/matrix'
          },



          'monthlyPurchasesBarChart':{
            name:'monthlyPurchasesBarChart',
            path:'/medicalCentral/app/dashboard/monthlyPurchases/components/parts/barChart'
          },
          'monthlyPurchasesMatrix':{
            name:'monthlyPurchasesMatrix',
            path:'/medicalCentral/app/dashboard/monthlyPurchases/components/parts/matrix'
          },
          'monthlyPurchasesPieChart':{
            name:'monthlyPurchasesPieChart',
            path:'/medicalCentral/app/dashboard/monthlyPurchases/components/parts/pieChart'
          },


          'salesByCustomerBarChart':{
            name:'salesByCustomerBarChart',
            path:'/medicalCentral/app/dashboard/salesByCustomer/components/parts/barChart'
          },
          'salesByCustomerMatrix':{
            name:'salesByCustomerMatrix',
            path:'/medicalCentral/app/dashboard/salesByCustomer/components/parts/matrix'
          },
          'salesByCustomerPieChart':{
            name:'salesByCustomerPieChart',
            path:'/medicalCentral/app/dashboard/salesByCustomer/components/parts/pieChart'
          },


          'salesToMapfreSeatBarChart':{
            name:'salesToMapfreSeatBarChart',
            path:'/medicalCentral/app/dashboard/salesToMapfreSeat/components/parts/barChart'
          },
          'salesToMapfreSeatMatrix':{
            name:'salesToMapfreSeatMatrix',
            path:'/medicalCentral/app/dashboard/salesToMapfreSeat/components/parts/matrix'
          },

          'portfolioGrowthChart':{
            name:'portfolioGrowthChart',
            path:'/medicalCentral/app/dashboard/portfolioGrowth/components/parts/chart'
          },
          'portfolioGrowthMatrix':{
            name:'portfolioGrowthMatrix',
            path:'/medicalCentral/app/dashboard/portfolioGrowth/components/parts/matrix'
          },

          'specialityGrowthChart':{
            name:'specialityGrowthChart',
            path:'/medicalCentral/app/dashboard/specialityGrowth/components/parts/chart'
          },
          'specialityGrowthMatrix':{
            name:'specialityGrowthMatrix',
            path:'/medicalCentral/app/dashboard/specialityGrowth/components/parts/matrix'
          },

          /*END report*/
          /*VENDOR*/
          'amexport':{
            name: 'amexport',
            path: '/medicalCentral/resources/scripts/vendor/amGraph/plugins/export.min'
          },
          'amcharts':{
            name: 'amcharts',
            path: '/medicalCentral/resources/scripts/vendor/amGraph/amcharts'
          },
          'amchartsSerial':{
            name: 'amchartsSerial',
            path: '/medicalCentral/resources/scripts/vendor/amGraph/serial'
          },
          'amchartsPie':{
            name: 'amchartsPie',
            path: '/medicalCentral/resources/scripts/vendor/amGraph/pie'
          },
          'amchartsThemes':{
            name: 'amchartsThemes',
            path: '/medicalCentral/resources/scripts/vendor/amGraph/themes/light'
          },
          'multiselect': {
            name: 'multiselect',
            path: '/medicalCentral/resources/scripts/vendor/dropdown/multiselect'
          }
          /*VENDOR*/
        },
        shim: {
          appMedicalCenter: {
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
              'serviceMedicalCenter',
              'dataTransform',
              'amchartsSerial',
              'amchartsThemes',
              'amchartsPie',
              'amexport',
              'novitMedicalCenterTemplates',
              'multiselect'
            ]
          },
          novitMedicalCenterTemplates:{
            deps:['angular']
          },
          multiselect:{
            deps:['angular']
          },
          amexport:{
            deps:['amcharts']
          },
          amchartsPie:{
            deps:['amcharts']
          },
          amchartsSerial:{
            deps:['amcharts']
          },
          amchartsThemes:{
            deps:['amchartsSerial']
          },
          mcReportContainer:{
            deps: ['reportFilter']
          }
        },
        packages: {}
      };
    });