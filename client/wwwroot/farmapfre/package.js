(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "farmapfrePackage", [],
  function() {
    'use strict';
    return {
      lib: {
        'farmapfreRoutes': {
          name: 'farmapfreRoutes',
          path: '/farmapfre/app/app.routes'
        },
        'novitFarmapfreTemplates': {
          name: 'novitFarmapfreTemplates',
          path: '/farmapfre/template'
        },
        'appFarmapfre': {
          name: 'appFarmapfre',
          path: '/farmapfre/app/app'
        },
        'serviceFarmapfre':{
          name:'serviceFarmapfre',
          path:'/farmapfre/app/proxy/serviceFarmapfre'
        },
        'orderRequestSearchComponent':{
          name:'orderRequestSearchComponent',
          path:'/farmapfre/app/order/clientrequest/orderRequestSearch/order-request-search-component'
        },
        'orderRequestItemComponent':{
          name:'orderRequestItemComponent',
          path:'/farmapfre/app/order/clientrequest/orderRequestItem/order-request-item-component'
        },
        'orderDispatchSearchComponent':{
          name:'orderDispatchSearchComponent',
          path:'/farmapfre/app/order/dispatch/dispatchSearch/dispatch-search.component'
        },
        'orderDispatchItemComponent':{
          name:'orderDispatchItemComponent',
          path:'/farmapfre/app/order/dispatch/dispatchItem/dispatch-item-component'
        },
        'filterOrderComponent':{
          name:'filterOrderComponent',
          path:"/farmapfre/app/components/filterOrder/filter-order-component"
        },
        'filterLocalPharmacyComponent':{
          name:'filterLocalPharmacyComponent',
          path:"/farmapfre/app/components/filterLocalPharmacy/filter-local-pharmacy-component"
        },
        'filterClinicComponent':{
          name:'filterClinicComponent',
          path:"/farmapfre/app/components/filterClinic/filter-clinic-component"
        },
        'infoClientComponent':{
          name:'infoClientComponent',
          path:"/farmapfre/app/components/infoClient/info-client-component"
        },
        'recipeVerificationComponent':{
          name:'recipeVerificationComponent',
          path:'/farmapfre/app/order/clientrequest/orderRequestItem/components/recipeVerification/recipe-verification-component'
        },
        'orderDeliveryPayComponent':{
          name:'orderDeliveryPayComponent',
          path:'/farmapfre/app/order/clientrequest/orderRequestItem/components/orderDeliveryPay/order-delivery-pay-component'
        },
        'mfpModalReportInfoSendEmail': {
          name:'mfpModalReportInfoSendEmail',
          path:'/farmapfre/app/resend/affiliate/modalReportInfoSendSmsEMail/modal-report-info-send-sms-email-component'
        },
        'mfpModalCancelOrder': {
          name:'mfpModalCancelOrder',
          path:'/farmapfre/app/order/clientrequest/orderRequestItem/components/modalCancelOrder/modal-cancel-order-component'
        },
        'mfpModalCancelDispatch': {
          name:'mfpModalCancelDispatch',
          path:'/farmapfre/app/order/dispatch/components/modalCancelDispatch/modal-cancel-dispatch-component'
        },
        'mpfModalTransferOrder': {
          name:'mpfModalTransferOrder',
          path:'/farmapfre/app/order/clientrequest/orderRequestItem/components/modalTransferOrder/modal-transfer-order-component'
        },
        'filterAffiliateComponent': {
          name:'filterAffiliateComponent',
          path:'/farmapfre/app/components/filterAffiliate/filter-affiliate-component'
        },
        'resendAffiliateComponent': {
          name:'resendAffiliateComponent',
          path:'/farmapfre/app/resend/affiliate/resend-affiliate-component'
        },
        'infoAuthorization': {
          name:'infoAuthorization',
          path:'/farmapfre/app/report/siteds/info-authotization-component'
        },
        'bodispatchItemMaintenanceComponent': {
          name:'bodispatchItemMaintenanceComponent',
          path:'/farmapfre/app/maintenance/boDispatch/components/bodispatch-item-maintenance-component'
        },
        'bodistrictItemMaintenanceComponent': {
          name:'bodistrictItemMaintenanceComponent',
          path:'/farmapfre/app/maintenance/boDistrict/components/bodistrict-item-maintenance-component'
        },
        'alliedpharmaciesItemMaintenanceComponent': {
          name:'alliedpharmaciesItemMaintenanceComponent',
          path:'/farmapfre/app/maintenance/alliedPharmacies/components/alliedpharmacies-item-maintenance-component'
        },
        'pharmacyclinicItemMaintenanceComponent': {
          name:'pharmacyclinicItemMaintenanceComponent',
          path:'/farmapfre/app/maintenance/pharmacyClinic/components/pharmacyclinic-item-maintenance-component'
        },
        'mpfModalGeneric': {
          name:'mpfModalGeneric',
          path:'/farmapfre/app/components/modalGeneric/modal-generic-component'
        },

        'userConfigItemMaintenanceComponent': {
          name:'userConfigItemMaintenanceComponent',
          path:'/farmapfre/app/maintenance/userConfig/components/userconfig-item-maintenance-component'
        },
        'orderConfigItemMaintenanceComponent': {
          name:'orderConfigItemMaintenanceComponent',
          path:'/farmapfre/app/maintenance/orderConfig/components/orderconfig-item-maintenance-component'
        },

        moment: {
          name: 'moment',
          path: '/scripts/b_components/moment/min/moment.min'
        },
        cropper: {
          name: 'cropper',
          path: '/scripts/b_components/cropperjs/dist/cropper.min'
        },
        farmConstants: {
          name: 'farmConstants',
          path:'/farmapfre/app/common/constants'
        },
      },
      shim: {
        appFarmapfre: {
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
            'serviceFarmapfre',
            'novitFarmapfreTemplates',
            'cropper'
          ]
        },
        novitFarmapfreTemplates:{
          deps:['angular']
        }
      },
      packages: {}
    };
  }
);