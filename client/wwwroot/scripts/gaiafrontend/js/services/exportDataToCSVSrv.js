/*global angular */
'use strict';
angular.module('exportDataToCSVSrv', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.exportDataToCSVSrv
     * @description
     * This service is available in "GAIA Site"
     * There you will find its documentation and several examples.
     * "GAIA Site" is an application created by the Architecture Area to learn and play with GAIA. Is available in RAS. Direct links are available below in this page.
     */
    .factory('ExportDataToCSVSrv', ['BrowserDetectSrv', function(BrowserDetectSrv) {
        var sepCharacter = ',';

        function createString(grid, colNames, cellName) {
            var str = '',
                array = grid.data,
                i, index, line = '';
            for (i = 0; i < array.length; i++) {
                line = '';
                for (index = 0; index < cellName.length; index++) {
                    line += array[i][cellName[index].name] + sepCharacter;
                }
                str += line + '\r\n';
            }
            str = colNames.toString().replace(/,/g, sepCharacter) + '\r\n' + str;
            return str;
        }

        function mozCSV(oData) {
            var uri = 'data:application/csv;charset=utf-8,' + encodeURI(oData),
                olink = document.createElement("a");
            olink.href = uri;
            olink.download = "data.csv";
            document.body.appendChild(olink);
            olink.click();
            document.body.removeChild(olink);
        }

        function ieCSV(oData) {
            var w = window.open(),
                doc = w.document,
                uri = 'data:application/csv;charset=utf-8';
            doc.open(uri, 'replace');
            doc.write(oData);
            doc.close();
            doc.execCommand("SaveAs", null, 'data.csv');
            w.close();
        }

        function exportData(grid, character) {
            var browserDetectSrv = {};

            if (!angular.isUndefined(character))
                sepCharacter = character;

            browserDetectSrv = BrowserDetectSrv.getBrowser();

            /* TODO: This must be replaced by the browserDetectSrv */
            if (navigator.userAgent.indexOf('MSIE') !== -1)
                ieCSV(createString(grid, grid.options.colNames, grid.options.colModel))
            else
                mozCSV(createString(grid, grid.options.colNames, grid.options.colModel));
        }

        return {
            exportData: exportData
        }
    }]);
