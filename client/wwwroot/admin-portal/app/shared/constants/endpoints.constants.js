'use strict';

define(['lodash', 'constants'], function(_, constants) {
  var paths = {
    current: constants.system.api.endpoints.adminPortal,
    camposanto: constants.system.api.endpoints.camposanto,
    sw: 'http://127.0.0.1:10014/'
  };

  return _.assign(paths, {
    default: paths.current,
    camposanto: paths.camposanto,
  });
});
