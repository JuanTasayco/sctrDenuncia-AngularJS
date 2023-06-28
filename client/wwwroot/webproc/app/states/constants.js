'use strict';

define(function() {
  var ASISTENCIA = {
    ALL: {
      EXIT_ASSISTANCE: 'EXIT_ASSISTANCE',
      REQUIRE: 'FRM_REQUIRE',
      VALIDATE: 'FRM_VALIDATE',
      SAVED: 'FRM_SAVED',
      BLOCK_BY_GENERADO: 'BLOCK_BY_GENERADO',
      BLOCK_BY_ANULADO: 'BLOCK_BY_ANULADO'
    },
    DETALLE: {
      UPDATE: 'DETALLE_UPDATE'
    },
    CONDUCTOR: {
      UPDATE: 'CONDUCTOR_UPDATE'
    },
    OCUPANTES_DIRECTOS: {
      ADD: 'OCUPANTES_DIRECTOS_ADD',
      DELETE: 'OCUPANTES_DIRECTOS_DELETE',
      EDIT: 'OCUPANTES_DIRECTOS_EDIT'
    },
    DANHO_PROPIO: {
      ADD: 'DANHO_VEHICULO_PROPIO_ADD',
      DELETE: 'DANHO_VEHICULO_PROPIO_DELETE',
      EDIT: 'DANHO_VEHICULO_PROPIO_EDIT'
    },
    PEATON: {
      ADD: 'PEATON_ADD',
      DELETE: 'PEATON_DELETE',
      EDIT: 'PEATON_EDIT'
    },
    BIEN: {
      ADD: 'BIEN_ADD',
      DELETE: 'BIEN_DELETE',
      EDIT: 'BIEN_EDIT'
    },
    VEHICULO_TERCERO: {
      ADD: 'VEHICULO_TERCERO_ADD',
      DELETE: 'VEHICULO_TERCERO_DELETE',
      EDIT: 'VEHICULO_TERCERO_EDIT'
    },
    DANHO_TERCERO: {
      UPDATE: 'DANHO_TERCERO_UPDATE',
      ADD: 'DANHO_TERCERO_ADD',
      DELETE: 'DANHO_TERCERO_DELETE',
      EDIT: 'DANHO_TERCERO_EDIT'
    },
    OCUPANTES_TERCERO: {
      UPDATE: 'OCUPANTES_TERCERO_UPDATE',
      ADD: 'OCUPANTES_TERCERO_ADD',
      DELETE: 'OCUPANTES_TERCERO_DELETE',
      EDIT: 'OCUPANTES_TERCERO_EDIT'
    }
  };

  return ASISTENCIA;
});
