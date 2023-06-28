'use strict';

define([], function() {
  return {
    getAllIcons: getAllIcons,
    getIcoByCode: getIcoByCode
  };

  function getIcoByCode(code) {
    return getAllIcons()[code] || '';
  }

  function getAllIcons() {
    return {
      0: '',
      1: 'ap-ico-mapfre-general',
      2: 'ap-ico-mapfre_019_car',
      3: 'ap-ico-mapfre_020_cross',
      4: 'ap-ico-mapfre_017_house',
      5: 'ap-ico-mapfre_016_heart',
      6: 'ap-ico-mapfre_148_bird',
      7: 'ap-ico-mapfre_235_travel',
      8: 'ap-ico-mapfre_073_casco'
    };
  }
});
