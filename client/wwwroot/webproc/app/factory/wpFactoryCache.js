'use strict';

define(['angular'], function(ng) {
  var frmBandeja, resultadoBandeja;
  var cache = {
    cache: {
      setFrm: setFrm,
      getFrm: getFrm,
      setResultado: setResultado,
      getResultado: getResultado
    }
  };

  return cache;

  // bandeja

  function setFrm(frm) {
    frmBandeja = ng.copy(frm);
  }

  function getFrm() {
    return frmBandeja;
  }

  function setResultado(resultado) {
    resultadoBandeja = ng.copy(resultado);
  }

  function getResultado() {
    return resultadoBandeja;
  }
});
