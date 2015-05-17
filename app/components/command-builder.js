import Ember from 'ember';
import { htmlToText } from '../helpers/html-to-text';
import { CMD_TYPES } from '../models/commands';

export default Ember.Component.extend({
    tagName: 'li',
    classNames: ['command-builder'],
    classNameBindings: ['category'],
    command: null,
    args: [],
    commandKeys: Object.keys(CMD_TYPES),
    isContentEditable: false,
    isCommentVisible: false,

    category: function () {
        return this.get('command.category');
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
        }
    }
});
