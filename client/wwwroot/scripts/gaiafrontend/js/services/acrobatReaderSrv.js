/*global angular, navigator, ActiveXObject */
angular.module('acrobatReaderSrv', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.acrobatReaderSrv
     * @description
     * This service has been migrated to "GAIA Site"
     * There you will find its documentation and several examples.
     * "GAIA Site" is an application created by the Architecture Area to learn and play with GAIA. Is available in RAS. Direct links are available below in this page.
     */
    .factory('AcrobatReaderSrv', function() {

        function getAcrobatInfo() {

            var getBrowserName = function() {
                return (function() {
                    var userAgent = navigator ? navigator.userAgent.toLowerCase() : 'other';

                    if (userAgent.indexOf('chrome') > -1) {
                        return 'chrome';
                    } else if (userAgent.indexOf('safari') > -1) {
                        return 'safari';
                    } else if (userAgent.indexOf('msie') > -1) {
                        return 'ie';
                    } else if (userAgent.indexOf('firefox') > -1) {
                        return 'firefox';
                    }
                    return userAgent;
                }());
            };

            var getActiveXObject = function(name) {
                try {
                    return new ActiveXObject(name);
                } catch (e) {}
            };

            var getNavigatorPlugin = function(name) {
                var key;
                for (key in navigator.plugins) {
                    if (navigator.plugins.hasOwnProperty(key)) {
                        var plugin = navigator.plugins[key];
                        if (plugin.name === name) {
                            return plugin;
                        }
                    }
                }
            };

            var getWebKitPlugin = function() {
                // Hack for webkit
                var key;
                for (key in navigator.plugins) {
                    if (navigator.plugins.hasOwnProperty(key)) {
                        var plugin = navigator.plugins[key];
                        if (plugin.name && plugin.name.substring(0, 6) === 'WebKit' && (plugin.name.indexOf('pdf') !== -1 || plugin.name.indexOf('PDF') !== -1)) {
                            return plugin;
                        }
                    }
                }
            };

            var getPDFPlugin = function() {
                return (function() {
                    if (getBrowserName() === 'ie') {
                        // load the activeX control
                        // AcroPDF.PDF is used by version 7 and later
                        // PDF.PdfCtrl is used by version 6 and earlier
                        return getActiveXObject('AcroPDF.PDF') || getActiveXObject('PDF.PdfCtrl');
                    } else {
                        return getNavigatorPlugin('Adobe Acrobat') || getNavigatorPlugin('Chrome PDF Viewer') || getWebKitPlugin() || getNavigatorPlugin('WebKit built-in PDF');
                    }
                }());
            };

            var isAcrobatInstalled = function() {
                return !!getPDFPlugin();
            };

            var getAcrobatVersion = function() {
                try {
                    var plugin = getPDFPlugin();

                    if (getBrowserName() === 'ie') {
                        var versions = plugin.GetVersions().split(',');
                        var latest = versions[0].split('=');
                        return parseFloat(latest[1]);
                    }

                    if (plugin.version) {
                        return parseInt(plugin.version, 10);
                    }
                    return plugin.name;
                } catch (e) {
                    return null;
                }
            };

            return {
                browser: getBrowserName(),
                isAcrobatInstalled: isAcrobatInstalled() ? true : false,
                acrobatVersion: getAcrobatVersion()
            };
        }

        return {
            getAcrobatInfo: getAcrobatInfo
        };
    });
