import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['script-builder'],
    commands: [{ bullshit: 'bullshit' }],

    push: function (command) {
        this.get('commands').push(command || { hi: 'there' });
    }
});
