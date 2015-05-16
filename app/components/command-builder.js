import Ember from 'ember';

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

        if ($target.is('.comment') && !$target.val().length) {
            this.set('showComment', false);
        }
    },

    actions: {
        showComment: function () {
            this.set('showComment', true);
        }
    }
});
