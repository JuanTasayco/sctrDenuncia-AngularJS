'use strict';

define(['StateConstant'], function(TASK_ACTIONS) {
  var actions = {
    rdxExitAssistance: rdxExitAssistance,

    rdxDetalleUpdate: rdxDetalleUpdate,
    rdxConductorUpdate: rdxConductorUpdate,

    rdxFrmsValidate: rdxFrmsValidate,
    rdxFrmRequire: rdxFrmRequire,
    rdxFrmSaved: rdxFrmSaved,
    rdxBlockByGenerado: rdxBlockByGenerado,
    rdxBlockByAnulado: rdxBlockByAnulado,

    // tab 2: ocupantes
    rdxOcupantesDirectosAdd: rdxOcupantesDirectosAdd,
    rdxOcupantesDirectosDelete: rdxOcupantesDirectosDelete,
    rdxOcupantesDirectosEdit: rdxOcupantesDirectosEdit,

    // tab 3: detalleDanioVehiculo
    rdxDanhoVehiculoPropioAdd: rdxDanhoVehiculoPropioAdd,
    rdxDanhoVehiculoPropioDelete: rdxDanhoVehiculoPropioDelete,
    rdxDanhoVehiculoPropioEdit: rdxDanhoVehiculoPropioEdit,

    // tab 4: peatonesTercero
    rdxPeatonAdd: rdxPeatonAdd,
    rdxPeatonDelete: rdxPeatonDelete,
    rdxPeatonEdit: rdxPeatonEdit,

    // tab 4: bienesTercero
    rdxBienAdd: rdxBienAdd,
    rdxBienDelete: rdxBienDelete,
    rdxBienEdit: rdxBienEdit,

    // tab 4: conductorTercero
    rdxVehiculoTerceroAdd: rdxVehiculoTerceroAdd,
    rdxVehiculoTerceroDelete: rdxVehiculoTerceroDelete,
    rdxVehiculoTerceroEdit: rdxVehiculoTerceroEdit,

    // tab 4: conductorTercero.vehiculoTercero.detalleDanioVehiculo
    rdxDanhoVehiculoTerceroUpdate: rdxDanhoVehiculoTerceroUpdate, // []
    rdxDanhoVehiculoTerceroAdd: rdxDanhoVehiculoTerceroAdd,
    rdxDanhoVehiculoTerceroDelete: rdxDanhoVehiculoTerceroDelete,
    rdxDanhoVehiculoTerceroEdit: rdxDanhoVehiculoTerceroEdit,

    // tab 4: conductorTercero.lesionadosTercero
    rdxOcupantesVehiculoTerceroUpdate: rdxOcupantesVehiculoTerceroUpdate, // []
    rdxOcupantesVehiculoTerceroAdd: rdxOcupantesVehiculoTerceroAdd,
    rdxOcupantesVehiculoTerceroDelete: rdxOcupantesVehiculoTerceroDelete,
    rdxOcupantesVehiculoTerceroEdit: rdxOcupantesVehiculoTerceroEdit
  };

  return actions;

  // declaracion

  function rdxExitAssistance() {
    return {
      type: TASK_ACTIONS.ALL.EXIT_ASSISTANCE
    };
  }

  function rdxDetalleUpdate(tabsDetalle) {
    return {
      type: TASK_ACTIONS.DETALLE.UPDATE,
      payload: tabsDetalle
    };
  }

  function rdxConductorUpdate(tabsDetalle) {
    return {
      type: TASK_ACTIONS.DETALLE.UPDATE,
      payload: {
        conductor: tabsDetalle
      }
    };
  }

  function rdxOcupantesDirectosAdd(ocupante) {
    return {
      type: TASK_ACTIONS.OCUPANTES_DIRECTOS.ADD,
      payload: ocupante
    };
  }

  function rdxOcupantesDirectosDelete(idx) {
    return {
      type: TASK_ACTIONS.OCUPANTES_DIRECTOS.DELETE,
      payload: {
        idx: idx
      }
    };
  }

  function rdxOcupantesDirectosEdit(idx, ocupante) {
    return {
      type: TASK_ACTIONS.OCUPANTES_DIRECTOS.EDIT,
      payload: {
        idx: idx,
        ocupante: ocupante
      }
    };
  }

  function rdxFrmsValidate(tabActual) {
    return {
      type: TASK_ACTIONS.ALL.VALIDATE,
      payload: tabActual
    };
  }

  function rdxFrmRequire(afirmacion) {
    return {
      type: TASK_ACTIONS.ALL.REQUIRE,
      payload: afirmacion
    };
  }

  function rdxFrmSaved(afirmacion) {
    return {
      type: TASK_ACTIONS.ALL.SAVED,
      payload: afirmacion
    };
  }

  function rdxBlockByGenerado(afirmacion) {
    return {
      type: TASK_ACTIONS.ALL.BLOCK_BY_GENERADO,
      payload: afirmacion
    };
  }

  function rdxBlockByAnulado(afirmacion) {
    return {
      type: TASK_ACTIONS.ALL.BLOCK_BY_ANULADO,
      payload: afirmacion
    };
  }

  function rdxDanhoVehiculoPropioAdd(danho) {
    return {
      type: TASK_ACTIONS.DANHO_PROPIO.ADD,
      payload: danho
    };
  }

  function rdxDanhoVehiculoPropioDelete(idx) {
    return {
      type: TASK_ACTIONS.DANHO_PROPIO.DELETE,
      payload: {
        idx: idx
      }
    };
  }

  function rdxDanhoVehiculoPropioEdit(idx, danho) {
    return {
      type: TASK_ACTIONS.DANHO_PROPIO.EDIT,
      payload: {
        idx: idx,
        danho: danho
      }
    };
  }

  function rdxPeatonAdd(peaton) {
    return {
      type: TASK_ACTIONS.PEATON.ADD,
      payload: peaton
    };
  }

  function rdxPeatonDelete(idx) {
    return {
      type: TASK_ACTIONS.PEATON.DELETE,
      payload: {
        idx: idx
      }
    };
  }

  function rdxPeatonEdit(idx, peaton) {
    return {
      type: TASK_ACTIONS.PEATON.EDIT,
      payload: {
        idx: idx,
        peaton: peaton
      }
    };
  }

  function rdxBienAdd(bien) {
    return {
      type: TASK_ACTIONS.BIEN.ADD,
      payload: bien
    };
  }

  function rdxBienDelete(idx) {
    return {
      type: TASK_ACTIONS.BIEN.DELETE,
      payload: {
        idx: idx
      }
    };
  }

  function rdxBienEdit(idx, bien) {
    return {
      type: TASK_ACTIONS.BIEN.EDIT,
      payload: {
        idx: idx,
        bien: bien
      }
    };
  }

  function rdxVehiculoTerceroAdd(vehiculo) {
    return {
      type: TASK_ACTIONS.VEHICULO_TERCERO.ADD,
      payload: vehiculo
    };
  }

  function rdxVehiculoTerceroDelete(idx) {
    return {
      type: TASK_ACTIONS.VEHICULO_TERCERO.DELETE,
      payload: {
        idx: idx
      }
    };
  }

  function rdxVehiculoTerceroEdit(idx, vehiculo) {
    return {
      type: TASK_ACTIONS.VEHICULO_TERCERO.EDIT,
      payload: {
        idx: idx,
        vehiculo: vehiculo
      }
    };
  }

  function rdxDanhoVehiculoTerceroUpdate(danhos) {
    return {
      type: TASK_ACTIONS.DANHO_TERCERO.UPDATE,
      payload: danhos
    };
  }

  function rdxDanhoVehiculoTerceroAdd(danho) {
    return {
      type: TASK_ACTIONS.DANHO_TERCERO.ADD,
      payload: danho
    };
  }

  function rdxDanhoVehiculoTerceroDelete(idx) {
    return {
      type: TASK_ACTIONS.DANHO_TERCERO.DELETE,
      payload: {
        idx: idx
      }
    };
  }

  function rdxDanhoVehiculoTerceroEdit(idx, danho) {
    return {
      type: TASK_ACTIONS.DANHO_TERCERO.EDIT,
      payload: {
        idx: idx,
        danho: danho
      }
    };
  }

  function rdxOcupantesVehiculoTerceroUpdate(ocupantes) {
    return {
      type: TASK_ACTIONS.OCUPANTES_TERCERO.UPDATE,
      payload: ocupantes
    };
  }

  function rdxOcupantesVehiculoTerceroAdd(ocupante) {
    return {
      type: TASK_ACTIONS.OCUPANTES_TERCERO.ADD,
      payload: ocupante
    };
  }

  function rdxOcupantesVehiculoTerceroDelete(idx) {
    return {
      type: TASK_ACTIONS.OCUPANTES_TERCERO.DELETE,
      payload: {
        idx: idx
      }
    };
  }

  function rdxOcupantesVehiculoTerceroEdit(idx, ocupante) {
    return {
      type: TASK_ACTIONS.OCUPANTES_TERCERO.EDIT,
      payload: {
        idx: idx,
        ocupante: ocupante
      }
    };
  }
});
