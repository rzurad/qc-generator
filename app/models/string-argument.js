import Argument from './argument';

let StringArgument;

export default StringArgument = Argument.extend({
    type: 'string-argument',
    'default': '',

    toString: function () {
        return '"' + String(this.get('value')).replace('"', '\\"') + '"';
    },

    validations: {
        value: { presence: true }
    }
});
