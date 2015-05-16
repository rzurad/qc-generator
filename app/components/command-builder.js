import Ember from 'ember';
import { htmlToText } from '../helpers/html-to-text';

var COMMANDS = {
        '$modelname': ['file'],
        '$staticprop': []
    };

export default Ember.Component.extend({
    classNames: ['command-builder'],
    command: null,
    commandKeys: Object.keys(COMMANDS),
    comment: '',
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

    keyUp: function (e) {
        var $target = Ember.$(e.target),
            text;

        if ($target.is('.comment')) {
            text = htmlToText($target.html());
            text = text.split('\n').map(function (line) { return '// ' + line; }).join('\n');

            this.set('comment', text);
        }
    },

    actions: {
        showComment: function () {
            this.set('showComment', true);
        }
    }
});
