'use strict';

define(['redux', 'ReembolsoReducer'], function(redux, ReembolsoReducer) {
  var rootReducer = redux.combineReducers({
    solicitud: ReembolsoReducer.SolicitudReducer,
    consult: ReembolsoReducer.ConsultReducer
  });

  return rootReducer;
});
