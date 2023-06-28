'use strict';

define(['lodash'], function(_) {
  return {
    mapCarousel: mapCarousel
  };

  function mapCarousel(obj) {
    return _.assign(obj, {
      lblMainBtn: obj.activo ? 'MODIFICAR' : 'ACTIVAR'
    });
  }
});
