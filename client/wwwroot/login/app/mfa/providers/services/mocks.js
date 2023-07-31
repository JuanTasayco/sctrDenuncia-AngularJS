'use strict';

define([], function() {
  return {
    MODALITIES: {
      "message": "Process executed successfully",
      "timestamp": 1690498378127,
      "operationCode": 200,
      "data": [
          {
              "modalityCode": "79d9b9dfa274440590a62b6357977c46",
              "detail": [
                  {
                      "field": "TXT_CORREO",
                      "value": "Enviar por <b>correo electrónico</b> a: <br><b>eri**@multiplica.com</b>"
                  },
                  {
                      "field": "TXT_CORREO_VALIDAR",
                      "value": "Hemos enviado un <b>correo electrónico</b> a: <b>eri**@multiplica.com</b>"
                  }
              ]
          },
          {
              "modalityCode": "fe6d97c0288942b491d68f6183d01a8c",
              "detail": [
                  {
                      "field": "TXT_SMS",
                      "value": "Enviar por <b>mensaje de texto</b> al: <br><b>*******47</b>"
                  },
                  {
                      "field": "TXT_SMS_VALIDAR",
                      "value": "Hemos enviado un <b>mensaje de texto</b> al: <b>*******47</b>"
                  }
              ]
          }
      ]
    }
  };
});
