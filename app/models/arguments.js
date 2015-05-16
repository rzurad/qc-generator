var ARGUMENTS = {
        'file': {
            
        }
    };

export const TYPES = (function () {
    var keys = {};

    Object.keys(ARGUMENTS).forEach(function (key) {
        keys[key] = key;
    });
}());

export function factory(type, description) {
    var x = type + description;

    return x;
}

export default factory;
