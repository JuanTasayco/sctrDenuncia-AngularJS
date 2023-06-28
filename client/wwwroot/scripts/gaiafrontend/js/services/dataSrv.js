/*global angular */
angular.module('dataSrv', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.dataSrv
     * @description
     * This service allows you create an object instance of Data.
     * Data is an object that tries to replicate AngularJS Scope inheritance behaviour.
     *
     * Data has the following properties:
     *
     * - `this`. A self reference to the current Data instance.
     * - `$current`. Same as `this`.
     * - `$parent`. A reference to the parent Data instance.
     * - `$name`. The name of the Data instance.
     *
     * A Data object also has a `$new` method.
     * This method receives as an argument the name of the child Data instance we want to create.
     *
     * This service is used to manage the states flow data.
     *
     */
    .factory('DataSrv', function() {
        return {
            /**
             * @doc-component method
             * @methodOf gaiafrontend.service.dataSrv
             * @name gaiafrontend.service.dataSrv#$new
             * @param {string} name The Data instance name property.
             * @param {object=} Data The parent Data instance.
             * @description
             * This method creates a Data instance with the name provided.
             * If a Data instance is also provided, it will be assigned as the parent.
             */
            $new: function $new(name, parentData) {
                var Data = function() {},
                    data;

                if (parentData) {
                    Data.prototype = parentData;
                }
                data = new Data();
                data.$current = data['this'] = data;
                data.$parent = parentData || null;
                data.$name = name;
                data.$new = function (name) {
                    return $new(name, data);
                };

                return data;
            }
        };
    });
