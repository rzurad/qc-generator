import Ember from 'ember';

var Argument = Ember.Object.extend(Ember.Copyable, {
        type: null,
        value: null,
        values: null,
        label: 'Argument X',
        'default': null,
        many: false,

        copy: function () {
            return argFactory({
                type: this.get('type'),
                values: this.get('values'),
                label: this.get('label'),
                'default': this.get('default'),
                many: this.get('many')
            });
        }
    });

export const ARG_TYPES = {
    'int': 'int',
    'float': 'float',
    'file': 'file',
    'string': 'string',
    'qstring': 'qstring',
    'enum': 'enum'
};

export function argFactory(obj) {
    if (!(obj.type in ARG_TYPES)) {
        throw new Error('Unrecognized argument type: "' + obj.type + '"');
    }

    let ret = Argument.create(obj);

    if (!obj.value) {
        if (obj['default'] !== null && obj['default'] !== void 0) {
            ret.set('value', obj['default']);
        } else {
            // assign a default value
            switch (obj.type) {
                case ARG_TYPES.int:
                case ARG_TYPES.float:
                    ret.set('value', 0);
                    break;
                case ARG_TYPES.file:
                case ARG_TYPES.string:
                case ARG_TYPES.qstring:
                    ret.set('value', '');
                    break;
                case ARG_TYPES.enum:
                    break;
                default:
                    throw new Error('No default value for type "' + obj.type + '"');
            }
        }
    }

    return ret;
}

export default argFactory;
