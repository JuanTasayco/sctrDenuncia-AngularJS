/*global angular, _, unescape, escape */
/*TODO: REVIEW */
angular.module('cookieSrv', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.cookieSrv
     * @description
     * Soon...
     */
    .factory('CookieSrv', function() {
         /**
         * @doc-component method
         * @methodOf gaiafrontend.service.cookieSrv
         * @name gaiafrontend.service.cookieSrv#getCookie
         * @param {string} name The name for the cookie to get.
         * @return {string} cookie that matches name parameter.
         * @description
         * This method obtains a cookie from the parameter name.
         */
        function getCookie(name) {
            var i,
                cookie,
                cookieName,
                cookieValue,
                cookiesArray = window.document.cookie.split(';');

            for (i = 0; i < cookiesArray.length; i += 1) {
                cookieName = cookiesArray[i].substr(0, cookiesArray[i].indexOf('='));
                cookieValue = cookiesArray[i].substr(cookiesArray[i].indexOf('=') + 1);
                cookieName = cookieName.replace(/^\s+|\s+$/g, '');
                if (cookieName === name) {
                    try {
                        cookie = angular.isObject(JSON.parse(unescape(cookieValue))) ? JSON.parse(unescape(cookieValue)) : cookieValue;
                    } catch (e) {
                        cookie = unescape(cookieValue);
                    }
                }
            }
            return cookie;
        }
         /**
         * @doc-component method
         * @methodOf gaiafrontend.service.cookieSrv
         * @name gaiafrontend.service.cookieSrv#setCookie
         * @param {string} cookieName The name for the cookie to be set.
         * @param {string} cookieValue The value for the cookie to be set.
         * @param {string=} expires The value for the cookie to be expired.
         * @description
         * This method set a cookie with a name, value and expires values from parameters.
         */
        function setCookie(cookieName, cookieValue, expires) {
            var expirationDate = new Date(),
                finalCookie;

            expirationDate.setTime(expirationDate.getTime() + expires);
            finalCookie = escape(_.isPlainObject(cookieValue) ? JSON.stringify(cookieValue) : cookieValue) + ((expires === null) ? '' : '; expires=' + expirationDate.toUTCString());
            window.document.cookie = cookieName + '=' + finalCookie;
        }
        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.cookieSrv
         * @name gaiafrontend.service.cookieSrv#removeCookie
         * @param {string} cookieName The name for the cookie to be delete.
         * @description
         * This method delete a cookie with a name.
         */
        function removeCookie(cookieName) {
            window.document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }

        return {
            getCookie: getCookie,
            setCookie: setCookie,
            removeCookie: removeCookie
        };
    });
