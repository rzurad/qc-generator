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

    requestValidation: function () {
        this.set('isTouched', true);
        this.sendAction('validate', this.get('argument'));
    },

    onInit: function () {
        this.set('value', String(this.get('argument.value')));
    }.on('init'),

    onValueChange: function () {
        let value = this.get('value');

        if (this.get('isTouched')) {
            this.set('argument.value', value.trim());
            this.requestValidation();
        }
    }.observes('value'),

    actions: {
        add: function () {
            this.sendAction('add', this.get('argument'));
        },

        remove: function () {
            this.sendAction('remove', this.get('argument'));
        },

        blur: function () {
            this.requestValidation();
        }
    },

    change: function (e) {
        let $target = Ember.$(e.target);

        if ($target.is('input[type="file"]') && e.target.files.length) {
            this.set('argument.value', '<subdirectory>\\' + e.target.files[0].name);
        } else {
            this.set('argument.value', Ember.$(e.target).val());
        }
    },

    keyDown: function () {
        this.set('isTouched', true);
    }
});
