/*global angular, _ */
angular.module('mpGridCrud', [])
    .controller('MpGridCrudCtrl', ['$scope', '$parse', '$timeout', '$attrs',
        function($scope, $parse, $timeout, $attrs) {
            var itemToModifyIndex,
                removedItems,
                unregisterTempModelWatcher,
                defaultCrudOptions = {
                    'create': true,
                    'read': true,
                    'update': true,
                    'copy': true,
                    'delete': true
                };

            function isPromise(promise) {
                return promise && angular.isFunction(promise.then) && angular.isFunction(promise['catch']) && angular.isFunction(promise['finally']);
            }

            function clearRemovedItems() {
                removedItems = undefined;
            }

            function clearTempModel() {
                if (angular.isDefined(itemToModifyIndex)) itemToModifyIndex = undefined;

                $scope.tempModel = undefined;
            }

            function clearModel() {
                $scope.model = undefined;
            }

            function returnTrue() {
                return true;
            }

            // Execute the function in the next digest cycle
            // http://stackoverflow.com/a/18996042
            function applyLater(fn) {
                $timeout(fn);
            }

            $scope.editionMode = false;

            this.isAnyRowSelected = function() {
                return angular.isArray($scope.model) ? !!$scope.model.length : !!$scope.model;
            };

            this.isOnlyOneRowSelected = function() {
                return angular.isArray($scope.model) ? $scope.model.length !== 1 : !$scope.model;
            };

            this.create = function() {
                function createFn() {
                    $scope.editionMode = true;

                    $scope.tempModel = {};

                    applyLater(function () {
                        onCreateFn($scope.$parent, {
                            $model: $scope.model,
                            $tempModel: $scope.tempModel
                        });
                    });
                }

                var beforeCreateFn = $attrs.mpGridCrudBeforeCreate ? $parse($attrs.mpGridCrudBeforeCreate) : returnTrue,
                    beforeCreateFnReturn,
                    onCreateFn = $parse($attrs.mpGridCrudOnCreate);

                beforeCreateFnReturn = beforeCreateFn($scope.$parent, {
                    $model: $scope.model,
                    $tempModel: $scope.tempModel
                });

                if (isPromise(beforeCreateFnReturn)) beforeCreateFnReturn.then(createFn);
                else if (beforeCreateFnReturn !== false) createFn();
            };

            this.read = function() {
                function readFn() {
                    $scope.editionMode = false;
                    selectedItem = angular.isArray($scope.model) ? $scope.model[0] : $scope.model;
                    $scope.tempModel = angular.copy(selectedItem);

                    applyLater(function () {
                        onReadFn($scope.$parent, {
                            $model: $scope.model,
                            $tempModel: $scope.tempModel
                        });
                    });
                }

                if ($scope.model) {
                    var beforeReadFn = $attrs.mpGridCrudBeforeRead ? $parse($attrs.mpGridCrudBeforeRead) : returnTrue,
                        beforeReadFnReturn,
                        onReadFn = $parse($attrs.mpGridCrudOnRead),
                        selectedItem;

                    beforeReadFnReturn = beforeReadFn($scope.$parent, {
                        $model: $scope.model,
                        $tempModel: $scope.tempModel
                    });

                    if (isPromise(beforeReadFnReturn)) beforeReadFnReturn.then(readFn);
                    else if (beforeReadFnReturn !== false) readFn();
                }
            };

            this.update = function() {
                function updateFn() {
                    $scope.editionMode = true;

                    selectedItem = angular.isArray($scope.model) ? $scope.model[0] : $scope.model;
                    itemToModifyIndex = _.findIndex($scope.data, function(item) {
                        return _.isEqual(selectedItem, item);
                    });
                    $scope.tempModel = angular.copy(selectedItem);

                    applyLater(function () {
                        onUpdateFn($scope.$parent, {
                            $model: $scope.model,
                            $tempModel: $scope.tempModel
                        });
                    });
                }
                if ($scope.model) {
                    var beforeUpdateFn = $attrs.mpGridCrudBeforeUpdate ? $parse($attrs.mpGridCrudBeforeUpdate) : returnTrue,
                        beforeUpdateFnReturn,
                        onUpdateFn = $parse($attrs.mpGridCrudOnUpdate),
                        selectedItem;

                    beforeUpdateFnReturn = beforeUpdateFn($scope.$parent, {
                        $model: $scope.model,
                        $tempModel: $scope.tempModel
                    });

                    if (isPromise(beforeUpdateFnReturn)) beforeUpdateFnReturn.then(updateFn);
                    else if (beforeUpdateFnReturn !== false) updateFn();
                }
            };

            this['delete'] = function() {
                function deleteFn() {
                    $scope.editionMode = false;

                    angular.forEach(angular.isArray($scope.model) ? $scope.model : [$scope.model], function(selectedItem) {
                        var selectedItemIndex = _.findIndex($scope.data, function(item) {
                            return _.isEqual(selectedItem, item);
                        });

                        if (selectedItemIndex > -1) Array.prototype.push.apply(removedItems, $scope.data.splice(selectedItemIndex, 1));
                    });

                    applyLater(function () {
                        onDeleteFn($scope.$parent, {
                            $model: $scope.model,
                            $tempModel: $scope.tempModel,
                            $removedItems: removedItems
                        });
                    });

                    clearModel();
                }

                if ($scope.model) {
                    var beforeDeleteFn = $attrs.mpGridCrudBeforeDelete ? $parse($attrs.mpGridCrudBeforeDelete) : returnTrue,
                        beforeDeleteFnReturn,
                        onDeleteFn = $parse($attrs.mpGridCrudOnDelete);

                    clearRemovedItems();
                    removedItems = [];

                    beforeDeleteFnReturn = beforeDeleteFn($scope.$parent, {
                        $model: $scope.model,
                        $tempModel: $scope.tempModel,
                        $removedItems: removedItems
                    });

                    if (isPromise(beforeDeleteFnReturn)) beforeDeleteFnReturn.then(deleteFn);
                    else if (beforeDeleteFnReturn !== false) deleteFn();
                }
            };

            this.copy = function() {
                function copyFn() {
                    $scope.editionMode = true;

                    selectedItem = angular.isArray($scope.model) ? $scope.model[0] : $scope.model;
                    $scope.tempModel = angular.copy(selectedItem);

                    applyLater(function () {
                        onCopyFn($scope.$parent, {
                            $model: $scope.model,
                            $tempModel: $scope.tempModel
                        });
                    });
                }

                if ($scope.model) {
                    var beforeCopyFn = $attrs.mpGridCrudBeforeCopy ? $parse($attrs.mpGridCrudBeforeCopy) : returnTrue,
                        beforeCopyFnReturn,
                        onCopyFn = $parse($attrs.mpGridCrudOnCopy),
                        selectedItem;

                    beforeCopyFnReturn = beforeCopyFn($scope.$parent, {
                        $model: $scope.model,
                        $tempModel: $scope.tempModel
                    });

                    if (isPromise(beforeCopyFnReturn)) beforeCopyFnReturn.then(copyFn);
                    else if (beforeCopyFnReturn !== false) copyFn();
                }
            };

            this.cancel = function() {
                function cancelFn() {
                    $scope.editionMode = false;

                    applyLater(function () {
                        onCancelFn($scope.$parent, locals);
                    });
                    clearTempModel();
                    clearRemovedItems();
                }

                if ($scope.tempModel) {
                    var beforeCancelFn = $attrs.mpGridCrudBeforeCancel ? $parse($attrs.mpGridCrudBeforeCancel) : returnTrue,
                        beforeCancelFnReturn,
                        onCancelFn = $parse($attrs.mpGridCrudOnCancel),
                        locals = {
                            $model: $scope.model,
                            $tempModel: $scope.tempModel
                        };

                    if (removedItems) {
                        angular.extend(locals, {
                            $removedItems: removedItems
                        });
                    }

                    beforeCancelFnReturn = beforeCancelFn($scope.$parent, locals);

                    if (isPromise(beforeCancelFnReturn)) beforeCancelFnReturn.then(cancelFn);
                    else if (beforeCancelFnReturn !== false) cancelFn();
                }
            };

            this.confirm = function() {
                function confirmFn() {
                    $scope.editionMode = false;

                    // Adding
                    if (!_.isEmpty($scope.tempModel)) {
                        if (angular.isUndefined(itemToModifyIndex)) {
                            $scope.data.push($scope.tempModel);
                            // Modifying
                        } else if (itemToModifyIndex > -1) {
                            $scope.data.splice(itemToModifyIndex, 1, $scope.tempModel);
                        }
                    }

                    applyLater(function () {
                        onConfirmFn($scope.$parent, locals);
                    });

                    $scope.model = angular.isArray($scope.model) ? [$scope.tempModel] : $scope.tempModel;
                    clearTempModel();
                    clearRemovedItems();
                }

                if ($scope.tempModel) {
                    var beforeConfirmFn = $attrs.mpGridCrudBeforeConfirm ? $parse($attrs.mpGridCrudBeforeConfirm) : returnTrue,
                        beforeConfirmFnReturn,
                        onConfirmFn = $parse($attrs.mpGridCrudOnConfirm),
                        locals = {
                            $model: $scope.model,
                            $tempModel: $scope.tempModel
                        };

                    if (removedItems) {
                        angular.extend(locals, {
                            $removedItems: removedItems
                        });
                    }

                    beforeConfirmFnReturn = beforeConfirmFn($scope.$parent, locals);

                    if (isPromise(beforeConfirmFnReturn)) beforeConfirmFnReturn.then(confirmFn);
                    else if (beforeConfirmFnReturn !== false) confirmFn();
                }
            };

            $scope.options.crud = angular.extend(defaultCrudOptions, $scope.options.crud);

            $scope.$on($scope.id + 'Set', function(event, grid) {
                var isMultiselect = grid.jqGrid('getGridParam', 'multiselect');

                if (isMultiselect) {
                    // Avoid uneeded watchers
                    if (unregisterTempModelWatcher) {
                        unregisterTempModelWatcher();
                    }
                    // Disable selection checkboxes
                    unregisterTempModelWatcher = $scope.$watch('editionMode', function(tempModel) {
                        if (tempModel) {
                            grid.find('[type="checkbox"][class="cbox"]').attr('disabled', 'disabled');
                        } else {
                            grid.find('[type="checkbox"][class="cbox"]').removeAttr('disabled');
                        }
                    }, true);
                }
                // Block row selection if tempModel has value
                grid.jqGrid('setGridParam', {
                    beforeSelectRow: function() {
                        return !$scope.editionMode;
                    }
                });
            });
        }])
    /**
     * @doc-component directive
     * @name gaiafrontend.directive.mpGridCrud
     * @param {string} mp-grid-crud The grid id. Applied to the generated `table` where jqGrid plugin is going to be initialized.
     * @param {string=} mp-grid-crud-pager The grid pager id. Apply to the generated `div` where the initialized jqGrid will display its pager. Notice this attribute overwrites `pager` property of jqGrid options Object.
     * @param {expression} mp-grid-crud-options The result of the expression must be the jqGrid options Object. Visit [jqGrid official Wiki](http://www.trirand.com/jqgridwiki/doku.php?id=wiki:options "jqGrid options") for info. It can be extended with `crud` property to extend default `mpGridCrud` behaviour.
     * @param {expression} mp-grid-crud-model The selected/s row/s will be assigned to the result of the expression.
     * @param {expression} mp-grid-crud-temp-model When creating/updating an item it will be assigned to the result of the expression.
     * @param {expression} mp-grid-crud-data The result of the expression must be a collection. It will be applied as `data` property in jqGrid options Object.
     * @param {expression=} mp-grid-crud-disabled Buttons will display enabled or disabled depending on the result of this expression.
     * @param {expression=} mp-grid-crud-before-create Expression to evaluate when clicking on Add(Create) button, before creating the `$tempModel`. This expression has to return a 'truthy' value to let the execution flow continue. Model is available as `$model`. Temp model is available as `$tempModel`.
     * @param {expression=} mp-grid-crud-on-create Expression to evaluate when clicking on Add(Create) button, after creating the `$tempModel`. Model is available as `$model`. Temp model is available as `$tempModel`.
     * @param {expression=} mp-grid-crud-before-read Expression to evaluate when clicking on Detail(Read) button. Model is available as `$model`. This expression has to return a 'truthy' value to let the execution flow continue. Temp model is available as `$tempModel`.
     * @param {expression=} mp-grid-crud-on-read Expression to evaluate when clicking on Detail(Read) button. Model is available as `$model`. Temp model is available as `$tempModel`.
     * @param {expression=} mp-grid-crud-before-update Expression to evaluate when clicking on Modify(Update) button, before creating the `$tempModel`. This expression has to return a 'truthy' value to let the execution flow continue. Model is available as `$model`. Temp model is available as `$tempModel`.
     * @param {expression=} mp-grid-crud-on-update Expression to evaluate when clicking on Modify(Update) button. Model is available as `$model`. Temp model is available as `$tempModel`.
     * @param {expression=} mp-grid-crud-before-delete Expression to evaluate when clicking on Remove(Delete) button, before removing and creating the `$removedItems`. This expression has to return a 'truthy' value to let the execution flow continue. Model is available as `$model`. Temp model is available as `$tempModel`. Removed items are available as `$removedItems`.
     * @param {expression=} mp-grid-crud-on-delete Expression to evaluate when clicking on Remove(Delete) button. Model is available as `$model`. Temp model is available as `$tempModel`. Removed items are available as `$removedItems`.
     * @param {expression=} mp-grid-crud-before-copy Expression to evaluate when clicking on Copy button, before creating the `$tempModel`. This expression has to return a 'truthy' value to let the execution flow continue. Model is available as `$model`. Temp model is available as `$tempModel`.
     * @param {expression=} mp-grid-crud-on-copy Expression to evaluate when clicking on Copy button. Model is available as `$model`. Temp model is available as `$tempModel`.
     * @param {expression=} mp-grid-crud-before-cancel Expression to evaluate when clicking on Cancel button, before cancelling changes. This expression has to return a 'truthy' value to let the execution flow continue. Model is available as `$model`. Temp model is available as `$tempModel`. If there are removed items they will be available as `$removedItems`.
     * @param {expression=} mp-grid-crud-on-cancel Expression to evaluate when clicking on Cancel button. Model is available as `$model`. Temp model is available as `$tempModel`. If there are removed items they will be available as `$removedItems`.
     * @param {expression=} mp-grid-crud-before-confirm Expression to evaluate when clicking on Confirm button, before applying the changes. This expression has to return a 'truthy' value to let the execution flow continue. Model is available as `$model`. Temp model is available as `$tempModel`. If there are removed items they will be available as `$removedItems`.
     * @param {expression=} mp-grid-crud-on-confirm Expression to evaluate when clicking on Confirm button. Model is available as `$model`. Temp model is available as `$tempModel`. If there are removed items they will be available as `$removedItems`.
     * @description
     *
     * This directive extends `mpGrid` adding CRUD behaviour.
     *
     * This component displays Add (Create), Detail (Read), Modify (Update), Remove (Delete), Copy, Cancel and Confirm buttons by default.
     *
     * - Add (Create) button will add a new entry to the data displayed in the grid (it will push a new item into `mpGridCrudData` collection). Once clicked you can change `mpGridCrudTempModel` properties. If you want this new item to be added, you can do it by clicking on `Confirm` button. You can click on `Cancel` otherwise.
     * - Detail (Read) button will expose the selected item from `mpGridCrudData` collection.
     * - Modify (Update) button will modify the selected item from `mpGridCrudData` collection. Once clicked you can change `mpGridCrudTempModel` properties. If you want these changes to take effect you can commit them by clicking on `Confirm` button. You can click on `Cancel` otherwise.
     * - Remove (Delete) button will remove the selected/s item/s from `mpGridCrudData` collection.
     * - Copy button will create a copy of the selected item, let you modify its properties and then add it as a new entry to the data displayed in the grid (it will push the copy into `mpGridCrudData` collection). Once clicked you can change `mpGridCrudTempModel` properties. Once modified, if you want these changes to take effect, you can commit them by clicking on `Confirm` button. You can click on `Cancel` otherwise.
     * - Cancel button will only appear if one of Add(Create), Modify(Update) or Copy button is displayed. It will be enabled when Creating,  Updating or Copying an item. It will discard any change.
     * - Confirm button will only appear if one of Add(Create), Modify(Update) or Copy button is displayed. It will be enabled Creating,  Updating or Copying an item. It will commit the changes.
     *
     * Component behaviour can be extended/modified by properties defined inside `crud` property in `mpGridCrudOptions` parsed expression object. Following are the described the allowed options with their default values:
     *
     *  ```js
     *  {
     *     "create": true,
     *     "read": true,
     *     "update": true,
     *     "copy": true,
     *     "delete": true
     *  }
     *  ```
     *
     * When mpGridCrudData/mpGridCrudOptions expression result changes, the mpGridCrud refreshes. This means that a new `table` is created, jqGrid plugin is initiated again with the result of compiling the current mpGridCrudOptions and mpGridCrudData expressions and every method inside the event listener will execute again.
     *
     * @example
       <doc:example module="mpGridCrud">
        <doc:source>
        script
            function MyCtrl($scope) {
                $scope.crud = {
                    options: {'datatype':'local','height':160,'colNames':['ID','Date','CD','Amount'],'colModel':[{'name':'item_id','index':'item_id'},{'name':'item_date','index':'item_date'},{'name':'item_cd','index':'item_cd'},{'name':'amount','index':'amount'}],'rowNum':4,'rowTotal':2000,'rowList':[5,10,15],'loadonce':true,'mtype':'GET','gridview':true,'sortname':'name','viewrecords':true,'sortorder':'asc','footerrow':false,'autowidth':true,'emptyrecords':'No records found'},
                    data: [{'item_id':'1','item_date':'2012-05-24','item_cd':'test1','amount':'1700'},{'item_id':'2','item_date':'2012-05-24','item_cd':'test2','amount':'1700'},{'item_id':'3','item_date':'2012-05-24','item_cd':'test3','amount':'1700'},{'item_id':'4','item_date':'2012-05-24','item_cd':'test4','amount':'1700'},{'item_id':'5','item_date':'2012-05-24','item_cd':'test5','amount':'1700'},{'item_id':'6','item_date':'2012-05-24','item_cd':'test6','amount':'1700'},{'item_id':'7','item_date':'2012-05-24','item_cd':'test7','amount':'1700'},{'item_id':'8','item_date':'2012-05-24','item_cd':'test8','amount':'1700'},{'item_id':'9','item_date':'2012-05-24','item_cd':'test9','amount':'1700'},{'item_id':'10','item_date':'2012-05-24','item_cd':'test10','amount':'1700'},{'item_id':'11','item_date':'2012-05-24','item_cd':'test11','amount':'1700'},{'item_id':'12','item_date':'2012-05-24','item_cd':'test12','amount':'1700'},{'item_id':'13','item_date':'2012-05-24','item_cd':'test13','amount':'1700'},{'item_id':'14','item_date':'2012-05-24','item_cd':'test14','amount':'1700'},{'item_id':'15','item_date':'2012-05-24','item_cd':'test15','amount':'1700'},{'item_id':'16','item_date':'2012-05-24','item_cd':'test16','amount':'1700'},{'item_id':'17','item_date':'2012-05-24','item_cd':'test17','amount':'1700'},{'item_id':'18','item_date':'2012-05-24','item_cd':'test18','amount':'1700'}, {'item_id':'19','item_date':'2012-05-25','item_cd':'test19','amount':'8000'},{'item_id':'20','item_date':'2012-05-24','item_cd':'test20','amount':'1700'}, {'item_id':'21','item_date':'2012-05-25','item_cd':'test21','amount':'8000'},{'item_id':'22','item_date':'2012-05-24','item_cd':'test22','amount':'1700'}, {'item_id':'23','item_date':'2012-05-25','item_cd':'test23','amount':'8000'}]
                }
            }
            MyCtrl.$inject = ['$scope'];
        div(ng-controller="MyCtrl")
            div
                div(mp-grid-crud="crud_id", mp-grid-crud-pager="crud_pager_id", mp-grid-crud-model="crud.model", mp-grid-crud-temp-model="crud.tempModel", mp-grid-crud-options="crud.options", mp-grid-crud-data="crud.data")
                p
                    button.btn.btn-default(type="button", ng-click='data.push({"item_id":"0","item_date":"2012-05-24","item_cd":"Modified Test","amount":"1700"})') Add data
                pre Selected: {{crud.model | json}}
                pre Data: {{crud.data | json}}
        </doc:source>
       </doc:example>
     */
    .directive('mpGridCrud', [
        function() {
            return {
                templateUrl: 'gaiafrontend/html/mpGridCrud.html',
                scope: {
                    id: '@mpGridCrud',
                    pagerId: '@mpGridCrudPager',
                    model: '=mpGridCrudModel',
                    tempModel: '=mpGridCrudTempModel',
                    data: '=mpGridCrudData',
                    options: '=mpGridCrudOptions',
                    disabled: '=mpGridCrudDisabled'// ,
                    // onCreateFn: '&mpGridCrudOnCreate',
                    // onReadFn: '&mpGridCrudOnRead',
                    // onUpdateFn: '&mpGridCrudOnUpdate',
                    // onDeleteFn: '&mpGridCrudOnDelete',
                    // onCopyFn: '&mpGridCrudOnCopy',
                    // onCancelFn: '&mpGridCrudOnCancel',
                    // onConfirmFn: '&mpGridCrudOnConfirm'
                },
                controller: 'MpGridCrudCtrl',
                controllerAs: 'MpGridCrud'
            };
        }
    ]);
