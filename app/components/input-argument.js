import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['argument'],
    classNameBindings: ['argument.type', 'isInvalid'],
    value: '',

    // Has the user interacted with this input field yet?
    isTouched: false,

    isInvalid: function () {
        return this.get('isTouched') && !this.get('argument.isValid');
    }.property('argument.isValid', 'isTouched'),

    onValueChange: function () {
        this.set('argument.value', this.get('value').trim());
        this.validateArgument();
    }.observes('value'),

    validateArgument: function () {
        var instance = this,
            argument = instance.get('argument');

        argument.validate().finally(function () {
            instance.sendAction('validation');
        });
    },

    change: function (e) {
        var $target = Ember.$(e.target);

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
