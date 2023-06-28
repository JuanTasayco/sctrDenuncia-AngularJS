/*global angular, _ */
/*DEPRECATED*/
angular.module('mpGridCrudMultiple', [])
    .controller('MpGridCrudMultipleCtrl', ['$scope', '$parse', '$timeout', '$attrs',
        function($scope, $parse, $timeout, $attrs) {
            var itemsToModfyIndexes,
                itemsToRemoveIndexes,
                unregisterTempModelWatcher,
                defaultCrudOptions = {
                    'create': true,
                    'read': true,
                    'update': true,
                    'copy': true,
                    'delete': true
                },
                MpGridCrudMultiple = this;

            function isPromise(promise) {
                return promise && angular.isFunction(promise.then) && angular.isFunction(promise['catch']) && angular.isFunction(promise['finally']);
            }

            function isMultiselect() {
                return !!($scope.options && $scope.options.multiselect);
            }

            function clearVariables() {
                itemsToModfyIndexes = undefined;
                itemsToRemoveIndexes = undefined;
                $scope.tempModel = undefined;
            }

            function returnTrue() {
                return true;
            }

            // Execute the function in the next digest cycle
            // http://stackoverflow.com/a/18996042
            function applyLater(fn) {
                $timeout(fn);
            }

            MpGridCrudMultiple.editionMode = false;

            MpGridCrudMultiple.isAnyRowSelected = function() {
                return isMultiselect() ? !!$scope.model && $scope.model.length : !!$scope.model;
            };

            MpGridCrudMultiple.create = function() {
                function createFn() {
                    MpGridCrudMultiple.editionMode = true;

                    $scope.tempModel = isMultiselect() ? [{}] : {};

                    applyLater(function () {
                        onCreateFn($scope.$parent, {
                            $model: $scope.model,
                            $tempModel: $scope.tempModel
                        });
                    });
                }

                var beforeCreateFn = $attrs.mpGridCrudMultipleBeforeCreate ? $parse($attrs.mpGridCrudMultipleBeforeCreate) : returnTrue,
                    beforeCreateFnReturn,
                    onCreateFn = $parse($attrs.mpGridCrudMultipleOnCreate);

                beforeCreateFnReturn = beforeCreateFn($scope.$parent, {
                    $model: $scope.model,
                    $tempModel: $scope.tempModel
                });

                if (isPromise(beforeCreateFnReturn)) beforeCreateFnReturn.then(createFn);
                else if (beforeCreateFnReturn !== false) createFn();
            };

            MpGridCrudMultiple.read = function() {
                function readFn() {
                    MpGridCrudMultiple.editionMode = false;
                    $scope.tempModel = angular.copy($scope.model);

                    applyLater(function () {
                        onReadFn($scope.$parent, {
                            $model: $scope.model,
                            $tempModel: $scope.tempModel
                        });
                    });
                }

                if ($scope.model) {
                    var beforeReadFn = $attrs.mpGridCrudMultipleBeforeRead ? $parse($attrs.mpGridCrudMultipleBeforeRead) : returnTrue,
                        beforeReadFnReturn,
                        onReadFn = $parse($attrs.mpGridCrudMultipleOnRead);

                    beforeReadFnReturn = beforeReadFn($scope.$parent, {
                        $model: $scope.model,
                        $tempModel: $scope.tempModel
                    });

                    if (isPromise(beforeReadFnReturn)) beforeReadFnReturn.then(readFn);
                    else if (beforeReadFnReturn !== false) readFn();
                }
            };

            MpGridCrudMultiple.update = function() {
                function updateFn() {
                    MpGridCrudMultiple.editionMode = true;

                    if (isMultiselect()) {
                        itemsToModfy = [];
                        angular.forEach($scope.model, function(selectedItem) {
                            selectedItemIndex = _.findIndex($scope.data, function(item) {
                                return _.isEqual(selectedItem, item);
                            });

                            itemsToModfyIndexes.push(selectedItemIndex);
                            itemsToModfy.push(angular.copy($scope.data[selectedItemIndex]));
                        });
                    } else {
                        selectedItemIndex = _.findIndex($scope.data, function(item) {
                            return _.isEqual($scope.model, item);
                        });

                        itemsToModfyIndexes.push(selectedItemIndex);
                        itemsToModfy = angular.copy($scope.data[selectedItemIndex]);
                    }

                    $scope.tempModel = itemsToModfy;

                    applyLater(function () {
                        onUpdateFn($scope.$parent, {
                            $model: $scope.model,
                            $tempModel: $scope.tempModel
                        });
                    });
                }
                if ($scope.model) {
                    var beforeUpdateFn = $attrs.mpGridCrudMultipleBeforeUpdate ? $parse($attrs.mpGridCrudMultipleBeforeUpdate) : returnTrue,
                        beforeUpdateFnReturn,
                        onUpdateFn = $parse($attrs.mpGridCrudMultipleOnUpdate),
                        selectedItemIndex,
                        itemsToModfy;

                    itemsToModfyIndexes = [];

                    beforeUpdateFnReturn = beforeUpdateFn($scope.$parent, {
                        $model: $scope.model,
                        $tempModel: $scope.tempModel
                    });

                    if (isPromise(beforeUpdateFnReturn)) beforeUpdateFnReturn.then(updateFn);
                    else if (beforeUpdateFnReturn !== false) updateFn();
                }
            };

            MpGridCrudMultiple['delete'] = function() {
                function deleteFn() {
                    MpGridCrudMultiple.editionMode = true;

                    if (isMultiselect()) {
                        itemsToRemove = [];
                        angular.forEach(isMultiselect() ? $scope.model : [$scope.model], function(selectedItem) {
                            selectedItemIndex = _.findIndex($scope.data, function(item) {
                                return _.isEqual(selectedItem, item);
                            });

                            itemsToRemoveIndexes.push(selectedItemIndex);
                            itemsToRemove.push(angular.copy($scope.data[selectedItemIndex]));
                            // Array.prototype.push.apply(itemsToRemove, $scope.data.splice(selectedItemIndex, 1));
                        });
                    } else {
                        selectedItemIndex = _.findIndex($scope.data, function(item) {
                            return _.isEqual($scope.model, item);
                        });

                        itemsToRemoveIndexes.push(selectedItemIndex);
                        itemsToRemove = angular.copy($scope.data[selectedItemIndex]);
                    }

                    $scope.tempModel = itemsToRemove;

                    applyLater(function () {
                        onDeleteFn($scope.$parent, {
                            $model: $scope.model,
                            $tempModel: $scope.tempModel
                        });
                    });
                }

                if ($scope.model) {
                    var beforeDeleteFn = $attrs.mpGridCrudMultipleBeforeDelete ? $parse($attrs.mpGridCrudMultipleBeforeDelete) : returnTrue,
                        beforeDeleteFnReturn,
                        onDeleteFn = $parse($attrs.mpGridCrudMultipleOnDelete),
                        selectedItemIndex,
                        itemsToRemove;

                    itemsToRemoveIndexes = []

                    beforeDeleteFnReturn = beforeDeleteFn($scope.$parent, {
                        $model: $scope.model,
                        $tempModel: $scope.tempModel
                    });

                    if (isPromise(beforeDeleteFnReturn)) beforeDeleteFnReturn.then(deleteFn);
                    else if (beforeDeleteFnReturn !== false) deleteFn();
                }
            };

            MpGridCrudMultiple.copy = function() {
                function copyFn() {
                    MpGridCrudMultiple.editionMode = true;

                    $scope.tempModel = angular.copy($scope.model);

                    applyLater(function () {
                        onCopyFn($scope.$parent, {
                            $model: $scope.model,
                            $tempModel: $scope.tempModel
                        });
                    });
                }

                if ($scope.model) {
                    var beforeCopyFn = $attrs.mpGridCrudMultipleBeforeCopy ? $parse($attrs.mpGridCrudMultipleBeforeCopy) : returnTrue,
                        beforeCopyFnReturn,
                        onCopyFn = $parse($attrs.mpGridCrudMultipleOnCopy);

                    beforeCopyFnReturn = beforeCopyFn($scope.$parent, {
                        $model: $scope.model,
                        $tempModel: $scope.tempModel
                    });

                    if (isPromise(beforeCopyFnReturn)) beforeCopyFnReturn.then(copyFn);
                    else if (beforeCopyFnReturn !== false) copyFn();
                }
            };

            MpGridCrudMultiple.cancel = function() {
                function cancelFn() {
                    MpGridCrudMultiple.editionMode = false;

                    applyLater(function () {
                        onCancelFn($scope.$parent, {
                            $model: $scope.model,
                            $tempModel: $scope.tempModel
                        });
                        clearVariables();
                    });
                }

                if ($scope.tempModel) {
                    var beforeCancelFn = $attrs.mpGridCrudMultipleBeforeCancel ? $parse($attrs.mpGridCrudMultipleBeforeCancel) : returnTrue,
                        beforeCancelFnReturn,
                        onCancelFn = $parse($attrs.mpGridCrudMultipleOnCancel);

                    beforeCancelFnReturn = beforeCancelFn($scope.$parent, {
                        $model: $scope.model,
                        $tempModel: $scope.tempModel
                    });

                    if (isPromise(beforeCancelFnReturn)) beforeCancelFnReturn.then(cancelFn);
                    else if (beforeCancelFnReturn !== false) cancelFn();
                }
            };

            function clearModel() {
                $scope.model = undefined;
            }

            function sortDesc(arr) {
                return arr.sort(function (a, b) {
                    return b - a;
                });
            }

            function hasContent(obj) {
                return !(_.isEmpty(obj) || (_.keys(obj).length === 1 && obj.$$hashKey))
            }

            MpGridCrudMultiple.confirm = function() {
                function confirmFn() {
                    MpGridCrudMultiple.editionMode = false;

                     // Adding
                    if (angular.isUndefined(itemsToModfyIndexes) && angular.isUndefined(itemsToRemoveIndexes)) {
                        if (isMultiselect()) {
                            angular.forEach(angular.isArray($scope.tempModel) ? $scope.tempModel : [$scope.tempModel], function (tempModel) {
                                if (hasContent(tempModel)) $scope.data.push(angular.copy(tempModel));
                            });
                        } else {
                            $scope.data.push(angular.copy($scope.tempModel));
                        }
                    // Modifying
                    } else if (angular.isDefined(itemsToModfyIndexes)) {
                        if (isMultiselect()) {
                            angular.forEach(itemsToModfyIndexes, function (itemToModfyIndex, i) {
                                $scope.data.splice(itemToModfyIndex, 1,  angular.copy($scope.tempModel[i]));
                                $scope.model[i] = angular.copy($scope.tempModel[i]);
                            });
                        } else {
                            $scope.data.splice(itemsToModfyIndexes[0], 1, angular.copy($scope.tempModel));
                            $scope.model = angular.copy($scope.tempModel);
                        }
                    // Deleting
                    } else if (angular.isDefined(itemsToRemoveIndexes)) {
                        if (isMultiselect()) {
                            angular.forEach(sortDesc(itemsToRemoveIndexes), function (itemToRemoveIndex) {
                                Array.prototype.push.apply(removedItems, angular.copy($scope.data.splice(itemToRemoveIndex, 1)));
                            });
                        } else {
                            Array.prototype.push.apply(removedItems, angular.copy($scope.data.splice(itemsToRemoveIndexes[0], 1)));
                        }

                        clearModel();
                    }

                    applyLater(function () {
                        onConfirmFn($scope.$parent, {
                            $model: $scope.model,
                            $tempModel: $scope.tempModel
                        });

                        $scope.model = $scope.tempModel;
                        clearVariables();
                    });
                }

                if ($scope.tempModel) {
                    var beforeConfirmFn = $attrs.mpGridCrudMultipleBeforeConfirm ? $parse($attrs.mpGridCrudMultipleBeforeConfirm) : returnTrue,
                        beforeConfirmFnReturn,
                        onConfirmFn = $parse($attrs.mpGridCrudMultipleOnConfirm),
                        removedItems = [];

                    beforeConfirmFnReturn = beforeConfirmFn($scope.$parent, {
                        $model: $scope.model,
                        $tempModel: $scope.tempModel
                    });

                    if (isPromise(beforeConfirmFnReturn)) beforeConfirmFnReturn.then(confirmFn);
                    else if (beforeConfirmFnReturn !== false) confirmFn();
                }
            };

            $scope.options.crud = angular.extend(defaultCrudOptions, $scope.options.crud);

            $scope.$on($scope.id + 'Set', function (event, grid) {
                var isMultiselect = grid.jqGrid('getGridParam', 'multiselect');

                if (isMultiselect) {
                    // AUnregister old watcher
                    if (unregisterTempModelWatcher) unregisterTempModelWatcher();
                    // Disable selection checkboxes
                    unregisterTempModelWatcher = $scope.$watch(function () {
                        return MpGridCrudMultiple.editionMode;
                    }, function (editionMode) {
                        var cboxes = grid.closest('#gview_' + $scope.id).find('[type="checkbox"][class="cbox"]');
                        if (editionMode) {
                            cboxes.attr('disabled', 'disabled');
                        } else {
                            cboxes.removeAttr('disabled');
                        }
                    }, true);
                }
                // Block row selection if tempModel has value
                grid.jqGrid('setGridParam', {
                    beforeSelectRow: function() {
                        return !MpGridCrudMultiple.editionMode;
                    }
                });
            });
        }])
    /**
     * @doc-component directive
     * @name gaiafrontend.directive.mpGridCrudMultiple
     * @param {string} mp-grid-crud-multiple The grid id. Applied to the generated `table` where jqGrid plugin is going to be initialized.
     * @param {string=} mp-grid-crud-multiple-pager The grid pager id. Apply to the generated `div` where the initialized jqGrid will display its pager. Notice this attribute overwrites `pager` property of jqGrid options Object.
     * @param {expression} mp-grid-crud-multiple-options The result of the expression must be the jqGrid options Object. Visit [jqGrid official Wiki](http://www.trirand.com/jqgridwiki/doku.php?id=wiki:options "jqGrid options") for info. It can be extended with `crud` property to extend default `mpGridCrudMultiple` behaviour.
     * @param {expression} mp-grid-crud-multiple-model The selected/s row/s will be assigned to the result of the expression.
     * @param {expression} mp-grid-crud-multiple-temp-model When creating/updating an item it will be assigned to the result of the expression.
     * @param {expression} mp-grid-crud-multiple-data The result of the expression must be a collection. It will be applied as `data` property in jqGrid options Object.
     * @param {expression=} mp-grid-crud-multiple-disabled Buttons will display enabled or disabled depending on the result of this expression.
     * @param {expression=} mp-grid-crud-multiple-before-create Expression to evaluate when clicking on Add(Create) button, before creating the `$tempModel`. This expression has to return a 'truthy' value to let the execution flow continue. Model is available as `$model`. Temp model is available as `$tempModel`.
     * @param {expression=} mp-grid-crud-multiple-on-create Expression to evaluate when clicking on Add(Create) button, after creating the `$tempModel`. Model is available as `$model`. Temp model is available as `$tempModel`.
     * @param {expression=} mp-grid-crud-multiple-before-read Expression to evaluate when clicking on Detail(Read) button. Model is available as `$model`. This expression has to return a 'truthy' value to let the execution flow continue. Temp model is available as `$tempModel`.
     * @param {expression=} mp-grid-crud-multiple-on-read Expression to evaluate when clicking on Detail(Read) button. Model is available as `$model`. Temp model is available as `$tempModel`.
     * @param {expression=} mp-grid-crud-multiple-before-update Expression to evaluate when clicking on Modify(Update) button, before creating the `$tempModel`. This expression has to return a 'truthy' value to let the execution flow continue. Model is available as `$model`. Temp model is available as `$tempModel`.
     * @param {expression=} mp-grid-crud-multiple-on-update Expression to evaluate when clicking on Modify(Update) button. Model is available as `$model`. Temp model is available as `$tempModel`.
     * @param {expression=} mp-grid-crud-multiple-before-delete Expression to evaluate when clicking on Remove(Delete) button, before removing and creating the `$tempModel`. This expression has to return a 'truthy' value to let the execution flow continue. Model is available as `$model`. Items to remove are available as `$tempModel`.
     * @param {expression=} mp-grid-crud-multiple-on-delete Expression to evaluate when clicking on Remove(Delete) button. Model is available as `$model`. Items to remove are available as `$tempModel`.
     * @param {expression=} mp-grid-crud-multiple-before-copy Expression to evaluate when clicking on Copy button, before creating the `$tempModel`. This expression has to return a 'truthy' value to let the execution flow continue. Model is available as `$model`. Temp model is available as `$tempModel`.
     * @param {expression=} mp-grid-crud-multiple-on-copy Expression to evaluate when clicking on Copy button. Model is available as `$model`. Temp model is available as `$tempModel`.
     * @param {expression=} mp-grid-crud-multiple-before-cancel Expression to evaluate when clicking on Cancel button, before cancelling changes. This expression has to return a 'truthy' value to let the execution flow continue. Model is available as `$model`. If there were items to remove they will be available as `$tempModel`.
     * @param {expression=} mp-grid-crud-multiple-on-cancel Expression to evaluate when clicking on Cancel button. Model is available as `$model`. If there were items to remove they will be available as `$tempModel`.
     * @param {expression=} mp-grid-crud-multiple-before-confirm Expression to evaluate when clicking on Confirm button, before applying the changes. This expression has to return a 'truthy' value to let the execution flow continue. Model is available as `$model`. If there are items to remove they will be available as `$tempModel`.
     * @param {expression=} mp-grid-crud-multiple-on-confirm Expression to evaluate when clicking on Confirm button. Model is available as `$model`. If there are removed items they will be available as `$tempModel`.
     * @description
     *
     * This directive extends `mpGrid` adding CRUD behaviour.
     *
     * This component displays Add (Create), Detail (Read), Modify (Update), Remove (Delete), Copy, Cancel and Confirm buttons by default.
     *
     * - Add (Create) button will add a new entry to the data displayed in the grid (it will push a new item into `mpGridCrudMultipleData` collection). Once clicked you can change `mpGridCrudMultipleTempModel` properties. If you want this new item to be added, you can do it by clicking on `Confirm` button. You can click on `Cancel` otherwise.
     * - Detail (Read) button will expose the selected item from `mpGridCrudMultipleData` collection.
     * - Modify (Update) button will modify the selected item from `mpGridCrudMultipleData` collection. Once clicked you can change `mpGridCrudMultipleTempModel` properties. If you want these changes to take effect you can commit them by clicking on `Confirm` button. You can click on `Cancel` otherwise.
     * - Remove (Delete) button will remove the selected/s item/s from `mpGridCrudMultipleData` collection.
     * - Copy button will create a copy of the selected item, let you modify its properties and then add it as a new entry to the data displayed in the grid (it will push the copy into `mpGridCrudMultipleData` collection). Once clicked you can change `mpGridCrudMultipleTempModel` properties. Once modified, if you want these changes to take effect, you can commit them by clicking on `Confirm` button. You can click on `Cancel` otherwise.
     * - Cancel button will only appear if one of Add(Create), Modify(Update) or Copy button is displayed. It will be enabled when Creating,  Updating or Copying an item. It will discard any change.
     * - Confirm button will only appear if one of Add(Create), Modify(Update) or Copy button is displayed. It will be enabled Creating,  Updating or Copying an item. It will commit the changes.
     *
     * Component behaviour can be extended/modified by properties defined inside `crud` property in `mpGridCrudMultipleOptions` parsed expression object. Following are the described the allowed options with their default values:
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
     * When mpGridCrudMultipleData/mpGridCrudMultipleOptions expression result changes, the mpGridCrudMultiple refreshes. This means that a new `table` is created, jqGrid plugin is initiated again with the result of compiling the current mpGridCrudMultipleOptions and mpGridCrudMultipleData expressions and every method inside the event listener will execute again.
     *
     * @example
       <doc:example module="mpGridCrudMultiple">
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
                div(mp-grid-crud-multiple="crud_id", mp-grid-crud-multiple-pager="crud_pager_id", mp-grid-crud-multiple-model="crud.model", mp-grid-crud-multiple-temp-model="crud.tempModel", mp-grid-crud-multiple-options="crud.options", mp-grid-crud-multiple-data="crud.data")
                p
                    button.btn.btn-default(type="button", ng-click='data.push({"item_id":"0","item_date":"2012-05-24","item_cd":"Modified Test","amount":"1700"})') Add data
                pre Selected: {{crud.model | json}}
                pre Data: {{crud.data | json}}
        </doc:source>
       </doc:example>
     */
    .directive('mpGridCrudMultiple', [
        function() {
            return {
                templateUrl: 'gaiafrontend/html/mpGridCrudMultiple.html',
                scope: {
                    id: '@mpGridCrudMultiple',
                    pagerId: '@mpGridCrudMultiplePager',
                    model: '=mpGridCrudMultipleModel',
                    tempModel: '=mpGridCrudMultipleTempModel',
                    data: '=mpGridCrudMultipleData',
                    options: '=mpGridCrudMultipleOptions',
                    disabled: '=mpGridCrudMultipleDisabled'// ,
                    // onCreateFn: '&mpGridCrudMultipleOnCreate',
                    // onReadFn: '&mpGridCrudMultipleOnRead',
                    // onUpdateFn: '&mpGridCrudMultipleOnUpdate',
                    // onDeleteFn: '&mpGridCrudMultipleOnDelete',
                    // onCopyFn: '&mpGridCrudMultipleOnCopy',
                    // onCancelFn: '&mpGridCrudMultipleOnCancel',
                    // onConfirmFn: '&mpGridCrudMultipleOnConfirm'
                },
                controller: 'MpGridCrudMultipleCtrl',
                controllerAs: 'MpGridCrudMultiple'
            };
        }
    ]);
