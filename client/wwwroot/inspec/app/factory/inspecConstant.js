'use strict';

define(['angular'], function(ng) {
  var coreConstants = {
    ESTADOS: [
      {label: 'Por programar', id: 1, colorClass: 'c-purple'},
      {label: 'Programada', id: 2, colorClass: 'c-green4'},
      {label: 'Terminada', id: 3, colorClass: 'c-green5'},
      {label: 'En proceso inspec', id: 4, colorClass: 'c-green3'},
      {label: 'En evaluación', id: 5, colorClass: 'c-blue'},
      {label: 'Anulada', id: 6, colorClass: 'c-blue'},
      {label: 'Emitida', id: 7, colorClass: 'c-green'},
      {label: 'Autoinspección en evaluación', id: 8, colorClass: 'c-green4'},
      {label: 'Autoinspección programada', id: 9, colorClass: 'c-orange'}
    ],
    AUTOINSPEC: true,
    TYPE_DOWNLOAD_TREC: {
      SOLICITUD: 'small',
      INFORME: 'full'
    }
  };
  return ng.module('appInspec.factory').constant('inspecConstant', coreConstants);
});
