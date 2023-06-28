'use strict';

define(['angular'], function(ng) {
  return {
    copyToClipboard: copyToClipboard,
    removeItemFromArray: removeItemFromArray,
    dateTimeValid: dateTimeValid,
    hourValid : hourValid,
    getFullDate: getFullDate
  };

  function copyToClipboard (name) {
    var copyElement = document.createElement("textarea");
    copyElement.style.position = 'fixed';
    copyElement.style.opacity = '0';
    copyElement.textContent = decodeURI(name);
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(copyElement);
    copyElement.select();
    document.execCommand('copy');
    body.removeChild(copyElement);
  }

  function removeItemFromArray ( arr, item ) {
    var i = arr.indexOf( item );
 
    if ( i !== -1 ) {
        arr.splice( i, 1 );
    }
  }

  function hourValid(timeStr) {
    var isValid = true;
    if(timeStr) {
      var timeStr = timeStr.replace(':', '');
      var fullTimeNumb = parseInt(timeStr);
      var timeNumb = parseInt(timeStr.substr(0, 2));
      var secondNumb = parseInt(timeStr.substr(2, 2));

      if(fullTimeNumb <= 0 || fullTimeNumb > 2359) {
        isValid = false;
      }
      
      if(isValid) {
        if(timeNumb > 23) {
          isValid = false;
        }
  
        if(isValid) {
          if(secondNumb > 59) {
            isValid = false;
          }
        }
      }
    }
    return isValid;
  }

  function dateTimeValid(date, time, dateCompare) {
    var thisDay = dateCompare || new Date();
    if(!date) {
      return hourValid(time);
    } else {
      var timep = time || "2359";
      timep = timep.replace(':', '');
      if(hourValid(timep)) {
        var dateP = new Date(date.getFullYear(), date.getMonth(), date.getDate(), timep.substr(0, 2), timep.substr(2, 2), 59);
        return (dateP > thisDay);
      } else {
        return false;
      }
    }
  }

  function getFullDate(date, time) {
    var timep = time;
    if(date) {
        if(timep) {
          new Date()
          timep = timep.replace(':', '');
          return new Date(date.getFullYear(), date.getMonth(), date.getDate(), timep.substr(0, 2), timep.substr(2, 2));
        }
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    return null;
  }

});