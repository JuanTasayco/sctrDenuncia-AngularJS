define(['angular'], function(ng) {
  return {
      isValidExcel: isValidExcel,
      isValidSize: isValidSize,
      cleanExcelFile: cleanExcelFile,
      modal: modal
    };
    
    function isValidExcel(type) {
      return (
        type.indexOf('ms-excel') != -1 || type.indexOf('openxmlformats-officedocument.spreadsheetml.sheet') != -1
      )
    }
    function isValidSize (size) {
      return size <= 1024000;
    }
    
    function cleanExcelFile(fileDefault, input) {
      setTimeout(function () {
        if (input.files.length) {
          input.files = fileDefault;
        }
      });
    }
    
    function modal(instancia) {
      return function (type) {
        return function () {
          var modals = {
            showSuccess: 'showSuccess',
            showWarning: 'showWarning',
            confirmInfo: 'confirmInfo',
            default: 'showInfo'
          }
          var modalType = modals[type] || modals.default
          instancia[modalType].apply(null, arguments);
        }
      }
    }
});
