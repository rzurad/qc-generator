import Ember from 'ember';

var ARGS = {
        'file': {
            type: 'file'
        }
    };

export const ARG_TYPES = (function () {
    var keys = {};

    Object.keys(ARGS).forEach(function (key) {
        keys[key] = key;
    });

    return keys;
}());

export function argFactory(type) {
    if (!(type in ARGS)) {
        throw new Error('Unrecognized argument type: "' + type + '"');
    }

    return Ember.Object.create(ARGS[type]);
}

export default argFactory;
