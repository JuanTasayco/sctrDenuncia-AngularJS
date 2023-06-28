'use strict'

define([
  'angular', 'constants', 'nsctr_constants', 'lodash',
], function (angular, constants, nsctr_constants, _) {

  var appNsctr = angular.module('appNsctr');
  /*########################
  # factory
  ########################*/
  appNsctr.factory('objectFactory',
    ['mainServices', '$state', 'oimPrincipal', 'mModalAlert', '$q', 'mpSpin',
      function (mainServices, $state, oimPrincipal, mModalAlert, $q, mpSpin) {
				/*########################
	      # oSelectedItem
	      ########################*/
        var oSelectedItem = function oSelectedItem() {
          this.id = '';
          this.documentType = '';
          this.documentNumber = '';
          this.name = '';

          function _setItem(id, documentType, documentNumber, name) {
            this.id = id || '';
            this.documentType = documentType || '';
            this.documentNumber = documentNumber || '';
            this.name = name || '';
          }

          function _setId(id) {
            this.id = id || '';
          }

          this.setItem = _setItem;
          this.setId = _setId;
        };
				/*########################
	      # oDocumentNumber
	      ########################*/
        var oDocumentNumber = function oDocumentNumber(model, validationOption) {
          var vValidationOption = validationOption || 0;

          this.model = model || '';

          function _setModel(model) {
            this.model = model || '';
          }

          function _setFieldsToValidate(documentType) {
            var vArrayFnFieldsToValidate = [
              mainServices.documentNumber.fnFieldsToValidate(documentType),
              mainServices.documentNumber.fnFieldsToValidate1(documentType)
            ];
            var vValidate = vArrayFnFieldsToValidate[vValidationOption];
            this.FIELD_TYPE = vValidate.fieldType;
            this.FIELD_TYPE_DISABLED = vValidate.fieldTypeDisabled;
            this.MAX_LENGTH = vValidate.maxLength;
          }

          this.setModel = _setModel;
          this.setFieldsToValidate = _setFieldsToValidate;

          this.setFieldsToValidate(null);
        };
				/*########################
	      # oDatePicker
	      ########################*/
        var oDatePicker = function oDatePicker(model, options, validate) {
          var vDefaultOptions = {
            formatYear: 'yy',
            initDate: null, //initDate when openCalendar
            maxDate: null,
            minDate: null,
            startingDay: 1
          },
            vOptions = options || {},
            vMegerOptions = angular.merge({}, vDefaultOptions, vOptions);

          if (typeof model === 'string') model = mainServices.date.fnStringToDate(model);
          this.model = model || null;
          this.options = vMegerOptions;
          this.open = false;
          this.FORMAT_DATE = constants.formats.dateFormat;
          this.FORMAT_MASK = constants.formats.dateFormatMask;
          this.FORMAT_PATTERN = constants.formats.dateFormatRegex;
          this.ALT_INPUT_FORMATS = ['M!/d!/yyyy'];
          this.validate = validate || {};

          function _setModel(model) {
            if (typeof model === 'string') model = mainServices.date.fnStringToDate(model);
            this.model = model;
          }
          function _setInitDate(initDate) {
            this.options.initDate = initDate
          }
          function _setMaxDate(maxDate) {
            this.options.maxDate = maxDate
          }
          function _setMinDate(minDate) {
            this.options.minDate = minDate
          }
          function _setOpen(open) {
            this.open = open;
          }
          function _setFormatDate(formatDate) {
            this.FORMAT_DATE = formatDate;
          }
          function _setFormatMask(formatMask) {
            this.FORMAT_MASK = formatMask;
          }
          function _setFormatPattern(formatPattern) {
            this.FORMAT_PATTERN = formatPattern;
          }
          function _setAltInputFormats(altInputFormats) {
            this.ALT_INPUT_FORMATS = altInputFormats;
          }
          function _setValidate(validate) {
            var vSetValidate = angular.merge({}, this.validate, validate);
            this.validate = vSetValidate;
          }
          function _setOptions(options) {
            this.options = angular.merge({}, this.options, options);
          }

          this.setModel = _setModel;
          this.setInitDate = _setInitDate;
          this.setMaxDate = _setMaxDate;
          this.setMinDate = _setMinDate;
          this.setOpen = _setOpen;
          this.setFormatDate = _setFormatDate;
          this.setFormatMask = _setFormatMask;
          this.setFormatPattern = _setFormatPattern;
          this.setAltInputFormats = _setAltInputFormats;
          this.setValidate = _setValidate;
          this.setOptions = _setOptions;
        };
				/*########################
	      # oMessageError
	      ########################*/
        var oMessageError = function oMessageError() {
          this.type = null;
          this.title = null;
          this.description = null;
          this.timer = null;
          this.textConfirme = null;
          this.customClass = null;

          function _setMessageError(type, title, description, timer, textConfirme, customClass) {
            this.type = type;
            this.title = title;
            this.description = description;
            this.timer = timer || this.timer;
            this.textConfirme = textConfirme || this.textConfirme;
            this.customClass = customClass || this.customClass;
          }
          function _setType(type) {
            this.type = type;
          }
          function _setTitle(title) {
            this.title = title;
          }
          function _setDescription(description) {
            this.description = description;
          }
          function _setTextConfirme(textConfirme) {
            this.textConfirme = textConfirme;
          }
          function _setCustomClass(customClass) {
            this.customClass = customClass;
          }
          function _getObject() {
            return {
              type: this.type,
              title: this.title,
              description: this.description
            };
          }
          function _showModalAlert() {
            var vModalAlert = {
              W: mModalAlert.showWarning,
              E: mModalAlert.showError
            };
            return vModalAlert[this.type](this.description, this.title, null, this.timer, this.textConfirme, this.customClass);
          }

          this.setMessageError = _setMessageError;
          this.setType = _setType;
          this.setTitle = _setTitle;
          this.setDescription = _setDescription;
          this.setTextConfirme = _setTextConfirme;
          this.setCustomClass = _setCustomClass;
          this.getObject = _getObject;
          this.showModalAlert = _showModalAlert;
        };
				/*########################
				# oDataListCheckFilter
				########################*/
        var oDataListCheckFilter = function oDataListCheckFilter() {
          var _self = this;

          _self.allList = [];
          _self.list = [];
          _self.property = null;
          _self.disabledItems = false;

          function _setDisabledItems(value) {
            _self.disabledItems = value;
          }

          function _checkFilter(allList, checkFilter, property, currentCheckFilter) {
            return allList.filter(function (item) {
              return _.find(checkFilter, function (check) {
                return check.model && check.code === item[property];
              });
            }).map(function (item) {
              if (currentCheckFilter && currentCheckFilter.model && !item.disabled && item[property] === currentCheckFilter.code) {
                item.mCheck = true;
              }
              return _.omit(item, ['$$hashKey']);
            });
          }

          function _setDataList(allList, checkFilter, property, userPermission) {
            var vCheckFilter = checkFilter || [];

            _self.property = property || null;
            _self.allList = allList || [];

            var vEnabled = true;
            angular.forEach(_self.allList, function (item1, index1, array) {
              if (userPermission) {
                vEnabled = _.find(userPermission.list, function (item2, index2) {
                  return item1[property] == item2;
                });
              }
              item1.index = index1;
              item1.disabled = (_self.disabledItems)
                ? _self.disabledItems
                : !vEnabled;
              item1.mCheck = !!vEnabled;
            });
            _self.list = _checkFilter(_self.allList, vCheckFilter, _self.property);
          }

          function _updateAllList() {
            //update allWorks with workersList
            angular.forEach(_self.list, function (item, index) {
              _self.allList.splice(item.index, 1, item);
            });
            //
          }

          function _setDataListByCheckFilter(checksFilter, currentCheckFilter) {
            var defered = $q.defer();
            mpSpin.start();
            if (currentCheckFilter) _updateAllList();
            setTimeout(function () {
              try {
                _self.list = _checkFilter(_self.allList, checksFilter, _self.property, currentCheckFilter);
                defered.resolve(_self.list);
                mpSpin.end();
              } catch (e) {
                defered.reject(e);
                mpSpin.end();
              }
            }, 100);

            return defered.promise;
          }

          _self.setDisabledItems = _setDisabledItems;
          _self.setDataList = _setDataList;
          _self.setDataListByCheckFilter = _setDataListByCheckFilter;

        };
				/*########################
	      # oDataList
	      ########################*/
        var oDataList = function oDataList(paginationType, pagination) {
          var _self = this,
            vPaginationType = paginationType || constants.paginationType.back,
            vPagination = pagination || 10;

          _self.totalRows = 0;
          _self.totalRowsActive = 0;
          _self.totalPages = 0;
          _self.allList = [];
          _self.list = [];
          _self.paginationType = vPaginationType;
          _self.pagination = vPagination;
          _self.showPagination = false;
          _self.totalItemsPagination = 0;

          function _setPaginationType(paginationType) {
            _self.paginationType = paginationType || constants.paginationType.back;
          }
          function _setPagination(pagination) {
            _self.pagination = pagination || 10;
          }

          function _setTotalRows(totalRows) {
            _self.totalRows = totalRows;
          }
          function _setTotalRowsActive(totalRowsActive) {
            _self.totalRowsActive = totalRowsActive;
          }
          function _setTotalPages(totalPages) {
            _self.totalPages = totalPages;
          }

          function _paginationBack(list, totalRows, totalRowsActive, totalPages) {
            _self.totalPages = parseInt(totalPages) || 0;
            _self.totalRowsActive = parseInt(totalRowsActive) || 0;
            _self.totalRows = parseInt(totalRows) || 0;
            _self.list = list || [];

            _self.showPagination = _self.totalPages > 1;
            _self.totalItemsPagination = _self.totalPages * 10;
          }
          function _slice(currentPage) {
            var vCurrentPage = currentPage || 1,
              vStart = (vCurrentPage - 1) * vPagination,
              vEnd = vStart + vPagination,
              vSlice = {
                start: vStart,
                end: vEnd
              };

            return vSlice;
          }
          function _paginationFront(allList, totalRows, totalRowsActive) {
            _self.totalRowsActive = parseInt(totalRowsActive) || 0;
            _self.totalRows = parseInt(totalRows) || 0;
            _self.allList = _.map(allList, function (value, key) {
              value.index = key;
              return value;
            }) || [];
            var vSlice = _slice();
            _self.list = _self.allList.slice(vSlice.start, vSlice.end) || [];

            _self.showPagination = _self.totalRows > _self.pagination;
            _self.totalItemsPagination = Math.ceil(_self.totalRows / _self.pagination) * 10;
          }
          function _setDataList(allList, totalRows, totalRowsActive, totalPages) {
            if (_self.paginationType == 'PB') {
              _paginationBack(allList, totalRows, totalRowsActive, totalPages);
            } else {
              _paginationFront(allList, totalRows, totalRowsActive);
            }
          }
          function _setDataListByPage(currentPage) {
            var vSlice = _slice(currentPage);
            _self.list = [];
            _self.list = _self.allList.slice(vSlice.start, vSlice.end);
          }

          _self.setTotalRows = _setTotalRows;
          _self.setTotalRowsActive = _setTotalRowsActive;
          _self.setTotalPages = _setTotalPages;
          _self.setDataList = _setDataList;
          _self.setDataListByPage = _setDataListByPage;

        };
				/*########################
	      # oPagination
	      ########################*/
        var oPagination = function oPagination(currentPage, maxSize, totalItems) {
          this.currentPage = currentPage || 1;
          this.maxSize = maxSize || 10;
          this.totalItems = totalItems || 0;

          function _setPagination(currentPage, maxSize, totalItems) {
            this.currentPage = currentPage;
            this.maxSize = maxSize;
            this.totalItems = totalItems;
          }
          function _setCurrentPage(currentPage) {
            this.currentPage = currentPage;
          }
          function _setMaxSize(maxSize) {
            this.maxSize = maxSize;
          }
          function _setTotalItems(totalItems) {
            this.totalItems = totalItems;
          }

          this.setPagination = _setPagination;
          this.setCurrentPage = _setCurrentPage;
          this.setMaxSize = _setMaxSize;
          this.setTotalItems = _setTotalItems;
        };
				/*########################
	      # oUser
	      ########################*/
        var oUser = function oUser(permissions) {
          var vModule = $state.current.module;
          this.name = oimPrincipal.getUsername();
          this.role = oimPrincipal.get_role(vModule.appCode);
          this.isAdmin = oimPrincipal.isAdmin(vModule.appCode);
          this.permissions = permissions || null;

          function _setPermissions(permissions) {
            this.permissions = permissions;
          }

          this.setPermissions = _setPermissions;
        };
				/*########################
	      # oNoResultFilter
	      ########################*/
        var oNoResultFilter = function oNoResultFilter(noResultInfo, noResult) {
          var _self = this;

          _self.noResultInfo = noResultInfo || false;
          _self.noResult = noResult || false;

          function _setNoResultFilter(noResultInfo, noResult) {
            _self.noResultInfo = noResultInfo;
            _self.noResult = noResult;
          }

          function _setNoResultInfo(noResultInfo) {
            _self.noResultInfo = noResultInfo;
          }

          function _setNoResult(noResult) {
            _self.noResult = noResult;
          }

          _self.setNoResultFilter = _setNoResultFilter;
          _self.setNoResultInfo = _setNoResultInfo;
          _self.setNoResult = _setNoResult;
        };
				/*########################
	      # oStateParams
	      ########################*/
        var oStateParams = function oStateParams() {
          function _setTitleClientType(client) {
            if (client) {
              client.titleClientType = mainServices.fnShowNaturalRucPerson(client.documentType, client.documentNumber) ? 'Nombre:' : 'Razón Social:';
            }
            return client;
          }
          this.client = _setTitleClientType($state.params['client']) || null;
          this.selectedApplicationsPolicies = $state.params['selectedApplicationsPolicies'] || null;
          this.selectedApplications = $state.params['selectedApplications'] || null;
          this.showRisksList = $state.params['showRisksList'] || null;
          this.paramsReplacePayroll = $state.params['paramsReplacePayroll'] || null;
          this.idProof = $state.params['idProof'] || null;
          this.insured = $state.params['insured'] || null;
          //mining
          this.evaluation = $state.params['evaluation'] || null;
        };

        return {
          oSelectedItem: oSelectedItem,
          oDataListCheckFilter: oDataListCheckFilter,
          oDocumentNumber: oDocumentNumber,
          oDatePicker: oDatePicker,
          oMessageError: oMessageError,
          oDataList: oDataList,
          oPagination: oPagination,
          oUser: oUser,
          oNoResultFilter: oNoResultFilter,
          oStateParams: oStateParams
        };

      }]);

});

