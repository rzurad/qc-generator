import Ember from 'ember';

export default Ember.View.extend({
    classNames: ['application'],

    onInit: function () {
        Ember.$('body').tooltip({
            selector: '[data-toggle="tooltip"]',
            html: true
        });
    }.on('init')
});
