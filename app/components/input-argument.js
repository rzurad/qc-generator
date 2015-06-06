import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['argument'],
    classNameBindings: ['argument.type', 'isInvalid'],
    argument: null,
    value: '',

    errors: function () {
        let value = this.get('argument.errors.value');

        return value ? value.join(', ') : '';
    }.property('argument.errors.value', 'argument.errors.value.@each'),

    // Has the user interacted with this input field yet?
    isTouched: false,
    isInputFocused: false,
    showErrorTooltip: false,

    onErrorTooltipConditionChange: function () {
        Ember.run.scheduleOnce('afterRender', this, this.checkErrorTooltip);
    }.observes('isInvalid', 'isInputFocused'),

    isInvalid: function () {
        return this.get('isTouched') && !this.get('argument.isValid');
    }.property('argument.isValid', 'isTouched'),

    onShowInitValidationErrorsChange: function () {
        this.set('isTouched', true);
    }.observes('showInitValidationErrors'),

    requestValidation: function () {
        this.set('isTouched', true);
        this.sendAction('validate', this.get('argument'));
    },

    onInit: function () {
        this.set('value', String(this.get('argument.value')));
    }.on('init'),

    onValueChange: function () {
        try {
            this.set('argument.value', this.get('value').trim());
        } catch (e) {}

        if (this.get('isTouched')) {
            this.requestValidation();
        }
    }.observes('value'),

    checkErrorTooltip: function () {
        let current = this.get('showErrorTooltip'),
            computed = this.get('isInvalid') && this.get('isInputFocused');
            
        if (current !== computed) {
            let str = computed ? 'show' : 'hide';

            this.set('showErrorTooltip', computed);
            Ember.$(this.get('element')).find('.error-tooltip-anchor').tooltip(str);
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
            this.requestValidation();
            this.set('isInputFocused', false);
        },

        focus: function () {
            this.set('isInputFocused', true);
        }
    },

    change: function (e) {
        let $target = Ember.$(e.target);
        this.set('isTouched', true);

        if ($target.is('input[type="file"]') && e.target.files.length) {
            this.set('value', e.target.files[0].name);
        } else {
            this.set('value', Ember.$(e.target).val());
        }
    },

    keyDown: function () {
        this.set('isTouched', true);
    }
});
