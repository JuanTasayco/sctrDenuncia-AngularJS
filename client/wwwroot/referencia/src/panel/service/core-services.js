'use strict';
define(function() {

  function getCategoriasFn() {
    return this.masterData.Data.categorias.filtros;
  }

  function getEntidadesFn() {
    return this.masterData.Data.entidades.filtros;
  }

  function getServiciosFn() {
    return this.masterData.Data.servicios.filtros;
  }

  function getImagenologiasFn() {
    return this.masterData.Data.imagenologias.filtros;
  }

  function getEmergenciasFn() {
    return this.masterData.Data.emergencias.filtros;
  }

  function getAmbulanciasFn() {
    return this.masterData.Data.ambulancias.filtros;
  }

  function getEspecialidadesFn() {
    return this.masterData.Data.especialidades.filtros;
  }

  function getPlantillasFn() {
    return this.masterData.Data.plantillas.filtros;
  }

  function setMasterDataFn(value) {
    this.masterData = value;
  }

  function getMasterDataFn() {
    return this.masterData;
  }

  return {
    getCategorias: getCategoriasFn,
    getEntidades: getEntidadesFn,
    getServicios: getServiciosFn,
    getImagenologias: getImagenologiasFn,
    getEmergencias: getEmergenciasFn,
    getAmbulancias: getAmbulanciasFn,
    getEspecialidades: getEspecialidadesFn,
    getPlantillas: getPlantillasFn,
    setMasterData: setMasterDataFn,
    getMasterData: getMasterDataFn,
    jsonTokenName: 'jwtMapfreToken_jwtMapfreToken'
  };
});
