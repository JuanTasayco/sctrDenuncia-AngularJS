/*TODO: REVIEW */
/*global angular */
angular.module('theme', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.theme
     * @description
     * This service manages the application's skin/theme.
     *
     * See `ThemeInterceptor` and `ThemeCtrl` for more info.
     *
     */
    .factory('Theme', function() {
        var theme = {};
        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.theme
         * @name gaiafrontend.service.theme#get
         * @return {object} theme for application.
         * @description
         * This method obtains the application's theme.
         */
        function get() {
            return theme;
        }
        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.theme
         * @name gaiafrontend.service.theme#set
         * @param {string} name The id for the theme to be set as the application's theme.
         * @description
         * This method sets the application's theme.
         */
        function set(themeId) {
            theme.id = themeId;
            if (window.respond) {
                window.respond.update();
            }
        }

        return {
            get: get,
            set: set
        };
    });
