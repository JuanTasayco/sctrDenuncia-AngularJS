'use strict';

define(['redux', 'AsistenciaReducer', 'StateConstant'], function(redux, AsistenciaReducer, TASK_ACTIONS) {
  var appReducer = redux.combineReducers({
    detalle: AsistenciaReducer.DetalleReducer,
    frmStatus: AsistenciaReducer.FrmStatusReducer,
    frmsValidationStates: AsistenciaReducer.FrmsValidateReducer,
    tercerosVehiculo: AsistenciaReducer.TercerosVehiculoReducer
  });

  var rootReducer = function(state, action) {
    action.type === TASK_ACTIONS.ALL.EXIT_ASSISTANCE && (state = undefined);

    return appReducer(state, action);
  };

  return rootReducer;
});
