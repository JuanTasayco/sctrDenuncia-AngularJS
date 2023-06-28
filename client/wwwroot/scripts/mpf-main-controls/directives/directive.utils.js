'use strict';

define([], function() {
  return {
    monthsBetween: monthsBetween,
    truncateDecimalsTo: truncateDecimalsTo
  };

  function monthsBetween(dateInit, dateEnd) {
    var months;
    months = (dateInit.getFullYear() - dateEnd.getFullYear()) * 12;
    months -= dateEnd.getMonth();
    dateEnd = new Date(dateEnd);
    var diff = dateEnd;
    diff.setMonth(new Date().getMonth());
    diff.setFullYear(new Date().getFullYear());
    
    if (dateInit.getTime() < diff.getTime()){
       months+= dateInit.getMonth() - 1;
    } else {
      months+= dateInit.getMonth();
    }
    
    return months <= 0 ? 0 : months;
  }
  
  function truncateDecimalsTo (x, positions) {
    var s = x.toString()
    var l = s.length
    var decimalLength = s.indexOf('.') + 1
    var numStr = s.substr(0, decimalLength + positions)
    return Number(numStr)
  }
});
