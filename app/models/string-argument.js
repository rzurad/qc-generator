import Argument from './argument';

let StringArgument;

export default StringArgument = Argument.extend({
    type: 'string-argument',
    default: '',

    validations: {
        value: { presence: true }
    },

    toString: function () {
        let value = '"' + String(this.get('value')).replace('"', '\\"') + '"';

        if (this.get('isKeyValue')) {
            value = [this.get('label'), value].join(' ');
        }

        return value;
    }
});
