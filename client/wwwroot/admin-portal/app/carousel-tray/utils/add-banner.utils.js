'use strict';

define(['angular', 'lodash', 'productsConstants'], function(ng, _, productsConstants) {
  return {
    mapBannerOption: mapBannerOption,
    getParsedStringDate: getParsedStringDate,
    getDDMMYYYY: getDDMMYYYY
  };

  function mapBannerOption(obj) {
    return _.assign(obj, {
      icon: productsConstants.getIcoByCode(obj.idProducto)
    });
  }

  function getParsedStringDate(baseDate) {
    // HACK: to fix datew with dash separation
    // https://stackoverflow.com/questions/5619202/converting-a-string-to-a-date-in-javascript
    var parsedStringDate =
      ng.isString(baseDate) && /^\d{4}-[01]\d-[0-3]\d$/.test(baseDate) && baseDate.replace(/-/g, '/');

    return new Date(parsedStringDate || baseDate);
  }

  function getDDMMYYYY(baseDate, separador) {
    var separator = separador || '/';
    var newDate = getParsedStringDate(baseDate);
    var month = ('0' + (newDate.getMonth() + 1)).slice(-2);
    var day = ('0' + newDate.getDate()).slice(-2);
    var year = newDate.getFullYear();

    return [day.toString(), month.toString(), year.toString()].join(separator);
  }
});
