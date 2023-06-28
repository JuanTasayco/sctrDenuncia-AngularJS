'use strict';

define(['StateConstant', 'lodash'], function(TASK_ACTIONS, _) {
  var initialState = {};
  var reducers = {
    DetalleReducer: DetalleReducer,
    FrmsValidateReducer: FrmsValidateReducer,
    TercerosVehiculoReducer: TercerosVehiculoReducer,
    FrmStatusReducer: FrmStatusReducer
  };

  return reducers;

  // declaracion

  function addObjToArray(state, propState, action) {
    var arrOld = _.cloneDeep(state[propState]) || [];
    // HACK: lo declaramos de esta manera para que uglify pueda comprimir
    var newState = {};
    newState[propState] = [].concat(arrOld, action.payload);

    return _.assign({}, state, newState);
  }

  function deleteObjFromArray(state, propState, action) {
    var arrOld = _.cloneDeep(state[propState]);
    var arrInicio = arrOld.slice(0, action.payload.idx);
    var arrFin = arrOld.slice(action.payload.idx + 1);
    var newArr = [].concat(arrInicio, arrFin);
    var newState = _.assign({}, state);
    newState[propState] = newArr;

    return newState;
  }

  function editObjFromArray(state, propState, action, propPayload) {
    var newArr = state[propState].slice(0);
    var actualObj = newArr[action.payload.idx];
    var newObj = _.assign({}, actualObj, action.payload[propPayload]);
    newArr[action.payload.idx] = newObj;
    // HACK: lo declaramos de esta manera para que uglify pueda comprimir
    var newState = {};
    newState[propState] = newArr;

    return _.assign({}, state, newState);
  }

  function DetalleReducer(state, action) {
    var myState = state ? state : initialState;
    var PROP_STATE_OCUPANTES_DIRECTOS = 'ocupantes';
    var PROP_STATE_DANHO_PROPIO = 'detalleDanioVehiculo';
    var PROP_STATE_VEHICULO_TERCERO = 'conductorTercero';
    var PROP_STATE_PEATON = 'peatonesTercero';
    var PROP_STATE_BIEN = 'bienesTercero';

    switch (action.type) {
      case TASK_ACTIONS.DETALLE.UPDATE:
        return _.assign({}, myState, action.payload);

      case TASK_ACTIONS.CONDUCTOR.UPDATE:
        return _.assign({}, myState, {
          conductor: action.payload
        });

      case TASK_ACTIONS.OCUPANTES_DIRECTOS.ADD:
        return addObjToArray(myState, PROP_STATE_OCUPANTES_DIRECTOS, action);

      case TASK_ACTIONS.OCUPANTES_DIRECTOS.DELETE:
        return deleteObjFromArray(myState, PROP_STATE_OCUPANTES_DIRECTOS, action);

      case TASK_ACTIONS.OCUPANTES_DIRECTOS.EDIT:
        return editObjFromArray(myState, PROP_STATE_OCUPANTES_DIRECTOS, action, 'ocupante');

      case TASK_ACTIONS.DANHO_PROPIO.ADD:
        return addObjToArray(myState, PROP_STATE_DANHO_PROPIO, action);

      case TASK_ACTIONS.DANHO_PROPIO.DELETE:
        return deleteObjFromArray(myState, PROP_STATE_DANHO_PROPIO, action);

      case TASK_ACTIONS.DANHO_PROPIO.EDIT:
        return editObjFromArray(myState, PROP_STATE_DANHO_PROPIO, action, 'danho');

      case TASK_ACTIONS.PEATON.ADD:
        return addObjToArray(myState, PROP_STATE_PEATON, action);

      case TASK_ACTIONS.PEATON.DELETE:
        return deleteObjFromArray(myState, PROP_STATE_PEATON, action);

      case TASK_ACTIONS.PEATON.EDIT:
        return editObjFromArray(myState, PROP_STATE_PEATON, action, 'peaton');

      case TASK_ACTIONS.BIEN.ADD:
        return addObjToArray(myState, PROP_STATE_BIEN, action);

      case TASK_ACTIONS.BIEN.DELETE:
        return deleteObjFromArray(myState, PROP_STATE_BIEN, action);

      case TASK_ACTIONS.BIEN.EDIT:
        return editObjFromArray(myState, PROP_STATE_BIEN, action, 'bien');

      case TASK_ACTIONS.VEHICULO_TERCERO.ADD:
        return addObjToArray(myState, PROP_STATE_VEHICULO_TERCERO, action);

      case TASK_ACTIONS.VEHICULO_TERCERO.DELETE:
        return deleteObjFromArray(myState, PROP_STATE_VEHICULO_TERCERO, action);

      case TASK_ACTIONS.VEHICULO_TERCERO.EDIT:
        return editObjFromArray(myState, PROP_STATE_VEHICULO_TERCERO, action, 'vehiculo');

      default:
        return myState;
    }
  }

  function FrmsValidateReducer(state, action) {
    var myState = state ? state : initialState;

    switch (action.type) {
      case TASK_ACTIONS.ALL.VALIDATE:
        return _.assign({}, myState, action.payload);
      default:
        return myState;
    }
  }

  function FrmStatusReducer(state, action) {
    var myState = state ? state : initialState;

    switch (action.type) {
      case TASK_ACTIONS.ALL.REQUIRE:
        return _.assign({}, myState, {
          require: action.payload
        });
      case TASK_ACTIONS.ALL.SAVED:
        return _.assign({}, myState, {
          saved: action.payload
        });
      case TASK_ACTIONS.ALL.BLOCK_BY_GENERADO:
        return _.assign({}, myState, {
          blockByGenerado: action.payload
        });
      case TASK_ACTIONS.ALL.BLOCK_BY_ANULADO:
        return _.assign({}, myState, {
          blockByAnulado: action.payload
        });
      default:
        return myState;
    }
  }

  // Lista interna en comp. vehiculos terceros
  function TercerosVehiculoReducer(state, action) {
    var myState = state ? state : initialState;
    var PROPIEDAD_STATE_DANHOS = 'danhos';
    var PROPIEDAD_STATE_OCUPANTES = 'ocupantes';
    var newState = {};

    switch (action.type) {
      case TASK_ACTIONS.DANHO_TERCERO.UPDATE:
        newState[PROPIEDAD_STATE_DANHOS] = action.payload;
        return _.assign({}, myState, newState);

      case TASK_ACTIONS.DANHO_TERCERO.ADD:
        return addObjToArray(myState, PROPIEDAD_STATE_DANHOS, action);

      case TASK_ACTIONS.DANHO_TERCERO.DELETE:
        return deleteObjFromArray(myState, PROPIEDAD_STATE_DANHOS, action);

      case TASK_ACTIONS.DANHO_TERCERO.EDIT:
        return editObjFromArray(myState, PROPIEDAD_STATE_DANHOS, action, 'danho');

      case TASK_ACTIONS.OCUPANTES_TERCERO.UPDATE:
        newState[PROPIEDAD_STATE_OCUPANTES] = action.payload;
        return _.assign({}, myState, newState);

      case TASK_ACTIONS.OCUPANTES_TERCERO.ADD:
        return addObjToArray(myState, PROPIEDAD_STATE_OCUPANTES, action);

      case TASK_ACTIONS.OCUPANTES_TERCERO.DELETE:
        return deleteObjFromArray(myState, PROPIEDAD_STATE_OCUPANTES, action);

      case TASK_ACTIONS.OCUPANTES_TERCERO.EDIT:
        return editObjFromArray(myState, PROPIEDAD_STATE_OCUPANTES, action, 'ocupante');

      default:
        return myState;
    }
  }
});
