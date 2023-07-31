(function(factory) {
    define(factory);
})(function() {
    return {
        lib: {
            /* LIBS ANGULAR */
            "goooleRcapcha": {
                name: 'goooleRcapcha',
                path: "//www.google.com/recaptcha/api.js?render=explicit&onload=vcRecaptchaApiLoaded&hl=es"
            },

            'app_routes': {
                name: 'app_routes',
                path: "app.routes"
            },
            'loginTemplates': {
                name: 'loginTemplates',
                path: "/login/loginTemplates"
            },
            ErrorHandlerService: {
                name: 'ErrorHandlerService',
                path: '/login/app/services/errorHandler.service'
            },
            AuthVerifyController: {
              name: 'AuthVerifyController',
              path: '/login/app/mfa/views/auth-verify/auth-verify'
            },
            CardModalityController: {
              name: 'CardModalityController',
              path: '/login/app/mfa/features/card-modality/card-modality'
            },
            AuthCodeController: {
              name: 'AuthCodeController',
              path: '/login/app/mfa/views/auth-code/auth-code'
            },
            MfaFactory: {
              name: 'MfaFactory',
              path: '/login/app/mfa/providers/services/mfa'
            },
            InputCodesController: {
              name: 'InputCodesController',
              path: '/login/app/mfa/features/input-codes/input-codes'
            },
            NextFocusByMaxlengthDirective: {
              name: 'NextFocusByMaxlengthDirective',
              path: '/login/app/mfa/features/input-codes/next-focus-by-maxlength'
            }
        },
        shim: {
            loginTemplates: { deps: ["angular"] }
        },
        packages: {

        },
        partial: []

    }

});
