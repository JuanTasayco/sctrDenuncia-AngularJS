define(['angular'], function(ng) {
  function polizasFactory() {
    // Constante
    var CODE_TIPO_FINANCIAMIENTO_12CUOTASMENSUAL = '10012';

    return {
      setReferidoNumber: function(object) {
        if (!angular.isUndefined(JSON.parse(window.localStorage.getItem('profile')).numeroReferido)) {
          object.numeroReferido = JSON.parse(window.localStorage.getItem('profile')).numeroReferido;
        }
        return object;
      },
      isFinanciamiento12CuotasMensual: function(tipoFinanciamiento) {
        return tipoFinanciamiento === CODE_TIPO_FINANCIAMIENTO_12CUOTASMENSUAL;
      },
      validarTelefonos: function(arrayTelfs){
        var success = false;
        for (var i = 0; i < arrayTelfs; i ++){
          const telefono = arrayTelfs[i];
          if(telefono && telefono.length > 0){
            success = true;
            break;
          }
        }
        return success;
      }
    };
  }
  return ng.module('appAutos').factory('polizasFactory', polizasFactory);
});
