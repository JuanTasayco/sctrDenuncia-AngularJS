'use strict';

define(['ConstantState', 'lodash'], function (TASK_ACTIONS, _) {
  var initialstate = {};
  var reducers = {
    SolicitudReducer: SolicitudReducer,
    ConsultReducer: ConsultReducer
  };

  // function declaration

  function addObjToArray(state, propState, action) {
    var arrOld = _.cloneDeep(state[propState]) || [];
    var newState = {};
    newState[propState] = [].concat(arrOld, action.payload);

    return _.assign({}, state, newState);
  }

  function deleteObjFromArray(state, propState, action) {
    var arrOld = _.cloneDeep(state[propState]);
    // index === id
    var newArr = _.filter(arrOld, function (i) {
      return i.index !== action.payload.index;
    });

    var newState = {};
    newState[propState] = newArr;

    return _.assign({}, state, newState);
  }

  function editObjFromArray(state, propState, action) {
    var arrItems = state[propState].slice(0);
    var newArr = _.map(arrItems, function (obj) {
      return obj.index === action.payload.index ? _.assign({}, obj, action.payload) : obj;
    })

    var newState = {};
    newState[propState] = newArr;

    return _.assign({}, state, newState);
  }

  function addPropertyToObject(state, namePropertyState, action) {
    var statePropertyOld = _.cloneDeep(state[namePropertyState]);
    var statePropertyNew = _.assign({}, statePropertyOld, action.payload);

    var newState = {};
    newState[namePropertyState] = statePropertyNew;

    return _.assign({}, state, newState);
  }

  function SolicitudReducer(state, action) {
    var currentState = state ? state : initialstate;
    var PROPS_STATE_COVERAGES = 'coverageCompensations';
    var PROPS_STATE_COMPROBANTES = 'comprobantesList';

    switch (action.type) {
      case TASK_ACTIONS.SOLICITUD.COMPANY_UPDATE:
        return _.assign({}, currentState, action.payload);

      case TASK_ACTIONS.SOLICITUD.PRODUCT_UPDATE:
        return _.assign({}, currentState, action.payload);

      case TASK_ACTIONS.SOLICITUD.ADDITIONAL_DATA.UPDATE:
        return _.assign({}, currentState, action.payload);

      case TASK_ACTIONS.SOLICITUD.ADDITIONAL_DATA.ADD:
        return addPropertyToObject(currentState, 'additionalData', action);

      case TASK_ACTIONS.SOLICITUD.STEP_ONE_UPDATE:
        return _.assign({}, currentState, action.payload);

      case TASK_ACTIONS.SOLICITUD.COVERAGE_COMPENSATIONS.ADD:
        return addObjToArray(currentState, PROPS_STATE_COVERAGES, action);

      case TASK_ACTIONS.SOLICITUD.COVERAGE_COMPENSATIONS.DELETE:
        return deleteObjFromArray(currentState, PROPS_STATE_COVERAGES, action);

      case TASK_ACTIONS.SOLICITUD.COVERAGE_COMPENSATIONS.EDIT:
        return editObjFromArray(currentState, PROPS_STATE_COVERAGES, action);

      case TASK_ACTIONS.SOLICITUD.COVERAGE_UPDATE:
        return _.assign({}, currentState, action.payload);

      case TASK_ACTIONS.SOLICITUD.AFILIATE_UPDATE:
        return _.assign({}, currentState, action.payload);

      case TASK_ACTIONS.SOLICITUD.SOLICITUD_DATA_UPDATE:
        return _.assign({}, currentState, action.payload);

      case TASK_ACTIONS.SOLICITUD.EXTRA_BENEFICIARY_DATA:
        return _.assign({}, currentState, action.payload);

      case TASK_ACTIONS.SOLICITUD.DOCUMENT_LIQUIDATION_DATA.UPDATE:
        return _.assign({}, currentState, action.payload);

      case TASK_ACTIONS.SOLICITUD.DOCUMENT_LIQUIDATION_DATA.ADD:
        return addPropertyToObject(currentState, 'documentLiquidation', action)

      case TASK_ACTIONS.SOLICITUD.COMPROBANTES_LIST.ADD:
        return addObjToArray(currentState, PROPS_STATE_COMPROBANTES, action);

      case TASK_ACTIONS.SOLICITUD.COMPROBANTES_LIST.EDIT:
        return editObjFromArray(currentState, PROPS_STATE_COMPROBANTES, action);

      case TASK_ACTIONS.SOLICITUD.CLEAN_STATE:
        return _.assign({});

      default:
        return currentState;
    }
  }

  function ConsultReducer(state, action) {
    var currentState = state ? state : initialstate;

    switch (action.type) {
      case TASK_ACTIONS.CONSULT.SOLICITUD.ADD:
        return _.assign({}, currentState, action.payload);

      default:
        return currentState;
    }
  }

  return reducers;
});
