'use strict';

var data = {};
data.clientes = {
  "PERU": {
    'afiliados': '598.619',
    'lugar': 'PERÚ',
    'grupos': [{
      "id": "3",
      "nombre": 'MAPFRE PERÚ S.A. EPS',
      "afiliados": '44.644',
      "unidades": [
        { "id": "S", "nombre": "Salud regular", "empresas": 883, "titulares": 21064, "habientes": 23580 },
        { "id": "R","nombre": "SCTR", "empresas": 17913, "titulares": 327320, "habientes": 0 }
      ]
    }, {
      "id": "1",
      "nombre": 'MAPFRE PERÚ',
      "afiliados": '226642',
      "unidades": [
        { "id": "J", "nombre": "AAMM Persona Jurídicas", "empresas": 2729, "titulares": 123606, "habientes": 43259 },
        { "id": "N", "nombre": "AAMM Persona Naturales", "particulares": 59785, "titulares": 37683, "habientes": 22102 }
      ]
    }]
  },
  "20": {
    "afiliados": "20.002",
    "lugar": "Piura",
    "grupos": [
      {
        "id": "3",
        "nombre": "MAPFRE PERÚ S.A. EPS",
        "afiliados": "5.000",
        "unidades": [
          { "id": "S", "nombre": "Salud regular", "empresas": 33, "titulares": 73, "habientes": 40 },
          { "id": "R", "nombre": "SCTR", "empresas": 45, "titulares": 13, "habientes": 10 }
        ]
      }, {
        "id": "1",
        "nombre": "MAPFRE PERÚ",
        "afiliados": "30.000",
        "unidades": [
          { "id": "J", "nombre": "AAMM Persona Jurídicas", "empresas": 15, "titulares": 183, "habientes": 200 },
          { "id": "N", "nombre": "AAMM personas naturales", "particulares": 5, "titulares": 83, "habientes": 20 }
        ]
      }
    ]
  },
  "2001": {
    "afiliados": "100",
    "lugar": "Piura",
    "grupos": [{
      "id": "3",
      "nombre": "MAPFRE PERÚ S.A. EPS",
      "afiliados": "200",
      "unidades": [
        { "id": "S", "nombre": "Salud regular", "empresas": 13, "titulares": 183, "habientes": 11 },
        { "id": "R", "nombre": "SCTR", "empresas": 25, "titulares": 83, "habientes": 20 }
      ]
    }, {
      "id": "1",
      "nombre": "MAPFRE PERÚ",
      "afiliados": "300",
      "unidades": [
        { "id": "N", "nombre": "AAMM Persona Naturales", "particulares": 5, "titulares": 83, "habientes": 20 }
      ]
    }]
  },
  "2002": {
    "afiliados": "400",
    "lugar": "Ayabaca",
    "grupos": [{
      "id": "3",
      "nombre": "MAPFRE PERÚ S.A. EPS",
      "afiliados": "500",
      "unidades": [
        { "id": "S", "nombre": "Salud regular", "empresas": 15, "titulares": 183, "habientes": 200 }
      ]
    }, {
      "id": "1",
      "nombre": "MAPFRE PERÚ",
      "afiliados": "600",
      "unidades": [
        { "id": "J", "nombre": "AAMM personas jurídicas", "empresas": 5, "titulares": 83, "habientes": 20 }
      ]
    }]
  },
  "2003": {
    "afiliados": "700",
    "lugar": "Huancabamba",
    "grupos": [
      {
        "id": "3",
        "nombre": "MAPFRE PERÚ S.A. EPS",
        "afiliados": "800",
        "unidades": [
          { "id": "S", "nombre": "Salud regular", "empresas": 88, "titulares": 33, "habientes": 200 }
        ]
      },
      {
        "id": "1",
        "nombre": "MAPFRE PERÚ",
        "afiliados": "900",
        "unidades": [
          { "id": "J", "nombre": "AAMM Persona Jurídicas", "empresas": 15, "titulares": 183, "habientes": 200 },
          { "id": "N", "nombre": "AAMM Persona Naturales", "particulares": 5, "titulares": 83, "habientes": 20 }
        ]
      }
    ]
  },
  "21": {
    "afiliados": "8.000",
    "lugar": "Puno",
    "grupos": [{
      "id": "3",
      "nombre": "MAPFRE PERÚ S.A. EPS",
      "afiliados": "5.000",
      "unidades": [
        { "id": "S", "nombre": "Salud regular", "empresas": 76, "titulares": 83, "habientes": 2 },
        { "id": "R", "nombre": "SCTR", "empresas": 5, "titulares": 9, "habientes": 8 }
      ]
    }, {
      "id": "1",
      "nombre": "MAPFRE PERÚ",
      "afiliados": "30.000",
      "unidades": [
        { "id": "J", "nombre": "AAMM Persona Jurídicas", "empresas": 9, "titulares": 6, "habientes": 200 },
        { "id": "N", "nombre": "AAMM Persona Naturales", "particulares": 5, "titulares": 73, "habientes": 8 }
      ]
    }]
  },
  "15": {
    "afiliados": "25494",
    "lugar": "Lima",
    "grupos": [{
      "id": "3",
      "nombre": "MAPFRE PERÚ S.A. EPS",
      "afiliados": "19874",
      "unidades": [
        { "id": "S", "nombre": "Salud regular", "empresas": 804, "titulares": 12461, "habientes": 7413 },
        { "id": "R", "nombre": "SCTR", "empresas": 1074, "titulares": 4826, "habientes": 0 }
      ]
    }, {
      "id": "1",
      "nombre": "MAPFRE PERÚ",
      "afiliados": "5620",
      "unidades": [
        { "id": "J", "nombre": "AAMM Persona Jurídicas", "empresas": 24447, "titulares": 204, "habientes": 247 },
        { "id": "N", "nombre": "AAMM Persona Naturales", "particulares": 98, "titulares": 12, "habientes": 20 }
      ]
    }]
  },
  "07": {
    "afiliados": "8.000",
    "lugar": "Callao",
    "grupos": [{
      "id": "3",
      "nombre": "MAPFRE PERÚ S.A. EPS",
      "afiliados": "5.000",
      "unidades": [
        { "id": "S", "nombre": "Salud regular", "empresas": 1, "titulares": 183, "habientes": 34 },
        { "id": "R", "nombre": "SCTR", "empresas": 23, "titulares": 55, "habientes": 20 }
      ]
    }, {
      "id": "1",
      "nombre": "MAPFRE PERÚ",
      "afiliados": "30.000",
      "unidades": [
        { "id": "J", "nombre": "AAMM Persona Jurídicas", "empresas": 23, "titulares": 65, "habientes": 76 },
        { "id": "N", "nombre": "AAMM Persona Naturales", "particulares": 5, "titulares": 12, "habientes": 20 }
      ]
    }]
  }
};

data.proveedores = {
  "peru": {
    'proveedores': '5.200'
  },
  "20": {
    'proveedores': '300'
  },
  "2001": {
    'proveedores': '20'
  },
  "2002": {
    'proveedores': '20'
  }
};

module.exports = data;
