/**
     * @doc-component service
     * @name gaiafrontend.value.documentValidator
     * @description
     * Value that exposes a functions to validate a documents. Functions exposed:
     *
     */
/*global angular */
/*jshint maxlen:100 */
(function () {

    'use strict';

    var LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';

    angular.module('documentValidator', [])
        .value('DocumentValidator', {
            /**
             * @doc-component method
             * @methodOf gaiafrontend.value.documentValidator
             * @name gaiafrontend.value.documentValidator#nif
             * @param {string} value Fiscal identification number to validate
             * @return {boolean} `true` if the document is `valid`, false otherwise.
             * @description
             * Validate fiscal identification number(DNI).
             */
            nif: function (value) {
                var DNI_REGEX = /^[0-9]{8}[A-Z]{1}$/;

                value = value.toUpperCase();

                if (angular.isDefined(value) && value.length > 0 && DNI_REGEX.test(value)) {
                    return LETTERS.charAt(value.substring(8, 0) % 23) === value.charAt(8);
                }
                return false;
            },
            /**
             * @doc-component method
             * @methodOf gaiafrontend.value.documentValidator
             * @name gaiafrontend.value.documentValidator#nie
             * @param {string} value Foreigner identification number to validate
             * @return {boolean} `true` if the document is `valid`, false otherwise.
             * @description
             * Validate foreigner identification number.
             */
            nie: function (value) {
                var NIE_REGEX = /^[XYZ]{1}[0-9]{7}[A-Z]{1}/;

                value = value.toUpperCase();

                if (angular.isUndefined(value) && value.length < 1 && !NIE_REGEX.test(value)) {
                    return false;
                }
                return value[8] === LETTERS.charAt(value.replace('X', '0')
                                                        .replace('Y', '1')
                                                        .replace('Z', '2').substring(0, 8) % 23);
            }
        });
}());
