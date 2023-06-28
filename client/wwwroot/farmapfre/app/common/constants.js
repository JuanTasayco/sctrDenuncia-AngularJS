"use strict";

var constants;

define([], function() {
    var clocal = {
        provider: {
            mapfreId: 451
        },
        reporteTypes: [
            { id: 1, description: "AUTORIZACIÓN" },
            { id: 2, description: "PEDIDO" }
        ],
        channels: [
            { id: "LA", description: "DELIVERY AMB." },
            { id: "TC", description: "TE CUIDAMOS" },
            { id: "CM", description: "CENTROS MÉDICOS" }
        ],
        modalType: {
            cancelOrder: 1,
            cancelDispatch: 2,
            transferOrder: 3,
            auditOrder: 4 
        },
        orderStatus: {
            received: 1,
            saved: 2,
            managed: 3,
            canceled: 4,
            delivered: 5
        }
    }
    constants = clocal;
    return clocal;
});