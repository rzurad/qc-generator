import Argument from './argument';

let IntArgument;

export default IntArgument = Argument.extend({
    type: 'int-argument',
    'default': 0,

    toString: function () {
        return Number(this.get('value')).toFixed(0);
    },

    validations: {
        value: { presence: true, numericality: { onlyInteger: true } }
    }
});
