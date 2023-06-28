/*global angular, _ */
angular.module('mpGrid', ['utils'])
    /**
     * @doc-component directive
     * @name gaiafrontend.directive.mpGrid
     * @param {string} mp-grid The grid id. Applied to the generated `table` where jqGrid plugin is going to be initialized.
     * @param {string=} mp-grid-pager The grid pager id. Apply to the generated `div` where the initialized jqGrid will display its pager. Notice this attribute overwrites `pager` property of jqGrid options Object.
     * @param {expression} mp-grid-options The result of the expression must be the jqGrid options Object. Visit [jqGrid official Wiki](http://www.trirand.com/jqgridwiki/doku.php?id=wiki:options "jqGrid options") for info.
     * @param {expression} mp-grid-model String expression to compile. The selected/s row/s will be assigned to the result of the expression.
     * @param {expression} mp-grid-data The result of the expression must be a collection. It will be applied as `data` property in jqGrid options Object.
     * @param {expression=} mp-grid-context The result of the expression will be the context where the cellContnt will be $compiled against. It is the current Scope by default.
     * @param {expression=} mp-grid-disabled Boolean var if grid must be disabled
     * @description
     *
     * This directive allows you to display a grid that provides solutions for representing and manipulating tabular data.
     *
     * This directive creates a `table` that is wrapped with the [jqGrid jQuery plugin](http://www.trirand.com/blog/ "jqGrid").
     *
     * Every time jqGrid plugin is initiated an event is triggered with the grid element passed as argument.
     * The event name is the mpGrid id (mpGrid passed as string) suffixed with "Set".
     * So if our mpGrid id is `myGrid`, the event name $emit-ted will be `myGridSet`.
     * There are some jqGrid functionalities that can only be applied **after** the plugin initialization so this is useful to execute this methods.
     *
     * Following there is an example of how to execute this methods inside a controller.
     *
     *  ```js
     *  $scope.$on('myGridSet', function (event, myGrid) {
     *      myGrid.jqGrid('filterToolbar', {searchOperators : true});
     *      event.stopPropagation(); // Good practice
     *  });
     *  ```
     *
     * Some times we will need to re-use a jqGrid options Object. For this matter we highly recommed to *save* this Objects in Angular services.
     *
     * If our application is multi-language we have to keep in mind that we would like to apply internationalization to our grid column headers.
     *
     * To solve this the `translate` filter needs to be executed every time jqGrid options Object is requested.
     *
     * So it is recommended to return the jqGrid options Object in a service method as follows.
     *
     *  ```js
     *  (appModule.lazy || appModule)
     *     .factory('grid', ['$filter',
     *         function($filter) {
     *             // IMPORTANT! Returned as method to translate colNames every time jqGrid options Object is requested.
     *             return {
     *                 getOptions: function() {
     *                     var options = {
     *                         "datatype": "local",
     *                         "height": 160,
     *                         "colNames": [
     *                             $filter('translate')('grids_title_one'),
     *                             $filter('translate')('grids_title_two'),
     *                             $filter('translate')('grids_title_three'),
     *                             $filter('translate')('grids_title_four'),
     *                             $filter('translate')('grids_title_five')
     *                         ],
     *                         "colModel": [{
     *                             "name": "one",
     *                             "index": "one",
     *                             "align": "left"
     *                         }, {
     *                             "name": "two",
     *                             "index": "two"
     *                         }, {
     *                             "name": "three",
     *                             "index": "three"
     *                         }, {
     *                             "name": "four",
     *                             "index": "four"
     *                         }, {
     *                             "name": "five",
     *                             "index": "five",
     *                             "hidden": true
     *                         }],
     *                         "rowNum": 5,
     *                         "rowTotal": 2000,
     *                         "rowList": [
     *                             5,
     *                             10,
     *                             15
     *                         ],
     *                         "loadonce": true,
     *                         "mtype": "GET",
     *                         "gridview": true,
     *                         "sortname": "name",
     *                         "viewrecords": true,
     *                         "sortorder": "asc",
     *                         "footerrow": false,
     *                         "autowidth": true,
     *                         "emptyrecords": "No records found"
     *                     };
     *                     return options;
     *                 }
     *             };
     *         }]);
     *  ```
     *
     * When mpGridData/mpGridOptions expression result changes, the mpGrid refreshes. This means that a new `table` is created, jqGrid plugin is initiated again with the result of compiling the current mpGridOptions and mpGridData expressions and every method inside the event listener will execute again.
     *
     * @example
       <doc:example module="mpGrid">
        <doc:source>
        script
            function MyCtrl($scope) {
                $scope.options = {'datatype':'local','height':160,'colNames':['ID','Date','CD','Amount'],'colModel':[{'name':'item_id','index':'item_id'},{'name':'item_date','index':'item_date'},{'name':'item_cd','index':'item_cd'},{'name':'amount','index':'amount'}],'rowNum':4,'rowTotal':2000,'rowList':[5,10,15],'loadonce':true,'mtype':'GET','gridview':true,'sortname':'name','viewrecords':true,'sortorder':'asc','footerrow':false,'autowidth':true,'emptyrecords':'No records found'};
                $scope.data = [{'item_id':'1','item_date':'2012-05-24','item_cd':'test1','amount':'1700'},{'item_id':'2','item_date':'2012-05-24','item_cd':'test2','amount':'1700'},{'item_id':'3','item_date':'2012-05-24','item_cd':'test3','amount':'1700'},{'item_id':'4','item_date':'2012-05-24','item_cd':'test4','amount':'1700'},{'item_id':'5','item_date':'2012-05-24','item_cd':'test5','amount':'1700'},{'item_id':'6','item_date':'2012-05-24','item_cd':'test6','amount':'1700'},{'item_id':'7','item_date':'2012-05-24','item_cd':'test7','amount':'1700'},{'item_id':'8','item_date':'2012-05-24','item_cd':'test8','amount':'1700'},{'item_id':'9','item_date':'2012-05-24','item_cd':'test9','amount':'1700'},{'item_id':'10','item_date':'2012-05-24','item_cd':'test10','amount':'1700'},{'item_id':'11','item_date':'2012-05-24','item_cd':'test11','amount':'1700'},{'item_id':'12','item_date':'2012-05-24','item_cd':'test12','amount':'1700'},{'item_id':'13','item_date':'2012-05-24','item_cd':'test13','amount':'1700'},{'item_id':'14','item_date':'2012-05-24','item_cd':'test14','amount':'1700'},{'item_id':'15','item_date':'2012-05-24','item_cd':'test15','amount':'1700'},{'item_id':'16','item_date':'2012-05-24','item_cd':'test16','amount':'1700'},{'item_id':'17','item_date':'2012-05-24','item_cd':'test17','amount':'1700'},{'item_id':'18','item_date':'2012-05-24','item_cd':'test18','amount':'1700'}, {'item_id':'19','item_date':'2012-05-25','item_cd':'test19','amount':'8000'},{'item_id':'20','item_date':'2012-05-24','item_cd':'test20','amount':'1700'}, {'item_id':'21','item_date':'2012-05-25','item_cd':'test21','amount':'8000'},{'item_id':'22','item_date':'2012-05-24','item_cd':'test22','amount':'1700'}, {'item_id':'23','item_date':'2012-05-25','item_cd':'test23','amount':'8000'}];
            }
            MyCtrl.$inject = ['$scope'];
        div(ng-controller="MyCtrl")
            div
                div(mp-grid="grid_id", mp-grid-pager="grid_pager_id", mp-grid-model="selectedElement", mp-grid-options="options", mp-grid-data="data")
                p
                    button.btn.btn-default(type="button", ng-click='data.push({"item_id":"0","item_date":"2012-05-24","item_cd":"Modified Test","amount":"1700"})') Change data
                pre Selected: {{selectedElement | json}}
                pre Data: {{data | json}}
        </doc:source>
       </doc:example>
     */
    .directive('mpGrid', ['Loader', 'Language', '$parse', '$compile',
        function (Loader, Language, $parse, $compile) {
            return {
                link: function (scope, elem, attrs) {
                    var loadPlugin = Loader.load,
                        lang = Language.get().languageId,
                        localeFile = 'i18n/grid.locale-' + lang + '.js',
                        jqGridPluginFile = 'jquery.jqGrid.src.js',
                        resizePluginFile = 'jquery.resize.tweaked.js',
                        mpGrid = attrs.mpGrid,
                        mpGridPager = attrs.mpGridPager,
                        mpGridModel = attrs.mpGridModel,
                        mpGridOptions = attrs.mpGridOptions,
                        mpGridData = attrs.mpGridData,
                        mpGridContext = attrs.mpGridContext,
                        mpGridDisabled = attrs.mpGridDisabled,
                        grid,
                        pager,
                        gridDataHadIds,
                        onResizeElem;

                    function isVisible(elem) {
                        return elem.get(0).offsetWidth > 0 || elem.get(0).offsetHeight > 0;
                    }

                    function newGrid() {
                        return angular.element('<table>').attr('id', mpGrid);
                    }

                    function newPager() {
                        return angular.element('<div>').attr('id', mpGridPager);
                    }

                    function getFilters(filters) {
                        var values = [];

                        if (filters.length > 0) {
                            angular.forEach(filters, function (filter) {
                                values.push(filter.value);
                            });
                        }
                        return values;
                    }

                    function setFilters(values) {
                        var filters = angular.element('.frozen-div .ui-search-table .ui-search-input').find('input');

                        if (filters.length > 0) {
                            for (var i = 0; i < filters.length; i++) {
                                filters.eq(i).val(values[i]);
                            }
                        }

                        filters = null;
                    }

                    function setGridWidth() {
                        if (!isVisible(elem)) {
                            return;
                        }

                        var gridOptions,
                            groupHeader,
                            filters,
                            searchs,
                            frozenColumns,
                            gridState;

                        function hasFrozenColumns(colModel) {
                            return !!_.find(colModel, function (col) {
                                return col.frozen;
                            });
                        }

                        gridOptions = angular.copy($parse(mpGridOptions)(scope));
                        searchs = angular.element('.frozen-div .ui-search-table .ui-search-input').find('input');
                        groupHeader = grid.jqGrid('getGridParam', 'groupHeader');
                        frozenColumns = hasFrozenColumns(grid.jqGrid('getGridParam', 'colModel'));
                        gridState = grid.jqGrid('getGridParam', 'gridstate');

                        if (groupHeader) {
                            grid.jqGrid('destroyGroupHeader');
                        }


                        if (frozenColumns) {
                            if (searchs.length > 0) {
                                filters = getFilters(searchs);
                            }
                            grid.jqGrid('destroyFrozenColumns');
                        }

                        if (!gridOptions.width) { // RESIZE ONLY IF WIDTH PROPERTY IS NOT PROVIDED BY jqGrdid OPTIONS OBJECT
                            grid.jqGrid('setGridWidth', elem.width());
                        }

                        if (groupHeader) {
                            grid.jqGrid('setGroupHeaders', groupHeader);
                        }

                        if (frozenColumns) {
                            if (gridState === 'visible') {
                                grid.jqGrid('setFrozenColumns');
                                grid.trigger('reloadGrid', [{
                                    current: true
                                }]);
                            }
                            if (searchs.length > 0) {
                                setFilters(filters);
                            }
                        }

                        // scope.$emit(mpGrid + 'Set', grid);
                    }

                    function isDataOk(data) {
                        return data && _.every(data, function (element) {
                            return !!element;
                        });
                    }

                    function addOddClass() {
                        var rows = elem.find('[role="row"]');

                        angular.forEach(rows, function (row, key) {
                            if (key % 2 !== 0) {
                                angular.element(row).addClass('oddRow');
                            }
                        });
                    }

                    function getLocalRow(rowId) {
                        var localRow = angular.copy(grid.jqGrid('getLocalRow', rowId));

                        if (!gridDataHadIds) {
                            delete localRow.id;
                        }

                        return localRow || {};
                    }

                    function getDataItem(rowId) {
                        var localRow = grid.jqGrid('getLocalRow', rowId) || {},
                            localIndex = _.findIndex(grid.jqGrid('getGridParam', 'data'), function (i) {
                                return angular.equals(i, localRow);
                            });

                        return $parse(mpGridData)(scope)[localIndex] || {};
                    }

                    function bindSelectedElement(rowId) {
                        var multiselect = grid.jqGrid('getGridParam', 'multiselect');

                        if (multiselect) {
                            scope.$apply(function () {
                                var currentModel = $parse(mpGridModel)(scope) || [],
                                    currentPageRowIds = grid.jqGrid('getDataIDs'),
                                    currentPageRows = [],
                                    selectedRowIds = grid.jqGrid('getGridParam', 'selarrrow'),
                                    selectedRows = [];

                                // TODO: Optimize
                                angular.forEach(currentPageRowIds, function (rowId) {
                                    currentPageRows.push(attrs.mpGridModelReferenced ? getDataItem(rowId) : getLocalRow(rowId));
                                });

                                angular.forEach(selectedRowIds, function (rowId) {
                                    selectedRows.push(attrs.mpGridModelReferenced ? getDataItem(rowId) : getLocalRow(rowId));
                                });

                                angular.forEach(currentPageRows, function (row) {
                                    var rowInCurrentModelIndex = _.findIndex(currentModel, row),
                                        rowInSelectedRowsIndex = _.findIndex(selectedRows, row);

                                    if (rowInCurrentModelIndex === -1 && rowInSelectedRowsIndex > -1) {
                                        currentModel.push(row);
                                    }

                                    if (rowInCurrentModelIndex > -1 && rowInSelectedRowsIndex === -1) {
                                        currentModel.splice(rowInCurrentModelIndex, 1);
                                    }

                                });

                                if (currentPageRowIds.length === selectedRows.length) {
                                    grid.closest('.ui-jqgrid-view').find('.ui-jqgrid-hdiv .cbox').prop('checked', true);
                                } else {
                                    grid.closest('.ui-jqgrid-view').find('.ui-jqgrid-hdiv .cbox').prop('checked', false);
                                }

                                $parse(mpGridModel).assign(scope, currentModel);
                            });
                        } else {
                            scope.$apply(function () {
                                $parse(mpGridModel).assign(scope, attrs.mpGridModelReferenced ? getDataItem(rowId) : getLocalRow(rowId));
                            });
                        }
                    }

                    function isSelected(rowId) {
                        var multiselect = grid.jqGrid('getGridParam', 'multiselect'),
                            selected = false;

                        if (multiselect) {
                            selected = !!_.find(grid.jqGrid('getGridParam', 'selarrrow'), function (selectedRowId) {
                                return rowId === selectedRowId;
                            });
                        } else {
                            selected = rowId === grid.jqGrid('getGridParam', 'selrow');
                        }

                        return selected;
                    }

                    function isRowInModel(rowId, model) {
                        var multiselect = grid.jqGrid('getGridParam', 'multiselect'),
                            rowInModel = false;

                        if (multiselect) {
                            rowInModel = !!_.find(model, function (modelItem) {
                                return angular.equals(attrs.mpGridModelReferenced ? getDataItem(rowId) : getLocalRow(rowId), modelItem);
                            });
                        } else {
                            rowInModel = angular.equals(model, attrs.mpGridModelReferenced ? getDataItem(rowId) : getLocalRow(rowId));
                        }

                        return rowInModel;
                    }

                    function updateSelectedRow(model) {
                        if (!grid) return;

                        var currentPageRowIds = grid.jqGrid('getDataIDs');

                        if (angular.isArray(model) && model.length) {
                            var selectedRows = 0;

                            angular.forEach(currentPageRowIds, function (rowId) {
                                if (isRowInModel(rowId, model) && !isSelected(rowId)) {
                                    grid.jqGrid('setSelection', rowId, false);
                                    selectedRows += 1;
                                } else if (!isRowInModel(rowId, model) && isSelected(rowId)) {
                                    grid.jqGrid('setSelection', rowId, false);
                                } else if (attrs.mpGridModelReferenced && isRowInModel(rowId, model) && isSelected(rowId)) {
                                    grid.jqGrid('setRowData', rowId, angular.extend(getLocalRow(rowId), getDataItem(rowId)));
                                }
                            });

                            if (currentPageRowIds.length === selectedRows) {
                                grid.closest('.ui-jqgrid-view').find('.ui-jqgrid-hdiv .cbox').prop('checked', true);
                            }
                        } else if (angular.isObject(model) && !_.isEmpty(model)) {
                            angular.forEach(currentPageRowIds, function (rowId) {
                                if (isRowInModel(rowId, model) && !isSelected(rowId)) {
                                    grid.jqGrid('setSelection', rowId, false);
                                } else if (!isRowInModel(rowId, model) && isSelected(rowId)) {
                                    grid.jqGrid('setSelection', rowId, false);
                                } else if (attrs.mpGridModelReferenced && isRowInModel(rowId, model) && isSelected(rowId)) {
                                    grid.jqGrid('setRowData', rowId, angular.extend(getLocalRow(rowId), getDataItem(rowId)));
                                }
                            });
                        } else {
                            grid.jqGrid('resetSelection');
                        }
                    }

                    // function getRealId(pagActual, rowId, rowNum) {
                    //     return ((pagActual * rowNum) - rowNum) + parseInt(rowId);
                    // }

                    function addGridEventHandlers(config) {
                        var gridCompleteFn = config.gridComplete || angular.noop,
                            onSelectAllFn = config.onSelectAll || angular.noop,
                            onSelectRowFn = config.onSelectRow || angular.noop,
                            ondblClickRowFn = config.ondblClickRow || angular.noop,
                            beforeSelectRowFn = config.beforeSelectRow || angular.noop;

                        angular.extend(config, {
                            gridComplete: function () {
                                // FIX: WE NEED TO COMPILE SO ANGULARJS DIRECTIVES USED AS ROW CONTENT WORK PROPERLY
                                // IF ISOLATED SCOPE THEN USE THE PARENT SCOPE
                                if (angular.isDefined(mpGridContext)) {
                                    $compile(grid)($parse(mpGridContext)(scope));
                                } else {
                                    $compile(grid)(scope);
                                }
                                // FIX: UPDATE SELECTIONS WITH MODEL VALUES
                                updateSelectedRow($parse(mpGridModel)(scope));
                                addOddClass();
                                gridCompleteFn.apply(this, arguments);
                            },
                            onSelectAll: function () {
                                if (!$parse(mpGridDisabled)(scope)) {
                                    bindSelectedElement.apply(this, arguments);
                                }
                                onSelectAllFn.apply(this, arguments);
                            },
                            onSelectRow: function () {
                                // var gridOptions = $parse(mpGridOptions)(scope);

                                if (!$parse(mpGridDisabled)(scope)) {
                                    bindSelectedElement.apply(this, arguments);
                                }
                                onSelectRowFn.apply(this, arguments);
                            },
                            ondblClickRow: function () {
                                if (!$parse(mpGridDisabled)(scope)) {
                                    bindSelectedElement.apply(this, arguments);
                                }
                                ondblClickRowFn.apply(this, arguments);
                            },
                            beforeSelectRow: function () {
                                var beforeSelectRowReturnValue = beforeSelectRowFn.apply(this, arguments);
                                return $parse(mpGridDisabled)(scope) ? false : angular.isDefined(beforeSelectRowReturnValue) ? beforeSelectRowReturnValue : true;
                            }
                        });

                        if ($parse(mpGridDisabled)(scope)) {
                            angular.extend(config, {
                                beforeSelectRow: function () {
                                    beforeSelectRowFn.apply(this, arguments);
                                    return false;
                                }
                            });
                        }

                        // FIX: RESPONSIVE BUG
                        onResizeElem = onResizeElem || elem.bind('resize', setGridWidth);

                        // FIX: MEMORY LEAK ISSUE
                        elem.on('$destroy', function () {
                            if (onResizeElem) {
                                onResizeElem.off('resize', setGridWidth);
                            }
                            onResizeElem = null;
                        });

                        // FIX: FROZEN COLUMNS BUG
                        // http://stackoverflow.com/questions/16516356/how-to-make-jqgrid-frozen-column-word-wrap
                        grid.triggerHandler('jqGridAfterGridComplete');
                    }

                    function addIds(gridData) {
                        var collection = angular.copy(gridData);

                        _.each(collection, function (element, index) {
                            element.id = element.id || index + 1;
                        });

                        return collection;
                    }

                    // IMPORTANT! WE NEED TO ADD ID PROPERTY TO OUR LOCAL DATA IN ORDER TO HAVE UNIQUE ROWIDs
                    // IF ANY ELEMENT OF DATA SOURCE IS 'FALSY' AN EMPTY ARRAY IS USED AS DATA SOURCE
                    function createOptionsData(gridData) {
                        var optionsData = [];

                        if (isDataOk(gridData)) {
                            // Fix this. Key can be configured via colModel
                            gridDataHadIds = gridData.length ? !!gridData[0].id : false;
                            optionsData = !gridDataHadIds ? addIds(gridData) : gridData;
                        }

                        return optionsData;
                    }

                    function setGridOptions() {
                        var gridOptions = $parse(mpGridOptions)(scope),
                            gridData = $parse(mpGridData)(scope),
                            options = angular.copy(gridOptions) || {};

                        options.data = createOptionsData(gridData);

                        if (pager) {
                            options.pager = mpGridPager;
                        }

                        addGridEventHandlers(options);

                        grid.jqGrid(options);

                        if ($parse(mpGridDisabled)(scope) && options.multiselect) {
                            grid.find('[type="checkbox"][class="cbox"]').attr('disabled', 'disabled');
                        }

                        scope.$emit(mpGrid + 'Set', grid);
                    }

                    function prepareGridDOM() {
                        elem.empty();

                        grid = newGrid();
                        elem.append(grid);

                        if (mpGridPager) {
                            pager = newPager();
                            elem.append(pager);
                        }
                    }

                    function updateGrid(newGridOptions, oldGridOptions) {
                        if (newGridOptions && oldGridOptions && (newGridOptions.refreshGrid === oldGridOptions.refreshGrid)) {
                            prepareGridDOM();
                            setGridOptions();
                        }
                    }

                    function updateGridData(data) {
                        var gridOptions = angular.extend({}, {
                            refreshGrid: true
                        }, $parse(mpGridOptions)(scope));
                        // jqGrid method setGridParam({data: data}) does not work here
                        // it deep-extends (with jQuery) the options object (grid[0].p)
                        // so if the old data contents 5 items and the new data contents 3
                        // the final data will have 5 items with the first 3 items modified
                        // We want the new data to be the final data.

                        if (grid[0]) grid[0].p.data = createOptionsData(data);
                        if (gridOptions.refreshGrid) {
                            grid.trigger('reloadGrid');
                        }
                    }

                    function watchOptions() {
                        scope.$watch(mpGridOptions, updateGrid, true);
                    }

                    function watchData() {
                        // scope.$watchCollection(mpGridData, updateGrid);
                        scope.$watch(mpGridData, updateGridData, true);
                    }

                    function watchModel() {
                        scope.$watch(mpGridModel, updateSelectedRow, true);
                    }

                    function initGrid() {
                        watchModel();
                        watchOptions();
                        watchData();
                    }

                    function checkAttributesValues() {
                        if (!mpGridModel) {
                            throw new Error('[mp-grid-model] attribute is mandatory for [mp-grid] directive to work properly');
                        }

                        if (!mpGridOptions) {
                            throw new Error('[mp-grid-options] attribute is mandatory for [mp-grid] directive to work properly');
                        }

                        if (!mpGridData) {
                            throw new Error('[mp-grid-data] attribute is mandatory for [mp-grid] directive to work properly');
                        }
                    }

                    checkAttributesValues();

                    loadPlugin(localeFile).then(function () {
                        loadPlugin(jqGridPluginFile).then(function () {
                            loadPlugin(resizePluginFile).then(initGrid);
                        });
                    });
                }
            };
        }
    ]);
