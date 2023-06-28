/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */
'use strict';

module.exports.routes = {

  /* **************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  // '/': {
  //   view: 'homepage'
  // },

  /* **************************************************************************
   *                                                                          *
   * Custom routes here...                                                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the custom routes above, it   *
   * is matched against Sails route blueprints. See `config/blueprints.js`    *
   * for configuration options and examples.                                  *
   *                                                                          *
   ***************************************************************************/
   // son uno solo para afiliados {
  'GET /clientes/ubigeo/': 'Clientes.ubigeoPeru',
  'GET /clientes/ubigeo/:id': 'Clientes.ubigeoPeru',
  //  }

  // get lista de empresas
  'POST /clientes/entidad/buscar': { controller: 'ClientesController', action: 'entidad' },

  'POST /clientes/afiliados/buscar': 'Clientes.afiliados',
  'POST /clientes/afiliados/cobertura': 'Clientes.cobertura',

  //  proveedores
  'POST /proveedores/buscar': 'Proveedores.filter',

  //  detalleProveedor
  'POST /proveedores/detalles': 'Proveedores.detalles',

  // son uno solo para Proveedores {
  'GET /proveedores/ubigeo/': 'Proveedores.ubigeoPeru',
  'GET /proveedores/ubigeo/:idProveedor': 'Proveedores.ubigeoPeru',
  //  }

  //  Registro referencia
  'POST /referencia/add': 'Referencias.save',

  //  Reportes referencias
  'POST /referencia/listaReferencia': 'Referencias.filter',
  'POST /referencia/detalleReferencia': 'Referencias.referencia',
  'POST /referencia/excelReferencia': 'Referencias.excel',
  'POST /referencia/resumen/pdf': 'Referencias.pdf',

  'GET /proveedores/filtros': 'MasterData.all'
};
