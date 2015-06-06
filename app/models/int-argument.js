import Argument from './argument';

let IntArgument;

export default IntArgument = Argument.extend({
    type: 'int-argument',
    'default': 0,

    validations: {
        value: { presence: true, numericality: { onlyInteger: true } }
    },

    toString: function () {
        let value = Number(this.get('value')).toFixed(0);

        if (this.get('isKeyValue')) {
            value = [this.get('label'), value].join(' ');
        }

        return value;
    }
});
