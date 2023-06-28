/**
    * @doc-component directive
    * @name gaiafrontend.directive.mpTable
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
(function () {
    var defaults = {
        autowidth: false,
        data: [],
        height: 150,
        rowNum: 20,
        shrinkToFit: true,
        colModel: {
            width: 150,
            key: 'id'
        }
    };

    function isANumber(value) {
        return !isNaN(value) && typeof value === 'number';
    }

    function escapeHtml(str) {
        var entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        return String(str).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    }

    function pixelsToPercentage(width, total) {
        return (width * 100) / total + '%';
    }

    function calculateTableWidth(width) {
        if (isANumber(+width)) width = width + 'px';
        else width = '';

        return width;
    }

    function calculateTableHeight(height) {
        if (isANumber(+height)) height = height + 'px';
        else if (height !== '100%' && height !== 'auto') height = defaults.height + 'px';

        return height;
    }

    function calculateCellWidth(width, autowidth) {
        if (autowidth !== true && isANumber(+width)) width = width + 'px';
        else if (autowidth !== true) width = defaults.colModel.width + 'px';

        return width;
    }

    function recalculateColModelWidths(colModels) {
        var total = 0,
            i, l;

        for (i = 0, l = colModels.length; i < l; i += 1) {
            colModels[i].width = colModels[i].hidden ? 0 : +calculateCellWidth(colModels[i].width).replace('px', '');
            total += colModels[i].width;
        }

        for (i = 0, l = colModels.length; i < l; i += 1) {
            colModels[i].width = pixelsToPercentage(colModels[i].width, total);
        }

        return colModels;
    }

    function calculateCellAlign(align) {
        if (align !== 'left' && align !== 'center' && align !== 'right') align = '';
        return align;
    }

    angular.module('mpTable', [])
        .directive('mpTable', ['Utils', '$parse', '$compile', function (Utils, $parse, $compile) {
            return {
                template: '<div></div>',
                replace: true,
                link: function (scope, elem, attrs) {
                    var optionsExpression = attrs.mpTableOptions,
                        dataExpression = attrs.mpTableData,
                        loadOnce = angular.isDefined(attrs.mpTableOnce),
                        raw = angular.isDefined(attrs.mpTableRaw),
                        styleRegEx = /(style=["|'])(.*)(["|'])/g,
                        classRegEx = /(class=["|'])(.*)(["|'])/g;

                    function createTheadCell(colModel, colName, lastCell, autowidth) {
                        var th = '<th role="columnheader" id="' + attrs.mpTable + '_' + colModel.name + '" title="' + escapeHtml(colName || colModel.label || colModel.name) + '"';

                        if (colModel.width || colModel.align || colModel.hidden === true) {
                            th += ' style="';
                            if (colModel.width) {
                                th += 'width:' + calculateCellWidth(colModel.width, autowidth) + ';';
                                th += 'min-width:' + calculateCellWidth(colModel.width, autowidth) + ';';
                                th += 'max-width:' + calculateCellWidth(colModel.width, autowidth) + ';';
                            }
                            if (colModel.hidden === true) th += ' display:none;';
                            if (lastCell) th += ' border-right: 1px solid #9FA8AF;';
                            th += '" ';
                        }


                        if (lastCell && classRegEx.test(th)) th = th.replace(classRegEx, '$1 lastCell $2$3');
                        else if (lastCell) th += ' class="lastCell"';

                        th += '>' + colName || colModel.label || colModel.name + '</th>';
                        return th;
                    }

                    function createTheadCells(colModels, colNames, autowidth) {
                        var ths = '';

                        for (var i = 0, l = colModels.length; i < l; i += 1) {
                            ths += createTheadCell(colModels[i], colNames[i], i === l - 1, autowidth);
                        }

                        return ths;
                    }

                    function createThead(colModels, colNames, autowidth) {
                        return '<thead><tr>' + createTheadCells(colModels, colNames, autowidth) + '</tr></thead>';
                    }

                    function createRdata(colModels, rawObject) {
                        var rdata = {};

                        for (var i = 0, l = colModels.length; i < l; i += 1) {
                            $parse(colModels[i].name).assign(rdata, $parse(colModels[i].name)(rawObject));
                        }

                        return rdata;
                    }

                    function createTbodyCell(rowId, rawObject, cm, rdata, lastCell, autowidth) {
                        var parsed = $parse(cm.name)(rawObject),
                            val = parsed ? parsed : '',
                            td = '<td role="gridcell" title="' + escapeHtml(val) + '" aria-describedby="' + attrs.mpTable + '_' + cm.name + '"';

                        if (cm.cellattr) td += cm.cellattr(rowId, val, rawObject, cm, rdata);

                        if (cm.align || cm.width || cm.hidden === true) {
                            var styles = '';

                            if (cm.align) styles += 'text-align:' + calculateCellAlign(cm.align) + ';';
                            if (cm.width) {
                                styles += 'width:' + calculateCellWidth(cm.width, autowidth) + ';';
                                styles += 'min-width:' + calculateCellWidth(cm.width, autowidth) + ';';
                                styles += 'max-width:' + calculateCellWidth(cm.width, autowidth) + ';';
                            }
                            if (cm.hidden === true) styles += ' display:none;';

                            if (lastCell && classRegEx.test(td)) td = td.replace(classRegEx, '$1 lastCell $2$3');
                            else if (lastCell) td += ' class="lastCell"';

                            if (styleRegEx.test(td)) td = td.replace(styleRegEx, '$1' + styles + '$2$3');
                            else td += ' style="' + styles + '"';
                        }

                        td += '>' + val + '</td>';
                        return td;
                    }

                    function findKey(colModels) {
                        var key = defaults.colModel.key;

                        for (var i = 0, l = colModels.length; i < l; i += 1) {
                            for (var prop in colModels[i]) {
                                if (colModels[i].hasOwnProperty(prop) && prop === 'key') key = colModels[i][key];
                            }
                        }

                        return key;
                    }

                    function createTbodyRow(colModels, model, oddRow, autowidth) {
                        var key = findKey(colModels),
                            rowId = $parse(key)(model),
                            tr = '<tr role="row" id="' + rowId + '"';

                        if (Utils.platform.isIE8() && oddRow) tr += ' class="oddRow"';

                        tr += '>';

                        for (var i = 0, l = colModels.length; i < l; i += 1) {
                            tr += createTbodyCell(rowId, model, colModels[i], createRdata(colModels, model), i === l - 1, autowidth);
                        }

                        tr += '</tr>';
                        return tr;
                    }

                    function createTbodyRows(colModels, data, autowidth) {
                        var trs = '';

                        for (var i = 0, l = data.length; i < l; i += 1) {
                            trs += createTbodyRow(colModels, data[i], i % 2 !== 0, autowidth);
                        }

                        return trs;
                    }

                    function createTbody(colModels, data, height, autowidth) {
                        var tbody = '<tbody';

                        if (height) tbody += ' style="height:' + calculateTableHeight(height) + ';"';

                        tbody += '>' + createTbodyRows(colModels, data, autowidth) + '</tbody>';
                        return tbody;
                    }

                    function manageIdKey(data) {
                        for (var i = 0, l = data.length; i < l; i += 1) {
                            data[i].id = (data[i].id || i + 1) + '';
                        }
                    }

                    function initTable(options, collection) {
                        var opts = angular.copy(angular.extend({}, defaults, options)),
                            data = angular.copy(collection),
                            key = findKey(options),
                            headTable = '<div class="headTable"><table',
                            bodyTable = '<div class="bodyTable" style="height:' + calculateTableHeight(opts.height) + ';"><table id="' + attrs.mpTable + '" height="auto"';

                        if (key === 'id' && data[0]) manageIdKey(data);

                        opts.data = data;

                        if (opts.autowidth) {
                            headTable += ' class="autowidth"';
                            bodyTable += ' class="autowidth"';
                            recalculateColModelWidths(opts.colModel);
                        } else {
                            headTable += ' width="' + calculateTableWidth(opts.width) + '"';
                            bodyTable += ' width="' + calculateTableWidth(opts.width) + '"';
                        }

                        headTable += '>' + createThead(opts.colModel, opts.colNames, opts.autowidth) + ' </table></div>';
                        bodyTable += '>' + createTbody(opts.colModel, opts.data, opts.height, opts.autowidth) + ' </table></div>';

                        elem[0].innerHTML = headTable + bodyTable;
                        if (!raw) $compile(elem.contents())(scope);
                    }

                    var stopWatching = scope.$watch('{options: ' + optionsExpression + ',data: ' + dataExpression + '}', function (obj) {
                        if (obj && obj.options && obj.data) {
                            initTable(obj.options, obj.data);
                            if (loadOnce) stopWatching();
                        }
                    }, true);
                }
            };
        }]);
}());
