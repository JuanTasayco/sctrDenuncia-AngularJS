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


        },
        shim: {
            loginTemplates: { deps: ["angular"] }
        },
        packages: {

        },
        partial: []

    }

});