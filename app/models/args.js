import Ember from 'ember';

var ARGS = {
        'file': Ember.Object.extend({
            type: 'file',
            value: ''
        }),
        'string': Ember.Object.extend({
            type: 'string',
            value: ''
        }),
        'qstring': Ember.Object.extend({
            type: 'qstring',
            value: ''
        })
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

    return (window.__arg = ARGS[type].create());
}

export default argFactory;
