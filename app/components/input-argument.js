import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['argument'],
    classNameBindings: ['argument.type'],
    value: '',

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
        }
    }
});
