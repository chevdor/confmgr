"use strict";
exports.__esModule = true;
var SpecsFactory = /** @class */ (function () {
    function SpecsFactory(container) {
        // this.params = params;
        this.specs = {
            config: {},
            container: container
        };
    }
    SpecsFactory.prototype.getSpec = function (name, description, options) {
        var res = {
            name: this.specs.container.prefix + "_" + this.specs.container.module + "_" + name,
            description: description,
            options: options
        };
        return res;
    };
    SpecsFactory.prototype.getSpecs = function () {
        return this.specs;
    };
    SpecsFactory.prototype.appendSpec = function (newSpec) {
        // console.log('Appendspec', newSpec);
        if (!this.specs.config)
            this.specs.config = {};
        this.specs.config[newSpec.name] = newSpec;
        return this.specs;
    };
    return SpecsFactory;
}());
exports.SpecsFactory = SpecsFactory;
