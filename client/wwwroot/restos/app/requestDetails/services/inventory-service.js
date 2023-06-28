'use strict';

define(['angular', 'constants'],
  function(ng) {
    inventoryService.$inject = ['httpData'];

    function inventoryService(httpData) {

      function unparseInventory(requestId, inventory, action) {
        inventory = angular.copy(inventory);
        return {
          CSLCTD: requestId,
          OBS_ENTRADA_INV: inventory.OBS_ENTRADA_INV.toUpperCase(),
          OBS_SALIDA_INV: inventory.OBS_SALIDA_INV.toUpperCase(),
          lista: inventory.grupos.reduce(function (list, group) {
            return list.concat(
              group.items.reduce(function (items, item) {
                if (action === 'modify') {
                  if (item.MCA_SALDA || item.OBS_SLDA) {
                    return items.concat({
                      PART_VEHI: item.PART_VEHI,
                      MCA_SALDA: item.MCA_SALDA ? 'S' : 'N',
                      OBS_SLDA: item.OBS_SLDA.toUpperCase()
                    });
                  }
                } else {
                  if (item.MCA_ENTRDA || item.OBS_ENTRDA) {
                    return items.concat({
                      PART_VEHI: item.PART_VEHI,
                      MCA_ENTRDA: item.MCA_ENTRDA ? 'S' : 'N',
                      OBS_ENTRDA: item.OBS_ENTRDA.toUpperCase()
                    });
                  }
                }
                return items;
              }, []));
          }, [])
        };
      }

      var baseUrl = constants.system.api.endpoints.restos;

      function registerInventory(requestId, inventory, action) {
        var url = baseUrl + 'wsRGrvTransaccional.svc/' + (action === 'modify' ? 'modificar_inventario/' : 'registrar_inventario/');
        return httpData.post(
          url,
          unparseInventory(requestId, inventory, action),
          undefined,
          true
        );
      }

      function hasInventoryDifferences(inventory) {
        var items = inventory.lista;
        for (var i = 0, x = items.length; i < x; i++) {
          if (items[i].MCA_DFRNCIA) {
            return true;
          }
        }
        return false;

      }

      return {
        registerInventory: registerInventory,
        hasInventoryDifferences: hasInventoryDifferences
      };



    }

    return ng.module('appRestos')
      .service('inventoryService', inventoryService);
  }
);
