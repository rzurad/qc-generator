import Argument from './argument';

let KeywordArgument;

export default KeywordArgument = Argument.extend({
    type: 'keyword-argument',
    'default': '',

    validations: {
        value: {
            presence: true,
            format: {
                with: /^([A-Za-z_][A-Za-z0-9_]*)$/,
                message: 'only letters, numbers and underscores. must begin with a letter'
            }
        }
    }
});
