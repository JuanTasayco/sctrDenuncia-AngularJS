define(['angular'], function(ng) {
  function renovacionFactory() {
    // Constante
    var CODE_TIPO_FINANCIAMIENTO_12CUOTASMENSUAL = '10012';
    console.log('ingresando renovacion factory externo')
    return {
      setReferidoNumber: function(object) {
        if (!angular.isUndefined(JSON.parse(window.localStorage.getItem('profile')).numeroReferido)) {
          object.numeroReferido = JSON.parse(window.localStorage.getItem('profile')).numeroReferido;
        }
        return object;
      },
      isFinanciamiento12CuotasMensual: function(tipoFinanciamiento) {
        return tipoFinanciamiento === CODE_TIPO_FINANCIAMIENTO_12CUOTASMENSUAL;
      }
    };
  }
  return ng.module('appReno').factory('renovacionFactory', renovacionFactory);
});
