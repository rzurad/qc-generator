import Argument from './argument';

let FloatArgument;

export default FloatArgument = Argument.extend({
    type: 'float-argument',
    default: 0,

    validations: {
        value: { presence: true, numericality: true }
    },

    toString: function () {
        let value = Number(this.get('value')).toFixed(8).replace(/\.?0+$/, '');

        if (this.get('isKeyValue')) {
            value = [this.get('label'), value].join(' ');
        }

        return value;
    }
});
