import Ember from 'ember';
import { htmlToText } from '../helpers/html-to-text';
import { TYPES, factory as commandFactory } from '../models/commands';

export default Ember.Component.extend({
    classNames: ['command-builder'],
    command: null,
    args: [],
    commandKeys: Object.keys(TYPES),
    showComment: false,

    onShowCommentChange: function () {
        if (this.get('showComment')) {
            Ember.run.scheduleOnce('afterRender', this, function () {
                Ember.$(this.get('element')).find('.comment').focus();
            });
        }
    }.observes('showComment'),

    focusOut: function (e) {
        var $target = Ember.$(e.target);

        if ($target.is('.comment') && !htmlToText($target.html())) {
            this.set('showComment', false);
        }
    },

    change: function (e) {
        var $target = Ember.$(e.target);

        if ($target.is('.command')) {
            this.set('command', commandFactory($target.val()));
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
        showComment: function () {
            this.set('showComment', true);
        }
    }
});
