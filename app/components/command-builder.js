import Ember from 'ember';
import { htmlToText } from '../helpers/html-to-text';

export default Ember.Component.extend({
    tagName: 'li',
    classNames: ['command-builder'],
    classNameBindings: ['category', 'isValid::is-invalid'],
    command: null,
    commands: null,
    isContentEditable: false,
    isCommentVisible: false,
    isValid: true,

    category: function () {
        var cat = this.get('command.category');

        return cat && cat.toLowerCase();
    }.property('command'),

    onInit: function () {
        var comment = this.get('command.comment');

        // if there is a comment, enable contenteditable and stuff
        // the comment text into the editable div
        if (!!comment) {
            this.set('isContentEditable', !!comment);
            this.set('isCommentVisible', true);
        }
    }.on('init'),

    onIsCommentVisibleChange: function () {
        var comment = this.get('command.comment');

        if (this.get('isCommentVisible') && comment) {
            Ember.run.scheduleOnce('afterRender', this, function () {
                Ember.$(this.get('element')).find('.comment').text(comment.replace(/^\/\/\ /g, ''));
            });
        }
    }.observes('isCommentVisible'),

    focusOut: function (e) {
        var $target = Ember.$(e.target);

        if ($target.is('.comment') && !htmlToText($target.html())) {
            this.set('isContentEditable', false);
            this.set('command.comment', '');
        }
    },

    change: function (e) {
        var $target = Ember.$(e.target);

        if ($target.is('.command')) {
            this.sendAction('replace', this.get('command'), $target.val());
        }
    },

    keyUp: function (e) {
        var $target = Ember.$(e.target),
            text;

        if ($target.is('.comment')) {
            text = htmlToText($target.html());

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
            var clone = Ember.copy(arg);

            clone.set('value', clone.get('default'));
            this.get('command.args').pushObject(clone);
        },

        removeArg: function (arg) {
            var args = this.get('command.args'),
                idx = args.indexOf(arg);

            args.removeAt(idx);
        },

        validation: function () {
            this.set('isValid', this.get('command.args').every(function (arg) {
                return arg.get('isValid');
            }));
        }
    }
});
