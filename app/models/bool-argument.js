import Argument from './argument';

let BoolArgument;

export default BoolArgument = Argument.extend({
    type: 'bool-argument',
    'default': 'yes',

    validations: {
        value: { inclusion: { in: ['yes', 'no'] } }
    },

    toString: function () {
        return this.get('value') === 'yes' ? this.get('label') : '';
    }
});
