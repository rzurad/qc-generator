import Ember from 'ember';
import EmberValidations from 'ember-validations';

let Argument;
export default Argument = Ember.Object.extend(Ember.Copyable, EmberValidations.Mixin, {
    type: null,
    value: null,
    values: null,
    label: 'Argument X',
    'default': null,
    many: false,

    init: function () {
        var type = this.get('type'),
            validations = this.get('validations'),
            def = this.get('default');

        if (!(type in Argument.TYPES)) {
            throw new Error('Unrecognized argument type: "' + type + '"');
        }

        // EmberValidations will clobber the validations object that you pass into the
        // `create` function, so in order to preserve it for potential object cloning later, we'll tack it onto
        // the created object afterwords as an implied private property
        this._validations = validations;

        if (!this.get('value')) {
            if (def !== null && def !== void 0) {
                this.set('value', def);
            } else {
                // assign a default value
                switch (type) {
                    case Argument.TYPES.bool:
                        this.set('default', 'no');
                        this.set('value', 'no');
                        break;
                    case Argument.TYPES.int:
                    case Argument.TYPES.float:
                        this.set('default', 0);
                        this.set('value', 0);
                        break;
                    case Argument.TYPES.file:
                    case Argument.TYPES.string:
                    case Argument.TYPES.qstring:
                        this.set('default', '');
                        this.set('value', '');
                        break;
                    case Argument.TYPES.enum:
                        break;
                    default:
                        throw new Error('No default value for type "' + type + '"');
                }
            }
        }

        // EmberValidations has an init method, so make sure it gets called,
        // but make sure it gets called after we save the validations schema to
        // the `_validations` property
        this._super();
    },

    copy: function () {
        return Argument.create({
            type: this.get('type'),
            values: this.get('values'),
            label: this.get('label'),
            'default': this.get('default'),
            many: this.get('many'),
            validations: this._validations
        });
    }
});

Argument.reopenClass({
    TYPES: Object.freeze({
        'int': 'int',
        'float': 'float',
        'file': 'file',
        'bool': 'bool',
        'string': 'string',
        'qstring': 'qstring',
        'enum': 'enum'
    })
});
