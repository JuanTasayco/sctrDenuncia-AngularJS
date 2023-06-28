'use strict';

define(['angular', 'lodash'], function (ng, _) {

  function reServices() {
    var service = {
      formatDateToSlash: formatDateToSlash,
      funDocNumMaxLength: funDocNumMaxLength,
      sumProperty: sumProperty
    }

    return ng.extend({}, service);

    // declarations

    function formatDateToSlash(date) {
      var currentDate = new Date(date);
      var year = currentDate.getFullYear();
      var month = currentDate.getMonth() + 1;
      var day = currentDate.getDate();

      var dayFormat = day < 10 ? '0' + day : day;
      var monthFormat = month < 10 ? '0' + month : month;

      return dayFormat + '/' + monthFormat + '/' + year;
    }

    function funDocNumMaxLength(documentType) {
      //MaxLength documentType
      if (documentType == 1) {
        return 8
      } else if (documentType == 2) {
        return 11
      }
    }

    function sumProperty(arrItems, propertyName) {
      var arrNums = _.map(arrItems, function (item) {
        return isNaN(item[propertyName]) ? 0 : parseFloat(item[propertyName]);
      });

      var sum = _.reduce(arrNums, function (prev, current) {
        return prev + current;
      });

      return sum;
    }
  }

  return ng
    .module('appReembolso.reServices', [])
    .service('reServices', reServices);
})
