'use strict';

define(['angular', 'constants'], function (ng, constants) {
  reFactoryReassignExecutive.$inject = [
    'proxyAssignment'
  ];

  function reFactoryReassignExecutive(
    proxyAssignment
  ) {
    var SHOW_SPINNER = true;

    var factoryReassignExecutive = {
      GetSinisterList: GetSinisterList,
      UpdateAssignment: UpdateAssignment
    };

    function GetSinisterList(assignmentCriteria) {
      return proxyAssignment.ListAssignment(assignmentCriteria, SHOW_SPINNER);
    }

    function UpdateAssignment(listUpdateAssignmentCriteria) {
      return proxyAssignment.UpdateAssignment(listUpdateAssignmentCriteria, SHOW_SPINNER);
    }

    return ng.extend({}, factoryReassignExecutive);
  }

  return ng
    .module('appReembolso.factoryReassignExecutive', ['oim.proxyService.reembolso2'])
    .factory('reFactoryReassignExecutive', reFactoryReassignExecutive);
});
