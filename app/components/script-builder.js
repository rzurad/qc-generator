import Ember from 'ember';
import { commandFactory, CMD_TYPES } from '../models/commands';

export default Ember.Component.extend({
    classNames: ['script-builder'],
    commands: [commandFactory(CMD_TYPES.$modelname)],
});
