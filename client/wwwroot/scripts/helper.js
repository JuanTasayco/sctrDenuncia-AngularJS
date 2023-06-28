(function(_fac) {
  if (typeof define == 'function' && define.amd) define(_fac);
  else _fac();
})(function() {
  'use strict';
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
  var ARGUMENT_NAMES = /([^\s,]+)/g;

  function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null) result = [];
    return result;
  }

  var r = {
    __extend: function() {
      var __extends =
        (this && this.__extends) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];

          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
        };
      return __extends;
    },
    isEmptyObject: function(value) {
      for (var item in value) {
        if (value[item]) return false;
      }
      return true;
    },
    formatUrlServeral: function(path, paramName, values) {
      var reg = paramName + '\\[[0-9]\\]=\\{' + paramName + '\\[[0-9]\\]\\}&*';
      var _path = path.replace(new RegExp(reg, 'g'), '');
      var v = [];
      for (var index = 0; index < values.length; index++) {
        var item = values[index];
        v.push(paramName + '=' + item);
      }
      path = _path + (_path.substring(_path.length - 1) == '&' ? '' : '&') + v.join('&');
      return path;
    },
    formatNamed: function(format, args) {
      function replaceRange(s, start, end, substitute) {
        return s.substring(0, start) + substitute + s.substring(end);
      }

      var url = format;

      for (var item in args) {
        var value = args[item];
        var pattern = new RegExp('{' + item + '}');
        var match = pattern.exec(url);
        var endIndex;
        if (match && match.length) endIndex = match.index + match[0].length;
        if (value !== null && value !== undefined && 'object' === typeof value) {
          if (value.isQuery) {
            url += (url.indexOf('?') == -1 ? '?' : url.substring(url.length - 1) !== '&' ? '&' : '') + value.value;
          } else if (value.allowMultiple) {
            url = this.formatUrlServeral(url, item, value.value);
          } else {
            var endIndex = match.index + match[0].length;
            if (value.value === undefined) {
              if (url.substring(match.index - item.length - 1, match.index) === item + '=')
                url = replaceRange(url, match.index - item.length - 2, match.index + item.length + 2, '');
              else url = replaceRange(url, match.index, endIndex, encodeURIComponent(value.defaultValue));
            } else
              url = replaceRange(
                url,
                match.index,
                endIndex,
                encodeURIComponent(value.value == null || value.value == undefined ? '' : value.value)
              );
          }
        } else
          url = replaceRange(
            url,
            match.index,
            endIndex,
            encodeURIComponent(value == null || value == undefined ? '' : value)
          );
      }

      return url;
    },
    hasPath: function(obj, propertyPath) {
      var result;
      if (!propertyPath) return false;

      var properties = propertyPath.split('.');
      _.forEach(properties, function fePathFN(prop) {
        if (!obj || !obj.hasOwnProperty(prop)) {
          result = false;
          return false;
        } else {
          result = true;
          obj = obj[prop];
        }
      });

      return result;
    },
    camelLowerCase: function(value) {
      var a = value;
      var endCamel = false;
      var result = '';
      for (var x = 0; x < a.length; x++) {
        if (!endCamel && a[x].length === 1 && /^[A-Z]/.test(a[x])) {
          result += a[x].toLowerCase();
        } else {
          endCamel = true;
          result += a[x];
        }
      }
      return result;
    },
    searchQuery: function getParameterByName(name, url) {
      if (!url) {
        url = window.location.href;
      }
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    objectToArray: function(obj) {
      var r = [];
      if (null == obj || 'object' != typeof obj) return [];
      for (var k in obj) r.push(this.clone(obj[k]));
      return r;
    },
    moveValue: function(from, to) {
      for (var item in to) {
        to[item] = from[item];
      }
      return to;
    },
    compareObject: function(value1, value2) {
      for (var item in value1) {
        if ('object' == typeof value1[item]) {
          if (!this.compareObject(value1[item], value2[item])) return false;
        } else if (value1[item] !== value2[item]) return false;
      }
      return true;
    },
    clone: function clone(obj, camelLower, intercep) {
      var copy;

      // Handle the 3 simple types, and null or undefined
      if (null == obj || 'object' != typeof obj) {
        var vi;
        if (intercep) vi = intercep(obj);
        return vi || obj;
      }

      // Handle Date
      if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
      }

      // Handle Array
      if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
          copy[i] = clone.call(this, obj[i], camelLower, intercep);
        }
        return copy;
      }

      // Handle Object
      if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
          if (obj.hasOwnProperty(attr))
            copy[!camelLower ? attr : this.camelLowerCase(attr)] = clone.call(this, obj[attr], camelLower, intercep);
        }
        return copy;
      }

      throw new Error("Unable to copy obj! Its type isn't supported.");
    },
    implement: function(d, f) {
      if (typeof define == 'function' && define.amd) {
        if (typeof d == 'Array') define(deps, factory);
        else define(d);
      } else {
        var $namesInjector = [];
        var $function = null;
        if (typeof d == 'Array') {
          $namesInjector = d;
          $function = f;
        } else if (typeof d == 'function') {
          $namesInjector = getParamNames(d);
          $function = d;
        }
        var $injector = [];
        for (var x = 0; x < $namesInjector.length; x++) $injector.push(window[$namesInjector[x]]);

        $function.prototype.call(this, $injector);
      }
    },
    normalizeRoutes: function(routes, action) {
      for (var i = 0; i < routes.length; i++) {
        var nroute = routes[i];
        if (Object.prototype.toString.call(nroute.urls) === '[object Array]') {
          for (var x = 0; x < nroute.urls.length; x++) {
            var u = nroute.urls[x];
            var cr = this.clone(nroute);
            delete cr.urls;
            if (typeof u === 'string') {
              cr.url = u;
              action.call(this, nroute.name, cr);
            } else {
              cr.url = u.url;
              if (u.abstract) {
                cr.abstract = true;
              }
              cr.appCode = u.appCode || nroute.appCode;
              cr.code = u.code || nroute.code;
              cr.views = u.views || nroute.views;
              cr.parent = u.parent || nroute.parent;
              cr.name = u.name || nroute.name;
              cr.controller = u.controller || nroute.controller;
              cr.controllerProvider = u.controllerProvider || nroute.controllerProvider;
              cr.templateProvider = u.templateProvider || nroute.templateProvider;
              cr.controllerAs = u.controllerAs || nroute.controllerAs;
              cr.templateUrl = u.templateUrl || nroute.templateUrl;
              cr.template = u.template || nroute.template;
              cr.resolver = u.resolver || nroute.resolver;
              cr.resolve = u.resolve || nroute.resolve;
              cr.thenRoutes = u.thenRoutes || nroute.thenRoutes;
              cr.currentAppID = u.currentAppID || nroute.currentAppID;
              cr.description = u.description || nroute.description;
              cr.breads = u.breads || nroute.breads;
              cr.params = u.params;
              action.call(this, cr.name, cr);
            }
          }
        } else {
          action.call(this, nroute.name, nroute);
        }
      }
    },
    /*########################
    # Platforms
    ########################*/
    isIE: function isIE() {
      return navigator.userAgent.indexOf('MSIE ') > -1 || navigator.userAgent.indexOf('Trident/') > -1;
    },
    isiOS: function isiOS() {
      return !!navigator.platform.match(/iPhone|iPod|iPad/);
    },
    isEDGE: function isEDGE() {
      return /Edge/.test(navigator.userAgent);
    },
    isMobile: function isMobile() {
      return !!navigator.userAgent.match(/Android|iPhone|iPod|iPad|BlackBerry|Opera Mini|IEMobile/i);
    },
    //base64 to file
    dataURItoBlob: function dataURItoBlob(dataURI) {
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
    } else {
        byteString = unescape(dataURI.split(',')[1]);
    }

    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
    },
    setTitleByOrigin: function setTitleByOrigin(origen, modulo) {
      setTimeout(function() {
        var element = document.getElementsByTagName('body')[0];
        if (origen === constants.originApps.myDream) {
          element.classList.add("app-my-dream");
          document.querySelector("link[rel*='icon']").href = "favicon-myd.ico";
          window.document.title = 'MYDREAM' + ' - ' + modulo;
          return;
        }
        document.querySelector("link[rel*='icon']").href = "256x256.png";
        window.document.title = 'OIM' + ' - ' + modulo;
      }, 0);
    },
    downloadReportFile: function downloadReportFile(apiUrl, downloadFileBody, $http){
      const pathParams = {
       codObjeto: localStorage.getItem('codObjeto'),
       opcMenu: localStorage.getItem('currentBreadcrumb')
      };
      const tokenAuth = localStorage.getItem('jwtMapfreToken_jwtMapfreToken');
      const dataJson = 'json=' + JSON.stringify(downloadFileBody);
      $http({
       method: 'POST',
       url: constants.system.api.endpoints.gcw + apiUrl +'?COD_OBJETO='+pathParams.codObjeto+'&OPC_MENU='+pathParams.opcMenu,
       headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': tokenAuth
       },
       data: dataJson,
       responseType: 'arraybuffer'
      }).then( function(response) {
       const fileName = response.headers('Content-Disposition').split('filename=')[1];
       saveAs(new Blob([response.data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}), fileName);
      } );
     }
  };
  window.helper = r;
  window.implement = r.implement;
  return r;
});
