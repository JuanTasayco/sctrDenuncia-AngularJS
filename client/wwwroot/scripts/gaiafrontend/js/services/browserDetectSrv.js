/*global angular */
angular.module('browserDetectSrv', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.browserDetectSrv
     * @description
     * This service has been migrated to "GAIA Site"
     * There you will find its documentation and several examples.
     * "GAIA Site" is an application created by the Architecture Area to learn and play with GAIA. Is available in RAS. Direct links are available below in this page.
     */
    .factory('BrowserDetectSrv', function() {

        function getBrowser() {
            var browserData,
                BrowserDetect = {
                    searchString: function(data) {
                        var dataString,
                            dataProp,
                            i;
                        for (i = 0; i < data.length; i += 1) {
                            dataString = data[i].string;
                            dataProp = data[i].prop;
                            this.versionSearchString = data[i].versionSearch || data[i].identity;
                            if (dataString) {
                                if (dataString.indexOf(data[i].subString) !== -1)
                                    return data[i].identity;
                            } else if (dataProp)
                                return data[i].identity;
                        }
                    },
                    searchVersion: function(dataString) {
                        var index = dataString.indexOf(this.versionSearchString);
                        if (index === -1) return;
                        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
                    },
                    dataBrowser: [{
                        string: navigator.userAgent,
                        subString: 'OmniWeb',
                        versionSearch: 'OmniWeb/',
                        identity: 'OmniWeb'
                    }, {
                        string: navigator.vendor,
                        subString: 'Apple',
                        identity: 'Safari'
                    }, {
                        prop: window.opera,
                        identity: 'Opera'
                    }, {
                        string: navigator.vendor,
                        subString: 'iCab',
                        identity: 'iCab'
                    }, {
                        string: navigator.vendor,
                        subString: 'KDE',
                        identity: 'Konqueror'
                    }, {
                        string: navigator.userAgent,
                        subString: 'Firefox',
                        identity: 'Firefox'
                    }, {
                        string: navigator.vendor,
                        subString: 'Camino',
                        identity: 'Camino'
                    }, { // for newer Netscapes (6+)
                        string: navigator.userAgent,
                        subString: 'Netscape',
                        identity: 'Netscape'
                    }, {
                        string: navigator.userAgent,
                        subString: 'MSIE',
                        identity: 'Explorer',
                        versionSearch: 'MSIE'
                    }, {
                        string: navigator.userAgent,
                        subString: 'Trident',
                        identity: 'Explorer',
                        versionSearch: 'rv'
                    }, {
                        string: navigator.userAgent,
                        subString: 'Edge',
                        identity: 'Edge'
                    }, {
                        string: navigator.userAgent,
                        subString: 'Gecko',
                        identity: 'Chrome',
                        versionSearch: 'Chrome\/'
                    }],
                    dataOS: [{
                        string: navigator.platform,
                        subString: 'Win',
                        identity: 'Windows'
                    }, {
                        string: navigator.platform,
                        subString: 'Mac',
                        identity: 'Mac'
                    }, {
                        string: navigator.platform,
                        subString: 'Linux',
                        identity: 'Linux'
                    }, {
                        string: navigator.platform,
                        subString: 'android',
                        identity: 'Android'
                    }, {
                        string: navigator.platform,
                        subString: 'ipad',
                        identity: 'iOS'
                    }, {
                        string: navigator.platform,
                        subString: 'iphone',
                        identity: 'iOS'
                    }],
                    init: function() {
                        browserData = {
                            name: this.searchString(this.dataBrowser) || 'An unknown browser',
                            version: this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || 'an unknown version',
                            os: this.searchString(this.dataOS) || 'an unknown OS'
                        };
                    }
                };

            BrowserDetect.init();
            return browserData;

        }

        return {
            getBrowser: getBrowser
        };
    });
