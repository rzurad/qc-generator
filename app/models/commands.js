import Ember from 'ember';
import config from '../config/environment';

var COMMANDS = {
        $modelname: {
            comment: '// Generated by http://blackmesasource.com/qc v' + config.version,
            cmd: '$modelname',
            required: true,
            args: ['file'],
            link: 'https://developer.valvesoftware.com/wiki/$modelname',
            help: 'Specifies the path and filename of the compiled model, relative to the <code>\\models</code> folder of the <a href="https://developer.valvesoftware.com/wiki/Game_Directory" target="_blank">Game Directory</a>.'
        },
        $staticprop: {
            cmd: '$staticprop',
            args: [],
            link: 'https://developer.valvesoftware.com/wiki/$staticprop',
            help: 'Specifies that the model being compiled does not have any moving parts.'
        }
    };

export const TYPES = (function () {
    var keys = {};

    Object.keys(COMMANDS).forEach(function (key) {
        keys[key] = key;
    });

    return keys;
}());

export function factory(command) {
    if (!(command in COMMANDS)) {
        throw new Error('Unrecognized command: "' + command + '"');
    }

    let ret = Ember.Object.create(COMMANDS[command]);

    return ret;
}

export default factory;
