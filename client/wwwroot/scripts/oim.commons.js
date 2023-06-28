//la idea es tener los metodos comunes y repetitivos de una factory aqui
define(['angular', 'constants'], function(angular) {
  'use strict';

  angular.module('oim.commons', []).factory('oimAbstractFactory', ['$http', '$q', '$window', function($http, $q, $window) {
      var base = constants.system.api.endpoints.policy;
      var baseLogin = constants.system.api.endpoints.security;

      var abstractFactory = {
        getBase: function() {
          return base;
        },
        concatenateUrl: function(params) {
          var url = '';
          angular.forEach(params, function(value, key) {
            url += '/' + value;
          });
          url ? url : url = '/';
          return url;
        },

        getData: function(url, params) {
          var newUrl = url + this.concatenateUrl(params)
          var deferred = $q.defer();
          $http({
            method: 'GET',
            url: base + newUrl,
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function(response) {
            deferred.resolve(response.data);
          });
          return deferred.promise;
        },

        getDataWithOutBase: function(url, params) {
          var newUrl = url + this.concatenateUrl(params)
          var deferred = $q.defer();
          $http({
            method: 'GET',
            url: newUrl,
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function(response) {
            deferred.resolve(response.data);
          });
          return deferred.promise;
        },

        postData: function(url, params) {
          var deferred = $q.defer();
          $http({
            method: 'POST',
            url: base + url,
            data: params,
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function(response) {
            deferred.resolve(response.data);
          });
          return deferred.promise;
        },

        //https://mxperu.atlassian.net/browse/OIM-450
        getClaims: function() {
          //api/claims/values
          return this.getDataWithOutBase(baseLogin + 'api/claims/values');
        },

        getAgent: function(params) {
          return this.getData('api/agente/buscar?codigoNombre=' + params);
        },

        applyStylesMyDream: function() {
          if ($window.localStorage['appOrigin'] !== constants.originApps.myDream) {
            return void 0;
          }
          setTimeout(function() {
            var element = document.getElementsByTagName('body')[0];
            element.classList.add("app-my-dream");

            if (element.className === 'app-my-dream') {
              document.querySelector("link[rel*='icon']").href = "favicon-myd.ico" ;
              window.document.title = 'MyDream';
            } else {
              document.querySelector("link[rel*='icon']").href = "256x256.png";
              window.document.title = 'OIM';
            }

          }, 0);
        },

        isMyDream: function() {
         return $window.localStorage['appOrigin'] === constants.originApps.myDream;
        },

        getOrigin: function() {
          return this.isMyDream() ? constants.originApps.myd : constants.originApps.oim;
        }
      };

      return abstractFactory;
    }]).factory('builderObject', ['$interpolate', '$parse', function($interpolate, $parse) {
      var builderRequest = function builderRequest(template, vobject) {
        var template;
        var $this = this;
        var contextExpression;
        var request = vobject;

        function cleanAllArrays(obj) {
          for (var key in obj) {
            if (angular.isArray(obj[key])) obj[key] = []
            if (angular.isObject(obj[key])) cleanAllArrays(obj[key]);
          }
        }

        function _getRequest() {
          if (!request) {
            request = helper.clone(template);
            cleanAllArrays(request);
          }
          return request;
        }

        function containerObject(obj, expression, parentExpression) {

        }

        function _setContext(contextExp) {
          contextExpression = contextExp;
          return $this;
        }

        function _unsetContext() {
          contextExpression = undefined;
          return $this;
        }

        function _getExpression(expression, parentExpression) {
          if (parentExpression) expression = parentExpression + '.' + expression;
          else if (contextExpression) expression = contextExpression + '.' + expression;
          return expression;
        }

        function _actionValue(func, expression, parentExpression) {
          expression = _getExpression(expression, parentExpression);
          var fn = $parse(expression);
          if (angular.isFunction(func))
            return func(fn);

        }

        function ensureValidExpression(templ, expression, parentExpression) {
          var namesProps = _getExpression(expression, parentExpression).split('.');
          for (var index = 0; index < namesProps.length; index++) {
            var prop = namesProps[index];
            if (!templ.hasOwnProperty(prop))
              throw "The field " + prop + " into " + exp + " not found.";
          }
        }

        function getFirstItemArrayTmpl(expression, parentExpression) {
          var exp = _getExpression(expression, parentExpression);
          var first = _actionValue(function(fn) {
            return fn(template);
          }, expression, parentExpression);
          if (first.length !== 0)
            return first[0];
          return null;
        }

        function ensureIsArray(expression, parentExpression) {
          // debugger;
          var exp = _getExpression(expression, parentExpression);

          var requestProp = _actionValue(function(fn) {
            return fn(_getRequest());
          }, expression, parentExpression);

          var templateProp = _actionValue(function(fn) {
            return fn(template);
          }, expression, parentExpression);

          if (angular.isArray(requestProp) !== angular.isArray(templateProp)) {
            if (angular.isArray(templateProp))
              throw "The expression " + exp + " value must be an array type";
            throw "The expression " + exp + " value not must be an array type";
          }

        }

        function _setProp(value, expression, parentExpression) {
          ensureValidExpression(template, expression, parentExpression);
          _actionValue(function(fn) {
            return fn.assign(_getRequest(), value);
          }, expression, parentExpression);
          return $this;
        }

        function _deleteProp(expression, parentExpression) {
          ensureValidExpression(template, expression, parentExpression);
          expression = "delete " + _getExpression(expression, parentExpression);
          var fn = $parse(expression);
          fn(_getRequest());
          return $this;
        }

        function _clearArray(expression, parentExpression) {
          _setProp([], expression, parentExpression);
        }

        function _appendInArrayExtend(value, deniedExtend, expression, parentExpression) {

          ensureValidExpression(template, expression, parentExpression);
          ensureIsArray(expression, parentExpression);

          var a = _actionValue(function(fn) {
            return fn(_getRequest());
          }, expression, parentExpression);
          var tmplItem = getFirstItemArrayTmpl(expression, parentExpression);
          if (tmplItem && angular.isObject(tmplItem)) {
            value = (new builderRequest(tmplItem)).setObject(value);
          }

          if (!deniedExtend) angular.extend(template, value);
          if (angular.isArray(a))
            a.push(value);
          else
            throw "the expression " + expression + " is't an array";

          return $this;
        }

        function _setObject(value, deniedExtend) {
          function v(vval, tmpl) {
            for (var key in vval) {
              if (vval.hasOwnProperty(key) && !tmpl.hasOwnProperty(key)) {
                throw "The property " + key + " not found";
              } else {
                if (angular.isArray(vval[key])) {

                  if (angular.isArray(tmpl[key])) {
                    var item = tmpl[key].length > 0 ? tmpl[key][0] : undefined;
                    for (var index = 0; index < vval[key].length && item; index++) {
                      var element = vval[key][index];
                      v(element, item);
                    }
                  } else throw "The property " + key + "must not be of type array";
                } else if (angular.isObject(vval[key]))
                  v(vval[key], tpml[key]);
              }

            }
          }
          if (!deniedExtend) angular.extend(template, value);
          v(value, template);
          request = value;
          return request;
        }

        function _getObject() {
          return request;
        }
        this.getObject = _getObject
        this.setObject = _setObject
        this.setProp = _setProp;
        this.clearArray = _clearArray;
        this.appendInArrayExtend = function(value, expression, parentExpression) {
          _appendInArrayExtend(value, false, expression, parentExpression);
        }
        this.appendInArray = function(value, expression, parentExpression) {
          _appendInArrayExtend(value, true, expression, parentExpression);
        }
        this.setContext = _setContext;
        this.deleteProp = _deleteProp;
      }
      return builderRequest;
    }])
    .factory("odataBuilder", ['$filter', function($filter) {
      function oimOData(path, params) {
        var filters = [];
        var $orders = []
        var $pageNumber;
        var $pageSize;
        var $this = this;

        function _filter(name, op, value) {
          if (value) {
            if (angular.isDate(value))
              value = $filter('date')(value, 'dd/MM/yyyy');
            filters.push({ attribute: name, op: op, value: value });

          }
          return $this;
        }

        function addOrder(name, ascending) {
          $orders.push({ name: name, ascending: ascending === undefined || ascending === null ? true : ascending })
          return $this;
        }

        function _pageOptions(pageNumber, pageSize) {
          $pageNumber = pageNumber;
          $pageSize = pageSize;
          return $this;
        }

        function _query() {
          var quy = "";
          if (filters.length > 0) {
            quy = "$filter="
            var qlis = []
            for (var index = 0; index < filters.length; index++) {
              var element = filters[index];
              qlis.push(element.attribute + " " + element.op + " " + element.value);
            }
            quy += qlis.join(' and ');
          }
          if ($pageNumber !== undefined && $pageNumber !== null)
            quy += (quy === "" ? "" : "&") + "$pagenumber=" + $pageNumber;

          if ($pageSize !== undefined && $pageSize !== null)
            quy += "&$pagesize=" + $pageSize;
          if ($orders.length > 0) {
            var qorder = [];
            for (var index = 0; index < $orders.length; index++) {
              var element = $orders[index];
              qorder.push(element.name);
            }

            quy += '&$orderby=' + qorder.join(",");

          }
          return quy;
        }
        this.query = _query;
        this.addOrder = addOrder;
        this.pageOptions = _pageOptions;
        this.filter = _filter;

        this.filterEq = function(name, value) {
          return _filter(name, 'eq', value);
        }
      }
      return function(path, params) {
        return new oimOData(path, params);
      }
    }]).factory("MxPaginador", [function() {
      var Paginador = function Paginador() {
        var cantItemsPorPagina, currentArray, cantItemsPorTanda, cantPaginasPorTanda, isFromCurrentSearch;
        var paginaAMostrar, nroTandaACargar, nroIndexACargar, currentNroTanda, cantTotalRegistros;
        var factory = {
          getItemsDePagina: getItemsDePagina,
          setConfiguracionTanda: setConfiguracionTanda,
          setCurrentTanda: setCurrentTanda,
          setDataActual: setDataActual,
          setNroItemsPorPagina: setNroItemsPorPagina,
          setNroPaginaAMostrar: setNroPaginaAMostrar,
          setNroTotalRegistros: setNroTotalRegistros,
          thenLoadFrom: thenLoadFrom
        };

        return factory;

        function setNroItemsPorPagina(pageSize) {
          cantItemsPorPagina = pageSize || 10;
          return this;
        }

        function _getCantItemsPorPagina() {
          return cantItemsPorPagina;
        }

        function setNroTotalRegistros(totalRegistros) {
          cantTotalRegistros = totalRegistros;
          return this;
        }

        function setDataActual(datos) {
          currentArray = datos;
          return this;
        }

        function _getCurrentData() {
          return currentArray;
        }

        function _setCantItemsPorTanda() {
          cantItemsPorTanda = _getCurrentData().length || 0;
          return this;
        }

        function _getCantItemsPorTanda() {
          return cantItemsPorTanda;
        }

        function _setCantPaginasPorTanda() {
          cantPaginasPorTanda = Math.ceil(_getCantItemsPorTanda() / _getCantItemsPorPagina());
          return this;
        }

        function _getCantPaginasPorTanda() {
          return cantPaginasPorTanda;
        }

        function setConfiguracionTanda() {
          !isFromCurrentSearch && _setCantItemsPorTanda();
          !isFromCurrentSearch && _setCantPaginasPorTanda();
          // si es nueva busqueda, se setea a 1 el index de la tanda a cargar
          !isFromCurrentSearch && _setNroIndexACargar(1);
          isFromCurrentSearch = false;
          return this;
        }

        function getItemsDePagina() {
          var nroPaginaACargar = _getNroIndexACargar() || 1;
          var nroPaginaAnterior = nroPaginaACargar - 1;
          var indexInicio = _getCantItemsPorPagina() * nroPaginaAnterior;
          var indexFinal = _getCantItemsPorPagina() * nroPaginaACargar;
          return _getCurrentData().slice(indexInicio, indexFinal);
        }

        function setCurrentTanda(nroTandaActual) {
          currentNroTanda = nroTandaActual;
          return this;
        }

        function _getCurrentTanda() {
          return currentNroTanda;
        }

        function setNroPaginaAMostrar(pageToLoad) {
          paginaAMostrar = pageToLoad;
          return this;
        }

        function _setNroTandaACargar() {
          nroTandaACargar = Math.ceil(paginaAMostrar / _getCantPaginasPorTanda());
          return this;
        }

        function _getNroTandaACargar() {
          return nroTandaACargar;
        }

        function _setNroIndexACargar(idx) {
          nroIndexACargar = idx || paginaAMostrar - _getCantPaginasPorTanda() * (_getNroTandaACargar() - 1);
          return this;
        }

        function _getNroIndexACargar() {
          return nroIndexACargar;
        }

        function thenLoadFrom(cbAnotherTanda, cbCurrentTanda) {
          // cada vez que se use el paginado se setea a true
          isFromCurrentSearch = true;
          _setNroTandaACargar();
          _setNroIndexACargar();
          if (_getCurrentTanda() !== _getNroTandaACargar()) {
            setCurrentTanda(_getNroTandaACargar());
            angular.isFunction(cbAnotherTanda) && cbAnotherTanda(_getNroTandaACargar());
          } else {
            angular.isFunction(cbCurrentTanda) && cbCurrentTanda();
            // una vez cargado los items de la pagina solicitada, se setea a false para que si luego se hace una nueva
            // busqueda, esta realize lo condicionado en setConfiguracionTanda()
            isFromCurrentSearch = false;
          }
          return this;
        }
      };

      return Paginador;
    }]);
});
