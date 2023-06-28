'use strict'

define([
  'angular', 'constants'
], function(angular, constants, es6Promise){

  var appRestos = angular.module('appRestos');

  appRestos.service('newRequestService', ['httpData', '$log',
    function(httpData, $log) {

      function parseData(data) {

        function getPropertygroup(prop) {

          var groups = ['DatosGenerales', 'Contratante', 'Taller', 'Vehiculo'];

          var propsAgrupation = {
            ANIO_FBRCCION: 3,
            APLLDO_MTRNO: 1,
            APLLDO_PTRNO: 1,
            COD_CLOR: 3,
            COD_DPRTMNTO_1: 0,
            COD_DPRTMNTO_2: 1,
            COD_DSTRTO_1: 0,
            COD_DSTRTO_2: 1,
            COD_MARCA: 3,
            COD_MDLO: 3,
            COD_PRVNCIA_1: 0,
            COD_PRVNCIA_2: 1,
            COD_ORGN: 0,
            COD_SB_MDLO: 3,
            COD_TALLER: 0,
            COD_UNDAD: 0,
            CPSCN: 0,
            CSLCTD: 0,
            CUBCN: 0,
            DIRECC_CNTCTO: 0,
            DRCCON: 1,
            EMAIL_PRSNAL: 1,
            EMAIL_OFCNA: 1,
            ESTDO_CVIL: 1,
            ESTDO_SLCTD: 0,
            FEC_NACIMIENTO: 1,
            KLMTRJE_VEHI: 3,
            MCA_CHTRRA: 0,
            MON_SMA_ASGRDA: 3,
            MON_VLR_CMRCIAL: 3,
            MON_VLR_RSTO: 3,
            NMBRES: 1,
            NOM_CNTCTO: 0,
            NRO_CHSIS: 3,
            NRO_CLNDRDDAS: 3,
            NRO_DCMNTO: 1,
            NRO_MTOR: 3,
            NRO_PRTAS: 3,
            NRO_SRIE_VIN: 3,
            NUM_PLCA: 3,
            NUM_POLIZA: 0,
            NUM_SINI: 0,
            PSO_VEH: 3,
            RFERNCIA: 1,
            SMA_ASGRDA: 3,
            SXO: 1,
            TALLER: 0,
            TELEFONO_TALLER: 3,
            TELF_CNTCTO: 0,
            TLF_FJO: 1,
            TLF_MVIL: 1,
            TIP_DCMNTO: 1,
            TIP_DNO: 0,
            TIP_MTOR: 3,
            TIP_TMON: 3,
            TIP_TRCCON: 3,
            TIP_VEH: 3,
            TPO_TRASM: 3,
            VLR_CMRCIAL: 3,
            VLR_RSTO: 3
          };

          return groups[propsAgrupation[prop]];

        }

        function propertyNameRewrite (propertyName) {
          var namesToRewrite = {
            COD_DPRTMNTO_1: 'COD_DPRTMNTO',
            COD_DPRTMNTO_2: 'COD_DPRTMNTO',
            COD_DSTRTO_1: 'COD_DSTRTO',
            COD_DSTRTO_2: 'COD_DSTRTO',
            COD_PRVNCIA_1: 'COD_PRVNCIA',
            COD_PRVNCIA_2: 'COD_PRVNCIA',

          };
          return namesToRewrite[propertyName] ? namesToRewrite[propertyName] : propertyName;
        }

        function valuesManipulation(property, value) {
          var propertiesToManipulate = {
            ANIO_FBRCCION: parseInt,
            APLLDO_MTRNO: toUppercase,
            APLLDO_PTRNO: toUppercase,
            COD_DPRTMNTO_1: parseInt,
            COD_DPRTMNTO_2: parseInt,
            COD_DSTRTO_1: parseInt,
            COD_DSTRTO_2: parseInt,
            COD_ORGN: parseInt,
            COD_PRVNCIA_1: parseInt,
            COD_PRVNCIA_2: parseInt,
            COD_CLOR: parseInt,
            COD_MARCA: parseInt,
            COD_MDLO: parseInt,
            COD_SB_MDLO: parseInt,
            COD_UNDAD: parseInt,
            CPSCN: parseInt,
            CUBCN: parseInt,
            FEC_NACIMIENTO: dateToString,
            KLMTRJE_VEHI: parseInt,
            MON_SMA_ASGRDA: parseInt,
            MON_VLR_CMRCIAL: parseInt,
            MON_VLR_RSTO: parseInt,
            NMBRES: toUppercase,
            NRO_DCMNTO: toUppercase,
            NRO_PRTAS: parseInt,
            NUM_SINI: parseInt,
            NUM_PLCA: toUppercase,
            NUM_POLIZA: toUppercase,
            PSO_VEH: parseInt,
            RFERNCIA: toUppercase,
            SMA_ASGRDA: parseInt,
            TALLER: toUppercase,
            TIP_MTOR: parseInt,
            TIP_TMON: parseInt,
            TPO_TRASM: parseInt,
            TIP_TRCCON: parseInt,
            TIP_VEH: parseInt,
            VLR_CMRCIAL: parseInt,
            VLR_RSTO: parseInt
          };

          function parseInt(value) {
            return +value;
          }

          function dateToString(date) {
            var dd = ('' + date.getDate()).length === 1 ? '0' + date.getDate() : date.getDate(),
              mm = ('' + date.getMonth()).length === 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
              yyyy = date.getFullYear();

            return dd + '-' + mm + '-' + yyyy;
          }

          function toUppercase(value) {
            return value.toUpperCase();
          }

          return propertiesToManipulate[property] ? propertiesToManipulate[property](value) : value;
        }

        return Object.keys(data).reduce(function(parsedData, prop) {

          // Si el valor es null, no incluímos la propiedad
          if (!data[prop]) {
            return parsedData;
          }

          // Averiguamos el grupo al que pertenece la propiedad
          var propGroup = getPropertygroup(prop);

          // Si la propiedad no pertenece a un grupo, la omitimos
          if (!propGroup) {
            $log.warn('La propiedad \'' + prop + '\' no pertenece a ningún grupo, y por tanto no será guardada.');
            return parsedData;
          }

          // Si no existe dicho grupo, lo creamos en nuestro nuevo objeto
          if (!parsedData[propGroup]) {
            parsedData[propGroup] = {};
          }

          // Renombramos el nombre de la propiedad si es necesario
          var propName = propertyNameRewrite(prop);

          // Manipulamos el valor de la propiedad si es necesario
          var propValue = valuesManipulation(prop, data[prop]);

          // Incluimos la propiedad con su valor en el nuevo objeto (en su grupo correspondiente y renombrada si fuere necesario).
          parsedData[propGroup][propName] = propValue;

          return parsedData;
        }, {});

      }


      return {
        save: function(data) {
          var url = constants.system.api.endpoints.restos + 'wsRGrvTransaccional.svc/crear_solicitud/';
          return httpData.post(
            url,
            parseData(data),
            undefined,
            true
          );
        },
        searchMechanic: function(searchInput) {
          var url = constants.system.api.endpoints.restos + 'wsRGrvMantenimiento.svc/taller/searchByName/' + searchInput;
          return httpData.get(
            url,
            undefined,
            undefined,
            false
          ).then(function(res) {
            return res.Resultado.concat([{CODIGO: 9999, NOMBRE: 'OTROS TALLERES'}]);
          });
        }
      };

    }]);

});
