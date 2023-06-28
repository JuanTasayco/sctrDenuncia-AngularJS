'use strict';

define([], function() {
  var pericial = {
    operationCode: {
      success: 200,
      code500: 500, //errorNoControlado
      code800: 800, //errorBD
      code900: 900, //errorNegocio
      code901: 901, //modalConfirmation/reniecList/workersListDeclared
      code902: 902  //errorPlanilla
    },
    currencyType: {
      soles: {
        code: 1,
        description: 'S/.'
      },
      dollar: {
        code: 2,
        description: '$'
      }
    },
    ot: {
      qa: 'http://spe001001-336.mapfreperu.com/GOT/Gestion/frmDescargarFile.aspx?id=',
      prod: 'https://oim.mapfre.com.pe/GOT/Gestion/frmDescargarFile.aspx?id='
    }

  };
  return pericial;
});
