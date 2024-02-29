'use strict';

define([], function() {
  var codeChoque = '2';
  var coreConstants = {
    timeToUpdate: 700,
    timeToPollGenerateSinister: 60000,
    codeChoque: codeChoque,
    msgErrorTabs: 'Para poder guardar los cambios debes completar los datos incompletos o corregir formato.',
    lugarAtencion: [
      {codigoValor: 1, nombreValor: 'IGUAL ACCIDENTE'},
      {codigoValor: 2, nombreValor: 'DOMICILIO ASEGURADO'},
      {codigoValor: 3, nombreValor: 'OFICINA ASEGURADO'},
      {codigoValor: 4, nombreValor: 'PAR'},
      {codigoValor: 5, nombreValor: 'TALLER'},
      {codigoValor: 6, nombreValor: 'OTROS'}
    ],
    tipoSiniestro: [{codigoValor: '1', nombreValor: 'ROBO'}, {codigoValor: codeChoque, nombreValor: 'CHOQUE'}],
    lstTipoTaller: [
      {codigoValor: 2, nombreValor: 'Todos'},
      {codigoValor: 17, nombreValor: 'Afiliados'},
      {codigoValor: 57, nombreValor: 'No afiliados'}
    ],
    labelsDetalleSiniestro: [
      {id: 1, label: 'Total'},
      {id: 2, label: 'Audio/Acc.'},
      {id: 3, label: 'Robo/Hurto'},
      {id: 4, label: 'Computadora'},
      {id: 5, label: 'Con fuga'},
      {id: 6, label: 'Con obj. Fijo'},
      {id: 7, label: 'Caída obj.'},
      {id: 8, label: 'C/Animales'},
      {id: 9, label: 'Vandalismo'},
      {id: 10, label: 'Atropello'},
      {id: 11, label: 'Incendio'},
      {id: 12, label: 'Otras'},
      {id: 13, label: 'Rotura luna'},
      {id: 14, label: 'Entre Vehc.'}
    ],
    sexo: [{codigoValor: 1, nombreValor: 'FEMENINO'}, {codigoValor: 2, nombreValor: 'MASCULINO'}],
    dosajeEtilico: [{codigoValor: 'P', nombreValor: 'POSITIVO'}, {codigoValor: 'N', nombreValor: 'NEGATIVO'}],
    indGenExp: [{codigoValor: 'S', nombreValor: 'Sí'}, {codigoValor: 'N', nombreValor: 'No'}],
    estadoParaProcurador: [
      {codigoValor: '', nombreValor: '--TODOS--'},
      {codigoValor: 'ABIERTO', nombreValor: 'NUEVO'},
      {codigoValor: 'PENDIENTE', nombreValor: 'PENDIENTE'},
      {codigoValor: 'DESISTIMIENTO', nombreValor: 'DESISTIMIENTO'},
      {codigoValor: 'AUTORIZADO', nombreValor: 'AUTORIZADO'}
    ],
    estadoParaNoProcurador: [
      {codigoValor: '', nombreValor: '--TODOS--'},
      {codigoValor: 'ANULADO', nombreValor: 'ANULADO'},
      {codigoValor: 'ABIERTO', nombreValor: 'NUEVO'},
      {codigoValor: 'PENDIENTE', nombreValor: 'PENDIENTE'},
      {codigoValor: 'GENERADO', nombreValor: 'GENERADO'},
      {codigoValor: 'DESISTIMIENTO', nombreValor: 'DESISTIMIENTO'},
      {codigoValor: 'AUTORIZADO', nombreValor: 'AUTORIZADO'}
    ],
    codUserType: {
      admin: 'ADMIN',
      procurador: 'PRCDOR',
      observador: 'OBSVDOR',
      supervisor: 'SPERVSOR'
    }
  };
  return coreConstants;
});
