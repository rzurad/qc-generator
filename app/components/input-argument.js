import Ember from 'ember';
import Argument from '../models/argument';

export default Ember.Component.extend({
    classNames: ['argument'],
    classNameBindings: ['argument.type', 'isInvalid', 'argument.isKeyValue'],
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

    isInvalid: function () {
        return this.get('isTouched') && !this.get('argument.isValid');
    }.property('argument.isValid', 'isTouched'),

    requestValidation: function () {
        this.set('isTouched', true);
        this.sendAction('validate', this.get('argument'));
    },

    onInit: function () {
        if (this.get('argument') instanceof Argument) {
            this.set('value', String(this.get('argument.value')));
        }
    }.on('init'),

/* ========= */
    onValueChange: function () {
        try {
            this.set('argument.value', this.get('value').trim());
        } catch (e) {}

        if (this.get('isTouched')) {
            this.requestValidation();
        }
    }.observes('value'),

    onErrorTooltipConditionChange: function () {
        Ember.run.scheduleOnce('afterRender', this, this.checkErrorTooltip);
    }.observes('isInvalid', 'isInputFocused'),

    onShowInitValidationErrorsChange: function () {
        this.set('isTouched', true);
    }.observes('showInitValidationErrors'),

    checkErrorTooltip: function () {
        let current = this.get('showErrorTooltip'),
            computed = this.get('isInvalid') && this.get('isInputFocused');

        if (current !== computed) {
            let str = computed ? 'show' : 'hide';

            this.set('showErrorTooltip', computed);
            Ember.$(this.get('element')).find('.error-tooltip-anchor').tooltip(str);
        }
    },
/* -------- */

    actions: {
        add: function () {
            this.sendAction('add', this.get('argument'));
        },

        remove: function () {
            this.sendAction('remove', this.get('argument'));
        },

        // TODO: acceptance test
        blur: function () {
            this.requestValidation();
            this.set('isInputFocused', false);
        },

        // TODO: acceptance test
        focus: function () {
            this.set('isInputFocused', true);
        }
    },

    // TODO: acceptance test
    change: function (e) {
        let $target = Ember.$(e.target);

        this.set('isTouched', true);

        if ($target.is('input[type="file"]') && e.target.files.length) {
            this.set('value', e.target.files[0].name);
        } else {
            this.set('value', $target.val());
        }
    },

    // TODO: acceptance test
    keyDown: function () {
        this.set('isTouched', true);
    }
});
