define(['angular', 'constants', 'constantsFola'], function (angular, constants, constantsFola) {
  'use strict';

  angular.module(constants.module.polizas.fola.moduleName).factory('folaGeneralFactory', FolaGeneralFactory);

  FolaGeneralFactory.$inject = [];
  function FolaGeneralFactory() {
    var factory = {
      getHtmlListaError: GetHtmlListaError,
      getHtmlTablaError: GetHtmlTablaError,
      roundUp: RoundUp,
    };

    return factory;

    function GetHtmlListaError(errores) {
      var vHtml = '<div class="gnContentAuto-lg">' + '<ul class="g-modalErrorList">';
      angular.forEach(errores, function (error, key) {
        vHtml += '<li>' + error + '</li>';
      });
      vHtml += '</ul>' + '</div>';
      return vHtml;
    }

    function GetHtmlTablaError(errores, isIndividual, observacion) {
      var labelFila = isIndividual ? 'Asegurado' : 'Fila';
      var vHtml =
        '<div class="row">' +
        '<div class="col-md-12">' +
        '<div class="clearfix g-box g-overflow-hidden-xs">' +
        '<ul class="clearfix g-list gBgcGray5 pt-xs-1">' +
        '<li class="col-sm-2 col-ms-2 col-xs-3 clearfix cnt-item g-text-center-xs"><b>' +
        labelFila +
        '</b></li>' +
        '<li class="col-sm-3 col-ms-3 col-xs-3 clearfix cnt-item g-text-left-xs"><b>Columna</b></li>' +
        '<li class="col-sm-7 col-ms-7 col-xs-6 clearfix cnt-item g-text-left-xs"><b>Error</b></li>' +
        '</ul>' +
        '<div class="col-md-12 cnt-content g-list gnContentAuto-sm">';
      angular.forEach(errores, function (error, index, array) {
        var vHtmlHeader =
          index === array.length - 1
            ? '<div class="clearfix mt-xs-1">'
            : '<div class="clearfix mt-xs-1 g-border-bottom-xs">';

        vHtml +=
          vHtmlHeader +
          '<ul class="row">' +
          '<li class="col-sm-2 col-ms-2 col-xs-3 cnt-item item-dato g-text-uppercase g-text-center-xs">' +
          (error.numFilia - (isIndividual ? 1 : 0)) +
          '</li>' +
          '<li class="col-sm-3 col-ms-3 col-xs-3 cnt-item item-dato g-text-uppercase g-text-center-xs">' +
          error.Columna +
          '</li>' +
          '<li class="col-sm-7 col-ms-7 col-xs-6 cnt-item item-dato g-text-uppercase g-text-left-xs">' +
          error.Descripcion +
          '</li>' +
          '</ul>' +
          '</div>';
      });
      vHtml += '</div>' + '</div>' + '</div>' + '</div>';

      var vHtmlDni =
        '<div class="row">' +
        '<div class="col-md-12 mb-xs-2">' +
        '<div class="swal2-content">' +
        '<div class="g-text-left-xs">Se ha(n) encontrado DNI(s) con data errada, en caso de continuar el proceso los trabajadores con DNI incorrecto, no tendrán cobertura por VIDA LEY en caso de eventuales siniestros</div>' +
        '</div>' +
        '</div>' +
        '</div>';

      return observacion ? vHtmlDni + vHtml : vHtml;
    }

    function RoundUp(value) {
      return Math.ceil(value * Math.pow(10, 2)) / Math.pow(10, 2);
    }
  }
});
