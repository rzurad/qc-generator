import Argument from './argument';

let FloatArgument;

export default FloatArgument = Argument.extend({
    type: 'float-argument',
    'default': 0,

    toString: function () {
        return Number(this.get('value')).toFixed(8).replace(/\.?0+$/, '');
    },

    validations: {
        value: { presence: true, numericality: true }
    }
});
