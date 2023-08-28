(function(factory) {
    define(factory);
})(function() {
    return {
        lib: {
            /* LIBS ANGULAR */
            "angular": {
                name: 'angular',
                path: "/scripts/b_components/angular/angular.min"
            },
            'uiTree': {

                name: 'uiTree',

                path: '/scripts/b_components/angular-ui-tree/dist/angular-ui-tree.min'

              },
            'satellizer': {
                name: 'satellizer',
                path: "/scripts/b_components/satellizer/dist/satellizer"
            },
            "angular_base64_upload": {
                name: 'angular_base64_upload',
                path: "/scripts/b_components/angular-base64-upload/dist/angular-base64-upload.min"
            },
            "angular_route": {
                name: 'angular_route',
                path: "/scripts/b_components/angular-route/angular-route.min"
            },
            "angular_ui_route": {
                name: 'angular_ui_route',
                path: "/scripts/b_components/angular-ui-router/release/angular-ui-router.min"
            },
            "angular_animate": {
                name: 'angular_animate',
                path: "/scripts/b_components/angular-animate/angular-animate.min"
            },
            "angular_sanitize": {
                name: 'angular_sanitize',
                path: "/scripts/b_components/angular-sanitize/angular-sanitize.min"
            },

            "angular_cookies": {
                name: "angular_cookies",
                path: "/scripts/b_components/angular-cookies/angular-cookies.min"
            },
            "angular_ocLazyLoad": {
                name: "angular_ocLazyLoad",
                path: "/scripts/b_components/oclazyload/dist/ocLazyLoad.require.min"
            },
            "angular_messages": {
                name: "angular_messages",
                path: "/scripts/b_components/angular-messages/angular-messages.min"
            },

            'uIBootstrap': {
                name: "uIBootstrap",
                path: "/scripts/b_components/angular-bootstrap/ui-bootstrap-tpls.min"
            },
            'uiSelect': {
                name: "uiSelect",
                path: "/scripts/fixBComp/select"
            },
            /* JQUERY LIB */
            "jquery": {
                name: "jquery",
                path: "/scripts/b_components/jquery/dist/jquery.min"
            },

            "_skylo": {
                name: "_skylo",
                path: "/scripts/b_components/skylo/vendor/scripts/skylo"
            },
            'spin': {
                name: "spin",
                path: "/scripts/plugins/spin.min"
            },
            'lodash': {
                name: "lodash",
                path: "/scripts/b_components/lodash/dist/lodash.compat.min"
            },
            'images-resizer': {
                name: 'images-resizer',
                path: '/scripts/plugins/angular-images-resizer'
            },
            'crypto-js': {
                name: 'crypto-js',
                path: '/scripts/b_components/crypto-js/crypto-js'
            },
            'quill': {
              name: 'quill',
              path: '/scripts/quill/quill.min'
            },
            'ngQuill': {
              name: 'ngQuill',
              path: '/scripts/quill/ng-quill'
            },

          /* OTHER */
            'bootstrapToggle': {
              name: 'bootstrapToggle',
              path: '/scripts/b_components/bootstrap-toggle/js/bootstrap2-toggle'
            },
            "underscore": {
                name: "underscore",
                path: "/scripts/b_components/underscore/underscore-min"
            },

            'gaia': {
                name: "gaia",
                path: "/scripts/gaiafrontend/js/gaiafrontend"
            },
            'gaia_utlis': {
                name: "gaia_utlis",
                path: "/scripts/gaiafrontend/js/directives/utils"
            },
			'jszip': {
                name: "jszip",
                path: "/scripts/plugins/excel/jszip"
            },
            'xlsx': {
                name: "xlsx",
                path: "/scripts/plugins/excel/xlsx.min"
            },
            'jsPdf': {
                name: "jsPdf",
                path: "/scripts/plugins/pdf/jspdf"
            },
            'pdfLib': {
                name: "pdfLib",
                path: "/scripts/plugins/pdf/pdf-lib.min"
            },

            /*  INFRAESTRUCTURE  */
            'constants': {
                name: "constants",
                path: "/scripts/constants"
            },
            'helper': {
                name: "helper",
                path: "/scripts/helper"
            },
            'oim_security': {
                name: 'oim_security',
                path: '/app/security/oim.security'
            },

            'mDirective': {
                name: "mDirective",
                path: '/scripts/mpf-main-controls/directives/directive'
            },
            'mMainServices': {
                name: "mMainServices",
                path: '/scripts/mpf-main-controls/services/services'
            },
            'mTemplates': {
                name: "mTemplates",
                path: '/scripts/mpf-main-controls/html/templates'
            },
            'oim_ocLazyLoad': {
                name: "oim_ocLazyLoad",
                path: '/scripts/oim.oclazyload'
            },
            'oim_theme_service': {
                name: "oim_theme_service",
                path: '/scripts/oim.theme.service'
            },
            'wrap_gaia': {
                name: "wrap_gaia",
                path: '/scripts/wrapgaia'
            },
            'mapfre_spinner': {
                name: "mapfre_spinner",
                path: '/scripts/plugins/jquery.mapfre.spiner'
            },

            'linqjs': {
                name: "linqjs",
                path: '/scripts/plugins/jquery.linq.min'
            },
            'jinqJs': {
                name: "jinqJs",
                path: '/scripts/b_components/jinqJs/jinqjs.min'
            },
            'swal': {
                name: "swal",
                path: '/scripts/b_components/sweetalert2/dist/sweetalert2.min'
            },
            'ES6Promise': {
                name: "ES6Promise",
                path: '/scripts/b_components/es6-promise/es6-promise.min'
            },
            'ES6Register': {
                name: "ES6Register",
                path: '/app/es6-register'
            },
            'proxyLogin': {
                name: "proxyLogin",
                path: '/app/proxy/serviceLogin'
            },
            'proxyTrip': {
              name: "proxyTrip",
              path: '/app/polizas/seguroviaje/proxy/serviceSeguroViaje'
            },
            'oim_commons': {
                name: "oim_commons",
                path: "/scripts/oim.commons"

            },
            'modalSendEmailmodalSendEmail': {
                name: "modalSendEmail",
                path: '/scripts/mpf-main-controls/components/modalSendEmail/component/modalSendEmail'
            },
            'ubigeo': {
                name: "ubigeo",
                path: "/scripts/mpf-main-controls/components/ubigeo/component/ubigeo"
            },

            'fileSaver': {
                name: "fileSaver",
                path: "/scripts/plugins/file-saver/FileSaver"
            },
            'angular_file_saver': {
                name: "angular_file_saver",
                path: "/scripts/plugins/file-saver/angular-file-saver.min"
            },
            'angularES-PE': {
                name: 'angularES-PE',
                path: '/scripts/b_components/angular-i18n/angular-locale_es-pe'
            },
            'ui-mask': {
                name: 'ui-mask',
                path: '/scripts/b_components/angular-ui-mask/dist/mask'
            },
            mxPaginador: {
              name: 'mxPaginador',
              path: '/scripts/mpf-main-controls/components/mx-paginador/mx-paginador.component'
            },
            mxImageUploader: {
              name: 'mxImageUploader',
              path: '/scripts/mpf-main-controls/components/mx-image-uploader/mx-image-uploader.component'
            },
            oimUsers: {
              name: 'oimUsers',
              path: '/scripts/oimUsers'
            },
            oimGoogleAnalytics: {
              name: 'oimGoogleAnalytics',
              path: '/scripts/google-analytics/google-analytics'
            },
            'mpfModalImage': {
                name: "mpfModalImage",
                path: '/scripts/mpf-main-controls/components/modalImage/component/modalImage.component'
            },
            'mpfModalQuestion': {
                name: "mpfModalQuestion",
                path: '/scripts/mpf-main-controls/components/modalQuestion/modalQuestion.component'
            },
            "mpfPersonComponent": {
                name: "mpfPersonComponent",
                path: "/scripts/mpf-main-controls/components/mpf-person/components/mpf-person.controller"
            },
            "mpfPersonFactory": {
              name: "mpfPersonFactory",
              path: "/scripts/mpf-main-controls/components/mpf-person/service/mpf-person.factory"
            },
            "mpfPersonDirective": {
              name: "mpfPersonDirective",
              path: "/scripts/mpf-main-controls/components/mpf-person/directive/mpf-person.directive"
            },
            "mpfPersonConstants": {
                name: "mpfPersonConstants",
                path: "/scripts/mpf-main-controls/components/mpf-person/settings/constants"
            },
            'mpfModalConfirmationSteps': {
                name: "mpfModalConfirmationSteps",
                path: '/scripts/mpf-main-controls/components/modalSteps/component/modalSteps'
            },
            lyra: {
                name: 'lyra',
                path: '/scripts/mpf-main-controls/components/lyra/lyra.component'
            },
      /* Firma */
            signature: {
                name: 'signature',
                path: '/scripts/mpf-main-controls/components/signature/pad/signature.component'
            },
            'signature-panel': {
                name: 'signature-panel',
                path: '/scripts/mpf-main-controls/components/signature/panel/signature-panel.component'
            },
            'signature-panel.factory': {
                name: 'signature-panel.factory',
                path: '/scripts/mpf-main-controls/components/signature/panel/signature-panel.factory'
            },
            originSystem: {
                name: 'originSystem',
                path: '/scripts/origin-system'
            },
            storageManager: {
                name: 'storageManager',
                path: '/scripts/storage-manager'
            },
            proxyHome: {
                name: "proxyHome",
                path: '/mydream/app/proxy/serviceMyDream'
              },
            directiveUtils: {
                name: 'directiveUtils',
                path: '/scripts/mpf-main-controls/directives/directive.utils'
            },
            mpfCardFilter: {
              name: "mpfCardFilter",
              path: "/scripts/mpf-main-controls/components/card-filter/card-filter.component"
            },
        },
        shim: {
            'uiTree':{

                deps:[

                  'angular'

                ]

              },
            jquery: { exports: '$' },
            lodash: { exports: '_' },
            angular: { exports: 'angular' },
            'angularES-PE': { deps: ['angular'] },
            satellizer: { deps: ['angular'] },
            angular_route: { deps: ['angular'] },
            angular_base64_upload: { deps: ['angular'] },
            angular_animate: { deps: ['angular'] },
            angular_ui_route: { deps: ['angular'] },
            angular_ocLazyLoad: { deps: ['angular'] },
            angular_sanitize: { deps: ['angular'] },
            angular_messages: { deps: ['angular'] },
            uIBootstrap: { deps: ['angular_animate', 'angular_sanitize', 'angularES-PE'] },
            uiSelect: { deps: ['angular_sanitize'] },
            _skylo: { deps: ['jquery'] },
            spin: { deps: ['jquery'], exports: 'Spinner' },
            mapfre_spinner: { deps: ['spin'] },
            'ui-mask': { deps: ['angular', 'jquery'] },

            pdfLib: { exports: 'PDFLib', init: function(){return window.PDFLib}},
            jsPdf: { exports:'jsPDF',init: function(){return window.jspdf.jsPDF} },
            xlsx: { deps:['jszip'], exports:'XLSX', init: function(){return window.XLSX}},
			swal: { deps: ['ES6Register'] },
            oim_theme_service: { deps: ['angular', '_skylo', 'mapfre_spinner', 'swal'] },
            oim_commons: { deps: ['angular'] },
            mTemplates: { deps: ['angular'] },
            mDirective: { deps: ['angular', 'spin', 'mTemplates', 'directiveUtils'] },
            storageManager: { deps: ['angular', 'crypto-js'] },
            oimGoogleAnalytics: { deps: ['angular'] },
            angular_file_saver: { deps: ['angular', 'fileSaver'] },
            mMainServices: { deps: ['angular', 'angular_file_saver'] },
            originSystem: { deps: ['angular'] },
            gaia_utlis: { deps: ['angular_animate'] },
            gaia: { deps: ['gaia_utlis', 'underscore', 'lodash', 'uIBootstrap'] },
            //wrap_gaia: {deps: ['gaia']},
            wrap_gaia: { deps: ['underscore', 'lodash', 'uIBootstrap', 'angular_animate'] }, //TO-DO: Cambiar injeccion por APP
            linqjs: { exports: 'Enumerable', deps: ['jquery'], init: function() { return window.jQuery.Enumerable; } },

            oim_ocLazyLoad: {deps:['angular_ocLazyLoad', 'angular_ui_route']},
            proxyLogin : { deps: ['wrap_gaia'] },
            proxyTrip : { deps: ['wrap_gaia'] },
            oim_security : { deps: ['satellizer', 'proxyLogin', 'oimGoogleAnalytics', 'originSystem', 'proxyHome', 'angular_cookies', 'storageManager'] },
            mxPaginador : { deps: ['mDirective'] },
            lyra: { deps: ['mDirective'] },
            'images-resizer': { deps: ['angular'] },
            /* Firma */
            signature: { deps: ['angular', 'mDirective'] },
            'signature-panel': { deps: ['angular', 'mDirective'] },
            mxImageUploader : { deps: ['mDirective'] },
            modalSendEmailFactory : { deps: ['proxyTrip'] },
            deps : ['uIBootstrap' ],
            'crypto-js': { exports: 'crypto-js' },
            proxyHome : { deps: ['wrap_gaia'] },
            mpfCardFilter: { deps: ['mDirective'] },
            angular_cookies: { deps: ['angular'] }
        },
        packages: {
        }
    }
});
