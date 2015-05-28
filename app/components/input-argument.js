import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['argument'],
    classNameBindings: ['argument.type', 'isInvalid'],
    argument: null,
    value: '',

    // Has the user interacted with this input field yet?
    isTouched: false,

    isInvalid: function () {
        return this.get('isTouched') && !this.get('argument.isValid');
    }.property('argument.isValid', 'isTouched'),

    onInit: function () {
        this.set('value', String(this.get('argument.value')));
    }.on('init'),

    onValueChange: function () {
        let value = this.get('value');

        if (value) {
            this.set('argument.value', value.trim());
            this.validateArgument();
        }
    }.observes('value'),

    validateArgument: function () {
        let instance = this;

        instance.get('argument').validate().finally(function () {
            instance.sendAction('validation');
        });
    },

    change: function (e) {
        let $target = Ember.$(e.target);

        if ($target.is('input[type="file"]') && e.target.files.length) {
            this.set('argument.value', '<subdirectory>\\' + e.target.files[0].name);
        }
    },

    actions: {
        add: function () {
            this.sendAction('add', this.get('argument'));
        },

        remove: function () {
            this.sendAction('remove', this.get('argument'));
        },

        blur: function () {
            this.validateArgument();

            if (!this.get('isTouched')) {
                this.set('isTouched', true);
            }
        }
    }
});
