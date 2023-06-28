/**
    * @doc-component directive
    * @name gaiafrontend.directive.mpGridActions
    * @description
    * This component has been migrated to "GAIA Site"
    * There you will find its documentation and several examples.
    * "GAIA Site" is an application created by the Architecture Area to learn and play with GAIA. Is available in RAS. Direct links are available below in this page.
    * @example
    <doc:example>
         <doc:source>
         label GAIA site direct links are:
         a(href='https://wportalinterno.es.mapfre.net/com.ibm.ram.repository.web/faces/_rlvid.jsp?_rap=!assetDetails&_rvip=/home.jsp&guid=13A33828-B921-8DC5-DEDA-8B8D7C0EBC81') Intranet /
         a(href='https://wportalinterno.mapfre.com/com.ibm.ram.repository.web/faces/_rlvid.jsp?_rap=!assetDetails&_rvip=/home.jsp&guid=13A33828-B921-8DC5-DEDA-8B8D7C0EBC81') Internet
         </doc:source>
    </doc:example>
*/
(function() {
    'use strict';

    function mpGridActions() {
        return {
            restrict: 'A',
            templateUrl: 'gaiafrontend/html/gridActions.html',
            scope: {
                mpGrid: '@mpGridActions',
                gridPager: '@mpGridActionsPager',
                gridModel: '=mpGridActionsModel',
                gridOptions: '=mpGridActionsOptions',
                gridData: '=mpGridActionsData'
            },
            transclude: true,
            controller: 'mpGridActionsCtrl',
            link: function(scope, element) {
                var addButton = angular.element('#add'),
                    copyButton = angular.element('#copy'),
                    pasteButton = angular.element('#paste');

                scope.newData = {};

                function setActions(data, cell) {
                    var actionButtons = "<button id='edit_" + cell.rowId + "' type='button' class='btn action actionEdit' title='Edit row' onclick=\"angular.element('#" + scope.mpGrid + "').editRow('" + cell.rowId + "');\"></button>" +
                        "<button id='save_" + cell.rowId + "' type='button' class='btn btn-success action actionSave' title='Save changes' ng-click=\"saveRow(" + cell.rowId + ");\"></button>" +
                        "<button id='res_" + cell.rowId + "' type='button' class='btn btn-warning action actionDiscard' title='Restore row' onclick=\"angular.element('#" + scope.mpGrid + "').restoreRow('" + cell.rowId + "');\"></button>" +
                        "<button id='del_" + cell.rowId + "' type='button' class='btn btn-danger action actionDelete' title='Delete row' ng-click=\"delRow(" + cell.rowId + ");\"></button>";


                    return actionButtons;
                }

                scope.gridOptions.colNames.splice(0, 0, '');
                scope.gridOptions.colModel.splice(0, 0, {
                    name: 'act',
                    index: 'act',
                    width: 100,
                    sortable: false,
                    align: 'center',
                    formatter: setActions
                });

                function unlisten(element, event, listener) {
                    element.off(event, listener);
                }

                function listen(element, event, listener) {
                    element.on(event, listener);
                    return function() {
                        unlisten(element, event, listener);
                    }
                }

                function getRowSelected() {
                    return angular.element('#' + scope.mpGrid).jqGrid('getGridParam', 'selrow');
                }

                /* Reloads the data in the grid after pasting a row */
                function reloadGrid() {
                    var grid = angular.element('#' + scope.mpGrid);

                    //grid.jqGrid('clearGridData');
                    grid.jqGrid('setGridParam', {
                        data: scope.gridData
                    });
                    grid.trigger('reloadGrid');
                }

                function addRow() {
                    var grid = angular.element('#' + scope.mpGrid),
                        numRows = scope.gridData.length;

                    grid.addRowData(numRows + 1, scope.newData, 'last');
                    grid.trigger("reloadGrid", [{
                        page: grid.getGridParam('lastpage')
                    }]);
                    grid.editRow(numRows + 1)
                }

                function copyRow() {
                    pasteButton.removeClass('disabled');
                    pasteButton.removeAttr('disabled');
                }

                function pasteRow() {
                    var grid = angular.element('#' + scope.mpGrid),
                        lastsel = parseInt(getRowSelected(), 10),
                        rowSel,
                        copyRow = {};

                    copyRow = angular.extend({}, scope.gridData[lastsel - 1]);

                    scope.gridData.push(copyRow);
                    reloadGrid();

                    rowSel = scope.gridData.length;
                    grid.trigger("reloadGrid", [{
                        page: grid.getGridParam('lastpage')
                    }]);
                    grid.setSelection(lastsel, true);
                    grid.editRow(rowSel);
                    grid.restoreRow(rowSel);

                    angular.element('#copy').attr('disabled', 'disabled');
                    angular.element('#paste').addClass('disabled');
                }

                var unlistenAddRow = listen(addButton, 'click', addRow),
                    unlistenCopyRow = listen(copyButton, 'click', copyRow),
                    unlistenPasteRow = listen(pasteButton, 'click', pasteRow);

                element.on('$destroy', function() {
                    unlistenAddRow();
                    unlistenCopyRow();
                    unlistenPasteRow();
                });
            }
        }
    }

    function mpGridActionsCtrl($scope, $modal, $timeout) {

        var copyButton = angular.element('#copy');

        $scope.$on($scope.mpGrid + 'Set', function(event, grid) {
            var oldSelectRow = grid.jqGrid('getGridParam').onSelectRow;

            grid.jqGrid('setGridParam', {
                onSelectRow: function(id) {
                    oldSelectRow.apply(this, arguments);
                    //$scope.rowId = id;
                    copyButton.removeClass('disabled');
                    copyButton.removeAttr('disabled');
                }
            })
        })

        function createModel(model, index) {
            var newModel = {};

            angular.forEach(_.keys(model[index - 1]), function(key) {
                if (key !== 'id') {
                    newModel[key] = model[index - 1][key];
                }
            });
            return newModel;
        }

        $scope.saveRow = function(rowId) {
            $timeout(function() {
                var grid = angular.element('#' + $scope.mpGrid);

                grid.jqGrid('saveRow', rowId);
                $scope.gridModel = createModel(grid.jqGrid('getGridParam', 'data'), rowId);
                $scope.gridData[rowId - 1] = angular.extend({}, $scope.gridModel);
            });
        }

        $scope.delRow = function(rowId) {
            var grid = angular.element('#' + $scope.mpGrid),
                gridData = $scope.gridData,
                currentPage = grid.getGridParam('page'),
                modalInstance = $modal.open({
                    backdrop: false,
                    templateUrl: 'gaiafrontend/html/mpGridActionsModal.html',
                    controller: ['$scope', '$modalInstance', '$filter',
                        function($scope, $modalInstance) {
                            $scope.ok = function() {
                                gridData.splice((rowId - 1), 1);

                                grid.jqGrid('setGridParam', {
                                    data: gridData
                                });
                                $modalInstance.close();
                            };
                            $scope.cancel = function() {
                                $modalInstance.close();
                            }
                        }
                    ]
                });

            modalInstance.result
                .then(function() {
                    grid.trigger("reloadGrid", [{
                        page: currentPage
                    }]);
                });
        }
    }
    (angular.module('mpGridActions', []))
    .directive('mpGridActions', mpGridActions)
        .controller('mpGridActionsCtrl', ['$scope', '$modal', '$timeout', mpGridActionsCtrl]);
}());
