'use strict';

define(['angular'], function(ng) {
  ErrorHandlerService.$inject = ['mModalAlert', 'mModalConfirm', '$log'];

  function ErrorHandlerService(mModalAlert, mModalConfirm, $log) {
    this.handleError = function(error) {
      // mModalAlert.showError(friendlyMessage, 'Error');
      // if (error) console.log('Error', error)
      if (ng.isString(error)) {
        mModalAlert.showError(error, '');
      } else if (ng.isObject(error)) {
        if ('message' in error) {
          mModalAlert.showError(error.message, '');
        }
        $log.error('Error', error);
      }
    };

    this.handleWarning = function(info, title, textConfirm) {
      // mModalAlert.showError(friendlyMessage, 'Error');
      // if (info) console.log('Error', info)
      if (ng.isString(info)) {
        return mModalConfirm.confirmWarning(info, title, textConfirm);
      } else if (ng.isObject(info)) {
        if ('message' in info) {
          return mModalConfirm.confirmWarning(info.message, title, textConfirm);
        }
        $log.info('Info', info);
      }
    };

    this.handleWarningModal = function(info, title) {
      // mModalAlert.showError(friendlyMessage, 'Error');
      // if (info) console.log('Error', info)
      if (ng.isString(info)) {
        return mModalAlert.showWarning(info, title);
      } else if (ng.isObject(info)) {
        if ('message' in info) {
          return mModalAlert.showError(info.message, title);
        }
        $log.info('Info', info);
      }
    };
  }

  return ng.module('appLogin').service('ErrorHandlerService', ErrorHandlerService);
});
