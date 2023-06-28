'use strict';

define(['system'], function(system) {
  var folder = system.apps.ap.location;

  var img = {
    MYD: folder + '/assets/img/mapfre-mydream.png',
    ADMI: folder + '/assets/img/mapfre-adm-misa.png',
    APC: folder + '/assets/img/mapfre-oim.png',
    CPS: folder + '/assets/img/mapfre-cemetery.png'
  };

  return {img: img};
});
