'use strict';

define(['angular', 'lodash'], function(ng, _) {
  reportResultsController.$inject = ['$log', '$scope'];

  function reportResultsController($log, $scope) {
    var vm = this;
    vm.$onInit = onInit;
    vm.exportReport = exportReport;

    function onInit() {
      vm.currentDate = new Date();
      vm.sumData = [];
    }

    function renderData(data) {
      if (!vm.advanced) {
        simpleReport(data);
      } else {
        mappedReport(data);
      }
    }

    function simpleReport(data) {
      vm.reportData = _.chain(data)
        .map(function(row) {
          return {
            header: _.values(_.pick(row, vm.groupBy))[0],
            viewData: {
              mainRow: _.values(_.pick(row, vm.mainRow))[0],
              detailRow: _.pick(row, _.pluck(vm.reportProperties.columns.detail, 'property'))
            }
          };
        })
        .groupBy('header')
        .value();
      for (var k in vm.reportData) {
        if (vm.reportData.hasOwnProperty(k)) {
          var sum = _.chain(vm.reportData[k])
            .reduce(
              function(acc, current) {
                _.each(current.viewData.detailRow, function(value, key) {
                  acc[key] = acc[key] || 0;
                  acc[key] += value;
                });

                return acc;
              },
              _.chain(vm.reportProperties.columns.detail)
                .pluck('property')
                .object(
                  _.map(vm.reportProperties.columns.detail, function() {
                    return 0;
                  })
                )
                .value()
            )
            .value();
          vm.sumData.push({key: k, value: sum});
        }
      }
      $log.log('vm.reportData', vm.reportData);
    }

    function mappedReport(data) {
      var reportData = _.chain(data)
        .map(function(row) {
          return {
            header: _.values(_.pick(row, vm.groupBy))[0],
            viewData: {
              mainRow: row.pMes,
              detailRow: row
            }
          };
        })
        .groupBy('header')
        .value();

      for (var key in reportData) {
        reportData[key] = completeMonths(reportData[key]);
      }
      vm.reportData = reportData;
      $log.log('vm.reportData', vm.reportData);
    }

    function completeMonths(data) {
      var length = data.length;
      if (length === 12) {
        return data;
      } else {
        var header = data[0].header;
        var returnData = [
          {
            header: header,
            viewData: {
              mainRow: 'ENERO'
            }
          },
          {
            header: header,
            viewData: {
              mainRow: 'FEBRERO'
            }
          },
          {
            header: header,
            viewData: {
              mainRow: 'MARZO'
            }
          },
          {
            header: header,
            viewData: {
              mainRow: 'ABRIL'
            }
          },
          {
            header: header,
            viewData: {
              mainRow: 'MAYO'
            }
          },
          {
            header: header,
            viewData: {
              mainRow: 'JUNIO'
            }
          },
          {
            header: header,
            viewData: {
              mainRow: 'JULIO'
            }
          },
          {
            header: header,
            viewData: {
              mainRow: 'AGOSTO'
            }
          },
          {
            header: header,
            viewData: {
              mainRow: 'SETIEMBRE'
            }
          },
          {
            header: header,
            viewData: {
              mainRow: 'OCTUBRE'
            }
          },

          {
            header: header,
            viewData: {
              mainRow: 'NOVIEMBRE'
            }
          },
          {
            header: header,
            viewData: {
              mainRow: 'DICIEMBRE'
            }
          }
        ];
        return _.map(returnData, function(rd) {
          var newRD = _.find(data, function(entry) {
            return entry.viewData.mainRow === rd.viewData.mainRow;
          });
          return newRD || rd;
        });
      }
    }

    function exportReport(format) {
      vm.onExport({
        $event: {
          format: format
        }
      });
    }

    $scope.$watch('$ctrl.reportProperties.reportData', function(newValue) {
      if (newValue) {
        renderData(newValue);
      }
    });
  }

  return ng
    .module('appInspec')
    .controller('ReportResultsController', reportResultsController)
    .component('inspecReportResults', {
      templateUrl: '/inspec/app/common/report-results/report-results.html',
      controller: 'ReportResultsController',
      controllerAs: '$ctrl',
      bindings: {
        reportProperties: '=',
        groupBy: '=',
        mainRow: '=',
        onExport: '&?',
        noHeader: '=',
        advanced: '='
      }
    });
});
