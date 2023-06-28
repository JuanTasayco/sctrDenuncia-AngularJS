'use strict';

var constantsSalud;
define([], function () {
  var salud = {
    sexCodes: {
      male: 1,
      female: 0
    },
    suscripcion: {
      questionAnswers: {
        yes: 'S',
        no: 'N'
      },
      questionTypes: {
        date: 4,
        input: 2,
        radio: 1,
        select: 7
      }
    },
    requestReasoNewPolicyCode: 1
  }

  constantsSalud = salud;
  return salud;
});
