'use strict';

define([
    'angular',
    'lodash',
    'endpointsConstants',
], function (ng, _, endpointsConstants) {
  
    return {
        getHeadersBasic: getHeadersBasic,
        getHeadersBearer: getHeadersBearer,
        isExpiredToken: isExpiredToken,
        transformHtml: transformHtml,
        concatenateWithTime: concatenateWithTime,
        isValidHttpUrl: isValidHttpUrl
    };

    function getHeadersBasic(){
			return { headers: { 'Authorization': 'Basic ' + endpointsConstants.camposanto.token }, skipAuthorization: true };
    }

    function getHeadersBearer(){
      var token = ng.fromJson(localStorage.getItem('cemeteryToken')).token;
			return { headers: { 'Authorization': 'Bearer ' + token  }, skipAuthorization: true };
    }

    function isExpiredToken(){
			var token =  ng.fromJson(localStorage.getItem('cemeteryToken'));
			var dateToken = new Date(token.exp * 1000)
			var dateNow = new Date();
			return dateToken > dateNow;
		}

    function transformHtml(str) {
        var entityMap = { "&amp;": "&",  "&lt;": "<", "&gt;": ">", '&quot;': '"', '&#39;': "'", '&#x2F;': "/" };
        return String(str).replace(/(&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;)/g, function (s) {
          return entityMap[s];
        });
    }

    function concatenateWithTime(url){
      var time = new Date().getTime();
      return url ? url  + '?' + time : '';
    }

    function isValidHttpUrl(string) {
      var url;
      try {
        url = new URL(string);
      } catch (_) {
        return false;  
      }
      return url.protocol === "http:" || url.protocol === "https:";
    }

});
