import Ember from 'ember';
import { factory, TYPES } from '../models/commands';

export default Ember.Component.extend({
    classNames: ['script-builder'],
    commands: [factory(TYPES.$modelname)],

    push: function (command) {
        this.get('commands').push(command || { hi: 'there' });
    }
});
