'use strict';

define(['angular'], function(ng) {
  ActionsHandlerService.$inject = ['UserService'];

  function ActionsHandlerService(UserService) {
    return {
      0: {
        action: 'Rehabilitar',
        isVisible: true
      },
      // POR PROGRAMAR
      1: {
        action: UserService.isAPermittedObject('PROGRA') ? 'Programar' : 'Ver solicitud',
        isVisible: true,
        onlyShow: !UserService.isAPermittedObject('PROGRA')
      },
      // PROGRAMADA
      2: {
        action: UserService.isAPermittedObject('REGINS') ? 'Registrar inspección' : 'Ver solicitud',
        isVisible: true,
        onlyShow: !UserService.isAPermittedObject('REGINS')
      },
      // TERMINADA
      3: {
        action: UserService.isAPermittedObject('EMIINS') ? 'Emitir' : 'Ver inspección',
        isVisible: true,
        onlyShow: !UserService.isAPermittedObject('EMIINS')
      },
      // EN PROCESO DE INSPECCIÓN
      4: {
        action: 'Ver inspección',
        isVisible: true
      },
      // EN EVALUACIÓN
      5: {
        action: 'Ver inspección',
        isVisible: true
      },
      // ANULADA
      6: {
        action: UserService.isAPermittedObject('REVANU')
          ? 'Revertir anulación'
          : 'Ver solicitud',
        isVisible: true,
        onlyShow: !UserService.isAPermittedObject('REVANU'),
        canRevert: UserService.isAPermittedObject('REVANU')
      },
      // EMITIDA
      7: {
        action: 'Ver detalle',
        isVisible: true
      },
      // AUTOINSPECCIÓN PROGRAMADA
      8: {
        action: 'Ver detalle',
        isVisible: true
      },
      // AUTOINSPECCIÓN EN EVALUACIÓN
      9: {
        action: 'Ver autoinspección',
        isVisible: true
      }
    };
  }

  ng.module('appInspec').factory('ActionsHandlerService', ActionsHandlerService);
});
