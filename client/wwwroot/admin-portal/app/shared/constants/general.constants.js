'use strict';

define([], function() {
  return {
    bannerFileNaleLength: 100,
    defaultMaxKbSize: 2000000,
    urlRegEx: /^(http(s)?:\/\/)+((www\.)?)+[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
    youTubeLinkRegEx: /^[0-9a-zA-Z\/\-\_\=\&\?]+$/,
    sortBy: {
      latest: 'MÁS RECIENTE',
      name: 'NOMBRE'
    }
  };
});
