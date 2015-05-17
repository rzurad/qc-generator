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
    }
});
