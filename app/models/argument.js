import Ember from 'ember';
import EmberValidations from 'ember-validations';

let Argument;

export default Argument = Ember.Object.extend(Ember.Copyable, EmberValidations.Mixin, {
    type: 'argument',
    value: null,
    allowedValues: null,
    label: 'Unnamed Argument',
    'default': null,

    validations: {
        value: { presence: true }
    },

    // TODO: It may make more sense for `many` to be on Command models instead of Argument models
    many: false,

    init: function () {
        // If there is an inclusion validator, build the allowedValues label/value hash array
        // so that we can set them as either [{ label: 'X Value', value: 'X' }] or ['X']
        let inclusion = this.get('validations.value.inclusion.in');

        if (inclusion) {
            let allowedValues = [];
            let inclusionValues = [];

            inclusion.forEach(function (element, index) {
                if (typeof element === 'object') {
                    inclusionValues[index] = element.value;
                    allowedValues.push({ label: element.label, value: element.value });
                } else {
                    inclusionValues[index] = element;
                    allowedValues.push({ label: element, value: element });
                }
            });

            this.set('validations.value.inclusion.in', inclusionValues);
            this.set('allowedValues', allowedValues);
        }

        // If a validations object was specified on create, merge it with the default validations
        // object defined on the instance.
        let baseValidations = this.constructor.prototype.validations;
        let validations = this.get('validations');

        if (validations !== baseValidations) {
            validations = Ember.$.extend(true, {}, baseValidations, validations);

            this.set('validations', validations);
        }

        // EmberValidations will clobber the validations object that you pass into the
        // `create` function, so in order to preserve it for potential object cloning later, we'll tack it onto
        // the created object afterwords as an implied private property
        this._validations = validations;

        // If there is no value specified and there is a default, set the value to the default value
        if (this.get('value') === null) {
            let def = this.get('default');

            if (def !== null && def !== void 0) {
                this.set('value', def);
            }
        }

        // EmberValidations has an init method, so make sure it gets called,
        // but make sure it gets called after we save the validations schema to
        // the `_validations` property
        this._super();
    },

    copy: function () {
        return this.constructor.create({
            value: this.get('value'),
            label: this.get('label'),
            'default': this.get('default'),
            validations: this._validations,
            allowedValues: this.get('allowedValues'),
            many: this.get('many')
        });
    },

    toString: function () {
        return String(this.get('value'));
    }
});
