'use strict';

define(['angular'], function(ng) {
  var frmBandeja, resultadoBandeja, frmConsolidado;
  var cache = {
    cache: {
      setFrm: setFrm,
      getFrm: getFrm,
      setResultado: setResultado,
      getResultado: getResultado,
      setConsolidado: setConsolidado,
      getConsolidado: getConsolidado
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

  function setConsolidado(frm) {
    frmConsolidado = ng.copy(frm);
  }

  function getConsolidado() {
    return frmConsolidado;
  }
});
