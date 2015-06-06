import Ember from 'ember';
import htmlToText from '../utils/html-to-text';

export default Ember.Component.extend({
    tagName: 'li',
    classNames: ['command-builder'],
    classNameBindings: ['category', 'isInvalid'],
    command: null,
    commands: null,
    isContentEditable: false,
    isCommentVisible: false,

    category: function () {
        let cat = this.get('command.category');

        return cat && cat.toLowerCase();
    }.property('command'),

    // Used for telling child input-argument components that they should not
    // suppress the fact that an argument is inValid upon creation
    showInitValidationErrors: false,
    isInvalid: false,

    onValidationTrigger: function () {
        this.set('showInitValidationErrors', true);
        this.checkInvalidClasses();
    }.observes('validationTrigger'),

    checkInvalidClasses: function () {
        Ember.run.scheduleOnce('afterRender', this, function () {
            this.set('isInvalid', !!Ember.$(this.get('element')).find('.is-invalid').length);
        });
    },

    onCommandChange: function () {
        this.set('showInitValidationErrors', false);
        this.set('isInvalid', false);
    }.observes('command', 'command.cmd'),

    onInit: function () {
        let comment = this.get('command.comment');

        // if there is a comment, enable contenteditable and stuff
        // the comment text into the editable div
        if (comment) {
            this.set('isContentEditable', !!comment);
            this.set('isCommentVisible', true);
        }
    }.on('init'),

    onIsCommentVisibleChange: function () {
        let comment = this.get('command.comment');

        if (this.get('isCommentVisible') && comment) {
            Ember.run.scheduleOnce('afterRender', this, function () {
                Ember.$(this.get('element')).find('.comment').text(comment.replace(/^\/\/\ /g, ''));
            });
        }
    }.observes('isCommentVisible'),

    focusOut: function (e) {
        let $target = Ember.$(e.target);

        if ($target.is('.comment') && !htmlToText($target.html())) {
            this.set('isContentEditable', false);
            this.set('command.comment', '');
        }
    },

    change: function (e) {
        let $target = Ember.$(e.target);

        if ($target.is('.command')) {
            this.sendAction('replace', this.get('command'), $target.val());
        }
    },

    keyUp: function (e) {
        let $target = Ember.$(e.target);

        if ($target.is('.comment')) {
            let text = htmlToText($target.html());

            // just straight newlines here, because we're still in-browser
            text = text.split('\n').map(function (line) { return '// ' + line; }).join('\n');

            this.set('command.comment', text);
        }
    },

    actions: {
        addComment: function () {
            this.set('isContentEditable', true);

            Ember.run.scheduleOnce('afterRender', this, function () {
                Ember.$(this.get('element')).find('.comment').focus();
            });
        },

        toggleComment: function () {
            this.toggleProperty('isCommentVisible');
        },

        deleteCommand: function () {
            this.sendAction('delete', this.get('command'));
        },

        help: function () {
            window.open(this.get('command.link'));
        },

        duplicateArg: function (arg) {
            let clone = Ember.copy(arg);

            clone.set('value', clone.get('default'));
            this.get('command.args').pushObject(clone);
        },

        removeArg: function (arg) {
            let args = this.get('command.args'),
                idx = args.indexOf(arg);

            args.removeAt(idx);
            this.checkInvalidClasses();
        },

        validateArgument: function (arg) {
            let _this = this;

            arg.validate().catch(Ember.K).finally(() => {
                _this.checkInvalidClasses();
            });
        }
    }
});
