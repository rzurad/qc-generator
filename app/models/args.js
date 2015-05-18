import Ember from 'ember';

var Argument = Ember.Object.extend({
        type: null,
        value: null,
        label: 'Argument X',
        'default': null
    });

export const ARG_TYPES = {
    'file': 'file',
    'string': 'string',
    'qstring': 'qstring'
};

export function argFactory(obj) {
    if (!(obj.type in ARG_TYPES)) {
        throw new Error('Unrecognized argument type: "' + type + '"');
    }

    let ret = Argument.create(obj);

    if (obj.value === void 0) {
        // assign a default value
        switch (obj.type) {
            case ARG_TYPES.file:
            case ARG_TYPES.string:
            case ARG_TYPES.qstring:
                ret.set('value', '');
                break;
        }
    }

    return ret;
}

export default argFactory;
