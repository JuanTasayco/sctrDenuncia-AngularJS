/* global requirejs b:true */
/* eslint no-undef: "error" */

'use strict';
define('redefineMod', ['require'],
  function(require) {
    requirejs.undef('lodash');
    // requirejs.undef('jquery');
    requirejs.config({
      paths: {
        lodash: '../scripts/lodash/dist/lodash'
      },
      shim: {
        lodash: {
          exports: '_'
        }
      }
    });
    require(['lodash', 'jquery'],
      function(ld, jq) {
        console.info('Lodash ' + ld.VERSION + ' and Jquery ' + jq.fn.jquery  + ' were loaded successfully'); //eslint-disable-line
      },
      function() {
        console.error('Error while trying to retry request!'); //eslint-disable-line
      });
  });
