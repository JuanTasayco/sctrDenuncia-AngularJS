'use strict';

define(['angular'], function(ng) {
  return {
    getParameter: getParameter
  };

  function getParameter(codeParam) {
    var key = ng.fromJson(localStorage.getItem('general_parameters')).find(function(param) {
      return param.codigo == codeParam;
    });

    return key.valor;
  }
});
